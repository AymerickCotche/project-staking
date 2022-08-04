const AlyraToken = artifacts.require("AlyraToken");

module.exports = function (deployer) {
  deployer.deploy(AlyraToken, '0x7e51e0b92c0Cb5fEE1F3aC13C8578AD06f960E5F');
};
