import axios from "axios";
import { FIN_ACCESS_TOKEN, LINK_ID ,BANK_IMG} from "../constant";
import { useState, useEffect } from "react";
import "../styles/dropbox.css";
// gets the bank instutions in the UK
const getBanks = async () => {
  const token = localStorage.getItem(FIN_ACCESS_TOKEN);
  try {
    const res = await axios.get("/api/v2/institutions/?country=gb", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("An error occurred while fetching banks:", error)
    const message=error.response.data.summary
    if (message==="Rate limit exceeded") {
      navigate("/NotFound");
    };
  }
};



function BanksDropdownList() {
  const [banksList, setBanksList] = useState([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const fetchBanks = async () => {
      const banks = await getBanks();
      setBanksList(banks);
    };
    fetchBanks();
  }, []);
  const handleLink = async (institutionId, logo) => {
    const token = localStorage.getItem(FIN_ACCESS_TOKEN);
    localStorage.setItem(BANK_IMG,logo);
    try {
      const res = await axios.post(
        `/api/v2/requisitions/`,
        {
          institution_id: institutionId,
          redirect: "http://localhost:5173/accounts/",
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem(LINK_ID, res.data.id);
      window.location.href = res.data.link;
    } catch (error) {
      console.error("An error occurred while linking the account:", error);
      const message=error.response.data
    if(message.includes("rate")){
      navigate("/NotFound");
    }
    }
  };

  const filteredBanks = banksList.filter((bank) =>
    bank.name.toLowerCase().includes(query.toLowerCase())
  );

  
    return (
      <div>
        <h1>Bank List</h1>
        <div id="drop_box">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {filteredBanks.map((bank, index) => (
            <div
              key={index}
              className="bank-option"
              onClick={() => handleLink(bank.id, bank.logo)}
            >
              <input
                type="radio"
                id={`bank-${index}`}
                name="bank"
                value={bank.id}
                className="option"
              />
              <label htmlFor={`bank-${index}`} className="bank-label">
                <img src={bank.logo} alt={bank.name} className="bank-logo" />
                {bank.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
 
   
}

export default BanksDropdownList;