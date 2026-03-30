import React, { useState } from "react";
import routes from "routes";
import theme from "assets/theme";
import Error from "components/Views/PageError";
import FormEmail from "components/Views/Auth/Authentication/FormEmail";
import Analytics from "layouts/dashboards/analytics";
import MenuNew from "components/Views/Menu";
import View_Card from "viewV2/Client/List/View_Cards";
import ProtectedRoute from "components/Views/Auth/Authentication/ProtectedRoute";
import ConfirmationSMS from "components/Views/Auth/Confirmation/ConfirmationSMS";
import Confirmation from "components/Views/Auth/Confirmation/Confirmation";
import BrokenLink from "components/Views/Auth/BrokenLink";
import RecoverSMS from "components/Views/Auth/RecoverPassword/RecoverSMS";
import Recover from "components/Views/Auth/RecoverPassword/Recover";
import RecoverPassword from "components/Views/Auth/RecoverPassword/RecoverPassword";
import { useMaterialUIController } from "context";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

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
               <Route path="Client" element={<View_Card reloadMenu={reloadMenu} />} />
               <Route exact path="/dashboards/analytics" element={<Analytics />} key="analytics" />
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
                     <ProtectedRoute userLogin={userLogin}>
                        <RecoverSMS userLogin={userLogin} />
                     </ProtectedRoute>
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