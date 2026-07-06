import MDAlert from "components/MDAlert";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Loading from "Global/Loading/Loading";
import FormField from "layouts/applications/wizard/components/FormField";
import { Grid } from "@mui/material";
import { Error, Send } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { disperseWallet } from "Services/Card/Service_Wallet";
import { deleteStorage } from "Global/Expressions";
import { useNavigate } from "react-router-dom";
import { numericValid } from "Global/Expressions";
import { ModalNIP } from "./ModalNIP";

const Data = {
    Id: 0,
    Latitud: 0,
    Longitud: 0,
    Amount: "",
    NIP: "",
};

export const Component_DisperseWallet = ({ isWallet, id }) => {
    const navigate = useNavigate();
    let pin = "000000";
    const Ubicacion = JSON.parse(sessionStorage.getItem("ubicacion"));
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(Data);
    const [isAlertValide, setIsAlertValide] = useState(false);
    const [modalConfirmacionGuardar, setModalConfirmacionGuardar] =
        useState(false);
    const [message, setMessage] = useState({
        isShow: false,
    });
    const [errorFlag, setErrorFlag] = useState({
        monto: false,
        montoMsg: "",
    });

    useEffect(() => {
        setFormData(Data);
        setErrorFlag({
            monto: false,
            montoMsg: "",
        });
    }, [isWallet, id]);

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

    //Método para hacer una dispersión a monedero
    const dispersarMonedero = async (e) => {
        formData.Id = id;
        formData.Longitud = Ubicacion.Longitud;
        formData.Latitud = Ubicacion.Latitud;
        formData.Dispersion = isWallet;
        formData.NIP = pin;
        setLoading(true);
        await disperseWallet(formData)
            .then((data) => {
                if (data.code === 0) {
                    setLoading(false);
                    setMessage({ isShow: false });
                    setMessage({
                        isShow: true,
                        text: "Dispersión creada correctamente",
                        type: "success",
                    });
                    setIsAlertValide(true);
                    navigate("/Card", { state: { info: id } })
                    //refresh();
                } else {
                    setLoading(false);
                    // setMessage({
                    //     isShow: true,
                    //     text: data.businessMeaning,
                    //     type: "danger",
                    // });                   
                    setMessage({ isShow: false });
                    setTimeout(() => {
                        setMessage({
                            isShow: true,
                            text: data.businessMeaning,
                            type: "error"
                        });
                        setIsAlertValide(true);
                    }, 50)
                }
            })
            .catch((error) => {
                setLoading(false);
                if (error.response.status === 401) {
                    if (error.response.data.code === 2011) {
                        deleteStorage();
                        navigate("/SignIn");
                    } else {
                        setLoading(false);
                        setMessage({ isShow: false });
                        setTimeout(() => {
                            setMessage({
                                isShow: true,
                                text: error.message,
                                type: "error"
                            });
                            setIsAlertValide(true);
                        }, 50)
                        // setMessage({
                        //     text: error.message,
                        //     type: "danger",
                        //     isShow: true,
                        // });
                    }
                }
            });
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
                setFormData({
                    ...formData,
                    Amount: value,
                });
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
                            setFormData({
                                ...formData,
                                Amount: value, //10.0 -> 10
                            });
                        } else {
                            setFormData({
                                ...formData,
                                Amount: value,
                            });
                        }
                    }
                } else {
                    if (value !== "" && !numericValid(value.substr(value.length - 1)))
                        //si no es número
                        return;
                    if (value !== "") {
                        setFormData({
                            ...formData,
                            Amount: parseFloat(value),
                        });
                    } else {
                        setFormData({
                            ...formData,
                            Amount: value,
                        });
                    }
                }
            }
        }
        setFormData(prev => ({ ...prev, Amount: value }));
    };

    /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
    const handleCloseConfirmacion = (e) => {
        if (typeof (e) === "string") {
            pin = e
            setModalConfirmacionGuardar(false);
            dispersarMonedero();
        } else {
            if (e.target.name === "noBtn") {
                setModalConfirmacionGuardar(false);
            }
        }
    }

    /*Método para validar que no haya errores en el formulario y si todo esta bien abrir el modal de confirmación*/
    const confirmar = (e) => {
        if (e != undefined && e != null)
            e.preventDefault();
        let validation = validateForm();
        if (validation) setModalConfirmacionGuardar(true);
    };

    /*Método que valida el formulario*/
    const validateForm = () => {
        let valid = true;
        let errorTemp = {
            monto: false,
            montoMsg: "",
        };

        if (formData.Amount === "" || isNaN(formData.Amount) || formData.Amount <= 0) {
            errorTemp.monto = true;
            errorTemp.montoMsg = "La cantidad debe ser mayor a 0";
            valid = false;
        }
        setErrorFlag(errorTemp);
        return valid;
    };

    /** Metodo que limpia los mensajes */
    const clearMessage = () => {
        setMessage({
            isShow: false,
        });
    };

    const {
        Amount,
    } = formData;

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
            {modalConfirmacionGuardar && <ModalNIP showModal={modalConfirmacionGuardar} message="¿Estás seguro de hacer la dispersión?" closeModal={handleCloseConfirmacion}></ModalNIP>}
            <Grid container spacing={2} pl={3} pb={3} pt={1} pr={3} >
                <Grid item xs={12} sm={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12}>
                            <FormField
                                error={errorFlag.monto}
                                helperText={errorFlag.montoMsg}
                                name="Amount"
                                label="Cantidad $ MXN"
                                value={Amount}
                                onChange={handleChangeNumericNoZeros}
                                inputProps={{ maxLength: 12, inputMode: "numeric" }}
                                autofocus={true}
                                required
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={12}>
                    <Grid
                        container
                        display="flex"
                        alignItems="flex-end"
                        style={{ textAlign: "right" }}>

                        <Grid item xs={12} sm={12}>

                            {isAlertValide && (
                                <MDBox mt={1}>
                                    <MDAlert
                                        color={
                                            message.type === "error"
                                                ? "error"
                                                : message.type
                                        }>
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
                            <MDButton
                                type="button"
                                variant="gradient"
                                style={{ backgroundColor: "#ff5f00" }}
                                size="small"
                                onClick={confirmar}>
                                <Send
                                    sx={{
                                        width: "20px",
                                        height: "20px",
                                        color: "white !important",
                                    }} />
                                &nbsp;
                                <MDTypography variant="h7" color="white">
                                    Dispersar
                                </MDTypography>
                            </MDButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};