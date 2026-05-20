import React from 'react';
import MDButton from 'components/MDButton';
import { Cancel, Send } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

/*Componente para mostrar el modal de confirmación*/
export const ModalEnviar = ({ showModal, message, closeModal }) => {

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
            <Send
              sx={{
                width: 20,
                height: 20,
                color: "white !important",
                pointerEvents: "none",   // 👈 clave para que el botón reciba el click
              }}
            />
            &nbsp;
            Enviar PIN
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
            CANCELAR
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};