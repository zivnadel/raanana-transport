import { FaChevronLeft } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface Props {
	className?: string;
	chevron?: boolean;
	type?: "button" | "submit" | "reset" | undefined;
	disabled?: boolean;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button: React.FC<Props> = ({
	children,
	className,
	chevron,
	type,
	onClick,
	disabled,
}) => {
	return (
		<button
			disabled={disabled}
			type={type}
			onClick={onClick}
			className={twMerge(
				`mx-5 mt-10 w-44 rounded-full bg-gradient-to-r from-primary to-red-500 p-4 text-center text-white shadow-md hover:opacity-80 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-400 disabled:hover:opacity-100 ${className}`
			)}>
			{children} {chevron && <FaChevronLeft className="inline" />}
		</button>
	);
};

export default Button;
