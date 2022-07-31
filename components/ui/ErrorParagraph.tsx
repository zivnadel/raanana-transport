import { MdError } from "react-icons/md"

interface Props {
	error: string;
}

const ErrorParagraph: React.FC<Props> = ({ error }) => {
	return (
		<div className="mt-3 p-3 flex flex-col items-center w-full">
            <MdError className="text-red-500 w-6 h-6 mb-1" />
			<p className="p-2 text-center font-medium text-red-500">{error}</p>
		</div>
	);
};

export default ErrorParagraph;
