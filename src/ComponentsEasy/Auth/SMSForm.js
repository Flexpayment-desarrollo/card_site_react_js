import React,{ useState } from "react";
import LogoInovag from "../../../viewEasy/LogoInovag";
import  Alert from '../../../Global/Alert';
import { emailValid, codeValid } from '../../../Global/Expressions';
import { getImage } from "./Confirmation/ConfirmationSMS";

const SMSForm = () =>{
   const [user, setUser] = useState({
      email: '',
      code: ''
   });

   const handleChange = (event) =>{      
      const { name, value } = event.target;
      setUser(
         (prevState) =>{
            return{
               ...prevState,
               [name]: value
            }
         }
      );
   }

   const confirmation = async (e) =>{
      e.preventDefault();
      try {
         if(emailValid(user.email.trim())){
            if(codeValid(user.code.trim())){
               getImage();
            }            
         }
      } catch (error) {
         setMessage({
            isShow: true,
            text: error.name +' '+error.message,
            type: 'danger',
            action: 'show'
         });
      }
   }

   const { email,code } = user;
   return(
      <form className="form">
         <LogoInovag/>
         <div className="form-content">
            {
               message.isShow ? <Alert alert={message.type} show={message.action} message={message.text} /> : ''
            }
            <div className="form-group mt-3">
               <input type="email" name="email" className="form-control mt-1" placeholder="Ingresar correo electrónico" value={email} onChange={handleChange} required/>
            </div>
            <div className="form-group mt-3">
               <input type="text" name="code" className="form-control mt-1" placeholder="Ingrese código SMS" maxLength={6} value={code} onChange={handleChange} required/>
            </div>
            <div className="d-grid gap-2 mt-3 mb-3">
               <button type="submit" className="btn btn-primary" onClick={confirmation}> Enviar </button>
            </div>
         </div>
      </form>
   )
}

export default SMSForm;