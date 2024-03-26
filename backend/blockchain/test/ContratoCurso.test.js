const ContratoCurso = artifacts.require("./ContratoCurso.sol");
require('chai').use(require('chai-as-promised')).should(); // uso de aserciones. 


contract('ContratoCurso', (accounts) => {


    it("Debería permitir a los jugadores participar", async() => {
        const loteriaInstancia = await ContratoCurso.deployed();
        const cuentaInicialJugadores = (await loteriaInstancia.cantidadDeJugadores()).toNumber();

        // Simulamos la entrada de un usuario
        await loteriaInstancia.ingresar("Jugador 1", { from: accounts[0], value: web3.utils.toWei("0.00055", "ether")});

        // Comprobar el número de jugadores
        const cuentaFinalJugadores = (await loteriaInstancia.cantidadDeJugadores()).toNumber();

        assert.equal(cuentaFinalJugadores, cuentaInicialJugadores + 1, "El número de jugadores no aumentó");
    });


    it('Debería seleccionar un ganador y transferir el premio', async() => {
        const loteriaInstancia = await ContratoCurso.deployed();
        
        // Simulamos jugadores
        await loteriaInstancia.ingresar("Jugador 2", {from: accounts[1], value: web3.utils.toWei("1", "ether")});
        await loteriaInstancia.ingresar("Jugador 3", {from: accounts[2], value: web3.utils.toWei("1", "ether")});
    
        
    
    
        // Obtener saldos anteriores de todas las cuentas de jugadores
        const saldosAnteriores = [];
        for (let i = 0; i < accounts.length; i++) {
            const saldoAnterior = await web3.eth.getBalance(accounts[i]);
            saldosAnteriores.push(saldoAnterior);
        }
        
        const saldoInicialContrato = (await loteriaInstancia.obtenerSaldoContrato()).toString();
        
    
        // Llamar a la función escogerGanador
        await loteriaInstancia.escogerGanador();
         
      
        // Obtener saldos posteriores de todas las cuentas de jugadores
        const saldosPosteriores = [];
        for (let i = 0; i < accounts.length; i++) {
            const saldoPosterior = await web3.eth.getBalance(accounts[i]);
            saldosPosteriores.push(saldoPosterior);
        }
    
    
    
    
        // PRUEBA 1 /////////////////////////////////////////////////
        // Obtener los eventos pasados de tipo 'ganadorEscogido'
        const eventos = await loteriaInstancia.getPastEvents('ganadorEscogido', {
            fromBlock: 0,
            toBlock: 'latest'
        });
        // Verificar que se emitió el evento ganadorEscogido
        assert.isNotEmpty(eventos, "No se emitió el evento ganadorEscogido");
    
    
        // PRUEBA 2 ///////////////////////////////////////////////////
        // Obtener los datos del evento
        const eventoGanador    = eventos[0].returnValues;
        const posicionGanadora = (eventoGanador.posicion);
        const saldoGanador     = parseInt(saldosAnteriores[posicionGanadora]) + parseInt(saldoInicialContrato);
    
        assert.isTrue(saldosPosteriores[posicionGanadora] == saldoGanador, "No se transfirió el valor al ganador");
    })

});