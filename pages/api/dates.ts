import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import Cors from "cors";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

// This function retrieves a date from the database.
// If no date was specified, it returns all dates.
const getDates = async (day: string | undefined) => {
	try {
		const db = (await clientPromise).db();
		if (day) {
			const date = await db.collection("dates").findOne({ day: parseInt(day) });
			return date;
		} else {
			const dates = await db.collection("dates").find();
			return dates;
		}
	} catch (error: any) {
		throw new Error(error);
	}
};

// This function adds a date to the database
const addDate = async (newDate: any) => {
	try {
		const db = (await clientPromise).db();
		const response = await db.collection("dates").insertOne(newDate);
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

// MongoDB Handler function
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await runMiddleware(req, res, cors);

	const session = await unstable_getServerSession(req, res, authOptions);

	if (!session) {
		res.status(401).json({
			message: "You must be logged in and authorized to access this resource!",
		});
		return;
	}

	switch (req.method) {
		case "GET": {
			const { date } = req.query;
			const dates = await getDates(date!.toString()).catch((error) =>
				res.status(500).json({ message: error.message })
			);
			return res.status(200).json({ dates });
		}
		case "POST": {
			const response = await addDate(req.body).catch((error) =>
				res.status(500).json({ message: error.message })
			);
			res.status(200).json({ response });
		}
		default: {
			res
				.status(405)
				.end(`Method ${req.method} doesn't exist or it is not allowed.`);
		}
	}
}
