import { createContext, Dispatch, SetStateAction, useReducer } from 'react';
import PricesObjectType from '../types/PricesObjectType';

export interface DashboardContextType {
  showPrices: boolean;
  prices: PricesObjectType;
  action: Dispatch<SetStateAction<any>>;
}

export const DashboardContext = createContext<DashboardContextType | null>(
  null
);

const initialState = {
  showPrices: false,
  prices: { p8: 0, p16: 0, p20: 0, p23: 0, morning: 0 },
};

type ACTIONTYPE =
  | { type: 'setShowPrices'; payload: boolean }
  | { type: 'setPrices'; payload: PricesObjectType };

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case 'setShowPrices':
      return { ...state, showPrices: action.payload };
    case 'setPrices':
      return { ...state, prices: action.payload };
    default:
      throw new Error();
  }
}

export const DashboardContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dashboardContext: DashboardContextType = {
    showPrices: state.showPrices,
    prices: state.prices,
    action: dispatch,
  };

  return (
    <DashboardContext.Provider value={dashboardContext}>
      {children}
    </DashboardContext.Provider>
  );
};
