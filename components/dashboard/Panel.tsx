import { signOut } from "next-auth/react";
import { useContext, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { DashboardContext } from "../../store/DashboardContext";
import PanelButton from "../ui/buttons/PanelButton";

const Panel: React.FC = () => {
	const dashboardContext = useContext(DashboardContext);
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	const toggleMobileMenuClickedHandler = () => {
		setShowMobileMenu((prevState) => !prevState);
	};

	const openPricesButtonClickedHandler = () => {
		dashboardContext!.action({ type: "setShowPrices", payload: true });
		setShowMobileMenu(false);
	};

	const openAddEditPupilButtonClickedHandler = () => {
		dashboardContext?.action({ type: "setShowAddEditPupil", payload: true });
		setShowMobileMenu(false);
	};

	const openRemovePupilButtonClickedHandler = () => {
		dashboardContext?.action({ type: "setShowRemovePupil", payload: true });
	};

	const loadYearButtonClickedHandler = () => {
		dashboardContext?.action({ type: "setLoadYear", payload: true });
	};

	return (
		<div className="flex h-screen flex-col items-center text-center">
			<h1 className="mb-2 mt-36 text-3xl font-semibold text-primary md:mt-20">
				לוח הבקרה
			</h1>
			<button
				onClick={toggleMobileMenuClickedHandler}
				id="dropdownDefault"
				data-dropdown-toggle="dropdown"
				className="m-3 inline-flex items-center rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 md:hidden">
				תפריט <FaChevronDown className="ml-2" />
			</button>
			<div
				className={`z-10 flex-col ${
					showMobileMenu ? "flex" : "hidden"
				} w-44 divide-y divide-gray-100 rounded bg-white shadow md:flex md:w-full md:divide-y-0 md:bg-transparent md:shadow-none`}>
				<ul
					className="py-1 text-sm text-gray-700 md:flex md:w-full md:justify-between md:px-10 md:py-0"
					aria-labelledby="dropdownDefault">
					<PanelButton onClick={openPricesButtonClickedHandler}>
						מחירון
					</PanelButton>
					<PanelButton>עדכון לו&quot;ז</PanelButton>
					<PanelButton>צפייה בנתוני השבוע</PanelButton>
					<PanelButton onClick={loadYearButtonClickedHandler}>
						טעינת שנה&quot;ל
					</PanelButton>
					<PanelButton onClick={openRemovePupilButtonClickedHandler}>
						הסרת תלמיד
					</PanelButton>
					<PanelButton onClick={openAddEditPupilButtonClickedHandler}>
						הוספת\עריכת תלמיד
					</PanelButton>
					<PanelButton onClick={() => signOut({ callbackUrl: "/" })}>
						התנתקות
					</PanelButton>
				</ul>
			</div>
		</div>
	);
};

export default Panel;
