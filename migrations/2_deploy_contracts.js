var Authentication = artifacts.require("./Authentication.sol");

module.exports = function (deployer) {
  deployer.deploy(Authentication);
};
const PersonalDetails = artifacts.require("PersonalDetails");

module.exports = function (deployer) {
  deployer.deploy(PersonalDetails);
};

