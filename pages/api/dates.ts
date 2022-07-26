import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import Cors from "cors";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { produceYearArray, toNormalDateString } from "../../utils/dateUtils";
import DateObjectType, {
	busType,
	HourObjectType,
} from "../../types/DateObjectType";
import PupilObjectType from "../../types/PupilObjectType";
import PricesObjectType from "../../types/PricesObjectType";

// This function retrieves a date from the database.
// If no date was specified, it returns all dates.
const getDate = async (date: Date) => {
	try {
		const db = (await clientPromise).db();
		const dateData = await db
			.collection("dates")
			.findOne({ date: toNormalDateString(date) });
		return dateData;
	} catch (error: any) {
		throw new Error(error);
	}
};

const initiateYear = async () => {
	const calculateBusType = (numOfPupils: number): busType[] => {
		if (numOfPupils === 0) {
			return [];
		} else if (numOfPupils > 0 && numOfPupils <= 8) {
			return [busType.p8];
		} else if (numOfPupils > 8 && numOfPupils <= 16) {
			return [busType.p16];
		} else if (numOfPupils > 16 && numOfPupils <= 20) {
			return [busType.p20];
		} else if (numOfPupils > 20 && numOfPupils <= 23) {
			return [busType.p23];
		} else {
			return [busType.p23, ...calculateBusType(numOfPupils - 23)];
		}
	};

	const calculatePrice = (
		busTypes: busType[],
		prices: PricesObjectType
	): number => {
		let price = 0;
		busTypes.map((type) => {
			switch (type) {
				case busType.morning:
					price += prices.morning;
					break;
				case busType.p8:
					price += prices.p8;
					break;
				case busType.p16:
					price += prices.p16;
					break;
				case busType.p20:
					price += prices.p20;
					break;
				case busType.p23:
					price += prices.p23;
					break;
			}
		});
		return price;
	};

	try {
		// open DB connection
		const db = (await clientPromise).db();

		// retrieve all pupils
		const pupils = await db
			.collection<PupilObjectType>("pupils")
			.find({})
			.toArray();

		// returieve prices to calculate the prices
		const prices = (
			await db.collection<PricesObjectType>("prices").find({}).toArray()
		)[0];

		// initiate the year according to pupils information
		const dates = produceYearArray();
		const year = dates.map((rawDate): DateObjectType => {
			const date = new Date(rawDate);
			let morning: HourObjectType = { pupils: [], busType: [], price: 0 };
			let threeThirty: HourObjectType = { pupils: [], busType: [], price: 0 };
			let five: HourObjectType = { pupils: [], busType: [], price: 0 };

			pupils.map((pupil) => {
				pupil.schedule.map((scheduleDay) => {
					if (scheduleDay.day === date.getDay() + 1) {
						scheduleDay.hours.map((hour) => {
							switch (hour) {
								case "morning":
									if (!morning.pupils.includes(pupil.name)) {
										morning.pupils.push(pupil.name);
										break;
									}
								case "15:30":
									if (!threeThirty.pupils.includes(pupil.name)) {
										threeThirty.pupils.push(pupil.name);
										break;
									}
								case "17:00":
									if (!five.pupils.includes(pupil.name)) {
										five.pupils.push(pupil.name);
										break;
									}
							}
						});
					}
				});
			});

			morning.busType = [busType.morning];
			threeThirty.busType = calculateBusType(threeThirty.pupils.length);
			five.busType = calculateBusType(five.pupils.length);

			morning.price = calculatePrice(morning.busType, prices);
			threeThirty.price = calculatePrice(threeThirty.busType, prices);
			five.price = calculatePrice(five.busType, prices);

			return {
				date: toNormalDateString(date),
				day: date.getDay() + 1,
				transportations: {
					morning: morning,
					"15:30": threeThirty,
					"17:00": five,
				},
				totalAmount: morning.price + threeThirty.price + five.price,
			};
		});

		const deleteResponse = await db.collection("dates").deleteMany({});
		if (deleteResponse.acknowledged) {
			const response = await db.collection("dates").insertMany(year);
			return response;
		} else {
			throw new Error("Error deleting documents!");
		}
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
			const response = await getDate(new Date(date!.toLocaleString())).catch(
				(error) => res.status(500).json({ message: error.message })
			);
			return res.status(200).json({ response });
		}
		case "PUT": {
			const response = await initiateYear().catch((error) => {
				res.status(500).json({ message: error.message });
			});
			res.status(201).json({ response });
		}
		default: {
			res
				.status(405)
				.end(`Method ${req.method} doesn't exist or it is not allowed.`);
		}
	}
}
