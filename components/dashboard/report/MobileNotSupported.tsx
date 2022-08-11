import { useRouter } from "next/router";
import ErrorParagraph from "../../ui/ErrorParagraph";
import Modal from "../../ui/modals/Modal";

const MobileNotSupported: React.FC = () => {
	const router = useRouter();

	return (
		<div className="md:hidden">
			<Modal onDismiss={() => router.push("/dashboard")}>
				<ErrorParagraph error={"עמוד זה אינו נתמך במובייל"} />
			</Modal>
		</div>
	);
};

export default MobileNotSupported;
