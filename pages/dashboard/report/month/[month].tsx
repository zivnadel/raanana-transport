import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import clientPromise from "../../../../lib/mongodb";
import DateObjectType from "../../../../types/DateObjectType";
import {
	produceMonthArray,
	produceWeeksFromMonth,
	validateMonth,
} from "../../../../utils/dateUtils";
import { authOptions } from "../../../api/auth/[...nextauth]";

import Chart from "../../../../utils/chartJSImports";
import Modal from "../../../../components/ui/modals/Modal";
import ErrorParagraph from "../../../../components/ui/ErrorParagraph";
import { useRouter } from "next/router";
import { ChartData } from "chart.js";

interface Props {
	valid: boolean;
	monthData: DateObjectType[];
}

const MonthReport: NextPage<Props> = ({ valid, monthData }) => {
	const router = useRouter();

	const monthWeeksArray = produceWeeksFromMonth(monthData);

	const pricesChartData: ChartData<"pie"> = {
		labels: monthWeeksArray.map((_, index) => `שבוע ${index + 1}`),
		datasets: [
			{
				label: "מחיר כולל לכל השבוע",
				backgroundColor: ["rgba(32, 145, 245, 0.4)", "rgba(39, 32, 245, 0.4)"],
				borderColor: "rgba(32, 145, 245, 0.8)",
				borderWidth: 1,
				hoverBackgroundColor: "rgba(32, 145, 245, 0.6)",
				hoverBorderColor: "rgba(32, 145, 245, 1)",
				data: monthWeeksArray.map((week) =>
					week.reduce((acc, day) => acc + day.totalAmount, 0)
				),
			},
		],
	};

	return (
		<>
			{valid ? (
				<>
					{/* Charts container */}
					<div className="hidden h-full w-full flex-col md:flex">
						<Chart type="pie" data={pricesChartData} />
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
			},
		};
	} catch (error: any) {
		throw new Error(error);
	}
};

export default MonthReport;
