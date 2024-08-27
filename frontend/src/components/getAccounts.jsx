import axios from "axios";
import { FIN_ACCESS_TOKEN, LINK_ID,BANK_IMG,ACCOUNT_ID,OWNERNAME } from "../constant";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/test.css";
 
  //gets the  bank accountsID that user owns 
const getAccounts = async (navigate) => {
    
    const token = localStorage.getItem(FIN_ACCESS_TOKEN);
    const requisitionId = localStorage.getItem(LINK_ID);
    try {
      const res = await axios.get(`/api/v2/requisitions/${requisitionId}/`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.accounts;
    } catch (error) {
       
        navigate("/institutions")
      console.error("An error occurred while fetching accounts:", error);
      
    }
    
  };
  //gets the  bank accounts name and type 
  const getAccountDetails = async (accountId) => {
    const token = localStorage.getItem(FIN_ACCESS_TOKEN);
    try {
      const res = await axios.get(`/api/v2/accounts/${accountId}/details/`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("An error occurred while fetching account details:", error);
      const message=error.response.data.summary
      if (message==="Rate limit exceeded") {
        navigate("/NotFound");
      }
      else{
        navigate("/institutions");
      }

    }
  };
  //displays the bank accounts for selection
  function AccountDropList(){
    const [accounts, setAccounts] = useState([]);
    const [accountDetails, setAccountDetails] = useState([]);
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const fetchAccounts = async () => {
          const accounts = await getAccounts(navigate);
          
            setAccounts(accounts);
           
        }
          
        
         fetchAccounts();
      }, []);
    
      useEffect(() => {
        const fetchDetails = async () => {
          if (accounts.length > 0) {
            const details = await Promise.all(
              accounts.map((account) => getAccountDetails(account))
            );
            setAccountDetails(details);
            setLoading(false); // Set loading to false after details are fetched
          }
        };
        fetchDetails();
      }, [accounts]);
      //gets the AccountId for transaction for the selected account 
      const getTransactions = (value,name)=>{
        localStorage.setItem(ACCOUNT_ID,value);
        localStorage.setItem(OWNERNAME,name)
        navigate("/transactions")
      }
  
      return (
        <div className="account-list-container">
          <h1 className="account-header"> Accounts</h1>
          <div id="drop_box" className="account-list" >
            {loading ? (
              <div className="loading-container">
                <p className="loading-text">Loading account details...</p>
                <div className="spinner"></div> {}
              </div>
            ) : (
              accountDetails.map((info, index) => (
                <div key={index} className="account-option">
                  <input
                    type="radio"
                    id={`account-${index}`}
                    name="account"
                    value={accounts[index]}
                    className="option"
                    onClick={(e) => getTransactions(accounts[index],info.account.ownerName)}
                  />
                  <label htmlFor={`account-${index}`} className="account-label">
                    <img
                      src={localStorage.getItem(BANK_IMG)}
                      alt="Bank logo"
                      className="account-logo"
                    />
                    <div className="account-info">
                      <h2>{info.account.ownerName || "Account Owner"}</h2>
                      <p>{info.account.details || "Account Details"}</p>
                    </div>
                  </label>
                </div>
              ))
            )}
          </div>
          
        </div>
      );
    }
  
  export default AccountDropList;