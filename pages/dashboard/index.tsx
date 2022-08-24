import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import ActiveWindow from "../../components/dashboard/ActiveWindow";
import Panel from "../../components/dashboard/Panel";
import { DashboardContextProvider } from "../../store/DashboardContext";
import { authOptions } from "../api/auth/[...nextauth]";

const Dashboard: NextPage = () => {
	return (
		<DashboardContextProvider>
			<Panel />
			<ActiveWindow />
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

		return {
			props: {
				session,
			},
		};
	} catch (error: any) {
		throw new Error(error);
	}
};

export default Dashboard;
