import React from "react";
import { twMerge } from "tailwind-merge";
import BackModalButton from "../buttons/BackModalButton";
import CloseModalButton from "../buttons/CloseModalButton";
import ErrorAlert from "./ErrorAlert";

interface Props {
	children?: React.ReactNode;
	onDismiss?: React.MouseEventHandler<SVGElement> | undefined;
	onBackPressed?: React.MouseEventHandler<SVGElement> | undefined;
	heading?: string;
	className?: string;
	error?: string;
}

const Modal: React.FC<Props> = ({
	children,
	onDismiss,
	onBackPressed,
	heading,
	className,
	error,
}) => {
	React.useEffect(() => {
		document.body.classList.add("overflow-hidden");
		return () => {
			document.body.classList.remove("overflow-hidden");
		};
	}, []);

	return (
		// Modal backdrop
		<div className="fixed top-0 left-0 z-50 flex h-full w-full flex-col justify-center overflow-y-auto overflow-x-hidden bg-gray-600 bg-opacity-40">
			{error && (
				<div className="fixed top-0 left-0 flex w-full justify-center">
					<ErrorAlert
						className="m-3 w-5/6 md:w-3/6"
						boldText="אירעה שגיאה"
						text={error}
						closeAlertClicked={onDismiss!}
					/>
				</div>
			)}
			{/* Modal Flex Container */}
			<div
				className={twMerge(
					`flex h-full w-full items-center justify-center py-5 ${className}`
				)}>
				{/* Modal Content */}
				<div className="my-auto w-10/12 max-w-md rounded-lg bg-white shadow">
					<div className="flex">
						{onBackPressed && <BackModalButton onClick={onBackPressed} />}
						{onDismiss && <CloseModalButton onClick={onDismiss} />}
					</div>
					<h2 className="p-2 text-center text-2xl text-primary">{heading}</h2>
					{children}
				</div>
			</div>
		</div>
	);
};

export default Modal;
