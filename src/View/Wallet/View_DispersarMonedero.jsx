import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import FormField from "layouts/applications/wizard/components/FormField";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { Autocomplete, Card, Grid, IconButton, Tooltip } from "@mui/material";
import { Component_DisperseWallet } from "ComponentsEasy/Wallet/Component_DisperseWallet";

export const View_DispersarMonedero = ({ refresh }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  const datos = location.state?.datos;
  const [defaultDispersion, setDefaultDispersion] = useState({
    id: 0,
    label: "",
  });
  const [dispersionList, setDispersionList] = useState([
    { id: 1, label: "Bajar a Monedero" },
    { id: 2, label: "Subir a Tarjeta" },
  ]);

  useEffect(() => {}, []);

  /*Método para todos los autocomplete*/
  const handleChangeSelect = (event, newValue) => {
    // Si el usuario borró el valor
    if (!newValue) {
      // Buscamos cuál input se borró usando el ID del contenedor del evento o el target
      const targetId = event.currentTarget.querySelector("input")?.id || "";
      const name = targetId.split("-")[0];

      if (name === "IdDispersion") {
        setDefaultDispersion({ id: 0, label: "" });
      }
      return;
    }

    const { id } = event.target;
    let name = id.split("-")[0];
    switch (name) {
      case "IdDispersion":
        setDefaultDispersion(newValue);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={12} display="flex">
            <MDBox height="100%" width="100%">
              <Card sx={{ maxWidth: "100%", height: "100%" }}>
                <Grid container alignItems="center" pt={3} pl={3} pb={1}>
                  <Grid item>
                    <Tooltip placement="top" title="Regresar">
                      <IconButton
                        onClick={() =>
                          navigate("/Card", { state: { info: id } })
                        }
                        sx={{ background: "#ebebeb", mr: 2 }}
                      >
                        <ArrowBack />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs>
                    <MDTypography variant="h6">
                      MOVIMIENTOS MONEDERO
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} textAlign="left" mt={2} ml={1}>
                    <MDTypography variant="h6" color="dark">
                      {" "}
                      SALDO MONEDERO: $
                      {datos.saldoMonedero.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </MDTypography>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container p={3} spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Autocomplete
                          value={defaultDispersion}
                          id="IdDispersion"
                          options={dispersionList}
                          onChange={handleChangeSelect}
                          renderInput={(params) => (
                            <FormField
                              {...params}
                              required
                              label="Selecciona un tipo de movimiento"
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {defaultDispersion.id != 0 ? (
                  <Component_DisperseWallet
                    refresh={refresh}
                    id={id}
                    isWallet={defaultDispersion.id === 1}
                  />
                ) : null}
              </Card>
            </MDBox>
          </Grid>
        </Grid>
      </DashboardLayout>
    </>
  );
};
