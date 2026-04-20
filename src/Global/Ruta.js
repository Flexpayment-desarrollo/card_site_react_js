import React, { useState } from "react";
import routes from "routes";
import theme from "assets/theme";
import MenuNew from "View/Menu";
import Error from "View/PageError";
import FormEmail from "View/Auth/Authentication/FormEmail";
import Confirmation from "View/Auth/Confirmation/Confirmation";
import ConfirmationSMS from "View/Auth/Confirmation/ConfirmationSMS";
import ProtectedRoute from "View/Auth/Authentication/ProtectedRoute";
import RecoverSMS from "View/Auth/RecoverPassword/RecoverSMS";
import BrokenLink from "ComponentsEasy/Auth/BrokenLink";
import RecoverPassword from "View/Auth/RecoverPassword/RecoverPassword";
import Recover from "View/Auth/RecoverPassword/Recover";
import View_Card from "View/Card/View_Cards";
import ScreenSuccess from "ComponentsEasy/Auth/ScreenSuccess";
import View_ValidateCode from "View/Auth/Registration/View_ValidateCode";
import { useMaterialUIController } from "context";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Registration } from "View/Auth/Registration/Registration";
import Component_ScreenSuccessRecover from "ComponentsEasy/Auth/Component_ScreenSuccessRecover";

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
               <Route path="SignIn" element={<FormEmail setUserLogin={setUserLogin} />} />
               <Route exact path="/" element={<View_Card reloadMenu={reloadMenu} />} />
               <Route path="Cards" element={<View_Card reloadMenu={reloadMenu} />} />
               <Route path="Registration" element={<Registration reloadMenu={reloadMenu} />} />
               <Route exact path='confirmacion' element={<Confirmation />} />
               <Route exact path='confirmacionSMS'
                  element={
                     <ProtectedRoute userLogin={userLogin}>
                        <ConfirmationSMS userLogin={userLogin} />
                     </ProtectedRoute>
                  }
               />
               <Route exact path='recover_password'
                  element={
                     <ProtectedRoute userLogin={userLogin}>
                        <RecoverPassword userLogin={userLogin} />
                     </ProtectedRoute>
                  } />
               <Route exact path='recover' element={<Recover />} />
               <Route exact path='recoverSMS'
                  element={
                     // <ProtectedRoute userLogin={userLogin}>
                        <RecoverSMS userLogin={userLogin} />
                     // </ProtectedRoute>
                  } />
               <Route exact path='validateCode'
                  element={
                     <View_ValidateCode userLogin={userLogin} />
                  } />
               <Route exact path='success'
                  element={
                     <ScreenSuccess userLogin={userLogin} />
                  } />
                    <Route exact path='successRecover'
                  element={
                     <Component_ScreenSuccessRecover userLogin={userLogin} />
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