import React from "react";

interface Props {
	id: string;
	value: string;
	label: string;
	editBtn?: boolean;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const DisabledInput: React.FC<Props> = ({
	id,
	value,
	label,
	editBtn,
	onClick,
}) => {
	return (
		<div className="my-3 flex flex-row-reverse items-center justify-center">
			<label className="p-2.5 font-medium" htmlFor={id}>
				{label}
			</label>
			<div
				className={`flex w-[70%] cursor-not-allowed flex-row-reverse justify-between rounded-lg border border-gray-300 bg-gray-100 sm:w-3/6 ${
					editBtn ? "py-1.5" : "py-2.5"
				} px-2.5 text-right text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500`}>
				<input
					type="text"
					id={id}
					className="text-right bg-transparent"
					value={value}
					disabled
					required
				/>
				{editBtn && (
					<button
						onClick={onClick}
						className="rounded-md bg-gray-300 p-1.5 text-left hover:bg-gray-400">
						ערוך
					</button>
				)}
			</div>
		</div>
	);
};

export default DisabledInput;
