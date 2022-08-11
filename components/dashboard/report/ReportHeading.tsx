import React from "react";

interface Props {
	children: React.ReactNode;
}

const ReportHeading: React.FC<Props> = ({ children }) => {
	return (
		<div className="mb-5 mt-12 rounded-full bg-opacity-50 bg-gradient-to-r from-primary to-secondary px-5 py-3 shadow-md">
			<h1 className="text-center text-3xl font-semibold text-white">
				{children}
			</h1>
		</div>
	);
};

export default ReportHeading;
