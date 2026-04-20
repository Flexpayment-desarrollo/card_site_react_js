import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import FormField from "layouts/applications/wizard/components/FormField";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";

import { pink } from "@mui/material/colors";
import { Cancel, DeleteForever, Send } from "@mui/icons-material";
import Loading from "Global/Loading/Loading";
import MDBox from "components/MDBox";

const genericAutocomplete = [{ label: "", id: 0 }];

export const View_Transferir = ({ closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [defaultAccount, setDefaultAccount] = useState(genericAutocomplete[0]);
  const [showAgregarCuenta, setshowAgregarCuenta] = useState(true);
  const [showCuentaSeleccionada, setShowCuentaSeleccionada] = useState(false);

  useEffect(() => {}, []);

  return (
    <>
      {loading && <Loading show={loading} />}
      <Grid container mt={1} mb={3}>
        <Grid item xs={12}>
          <Card id="basic-info" sx={{ overflow: "visible" }}>
            <Grid container p={2} spacing={1}>
              <Grid item xs={12} sm={12} mt={1} textAlign="right">
                <MDButton
                  type="button"
                  size="small"
                  variant="gradient"
                  style={{ backgroundColor: "#ff5f00" }}
                  onClick={closeModal}
                >
                  <Cancel
                    sx={{
                      width: "20px",
                      height: "20px",
                      color: "white !important",
                    }}
                  />
                  &nbsp;
                  <MDTypography variant="h7" color="white">
                    SALIR
                  </MDTypography>
                </MDButton>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={12} display="flex">
          <MDBox height="100%" width="100%">
            <Card sx={{ maxWidth: "100%", height: "100%" }}>
              <Grid container spacing={2} p={3}>
                {/* <Grid item xs={12} sm={12}>
                  <Autocomplete
                    //value={defaultAccount}
                    id="IdCuenta"
                    // options={accountList}
                    // onChange={handleChangeSelect}
                    renderInput={(params) => (
                      <FormField
                        {...params}
                        required
                        // error={errorFlagE.idCuenta}
                        // helperText={errorFlagE.idCuentaMsg}
                        label="Selecciona una cuenta"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid> */}
                {showCuentaSeleccionada ? (
                  <>
                    <Grid item xs={4} sm={4}>
                      <FormField
                        label="Alias"
                        // value={cuentaSeleccionada.alias}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <FormField
                        label="Beneficiario"
                        // value={cuentaSeleccionada.beneficiario}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={4} sm={4}>
                      <FormField
                        disabled
                        label="Banco"
                        // value={cuentaSeleccionada.banco}
                      />
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <FormField
                        label="Tipo de Cuenta"
                        // value={cuentaSeleccionada.tipoCuenta}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <FormField
                        disabled
                        label="Numero"
                        // value={cuentaSeleccionada.valor}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      mt={2}
                      ml={-1}
                      mb={1}
                      style={{ textAlign: "left" }}
                    >
                      <MDButton
                        type="button"
                        variant="gradient"
                        size="medium"
                        // onClick={confirmEliminarCuenta}
                        style={{
                          marginLeft: "10px",
                          backgroundColor: "#ff5f00",
                        }}
                      >
                        <DeleteForever
                          sx={{
                            width: "20px",
                            height: "20px",
                            color: "white !important",
                          }}
                        />
                        &nbsp;
                        <MDTypography variant="h7" color="white">
                          ELIMINAR
                        </MDTypography>
                      </MDButton>
                    </Grid>
                  </>
                ) : null}
                {showAgregarCuenta ? (
                  <>
                    <Grid item xs={12} sm={3}>
                      <FormField
                        // disabled={agregarDisabled}
                        // error={errorFlagE.beneficiario}
                        // helperText={errorFlagE.beneficiarioMsg}
                        name="Beneficiario"
                        label="Beneficiario"
                        // value={Beneficiario}
                        // onChange={handleChangeAlphanumericSpace}
                        inputProps={{ maxLength: 40 }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormField
                        // disabled={agregarDisabled}
                        // error={errorFlagE.alias}
                        // helperText={errorFlagE.aliasMsg}
                        name="Alias"
                        label="Alias"
                        // value={Alias}
                        // onChange={handleChangeAlphanumericSpace}
                        inputProps={{ maxLength: 40 }}
                        required
                      />
                    </Grid>

                    {/* <Grid item xs={4} sm={4}>
                      <Autocomplete
                        // value={defaultBancos}
                        id="IdBanco"
                        // options={banksList}
                        // onChange={handleChangeSelect}
                        renderInput={(params) => (
                          <FormField
                            {...params}
                            required
                            // disabled={agregarDisabled}
                            // error={errorFlagE.idBanco}
                            // helperText={errorFlagE.idBancoMsg}
                            label="Selecciona un banco"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid> */}
                    <Grid item xs={12} sm={3}>
                      <FormField
                        // error={errorFlagE.valor}
                        // helperText={errorFlagE.valorMsg}
                        // disabled={agregarDisabled}
                        name="Banco"
                        label="Banco"
                        // value={Valor}
                        // onChange={handleChangeNumeric}
                        inputProps={{ maxLength: 18 }}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <FormField
                        // error={errorFlagE.valor}
                        // helperText={errorFlagE.valorMsg}
                        // disabled={agregarDisabled}
                        name="Valor"
                        label="Numero"
                        // value={Valor}
                        // onChange={handleChangeNumeric}
                        inputProps={{ maxLength: 18 }}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} style={{ textAlign: "left" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            //   disabled={agregarDisabled}
                            name="GuardaCuenta"
                            //   onChange={handleChangeCheck}
                            //   checked={GuardaCuenta}
                            sx={{
                              color: pink[800],
                              "&.Mui-checked": {
                                color: pink[600],
                              },
                            }}
                          />
                        }
                        label="Guardar en mis cuentas"
                      />
                    </Grid>
                  </>
                ) : null}
                <Grid item xs={12} sm={12}>
                  <Grid container>
                    <Grid item xs={12} sm={12} mt={2}>
                      <FormField
                        // error={errorFlagE.referencia}
                        // helperText={errorFlagE.referenciaMsg}
                        name="referencia"
                        label="Referencia"
                        // value={referencia}
                        // onChange={handleChangeNumeric}
                        inputProps={{ maxLength: 7 }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} mt={2}>
                      <FormField
                        // error={errorFlagE.concepto}
                        // helperText={errorFlagE.conceptoMsg}
                        name="concepto"
                        label="Concepto"
                        // value={concepto}
                        // onChange={handleChangeAlphanumericSpace}
                        inputProps={{ maxLength: 40 }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} mt={2}>
                      <FormField
                        // error={errorFlagE.cantidad}
                        // helperText={errorFlagE.cantidadMsg}
                        name="Cantidad"
                        label="Cantidad $ MXN"
                        // value={transferencia.Cantidad}
                        // onChange={handleChangeNumericNoZeros}
                        inputProps={{ maxLength: 12, inputMode: "numeric" }}
                        required
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {/* <Grid item xs={3}>
                  <Grid container spacing={3} pr={1} pl={1}>
                    <Grid item xs={12} sm={12} style={{ textAlign: "center" }}>
                      <MDTypography variant="h6">Totales</MDTypography>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <MDTypography variant="h6">Total:</MDTypography>
                    </Grid>
                    <Grid item xs={6} sm={6} style={{ textAlign: "right" }}>
                      <MDTypography variant="h6">$1000</MDTypography>
                    </Grid>
                  </Grid>
                </Grid> */}
                <Grid item xs={12} sm={12}>
                  <Grid
                    container
                    display="flex"
                    alignItems="flex-end"
                    style={{ textAlign: "right" }}
                  >
                    <Grid item xs={12} sm={12}>
                      <MDButton
                        type="button"
                        variant="gradient"
                        style={{ backgroundColor: "#ff5f00" }}
                        size="medium"
                        //onClick={confirmarExterno}
                      >
                        <Send
                          sx={{
                            width: "20px",
                            height: "20px",
                            color: "white !important",
                          }}
                        />
                        &nbsp;
                        <MDTypography variant="h7" color="white">
                          ENVIAR
                        </MDTypography>
                      </MDButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </MDBox>
        </Grid>
      </Grid>
    </>
  );
};
