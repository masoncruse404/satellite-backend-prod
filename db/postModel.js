import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title!"],
        unique: false,
    },

    content: {
        type: String,
        required: [true, "Please provide content!"],
        unique: false,
    },

    author: {
        type: String,
        required: [true, "Please provide an author!"],
        unique: false,
    },

    blog_category: {
        type: String,
        required: [true, "Please provide a category!"],
        unique: false,
    },
    likes: {
        type: Number,
    },
    createdAt: {
        type: String,
    },
    parsedCreatedAt: {
    type: String,
    },
    image:{
        type: String,
    },



})

const Post = mongoose.model.Posts || mongoose.model("Posts", PostSchema);

export default Post;