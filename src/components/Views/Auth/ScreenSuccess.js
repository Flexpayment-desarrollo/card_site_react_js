import React from "react";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import LogoInovag from "../LogoInovag";
import { BsCheckCircle } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import MDTypography from "components/MDTypography";

const ScreenSuccess = ({ message }) => {
    const navigate = useNavigate();
    return (
        <>
            <div style={{ textAlign: "center" }}>
                <LogoInovag />
                <div className="row col text-center" style={{ marginTop: 30 }}>
                    <h2>{message}</h2>
                    <h4>Ahora puede disfrutar los beneficios de <span>Easy Transfer</span></h4>
                </div>
                <div className="row col text-center" style={{ marginTop: 30 }}>
                    <BsCheckCircle color="#28e60d" size={150} />
                </div>
                <MDBox mb={2} mt={5}>
                    <MDButton variant="gradient" style={{ backgroundColor: "#ff5f00" }} size="large" fullWidth onClick={() => navigate('/SignIn')}>
                        <MDTypography variant="h7" color="white">REGRESAR A EASY TRANSFER</MDTypography>
                    </MDButton>
                </MDBox>
            </div>
        </>
    )
}

export default ScreenSuccess;