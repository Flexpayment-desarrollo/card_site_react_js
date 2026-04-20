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
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Material Dashboard 2 PRO React page layout routes
import pageRoutes from "page.routes";

// Authentication pages components
import Footer from "layouts/authentication/components/Footer";
import MDTypography from "components/MDTypography";

function BasicLayout({ image, children }) {
  return (
    <PageLayout>
      <MDBox
        width="100%"
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <MDBox px={1} width="100%" sx={{ flex: 1, display: "flex", alignItems: "center" }}>
          <Grid container spacing={1} justifyContent="center" py={4}>
            <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
              {children}
            </Grid>
          </Grid>
        </MDBox>

        <MDBox width="100%">
          <Footer />
        </MDBox>
      </MDBox>
    </PageLayout>
  );
}

// Typechecking props for the BasicLayout
BasicLayout.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default BasicLayout;
