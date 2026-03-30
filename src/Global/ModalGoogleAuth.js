import React, { useState } from 'react';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { GoogleAuth } from './GoogleAuth';
import { Cancel, CheckCircle } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

/*Componente para mostrar el modal de confirmación*/
export const ModalGoogleAuth = ({ showModal, message, closeModal, saldo }) => {
    const Authentication = JSON.parse(sessionStorage.getItem("Authentication"));
    const [pin, setPin] = useState("");
    const [pinValid, setPinValid] = useState(false);

    const handleKeyDetect = (value) => {
        setPin(value.Pin1 + value.Pin2 + value.Pin3 + value.Pin4 + value.Pin5 + value.Pin6)
        if (value.Pin1 !== "" && value.Pin2 !== "" && value.Pin3 !== "" && value.Pin4 !== "" && value.Pin5 !== "" && value.Pin6 !== "")
            setPinValid(true)
        else
            setPinValid(false)
    }

    return (
        <>
            <Dialog open={showModal} onClose={closeModal}>
                <DialogContent>
                    <DialogTitle>
                        <label>{message} </label>
                        {saldo !== undefined ?
                            <MDBox mt={2} textAlign="center">
                                <strong>Monto:</strong>
                                <MDTypography variant="caption" color="success" fontSize="18px" fontWeight="medium" textTransform="capitalize">
                                    <strong>{saldo !== undefined ? " $ " + Number(saldo.Saldo).toLocaleString("es-MX", {
                                        maximumFractionDigits: 2,
                                        minimumFractionDigits: 2,
                                    }) : ""}</strong>
                                </MDTypography>
                            </MDBox>
                            : <></>}
                    </DialogTitle>
                </DialogContent>
                {
                    ///Operador                       ///Multioperador  
                    Authentication.idPerfil !== 25 && Authentication.idPerfil !== 29 ?
                        <>
                            <GoogleAuth autofocus={true} login={false} keyDetect={handleKeyDetect}></GoogleAuth>
                        </>
                        : null
                }
                <DialogActions>
                    {
                        ///operador -25                      ///Multioperador-29
                        pinValid || (Authentication.idPerfil === 25 || Authentication.idPerfil === 29) ?
                            <MDButton name="yesBtn" variant="gradient" color="info" size="small" onClick={() => closeModal(pin)}
                                sx={{
                                    "&:hover": {
                                        boxShadow: "none", // elimina el sombreado al hacer hover
                                    },
                                }}>
                                <CheckCircle
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        color: "white !important",
                                        pointerEvents: "none",   // 👈 clave para que el botón reciba el click
                                    }}
                                />
                                &nbsp;
                                Continuar
                            </MDButton> :
                            null
                    }
                    <MDButton
                        name="noBtn"
                        variant="gradient"
                        color="secondary"
                        size="small"
                        onClick={closeModal}
                        sx={{
                            "&:hover": {
                                boxShadow: "none", // elimina el sombreado al hacer hover
                            },
                        }}
                    >
                        <Cancel
                            sx={{
                                width: 20,
                                height: 20,
                                color: "white !important",
                                pointerEvents: "none",   // 👈 clave para que el botón reciba el click
                            }}
                        />
                        &nbsp;
                        CANCELAR
                    </MDButton>
                </DialogActions>
            </Dialog>
        </>
    );
};