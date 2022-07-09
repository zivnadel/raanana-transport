import { NextPage } from 'next'
import ActiveWindow from '../components/controlPanel/ActiveWindow'
import Panel from '../components/controlPanel/Panel'
import DashboardContextProvider from '../store/dashboardContext/DashboardContextProvider'

const Dashboard: NextPage = () => {
  return (
    <DashboardContextProvider>
      <Panel />
      <ActiveWindow />
    </DashboardContextProvider>
  )
}

export default Dashboard
