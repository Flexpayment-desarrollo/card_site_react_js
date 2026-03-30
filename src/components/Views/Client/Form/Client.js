import React, { useState } from "react";
import dayjs from "dayjs";
import Alert from "../../../../Global/Alert";
import Loading from "../../../../Global/Loading";
import NationalityDic from "../../Prospect/NationalityDic";
import StateDic from "../../Prospect/StateDic";
import IdentificationDic from "../../Prospect/IdentificationDic";
import ResponsibleType from "../../Prospect/ResponsibleType";
import EconomicActivityAut from "../../Prospect/EconomicActivityAut";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import FormField from "layouts/pages/account/components/FormField";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClientLabel } from "Global/ClientLabel";
import { getCity } from "../../Prospect/Repository/CityDicServices";
import { getColony } from "../../Prospect/Repository/ColonyDicServices";
import { ModalConfirmation } from "../../../../Global/ModalConfirmation";
import { getClient, saveChangesClient } from "../Services/ClientRepository";
import { Grid, Card, Autocomplete, Tooltip, IconButton } from "@mui/material";
import { alphanumericSpaceValid, alphanumericValid, dateFormat, deleteStorage, emailValidForm, numericValid } from "../../../../Global/Expressions";

const Clients = {
   IdTipoPersona: 0,
   TipoPersona: String,
   Alias: String,
   RFC: String,
   RazonSocial: String,
   FechaEmpresa: String,
   Paterno: String,
   Materno: String,
   Nombre: String,
   FechaNacimiento: String,
   Curp: String,
   IdGenero: 0,
   IdNacionalidad: 0,
   IdTipoResponsable: 0,
   Responsable: String,
   Direccion: String,
   Exterior: String,
   IdCP: Number,
   Telefono: Number,
   Interior: String,
   IdTipoIdentificacion: 0,
   NoIdentificacion: String,
   IdActividadEconomica: 0,
   Email: String,
   Comentario: String
}

const Client = ({ cumplimiento }) => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [clientValue, setClientValue] = useState(Clients);
   const [stateDic, setStateDic] = useState("");
   const [cityDic, setCityDic] = useState("");
   const [cityList, setCityList] = useState([]);
   const [colonyList, setColonyList] = useState([]);
   const [defaultIdCP, setDefaultIdCP] = useState({ id: 0, label: "" })
   const [defaultIdNacionalidad, setDefaultIdNacionalidad] = useState({ id: 0, label: "" })
   const [defaultTipoRespon, setDefaultTipoRespon] = useState({ id: 0, label: "" })
   const [defaultTipoIdent, setDefaultTipoIdent] = useState({ id: 0, label: "" })
   const [dateBirth, setDateBirth] = useState(dayjs(new Date()));
   const [dateCompany, setDateCompany] = useState(dayjs(new Date()));
   const [loading, setLoading] = useState(true);
   const [inputValue, setInputValue] = useState("");
   const [modalConfirmacionGuardar, setModalConfirmacionGuardar] = useState(false);
   const [message, setMessage] = useState({
      isShow: false
   });
   const [errorFlag, setErrorFlag] = useState({
      tipoPersona: false,
      alias: false,
      aliasMsg: "",
      rfc: false,
      rfcMsg: "",
      aPaterno: false,
      aPaternoMsg: "",
      aMaterno: false,
      aMaternoMsg: "",
      nombre: false,
      nombreMsg: "",
      genero: false,
      generoMsg: "",
      curp: false,
      curpMsg: "",
      razon: false,
      razonMsg: "",
      direccion: false,
      direccionMsg: "",
      exterior: false,
      exteriorMsg: "",
      estado: false,
      estadoMsg: "",
      municipio: false,
      municipioMsg: "",
      colonia: false,
      coloniaMsg: "",
      tipoRespon: false,
      tipoResponMsg: "",
      responsable: false,
      responsableMsg: "",
      nacionalidad: false,
      nacionalidadMsg: "",
      tipoIdent: false,
      tipoIdentMsg: "",
      noIdent: false,
      noIdentMsg: "",
      tel: false,
      telMsg: "",
      telMssg: '',
      actEconomica: false,
      actEconomicaMsg: "",
      email: false,
      emailMssg: '',
   });

   useEffect(() => {
      getClientValue();
   }, []);

   const getClientValue = async () => {
      setLoading(true)
      await getClient(id).then((result) => {
         if (result.code === 0) {
            setStateDic(result.data.estado);
            getCityList(result.data.estado);
            setCityDic(result.data.municipio);
            getColonyList(result.data.estado, result.data.municipio);
            setDateBirth(dayjs(new Date(result.data.fechaNacimiento)));
            setDateCompany(dayjs(new Date(result.data.fechaEmpresa)));
            setDefaultIdCP({ id: result.data.idCP, label: result.data.colonia + " - " + result.data.cp })
            setDefaultIdNacionalidad({ id: result.data.idNacionalidad, label: result.data.nacionalidad })
            setDefaultTipoRespon({ id: result.data.idTipoResponsable, label: result.data.tiporesponsable })
            setDefaultTipoIdent({ id: result.data.idTipoIdentificacion, label: result.data.identificacion })
            setClientValue({
               ID: result.data.id,
               IdTipoPersona: result.data.idTipoPersona,
               TipoPersona: result.data.tipopersona,
               Alias: result.data.alias,
               RFC: result.data.rfc,
               RazonSocial: result.data.razonSocial,
               FechaEmpresa: result.data.fechaEmpresa,
               Paterno: result.data.paterno,
               Materno: result.data.materno,
               Nombre: result.data.nombre,
               FechaNacimiento: result.data.fechaNacimiento,
               Curp: result.data.curp,
               IdGenero: result.data.idGenero === null ? 0 : result.data.idGenero,
               Genero: result.data.genero,
               IdNacionalidad: result.data.idNacionalidad,
               IdTipoResponsable: result.data.idTipoResponsable,
               Responsable: result.data.responsable,
               Direccion: result.data.direccion,
               Exterior: result.data.exterior,
               IdCP: result.data.idCP,
               Telefono: result.data.telefono,
               Interior: result.data.interior,
               IdTipoIdentificacion: result.data.idTipoIdentificacion,
               NoIdentificacion: result.data.noidentificacion,
               IdActividadEconomica: result.data.idActividadEconomica,
               Email: result.data.email,
               Comentario: result.data.comentario
            });
            setInputValue(result.data.actividadeconomica);
         }
      }).catch((err) => {
         setLoading(false);
         if (err.response.status === 401) {
            if (err.response.data.code === 2011) {
               deleteStorage();
               navigate('/SignIn');
            } else {
               setMessage({
                  text: err.message,
                  type: 'danger',
                  isShow: true
               });
            }
         }
      });
   }

   /**Método que trae la lista de las ciudades en base al estado que seleccione el usuario*/
   async function getCityList(estado) {
      setLoading(true);
      await getCity(estado)
         .then((data) => {
            setLoading(false)
            if (data.code === 0) {
               if (data.data !== null) {
                  setCityList(data.data);
               }
            } else {
               setMessage({
                  isShow: true,
                  text: data.businessMeaning,
                  type: "danger",
               });
            }
         })
         .catch((error) => {
            setLoading(false)
            if (error.response.status === 401) {
               if (error.response.data.code === 2011) {
                  deleteStorage();
                  navigate("/SignIn");
               } else {
                  setMessage({
                     text: error.message,
                     type: "danger",
                     isShow: true,
                  });
               }
            }
         });
   }

   /**Método que trae la lista de las colonias en base al estado y ciudad que seleccione el usuario*/
   async function getColonyList(estado, ciudad) {
      setLoading(true)
      await getColony(estado, ciudad)
         .then((data) => {
            setLoading(false)
            if (data.code === 0) {
               if (data.data !== null) {
                  var rows = [];
                  data.data.forEach(data => {
                     let jsonData = {
                        id: data.code,
                        label: data.name,
                     };
                     rows.push(jsonData);
                  });
                  setColonyList(rows);
               }
            } else {
               setMessage({
                  isShow: true,
                  text: data.businessMeaning,
                  type: "danger",
               });
            }
         })
         .catch((error) => {
            setLoading(false)
            if (error.response.status === 401) {
               if (error.response.data.code === 2011) {
                  deleteStorage();
                  navigate("/SignIn");
               } else {
                  setMessage({
                     text: error.message,
                     type: "danger",
                     isShow: true,
                  });
               }
            }
         });
   }

   /*Método para validar que no haya errores en el formulario y si todo esta bien abrir el modal de confirmación*/
   const confirmar = (e) => {
      e.preventDefault();
      let validation = validateForm()
      if (validation)
         setModalConfirmacionGuardar(true);
   };

   const handleChange = (event) => {
      const { name, value } = event.target;
      setClientValue({
         ...clientValue,
         [name]: value
      });
   };

   const handleChangeSelect = (event, newValue) => {
      const { id } = event.target;
      let name = id.split("-")[0]
      switch (name) {
         case "IdActividadEconomica":
            setClientValue({
               ...clientValue,
               IdActividadEconomica: parseInt(newValue !== null ? newValue.id : 0)
            })
            break;
         case "IdTipoIdentificacion":
            setClientValue({
               ...clientValue,
               IdTipoIdentificacion: parseInt(newValue.id)
            })
            setDefaultTipoIdent(newValue)
            break;
         case "IdTipoResponsable":
            setClientValue({
               ...clientValue,
               IdTipoResponsable: parseInt(newValue.id)
            })
            setDefaultTipoRespon(newValue)
            break;
         case "IdNacionalidad":
            setClientValue({
               ...clientValue,
               IdNacionalidad: parseInt(newValue.id)
            })
            setDefaultIdNacionalidad(newValue)
            break;
         case "ddlState":
            setStateDic(newValue)
            setCityDic("")
            getCityList(newValue);
            setColonyList([{ id: 0, label: '' }])
            setDefaultIdCP({ id: 0, label: '' })
            setClientValue({
               ...clientValue,
               IdCP: 0
            })
            break;
         case "ddlCity":
            setCityDic(newValue);
            setDefaultIdCP({ id: 0, label: '' })
            getColonyList(stateDic, newValue);
            setClientValue({
               ...clientValue,
               IdCP: 0
            })
            break
         case "IdCP":
            setClientValue({
               ...clientValue,
               IdCP: newValue.id
            })
            setDefaultIdCP(newValue)
            break;
         default:
            break;
      }
   }

   /*Método para cerrar el modal pero antes confirmar si lo quiere cerrar o no*/
   const handleCloseConfirmar = (e) => {
      if (e.target.name === "yesBtn") {
         setModalConfirmacionGuardar(false);
         saveChanges();
      } else {
         if (e.target.name === "noBtn") {
            setModalConfirmacionGuardar(false);
         }
      }
   };

   /*Método que guarda un cliente*/
   const saveChanges = async () => {
      setLoading(true);
      await saveChangesClient(clientValue).then((data) => {
         setLoading(false);
         if (data.code === 0) {
            setMessage({
               text: "Información actualizada",
               type: 'success',
               isShow: true
            });
         } else {
            setMessage({
               isShow: true,
               text: data.businessMeaning,
               type: "danger",
            });
         }
      }).catch((error) => {
         setLoading(false);
         if (error.response.status === 401) {
            if (error.response.data.code === 2011) {
               deleteStorage();
               navigate("/SignIn");
            } else {
               setMessage({
                  text: error.message,
                  type: "danger",
                  isShow: true,
               });
            }
         }
      })
   }

   const handleChangeAlphanumericSpace = (event) => {
      const { name, value } = event.target;
      if (value !== "" && !alphanumericSpaceValid(value.toString()))
         return;

      setClientValue(
         (prevState) => {
            return {
               ...prevState,
               [name]: value
            }
         }
      );
   }

   const handleChangeTel = (event) => {
      const { value } = event.target;

      if (value !== "" && !numericValid(value.toString()))
         return;
      setClientValue(
         (prevState) => {
            return {
               ...prevState,
               ['Telefono']: value
            }
         }
      );
   };

   const handleChangeAlphanumeric = (event) => {
      const { name, value } = event.target;
      if (value !== "" && !alphanumericValid(value))
         return;

      setClientValue(
         (prevState) => {
            return {
               ...prevState,
               [name]: value
            }
         }
      );
   }

   const onInputChangeAutocomplete = (event, newInputValue) => {
      if (event !== null) {
         if (event.target.value === "")
            setClientValue({
               ...clientValue,
               ["IdActividadEconomica"]: parseInt(0)
            });
      }
      if (event === null) return;
      setInputValue(newInputValue);
   }

   /*Método que valida el formulario*/
   const validateForm = () => {
      let valid = true
      let errorTemp = {
         tipoPersona: false,
         alias: false,
         aliasMsg: "",
         rfc: false,
         rfcMsg: "",
         aPaterno: false,
         aPaternoMsg: "",
         aMaterno: false,
         aMaternoMsg: "",
         nombre: false,
         nombreMsg: "",
         genero: false,
         generoMg: "",
         curp: false,
         curpMsg: "",
         razon: false,
         razonMsg: "",
         direccion: false,
         direccionMsg: "",
         exterior: false,
         exteriorMsg: "",
         estado: false,
         estadoMsg: "",
         municipio: false,
         municipioMsg: "",
         colonia: false,
         coloniaMsg: "",
         tipoRespon: false,
         tipoResponMsg: "",
         responsable: false,
         responsableMsg: "",
         nacionalidad: false,
         nacionalidadMsg: "",
         tipoIdent: false,
         tipoIdentMsg: "",
         noIdent: false,
         noIdentMsg: "",
         tel: false,
         telMssg: '',
         actEconomica: false,
         actEconomicaMsg: "",
         email: false,
         emailMssg: ''
      }
      if (typeof (clientValue.Alias) === 'function' || clientValue.Alias === "") {
         errorTemp.alias = true;
         errorTemp.aliasMsg = "Alias no puede estar vacío";
         valid = false;
      }
      if (stateDic === "") {
         errorTemp.estado = true;
         errorTemp.estadoMsg = "Selecciona un estado";
         valid = false;
      }
      if (cityDic === "") {
         errorTemp.municipio = true;
         errorTemp.municipioMsg = "Selecciona un municipio";
         valid = false;
      }
      if (typeof (clientValue.IdCP) === 'function' || clientValue.IdCP === 0) {
         errorTemp.colonia = true;
         errorTemp.coloniaMsg = "Selecciona una colonia";
         valid = false;
      }
      if (typeof (clientValue.Direccion) === 'function' || clientValue.Direccion === "") {
         errorTemp.direccion = true;
         errorTemp.direccionMsg = "Debes ingresar una dirección"
         valid = false;
      }
      if (typeof (clientValue.Exterior) === 'function' || clientValue.Exterior === "") {
         errorTemp.exterior = true;
         errorTemp.exteriorMsg = "Exterior no puede estar vacío"
         valid = false;
      }
      if (typeof (clientValue.Telefono) === 'function' || clientValue.Telefono === 0 || clientValue.Telefono.length !== 10) {
         errorTemp.tel = true;
         errorTemp.telMssg = "La longitud debe ser de 10 caracteres"
         valid = false;
      }
      if (typeof (clientValue.Email) === 'function' || clientValue.Email === "" || !emailValidForm(clientValue.Email.trim())) {
         errorTemp.email = true;
         errorTemp.emailMssg = "Email no válido"
         valid = false;
      }
      if (clientValue.IdTipoResponsable === 0) {
         errorTemp.tipoRespon = true;
         errorTemp.tipoResponMsg = "Debes seleccionar un tipo responsable"
         valid = false;
      }
      if (typeof (clientValue.Responsable) === 'function' || clientValue.Responsable === "") {
         errorTemp.responsable = true;
         errorTemp.responsableMsg = "Responsable no puede estar vacío"
         valid = false;
      }
      if (clientValue.IdTipoIdentificacion === 0) {
         errorTemp.tipoIdent = true;
         errorTemp.tipoIdentMsg = "Debes seleccionar un tipo de identificación"
         valid = false;
      }
      if (typeof (clientValue.NoIdentificacion) === 'function' || clientValue.NoIdentificacion === "") {
         errorTemp.noIdent = true;
         errorTemp.noIdentMsg = "Número de identificación no puede estar vacío"
         valid = false;
      }
      if (clientValue.IdNacionalidad === 0) {
         errorTemp.nacionalidad = true;
         errorTemp.nacionalidadMsg = "Debes seleccionar una nacionalidad"
         valid = false;
      }
      if (clientValue.IdActividadEconomica === 0) {
         errorTemp.actEconomica = true;
         errorTemp.actEconomicaMsg = "Debes seleccionar una actividad económica"
         valid = false;
      }
      setErrorFlag(errorTemp)
      return valid
   }

   /** Metodo que limpia los mensajes */
   const clearMessage = () => {
      setMessage({
         isShow: false,
      });
   };

   const { TipoPersona, Alias, RFC, RazonSocial, Paterno, Materno, Nombre, Curp, Genero, Responsable, Direccion, Exterior, Interior, Telefono, NoIdentificacion, IdActividadEconomica, Email, Comentario, IdNacionalidad } = clientValue;
   return (
      <>
         {loading && <Loading show={loading} />}
         {message.isShow && <Alert alert={message.type} message={message.text} onClose={clearMessage} open={message.isShow} />}
         {modalConfirmacionGuardar && <ModalConfirmation showModal={modalConfirmacionGuardar} tipoModal={false} message="¿Estás seguro de guardar los cambios?" closeModal={handleCloseConfirmar}></ModalConfirmation>}
         <Grid container pb={3} display="flex">
            <Grid item mr={1}>
               <Tooltip placement="top" title="Regresar">
                  <IconButton onClick={() => navigate('/Client')} sx={{ background: '#ebebeb', borderColor: 'black', color: "#41464b" }}>
                     <ArrowBackIcon />
                  </IconButton>
               </Tooltip>
            </Grid>
            <Grid item xs={11} sm={11} mt={1}>
               <MDTypography variant="h5">Información del Cliente: <ClientLabel /></MDTypography>
            </Grid>
         </Grid>
         <Grid container spacing={3}>
            <Grid item xs={12}>
               <Grid container spacing={3}>
                  <Grid item xs={12}>
                     <Card id="basic-info" sx={{ overflow: "visible" }}>
                        <Grid container p={3} spacing={3}>
                           <Grid item xs={12} sm={12}>
                              <MDTypography variant="h6">Datos Fiscales</MDTypography>
                           </Grid>
                           <Grid item xs={6} sm={6}>
                              <FormField
                                 error={errorFlag.tipoPersona}
                                 name="TipoPersona"
                                 label="Tipo de Persona"
                                 fullWidth
                                 value={TipoPersona}
                                 disabled
                              />
                           </Grid>
                           {
                              clientValue.IdTipoPersona === 0 ?
                                 null
                                 : clientValue.IdTipoPersona === 1 ?
                                    <>
                                       <Grid item xs={clientValue.IdTipoPersona === 2 ? 6 : 6} sm={clientValue.IdTipoPersona === 2 ? 6 : 6}>
                                          <FormField
                                             error={errorFlag.rfc}
                                             name="RFC"
                                             label="RFC"
                                             fullWidth
                                             value={RFC}
                                             onChange={handleChange}
                                             disabled
                                          />
                                       </Grid>
                                       <Grid item xs={3} sm={3}>
                                          <FormField
                                             error={errorFlag.nombre}
                                             name="Nombre"
                                             label="Nombre"
                                             fullWidth
                                             value={Nombre}
                                             disabled
                                          />
                                       </Grid>
                                       <Grid item xs={3} sm={3}>
                                          <FormField
                                             error={errorFlag.aPaterno}
                                             name="Paterno"
                                             label="Apellido Paterno"
                                             fullWidth
                                             value={Paterno}
                                             disabled
                                          />
                                       </Grid>
                                       <Grid item xs={3} sm={3}>
                                          <FormField
                                             error={errorFlag.aMaterno}
                                             name="Materno"
                                             label="Apellido Materno"
                                             fullWidth
                                             value={Materno}
                                             disabled
                                          />
                                       </Grid>
                                       <Grid item xs={3} sm={3}>
                                          <FormField
                                             error={errorFlag.genero}
                                             name="Genero"
                                             label="Género"
                                             fullWidth
                                             value={Genero}
                                             disabled
                                          />
                                       </Grid>
                                       <Grid item xs={6} sm={6}>
                                          <FormField
                                             name="FechaNacimiento"
                                             label="Fecha Nacimiento"
                                             fullWidth
                                             value={dateFormat(dateBirth)}
                                             disabled
                                          />
                                       </Grid>
                                       <Grid item xs={6} sm={6}>
                                          <FormField
                                             error={errorFlag.curp}
                                             name="Curp"
                                             label="CURP"
                                             fullWidth
                                             value={Curp}
                                             disabled
                                          />
                                       </Grid>
                                    </>
                                    :
                                    <>
                                       <Grid item xs={clientValue.IdTipoPersona === 2 ? 6 : 3} sm={clientValue.IdTipoPersona === 2 ? 6 : 3}>
                                          <FormField
                                             error={errorFlag.rfc}
                                             name="RFC"
                                             label="RFC"
                                             fullWidth
                                             value={RFC}
                                             onChange={handleChange}
                                             disabled
                                          />
                                       </Grid>
                                       <Grid item xs={6} sm={6}>
                                          <FormField
                                             error={errorFlag.razon}
                                             name="RazonSocial"
                                             label="Razón Social"
                                             fullWidth
                                             value={RazonSocial}
                                             disabled />
                                       </Grid>
                                       <Grid item xs={6} sm={6}>
                                          <FormField
                                             error={errorFlag.alias}
                                             helperText={errorFlag.aliasMsg}
                                             name="FechaEmpresa"
                                             label="Fecha Constitución"
                                             fullWidth
                                             value={dateFormat(dateCompany)}
                                             disabled />
                                       </Grid>
                                    </>
                           }
                           <Grid item xs={clientValue.IdTipoPersona === 2 ? 12 : 12} sm={clientValue.IdTipoPersona === 2 ? 12 : 12}>
                              <FormField
                                 disabled={cumplimiento}
                                 error={errorFlag.alias}
                                 helperText={errorFlag.aliasMsg}
                                 name="Alias"
                                 label="Alias"
                                 inputProps={{ maxLength: 50 }}
                                 fullWidth
                                 value={Alias}
                                 onChange={handleChangeAlphanumericSpace}
                                 required />
                           </Grid>
                        </Grid>
                     </Card>
                  </Grid>
               </Grid>
               <Grid container spacing={3} mt={2}>
                  <Grid item xs={12}>
                     <Card id="basic-info" sx={{ overflow: "visible" }}>
                        <Grid container p={3} spacing={3}>
                           <Grid item xs={12} sm={12}>
                              <MDTypography variant="h6">Información Complementaria</MDTypography>
                           </Grid>
                           <Grid item xs={3} sm={3}>
                              <StateDic
                                 error={errorFlag.estado}
                                 helperText={errorFlag.estadoMsg}
                                 value={stateDic}
                                 onChange={handleChangeSelect}
                                 cumplimiento={cumplimiento} />
                           </Grid>
                           <Grid item xs={3} sm={3}>
                              <Autocomplete
                                 value={cityDic}
                                 id="ddlCity"
                                 options={cityList}
                                 onChange={handleChangeSelect}
                                 renderInput={(params) => (
                                    <FormField {...params}
                                       required
                                       error={errorFlag.municipio}
                                       helperText={errorFlag.municipioMsg}
                                       label="Municipio"
                                       InputLabelProps={{ shrink: true }}
                                       disabled={cumplimiento}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid item xs={3} sm={3}>
                              <Autocomplete
                                 value={defaultIdCP}
                                 id="IdCP"
                                 options={colonyList}
                                 onChange={handleChangeSelect}
                                 renderInput={(params) => (
                                    <FormField {...params}
                                       required
                                       error={errorFlag.colonia}
                                       helperText={errorFlag.coloniaMsg}
                                       label="Colonia"
                                       InputLabelProps={{ shrink: true }}
                                       disabled={cumplimiento}
                                    />
                                 )}
                              />
                           </Grid>
                           <Grid item xs={3} sm={3}>
                              <FormField
                                 error={errorFlag.direccion}
                                 helperText={errorFlag.direccionMsg}
                                 name="Direccion"
                                 label="Domicilio"
                                 inputProps={{ maxLength: 30 }}
                                 fullWidth
                                 value={Direccion}
                                 onChange={handleChangeAlphanumericSpace}
                                 required
                                 disabled={cumplimiento}
                              />
                           </Grid>
                           <Grid item xs={3} sm={3}>
                              <FormField
                                 error={errorFlag.exterior}
                                 helperText={errorFlag.exteriorMsg}
                                 name="Exterior"
                                 label="Exterior"
                                 inputProps={{ maxLength: 10 }}
                                 fullWidth
                                 value={Exterior}
                                 onChange={handleChangeAlphanumericSpace}
                                 required
                                 disabled={cumplimiento}
                              />
                           </Grid>
                           <Grid item xs={3} sm={3}>
                              <FormField
                                 name="Interior"
                                 inputProps={{ maxLength: 10 }}
                                 label="Interior"
                                 fullWidth
                                 value={Interior}
                                 onChange={handleChangeAlphanumericSpace}
                                 disabled={cumplimiento}
                              />
                           </Grid>
                           <Grid item xs={3} sm={3}>
                              <FormField
                                 error={errorFlag.tel}
                                 name="Telefono"
                                 label="Telefono"
                                 fullWidth
                                 value={Telefono}
                                 inputProps={{ maxLength: 10 }}
                                 onChange={handleChangeTel}
                                 helperText={errorFlag.telMssg}
                                 required
                                 disabled={cumplimiento}
                              />
                           </Grid>
                           <Grid item xs={3} sm={3}>
                              <FormField
                                 error={errorFlag.email}
                                 inputProps={{ maxLength: 50 }}
                                 name="Email"
                                 type="email"
                                 label="Correo"
                                 fullWidth
                                 value={Email}
                                 onChange={handleChange}
                                 helperText={errorFlag.emailMssg}
                                 required
                                 disabled={cumplimiento}
                              />
                           </Grid>
                           <Grid item xs={3} sm={3}>
                              <ResponsibleType
                                 error={errorFlag.tipoRespon}
                                 helperText={errorFlag.tipoResponMsg}
                                 value={defaultTipoRespon}
                                 onChange={handleChangeSelect}
                                 cumplimiento={cumplimiento}
                              />
                           </Grid>
                           <Grid item xs={3} sm={3}>
                              <FormField
                                 error={errorFlag.responsable}
                                 helperText={errorFlag.responsableMsg}
                                 inputProps={{ maxLength: 50 }}
                                 name="Responsable"
                                 label="Nombre del Responsable"
                                 fullWidth
                                 value={Responsable}
                                 onChange={handleChangeAlphanumericSpace}
                                 required
                                 disabled={cumplimiento}
                              />
                           </Grid>
                           <Grid item xs={3} sm={3}>
                              <IdentificationDic
                                 error={errorFlag.tipoIdent}
                                 helperText={errorFlag.tipoIdentMsg}
                                 value={defaultTipoIdent}
                                 onChange={handleChangeSelect}
                                 cumplimiento={cumplimiento}
                              />
                           </Grid>
                           <Grid item xs={3} sm={3}>
                              <FormField
                                 error={errorFlag.noIdent}
                                 helperText={errorFlag.noIdentMsg}
                                 inputProps={{ maxLength: 25 }}
                                 name="NoIdentificacion"
                                 label="No Identificación"
                                 fullWidth
                                 value={NoIdentificacion}
                                 onChange={handleChangeAlphanumeric}
                                 required
                                 disabled={cumplimiento}
                              />
                           </Grid>
                           <Grid item xs={3} sm={3}>
                              <NationalityDic
                                 error={errorFlag.nacionalidad}
                                 helperText={errorFlag.nacionalidadMsg}
                                 value={defaultIdNacionalidad}
                                 onChange={handleChangeSelect}
                                 cumplimiento={cumplimiento}
                              />
                           </Grid>
                           <Grid item xs={9} sm={9}>
                              <EconomicActivityAut
                                 error={errorFlag.actEconomica}
                                 helperText={errorFlag.actEconomicaMsg}
                                 input={inputValue}
                                 onInputChange={onInputChangeAutocomplete}
                                 value={IdActividadEconomica}
                                 onChange={handleChangeSelect}
                                 cumplimiento={cumplimiento}
                              />
                           </Grid>
                           <Grid item xs={12} sm={12}>
                              <FormField
                                 name="Comentario"
                                 inputProps={{ maxLength: 200 }}
                                 label="Comentario"
                                 size="small"
                                 fullWidth
                                 value={Comentario}
                                 onChange={handleChangeAlphanumericSpace}
                                 disabled={cumplimiento}
                              />
                           </Grid>
                        </Grid>
                     </Card>
                  </Grid>
               </Grid>
               {cumplimiento === false ?
                  <Grid container pt={3} display="flex" alignItems="flex-end" style={{ textAlign: "right" }}>
                     <Grid item xs={12} sm={12}>
                        <MDButton type="button" variant="gradient" color="info" size="small"
                           onClick={confirmar}>
                           Guardar
                        </MDButton>
                     </Grid>
                  </Grid>
                  : null
               }
            </Grid>
         </Grid>
      </>
   )
}

export default Client;