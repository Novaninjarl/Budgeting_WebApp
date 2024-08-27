import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../styles/BalanceComponent.css";
import { useNavigate } from "react-router-dom";
import { FIN_ACCESS_TOKEN, ACCOUNT_ID, OWNERNAME } from "../constant";
import api from "../api";

const getBalance = async (navigate) => {
  const token = localStorage.getItem(FIN_ACCESS_TOKEN);
  const accountId = localStorage.getItem(ACCOUNT_ID);

  try {
    const res = await axios.get(`/api/v2/accounts/${accountId}/balances/`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("An error occurred while fetching the  selected account detail :", error);
    const message=error.response.data.summary
    if (message==="Rate limit exceeded") {
      navigate("/NotFound");
    } else {
      navigate("/institutions");
    }
  
    
  }
};

function Home() {
  const [info, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [spending, setSpending] = useState("");
  const [goal, setGoal] = useState("");
  const [predictedBalance, setPredictedBalance] = useState(null);
  const [originalBalance, setOriginalBalance] = useState(0.0);
  const navigate = useNavigate();
  let totalBalance = 0;
// gets the predicted estimated balance 
  const getPrediction = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("finDataApi/prediction/", {
        date: date,
        spending: spending,
      });
      const roundedValue = parseFloat(response.data.estimated_Balance).toFixed(2);
      setPredictedBalance(roundedValue);
    } catch (error) {
      console.error("Error making prediction:", error);
    }
  };
// creates the model for the bank account meta 
  const createMetaModel = () => {
    const accountName = localStorage.getItem(OWNERNAME);
    const balance = parseInt(totalBalance);
    api
      .post("finDataApi/bank-account/info/", { accountName, balance })
      .then((res) => {
        if (res.status === 201) alert("Model created!");
        else alert("Failed to make Model.");
      })
      .catch((err) => {
        console.log("Error response:", err.response.data);
        alert(err.response?.data || "An error occurred");
      });
  };

  useEffect(() => {
    const fetchBalances = async () => {
      const balances = await getBalance(navigate);
      setBalances(balances.balances || []);
      setLoading(false);
    };
    fetchBalances();
  }, []);

  useEffect(() => {
    if (info.length !== 0) {
      totalBalance = info[0].balanceAmount.amount;
      if (originalBalance !== totalBalance) {
        setOriginalBalance(totalBalance);
        createMetaModel();
      }
    }
  }, [info, originalBalance]);

  const handleNavigate = (e) => {
    e.preventDefault();
    if (info.length === 0) {
      navigate("/institutions");
    } else {
      navigate("/accounts");
    }
  };

  const resetBalance = () => {
    setPredictedBalance(null);
  };

  return (
    <div className="balance-container">
      {loading ? (
        <div className="loading-container">
          <p className="loading-text">Loading account details...</p>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="balance-content">
          <div className="balance-and-form">
            <div className="circular-progress-container">
              <h2>Balance</h2>
              <CircularProgressbar
                value={predictedBalance !== null ? predictedBalance : originalBalance}
                text={`${predictedBalance !== null ? predictedBalance : originalBalance}`}
                maxValue={goal || 1000}
                styles={buildStyles({
                  textColor: "#ffffff",
                  pathColor: predictedBalance !== null ? "#4caf50" : "#ff4c4c", // Green for predicted balance
                  trailColor: "#242424",
                })}
              />
            </div>

            <form onSubmit={getPrediction} className="form-container">
              <h1>Balance Estimator</h1>
              <input
                className="form-input"
                type="number"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Date (yymm)"
              />
              <input
                className="form-input"
                type="number"
                value={spending}
                onChange={(e) => setSpending(-e.target.value)}
                placeholder="Spending"
              />
              <input
                className="form-input"
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Goal Balance"
              />
              <button className="form-button" type="submit">
                Predict
              </button>
            </form>
          </div>
          <button className="form-button" onClick={resetBalance}>
            Reset to Original Balance
          </button>
          <button className="form-button" onClick={handleNavigate}>
            {info.length === 0 ? "Bank Institutions" : "All Accounts"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
