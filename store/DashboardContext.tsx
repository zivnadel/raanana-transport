import { createContext, Dispatch, useReducer } from "react";
import PricesObjectType from "../types/PricesObjectType";

export interface DashboardContextType {
  showPrices: boolean;
  showAddEditPupil: boolean;
  showRemovePupil: boolean;
  showViewWeek: boolean;
  showUpdateSchedule: boolean;
  showReport: boolean;
  loadYear: boolean;
  prices: PricesObjectType;
  action: Dispatch<ActionType>;
}

type ActionType =
  | { type: "setShowPrices"; payload: boolean }
  | { type: "setPrices"; payload: PricesObjectType }
  | { type: "setShowAddEditPupil"; payload: boolean }
  | { type: "setShowRemovePupil"; payload: boolean }
  | { type: "setShowViewWeek"; payload: boolean }
  | { type: "setShowUpdateSchedule"; payload: boolean }
  | { type: "setShowReport"; payload: boolean }
  | { type: "setLoadYear"; payload: boolean };

export const DashboardContext = createContext<DashboardContextType | null>(
  null
);

const initialState = {
  showAddEditPupil: false,
  showRemovePupil: false,
  showPrices: false,
  showViewWeek: false,
  showReport: false,
  showUpdateSchedule: false,
  loadYear: false,
  prices: { p8: 0, p16: 0, p20: 0, p23: 0, morning: 0, midi: 0 },
};

const reducer = (state: typeof initialState, action: ActionType) => {
  switch (action.type) {
    case "setShowPrices":
      return { ...state, showPrices: action.payload };
    case "setPrices":
      return { ...state, prices: action.payload };
    case "setShowAddEditPupil":
      return { ...state, showAddEditPupil: action.payload };
    case "setShowRemovePupil":
      return { ...state, showRemovePupil: action.payload };
    case "setShowViewWeek":
      return { ...state, showViewWeek: action.payload };
    case "setShowUpdateSchedule":
      return { ...state, showUpdateSchedule: action.payload };
    case "setShowReport":
      return { ...state, showReport: action.payload };
    case "setLoadYear":
      return { ...state, loadYear: action.payload };
    default:
      throw new Error("Invalid action!");
  }
};

export const DashboardContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dashboardContext: DashboardContextType = {
    showPrices: state.showPrices,
    showRemovePupil: state.showRemovePupil,
    showAddEditPupil: state.showAddEditPupil,
    showViewWeek: state.showViewWeek,
    showUpdateSchedule: state.showUpdateSchedule,
    showReport: state.showReport,
    loadYear: state.loadYear,
    prices: state.prices,
    action: dispatch,
  };

  return (
    <DashboardContext.Provider value={dashboardContext}>
      {children}
    </DashboardContext.Provider>
  );
};
