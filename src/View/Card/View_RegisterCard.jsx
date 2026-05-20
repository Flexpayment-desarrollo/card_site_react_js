import Alert from "Global/Alert";
import Loading from "Global/Loading/Loading";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import FormField from "layouts/applications/wizard/components/FormField";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ModalConfirmation } from "Global/ModalConfirmation";
import { ArrowBack, Error, Save } from "@mui/icons-material";
import { numericValid } from "Global/Expressions";
import { registerCard } from "Services/Card/Service_Card";
import { deleteStorage } from "Global/Expressions";
import { Component_RegistrarSinTh } from "ComponentsEasy/Card/Component_RegisterCardSinTH";

const Data = {
  CardNumber: "",
  Expires: "",
};

export const View_RegisterCard = ({ closeModal }) => {
  const navigate = useNavigate();
  const Ubicacion = JSON.parse(sessionStorage.getItem("ubicacion"));
  const location = useLocation();
  const { closeDetail } = location;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(Data);
  const [isAlertValide, setIsAlertValide] = useState(false);
  const [showRegistrar, setShowRegistrar] = useState(true);
  const [showRegistrarCardSinTH, setShowRegistrarCardSinTH] = useState(false);
  const [modalConfirmacionAbrirRegistrar, setModalConfirmacionAbrirRegistrar] =
    useState(false);
  const [modalConfirmacionGuardar, setModalConfirmacionGuardar] =
    useState(false);
  const [message, setMessage] = useState({
    isShow: false,
  });
  const [errorFlag, setErrorFlag] = useState({
    tarjeta: false,
    tarjetaMsg: "",
    mes: false,
    mesMsg: "",
    anio: false,
    anioMsg: "",
  });

  useEffect(() => {
    if (isAlertValide && message.isShow) {
      const timer = setTimeout(() => {
        setIsAlertValide(false);
        setMessage((prev) => ({ ...prev, isShow: false }));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isAlertValide, message.isShow]);

  /*Método que registra una tarjeta*/
  const registrarTarjeta = async () => {
    const [month, year] = formData.Expires.split("/");
    const expirationFormatted = `${year}-${month}`;
    let datos = {
      CardNumber: formData.CardNumber,
      Expires: expirationFormatted,
      Longitud: Ubicacion.Longitud,
      Latitud: Ubicacion.Latitud,
    };
    setLoading(true);

    await registerCard(datos)
      .then((data) => {
        if (data.code === 0) {
          setLoading(false);
          setMessage({
            isShow: true,
            text: "La tarjeta ha sido registrado correctamente",
            type: "success",
          });
          setIsAlertValide(true);
          const Id = data.businessMeaning;
          navigate("/Card", { state: { info: Id } });
        } else if (data.code === 1) {
          setLoading(false);
          setModalConfirmacionAbrirRegistrar(true);
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

  /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
  const handleCloseConfirmacion = (e) => {
    if (e.target.name === "yesBtn") {
      setModalConfirmacionGuardar(false);
      registrarTarjeta();
    } else {
      if (e.target.name === "noBtn") {
        setModalConfirmacionGuardar(false);
      }
    }
  };

  /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
  const handleCloseRegistrar = (e) => {
    if (e.target.name === "yesBtn") {
      setModalConfirmacionAbrirRegistrar(false);
      setShowRegistrarCardSinTH(true);
      setShowRegistrar(false);
    } else {
      if (e.target.name === "noBtn") {
        setModalConfirmacionGuardar(false);
      }
    }
  };

  /*Método que valida que solo se acepten números*/
  const handleChangeNumeric = (event) => {
    const { name, value } = event.target;
    if (value !== "" && !numericValid(value)) return;
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleChangeExpires = (event) => {
    let { value } = event.target;
    const { selectionStart } = event.target; // Guardar posición del cursor

    // Obtener el valor anterior para saber si estamos borrando
    const prevValue = formData.Expires || "";
    const isDeleting = prevValue.length > value.length;

    // Si el usuario intentó borrar la diagonal directamente, borramos el número anterior también
    if (isDeleting && prevValue.endsWith("/") && value.length === 2) {
      value = value.substring(0, 1);
    }

    // Limpiar caracteres no numéricos
    let cleanValue = value.replace(/\D/g, "");

    // Si estamos borrando, no forzamos el formato de "0X" ni insertamos "/"
    // para permitir que el usuario limpie el campo.
    if (!isDeleting) {
      if (cleanValue.length === 1 && cleanValue > 1) {
        cleanValue = "0" + cleanValue;
      }
      if (cleanValue.length >= 2) {
        let month = cleanValue.substring(0, 2);
        if (parseInt(month) > 12) month = "12";
        cleanValue = month + "/" + cleanValue.substring(2, 4);
      }
    } else {
      // Si estamos borrando y solo quedan 2 dígitos, quitamos la diagonal si existe
      if (cleanValue.length === 2 && !value.includes("/")) {
        cleanValue = cleanValue.substring(0, 2);
      } else if (cleanValue.length >= 2) {
        cleanValue =
          cleanValue.substring(0, 2) + "/" + cleanValue.substring(2, 4);
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      Expires: cleanValue,
    }));
  };

  /*Método que valida el formulario*/
  const validateForm = () => {
    let valid = true;
    let errorTemp = {
      tarjeta: false,
      tarjetaMsg: "",
      mes: false,
      mesMsg: "",
      anio: false,
      anioMsg: "",
    };
    if (
      typeof CardNumber === "function" ||
      CardNumber === "" ||
      CardNumber === undefined
    ) {
      errorTemp.tarjeta = true;
      errorTemp.tarjetaMsg = "El número de tarjeta no puede estar vacío.";
      valid = false;
    } else if (CardNumber.length !== 16) {
      errorTemp.tarjeta = true;
      errorTemp.tarjetaMsg = "La longitud debe ser de 16 caracteres";
      valid = false;
    }
    if (typeof Expires === "function" || Expires === "") {
      errorTemp.expires = true;
      errorTemp.expiresMsg = "La fecha de expiración no puede estar vacía";
      valid = false;
    } else if (Expires.length < 5) {
      errorTemp.expires = true;
      errorTemp.expiresMsg = "Formato requerido: MM/AA";
      valid = false;
    }
    setErrorFlag(errorTemp);
    return valid;
  };

  /*Método para validar que no haya errores en el formulario y si todo esta bien abrir el modal de confirmación*/
  const confirmar = (e) => {
    e.preventDefault();
    let validation = validateForm();
    if (validation) setModalConfirmacionGuardar(true);
  };

  /** Metodo que limpia los mensajes */
  const clearMessage = () => {
    setIsAlertValide(false);
    setMessage({
      isShow: false,
      text: "",
      type: "",
    });
  };

  const { CardNumber, Expires } = formData;

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
      {modalConfirmacionGuardar && (
        <ModalConfirmation
          showModal={modalConfirmacionGuardar}
          tipoModal={false}
          message="¿Estás seguro de registrar la tarjeta?"
          closeModal={handleCloseConfirmacion}
        ></ModalConfirmation>
      )}
      {modalConfirmacionAbrirRegistrar && (
        <ModalConfirmation
          showModal={modalConfirmacionAbrirRegistrar}
          tipoModal={false}
          message="La tarjeta no esta asignada a ningún Tarhetahabiente. Te vamos a reedirigir a crear un Tarjetahabiente."
          closeModal={handleCloseRegistrar}
        ></ModalConfirmation>
      )}
      <DashboardLayout>
        <DashboardNavbar />

        {showRegistrar ? (
          <MDBox>
            <Grid container mb={3}>
              <Grid item mr={1}>
                <Tooltip placement="top" title="Regresar">
                  <IconButton
                    onClick={() => navigate("/Cards")}
                    sx={{
                      background: "#ebebeb",
                      borderColor: "black",
                      color: "#41464b",
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={9} sm={9} mt={1}>
                <MDTypography variant="h5">Agregar Tarjeta</MDTypography>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card id="basic-info" sx={{ overflow: "visible" }}>
                  <Grid container p={3} spacing={3}>
                    <Grid item xs={12} sm={6} md={6}>
                      <FormField
                        error={errorFlag.tarjeta}
                        helperText={errorFlag.tarjetaMsg}
                        name="CardNumber"
                        label="Número de Tarjeta"
                        value={CardNumber}
                        onChange={handleChangeNumeric}
                        inputProps={{ maxLength: 16 }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={3} md={6}>
                      <FormField
                        label="Fecha de Expiración"
                        placeholder="MM/AA"
                        name="Expires"
                        value={Expires}
                        onChange={handleChangeExpires}
                        error={errorFlag.expires}
                        helperText={errorFlag.expiresMsg}
                        fullWidth
                        inputProps={{ maxLength: 5 }}
                        required
                      />
                    </Grid>
                  </Grid>

                  {isAlertValide && (
                    <MDBox mt={1} pl={2} pr={2}>
                      <MDAlert
                        color={
                          message.type === "error" ? "error" : message.type
                        }
                        onClose={clearMessage}
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
                    p={2}
                    display="flex"
                    alignItems="flex-end"
                    style={{ textAlign: "right" }}
                  >
                    <Grid item xs={12} sm={12}>
                      <MDButton
                        type="button"
                        variant="gradient"
                        color="info"
                        size="small"
                        onClick={confirmar}
                        sx={{
                          "&:hover": {
                            boxShadow: "none", // elimina el sombreado al hacer hover
                          },
                        }}
                      >
                        <Save
                          sx={{
                            width: "20px",
                            height: "20px",
                            color: "white !important",
                          }}
                        />
                        &nbsp; Guardar
                      </MDButton>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        ) : null}

        {showRegistrarCardSinTH ? (
          <Component_RegistrarSinTh
            datos={formData}
            closeDetail={closeDetail}
            closeModal={closeModal}
          />
        ) : null}
      </DashboardLayout>
    </>
  );
};
