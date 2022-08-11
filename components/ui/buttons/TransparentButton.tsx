import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface Props {
	children?: React.ReactNode;
	className?: string;
	chevron?: boolean;
	type?: "button" | "submit" | "reset" | undefined;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const TransparentButton: React.FC<Props> = ({
	children,
	className,
	chevron,
	type,
	onClick,
}) => {
	return (
		<button
			className={twMerge(
				`mx-5 w-44 rounded-full border-2 border-gray-800 bg-transparent p-4 text-center text-black shadow-lg hover:border-opacity-80 hover:opacity-80 ${className}`
			)}
			type={type}
			onClick={onClick}>
			{children} {chevron && <FaChevronLeft className="inline" />}
		</button>
	);
};

export default TransparentButton;
