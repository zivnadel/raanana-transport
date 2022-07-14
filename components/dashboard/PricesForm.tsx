import React, { useContext, useState } from "react";
import { FaWindowClose } from "react-icons/fa";

import { DashboardContext } from "../../store/DashboardContext";
import PricesObjectType from "../../types/PricesObjectType";
import Button from "../ui/buttons/Button";
import CloseModalButton from "../ui/buttons/CloseModalButton";
import EditableInput from "../ui/inputs/EditableInput";
import LoadingSpinner from "../ui/LoadingSpinner";
import Modal from "../ui/modals/Modal";

const PricesForm: React.FC<any> = ({ initialPrices }) => {
	const dashboardContext = useContext(DashboardContext);

	const [currentPrices, setCurrentPrices] =
		useState<PricesObjectType>(initialPrices);
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const closeModalClickedHandler = () => {
		dashboardContext!.action({ type: "setShowPrices", payload: false });
	};

	const priceChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentPrices((prevState) => {
			return { ...prevState, [event.target.id]: parseInt(event.target.value) };
		});
	};

	const pricesSubmittedHandler = async () => {
		let flag = true;

		Object.entries(currentPrices).map((price) => {
			if (!(price[1] > 0)) {
				setShowErrorMessage(true);
				flag = false;
			}
		});

		if (flag) {
			setIsLoading(true);
			const response = await fetch("/api/prices", {
				method: "PUT",
				body: JSON.stringify(currentPrices),
			});
			setIsLoading(false);
			dashboardContext!.action({ type: "setShowPrices", payload: false });
			if (response.status === 200) {
				dashboardContext!.action({ type: "setPrices", payload: currentPrices });
				// TODO: maybe use component instead of alert.
				alert("המידע עודכן בהצלחה!");
			} else {
				alert("אירעה שגיאה! רענני את העמוד או נסי מאוחר יותר");
			}
		}
	};

	return (
		<Modal>
			<CloseModalButton onClick={closeModalClickedHandler} />
			{isLoading && <LoadingSpinner />}
			{initialPrices && !isLoading && (
				<div className="flex flex-col items-center">
					<h2 className="p-2 text-center text-2xl text-primary">מחירים</h2>
					{Object.entries(initialPrices).map((price: any) => {
						return (
							<EditableInput
								onChange={priceChangedHandler}
								key={price[0]}
								name={price[0]}
								type="number"
								value={price[1].toString()}
								label={convertToHebrew(price[0])}
							/>
						);
					})}
					{showErrorMessage && (
						<p className="text-m mt-5 text-right text-red-600">
							!נא למלא מחירים תקינים
						</p>
					)}
					<Button
						onClick={pricesSubmittedHandler}
						className="mt-6 mb-3 p-3 md:w-8/12">
						אישור
					</Button>
				</div>
			)}
		</Modal>
	);
};

function convertToHebrew(str: string): string {
	switch (str) {
		case "morning":
			return "בוקר";
		case "p8":
			return "אנשים" + "\u200e" + " 8";
		case "p16":
			return "אנשים" + "\u200e" + " 16";
		case "p20":
			return "אנשים" + "\u200e" + " 20";
		case "p23":
			return "אנשים" + "\u200e" + " 23";
		default:
			return "";
	}
}

export default PricesForm;
