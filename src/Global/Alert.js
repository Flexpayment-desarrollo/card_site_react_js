import MDSnackbar from "components/MDSnackbar";
import React from "react";
import { dateTimeFormat } from "./Expressions";

const Alert = (props) => {

   let alertColor = ""
   let alertTitle = ""
   let alertIcon = ""

   if (props.alert === "danger") {
      alertColor = "error"
      alertIcon = "warning"
      alertTitle = "Hubo un error"
   }
   else if (props.alert === "success") {
      alertColor = "success"
      alertIcon = "check"
      alertTitle = "Correcto"
   }

   return (
      <MDSnackbar
         color={alertColor}
         dateTime={dateTimeFormat(new Date().toString())}
         icon={alertIcon}
         title={alertTitle}
         content={props.message}
         open={props.open}
         autoHideDuration={2000}
         onClose={props.onClose}
         close={props.onClose} />
   )
}

export default Alert;