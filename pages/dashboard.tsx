import {
	GetServerSideProps,
	InferGetServerSidePropsType,
	NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth";
import ActiveWindow from "../components/dashboard/ActiveWindow";
import Panel from "../components/dashboard/Panel";
import clientPromise from "../lib/mongodb";
import { DashboardContextProvider } from "../store/DashboardContext";
import { authOptions } from "./api/auth/[...nextauth]";

const Dashboard: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ initialPrices }) => {
	return (
		<DashboardContextProvider>
			<Panel />
			<ActiveWindow initialPrices={initialPrices} />
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
		const initialPrices: any = await db.collection("prices").find().toArray();

		delete initialPrices[0]._id;

		return {
			props: {
				session,
				initialPrices: JSON.parse(JSON.stringify(initialPrices[0])),
			},
		};
	} catch (error: any) {
		throw new Error(error);
	}
};

export default Dashboard;
