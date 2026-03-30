import React from "react";
import LogoInovag from "../LogoInovag";
import bgImage from "assets/images/illustrations/slide.jpg";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose } from "react-icons/ai";

const BrokenLink = () => {
   const navigate = useNavigate();
   
   return (
      <IllustrationLayout
         illustration={bgImage}
      >
         <div className="container-center" style={{ textAlign: 'center' }}>
            <MDBox mt={3} mb={1}>
               <LogoInovag />
            </MDBox>
            <div className="row col text-center">
               <h2>Lo sentimos, este link ya no está disponible.</h2>
            </div>
            <div className="row col text-center mt-4">
               <AiOutlineClose color="rgb(236, 13, 14)" size={150} />
            </div>
            <MDBox mt={3} mb={1}>
               <MDButton variant="gradient" color="info" size="" fullWidth onClick={() => navigate('/SignIn')}>
                  Regresar a Easy Transfer
               </MDButton>
            </MDBox>
         </div>
      </IllustrationLayout>
   )
}

export default BrokenLink;