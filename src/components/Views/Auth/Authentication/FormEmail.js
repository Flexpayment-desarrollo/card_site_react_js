import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import Loading from "Global/Loading";
import bgImage from "assets/images/illustrations/slide.jpg";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MDTypography from "components/MDTypography";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { useEffect, useRef, useState } from "react";
import { emailValid } from "Global/Expressions";
import { pinValid } from "Global/Expressions";
import { grey } from "@mui/material/colors";
import { encryptPassword } from "Global/EncryptPassword";
import { useNavigate } from "react-router-dom";
import { deleteStorage } from "Global/Expressions";
import { passwordValid } from "Global/Expressions";
import { Grid, IconButton, Tooltip } from "@mui/material";
import { getLatitudLongitud } from "Global/Expressions";
import { authValidate, changePasswordExp, emailValidate } from "./Repository/FormMailService";

const FormEmail = ({ setUserLogin }) => {
   const [formLoginValue, setFormLoginValue] = useState({
      Username: '',
      Password: '******',
      Pin: '000000',
      Latitud: '0',
      Longitud: '0'
   });
   const [user, setUser] = useState({
      newPassword: "",
      confirmPassword: ""
   });
   const refPass = useRef(null)
   const [isAlertValide, setIsAlertValide] = useState(false);
   const [limpiarPin, setLimpiarPin] = useState(0)
   const [autofocusPin, setAutoFocusPin] = useState(false)
   const [loading, setLoading] = useState(false);
   const [isCorrectMail, setIsCorrectMail] = useState(true);
   const [isChangePassword, setIsChangePassword] = useState(false);
   const [message, setMessage] = useState({
      isShow: false,
      text: '',
      type: '',
   });
   const { Username, Password, Pin } = formLoginValue;
   const { newPassword, confirmPassword } = user;
   const navigate = useNavigate();

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
      setAutoFocusPin(false)
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

   async function senValidate(data, latitud, longitud) {
      try {

         if (emailValid(data.Username)) {
            console.log(data.Username);
            //   return;
            setIsCorrectMail(false);
            return;
            setLoading(true);
            await emailValidate(formLoginValue, latitud, longitud).then((data) => {
               setLoading(false);
               if (data.code === 0) {
                  setFormLoginValue({
                     Username: formLoginValue.Username,
                     Password: '',
                     Pin: '',
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
      var latitud = "22.085065";
      var longitud = "-100.931659";
      var mensage = "";

      /// si la configuracion es pedir la ubicacion y el permiso fue denegado se vuelve a pedir la ubicacion
      // if (global.Constants.ubicacion) {
      //    navigator.geolocation.getCurrentPosition(position => {
      //       latitud = position.coords.latitude.toString();
      //       longitud = position.coords.longitude.toString();
      //       senValidate(formLoginValue, latitud, longitud);
      //    }, error => {
      //       switch (error.code) {
      //          case error.PERMISSION_DENIED:
      //             mensage = "El usuario denegó el permiso para acceder a la ubicación.";
      //             break;
      //          case error.POSITION_UNAVAILABLE:
      //             mensage = "La información de ubicación no está disponible.";
      //             break;
      //          case error.TIMEOUT:
      //             mensage = "La solicitud de ubicación ha expirado.";
      //             break;
      //          default:
      //             mensage = "Error desconocido al obtener la ubicación.";
      //       }

      //       setMessage({
      //          isShow: true,
      //          text: mensage,
      //          type: 'error',
      //       });
      //       setIsAlertValide(true);
      //    });

      // } else {
      senValidate(formLoginValue, latitud, longitud);
      // }
   }

   /**Metodo de regresar pantalla login */
   const toBack = () => {
      setIsAlertValide(false)
      setIsCorrectMail(true);
      setFormLoginValue({
         Username: formLoginValue.Username,
         Password: '******',
         Pin: '000000'
      });
   }

   /**Metodo para validar las credenciales del usuario*/
   const validatePassword = async (e) => {
      if (e !== undefined)
         e.preventDefault();
      try {
         if (formLoginValue.Password.trim()) {
            navigate('/client');

            return;
            if (pinValid(formLoginValue.Pin)) {
               //console.log(encryptPassword(formLoginValue.Password))

               setLoading(true);
               await authValidate(formLoginValue).then((data) => {
                  setLoading(false);
                  if (data.code === 0) {

                     navigate('/client');

                  } else if (data.code === 3003) {
                     setIsChangePassword(true);
                     setIsCorrectMail(false);
                     setIsAlertValide(true);
                     setMessage({
                        isShow: true,
                        text: data.businessMeaning,
                        type: 'error',
                     });
                     setIsAlertValide(true);
                  } else if (data.code === 3014 || data.code === 3015 || data.code === 3016 || data.code === 3017) {
                     setMessage({
                        isShow: true,
                        text: data.businessMeaning,
                        type: 'error',
                     });
                     setIsAlertValide(true);
                     setTimeout(() => {
                        setIsCorrectMail(true);
                        setFormLoginValue({
                           Username: formLoginValue.Username,
                           Password: '******',
                           Pin: '000000'
                        });
                     }, 2000);
                  }
                  else {
                     //Cuando activen lo de pin validar que si sea el codigo 3002 y verificar el mensaje
                     if (data.code == 3002) {
                        setAutoFocusPin(false)
                        setFormLoginValue({
                           ...formLoginValue,
                           Password: '',
                           Pin: ''
                        });
                        refPass.current.focus();
                        setMessage({
                           isShow: true,
                           text: data.businessMeaning,
                           type: 'error',
                        });
                        setIsAlertValide(true);
                        setLimpiarPin(prevKey => prevKey + 1); // Forzar que se desmonte y monte el componente de GoogleAuthLogin
                     } else if (data.code == 3005) {
                        setAutoFocusPin(true)
                        setMessage({
                           isShow: true,
                           text: data.businessMeaning,
                           type: 'error',
                        });
                        setFormLoginValue({
                           ...formLoginValue,
                           Pin: ''
                        });
                        setLimpiarPin(prevKey => prevKey + 1);
                        setIsAlertValide(true);
                     } else {
                        setMessage({
                           isShow: true,
                           text: data.businessMeaning,
                           type: 'error',
                        });
                     }
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
               throw new Error('Por favor, ingresa el Pin.');
            }
         } else {
            throw new Error('Por favor , ingresa la contraseña.');
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

   /** Metodo que direcciona a la pantalla de recuperacion contraseña */
   const redirectPassword = () => {
      if (!Username) return;
      setUserLogin(Username);
      navigate('/recover_password');
   }

   const redirectConfirmationSMS = async (e) => {
      try {
         if (emailValid(Username)) {
            const ubicacion = await getLatitudLongitud();
            if (ubicacion.code === 0) {
               await emailValidate(formLoginValue, ubicacion.latitud, ubicacion.longitud).then((data) => {
                  if (data.code === 3004) {
                     setUserLogin(Username);
                     navigate('/confirmacionSMS');
                     setMessage({
                        isShow: true,
                        text: data.businessMeaning,
                        type: 'error',
                     });
                     setIsAlertValide(true);
                  }
                  else if (data.code === 3001) {
                     setMessage({
                        isShow: true,
                        text: data.businessMeaning,
                        type: 'error',
                     });
                     setIsAlertValide(true);
                  }
                  else {
                     setMessage({
                        isShow: true,
                        text: "Esta cuenta ya cuenta con una confirmación.",
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
            else {
               setMessage({
                  isShow: true,
                  text: ubicacion.mensaje,
                  type: 'error',
               });
               setIsAlertValide(true);
            }
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

   /**Metodo para cambiar la contraseña
    * @Username Correo del usuario
    * @newPassword Nueva Contraseña
    */
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
                           text: 'Su contraseña ha sido cambiado correctamente',
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
            throw new Error('Por favor. Ingrese la contraseña.');
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
            case "Pin":
               validatePassword()
               break;
         }
      }
   }

   const handleKeyDetectPin = (value) => {
      setFormLoginValue(
         (prevState) => {
            return {
               ...prevState,
               Pin: value.Pin1 + value.Pin2 + value.Pin3 + value.Pin4 + value.Pin5 + value.Pin6,
            };
         }
      );
      if (autofocusPin === true) {
         setAutoFocusPin(false);
      }
      setIsAlertValide(false)
   }

   return (
      <>
         {loading && <Loading show={loading} />}
         <BasicLayout illustration={bgImage}>
            <MDBox sx={{ justifyContent: 'center' }}>
               <MDTypography variant="h3" fontWeight="medium" sx={{ color: grey[800] }}>
                  EASYCARD
               </MDTypography>
            </MDBox>
            {/* <MDBox mt={2}>
               <MDTypography sx={{ color: grey[800] }} variant="h6" fontStyle='italic'>
                  Transferencias a cuenta CLABE, TDD, celulares, tarjetas de crédito y productos financieros hasta 24 horas los 7 días de la semana.
               </MDTypography>
            </MDBox> */}
            <MDBox mb={3} mt={3} sx={{ display: 'flex', justifyContent: 'center' }}>
               <MDTypography variant="h5" fontWeight="medium" color="black">
                  Ingresa tu correo para iniciar sesión
               </MDTypography>
            </MDBox>
            {isAlertValide && <MDAlert color={message.type} >{message.text}</MDAlert>}
            {
               isCorrectMail ?
                  <>
                     <MDBox>
                        <MDBox mb={2}>
                           <MDInput onKeyUp={handleKeyDetect} type="email" name="Username" label="Correo Electrónico" fullWidth value={Username} onChange={handleChange} />
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                           <MDButton variant="gradient" style={{ backgroundColor: "#ff5f00" }} size="large" fullWidth onClick={validateEmailClick}>
                              <MDTypography variant="h7" color="white">INICIAR SESIÓN</MDTypography>
                           </MDButton>
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                           <MDButton variant="gradient" style={{ backgroundColor: "#ff5f00" }} size="large" fullWidth onClick={redirectConfirmationSMS}>
                              <MDTypography variant="h7" color="white">REGISTRARSE</MDTypography>
                           </MDButton>
                        </MDBox>
                     </MDBox>
                  </>
                  :
                  isChangePassword ?
                     <>
                        <MDBox>
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
                                    {formLoginValue.Username}
                                 </MDTypography>
                              </Grid>
                           </Grid>
                           <MDBox mb={2} mt={5}>
                              <MDInput onKeyUp={handleKeyDetect} type="password" name="newPassword" label="Ingresa Nueva Contraseña" fullWidth value={newPassword} onChange={handleChangePassword} />
                           </MDBox>
                           <MDBox mb={2}>
                              <MDInput onKeyUp={handleKeyDetect} type="password" name="confirmPassword" label="Confirmar Contraseña" fullWidth value={confirmPassword} onChange={handleChangePassword} />
                           </MDBox>
                           <MDBox mt={4} mb={1}>
                              <MDButton variant="gradient" style={{ backgroundColor: "#ff5f00" }} size="large" fullWidth onClick={changePassword}>
                                 <MDTypography variant="h7" color="white">CAMBIAR CONTRASEÑA</MDTypography>
                              </MDButton>
                           </MDBox>
                        </MDBox>


                     </>
                     :
                     <>
                        <MDBox>
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
                                    {formLoginValue.Username}
                                 </MDTypography>
                              </Grid>
                           </Grid>
                           <MDBox mb={1} mt={3}>
                              <MDInput inputRef={refPass} autoFocus onKeyUp={handleKeyDetect} type="password" name="Password" label="Ingresa Contraseña" fullWidth value={Password} onChange={handleChange} />
                           </MDBox>
                           <MDBox mt={2} mb={1}>
                              <MDButton variant="gradient" style={{ backgroundColor: "#ff5f00" }} size="large" fullWidth onClick={validatePassword}>
                                 <MDTypography variant="h7" color="white">INICIAR SESIÓN</MDTypography>
                              </MDButton>
                           </MDBox>
                           <MDBox mt={2} mb={1}>
                              <MDButton variant="gradient" style={{ backgroundColor: "#ff5f00" }} size="large" fullWidth onClick={redirectPassword}>
                                 <MDTypography variant="h7" color="white">RECUPERAR TU CONTRASEÑA</MDTypography>
                              </MDButton>
                           </MDBox>
                        </MDBox>
                     </>
            }
         </BasicLayout>
      </>
   );
}

export default FormEmail;
