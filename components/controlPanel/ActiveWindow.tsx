import { useContext } from "react";
import DashboardContext from "../../store/dashboardContext/dashboard-context";
import PricesForm from "./PricesForm"

const ActiveWindow = () => {
    const dashboardContext = useContext(DashboardContext);

    return <>{dashboardContext!.showPrices && <PricesForm />}</>
}

export default ActiveWindow