import MDAvatar from "components/MDAvatar";
import Sidenav from "examples/Sidenav";
import LogoutIcon from '@mui/icons-material/Logout';
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import DomainIcon from '@mui/icons-material/Domain';
import VerifiedIcon from '@mui/icons-material/Verified';
import BadgeIcon from '@mui/icons-material/Badge';
import { setMiniSidenav } from "context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMaterialUIController } from "context";
import { deleteStorage } from "Global/Expressions";
import { AccountTree, AddCard, Assessment, CreditCard, CreditScore, DeliveryDining, FactCheck, FactCheckRounded, ManageAccounts, MonetizationOn, Payments, PersonAdd } from "@mui/icons-material";

const MenuNew = () => {
    const navigate = useNavigate(); // react-router-dom v6
    const [controller, dispatch] = useMaterialUIController();
    const {
        miniSidenav,
        sidenavColor,
        transparentSidenav,
        whiteSidenav,
        darkMode,
    } = controller;
    const [onMouseEnter, setOnMouseEnter] = useState(false);
    const [listMenu, setListMenu] = useState([]);

    useEffect(() => {
        getMenu()
    }, []);

    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            setMiniSidenav(dispatch, false);
            setOnMouseEnter(true);
        }
    };

    // Close sidenav when mouse leave mini sidenav
    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setMiniSidenav(dispatch, true);
            setOnMouseEnter(false);
        }
    };

    const chooseIcon = (icon) => {
        switch (icon) {
            case "Prospectos":
                return <PersonAdd />;
            case "Empresas":
                return <DomainIcon />;
            case "Tarjetas":
                return <CreditCard />;
            case "Recursos Humanos":
                return <ManageAccounts />;
            case "Monedero":
                return <AddCard size={23} />;
            default:
                return <FactCheck />;
        }
    }

    async function getMenu() {
        //Se limpia el menu
        setListMenu([]);
        const rutasMenu = [];

        ///Obtenemos el menu
        // if (sessionStorage.length !== 0) {
        //     var Authentication = JSON.parse(sessionStorage.getItem('Authentication'));
        //     if (Authentication !== null) {
        rutasMenu.push({
            type: "collapse",
            name: "Prueba",
            key: "usuario",
            route: "/Cards",
            icon: <MDAvatar src={"data:image/png;base64,"} alt="Brooklyn Alice" size="md" />,
            noCollapse: true,
        });

        // Authentication.menu.map(principal => {
        //     const collapse = [];
        //     principal.map((item) => {
        //         if (item.menu === "") {
        rutasMenu.push({
            type: "collapse",
            name: "Tarjetas",
            // key: item.idModulo,
                route: "/Cards",
            icon: chooseIcon(),
            noCollapse: true,
        });
        rutasMenu.push({
            type: "collapse",
            name: "Transferencias",
            // key: item.idModulo,
            // route: item.url,
            icon: chooseIcon(),
            noCollapse: true,
        });
        // } else {
        //     collapse.push({
        //         name: item.modulo,
        //         key: item.idModulo,
        //         route: item.url,
        //     });
        // }
        // });

        // if (principal[0].menu !== "") {

            // rutasMenu.push({
            //     type: "collapse",
            //     // name: principal[0].menu,
            //     // key: principal[0].idModulo,
            //     // icon: chooseIcon(principal[0].menu),
            //     collapse: collapse
            // });
        // }
        // });

        //Agregamos el salir
        rutasMenu.push({
            type: "salir",
            name: "Salir",
            key: "salir",
            icon: <LogoutIcon fontSize="medium">receipt_long</LogoutIcon>,
            noCollapse: true,
        });
        setListMenu(rutasMenu);
        // } else {
        //     deleteStorage();
        //     setListMenu([]);
        //     navigate("/SignIn")
        // }
        // }
    }

    return (
        <>
            {/* {
                sessionStorage.length !== 0 ? */}
                    <Sidenav
                        color={sidenavColor}
                        brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                        brandName="Easy Transfer"
                        routes={listMenu}
                        onMouseEnter={handleOnMouseEnter}
                        onMouseLeave={handleOnMouseLeave}
                    />
                    {/* : null
            } */}
        </>
    );
}


export default MenuNew;
