import React, { useContext, useState } from "react";
import { useFetch } from "../../hooks/useFetch";

import { DashboardContext } from "../../store/DashboardContext";
import { LoadingContext } from "../../store/LoadingContext";
import PricesObjectType from "../../types/PricesObjectType";
import Button from "../ui/buttons/Button";

import InputWithIcon from "../ui/inputs/InputWithIcon";
import Modal from "../ui/modals/Modal";

const PricesForm: React.FC<any> = ({}) => {
  const dashboardContext = useContext(DashboardContext);

  const { response: initialPrices } = useFetch<PricesObjectType>(
    "/api/prices",
    React.useMemo(() => ({ method: "GET" }), [])
  );
  const [currentPrices, setCurrentPrices] = useState<PricesObjectType>();
  const { isLoading, setIsLoading } = React.useContext(LoadingContext)!;

  React.useEffect(() => {
    if (initialPrices) {
      setCurrentPrices(initialPrices);
    }
  }, [initialPrices]);

  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const onModalDismissedHandler = () => {
    dashboardContext!.action({ type: "setShowPrices", payload: false });
  };

  const priceChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPrices((prevState) => {
      return {
        ...prevState,
        [event.target.id]: +event.target.value,
      } as PricesObjectType;
    });
  };

  const pricesSubmittedHandler = async () => {
    let flag = true;

    Object.entries(currentPrices!).map((price) => {
      if (!(price[1] > 0)) {
        setShowErrorMessage(true);
        flag = false;
      }
    });

    if (flag) {
      setIsLoading(true);
      const response = await fetch("/api/prices", {
        method: "PUT",
        body: JSON.stringify(currentPrices),
      });
      setIsLoading(false);
      dashboardContext!.action({ type: "setShowPrices", payload: false });
      if (response.status === 201) {
        dashboardContext!.action({
          type: "setPrices",
          payload: currentPrices!,
        });
        alert("המידע עודכן בהצלחה!");
      } else {
        alert("אירעה שגיאה! רענני את העמוד או נסי מאוחר יותר");
      }
    }
  };

  return (
    <>
      {initialPrices && !isLoading && (
        <Modal onDismiss={onModalDismissedHandler} heading="מחירים">
          <div className="flex flex-col items-center">
            {Object.entries(initialPrices).map((price: any) => {
              return (
                <InputWithIcon
                  onChange={priceChangedHandler}
                  key={price[0]}
                  name={price[0]}
                  type="number"
                  value={price[1].toString()}
                  label={convertToHebrew(price[0])}
                />
              );
            })}
            {showErrorMessage && (
              <p className="text-m mt-5 text-right text-red-600">
                !נא למלא מחירים תקינים
              </p>
            )}
            <Button
              onClick={pricesSubmittedHandler}
              className="mt-6 mb-3 p-3 md:w-5/12"
            >
              אישור
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

function convertToHebrew(str: string): string {
  switch (str) {
    case "morning":
      return "בוקר";
    case "p8":
      return "אנשים" + "\u200e" + " 8";
    case "p16":
      return "אנשים" + "\u200e" + " 16";
    case "p20":
      return "אנשים" + "\u200e" + " 20";
    case "p23":
      return "אנשים" + "\u200e" + " 23";
    case "midi":
      return "מידיבוס";
    default:
      return "";
  }
}

export default PricesForm;
