import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getImageURL } from "../RecoverPassword/Repository/RecoverService";
import RegistrationForm from "../RegistrationForm";
import MDBox from "components/MDBox";

const Recover = () => {
   const [searchParams] = useSearchParams();
   const imagen = searchParams.get("val");
   const code = searchParams.get("val2");
   const [imageURL, setImageURL] = useState("");
   const [email, setEmail] = useState("");
   const navigate = useNavigate();
   const [isLinkValid, setIsLinkValid] = useState(false);

   useEffect(() => {
      getImage(imagen, code);
   }, []);

   async function getImage(imagen, code) {
      await getImageURL(imagen, code).then((data) => {
         if (data.code === 0) {
            setIsLinkValid(true);
            setEmail(data.data.email);
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
      <MDBox>
         {isLinkValid ? <RegistrationForm src={imageURL} action="recover" code={code} email={email} /> : null}
      </MDBox>
   );
}

export default Recover;