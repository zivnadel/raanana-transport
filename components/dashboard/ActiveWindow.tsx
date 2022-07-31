import { useContext } from "react";
import { DashboardContext } from "../../store/DashboardContext";
import AddEditPupil from "./AddEditPupil";
import LoadYear from "./LoadYear";
import PricesForm from "./PricesForm";
import RemovePupil from "./RemovePupil";
import ViewWeek from "./ViewWeek";

const ActiveWindow: React.FC<any> = ({ initialPrices, initialDate }) => {
	const dashboardContext = useContext(DashboardContext);

	return (
		<>
			{dashboardContext!.showPrices && (
				<PricesForm initialPrices={initialPrices} />
			)}
			{dashboardContext!.showAddEditPupil && <AddEditPupil />}
			{dashboardContext!.showRemovePupil && <RemovePupil />}
			{dashboardContext!.loadYear && <LoadYear />}
			{dashboardContext!.showViewWeek && <ViewWeek initialDate={initialDate}/>}
		</>
	);
};

export default ActiveWindow;
