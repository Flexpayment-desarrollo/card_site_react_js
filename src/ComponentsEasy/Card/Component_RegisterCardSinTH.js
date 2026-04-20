import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Loading from "Global/Loading/Loading";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import FormField from "layouts/applications/wizard/components/FormField";
import { emailValidForm } from "Global/Expressions";
import { useNavigate } from "react-router-dom";
import { ArrowBack, Save } from "@mui/icons-material";
import { TbCalculator } from "react-icons/tb";
import { alphanumericValid_ } from "Global/Expressions";
import { ModalConfirmation } from "Global/ModalConfirmation";
import { calcRFC } from "Services/Auth/Service_Register";
import { getState } from "Services/Card/Service_Card";
import { getCity } from "Services/Card/Service_Card";
import { getColony } from "Services/Card/Service_Card";
import { getGender } from "Services/Card/Service_Card";
import { getIdentification } from "Services/Card/Service_Card";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createCardTH } from "Services/Card/Service_Card";
import { encryptPassword } from "Global/EncryptPassword";
import { Autocomplete, Card, Grid, IconButton, Tooltip } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { alphanumericSpaceValid, deleteStorage, numericValid } from 'Global/Expressions';
import { Component_StateDic } from "./AutocompletesRegistrarSinTH/Component_StateDic";
import { Component_GenderType } from "./AutocompletesRegistrarSinTH/Component_GenderType";
import { Component_IdentificationDic } from "./AutocompletesRegistrarSinTH/Component_IdentificationDic";

const Data = {
    CardNumber: "",
    Expires: "",
    Nombre: "",
    SegundoNombre: "",
    FechaNacimiento: "",
    Latitud: 0,
    Longitud: 0,
    RFC: "",
    Telefono: "",
    Email: "",
    Direccion: "",
    Exterior: "",
    Interior: "",
    ApellidoPaterno: "",
    ApellidoMaterno: "",
    IdGenero: 0,
    Curp: "",
    IdTipoIdentificacion: 0,
    NoIdentificacion: "",
    IdCP: 0
}

export const Component_RegistrarSinTh = ({ action, setMessage, closeDetail, closeModal }) => {
    const navigate = useNavigate();
    const Ubicacion = JSON.parse(sessionStorage.getItem("ubicacion"));
    const [formData, setFormData] = useState(Data)
    const [loading, setLoading] = useState(false);
    const [stateDic, setStateDic] = useState("");
    const [cityDic, setCityDic] = useState("");
    const [stateList, setStateList] = useState([""]);
    const [cityList, setCityList] = useState([""]);
    const [colonyList, setColonyList] = useState([{ id: 0, label: "" }]);
    const [dateBirth, setDateBirth] = useState(dayjs(new Date()));
    const [defaultIdCP, setDefaultIdCP] = useState({ id: 0, label: "" });
    const [defaultTipoIdent, setDefaultTipoIdent] = useState({ id: 0, label: "" })
    const [genderType, setGenderType] = useState([]);
    const [defaultGenero, setDefaultGenero] = useState({ id: 0, label: "" });
    const [identificationType, setIdentificationType] = useState([]);
    const [modalConfirmacionGuardar, setModalConfirmacionGuardar] = useState(false);
    const [errorFlag, setErrorFlag] = useState({
        rfc: false,
        rfcMsg: '',
        aPaterno: false,
        aPaternoMsg: "",
        aMaterno: false,
        aMaternoMsg: "",
        nombre: false,
        nombreMsg: '',
        genero: false,
        generoMsg: "",
        curp: false,
        curpMsg: '',
        direccion: false,
        direccionMsg: "",
        exterior: false,
        exteriorMsg: "",
        estado: false,
        estadoMsg: "",
        municipio: false,
        municipioMsg: "",
        colonia: false,
        coloniaMsg: "",
        email: false,
        emailMsg: "",
        tipoIdent: false,
        tipoIdentMsg: "",
        noIdent: false,
        noIdentMsg: "",
        numTarjeta: false,
        numTarjetaMsg: "",
        expires: false,
        expiresMsg: "",
    });

    useEffect(() => {
        getStateList();
        getGenderList();
        getIdentificationList();
        setDateBirth(dayjs(new Date()));
    }, []);

    /*Método que consulta la lista de estados*/
    async function getStateList() {
        await getState()
            .then((data) => {
                if (data.code === 0) {
                    setStateList(data.data);
                    if (action === "edit") {
                        setStateDic(stateDic)
                        getCityList(stateDic, true) //true si es porque estamos en edit y es la primera vez
                    }
                }
                else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                // if (error.response.status === 401) {
                //     if (error.response.data.code === 2011) {
                //         deleteStorage();
                //         navigate("/SignIn");
                //     } else {
                //     }
                // }
                setMessage({
                    text: error.message,
                    type: "warning",
                    isShow: true
                });

            });
    }

    /**Método que trae la lista de las ciudades en base al estado que seleccione el usuario*/
    async function getCityList(estado, tipo) {
        await getCity(estado)
            .then((data) => {
                if (data.code === 0) {
                    if (data.data !== null) {
                        setCityList(data.data);
                        if ((action === "edit") && tipo) {
                            setCityDic(cityDic)
                            getColonyList(stateDic, cityDic, tipo)
                        }
                    }
                    else {
                        setLoading(false);
                    }
                } else {
                    setLoading(false);
                    setMessage({
                        isShow: true,
                        text: data.businessMeaning,
                        type: "danger",
                    });
                }
            })
            .catch((error) => {
                setLoading(false)
                // if (error.response.status === 401) {
                //     if (error.response.data.code === 2011) {
                //         deleteStorage();
                //         navigate("/SignIn");
                //     } else {
                //         setMessage({
                //             text: error.message,
                //             type: "danger",
                //             isShow: true
                //         });
                //     }
                // }
                setMessage({
                    text: error.message,
                    type: "warning",
                    isShow: true
                });

            });
    }

    /**Método que trae la lista de las colonias en base al estado y ciudad que seleccione el usuario*/
    async function getColonyList(estado, ciudad) {
        await getColony(estado, ciudad)
            .then((data) => {
                if (data.code === 0) {
                    if (data.data !== null) {
                        var rows = [];
                        data.data.forEach(data => {
                            let jsonData = {
                                id: data.code,
                                label: data.name,
                            };
                            rows.push(jsonData);

                        });
                        setColonyList(rows);
                        if (action === "edit") {
                            var coloniaSelecionada = rows.find(element => element.id == formData.IdCP)
                            setDefaultIdCP(coloniaSelecionada)
                        }
                    }
                    setLoading(false);
                } else {
                    setLoading(false);
                    setMessage({
                        isShow: true,
                        text: data.businessMeaning,
                        type: "danger",
                    });
                }
            })
            .catch((error) => {
                setLoading(false)
                // if (error.response.status === 401) {
                //     if (error.response.data.code === 2011) {
                //         deleteStorage();
                //         navigate("/SignIn");
                //     } else {
                //         setMessage({
                //             text: error.message,
                //             type: "danger",
                //             isShow: true
                //         });
                //     }
                // }
                setMessage({
                    text: error.message,
                    type: "warning",
                    isShow: true
                });


            });
    }

    /*Método que consulta la lista de géneros para el prospecto*/
    async function getGenderList() {
        await getGender().then((result) => {
            var rows = [];
            result.data.forEach(data => {
                let jsonData = {
                    id: data.id,
                    label: data.nombre,
                };
                rows.push(jsonData);
            });
            setGenderType(rows);
            //setDefaultGenero({ id: 0, label: "" })
        }).catch((err) => {
        })
    }

    /*Método que consulta la lista de tipos de identificación*/
    async function getIdentificationList() {
        await getIdentification().then((result) => {
            var rows = [];
            result.data.forEach(data => {
                let jsonData = {
                    id: data.id,
                    label: data.nombre,
                };
                rows.push(jsonData);
            });
            setIdentificationType(rows);
            if (action === "edit") {
                var identSeleccionado = rows.find(element => element.id === formData.IdTipoIdentificacion)
                if (identSeleccionado !== undefined && identSeleccionado !== null)
                    setDefaultTipoIdent(identSeleccionado)
                else
                    setDefaultTipoIdent({ id: 0, label: "" })
            }
        }).catch((err) => {
        })
    }

    /*Método que asigna un tarjetahabiente a una tarjeta*/
    const sendForm = async () => {

        const [month, year] = formData.Expires.split("/");
        const expirationFormatted = `${year}-${month}`;

        let datos = {
            Latitud: Ubicacion.Latitud,
            Longitud: Ubicacion.Longitud,
            first_name: formData.Nombre,
            second_name: formData.SegundoNombre,
            surname: formData.ApellidoPaterno,
            second_surname: formData.ApellidoMaterno,
            birthdate: formData.FechaNacimiento,
            email: formData.Email,
            phone: formData.Telefono,
            rfc: formData.RFC,
            curp: formData.Curp,
            IdTipoIdentificacion: formData.IdTipoIdentificacion,
            NoIdentificacion: formData.NoIdentificacion,
            IdCP: formData.IdCP,
            street: formData.Direccion,
            street_ext_number: formData.Exterior,
            street_int_number: formData.Interior,
            IdGenero: formData.IdGenero,
            CardNumber: encryptPassword(formData.CardNumber),
            Expires: encryptPassword(expirationFormatted),
        }
        setLoading(true);
        await createCardTH(datos)
            .then((data) => {
                console.log(data);
                if (data.code === 0) {
                    setLoading(false);
                    setMessage({
                        isShow: true,
                        text: "Tarjetahabiente creado correctamente",
                        type: "success",
                    });
                    const Id = data.businessMeaning;
                    closeDetail(Id);
                } else {
                    setLoading(false);
                    setMessage({
                        isShow: true,
                        text: data.businessMeaning,
                        type: "danger",
                    });
                }
            })
            .catch((error) => {
                console.log(error);
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

    /*Método para validar que no haya errores en el formulario y si todo esta bien abrir el modal de confirmación*/
    const confirmar = (e) => {
        e.preventDefault();
        let validation = validateForm();
        if (validation)
            setModalConfirmacionGuardar(true);
    };

    const handleChangeAlphanumeric = (event) => {
        const { name, value } = event.target;
        if (value !== "" && !alphanumericValid_(value)) return;
        setFormData({
            ...formData,
            [name]: value.toUpperCase(),
        });
    };

    const handleChangeAlphanumericSpace = (event) => {
        const { name, value } = event.target;
        if (value !== "" && !alphanumericSpaceValid(value)) return;
        setFormData({
            ...formData,
            [name]: value.toUpperCase(),
        });
    };

    const handleChangeNumber = (event) => {
        const { name, value } = event.target;
        if (value !== "" && !numericValid(value)) return;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    /*Método para validar la fecha de nacimiento*/
    const handleDateBirthChange = (value) => {
        if (value === null) return;
        setDateBirth(dayjs(new Date(value.format("YYYY/MM/DD"))));
        setFormData(
            (prevState) => {
                return {
                    ...prevState,
                    ["FechaNacimiento"]: value.format("YYYY/MM/DD").replaceAll("/", "-")
                }
            }
        );
    }

    /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
    const handleCloseConfirmacion = (e) => {
        if (e.target.name === "yesBtn") {
            setModalConfirmacionGuardar(false);
            sendForm();
        } else {
            if (e.target.name === "noBtn") {
                setModalConfirmacionGuardar(false);
            }
        }
    };

    const handleChangeSelect = (event, newValue) => {
        let name = event.target.id.split("-")[0];
        if (name === "")
            return;
        switch (name) {
            case "ddlState":
                setStateDic(newValue);
                setCityDic("");
                getCityList(newValue);
                setColonyList([{ id: 0, label: '' }]);
                setDefaultIdCP({ id: 0, label: '' });
                setFormData({
                    ...formData,
                    IdCP: 0
                })
                break;
            case "ddlCity":
                setCityDic(newValue);
                setDefaultIdCP({ id: 0, label: '' });
                getColonyList(stateDic, newValue);
                setFormData({
                    ...formData,
                    IdCP: 0
                })
                break;

            case "IdCP":
                if (newValue) { // Validar que no sea null
                    setFormData({
                        ...formData,
                        IdCP: parseInt(newValue.id) // Acceder a .id antes de parsear
                    });
                    setDefaultIdCP(newValue);
                } else {
                    setFormData({ ...formData, IdCP: 0 });
                    setDefaultIdCP({ id: 0, label: "" });
                }
                break;
            case "IdTipoIdentificacion":
                setFormData({
                    ...formData,
                    IdTipoIdentificacion: parseInt(newValue.id)
                })
                setDefaultTipoIdent(newValue)
                break;
            case "IdGenero":
                setFormData({
                    ...formData,
                    IdGenero: parseInt(newValue.id)
                })
                setDefaultGenero(newValue)
                break;
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    /*Control para calcular el RFC en base a los datos que proporciono el usuario*/
    const getRFC = async () => {
        let valid = true;
        var errorTemp = {
            nombre: false,
            nombreMsg: "",
            aPaterno: false,
            aPaternoMsg: "",
            aMaterno: false,
            aMaternoMsg: "",
            fechaNacimiento: false,
            fechaNacimientoMsg: ""
        }

        if ((typeof (Nombre) === 'function' || Nombre === "")) {
            errorTemp.nombre = true
            errorTemp.nombreMsg = "El nombre no puede estar vacío para calcular el RFC."
            valid = false
        }
        if ((typeof (ApellidoPaterno) === 'function' || ApellidoPaterno === "")) {
            errorTemp.aPaterno = true
            errorTemp.aPaternoMsg = "El apellido paterno no puede estar vacío para calcular el RFC."
            valid = false
        }
        if ((typeof (ApellidoMaterno) === 'function' || ApellidoMaterno === "")) {
            errorTemp.aMaterno = true
            errorTemp.aMaternoMsg = "El apellido materno no puede estar vacío para calcular el RFC."
            valid = false
        }
        if ((typeof (FechaNacimiento) === 'function' || FechaNacimiento === 'Invalid Date')) {
            errorTemp.fechaNacimiento = true
            errorTemp.fechaNacimientoMsg = "La fecha no es válida para calcular el RFC."
            valid = false
        }
        setErrorFlag({
            ...errorFlag,
            nombre: errorTemp.nombre,
            nombreMsg: errorTemp.nombreMsg,
            aPaterno: errorTemp.aPaterno,
            aPaternoMsg: errorTemp.aPaternoMsg,
            aMaterno: errorTemp.aMaterno,
            aMaternoMsg: errorTemp.aMaternoMsg,
            fechaNacimiento: errorTemp.fechaNacimiento,
            fechaNacimientoMsg: errorTemp.fechaNacimientoMsg
        })
        if (!valid)
            return

        let datos = {
            Nombre: (formData.Nombre + " " + formData.SegundoNombre).trim(),
            Paterno: formData.ApellidoPaterno,
            Materno: formData.ApellidoMaterno,
            FechaNacimiento: formData.FechaNacimiento
        }
        setLoading(true);
        await calcRFC(datos).then((result) => {
            setLoading(false);
            if (result.code === 0) {
                setFormData(
                    (prevState) => {
                        return {
                            ...prevState,
                            ["RFC"]: result.businessMeaning
                        }
                    }
                );
            } else {
                setMessage({
                    text: result.businessMeaning,
                    type: 'danger',
                    isShow: true
                });
            }
        }).catch((error) => {
            setLoading(false);
            if (error.response.status === 401) {
                if (error.response.data.code === 2011) {
                    deleteStorage();
                    navigate('/SignIn');
                } else {
                    setMessage({
                        text: error.message,
                        type: 'danger',
                        isShow: true
                    });
                }
            }
        });
    }

    const handleChangeExpires = (event) => {
        let { value } = event.target;
        const { selectionStart } = event.target; // Guardar posición del cursor

        // Obtener el valor anterior para saber si estamos borrando
        const prevValue = formData.Expires;
        const isDeleting = prevValue.length > value.length;

        // Si el usuario intentó borrar la diagonal directamente, borramos el número anterior también
        if (isDeleting && prevValue.endsWith('/') && value.length === 2) {
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
            if (cleanValue.length === 2 && !value.includes('/')) {
                cleanValue = cleanValue.substring(0, 2);
            } else if (cleanValue.length >= 2) {
                cleanValue = cleanValue.substring(0, 2) + "/" + cleanValue.substring(2, 4);
            }
        }

        setFormData((prevState) => ({
            ...prevState,
            Expires: cleanValue
        }));
    };

    /*Método que valida el formulario*/
    const validateForm = () => {
        let valid = true;
        let errorTemp = {
            rfc: false,
            rfcMsg: '',
            aPaterno: false,
            aPaternoMsg: "",
            aMaterno: false,
            aMaternoMsg: "",
            nombre: false,
            nombreMsg: '',
            segundoNombre: false,
            segundoNombreMsg: '',
            genero: false,
            generoMsg: "",
            curp: false,
            curpMsg: '',
            direccion: false,
            direccionMsg: "",
            exterior: false,
            exteriorMsg: "",
            estado: false,
            estadoMsg: "",
            municipio: false,
            municipioMsg: "",
            colonia: false,
            coloniaMsg: "",
            numTarjeta: false,
            numTarjetaMsg: "",
            tipoIdent: false,
            tipoIdentMsg: "",
            noIdent: false,
            noIdentMsg: "",
            expires: false,
            expiresMsg: "",
        };

        if ((typeof (Nombre) === 'function' || Nombre === "")) {
            errorTemp.nombre = true
            errorTemp.nombreMsg = "El nombre no puede estar vacío"
            valid = false;
        }
        if ((typeof (ApellidoPaterno) === 'function' || ApellidoPaterno === "")) {
            errorTemp.aPaterno = true;
            errorTemp.aPaternoMsg = "El apellido paterno no puede estar vacío"
            valid = false;
        }
        if ((typeof (ApellidoMaterno) === 'function' || ApellidoMaterno === "")) {
            errorTemp.aMaterno = true;
            errorTemp.aMaternoMsg = "El apellido materno no puede estar vacío"
            valid = false;
        }
        if (IdGenero === 0) {
            errorTemp.genero = true;
            errorTemp.generoMsg = "Debes seleccionar un género"
            valid = false;;
        }
        if ((typeof (FechaNacimiento) === 'function' || FechaNacimiento === 'Invalid Date')) {
            errorTemp.fechaNacimiento = true;
            errorTemp.fechaNacimientoMsg = "Debes seleccionar una fecha de nacimiento"
            valid = false;
        }
        else {
            /*Validar que la persona sea mayor a 18 años*/
            let anio = Number(FechaNacimiento.substring(0, 4));
            let mes = Number(FechaNacimiento.substring(5, 7));
            let dia = Number(FechaNacimiento.substring(8));
            let aa = new Date();
            let cc = aa.getFullYear() - anio
            if (cc <= 18) {
                if (cc < 18) {
                    errorTemp.fechaNacimiento = true
                    errorTemp.fechaNacimientoMsg = "La persona debe ser mayor a 18 años."
                    valid = false
                }
                else {
                    let diferenciaMes = mes - aa.getMonth() - 1;
                    if (diferenciaMes > 0) {
                        errorTemp.fechaNacimiento = true
                        errorTemp.fechaNacimientoMsg = "La persona debe ser mayor a 18 años."
                        valid = false
                    }
                    else {
                        if (diferenciaMes === 0) {
                            let diferenciaDia = dia - aa.getDate();
                            if (diferenciaDia > 0) {
                                errorTemp.fechaNacimiento = true
                                errorTemp.fechaNacimientoMsg = "La persona debe ser mayor a 18 años."
                                valid = false
                            }
                        }
                    }
                }
            }
        }
        if ((typeof (Curp) === 'function' || Curp === "" || Curp.length < 18)) {
            errorTemp.curp = true;
            errorTemp.curpMsg = "La longitud debe ser de 18 caracteres"
            valid = false;;
        }
        if ((typeof (RFC) === "function" || RFC === "")) {
            errorTemp.rfc = true;
            errorTemp.rfcMsg = "El RFC no puede estar vacío";
            valid = false;
        } else {
            if (RFC.length !== 13) {
                errorTemp.rfc = true;
                errorTemp.rfcMsg = "La longitud debe ser de 13 caracteres"
                valid = false;
            }
        }
        if (stateDic === "") {
            errorTemp.estado = true;
            errorTemp.estadoMsg = "Debes seleccionar un estado"
            valid = false;
        }
        if (cityDic === "") {
            errorTemp.municipio = true;
            errorTemp.municipioMsg = "Debes seleccionar un municipio"
            valid = false;
        }
        if (typeof (IdCP) === 'function' || IdCP === 0) {
            errorTemp.colonia = true;
            errorTemp.coloniaMsg = "Debes seleccionar una colonia"
            valid = false;
        }
        if (typeof (Direccion) === 'function' || Direccion === "") {
            errorTemp.direccion = true;
            errorTemp.direccionMsg = "Debes ingresar una dirección"
            valid = false;
        }
        if (typeof (Exterior) === 'function' || Exterior === "") {
            errorTemp.exterior = true;
            errorTemp.exteriorMsg = "Exterior no puede estar vacío"
            valid = false;
        }
        if (typeof (Telefono) === 'function' || Telefono === 0 || Telefono.length !== 10) {
            errorTemp.tel = true;
            errorTemp.telMsg = "La longitud debe ser de 10 caracteres"
            valid = false;
        }
        if (typeof (Email) === 'function' || Email === "" || !emailValidForm(Email.trim())) {
            errorTemp.email = true;
            errorTemp.emailMsg = "Email no valido"
            valid = false;
        }
        if (IdTipoIdentificacion === 0) {
            errorTemp.tipoIdent = true;
            errorTemp.tipoIdentMsg = "Debes seleccionar un tipo de identificación"
            valid = false;
        }
        if (typeof (NoIdentificacion) === 'function' || NoIdentificacion === "") {
            errorTemp.noIdent = true;
            errorTemp.noIdentMsg = "Número de identificación no puede estar vacío"
            valid = false;
        }
        if (typeof (CardNumber) === 'function' || CardNumber === "") {
            errorTemp.numTarjeta = true;
            errorTemp.numTarjetaMsg = "El número de tarjeta no puede estar vacío"
            valid = false;
        }
        else if (CardNumber.length !== 16) {
            errorTemp.numTarjeta = true;
            errorTemp.numTarjetaMsg = "La longitud debe ser de 16 caracteres"
            valid = false;
        }
        if (typeof (Expires) === 'function' || Expires === "") {
            errorTemp.expires = true;
            errorTemp.expiresMsg = "La fecha de expiración no puede estar vacía"
            valid = false;
        }
        else if (Expires.length < 5) {
            errorTemp.expires = true;
            errorTemp.expiresMsg = "Formato requerido: MM/AA";
            valid = false;
        }
        setErrorFlag(errorTemp)
        return valid
    }

    const {
        Telefono,
        Email,
        Direccion,
        Exterior,
        Interior,
        ApellidoPaterno,
        ApellidoMaterno,
        Nombre,
        SegundoNombre,
        IdGenero,
        FechaNacimiento,
        Curp,
        IdTipoIdentificacion,
        NoIdentificacion,
        CardNumber,
        IdCP,
        RFC,
        Expires
    } = formData;

    return (
        <>
            {loading && <Loading show={loading} />}
            {modalConfirmacionGuardar && (
                <ModalConfirmation
                    showModal={modalConfirmacionGuardar}
                    message={"¿Deseas asignar el tarjetahabiente?"}
                    closeModal={handleCloseConfirmacion}
                />
            )}

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" mb={3}>
                        <Grid item>
                            <Tooltip placement="top" title="Regresar">
                                <IconButton onClick={closeModal} sx={{ background: '#ebebeb', mr: 2 }}>
                                    <ArrowBack />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item xs>
                            <MDTypography variant="h5">Registrar Tarjetahabiente</MDTypography>
                        </Grid>
                    </Grid>

                    <Card id="basic-info" sx={{ overflow: "visible" }}>
                        <Grid container p={3} spacing={3}>

                            <Grid item xs={6} sm={6} md={3}>
                                <FormField
                                    error={errorFlag.numTarjeta}
                                    helperText={errorFlag.numTarjetaMsg}
                                    name="CardNumber"
                                    label="Número de Tarjeta"
                                    fullWidth
                                    value={CardNumber}
                                    onChange={handleChangeNumber}
                                    required
                                    inputProps={{ maxLength: 16 }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6} md={3}>
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

                            <Grid item md={6} sx={{ display: { xs: 'none', md: 'block' } }}></Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <FormField
                                    error={errorFlag.nombre}
                                    helperText={errorFlag.nombreMsg}
                                    name="Nombre"
                                    label="Nombre"
                                    fullWidth
                                    value={Nombre}
                                    onChange={handleChangeAlphanumericSpace}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormField
                                    name="SegundoNombre"
                                    label="Segundo Nombre"
                                    fullWidth
                                    value={SegundoNombre}
                                    onChange={handleChangeAlphanumericSpace}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormField
                                    error={errorFlag.aPaterno}
                                    helperText={errorFlag.aPaternoMsg}
                                    name="ApellidoPaterno"
                                    label="Apellido Paterno"
                                    fullWidth
                                    value={ApellidoPaterno}
                                    onChange={handleChangeAlphanumericSpace}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormField
                                    error={errorFlag.aMaterno}
                                    helperText={errorFlag.aMaternoMsg}
                                    name="ApellidoMaterno"
                                    label="Apellido Materno"
                                    fullWidth
                                    value={ApellidoMaterno}
                                    onChange={handleChangeAlphanumericSpace}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Component_GenderType
                                    genderType={genderType}
                                    error={errorFlag.genero}
                                    helperText={errorFlag.generoMsg}
                                    value={defaultGenero}
                                    onChange={handleChangeSelect}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker
                                        label="Fecha Nacimiento"
                                        format="DD/MM/YYYY"
                                        value={dateBirth}
                                        onChange={handleDateBirthChange}
                                        slotProps={{ textField: { fullWidth: true, helperText: errorFlag.fechaNacimientoMsg } }}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={10} sm={5} md={2}>
                                <FormField
                                    error={errorFlag.rfc}
                                    helperText={errorFlag.rfcMsg}
                                    name="RFC"
                                    label="RFC"
                                    fullWidth
                                    value={formData.RFC}
                                    onChange={handleChangeAlphanumeric}
                                    required
                                    inputProps={{ maxLength: 13 }}
                                />
                            </Grid>
                            <Grid item xs={2} sm={1} md={1} display="flex" alignItems="center">
                                <Tooltip title="Calcular RFC">
                                    <IconButton onClick={() => getRFC()} sx={{ mt: 1 }}>
                                        <TbCalculator size={25} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <FormField
                                    error={errorFlag.curp}
                                    helperText={errorFlag.curpMsg}
                                    name="Curp"
                                    label="CURP"
                                    fullWidth
                                    value={Curp}
                                    onChange={handleChangeAlphanumeric}
                                    required
                                    inputProps={{ maxLength: 18 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Component_IdentificationDic
                                    error={errorFlag.tipoIdent}
                                    helperText={errorFlag.tipoIdentMsg}
                                    value={defaultTipoIdent}
                                    onChange={handleChangeSelect}
                                    identificationType={identificationType}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormField
                                    error={errorFlag.noIdent}
                                    helperText={errorFlag.noIdentMsg}
                                    name="NoIdentificacion"
                                    label="No Identificación"
                                    fullWidth
                                    value={NoIdentificacion}
                                    onChange={handleChangeNumber}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormField
                                    error={errorFlag.email}
                                    helperText={errorFlag.emailMsg}
                                    name="Email"
                                    label="Correo"
                                    fullWidth
                                    value={Email}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormField
                                    error={errorFlag.tel}
                                    helperText={errorFlag.telMsg}
                                    name="Telefono"
                                    label="Teléfono"
                                    fullWidth
                                    value={Telefono}
                                    onChange={handleChangeNumber}
                                    required
                                    inputProps={{ maxLength: 10 }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <MDTypography variant="h6">Dirección</MDTypography>
                            </Grid>

                            <Grid item xs={12} sm={4} md={3}>
                                <Component_StateDic
                                    stateList={stateList}
                                    value={stateDic}
                                    error={errorFlag.estado}
                                    helperText={errorFlag.estadoMsg}
                                    onChange={handleChangeSelect}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} md={3}>
                                <Autocomplete
                                    value={cityDic}
                                    id="ddlCity"
                                    options={cityList}
                                    onChange={handleChangeSelect}
                                    renderInput={(params) => (
                                        <FormField {...params} required error={errorFlag.municipio} helperText={errorFlag.municipioMsg} label="Municipio" />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} md={3}>
                                <Autocomplete
                                    value={defaultIdCP}
                                    id="IdCP"
                                    options={colonyList}
                                    onChange={handleChangeSelect}
                                    renderInput={(params) => (
                                        <FormField {...params} required error={errorFlag.colonia} helperText={errorFlag.coloniaMsg} label="Colonia" />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormField
                                    error={errorFlag.direccion}
                                    helperText={errorFlag.direccionMsg}
                                    name="Direccion"
                                    label="Calle"
                                    fullWidth
                                    value={Direccion}
                                    onChange={handleChangeAlphanumericSpace}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6} sm={3} md={3}>
                                <FormField
                                    error={errorFlag.exterior}
                                    helperText={errorFlag.exteriorMsg}
                                    name="Exterior"
                                    label="Exterior"
                                    fullWidth
                                    value={Exterior}
                                    onChange={handleChangeNumber}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6} sm={3} md={3}>
                                <FormField
                                    name="Interior"
                                    label="Interior"
                                    fullWidth
                                    value={Interior}
                                    onChange={handleChangeNumber}
                                />
                            </Grid>
                        </Grid>

                        <Grid container justifyContent="flex-end" p={3}>
                            <Grid item xs={12} sm="auto">
                                <MDButton
                                    type="button"
                                    variant="gradient"
                                    color="info"
                                    fullWidth
                                    onClick={confirmar}
                                    sx={{ px: 4 }}
                                >
                                    <Save sx={{ mr: 1 }} /> Guardar
                                </MDButton>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}