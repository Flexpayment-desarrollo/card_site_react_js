import React, { useState } from "react";
import Loading from "Global/Loading/Loading";
import validator from 'validator';
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDAlert from "components/MDAlert";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import PageLayout from "examples/LayoutContainers/PageLayout";
import Footer from "layouts/authentication/components/Footer";
import LogoEasy from "Global/LogoEasy";
import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleAuth } from "Global/GoogleAuth";
import { grey } from "@mui/material/colors";
import { passwordValid } from "Global/Expressions";
import { sendRecoverPassword } from "Services/Auth/Service_Register";
import { Error } from "@mui/icons-material";
import { ModalConfirmation } from "Global/ModalConfirmation";
import { pinValid } from "Global/Expressions";
import { Card, Grid, useMediaQuery, useTheme } from '@mui/material';

const View_RecoverSMS = () => {
   const navigate = useNavigate();
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
   const location = useLocation();
   const { formLoginValue } = location.state || {};
   const [loading, setLoading] = useState(false);
   const [limpiarPin, setLimpiarPin] = useState(0)
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

   // Metodo para cambiar la contraseña
   const changePass = async (e) => {

      let validation = validateForm();
      if (validation) {

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
                  text: "Se ha cambiado la contraseña correctamente",
                  type: 'success',
               });
               navigate("/successRecover");
            } else {
               setMessage({
                  isShow: true,
                  text: data.businessMeaning || "El PIN es incorrecto",
                  type: 'error',
               });
               setIsAlertValide(true);
               setLimpiarPin(prevKey => prevKey + 1); // Forzar que se desmonte y monte el componente de GoogleAuth
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
                  text: errorServerData.businessMeaning || "El PIN es incorrecto",
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
            setLimpiarPin(prevKey => prevKey + 1); // Forzar que se desmonte y monte el componente de GoogleAuth
         }
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
         navigate('/SignIn');
      } else {
         if (e.target.name === "noBtn") {
            setModalConfirmarGuardar(false);
         }
      }
   };

   /*Método para validar que no haya errores en el formulario y si todo esta bien abrir el modal de confirmación*/
   const confirmar = (e) => {
      e.preventDefault();
      setModalConfirmarGuardar(true);
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
      if (valid && (!user.pin || user.pin.trim().length < 6)) {
         setMessage({
            isShow: true,
            text: "El PIN es obligatorio y debe ser de 6 dígitos",
            type: 'error',
         });
         setIsAlertValide(true);
         valid = false;
      }
      setErrorFlag(errorTemp)
      return valid
   }

   return (
      <>
         {loading && <Loading show={loading} />}
         {modalConfirmarGuardar && <ModalConfirmation showModal={modalConfirmarGuardar} message="¿Estás seguro de finalizar el proceso?" closeModal={handleCloseConfirmarGuardar}></ModalConfirmation>}
         <PageLayout>
            {/* <BasicLayout illustration={bgImage}> */}
            <MDBox
               px={isMobile ? 1 : 2} // Padding lateral 
               width="100%"
               display="flex"
               justifyContent="center"
               py={isMobile ? 2 : 5}
            >
               <Card sx={{
                  width: isMobile ? "100%" : "450px",
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
                     mb: 1
                  }}>
                     <MDBox sx={{ width: isMobile ? "180px" : "220px" }}>
                        <LogoEasy />
                     </MDBox>
                  </MDBox>
                  <MDBox sx={{ textAlign: "center", mb: 2 }}>
                     <MDTypography
                        variant={isMobile ? "h4" : "h3"}
                        fontWeight="bold"
                        sx={{ color: grey[800], letterSpacing: "1px" }}
                     >
                        EASYCARD
                     </MDTypography>
                  </MDBox>

                  {/* Cabecera con flecha de regreso */}
                  {/* <MDBox display="flex" alignItems="center" mb={3}>
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
                        </MDBox> */}

                  <Grid item sm={12} mt={2}>
                     <MDTypography variant="h5">Ingresa una nueva contraseña</MDTypography>
                     <MDBox mt={3} style={{ textAlign: "center" }}>
                        <MDBox mb={2}>
                           <MDInput
                              autoFocus
                              error={errorFlag.password}
                              helperText={errorFlag.passwordMsg}
                              type="password"
                              name="newPassword" label="Nueva Contraseña"
                              fullWidth
                              value={user2.newPassword}
                              onChange={handleChange} />
                        </MDBox>
                        <MDBox mb={2}>
                           <MDInput
                              error={errorFlag.password}
                              helperText={errorFlag.passwordMsg}
                              type="password"
                              name="confirmPassword"
                              label="Confirmar Contraseña"
                              fullWidth
                              value={user2.confirmPassword}
                              onChange={handleChange} />
                        </MDBox>
                     </MDBox>
                  </Grid>
                  <MDBox mb={4} mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                     <MDBox sx={{ width: "100%", maxWidth: "320px" }}>
                        <GoogleAuth
                           key={limpiarPin}
                           //autofocus={true}
                           login={true}
                           keyDetect={handleKeyDetectPin}
                           enter={changePass}
                        />
                     </MDBox>
                  </MDBox>
                  {isAlertValide && (
                     <MDBox>
                        <MDAlert
                           color={message.type === "error" ? "error" : message.type}>
                           <MDTypography
                              variant="caption"
                              color="white"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              width="100%">
                              <Error
                                 fontSize="small" />
                              &nbsp;
                              {message.text}
                           </MDTypography>
                        </MDAlert>
                     </MDBox>
                  )}

                  <MDBox mt={2}>
                     <MDButton
                        variant="gradient"
                        sx={{
                           backgroundColor: "#ff5f00 !important",
                           height: "50px"
                        }}
                        size="large"
                        fullWidth
                        onClick={changePass}>
                        <MDTypography variant="h7" color="white" fontWeight="bold">
                           VALIDAR PIN
                        </MDTypography>
                     </MDButton>
                  </MDBox>
                  <MDBox mt={2}>
                     <MDButton type="button" variant="gradient"
                        color="secondary"
                        size="large"
                        fullWidth
                        onClick={confirmar}>
                        CANCELAR
                     </MDButton>
                  </MDBox>
               </Card>
            </MDBox>
            <Footer />
         </PageLayout >
      </>
   )
}

export default View_RecoverSMS;