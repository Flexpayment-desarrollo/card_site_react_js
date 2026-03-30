import React from 'react';
import MDButton from 'components/MDButton';
import { Cancel } from '@mui/icons-material';
import { TbAddressBook } from 'react-icons/tb';
import { RiBookReadLine } from 'react-icons/ri';
import { MdLibraryBooks } from 'react-icons/md';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';

/*Componente para mostrar el modal de confirmación*/
export const ModalComprobantesMasivo = ({ showModal, message, closeModal }) => {

  return (
    <>
      <Dialog open={showModal} onClose={closeModal}>
        <DialogContent>
          <DialogTitle>
            <label>{message} </label>
          </DialogTitle>
        </DialogContent>
        <DialogActions>
          <Tooltip placement="top" title="Se descargará un archivo por cada transferencia seleccionada">
            <Button name="individual" onClick={closeModal}><TbAddressBook size={50} />Individual</Button>
          </Tooltip>
          <Tooltip placement="top" title="Se descargará un archivo con todas las transferencias seleccionadas">
            <Button name="grupal" onClick={closeModal}><MdLibraryBooks size={50} />Grupal</Button>
          </Tooltip>
          <Tooltip placement="top" title="Se descargará un pdf con todas las transferencias en renglones">
            <Button name="agrupado" onClick={closeModal}><RiBookReadLine size={50} />Acumulado</Button>
          </Tooltip>
          <MDButton name="cancelar" variant="contained" color="secondary" size="small" onClick={closeModal}
            sx={{
              "&:hover": {
                boxShadow: "none", // elimina el sombreado al hacer hover
              },
            }}> <Cancel
              sx={{
                width: 20,
                height: 20,
                color: "white !important",
                pointerEvents: "none",   // 👈 clave para que el botón reciba el click
              }}
            />
            &nbsp;Cancelar</MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};