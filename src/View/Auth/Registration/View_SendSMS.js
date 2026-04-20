import React, { useState } from "react";
import Alert from "Global/Alert";
import Loading from "Global/Loading/Loading";
import LogoInovag from "View/LogoInovag";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import MDTypography from "components/MDTypography";
import bgImage from "assets/images/illustrations/slide.jpg";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { grey } from "@mui/material/colors";
import { validateCode } from "Services/Auth/Service_Register";
import { Card, Grid, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';

const View_SendSMS = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { formData } = location.state || {};
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [isDisableEmail, setIsDisableEmail] = useState(false);
    const [isDisableSMS, setIsDisableSMS] = useState(false);
    const [isAlertValide, setIsAlertValide] = useState(false);
    const [message, setMessage] = useState({
        isShow: false,
    });

    useEffect(() => {
        setLoading(false);
    }, []);


    /** Metodo para el envio del mensaje
     * 
     * @param {*} action 1- Email, 2- SMS
     */
    const sendSelection = async (action, llamada) => {
        let datos = {
            Correo: formData.Correo,
            Telefono: formData.Telefono
        }
        setLoading(true);
        try {
            await validateCode(datos).then((data) => {
                setLoading(false);
                if (data.code === 0) {
                    setMessage({
                        isShow: true,
                        text: llamada === 1 ? 'La llamada se realizara en un momento, se te direccionará a otra pantalla. Espere...' : 'El Mensaje ha sido enviado, se te direccionará a otra pantalla. Espere..',
                        type: 'success',
                    });
                    setIsAlertValide(true);
                    if (action === 2) {
                        // setTimeout(() => {
                        navigate('/validateCode', { state: { formData: formData } });
                        // }, 4000);
                    } else if (action === 1) {
                        // setTimeout(() => {
                        navigate("/SignIn");
                        // }, 3000);
                    }
                }
                else {
                    setLoading(false);
                    setMessage({
                        isShow: true,
                        text: data.businessMeaning,
                        type: 'error',
                    });
                    setIsAlertValide(true);
                }
            }).catch((error) => {
                setLoading(false);
                setMessage({
                    isShow: true,
                    text: error.data.businessMeaning,
                    type: 'error',
                });
                setIsAlertValide(true);

            });
        } catch (error) {
            setMessage({
                isShow: true,
                text: error.name + ' ' + error.message,
                type: 'error',
            });
            setIsAlertValide(true);
        }
    };

    const sendEmail = (e) => {
        e.preventDefault();
        sendSelection(2, 1);
        setIsDisableEmail(!isDisableEmail);
    }

    const sendSMS = (e) => {
        e.preventDefault();
        sendSelection(2, 0);
        setIsDisableSMS(!isDisableSMS);
    }

    const toBack = () => {
        navigate('/Registration');
    }

    /** Metodo que limpia los mensajes */
    const clearMessage = () => {
        setMessage({
            isShow: false,
        });
        setIsAlertValide(false);
    };

    return (
        <>
            {loading && <Loading show={loading} />}
            {/* {message.isShow && <Alert alert={message.type} message={message.text} onClose={clearMessage} open={message.isShow} />} */}
            <BasicLayout illustration={bgImage}>
                <MDBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="75vh"
                    px={2}
                >
                    <Card sx={{
                        // En PC usa 'max-content' para ajustarse al logo, en móvil el 100%
                        width: isMobile ? "100%" : "max-content",
                        // Establecemos un mínimo y máximo para que no se vea ni muy flaca ni muy gorda
                        minWidth: isMobile ? "100%" : "350px",
                        maxWidth: isMobile ? "100%" : "500px",
                        borderRadius: "1rem",
                        overflow: "visible",
                        margin: "auto" // Asegura centrado
                    }}>
                        {/* Contenedor del Logo con más padding lateral */}
                        <MDBox px={isMobile ? 3 : 6} py={4} textAlign="center" display="flex" justifyContent="center">
                            <MDBox sx={{ width: "100%" }}>
                                <LogoInovag />
                            </MDBox>
                        </MDBox>

                        {isAlertValide && (
                            <MDBox px={isMobile ? 3 : 5} mb={2}>
                                <MDAlert color={message.type} dismissible onClose={clearMessage}>
                                    {message.text}
                                </MDAlert>
                            </MDBox>
                        )}

                        <MDBox px={isMobile ? 4 : 6} py={2} textAlign="center">
                            <MDTypography
                                variant={isMobile ? "h6" : "h5"}
                                fontWeight="bold"
                                sx={{ color: grey[800], letterSpacing: "0.5px" }}
                            >
                                Se te enviará un código SMS al número de teléfono que registraste
                            </MDTypography>
                        </MDBox>

                        <MDBox px={isMobile ? 4 : 6} pb={5} mt={2}>
                            <Grid container alignItems="center" spacing={2} mb={3}>
                                <Grid item>
                                    <Tooltip placement="top" title="Regresar">
                                        <IconButton
                                            onClick={toBack}
                                            size="medium"
                                            sx={{
                                                background: grey[100],
                                                color: grey[700],
                                                '&:hover': { background: grey[200] }
                                            }}
                                        >
                                            <ArrowBackIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                {/* <Grid item xs>
                                    <MDTypography variant="button" fontWeight="regular" color="text">
                                        {email || "Verifica tus datos"}
                                    </MDTypography>
                                </Grid> */}
                            </Grid>

                            <MDBox>
                                <MDButton
                                    variant="gradient"
                                    fullWidth
                                    onClick={sendSMS}
                                    //disabled={isDisableSMS}
                                    sx={{
                                        backgroundColor: "#ff5f00 !important",
                                        height: "50px",
                                        borderRadius: "10px",
                                    }}
                                >
                                    <MDTypography variant="h7" color="white" fontWeight="bold">
                                        ENVIAR POR SMS
                                    </MDTypography>
                                </MDButton>
                            </MDBox>
                        </MDBox>
                    </Card>
                </MDBox>
            </BasicLayout>
        </>
    )
}

export default View_SendSMS;