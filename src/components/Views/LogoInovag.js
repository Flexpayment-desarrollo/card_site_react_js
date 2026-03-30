import React from "react";
import MDBox from "components/MDBox";
import logo2 from '../../assets/images/logos/logo2.png';

const LogoInovag = () => {
   return (
      <MDBox sx={{ display: 'flex', justifyContent: 'center' }}>
         <img src={logo2} className="App-logo" width={410} height={95} alt="logo" />
      </MDBox>
   )
}

export default LogoInovag;