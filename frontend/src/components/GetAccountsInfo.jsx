import axios from "axios";
import { FIN_ACCESS_TOKEN,BANK_IMG,ACCOUNT_ID} from "../constant";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/test.css";
import api from "../api";
  
  //gets the actual transactions for the selected account 
  const getTransactions = async () => {
    const token = localStorage.getItem(FIN_ACCESS_TOKEN);
    const accountId = localStorage.getItem(ACCOUNT_ID);
    try {
      const res = await axios.get(`/api/v2/accounts/${accountId}/transactions/`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
     
      return res.data;
    } catch (error) {
      console.error("An error occurred while fetching account transactions:", error);
      const message=error.response.data.summary
      if (message==="Rate limit exceeded") {
      navigate("/NotFound");
    }
    }
  };

  
  



  const TransactionsDisplay = () => {
    const [data, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [income,setIncome]=useState([]);
    const [spending,setSpending]=useState([]);
    const [date,setDate]=useState([]);
    const [estimatedBalance,setBalances]=useState([]);

    //makes the training data model for the ML
    const formatModel = async (data) =>{
      const mapBalance = new Map();
      const mapSpending = new Map();
      const mapIncome = new Map();
      
    
      data.map((info) => {
        const date = info.bookingDateTime.split("-");
        const key = parseFloat(date[0] + date[1]); // Combine year and month as the key
    
        // Update the test map with the cumulative amount
        if (mapBalance.has(key)) {
          mapBalance.set(key, mapBalance.get(key) + parseFloat(info.transactionAmount.amount));
        } else {
          mapBalance.set(key, parseFloat(info.transactionAmount.amount));
        }
    
        // Only track negative amounts in the spending map
        if (parseFloat(info.transactionAmount.amount) < 0) {
          if (mapSpending.has(key)) {
            mapSpending.set(key, mapSpending.get(key) + parseFloat(info.transactionAmount.amount));
          } else {
            mapSpending.set(key, parseFloat(info.transactionAmount.amount));
          }
        }
        else{
          if (mapIncome.has(key)) {
            mapIncome.set(key, mapIncome.get(key) + parseFloat(info.transactionAmount.amount));
          } else {
            mapIncome.set(key, parseFloat(info.transactionAmount.amount));
          }
  
        }
      });
      
      setIncome(Array.from(mapIncome.values()))
      setBalances(Array.from(mapBalance.values()))
      setSpending(Array.from(mapSpending.values()))
      const strDates=Array.from(mapBalance.keys())
      setDate(strDates.map(Number))
    
    }
    //send the data to create the model
    const createModel = (e) => {
      e.preventDefault();
    
      const transactions = income.map((incomeValue, index) => ({
        income: incomeValue,
        spending: spending[index],
        estimatedBalance: estimatedBalance[index],
        date: date[index], // Ensure this is a float (timestamp) if that's what you need
      }));
    
      api
        .post("finDataApi/transaction/info/", transactions) // Sending the array of transactions
        .then((res) => {
          if (res.status === 201) alert("Model created!");
          else alert("Failed to make Model.");
        })
        .catch((err) => {
          console.log("Error response:", err.response.data); // Log the exact error message
          alert(err.response.data || "An error occurred");
        });
    };
  

  
    useEffect(() => {
      const fetchTransactions = async () => {
        const  transactions= await getTransactions ()
        
        setTransactions(transactions);
        setLoading(false);
        
       
      };
      fetchTransactions();
    }, []);
    
    const handleNavigate = (e) => {
      e.preventDefault();
        navigate("/");
    };
    useEffect(() => {
       const test = async () => {
         await formatModel(data.transactions.booked)
         
      };

      test();
      
    },);
    
    
  
    return (
      <div className="account-list-container">
        <h1 className="account-header">Accounts Transactions</h1>
        <div id="drop_box" className="account-list">
          {loading ? (
            <div className="loading-container">
              <p className="loading-text">Loading account details...</p>
              <div className="spinner"></div>
            </div>
          ) : (
             data.transactions.booked.map((info, index) => (
              <div key={index} className="account-option">
                <input
                  type="radio"
                  id={`account-${index}`}
                  name="account"
                  value={info.transactionId}
                  className="option"
                />
                <label htmlFor={`account-${index}`} className="account-label">
                  <img
                    src={localStorage.getItem(BANK_IMG)}
                    alt="Bank logo"
                    className="account-logo"
                  />
                  <div className="account-info">
                    <h2>{info.creditorName || info.remittanceInformationUnstructured}</h2>
                    <p>
                      {info.transactionAmount.amount + " " + info.transactionAmount.currency || "Amount"}
                    </p>
                  </div>
                </label>
              </div>
            ))
          
          )} 
            <button className="form-button" onClick={handleNavigate}>
           Show Balance
          </button>
          <button className="form-button" onClick={createModel}>
           Create Model
          </button> 
        </div>
      
      </div>
    );
  };
  
  export default TransactionsDisplay;