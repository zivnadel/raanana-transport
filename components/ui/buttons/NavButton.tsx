import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface Props {
	text: string;
	href: string;
	className?: string;
}

const NavButton: React.FC<Props> = ({ text, href, className }) => {
	return (
		<Link href={href}>
			<li
				className={twMerge(
					`w-full cursor-pointer py-1 hover:rounded hover:bg-gray-300 md:w-auto md:py-0 md:hover:rounded-none md:hover:bg-transparent ${className}`
				)}>
				<a className="md:rounded-full md:from-primary md:to-red-500 md:py-3 md:px-8 md:hover:bg-gradient-to-r">
					{text}
				</a>
			</li>
		</Link>
	);
};

export default NavButton;
