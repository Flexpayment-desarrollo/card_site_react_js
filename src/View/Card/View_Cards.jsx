import Loading from "Global/Loading/Loading";
import Footer from "examples/Footer";
import Alert from "Global/Alert";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMaterialUIController } from "context";
import { Card, Grid, Icon, Switch } from "@mui/material";
import { ModalConfirmation } from "Global/ModalConfirmation";
import { getCards } from "Services/Card/Service_Card";
import { Component_CardDetail } from "ComponentsEasy/Card/Component_CardDetail";
import { FaFileCirclePlus } from "react-icons/fa6";
import { Component_RegisterCard } from "ComponentsEasy/Card/Component_RegisterCard";

const View_Card = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ isShow: false });
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [info, setInfo] = useState();
  const [show, setShow] = useState(true);
  const [showBtnCrear, setShowBtnCrear] = useState(true);
  const [showNewCard, setShowNewCard] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState(false);
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
        setLoading(false);
        setListaTarjetas(result.data);
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

  const detalleTarjeta = (cuenta) => {
    setInfo(cuenta);
    setShowCardDetail(true);
    setShow(false);
    setShowBtnCrear(false);
    setShowNewCard(false);
  };

  const nuevaTarjeta = (cuenta) => {
    setInfo(cuenta);
    setShowNewCard(true);
    setShow(false);
    setShowCardDetail(false);
    setShowBtnCrear(false);
  };

  /**Metodo para cerrar modal */
  const handleClose = (e) => {
    setShow(true);
    setShowBtnCrear(true);
    setShowCardDetail(false);
    setShowNewCard(false);
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
      //putActualizarEstatusCardHolder();
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
          tipoModal={false}
          message={
            // datos.status === "ACTIVE"
            //     ?
            "¿Estás seguro de bloquear la tarjeta?"
            // : "¿Estás seguro de desbloquear la tarjeta?"
          }
          closeModal={handleCloseBloquearODesbloquear}
        ></ModalConfirmation>
      )}
      <DashboardLayout>
        <DashboardNavbar />
        <Grid container mt={1} mb={4}>
          {showBtnCrear ? (
            <Grid item xs={12} display="flex" justifyContent="flex-end">
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
            </Grid>
          ) : null}
          {show ? (
            <Grid item xs={12} mb={2} mt={2}>
              <Card id="delete-account">
                <MDBox pt={3} px={2}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Tarjetas
                  </MDTypography>
                </MDBox>
                <MDBox pt={1} pb={2} px={2}>
                  <Grid container spacing={2}>
                    {listaTarjetas.map((tarjeta) => (
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
                                  onClick={() => detalleTarjeta(tarjeta.id)}
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
                                Estatus:&nbsp;&nbsp;&nbsp;
                                <Switch
                                  onChange={bloquearODesbloquear}
                                  checked={
                                    tarjeta.infoMetricas.status === "ACTIVE"
                                      ? true
                                      : false
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
                      </Grid>
                    ))}
                  </Grid>
                </MDBox>
              </Card>
            </Grid>
          ) : null}

          {showNewCard ? (
            <Grid item xs={12} mt={3}>
              <Component_RegisterCard closeDetail={detalleTarjeta} closeModal={handleClose}/>
            </Grid>
          ) : null}

          {showCardDetail ? (
            <Grid item xs={12} mt={3}>
              <Component_CardDetail info={info} closeModal={handleClose} /> 
            </Grid>
          ) : null}
        </Grid>
        <Footer />
      </DashboardLayout>
    </>
  );
};

export default View_Card;
