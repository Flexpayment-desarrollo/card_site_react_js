import React, { useState } from "react";
import Alert from "Global/Alert";
import Loading from "Global/Loading/Loading";
import LogoInovag from "View/LogoInovag";
import bgImage from "assets/images/illustrations/slide.jpg";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDAlert from "components/MDAlert";
import MDTypography from "components/MDTypography";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { GoogleAuth } from "Global/GoogleAuth";
import { codeValid } from "Global/Expressions";
import { deleteStorage } from "Global/Expressions";
import { registerUser } from "Services/Auth/Service_Register";
import { ModalConfirmation } from "Global/ModalConfirmation";
import { grey } from "@mui/material/colors";

const View_ValidateCode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { formData } = location.state || {};
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [loading, setLoading] = useState(false);
    const [pinKey, setPinKey] = useState(0);
    const [isAlertValide, setIsAlertValide] = useState(false);
    const [modalConfirmacionGuardar, setModalConfirmacionGuardar] = useState(false);
    const [user, setUser] = useState({
        code: ''
    });

    const [message, setMessage] = useState({
        isShow: false,
    });

    useEffect(() => {
    }, []);


    /*Método que registra un usuario*/
    const sendForm = async () => {

        let datos = {
            ...formData,
            Pin: user.code
        };
        setLoading(true);
        await registerUser(datos)
            .then((data) => {
                if (data.code === 0) {
                    if (codeValid(user.code.trim())) {
                        //getImage();
                        setMessage({
                            isShow: true,
                            text: "El usuario ha sido registrado correctamente",
                            type: "success",
                        });
                        navigate("/success");
                    }
                    else {
                        setMessage({
                            isShow: true,
                            text: "El código es incorrecto",
                            type: "danger",
                        });
                        setIsAlertValide(true);
                        setUser((prevState) => ({
                            ...prevState,
                            code: ''
                        }));
                        setPinKey(prev => prev + 1);
                    }
                    setLoading(false);
                } else {
                    setLoading(false)
                    setMessage({
                        isShow: true,
                        text: data.businessMeaning,
                        type: "danger",
                    });
                    setIsAlertValide(true);
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
                            type: "danger",
                            isShow: true,
                        });
                        setIsAlertValide(true);

                    }
                }
            });
    };

    /*Método para validar que no haya errores en el formulario y si todo esta bien abrir el modal de confirmación*/
    const confirmar = (e) => {
        e.preventDefault();
        setModalConfirmacionGuardar(true);
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
            sendForm();
        } else {
            if (e.target.name === "noBtn") {
                setModalConfirmacionGuardar(false);
            }
        }
    };

    const toBack = () => {
        navigate('/Registration');
    }


    return (
        <>
            {loading && <Loading show={loading} />}
            {modalConfirmacionGuardar && (
                <ModalConfirmation
                    showModal={modalConfirmacionGuardar}
                    message={"¿Estás seguro de crear el usuario?"}
                    closeModal={handleCloseConfirmacion}
                />
            )}

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
                                    Validar Código
                                </MDTypography>
                            </MDBox>
                        </MDBox>

                        <MDBox mb={3}>
                            <MDTypography variant="button" color="text" fontWeight="regular">
                                Ingresa el código que enviamos a tu dispositivo para continuar.
                            </MDTypography>
                        </MDBox>

                        {isAlertValide && (
                            <MDBox px={isMobile ? 3 : 5} mt={2}>
                                <MDAlert color={message.type}>{message.text}</MDAlert>
                            </MDBox>
                        )}

                        {/* Contenedor del Input de Código (GoogleAuth) */}
                        <MDBox mb={4} mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <MDBox sx={{ width: "100%", maxWidth: "320px" }}>
                                <GoogleAuth
                                    key={pinKey}
                                    value={user.code}
                                    autofocus={true}
                                    login={true}
                                    keyDetect={handleKeyDetectPin}
                                    enter={confirmar}
                                />
                            </MDBox>
                        </MDBox>

                        {/* Botón de Acción */}
                        <MDBox mt={4}>
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
        </>
    );
}

export default View_ValidateCode;