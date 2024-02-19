const ContratoCurso = artifacts.require("ContratoCurso");

module.exports = async function(deployer) {
  try {
    await deployer.deploy(ContratoCurso);
  }catch (error) {
    console.error("Error deploying ContratoCurso:", error);
    throw error;
  }
};
