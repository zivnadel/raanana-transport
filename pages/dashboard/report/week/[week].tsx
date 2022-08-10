import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import ErrorParagraph from "../../../../components/ui/ErrorParagraph";
import Modal from "../../../../components/ui/modals/Modal";
import clientPromise from "../../../../lib/mongodb";
import DateObjectType, { busType } from "../../../../types/DateObjectType";
import {
	mapDayToString,
	toNormalDateString,
	validateWeek,
} from "../../../../utils/dateUtils";
import { authOptions } from "../../../api/auth/[...nextauth]";

import Chart from "../../../../utils/chartJSImports";
import InputWithIcon from "../../../../components/ui/inputs/InputWithIcon";
import { ChartData, ChartOptions } from "chart.js";

interface Props {
	valid: boolean;
	weekData: DateObjectType[];
}

const WeekReport: NextPage<Props> = ({ valid, weekData }) => {
	const router = useRouter();

	let pupilsChartData: ChartData<"bar">;
	let pricesChartData: ChartData<"bar">;
	let pricesChartOptions: ChartOptions<"bar">;
	let pupilsChartOptions: ChartOptions<"bar">;

	if (valid) {
		pupilsChartData = {
			labels: weekData.map((day) => `${day.date} - ${mapDayToString(day.day)}`),
			datasets: [
				{
					label: "מספר נוסעים בוקר",
					backgroundColor: "rgba(32, 145, 245, 0.4)",
					borderColor: "rgba(32, 145, 245, 0.8)",
					borderWidth: 1,
					hoverBackgroundColor: "rgba(32, 145, 245, 0.6)",
					hoverBorderColor: "rgba(32, 145, 245, 1)",
					data: weekData.map(
						(day) => day.transportations.morning?.pupils.length || 0
					),
				},
				{
					label: "מספר נוסעים 15:30",
					backgroundColor: "rgba(39, 32, 245, 0.4)",
					borderColor: "rgba(39, 32, 245, 0.8)",
					borderWidth: 1,
					hoverBackgroundColor: "rgba(39, 32, 245, 0.6)",
					hoverBorderColor: "rgba(39, 32, 245, 1)",
					data: weekData.map(
						(day) => day.transportations["15:30"]?.pupils.length || 0
					),
				},
				{
					label: "מספר נוסעים 17:00",
					backgroundColor: "rgba(0, 4, 91, 0.4)",
					borderColor: "rgba(0, 4, 91, 0.8)",
					borderWidth: 1,
					hoverBackgroundColor: "rgba(0, 4, 91, 0.6)",
					hoverBorderColor: "rgba(0, 4, 91, 1)",
					data: weekData.map(
						(day) => day.transportations["17:00"]?.pupils.length || 0
					),
				},
			],
		};

		pricesChartData = {
			labels: weekData.map((day) => `${day.date} - ${mapDayToString(day.day)}`),
			datasets: [
				{
					label: "מחיר לכל היום",
					backgroundColor: "rgba(245, 40, 145, 0.7)",
					borderColor: "rgba(245, 40, 145, 0.7)",
					borderWidth: 1,
					hoverBackgroundColor: "rgba(245, 40, 145, 0.9)",
					data: [...weekData.map((day) => day.totalAmount)],
				},
				{
					label: "מחיר להסעת בוקר",
					backgroundColor: "rgba(75, 207, 73, 0.7)",
					borderColor: "rgba(75, 207, 73, 0.7)",
					borderWidth: 1,
					hoverBackgroundColor: "rgba(75, 207, 73, 0.9)",
					data: [
						...weekData.map((day) => day.transportations.morning?.price || 0),
					],
				},
				{
					label: "מחיר להסעת 15:30",
					backgroundColor: "rgba(30, 164, 217, 0.7)",
					borderColor: "rgba(30, 164, 217, 0.7)",
					borderWidth: 1,
					hoverBackgroundColor: "rgba(30, 164, 217, 0.9)",
					data: [
						...weekData.map((day) => day.transportations["15:30"]?.price || 0),
					],
				},
				{
					label: "מחיר להסעת 17:00",
					backgroundColor: "rgba(245, 32, 32, 0.7)",
					borderColor: "rgba(245, 32, 32, 0.7)",
					borderWidth: 1,
					hoverBackgroundColor: "rgba(245, 32, 32, 0.9)",
					data: [
						...weekData.map((day) => day.transportations["17:00"]?.price || 0),
					],
				},
			],
		};

		pricesChartOptions = {
			plugins: {
				tooltip: {
					callbacks: {
						beforeFooter: (tooltipItems: any) => {
							if (tooltipItems[0].datasetIndex === 0) {
								return "";
							}
							return ":כלי רכב";
						},
						footer: (tooltipItems: any) => {
							const day: DateObjectType = weekData[tooltipItems[0].dataIndex];

							if (tooltipItems[0].datasetIndex === 0) {
								return "";
							}

							let hour = tooltipItems[0].dataset.label.split(" ").at(-1);
							if (hour === "בוקר") hour = "morning";

							return mapBusTypeToString(
								day.transportations[hour as keyof typeof day.transportations]!
									.busType
							);
						},
					},
					footerAlign: "center" as "center" | "left" | "right",
					titleAlign: "center" as "center" | "left" | "right",
					bodyAlign: "center" as "center" | "left" | "right",
					titleMarginBottom: 8,
					footerSpacing: 3,
					titleFont: {
						size: 16,
					},
					bodyFont: {
						size: 16,
					},
					footerFont: {
						size: 14,
					},
				},
			},
		};

		pupilsChartOptions = {
			plugins: {
				tooltip: {
					callbacks: {
						beforeFooter: () => {
							return ":נוסעים";
						},
						footer: (tooltipItems: any) => {
							const day: DateObjectType = weekData[tooltipItems[0].dataIndex];
							let hour = tooltipItems[0].dataset.label.split(" ").at(-1);
							if (hour === "בוקר") hour = "morning";
							let stringData = "";
							day.transportations[
								hour as keyof typeof day.transportations
							]?.pupils.forEach((pupil, index) => {
								if (
									index ===
									day.transportations[hour as keyof typeof day.transportations]!
										.pupils.length -
										1
								) {
									stringData += pupil;
								} else {
									stringData += pupil + ", ";
								}
							});
							return stringData;
						},
					},
					footerAlign: "center" as "center" | "left" | "right",
					titleAlign: "center" as "center" | "left" | "right",
					titleMarginBottom: 8,
					footerSpacing: 3,
					titleFont: {
						size: 16,
					},
					bodyFont: {
						size: 16,
					},
					footerFont: {
						size: 14,
					},
				},
			},
		};
	}

	return (
		<>
			{valid ? (
				<>
					{/* Charts container */}
					<div className="hidden h-full w-full flex-col items-center justify-center p-10 md:flex">
						<div className="mb-5 mt-12 rounded-full bg-opacity-50 bg-gradient-to-r from-primary to-secondary px-5 py-3 shadow-md">
							<h1 className="text-center text-3xl font-semibold text-gray-300">{`השבוע שבין ה-${
								weekData[0].date
							} ל-${weekData[weekData.length - 1].date}`}</h1>
						</div>
						<div className="flex w-full justify-between">
							<div className="mx-3 h-[45%] w-[45%]">
								<h2 className="mb-5 w-full text-center text-3xl font-semibold text-primary">
									גרף מחירים (לכל יום בשבוע)
								</h2>
								<Chart
									options={pricesChartOptions!}
									data={pricesChartData!}
									type="bar"></Chart>
							</div>
							<div className="mx-3 h-[45%] w-[45%]">
								<h2 className="mb-5 w-full text-center text-3xl font-semibold text-primary">
									גרף נוסעים (לכל יום בשבוע)
								</h2>
								<Chart
									options={pupilsChartOptions!}
									type="bar"
									data={pupilsChartData!}></Chart>
							</div>
						</div>
						<div className="flex w-full flex-col items-center">
							<div className="w-[20%]">
								<h2 className="mt-5 mb-3 w-full text-center text-2xl font-semibold text-primary">
									מחיר שבועי כולל (בשקלים)
								</h2>
								<InputWithIcon
									disabled={true}
									name="weeklyAmount"
									type="text"
									value={weekData
										.reduce((prev, cur) => prev + cur.totalAmount, 0)
										.toString()}
								/>
							</div>
						</div>
					</div>
					<div className="md:hidden">
						<Modal onDismiss={() => router.push("/dashboard")}>
							<ErrorParagraph error={"עמוד זה אינו נתמך במובייל"} />
						</Modal>
					</div>
				</>
			) : (
				<Modal
					onDismiss={() => router.push("/dashboard")}
					className="hidden md:flex">
					<ErrorParagraph error="!תאריך לא תקין" />
				</Modal>
			)}
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	try {
		const session = await unstable_getServerSession(
			context.req,
			context.res,
			authOptions
		);

		if (!session) {
			return {
				redirect: {
					permanent: false,
					destination: "/login",
				},
			};
		}

		const { week } = context.query;

		if (!validateWeek(new Date(week as string))) {
			return {
				props: {
					valid: false,
				},
			};
		}

		let transformedDate = new Date(week as string);
		const db = (await clientPromise).db();
		transformedDate.setDate(
			transformedDate.getDate() - transformedDate.getDay()
		);

		let daysOfTheWeek: string[] = [toNormalDateString(transformedDate)];
		for (let i = 1; i < 5; i++) {
			let nextDay = new Date(transformedDate);
			nextDay.setDate(transformedDate.getDate() + i);
			daysOfTheWeek.push(toNormalDateString(nextDay));
		}
		const weekData = await db
			.collection<DateObjectType>("dates")
			.find(
				{
					date: { $in: daysOfTheWeek },
				},
				{ projection: { _id: 0 } }
			)
			.toArray();

		return {
			props: {
				valid: true,
				weekData,
			},
		};
	} catch (error: any) {
		throw new Error(error);
	}
};

const mapBusTypeToString = (busTypes: busType[]) => {
	let busTypeString = "";
	if (!busTypes) {
		return "";
	}
	busTypes.forEach((type) => {
		switch (type) {
			case busType.morning:
				busTypeString += " ,אוטובוס בוקר";
				break;
			case busType.p8:
				busTypeString += " ,מיניבוס 8 נוסעים";
				break;
			case busType.p16:
				busTypeString += " ,מיניבוס 16 נוסעים";
				break;
			case busType.p20:
				busTypeString += " ,מיניבוס 20 נוסעים";
				break;
			case busType.p23:
				busTypeString += " ,מיניבוס 23 נוסעים";
				break;
			default:
				break;
		}
	});
	return busTypeString.substring(2);
};

export default WeekReport;
