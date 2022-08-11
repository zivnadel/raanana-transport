import { twMerge } from "tailwind-merge";
import InputWithIcon from "../../ui/inputs/InputWithIcon";

interface Props {
	name: string;
	value: string;
	heading: string;
	className?: string;
}

const TotalPriceInput: React.FC<Props> = ({
	name,
	value,
	heading,
	className,
}) => {
	return (
		<div className={twMerge(`z-[-1] w-[40%] ${className}`)}>
			<h2 className="mt-5 mb-3 w-full text-center text-2xl font-semibold text-primary">
				{heading}
			</h2>
			<InputWithIcon disabled={true} name={name} type="text" value={value} />
		</div>
	);
};

export default TotalPriceInput;
