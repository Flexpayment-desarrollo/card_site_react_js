import Loading from "Global/Loading/Loading";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import MDTypography from "components/MDTypography";
import Footer from "layouts/authentication/components/Footer";
import PageLayout from "examples/LayoutContainers/PageLayout";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoEasy from "Global/LogoEasy";
import { useEffect, useRef, useState } from "react";
import { Turnstile } from '@marsidev/react-turnstile';
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { encryptPassword } from "Global/EncryptPassword";
import { passwordValid } from "Global/Expressions";
import { emailValidate } from "Services/Auth/FormMailService";
import { authValidate } from "Services/Auth/FormMailService";
import { changePasswordExp } from "Services/Auth/FormMailService";
import { deleteStorage } from "Global/Expressions";
import { emailValid } from "Global/Expressions";
import { validateRecover } from "Services/Auth/Service_Register";
import { Error } from "@mui/icons-material";
import { ModalEnviar } from "Global/ModalEnviar";
import { Card, Grid, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";

const View_FormEmail = () => {
   const navigate = useNavigate();
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
   const refPass = useRef(null);
   const [cloudflareToken, setCloudflareToken] = useState(null);
   const [isAlertValide, setIsAlertValide] = useState(false);
   const [loading, setLoading] = useState(false);
   const [isCorrectMail, setIsCorrectMail] = useState(true);
   const [isChangePassword, setIsChangePassword] = useState(false);
   const [modalConfirmacionGuardar, setModalConfirmacionGuardar] = useState(false);
   const [message, setMessage] = useState({
      isShow: false,
      text: '',
      type: '',
   });
   const [formLoginValue, setFormLoginValue] = useState({
      Username: '',
      Password: '******',
      Latitud: '0',
      Longitud: '0'
   });
   const [user, setUser] = useState({
      newPassword: "",
      confirmPassword: ""
   });
   const { Username, Password } = formLoginValue;
   const { newPassword, confirmPassword } = user;

   useEffect(() => {
      deleteStorage();
      if (global.Constants.ubicacion) {
         if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback);
         } else {
         }
      }
   }, []);

   const successCallback = async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
   }

   async function senValidate(data, latitud, longitud) {
      try {
         if (emailValid(data.Username)) {
            setLoading(true);
            await emailValidate(formLoginValue, latitud, longitud).then((data) => {
               setLoading(false);
               if (data.code === 0) {
                  setFormLoginValue({
                     Username: formLoginValue.Username,
                     Password: '',
                     Latitud: latitud,
                     Longitud: longitud
                  });
                  setIsCorrectMail(false);
               } else {
                  setMessage({
                     isShow: true,
                     text: data.businessMeaning,
                     type: 'error',
                  });
                  setIsAlertValide(true);
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
      } catch (error) {
         setMessage({
            isShow: true,
            text: error.name + ' ' + error.message,
            type: 'error',
         });
         setIsAlertValide(true);
      }
   }

   const validateEmailClick = async (e) => {
      if (e !== undefined)
         e.preventDefault();

      if (!cloudflareToken) {
         setIsAlertValide(true);
         setMessage({
            isShow: true,
            text: "¡Error! Por favor, confirma que no eres un robot.",
            type: 'error',
         });
         return;
      }
      else {
         setIsAlertValide(false);
      }

      var loginValue = formLoginValue;
      loginValue.CloudflareToken = cloudflareToken;

      var latitud = "22.085065";
      var longitud = "-100.931659";
      var mensage = "";

      //si la configuracion es pedir la ubicacion y el permiso fue denegado se vuelve a pedir la ubicacion
      if (global.Constants.ubicacion) {
         navigator.geolocation.getCurrentPosition(position => {
            latitud = position.coords.latitude.toString();
            longitud = position.coords.longitude.toString();
            senValidate(formLoginValue, latitud, longitud);
         }, error => {
            switch (error.code) {
               case error.PERMISSION_DENIED:
                  mensage = "El usuario denegó el permiso para acceder a la ubicación.";
                  break;
               case error.POSITION_UNAVAILABLE:
                  mensage = "La información de ubicación no está disponible.";
                  break;
               case error.TIMEOUT:
                  mensage = "La solicitud de ubicación ha expirado.";
                  break;
               default:
                  mensage = "Error desconocido al obtener la ubicación.";
            }
            setMessage({
               isShow: true,
               text: mensage,
               type: 'error',
            });
            setIsAlertValide(true);
         });

      } else {
         senValidate(formLoginValue, latitud, longitud);
      }
   }

   const validateRegistrarClick = async (e) => {
      if (e !== undefined)
         e.preventDefault();

      if (!cloudflareToken) {
         setIsAlertValide(true);
         setMessage({
            isShow: true,
            text: "¡Error! Por favor, confirma que no eres un robot.",
            type: 'error',
         });
         return;
      }
      else {
         setIsAlertValide(false);
         navigate('/registration')
      }
   }

   /**Metodo para validar las credenciales del usuario*/
   const validatePassword = async (e) => {
      if (e !== undefined)
         e.preventDefault();
      try {
         if (formLoginValue.Password.trim()) {
            setLoading(true);
            await authValidate(formLoginValue).then((data) => {
               setLoading(false);
               if (data.code === 0) {
                  navigate('/Cards');
               } else if (data.code === 3003) {
                  setIsChangePassword(true);
                  setIsCorrectMail(false);
                  setMessage({
                     isShow: true,
                     text: data.businessMeaning,
                     type: 'error',
                  });
                  setIsAlertValide(true);
               } else if (data.code === 3001 || data.code === 3014 || data.code === 3015 || data.code === 3016 || data.code === 3017) {
                  setMessage({
                     isShow: true,
                     text: data.businessMeaning,
                     type: 'error',
                  });
                  setFormLoginValue({
                     ...formLoginValue,
                     Password: '',
                     Pin: ''
                  });
                  setIsAlertValide(true);
               }
            }).catch((err) => {
               setMessage({
                  isShow: true,
                  text: err,
                  type: 'error',
               });
               setIsAlertValide(true);
            });
         } else {
            setMessage({
               isShow: true,
               text: "Ingresa la contraseña",
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

   //  Metodo para el envío del mensaje
   const recuperarPassword = async () => {
      try {
         setLoading(true);
         if (emailValid(formLoginValue.Username.trim())) {
            await validateRecover(formLoginValue.Username.trim()).then((data) => {
               if (data.code === 0) {
                  setLoading(false);
                  setMessage({
                     isShow: true,
                     text: 'PIN enviado, se te redireccionará a otra pantalla, Espera...',
                     type: 'success',
                  });
                  setIsAlertValide(true);
                  setTimeout(() => navigate('/recoverSMS', { state: { formLoginValue: formLoginValue } }), 5000);
               }
            }).catch((error) => {
               setLoading(false);
               if (error.data.code === 3001) {
                  setMessage({
                     isShow: true,
                     text: error.data.businessMeaning,
                     type: 'error',
                  });
                  setIsAlertValide(true);
               } else {
                  setLoading(false);
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

   /** Metodo que direcciona a la pantalla de recuperacion contraseña */
   const redirectPassword = () => {
      setModalConfirmacionGuardar(true);
   }

   /**Metodo para cambiar la contraseña */
   const changePassword = async (e) => {
      if (e !== undefined)
         e.preventDefault();
      try {
         if (user.newPassword.trim()) {
            if (user.newPassword === user.confirmPassword) {
               if (passwordValid(user.newPassword)) {
                  await changePasswordExp(formLoginValue.Username, encryptPassword(user.newPassword)).then((data) => {
                     if (data.code === 0) {
                        setIsChangePassword(false);
                        setIsCorrectMail(true);
                        setIsAlertValide(true);
                        setMessage({
                           isShow: true,
                           text: 'La contraseña ha sido cambiada correctamente',
                           type: 'success',
                        });
                        setIsAlertValide(true);
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
         } else {
            setMessage({
               isShow: true,
               text: "Ingresa la contraseña",
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

   /**Metodo de regresar pantalla login */
   const toBack = () => {
      setIsAlertValide(false)
      setIsCorrectMail(true);
      setFormLoginValue({
         Username: formLoginValue.Username,
         Password: '******',
      });
   }

   const handleSuccessCloudflare = (cloudflareToken) => {
      setCloudflareToken(cloudflareToken);

      if (message?.text?.includes("Cloudflare Error")) {
         setIsAlertValide(false);
      }
   }

   const handleErrorCloudflare = (errorCode) => {
      setCloudflareToken(null); // <-- Bloquea los botones de nuevo si hay error
      const code = String(errorCode);
      var errorMsj = ""
      switch (code) {
         case '110100':
            errorMsj = "Cloudflare Error de configuración: La Site Key no es válida.";
            break;
         case '110200':
            errorMsj = "Cloudflare Error de dominio: Tu IP o Hostname no están autorizados.";
            break;
         case '110600':
            errorMsj = "Cloudflare Error Acceso denegado: El navegador no es compatible o parece automatizado.";
            break;
         case '300030':
            errorMsj = "Cloudflare Error de conexión: No se pudo contactar con los servidores de Cloudflare.";
            break;
         case '600010':
            errorMsj = "Cloudflare Error en el widget: Por favor, intenta recargar la página.";
            break;
         default:
            errorMsj = `Cloudflare Error de seguridad inesperado (Código: ${code})`;
            break;
      }
      setMessage({
         isShow: true,
         text: errorMsj,
         type: 'error',
      });
      setIsAlertValide(true);
   }

   const handleExpireCloudflare = () => {
      setCloudflareToken(null); // Bloquea los botones de nuevo si hay error
      setMessage({
         isShow: true,
         text: "La validación de Cloudflare ha expirado.",
         type: 'error',
      });
      setIsAlertValide(true);
   }

   const handleKeyDetect = (event) => {
      const key = event.key
      const { name } = event.target
      if (key === "Enter") {
         switch (name) {
            case "Username":
               validateEmailClick()
               break;
            case "confirmPassword":
               changePassword()
               break;
            case "Password":
               validatePassword()
               break;
         }
      }
   }

   const handleChange = (event) => {
      const { name, value } = event.target;
      setFormLoginValue(
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
         action: 'collapse'
      });
   }

   const handleChangePassword = (event) => {
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
         action: 'collapse'
      });
   }

   /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
   const handleCloseConfirmacion = (e) => {
      if (e.target.name === "yesBtn") {
         setModalConfirmacionGuardar(false);
         recuperarPassword();
      } else {
         if (e.target.name === "noBtn") {
            setModalConfirmacionGuardar(false);
         }
      }
   };

   return (
      <>
         {loading && <Loading show={loading} />}
         {modalConfirmacionGuardar && <ModalEnviar showModal={modalConfirmacionGuardar} tipoModal={false} message="Se enviará un PIN vía SMS al celular registrado" closeModal={handleCloseConfirmacion}></ModalEnviar>}
         <PageLayout>
            <MDBox
               px={2}
               width="100%"
               display="flex"
               justifyContent="center"
               alignItems="center"
               py={isMobile ? 2 : 5}
            >
               <Card sx={{
                  width: isMobile ? "450px" : "450px",
                  padding: isMobile ? "15px" : "40px",
                  borderRadius: "1.5rem",
                  margin: "auto",
                  minWidth: isMobile ? "280px" : "400px",
                  overflow: "hidden"
               }}>
                  <MDBox display="flex" flexDirection="column">

                     <MDBox sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        mb: 1
                     }}>
                        <MDBox sx={{
                           width: "100%",
                           maxWidth: isMobile ? "160px" : "220px",
                           margin: "0 auto"
                        }}>
                           <LogoEasy />
                        </MDBox>
                     </MDBox>

                     {/* Título EasyCard */}
                     <MDBox sx={{ textAlign: "center", mb: 2 }}>
                        <MDTypography
                           variant={isMobile ? "h4" : "h3"}
                           fontWeight="bold"
                           sx={{ color: grey[800], letterSpacing: "1px" }}
                        >
                           EASYCARD
                        </MDTypography>
                     </MDBox>

                     {isCorrectMail ? (
                        <MDBox width="100%">
                           <MDBox mb={2}>
                              <MDInput
                                 onKeyUp={handleKeyDetect}
                                 type="email"
                                 name="Username"
                                 label="Ingresa Correo Electrónico"
                                 fullWidth
                                 value={Username}
                                 onChange={handleChange}
                              />
                           </MDBox>

                           {isAlertValide && (
                              <MDBox mt={1}>
                                 <MDAlert
                                    color={message.type === "error" ? "error" : message.type}>
                                    <MDTypography
                                       variant="caption"
                                       color="white"
                                       display="flex"
                                       alignItems="center"
                                       justifyContent="center"
                                       width="100%"
                                    >
                                       <Error fontSize="small" />
                                       &nbsp;
                                       {message.text}
                                    </MDTypography>
                                 </MDAlert>
                              </MDBox>
                           )}

                           <MDBox mt={2} mb={1}>
                              <MDButton
                                 variant="gradient"
                                 sx={{ backgroundColor: "#ff5f00 !important", height: "50px" }}
                                 size="large"
                                 fullWidth
                                 onClick={validateEmailClick}
                                 disabled={!cloudflareToken} //CONGELA EL BOTÓN SI NO HAY TOKEN
                              >
                                 <MDTypography variant="h7" color="white" fontWeight="bold">INICIAR SESIÓN</MDTypography>
                              </MDButton>
                           </MDBox>
                           <MDBox mt={2}>
                              <MDButton
                                 variant="outlined"
                                 color="dark"
                                 sx={{ height: "50px" }}
                                 size="large"
                                 fullWidth
                                 onClick={validateRegistrarClick}
                                 disabled={!cloudflareToken} //CONGELA EL BOTÓN SI NO HAY TOKEN
                              >
                                 <MDTypography variant="h7" color="dark" fontWeight="bold">REGISTRARSE</MDTypography>
                              </MDButton>
                           </MDBox>

                           <MDBox
                              width="100%"
                              mt={2}
                              pb={3}
                              display="flex"
                              justifyContent="center"
                              sx={{
                                 overflow: "hidden",
                                 "& > div": {
                                    width: "100% !important",
                                    minWidth: "100% !important",
                                    display: "flex !important",
                                    justifyContent: "center !important",
                                    transform: isMobile ? "scale(0.92)" : "scale(1)",
                                    transformOrigin: "center center",
                                 },
                                 "& iframe": {
                                    margin: "0 auto !important",
                                    display: "block !important",
                                 }
                              }}
                           >
                              <Turnstile
                                 siteKey={global.Constants.cloudflare}
                                 onSuccess={handleSuccessCloudflare}
                                 onError={handleErrorCloudflare}
                                 onExpire={handleExpireCloudflare}
                                 options={{
                                    theme: 'auto',
                                    size: 'flexible',
                                    appearance: 'always',
                                 }}
                              />
                           </MDBox>
                        </MDBox>
                     ) : (
                        <MDBox width="100%">
                           <Grid container alignItems="center" spacing={1} mb={3}>
                              <Grid item>
                                 <Tooltip placement="top" title="Regresar">
                                    <IconButton onClick={toBack} sx={{ background: grey[100] }}>
                                       <ArrowBackIcon />
                                    </IconButton>
                                 </Tooltip>
                              </Grid>
                              <Grid item xs>
                                 <MDTypography variant="button" fontWeight="medium" color="text">
                                    {formLoginValue.Username}
                                 </MDTypography>
                              </Grid>
                           </Grid>

                           {isChangePassword ? (
                              <>
                                 <MDBox mb={2}>
                                    <MDInput onKeyUp={handleKeyDetect} type="password" name="newPassword" label="Nueva Contraseña" fullWidth value={newPassword} onChange={handleChangePassword} />
                                 </MDBox>
                                 <MDBox mb={2}>
                                    <MDInput onKeyUp={handleKeyDetect} type="password" name="confirmPassword" label="Confirmar Contraseña" fullWidth value={confirmPassword} onChange={handleChangePassword} />
                                 </MDBox>

                                 {isAlertValide && (
                                    <MDBox mt={1}>
                                       <MDAlert
                                          color={message.type === "error" ? "error" : message.type}
                                       //onClose={clearMessage}
                                       >
                                          <MDTypography
                                             variant="caption"
                                             color="white"
                                             display="flex"
                                             alignItems="center"
                                             justifyContent="center"
                                             width="100%"
                                          >
                                             <Error fontSize="small" />
                                             &nbsp;
                                             {message.text}
                                          </MDTypography>
                                       </MDAlert>
                                    </MDBox>
                                 )}

                                 <MDBox mt={4}>
                                    <MDButton variant="gradient" sx={{ backgroundColor: "#ff5f00 !important", height: "50px" }} size="large" fullWidth onClick={changePassword}>
                                       <MDTypography variant="h7" color="white" fontWeight="bold">CAMBIAR CONTRASEÑA</MDTypography>
                                    </MDButton>
                                 </MDBox>
                              </>
                           ) : (
                              <>
                                 <MDBox mb={3}>
                                    <MDInput inputRef={refPass} autoFocus onKeyUp={handleKeyDetect} type="password" name="Password" label="Contraseña" fullWidth value={Password} onChange={handleChange} />
                                 </MDBox>
                                 {isAlertValide && (
                                    <MDBox mt={1}>
                                       <MDAlert
                                          color={message.type === "error" ? "error" : message.type}
                                       //onClose={clearMessage}
                                       >
                                          <MDTypography
                                             variant="caption"
                                             color="white"
                                             display="flex"
                                             alignItems="center"
                                             justifyContent="center"
                                             width="100%"
                                          >
                                             <Error fontSize="small" />
                                             &nbsp;
                                             {message.text}
                                          </MDTypography>
                                       </MDAlert>
                                    </MDBox>
                                 )}

                                 <MDButton variant="gradient" sx={{ backgroundColor: "#ff5f00 !important", height: "50px" }} size="large" fullWidth onClick={validatePassword}>
                                    <MDTypography variant="h7" color="white" fontWeight="bold">INICIAR SESIÓN</MDTypography>
                                 </MDButton>
                                 <MDBox mt={3} textAlign="center">
                                    <MDTypography
                                       variant="button"
                                       color="info"
                                       fontWeight="regular"
                                       sx={{ cursor: "pointer", textDecoration: "underline" }}
                                       onClick={redirectPassword}
                                    >
                                       ¿Olvidaste tu contraseña?
                                    </MDTypography>
                                 </MDBox>
                              </>
                           )}
                        </MDBox>
                     )}
                  </MDBox>
               </Card>
            </MDBox>
            <Footer />
         </PageLayout>
      </>
   );
}

export default View_FormEmail;
