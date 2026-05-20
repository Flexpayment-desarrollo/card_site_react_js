import React from "react";
import MDBox from "components/MDBox";
import logo from '../assets/images/logoCargando.png';

const LogoEasy = () => {
   return (
      <MDBox sx={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
         <img
            src={logo}
            alt="logo"
            style={{
               width: '100%',
               maxWidth: '150px',
               height: '100px',
               display: 'block'
            }}
         />
      </MDBox>
   )
}

export default LogoEasy;