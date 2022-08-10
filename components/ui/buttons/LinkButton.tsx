import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface Props {
	text: string;
	href: string;
	chevron: boolean;
	type?: string;
	className?: string;
}

const LinkButton: React.FC<Props> = ({
	text,
	href,
	chevron,
	type,
	className,
}) => {
	return (
		<Link href={href}>
			<a
				type={type}
				className={twMerge(
					`mt-10 w-44 rounded-full bg-gradient-to-r from-primary to-red-500 p-4 text-white shadow-md hover:opacity-80 ${className}`
				)}>
				{text} {chevron && <FaChevronLeft className="inline" />}
			</a>
		</Link>
	);
};

export default LinkButton;
