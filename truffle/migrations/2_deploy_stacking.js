const Staking = artifacts.require("Staking");


module.exports = function (deployer) {
  deployer.deploy(Staking, '0x457Bcec0BC630b0D44e8Ed57cEC704B8828fe560');
};
