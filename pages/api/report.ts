import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import DateObjectType, { busType } from "../../types/DateObjectType";
import PricesObjectType from "../../types/PricesObjectType";
import PupilObjectType from "../../types/PupilObjectType";
import ReportObjectType from "../../types/ReportObjectType";
import {
	calculateBusType,
	calculateLearningYear,
	calculateMin,
	calculatePrice
} from "../../utils/dateUtils";

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

const updateDate = async (
	action: "ADD" | "REMOVE",
	hour: "morning" | "15:30" | "17:00",
	name: string,
	date: string
) => {
	try {
		const db = (await clientPromise).db();

		const pupilExists = await db
			.collection<PupilObjectType>("pupils")
			.findOne({ name });

		if (!pupilExists) {
			return {
				error: true,
				message: "!תלמיד זה אינו קיים במערכת",
			};
		}

		const dateData = await db
			.collection<DateObjectType>("dates")
			.findOne({ date });

		if (!dateData) {
			return {
				error: true,
				message: "!תאריך זה לא קיים במערכת",
			};
		}

		const prices = await db.collection<PricesObjectType>("prices").findOne({});

		if (!dateData.transportations[hour]) {
			return {
				error: true,
				message: "!שעה לא תקינה",
			};
		}

		let newPupils: string[] = [];
		let newBusType: busType[] = [];
		let newPrice: number = 0;
		let newTotalAmount: number = 0;

		if (action === "ADD") {
			if (dateData.transportations[hour]!.pupils.includes(name)) {
				return {
					error: true,
					message: "!אתה כבר רשום להסעה בשעה זו",
				};
			}

			if (dateData.transportations[hour]!.pupils) {
				newPupils = [...dateData.transportations[hour]!.pupils, name];
			} else {
				newPupils = [name];
			}
		}

		if (action === "REMOVE") {
			if (!dateData.transportations[hour]!.pupils.includes(name)) {
				return {
					error: true,
					message: "!אינך רשום להסעה זו",
				};
			}

			newPupils = dateData.transportations[hour]!.pupils.filter(
				(pupil) => pupil !== name
			);
		}

		if (hour !== "morning") {
			newBusType = calculateBusType(newPupils.length);
			newPrice = calculatePrice(newBusType, prices!);
			newTotalAmount =
				dateData.totalAmount - dateData.transportations[hour]!.price + newPrice;
		} else {
			newBusType = dateData.transportations[hour]!.busType;
			newPrice = dateData.transportations[hour]!.price;
			newTotalAmount = dateData.totalAmount;
		}

		const response = db.collection("dates").updateOne(
			{
				date: date,
			},
			{
				$set: {
					[`transportations.${hour}.pupils`]: newPupils,
					[`transportations.${hour}.busType`]: newBusType,
					[`transportations.${hour}.price`]: newPrice,
					totalAmount: newTotalAmount,
				},
			}
		);

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

	switch (req.method) {
		case "POST": {
			const body: ReportObjectType = JSON.parse(req.body);

			if (!validateRequestBody(body)) {
				return res.status(406).json({ message: "Invalid request body" });
			}

			const { action, hour, name } = body;
			const date = body.date.replaceAll("-", "/");

			const response = await updateDate(action, hour, name, date).catch(
				(error) => {
					res.status(500).json({ message: error.message });
				}
			);

			if ((response as any).error) {
				return res.status(406).json({ message: (response as any).message });
			}

			return res.status(200).json(response);
		}
		default: {
			return res
				.status(405)
				.end(`Method ${req.method} doesn't exist or it is not allowed.`);
		}
	}
}

function validateRequestBody(body: any) {
	return (
		body.action &&
		(body.action === "ADD" || body.action === "REMOVE") &&
		body.hour &&
		(body.hour === "morning" ||
			body.hour === "15:30" ||
			body.hour === "17:00") &&
		body.name &&
		typeof body.name === "string" &&
		body.date &&
		typeof body.date === "string" &&
		body.date.split("-").length === 3 &&
		body.date.split("-")[0].length === 4 &&
		body.date.split("-")[1].length === 2 &&
		body.date.split("-")[2].length === 2 &&
		new Date(body.date) >= calculateMin() &&
		new Date(body.date) <= new Date(`${calculateLearningYear() + 1}-06-20`)
	);
}
