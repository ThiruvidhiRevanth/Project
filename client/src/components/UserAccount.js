// import React, { useState, useEffect } from 'react';
// import Web3 from 'web3';
// import PersonalDetailsContract from '../contracts/PersonalDetails.json'; 
// import "../UApp.css"

// const UserAccount = () => {
//   const [web3, setWeb3] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     age: '',
//     addressInfo: '',
//     email: ''
//   });
//   const [retrievedData, setRetrievedData] = useState(null);

//   useEffect(() => {
//     const init = async () => {
//       try {
//         // Connect to Web3
//         const web3Instance = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');
//         setWeb3(web3Instance);

//         // Get accounts
//         const accounts = await web3Instance.eth.getAccounts();
//         setAccount(accounts[0]);

//         // Get contract instance
//         const networkId = await web3Instance.eth.net.getId();
//         const deployedNetwork = PersonalDetailsContract.networks[networkId];
//         const contractInstance = new web3Instance.eth.Contract(
//           PersonalDetailsContract.abi,
//           deployedNetwork && deployedNetwork.address,
//         );
//         setContract(contractInstance);
//       } catch (error) {
//         console.error('Error loading web3 or contract:', error);
//       }
//     };

//     init();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (contract && account) {
//       try {
//         await contract.methods.addOrUpdatePerson(formData.name, formData.age, formData.addressInfo, formData.email)
//           .send({ from: account });
//         alert('Personal details added/updated successfully!');
//       } catch (error) {
//         console.error('Error adding/updating person:', error);
//       }
//     }
//   };

//   const deleteDetails = async () => {
//     if (contract && account) {
//       try {
//         await contract.methods.deletePerson().send({ from: account });
//         alert('Personal details deleted successfully!');
//       } catch (error) {
//         console.error('Error deleting person:', error);
//       }
//     }
//   };

//   const fetchDetails = async () => {
//     if (contract && account) {
//       try {
//         const person = await contract.methods.getPerson(account).call();
//         setRetrievedData({
//           name: person[0],
//           age: person[1],
//           addressInfo: person[2],
//           email: person[3],
//         });
//       } catch (error) {
//         console.error('Error fetching person:', error);
//       }
//     }
//   };

//   return (
   
//     <div style={{ backgroundColor: 'white', marginLeft: '3%', marginRight: '3%', borderRadius: '10px' ,height:'640px'}}>
//       <br></br>
//       <h2><b>Send us your feedback</b></h2>
//       <div style={{ width: '100%', height: '100%' }}>
//         <form onSubmit={handleSubmit}>
//           <div className="form-column">
//             <label htmlFor="email">Email<span>*</span></label>
//             <input type="email" name="email" id="email" placeholder="Email" required onChange={handleInputChange} />
//           </div>

//           <div className="form-column">
//             <label htmlFor="classYear">Class and year or semester<span>*</span></label>
//             <input type="text" name="classYear" id="classYear" placeholder="Class and year or semester" required onChange={handleInputChange} />
//           </div>

//           <div className="form-column">
//             <label htmlFor="enrollmentNumber">Enrollment Number<span>*</span></label>
//             <input type="text" name="enrollmentNumber" id="enrollmentNumber" placeholder="Enrollment Number" required onChange={handleInputChange} />
//           </div>

//         <button type="submit">Add/Update Details</button>
//       </form>
//       <button onClick={fetchDetails}>Fetch My Details</button>
//       <button onClick={deleteDetails}>Delete My Details</button>
//       {retrievedData && (
//         <div>
//           <h2>Retrieved Details</h2>
//           <p>Name: {retrievedData.name}</p>
//           <p>Age: {retrievedData.age}</p>
//           <p>Address: {retrievedData.addressInfo}</p>
//           <p>Email: {retrievedData.email}</p>
//         </div>
//       )}
//     </div>
//     </div>
    
//   );
// }
// export default UserAccount;

// import React, { useState, useEffect } from 'react';
// import Web3 from 'web3';
// import PersonalDetailsContract from '../contracts/PersonalDetails.json'; 
// import "../UApp.css";

// const UserAccount = () => {
//   const [web3, setWeb3] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [formData, setFormData] = useState({
//     age: '',
//     bloodPressure: '',
//     sex: '',
//     cp: '',
//     thalach: '',
//     oldpeak: ''
//   });
//   const [predictions, setPredictions] = useState([]);

//   useEffect(() => {
//     const init = async () => {
//       try {
//         const web3Instance = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');
//         setWeb3(web3Instance);

//         const accounts = await web3Instance.eth.getAccounts();
//         setAccount(accounts[0]);

//         const networkId = await web3Instance.eth.net.getId();
//         const deployedNetwork = PersonalDetailsContract.networks[networkId];
//         const contractInstance = new web3Instance.eth.Contract(
//           PersonalDetailsContract.abi,
//           deployedNetwork && deployedNetwork.address,
//         );
//         setContract(contractInstance);
//       } catch (error) {
//         console.error('Error loading web3 or contract:', error);
//       }
//     };

//     init();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission

//     console.log("Form Data Submitted:", formData); // Log form data

//     try {
//       const response = await fetch('http://127.0.0.1:5000/predict', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           age: Number(formData.age),
//           sex: Number(formData.sex),
//           cp: Number(formData.cp),
//           trtbps: Number(formData.bloodPressure), // Maps to Flask API
//           thalachh: Number(formData.thalach), // Maps to Flask API
//           oldpeak: Number(formData.oldpeak) // Maps to Flask API
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const result = await response.json();
//       console.log("API Response:", result); // Log the API response

//       // Adjust based on actual response structure
//       setPredictions(result.predictions || []); // Ensure it's an array

//     } catch (error) {
//       console.error('Error during prediction:', error);
//       alert('An error occurred while making the prediction. Please try again.');
//     }
//   };

//   return (
//     <div style={{ backgroundColor: 'white', marginLeft: '3%', marginRight: '3%', borderRadius: '10px', height: '640px' }}>
//       <br />
//       <h2><b>Submit Health Details for Heart Attack Risk Prediction</b></h2>
//       <div style={{ width: '100%', height: '100%' }}>
//         <form onSubmit={handleSubmit}>
//           {['age', 'bloodPressure', 'sex(0 or 1)', 'cp', 'thalach', 'oldpeak'].map(field => (
//             <div className="form-column" key={field}>
//               <label htmlFor={field}>
//                 {field.charAt(0).toUpperCase() + field.slice(1)}<span>*</span>
//               </label>
//               <input
//                 type="number"
//                 name={field}
//                 id={field}
//                 placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//                 required
//                 onChange={handleInputChange}
//               />
//             </div>
//           ))}
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//       {predictions.length > 0 && (
//         <div>
//           <h3>Heart Disease Predictions for the Next 5 Years:</h3>
//           <ul>
//             {predictions.map((pred, index) => (
//               <li key={index}>{pred.year}: {pred.risk === 1 ? 'Heart disease' : 'No heart disease'}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//       {predictions.length === 0 && <p>No predictions available yet.</p>}
//     </div>
//   );
// };

// export default UserAccount;


// // UserAccount.js
// import React, { useState, useEffect } from 'react';
// import Web3 from 'web3';
// import PersonalDetailsContract from '../contracts/PersonalDetails.json';
// import "../UApp.css";

// const UserAccount = () => {
//   const [web3, setWeb3] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [formData, setFormData] = useState({
//     age: '',
//     bloodPressure: '',
//     sex: '',
//     cp: '',
//     thalach: '',
//     oldpeak: ''
//   });
//   const [predictions, setPredictions] = useState([]);

//   useEffect(() => {
//     const init = async () => {
//       try {
//         const web3Instance = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');
//         setWeb3(web3Instance);

//         const accounts = await web3Instance.eth.getAccounts();
//         setAccount(accounts[0]);

//         const networkId = await web3Instance.eth.net.getId();
//         const deployedNetwork = PersonalDetailsContract.networks[networkId];
//         const contractInstance = new web3Instance.eth.Contract(
//           PersonalDetailsContract.abi,
//           deployedNetwork && deployedNetwork.address,
//         );
//         setContract(contractInstance);
//       } catch (error) {
//         console.error('Error loading web3 or contract:', error);
//       }
//     };
//     init();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form Data Submitted:", formData);

//     try {
//       const response = await fetch('http://127.0.0.1:5000/predict', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           age: Number(formData.age),
//           sex: Number(formData.sex),
//           cp: Number(formData.cp),
//           trtbps: Number(formData.bloodPressure),
//           thalachh: Number(formData.thalach),
//           oldpeak: Number(formData.oldpeak)
//         }),
//       });

//       console.log("Response Status:", response.status);

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const result = await response.json();
//       console.log("API Response:", result);

//       setPredictions(result); 
//     } catch (error) {
//       console.error('Error during prediction:', error);
//       alert('An error occurred while making the prediction. Please try again.');
//     }
//   };

//   return (
//     <div style={{ backgroundColor: 'white', marginLeft: '3%', marginRight: '3%', borderRadius: '10px', height: '640px' }}>
//       <br />
//       <h2><b>Submit Health Details for Heart Attack Risk Prediction</b></h2>
//       <div style={{ width: '100%', height: '100%' }}>
//         <form onSubmit={handleSubmit}>
//           {['age', 'bloodPressure', 'sex', 'cp', 'thalach', 'oldpeak'].map((field, index) => (
//             <div className="form-column" key={index}>
//               <label htmlFor={field}>
//                 {field.charAt(0).toUpperCase() + field.slice(1)}<span>*</span>
//               </label>
//               <input
//                 type="number"
//                 name={field}
//                 id={field}
//                 placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//                 required
//                 onChange={handleInputChange}
//               />
//             </div>
//           ))}
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//       {predictions.length > 0 && (
//         <div>
//           <h3>Heart Disease Predictions for the Next 5 Years:</h3>
//           <ul>
//             {predictions.map((pred, index) => (
//               <li key={index}>{pred.year}: {pred.risk === 1 ? 'Heart disease' : 'No heart disease'}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//       {predictions.length === 0 && <p>No predictions available yet.</p>}
//     </div>
//   );
// };

// export default UserAccount;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
          oldpeak: Number(formData.oldpeak)
        }),
      });

      console.log("Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      setPredictions(result); // Update predictions based on response structure
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
      </div>
      {predictions.length > 0 ? (
        <div>
          <h3>Heart Disease Predictions for the Next 5 Years:</h3>
          <ul>
            {predictions.map((pred, index) => (
              <li key={index}>{pred.year}: {pred.risk === 1 ? 'Heart disease' : 'No heart disease'}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No predictions available yet.</p>
      )}
    </div>
  );
};

export default UserAccount;
