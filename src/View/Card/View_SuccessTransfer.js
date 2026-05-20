import Alert from "Global/Alert";
import Loading from "Global/Loading/Loading";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";
import { CheckCircleOutline } from "@mui/icons-material";
import { Card, Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export const View_SuccessTransfer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const datosTransferencia = location.state?.datosTransferencia || { Cantidad: 1500, concepto: "pago", referencia: "559277" };
    const clientAccount = location.state?.clientAccount;
    const beneficiario = location.state?.beneficiario;
    const datos = location.state?.datos;
    const id = location.state?.id;
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ isShow: false });

    /* Método para terminar el flujo e ir a la tarjeta */
    const handleFinalizar = () => {
        navigate("/Card", { state: { info: id } })
    }

    const clearMessage = () => {
        setMessage({ isShow: false });
    };

    return (
        <>
            {loading && <Loading show={loading} />}
            {message.isShow && (
                <Alert alert={message.type} message={message.text} onClose={clearMessage} open={message.isShow} />
            )}

            <DashboardLayout>
                <DashboardNavbar />
                <Grid container justifyContent="center" mb={3}>
                    <Grid item xs={12} display="flex">
                        <MDBox height="100%" width="100%">
                            <Card sx={{ borderRadius: "16px", p: { xs: 3, md: 5 }, minHeight: "80vh" }}>

                                <Grid container>
                                    <Grid item xs={12} md={5} display="flex" flexDirection="column" justifyContent="flex-start">
                                        <MDBox mb={2} display="flex" justifyContent="center" alignItems="center" width="100%">
                                            <CheckCircleOutline
                                                fontSize="none"
                                                sx={{ fontSize: "100px", color: "#00a86b" }}
                                            />
                                        </MDBox>
                                        <MDTypography variant="h4" fontWeight="bold" color="dark" mb={1} sx={{ fontSize: { xs: "1.5rem", md: "1.8rem" } }}>
                                            Transferencia exitosa
                                        </MDTypography>

                                        <MDTypography variant="body2" color="text" mb={4} sx={{ lineHeight: 1.5, maxWidth: "380px" }}>
                                            Esta transferencia ha sido aceptada. Para validarla consulta tu Comprobante Electrónico de Pago (CEP)
                                        </MDTypography>

                                        <MDBox mt={{ md: 2 }}>
                                            <MDTypography variant="h1" fontWeight="bold" color="dark" sx={{ fontSize: { xs: "2.5rem", md: "3.2rem" }, display: "flex", alignItems: "baseline" }}>
                                                ${parseFloat(datosTransferencia?.Cantidad || 0).toLocaleString("es-MX", {
                                                    maximumFractionDigits: 2,
                                                    minimumFractionDigits: 2,
                                                })}
                                                <MDTypography component="span" variant="h4" fontWeight="bold" color="dark" ml={1}>
                                                    MXN
                                                </MDTypography>
                                            </MDTypography>
                                        </MDBox>
                                    </Grid>

                                    <Grid item xs={12} md={7} display="flex" flexDirection="column" justifyContent="space-between">
                                        <MDBox width="100%">

                                            {/* Cuenta Origen */}
                                            <MDBox mb={3}>
                                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="capitalize" display="block" mb={1}>
                                                    CUENTA ORIGEN
                                                </MDTypography>
                                                <MDBox display="flex" alignItems="center" p={2} bgcolor="#fdfdfd" borderRadius="12px" width="100%">
                                                    <MDBox>
                                                        <MDTypography variant="body2" fontWeight="medium" color="dark">
                                                            {datos.nombre + " " + datos.apellidoPaterno}
                                                        </MDTypography>
                                                        <MDTypography variant="caption" color="text" display="block">
                                                            {clientAccount?.Valor || beneficiario?.valor}
                                                        </MDTypography>
                                                    </MDBox>
                                                </MDBox>
                                            </MDBox>

                                            {/* Cuenta Destino */}
                                            <MDBox mb={4}>
                                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="capitalize" display="block" mb={1}>
                                                    CUENTA DESTINO
                                                </MDTypography>
                                                <MDBox display="flex" alignItems="center" p={2} bgcolor="#fdfdfd" borderRadius="12px" width="100%">
                                                    <MDBox>
                                                        <MDTypography variant="body2" fontWeight="bold" color="dark">
                                                            {clientAccount?.Beneficiario || beneficiario?.beneficiario}
                                                        </MDTypography>
                                                        <MDTypography variant="caption" color="text" display="block">
                                                            {clientAccount?.Valor || beneficiario?.valor}
                                                        </MDTypography>
                                                    </MDBox>
                                                </MDBox>
                                            </MDBox>

                                            {/* Título Datos de transferencia */}
                                            <MDTypography variant="button" fontWeight="bold" color="dark" display="block" mb={1} sx={{ fontSize: "0.95rem" }}>
                                                Datos de la transferencia
                                            </MDTypography>

                                            {/* Número de Autorización */}
                                            <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} sx={{ borderBottom: "1px solid #f2f4f7" }}>
                                                <MDTypography variant="body2" color="text">Número de autorización</MDTypography>
                                                <MDTypography variant="body2" fontWeight="bold" color="dark">
                                                    {datosTransferencia?.referencia}
                                                </MDTypography>
                                            </MDBox>

                                            {/* Clave de Rastreo */}
                                            <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} mb={5} sx={{ borderBottom: "1px solid #f2f4f7" }}>
                                                <MDTypography variant="body2" color="text">Clave de rastreo</MDTypography>
                                                <MDTypography variant="body2" fontWeight="bold" color="dark" sx={{ wordBreak: "break-all" }}>
                                                    085905592774313860
                                                </MDTypography>
                                            </MDBox>
                                        </MDBox>

                                        <Grid container spacing={2} mt="auto">
                                            <Grid item xs={12} md={6}>
                                                <MDButton
                                                    fullWidth
                                                    size="large"
                                                    variant="contained"
                                                    onClick={handleFinalizar}
                                                    style={{
                                                        backgroundColor: "#ff5f00",
                                                        color: "white",
                                                        borderRadius: "12px"
                                                    }}>
                                                    Finalizar
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <MDButton
                                                    fullWidth
                                                    size="large"
                                                    variant="contained"
                                                    // onClick={handleFinalizar}
                                                    color="secondary"
                                                    style={{

                                                        color: "white",
                                                        borderRadius: "12px"
                                                    }}>
                                                    Compartir Comprobante
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Card>
                        </MDBox>
                    </Grid>
                </Grid>
            </DashboardLayout>
        </>
    );
};