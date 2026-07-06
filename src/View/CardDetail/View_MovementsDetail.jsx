import React, { useEffect, useState } from "react";
import "dayjs/locale/es";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowBack,
  ArrowCircleDown,
  ArrowCircleUp,
  Error,
  SimCardDownload,
} from "@mui/icons-material";
import { InfoTransfer } from "Services/Card/Service_Transfer";
import { deleteStorage } from "Global/Expressions";
import { getTransferPDF } from "Services/Card/Service_Transfer";
import { dateTimeFormat } from "Global/Expressions";
import { FaFilePdf } from "react-icons/fa6";
import {
  Card,
  IconButton,
  useTheme,
  useMediaQuery,
  Grid,
  Alert,
} from "@mui/material";
import Loading from "Global/Loading/Loading";

export const View_MovementDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const detalle = location.state?.detalle || {};
  const isComision = location.state?.isComision || false;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ isShow: false });

  // Determinamos dinámicamente qué ID mandar al API
  const idBuscar = isComision
    ? detalle.idTransferenciaComision
    : detalle.idTransferencia;

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
    if (idBuscar) {
      getInfoTransferIndividual();
    }
  }, [idBuscar]);

  /* Obtiene el detalle unificado desde el API usando el ID correspondiente */
  async function getInfoTransferIndividual() {
    const sendData = {
      Id: idBuscar,
    };
    setLoading(true);
    await InfoTransfer(sendData)
      .then((data) => {
        if (data.code === 0) {
          setDataTransfer(data.data);
          setLoading(false);
        } else {
          setMessage({
            isShow: true,
            text: data.businessMeaning,
            type: "danger",
          });
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response?.status === 401) {
          if (error.response.data?.code === 2011) {
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

  /* Obtiene el base64 del PDF */
  async function getPDF() {
    const sendData = {
      Id: idBuscar,
    };
    setLoading(true);
    await getTransferPDF(sendData)
      .then((data) => {
        if (data.code === 0) {
          const linkSource = `data:application/pdf;base64,${data.businessMeaning}`;
          const downloadLink = document.createElement("a");
          const fileName = `Transferencia - ${dataTransfer.trackingKey}`;
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
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
        setLoading(false);
        if (error.response?.status === 401) {
          if (error.response.data?.code === 2011) {
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

  // Determinar el monto principal que se va a pintar en la cabecera gigante
  const montoAMostrar = isComision
    ? dataTransfer.monto || 0
    : dataTransfer.monto || 0;

  const clearMessage = () => {
    setMessage({
      isShow: false,
      text: "",
      type: "",
    });
  };

  return (
    <>
      {loading && <Loading show={loading} />}
      {message.isShow && (
        <Alert
          alert={message.type}
          message={message.text}
          onClose={clearMessage}
          open={message.isShow}
        />
      )}

      <DashboardLayout>
        <DashboardNavbar />

        <MDBox mb={4} display="flex" justifyContent="center">
          <Card
            sx={{
              width: "100%",
              maxWidth: "1000px",
              borderRadius: 4,
              boxShadow: 3,
              bgcolor: "#ffffff",
              p: isMobile ? 2 : 4,
            }}
          >
            {/* Encabezado dinámico según el origen */}
            <MDBox display="flex" alignItems="center">
              <IconButton
                onClick={() => navigate(-1)}
                sx={{ bgcolor: "#f0f2f5", mr: 2, p: 1 }}
              >
                <ArrowBack />
              </IconButton>
              <MDTypography variant="h6">
                {isComision ? "DETALLE DE COMISIÓN" : "DETALLE DE MOVIMIENTO"}
              </MDTypography>
            </MDBox>

            {/* Monto Principal */}
            <MDBox mt={{ md: 2, xs: 2 }} mb={3}>
              <MDTypography variant="button" color="text">
                Monto transferido:
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
                $
                {parseFloat(dataTransfer.monto || 0).toLocaleString("es-MX", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
                <MDTypography
                  component="span"
                  variant="h4"
                  fontWeight="bold"
                  color="dark"
                  ml={1}
                >
                  MXN
                </MDTypography>
              </MDTypography>
            </MDBox>

            <Grid
              item
              xs={12}
              md={7}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <MDBox width="100%">
                {/* Título de sección dinámico */}
                {/* <MDTypography
                  variant="button"
                  fontWeight="bold"
                  color="dark"
                  display="block"
                  mb={1}
                  sx={{ fontSize: "0.95rem" }}
                >
                  {isComision
                    ? "Datos del cargo por comisión"
                    : "Datos de la transferencia"}
                </MDTypography> */}

                {/* Estructura Única: Pinta lo que responda el API para este ID */}
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={2}
                  sx={{ borderBottom: "1px solid #f2f4f7" }}
                >
                  <MDTypography
                    variant="button"
                    color="text"
                    fontWeight="regular"
                  >
                    Fecha Registro
                  </MDTypography>
                  <MDTypography variant="caption" fontWeight="medium">
                    {dateTimeFormat(dataTransfer.fechaRegistro)}
                  </MDTypography>
                </MDBox>
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={2}
                  sx={{ borderBottom: "1px solid #f2f4f7" }}
                >
                  <MDTypography
                    variant="button"
                    color="text"
                    fontWeight="regular"
                  >
                    Clv Rastreo
                  </MDTypography>
                  <MDTypography variant="caption" fontWeight="medium">
                    {dataTransfer.trackingKey}
                  </MDTypography>
                </MDBox>

                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={2}
                  sx={{ borderBottom: "1px solid #f2f4f7" }}
                >
                  <MDTypography
                    variant="button"
                    color="text"
                    fontWeight="regular"
                  >
                    Estatus
                  </MDTypography>
                  <MDTypography variant="caption" fontWeight="medium">
                    {dataTransfer.idEstatus !==
                    2 ? null : dataTransfer.estado === "Pendiente" ? (
                      <MDTypography variant="subtitle" color="warning">
                        <Error color="warning" />
                        {" " + dataTransfer.estado}
                      </MDTypography>
                    ) : dataTransfer.estado === "Enviado" ? (
                      <MDTypography variant="subtitle" color="warning">
                        <ArrowCircleUp color="warning" />
                        {" " + dataTransfer.estado}
                      </MDTypography>
                    ) : dataTransfer.estado === "Liquidado" ? (
                      <MDTypography variant="subtitle" color="success">
                        <ArrowCircleUp color="success" />
                        {" " + dataTransfer.estado}
                      </MDTypography>
                    ) : dataTransfer.estado === "Devuelto" ? (
                      <MDTypography variant="subtitle" color="error">
                        <ArrowCircleDown color="error" />
                        {" " + dataTransfer.estado}
                      </MDTypography>
                    ) : dataTransfer.estado === "Cancelado" ? (
                      <MDTypography variant="subtitle" color="error">
                        <ArrowCircleDown color="error" />
                        {" " + dataTransfer.estado}
                      </MDTypography>
                    ) : (
                      <></>
                    )}
                  </MDTypography>
                </MDBox>

                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={2}
                  sx={{ borderBottom: "1px solid #f2f4f7" }}
                >
                  <MDTypography
                    variant="button"
                    color="text"
                    fontWeight="regular"
                  >
                    Fecha Liquidación
                  </MDTypography>
                  <MDTypography variant="caption" fontWeight="medium">
                    {dateTimeFormat(dataTransfer.fechaEstado)}
                  </MDTypography>
                </MDBox>

                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={2}
                  sx={{ borderBottom: "1px solid #f2f4f7" }}
                >
                  <MDTypography
                    variant="button"
                    color="text"
                    fontWeight="regular"
                  >
                    Detalle Error
                  </MDTypography>
                  <MDTypography variant="caption" fontWeight="medium">
                    {dataTransfer.errorDetail}
                  </MDTypography>
                </MDBox>

                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={2}
                  sx={{ borderBottom: "1px solid #f2f4f7" }}
                >
                  <MDTypography
                    variant="button"
                    color="text"
                    fontWeight="regular"
                  >
                    Beneficiario
                  </MDTypography>
                  <MDTypography variant="caption" fontWeight="medium">
                    {dataTransfer.beneficiario}
                  </MDTypography>
                </MDBox>

                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={2}
                  sx={{ borderBottom: "1px solid #f2f4f7" }}
                >
                  <MDTypography
                    variant="button"
                    color="text"
                    fontWeight="regular"
                  >
                    Banco
                  </MDTypography>
                  <MDTypography variant="caption" fontWeight="medium">
                    {dataTransfer?.banco}
                  </MDTypography>
                </MDBox>

                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={2}
                  sx={{ borderBottom: "1px solid #f2f4f7" }}
                >
                  <MDTypography
                    variant="button"
                    color="text"
                    fontWeight="regular"
                  >
                    {dataTransfer.tipoCuenta === "CLABE"
                      ? "Número de cuenta"
                      : "Número de tarjeta"}
                  </MDTypography>
                  <MDTypography variant="caption" fontWeight="medium">
                    {dataTransfer?.cuentaDestino}
                  </MDTypography>
                </MDBox>

                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={2}
                  sx={{ borderBottom: "1px solid #f2f4f7" }}
                >
                  <MDTypography
                    variant="button"
                    color="text"
                    fontWeight="regular"
                  >
                    Tipo Cuenta
                  </MDTypography>
                  <MDTypography variant="caption" fontWeight="medium">
                    {dataTransfer?.tipoCuenta}
                  </MDTypography>
                </MDBox>

                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={2}
                  sx={{ borderBottom: "1px solid #f2f4f7" }}
                >
                  <MDTypography
                    variant="button"
                    color="text"
                    fontWeight="regular"
                  >
                    Concepto
                  </MDTypography>
                  <MDTypography variant="caption" fontWeight="medium">
                    {dataTransfer?.concepto}
                  </MDTypography>
                </MDBox>

                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={2}
                  mb={5}
                  sx={{ borderBottom: "1px solid #f2f4f7" }}
                >
                  <MDTypography
                    variant="button"
                    color="text"
                    fontWeight="regular"
                  >
                    Referencia
                  </MDTypography>
                  <MDTypography variant="caption" fontWeight="medium">
                    {dataTransfer?.referencia}
                  </MDTypography>
                </MDBox>
              </MDBox>

              <Grid container spacing={2} rowSpacing={1.5} mt="auto">
                <Grid item xs={12} md={6}>
                  <a
                    href={dataTransfer.linkCep}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <MDButton
                      variant="contained"
                      color="info"
                      size="large"
                      fullWidth
                      style={{
                        color: "white",
                        borderRadius: "12px",
                      }}
                    >
                      <SimCardDownload
                        sx={{
                          width: "20px",
                          height: "20px",
                          color: "white !important",
                          mr: 1,
                        }}
                      />
                      Comprobante CEP
                    </MDButton>
                  </a>
                </Grid>

                <Grid item xs={12} md={6}>
                  <MDButton
                    onClick={() => getPDF()}
                    fullWidth
                    size="large"
                    variant="contained"
                    color="secondary"
                    style={{
                      color: "white",
                      borderRadius: "12px",
                    }}
                  >
                    <FaFilePdf
                      size={20}
                      color="#ffffff"
                      style={{ marginRight: "8px" }}
                    />
                    Descargar
                  </MDButton>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </MDBox>
      </DashboardLayout>
    </>
  );
};
