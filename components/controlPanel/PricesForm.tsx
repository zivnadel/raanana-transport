import { useContext } from "react";
import { FaWindowClose } from "react-icons/fa";

import DashboardContext from "../../store/dashboardContext/dashboard-context";
import Button from "../ui/buttons/Button";
import Modal from "../ui/modals/Modal";

const PricesForm = () => {
    const dashboardContext = useContext(DashboardContext);

    const closeModalClickedHandler = () => {
        dashboardContext!.setShowPrices(false)
    }

    return (
        <Modal>
            <FaWindowClose onClick={closeModalClickedHandler} className="hover:opacity-80 cursor-pointer ml-auto text-2xl mt-3 mr-3 text-primary" />
            <div className="flex flex-col items-center">
                <h2 className="text-center p-2 text-primary text-2xl">מחירים</h2>
                <Button className="mt-3 mb-3 p-3 md:w-8/12">אישור</Button>
            </div>
        </Modal>
    )
}

export default PricesForm;