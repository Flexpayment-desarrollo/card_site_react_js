import Alert from "Global/Alert";
import Loading from "Global/Loading/Loading";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { Card, Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { InfoTransfer } from "Services/Card/Service_Transfer";
import { deleteStorage } from "Global/Expressions";
import { dateTimeFormat } from "Global/Expressions";
import { getTransferPDF } from "Services/Card/Service_Transfer";
import { FaFilePdf } from "react-icons/fa6";
import { BiSolidExit } from "react-icons/bi";
import { ArrowCircleDown, ArrowCircleUp, CheckCircleOutline, Error, SimCardDownload } from "@mui/icons-material";

export const View_SuccessTransfer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const datosTransferencia = location.state?.datosTransferencia || {};
    const id = location.state?.id;
    const idTransferencia = location.state?.idTransferencia;
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ isShow: false });
    const [dataTransfer, setDataTransfer] = useState({
        beneficiario: "",
        banco: "",
        concepto: "",
        cuentaDestino: "",
        idBanco: 0,
        monto: 0,
        montoComisionSpeiOut: 0,
        montoTotal: 0,
        referencia: "",
        trackingKey: "",
        tipoCuenta: "",
        fechaRegistro: new Date(),
        fechaAprobacion: new Date(),
    });

    useEffect(() => {
        getInfoTransferIndividual();
    }, []);

    /*Obtiene el detalle de una transferencia*/
    async function getInfoTransferIndividual() {
        const sendData = {
            Id: idTransferencia,
        };
        setLoading(true);
        await InfoTransfer(sendData)
            .then((data) => {
                setLoading(false);
                if (data.code === 0) {
                    setDataTransfer(data.data);
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
                    }
                }
            });
    }

    /*Obtiene el base64 del PDF de una transferencia Individual*/
    async function getPDF() {
        const sendData = {
            Id: idTransferencia,
        };
        setLoading(true);
        await getTransferPDF(sendData).then((data) => {
            if (data.code === 0) {
                const linkSource = `data:application/pdf;base64,${data.businessMeaning}`;
                const downloadLink = document.createElement("a");
                const fileName = `Transferencia - ${dataTransfer.trackingKey}`;
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
                setLoading(false);
            }
            else {
                setLoading(false)
                setMessage({
                    isShow: true,
                    text: data.businessMeaning,
                    type: "danger",
                });
            }
        }).catch((error) => {
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
        }
        );
    };



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
                                        <MDBox mb={2} display="flex" justifyContent="left" alignItems="left" width="100%">
                                            <CheckCircleOutline
                                                fontSize="none"
                                                sx={{ fontSize: "100px", color: "#00a86b" }}
                                            />
                                        </MDBox>
                                        <MDTypography variant="h4" fontWeight="bold" color="dark" mb={1} sx={{ fontSize: { xs: "1.5rem", md: "1.8rem" } }}>
                                            Transferencia exitosa
                                        </MDTypography>

                                        <MDTypography variant="button" color="text" mb={4} sx={{ lineHeight: 1.5, maxWidth: "380px" }}>
                                            Esta transferencia ha sido aceptada. Para validarla consulta tu Comprobante Electrónico de Pago (CEP)
                                        </MDTypography>

                                        <MDBox mt={{ md: 1, xs: -2 }}>
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
                                            {/* <MDBox mb={3} mt={4}>
                                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="capitalize" display="block" mb={1}>
                                                    CUENTA ORIGEN
                                                </MDTypography>
                                                <MDBox display="flex" alignItems="center" pt={2} bgcolor="#fdfdfd" borderRadius="12px" width="100%">
                                                    <MDBox> */}
                                            {/* <MDTypography variant="caption" fontWeight="medium">
                                                            {datos.nombre + " " + datos.apellidoPaterno}
                                                        </MDTypography> */}
                                            {/* <MDTypography variant="caption" color="text" display="block">
                                                            {dataTransfer?.cuentaOrigen}
                                                        </MDTypography>
                                                    </MDBox>
                                                </MDBox>
                                            </MDBox> */}

                                            {/* Cuenta Destino */}
                                            {/* <MDBox mb={4}>
                                                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="capitalize" display="block" mb={1}>
                                                    CUENTA DESTINO
                                                </MDTypography>
                                                <MDBox display="flex" alignItems="center" pt={2} pb={2} bgcolor="#fdfdfd" borderRadius="12px" width="100%">
                                                    <MDBox>
                                                        <MDTypography variant="caption" fontWeight="medium">
                                                            {dataTransfer.beneficiario}
                                                        </MDTypography>
                                                        <MDTypography variant="caption" color="text" display="block">
                                                            {dataTransfer?.cuentaDestino}
                                                        </MDTypography>
                                                    </MDBox>
                                                </MDBox>
                                            </MDBox> */}

                                            {/* Título Datos de transferencia */}
                                            <MDBox mb={1} mt={2}>
                                                <MDTypography variant="button" fontWeight="bold" color="dark" display="block" mb={1} sx={{ fontSize: "0.95rem" }}>
                                                    Datos de la transferencia
                                                </MDTypography>
                                            </MDBox>

                                            <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} sx={{ borderBottom: "1px solid #f2f4f7" }}>
                                                <MDTypography variant="button" color="text" fontWeight="regular">Fecha Registro</MDTypography>
                                                <MDTypography variant="caption" fontWeight="medium">
                                                    {dateTimeFormat(dataTransfer.fechaRegistro)}
                                                </MDTypography>
                                            </MDBox>

                                            {/* Clave de Rastreo */}
                                            <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} sx={{ borderBottom: "1px solid #f2f4f7" }}>
                                                <MDTypography variant="button" color="text" fontWeight="regular">Clv Rastreo</MDTypography>
                                                <MDTypography variant="button" fontWeight="medium" color="dark">
                                                    {dataTransfer.trackingKey}
                                                </MDTypography>
                                            </MDBox>

                                            {/* Estatus */}
                                            <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} sx={{ borderBottom: "1px solid #f2f4f7" }}>
                                                <MDTypography variant="button" color="text" fontWeight="regular">Estatus</MDTypography>
                                                <MDTypography variant="caption" fontWeight="medium">
                                                    {dataTransfer.idEstatus !== 2 ?
                                                        null
                                                        :
                                                        (dataTransfer.estado === "Pendiente") ?
                                                            <><MDTypography variant="subtitle" color="warning"><Error color="warning" />{" " + dataTransfer.estado}</MDTypography></>
                                                            :
                                                            (dataTransfer.estado === "Enviado") ?
                                                                <><MDTypography variant="subtitle" color="warning"><ArrowCircleUp color="warning" />{" " + dataTransfer.estado}</MDTypography></>
                                                                :
                                                                (dataTransfer.estado === "Liquidado") ?
                                                                    <><MDTypography variant="subtitle" color="success"><ArrowCircleUp color="success" />{" " + dataTransfer.estado}</MDTypography></>
                                                                    :
                                                                    (dataTransfer.estado === "Devuelto") ?
                                                                        <><MDTypography variant="subtitle" color="error"><ArrowCircleDown color="error" />{" " + dataTransfer.estado}</MDTypography></>
                                                                        :
                                                                        (dataTransfer.estado === "Cancelado") ?
                                                                            <><MDTypography variant="subtitle" color="error"><ArrowCircleDown color="error" />{" " + dataTransfer.estado}</MDTypography></>
                                                                            :
                                                                            <></>
                                                    }
                                                </MDTypography>
                                            </MDBox>

                                            {/* Fecha aprobacion */}
                                            <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} sx={{ borderBottom: "1px solid #f2f4f7" }}>
                                                <MDTypography variant="button" color="text" fontWeight="regular">Fecha Liquidación</MDTypography>
                                                <MDTypography variant="caption" fontWeight="medium">
                                                    {dateTimeFormat(dataTransfer.fechaEstado)}
                                                </MDTypography>
                                            </MDBox>

                                            {/* Detalle Error */}
                                            {/* {dataTransfer.idEstatus !== 2 ? */}
                                            <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} sx={{ borderBottom: "1px solid #f2f4f7" }}>
                                                <MDTypography variant="button" color="text" fontWeight="regular">Detalle Error</MDTypography>
                                                <MDTypography variant="caption" fontWeight="medium">
                                                    {dataTransfer.errorDetail}
                                                </MDTypography>
                                            </MDBox>
                                            {/* : <></>} */}

                                            <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} sx={{ borderBottom: "1px solid #f2f4f7" }}>
                                                <MDTypography variant="button" color="text" fontWeight="regular">Beneficiario</MDTypography>
                                                <MDTypography variant="caption" fontWeight="medium">
                                                    {dataTransfer.beneficiario}
                                                </MDTypography>
                                            </MDBox>

                                            <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} sx={{ borderBottom: "1px solid #f2f4f7" }}>
                                                <MDTypography variant="button" color="text" fontWeight="regular">Banco</MDTypography>
                                                <MDTypography variant="caption" fontWeight="medium">
                                                    {dataTransfer?.banco}
                                                </MDTypography>
                                            </MDBox>

                                            <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} sx={{ borderBottom: "1px solid #f2f4f7" }}>
                                                <MDTypography variant="button" color="text" fontWeight="regular">{dataTransfer.tipoCuenta === "CLABE" ? "Número de cuenta" : "Número de tarjeta"}</MDTypography>
                                                <MDTypography variant="caption" fontWeight="medium">
                                                    {dataTransfer?.cuentaDestino}
                                                </MDTypography>
                                            </MDBox>

                                            <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} sx={{ borderBottom: "1px solid #f2f4f7" }}>
                                                <MDTypography variant="button" color="text" fontWeight="regular">Tipo Cuenta</MDTypography>
                                                <MDTypography variant="caption" fontWeight="medium">
                                                    {dataTransfer?.tipoCuenta}
                                                </MDTypography>
                                            </MDBox>

                                            {/* Referencia */}
                                            <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} sx={{ borderBottom: "1px solid #f2f4f7" }}>
                                                <MDTypography variant="button" color="text" fontWeight="regular">Concepto</MDTypography>
                                                <MDTypography variant="caption" fontWeight="medium">
                                                    {dataTransfer?.concepto}
                                                </MDTypography>
                                            </MDBox>

                                            <MDBox display="flex" justifyContent="space-between" alignItems="center" py={2} mb={5} sx={{ borderBottom: "1px solid #f2f4f7" }}>
                                                <MDTypography variant="button" color="text" fontWeight="regular">Referencia</MDTypography>
                                                <MDTypography variant="caption" fontWeight="medium">
                                                    {dataTransfer?.referencia}
                                                </MDTypography>
                                            </MDBox>
                                        </MDBox>
                                        <Grid container spacing={2} rowSpacing={1.5} mt="auto">
                                            {/* Botón Comprobante CEP */}
                                            <Grid item xs={12} md={6}>
                                                <a href={dataTransfer.linkCep} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                                    <MDButton
                                                        variant="contained"
                                                        color="info"
                                                        size="large"
                                                        fullWidth
                                                        style={{
                                                            color: "white",
                                                            borderRadius: "12px"
                                                        }}
                                                    >
                                                        <SimCardDownload sx={{ width: "20px", height: "20px", color: "white !important", mr: 1 }} />
                                                        Comprobante CEP
                                                    </MDButton>
                                                </a>
                                            </Grid>

                                            {/* Botón Descargar PDF */}
                                            <Grid item xs={12} md={6}>
                                                <MDButton
                                                    onClick={() => getPDF()}
                                                    fullWidth
                                                    size="large"
                                                    variant="contained"
                                                    color="secondary"
                                                    style={{
                                                        color: "white",
                                                        borderRadius: "12px"
                                                    }}>
                                                    <FaFilePdf size={20} color="#ffffff" style={{ marginRight: '8px' }} />
                                                    Descargar
                                                </MDButton>
                                            </Grid>

                                            {/* Botón Finalizar */}
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
                                                    }}
                                                >
                                                    <BiSolidExit size={20} color="#ffffff" style={{ marginRight: '8px' }} />
                                                    Finalizar
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
