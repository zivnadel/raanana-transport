import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "../ui/buttons/Button";
import CloseModalButton from "../ui/buttons/CloseModalButton";
import Modal from "../ui/modals/Modal";

const LoginModal: React.FC = () => {
	const router = useRouter();

	return (
		<Modal>
			<CloseModalButton
				onClick={() => {
					router.push("/");
				}}
			/>
			<h1 className="m-5 text-center text-3xl font-semibold text-primary">
				לחץ על הכפתור למטה למעבר להתחברות
			</h1>
			<div className="w-full text-center">
				<Button className="my-5" onClick={() => signIn()}>
					התחבר
				</Button>
			</div>
		</Modal>
	);
};

export default LoginModal;
