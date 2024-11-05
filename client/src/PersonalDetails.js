import Web3 from 'web3';
import PersonalDetailsContract from './contracts/PersonalDetails.json'; // ABI from Truffle

const loadContract = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = PersonalDetailsContract.networks[networkId];
  const contract = new web3.eth.Contract(
    PersonalDetailsContract.abi,
    deployedNetwork && deployedNetwork.address,
  );
  return contract;
};

export default loadContract;
