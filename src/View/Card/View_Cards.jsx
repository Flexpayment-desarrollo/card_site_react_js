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
import { getCards } from "Services/Card/Service_Card";

const View_Cards = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ isShow: false });
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

  const nuevaTarjeta = () => {
    navigate("/RegisterCard");
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
      <DashboardLayout>
        <DashboardNavbar />
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
                          onClick={() =>
                            navigate("/Card", {
                              state: { info: tarjeta.id },
                            })
                          }
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
                                {tarjeta.numero}
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
                            </MDBox>
                          </MDBox>

                          <MDBox display="flex" alignItems="center">
                            <IconButton>
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
            <MDButton
              variant="gradient"
              color="info"
              circular
              onClick={nuevaTarjeta}
            >
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;Tarjeta
            </MDButton>
          </MDBox>
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
};

export default View_Cards;
