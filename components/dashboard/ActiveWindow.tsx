import dynamic from "next/dynamic";
import { useContext } from "react";
import { DashboardContext } from "../../store/DashboardContext";

const AddEditPupil = dynamic(() => import("./AddEditPupil"));
const LoadYear = dynamic(() => import("./LoadYear"));
const PricesForm = dynamic(() => import("./PricesForm"));
const RemovePupil = dynamic(() => import("./RemovePupil"));
const Report = dynamic(() => import("./Report"));
const UpdateSchedule = dynamic(() => import("./UpdateSchedule"));
const ViewWeek = dynamic(() => import("./ViewWeek"));

const ActiveWindow: React.FC = () => {
	const dashboardContext = useContext(DashboardContext);

	return (
		<>
			{dashboardContext!.showPrices && <PricesForm />}
			{dashboardContext!.showAddEditPupil && <AddEditPupil />}
			{dashboardContext!.showRemovePupil && <RemovePupil />}
			{dashboardContext!.showViewWeek && <ViewWeek />}
			{dashboardContext!.showUpdateSchedule && <UpdateSchedule />}
			{dashboardContext!.showReport && <Report />}
			{dashboardContext!.loadYear && <LoadYear />}
		</>
	);
};

export default ActiveWindow;
