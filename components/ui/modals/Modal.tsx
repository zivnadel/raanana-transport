import CloseModalButton from "../buttons/CloseModalButton";

interface Props {
	children?: React.ReactNode;
	onDismiss?: React.MouseEventHandler<SVGElement>;
	heading?: string;
	className?: string;
}

const Modal: React.FC<Props> = ({
	children,
	onDismiss,
	heading,
	className,
}) => {
	return (
		// Modal backdrop
		<div className="fixed top-0 left-0 z-50 flex h-full w-full overflow-y-auto overflow-x-hidden bg-gray-600 bg-opacity-40">
			{/* Modal Flex Container */}
			<div className={`flex w-full items-center py-5 justify-center ${className}`}>
				{/* Modal Content */}
				<div className="w-10/12 my-auto max-w-md rounded-lg bg-white shadow">
					{onDismiss && <CloseModalButton onClick={onDismiss} />}
					<h2 className="p-2 text-center text-2xl text-primary">{heading}</h2>
					{children}
				</div>
			</div>
		</div>
	);
};

export default Modal;
