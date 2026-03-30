import React from 'react';
import MDButton from 'components/MDButton';
import { CheckCircle } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

/*Componente para mostrar el modal de confirmación*/
export const ModalInfoAceptarBig = ({ showModal, message, closeModal }) => {

  return (
    <>
      <Dialog open={showModal} onClose={closeModal}>
        <DialogContent sx={{ width: "350px", height: "130px" }}>
          <DialogTitle style={{ textAlign: "center" }}>
            <label>{message}</label>
          </DialogTitle>
        </DialogContent>
        <DialogActions>
          <MDButton name="yesBtn" variant="gradient" color="info" size="small" onClick={closeModal}
            startIcon={
              <CheckCircle
                sx={{
                  width: 20,
                  height: 20,
                  color: "white !important",
                  pointerEvents: "none",   // 👈 clave para que el botón reciba el click
                }}
              />
            }
            sx={{
              "&:hover": {
                boxShadow: "none", // elimina el sombreado al hacer hover
              },
            }}>
            Aceptar
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};