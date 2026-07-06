import Loading from "Global/Loading/Loading";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import FormField from "layouts/applications/wizard/components/FormField";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { pink } from "@mui/material/colors";
import { ArrowBack, DeleteForever, Error, Send } from "@mui/icons-material";
import {
  Autocomplete,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteStorage } from "Global/Expressions";
import { alphanumericSpaceValid } from "Global/Expressions";
import { numericValid } from "Global/Expressions";
import { getBanks } from "Services/Card/Service_Card";
import { getUserAccount } from "Services/Card/Service_Transfer";
import { ModalConfirmation } from "Global/ModalConfirmation";

const Externa = {
  Cantidad: "",
  IdCuenta: 0,
  concepto: "",
  referencia: "",
  GuardaCuenta: false,
  CuentaBanco: null,
  Latitud: 0,
  Longitud: 0,
};

const tipoCuentaList = [
  { label: "3 - Tarjeta", id: 3 },
  { label: "40 - CLABE", id: 40 },
];

const CuentaBanco = {
  Alias: "",
  Beneficiario: "",
  IdBanco: 0,
  IdTipoCuentaBancaria: 0,
  Valor: "",
};

const CuentaSelecionada = {
  alias: "",
  beneficiario: "",
  banco: "",
  tipoCuenta: "",
  valor: "",
};

const genericAutocomplete = [{ label: "", id: 0 }];

export const View_Transferir = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  const datos = location.state?.datos;
  const tarjeta = location.state?.tarjeta;
  const [loading, setLoading] = useState(false);
  const [isAlertValide, setIsAlertValide] = useState(false);
  const [agregarDisabled, setAgregarDisabled] = useState(true);
  const [banksList, setBanksList] = useState(genericAutocomplete);
  const [accountList, setAccountList] = useState(genericAutocomplete);
  const [accountClientList, setAccountClientList] = useState([]);
  const [clientAccount, setClientAccount] = useState(CuentaBanco);
  const [transferencia, setTransferencia] = useState(Externa);
  const [modalConfirmacionEliminar, setModalConfirmacionEliminar] =
    useState(false);
  const [defaultAccount, setDefaultAccount] = useState(genericAutocomplete[0]);
  const [showAgregarCuenta, setshowAgregarCuenta] = useState(true);
  const [showCuentaSeleccionada, setShowCuentaSeleccionada] = useState(false);
  const [cuentaSeleccionada, setCuentaSeleccionada] =
    useState(CuentaSelecionada);
  const [defaultBancos, setDefaultBancos] = useState(genericAutocomplete[0]);
  const [defaultTipoCuenta, setDefaultTipoCuenta] = useState(
    genericAutocomplete[0],
  );
  const [totalesExterna, setTotalesExterna] = useState({
    subTotalComision: 0,
    total: 0,
  });
  const [message, setMessage] = useState({
    isShow: false,
  });

  const [errorFlag, setErrorFlag] = useState({
    cantidad: false,
    cantidadMsg: "",
    concepto: false,
    conceptoMsg: "",
    referencia: false,
    referenciaMsg: "",
    alias: false,
    aliasMsg: "",
    beneficiario: false,
    beneficiarioMsg: "",
    idBanco: false,
    idBancoMsg: "",
    idTipoCuentaBancaria: false,
    idTipoCuentaBancariaMsg: "",
    valor: false,
    valorMsg: "",
  });

  // useEffect(() => {
  //   getCuentas();
  // }, []);

  useEffect(() => {
    const inicializarDatos = async () => {
      setLoading(true);
      await getCuentas();

      if (location.state?.isEditing) {
        const stateData = location.state;

        if (stateData.datosTransferencia) {
          setTransferencia(stateData.datosTransferencia);
        }

        if (stateData.totalesExterna) {
          setTotalesExterna(stateData.totalesExterna);
        }

        const idCuentaGuardada = stateData.datosTransferencia?.IdCuenta;

        // CUENTA PREVIAMENTE REGISTRADA
        if (idCuentaGuardada && idCuentaGuardada !== 0) {
          if (stateData.beneficiario) {
            setCuentaSeleccionada(stateData.beneficiario);
            setDefaultAccount({
              id: idCuentaGuardada,
              label: `${stateData.beneficiario.alias} - ${stateData.beneficiario.banco.split(" - ")[1] || ""} - ${stateData.beneficiario.valor}`,
            });
            setshowAgregarCuenta(false);
            setShowCuentaSeleccionada(true);
            setAgregarDisabled(true);
          }
        }
        // AGREGAR CUENTA
        else {
          setDefaultAccount({ id: 0, label: "Agregar cuenta" });
          setshowAgregarCuenta(true);
          setShowCuentaSeleccionada(false);
          setAgregarDisabled(false);

          if (stateData.clientAccount) {
            setClientAccount(stateData.clientAccount);
          }

          if (
            stateData.clientAccount?.IdBanco &&
            stateData.beneficiario?.banco
          ) {
            setDefaultBancos({
              id: stateData.clientAccount.IdBanco,
              label: stateData.beneficiario.banco,
            });
          }

          if (stateData.clientAccount?.IdTipoCuentaBancaria) {
            const tipo = tipoCuentaList.find(
              (t) => t.id === stateData.clientAccount.IdTipoCuentaBancaria,
            );
            if (tipo) setDefaultTipoCuenta(tipo);
          }
        }
      }
      setLoading(false);
    };
    inicializarDatos();
  }, [location.state]);

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

  /*Método que obtiene la lista de cuentas*/
  async function getCuentas() {
    try {
      await getUserAccount().then((data) => {
        var rows = [{ id: 0, label: "Agregar cuenta" }];
        if (data.code === 0) {
          data.data.forEach((data) => {
            let jsonData = {
              id: data.id,
              label: data.alias + " - " + data.banco + " - " + data.valor,
            };
            rows.push(jsonData);
          });
          setAccountList(rows);
          setAccountClientList(data.data);
          getBancos();
        } else {
          setLoading(false);
          setMessage({
            isShow: true,
            text: data.businessMeaning,
            type: "danger",
          });
        }
      });
    } catch (error) {
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
    }
  }

  /**Método que trae la lista de bancos*/
  async function getBancos() {
    var rows = [];
    await getBanks()
      .then((data) => {
        data.data.forEach((data) => {
          let jsonData = {
            id: data.id,
            label: `${data.id} - ${data.nombre}`,
          };
          rows.push(jsonData);
        });
        setBanksList(rows);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 401) {
          if (error.response.data.code === 2011) {
            deleteStorage();
            navigate("/SignIn");
          } else {
            setIsAlertValide(true);
            setMessage({
              text: error.message,
              type: "error",
              isShow: true,
            });
          }
        }
      });
  }

  const eliminarCuenta = async (e) => {
    // await deleteAccountBank(transferencia.IdCuenta)
    //   .then((data) => {
    //     setLoading(false);
    //     if (data.code === 0) {
    //       refresh();
    //     } else {
    //       setMessage({
    //         isShow: true,
    //         text: data.businessMeaning,
    //         type: "danger",
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     if (error.response.status === 401) {
    //       if (error.response.data.code === 2011) {
    //         deleteStorage();
    //         navigate("/SignIn");
    //       } else {
    //         setMessage({
    //           text: error.message,
    //           type: "danger",
    //           isShow: true,
    //         });
    //       }
    //     }
    //   });
  };

  // Método para calcular el monto total con comisiones
  const calculateMontoExterno = (cantidadE) => {
    const comision = parseFloat((datos?.comisionSpeiOut || 0).toFixed(2));
    // const comision = parseFloat(0.01.toFixed(2));
    const total = parseFloat(cantidadE || 0) + parseFloat(comision);
    setTotalesExterna({
      ...totalesExterna,
      total: total,
    });
  };

  const confirmEliminarCuenta = () => {
    setModalConfirmacionEliminar(true);
  };

  /**Método para abrir el modal de confirmación*/
  const confirmarExterno = (e) => {
    e.preventDefault();
    let validation = validateFormExterno();

    if (validation) {
      let infoBeneficiario = cuentaSeleccionada;

      // Si es agregar cuenta nueva, se arma el objeto con lo que se escribió en los inputs manuales
      if (transferencia.IdCuenta === 0) {
        infoBeneficiario = {
          alias: clientAccount.Alias,
          beneficiario: clientAccount.Beneficiario,
          banco: defaultBancos?.label || "",
          tipoCuenta: defaultTipoCuenta?.label || "",
          valor: clientAccount.Valor,
        };
      }
      // navigate("/Preview", {
      //   state: {
      //     datosTransferencia: transferencia,
      //     beneficiario: infoBeneficiario,
      //     id: id,
      //     clientAccount: clientAccount,
      //     totalesExterna: totalesExterna,
      //   },
      // });

      navigate("/Preview", {
        state: {
          datosTransferencia: transferencia,
          beneficiario: infoBeneficiario,
          datos: datos,
          id: id,
          clientAccount: clientAccount,
          totalesExterna: totalesExterna,
          cuentaSeleccionada: cuentaSeleccionada,
          tarjeta: tarjeta,
        },
      });
    }
  };

  const handleChangeNumericNoZeros = (event) => {
    const { value } = event.target;
    if (
      value.substr(value.length - 1) === "." &&
      value.substr(0, value.length - 1).includes(".")
    ) {
      //12.33.
      return;
    } else {
      if (value.substr(value.length - 1) === ".") {
        //1234.
        setTransferencia({
          ...transferencia,
          Cantidad: value,
        });
        var valueNoPoint = parseInt(value.substr(0, value.length - 1));
        calculateMontoExterno(valueNoPoint);
      } else {
        if (value.includes(".")) {
          // 123.456
          let posiciones = value.split(".");
          if (posiciones[1].length > 2)
            //Valida solo 2 caracteres despues del .
            return;
          else {
            if (value !== "" && !numericValid(value.substr(value.length - 1)))
              //si no es numero
              return;
            if (value !== "") {
              //Que no borre el 0 despues del punto para poner 10.02
              setTransferencia({
                ...transferencia,
                Cantidad: value, //10.0 -> 10
              });
              calculateMontoExterno(value);
            } else {
              setTransferencia({
                ...transferencia,
                Cantidad: value,
              });
              calculateMontoExterno(value);
            }
          }
        } else {
          if (value !== "" && !numericValid(value.substr(value.length - 1)))
            //si no es número
            return;
          if (value !== "") {
            setTransferencia({
              ...transferencia,
              Cantidad: parseFloat(value),
            });
            calculateMontoExterno(value);
          } else {
            setTransferencia({
              ...transferencia,
              Cantidad: value,
            });
            calculateMontoExterno(0);
          }
        }
      }
    }
  };

  const handleChangeNumeric = (event) => {
    const { name, value } = event.target;

    if (value !== "" && !numericValid(value.toString())) return;

    switch (name) {
      case "referencia":
        setTransferencia((prevState) => {
          return {
            ...prevState,
            [name]: value,
          };
        });
        break;
      case "Valor":
        setClientAccount((prevState) => {
          return {
            ...prevState,
            [name]: value,
          };
        });
        break;
    }
  };

  const handleChangeSelect = (event, newValue) => {
    // Si el usuario borró el valor
    if (!newValue) {
      // Buscamos cuál input se borró usando el ID del contenedor del evento o el target
      const targetId = event.currentTarget.querySelector("input")?.id || "";
      const name = targetId.split("-")[0];

      if (name === "IdCuenta") {
        setDefaultAccount(genericAutocomplete[0]);
        setTransferencia({ ...transferencia, IdCuenta: 0 });
        setAgregarDisabled(false);
        setshowAgregarCuenta(true);
        setShowCuentaSeleccionada(false);
      } else if (name === "IdBanco") {
        setDefaultBancos(genericAutocomplete[0]);
        setClientAccount({ ...clientAccount, IdBanco: 0 });
      } else if (name === "IdTipoCuentaBancaria") {
        setDefaultTipoCuenta(genericAutocomplete[0]);
        setClientAccount({ ...clientAccount, IdTipoCuentaBancaria: 0 });
      }
      return;
    }

    //Proceso normal
    let name = event.target.id.split("-")[0];
    if (name === "") return;

    switch (name) {
      case "IdCuenta":
        let horas = new Date().getHours();
        let minutos = new Date().getMinutes();
        let segundos = new Date().getSeconds();
        horas = horas < 10 ? `0${horas.toString()}` : horas.toString();
        minutos = minutos < 10 ? `0${minutos.toString()}` : minutos.toString();
        segundos =
          segundos < 10 ? `0${segundos.toString()}` : segundos.toString();
        setDefaultAccount(newValue);
        if (
          newValue.id !== undefined &&
          newValue.id !== 0 &&
          newValue.id !== 0
        ) {
          accountClientList.find((obj) => {
            if (obj.id === newValue.id) {
              setCuentaSeleccionada({
                alias: obj.alias,
                beneficiario: obj.beneficiario,
                banco: obj.idBanco + " - " + obj.banco,
                tipoCuenta: obj.idTipoCuentaBancaria + " - " + obj.tipoCuenta,
                valor: obj.valor,
              });
            }
          });
          setTransferencia({
            ...transferencia,
            IdCuenta: newValue.id,
            GuardaCuenta: false,
            referencia: `${horas}${minutos}${segundos}`,
          });
          setAgregarDisabled(true);
          setshowAgregarCuenta(false);
          setShowCuentaSeleccionada(true);
        } else {
          setTransferencia({
            ...transferencia,
            IdCuenta: 0,
            referencia: `${horas}${minutos}${segundos}`,
          });
          setAgregarDisabled(false);
          setshowAgregarCuenta(true);
          setShowCuentaSeleccionada(false);
        }
        break;
      case "IdBanco":
        setDefaultBancos(newValue);
        setClientAccount({
          ...clientAccount,
          [name]: newValue.id,
        });
        break;
      case "IdTipoCuentaBancaria":
        setDefaultTipoCuenta(newValue);
        setClientAccount({
          ...clientAccount,
          [name]: newValue.id,
        });
        break;
    }
  };

  const handleChangeCheck = (event) => {
    const { name, value, checked } = event.target;
    setTransferencia({
      ...transferencia,
      [name]: name === "GuardaCuenta" ? checked : value,
    });
  };

  const handleChangeAlphanumericSpace = (event) => {
    const { name, value } = event.target;
    if (value !== "" && !alphanumericSpaceValid(value.toString())) return;

    switch (name) {
      case "Alias":
      case "Beneficiario":
        setClientAccount((prevState) => {
          return {
            ...prevState,
            [name]: value,
          };
        });
        break;
      case "concepto":
        setTransferencia((prevState) => {
          return {
            ...prevState,
            [name]: value,
          };
        });
        break;
    }
  };

  /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
  const handleCloseConfirmarGuardar = (e) => {
    setModalConfirmacionEliminar(false);
    if (e.target.name === "yesBtn") {
      setLoading(true);
      eliminarCuenta();
    }
  };

  /*Método que valida el formulario*/
  const validateFormExterno = () => {
    let valid = true;
    let errorTemp = {
      alias: false,
      aliasMsg: "",
      beneficiario: false,
      beneficiarioMsg: "",
      idCuenta: false,
      idCuentaMsg: "",
      idBanco: false,
      idBancoMsg: "",
      idTipoCuentaBancaria: false,
      idTipoCuentaBancariaMsg: "",
      valor: false,
      valorMsg: "",
    };

    if (showAgregarCuenta) {
      if (
        typeof IdBanco === "function" ||
        IdBanco === "" ||
        IdBanco === 0 ||
        IdBanco === undefined
      ) {
        errorTemp.idBanco = true;
        errorTemp.idBancoMsg = "Debes seleccionar un banco";
        valid = false;
      }
      if (typeof Alias === "function" || Alias === "") {
        errorTemp.alias = true;
        errorTemp.aliasMsg = "Alias no puede estar vacío";
        valid = false;
      }

      if (
        typeof clientAccount.IdTipoCuentaBancaria === "function" ||
        clientAccount.IdTipoCuentaBancaria === "" ||
        clientAccount.IdTipoCuentaBancaria === 0 ||
        clientAccount.IdTipoCuentaBancaria === undefined
      ) {
        errorTemp.idTipoCuentaBancaria = true;
        errorTemp.idTipoCuentaBancariaMsg =
          "Debes seleccionar un tipo de cuenta";
        valid = false;
      }
      if (typeof Beneficiario === "function" || Beneficiario === "") {
        errorTemp.beneficiario = true;
        errorTemp.beneficiarioMsg = "Beneficiario no puede estar vacío";
        valid = false;
      }
      if (typeof Valor === "function" || Valor === "") {
        errorTemp.valor = true;
        errorTemp.valorMsg = "El número no puede estar vacío";
        valid = false;
      } else {
        if (clientAccount.IdTipoCuentaBancaria === 3 && Valor.length !== 16) {
          errorTemp.valor = true;
          errorTemp.valorMsg = "El número de la Tarjeta debe ser de 16 dígitos";
          valid = false;
        } else {
          if (
            clientAccount.IdTipoCuentaBancaria === 40 &&
            Valor.length !== 18
          ) {
            errorTemp.valor = true;
            errorTemp.valorMsg = "El valor de la CLABE debe ser de 18 dígitos";
            valid = false;
          } else {
            if (
              clientAccount.IdTipoCuentaBancaria !== 40 &&
              clientAccount.IdTipoCuentaBancaria !== 3 &&
              clientAccount.IdTipoCuentaBancaria !== 10
            ) {
              errorTemp.valor = true;
              errorTemp.valorMsg = "No haz seleccionado el tipo de cuenta";
              valid = false;
            }
          }
        }
      }
    }
    if (
      typeof transferencia.Cantidad === "function" ||
      transferencia.Cantidad === 0 ||
      transferencia.Cantidad === "" ||
      transferencia.Cantidad === isNaN ||
      transferencia.Cantidad === undefined
    ) {
      errorTemp.cantidad = true;
      errorTemp.cantidadMsg = "La cantidad no puede estar vacía";
      valid = false;
    }
    if (typeof concepto === "function" || concepto === "") {
      errorTemp.concepto = true;
      errorTemp.conceptoMsg = "El concepto no puede estar vacío";
      valid = false;
    } else {
      let conceptovalidado = concepto.trim();
      if (conceptovalidado === "") {
        errorTemp.concepto = true;
        errorTemp.conceptoMsg = "El concepto no puede estar vacío";
        valid = false;
      } else {
        setTransferencia({
          ...transferencia,
          concepto: conceptovalidado,
        });
      }
    }
    if (
      typeof referencia === "function" ||
      referencia === 0 ||
      referencia === "" ||
      referencia === isNaN ||
      referencia === undefined
    ) {
      errorTemp.referencia = true;
      errorTemp.referenciaMsg = "La referencia no puede estar vacía";
      valid = false;
    }
    if (showCuentaSeleccionada && !showAgregarCuenta) {
      if (
        typeof transferencia.IdCuenta === "function" ||
        transferencia.IdCuenta === "" ||
        transferencia.IdCuenta === 0 ||
        transferencia.IdCuenta === undefined
      ) {
        errorTemp.idCuenta = true;
        errorTemp.idCuentaMsg = "Debes seleccionar una cuenta";
        valid = false;
      }
    } else {
      if (agregarDisabled && showAgregarCuenta) {
        errorTemp.idCuenta = true;
        errorTemp.idCuentaMsg = "Debes seleccionar una opción";
        valid = false;
      }
    }
    setErrorFlag(errorTemp);
    return valid;
  };

  const { referencia, concepto, GuardaCuenta } = transferencia;
  const { Alias, Beneficiario, IdBanco, Valor } = clientAccount;

  return (
    <>
      {loading && <Loading show={loading} />}
      {modalConfirmacionEliminar && (
        <ModalConfirmation
          showModal={modalConfirmacionEliminar}
          message="¿Estás seguro de eliminar la cuenta?"
          closeModal={handleCloseConfirmarGuardar}
        ></ModalConfirmation>
      )}
      <DashboardLayout>
        <DashboardNavbar />
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={12} display="flex">
            <MDBox height="100%" width="100%">
              <Card sx={{ maxWidth: "100%", height: "100%" }}>
                <Grid container alignItems="center" p={3}>
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
                    <MDTypography variant="h5">TRANSFERIR</MDTypography>
                  </Grid>

                  {/* <Grid item xs textAlign="right">
                    <MDTypography variant="h6" color="dark" fontWeight="bold">
                      $
                      {(tarjeta?.available ?? 0).toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </MDTypography>
                  </Grid> */}
                </Grid>

                <Grid container spacing={2} p={3}>
                  <Grid item xs={12} sm={12}>
                    <Autocomplete
                      value={defaultAccount}
                      id="IdCuenta"
                      options={accountList}
                      onChange={handleChangeSelect}
                      renderInput={(params) => (
                        <FormField
                          {...params}
                          required
                          error={errorFlag.idCuenta}
                          helperText={errorFlag.idCuentaMsg}
                          label="Selecciona una cuenta"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </Grid>
                  {showCuentaSeleccionada ? (
                    <>
                      <Grid item xs={12} sm={4}>
                        <FormField
                          label="Alias"
                          value={cuentaSeleccionada.alias}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormField
                          label="Beneficiario"
                          value={cuentaSeleccionada.beneficiario}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <FormField
                          disabled
                          label="Banco"
                          value={cuentaSeleccionada.banco}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <FormField
                          label="Tipo de Cuenta"
                          value={cuentaSeleccionada.tipoCuenta}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormField
                          disabled
                          label="Numero"
                          value={cuentaSeleccionada.valor}
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
                          onClick={confirmEliminarCuenta}
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
                      <Grid item xs={12} sm={4}>
                        <FormField
                          disabled={agregarDisabled}
                          error={errorFlag.beneficiario}
                          helperText={errorFlag.beneficiarioMsg}
                          name="Beneficiario"
                          label="Beneficiario"
                          value={Beneficiario}
                          onChange={handleChangeAlphanumericSpace}
                          inputProps={{ maxLength: 40 }}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormField
                          disabled={agregarDisabled}
                          error={errorFlag.alias}
                          helperText={errorFlag.aliasMsg}
                          name="Alias"
                          label="Alias"
                          value={Alias}
                          onChange={handleChangeAlphanumericSpace}
                          inputProps={{ maxLength: 40 }}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Autocomplete
                          value={defaultBancos}
                          id="IdBanco"
                          options={banksList}
                          onChange={handleChangeSelect}
                          renderInput={(params) => (
                            <FormField
                              {...params}
                              required
                              disabled={agregarDisabled}
                              error={errorFlag.idBanco}
                              helperText={errorFlag.idBancoMsg}
                              label="Selecciona un banco"
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Autocomplete
                          value={defaultTipoCuenta}
                          id="IdTipoCuentaBancaria"
                          options={tipoCuentaList}
                          onChange={handleChangeSelect}
                          renderInput={(params) => (
                            <FormField
                              {...params}
                              required
                              disabled={agregarDisabled}
                              error={errorFlag.idTipoCuentaBancaria}
                              helperText={errorFlag.idTipoCuentaBancariaMsg}
                              label="Selecciona un tipo de cuenta"
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormField
                          error={errorFlag.valor}
                          helperText={errorFlag.valorMsg}
                          disabled={agregarDisabled}
                          name="Valor"
                          label="Numero"
                          value={Valor}
                          onChange={handleChangeNumeric}
                          inputProps={{ maxLength: 18 }}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} style={{ textAlign: "left" }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              disabled={agregarDisabled}
                              name="GuardaCuenta"
                              onChange={handleChangeCheck}
                              checked={GuardaCuenta}
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
                          error={errorFlag.referencia}
                          helperText={errorFlag.referenciaMsg}
                          name="referencia"
                          label="Referencia"
                          value={referencia}
                          onChange={handleChangeNumeric}
                          inputProps={{ maxLength: 7 }}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} mt={2}>
                        <FormField
                          error={errorFlag.concepto}
                          helperText={errorFlag.conceptoMsg}
                          name="concepto"
                          label="Concepto"
                          value={concepto}
                          onChange={handleChangeAlphanumericSpace}
                          inputProps={{ maxLength: 40 }}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} mt={2}>
                        <FormField
                          error={errorFlag.cantidad}
                          helperText={errorFlag.cantidadMsg}
                          name="Cantidad"
                          label="Cantidad $ MXN"
                          value={transferencia.Cantidad}
                          onChange={handleChangeNumericNoZeros}
                          inputProps={{ maxLength: 12, inputMode: "numeric" }}
                          required
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Grid container spacing={1} pr={1} pl={1}>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        style={{ textAlign: "center" }}
                      >
                        <MDTypography variant="h6">Totales</MDTypography>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <MDTypography
                          variant="button"
                          color="text"
                          fontWeight="regular"
                        >
                          Cantidad:
                        </MDTypography>
                      </Grid>
                      <Grid item xs={6} sm={6} style={{ textAlign: "right" }}>
                        {/* <MDTypography variant="h6"> */}
                        <MDTypography variant="button" fontWeight="bold">
                          $
                          {transferencia.Cantidad.toLocaleString("es-MX", {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <MDTypography
                          variant="button"
                          color="text"
                          fontWeight="regular"
                        >
                          Comisión:
                        </MDTypography>
                      </Grid>
                      <Grid item xs={6} sm={6} style={{ textAlign: "right" }}>
                        {/* <MDTypography variant="h6"> */}
                        <MDTypography variant="button" fontWeight="bold">
                          {Number(datos?.comisionSpeiOut || 0).toLocaleString(
                            "es-MX",
                            {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            },
                          )}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <MDTypography
                          variant="button"
                          color="text"
                          fontWeight="regular"
                        >
                          Total:
                        </MDTypography>
                      </Grid>
                      <Grid item xs={6} sm={6} style={{ textAlign: "right" }}>
                        {/* <MDTypography variant="h6"> */}
                        <MDTypography variant="button" fontWeight="bold">
                          ${" "}
                          {typeof transferencia.Cantidad === "function"
                            ? "0.00"
                            : Number(totalesExterna?.total || 0).toLocaleString(
                                "es-MX",
                                {
                                  maximumFractionDigits: 2,
                                  minimumFractionDigits: 2,
                                },
                              )}
                        </MDTypography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    {isAlertValide && (
                      <MDBox mt={1}>
                        <MDAlert
                          color={
                            message.type === "error" ? "error" : message.type
                          }
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
                          onClick={confirmarExterno}
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
      </DashboardLayout>
    </>
  );
};
