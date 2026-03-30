import React, { useState } from "react";
import LogoInovag from "../../LogoInovag";
import bgImage from "assets/images/illustrations/slide.jpg";
import RegistrationForm from "../RegistrationForm";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import { getImageSMS } from "./Repository/RecoverSMSService";
import { sha3_512 } from 'js-sha3';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { emailValid, codeValid } from '../../../../Global/Expressions';
import MDTypography from "components/MDTypography";
import { GoogleAuth } from "Global/GoogleAuth";

const RecoverSMS = ({ userLogin }) => {
   const navigate = useNavigate();
   const [imageURL, setImageURL] = useState('');
   const [isSuccess, setIsSuccess] = useState(false);
   const [isAlertValide, setIsAlertValide] = useState(false);
   const [user, setUser] = useState({
      email: '',
      code: ''
   });
   const [message, setMessage] = useState({
      isShow: false,
   });

   const handleChange = (event) => {
      const { name, value } = event.target;
      setUser(
         (prevState) => {
            return {
               ...prevState,
               [name]: value
            }
         }
      );
      setIsAlertValide(false);
      setMessage({
         isShow: false,
      });
   }
   const handleKeyDetectPin = (value) => {
      setUser(
         (prevState) => {
            return {
               ...prevState,
               code: value.Pin1 + value.Pin2 + value.Pin3 + value.Pin4 + value.Pin5 + value.Pin6,
            };
         }
      );
      setIsAlertValide(false)
      setMessage({
         isShow: false,
      });
   }

   useEffect(() => {
      setUser({
         email: userLogin,
         code: ''
      });
   }, []);

   /** Metodo que obtiene la Imagen QR */
   async function getImage() {
      await getImageSMS(user).then((data) => {
         if (data.code === 0) {
            setImageURL(data.data.qrCodeSetupImageUrl);
            setIsSuccess(true);
         }
      }).catch((error) => {
         if (error.status === 200) {
            if (error.data.code === 3029) {
               setMessage({
                  isShow: true,
                  text: error.data.businessMeaning,
                  type: 'error',
               });
               setIsAlertValide(true);
            } else if (error.data.code === 3001) {
               setMessage({
                  isShow: true,
                  text: 'Correo o Código no válido',
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
         }
      });
   }

   /** Valida el codigo del SMS */
   const validateCode = (e) => {
      if (e !== undefined)
         e.preventDefault();
      try {
         if (user.email.trim()) {
            if (emailValid(user.email.trim())) {
               if (codeValid(user.code.trim())) {
                  getImage();
               }
            }
         } else {
            throw new Error('Por favor ingresa el correo electrónico.')
         }
      } catch (error) {
         setMessage({
            isShow: true,
            text: error.name + ' ' + error.message,
            type: 'error',
         });
         setIsAlertValide(true);
      }
   }

   const toBack = () => {
      navigate('/recover_password');
   }

   return (
      <>
         <MDBox>
            {
               isSuccess ? <RegistrationForm src={imageURL} email={user.email} code={sha3_512(user.code)} action="recoverSMS" /> :
                  <IllustrationLayout
                     illustration={bgImage}
                  >
                     <MDBox mb={5} mt={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <LogoInovag />
                     </MDBox>
                     <MDBox>
                        {isAlertValide && <MDAlert color={message.type} >{message.text}</MDAlert>}
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
                                 {user.email}
                              </MDTypography>
                           </Grid>
                        </Grid>
                     </MDBox>
                     <MDBox>
                        <MDBox mb={2} mt={4}>
                           <GoogleAuth autofocus={true} login={true} keyDetect={handleKeyDetectPin} enter={validateCode} />
                        </MDBox>
                        <MDBox>
                           <MDBox mt={4} mb={1}>
                              <MDButton variant="gradient" style={{ backgroundColor: "#ff5f00" }} size="large" fullWidth onClick={validateCode}>
                                 <MDTypography variant="h7" color="white">VALIDAR CÓDIGO</MDTypography>
                              </MDButton>
                           </MDBox>
                           <MDBox mt={4} mb={1}>
                              <MDButton variant="gradient" style={{ backgroundColor: "#ff5f00" }} size="large" fullWidth onClick={toBack}>
                                 <MDTypography variant="h7" color="white">CAMBIAR MODO DE ENVÍO</MDTypography>
                              </MDButton>
                           </MDBox>
                        </MDBox>
                     </MDBox>
                  </IllustrationLayout>
            }
         </MDBox>
      </>
   )
}

export default RecoverSMS;