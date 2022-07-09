import { createContext } from 'react'
import DashboardContextType from './DashboardContextType'

const DashboardContext = createContext<DashboardContextType | null>(null)

export default DashboardContext
