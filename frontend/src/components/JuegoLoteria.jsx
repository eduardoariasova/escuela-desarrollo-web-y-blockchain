import { useEffect, useState } from 'react';
import Web3 from 'web3';
import axios from 'axios';
var web3 



function JuegoLoteria() {
   
    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState({
        account: '',
        contratoEnBlockchain: "",
        abiContrato: "",
        addressContrato: "",
        cantidadJugadores: 0,
        todosJugadores: []
    });

    const [ganador, setGanador] = useState('');
    

    useEffect(() => {
        
        // función para conectar con metamask: abre ventana extensión para conectar
        async function loadWeb3(){
            window.addEventListener('load', async () => {
            // FORMA1: Modern dapp browsers... - chrome
            if (window.ethereum) {
                // crea una nueva conexión a la blockchain. Se pasa como argumento window.ethereum. Luego lo hbilitamos
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setEstado(prevEstado => { return { ...prevEstado, account: accounts[0], } });  // Actualizamos account con el valor obtenido, PERO mantenimiento los otros valores anteriores.

                } catch (error) {
                    if (error.code === 4001) {
                        // User rejected request
                        console.log("error 4001");
                    }
                }
            }
        
            // FORMA2: Legacy dapp browsers...
            else if (window.web3) { window.web3 = new Web3(web3.currentProvider); }
        
            // FORMA3: Non-dapp browsers...
            else {console.log('No se detectó un navegador que no es Ethereum. ¡Deberías considerar probar MetaMask!');}
            });
        }

        async function loadBlockchainData(){
            const conexionWeb3 = new Web3(window.ethereum); 

            await axios.post("/obtener-contrato")
            .then(async function(response){
                //console.log(response);
                setEstado(prevEstado => {return {...prevEstado, abiContrato: response.data.abi, addressContrato: response.data.addres }} );
                const contratoCurso = response.data.contrato;
                const networkId     = await conexionWeb3.eth.net.getId();
                const networkData   = contratoCurso.networks[networkId];

                if(networkData){
                    const contratoCursoEnBlockchain = new conexionWeb3.eth.Contract(contratoCurso.abi, networkData.address); 
                    setEstado(prevEstado => {return {...prevEstado, contratoEnBlockchain: contratoCursoEnBlockchain }} );
                    let cantidadDeJugadores = await contratoCursoEnBlockchain.methods.cantidadDeJugadores().call();
                    setEstado(prevEstado => {return {...prevEstado, cantidadJugadores: cantidadDeJugadores }} );
                
                    let todosJugadores = await contratoCursoEnBlockchain.methods.obtenerJugadores().call(); // 0: direcciones. 1: nombres.
                    let jugadoresOrganizados= [];

                    for(let i = 0; i < todosJugadores[0].length; i++){
                        jugadoresOrganizados.push({
                            direccion: todosJugadores[0][i],
                            nombre: todosJugadores[1][i]
                        });
                    }

                    setEstado(prevEstado => {return {...prevEstado, todosJugadores: jugadoresOrganizados }} );
                  

                }
                else{alert('el contrato contratoCurso no se implementó en la red conectada')}


            })
            .catch((error) => {console.log(error);})


        }

        loadWeb3();
        loadBlockchainData();
    });



    


    function handleChange(event){
        setNombre(event.target.value);
    }

    async function enviarJugador(event){
        event.preventDefault();
        
        // dirección, nombre
        let cuenta = estado.account;
        let valor  = Web3.utils.toWei('0.00055', 'ether');
        
        await estado.contratoEnBlockchain.methods.ingresar(nombre).send({from: cuenta, gas: 1000000, value: valor  }).once('receipt', (receipt) => {
            console.log(receipt);

            alert("transacción realizada");
        });
    }

    async function escogerGanador(event){

        try{
            let cuenta = estado.account;

            await estado.contratoEnBlockchain.methods.escogerGanador().send({from: cuenta, gas: 1000000 }).once('receipt', (receipt) => {
                console.log(receipt);

                let direccionGanador = receipt.events.ganadorEscogido.address;

                setGanador(direccionGanador);

                console.log(direccionGanador);

                alert("la dirección del ganador es: ", direccionGanador);
            });
        }catch(error) {console.log(error);}
    }

    //console.log(estado.todosJugadores);

    return(
        <div>
            <div className='container text-center my-5'>
                <h1>Lotería</h1>
                <p>aquí podrás participar en el juego de la lotería</p>

                <h2>Reglas</h2>
                <p>
                    - El costo es de 0.00055 eth. Aproximádamente 2 usd, a la tasa actual.<br/>
                    - Debes ingresar tu nombre.
                </p>

                <form className='my-5'>
                    {/* Nombre */}
                    <div className="form-floating mb-3">
                        <input onChange={handleChange} value={nombre}  type="text" className="form-control" id="floatingInput" placeholder="nombre" />
                        <label htmlFor="floatingInput">Tu nombre</label>
                    </div>

                    {/* Botón enviar */}
                    <button onClick={enviarJugador} type="submit" style={{width: "100%"}} className="btn btn-primary">Participar</button>
                </form>



                <h3>Jugadores de la lotería actual</h3>
                <p>Estos son los jugadores que están participando en la lotería actual</p>

                <table className='table mb-5'>
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Dirección</th>
                        </tr>
                    </thead>

                    <tbody id="productList">
                        {
                            estado.todosJugadores.map( (jugadorActual, key) => {
                                return(
                                    <tr key={key}>
                                        {<td>{jugadorActual.nombre}</td>}
                                        {<td>{jugadorActual.direccion}</td>}
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>


                {/* Escoger ganador */}
                <p className='mt-5'>Esta función solo la puede ejecutar el propietario o administrador del contrato.</p>
                <button onClick={escogerGanador} style={{width: "100%"}} className="btn btn-secondary mb-5" >Escoger ganador</button>

                {ganador!== '' ? <h3>El ganador es: {ganador}.  </h3> : <h3>aún no hay un ganador</h3>}
                
            </div>
        </div>  
    )
}

export default JuegoLoteria; 