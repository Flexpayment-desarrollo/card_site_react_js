import React, { useState } from "react";
import routes from "routes";
import theme from "assets/theme";
import MenuNew from "View/Menu";
import Error from "View/PageError";
import View_Cards from "View/Card/View_Cards";
import View_FormEmail from "View/Auth/Authentication/View_FormEmail";
import ProtectedRoute from "View/Auth/Authentication/ProtectedRoute";
import BrokenLink from "ComponentsEasy/Auth/BrokenLink";
import View_ValidateCode from "View/Auth/Registration/View_ValidateCode";
import View_ScreenSuccess from "View/Auth/Authentication/View_ScreenSuccess";
import View_RecoverSMS from "View/Auth/RecoverPassword/View_RecoverSMS";
import View_ScreenSuccessRecover from "View/Auth/RecoverPassword/View_ScreenSuccessRecover";
import { useMaterialUIController } from "context";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { View_Registration } from "View/Auth/Registration/View_Registration";
import { View_RegisterCard } from "View/Card/View_RegisterCard";
import { View_Card } from "View/CardDetail/View_Card";
import { View_DispersarMonedero } from "View/Wallet/View_DispersarMonedero";
import { View_TransferCardToCard } from "View/CardDetail/View_TransferCardToCard";
import { View_Transferir } from "View/Card/View_Transferir";
import { View_PreviewTransferencia } from "View/Card/View_PreviewTransferencia";
import { View_SuccessTransfer } from "View/Card/View_SuccessTransfer";

const rutasMenu = [];

const Ruta = () => {

   const [controller, dispatch] = useMaterialUIController();
   const {
      miniSidenav,
      direction,
      layout,
      openConfigurator,
      sidenavColor,
      transparentSidenav,
      whiteSidenav,
      darkMode,
   } = controller;
   const [userLogin, setUserLogin] = useState(null);
   const [refreshKey, setRefreshKey] = useState(0);

   const getRoutes = (allRoutes) => {
      allRoutes.map((route) => {
         if (route.collapse) {
            return getRoutes(route.collapse);
         }
         if (route.route) {
            return <Route exact path={route.route} element={route.component} key={route.key} />;
         }
         return null;
      });
   }

   const reloadMenu = () => {
      setRefreshKey(prevKey => prevKey + 1);
   }

   return (
      <BrowserRouter>
         <ThemeProvider theme={theme}>
            <CssBaseline />
            {layout === "dashboard" && (
               <>
                  <MenuNew key={refreshKey} />
               </>
            )}
            <Routes>
               {getRoutes(routes)}
               <Route exact path="/" element={<View_Cards reloadMenu={reloadMenu} />} />
               <Route path="SignIn" element={<View_FormEmail setUserLogin={setUserLogin} />} />
               <Route path="Cards" element={<View_Cards reloadMenu={reloadMenu} />} />
               <Route path="Card" element={<View_Card reloadMenu={reloadMenu} />} />
               <Route path="RegisterCard" element={<View_RegisterCard reloadMenu={reloadMenu} />} />

               <Route path="Wallet" element={<View_DispersarMonedero reloadMenu={reloadMenu} />} />
               <Route path="TransferCard" element={<View_TransferCardToCard reloadMenu={reloadMenu} />} />
               <Route path="Transfer" element={<View_Transferir reloadMenu={reloadMenu} />} />
               <Route path="Preview" element={<View_PreviewTransferencia reloadMenu={reloadMenu} />} />
               <Route path="SuccessTransfer" element={<View_SuccessTransfer reloadMenu={reloadMenu} />} />

               {/* RUTAS DE INICIO DE SESIÓN */}
               <Route path="Registration" element={<View_Registration reloadMenu={reloadMenu} />} />
               {/* <Route exact path='confirmacionSMS'
                  element={
                     <ProtectedRoute userLogin={userLogin}>
                        <ConfirmationSMS userLogin={userLogin} />
                     </ProtectedRoute>
                  }
               /> */}
               {/* <Route exact path='recover_password'
                  element={
                     <ProtectedRoute userLogin={userLogin}>
                        <RecoverPassword userLogin={userLogin} />
                     </ProtectedRoute>
                  } /> */}
               <Route exact path='recoverSMS'
                  element={
                     // <ProtectedRoute userLogin={userLogin}>
                     <View_RecoverSMS userLogin={userLogin} />
                     // </ProtectedRoute>
                  } />
               <Route exact path='validateCode'
                  element={
                     <View_ValidateCode userLogin={userLogin} />
                  } />
               <Route exact path='success'
                  element={
                     <View_ScreenSuccess userLogin={userLogin} />
                  } />
               <Route exact path='successRecover'
                  element={
                     <View_ScreenSuccessRecover userLogin={userLogin} />
                  } />
               <Route exact path='ErrorLink' element={<BrokenLink />} />
               <Route exact path='dashboard' element={<MenuNew />} />
               {/* Cualquier ruta no declarada te manda al componente Error*/}
               <Route path='*' element={<Error />} />
            </Routes>
         </ThemeProvider>
      </BrowserRouter>
   )
}

export default Ruta;