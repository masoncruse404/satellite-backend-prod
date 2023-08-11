import query from "./queryChatgptApi.js";

const callChatgpt = async(var_blog_category) => {

    const prompt = "write a blog post about" + var_blog_category + "with a title in quotes"
    const model = "text-davinci-003";
    const blog_category = var_blog_category
    const res = await query(prompt, model, blog_category)
    return;
  }

export default callChatgpt;