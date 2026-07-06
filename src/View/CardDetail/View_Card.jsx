import React, { useEffect, useState } from "react";
import Loading from "Global/Loading/Loading";
import dayjs from "dayjs";
import MDBox from "components/MDBox";
import MDAlert from "components/MDAlert";
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
  Refresh,
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
import { getMovementsTransfer } from "Services/Card/Service_Card";
import { Component_TableMovementsT } from "ComponentsEasy/Card/Component_TableMovementsT";

export const View_Card = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const info = location.state?.info;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const [tabActivo, setTabActivo] = useState("normales"); // Puede ser 'normales' o 'transfer'
  const [listMovimientos, setListMovimientos] = useState([]);
  const [listMovimientosT, setListMovimientosT] = useState([]);
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
    numero: "0000000000000000",
    saldoMonedero: 0,
  });
  const [tarjeta, setTarjeta] = useState({
    available: 0,
    status: "",
  });
  const [message, setMessage] = useState({
    isShow: false,
  });

  // EFECTO EXCLUSIVO PARA EL TIMER DE LA ALERTA
  // Este solo se ejecutará cuando la alerta aparezca o cambie
  useEffect(() => {
    if (isAlertValide && message.isShow) {
      const timer = setTimeout(() => {
        setIsAlertValide(false);
        setMessage((prev) => ({ ...prev, isShow: false }));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isAlertValide, message.isShow]);

  // EFECTO EXCLUSIVO PARA LA CARGA INICIAL
  useEffect(() => {
    DetalleTarjeta();
  }, []);

  const establecerRangoMes = (tipo = "normales") => {
    const hoy = dayjs();
    let inicio, fin;

    if (tipo === "normales") {
      inicio = hoy.startOf("month");
      fin = hoy;
    } else {
      inicio = hoy.startOf("month");
      fin = hoy;
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
      //setLoading(false);
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
      if (res.code === 0) {
        setNip(res.businessMeaning);
      } else if (res.code === 400) {
        setLoading(false);
        setMessage({
          isShow: true,
          text: "Error con el proveedor, consulta con el administrador",
          type: "error",
        });
        setIsAlertValide(true);
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
          getMovimientosTransfer(inicioStr, finStr);
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

  //Método que obtiene la lista de los movimientos
  const getMovimientosTransfer = async (inicioStr, finStr) => {
    const datos = {
      Id: info,
      DateInit: inicioStr,
      DateEnd: finStr,
    };
    setLoading(true);
    await getMovementsTransfer(datos)
      .then((data) => {
        if (data.code === 0) {
          if (data.data !== null) {
            setListMovimientosT(data.data || []);
          } else {
            setListMovimientosT([]);
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

  //Método para copiar el número de tarjeta
  const copiarAlPortapapeles = async () => {
    try {
      await navigator.clipboard.writeText(datos.numero);

      setMessage({
        isShow: true,
        text: "Número de tarjeta copiado al portapapeles",
        type: "success",
      });
      setIsAlertValide(true);
    } catch (err) {
      setMessage({
        isShow: true,
        text: "No se pudo copiar el número automáticamente",
        type: "error",
      });
      setIsAlertValide(true);
    }
  };

  const formatearNumeroTarjeta = (numero) => {
    if (!numero) return "";
    return numero
      .toString()
      .replace(/\s?/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
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
      state: { id: datos.id, datos: datos, tarjeta: tarjeta },
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
    DetalleTarjeta();
  };

  return (
    <>
      {loading && <Loading show={loading} />}
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
                    <IconButton
                      size="small"
                      sx={{ color: "#7b809a" }}
                      onClick={copiarAlPortapapeles}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </MDBox>

                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
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
                        {formatearNumeroTarjeta(datos.numero)}{" "}
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
                        <MDTypography variant="h6" color="info" mr={1}>
                          {showCVV ? CVV : "•••"}
                        </MDTypography>
                        <IconButton
                          onClick={showCVV ? btnHideCVV : btnShowCVV}
                          size="small"
                          sx={{ p: 0, color: "#ff5000" }}
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
                      variant="button"
                      fontWeight="regular"
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
                      NIP
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
                    <span style={{ fontSize: "10px" }}>EasyCard</span>
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
                  {/* <MDTypography variant="h6" fontWeight="bold">
                    Movimientos
                  </MDTypography> */}
                  <MDBox display="flex" gap={1}>
                    <MDButton
                      variant={
                        tabActivo === "normales" ? "gradient" : "outlined"
                      }
                      color="info"
                      size="small"
                      onClick={() => setTabActivo("normales")}
                    >
                      Movimientos
                    </MDButton>
                    <MDButton
                      variant={
                        tabActivo === "transfer" ? "gradient" : "outlined"
                      }
                      color="info"
                      size="small"
                      onClick={() => setTabActivo("transfer")}
                    >
                      Envíos a Terceros
                    </MDButton>
                  </MDBox>
                  <Tooltip title="Refrescar">
                    <IconButton onClick={refresh}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </MDBox>

                <MDBox pb={2}>
                  {tabActivo === "normales" ? (
                    <Component_TableMovmentsCard
                      listMovimientos={listMovimientos}
                    />
                  ) : (
                    <Component_TableMovementsT
                      listMovimientos={listMovimientosT}
                    />
                  )}
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </DashboardLayout>
    </>
  );
};
