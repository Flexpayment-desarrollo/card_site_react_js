import "../../Global/Loading/Loading.css";
import React from "react";
import loading from '../../assets/images/logoCargando.png';
import { Backdrop } from "@mui/material";

// const Loading = (props) => {
//    return (
//       <Dialog open={props.show}>
//          <Backdrop open={props.show}>
//             <div style={{ position: "absolute", top: "0", left: "0", right: "0", bottom: "0", margin: "auto", width: "150px", height: "200px" }}>
//                <div className="container-loading">
//                   <div className="loader">
//                      <img src={loading} alt="loading" />
//                   </div>
//                </div>
//             </div>
//          </Backdrop>
//       </Dialog>
//    )
// }

// export default Loading;

const Loading = (props) => {
   return (
      // Usamos solo Backdrop para que sea más ligero que un Dialog
      <Backdrop
         open={props.show}
         sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)' // Oscurece un poco el fondo para que resalte el blanco
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
