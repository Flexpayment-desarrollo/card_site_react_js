import React from "react";
import LogoInovag from "../LogoInovag";
import ScreenSuccess from "./ScreenSuccess";
import InfoIcon from '@mui/icons-material/Info';
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import bgImage from "assets/images/illustrations/slide.jpg";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import { useState } from "react";
import { confirmationPassword, confirmationPasswordSMS } from "./Confirmation/Repository/ConfirmationService";
import { passwordValid } from '../../../Global/Expressions';
import { changePassword } from "./RecoverPassword/Repository/RecoverService";
import { Grid, Tooltip } from '@mui/material';
import { encryptPassword } from "../../../Global/EncryptPassword";
import MDTypography from "components/MDTypography";

const RegistrationForm = (props) => {
   const [user, setUser] = useState({
      newPassword: "",
      confirmPassword: ""
   });
   const [errorMessage, setErrorMessage] = useState('');
   const [isAlertValide, setIsAlertValide] = useState(false);
   const [message, setMessage] = useState({
      isShow: false,
   });
   const [isSuccess, setIsSuccess] = useState({
      flag: false,
      message: ""
   });

   const tips = `
   Mínimo 8 caracter; 
   Minimo 1 letra minuscula;
   Minimo 1 letra mayuscula;
   Minimo 1 número;
   Minimo 1 caracter especial`;

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
      setErrorMessage("");
      setIsAlertValide(false);
      setMessage({
         isShow: false,
      });
   }

   /** Metodo para validar la accion del boton
    * @param {*} action Nombre del metodo
    * @return Nombre el metodo a llamar
    */
   const actionButton = (action) => {
      switch (action) {
         case "confirmation":
            return confirmation;
         case "confirmationSMS":
            return confirmationSMS;
         case "recover":
            return changePass;
         case "recoverSMS":
            return changePass;
         default:
            return "";
      }
   }

   /** Metodo para cambiar la contraseña por Correo o SMS
    * 
    * @param {*} e 
    * @param {*} email Correo del Usuario
    * @param {*} newPassword Nuevo Passeword
    * @param {*} Code Codigo del SMS
    */
   const changePass = async (e) => {
      e.preventDefault();
      try {
         if (user.newPassword === user.confirmPassword) {
            if (passwordValid(user.newPassword)) {
               await changePassword(props.email, encryptPassword(user.newPassword), props.code).then((data) => {
                  if (data.code === 0) {
                     setIsSuccess({
                        flag: true,
                        message: "Se ha cambiado su contraseña correctamente"
                     });
                  }
               }).catch((err) => {
                  setMessage({
                     isShow: true,
                     text: err,
                     type: 'error',
                  });
                  setIsAlertValide(true);
               });
            }
         } else {
            setMessage({
               isShow: true,
               text: 'Las contraseñas no coinciden',
               type: 'error',
            });
            setIsAlertValide(true);
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

   /**Metodo para enviar al confirmacion por correo
    * 
    * @param {*} link Valor del correo 
    * @param {*} password contraseña del usuario 
    */
   const confirmation = async (e) => {
      e.preventDefault();
      try {
         if (user.newPassword.trim()) {
            if (user.newPassword === user.confirmPassword) {
               if (passwordValid(user.newPassword)) {
                  await confirmationPassword(props.link, encryptPassword(user.newPassword)).then((data) => {
                     if (data.code === 0) {
                        setIsSuccess({
                           flag: true,
                           message: "Su registro ha sido completado correctamente."
                        });
                     }
                  }).catch((err) => {
                     setMessage({
                        isShow: true,
                        text: err.message,
                        type: 'error',
                     });
                     setIsAlertValide(true);
                  });
               }
            } else {
               setMessage({
                  isShow: true,
                  text: "Las contraseñas no coinciden",
                  type: 'error',
               });
               setIsAlertValide(true);
            }
         } else {
            setMessage({
               isShow: true,
               text: "Por favor, ingresa una contraseña",
               type: 'error',
            });
            setIsAlertValide(true);
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

   /**Metodo para enviar al confirmacion por correo
    * 
    * @param {*} email correo del correo 
    * @param {*} password contraseña del usuario 
    * @param {*} code Codigo SMS 
    */
   const confirmationSMS = async (e) => {
      e.preventDefault();
      try {
         if (user.newPassword.trim()) {
            if (user.newPassword === user.confirmPassword) {
               if (passwordValid(user.newPassword)) {
                  await confirmationPasswordSMS(props.email, encryptPassword(user.newPassword), props.code).then((data) => {
                     if (data.code === 0) {
                        setIsSuccess({
                           flag: true,
                           message: "Su registro ha sido completado correctamente."
                        });
                     }
                  }).catch((err) => {
                     setMessage({
                        isShow: true,
                        text: err.message,
                        type: 'error',
                     });
                     setIsAlertValide(true);
                  });
               }
            } else {
               setMessage({
                  isShow: true,
                  text: 'Las contraseñas no coinciden',
                  type: 'error',
               });
               setIsAlertValide(true);
            }
         } else {
            setMessage({
               isShow: true,
               text: "Por favor ingresa una contraseña",
               type: 'error',
            });
            setIsAlertValide(true);
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

   const { newPassword, confirmPassword } = user;
   return (
      <>
         <IllustrationLayout
            illustration={bgImage}
         >
            {
               isSuccess.flag ?
                  <MDBox>
                     <ScreenSuccess message={isSuccess.message} />
                  </MDBox>
                  :
                  <MDBox>
                     <Grid container>
                        <Grid sx={{ alignItems: 'center' }} item sm={12}>
                           <LogoInovag />
                        </Grid>
                        <Grid item sm={12} mt={3}>
                           <blockquote className="blockquote" style={{ textAlign: 'center' }}>
                              <p className="text-black-50 mb-0" style={{ fontSize: 20 }}>1. Escanea el QR con <span>Google Authenticator</span></p>
                              <p className="text-black-50 mb-0" style={{ fontSize: 14 }}>&nbsp;&nbsp;&nbsp;&nbsp;Si aún cuentas con tu PIN, omite este paso.</p>
                              <div className="imgQR">
                                 <img src={props.src} width={180} height={180} alt="QR" />
                              </div>
                              <p className="text-black-50 mb-0" style={{ fontSize: 21 }}>2. Ingrese una nueva contraseña <Tooltip placement="top" title={tips} sx={{ background: '#ebebeb', borderColor: 'black', color: "#41464b" }}>
                                 <InfoIcon />
                              </Tooltip></p>
                           </blockquote>
                           {isAlertValide && <MDAlert color={message.type} >{message.text}</MDAlert>}
                           <MDBox mt={3} style={{ textAlign: "center" }}>
                              <MDBox mb={2}>
                                 <MDInput type="password" name="newPassword" label="Nueva Contraseña" fullWidth value={newPassword} onChange={handleChange} />
                              </MDBox>
                              <MDBox mb={2}>
                                 <MDInput type="password" name="confirmPassword" label="Confirmar Contraseña" fullWidth value={confirmPassword} onChange={handleChange} />
                              </MDBox>
                              <MDBox mt={4} mb={1}>
                                 <MDButton variant="gradient" style={{ backgroundColor: "#ff5f00" }} size="large" fullWidth onClick={actionButton(props.action)}>
                                    <MDTypography variant="h7" color="white">VALIDAR CUENTA</MDTypography>
                                 </MDButton>
                              </MDBox>
                           </MDBox>
                        </Grid>
                     </Grid>
                  </MDBox>
            }
         </IllustrationLayout>

      </>
   )
}
export default RegistrationForm;