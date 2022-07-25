interface Props {
	id: string;
	value: string;
	label: string;
}

const DisabledInput: React.FC<Props> = ({ id, value, label }) => {
	return (
		<div className="mt-3 flex flex-row-reverse items-center justify-center">
			<label className="mb-6 p-2.5 font-medium" htmlFor={id}>
				{label}
			</label>
			<input
				type="text"
				id={id}
				className="mb-6 block w-3/6 cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 p-2.5 text-right text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
				value={value}
				disabled
                required
			/>
		</div>
	);
};

export default DisabledInput;
