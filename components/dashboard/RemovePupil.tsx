import React from "react";
import { DashboardContext } from "../../store/DashboardContext";
import { LoadingContext } from "../../store/LoadingContext";
import { _delete } from "../../utils/http";
import Button from "../ui/buttons/Button";
import Input from "../ui/inputs/Input";
import Modal from "../ui/modals/Modal";
import ErrorParagraph from "../ui/paragraphs/ErrorParagraph";

const RemovePupil: React.FC = () => {
  const dashboardContext = React.useContext(DashboardContext);

  const [firstTimeClicked, setFirstTimeClicked] = React.useState(false);
  const [name, setName] = React.useState("");
  const [showError, setShowError] = React.useState(false);

  const { isLoading, setIsLoading } = React.useContext(LoadingContext)!;

  const onModalDismissedHandler = () => {
    dashboardContext?.action({ type: "setShowRemovePupil", payload: false });
  };

  const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setShowError(false);
  };

  const submitHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!firstTimeClicked) {
      setFirstTimeClicked(true);
      return;
    }

    setIsLoading(true);
    const { response } = await _delete("/api/pupils", { name });
    setIsLoading(false);

    if (response.deletedCount) {
      alert("התלמיד נמחק בהצלחה ממאגר המידע!");
      dashboardContext?.action({ type: "setShowRemovePupil", payload: false });
    } else {
      setShowError(true);
      setFirstTimeClicked(false);
      setName("");
    }
  };

  return (
    <>
      {!isLoading && (
        <Modal
          onDismiss={onModalDismissedHandler}
          heading={
            !firstTimeClicked
              ? "הסרת תלמיד ממאגר המידע"
              : "לחצי פעם נוספת לאישור"
          }
        >
          <form
            onSubmit={submitHandler}
            className="flex w-full flex-col items-center justify-center p-3"
          >
            <Input
              onChange={nameChangedHandler}
              value={name}
              name="name"
              type="text"
              label="שם מלא"
            />
            {showError && <ErrorParagraph error="!תלמיד זה אינו קיים" />}
            <Button type="submit" className="mt-5">
              הסרה
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default RemovePupil;
