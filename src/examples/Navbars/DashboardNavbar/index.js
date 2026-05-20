/**
=========================================================
* Material Dashboard 2 PRO React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDBadge from "components/MDBadge";

// Material Dashboard 2 PRO React examples
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarDesktopMenu,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 PRO React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import { Box, Card, Tooltip, } from "@mui/material";
import Alert from "Global/Alert";

function DashboardNavbar({ absolute, light, isMini, reloadMenu, refreshHijo }) {
  const [client, setClient] = useState(JSON.parse(sessionStorage.getItem('Client')));
  const Authentication = JSON.parse(sessionStorage.getItem("Authentication"));
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [route] = useState(useLocation().pathname.split("/").slice(1)[0]);
  const [rutaCompleta] = useState(useLocation().pathname);
  const [modalConfirmacionGuardar, setModalConfirmacionGuardar] = useState(false);
  const [message, setMessage] = useState({
    isShow: false,
  });

  useEffect(() => {
    // Setting the navbar type
    setMiniSidenav(dispatch, false) //LINEA PARA QUE EL MENU ARRANQUE OCULTO (FALSE MOSTRAR / TRUE OCULTAR)
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => {
    setMiniSidenav(dispatch, !miniSidenav)
  };
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);


  /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
  const handleCloseConfirmacion = (msg) => {
    setModalConfirmacionGuardar(false);
    if (msg === "Registro actualizado correctamente") {
      setMessage({
        isShow: true,
        text: 'Registro actualizado correctamente',
        type: 'success'
      });
      if (reloadMenu !== undefined && reloadMenu !== null)
        reloadMenu()
    }
  };

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });


  /*Método para abrir el modal de actualizar alias y foto*/
  const openModal = (e) => {
    e.preventDefault();
    setModalConfirmacionGuardar(true);
  };

  /** Metodo que limpia los mensajes */
  const clearMessage = () => {
    setMessage({
      isShow: false
    });
  }

  return (
    <>
      {message.isShow && <Alert alert={message.type} message={message.text} onClose={clearMessage} open={message.isShow} />}

      <AppBar
        position={absolute ? "absolute" : navbarType}
        color="inherit"
        sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
      >
        {/* <Toolbar sx={(theme) => ({
          ...navbarContainer(theme),
        })}>
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "row", // Fuerza la línea horizontal
              alignItems: "center", // Centra verticalmente icono y texto
              width: "100%",
              justifyContent: "flex-start",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton sx={navbarDesktopMenu} onClick={handleMiniSidenav} size="small" disableRipple>
                <Icon fontSize="medium" sx={iconsStyle}>
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>

              {
                (rutaCompleta === "/Cards" || rutaCompleta === "/Card") ?
                  <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>

                    <label
                      className="title"
                      style={{
                        margin: 0,
                        fontSize: '0.9rem', // Un poco más pequeño para que quepa en celulares
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >                      {" "}
                      Hola{" "}
                      {Authentication !== null ? Authentication.nombre + " " + Authentication.apellidoPaterno : ""}{" "}
                    </label>
                  </Box>
                  :
                  <></>
   
              }

            </Box>

            <Box sx={{ flexGrow: 1 }} />

          </MDBox>
          {isMini ? null : (
            <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
              <MDBox color={light ? "white" : "inherit"}>
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarMobileMenu}
                  onClick={handleMiniSidenav}
                >
                  <Icon sx={iconsStyle} fontSize="medium">
                    {miniSidenav ? "menu_open" : "menu"}
                  </Icon>
                </IconButton>
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarIconButton}
                  aria-controls="notification-menu"
                  aria-haspopup="true"
                  variant="contained"
                  onClick={handleOpenMenu}
                >
                </IconButton>
                {renderMenu()}
              </MDBox>
            </MDBox>
          )}
        </Toolbar> */}



        <Toolbar sx={(theme) => ({ ...navbarContainer(theme) })}>
          <MDBox
            color="inherit"
            sx={(theme) => ({
              ...navbarRow(theme, { isMini }),
              display: "flex !important",
              flexDirection: "row !important", 
              alignItems: "center !important",
              width: "100%",
              justifyContent: "space-between", 
            })}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton sx={navbarDesktopMenu} onClick={handleMiniSidenav} size="small" disableRipple>
                <Icon fontSize="medium" sx={iconsStyle}>
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>

              {(rutaCompleta === "/Cards" || rutaCompleta === "/Card") && (
                <Box sx={{ ml: 1, display: "flex", alignItems: "center" }}>
                  <label
                    className="title"
                  >
                    Hola {Authentication !== null ? Authentication.nombre : ""}
                  </label>
                </Box>
              )}
            </Box>

            <MDBox color={light ? "white" : "inherit"} sx={{ display: "flex", alignItems: "center" }}>
              {!isMini && (
                <>
                  <IconButton
                    size="small"
                    disableRipple
                    color="inherit"
                    sx={navbarMobileMenu}
                    onClick={handleMiniSidenav}
                  >
                    <Icon sx={iconsStyle} fontSize="medium">
                      {miniSidenav ? "menu_open" : "menu"}
                    </Icon>
                  </IconButton>

                  {renderMenu()}
                </>
              )}
            </MDBox>
          </MDBox>
        </Toolbar>
      </AppBar>
    </>);
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
