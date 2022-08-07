import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

import Cors from "cors";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const getPrices = async () => {
	try {
		const db = (await clientPromise).db();
		const prices = await db
			.collection("prices")
			.find({}, { projection: { _id: 0 } })
			.toArray();
		return prices[0];
	} catch (error: any) {
		throw new Error(error);
	}
};

const putPrices = async (prices: string) => {
	try {
		const db = (await clientPromise).db();
		const response = await db
			.collection("prices")
			.replaceOne({}, JSON.parse(prices));
		return response;
	} catch (error: any) {
		throw new Error(error);
	}
};

const cors = Cors({
	origin: process.env.VERCEL_URL,
});

function runMiddleware(
	req: NextApiRequest,
	res: NextApiResponse,
	fn: typeof cors
) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}
			return resolve(result);
		});
	});
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await unstable_getServerSession(req, res, authOptions);

	if (!session) {
		res.status(401).json({
			message: "You must be logged in and authorized to access this resource!",
		});
		return;
	}

	await runMiddleware(req, res, cors);

	switch (req.method) {
		case "GET":
			const prices = await getPrices().catch((error) =>
				res.status(500).json({ message: error.message })
			);
			return res.status(200).json(prices);

		case "PUT":
			const response = await putPrices(req.body).catch((error) => {
				res.status(500).json({ message: error.message });
			});
			return res.status(201).json({ response });
		default: {
			return res
				.status(405)
				.end(`Method ${req.method} doesn't exist or it is not allowed.`);
		}
	}
}
