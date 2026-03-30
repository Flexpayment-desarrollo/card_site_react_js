import { deleteStorage } from "Global/Expressions";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.length !== 0) {
      navigate('/Client')
    }
    else {
      deleteStorage();
      navigate("SignIn");
    }
  })
  return (
    <></>
  );
};
export default Error;
