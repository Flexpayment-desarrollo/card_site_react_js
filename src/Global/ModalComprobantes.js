import React from 'react';
import MDButton from 'components/MDButton';
import { TbAddressBook } from 'react-icons/tb';
import { MdLibraryBooks } from 'react-icons/md';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';

/*Componente para mostrar el modal de confirmación*/
export const ModalComprobantes = ({ showModal, message, closeModal }) => {

  return (
    <>
      <Dialog open={showModal} onClose={closeModal}>
        <DialogContent>
          <DialogTitle>
            <label>{message} </label>
          </DialogTitle>
        </DialogContent>
        <DialogActions>
          {/* <MDButton name="individual" variant="gradient" color="info" size="small" onClick={closeModal}>Individual</MDButton> */}
          <Tooltip placement="top" title="Se descargará un archivo por cada transferencia seleccionada">
            <Button name="individual" onClick={closeModal}><TbAddressBook size={50} />Individual</Button>
          </Tooltip>
          {/* <MDButton name="grupal" variant="gradient" color="info" size="small" onClick={closeModal}>Grupal</MDButton> */}
          <Tooltip placement="top" title="Se descargará un archivo con todas las transferencias seleccionadas">
            <Button name="grupal" onClick={closeModal}><MdLibraryBooks size={50} />Grupal</Button>
          </Tooltip>
          <MDButton name="cancelar" variant="contained" color="light" size="small" onClick={closeModal}>Cancelar</MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};