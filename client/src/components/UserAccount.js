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
//   const [fetchMessage, setFetchMessage] = useState('');

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

//   // Save data to the blockchain
//   const saveRecord = async () => {
//     if (contract && account) {
//       try {
//         // Check if the account already has a record
//         const recordExists = await contract.methods.recordExists().call({ from: account });
  
//         if (recordExists) {
//           alert("You have already saved your record. Only one record per account is allowed.");
//           return;
//         }
  
//         // Save the record if it doesn't exist
//         await contract.methods
//           .setRecord(
//             Number(formData.age),
//             Number(formData.bloodPressure),
//             Number(formData.sex),
//             Number(formData.cp),
//             Number(formData.thalach),
//             Number(formData.oldpeak)
//           )
//           .send({ from: account });
  
//         alert("Record saved successfully!");
        
//       } catch (error) {
//         console.error("Error saving the record:", error);
//         alert("Failed to save the record.");
//       }
//     } else {
//       alert("Contract or account not found!");
//     }
//   };
  

//   // Fetch data from the blockchain
//   const fetchRecord = async () => {
//     if (contract && account) {
//       try {
//         const record = await contract.methods.getRecord().call({ from: account });
//         setFormData({
//           age: record[0],
//           bloodPressure: record[1],
//           sex: record[2],
//           cp: record[3],
//           thalach: record[4],
//           oldpeak: record[5]
//         });
  
//         // Constructing the message
//         const message = `
//           Record fetched successfully!
//           Age: ${record[0]}
//           Blood Pressure: ${record[1]}
//           Sex: ${record[2]}
//           Chest Pain: ${record[3]}
//           Thalach: ${record[4]}
//           Oldpeak: ${record[5]}
//         `;
  
//         setFetchMessage(message); // Set the message to be displayed on the page
//       } catch (error) {
//         console.error("Error fetching the record:", error);
//         setFetchMessage("No data Availbe.");
//       }
//     } else {
//       setFetchMessage("Contract or account not found!");
//     }
//   };
  
  

//   // Delete data from the blockchain
//   const deleteRecord = async () => {
//     if (contract && account) {
//       try{
//       await contract.methods.deleteRecord().send({ from: account });
//       alert("Record deleted successfully!");
//       setFormData({
//         age: '',
//         bloodPressure: '',
//         sex: '',
//         cp: '',
//         thalach: '',
//         oldpeak: ''
//       });
//     }
//     catch(error){
//       console.error("Error deleting the record:", error);
//     }
      
    
    
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
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
//           oldpeak: Number(formData.oldpeak),
//         }),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         setPredictions(result);
//       } else {
//         throw new Error('Failed to fetch predictions');
//       }
//     } catch (error) {
//       console.error('Error during prediction:', error);
//       alert('An error occurred while making the prediction. Please try again.');
//     }
//   };

//   return (
//     <div
//   style={{
//     backgroundColor: 'white',
//     marginLeft: '3%',
//     marginRight: '3%',
//     borderRadius: '10px',
//     minHeight: '640px',
//     maxHeight: '100vh',
//     overflowY:"auto", // Allow vertical scrolling
//    paddingRight:"50px", // Hide horizontal scrollbars
//     padding: '20px', // Add space to move text to the right
//   }}
// >

//       <br />
//       <h2><b>Submit Health Details for Heart Attack Risk Prediction</b></h2>
//       <div style={{ width: '100%', height: '100%' ,marginBottom:"20%"}}>
      
// <div style={{ width: '100%', height: '100%' ,marginBottom:"20%"}}>
//       <form onSubmit={handleSubmit}>
//   {['age', 'sex', 'cp', 'bloodPressure', 'thalach', 'oldpeak'].map((field, index) => (
//     <div className="form-column" key={index}>
//       <label htmlFor={field}>
//         {field.charAt(0).toUpperCase() + field.slice(1)}<span>*</span>
//       </label>
//       <input
//         type="decimal"
//         name={field}
//         id={field}
//         placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//         required
//         onChange={handleInputChange}
//         style={{ flexGrow: 2 ,marginBottom:"10px"}}

//       />
//     </div>
//   ))}
//   <button type="submit" style={{marginRight:"50px",marginLeft:"600px"}}>Submit</button>
// </form>
// </div>

//         <button type="button" onClick={saveRecord}>Save to Blockchain</button>
//         <button type="button" onClick={fetchRecord}>Fetch from Blockchain</button>
//         <button type="button" onClick={deleteRecord}>Delete from Blockchain</button>
//         {fetchMessage && (
//       <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
//         <p style={{ color: '#333', fontSize: '16px', whiteSpace: 'pre-line' }}>{fetchMessage}</p>
//       </div>
//     )}
//       </div>
//       {predictions.length > 0 ? (
//         <div>
//           <h3>Heart Disease Predictions for the Next 5 Years:</h3>
//           <ul style={{ color: 'black', fontSize: '16px' }}>
//             {predictions.map((pred, index) => (
//               <li key={index}>
//                 {pred.year}: {pred.risk === 1 ? 'Heart disease' : 'No heart disease'}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>No predictions available yet.</p>
//       )}
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
  const [fetchMessage, setFetchMessage] = useState('');

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

  const saveRecord = async () => {
    if (contract && account) {
      try {
        const recordExists = await contract.methods.recordExists().call({ from: account });
        if (recordExists) {
          alert("You have already saved your record. Only one record per account is allowed.");
          return;
        }
        await contract.methods
          .setRecord(
            Number(formData.age),
            Number(formData.bloodPressure),
            Number(formData.sex),
            Number(formData.cp),
            Number(formData.thalach),
            Number(formData.oldpeak)
          )
          .send({ from: account });
        alert("Record saved successfully!");
      } catch (error) {
        console.error("Error saving the record:", error);
        alert("Failed to save the record.");
      }
    } else {
      alert("Contract or account not found!");
    }
  };

  const fetchRecord = async () => {
    if (contract && account) {
      try {
        const record = await contract.methods.getRecord().call({ from: account });
        setFormData({
          age: record[0],
          bloodPressure: record[1],
          sex: record[2],
          cp: record[3],
          thalach: record[4],
          oldpeak: record[5]
        });
        const message = `
          Record fetched successfully!
          Age: ${record[0]}
          Blood Pressure: ${record[1]}
          Sex: ${record[2]}
          Chest Pain: ${record[3]}
          Thalach: ${record[4]}
          Oldpeak: ${record[5]}
        `;
        setFetchMessage(message);
      } catch (error) {
        console.error("Error fetching the record:", error);
        setFetchMessage("No data available.");
      }
    } else {
      setFetchMessage("Contract or account not found!");
    }
  };

  const deleteRecord = async () => {
    if (contract && account) {
      try {
        await contract.methods.deleteRecord().send({ from: account });
        alert("Record deleted successfully!");
        setFormData({
          age: '',
          bloodPressure: '',
          sex: '',
          cp: '',
          thalach: '',
          oldpeak: ''
        });
      } catch (error) {
        console.error("Error deleting the record:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: Number(formData.age),
          sex: Number(formData.sex),
          cp: Number(formData.cp),
          trtbps: Number(formData.bloodPressure),
          thalachh: Number(formData.thalach),
          oldpeak: Number(formData.oldpeak),
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setPredictions(result);
      } else {
        throw new Error('Failed to fetch predictions');
      }
    } catch (error) {
      console.error('Error during prediction:', error);
      alert('An error occurred while making the prediction. Please try again.');
    }
  };

  return (
    <div
    style={{
      backgroundColor: 'white',
      width: '100vw',
      minHeight: '100vh',
      overflowX: 'scrool',
      overflowY: 'scroll',
      padding: '20px',
      boxSizing: 'border-box',
    }}
  >
      
      <h2><b>Submit Health Details for Heart Attack Risk Prediction</b></h2>
      <h2><b>Personal  Details</b></h2>
      <div>
        <form onSubmit={handleSubmit}>
        <div className="form-column">
  <label htmlFor="Full Name" style={{ fontSize:14,fontWeight:'600',display: 'block', marginBottom: '5px' }}>
    Full Name<span>*</span>
  
  <input style={{ fontWeight:'400'}}
    type="decimal"
    name="Full Name"
    id="Full Name"
    placeholder="Full Name"
    required
    onChange={handleInputChange}
    
  />
   </label> 
</div>
        <div className="form-column">
  <label htmlFor="age" style={{ fontSize:14,fontWeight:'600',display: 'block', marginBottom: '5px' }}>
    Age<span>*</span>
  
  <input
    type="decimal"
    name="age"
    id="age"
    placeholder="Age"
    required
    onChange={handleInputChange}
    style={{ fontWeight:'400' }}
  />
  </label>
</div>

<div className="form-column">
  <label htmlFor="sex" style={{ fontSize:14,fontWeight:'600',display: 'block', marginBottom: '5px' }}>
    Gender<span>*</span>
  <input
    type="decimal"
    name="sex"
    id="sex"
    placeholder="Male for 1 0r Female for 0"
    required
    onChange={handleInputChange}
    style={{fontWeight:'400' }}
  />
  </label>
</div>
<div className="form-column">
  <label htmlFor="Phone Number" style={{ fontSize:14,fontWeight:'600',display: 'block', marginBottom: '5px' }}>
  Phone Number<span>*</span>
  <input
    type="decimal"
    name="sex"
    id="sex"
    placeholder="Phone Number"
    required
    onChange={handleInputChange}
    style={{fontWeight:'400' }}
  />
  </label>
</div>
<div className="form-column">
  <label htmlFor="Email" style={{ fontSize:14,fontWeight:'600',display: 'block', marginBottom: '5px' }}>
  Email<span>*</span>
  <input
    type="decimal"
    name="Email"
    id="Email"
    placeholder="Email"
    required
    onChange={handleInputChange}
    style={{fontWeight:'400' }}
  />
  </label>
</div>
<br /><br /><br />
<br /><br />

<h2><b> Medical History</b></h2>
<div className="form-column">
  <label htmlFor="cp" style={{ fontSize:14,fontWeight:'600',display: 'block', marginBottom: '5px' }}>
    Cp<span>*</span>

  <input
    type="decimal"
    name="cp"
    id="cp"
    placeholder="Cp"
    required
    onChange={handleInputChange}
    style={{ fontWeight:'400' }}
  /></label>
</div>

<div className="form-column">
  <label htmlFor="bloodPressure" style={{ fontSize:14,fontWeight:'600',display: 'block', marginBottom: '5px' }}>
    Blood Pressure<span>*</span>
  
  <input
    type="decimal"
    name="bloodPressure"
    id="bloodPressure"
    placeholder="Blood Pressure"
    required
    onChange={handleInputChange}
    style={{ fontWeight:'400'}}
  /></label>
</div>

<div className="form-column">
  <label htmlFor="thalach" style={{ fontSize:14,fontWeight:'600',display: 'block', marginBottom: '5px' }}>
    Thalach<span>*</span>
 
  <input
    type="decimal"
    name="thalach"
    id="thalach"
    placeholder="Thalach"
    required
    onChange={handleInputChange}
    style={{ fontWeight:'400' }}
  /></label>
</div>

<div className="form-column">
  <label htmlFor="oldpeak" style={{ fontSize:14,fontWeight:'600',display: 'block', marginBottom: '5px' }}>
    Oldpeak<span>*</span>
  
  <input
    type="decimal"
    name="oldpeak"
    id="oldpeak"
    placeholder="Oldpeak"
    required
    onChange={handleInputChange}
    style={{ fontWeight:'400' }}
  /></label>
</div> 
<br /><br /><br />
<br /><br /><br />
<br /><br /><br />

          
          <button type="submit" style={{ marginRight: '50px', marginLeft: '600px' }}>Submit</button>
        </form>
        <button type="button" onClick={saveRecord}>Save to Blockchain</button>
        <button type="button" onClick={fetchRecord}>Fetch from Blockchain</button>
        <button type="button" onClick={deleteRecord}>Delete from Blockchain</button>
        {fetchMessage && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
            <p style={{ color: '#333', fontSize: '16px', whiteSpace: 'pre-line' }}>{fetchMessage}</p>
          </div>
        )}
      </div>
      {predictions.length > 0 ? (
        <div>
          <h3>Heart Disease Predictions for the Next 5 Years:</h3>
          <ul style={{ color: 'black', fontSize: '16px' }}>
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
  );
};

export default UserAccount;


