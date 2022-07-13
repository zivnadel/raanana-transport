import { useContext } from "react";
import { DashboardContext } from "../../store/DashboardContext";
import PricesForm from "./PricesForm"

const ActiveWindow: React.FC<any> = ({ initialPrices }) => {
    const dashboardContext = useContext(DashboardContext);

    return <>{dashboardContext!.showPrices && <PricesForm initialPrices={initialPrices}/>}</>
}

export default ActiveWindow