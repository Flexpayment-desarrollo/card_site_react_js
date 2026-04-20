import React, { useEffect, useState } from "react";
import Loading from "Global/Loading/Loading";
import dayjs from "dayjs";
import Alert from "Global/Alert";
import MDBox from "components/MDBox";
import MasterCard from "examples/Cards/MasterCard";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Component_ContadorNIP from "./Component_ContadorNIP";
import { grey } from "@mui/material/colors";
import { MdOutlinePassword } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEyeSlash, FaWallet } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Cancel, Send } from "@mui/icons-material";
import { ModalConfirmation } from "Global/ModalConfirmation";
import { View_Transferir } from "View/Card/View_Transferir";
import { Component_TableMovmentsCard } from "./Component_TableMovmentsCard";
import { deleteStorage } from "Global/Expressions";
import { getCardDetail } from "Services/Card/Service_Card";
import { cambiarEstatusCard } from "Services/Card/Service_Card";
import { watchNIP } from "Services/Card/Service_Card";
import { getMovements } from "Services/Card/Service_Card";
import { Component_CVVDinamico } from "./Component_CVVDinamico";
import { getCVVDinamico } from "Services/Card/Service_Card";
import { Card, Grid, IconButton, Switch, Tooltip, useMediaQuery, useTheme } from "@mui/material";

export const Component_CardDetail = ({ info, closeModal }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [loading, setLoading] = useState(false);
    const [listMovimientos, setListMovimientos] = useState([]);
    const [showDetail, setShowDetail] = useState(true);
    const [showTransferir, setShowTransferir] = useState(false);
    const [nip, setNip] = useState("000");
    const [showNip, setShowNip] = useState(false);
    const [CVV, setCVV] = useState("000");
    const [showCVV, setShowCVV] = useState(false);
    const [modalConfirmacionBloquear, setModalConfirmacionBloquear] = useState(false);
    const [dateStart, setDateStart] = useState(dayjs(new Date()));
    const [dateEnd, setDateEnd] = useState(dayjs(new Date()));
    const [dateStartString, setDateStartString] = useState(
        dayjs(new Date()).format("YYYY/MM/DD").replaceAll("/", "-")
    );
    const [dateEndString, setDateEndString] = useState(
        dayjs(new Date()).format("YYYY/MM/DD").replaceAll("/", "-")
    );
    const [datos, setDatos] = useState({
        numeroEnmascarado: "0000000000000000",
    });
    const [tarjeta, setTarjeta] = useState({
        available: 0,
        status: "",
    });
    const [message, setMessage] = useState({
        isShow: false,
    });


    useEffect(() => {
        const inicioMes = dayjs().startOf("month");
        const hoy = dayjs();

        const inicioStr = inicioMes.format("YYYY-MM-DD");
        const finStr = hoy.format("YYYY-MM-DD");

        setDateStartString(inicioStr);
        setDateEndString(finStr);

        DetalleTarjeta();
    }, []);


    const establecerRangoMes = (tipo) => {
        const hoy = dayjs();
        let inicio, fin;

        if (tipo === "actual") {
            inicio = hoy.startOf("month"); // Día 1 del mes actual
            fin = hoy;                     // Hoy
        } else {
            inicio = hoy.subtract(1, "month").startOf("month"); // Día 1 del mes anterior
            fin = hoy.subtract(1, "month").endOf("month");     // Último día del mes anterior
        }

        setDateStart(inicio);
        setDateEnd(fin);
        setDateStartString(inicio.format("YYYY-MM-DD"));
        setDateEndString(fin.format("YYYY-MM-DD"));

        getMovimientos(inicio.format("YYYY-MM-DD"), fin.format("YYYY-MM-DD"));
    };

    // Método que obtiene el detalle de una tarjeta
    const DetalleTarjeta = async () => {
        setLoading(true);
        const datos = {
            Id: info,
        };
        await getCardDetail(datos)
            .then((data) => {
                if (data.code === 0) {
                    setDatos(data.data);
                    setTarjeta(data.data.infoMetricas);
                    getMovimientos();
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

    //Método que cambia el estatus a bloquado o desbloqueado de la tarjeta
    async function putCambiarEstatus() {
        const sendData = {
            Id: info,
            Active: datos.status === "ACTIVE" ? false : true,
        };
        setLoading(true);
        try {
            const res = await cambiarEstatusCard(sendData);
            if (res.code === 0) {
                setMessage({
                    isShow: true,
                    text: datos.status === "ACTIVE" ? "Se bloqueó correctamente" : "Se desbloqueó correctamente",
                    type: "success",
                });
            } else {
                setLoading(false);
                setMessage({
                    isShow: true,
                    text: res.businessMeaning,
                    type: "danger",
                });
            }
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 401) {
                if (error.response.data.code === 2011) {
                    sessionStorage.setItem("newToken", "");
                    navigate("/SignIn");
                } else {
                    setMessage({
                        text: error.message,
                        type: "danger",
                        isShow: true,
                    });
                }
            } else {
                setMessage({
                    isShow: true,
                    text: error.name + " " + error.message,
                    type: "danger",
                });
            }
        } finally {
            setLoading(false);
        }
    }

    //Método que muestra el Nip
    async function verNip() {
        const sendData = {
            Id: info,
        };
        setLoading(true);
        try {
            const res = await watchNIP(sendData);
            if (res.code === 0) {
                setNip(res.businessMeaning);
            } else {
                setLoading(false);
                setMessage({
                    isShow: true,
                    text: res.businessMeaning,
                    type: "danger",
                });
            }
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 401) {
                if (error.response.data.code === 2011) {
                    sessionStorage.setItem("newToken", "");
                    navigate("/SignIn");
                } else {
                    setMessage({
                        text: error.message,
                        type: "danger",
                        isShow: true,
                    });
                }
            } else {
                setMessage({
                    isShow: true,
                    text: error.name + " " + error.message,
                    type: "danger",
                });
            }
        } finally {
            setLoading(false);
        }
    }

    //Método que obtiene el CVV dinámico
    const getCVV = async () => {
        const sendData = {
            Id: info,
        };
        setLoading(true);
        try {
            const res = await getCVVDinamico(sendData);
            if (res.code === 0) {
                setCVV(res.businessMeaning);
            } else {
                setLoading(false);
                setMessage({
                    isShow: true,
                    text: res.businessMeaning,
                    type: "danger",
                });
            }
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 401) {
                if (error.response.data.code === 2011) {
                    sessionStorage.setItem("newToken", "");
                    navigate("/SignIn");
                } else {
                    setMessage({
                        text: error.message,
                        type: "danger",
                        isShow: true,
                    });
                }
            } else {
                setMessage({
                    isShow: true,
                    text: error.name + " " + error.message,
                    type: "danger",
                });
            }
        } finally {
            setLoading(false);
        }
    }

    //Método que obtiene el CVV dinámico
    // const getCVV = async () => {
    //     const datos = {
    //         Id: info,
    //     };
    //     setLoading(true);
    //     await getCVVDinamico(datos)
    //         .then((data) => {
    //             if (data.code === 0) {
    //                 setCVV(data.businessMeaning);
    //                 setLoading(false);
    //             } else {
    //                 setLoading(false);
    //                 setMessage({
    //                     isShow: true,
    //                     text: data.businessMeaning,
    //                     type: "danger",
    //                 });
    //             }
    //         })
    //         .catch((error) => {
    //             setLoading(false);
    //             if (error.response.status === 401) {
    //                 if (error.response.data.code === 2011) {
    //                     deleteStorage();
    //                     navigate("/SignIn");
    //                 } else {
    //                     setMessage({
    //                         text: error.message,
    //                         type: "danger",
    //                         isShow: true,
    //                     });
    //                 }
    //             }
    //         });
    // };

    //Método que obtiene la lista de los movimientos del fondeo
    const getMovimientos = async (inicioStr, finStr) => {
        const datos = {
            Id: info,
            DateInit: inicioStr || dateStartString,
            DateEnd: finStr || dateEndString
        };
        setLoading(true);
        await getMovements(datos)
            .then((data) => {
                if (data.code === 0) {
                    if (data.data !== null) {
                        setListMovimientos(data.data);
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

    /*Método para abrir el modal de bloquear o desbloquear*/
    const bloquearODesbloquear = (e) => {
        e.preventDefault();
        setModalConfirmacionBloquear(true);
    };

    /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
    const handleCloseBloquearODesbloquear = (e) => {
        if (e.target.name === "yesBtn") {
            setModalConfirmacionBloquear(false);
            putCambiarEstatus();
        } else {
            if (e.target.name === "noBtn") {
                setModalConfirmacionBloquear(false);
            }
        }
    };

    const crearTransferencia = () => {
        setShowTransferir(true);
        setShowDetail(false);
    };

    const btnShowNip = () => {
        setShowNip(true);
        verNip();
    };

    const btnHideNip = () => {
        setShowNip(false);
    };

    const btnShowCVV = () => {
        setShowCVV(true);
        getCVV();
    };

    const btnHideCVV = () => {
        setShowCVV(false);
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
            {modalConfirmacionBloquear && (
                <ModalConfirmation
                    showModal={modalConfirmacionBloquear}
                    tipoModal={false}
                    message={
                        datos.status === "ACTIVE"
                            ? "¿Estás seguro de bloquear la tarjeta?"
                            : "¿Estás seguro de desbloquear la tarjeta?"
                    }
                    closeModal={handleCloseBloquearODesbloquear}
                />
            )}

            {showDetail ? (
                <MDBox>
                    {/* Botón Salir - Siempre visible arriba */}
                    <Grid container mt={1} mb={2}>
                        <Grid item xs={12} textAlign="right">
                            <MDButton
                                type="button"
                                size="small"
                                variant="gradient"
                                sx={{ backgroundColor: "#ff5f00 !important" }}
                                onClick={closeModal}
                            >
                                <Cancel sx={{ width: "20px", height: "20px", color: "white" }} />
                                &nbsp; SALIR
                            </MDButton>
                        </Grid>
                    </Grid>

                    {/* Contenedor Principal de la Tarjeta */}
                    <Grid container spacing={3} mb={3}>
                        <Grid item xs={12}>
                            <Card sx={{ p: isMobile ? 2 : 3 }}>
                                <Grid container spacing={2} justifyContent="center" alignItems="center">

                                    {/* Visualización de la Tarjeta Física */}
                                    <Grid item xs={12} display="flex" justifyContent="center" mb={2}>
                                        <MDBox sx={{
                                            width: isMobile ? "100%" : "400px",
                                            maxWidth: "400px",
                                            "& > div": { width: "100% !important" } // Ajuste para MasterCard
                                        }}>
                                            <MasterCard
                                                number={datos.numeroEnmascarado}
                                                holder={`${datos.nombre} ${datos.apellidoPaterno}`}
                                                expires={tarjeta.expirationDate}
                                            />
                                        </MDBox>
                                    </Grid>

                                    {/* Controles de la Tarjeta */}
                                    <Grid container item xs={12} spacing={2} justifyContent="space-around">
                                        {/* Estatus */}
                                        <Grid item xs={6} sm={3} textAlign="center">
                                            <MDTypography variant="caption" fontWeight="bold" color="text" display="block">
                                                ESTATUS
                                            </MDTypography>
                                            <Switch
                                                onChange={bloquearODesbloquear}
                                                checked={tarjeta.status === "ACTIVE"}
                                                sx={{
                                                    "& .MuiSwitch-switchBase.Mui-checked": {
                                                        color: "#ff5f00",
                                                        "& + .MuiSwitch-track": { backgroundColor: "#ff5f00" }
                                                    }
                                                }}
                                            />
                                        </Grid>

                                        {/* Saldo */}
                                        <Grid item xs={6} sm={3} textAlign="center">
                                            <MDTypography variant="caption" color="text" fontWeight="bold" display="block">
                                                DISPONIBLE
                                            </MDTypography>
                                            <MDTypography variant={isMobile ? "h6" : "h5"} color="dark" fontWeight="bold">
                                                ${tarjeta.available.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                            </MDTypography>
                                        </Grid>

                                        {/* NIP */}
                                        <Grid item xs={6} sm={3} textAlign="center">
                                            <MDTypography variant="caption" fontWeight="bold" color="text" display="block">
                                                NIP
                                            </MDTypography>
                                            <MDBox display="flex" alignItems="center" justifyContent="center">
                                                {showNip && <MDTypography variant="h6" color="info" sx={{ mr: 1 }}>{nip}</MDTypography>}
                                                <Tooltip title={showNip ? "Ocultar" : "Ver"}>
                                                    <IconButton
                                                        onClick={showNip ? btnHideNip : btnShowNip}
                                                        sx={{ background: grey[100], p: 1 }}
                                                    >
                                                        {showNip ? <FaEyeSlash size={16} /> : <MdOutlinePassword size={16} />}
                                                    </IconButton>
                                                </Tooltip>
                                            </MDBox>
                                            {showNip && (
                                                <MDBox mt={0.5}>
                                                    <Component_ContadorNIP segundosIniciales={120} alTerminar={btnHideNip} />
                                                </MDBox>
                                            )}
                                        </Grid>

                                        {/* CVV */}
                                        <Grid item xs={6} sm={3} textAlign="center">
                                            <MDTypography variant="caption" fontWeight="bold" color="text" display="block">
                                                CVV
                                            </MDTypography>
                                            <MDBox display="flex" alignItems="center" justifyContent="center">
                                                {showCVV && <MDTypography variant="h6" color="info" sx={{ mr: 1 }}>{CVV}</MDTypography>}
                                                <Tooltip title={showCVV ? "Ocultar" : "Ver"}>
                                                    <IconButton
                                                        onClick={showCVV ? btnHideCVV : btnShowCVV}
                                                        sx={{ background: grey[100], p: 1 }}
                                                    >
                                                        {showCVV ? <RiLockPasswordFill size={16} /> : <MdOutlinePassword size={16} />}
                                                    </IconButton>
                                                </Tooltip>
                                            </MDBox>
                                            {showCVV && (
                                                <MDBox mt={0.5}>
                                                    <Component_CVVDinamico info={info} segundosIniciales={120} alTerminar={btnHideCVV} />
                                                </MDBox>
                                            )}
                                        </Grid>
                                    </Grid>

                                    {/* Acciones (Botones de abajo) */}
                                    <Grid item xs={12} display="flex" justifyContent={isMobile ? "center" : "flex-end"} gap={2} mt={2}>
                                        <MDButton variant="gradient" color="error" size="small" startIcon={<FaWallet size={16} />}>
                                            Monedero
                                        </MDButton>
                                        <MDButton variant="gradient" color="info" size="small" onClick={crearTransferencia} startIcon={<Send />}>
                                            TRANSFERIR
                                        </MDButton>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Tabla de Movimientos */}
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card sx={{ p: 2 }}>
                                <MDBox display="flex" flexDirection={isMobile ? "column" : "row"} gap={2} mb={2}>
                                    <MDButton
                                        variant={dateStart.isSame(dayjs(), 'month') ? "gradient" : "outlined"}
                                        color="info"
                                        fullWidth={isMobile}
                                        onClick={() => establecerRangoMes("actual")}
                                    >
                                        Mes Actual
                                    </MDButton>
                                    <MDButton
                                        variant={!dateStart.isSame(dayjs(), 'month') ? "gradient" : "outlined"}
                                        color="info"
                                        fullWidth={isMobile}
                                        onClick={() => establecerRangoMes("anterior")}
                                    >
                                        Mes Anterior
                                    </MDButton>
                                </MDBox>
                                <Component_TableMovmentsCard listMovimientos={listMovimientos} />
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
            ) : null}

            {showTransferir && <View_Transferir closeModal={closeModal} />}
        </>
    );
}