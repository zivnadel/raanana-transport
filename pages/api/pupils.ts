import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import Cors from "cors";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import PupilObjectType from "../../types/PupilObjectType";
import DateObjectType, { busType } from "../../types/DateObjectType";
import { toDate } from "../../utils/dateUtils";
import { Db } from "mongodb";
import PricesObjectType from "../../types/PricesObjectType";

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

// TODO: FIX THAT
// const calculateBusType = (numOfPupils: number): busType[] => {
// 	if (numOfPupils <= 0) {
// 		return [];
// 	} else if (numOfPupils > 0 && numOfPupils <= 8) {
// 		return [busType.p8];
// 	} else if (numOfPupils > 8 && numOfPupils <= 16) {
// 		return [busType.p16];
// 	} else if (numOfPupils > 16 && numOfPupils <= 20) {
// 		return [busType.p20];
// 	} else if (numOfPupils > 20 && numOfPupils <= 23) {
// 		return [busType.p23];
// 	} else {
// 		return [busType.p23, ...calculateBusType(numOfPupils - 23)];
// 	}
// };

// const calculatePrice = async (
// 	busTypes: busType[],
// 	prices: PricesObjectType
// ) => {
// 	try {
// 		let price = 0;
// 		busTypes.map((type) => {
// 			switch (type) {
// 				case busType.morning:
// 					price += prices.morning;
// 					break;
// 				case busType.p8:
// 					price += prices.p8;
// 					break;
// 				case busType.p16:
// 					price += prices.p16;
// 					break;
// 				case busType.p20:
// 					price += prices.p20;
// 					break;
// 				case busType.p23:
// 					price += prices.p23;
// 					break;
// 			}
// 		});
// 		return price;
// 	} catch (error: any) {
// 		throw new Error(error);
// 	}
// };

// const updateSchedule = async (stringifiedPupil: string) => {
// 	try {
// 		const pupil = JSON.parse(stringifiedPupil) as PupilObjectType;

// 		const db = (await clientPromise).db();

// 		const datesToUpdate = await db
// 			.collection<DateObjectType>("dates")
// 			.find({})
// 			.toArray();

// 		const prices = (
// 			await db.collection<PricesObjectType>("prices").find({}).toArray()
// 		)[0];

// 		datesToUpdate.map((date) => {
// 			pupil.schedule.map(async (scheduleDay) => {
// 				if (date.day === scheduleDay.day) {
// 					scheduleDay.hours.map(async (hour) => {
// 						switch (hour) {
// 							case "morning":
// 								date.transportations.morning.pupils.push(pupil.name);
// 							case "15:30":
// 								date.transportations["15:30"].pupils.push(pupil.name);

// 								date.transportations["15:30"].busType = calculateBusType(
// 									date.transportations["15:30"].pupils.length + 1
// 								);
// 								date.transportations["15:30"].price = await calculatePrice(
// 									date.transportations["15:30"].busType,
// 									prices
// 								);
// 							case "17:00":
// 								date.transportations["17:00"].pupils.push(pupil.name);

// 								date.transportations["17:00"].busType = calculateBusType(
// 									date.transportations["17:00"].pupils.length + 1
// 								);
// 								date.transportations["17:00"].price = await calculatePrice(
// 									date.transportations["17:00"].busType,
// 									prices
// 								);
// 						}
// 					});
// 				} else {
// 					if (date.transportations.morning.pupils.includes(pupil.name)) {
// 						date.transportations.morning.pupils =
// 							date.transportations.morning.pupils.filter(
// 								(pupilName) => pupilName !== pupil.name
// 							);
// 					} else if (
// 						date.transportations["15:30"].pupils.includes(pupil.name)
// 					) {
// 						date.transportations["15:30"].pupils = date.transportations[
// 							"15:30"
// 						].pupils.filter((pupilName) => pupilName !== pupil.name);
// 						date.transportations["15:30"].busType = calculateBusType(
// 							date.transportations["15:30"].pupils.length - 1
// 						);
// 						date.transportations["15:30"].price = await calculatePrice(
// 							date.transportations["15:30"].busType,
// 							prices
// 						);
// 					} else if (
// 						date.transportations["17:00"].pupils.includes(pupil.name)
// 					) {
// 						date.transportations["17:00"].pupils = date.transportations[
// 							"17:00"
// 						].pupils.filter((pupilName) => pupilName !== pupil.name);
// 						date.transportations["17:00"].busType = calculateBusType(
// 							date.transportations["17:00"].pupils.length - 1
// 						);
// 						date.transportations["17:00"].price = await calculatePrice(
// 							date.transportations["17:00"].busType,
// 							prices
// 						);
// 					}
// 				}
// 			});
// 			date.totalAmount =
// 				date.transportations.morning.price +
// 				date.transportations["15:30"].price +
// 				date.transportations["17:00"].price;
// 		});

// 		const bulkData = datesToUpdate.map((date) => ({
// 			replaceOne: {
// 				upsert: true,
// 				filter: { _id: date._id },
// 				replacement: { date },
// 			},
// 		}));

// 		const response = await db.collection("dates").bulkWrite(bulkData);
// 		return response;
// 	} catch (error: any) {
// 		throw new Error(error);
// 	}
// };

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
			// await updateSchedule(req.body);
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
