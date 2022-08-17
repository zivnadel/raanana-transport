import { BsCheckCircleFill } from "react-icons/bs";

interface Props {
	message: string;
}

const ErrorParagraph: React.FC<Props> = ({ message }) => {
	return (
		<div className="mt-3 flex w-full flex-col items-center p-3">
			<BsCheckCircleFill className="mb-1 h-6 w-6 text-green-700" />
			<p className="p-2 text-center font-medium text-green-700">{message}</p>
		</div>
	);
};

export default ErrorParagraph;
