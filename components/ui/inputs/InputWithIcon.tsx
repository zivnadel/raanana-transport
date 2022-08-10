import React from "react";

interface Props {
	name: string;
	type: string;
	value: string;
	label?: string;
	icon?: string;
	disabled?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputWithIcon: React.FC<Props> = ({
	name,
	type,
	value,
	label,
	onChange,
	disabled,
	icon = "₪",
}) => {
	return (
		<div className="my-1 flex flex-col items-center">
			{label && <label htmlFor={name} className="m-2">
				{label}
			</label>}
			<div className="flex w-6/12">
				<span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900">
					{icon}
				</span>
				<input
					disabled={disabled}
					type={type}
					defaultValue={value}
					id={name}
					onChange={onChange}
					className="block disabled:cursor-not-allowed w-full min-w-0 flex-1 rounded-none rounded-r-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				/>
			</div>
		</div>
	);
};

export default InputWithIcon;
