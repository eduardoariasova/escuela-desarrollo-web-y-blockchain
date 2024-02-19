import React from "react";
import {Routes, Route, Outlet} from 'react-router-dom';
// paginas GLOGAL
import Home from "./Home";
import Footer from "./partials/Footer";
import Header from "./partials/Header";


function Direccionamiento(){

    function PlantillaGlobal(){
        return(
            <div>
                <Header />
                    <Outlet />
                <Footer />
            </div>
        )
    }

    return (
        <Routes>
            <Route path="/" element={<PlantillaGlobal />} >
                <Route index element={<Home />}/>
            </Route>
        </Routes>
    );   
}


export default Direccionamiento;