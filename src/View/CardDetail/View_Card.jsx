import React, { useEffect, useState } from "react";
import Loading from "Global/Loading/Loading";
import dayjs from "dayjs";
import Alert from "Global/Alert";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import EasyCard from "assets/images/EasyCard.png";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { MdOutlinePassword } from "react-icons/md";
import { FaEyeSlash, FaMoneyBillTransfer, FaWallet } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowBack,
  ContentCopy,
  Error,
  Send,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { ModalConfirmation } from "Global/ModalConfirmation";
import { View_Transferir } from "View/Card/View_Transferir";
import { deleteStorage } from "Global/Expressions";
import { getCardDetail } from "Services/Card/Service_Card";
import { cambiarEstatusCard } from "Services/Card/Service_Card";
import { watchNIP } from "Services/Card/Service_Card";
import { getMovements } from "Services/Card/Service_Card";
import { getCVVDinamico } from "Services/Card/Service_Card";
import {
  Card,
  Divider,
  Grid,
  IconButton,
  Switch,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Component_ContadorNIP from "ComponentsEasy/Card/Component_ContadorNIP";
import { Component_CVVDinamico } from "ComponentsEasy/Card/Component_CVVDinamico";
import { Component_TableMovmentsCard } from "ComponentsEasy/Card/Component_TableMovmentsCard";
import MDAlert from "components/MDAlert";

export const View_Card = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const info = location.state?.info;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const [listMovimientos, setListMovimientos] = useState([]);
  const [showTransferir, setShowTransferir] = useState(false);
  const [nip, setNip] = useState("0000");
  const [showNip, setShowNip] = useState(false);
  const [CVV, setCVV] = useState("000");
  const [showCVV, setShowCVV] = useState(false);
  const [isAlertValide, setIsAlertValide] = useState(false);
  const [modalConfirmacionBloquear, setModalConfirmacionBloquear] =
    useState(false);
  const [dateStart, setDateStart] = useState(dayjs(new Date()));
  const [datos, setDatos] = useState({
    numeroEnmascarado: "0000000000000000",
    saldoMonedero: 0,
  });
  const [tarjeta, setTarjeta] = useState({
    available: 0,
    status: "",
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

    DetalleTarjeta();
  }, [isAlertValide, message.isShow]);

  const establecerRangoMes = (tipo = "actual") => {
    const hoy = dayjs();
    let inicio, fin;

    if (tipo === "actual") {
      inicio = hoy.startOf("month");
      fin = hoy;
    } else {
      inicio = hoy.subtract(1, "month").startOf("month");
      fin = hoy.subtract(1, "month").endOf("month");
    }

    setDateStart(inicio);

    const inicioStr = inicio.format("YYYY-MM-DD");
    const finStr = fin.format("YYYY-MM-DD");

    getMovimientos(inicioStr, finStr);
  };

  // Método que obtiene el detalle de una tarjeta
  const DetalleTarjeta = async () => {
    setLoading(true);
    const datos = {
      Id: info,
    };
    await getCardDetail(datos)
      .then((data) => {
        if (data.code === 0) {
          setDatos(data.data);
          setTarjeta(data.data.infoMetricas);
          establecerRangoMes();
        } else {
          setLoading(false);
          setMessage({
            isShow: true,
            text: data.businessMeaning,
            type: "error",
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
              type: "error",
              isShow: true,
            });
            setIsAlertValide(true);
          }
        }
      });
  };

  //Método que cambia el estatus a bloqueado o desbloqueado de la tarjeta
  async function putCambiarEstatus() {
    const sendData = {
      Id: info,
      Active: tarjeta.status === "ACTIVE" ? false : true,
    };
    setLoading(true);
    try {
      const res = await cambiarEstatusCard(sendData);
      if (res.code === 0) {
        setMessage({
          isShow: true,
          text:
            tarjeta.status === "ACTIVE"
              ? "Se bloqueó correctamente"
              : "Se desbloqueó correctamente",
          type: "success",
        });
        setIsAlertValide(true);
        await DetalleTarjeta();
      } else {
        setLoading(false);
        setMessage({
          isShow: true,
          text: res.businessMeaning,
          type: "error",
        });
        setIsAlertValide(true);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        if (error.response.data.code === 2011) {
          sessionStorage.setItem("newToken", "");
          navigate("/SignIn");
        } else {
          setMessage({
            text: error.message,
            type: "error",
            isShow: true,
          });
          setIsAlertValide(true);
        }
      } else {
        setMessage({
          isShow: true,
          text: error.name + " " + error.message,
          type: "error",
        });
        setIsAlertValide(true);
      }
    } finally {
      setLoading(false);
    }
  }

  //Método que muestra el Nip
  async function verNip() {
    const sendData = {
      Id: info,
    };
    setLoading(true);
    try {
      const res = await watchNIP(sendData);
      console.log(res);
      if (res.code === 0) {
        setNip(res.businessMeaning);
      } else {
        setLoading(false);
        setMessage({
          isShow: true,
          text: res.businessMeaning,
          type: "error",
        });
        setIsAlertValide(true);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.response && error.response.status === 401) {
        if (error.response.data.code === 2011) {
          sessionStorage.setItem("newToken", "");
          navigate("/SignIn");
        } else {
          setMessage({
            text: error.message,
            type: "error",
            isShow: true,
          });
          setIsAlertValide(true);
        }
      } else {
        setMessage({
          isShow: true,
          text: error.name + " " + error.message,
          type: "error",
        });
        setIsAlertValide(true);
      }
    } finally {
      setLoading(false);
    }
  }

  //Método que obtiene el CVV dinámico
  const getCVV = async () => {
    const sendData = {
      Id: info,
    };
    setLoading(true);
    try {
      const res = await getCVVDinamico(sendData);
      if (res.code === 0) {
        setCVV(res.businessMeaning);
      } else {
        setLoading(false);
        setMessage({
          isShow: true,
          text: res.businessMeaning,
          type: "error",
        });
        setIsAlertValide(true);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        if (error.response.data.code === 2011) {
          sessionStorage.setItem("newToken", "");
          navigate("/SignIn");
        } else {
          setMessage({
            text: error.message,
            type: "error",
            isShow: true,
          });
          setIsAlertValide(true);
        }
      } else {
        setMessage({
          isShow: true,
          text: error.name + " " + error.message,
          type: "error",
        });
        setIsAlertValide(true);
      }
    } finally {
      setLoading(false);
    }
  };

  //Método que obtiene la lista de los movimientos del fondeo
  const getMovimientos = async (inicioStr, finStr) => {
    const datos = {
      Id: info,
      DateInit: inicioStr,
      DateEnd: finStr,
    };
    setLoading(true);
    await getMovements(datos)
      .then((data) => {
        if (data.code === 0) {
          if (data.data !== null) {
            setListMovimientos(data.data || []);
          } else {
            setListMovimientos([]);
          }
          setLoading(false);
        } else {
          setLoading(false);
          setMessage({
            isShow: true,
            text: data.businessMeaning,
            type: "error",
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
              type: "error",
              isShow: true,
            });
            setIsAlertValide(true);
          }
        }
      });
  };

  /*Método para abrir el modal de bloquear o desbloquear*/
  const bloquearODesbloquear = (e) => {
    e.preventDefault();
    setModalConfirmacionBloquear(true);
  };

  /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
  const handleCloseBloquearODesbloquear = (e) => {
    if (e.target.name === "yesBtn") {
      setModalConfirmacionBloquear(false);
      putCambiarEstatus();
    } else {
      if (e.target.name === "noBtn") {
        setModalConfirmacionBloquear(false);
      }
    }
  };

  const crearTransferencia = () => {
    navigate("/Transfer", {
      state: { id: datos.id, datos: datos },
    });
  };

  const dispersionMonedero = () => {
    navigate("/Wallet", {
      state: { id: datos.id, datos: datos },
    });
  };

  const transferirCardToCard = () => {
    navigate("/TransferCard", {
      state: { id: datos.id, datos: datos },
    });
  };

  const btnShowNip = () => {
    setShowNip(true);
    verNip();
  };

  const btnHideNip = () => {
    setShowNip(false);
  };

  const btnShowCVV = () => {
    setShowCVV(true);
    getCVV();
  };

  const btnHideCVV = () => {
    setShowCVV(false);
  };

  const cerrar = () => {
    setShowTransferir(false);
  };

  const refresh = () => {
    setShowTransferir(false);
    DetalleTarjeta();
  };

  /** Metodo que limpia los mensajes */
  const clearMessage = () => {
    setMessage({
      isShow: false,
    });
  };

  return (
    <>
      {loading && <Loading show={loading} />}
      {/* {message.isShow && (
        <Alert
          alert={message.type}
          message={message.text}
          onClose={clearMessage}
          open={message.isShow}
        />
      )} */}
      {modalConfirmacionBloquear && (
        <ModalConfirmation
          showModal={modalConfirmacionBloquear}
          message={
            tarjeta.status === "ACTIVE"
              ? "¿Estás seguro de bloquear la tarjeta?"
              : "¿Estás seguro de desbloquear la tarjeta?"
          }
          closeModal={handleCloseBloquearODesbloquear}
        />
      )}

      <DashboardLayout>
        <DashboardNavbar />
        {/* <MDBox>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12}>
              <Card sx={{ p: isMobile ? 2 : 3 }}>
                <Grid container alignItems="center" mb={3}>
                  <Grid item xs={6} sm={6}>
                    <Tooltip placement="top" title="Regresar">
                      <IconButton
                        onClick={() => navigate("/Cards")}
                        sx={{
                          background: grey[100],
                          color: "#41464b",
                          "&:hover": { background: grey[200] },
                        }}
                      >
                        <ArrowBack />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={6} sm={6} style={{ textAlign: "right" }}>
                    <Tooltip placement="top" title="Refrescar">
                      <IconButton onClick={DetalleTarjeta}>
                        <Refresh />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid
                    item
                    xs={12}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mb={2}
                  >
                    <MDBox
                      sx={{
                        width: isMobile ? "100%" : "400px",
                        maxWidth: "400px",
                        "& > div": { width: "100% !important" },
                        transition: "all 0.3s ease", // Animación suave al cambiar
                      }}
                    >
                      <MasterCard
                        number={datos.numeroEnmascarado}
                        holder={`${datos.nombre} ${datos.apellidoPaterno}`}
                        expires={tarjeta.expirationDate}
                      />
                    </MDBox>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={12}
                    spacing={2}
                    justifyContent="space-around"
                  >
                    <Grid item xs={3} sm={3}></Grid>
                    <Grid item xs={3} sm={3} textAlign="center">
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="bold"
                        display="block"
                      >
                        DISPONIBLE
                      </MDTypography>
                      <MDTypography
                        variant={isMobile ? "h6" : "h5"}
                        color="dark"
                        fontWeight="bold"
                      >
                        $
                        {tarjeta.available.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={3} sm={3} textAlign="center">
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="bold"
                        display="block"
                      >
                        SALDO MONEDERO
                      </MDTypography>
                      <MDTypography
                        variant={isMobile ? "h6" : "h5"}
                        color="dark"
                        fontWeight="bold"
                      >
                        $
                        {datos.saldoMonedero.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={3} sm={3}></Grid>

                    <Grid item xs={3} sm={3} textAlign="right">
                      <MDTypography
                        variant="caption"
                        fontWeight="bold"
                        color="text"
                        display="block"
                      >
                        ESTATUS
                      </MDTypography>
                      <Switch
                        onChange={bloquearODesbloquear}
                        id={info.toString()}
                        checked={tarjeta.status === "ACTIVE" ? true : false}
                        sx={{
                          "& .MuiSwitch-switchBase": {
                            "&.Mui-checked": {
                              "+ .MuiSwitch-track": {
                                backgroundColor: "#ff5f00",
                              },
                              ".MuiSwitch-thumb": {
                                backgroundColor: "#4caf4f",
                              },
                              "+ .MuiSwitch-track": {
                                backgroundColor: "#dacece !important",
                                border: "#ced4da",
                              },
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={3} sm={3} textAlign="center">
                      <MDTypography
                        variant="caption"
                        fontWeight="bold"
                        color="text"
                        display="block"
                      >
                        NIP
                      </MDTypography>
                      <MDBox
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {showNip && (
                          <MDTypography
                            variant="h6"
                            color="info"
                            sx={{ mr: 1 }}
                          >
                            {nip}
                          </MDTypography>
                        )}
                        <Tooltip title={showNip ? "Ocultar" : "Ver"}>
                          <IconButton
                            onClick={showNip ? btnHideNip : btnShowNip}
                            sx={{ background: grey[100], p: 1 }}
                          >
                            {showNip ? (
                              <FaEyeSlash size={16} />
                            ) : (
                              <MdOutlinePassword size={16} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </MDBox>
                      {showNip && (
                        <MDBox mt={0.5}>
                          <Component_ContadorNIP
                            segundosIniciales={30}
                            alTerminar={btnHideNip}
                          />
                        </MDBox>
                      )}
                    </Grid>
                    <Grid item xs={3} sm={3} textAlign="left">
                      <MDTypography
                        variant="caption"
                        fontWeight="bold"
                        color="text"
                        display="block"
                      >
                        CVV
                      </MDTypography>
                      <MDBox
                        display="flex"
                        alignItems="left"
                        justifyContent="left"
                      >
                        {showCVV && (
                          <MDTypography
                            variant="h6"
                            color="info"
                            sx={{ mr: 1 }}
                          >
                            {CVV}
                          </MDTypography>
                        )}
                        <Tooltip title={showCVV ? "Ocultar" : "Ver"}>
                          <IconButton
                            onClick={showCVV ? btnHideCVV : btnShowCVV}
                            sx={{ background: grey[100], p: 1 }}
                          >
                            {showCVV ? (
                              <RiLockPasswordFill size={16} />
                            ) : (
                              <MdOutlinePassword size={16} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </MDBox>
                      {showCVV && (
                        <MDBox mt={0.5}>
                          <Component_CVVDinamico
                            info={info}
                            segundosIniciales={240}
                            alTerminar={btnHideCVV}
                          />
                        </MDBox>
                      )}
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    display="flex"
                    justifyContent={isMobile ? "center" : "flex-end"}
                    gap={2}
                    mt={2}
                  >
                    <MDButton
                      variant="gradient"
                      color="error"
                      size="small"
                      onClick={transferirCardToCard}
                      startIcon={<FaMoneyBillTransfer size={16} />}
                    >
                      TRANSFERIR A TARJETA
                    </MDButton>
                    <MDButton
                      variant="gradient"
                      color="error"
                      size="small"
                      onClick={dispersionMonedero}
                      startIcon={<FaWallet size={16} />}
                    >
                      MONEDERO
                    </MDButton>
                    <MDButton
                      variant="gradient"
                      color="info"
                      size="small"
                      onClick={crearTransferencia}
                      startIcon={<Send />}
                    >
                      TRANSFERIR
                    </MDButton>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ p: 2 }}>
                <MDBox
                  display="flex"
                  flexDirection={isMobile ? "row" : "row"}
                  gap={2}
                  mb={2}
                >
                  <MDButton
                    variant={
                      dateStart.isSame(dayjs(), "month")
                        ? "gradient"
                        : "outlined"
                    }
                    color="info"
                    fullWidth={isMobile}
                    onClick={() => establecerRangoMes("actual")}
                  >
                    Mes Actual
                  </MDButton>
                  <MDButton
                    variant={
                      !dateStart.isSame(dayjs(), "month")
                        ? "gradient"
                        : "outlined"
                    }
                    color="info"
                    fullWidth={isMobile}
                    onClick={() => establecerRangoMes("anterior")}
                  >
                    Mes Anterior
                  </MDButton>
                </MDBox>
                <Component_TableMovmentsCard
                  listMovimientos={listMovimientos}
                />
              </Card>
            </Grid>
          </Grid>
        </MDBox> */}

        {showTransferir && <View_Transferir cerrar={cerrar} />}

        <MDBox mt={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
              {/* Cabecera de Identidad */}
              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <MDBox>
                  <MDTypography variant="h5" fontWeight="bold">
                    Mi Tarjeta
                  </MDTypography>
                  <MDTypography
                    variant="button"
                    color="text"
                    fontWeight="regular"
                  >
                    {datos.nombre} {datos.apellidoPaterno}
                  </MDTypography>
                </MDBox>
                <IconButton
                  onClick={() => navigate("/Cards")}
                  sx={{ bgcolor: "#f0f2f5" }}
                >
                  <ArrowBack />
                </IconButton>
              </MDBox>

              {/* TARJETA ESTILO NEGRO (Basada en image_791f75.png) */}
              {/* <Card
                sx={{
                  bgcolor: "#000",
                  color: "#fff",
                  borderRadius: 4,
                  overflow: "hidden",
                  mb: 3,
                  boxShadow: 6,
                }}
              >
                <MDBox p={3}>
                  <MDBox display="flex" justifyContent="space-between" mb={3}>
                    <MDBox>
                      <MDTypography
                        variant="caption"
                        color="white"
                        opacity={0.6}
                        textTransform="uppercase"
                      >
                        Número de Tarjeta
                      </MDTypography>
                      <MDTypography
                        variant="h5"
                        color="white"
                        sx={{ letterSpacing: 4, mt: 0.5 }}
                      >
                        {datos.numeroEnmascarado}
                      </MDTypography>
                    </MDBox>
                    <IconButton
                      size="small"
                      sx={{ color: "#fff", alignSelf: "flex-start" }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </MDBox>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <MDTypography
                        variant="caption"
                        color="white"
                        opacity={0.6}
                        textTransform="uppercase"
                      >
                        Vence
                      </MDTypography>
                      <MDTypography variant="h6" color="white">
                        {tarjeta.expirationDate}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography
                        variant="caption"
                        color="white"
                        opacity={0.6}
                        textTransform="uppercase"
                      >
                        CVV Dinámico
                      </MDTypography>
                      <MDBox display="flex" alignItems="center">
                        <MDTypography variant="h6" color="white" mr={1}>
                          {showCVV ? CVV : "•••"}
                        </MDTypography>
                        <IconButton
                          onClick={showCVV ? btnHideCVV : btnShowCVV}
                          size="small"
                          sx={{ color: "#fff" }}
                        >
                          {showCVV ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </MDBox>
                      {showCVV && (
                        <MDBox
                          mt={0.5}
                          sx={{
                            "& *": {
                              color: "#fff !important",
                              fontSize: "10px",
                            },
                          }}
                        >
                          <Component_CVVDinamico
                            info={info}
                            segundosIniciales={240}
                            alTerminar={btnHideCVV}
                          />
                        </MDBox>
                      )}
                    </Grid>
                  </Grid>
                </MDBox>

                <MDBox
                  sx={{ bgcolor: "#f8f9fa", p: 2, display: "flex", gap: 2 }}
                >
                  <MDBox
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: 2,
                      flex: 1,
                      p: 1.5,
                      textAlign: "center",
                      boxShadow: 1,
                    }}
                  >
                    <MDTypography
                      variant="caption"
                      color="text"
                      fontWeight="bold"
                    >
                      SALDO DISPONIBLE
                    </MDTypography>
                    <MDTypography variant="h6" color="dark">
                      $
                      {tarjeta.available.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}{" "}
                    </MDTypography>
                  </MDBox>
                  <MDBox
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: 2,
                      flex: 1,
                      p: 1.5,
                      textAlign: "center",
                      boxShadow: 1,
                    }}
                  >
                    <MDTypography
                      variant="caption"
                      color="text"
                      fontWeight="bold"
                    >
                      MONEDERO
                    </MDTypography>
                    <MDTypography variant="h6" color="dark">
                      $
                      {datos.saldoMonedero.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}{" "}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card> */}

              <Card
                sx={{
                  bgcolor: "#ffffff79",
                  borderRadius: 4,
                  overflow: "hidden",
                  mb: 3,
                  boxShadow: 6,
                  width: "100%",
                }}
              >
                {/* ÁREA DE LA IMAGEN */}
                <MDBox
                  sx={{
                    backgroundImage: `url(${EasyCard})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    aspectRatio: "1.58 / 1",
                    position: "relative",
                    p: 3,
                    // borderRadius: "16px", // Esquinas redondeadas
                    overflow: "hidden", // Asegura que el contenido no se salga
                  }}
                >
                  {/* Fila Superior: Número */}
                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <MDBox></MDBox>
                    {/* <MDBox>
                      <MDTypography
                        variant="caption"
                        color="gray"
                        fontWeight="bold"
                        sx={{
                          opacity: 0.8,
                          textTransform: "uppercase",
                          fontSize: 10,
                        }}
                      >
                        Número de Tarjeta
                      </MDTypography>
                      <MDTypography
                        variant="h5"
                        color="gray"
                        sx={{
                          letterSpacing: 3,
                          mt: 0.5,
                          textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
                        }}
                      >
                        {datos.numeroEnmascarado}
                      </MDTypography>
                    </MDBox> */}
                    <IconButton size="small" sx={{ color: "#7b809a" }}>
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </MDBox>

                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    // mt={2}
                    mt={isMobile ? 2 : 0}
                  >
                    <MDBox>
                      <MDTypography
                        variant="caption"
                        color="gray"
                        fontWeight="bold"
                        sx={{
                          opacity: 0.8,
                          textTransform: "uppercase",
                          fontSize: 10,
                        }}
                      >
                        Número de Tarjeta
                      </MDTypography>
                      <MDTypography
                        variant="h5"
                        color="gray"
                        sx={{
                          letterSpacing: 3,
                          mt: 0.5,
                          textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
                        }}
                      >
                        {datos.numeroEnmascarado}
                      </MDTypography>
                    </MDBox>
                  </MDBox>

                  {/* Fila Inferior: Vence y CVV */}
                  <MDBox
                    sx={{
                      position: "absolute",
                      bottom: 20,
                      left: 24,
                      right: 24,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    <MDBox>
                      <MDTypography
                        variant="caption"
                        color="gray"
                        fontWeight="bold"
                        sx={{ opacity: 0.8, fontSize: 10 }}
                      >
                        VENCE
                      </MDTypography>
                      <MDTypography variant="h6" color="gray">
                        {tarjeta.expirationDate}
                      </MDTypography>
                    </MDBox>

                    {/* Contenedor del CVV */}
                    <MDBox textAlign="right" sx={{ position: "relative" }}>
                      <MDTypography
                        variant="caption"
                        color="gray"
                        fontWeight="bold"
                        sx={{ opacity: 0.8, fontSize: 10 }}
                      >
                        CVV DINÁMICO
                      </MDTypography>
                      <MDBox
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        <MDTypography variant="h6" color="gray" mr={1}>
                          {showCVV ? CVV : "•••"}
                        </MDTypography>
                        <IconButton
                          onClick={showCVV ? btnHideCVV : btnShowCVV}
                          size="small"
                          sx={{ p: 0, color: "#7b809a" }}
                        >
                          {showCVV ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <>
                              <Visibility fontSize="small" />
                            </>
                          )}
                        </IconButton>
                      </MDBox>

                      {showCVV && (
                        <MDBox
                          sx={{
                            marginTop: "10px",
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            marginTop: "-5px",
                            width: "max-content",
                            "& *": {
                              fontSize: "10px",
                            },
                          }}
                        >
                          <Component_CVVDinamico
                            info={info}
                            segundosIniciales={240}
                            alTerminar={btnHideCVV}
                          />
                        </MDBox>
                      )}
                    </MDBox>
                  </MDBox>
                </MDBox>

                {/* SECCIÓN BLANCA DE SALDOS */}
                <MDBox
                  sx={{ bgcolor: "#f8f9fa", p: 2, display: "flex", gap: 2 }}
                >
                  <MDBox
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: 3,
                      flex: 1,
                      p: 1.5,
                      textAlign: "center",
                      boxShadow: 1,
                    }}
                  >
                    <MDTypography
                      variant="caption"
                      color="text"
                      fontWeight="bold"
                      sx={{ fontSize: 10 }}
                    >
                      SALDO
                    </MDTypography>
                    <MDTypography variant="h6" color="dark" fontWeight="bold">
                      $
                      {tarjeta.available.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </MDTypography>
                  </MDBox>
                  <MDBox
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: 3,
                      flex: 1,
                      p: 1.5,
                      textAlign: "center",
                      boxShadow: 1,
                    }}
                  >
                    <MDTypography
                      variant="caption"
                      color="text"
                      fontWeight="bold"
                      sx={{ fontSize: 10 }}
                    >
                      MONEDERO
                    </MDTypography>
                    <MDTypography variant="h6" color="dark" fontWeight="bold">
                      $
                      {datos.saldoMonedero.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>

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
                      <Error fontSize="small" />
                      &nbsp;
                      {message.text}
                    </MDTypography>
                  </MDAlert>
                </MDBox>
              )}

              {/* CONTROLES RÁPIDOS */}
              <Card sx={{ p: 2, mb: 3 }}>
                <MDTypography variant="h6" fontWeight="bold" mb={2}>
                  Configuración
                </MDTypography>

                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <MDBox>
                    <MDTypography variant="button" fontWeight="bold">
                      Estado de Tarjeta
                    </MDTypography>
                    <MDTypography
                      variant="caption"
                      color="text"
                      display="block"
                    >
                      Bloquear/Desbloquear temporalmente
                    </MDTypography>
                  </MDBox>
                  <Switch
                    checked={tarjeta.status === "ACTIVE"}
                    onChange={bloquearODesbloquear}
                    color="info"
                  />
                </MDBox>

                <Divider sx={{ my: 1.5 }} />

                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDBox>
                    <MDTypography variant="button" fontWeight="bold">
                      NIP de Cajero
                    </MDTypography>
                    <MDBox display="flex" alignItems="center" gap={1}>
                      <MDTypography variant="h6" color="info">
                        {showNip ? nip : "••••"}

                        {showNip && (
                          <Component_ContadorNIP
                            segundosIniciales={30}
                            alTerminar={btnHideNip}
                          />
                        )}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <Tooltip title={showNip ? "Ocultar" : "Ver NIP"}>
                    <IconButton
                      onClick={showNip ? btnHideNip : btnShowNip}
                      sx={{
                        bgcolor: showNip ? "#e91e6315" : "#f0f2f5",
                        color: showNip ? "#ff5000" : "inherit",
                      }}
                    >
                      {showNip ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <MdOutlinePassword size={20} />
                      )}
                    </IconButton>
                  </Tooltip>
                </MDBox>
              </Card>

              {/* ACCIONES (Layout Horizontal para Desktop) */}
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <MDButton
                    variant="outlined"
                    color="dark"
                    fullWidth
                    onClick={transferirCardToCard}
                    sx={{ height: "100%", flexDirection: "column", p: 2 }}
                  >
                    <FaMoneyBillTransfer
                      size={24}
                      style={{ marginBottom: "8px" }}
                    />
                    <span style={{ fontSize: "10px" }}>Transferir</span>
                  </MDButton>
                </Grid>
                <Grid item xs={4}>
                  <MDButton
                    variant="outlined"
                    color="dark"
                    fullWidth
                    onClick={dispersionMonedero}
                    sx={{ height: "100%", flexDirection: "column", p: 2 }}
                  >
                    <FaWallet size={24} style={{ marginBottom: "8px" }} />
                    <span style={{ fontSize: "10px" }}>Monedero</span>
                  </MDButton>
                </Grid>
                <Grid item xs={4}>
                  <MDButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    onClick={crearTransferencia}
                    sx={{ height: "100%", flexDirection: "column", p: 2 }}
                  >
                    <Send size={24} style={{ marginBottom: "8px" }} />
                    <span style={{ fontSize: "10px" }}>Enviar</span>
                  </MDButton>
                </Grid>
              </Grid>
            </Grid>

            {/* COLUMNA DERECHA: MOVIMIENTOS (Ocupa 8 de 12 espacios en Desktop) */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ height: "100%" }}>
                <MDBox
                  p={3}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDTypography variant="h6" fontWeight="bold">
                    Movimientos
                  </MDTypography>
                  <MDBox display="flex" gap={1}>
                    <MDButton
                      variant={
                        dateStart.isSame(dayjs(), "month")
                          ? "gradient"
                          : "outlined"
                      }
                      color="info"
                      size="small"
                      onClick={() => establecerRangoMes("actual")}
                    >
                      Mes Actual
                    </MDButton>
                    {/* <MDButton
                      variant={
                        !dateStart.isSame(dayjs(), "month")
                          ? "gradient"
                          : "outlined"
                      }
                      color="info"
                      size="small"
                      onClick={() => establecerRangoMes("anterior")}
                    >
                      Mes Anterior
                    </MDButton> */}
                  </MDBox>
                </MDBox>

                <MDBox px={2} pb={2}>
                  <Component_TableMovmentsCard
                    listMovimientos={listMovimientos}
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </DashboardLayout>
    </>
  );
};
