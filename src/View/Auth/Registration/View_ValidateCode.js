import React, { useState } from "react";
import Loading from "Global/Loading/Loading";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDAlert from "components/MDAlert";
import LogoEasy from "Global/LogoEasy";
import MDTypography from "components/MDTypography";
import Footer from "layouts/authentication/components/Footer";
import PageLayout from "examples/LayoutContainers/PageLayout";
import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, useMediaQuery, useTheme } from '@mui/material';
import { GoogleAuth } from "Global/GoogleAuth";
import { codeValid } from "Global/Expressions";
import { deleteStorage } from "Global/Expressions";
import { registerUser } from "Services/Auth/Service_Register";
import { ModalConfirmation } from "Global/ModalConfirmation";
import { Error } from "@mui/icons-material";
import { pinValid } from "Global/Expressions";

const View_ValidateCode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { formData } = location.state || {};
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [loading, setLoading] = useState(false);
    const [limpiarPin, setLimpiarPin] = useState(0)
    const [isAlertValide, setIsAlertValide] = useState(false);
    const [modalConfirmacionGuardar, setModalConfirmacionGuardar] = useState(false);
    const [user, setUser] = useState({
        code: ''
    });
    const [message, setMessage] = useState({
        isShow: false,
    });

    useEffect(() => {
        if (isAlertValide && message.isShow) {
            const timer = setTimeout(() => {
                setIsAlertValide(false);
                setMessage((prev) => ({ ...prev, isShow: false }));
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isAlertValide, message.isShow]);


    /*Método que registra un usuario*/
    const sendForm = async () => {

        let datos = {
            ...formData,
            Pin: user.code
        };
        try {
            setLoading(true);
            if (pinValid(user.code.trim())) {
                await registerUser(datos)
                    .then((data) => {
                        if (data.code === 0) {
                            if (codeValid(user.code.trim())) {
                                setLoading(false);
                                setMessage({
                                    isShow: true,
                                    text: "El usuario ha sido registrado correctamente",
                                    type: "success",
                                });
                                navigate("/success");
                            }
                            else {
                                setLoading(false);
                                setMessage({
                                    isShow: true,
                                    text: "El código es incorrecto",
                                    type: "error",
                                });
                                setIsAlertValide(true);
                                setUser((prevState) => ({
                                    ...prevState,
                                    code: ''
                                }));
                                setLimpiarPin(prevKey => prevKey + 1); // Forzar que se desmonte y monte el componente de GoogleAuth
                            }
                            setLoading(false);
                        } else {
                            setLoading(false)
                            setMessage({
                                isShow: true,
                                text: data.businessMeaning,
                                type: "error",
                            });
                            setIsAlertValide(true);
                            setUser((prevState) => ({
                                ...prevState,
                                code: ''
                            }));
                            setLimpiarPin(prevKey => prevKey + 1); // Forzar que se desmonte y monte el componente de GoogleAuth
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        if (error.response.status === 401) {
                            if (error.response.data.code === 2011) {
                                deleteStorage();
                                navigate("/SignIn");
                            } else {
                                setMessage({
                                    text: error.message,
                                    type: "error",
                                    isShow: true,
                                });
                                setIsAlertValide(true);
                                setLimpiarPin(prevKey => prevKey + 1); // Forzar que se desmonte y monte el componente de GoogleAuthLogin
                            }
                        }
                    });
            } else {
                setLoading(false);
                setMessage({
                    type: "error",
                    text: "Ingresa el PIN",
                    isShow: true,
                });
                setIsAlertValide(true);
                setLimpiarPin(prevKey => prevKey + 1); // Forzar que se desmonte y monte el componente de GoogleAuthLogin

            }
        } catch (error) {
            setLoading(false);
            setMessage({
                isShow: true,
                text: error.message,
                type: 'error',
            });
            setIsAlertValide(true);
        }
    };

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

    /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
    const handleCloseConfirmacion = (e) => {
        if (e.target.name === "yesBtn") {
            setModalConfirmacionGuardar(false);
            navigate('/Registration');
        } else {
            if (e.target.name === "noBtn") {
                setModalConfirmacionGuardar(false);
            }
        }
    };

    /*Método para validar que no haya errores en el formulario y si todo esta bien abrir el modal de confirmación*/
    const confirmar = (e) => {
        e.preventDefault();
        setModalConfirmacionGuardar(true);
    };

    const clearMessage = () => {
        setIsAlertValide(false);
        setMessage({ isShow: false, text: "", type: "" });
    };

    return (
        <>
            {loading && <Loading show={loading} />}
            {modalConfirmacionGuardar && (
                <ModalConfirmation
                    showModal={modalConfirmacionGuardar}
                    message={"¿Estás seguro de cancelar el registro?"}
                    closeModal={handleCloseConfirmacion}
                />
            )}

            {/* <BasicLayout illustration={bgImage}> */}
            <PageLayout>
                <MDBox
                    px={isMobile ? 1 : 2} 
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    //minHeight="100vh"
                    py={isMobile ? 2 : 5}
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
                            mb: 1
                        }}>
                            <MDBox sx={{ width: isMobile ? "180px" : "220px" }}>
                                <LogoEasy />
                            </MDBox>
                        </MDBox>

                        {/* Título EasyCard */}
                        <MDBox sx={{ textAlign: "center", mb: 2 }}>
                            <MDTypography
                                variant={isMobile ? "h4" : "h3"}
                                fontWeight="bold"
                                sx={{ letterSpacing: "1px" }}
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
                                    Validar PIN
                                </MDTypography>
                            </MDBox>
                        </MDBox> */}

                        {/* <MDBox mb={3}>
                            <MDTypography variant="button" color="text" fontWeight="regular">
                                Ingresa el código que enviamos a tu dispositivo para continuar.
                            </MDTypography>
                        </MDBox> */}

                        {/* Contenedor del Input de Código (GoogleAuth) */}
                        <MDBox mb={2} mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <MDBox sx={{ width: "100%", maxWidth: "320px" }}>
                                <GoogleAuth
                                    key={limpiarPin}
                                    // key={pinKey}
                                    value={user.code}
                                    autofocus={true}
                                    login={true}
                                    keyDetect={handleKeyDetectPin}
                                    enter={confirmar}
                                />
                            </MDBox>
                        </MDBox>

                        {isAlertValide && (
                            <MDBox>
                                <MDAlert
                                    color={message.type === "error" ? "error" : message.type}
                                >
                                    <MDTypography
                                        variant="caption"
                                        color="white"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        width="100%"
                                    >
                                        <Error
                                            fontSize="small" />
                                        &nbsp;
                                        {message.text}
                                    </MDTypography>
                                </MDAlert>
                            </MDBox>
                        )}

                        {/* {isAlertValide && <MDAlert color={message.type} >{message.text}</MDAlert>} */}

                        <MDBox mt={2}>
                            <MDButton
                                variant="gradient"
                                sx={{
                                    backgroundColor: "#ff5f00 !important",
                                }}
                                size="large"
                                fullWidth
                                onClick={sendForm}
                            >
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
            </PageLayout>
            {/* </BasicLayout> */}
        </>
    );
}

export default View_ValidateCode;