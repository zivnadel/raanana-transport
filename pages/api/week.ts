import Cors from "cors";
import { AnyBulkWriteOperation, Document } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import clientPromise from "../../lib/mongodb";
import DayObjectType from "../../types/DayObjectType";
import { authOptions } from "./auth/[...nextauth]";

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

const getDays = async (day?: number) => {
	try {
		const db = (await clientPromise).db();

		let response: any;

		if (day) {
			if (day > 5 || day < 1) {
				throw new Error("Invalid query parameter!");
			}
			response = await db
				.collection<DayObjectType>("week")
				.findOne({ day }, { projection: { _id: 0 } });
		} else {
			response = await db
				.collection<DayObjectType[]>("week")
				.find({}, { projection: { _id: 0 } })
				.toArray();
		}
		return response;
	} catch (error: any) {
		throw new Error(error);
	}
};

const updateWeek = async (data: string) => {
	const week = JSON.parse(data) as DayObjectType[];

	const db = (await clientPromise).db();

	const bulkData: AnyBulkWriteOperation<DayObjectType | Document>[] = week.map(
		(day) => {
			return {
				updateOne: {
					filter: { day: day.day },
					update: {
						$set: {
							transportations: day.transportations,
						},
					},
				},
			};
		}
	);

	const response = await db.collection("week").bulkWrite(bulkData);
	return response;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await runMiddleware(req, res, cors);

	const session = await unstable_getServerSession(req, res, authOptions);

	if (!session) {
		return res.status(401).json({
			message: "You must be logged in and authorized to access this resource!",
		});
	}

	switch (req.method) {
		case "GET": {
			const { day } = req.query;
			let response: any;

			if (day) {
				response = await getDays(+day).catch((error) =>
					res.status(500).json({ message: error.message })
				);
			} else {
				response = await getDays().catch((error) =>
					res.status(500).json({ message: error.message })
				);
			}

			return res.status(200).json(response);
		}
		case "PATCH": {
			const response = await updateWeek(req.body).catch((error) => {
				return res.status(500).json({ message: error.message });
			});
			return res.status(200).json(response);
		}
		default: {
			return res
				.status(405)
				.end(`Method ${req.method} doesn't exist or it is not allowed.`);
		}
	}
}
