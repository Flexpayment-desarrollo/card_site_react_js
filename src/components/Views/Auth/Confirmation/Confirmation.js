import React from "react";
import RegistrationForm from "../RegistrationForm";
import { useEffect } from "react";
import { useState } from "react";
import { getImageURL } from "./Repository/ConfirmationService";
import { useSearchParams, useNavigate } from 'react-router-dom';

const Confirmation = () => {

   const [searchParams] = useSearchParams();
   const valueLink = searchParams.get("val");
   const [imageURL, setImageURL] = useState("");
   const [isLinkValid, setIsLinkValid] = useState(false);
   const navigate = useNavigate();

   useEffect(() => {
      getImage(valueLink);
   }, []);

   async function getImage(valueLink) {
      await getImageURL(valueLink).then((data) => {
         if (data.code === 0) {
            setIsLinkValid(true);
            setImageURL(data.data.qrCodeSetupImageUrl);
         }
      }).catch((error) => {
         if (error.status === 200) {
            if (error.data.code === 3001) {
               navigate("/ErrorLink");
            }
         } else {
            navigate("/ErrorLink");
         }
      });
   }

   return (
      <>

         {isLinkValid ?
            <RegistrationForm src={imageURL} action="confirmation" link={valueLink} />
            : null}
      </>
   )
}

export default Confirmation;