import { useRouter } from "next/router";
import Button from "../components/ui/buttons/Button";
import CloseModalButton from "../components/ui/buttons/CloseModalButton";
import Modal from "../components/ui/modals/Modal";

const UnauthorizedModal: React.FC = () => {
	const router = useRouter();

	return (
		<Modal>
			<CloseModalButton
				onClick={() => {
					router.push("/");
				}}
			/>
			<h1 className="m-5 text-center text-3xl font-semibold text-primary">
				אינך יכול לגשת לעמוד זה
			</h1>
			<div className="w-full text-center">
				<Button className="my-5" onClick={() => router.push("/")}>
					אישור
				</Button>
			</div>
		</Modal>
	);
};

export default UnauthorizedModal;
