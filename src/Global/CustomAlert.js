import React from "react";
import PropTypes from "prop-types";

// Material Dashboard 2 PRO React components
import MDAlert from "components/MDAlert";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

// @mui icons
import ErrorIcon from "@mui/icons-material/Error";

const CustomAlert = ({
    color,
    icon,
    message,
    onClose,
    visible
}) => {
    if (!visible || !message) return null;

    const IconComponent = icon || ErrorIcon;

    return (
        <MDBox px={2} mb={2}>
            <MDAlert
                color={color === "error" ? "error" : color}
                // dismissible={!!onClose}
                onClose={onClose}
            >
                <MDTypography
                    variant="caption"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    fontWeight="medium"
                >
                    {/* Renderizamos el icono dinámicamente */}
                    {React.isValidElement(IconComponent) ? (
                        IconComponent
                    ) : (
                        <IconComponent fontSize="small" color="inherit" />
                    )}
                    &nbsp;
                    {message}
                </MDTypography>
            </MDAlert>
        </MDBox>
    );
};

// Definimos los tipos de las props para evitar errores
CustomAlert.propTypes = {
    color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "danger", "dark", "light"]),
    icon: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
    message: PropTypes.string,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
};

CustomAlert.defaultProps = {
    color: "info",
    visible: false,
};

export default CustomAlert;