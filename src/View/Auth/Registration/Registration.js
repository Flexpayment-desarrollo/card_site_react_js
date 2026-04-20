// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { grey } from "@mui/material/colors";
import { IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";

import dayjs from "dayjs";
import validator from 'validator';
import Loading from "Global/Loading/Loading";
import LogoInovag from "View/LogoInovag";
import bgImage from "assets/images/illustrations/slide.jpg";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { useState } from "react";
import { TbCalculator } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { deleteStorage } from "Global/Expressions";
import { numericValid } from "Global/Expressions";
import { alphanumericSpaceValid } from "Global/Expressions";
import { alphanumericValid_ } from "Global/Expressions";
import { calcRFC } from "Services/Auth/Service_Register";
import { validateCode } from "Services/Auth/Service_Register";
import { ModalConfirmation } from "Global/ModalConfirmation";
import { emailValid } from "Global/Expressions";

const Data = {
    Nombre: "",
    SegundoNombre: "",
    FechaNacimiento: "",
    RFC: "",
    Telefono: "",
    Correo: "",
    ApellidoPaterno: "",
    ApellidoMaterno: "",
    Password: ""
}

export const Registration = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(Data);
    const [dateBirth, setDateBirth] = useState(dayjs(null));
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isAlertValide, setIsAlertValide] = useState(false);
    const [modalConfirmarGuardar, setModalConfirmarGuardar] = useState(false);
    const [message, setMessage] = useState({
        isShow: false
    });
    const [errorFlag, setErrorFlag] = useState({
        rfc: false,
        rfcMsg: '',
        aPaterno: false,
        aPaternoMsg: "",
        aMaterno: false,
        aMaternoMsg: "",
        nombre: false,
        nombreMsg: '',
        correo: false,
        correoMsg: '',
        telefono: false,
        telefonoMsg: '',
        password: false,
        passwordMsg: '',
    });

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
        if ((typeof (FechaNacimiento) === 'function' || !FechaNacimiento || FechaNacimiento === 'Invalid Date')) {
            errorTemp.fechaNacimiento = true
            errorTemp.fechaNacimientoMsg = "La fecha no es válida para calcular el RFC."
            valid = false
        }
        else {
            let anio = Number(FechaNacimiento.substring(0, 4));
            let mes = Number(FechaNacimiento.substring(5, 7));
            let dia = Number(FechaNacimiento.substring(8));

            let hoy = new Date();
            let edad = hoy.getFullYear() - anio;

            // Ajustar si aún no ha cumplido años este año
            let mesActual = hoy.getMonth() + 1; // Sumamos 1 para que sea 1-12
            let diaActual = hoy.getDate();

            if (mesActual < mes || (mesActual === mes && diaActual < dia)) {
                edad--;
            }

            if (edad < 18) {
                errorTemp.fechaNacimiento = true;
                errorTemp.fechaNacimientoMsg = "La persona debe ser mayor a 18 años.";
                valid = false;
            }
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

    const sendSelection = async () => {
        let datos = {
            Correo: formData.Correo,
            Telefono: formData.Telefono
        }
        setLoading(true);
        setIsAlertValide(false);
        try {
            if (emailValid(datos.Correo.trim())) {
                await validateCode(datos).then((data) => {
                    setLoading(false);
                    if (data.code === 0) {
                        setMessage({
                            isShow: true,
                            text: 'El Mensaje ha sido enviado, se te direccionará a otra pantalla. Espere..',
                            type: 'success',
                        });
                        setIsAlertValide(true);
                        setTimeout(() => navigate('/validateCode', { state: { formData: formData } }), 2000);
                    }
                    else {
                        setMessage({
                            isShow: true,
                            text: data.businessMeaning || "Ocurrió un error inesperado",
                            type: 'danger',
                        });
                        setIsAlertValide(true);
                    }

                }).catch((error) => {
                    setLoading(false);
                    setMessage({
                        isShow: true,
                        text: error.data.businessMeaning,
                        type: 'error',
                    });
                    setIsAlertValide(true);

                });
            }
        } catch (error) {
            setLoading(false);
            setMessage({
                isShow: true,
                text: error.name + ' ' + error.message,
                type: 'danger',
            });
            setIsAlertValide(true);
        }
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
    const handleCloseConfirmarGuardar = (e) => {
        if (e.target.name === "yesBtn") {
            setModalConfirmarGuardar(false);
            sendSelection();
        } else {
            if (e.target.name === "noBtn") {
                setModalConfirmarGuardar(false);
            }
        }
    };

    /*Método para validar que no haya errores en el formulario y si todo esta bien abrir el modal de confirmación*/
    const confirmar = (e) => {
        e.preventDefault();
        let validation = validateForm();
        if (validation) {
            setModalConfirmarGuardar(true);
        }
    };

    /*Método que valida el formulario*/
    const validateForm = () => {
        let valid = true;

        let errorTemp = {
            rfc: false,
            rfcMsg: '',
            nombre: false,
            nombreMsg: '',
            segundoNombre: false,
            segundoNombreMsg: '',
            aPaterno: false,
            aPaternoMsg: "",
            aMaterno: false,
            aMaternoMsg: "",
            telefono: false,
            telefonoMsg: '',
            correo: false,
            correoMsg: '',
            fechaNacimiento: false,
            fechaNacimientoMsg: ''
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
        if ((typeof (FechaNacimiento) === 'function' || !FechaNacimiento || FechaNacimiento === 'Invalid Date')) {
            errorTemp.fechaNacimiento = true;
            errorTemp.fechaNacimientoMsg = "Debes seleccionar una fecha de nacimiento"
            valid = false;
        }
        else {
            let anio = Number(FechaNacimiento.substring(0, 4));
            let mes = Number(FechaNacimiento.substring(5, 7));
            let dia = Number(FechaNacimiento.substring(8));

            let hoy = new Date();
            let edad = hoy.getFullYear() - anio;

            // Ajustar si aún no ha cumplido años este año
            let mesActual = hoy.getMonth() + 1; // Sumamos 1 para que sea 1-12
            let diaActual = hoy.getDate();

            if (mesActual < mes || (mesActual === mes && diaActual < dia)) {
                edad--;
            }

            if (edad < 18) {
                errorTemp.fechaNacimiento = true;
                errorTemp.fechaNacimientoMsg = "La persona debe ser mayor a 18 años.";
                valid = false;
            }
        }
        if ((typeof (RFC) === "function" || RFC === "")) {
            errorTemp.rfc = true;
            errorTemp.rfcMsg = "El RFC no puede estar vacío";
            valid = false;
        }
        else {
            if (RFC.length !== 13) {
                errorTemp.rfc = true;
                errorTemp.rfcMsg = "La longitud debe ser de 13 caracteres"
                valid = false;
            }
        }

        if (typeof (Telefono) === 'function' || Telefono === 0 || Telefono.length !== 10) {
            errorTemp.tel = true;
            errorTemp.telMsg = "La longitud debe ser de 10 caracteres"
            valid = false;
        }
        if (typeof (Correo) === 'function' || Correo === "") {
            errorTemp.correo = true;
            errorTemp.correoMsg = "Correo no válido"
            valid = false;
        }
        if (Password === "") {
            errorTemp.password = true;
            errorTemp.passwordMsg = "La contraseña no puede estar vacía";
            valid = false;
        } else if (!validator.isStrongPassword(Password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
            errorTemp.password = true;
            errorTemp.passwordMsg = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.";
            valid = false;
        } else if (Password !== confirmPassword) {
            errorTemp.password = true;
            errorTemp.passwordMsg = "Las contraseñas no coinciden";
            valid = false;
        }
        setErrorFlag(errorTemp)
        return valid
    }

    const toBack = () => {
        navigate('/SignIn');
    }

    /** Metodo que limpia los mensajes */
    const clearMessage = () => {
        setIsAlertValide(false);
        setMessage({
            isShow: false,
            text: "",
            type: "info"
        });
    };

    const {
        Telefono,
        Correo,
        ApellidoPaterno,
        ApellidoMaterno,
        Nombre,
        SegundoNombre,
        FechaNacimiento,
        RFC,
        Password
    } = formData;


    return (
        <>
            {loading && <Loading show={loading} />}
            {/* {message.isShow && ( <Alert alert={message.type} message={message.text} onClose={clearMessage} open={message.isShow} />)} */}
            {modalConfirmarGuardar && <ModalConfirmation showModal={modalConfirmarGuardar} message="¿Estás seguro de crear el usuario?" closeModal={handleCloseConfirmarGuardar}></ModalConfirmation>}
            <BasicLayout illustration={bgImage}>
                <MDBox
                    px={isMobile ? 1 : 2} // Padding lateral 
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    py={isMobile ? 2 : 5}
                >
                    <Card sx={{
                        // 'max-content' hace que la card solo sea tan ancha como el logo
                        width: isMobile ? "100%" : "max-content",
                        minWidth: isMobile ? "100%" : "400px",
                        maxWidth: isMobile ? "100%" : "900px",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "1rem",
                        textAlign: "center"
                    }}>

                        {/* Logo Centrado */}
                        <MDBox sx={{ textAlign: "center", mt: 3, mb: 1 }}>
                            <MDBox sx={{ width: isMobile ? "60%" : "100%", margin: "auto" }}>
                                <LogoInovag />
                            </MDBox>
                        </MDBox>


                        {/* Cabecera con Flecha y Título */}
                        <MDBox p={3} display="flex" alignItems="center">
                            <Tooltip placement="top" title="Regresar">
                                <IconButton
                                    onClick={toBack}
                                    size="medium"
                                    sx={{
                                        background: grey[100],
                                        color: grey[700],
                                        '&:hover': { background: grey[200] }
                                    }}
                                >
                                    <ArrowBack />
                                </IconButton>
                            </Tooltip>
                            <MDBox ml={2}>
                                <MDTypography
                                    variant={isMobile ? "h6" : "h5"}
                                    fontWeight="bold"
                                    sx={{ color: grey[800] }}
                                >
                                    Registrarse
                                </MDTypography>
                            </MDBox>
                        </MDBox>

                        {/* Formulario con Grid Ajustado */}
                        <MDBox component="form" pb={4} px={isMobile ? 2 : 4}>
                            <Grid container spacing={isMobile ? 2 : 3}>
                                {/* Nombres: 1 columna en móvil, 2 en PC */}
                                <Grid item xs={12} sm={6}>
                                    <MDInput
                                        autoFocus
                                        inputProps={{ maxLength: 25 }}
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
                                <Grid item xs={12} sm={6}>
                                    <MDInput
                                        inputProps={{ maxLength: 25 }}
                                        name="SegundoNombre"
                                        label="Segundo Nombre"
                                        fullWidth
                                        value={SegundoNombre}
                                        onChange={handleChangeAlphanumericSpace}
                                    />
                                </Grid>

                                {/* Apellidos: 1 columna en móvil, 2 en PC */}
                                <Grid item xs={12} sm={6}>
                                    <MDInput
                                        inputProps={{ maxLength: 25 }}
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
                                <Grid item xs={12} sm={6}>
                                    <MDInput
                                        inputProps={{ maxLength: 25 }}
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

                                <Grid item xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DesktopDatePicker
                                            name="FechaNacimiento"
                                            label="Fecha Nacimiento"
                                            format="DD/MM/YYYY"
                                            value={dateBirth}
                                            onChange={handleDateBirthChange}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    helperText: errorFlag.fechaNacimientoMsg,
                                                    error: errorFlag.fechaNacimiento
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={isMobile ? 10 : 11}>
                                    <MDInput
                                        error={errorFlag.rfc}
                                        helperText={errorFlag.rfcMsg}
                                        name="RFC"
                                        label="RFC"
                                        fullWidth
                                        value={RFC}
                                        onChange={handleChangeAlphanumeric}
                                        required
                                        inputProps={{ maxLength: 13 }}
                                    />
                                </Grid>
                                <Grid item xs={isMobile ? 2 : 1} display="flex" alignItems="center" justifyContent="center">
                                    <Tooltip placement="top" title="Calcular RFC">
                                        <IconButton
                                            onClick={() => getRFC()}
                                            sx={{ backgroundColor: grey[100], '&:hover': { backgroundColor: grey[200] } }}
                                        >
                                            <TbCalculator size={24} />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>

                                <Grid item xs={12}>
                                    <MDInput
                                        error={errorFlag.correo}
                                        helperText={errorFlag.correoMsg}
                                        name="Correo"
                                        type="email"
                                        label="Correo"
                                        fullWidth
                                        value={Correo}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <MDInput
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

                                <Grid item xs={12} sm={6}>
                                    <MDInput
                                        error={errorFlag.password}
                                        helperText={errorFlag.passwordMsg}
                                        type="password"
                                        name="Password"
                                        label="Contraseña"
                                        fullWidth
                                        value={Password}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <MDInput
                                        error={errorFlag.password}
                                        helperText={errorFlag.passwordMsg}
                                        type="password"
                                        name="confirmPassword"
                                        label="Confirmar Contraseña"
                                        fullWidth
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                    />
                                </Grid>
                            </Grid>

                            {isAlertValide && message.isShow && (
                                <MDBox px={isMobile ? 3 : 1} mt={2}>
                                    <MDAlert
                                        color={message.type === "error" ? "danger" : message.type}
                                        dismissible
                                        onClose={clearMessage}
                                    >
                                        <MDTypography variant="body" color="white">
                                            {message.text}
                                        </MDTypography>
                                    </MDAlert>
                                </MDBox>
                            )}

                            <MDBox mt={4} display="flex" justifyContent={isMobile ? "center" : "flex-end"}>
                                <MDButton
                                    variant="gradient"
                                    sx={{
                                        backgroundColor: "#ff5f00 !important",
                                        height: "50px", // Botón más alto y fácil de presionar
                                        minWidth: isMobile ? "100%" : "200px", // Ancho completo en móvil
                                        borderRadius: "10px"
                                    }}
                                    onClick={confirmar}>
                                    <MDTypography variant="h7" color="white" fontWeight="bold">
                                        REGISTRARME
                                    </MDTypography>
                                </MDButton>
                            </MDBox>
                        </MDBox>
                    </Card>
                </MDBox>
            </BasicLayout>
        </>
    );
}