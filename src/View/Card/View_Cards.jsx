import Loading from "Global/Loading/Loading";
import Alert from "Global/Alert";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "layouts/authentication/components/Footer";
import logoChico from "assets/images/logos/logoChico.png";
import { useEffect, useState } from "react";
import { Refresh } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Card, Grid, Icon, IconButton, Tooltip } from "@mui/material";
import { ModalConfirmation } from "Global/ModalConfirmation";
import { getCards } from "Services/Card/Service_Card";
import { cambiarEstatusCard } from "Services/Card/Service_Card";

const View_Cards = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ isShow: false });
  const [info, setInfo] = useState();
  const [estatusActual, setEstatusActual] = useState("");
  const [showBtnCrear, setShowBtnCrear] = useState(true);
  const [modalConfirmacionBloquear, setModalConfirmacionBloquear] =
    useState(false);
  const [listaTarjetas, setListaTarjetas] = useState([]);

  useEffect(() => {
    getListCards();
  }, []);

  /**Metodo para obtener la lista de tarjetas */
  async function getListCards() {
    setLoading(true);
    await getCards()
      .then((result) => {
        setListaTarjetas(result.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 401) {
          if (err.response.data.code === 2011) {
            sessionStorage.setItem("newToken", "");
            navigate("/SignIn");
          } else {
            setMessage({
              text: err.message,
              type: "danger",
              isShow: true,
            });
          }
        }
      });
  }

  //Método que cambia el estatus a bloqueado o desbloqueado de la tarjeta
  async function putCambiarEstatus() {
    const sendData = {
      Id: info,
      Active: estatusActual === "ACTIVE" ? false : true,
    };
    setLoading(true);
    try {
      const res = await cambiarEstatusCard(sendData);
      if (res.code === 0) {
        setMessage({
          isShow: true,
          text:
            estatusActual === "ACTIVE"
              ? "Se bloqueó correctamente"
              : "Se desbloqueó correctamente",
          type: "success",
        });
        await getListCards();
      } else {
        setLoading(false);
        setMessage({
          isShow: true,
          text: res.businessMeaning,
          type: "danger",
        });
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
            type: "danger",
            isShow: true,
          });
        }
      } else {
        setMessage({
          isShow: true,
          text: error.name + " " + error.message,
          type: "danger",
        });
      }
    }
  }

  const nuevaTarjeta = () => {
    navigate("/RegisterCard");
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

  /** Metodo que limpia los mensajes */
  const clearMessage = () => {
    setMessage({
      isShow: false,
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
      {modalConfirmacionBloquear && (
        <ModalConfirmation
          showModal={modalConfirmacionBloquear}
          message={
            estatusActual === "ACTIVE"
              ? "¿Estás seguro de bloquear la tarjeta?"
              : "¿Estás seguro de desbloquear la tarjeta?"
          }
          closeModal={handleCloseBloquearODesbloquear}
        ></ModalConfirmation>
      )}
      <DashboardLayout>
        <DashboardNavbar />

        <Grid container>
          {showBtnCrear ? (
            <>
              {/* <Grid item xs={6} display="flex" justifyContent="flex-start">
                <MDTypography variant="h4">
                  <label className="title">
                    {" "}
                    Hola Bienvenido{" "}
                    {Authentication !== null ? Authentication.nombre : ""}{" "}
                  </label>
                </MDTypography>
              </Grid> */}
              {/* <Grid item xs={12} display="flex" justifyContent="flex-end">
                <MDButton
                  variant="gradient"
                  color="info"
                  size="medium"
                  onClick={nuevaTarjeta}
                  sx={{
                    "&:hover": {
                      boxShadow: "none", // elimina el sombreado al hacer hover
                    },
                  }}
                >
                  <FaFileCirclePlus size={20} color="#ffffffff" />
                  &nbsp;Registrar
                </MDButton>
              </Grid> */}
            </>
          ) : null}
          {/* {show ? ( */}
          {/* <Grid item xs={12} mb={2} mt={2}>
            <Card id="delete-account">
              <MDBox pt={3} px={2}>
                <MDTypography variant="h6" fontWeight="medium">
                  Tarjetas
                  <Tooltip placement="top" title="Refrescar">
                    <IconButton onClick={getListCards}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </MDTypography>
              </MDBox>

              <MDBox pt={1} pb={2} px={2}>
                <Grid container spacing={2}>
                  {listaTarjetas.map((tarjeta) => (
                    <>
                      <Grid item xs={12} sm={6} key={tarjeta.id}>
                        <MDBox
                          component="li"
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          bgColor={darkMode ? "transparent" : "grey-100"}
                          borderRadius="lg"
                          p={3}
                        >
                          <MDBox
                            width="100%"
                            display="flex"
                            flexDirection="column"
                          >
                            <MDBox
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              flexDirection="row"
                              mb={2}
                            >
                              <MDTypography
                                variant="button"
                                fontWeight="medium"
                              >
                                {tarjeta.numeroEnmascarado}
                              </MDTypography>

                              <MDBox display="flex" alignItems="center">
                                <MDButton
                                  variant="text"
                                  color={darkMode ? "white" : "dark"}
                                  onClick={() =>
                                    navigate("/Card", {
                                      state: { info: tarjeta.id },
                                    })
                                  }
                                >
                                  <Icon>edit</Icon>&nbsp;VER
                                </MDButton>
                              </MDBox>
                            </MDBox>

                            <MDBox mb={1} lineHeight={0}>
                              <MDTypography variant="caption" color="text">
                                Saldo:&nbsp;&nbsp;&nbsp;
                                <MDTypography
                                  variant="caption"
                                  fontWeight="medium"
                                >
                                  ${" "}
                                  {tarjeta.infoMetricas.available.toLocaleString(
                                    "es-MX",
                                    {
                                      maximumFractionDigits: 2,
                                      minimumFractionDigits: 2,
                                    },
                                  )}
                                </MDTypography>
                              </MDTypography>
                            </MDBox>

                            <MDBox mb={1} lineHeight={0}>
                              <MDTypography variant="caption" color="text">
                                Saldo Monedero:&nbsp;&nbsp;&nbsp;
                                <MDTypography
                                  variant="caption"
                                  fontWeight="medium"
                                >
                                  ${" "}
                                  {tarjeta.saldoMonedero.toLocaleString(
                                    "es-MX",
                                    {
                                      maximumFractionDigits: 2,
                                      minimumFractionDigits: 2,
                                    },
                                  )} */}
          {/* </MDTypography>
                              </MDTypography>
                            </MDBox> */}
          {/* <MDBox mb={1} lineHeight={0}>
                              <MDTypography variant="caption" color="text">
                                Estatus:&nbsp;&nbsp;&nbsp;
                                <Switch
                                  onChange={(e) =>
                                    bloquearODesbloquear(
                                      e,
                                      tarjeta.id,
                                      tarjeta.infoMetricas.status,
                                    )
                                  }
                                  checked={
                                    tarjeta.infoMetricas.status === "ACTIVE"
                                  }
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
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        </MDBox>
                      </Grid> */}
          {/* </>
                  ))}
                </Grid>
              </MDBox>
            </Card>
          </Grid> */}
          {/* ) : null} */}
          {/* 
          {showNewCard ? (
            <Grid item xs={12} mt={3}>
              <View_RegisterCard
                closeDetail={detalleTarjeta}
                closeModal={handleClose}
              />
            </Grid>
          ) : null} */}

          {/* {showCardDetail ? (
            <Grid item xs={12} mt={3}>
              <Component_CardDetail info={info} closeModal={handleClose} />
            </Grid>
          ) : null} */}
        </Grid>

        <MDBox py={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <MDBox
                  pt={3}
                  px={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDTypography variant="h6" fontWeight="medium">
                    Mis Tarjetas
                  </MDTypography>
                  <Tooltip title="Refrescar">
                    <IconButton onClick={getListCards}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </MDBox>

                <MDBox p={2}>
                  <Grid container spacing={2}>
                    {listaTarjetas.map((tarjeta) => (
                      <Grid item xs={12} md={6} key={tarjeta.id}>
                        <MDBox
                          variant="gradient"
                          bgColor="grey-100"
                          borderRadius="xl"
                          shadow="sm"
                          p={2}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            cursor: "pointer",
                            border: "1px solid #ebebeb",
                            transition: "transform 0.2s",
                            "&:hover": { transform: "scale(1.02)" },
                          }}
                        >
                          <MDBox display="flex" alignItems="center">
                            <MDBox
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              width="4rem"
                              height="4rem"
                              bgColor="grey-200"
                              borderRadius="50%"
                              mr={2}
                              sx={{ overflow: "hidden" }}
                            >
                              <MDBox
                                component="img"
                                src={logoChico}
                                alt="logo"
                                sx={{
                                  width: "70%",
                                  height: "70%",
                                  objectFit: "contain",
                                  display: "block",
                                }}
                              />
                            </MDBox>
                            <MDBox display="flex" flexDirection="column">
                              <MDTypography
                                variant="button"
                                fontWeight="bold"
                                textTransform="capitalize"
                              >
                                {tarjeta.numeroEnmascarado}
                              </MDTypography>
                              <MDTypography
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                Saldo:
                                <span
                                  style={{
                                    color: "#4CAF50",
                                    marginLeft: "5px",
                                  }}
                                >
                                  $
                                  {tarjeta.infoMetricas.available.toLocaleString(
                                    "es-MX",
                                  )}
                                </span>
                              </MDTypography>

                              {/* <MDTypography
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                Monedero:
                                <span
                                  style={{
                                    color: "#4CAF50",
                                    marginLeft: "5px",
                                  }}
                                >
                                  ${" "}
                                  {tarjeta.saldoMonedero.toLocaleString(
                                    "es-MX",
                                    {
                                      maximumFractionDigits: 2,
                                      minimumFractionDigits: 2,
                                    },
                                  )}
                                </span>
                              </MDTypography> */}
                            </MDBox>
                          </MDBox>

                          <MDBox display="flex" alignItems="center">
                            {/* <Switch
                              checked={tarjeta.infoMetricas.status === "ACTIVE"}
                              onChange={(e) =>
                                bloquearODesbloquear(
                                  e,
                                  tarjeta.id,
                                  tarjeta.infoMetricas.status,
                                )
                              }
                              color="info"
                            /> */}
                            <IconButton
                              onClick={() =>
                                navigate("/Card", {
                                  state: { info: tarjeta.id },
                                })
                              }
                            >
                              <Icon>chevron_right</Icon>
                            </IconButton>
                          </MDBox>
                        </MDBox>
                      </Grid>
                    ))}
                  </Grid>
                </MDBox>
              </Card>
            </Grid>
          </Grid>

          <MDBox
            mt={3}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            {/* {showBtnCrear && ( */}
            <MDButton
              variant="gradient"
              color="info"
              circular
              onClick={nuevaTarjeta}
            >
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;Tarjeta
            </MDButton>
            {/* )} */}
          </MDBox>
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
};

export default View_Cards;
