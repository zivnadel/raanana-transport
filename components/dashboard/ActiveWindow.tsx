import dynamic from "next/dynamic";
import { useContext } from "react";
import { DashboardContext } from "../../store/DashboardContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import Modal from "../ui/modals/Modal";

const loadingElement = (
	<Modal>
		<LoadingSpinner />
	</Modal>
);

const AddEditPupil = dynamic(() => import("./AddEditPupil"), {
	loading: () => loadingElement,
});
const LoadYear = dynamic(() => import("./LoadYear"), {
	loading: () => loadingElement,
});
const PricesForm = dynamic(() => import("./PricesForm"), {
	loading: () => loadingElement,
});
const RemovePupil = dynamic(() => import("./RemovePupil"), {
	loading: () => loadingElement,
});
const Report = dynamic(() => import("./Report"), {
	loading: () => loadingElement,
});
const UpdateSchedule = dynamic(() => import("./UpdateSchedule"), {
	loading: () => loadingElement,
});
const ViewWeek = dynamic(() => import("./ViewWeek"), {
	loading: () => loadingElement,
});

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
