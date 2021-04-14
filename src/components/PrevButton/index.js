import { FaArrowLeft } from "react-icons/fa";
import { useHistory } from "react-router-dom";

function PrevButton({ color, isButton = true, size = "", url = "" }) {
  const history = useHistory();

  function handleBack() {
    if (url) {
      history.push(url);
    } else {
      history.goBack();
    }
  }

  return (
    <>
      <button
        className={`btn btn-${
          isButton ? color : `link text-${color}`
        } btn-${size}`}
        onClick={handleBack}
      >
        <FaArrowLeft className="mr-1" />
        Voltar
      </button>
    </>
  );
}

export default PrevButton;
