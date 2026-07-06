import Alert from "Global/Alert";
import Loading from "Global/Loading/Loading";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { Card, Grid, IconButton, Tooltip } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ModalConfirmation } from "Global/ModalConfirmation";
import { deleteStorage } from "Global/Expressions";
import { TransferToAccountE } from "Services/Card/Service_Transfer";
import { ModalConfirmationNIP } from "Global/ModalConfirmationNIP";
import { ArrowBack, CheckCircle, Edit } from "@mui/icons-material";

export const View_PreviewTransferencia = () => {
    const Ubicacion = JSON.parse(sessionStorage.getItem("ubicacion"));
    let pin = "0000";
    const navigate = useNavigate();
    const location = useLocation();
    const datosTransferencia = location.state?.datosTransferencia;
    const beneficiario = location.state?.beneficiario;
    const datos = location.state?.datos;
    const id = location.state?.id;
    const tarjeta = location.state?.tarjeta;
    const totalesExterna = location.state?.totalesExterna;
    const clientAccount = location.state?.clientAccount;
    const cuentaSeleccionada = location.state?.cuentaSeleccionada;
    const [loading, setLoading] = useState(false);
    const [modalConfirmar, setModalConfirmar] = useState(false);
    const [modalConfirmacion, setModalConfirmacion] = useState(false);
    const [message, setMessage] = useState({ isShow: false });

    useEffect(() => {
    }, []);

    const transferenciaExterna = async (e) => {
        // var formDecimal = datosTransferencia;
        var cantidadDecimal = parseFloat(datosTransferencia.Cantidad) * 1;
        var formDecimal = { ...datosTransferencia };
        formDecimal.Id = id;
        formDecimal.Referencia = datosTransferencia.Referencia;
        formDecimal.Concepto = datosTransferencia.Concepto;
        formDecimal.GuardaCuenta = datosTransferencia.GuardaCuenta;
        formDecimal.Cantidad = cantidadDecimal;
        formDecimal.NIP = pin;
        formDecimal.Longitud = Ubicacion.Longitud;
        formDecimal.Latitud = Ubicacion.Latitud;

        if (datosTransferencia.IdCuenta === 0 || !datosTransferencia.IdCuenta) {
            formDecimal.CuentaBanco = clientAccount;
        } else {
            formDecimal.CuentaBanco = cuentaSeleccionada;
        }
        setLoading(true);
        await TransferToAccountE(formDecimal)
            .then((data) => {
                if (data.code === 0) {
                    const idTransferencia = data.businessMeaning;
                    navigate("/SuccessTransfer", { state: { datos: datos, datosTransferencia: datosTransferencia, beneficiario: beneficiario, id: id, idTransferencia: idTransferencia } });
                    setLoading(false);
                } else {
                    setLoading(false);
                    setMessage({
                        isShow: true,
                        text: data.businessMeaning,
                        type: "danger",
                    });
                }
            })
            .catch((error) => {
                setLoading(false)
                if (error.response.status === 401) {
                    if (error.response.data.code === 2011) {
                        deleteStorage();
                        navigate("/SignIn");
                    } else {
                        setMessage({
                            text: error.message,
                            type: "danger",
                            isShow: true
                        });
                    }
                }
            });

    };

    const regresarAEditar = (e) => {
        e.preventDefault();
        navigate("/Transfer", {
            state: {
                id,
                datos,
                datosTransferencia,
                beneficiario,
                clientAccount,
                totalesExterna,
                tarjeta,
                isEditing: true
            }
        });
    };

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
            transferenciaExterna();
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
                <ModalConfirmationNIP
                    showModal={modalConfirmacion}
                    message={`¿Estás seguro de realizar la transferencia con una comisión de $${datos.comisionSpeiOut}?`}
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
                                    <Grid item>
                                        <Tooltip placement="top" title="Regresar">
                                            <IconButton
                                                onClick={close}
                                                sx={{ background: "#ebebeb", mr: 2 }}
                                            >
                                                <ArrowBack />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs>
                                        <MDTypography variant="h" fontWeight="bold">
                                            DETALLE TRANSFERENCIA
                                        </MDTypography>
                                    </Grid>

                                    {/* <Grid item xs textAlign="right">
                                        <MDTypography variant="h6" color="dark" fontWeight="bold">
                                            $
                                            {(tarjeta?.available ?? 0).toLocaleString("es-MX", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </MDTypography>
                                    </Grid> */}
                                </Grid>

                                <MDBox px={{ xs: 2, md: 5 }} >
                                    <Grid container alignItems="center" >
                                        <Grid item>
                                            <MDTypography variant="button" color="text">
                                                Monto a transferir:
                                            </MDTypography>
                                            <MDTypography
                                                variant="h1"
                                                fontWeight="bold"
                                                color="dark"
                                                sx={{
                                                    fontSize: { xs: "2.5rem", md: "3.2rem" },
                                                    display: "flex",
                                                    alignItems: "baseline",
                                                }}
                                            >
                                                ${parseFloat(datosTransferencia.Cantidad || 0).toLocaleString("es-MX", {
                                                    maximumFractionDigits: 2,
                                                    minimumFractionDigits: 2,
                                                })}
                                            </MDTypography>
                                        </Grid>
                                    </Grid>
                                </MDBox>

                                <MDBox px={{ xs: 2, md: 5 }}>
                                    <Grid container spacing={{ xs: 2, md: 6 }} justifyContent="left">
                                        <Grid item xs={12} md={5}>
                                            {/* <MDTypography variant="button" fontWeight="bold" color="text" textTransform="uppercase" display="block" >
                                                Cuenta Origen
                                            </MDTypography>
                                            <MDBox display="flex" flexDirection="column" mt={1} mb={3}>
                                                <MDTypography variant="caption" fontWeight="medium">
                                                    {datos.nombre + " " + datos.apellidoPaterno}
                                                </MDTypography>
                                                <MDTypography variant="caption" color="text">
                                                    {datos.numero || ""}
                                                </MDTypography>
                                            </MDBox> */}

                                            {/* <MDTypography variant="button" fontWeight="bold" color="text" textTransform="uppercase" display="block">
                                                Cuenta Destino
                                            </MDTypography> */}

                                            {/* <MDBox display="flex" flexDirection="column" mt={1} mb={1}>
                                                <MDTypography variant="caption" fontWeight="medium">
                                                    {clientAccount?.Beneficiario || beneficiario?.beneficiario || ""}
                                                </MDTypography>
                                                <MDTypography variant="caption" color="text">
                                                    {clientAccount?.Valor || beneficiario?.valor || ""}
                                                </MDTypography>
                                            </MDBox> */}
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <MDBox style={{ borderTop: "1px solid #f0f2f5" }}>
                                                <MDBox display="flex" justifyContent="space-between" alignItems="center" py={1} style={{ borderBottom: "1px solid #f0f2f5" }}>
                                                    <MDTypography variant="button" color="text" fontWeight="regular">Beneficiario</MDTypography>
                                                    <MDTypography variant="caption" fontWeight="medium">
                                                        {clientAccount?.Beneficiario || beneficiario?.beneficiario || ""}
                                                    </MDTypography>
                                                </MDBox>
                                                <MDBox display="flex" justifyContent="space-between" alignItems="center" py={1} style={{ borderBottom: "1px solid #f0f2f5" }}>
                                                    <MDTypography
                                                        variant="button"
                                                        color="text"
                                                        fontWeight="regular">Banco</MDTypography>
                                                    <MDTypography variant="caption" fontWeight="medium">
                                                        {beneficiario.banco}
                                                    </MDTypography>
                                                </MDBox>
                                                <MDBox display="flex" justifyContent="space-between" alignItems="center" py={1} style={{ borderBottom: "1px solid #f0f2f5" }}>
                                                    <MDTypography variant="button"
                                                        color="text"
                                                        fontWeight="regular">Tipo de Cuenta</MDTypography>
                                                    <MDTypography variant="caption" fontWeight="medium">
                                                        {beneficiario.tipoCuenta}
                                                    </MDTypography>
                                                </MDBox>
                                                <MDBox display="flex" justifyContent="space-between" alignItems="center" py={1} style={{ borderBottom: "1px solid #f0f2f5" }}>
                                                    <MDTypography
                                                        variant="button"
                                                        color="text"
                                                        fontWeight="regular">{beneficiario.tipoCuenta === "40 - CLABE" ? "Número de cuenta" : "Número de tarjeta"}</MDTypography>
                                                    <MDTypography variant="caption" fontWeight="medium">
                                                        {clientAccount.Valor || beneficiario.valor}
                                                    </MDTypography>
                                                </MDBox>
                                                <MDBox display="flex" justifyContent="space-between" alignItems="center" py={1} style={{ borderBottom: "1px solid #f0f2f5" }}>
                                                    <MDTypography
                                                        variant="button"
                                                        color="text"
                                                        fontWeight="regular">Concepto</MDTypography>
                                                    <MDTypography variant="caption" fontWeight="medium">{datosTransferencia.concepto}</MDTypography>
                                                </MDBox>

                                                <MDBox display="flex" justifyContent="space-between" alignItems="center" py={1} style={{ borderBottom: "1px solid #f0f2f5" }}>
                                                    <MDTypography
                                                        variant="button"
                                                        color="text"
                                                        fontWeight="regular">Referencia numérica</MDTypography>
                                                    <MDTypography variant="caption" fontWeight="medium">{datosTransferencia.referencia}</MDTypography>
                                                </MDBox>
                                            </MDBox>

                                            {/* <MDBox mt={4} mb={4} align="center">
                                                <MDTypography variant="caption" color="text" style={{ fontSize: "0.75rem" }}>
                                                    Tus transferencias interbancarias son gratis y seguras.
                                                </MDTypography>
                                            </MDBox> */}

                                            <Grid container spacing={2} mb={2} mt={2} >
                                                {/* <Grid item xs={12} md={6}>
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
                                                        }}>
                                                        <MDTypography variant="button" fontWeight="bold" color="white">
                                                            SALIR
                                                        </MDTypography>
                                                    </MDButton>
                                                </Grid> */}

                                                <Grid item xs={12} md={6}>
                                                    <MDButton
                                                        fullWidth
                                                        type="button"
                                                        variant="gradient"
                                                        size="large"
                                                        color="secondary"
                                                        onClick={regresarAEditar}
                                                        style={{
                                                            color: "white",
                                                            borderRadius: "12px"
                                                        }}>
                                                        <Edit
                                                            sx={{
                                                                width: "20px",
                                                                height: "20px",
                                                                color: "white !important",
                                                            }}
                                                        />
                                                        &nbsp;
                                                        <MDTypography variant="button" fontWeight="bold" color="white">
                                                            EDITAR
                                                        </MDTypography>
                                                    </MDButton>
                                                </Grid>

                                                <Grid item xs={12} md={6}>
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
                                                        <CheckCircle
                                                            sx={{
                                                                width: "20px",
                                                                height: "20px",
                                                                color: "white !important",
                                                            }}
                                                        />
                                                        &nbsp;
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