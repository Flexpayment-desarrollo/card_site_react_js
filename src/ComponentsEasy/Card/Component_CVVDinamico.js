import React, { useState, useEffect } from "react";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";

export const Component_CVVDinamico = ({ segundosIniciales = 240, alTerminar }) => {
  const [segundos, setSegundos] = useState(segundosIniciales);
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    let intervalo = null;

    if (activo && segundos > 0) {
      intervalo = setInterval(() => {
        setSegundos((prev) => prev - 1);
      }, 1000);
    } else if (segundos === 0) {
      setActivo(false);
      clearInterval(intervalo);
      if (alTerminar) alTerminar();
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
      <MDBox textAlign="center" mt={1}>
        {segundos > 0 ? (
          <MDTypography
            variant="button"
            fontWeight="regular"
            color="text"
          >
            El CVV expira en:{" "}
            <MDTypography
              variant="button"
              fontWeight="bold"
              color="info"
              fontSize="10px"
            >
              {formatearTiempo(segundos)}
            </MDTypography>
          </MDTypography>
        ) : (
          <MDBox>
            <MDTypography
              variant="caption text"
              display="block"
              mb={1}
              color="info"
            >
              El CVV ha expirado
            </MDTypography>
            <MDButton
              variant="text"
              size="small"
              onClick={reenviarCodigo}
              color="info"
            >
              REENVIAR CVV
            </MDButton>
          </MDBox>
        )}
      </MDBox>
    </>
  );
};