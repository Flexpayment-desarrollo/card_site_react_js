import React from 'react';
import MDButton from 'components/MDButton';
import { FcFeedback, FcPhoneAndroid } from 'react-icons/fc';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tooltip } from '@mui/material';
import SmsIcon from '@mui/icons-material/Sms';
import PermPhoneMsgIcon from '@mui/icons-material/PermPhoneMsg';

/*Componente para mostrar el modal de confirmación*/
export const ModalReenviarConfirmation = ({ showModal, closeModal, celular, correo }) => {

    const sendCorreo = () => {
        correo()
        closeModal()
    }

    const sendSMS = () => {
        celular()
        closeModal()
    }

    return (
        <>
            <Dialog open={showModal}>
                <DialogTitle>Por favor, seleciona el medio de envío</DialogTitle>
                <DialogContent>
                    <Grid container style={{ marginTop: "10px" }}>
                        <Grid item xs={3} display="flex" justifyContent="center" style={{ marginBottom: "-10px" }}>
                            <Tooltip placement="top" title="Llamada">
                                <div style={{ cursor: 'pointer' }} onClick={sendCorreo}><PermPhoneMsgIcon style={{
                                    width: "50",
                                    height: "50"
                                }} size={50} />
                                </div>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={3} display="flex" justifyContent="left" style={{ marginTop: "10px" }}>
                            <label>Llamada</label>
                        </Grid>
                        <Grid item xs={3} display="flex" justifyContent="center" style={{ marginBottom: "-10px" }}>
                            <Tooltip placement="top" title="Por Mensaje">
                                <div style={{ cursor: 'pointer' }} onClick={sendSMS}><SmsIcon style={{
                                    width: "50",
                                    height: "50"
                                }} size={50} />
                                </div>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={3} display="flex" justifyContent="left" style={{ marginTop: "10px" }}>
                            <label>SMS</label>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button name="noBtn" onClick={closeModal}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};