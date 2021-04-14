import React from "react";
import { FaSpinner } from "react-icons/fa";

import { SubmitBtn } from "../../styles/utils";

function SubmitButton({ children, loading }) {
  return (
    <SubmitBtn loading={loading ? 1 : 0}>
      {loading ? <FaSpinner color="#fff" size={14} /> : children}
    </SubmitBtn>
  );
}

export default SubmitButton;
