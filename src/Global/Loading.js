import React from "react";
import loading from '../assets/images/cargandoFlex.png';
import "../Global/Loading.css";
import { Backdrop, Dialog } from "@mui/material";

const Loading = (props) => {
   return (
      <Dialog open={props.show}>
         <Backdrop open={props.show}>
            <div style={{ position: "absolute", top: "0", left: "0", right: "0", bottom: "0", margin: "auto", width: "400px", height: "350px" }}>
               <div className="container-loading">
                  <div className="loader">
                     <img src={loading} alt="loading" />
                  </div>
               </div>
            </div>
         </Backdrop>
      </Dialog>
   )
}

export default Loading;