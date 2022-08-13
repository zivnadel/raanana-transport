import Cors from "cors";
import { AnyBulkWriteOperation, Db, Document } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import clientPromise from "../../lib/mongodb";
import DateObjectType, { busType } from "../../types/DateObjectType";
import DayObjectType from "../../types/DayObjectType";
import PricesObjectType from "../../types/PricesObjectType";
import PupilObjectType from "../../types/PupilObjectType";
import { calculateBusType, calculatePrice } from "../../utils/dateUtils";
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

const populateDate = (
	date: DateObjectType,
	pupils: PupilObjectType[],
	prices: PricesObjectType
) => {
	for (let pupil of pupils) {
		const scheduleDay = pupil.schedule.find((day) => day.day === date.day);
		if (scheduleDay) {
			for (let hour of scheduleDay.hours) {
				const indexHour: keyof typeof date.transportations =
					hour as keyof typeof date.transportations;
				if (date.transportations[indexHour]?.pupils) {
					date.transportations[indexHour]?.pupils.push(pupil.name);
				} else {
					date.transportations[indexHour] = {
						pupils: [pupil.name],
						price: 0,
						busType: [],
					};
				}
			}
		}
	}
	let hour: keyof typeof date.transportations;
	for (hour in date.transportations) {
		let busTypes: busType[];
		if (hour === "morning") {
			busTypes = [busType.morning];
		} else {
			busTypes = calculateBusType(date.transportations[hour]!.pupils.length);
		}
		date.transportations[hour]!.busType = busTypes;
		date.transportations[hour]!.price = calculatePrice(busTypes, prices);
	}
};

const updateSchedule = async (week: DayObjectType[], db: Db) => {
	try {
		const daysArray = week.map((day) => day.day);

		let datesToUpdate = await db
			.collection<DateObjectType>("dates")
			.find({ day: { $in: daysArray } })
			.toArray();

		const hours: ("morning" | "15:30" | "17:00")[] = [
			"morning",
			"15:30",
			"17:00",
		];

		let pupils: PupilObjectType[] | null = null;
		let prices: PricesObjectType | null = null;

		let bulkData: AnyBulkWriteOperation<DateObjectType | Document>[] = [];

		for (let date of datesToUpdate) {
			for (let weekDay of week) {
				if (date.day === weekDay.day) {
					for (let hour of hours) {
						if (!weekDay.hours.includes(hour) && date.transportations[hour]) {
							// need to remove hour
							delete date.transportations[hour];
						}
						if (weekDay.hours.includes(hour) && !date.transportations[hour]) {
							// need to add hour
							if (!pupils) {
								pupils = await db
									.collection<PupilObjectType>("pupils")
									.find({})
									.toArray();
							}

							if (!prices) {
								prices = await db
									.collection<PricesObjectType>("prices")
									.findOne({});
							}

							populateDate(date, pupils, prices!);
						}
					}
				}
			}
			bulkData.push({
				updateOne: {
					filter: { _id: date._id },
					update: {
						$set: {
							transportations: date.transportations,
							totalAmount:
								(date.transportations.morning?.price || 0) +
								(date.transportations["15:30"]?.price || 0) +
								(date.transportations["17:00"]?.price || 0),
						},
					},
				},
			});
		}

		const response = await db.collection("dates").bulkWrite(bulkData);
		return response;
	} catch (error: any) {
		throw new Error(error);
	}
};

const updateWeek = async (data: string) => {
	try {
		const week = JSON.parse(data) as DayObjectType[];

		const db = (await clientPromise).db();

		const bulkData: AnyBulkWriteOperation<DayObjectType | Document>[] =
			week.map((day) => {
				return {
					updateOne: {
						filter: { day: day.day },
						update: {
							$set: {
								hours: day.hours,
							},
						},
					},
				};
			});

		let response = await db.collection("week").bulkWrite(bulkData);

		if (response.isOk()) {
			response = await updateSchedule(week, db);
		}

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

	if (!session && req.method !== "GET") {
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
