import { response } from "express"
import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.OPENAI_API_KEY
async function query(){
    const auth = `Bearer ${apiKey}`;
    const resp = await fetch('https://api.openai.com/v1/completions', {
        Method: 'POST',
        Headers: {
          Authorization: auth, 
          Accept: 'application.json',
          'Content-Type': 'application/json'
        },
       
      }
      ).then(res => console.log('res',res))
      console.log(`This is ${resp} times easier!`);
    
      return resp;
}

export default query