import dayjs from "dayjs";
import 'dayjs/locale/es';
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { Card, Icon, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

dayjs.locale('es');

export const Component_TableMovementsT = ({ listMovimientos }) => {
  const navigate = useNavigate();

  // Función para agrupar movimientos por fecha 
  const agruparMovimientos = (movimientos) => {
    if (!movimientos || movimientos.length === 0) return [];

    const grupos = {};

    movimientos.forEach((mov) => {
      const fecha = dayjs(mov.fechaIn);
      let titulo = "";

      if (fecha.isSame(dayjs(), "day")) {
        titulo = "Hoy";
      } else if (fecha.isSame(dayjs().subtract(1, "day"), "day")) {
        titulo = "Ayer";
      } else {
        titulo = fecha.locale("es").format("DD [de] MMMM YYYY");
      }

      if (!grupos[titulo]) {
        grupos[titulo] = [];
      }

      const horaFormateada = fecha.locale("es").format("hh:mm A");

      // Renglón del Monto (SPEI)
      grupos[titulo].push({
        isComision: false,
        color: "text",
        icon: "info_outline",
        name: (
          <>
            Envío a Tercero
            <br />
            <MDTypography variant="caption" color="dark" fontWeight="medium" component="span" sx={{ fontSize: "0.8rem", lineHeight: 1.2 }}>
              {mov.banco || ""}
            </MDTypography>
          </>
        ),
        description: `${horaFormateada}`,
        value: `- $${parseFloat(mov.monto).toFixed(2)}`,
        rawData: mov,
      });

      // Renglón de la Comisión
      grupos[titulo].push({
        isComision: true,
        color: "error",
        icon: "info_outline",
        name: "Comisión",
        description: `${horaFormateada}`,
        value: `- $${parseFloat(mov.comision).toFixed(2)}`,
        rawData: mov,
      });
    });

    return Object.keys(grupos).map((key) => ({
      titulo: key,
      items: grupos[key],
    }));
  };

  //
  const openDetail = (item) => {
    navigate("/MovementDetail", {
      state: {
        detalle: item.rawData,
        isComision: item.isComision
      },
    });
  };

  const secciones = agruparMovimientos(listMovimientos);

  return (
    <Card sx={{ height: "100%", boxShadow: "none" }}>
      {/* Encabezado */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDBox display="flex" alignItems="center">
          <MDBox color="text" mr={0.5} lineHeight={0}>
            <Icon color="inherit" fontSize="small">date_range</Icon>
          </MDBox>
          <MDTypography variant="button" color="text" fontWeight="medium">
            Historial de Transacciones
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Lista de Movimientos */}
      <MDBox pt={3} pb={2} px={2}>
        {secciones.length > 0 ? (
          secciones.map((seccion, idx) => (
            <MDBox key={seccion.titulo} mt={idx > 0 ? 3 : 0}>
              <MDBox mb={1.5}>
                <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                  {seccion.titulo}
                </MDTypography>
              </MDBox>

              <MDBox
                component="ul"
                display="flex"
                flexDirection="column"
                p={0}
                m={0}
                sx={{ listStyle: "none" }}>
                {seccion.items.map((item, key) => (
                  <MDBox key={`${item.name}-${key}`}>

                    <MDBox component="li" py={1} pr={1} mb={0.5}>
                      <MDBox display="flex" justifyContent="space-between" alignItems="center">
                        <MDBox display="flex" alignItems="center">

                          <MDBox mr={2}>
                            <MDButton
                              variant="outlined"
                              color="dark"
                              iconOnly
                              circular
                              onClick={() => openDetail(item)}                         >
                              <Icon sx={{ fontWeight: "bold" }}>{item.icon}</Icon>
                            </MDButton>
                          </MDBox>

                          <MDBox display="flex" flexDirection="column">
                            <MDTypography variant="button" fontWeight="medium" gutterBottom>
                              {item.name}
                            </MDTypography>
                            <MDTypography variant="caption" color="text" fontWeight="regular">
                              {item.description}
                            </MDTypography>
                          </MDBox>
                        </MDBox>

                        <MDTypography variant="button" color={item.color} fontWeight="medium" textGradient>
                          {item.value}
                        </MDTypography>
                      </MDBox>
                    </MDBox>

                    {/* Separador al terminar cada par de operaciones */}
                    {item.isComision && key < seccion.items.length - 1 && (
                      <Divider sx={{ my: 1.5, opacity: 0.6 }} />
                    )}
                  </MDBox>
                ))}
              </MDBox>
            </MDBox>
          ))
        ) : (
          <MDBox textAlign="center" py={5}>
            <MDTypography variant="body2" color="text">
              No hay movimientos en este periodo.
            </MDTypography>
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
};