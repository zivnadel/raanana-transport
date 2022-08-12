import React from "react";

interface Props {
	labels: string[];
	tableBody: React.ReactNode[][];
}

const Table: React.FC<Props> = ({ labels, tableBody }) => {
	return (
		<div className="relative w-full rounded-lg p-5 shadow-md">
			<table className="w-full text-center text-sm text-gray-500">
				<thead className="bg-gray-50 text-xs text-gray-700">
					{labels.map((label, labelIndex) => (
						<th key={labelIndex} scope="col" className="py-3 px-6">
							{label}
						</th>
					))}
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
