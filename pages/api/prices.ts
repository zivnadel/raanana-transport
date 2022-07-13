import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../lib/mongodb'

import Cors from 'cors'

const getPrices = async () => {
  try {
    const { db } = await connectToDatabase()
    const prices = await db.collection('prices').find().toArray()
    return prices[0]
  } catch (error: any) {
    throw new Error(error)
  }
}

const putPrices = async (prices: string) => {
  try {
    const { db } = await connectToDatabase()
    const response = await db.collection('prices').replaceOne({}, JSON.parse(prices))
    return response
  } catch (error: any) {
    throw new Error(error)
  }
}

const cors = Cors({
  origin: process.env.WEBSITE_URL,
})

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: typeof cors
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors)

  switch (req.method) {
    case 'GET':
      const prices = await getPrices().catch((error) =>
        res.status(500).json({ errorMessage: error.message })
      )
      return res.status(200).json({ prices })

    case 'PUT':
      const response = await putPrices(req.body).catch((error) => {
        res.status(500).json({ errorMessage: error.message })
      })
      return res.status(200).json({ response })
  }
}
