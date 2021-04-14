import { useEffect, useState } from "react";

function SubmitButtonApp({
  children,
  loading,
  color,
  size = null,
  disabled = null,
}) {
  const [spinnerSize, setSpinnerSize] = useState(1);

  useEffect(() => {
    switch (size) {
      case "lg":
        setSpinnerSize(1.5);
        break;
      default:
        break;
    }
  }, [size]);

  return (
    <button
      type="submit"
      className={`btn btn-${color} ${size && `btn-${size}`} text-white`}
      loading={loading ? 1 : 0}
      disabled={disabled ? disabled : loading ? 1 : 0}
    >
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm mr-2"
            style={{ width: `${spinnerSize}rem`, height: `${spinnerSize}rem` }}
            role="status"
            aria-hidden="true"
          ></span>
          Aguarde...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default SubmitButtonApp;
