import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import ActiveWindow from '../components/dashboard/ActiveWindow'
import Panel from '../components/dashboard/Panel'
import { connectToDatabase } from '../lib/mongodb'
import { DashboardContextProvider } from '../store/DashboardContext'

const Dashboard: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ initialPrices }) => {
  return (
    <DashboardContextProvider>
      <Panel />
      <ActiveWindow initialPrices={initialPrices}/>
    </DashboardContextProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
    try {
      const { db } = await connectToDatabase();
      const initialPrices = await db.collection('prices').find().toArray()

      delete initialPrices[0]._id

      return {
        props: {
          initialPrices: JSON.parse(JSON.stringify(initialPrices[0]))
        }
      }
    } catch (error: any) {
      throw new Error(error)
    }
}

export default Dashboard
