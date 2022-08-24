import { useRouter } from "next/router";
import Modal from "../../ui/modals/Modal";
import ErrorParagraph from "../../ui/paragraphs/ErrorParagraph";

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
