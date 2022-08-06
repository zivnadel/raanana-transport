import { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
	name: string;
	label: string;
	type: string;
	className?: string;
	required?: boolean;
	value?: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	error?: string;
}

const Input: React.FC<Props> = ({
	name,
	label,
	type,
	className,
	required,
	value,
	onChange,
	error,
}) => {
	return (
		<div className={twMerge(`relative z-0 w-10/12 ${className}`)}>
			<input
				onChange={onChange}
				value={value}
				type={type}
				id={name}
				className={`peer block w-full appearance-none border-0 border-b-2 bg-transparent py-2.5 px-0 text-right text-sm text-gray-900 focus:outline-none focus:ring-0 ${
					error
						? "border-red-500 focus:border-red-500"
						: "border-gray-500 focus:border-primary"
				}`}
				placeholder=" "
				required={required}
			/>
			<label
				htmlFor={name}
				className={`absolute right-0 top-3 -z-10 -translate-y-6 scale-75 transform text-sm duration-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:right-0 peer-focus:-translate-y-6 peer-focus:scale-75 ${
					error
						? "text-red-500 peer-focus:text-red-500"
						: "text-gray-700 peer-focus:text-primary"
				}`}>
				{label}
			</label>
			{error && (
				<p className="py-2 text-right text-sm font-medium text-red-500">
					{error}
				</p>
			)}
		</div>
	);
};

export default Input;
