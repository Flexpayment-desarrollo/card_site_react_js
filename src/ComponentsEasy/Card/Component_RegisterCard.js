import Alert from "Global/Alert";
import Loading from "Global/Loading/Loading";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Autocomplete, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import FormField from "layouts/applications/wizard/components/FormField";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ModalConfirmation } from "Global/ModalConfirmation";
import { ArrowBack, Save } from "@mui/icons-material";
import { numericValid } from "Global/Expressions";
import { registerCard } from "Services/Card/Service_Card";
import { deleteStorage } from "Global/Expressions";
import { Component_RegistrarSinTh } from "./Component_RegisterCardSinTH";

const Data = {
    CardNumber: "",
    Expires: ""
}

export const Component_RegisterCard = ({ closeDetail, closeModal }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const currentYear = new Date().getFullYear();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(Data);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [showRegistrar, setShowRegistrar] = useState(true);
    const [showRegistrarCardSinTH, setShowRegistrarCardSinTH] = useState(false);
    const [modalConfirmacionAbrirRegistrar, setModalConfirmacionAbrirRegistrar] = useState(false);
    const [modalConfirmacionGuardar, setModalConfirmacionGuardar] = useState(false);
    const [message, setMessage] = useState({
        isShow: false
    });
    const [errorFlag, setErrorFlag] = useState({
        tarjeta: false,
        tarjetaMsg: "",
        mes: false,
        mesMsg: "",
        anio: false,
        anioMsg: "",
    });

    const meses = [
        { value: "01", label: "01 - Enero" },
        { value: "02", label: "02 - Febrero" },
        { value: "03", label: "03 - Marzo" },
        { value: "04", label: "04 - Abril" },
        { value: "05", label: "05 - Mayo" },
        { value: "06", label: "06 - Junio" },
        { value: "07", label: "07 - Julio" },
        { value: "08", label: "08 - Agosto" },
        { value: "09", label: "09 - Septiembre" },
        { value: "10", label: "10 - Octubre" },
        { value: "11", label: "11 - Noviembre" },
        { value: "12", label: "12 - Diciembre" },
    ];

    useEffect(() => {
        const yearsArray = [];
        for (let i = 0; i <= 10; i++) {
            yearsArray.push(currentYear + i);
        }
        setYears(yearsArray);
    }, [currentYear]);

    /*Método que registra una tarjeta*/
    const registrarTarjeta = async () => {
        const yearShort = selectedYear.toString().slice(-2);
        const expirationDate = `${yearShort}-${selectedMonth.value}`;
        let datos = {
            CardNumber: formData.CardNumber,
            Expires: expirationDate,
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
                    const Id = data.businessMeaning;
                    closeDetail(Id);
                    //setLoading(false);
                } else if (data.code === 1) {
                    setLoading(false);
                    setModalConfirmacionAbrirRegistrar(true);
                }
                else {
                    setLoading(false);
                    setMessage({
                        isShow: true,
                        text: data.businessMeaning,
                        type: "danger",
                    });
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
                            type: "danger",
                            isShow: true,
                        });
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
        if (value !== "" && !numericValid(value))
            return;
        setFormData(
            (prevState) => {
                return {
                    ...prevState,
                    [name]: value
                }
            }
        );
    }

    const handleChangeSelect = async (event, newValue) => {
        if (newValue !== null) {
            let name = event.target.id.split("-")[0];

            switch (name) {
                case "IdAnio":
                    setSelectedYear(newValue);
                    break;
                case "IdMes":
                    setSelectedMonth(newValue);
                    break;
                default:
                    break;
            }
        }
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
        if ((typeof (CardNumber) === 'function' || CardNumber === "" || CardNumber === undefined)) {
            errorTemp.tarjeta = true
            errorTemp.tarjetaMsg = "El número de tarjeta no puede estar vacío."
            valid = false
        }
        else if (CardNumber.length !== 16) {
            errorTemp.tarjeta = true;
            errorTemp.tarjetaMsg = "La longitud debe ser de 16 caracteres"
            valid = false;
        }
        if (!selectedMonth) {
            errorTemp.mes = true;
            errorTemp.mesMsg = "Debes seleccionar un mes";
            valid = false;
        }

        if (!selectedYear) {
            errorTemp.anio = true;
            errorTemp.anioMsg = "Debes seleccionar un año";
            valid = false;
        }
        setErrorFlag(errorTemp);
        return valid;
    };

    /*Método para validar que no haya errores en el formulario y si todo esta bien abrir el modal de confirmación*/
    const confirmar = (e) => {
        e.preventDefault();
        let validation = validateForm()
        if (validation)
            setModalConfirmacionGuardar(true);
    };

    /** Metodo que limpia los mensajes */
    const clearMessage = () => {
        setMessage({
            isShow: false,
        });
    };

    const { CardNumber } = formData;

    return (
        <>
            {loading && <Loading show={loading} />}
            {message.isShow && <Alert alert={message.type} message={message.text} onClose={clearMessage} open={message.isShow} />}
            {modalConfirmacionGuardar && <ModalConfirmation showModal={modalConfirmacionGuardar} tipoModal={false} message="¿Estás seguro de registrar la tarjeta?" closeModal={handleCloseConfirmacion}></ModalConfirmation>}
            {modalConfirmacionAbrirRegistrar && <ModalConfirmation showModal={modalConfirmacionAbrirRegistrar} tipoModal={false} message="La tarjeta no esta asignada a ningún Tarhetahabiente. Te vamos a reedirigir a crear un Tarjetahabiente." closeModal={handleCloseRegistrar}></ModalConfirmation>}

            {showRegistrar ?
                <MDBox>
                    <Grid container mb={3}>
                        <Grid item mr={1}>
                            <Tooltip placement="top" title="Regresar">
                                <IconButton onClick={closeModal} sx={{ background: '#ebebeb', borderColor: 'black', color: "#41464b" }}>
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
                                    <Grid item xs={12} sm={6}>
                                        <FormField
                                            error={errorFlag.tarjeta}
                                            helperText={errorFlag.tarjetaMsg}
                                            name="CardNumber"
                                            label="Número de Tarjeta"
                                            value={CardNumber}
                                            onChange={handleChangeNumeric}
                                            inputProps={{ maxLength: 16 }}
                                            required />
                                    </Grid>
                                    <Grid item xs={12} sm={3} >
                                        <Autocomplete
                                            value={selectedMonth}
                                            id="IdMes"
                                            options={meses}
                                            getOptionLabel={(option) => option.label}
                                            isOptionEqualToValue={(option, value) => option.value === value.value}
                                            onChange={handleChangeSelect}
                                            renderInput={(params) => (
                                                <FormField
                                                    {...params}
                                                    required
                                                    error={errorFlag.mes}
                                                    helperText={errorFlag.mesMsg}
                                                    label="Selecciona un Mes"
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <Autocomplete
                                            value={selectedYear}
                                            id="IdAnio"
                                            options={years}
                                            getOptionLabel={(option) => option.toString()}
                                            onChange={handleChangeSelect}
                                            renderInput={(params) => (
                                                <FormField
                                                    {...params}
                                                    required
                                                    error={errorFlag.anio}
                                                    helperText={errorFlag.anioMsg}
                                                    label="Selecciona un año"
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container p={2} display="flex" alignItems="flex-end" style={{ textAlign: "right" }}>
                                    <Grid item xs={12} sm={12}>
                                        <MDButton type="button" variant="gradient" color="info" size="small"
                                            onClick={confirmar}
                                            sx={{
                                                "&:hover": {
                                                    boxShadow: "none", // elimina el sombreado al hacer hover
                                                },
                                            }}
                                        >
                                            <Save sx={{
                                                width: "20px",
                                                height: "20px",
                                                color: "white !important",
                                            }} />&nbsp;
                                            Guardar
                                        </MDButton>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
                : null}

            {showRegistrarCardSinTH ?
                <Component_RegistrarSinTh closeDetail={closeDetail} closeModal={closeModal} />
                : null}
        </>
    );
};