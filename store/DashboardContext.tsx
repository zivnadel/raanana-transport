import { createContext, Dispatch, SetStateAction, useReducer } from "react";
import PricesObjectType from "../types/PricesObjectType";

export interface DashboardContextType {
	showPrices: boolean;
	showAddEditPupil: boolean;
	showRemovePupil: boolean;
	showViewWeek: boolean;
	loadYear: boolean;
	prices: PricesObjectType;
	action: Dispatch<SetStateAction<any>>;
}

export const DashboardContext = createContext<DashboardContextType | null>(
	null
);

const initialState = {
	showAddEditPupil: false,
	showRemovePupil: false,
	showPrices: false,
	showViewWeek: false,
	loadYear: false,
	prices: { p8: 0, p16: 0, p20: 0, p23: 0, morning: 0 },
};

type ACTIONTYPE =
	| { type: "setShowPrices"; payload: boolean }
	| { type: "setPrices"; payload: PricesObjectType }
	| { type: "setShowAddEditPupil"; payload: boolean }
	| { type: "setShowRemovePupil"; payload: boolean }
	| { type: "setLoadYear"; payload: boolean }
	| { type: "setShowViewWeek"; payload: boolean };

const reducer = (state: typeof initialState, action: ACTIONTYPE) => {
	switch (action.type) {
		case "setShowPrices":
			return { ...state, showPrices: action.payload };
		case "setPrices":
			return { ...state, prices: action.payload };
		case "setShowAddEditPupil":
			return { ...state, showAddEditPupil: action.payload };
		case "setShowRemovePupil":
			return { ...state, showRemovePupil: action.payload };
		case "setLoadYear":
			return { ...state, loadYear: action.payload };
		case "setShowViewWeek":
			return { ...state, showViewWeek: action.payload };
		default:
			throw new Error();
	}
};

export const DashboardContextProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const dashboardContext: DashboardContextType = {
		showPrices: state.showPrices,
		showRemovePupil: state.showRemovePupil,
		showAddEditPupil: state.showAddEditPupil,
		showViewWeek: state.showViewWeek,
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
