import React from "react";

interface Props {
	children?: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const ContainerButton: React.FC<Props> = ({ children, onClick }) => {
	return (
		<button
			onClick={onClick}
			className="text-center rounded-md bg-gray-300 p-1.5 hover:bg-gray-400">
			{children}
		</button>
	);
};

export default ContainerButton;
