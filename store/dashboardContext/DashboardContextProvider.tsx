import { useState } from 'react'
import DashboardContextType from './DashboardContextType'

import DashboardContext from './dashboard-context'

interface Props {
  children: React.ReactNode
}

const DashboardContextProvider = ({ children }: Props) => {
  const [showPrices, setShowPrices] = useState(false)

  const dashboardContext: DashboardContextType = {
    showPrices: showPrices,
    setShowPrices: setShowPrices
  }

  return (
    <DashboardContext.Provider value={dashboardContext}>
      {children}
    </DashboardContext.Provider>
  )
}

export default DashboardContextProvider
