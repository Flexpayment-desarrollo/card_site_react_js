import React, { useEffect } from "react";
import { deleteStorage } from "Global/Expressions";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.length !== 0) {
      navigate('/Cards')
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
