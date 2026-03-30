import React, { useState } from "react";
import LogoInovag from "../../LogoInovag";
import bgImage from "assets/images/illustrations/slide.jpg";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import MDTypography from "components/MDTypography";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import { emailValid } from "../../../../Global/Expressions";
import { sendRecoverPassword } from "./Repository/RecoverPasswordService";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Grid, IconButton, Tooltip } from '@mui/material';

const RecoverPassword = ({ userLogin }) => {
   const [email, setEmail] = useState("");
   const [message, setMessage] = useState({
      isShow: false,
   });
   const [isDisableEmail, setIsDisableEmail] = useState(false);
   const [isDisableSMS, setIsDisableSMS] = useState(false);
   const [isAlertValide, setIsAlertValide] = useState(false);
   const navigate = useNavigate();

   useEffect(() => {
      setEmail(userLogin);
   }, []);

   const sendEmail = (e) => {
      e.preventDefault();
      sendSelection(2,1);
      setIsDisableEmail(!isDisableEmail);
   }

   const sendSMS = (e) => {
      e.preventDefault();
      sendSelection(2,0);
      setIsDisableSMS(!isDisableSMS);
   }

   /** Metodo para el envio del mensaje
    * 
    * @param {*} action 1- Email, 2- SMS
    */
   const sendSelection = async (action, llamada) => {
      try {
         if (emailValid(email.trim())) {
            await sendRecoverPassword(email.trim(), action, llamada).then((data) => {
               if (data.code === 0) {
                  setMessage({
                     isShow: true,
                     text: llamada === 1 ? 'La llamada se realizara en un momento, se te direccionará a otra pantalla. Espere...' : 'El Mensaje ha sido enviado, se te direccionará a otra pantalla. Espere..',
                     type: 'success',
                  });
                  setIsAlertValide(true);
                  if (action === 2) {
                     setTimeout(() => {
                        navigate("/recoverSMS");
                     }, 4000);
                  } else if (action === 1) {
                     setTimeout(() => {
                        navigate("/SignIn");
                     }, 3000);
                  }
               }
            }).catch((error) => {
               if (error.data.code === 3001) {
                  setMessage({
                     isShow: true,
                     text: error.data.businessMeaning,
                     type: 'error',
                  });
                  setIsAlertValide(true);
               } else {
                  setMessage({
                     isShow: true,
                     text: error.data.businessMeaning,
                     type: 'error',
                  });
                  setIsAlertValide(true);
               }
            });
         }
      } catch (error) {
         setMessage({
            isShow: true,
            text: error.name + ' ' + error.message,
            type: 'error',
         });
         setIsAlertValide(true);
      }
   };

   const toBack = () => {
      navigate('/SignIn');
   }

   return (
      <IllustrationLayout
         illustration={bgImage}
      >
         <MDBox>
            <MDBox mb={2}>
               <LogoInovag />
            </MDBox>
            {isAlertValide && <MDAlert color={message.type} >{message.text}</MDAlert>}
            <MDBox mt={5}>
               <Grid container>
                  <Grid item>
                     <Tooltip placement="top" title="Regresar">
                        <IconButton onClick={toBack} sx={{ background: '#ebebeb', borderColor: 'black', color: "#41464b" }}>
                           <ArrowBackIcon />
                        </IconButton>
                     </Tooltip>
                  </Grid>
                  <Grid item mt={1} ml={1}>
                     <MDTypography variant="h5" fontWeight="medium">
                        {email}
                     </MDTypography>
                  </Grid>
               </Grid>
               <MDBox mt={4} mb={1}>
                  <MDButton variant="gradient" style={{ backgroundColor: "#ff5f00" }} size="large" fullWidth onClick={sendEmail} disabled={isDisableEmail}>
                     <MDTypography variant="h7" color="white">ENVIAR POR LLAMADA</MDTypography>
                  </MDButton>
               </MDBox>
               <MDBox mt={4} mb={1}>
                  <MDButton variant="gradient" style={{ backgroundColor: "#ff5f00" }} size="large" fullWidth onClick={sendSMS} disabled={isDisableSMS}>
                     <MDTypography variant="h7" color="white">ENVIAR POR SMS</MDTypography>
                  </MDButton>
               </MDBox>
            </MDBox>
         </MDBox>
      </IllustrationLayout>
   )
}

export default RecoverPassword;