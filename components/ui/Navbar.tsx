import Link from "next/link";
import React from "react";
import { FaBus, FaChevronDown } from "react-icons/fa";
import NavButton from "./buttons/NavButton";

const Navbar: React.FC = () => {
	const [showMobileMenu, setShowMobileMenu] = React.useState(false);

	return (
		<nav className={`z-40 ${showMobileMenu ? "h-auto" : "h-32 lg:h-16"} top-0 shadow-lg fixed flex w-full flex-col items-center justify-center bg-green-800 py-5 px-7 text-white lg:flex-row-reverse lg:items-center lg:justify-end lg:py-4`}>
			<Link href="/">
				<a className="mb-1 w-56 text-center text-2xl lg:mb-0 lg:text-right">
					<span className="text-primary">הסעות </span>רעננה
					<FaBus className="ml-2 inline text-primary" size="1.5rem" />
				</a>
			</Link>
			<button
				onClick={() => setShowMobileMenu((prev) => !prev)}
				id="dropdownDefault"
				data-dropdown-toggle="dropdown"
				className="mt-3 inline-flex items-center rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 lg:hidden">
				תפריט <FaChevronDown className="ml-2" />
			</button>
			<div
				className={`z-50 flex-col ${
					showMobileMenu ? "flex" : "hidden"
				} mt-5 w-56 divide-y divide-gray-100 rounded bg-gray-200 text-center shadow-xl lg:mt-0 lg:flex lg:w-full lg:divide-y-0 lg:bg-transparent lg:shadow-none`}>
				<ul
					onClick={() => setShowMobileMenu(false)}
					className="text-gray-700 lg:flex lg:py-0 lg:text-white">
					<NavButton text="בית" href="/" className="pt-2 lg:pt-0" />
					<NavButton text="דיווח שעות" href="/report-hours" />
					<NavButton text="צפייה במערכת השעות" href="/schedule" />
					<NavButton
						text="לוח הבקרה"
						href="/dashboard"
						className="pb-2 lg:pb-0"
					/>
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
