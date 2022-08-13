import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
	labels: string[];
	tableBody: React.ReactNode[][];
	className?: string;
}

const Table: React.FC<Props> = ({ labels, tableBody, className }) => {
	return (
		<div
			className={twMerge(
				`relative w-full rounded-lg p-5 shadow-md ${className}`
			)}>
			<table className="w-full text-center text-sm text-gray-500">
				<thead className="bg-gray-50 text-xs text-gray-700">
					<tr>
						{labels.map((label, labelIndex) => (
							<th key={labelIndex} scope="col" className="py-3 px-6">
								{label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{tableBody.map((entry, entryIndex) => (
						<tr
							key={`tr-${entryIndex}`}
							className="border-b bg-white hover:bg-gray-50">
							{entry.map((node, nodeIndex) => (
								<td key={`td-${nodeIndex}`} className="py-4 px-6">
									{node}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
