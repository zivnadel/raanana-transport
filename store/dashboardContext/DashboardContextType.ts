import { Dispatch, SetStateAction } from 'react'

export default interface DashboardContextType {
  showPrices: boolean
  setShowPrices: Dispatch<SetStateAction<boolean>>
}
