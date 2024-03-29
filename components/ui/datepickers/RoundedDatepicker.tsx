import { twMerge } from "tailwind-merge";

interface Props {
	className?: string;
	min?: string;
	max?: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	value?: string;
	month?: boolean;
	placeholder?: string;
}

const RoundedDatepicker: React.FC<Props> = ({
	className,
	min,
	max,
	onChange,
	value,
	month,
	placeholder,
}) => {
	return (
		<>
			<p className="p-1 text-sm font-medium">בחרי תאריך</p>
			<input
				type={month ? "month" : "date"}
				min={min}
				max={max}
				onClick={(e: any) => e.target.showPicker()}
				onChange={onChange}
				value={value}
				defaultValue={placeholder || "תאריך"}
				className={twMerge(`w-44 rounded-full border-2 border-gray-800 bg-transparent p-4 text-center text-black shadow-lg hover:border-opacity-80 hover:opacity-80 ${className}`)}></input>
		</>
	);
};
export default RoundedDatepicker;
