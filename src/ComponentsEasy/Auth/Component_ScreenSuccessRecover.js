import React from "react";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import LogoInovag from "View/LogoInovag";
import MDTypography from "components/MDTypography";
import { BsCheckCircle } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { Card, useMediaQuery, useTheme } from "@mui/material";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/illustrations/slide.jpg";
import { grey } from "@mui/material/colors";

const Component_ScreenSuccessRecover = ({ message }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <BasicLayout illustration={bgImage}>
            <MDBox
                px={2}
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Card sx={{
                    // Consistente con tus otras pantallas: 450px en PC
                    width: isMobile ? "90%" : "450px",
                    minWidth: isMobile ? "100%" : "400px",
                    maxWidth: isMobile ? "100%" : "900px",
                    padding: isMobile ? "30px" : "40px",
                    borderRadius: "1.5rem",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
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

                    {/* Icono de Éxito */}
                    <MDBox mb={3} display="flex" justifyContent="center">
                        <BsCheckCircle color="#28e60d" size={isMobile ? 100 : 120} />
                    </MDBox>

                    {/* Mensajes con Tipografía del Dashboard */}
                    <MDBox mb={2}>
                        <MDTypography variant={isMobile ? "h5" : "h4"} fontWeight="bold" sx={{ color: grey[800] }}>
                            La contraseña ha sido cambiada exitosamente
                        </MDTypography>
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
                            onClick={() => navigate('/SignIn')}
                        >
                            <MDTypography variant="h7" color="white" fontWeight="bold">
                                REGRESAR A EASY TRANSFER
                            </MDTypography>
                        </MDButton>
                    </MDBox>
                </Card>
            </MDBox>
        </BasicLayout>
    );
}

export default Component_ScreenSuccessRecover;