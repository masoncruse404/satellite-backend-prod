import openai from "./chatgpt.js"
import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.OPENAI_API_KEY
async function imageGen(){
    const prompt = 'a dog'
    try{
    const response = await openai.Image.create(
        {
            prompt:prompt,
            n:1,
            size:"1024x1024",
        }) 
        console.log(response.data.data[0].url); 
    }catch(e){
        console.log(e);
    }

    image_url = response['data'][0]['url']

    console.log('image_url', image_url);
}

export default imageGen;