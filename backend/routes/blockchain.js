const router = require('express').Router();
const ContratoCurso = require('../blockchain/abis/ContratoCurso.json');




router.route("/obtener-contrato")
.post(function(req, res){
    const ganache = 5777;

    const abi = ContratoCurso.abi;
    const address = ContratoCurso.networks[ganache].address; 

    res.json({contrato: ContratoCurso, abi: abi, address: address}); 
});





module.exports = router;