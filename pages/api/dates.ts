import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../lib/mongodb'

const getDates = async (day: string | undefined) => {
  try {
    const { db } = await connectToDatabase()
    if (day) {
      const date = await db.collection('dates').findOne({ day: parseInt(day) })
      return date
    } else {
      const dates = await db.collection('dates').find()
      return dates
    }
  } catch (error: any) {
    throw new Error(error)
  }
}

const addDate = async (newDate: any) => {
  try {
    const { db } = await connectToDatabase()
    const response = await db.collection('dates').insertOne(newDate)
    console.log('Data inserted')
    return response
  } catch (error: any) {
    throw new Error(error)
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET': {
      const { date } = req.query
      console.log(date.toString());
      const dates = await getDates(date.toString())
      return res.status(200).json({ dates })
    }
    case 'POST': {
      const response = await addDate(req.body)
      res.status(200).json({ response })
    }
    default: {
      res
        .status(405)
        .end(`Method ${req.method} doesn't exist or it is not allowed.`)
    }
  }
}
