import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MasterCard from "examples/Cards/MasterCard";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import ModalConfirmation from "Global/ModalCo";
import Loading from "Global/Loading";
import Alert from "Global/Alert";
import { useNavigate } from "react-router-dom";
import { useMaterialUIController } from "context";
import { RiShareForwardFill } from "react-icons/ri";
import { AiOutlineFall } from "react-icons/ai";
import { Cancel, Refresh, Send } from "@mui/icons-material";
import { dateFormatPrecisa } from "Global/Expressions";
import { Card, Grid, IconButton, Switch, Tooltip } from "@mui/material";

const columnsMovimientos = [
    { Header: "fecha", accessor: "date", width: "10%" },
    { Header: "tipo", accessor: "type", width: "10%" },
    { Header: "descripción", accessor: "description", width: "10%" },
    { Header: "monto", accessor: "total", width: "10%" },
];

const datosMovimientos = {
    columns: columnsMovimientos,
    rows: [{}],
};

export const Component_CardDetail = ({ detail, closeModal }) => {
    const navigate = useNavigate();
    const cliente = JSON.parse(sessionStorage.getItem("Client"));
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [loading, setLoading] = useState(false);
    const [listMovimientos, setListMovimientos] = useState(datosMovimientos);
    const [modalConfirmarDispersion, setModalConfirmarDispersion] = useState(false);
    const [modalConfirmacionBloquear, setModalConfirmacionBloquear] = useState(false);
    const [modalConfirmacionDecrementar, setModalConfirmacionDecrementar] = useState(false);
    const [modalConfirmacionReenviar, setModalConfirmacionReenviar] = useState(false);
    const [cuentaSaldo, setCuentaSaldo] = useState({
        balance: 0
    });
    const [tarjeta, setTarjeta] = useState({
        available: 0,
        numeroEnmascarado: "0000000000000000",
        nombre: "",
        segundoNombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        fechaNacimiento: new Date()
    });
    const [datos, setDatos] = useState({
        available: 0,
        status: "",
    });
    const [message, setMessage] = useState({
        isShow: false,
    });

    useEffect(() => {

    }, []);

    /*Método para abrir el modal de bloquear o desbloquear*/
    const openConfirmarDispersion = (e) => {
        e.preventDefault();
        setModalConfirmarDispersion(true);
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
            //putActualizarEstatusCardHolder();
        } else {
            if (e.target.name === "noBtn") {
                setModalConfirmacionBloquear(false);
            }
        }
    };

    /*Método para abrir el modal de bloquear o desbloquear*/
    const decrementar = (e) => {
        e.preventDefault();
        setModalConfirmacionDecrementar(true);
    };


    /*Método para abrir el modal de bloquear o desbloquear*/
    const reenviar = (e) => {
        e.preventDefault();
        setModalConfirmacionReenviar(true);
    };

    /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
    const handleCloseReenviar = (e) => {
        if (e.target.name === "yesBtn") {
            setModalConfirmacionReenviar(false);
            //putActualizarEstatusCardHolder();
        } else {
            if (e.target.name === "noBtn") {
                setModalConfirmacionReenviar(false);
            }
        }
    };

    /*Método para validar que no haya errores en el formulario y si todo esta bien abrir el modal de confirmación*/
    const confirmar = (e) => {
        e.preventDefault();
        // getMovimientosCarholder();
    }

    const refrescar = async () => {
        //await fetchDetalle();
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
                ></ModalConfirmation>
            )}
            {modalConfirmacionReenviar && (
                <ModalConfirmation
                    showModal={modalConfirmacionReenviar}
                    tipoModal={false}
                    message={"¿Estás seguro de reenviar el NIP?"}
                    closeModal={handleCloseReenviar}
                ></ModalConfirmation>
            )}
            <MDBox>
                <Grid container mt={1} mb={3}>
                    <Grid item xs={12}>
                        <Card id="basic-info" sx={{ overflow: "visible" }}>
                            <Grid container p={2} spacing={1}>
                                <Grid item xs={6} sm={6} mt={1} sx={{ textAlign: "left" }}>
                                    <MDTypography variant="h4">
                                        Saldo:{" "}
                                        {/* {"$ " +
                                            cuentaSaldo.balance.toLocaleString("es-MX", {
                                                maximumFractionDigits: 2,
                                                minimumFractionDigits: 2,
                                            }) +
                                            " MXN"} */}
                                    </MDTypography>
                                </Grid>
                                <Grid item xs={6} sm={6} mt={1} textAlign="right">
                                    <MDButton
                                        type="button"
                                        size="small"
                                        variant="gradient"
                                        style={{ backgroundColor: "#ff5f00" }}
                                        onClick={closeModal}>
                                        <Cancel
                                            sx={{
                                                width: "20px",
                                                height: "20px",
                                                color: "white !important"
                                            }} />
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
                                    <Grid item xs={12} display="flex" justifyContent="right">
                                        <Tooltip placement="top" title="Refrescar Saldo">
                                            {/* <IconButton onClick={refrescar}>
                                                <Refresh />
                                            </IconButton> */}
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} display="flex" justifyContent="center" mb={2} mt={-2}>
                                        <MDBox sx={{ width: "400px", height: "200px" }}>
                                            <MasterCard
                                                number={"9999999999999999"}
                                                holder={"Diana"}
                                                expires={"23-04-2030"} />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} style={{ textAlign: "center" }} mt={2}>
                                        <MDTypography variant="h2" color="#000000" fontWeight="bold" textTransform="capitalize">
                                            {/* <strong> {"Saldo: $ " + datos.available.toLocaleString("es-MX", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</strong> */}
                                        </MDTypography>
                                    </Grid>
                                    <Grid container spacing={2} p={3}>
                                        <Grid item xs={6} style={{ textAlign: "right" }}>
                                            <MDTypography variant="caption" fontSize="16px" fontWeight="regular" color="text">
                                                Estatus:
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={6} pl={1} style={{ textAlign: "left" }}>
                                            <Switch
                                                // onChange={bloquearODesbloquear}
                                                // checked={datos.status === "ACTIVE" ? true : false}
                                                sx={{
                                                    "& .MuiSwitch-switchBase": {
                                                        "&.Mui-checked": {
                                                            "+ .MuiSwitch-track": {
                                                                backgroundColor: "#ff5f00",
                                                            },
                                                            ".MuiSwitch-thumb": {
                                                                backgroundColor: "#4caf4f",
                                                            },
                                                            "+ .MuiSwitch-track": {
                                                                backgroundColor: "#dacece !important",
                                                                border: "#ced4da",
                                                            },
                                                        },
                                                    },
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} sm={12} p={3}>
                                    <Grid container spacing={2}>

                                        <Grid item xs={12} sm={12} style={{ textAlign: "right" }}>
                                            <MDButton type="button" variant="gradient" color="error" size="small"
                                                //onClick={decrementar}
                                                startIcon={
                                                    <AiOutlineFall size={20} color="#ffffffff" />
                                                }>
                                                DECREMENTAR
                                            </MDButton>
                                            <MDButton type="button" variant="gradient" size="small" color="info"
                                                style={{ marginLeft: "10px", marginRight: "10px" }}
                                                //onClick={openConfirmarDispersion}
                                                startIcon={
                                                    <Send
                                                        sx={{
                                                            width: 20,
                                                            height: 20,
                                                            color: "white !important",
                                                            pointerEvents: "none",   // 👈 clave para que el botón reciba el click
                                                        }}
                                                    />
                                                }>
                                                TRANSFERIR
                                            </MDButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Card>
                        </MDBox>
                    </Grid>
                </Grid>

                <Grid container spacing={3} mt={1}>
                    <Grid item xs={12}>
                        <Card id="basic-info" sx={{ overflow: "visible" }}>
                            <Grid container p={2} spacing={2}>
                                <Grid item mt={2}>
                                    <MDTypography variant="h5" style={{ color: "#34476" }}>
                                        Movimientos
                                    </MDTypography>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card id="basic-info" sx={{ overflow: "visible" }}>
                            <Grid container p={3}>
                                <Grid item xs={12} sm={12}>
                                    <DataTable entriesPerPage={{ defaultValue: 10 }} canSearch table={listMovimientos} />
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </>
    );
}
