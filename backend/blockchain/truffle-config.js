require('babel-register');
require('babel-polyfill');

module.exports = {
    networks: {
        // conexión de ganache
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*" // conecta con cualquier red
        }
    },
    contracts_directory: './contratos/',
    contracts_build_directory: './abis/',
    compilers: {
        solc: {
          version: "0.8.19",
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
    }
}