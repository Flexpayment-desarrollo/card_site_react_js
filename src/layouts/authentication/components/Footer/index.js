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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React base styles
import typography from "assets/theme/base/typography";
import { useEffect } from "react";

function Footer({ light }) {
  const { size } = typography;

  // 2. Lógica del Sello de GoDaddy
  useEffect(() => {
    window.verifySealBasic = () => {
      var bgHeight = "800";
      var bgWidth = "680";
      var url = "https://seal.godaddy.com/verifySealBasic?sealID=yUQaGbk986j3HRmPMbGf4LpgJOZpPSOk9dVjh7g6FDHrsqgtygVNFz7pQZWb";
      window.open(url, 'SealVerfication', 'menubar=no,toolbar=no,personalbar=no,location=yes,status=no,resizable=yes,fullscreen=no,scrollbars=no,width=' + bgWidth + ',height=' + bgHeight);
    };

    const ssDiv = document.getElementById('siteseal');
    // Verificamos si ya existe el contenido para evitar duplicados en re-renders de React
    if (ssDiv && !ssDiv.shadowRoot) {
      const verifiedMessage = "Cifrado del sitio<br /> Verificado";
      const date = `Fecha de verificado ${new Date().toLocaleDateString()}`;
      const dark = light; // Usamos el prop 'light' para decidir el tema del sello
      const baseUrl = "https://seal.godaddy.com";

      const shadowRoot = ssDiv.attachShadow({ mode: 'open' });

      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = baseUrl + '/css/lockBasic.css';
      shadowRoot.appendChild(cssLink);

      const fill = dark ? 'fill-dark' : 'fill-light';
      const stroke = dark ? 'stroke-dark' : 'stroke-light';

      const GODADDY_LOGO = `<svg xmlns='http://www.w3.org/2000/svg' height="40" width="35" viewBox='0 0 24 24'><path id="gd-path" class=${fill} d='M4.769 9.229c-.575-.365-1.331-.278-2.006.152-.672-.43-1.429-.517-2.003-.152-.908.576-1.018 2.06-.246 3.314.569.925 1.458 1.467 2.25 1.457.793.01 1.682-.532 2.251-1.457.771-1.254.662-2.738-.246-3.314zM.93 12.279a3.03 3.03 0 01-.356-.829 2.404 2.404 0 01-.077-.78c.034-.464.22-.826.523-1.018.302-.192.703-.203 1.129-.032.064.026.127.056.19.09a3.53 3.53 0 00-.612.747c-.469.761-.612 1.609-.448 2.285a3.073 3.073 0 01-.349-.464zm4.023-.83a3.102 3.102 0 01-.705 1.293c.147-.605.047-1.348-.311-2.043a.092.092 0 00-.057-.047.09.09 0 00-.073.01l-1.118.71a.092.092 0 00-.04.058.094.094 0 00.011.07l.164.267a.092.092 0 00.093.042.09.09 0 00.033-.013l.725-.46c.023.072.047.143.064.214.069.254.095.518.078.78-.035.464-.22.825-.523 1.017a1.01 1.01 0 01-.518.152h-.024a1.009 1.009 0 01-.518-.152c-.303-.192-.488-.553-.523-1.017a2.41 2.41 0 01.077-.78 3.097 3.097 0 01.934-1.517c.194-.174.416-.313.656-.413.425-.172.826-.16 1.129.032.303.192.488.553.523 1.017a2.41 2.41 0 01-.077.78zm5.77-.553c-.588 0-1.063.466-1.063 1.059 0 .589.475 1.047 1.063 1.047.591 0 1.066-.458 1.066-1.047 0-.593-.474-1.059-1.066-1.059zm0 1.552a.483.483 0 01-.477-.497c0-.275.206-.501.477-.501.275 0 .48.226.48.501a.484.484 0 01-.48.498zm2.392-2.365h-1.082a.086.086 0 00-.063.025.09.09 0 00-.025.065v2.677a.091.091 0 00.053.088.086.086 0 00.035.007h1.082c.865 0 1.466-.584 1.466-1.434 0-.856-.601-1.428-1.466-1.428zm.025 2.297h-.591v-1.733h.591c.48 0 .81.364.81.862 0 .491-.33.871-.81.871zm3.594-1.427h-.407a.09.09 0 00-.059.03.094.094 0 00-.025.06v.123c-.093-.155-.302-.27-.563-.27-.507 0-.982.405-.982 1.05 0 .643.471 1.056.979 1.056.261 0 .474-.115.567-.27v.126c0 .023.009.045.025.061a.084.084 0 00.06.025h.406a.082.082 0 00.079-.053.085.085 0 00.006-.033v-1.815a.089.089 0 00-.053-.082.084.084 0 00-.033-.008zm-.946 1.5c-.27 0-.471-.21-.471-.502 0-.291.202-.501.471-.501.27 0 .472.21.472.501 0 .291-.203.502-.472.502zm3.228-2.37h-.407a.085.085 0 00-.081.052.09.09 0 00-.007.034v.989c-.094-.147-.306-.262-.572-.262-.503 0-.97.405-.97 1.05 0 .643.471 1.056.978 1.056.262 0 .46-.115.568-.27v.126c0 .023.009.045.025.061a.084.084 0 00.06.025h.406a.081.081 0 00.06-.024.085.085 0 00.024-.062V10.17a.085.085 0 00-.051-.08.08.08 0 00-.033-.006zm-.946 2.375c-.268 0-.469-.212-.469-.507 0-.295.202-.507.47-.507.267 0 .468.212.468.507 0 .295-.2.507-.469.507zm3.227-2.375h-.405a.085.085 0 00-.082.052.088.088 0 00-.007.034v.989c-.092-.147-.306-.262-.571-.262-.504 0-.97.405-.97 1.05 0 .643.47 1.056.977 1.056.262 0 .46-.115.568-.27v.126c0 .023.01.045.025.061a.084.084 0 00.06.025h.405a.081.081 0 00.079-.052.083.083 0 00.006-.034V10.17a.085.085 0 00-.024-.062.08.08 0 00-.06-.024zm-.945 2.375c-.269 0-.469-.212-.469-.507 0-.295.201-.507.469-.507.267 0 .468.212.468.507 0 .295-.2.507-.468.507zm3.171-1.365l-.606 2.113c-.117.376-.379.6-.785.6a.969.969 0 01-.485-.114c-.077-.045-.14-.085-.14-.15 0-.041.012-.062.036-.1l.12-.183c.034-.051.059-.068.096-.068a.13.13 0 01.08.028c.075.05.146.093.253.093.125 0 .22-.04.272-.192l.052-.175h-.245c-.06 0-.094-.037-.11-.086l-.542-1.766c-.02-.07-.002-.14.099-.14h.427c.053 0 .09.019.112.095l.401 1.422.375-1.422c.012-.05.044-.094.109-.094h.405c.08 0 .104.057.076.139zm-14.016.628v1.13a.093.093 0 01-.057.086.09.09 0 01-.035.006H9.08a.09.09 0 01-.086-.057.093.093 0 01-.006-.036v-.296c-.213.273-.584.445-1.003.445-.787 0-1.402-.601-1.402-1.457 0-.89.664-1.502 1.503-1.502.619 0 1.114.27 1.334.814.006.014.01.03.01.045 0 .026-.017.046-.07.064l-.392.154a.099.099 0 01-.074 0 .115.115 0 01-.047-.054c-.14-.271-.391-.456-.776-.456-.5 0-.858.397-.858.91 0 .498.305.908.872.908.298 0 .536-.143.647-.3h-.354a.09.09 0 01-.085-.057.093.093 0 01-.007-.036v-.307a.093.093 0 01.057-.086.09.09 0 01.035-.007h1.037a.087.087 0 01.085.054.09.09 0 01.007.035zm14.027-1.185v-.028l.002-.005a.008.008 0 01.005-.002h.174l.003.002a.008.008 0 01.001.005v.028l-.001.005-.003.001h-.065v.172a.007.007 0 01-.007.007h-.035l-.002-.002-.002-.002v-.174h-.065l-.003-.002-.001-.003v-.002zm.3-.029l.047.11.047-.11a.01.01 0 01.004-.005.012.012 0 01.006 0h.057a.007.007 0 01.004.006v.209l-.002.002-.002.002h-.036l-.002-.002-.002-.002v-.159l-.05.114a.012.012 0 01-.004.005.01.01 0 01-.006.002h-.025c-.002 0-.004 0-.006-.002a.011.011 0 01-.004-.005l-.05-.114v.156c0 .002 0 .004-.002.005a.007.007 0 01-.005.002h-.033l-.002-.002-.002-.002v-.212l.002-.002a.005.005 0 01.005-.002h.052c.002 0 .005 0 .006.002a.01.01 0 01.003.004z'/></svg>`;

      shadowRoot.innerHTML += `
        <div class="div-root" onclick="verifySealBasic();" style="cursor: pointer; transform: scale(0.8); origin: left center;">
          <div class="div-wrapper">
            <div class="div-container ${dark ? 'dark-container' : 'light-container'}">
              <div class="seal-container">
                <div class="check-bubble-gradient"></div>
                <svg id="arm" width="32" height="42" viewBox="0 0 32 42" fill="none">
                  <path id="path" d="M29 39V15C29 12.5 27.3 3 16.5 3C5.7 3 3 10.5 3 15V21" class="${stroke}" stroke-width="6" stroke-linecap="round" />
                </svg>
                <svg id="padlock" width="54" height="46" viewBox="0 0 54 46" fill="none">
                  <rect class="${fill}" width="54" height="46" rx="8" />
                </svg>
              </div>
              <div class="seal-box-wrapper">
                <div class="seal-box">
                  <span class="seal-text-verified ${dark ? 'text-dark' : 'text-light'}">${verifiedMessage}</span>
                  <div class="gd-logo">${GODADDY_LOGO}</div>
                </div>
              </div>
            </div>
          </div>
        </div>`;

      // Animaciones al entrar en vista
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          shadowRoot.getElementById('arm').classList.add('animate-arm');
          shadowRoot.getElementById('path').classList.add('animate-path');
          shadowRoot.getElementById('padlock').classList.add('animate-padlock');
          shadowRoot.querySelector('.seal-container').classList.add('animate-seal-container');
          shadowRoot.querySelector('.check-bubble-gradient').classList.add('animate-bubble');
        }
      }, { threshold: 0.2 });

      observer.observe(ssDiv);
    }
  }, [light]); // Se re-ejecuta si el prop 'light' cambia

  return (
    <MDBox component="footer" width="100%" mt="auto" py={4}>
      <Container>
        <MDBox
          width="100%"
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems="center"
          px={1.5}
        >
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            color={light ? "white" : "text"}
            fontSize={size.sm}
          >
            Copyright  &copy; {new Date().getFullYear()}, Easy Transfer
            <MDBox fontSize={size.md} color={light ? "white" : "dark"} mb={-0.5} mx={0.25}>
              <Icon color="inherit" fontSize="inherit">
                favorite
              </Icon>
            </MDBox>
            by
            <Link href="https://www.easytransfer.mx/" target="_blank">
              <MDTypography variant="button" fontWeight="medium" color={light ? "white" : "dark"}>
                &nbsp;Easy Transfer&nbsp;
              </MDTypography>
            </Link>

            {/* 3. Contenedor del Sello (Ajustado para que no rompa el diseño) */}
            <MDBox ml={2} display="flex" alignItems="center">
              <div id="siteseal"></div>
            </MDBox>
          </MDBox>

          {/* 
            <MDBox
          width="100%"
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems="center"
          px={1.5}
        >
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            color={light ? "white" : "text"}
            fontSize={size.sm}
          >
            <Link href="https://www.easytransfer.mx/" target="_blank">
              <MDTypography variant="button" fontWeight="medium" color={light ? "white" : "dark"}>
                &nbsp;  Seguridad SSL certificada&nbsp;
              </MDTypography>
            </Link>
          </MDBox>
          </MDBox> */}

          {/* <Grid item xs={12} lg={8} sx={{ textAlign: "center" }}>
            <MDTypography variant="body2" color="secondary">
                <span><script async type="text/javascript" src="https://seal.godaddy.com/getSealBasic?sealID=yUQaGbk986j3HRmPMbGf4LpgJOZpPSOk9dVjh7g6FDHrsqgtygVNFz7pQZWb"></script>SSL</span>
          </MDTypography>
          </Grid> */}

          <MDBox
            component="ul"
            sx={({ breakpoints }) => ({
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              listStyle: "none",
              mt: 3,
              mb: 0,
              p: 0,

              [breakpoints.up("lg")]: {
                mt: 0,
              },
            })}
          >
            <MDBox component="li" pr={2} lineHeight={1}>
              <Link href="https://www.easytransfer.mx/" target="_blank">
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color={light ? "white" : "dark"}
                >
                  Easy Transfer
                </MDTypography>
              </Link>
            </MDBox>
            <MDBox component="li" px={2} lineHeight={1}>
              <Link href="https://www.easytransfer.mx/" target="_blank">
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color={light ? "white" : "dark"}
                >
                  Acerca de nosotros
                </MDTypography>
              </Link>
            </MDBox>
            <MDBox component="li" px={2} lineHeight={1}>
              <Link href="https://www.easytransfer.mx/contacto" target="_blank">
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color={light ? "white" : "dark"}
                >
                  Contacto
                </MDTypography>
              </Link>
            </MDBox>
            <MDBox component="li" pl={2} lineHeight={1}>
              <Link href="https://www.easytransfer.mx/faq" target="_blank">
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color={light ? "white" : "dark"}
                >
                  Preguntas frecuentes
                </MDTypography>
              </Link>
            </MDBox>
          </MDBox>
        </MDBox>
      </Container>
    </MDBox>
  );
}

// Setting default props for the Footer
Footer.defaultProps = {
  light: false,
};

// Typechecking props for the Footer
Footer.propTypes = {
  light: PropTypes.bool,
};

export default Footer;
