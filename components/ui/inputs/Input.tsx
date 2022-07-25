interface Props {
	name: string;
	label: string;
	type: string;
	required?: boolean;
	value?: string
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Input: React.FC<Props> = ({ name, label, type, required, value, onChange }) => {
	return (
		<div className="relative z-0 m-3 w-10/12">
			<input
				onChange={onChange}
				value={value}
				type={type}
				id={name}
				className="text-gray-900border-gray-500 peer block w-full appearance-none border-0 border-b-2 bg-transparent py-2.5 px-0 text-right text-sm focus:border-primary focus:outline-none focus:ring-0"
				placeholder=" "
				required={required}
			/>
			<label
				htmlFor={name}
				className="absolute right-0 top-3 -z-10 -translate-y-6 scale-75 transform text-sm text-gray-700 duration-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:right-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary">
				{label}
			</label>
		</div>
	);
};

export default Input;
