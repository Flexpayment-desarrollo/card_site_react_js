import dayjs from "dayjs";
import 'dayjs/locale/es';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Transaction from "layouts/pages/account/billing/components/Transaction";
import { Card, Icon } from "@mui/material";

// Configuración global de idioma
dayjs.locale('es');

export const Component_TableMovmentsCard = ({ listMovimientos }) => {

  //Función para agrupar movimientos por fecha
  const agruparMovimientos = (movimientos) => {
    if (!movimientos || movimientos.length === 0) return [];

    const grupos = {};

    movimientos.forEach((mov) => {
      const fecha = dayjs(mov.date);
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

      //Se adapta el objeto al formato que pide el componente Transaction
      grupos[titulo].push({
        color: mov.code.type === "CARGO" ? "error" : "success",
        icon: mov.code.type === "CARGO" ? "expand_more" : "expand_less",
        name: mov.merchant.description,
        description: dayjs(mov.date).locale("es").format("DD MMMM YYYY, [a las] hh:mm A"),
        value: `${mov.code.type === "CARGO" ? "-" : "+"} $ ${Math.abs(parseFloat(mov.amounts.exchanged.total)).toLocaleString("es-MX", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      });
    });

    // Convertir el objeto de grupos en el array de secciones
    return Object.keys(grupos).map((key) => ({
      titulo: key,
      items: grupos[key],
    }));
  };

  const secciones = agruparMovimientos(listMovimientos);

  return (
    <Card sx={{ height: "100%", boxShadow: "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDBox display="flex" alignItems="center">
          <MDBox color="text" mr={0.5} lineHeight={0}>
            <Icon color="inherit" fontSize="small">date_range</Icon>
          </MDBox>
          <MDTypography variant="button" color="text" fontWeight="regular">
            Historial de transacciones
          </MDTypography>
        </MDBox>
      </MDBox>

      <MDBox pt={3} pb={2} px={2}>
        {secciones.length > 0 ? (
          secciones.map((seccion, idx) => (
            <MDBox key={seccion.titulo} mt={idx > 0 ? 3 : 0}>
              <MDBox mb={2}>
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
                sx={{ listStyle: "none" }}
              >
                {seccion.items.map((item, key) => (
                  <Transaction
                    key={`${item.name}-${key}`}
                    color={item.color}
                    icon={item.icon}
                    name={item.name}
                    description={item.description}
                    value={item.value}
                  />
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