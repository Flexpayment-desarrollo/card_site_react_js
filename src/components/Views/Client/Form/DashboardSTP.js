import React, { useEffect } from 'react'
import RefreshIcon from '@mui/icons-material/Refresh';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import avatarIcon from "images/logoSTP.png";
import avatarIcon2 from "images/flechasTransfer.png";
import sinImagen from "images/noImagen.png";
import MDBox from "components/MDBox";
import MDBadgeDot from "components/MDBadgeDot";
import PieChart from "examples/Charts/PieChart";
import MDTypography from 'components/MDTypography';
import { Grid } from '@mui/material';
import { ClientLabel } from 'Global/ClientLabel';
import HorizontalBarChart from 'examples/Charts/BarCharts/HorizontalBarChart';

export const DashboardSTP = ({ saldo, setmontoabonado, cuenta, estatus, refreshCard, valores, limite, porcentajeTolerancia, abonoDisponible, idProducto, cargosPendientes }) => {

    const chartData = {
        labels: ["Disponible", "Abonado"],
        datasets: {
            label: "Saldo",
            backgroundColors: ["light", "error"],
            data: valores
        }
    }

    const chartDataH = {
        labels: ["Disponible", "Abonado"],
        datasets: [{
            label: "Saldo",
            backgroundColors: ["light", "error"],
            data: valores
        }]
    }

    useEffect(() => {
    }, []);

    return (
        <>
            <Grid container spacing={2} pb={3}>
                <Grid item xs={6}>
                    <CardHeader
                        avatar={
                            idProducto === 4 ?
                                <Avatar src={avatarIcon2} sx={{ width: 90, height: 90 }} />
                                :
                                idProducto === 3 ?
                                    <Avatar src={avatarIcon} sx={{ width: 90, height: 90 }} />
                                    :
                                    <Avatar src={sinImagen} sx={{ width: 90, height: 90 }} />

                        }
                        titleTypographyProps={{ variant: 'h2', color: "#000000" }}
                        title={saldo + " MXN"}
                    >   </CardHeader>
                    <CardContent>
                        <ClientLabel />
                        <MDTypography variant="body2" color="black">
                            No Cuenta:
                        </MDTypography>
                        <MDTypography variant="body2" style={{ color: "#ff5f00" }}>
                            {cuenta}
                        </MDTypography>
                        <Grid container>
                            <Grid item xs={7}>
                                <MDTypography variant="body2" color="black">
                                    Estatus:
                                </MDTypography>
                                <MDTypography variant="body2" color={estatus === "Activo" ? "success" : "error"}>
                                    {estatus}
                                </MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={7}>
                                <MDTypography variant="body2" color="black">
                                    En tránsito:
                                </MDTypography>
                                <MDTypography variant="body2" style={{ color: "#ff5f00" }}>
                                    {"$" + cargosPendientes.toLocaleString("es-MX", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                                </MDTypography>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites" onClick={refreshCard}>
                            <RefreshIcon />
                        </IconButton>
                        <Typography variant="body2" color="black">
                            Actualizar
                        </Typography>
                    </CardActions>
                </Grid>
                <Grid item xs={6}>
                    <MDBox mt={3}>
                        <Grid container alignItems="center">
                            <Grid item xs={7}>
                                <PieChart chart={chartData} height="12.5rem" />                    
                            </Grid>
                            <Grid item xs={5}>
                                <MDBox pr={1}>
                                    <MDBox mb={1}>
                                        <MDBadgeDot color="secondary" size="sm" badgeContent="Disponible"></MDBadgeDot>
                                        <MDTypography variant="button" style={{ color: "#ff5f00" }} fontWeight="light">
                                            <strong> {`$ ${abonoDisponible} MXN`}</strong>
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox mb={1}>
                                        <MDBadgeDot color="error" size="sm" badgeContent="Abonado" />
                                        <MDTypography variant="button" style={{ color: "#ff5f00" }} fontWeight="light">
                                            <strong> {`$ ${setmontoabonado} MXN`}</strong>
                                        </MDTypography>
                                    </MDBox>
                                </MDBox>
                            </Grid>
                            
                        </Grid>
                    </MDBox>
                    <MDBox display="flex"
                        alignItems="left" pb={1} px={2} fullWidth mt={1}>
                        <MDTypography variant="button" style={{ color: "#ff5f00" }} fontWeight="secondary">
                            <MDTypography variant="body3" style={{ color: "black" }} fontWeight="secondary">Limite de Abono Mensual</MDTypography> <strong> {`$${limite} MXN`}</strong>
                            <br></br>
                            <br></br>
                            <MDTypography variant="body3" style={{ color: "black" }} fontWeight="secondary">Porcentaje Tolerancia 2</MDTypography> <strong> {`% ${porcentajeTolerancia}`}</strong>
                        </MDTypography>
                    </MDBox>
                </Grid>
            </Grid>
        </>
    )
}