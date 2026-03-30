import React from 'react';
import MDButton from 'components/MDButton';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

/*Componente para mostrar el modal de confirmación*/
export const ModalCancelar = ({ showModal, message, closeModal }) => {

  return (
    <>
      <Dialog open={showModal} onClose={closeModal}>
        <DialogContent>
          <DialogTitle>
            <label>{message} </label>
          </DialogTitle>
        </DialogContent>
        <DialogActions>
          <MDButton name="yesBtn" variant="gradient" color="info" size="small" onClick={closeModal}>Sí, cancelar</MDButton>
          <MDButton name="noBtn" variant="gradient" color="light" size="small" onClick={closeModal}>No, continuar</MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};