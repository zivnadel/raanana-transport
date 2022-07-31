import { WithId } from "mongodb";
import {
	GetServerSideProps,
	InferGetServerSidePropsType,
	NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth";
import ActiveWindow from "../../components/dashboard/ActiveWindow";
import Panel from "../../components/dashboard/Panel";
import clientPromise from "../../lib/mongodb";
import { DashboardContextProvider } from "../../store/DashboardContext";
import DateObjectType from "../../types/DateObjectType";
import { toIsraelDate, toNormalDateString } from "../../utils/dateUtils";
import { authOptions } from "../api/auth/[...nextauth]";

const Dashboard: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ initialPrices, initialDate }) => {
	return (
		<DashboardContextProvider>
			<Panel />
			<ActiveWindow initialPrices={initialPrices} initialDate={initialDate} />
		</DashboardContextProvider>
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

		const db = (await clientPromise).db();

		// fetching the initial prices for edit prices
		const initialPrices = (
			await db
				.collection("prices")
				.find({}, { projection: { _id: 0 } })
				.toArray()
		)[0];

		// fetching the current date if in the range from db, for edit week and edit day
		let initialDate: WithId<DateObjectType> | null;
		const today = new Date();
		if (today <= new Date("2023-06-20") && today >= new Date("2022-09-01")) {
			initialDate = await db
				.collection<DateObjectType>("dates")
				.findOne(
					{ date: toNormalDateString(today) },
					{ projection: { _id: 0 } }
				);
		} else {
			initialDate = await db
				.collection<DateObjectType>("dates")
				.findOne({ date: "2022/9/1" }, { projection: { _id: 0 } });
		}

		return {
			props: {
				session,
				initialPrices,
				initialDate,
			},
		};
	} catch (error: any) {
		throw new Error(error);
	}
};

export default Dashboard;
