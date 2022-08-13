import React from "react";

import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import clientPromise from "../../../../lib/mongodb";
import DateObjectType from "../../../../types/DateObjectType";
import {
	MONTH_NAMES,
	produceMonthArray,
	produceWeeksFromMonth,
	validateMonth,
} from "../../../../utils/dateUtils";
import { authOptions } from "../../../api/auth/[...nextauth]";

import Chart from "../../../../utils/chartJSImports";
import Modal from "../../../../components/ui/modals/Modal";
import ErrorParagraph from "../../../../components/ui/ErrorParagraph";
import { useRouter } from "next/router";
import { ChartData, ChartOptions } from "chart.js";
import ReportHeading from "../../../../components/dashboard/report/ReportHeading";
import MobileNotSupported from "../../../../components/dashboard/report/MobileNotSupported";
import Button from "../../../../components/ui/buttons/Button";
import TotalPriceInput from "../../../../components/dashboard/report/TotalPriceInput";
import TransparentButton from "../../../../components/ui/buttons/TransparentButton";
import PupilsTable from "../../../../components/dashboard/report/PupilsTable";

interface Props {
	valid: boolean;
	monthData: DateObjectType[];
	month: number;
}

const MonthReport: NextPage<Props> = ({ valid, monthData, month }) => {
	const router = useRouter();

	const [showPupilsTable, setShowPupilsTable] = React.useState(false);

	const monthWeeksArray = produceWeeksFromMonth(monthData);

	let pricesChartData: ChartData<"pie">;
	let pricesChartOptions: ChartOptions<"pie">;

	if (valid) {
		pricesChartData = {
			labels: monthWeeksArray.map((_, index) => `שבוע ${index + 1}`),
			datasets: [
				{
					label: "מחיר כולל לכל השבוע",
					backgroundColor: [
						"rgb(41, 52, 98, 0.8)",
						"rgb(31, 70, 144, 0.8)",
						"rgb(214, 28, 78, 0.8)",
						"rgb(254, 177, 57, 0.8)",
						"rgb(255, 248, 10, 0.8)",
					],
					borderColor: [
						"rgb(41, 52, 98)",
						"rgb(31, 70, 144)",
						"rgb(214, 28, 78)",
						"rgb(254, 177, 57)",
						"rgb(255, 248, 10)",
					],
					borderWidth: 1,
					hoverBackgroundColor: [
						"rgb(41, 52, 98, 0.6)",
						"rgb(31, 70, 144, 0.6)",
						"rgb(214, 28, 78, 0.6)",
						"rgb(254, 177, 57, 0.6)",
						"rgb(255, 248, 10, 0.6)",
					],
					hoverBorderColor: [
						"rgb(41, 52, 98)",
						"rgb(31, 70, 144)",
						"rgb(214, 28, 78)",
						"rgb(254, 177, 57)",
						"rgb(255, 248, 10)",
					],
					data: monthWeeksArray.map((week) =>
						week.reduce((acc, day) => acc + day.totalAmount, 0)
					),
				},
			],
		};

		pricesChartOptions = {
			plugins: {
				tooltip: {
					callbacks: {
						beforeFooter: () => {
							return ":השבוע שבין";
						},
						footer: (tooltipItems) => {
							const week = monthWeeksArray[tooltipItems[0].dataIndex];
							return `${week[week.length - 1].date} - ${week[0].date}`;
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
	}

	return (
		<>
			{valid ? (
				<>
					{/* Charts container */}
					<div className="hidden h-screen w-full flex-col items-center overflow-x-hidden overflow-y-scroll p-10 md:flex">
						<ReportHeading>חודש {MONTH_NAMES[month - 1]}</ReportHeading>
						<div className="flex w-full flex-row-reverse items-center justify-center">
							<div className="w-2/6 flex-col items-center p-5">
								<TransparentButton
									onClick={() => setShowPupilsTable(true)}
									className="mb-4 w-5/6 p-3">
									דו&quot;ח תלמידים
								</TransparentButton>
								<div className="w-[90%]">
									<Chart
										type="pie"
										data={pricesChartData!}
										options={pricesChartOptions!}
									/>
								</div>
							</div>
							<div className="flex flex-col items-center">
								{monthWeeksArray.map((week, index) => (
									<Button
										key={index}
										className="mb-4 w-5/6"
										onClick={() =>
											router.push(
												`/dashboard/report/week/${week[0].date.replaceAll(
													"/",
													"-"
												)}`
											)
										}>
										דו&quot;ח לשבוע ה-{index + 1} של החודש
									</Button>
								))}
								<TotalPriceInput
									className="w-full"
									name="monthlyPrice"
									heading="מחיר חודשי כולל (בשקלים)"
									value={monthData
										.reduce((prev, cur) => prev + cur.totalAmount, 0)
										.toString()}
								/>
							</div>
						</div>
					</div>
					{showPupilsTable && (
						<PupilsTable
							onDismiss={() => setShowPupilsTable(false)}
							monthData={monthData}
							month={MONTH_NAMES[month - 1]}
						/>
					)}
					<MobileNotSupported />
				</>
			) : (
				<Modal
					onDismiss={() => router.push("/dashboard")}
					className="hidden md:flex">
					<ErrorParagraph error="!חודש לא תקין" />
				</Modal>
			)}
		</>
	);
};

// create getServerSideProps arrow func which gets the query
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
					destination: "/login",
					permanent: false,
				},
			};
		}

		const { month: monthQuery } = context.query;

		if (!validateMonth(monthQuery as string)) {
			return {
				props: {
					valid: false,
				},
			};
		}

		const [year, month] = (monthQuery as string).split("-");

		const monthArray = produceMonthArray(+month, +year);

		const db = (await clientPromise).db();
		const monthData = await db
			.collection<DateObjectType>("dates")
			.find(
				{
					date: {
						$in: monthArray,
					},
				},
				{ projection: { _id: 0 } }
			)
			.toArray();

		return {
			props: {
				valid: true,
				monthData,
				month: +month,
			},
		};
	} catch (error: any) {
		throw new Error(error);
	}
};

export default MonthReport;
