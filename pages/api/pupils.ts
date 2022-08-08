import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import Cors from "cors";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import PupilObjectType from "../../types/PupilObjectType";
import DateObjectType from "../../types/DateObjectType";
import { calculateBusType, calculatePrice } from "../../utils/dateUtils";
import PricesObjectType from "../../types/PricesObjectType";
import { AnyBulkWriteOperation, Db, Document } from "mongodb";

const getPupil = async (name?: string | string[]) => {
	try {
		const db = (await clientPromise).db();
		let response;
		if (name) {
			response = db
				.collection("pupils")
				.findOne({ name }, { projection: { _id: 0 } });
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
		const data = JSON.parse(pupil);
		const response = await db.collection("pupils").insertOne(data);
		if (response.acknowledged) {
			await updateSchedule("add", db, data);
		}
		return { status: "Success" };
	} catch (error: any) {
		throw new Error(error);
	}
};

const updatePupil = async (pupil: string) => {
	try {
		const data = JSON.parse(pupil) as PupilObjectType;
		const db = (await clientPromise).db();
		const response = await db
			.collection("pupils")
			.updateOne({ name: data.name }, { $set: { schedule: data.schedule } });
		if (response.acknowledged) {
			await updateSchedule("edit", db, data);
		}
		return { status: "Success" };
	} catch (error: any) {
		throw new Error(error);
	}
};

const deletePupil = async (body: string) => {
	try {
		const { name } = JSON.parse(body) as { name: string };
		const db = (await clientPromise).db();
		const pupil = await db
			.collection<PupilObjectType>("pupils")
			.findOne({ name });
		const deleteResponse = await db.collection("pupils").deleteOne({ name });
		if (deleteResponse.deletedCount > 0) {
			await updateSchedule("delete", db, pupil!);
		}
		return { status: "Success", deletedCount: deleteResponse.deletedCount };
	} catch (error: any) {
		throw new Error(error);
	}
};

const addPupilToSchedule = (
	dates: DateObjectType[],
	pupil: PupilObjectType,
	prices: PricesObjectType
) => {
	const schedule = pupil.schedule;
	dates.map((date) => {
		schedule.map((scheduleDay) => {
			if (date.day === scheduleDay.day) {
				scheduleDay.hours.map((hour) => {
					switch (hour) {
						case "morning":
							const morning = date.transportations.morning;
							if (morning && !morning.pupils.includes(pupil.name)) {
								morning.pupils.push(pupil.name);
							}
							break;
						case "15:30":
							const threeThirty = date.transportations["15:30"];
							if (threeThirty && !threeThirty.pupils.includes(pupil.name)) {
								threeThirty.pupils.push(pupil.name);
								threeThirty.busType = calculateBusType(
									threeThirty.pupils.length
								);
								threeThirty.price = calculatePrice(threeThirty.busType, prices);
							}
							break;
						case "17:00":
							const five = date.transportations["17:00"];
							if (five && !five.pupils.includes(pupil.name)) {
								five.pupils.push(pupil.name);
								five.busType = calculateBusType(five.pupils.length);
								five.price = calculatePrice(five.busType, prices);
							}
							break;
					}
				});
			}
			date.totalAmount =
				(date.transportations.morning
					? date.transportations.morning.price
					: 0) +
				(date.transportations["15:30"]
					? date.transportations["15:30"].price
					: 0) +
				(date.transportations["17:00"]
					? date.transportations["17:00"].price
					: 0);
		});
	});
	return dates;
};

const deletePupilFromSchedule = (
	dates: DateObjectType[],
	pupilName: string,
	prices: PricesObjectType
) => {
	dates.map((date) => {
		const morning = date.transportations.morning;
		const threeThirty = date.transportations["15:30"];
		const five = date.transportations["17:00"];

		if (morning && morning.pupils.includes(pupilName!)) {
			morning.pupils = morning.pupils.filter(
				(exisitingPupil) => exisitingPupil !== pupilName
			);
		}

		if (threeThirty && threeThirty.pupils.includes(pupilName!)) {
			threeThirty.pupils = threeThirty.pupils.filter(
				(exisitingPupil) => exisitingPupil !== pupilName
			);

			threeThirty.busType = calculateBusType(threeThirty.pupils.length);
			threeThirty.price = calculatePrice(threeThirty.busType, prices);
		}

		if (five && five.pupils.includes(pupilName!)) {
			five.pupils = five.pupils.filter(
				(exisitingPupil) => exisitingPupil !== pupilName
			);
			five.busType = calculateBusType(five.pupils.length);
			five.price = calculatePrice(five.busType, prices);
		}
		date.totalAmount =
			(date.transportations.morning ? date.transportations.morning.price : 0) +
			(date.transportations["15:30"]
				? date.transportations["15:30"].price
				: 0) +
			(date.transportations["17:00"] ? date.transportations["17:00"].price : 0);
	});
	return dates;
};

const updateSchedule = async (
	actionType: "delete" | "add" | "edit",
	db: Db,
	pupil: PupilObjectType
) => {
	try {
		const days = pupil?.schedule.map((scheduleDay) => scheduleDay.day);
		const dates = await db
			.collection<DateObjectType>("dates")
			.find({ day: { $in: days } })
			.toArray();
		const prices = (
			await db.collection<PricesObjectType>("prices").find({}).toArray()
		)[0];

		let datesToUpdate: DateObjectType[];

		switch (actionType) {
			case "add":
				datesToUpdate = addPupilToSchedule(dates, pupil!, prices);
				break;
			case "delete":
				datesToUpdate = deletePupilFromSchedule(dates, pupil!.name, prices);
				break;
			case "edit":
				const datesAfterDeletion = deletePupilFromSchedule(
					dates,
					pupil!.name,
					prices
				);
				datesToUpdate = addPupilToSchedule(datesAfterDeletion, pupil!, prices);
				break;
		}

		const bulkData: AnyBulkWriteOperation<DateObjectType | Document>[] =
			datesToUpdate.map((dateToUpdate) => {
				return {
					updateOne: {
						filter: { date: dateToUpdate.date },
						update: {
							$set: {
								transportations: dateToUpdate.transportations,
								totalAmount: dateToUpdate.totalAmount,
							},
						},
					},
				};
			});

		const response = await db.collection("dates").bulkWrite(bulkData);

		return response;

		// const ids = dates.map((date) => date._id);

		// const deleteResponse = await db
		// 	.collection<DateObjectType>("dates")
		// 	.deleteMany({ _id: { $in: ids } });

		// if (deleteResponse.deletedCount > 0) {
		// 	const response = await db.collection("dates").insertMany(datesToUpdate);
		// 	return response;
		// } else {
		// 	throw new Error("Error deleting documents!");
		// }
	} catch (error: any) {
		throw new Error(error);
	}
};

const getPupilsByDayAndHour = async (day: number, hour: string) => {
	const db = (await clientPromise).db();
	const pupils = await db
		.collection<PupilObjectType>("pupils")
		.find({ schedule: { $elemMatch: { day, hours: hour } } })
		.toArray();
	return pupils.map((pupil) => pupil.name);
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
	await runMiddleware(req, res, cors);

	const session = await unstable_getServerSession(req, res, authOptions);

	if (
		!session &&
		((req.method === "GET" && !req.query.pupilName) || req.method !== "GET")
	) {
		return res.status(401).json({
			message: "You must be logged in and authorized to access this resource!",
		});
	}

	switch (req.method) {
		case "GET": {
			const { pupilName, day, hour } = req.query;
			let response: any;
			if (pupilName) {
				response = await getPupil(pupilName).catch((error) => {
					return res.status(500).json({ message: error.message });
				});
			} else if (day && hour) {
				response = await getPupilsByDayAndHour(+day, hour.toString()).catch(
					(error) => {
						return res.status(500).json({ message: error.message });
					}
				);
			}

			return res.status(200).json(response);
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
			return res
				.status(405)
				.end(`Method ${req.method} doesn't exist or it is not allowed.`);
		}
	}
}
