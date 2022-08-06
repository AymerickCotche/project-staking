const AlyraToken = artifacts.require("AlyraToken");

module.exports = function (deployer) {
  deployer.deploy(AlyraToken);
};
