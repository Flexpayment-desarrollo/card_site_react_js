import Alert from "Global/Alert";
import Loading from "Global/Loading/Loading";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import {
    Card,
    Grid,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ModalGoogleAuth } from "Global/ModalGoogleAuth";
import { ModalConfirmation } from "Global/ModalConfirmation";


export const View_PreviewTransferencia = () => {
    let pin = "000000";
    const navigate = useNavigate();
    const location = useLocation();
    const datosTransferencia = location.state?.datosTransferencia;
    const beneficiario = location.state?.beneficiario;
    const datos = location.state?.datos;
    const id = location.state?.id;
    const clientAccount = location.state?.clientAccount;
    const [loading, setLoading] = useState(false);
    const [modalConfirmar, setModalConfirmar] = useState(false);
    const [modalConfirmacion, setModalConfirmacion] = useState(false);
    const [message, setMessage] = useState({ isShow: false });

    useEffect(() => {
    }, []);

    /*Método para salir*/
    const close = (e) => {
        e.preventDefault();
        setModalConfirmar(true);
    };

    /*Método para abrir el modal de bloquear o desbloquear*/
    const confirmar = (e) => {
        e.preventDefault();
        setModalConfirmacion(true);
    };

    /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
    const handleCloseConfirmacion = (e) => {
        if (typeof e === "string") {
            pin = e;
            setModalConfirmacion(false);
            //transferenciaExterna();
            navigate("/SuccessTransfer", { state: { datos: datos, datosTransferencia: datosTransferencia, beneficiario: beneficiario, id: id } });
        } else {
            if (e.target.name === "noBtn") {
                setModalConfirmacion(false);
            }
        }
    };

    /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
    const handleClose = (e) => {
        if (e.target.name === "yesBtn") {
            setModalConfirmar(false);
            navigate("/Card", { state: { info: id } });
        } else {
            if (e.target.name === "noBtn") {
                setModalConfirmar(false);
            }
        }
    };

    const clearMessage = () => {
        setMessage({ isShow: false });
    }

    return (
        <>
            {loading && <Loading show={loading} />}
            {message.isShow && (
                <Alert alert={message.type} message={message.text} onClose={clearMessage} open={message.isShow} />
            )}
            {modalConfirmar && (
                <ModalConfirmation
                    showModal={modalConfirmar}
                    message="¿Estás seguro de cancelar la transferencia?"
                    closeModal={handleClose}
                ></ModalConfirmation>
            )}
            {modalConfirmacion && (
                <ModalGoogleAuth
                    showModal={modalConfirmacion}
                    message="¿Estás seguro de realizar la transferencia?"
                    closeModal={handleCloseConfirmacion}
                />
            )}

            <DashboardLayout>
                <DashboardNavbar />
                <Grid container justifyContent="center" mb={3}>
                    <Grid item xs={12} display="flex">
                        <MDBox height="100%" width="100%">
                            <Card sx={{ maxWidth: "100%", height: "100%", borderRadius: "16px" }}>
                                <Grid container alignItems="center" p={3}>
                                    {/* <Grid item>
                                        <Tooltip placement="top" title="Regresar">
                                            <IconButton
                                                onClick={close}
                                                sx={{ background: "#ebebeb", mr: 2 }}
                                            >
                                                <ArrowBack />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid> */}
                                    <Grid item xs>
                                        <MDTypography variant="h" fontWeight="bold">
                                            DETALLE TRANSFERENCIA
                                        </MDTypography>
                                    </Grid>
                                </Grid>

                                <MDBox px={{ xs: 2, md: 10 }} >
                                    <Grid container alignItems="center" >
                                        <Grid item>
                                            <MDTypography variant="caption" color="dark">
                                                Monto a transferir:
                                            </MDTypography>
                                            <MDTypography variant="h4" fontWeight="bold" color="dark">
                                                ${parseFloat(datosTransferencia.Cantidad).toLocaleString("es-MX", {
                                                    maximumFractionDigits: 2,
                                                    minimumFractionDigits: 2,
                                                })}
                                            </MDTypography>
                                        </Grid>
                                    </Grid>
                                </MDBox>



                                <MDBox px={{ xs: 2, md: 5 }} py={5}>
                                    <Grid container spacing={{ xs: 2, md: 6 }} justifyContent="left">
                                        <Grid item xs={12} md={5}>

                                            <MDTypography variant="button" fontWeight="bold" color="text" textTransform="uppercase" display="block" >
                                                Cuenta Origen
                                            </MDTypography>
                                            {/* <MDBox display="flex" alignItems="left" justifyContent="space-between" mb={4} mt={1} p={2} bgcolor={{ xs: "transparent", md: "#fafafa" }} borderRadius="12px">
                                                <MDBox display="flex" alignItems="left">
                                                    <MDBox
                                                        width="45px"
                                                        height="30px"
                                                        borderRadius="4px"
                                                        bgcolor="#004b8d"
                                                        mr={2} /> */}
                                            <MDBox display="flex" flexDirection="column" mt={2} mb={6}>
                                                <MDTypography variant="body2" fontWeight="medium" color="dark">
                                                    {datos.nombre + " " + datos.apellidoPaterno}
                                                </MDTypography>
                                                <MDTypography variant="caption" color="text">
                                                    {datos.numeroEnmascarado}
                                                </MDTypography>
                                                {/* </MDBox>
                                                </MDBox>*/}
                                            </MDBox>

                                            <MDTypography variant="button" fontWeight="bold" color="text" textTransform="uppercase" display="block" mb={1}>
                                                Cuenta Destino
                                            </MDTypography>

                                            {/* <MDBox display="flex" alignItems="left" justifyContent="space-between" mb={4} mt={1} p={2} bgcolor={{ xs: "transparent", md: "#fafafa" }} borderRadius="12px">
                                                <MDBox display="flex" alignItems="left">
                                                    <MDBox
                                                        width="45px"
                                                        height="30px"
                                                        borderRadius="4px"
                                                        bgcolor="#004b8d"
                                                        mr={2} /> */}
                                            <MDBox display="flex" flexDirection="column" mt={2} mb={4}>
                                                <MDTypography variant="body2" fontWeight="medium" color="dark">
                                                    {clientAccount.Beneficiario || beneficiario.beneficiario}
                                                </MDTypography>
                                                <MDTypography variant="caption" color="text">
                                                    {clientAccount.Valor || beneficiario.valor}
                                                </MDTypography>
                                                {/* </MDBox>
                                                </MDBox> */}
                                            </MDBox>
                                        </Grid>

                                        <Grid item xs={12} md={6}>

                                            <MDBox style={{ borderTop: "1px solid #f0f2f5" }}>
                                                <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} style={{ borderBottom: "1px solid #f0f2f5" }}>
                                                    <MDTypography variant="body2" color="text">Tipo de beneficiario</MDTypography>
                                                    <MDTypography variant="body2" fontWeight="bold" color="dark">Persona</MDTypography>
                                                </MDBox>

                                                <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} style={{ borderBottom: "1px solid #f0f2f5" }}>
                                                    <MDTypography variant="body2" color="text">Número de cuenta</MDTypography>
                                                    <MDTypography variant="body2" fontWeight="bold" color="dark">
                                                        {clientAccount.Valor || beneficiario.valor}
                                                    </MDTypography>
                                                </MDBox>

                                                <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} style={{ borderBottom: "1px solid #f0f2f5" }}>
                                                    <MDTypography variant="body2" color="text">Concepto</MDTypography>
                                                    <MDTypography variant="body2" fontWeight="bold" color="dark">{datosTransferencia.concepto}</MDTypography>
                                                </MDBox>

                                                <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} style={{ borderBottom: "1px solid #f0f2f5" }}>
                                                    <MDTypography variant="body2" color="text">Referencia numérica</MDTypography>
                                                    <MDTypography variant="body2" fontWeight="bold" color="dark">{datosTransferencia.referencia}</MDTypography>
                                                </MDBox>

                                                <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} style={{ borderBottom: "1px solid #f0f2f5" }}>
                                                    <MDTypography variant="body2" color="text">Fecha y hora</MDTypography>
                                                    <MDTypography variant="body2" fontWeight="bold" color="dark">Ahora mismo</MDTypography>
                                                </MDBox>
                                            </MDBox>

                                            <MDBox mt={4} mb={4} align="center">
                                                <MDTypography variant="caption" color="text" style={{ fontSize: "0.75rem" }}>
                                                    Tus transferencias interbancarias son gratis y seguras.
                                                </MDTypography>
                                            </MDBox>

                                            <Grid container spacing={2} mb={2}>
                                                <Grid item xs={6}>
                                                    <MDButton
                                                        fullWidth
                                                        size="large"
                                                        type="button"
                                                        variant="gradient"
                                                        color="secondary"
                                                        onClick={close}
                                                        style={{
                                                            boxShadow: "none",
                                                            borderRadius: "12px"
                                                        }}
                                                    >
                                                        <MDTypography variant="button" fontWeight="bold" color="white">
                                                            SALIR
                                                        </MDTypography>
                                                    </MDButton>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <MDButton
                                                        fullWidth
                                                        type="button"
                                                        variant="gradient"
                                                        size="large"
                                                        onClick={confirmar}
                                                        style={{
                                                            backgroundColor: "#ff5f00",
                                                            color: "white",
                                                            borderRadius: "12px"
                                                        }}>
                                                        <MDTypography variant="button" fontWeight="bold" color="white">
                                                            CONFIRMAR
                                                        </MDTypography>
                                                    </MDButton>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </MDBox>
                            </Card>
                        </MDBox>
                    </Grid>
                </Grid>
            </DashboardLayout>
        </>
    );
};