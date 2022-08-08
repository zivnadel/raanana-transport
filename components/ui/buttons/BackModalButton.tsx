import { IoArrowBackCircleSharp } from "react-icons/io5";

interface Props {
	onClick: React.MouseEventHandler<SVGElement>;
}

const BackModalButton: React.FC<Props> = ({ onClick }) => {
	return (
		<IoArrowBackCircleSharp
			onClick={onClick}
			className="mr-auto mt-3 ml-3 cursor-pointer text-3xl text-primary hover:opacity-80"
		/>
	);
};

export default BackModalButton;
