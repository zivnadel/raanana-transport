import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import Cors from "cors";
import { unstable_getServerSession } from "next-auth";
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

const getPupil = async (name?: string | string[]) => {
	try {
		const db = (await clientPromise).db();
		let response;
		if (name) {
			response = db.collection("pupils").findOne({ name });
		} else {
			response = db.collection("pupils").findOne({});
		}
		return response;
	} catch (error: any) {
		throw new Error(error);
	}
};

const addPupil = async (pupil: string) => {
	try {
		const db = (await clientPromise).db();
		const response = await db.collection("pupils").insertOne(JSON.parse(pupil));
		return response;
	} catch (error: any) {
		throw new Error(error);
	}
};

const updatePupil = async (pupil: string) => {
	try {
		const data = JSON.parse(pupil);
		const db = (await clientPromise).db();
		const response = await db
			.collection("pupils")
			.updateOne({ name: data.name }, { $set: { schedule: data.schedule } });
		return response;
	} catch (error: any) {
		throw new Error(error);
	}
};

const deletePupil = async (body: string) => {
	try {
		const { name } = JSON.parse(body);
		const db = (await clientPromise).db();
		const response = await db.collection("pupils").deleteOne({ name });
		return response;
	} catch (error: any) {
		throw new Error(error);
	}
};

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
			const { pupilName } = req.query;
			const response = await getPupil(pupilName).catch((error) => {
				return res.status(500).json({ message: error.message });
			});
			return res.status(200).json({ response });
		}

		case "POST": {
			const response = await addPupil(req.body).catch((error) => {
				return res.status(500).json({ message: error.message });
			});
			return res.status(201).json({ response });
		}

		case "PATCH": {
			const response = await updatePupil(req.body).catch((error) => {
				return res.status(500).json({ message: error.message });
			});
			return res.status(200).json({ response });
		}

		case "DELETE": {
			const response = await deletePupil(req.body).catch((error) => {
				return res.status(500).json({ message: error.message });
			});
			return res.status(200).json({ response });
		}

		default: {
			res
				.status(405)
				.end(`Method ${req.method} doesn't exist or it is not allowed.`);
		}
	}
}
