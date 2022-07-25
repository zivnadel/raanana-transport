import { useContext } from "react";
import { DashboardContext } from "../../store/DashboardContext";
import AddEditPupil from "./AddEditPupil";
import PricesForm from "./PricesForm";
import RemovePupil from "./RemovePupil";

const ActiveWindow: React.FC<any> = ({ initialPrices }) => {
	const dashboardContext = useContext(DashboardContext);

	return (
		<>
			{dashboardContext!.showPrices && (
				<PricesForm initialPrices={initialPrices} />
			)}
			{dashboardContext!.showAddEditPupil && <AddEditPupil />}
			{dashboardContext!.showRemovePupil && <RemovePupil />}
		</>
	);
};

export default ActiveWindow;
