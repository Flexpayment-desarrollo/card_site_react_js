import React from 'react';
import MDButton from 'components/MDButton';
import { Cancel, CheckCircle } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

/*Componente para mostrar el modal de confirmación*/
export const ModalConfirmationDoc = ({ showModal, message, closeModal }) => {

  return (
    <>
      <Dialog open={showModal} onClose={closeModal}>
        <DialogContent>
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
            &nbsp;Si, Subir documentos
          </MDButton>
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
            NO, TERMINAR
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};