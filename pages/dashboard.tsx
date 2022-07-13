import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import ActiveWindow from '../components/dashboard/ActiveWindow';
import Panel from '../components/dashboard/Panel';
import clientPromise from '../lib/mongodb';
import { DashboardContextProvider } from '../store/DashboardContext';

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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const db = (await clientPromise).db();
    const initialPrices: any = await db.collection('prices').find().toArray();

    delete initialPrices[0]._id;

    return {
      props: {
        initialPrices: JSON.parse(JSON.stringify(initialPrices[0])),
      },
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

Dashboard.displayName = 'Dashboard';

export default Dashboard;
