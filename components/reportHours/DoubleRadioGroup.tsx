import React, { Dispatch, SetStateAction } from "react";

interface Props {
	setAction: Dispatch<SetStateAction<string>>;
	action: string;
}

const DoubleRadioGroup: React.FC<Props> = ({ action, setAction }) => {
	const handleActionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAction(event.target.value);
	};

	return (
		<div className="flex">
			<div className="mr-4 flex flex-row-reverse items-end p-5">
				<input
					onChange={handleActionChange}
					checked={action === "ADD"}
					id="addRides"
					type="radio"
					value="ADD"
					name="double-radio-group"
					className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
				/>
				<label
					htmlFor="addRides"
					className="mr-2 text-sm font-medium text-gray-900">
					הוסף הסעות
				</label>
			</div>
			<div className="mr-4 flex flex-row-reverse items-center">
				<input
					onChange={handleActionChange}
					checked={action === "REMOVE"}
					id="removeRides"
					type="radio"
					value="REMOVE"
					name="double-radio-group"
					className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
				/>
				<label
					htmlFor="removeRides"
					className="mr-2 text-sm font-medium text-gray-900">
					הסר הסעות
				</label>
			</div>
		</div>
	);
};

export default DoubleRadioGroup;
