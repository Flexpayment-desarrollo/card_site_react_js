import React from 'react';
import MDButton from 'components/MDButton';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

/*Componente para mostrar el modal de confirmación*/
export const ModalInfoAceptar = ({ showModal, message, closeModal }) => {

  return (
    <>
      <Dialog open={showModal} onClose={closeModal}>
        <DialogContent sx={{ width: "350px", height: "100px" }}>
          <DialogTitle>
            <label>{message}</label>
          </DialogTitle>
        </DialogContent>
        <DialogActions>
          <MDButton name="yesBtn" variant="gradient" color="info" size="small" onClick={closeModal}
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
            &nbsp;Aceptar
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};