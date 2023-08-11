import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  

    text: {
        type: String,
        required: [true, "Please provide content!"],
        unique: false,
    },

    author: {
        type: String,
        required: [true, "Please provide an author!"],
        unique: false,
    },

    author_Index: {
        type: String,

    },

    post: {
        type: String,
    },

    comment_Index: {
        type: String,
    },

    replyTo: {
        type: String,
    },

   
    createdAt: {
            type: String,
    },
    parsedCreatedAt: {
        type: String,
    },
    
  


})

const Comment = mongoose.model.Comments || mongoose.model("Comments", CommentSchema);

export default Comment;