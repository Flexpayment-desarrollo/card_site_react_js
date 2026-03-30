import Footer from "examples/Footer";
import Loading from "Global/Loading";
import Alert from "Global/Alert";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useState } from "react";
import { Card, Grid, Icon, Switch } from "@mui/material";
import { useMaterialUIController } from "context";
import { Component_CardDetail } from "componentsV2/Card/Component_CardDetail";

const View_Card = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ isShow: false });
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [info, setInfo] = useState();
  const [show, setShow] = useState(true);
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [listaTarjetas, setListaTarjetas] = useState([
    { id: 1, numero: "5362 **** **** 0840", saldo: "7.59", status: "ACTIVE" },
    {
      id: 2,
      numero: "4512 **** **** 1234",
      saldo: "1,250.00",
      status: "INACTIVE",
    },
    { id: 3, numero: "5204 **** **** 9988", saldo: "0.00", status: "ACTIVE" },
  ]);

  const detalleTarjeta = (cuenta) => {
    setInfo(cuenta);
    setShowCardDetail(true);
    setShow(false);
  };

   /**Metodo para cerrar modal */
  const handleClose = (e) => {
    setShow(true);
    setShowCardDetail(false);
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
        <Grid container mt={1} mb={4}>
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
                                {tarjeta.numero}
                              </MDTypography>

                              <MDBox display="flex" alignItems="center">
                                <MDButton
                                  variant="text"
                                  color={darkMode ? "white" : "dark"}
                                  onClick={() =>
                                    detalleTarjeta(listaTarjetas.id)
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
                                  $ {tarjeta.saldo}
                                </MDTypography>
                              </MDTypography>
                            </MDBox>

                            <MDBox mb={1} lineHeight={0}>
                              <MDTypography variant="caption" color="text">
                                Estatus:&nbsp;&nbsp;&nbsp;
                                <Switch
                                  checked={tarjeta.status === "ACTIVE"}
                                  sx={{
                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                      {
                                        backgroundColor: "#ff5f00",
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

          {showCardDetail ? (
            <Grid item xs={12} mt={3}>
              <Component_CardDetail 
              info={info} 
                closeModal={handleClose}
              />
            </Grid>
          ) : null}
        </Grid>
        <Footer />
      </DashboardLayout>
    </>
  );
};

export default View_Card;
