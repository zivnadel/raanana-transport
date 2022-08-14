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
					`w-full cursor-pointer py-1 hover:rounded hover:bg-gray-300 lg:w-auto lg:py-0 lg:hover:rounded-none lg:hover:bg-transparent ${className}`
				)}>
				<a className="lg:rounded-full lg:from-primary lg:to-red-500 lg:py-3 lg:px-8 lg:hover:bg-gradient-to-r">
					{text}
				</a>
			</li>
		</Link>
	);
};

export default NavButton;
