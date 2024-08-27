import React from "react"
import axios from "axios";
import { FIN_ACCESS_TOKEN ,FIN_ACCESS_REFRESH} from "../constant";
//gets the access token for GoCardless API
const  getAccessToken = async () => {
    
    try {
        
        const  res = await axios.post(
            "/api/v2/token/new/",
            {
              secret_id:import.meta.env.VITE_SECRET_ID,
              secret_key:import.meta.env.VITE_SECRET_KEY
            },
            {
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                 
              },
              
          }
        );
        //stores the tokens in the local storage 
      localStorage.setItem(FIN_ACCESS_TOKEN, res.data.access);
      localStorage.setItem(FIN_ACCESS_REFRESH,res.data.refresh)
     
    } catch (error) {
      if (error.response) {
        
        console.log('Error data:', error.response.data);
      console.log('Error status:', error.response.status);
        console.log('Error headers:', error.response.headers);
    } else if (error.request) {
       
        console.log('Error request:', error);
    } else {
         console.log('Error message:', error.message);
    }
     console.log('Error config:', error.config);
     console.log("An error occurred. Check the console for details.");

      
        
    
    }
    

        
        
  };

//gets the refresh token for GoCardless API
  const  refresh = async () => {
        try{
         const  res = await axios.post(
            "/api/v2/token/refresh/",
            {
              refresh:localStorage.getItem(FIN_ACCESS_REFRESH)
            },
            {
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                 
              },
              
          }
        );
        //stores the token in the local storage 
        localStorage.setItem(FIN_ACCESS_TOKEN,res.data.access)
        
      }
      catch (error) {
        
        getAccessToken()
      }
   
  }

    const FinAuth = async  () => {
      try{
       refresh()
        
       }
       catch(error){ 
        console.log("Error in fetching access token")
       }
     
     
    }





export default FinAuth;

