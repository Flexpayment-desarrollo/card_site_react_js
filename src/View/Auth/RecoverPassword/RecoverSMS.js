import React, { useState } from "react";
import Loading from "Global/Loading/Loading";
import validator from 'validator';
import LogoInovag from "View/LogoInovag";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDAlert from "components/MDAlert";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import bgImage from "assets/images/illustrations/slide.jpg";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleAuth } from "Global/GoogleAuth";
import { grey } from "@mui/material/colors";
import { passwordValid } from "Global/Expressions";
import { sendRecoverPassword } from "Services/Auth/Service_Register";
import { Info } from "@mui/icons-material";
import { ModalConfirmation } from "Global/ModalConfirmation";
import { pinValid } from "Global/Expressions";
import { Card, Grid, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';

const RecoverSMS = () => {
   const navigate = useNavigate();
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
   const location = useLocation();
   const { formLoginValue } = location.state || {};
   const [loading, setLoading] = useState(false);
   const [isAlertValide, setIsAlertValide] = useState(false);
   const [modalConfirmarGuardar, setModalConfirmarGuardar] = useState(false);
   const [user2, setUser2] = useState({
      newPassword: "",
      confirmPassword: ""
   });
   const [user, setUser] = useState({
      email: '',
      pin: ''
   });
   const [message, setMessage] = useState({
      isShow: false,
   });
   const [errorFlag, setErrorFlag] = useState({
      password: false,
      passwordMsg: '',
   });

   useEffect(() => {
      setUser({
         email: formLoginValue.Username,
         pin: ''
      });
   }, []);

   const tips = `
   Mínimo 8 caracter; 
   Minimo 1 letra minuscula;
   Minimo 1 letra mayuscula;
   Minimo 1 número;
   Minimo 1 caracter especial`;

   /** Metodo para cambiar la contraseña por Correo o SMS
       * 
       * @param {*} e 
       * @param {*} email Correo del Usuario
       * @param {*} newPassword Nuevo Password
       * @param {*} Code Codigo del SMS
       */
   const changePass = async (e) => {
      if (e && e.preventDefault) e.preventDefault();
      setIsAlertValide(false);

      const datos = {
         Correo: user.email,
         Password: user2.newPassword,
         Pin: user.pin
      };

      try {
         setLoading(true);

         if (!passwordValid(datos.Password)) {
            setLoading(false);
            setMessage({ isShow: true, text: 'La contraseña no es válida', type: 'error' });
            setIsAlertValide(true);
            return;
         }

         if (!pinValid(user.pin.trim())) {
            setLoading(false);
            setMessage({ isShow: true, text: 'El formato del PIN es incorrecto', type: 'error' });
            setIsAlertValide(true);
            return;
         }
         const data = await sendRecoverPassword(datos);
         setLoading(false);
         if (data.code === 0) {

            setMessage({
               isShow: true,
               text: "Se ha cambiado su contraseña correctamente",
               type: 'success',
            });
            navigate("/successRecover");
         } else {
            setMessage({
               isShow: true,
               text: data.businessMeaning || "El código es incorrecto",
               type: 'error',
            });
            setIsAlertValide(true);
         }

      } catch (error) {
         setLoading(false);
         setMessage({
            isShow: true,
            text: error,
            type: 'error',
         });
         setIsAlertValide(true);
         const errorServerData = error.response ? error.response.data : null;
         if (errorServerData) {
            setMessage({
               isShow: true,
               text: errorServerData.businessMeaning || "El código de verificación es incorrecto",
               type: 'error',
            });
         } else {
            setMessage({
               isShow: true,
               text: error.message || "Error inesperado de conexión",
               type: 'error',
            });
         }
         setIsAlertValide(true);
      }
   };


   const handleChange = (event) => {
      const { name, value } = event.target;
      setUser2(
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
               pin: value.Pin1 + value.Pin2 + value.Pin3 + value.Pin4 + value.Pin5 + value.Pin6,
            };
         }
      );
      setIsAlertValide(false)
      setMessage({
         isShow: false,
      });
   }

   /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
   const handleCloseConfirmarGuardar = (e) => {
      if (e.target.name === "yesBtn") {
         setModalConfirmarGuardar(false);
         changePass(e);
      } else {
         if (e.target.name === "noBtn") {
            setModalConfirmarGuardar(false);
         }
      }
   };

   /*Método para validar que no haya errores en el formulario y si todo esta bien abrir el modal de confirmación*/
   const confirmar = (e) => {
      e.preventDefault();
      let validation = validateForm();
      if (validation) {
         setIsAlertValide(false);
         setModalConfirmarGuardar(true);
      }
   };

   /*Método que valida el formulario*/
   const validateForm = () => {
      let valid = true;
      let errorTemp = {
         password: false,
         passwordMsg: '',
      };

      if (user2.newPassword === "") {
         errorTemp.password = true;
         errorTemp.passwordMsg = "La contraseña no puede estar vacía";
         valid = false;
      } else if (!validator.isStrongPassword(user2.newPassword, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
         errorTemp.password = true;
         errorTemp.passwordMsg = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.";
         valid = false;
      } else if (user2.newPassword !== user2.confirmPassword) {
         errorTemp.password = true;
         errorTemp.passwordMsg = "Las contraseñas no coinciden";
         valid = false;
      }
      // 4. VALIDAR PIN VACÍO O INCOMPLETO
      // Usamos .trim() para evitar que espacios cuenten como caracteres
      if (valid && (!user.pin || user.pin.trim().length < 6)) {
         setMessage({
            isShow: true,
            text: "El código PIN es obligatorio y debe ser de 6 dígitos",
            type: 'error',
         });
         setIsAlertValide(true);
         valid = false;
      }
      setErrorFlag(errorTemp)
      return valid
   }

   const toBack = () => {
      navigate('/SignIn');
   }

   return (
      <>
         {loading && <Loading show={loading} />}
         {modalConfirmarGuardar && <ModalConfirmation showModal={modalConfirmarGuardar} message="¿Estás seguro de cambiar la contraseña?" closeModal={handleCloseConfirmarGuardar}></ModalConfirmation>}
         <MDBox>
            {
               <BasicLayout illustration={bgImage}>
                  <MDBox
                     px={2} // Margen de seguridad para móviles
                     width="100%"
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     minHeight="100vh"
                  >
                     <Card sx={{
                        // Ancho controlado: 90% en móvil, 450px en PC
                        width: isMobile ? "90%" : "450px",
                        minWidth: isMobile ? "100%" : "400px",
                        maxWidth: isMobile ? "100%" : "900px",
                        padding: isMobile ? "25px" : "40px",
                        borderRadius: "1rem",
                        //boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        margin: "auto",
                        textAlign: "center"
                     }}>

                        {/* Logo Centrado */}
                        <MDBox sx={{
                           width: "100%",
                           display: "flex",
                           justifyContent: "center",
                           mb: 4
                        }}>
                           <MDBox sx={{ width: isMobile ? "180px" : "220px" }}>
                              <LogoInovag />
                           </MDBox>
                        </MDBox>

                        {/* Cabecera con flecha de regreso */}
                        <MDBox display="flex" alignItems="center" mb={3}>
                           <Tooltip placement="top" title="Regresar">
                              <IconButton
                                 onClick={toBack}
                                 sx={{
                                    background: grey[100],
                                    color: "#41464b",
                                    '&:hover': { background: grey[200] }
                                 }}
                              >
                                 <ArrowBackIcon />
                              </IconButton>
                           </Tooltip>
                           <MDBox ml={2}>
                              <MDTypography variant="h5" fontWeight="bold" sx={{ color: grey[800] }}>
                                 Validar
                              </MDTypography>
                           </MDBox>
                        </MDBox>

                        <Grid item sm={12} mt={2}>
                           <blockquote className="blockquote" style={{ textAlign: 'center' }}>

                              <p className="text-black-50 mb-0" style={{ fontSize: 21 }}>Ingrese una nueva contraseña <Tooltip placement="top" title={tips} sx={{ background: '#ebebeb', borderColor: 'black', color: "#41464b" }}>
                                 <Info />
                              </Tooltip></p>
                           </blockquote>
                           {isAlertValide && <MDAlert color={message.type} >{message.text}</MDAlert>}
                           {/* 
                           {isAlertValide && (
                              <MDBox px={isMobile ? 3 : 5} mt={2}>
                                 <MDAlert color={message.type}>{message.text}</MDAlert>
                              </MDBox>
                           )} */}

                           <MDBox mt={3} style={{ textAlign: "center" }}>
                              <MDBox mb={2}>
                                 <MDInput error={errorFlag.password}
                                    helperText={errorFlag.passwordMsg} type="password" name="newPassword" label="Nueva Contraseña" fullWidth value={user2.newPassword} onChange={handleChange} />
                              </MDBox>
                              <MDBox mb={2}>
                                 <MDInput error={errorFlag.password}
                                    helperText={errorFlag.passwordMsg} type="password" name="confirmPassword" label="Confirmar Contraseña" fullWidth value={user2.confirmPassword} onChange={handleChange} />
                              </MDBox>
                           </MDBox>
                        </Grid>
                        <MDBox>
                           <MDTypography variant="button" color="text" fontWeight="regular">
                              Ingresa el código que enviamos a tu dispositivo para continuar.
                           </MDTypography>
                        </MDBox>

                        <MDBox mb={4} mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                           <MDBox sx={{ width: "100%", maxWidth: "320px" }}>
                              <GoogleAuth
                                 autofocus={true}
                                 login={true}
                                 keyDetect={handleKeyDetectPin}
                                 enter={changePass}
                              />
                           </MDBox>
                        </MDBox>
                        <MDBox mt={2}>
                           <MDButton
                              variant="gradient"
                              sx={{
                                 backgroundColor: "#ff5f00 !important",
                                 height: "50px"
                              }}
                              size="large"
                              fullWidth
                              onClick={confirmar}
                           >
                              <MDTypography variant="h7" color="white" fontWeight="bold">
                                 VALIDAR CÓDIGO
                              </MDTypography>
                           </MDButton>
                        </MDBox>
                     </Card>
                  </MDBox>
               </BasicLayout>
            }
         </MDBox>
      </>
   )
}

export default RecoverSMS;