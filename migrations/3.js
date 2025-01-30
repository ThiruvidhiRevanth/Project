var PersonalDetails = artifacts.require("./PersonalDetails.sol");

module.exports = function (deployer) {
  deployer.deploy(PersonalDetails);
};
