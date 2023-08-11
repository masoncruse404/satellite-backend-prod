import dotenv from "dotenv";
dotenv.config();
import openai from "./chatgpt.js";
import  Post  from "../db/postModel.js";
import changeImage from "../util/generateImage.js";

const apiKey = process.env.OPENAI_API_KEY
const createBlogPost = (var_title, var_content, var_blog_category, var_author, var_likes, var_image) => {
// create blog object

const createdAt = new Date();

const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

const formattedToday = dd + '/' + mm + '/' + yyyy;
  const post = new Post({
    title: var_title,
    content: var_content,
    blog_category: var_blog_category,
    author: var_author,
    likes: var_likes,
    createdAt: createdAt,
    parsedCreatedAt: formattedToday,
    image: var_image,
  });

  // save the new post
  post
  .save()
}
 
  const query = async (prompt, model, var_blog_category) => {
  
    const res = await openai.createCompletion(
    {
        model: model,
        prompt: prompt,
        temperature: 0.99,
        top_p: 1,
        max_tokens: 1000,
        frequency_penalty: 0,
        presence_penalty: 0,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      }
    })
    .then((res) =>  { 
        console.log('res',res)
        const title = res.data.choices[0].text.split('"')[1]
        console.log('title', title)
        const text = res.data.choices[0].text.split('"')[2]
        console.log('text ', text)
        let image = changeImage()
        console.log('create image',image)
        createBlogPost(title, text, var_blog_category, model, 0, image)
    })
    .catch(
      (err) => {
        console.log('error', err)
    });
     
  return res
};

export default query;
