import validator from 'validator';

/**Metodo para valida que sea un correo valido
 * 
 * @param {*} email Correo electronico del usuario
 * @returns true
 */
export const emailValid = (email) => {
   const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
   if (isNaN(email.trim())) {
      if (!email.match(reg)) {
         throw new Error('¡Correo no válido!. Intentelo de nuevo.');
      }
   } else {
      throw new Error('Por favor. Ingrese el correo electrónico.');
   }
   return true;
}

export const emailValidForm = (email) => {
   var valid = true;
   const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
   if (isNaN(email.trim())) {
      if (!email.match(reg)) {
         valid = false;
      }
   } else {
      valid = false;
   }
   return valid;
}

/**Metodo que valida que el pin sea valido
 * 
 * @param {*} pin 
 * @returns false / true
 */
export const pinValid = (pin) => {
   const reg = /^[0-9]+$/;
   if (pin.length !== 0) {
      if (pin.length === 6) {
         if (!pin.match(reg)) {
            throw new Error('Solo se permiten números.');
         }
      } else if (pin.length < 6) {
         throw new Error('PIN incorrecto. Debe tener 6 dígitos.');
      }
      else {
         throw new Error('Solo se permiten 6 dígitos.');
      }
   } else {
      throw new Error('Por favor. Ingrese el PIN.');
   }
   return true;
}

/**Metodo para validar el codigo de SMS
 * 
 * @param {*} code 
 * @returns true 
 */
export const codeValid = (code) => {
   const reg = /^[A-Za-z0-9]+$/;
   if (code.length !== 0) {
      if (code.length === 6) {
         if (!code.match(reg)) {
            throw new Error('Solo se permiten caracteres alfanúmericos.');
         }
      } else if (code.length < 6) {
         throw new Error('Codigo incorrecto. Debe tener 6 caracteres.');
      }
      else {
         throw new Error('Solo se permiten 6 caracteres.');
      }
   } else {
      throw new Error('Por favor. Ingrese el Codigo.');
   }
   return true;
}

/** Metodo para validar la contraseña
 * 
 * @param {*} value 
 * @returns true
 */
export const passwordValid = (value) => {
   if (!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
      throw new Error('No es una contraseña segura');
   }
   return true;
}

export const deleteStorage = () => {
   sessionStorage.removeItem("newToken");
   sessionStorage.removeItem("Authentication");
   sessionStorage.removeItem("Client");
   sessionStorage.removeItem("UserRH");
   sessionStorage.removeItem("Producto");
   sessionStorage.removeItem("ubicacion");
}

/**Valida cadenas con espacios y acentos */
export const alphanumericSpaceValid = (value) => {
   var valid = true;
   const reg = /^[A-Za-z0-9\s\u00C0-\u017F]+$/g; if (!value.match(reg))
      valid = false;

   return valid;
}

/**
 * Valida cadenas sin espacios
 * @param {*} value 
 * @returns 
 */
export const alphanumericValid = (value) => {
   var valid = true;
   const reg = /^[A-Za-z0-9]+$/;
   if (!value.match(reg))
      valid = false;

   return valid;
}

/**
 * Valida cadenas sin espacios y permite _
 * @param {*} value 
 * @returns 
 */
export const alphanumericValid_ = (value) => {
   var valid = true;
   const reg = /^[A-Za-z0-9_]+$/;
   if (!value.match(reg))
      valid = false;

   return valid;
}


/**
 * Valida cadenas sin espacios y que acepte -/
 * @param {*} value 
 * @returns 
 */
export const alphanumericaractersValid = (value) => {
   var valid = true;
   const reg = /^[A-Za-z0-9-/-/=]+$/;
   if (!value.match(reg))
      valid = false;

   return valid;
}


/**
 * Valida solo numeros
 * @param {*} value 
 * @returns 
 */
export const numericValid = (value) => {
   var valid = true;
   const reg = /^[0-9]+$/;
   if (!value.match(reg))
      valid = false;

   return valid;
}

/**
 * Valida solo letras
 * @param {*} value 
 * @returns 
 */
export const alphaValid = (value) => {
   var valid = true;
   const reg = /^[A-Za-z]+$/;
   if (!value.match(reg))
      valid = false;
   return valid;
}

/**
 * Formatea la fecha y hora para ponerla en un formato correcto
 * @param {*} dateTime 
 * @returns 
 */
export const dateTimeFormat = (dateTime) => {
   if (dateTime !== null && dateTime !== undefined) {
      var dateTimeFormat = new Intl.DateTimeFormat("es-mx", {
         year: "numeric",
         month: "2-digit",
         day: "2-digit",
         hour: "2-digit",
         minute: "2-digit",
         second: "2-digit",
      }).format(new Date(dateTime));
      return dateTimeFormat;
   } else {
      return null;
   }
};

/**
 * Formatea la fecha para ponerla en un formato correcto
 * @param {*} date 
 * @returns 
 */
export const dateFormat = (date) => {
   if (date !== null && typeof (date) !== 'function') {
      var fecha = new Intl.DateTimeFormat("es-mx", {
         year: "numeric",
         month: "2-digit",
         day: "2-digit",
      }).format(new Date(date));
      return fecha;
   } else {
      return null;
   }
};

/**
 * Formatea la fecha para ponerla en un formato correcto con zona horaria
 * @param {*} date 
 * @returns 
 */
export const dateFormatPrecisa = (date) => {
   if (date !== null && typeof (date) !== 'function') {
      var fecha = new Intl.DateTimeFormat("es-mx", {
         year: "numeric",
         month: "2-digit",
         day: "2-digit",
         timeZone: "UTC",
      }).format(new Date(date));
      return fecha;
   } else {
      return null;
   }
};

/**
 * Formatea la fecha para ponerla en un formato correcto
 * @param {*} date 
 * @returns 
 */
export const dateFormatString = (date) => {
   if (date !== null) {
      var year = Number(date.substr(0, 4))
      var month = Number(date.substr(4, 2))
      var day = Number(date.substr(6, 2))
      var fecha = new Intl.DateTimeFormat("es-mx", {
         year: "numeric",
         month: "2-digit",
         day: "2-digit",
      }).format(new Date(year, month - 1, day));
      return fecha;
   } else {
      return null;
   }
};

/**
 * Formatea la fecha para ponerla en un formato correcto
 * @param {*} date 
 * @returns 
 */
export const dateFormatPLD = (date) => {
   if (date !== "") {
      let year = date.substring(0, 4);
      let month = date.substring(4, 6);
      let day = date.substring(6);
      let fecha = month + "/" + day + "/" + year;
      return fecha;
   } else {
      return null;
   }
};

// Método que obtiene la latitud y longitud
export const getLatitudLongitud = async () => {
   return new Promise((resolve) => {
      let respuesta = {
         latitud: "22.085065",
         longitud: "-100.931659",
         mensaje: "",
         code: 0,
      };

      if (global.Constants.ubicacion) {
         navigator.geolocation.getCurrentPosition(
            (position) => {
               const latitud = position.coords.latitude.toString();
               const longitud = position.coords.longitude.toString();

               respuesta.latitud = latitud;
               respuesta.longitud = longitud;
               resolve(respuesta);
            },
            (error) => {
               switch (error.code) {
                  case error.PERMISSION_DENIED:
                     respuesta.code = 3001;
                     respuesta.mensaje =
                        "El usuario denegó el permiso para acceder a la ubicación.";
                     break;
                  case error.POSITION_UNAVAILABLE:
                     respuesta.code = 3002;
                     respuesta.mensaje =
                        "La información de ubicación no está disponible.";
                     break;
                  case error.TIMEOUT:
                     respuesta.code = 3003;
                     respuesta.mensaje = "La solicitud de ubicación ha expirado.";
                     break;
                  default:
                     respuesta.code = 3004;
                     respuesta.mensaje =
                        "Error desconocido al obtener la ubicación.";
                     break;
               }
               resolve(respuesta);
            }
         );
      } else {
         resolve(respuesta);
      }
   });
};
