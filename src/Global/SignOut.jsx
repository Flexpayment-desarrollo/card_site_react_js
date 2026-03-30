import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModalConfirmation } from "./ModalConfirmation";

const SignOut = () => {
  const Navigate = useNavigate();
  const [modalConfirmacionGuardar, setModalConfirmacionGuardar] =
    useState(true);

  useEffect(() => {}, []);

  /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
  const handleCloseConfirmacion = (e) => {
    if (e.target.name === "yesBtn") {
      setModalConfirmacionGuardar(false);
      Navigate("/SignIn");
    } else {
      if (e.target.name === "noBtn") {
        setModalConfirmacionGuardar(false);
      }
    }
  };

  return (
    <>
      {modalConfirmacionGuardar && (
        <ModalConfirmation
          showModal={modalConfirmacionGuardar}
          message="¿Estás seguro de cerrar sesión?"
          closeModal={handleCloseConfirmacion}
        ></ModalConfirmation>
      )}
      <DashboardLayout>
        <DashboardNavbar />
        <Footer />
      </DashboardLayout>
    </>
  );
};

export default SignOut;
