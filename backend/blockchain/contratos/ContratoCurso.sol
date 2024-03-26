// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

contract ContratoCurso {
    
    address public administrador; // crear dirección del administrador del contrato.

    // EVENTOS
    event jugadorIngresado(address indexed player, string name);
    event ganadorEscogido(address indexed winner, uint256 premio, string name, uint posicion);

    // Estructura o modelo del jugador
    struct Jugador{
        address payable direccionJugador; // payable: capaz de recibir eth.
        string name; 
    }

    Jugador[] public jugadores; // arreglo dinámico de los jugadores.direccionJugador


    constructor(){
        administrador = msg.sender; // creador del contrato va a ser administrador.
    }


    // Función para que el usuario compre un boleto de lotería
    function ingresar(string memory nombreJugador) public payable{
        require(msg.value >= 0.00055 ether, "Se requiere una cantidad de 0.00055 eth para participar."); // condición para poder usar esta función.
        jugadores.push(Jugador(payable(msg.sender), nombreJugador)); // agregar el jugador al arreglo de jugadores.
        emit jugadorIngresado(msg.sender, nombreJugador); // ejecutamos el evento.
    }

    // Función para elegir el ganador de la lotería
    function escogerGanador() public restricted{
        require(jugadores.length > 0, "No hay suficientes jugadores para escoger un ganador");
        uint index = random(); // seleccionamos un indice aleatorio.

        // Calcular el saldo total acumulado por los jugadores
        uint premioTotal = address(this).balance;

        jugadores[index].direccionJugador.transfer(premioTotal); // transfiere al ganador el dinero recaudado desde la dirección del contrato.
        emit ganadorEscogido(jugadores[index].direccionJugador, premioTotal, jugadores[index].name, index); // ejecutamos el evento.
        delete jugadores; // limpia el arreglo de los jugadores
    }

    // Función para obtener de forma aletaria el index
    function random() private view returns (uint){
        return uint(  keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)))  % jugadores.length;
    }

    // Permitir que solamente el administrador ejecutemos ciertas funciones
    modifier restricted(){
        require(msg.sender == administrador, "solo el administrador puede ejecutar esta funcion");
        _; // cuerpo restante de la función a ejecutar que estaba condicionada.
    }

    // Función para ver a los jugadores
    function obtenerJugadores() public view returns (address payable[] memory, string[] memory){
        address payable[] memory direccionesJugadores = new address payable[](jugadores.length);
        string[] memory nombreJugadores = new string[](jugadores.length);

        for(uint i = 0; i < jugadores.length; i++){
            direccionesJugadores[i] = jugadores[i].direccionJugador;
            nombreJugadores[i] = jugadores[i].name;
        }

        return(direccionesJugadores, nombreJugadores);
    }


    // Función para obtener la longitud del arreglo jugadores
    function cantidadDeJugadores() public view returns (uint) {
        return jugadores.length;
    }


    function obtenerSaldoContrato() public view returns (uint256) {
        return address(this).balance;
    }
}