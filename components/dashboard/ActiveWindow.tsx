import { useContext } from "react";
import { DashboardContext } from "../../store/DashboardContext";
import AddRemovePupil from "./AddRemovePupil";
import PricesForm from "./PricesForm";

const ActiveWindow: React.FC<any> = ({ initialPrices }) => {
	const dashboardContext = useContext(DashboardContext);

	return (
		<>
			{dashboardContext!.showPrices && (
				<PricesForm initialPrices={initialPrices} />
			)}
			{dashboardContext!.showAddRemovePupil && <AddRemovePupil />}
		</>
	);
};

export default ActiveWindow;
