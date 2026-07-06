import React, { useState } from 'react';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { GoogleNIP } from './GoogleNIP';
import { Cancel, CheckCircle } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

/*Componente para mostrar el modal de confirmación*/
export const ModalConfirmationNIP = ({ showModal, message, closeModal, saldo }) => {
    const [pin, setPin] = useState("");
    const [pinValid, setPinValid] = useState(false);

    const handleKeyDetect = (value) => {
        setPin(value.Pin1 + value.Pin2 + value.Pin3 + value.Pin4)
        if (value.Pin1 !== "" && value.Pin2 !== "" && value.Pin3 !== "" && value.Pin4 !== "")
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
                    </DialogTitle>
                </DialogContent>
                {

                    <GoogleNIP autofocus={true} login={false} keyDetect={handleKeyDetect}></GoogleNIP>
                }
                <DialogActions>
                    {
                        pinValid ?
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