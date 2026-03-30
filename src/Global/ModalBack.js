import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const ModalBack = ({ show, onHide, message, closedModal }) => {
   const navigate = useNavigate();

   return (
      // <Modal centered={true} size="md" show={show} onHide={onHide} backdrop="static" keyboard="false">
      //    <Modal.Body>
      //       <Container>
      //             <label className="h3"><IoWarningOutline/>Perderá los datos registrados,</label>
      //             <label className="h3">¿Desea continuar?</label>
      //       </Container>
      //    </Modal.Body>
      //    <Modal.Footer>
      //       <Button variant="outline-success" onClick={()=> navigate("/Prospect")}>Si, continuar</Button>
      //       <Button variant="outline-danger" onClick={() => closedModal()}>No, cancelar</Button>
      //    </Modal.Footer>
      // </Modal>

      <Dialog open={show} onClose={closedModal}>
         <DialogContent>
            <DialogTitle>
               {
                  message === "¿Estás seguro de realizar la dispersión?" ? <label>¿Estás seguro de realizar la <b>dispersión</b>?</label> :
                     message === "¿Estás seguro de realizar el decremento?" ? <label>¿Estás seguro de realizar el <b>decremento</b>?</label> :
                        <label>{message} </label>
               }
            </DialogTitle>
         </DialogContent>
         <DialogActions>
            <Button name="yesBtn" onClick={()=> navigate("/Prospect")}>Sí, continuar</Button>
            <Button name="noBtn" onClick={closedModal}>No, cancelar</Button>
         </DialogActions>
      </Dialog>
   )
}

export default ModalBack;