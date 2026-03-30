import React from "react";
import MDButton from "components/MDButton";
import { Container, Modal } from "react-bootstrap";

const ModalConfirmation = ({ show, onHide, closedModal, message, action }) => {

   return (
      <Modal centered={true} size="md" show={show} onHide={onHide} backdrop="static" keyboard="false">
         <Modal.Body>
            <Container>
               <label className="h3">{message}</label>
            </Container>
         </Modal.Body>
         <Modal.Footer>
            <MDButton variant="outline-success" onClick={() => action()}>Si, continuar</MDButton>
            <MDButton variant="outline-danger" onClick={() => closedModal()}>No, cancelar</MDButton>
         </Modal.Footer>
      </Modal>
   )
}

export default ModalConfirmation;