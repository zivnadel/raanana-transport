import { FaWindowClose } from "react-icons/fa";

interface Props {
	onClick: React.MouseEventHandler<SVGElement>;
}

const CloseModalButton: React.FC<Props> = ({ onClick }) => {
	return (
		<FaWindowClose
			onClick={onClick}
			className="ml-auto mt-3 mr-3 cursor-pointer text-2xl text-primary hover:opacity-80"
		/>
	);
};

export default CloseModalButton;
