import React, { useState, useEffect } from "react";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";

export const Component_CVVDinamico = ({ segundosIniciales = 4000, alTerminar }) => {
  const [segundos, setSegundos] = useState(segundosIniciales);
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    let intervalo = null;

    if (activo && segundos > 0) {
      intervalo = setInterval(() => {
        setSegundos((prev) => prev - 1);
      }, 4000);
    } else if (segundos === 0) {
      setActivo(false);
      clearInterval(intervalo);
      if (alTerminar) alTerminar(); // Ejecuta una función cuando llegue a 0
    }

    return () => clearInterval(intervalo);
  }, [activo, segundos]);

  // Formatear tiempo a MM:SS
  const formatearTiempo = (s) => {
    const minutos = Math.floor(s / 60);
    const restoSegundos = s % 60;
    return `${minutos}:${restoSegundos < 10 ? "0" : ""}${restoSegundos}`;
  };

  const reenviarCodigo = () => {
    setSegundos(segundosIniciales);
    setActivo(true);
  };


  return (
    <>
      <MDBox textAlign="center" mt={2}>
        {segundos > 0 ? (
          <MDTypography variant="button" color="text" fontWeight="regular">
            El CVV expira en:{" "}
            <MDTypography variant="button" color="info" fontWeight="bold">
              {formatearTiempo(segundos)}
            </MDTypography>
          </MDTypography>
        ) : (
          <MDBox>
            <MDTypography variant="button" color="error" display="block" mb={1}>
              El CVV ha expirado
            </MDTypography>
            <MDButton
              variant="text"
              color="info"
              size="small"
              onClick={reenviarCodigo}
            >
              REENVIAR CVV
            </MDButton>
          </MDBox>
        )}
      </MDBox>
    </>
  );
};