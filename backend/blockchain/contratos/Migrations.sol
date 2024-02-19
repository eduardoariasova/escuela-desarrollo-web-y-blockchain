// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;
// la función principal de este contrato es rastrear el estado de las migraciones realizadas en el proyecto. Cada vez que se ejecuta una migración de Truffle, se actualiza el estado en este contrato.

contract Migrations {
  address public owner;
  uint public last_completed_migration;

  constructor(){ owner = msg.sender; } // establece la dirección que interactúa con el contrato, como PROPIETARIO

  modifier restricted() { if (msg.sender == owner) _; } // Restringe el acceso a las funciones marcadas con  "restricted", donde solo pueden ejecutarse si es "owner" quien lo hace.

  function setCompleted(uint completed) public restricted { last_completed_migration = completed; }

  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
