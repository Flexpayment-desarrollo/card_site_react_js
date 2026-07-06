import "../../Global/Loading/Loading.css";
import React from "react";
import loading from '../../assets/images/logoCargando.png';
import { Backdrop } from "@mui/material";

const Loading = (props) => {
   return (
      // Usamos solo Backdrop para que sea más ligero que un Dialog
      <Backdrop
         open={props.show}
         sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
         }}
      >
         <div className="container-loading">
            <div className="loader">
               <img src={loading} alt="loading" className="loader-img" />
            </div>
         </div>
      </Backdrop>
   )
}

export default Loading;
