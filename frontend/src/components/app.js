import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Direccionamiento from "./Direccionamiento";


function App (){
    return <Router>
         <div>
            <Direccionamiento />
        </div>
    </Router>
}

export default App;