import { AiFillCloseCircle } from "react-icons/ai"

interface Props {
	onClick: React.MouseEventHandler<SVGElement>;
}

const CloseModalButton: React.FC<Props> = ({ onClick }) => {
	return (
		<AiFillCloseCircle
			onClick={onClick}
			className="ml-auto mt-3 mr-3 cursor-pointer text-3xl text-primary hover:opacity-80"
		/>
	);
};

export default CloseModalButton;
