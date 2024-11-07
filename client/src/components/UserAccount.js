import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import PersonalDetailsContract from '../contracts/PersonalDetails.json';
import "../UApp.css";

const UserAccount = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    bloodPressure: '',
    sex: '',
    cp: '',
    thalach: '',
    oldpeak: ''
  });
  const [predictions, setPredictions] = useState([]);

  // Initialize Web3 and Contract
  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = PersonalDetailsContract.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          PersonalDetailsContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        setContract(contractInstance);
      } catch (error) {
        console.error('Error loading web3 or contract:', error);
      }
    };
    init();
  }, []);

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Form Submission and Fetch Predictions
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: Number(formData.age),
          sex: Number(formData.sex),
          cp: Number(formData.cp),
          trtbps: Number(formData.bloodPressure),
          thalachh: Number(formData.thalach),
          oldpeak: Number(formData.oldpeak),
        }),
      });
  
      console.log("Response Status:", response.status); // Log status
      const result = await response.json();
      console.log("API Response:", result); // Log result
  
      if (response.ok) {
        setPredictions([]); // Clear previous predictions for debugging
        setPredictions(result); // Set the predictions to state
        console.log("Predictions updated:", result); // Log updated predictions
      } else {
        throw new Error('Failed to fetch predictions');
      }
    } catch (error) {
      console.error('Error during prediction:', error);
      alert('An error occurred while making the prediction. Please try again.');
    }
  };
  

  return (
    <div style={{ backgroundColor: 'white', marginLeft: '3%', marginRight: '3%', borderRadius: '10px', height: '640px' }}>
    <br />
    <h2><b>Submit Health Details for Heart Attack Risk Prediction</b></h2>
    <div style={{ width: '100%', height: '100%' }}>
      <form onSubmit={handleSubmit}>
        {['age', 'bloodPressure', 'sex', 'cp', 'thalach', 'oldpeak'].map((field, index) => (
          <div className="form-column" key={index}>
            <label htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}<span>*</span>
            </label>
            <input
              type="number"
              name={field}
              id={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required
              onChange={handleInputChange}
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form> 
    
    {console.log(predictions)} {/* Log predictions to verify state */}
    {predictions.length > 0 ? (
      <div>
        <h3>Heart Disease Predictions for the Next 5 Years:</h3>
        <ul>
          {predictions.map((pred, index) => (
            <li key={index}>
              {pred.year}: {pred.risk === 1 ? 'Heart disease' : 'No heart disease'}
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <p>No predictions available yet.</p>
    )}
  </div>
  </div>

  );
};

export default UserAccount;

