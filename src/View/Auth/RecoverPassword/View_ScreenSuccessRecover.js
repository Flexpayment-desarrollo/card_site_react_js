import React from "react";
import LogoEasy from "Global/LogoEasy";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Footer from "layouts/authentication/components/Footer";
import PageLayout from "examples/LayoutContainers/PageLayout";
import { BsCheckCircle } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { grey } from "@mui/material/colors";
import { Card, useMediaQuery, useTheme } from "@mui/material";

const View_ScreenSuccessRecover = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        // <BasicLayout illustration={bgImage}>
        <PageLayout>
            <MDBox
                px={isMobile ? 1 : 2}
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                py={isMobile ? 2 : 5}
            >
                <Card sx={{
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

                    <MDBox mb={3} display="flex" justifyContent="center">
                        <BsCheckCircle color="#28e60d" size={isMobile ? 100 : 120} />
                    </MDBox>

                    <MDBox mb={2}>
                        <MDTypography variant={isMobile ? "h5" : "h4"} fontWeight="bold" sx={{ color: grey[800] }}>
                            La contraseña ha sido cambiada exitosamente
                        </MDTypography>
                    </MDBox>
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
                                INGRESAR A EASYCARD
                            </MDTypography>
                        </MDButton>
                    </MDBox>
                </Card>
            </MDBox>
            <Footer />
        </PageLayout>
    );
}

export default View_ScreenSuccessRecover;