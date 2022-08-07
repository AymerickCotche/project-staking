const Staking = artifacts.require("Staking");


module.exports = function (deployer) {
  deployer.deploy(Staking, '0xe9d903CeB9bE0BC1322aFcfc275eEB4E5aea3942');
};
