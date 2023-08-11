import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import cors from  'cors';

// DB
import dbConnect from "./db/dbConnect.js";
import  User  from "./db/userModel.js";
import  Post  from "./db/postModel.js";
import Comment from "./db/commentModel.js";
import query from "./lib/queryChatgptApi.js"; 

//UTIL
import getDate from "./util/getDate.js";
import generatePosts from "./util/generatePosts.js";

//LIB
import callChatgpt from "./lib/callChatGPT.js";

const app = express();
app.use(cors());
app.use(express.json());

// execute database connection 
dbConnect();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
});

app.post("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
});

app.get('/register', (request, response) => {
  response.json({ message: 'hi '})
})

app.post("/register", async (request, response) => {
  const {email, password} = request.body
 
  //check if email is in use
  User.findOne({ email: email })
    // if email exists
    .then((user) => {
      if(user){  
        //email does not exist
        return response.status(409).send({
              message: "Email is taken",
              error:'ofc',
      })     
  }

  try{
  // hash the password
  bcrypt
  .hash(password, 10)
  .then((hashedPassword) => {
    // create a new user instance and collect the data
    const user = new User({
      email: email,
      password: hashedPassword,
      token: 0,
    });

    // save the new user
    user
      .save()
      // return success if the new user is added to the database successfully
      .then((result) => {
        console.log("Register - 201")
        response.status(201).send({
          message: "User Created Successfully",
          result:result,
        });
      })
      // catch error if the new user wasn't added successfully to the database
      .catch((error) => {
        console.log("Register - 500 - 1")
        response.status(500).send({
          message: "User wasn't added successfully to the database",
          error: error,
        });
      });
  }).catch((e) => {
    console.log("Register - 500 -2")
    response.status(500).send({
      message: "Password was not hashed successfully",
      e:e,
    })
  })
 
  }catch{
    console.log('pw error')
  }
})
});

app.get("/login", (request, response) => {
  response.json({ message: "Hey! This is your server response!" });
});

// login endpoint
app.post("/login", (request, response) => {
 
 const email = request.body.email
 const password = request.body.password
 
 try{
  User.findOne({ email: email })
  
    // if email exists
    .then((user) => {
      if(!user){
        //email does not exist
        return response.status(400).send({
              message: "No user does not match",
              error:'ofc',
        });
      }
      // compare the password entered and the hashed password found
      bcrypt
        .compare(password, user.password)

        // if the passwords match
        .then((passwordCheck) => {
         
          // check if password matches
          if(!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          //   create JWT token
          console.log('user id',user._id)
          const userID = user._id
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );
          user.token = token
          user.save()
          
          // return success response
          response.status(200).cookie('token', token).send({
            message: "Login Successful",
            email: user.email,
            userID: userID,
            token: token,
          });
        })
        
        // catch error if password does not match
  
        .catch((error) => {
          console.log('bad pass')
          response.status(401).send({
            message: "Passwords does not match!",
            error: 'error',
          });
        });
    })
 }catch(error){
  response.status(401).send({
    message: "not sure bud",
    error: 'error',
  });
 }
 
});

app.get("/profile",(request, response) => {
  response.json({ message: "get profile"})
});

app.post("/profile",  (request, response) => {
  // check if user is logged in
  if(!request.body.token){
    return;
  }
  
  // user is logged in grab token
  const token = request.body.token

  // find account associated to cookie
  if(token){
    User.findOne({ token: token }).then(user => {
      if(user){
        response.json({ message: user.email, userId: user._id})
      }
    })
  }  
});

// generate posts
app.get("/test-endpoint-ml", (request, response) => {
  callChatgpt("Machine Learning");
  response.json({ message: 'test'});
});

// generate posts
app.get("/test-endpoint", (request, response) => {
  callChatgpt("Computer Security");
  response.json({ message: 'test'});
});

// generate posts
app.get("/test-endpoint-fitness", (request, response) => {
  callChatgpt("Fitness");
  response.json({ message: 'test'});
});

// generate posts
app.get("/test-endpoint-crypto", (request, response) => {
  callChatgpt("Crypto");
  response.json({ message: 'test'});
});

// generate posts
app.get("/test-endpoint-current-events", (request, response) => {
  callChatgpt("Current Events");
  response.json({ message: 'test'});
});

app.get("/generate",  async(request, response) => {
  //generates post categories based on request str
  console.log('resp generate', request.query)
  const category = request.query.category
  console.log('category',category)
  if(category){
    callChatgpt("Machine Learning")
  }else{
    callChatgpt("Fitness")
  }
  response.json({ message: 'test'});
});

app.get("/test-endpoint-ai", (request, response) => {
  callChatgpt("Artificial Intelligence");
  response.json({ message: 'test'});
});


app.get("/add-comment", (request, response) => {
  console.log('req',request)
})


app.post("/add-comment", (request, response) => {
  const body = request.body
  const reqComment = body.reqComment
  const postIndex = body.postIndex
  const commentUser = body.commentUser
  const formattedToday = getDate()
 
   // create blog object
   const comment = new Comment({
    text: reqComment,
    author: commentUser,
    post: postIndex,
    createdAt: formattedToday,
    parsedCreatedAt: formattedToday,
    
  });

  // save the new post
  comment
  .save()
})

app.get("/get-comments", (request, response) => {
  response.json({message:'get-comments'})
})

app.post("/get-comments", (request, response) => {
    const postId = request.body.postId
    Comment.find({ post: postId }).then(comment => {
      response.json({comment:comment}) 
    })
})



app.post("/get-profile", (request, response) => {
  // check if user is logged in
  if(request.body.varProfileID){
    // user is logged in get db object
    User.findOne({ _id:request.body.varProfileID}).then(user => {
      if(user){
        // if user has liked posts find those posts
        if(user.likes){
          Post.find({ _id:user.likes}).then(profile_post => {
            if(profile_post){
              response.json({posts:profile_post})
            }
          })
      }
    }
  })
}

})


app.post("/add-reply", (request, response) => {
  const body = request.body
  const reqComment = body.userReply
  const postIndex = body.commentIndex
  const commentUser = body.commentUser
  const formattedToday = getDate()
  
  // find the comment to add a reply to
  Comment.findOne({_id: body.commentIndex,}).then(comment => {
    //found comment
    console.log('comment', comment)
    console.log('comment author', comment.author)
    // create reply obj
    const reply = new Comment({
      text: reqComment,
      author: commentUser,
      post: postIndex,
      parsedCreatedAt: formattedToday,
      replyTo: comment.author,
    })

    // add reply to db
    reply.save()
    response.status(200).send({
      message: "Success creating post",
     
    });
  })
  
})

app.get("/add-like", (request, response) => {
  response.json({comment:'get add like'})
})
 
  // add post to users likes
app.post("/add-like", (request, response) => {
 
  const profileID = request.body.profileID
  const postIndex = request.body.postIndex
  
  var like = false

  User.findOne({_id: profileID,}).then(user => {
     
      const likes = user.likes
      // check if user has liked a psot
      if(likes){
        // like = true is user has already like this post
        // like = false user has not liked this post 
        like = likes.includes(postIndex)
      }


      Post.findOne({_id:postIndex,}).then(post => { 
        // find post db obj
        if(post){
        // get the current number of likes on post  
        const currentLikes = post.likes
          // post is already liked by user remove like
          if(like){
            post.likes = post.likes - 1
            // update likes
            User.findOneAndUpdate({_id: profileID,},{$pull: {likes: postIndex,},}).then(user => user.save()) 
            if (currentLikes == null){
              post.likes = 0;
            }else{
              post.likes = currentLikes - 1;
            }
          post.save()
          }else{
            // post has not already been liked by user so we add the like
            // add like
            User.findOneAndUpdate({_id: profileID,},{$addToSet: {likes: postIndex,},}).then(user => { user.save()}) 

             // inc post likes
            if (currentLikes == null){ 
              post.likes = 1; 
            }else{
              post.likes = currentLikes + 1;
            }
          // update db with new number of likes
          post.save()
          }
    
          response.json({msg:post.likes})
        }
  })
  })
})

app.get('/get-has-user-liked', (request, response) => {
  response.json({msg:'get-has-user-liked'})
})

app.post('/get-has-user-liked', (request, response) => {
  // check if user has liked a post
  var profileID = request.body.profileID
  var postIndex = request.body.postIndex
  var hasLiked = false
  User.findOne({ _id:profileID}).then(user => {
   
    if(user){
      if(user.likes.includes(postIndex)){
        hasLiked = true
      }
    }
    response.json({msg:hasLiked}) 
  })

})

app.get('/get-likes', (request, response) => {
  response.json({msg:'get likes'})
})

app.post('/get-likes', (request, response) => {
  const postIndex = request.body.postIndex
 
  var hasLikes = 0
  Post.findOne({ _id: postIndex }).then(post => {
    if(post){
      //post has not been liked yet
      if(!post.likes){
        post.likes = 0
        hasLikes = 0
      }else{   
        //post has likes
        //haslikes = number of likes on post
        hasLikes = post.likes
      }
      response.json({msg:hasLikes})
    }else{
      response.json({msg:'0'})
    }
  })

})


app.get('/get-reply', (request, response) => {
  response.json({comment:"get reply"})
})

app.post("/get-reply", (request, response) => {
  
  const postId = request.body.postId
  Comment.find({ post: postId }).then(comment => {
      response.json({comment:comment})
  })

})

app.get("/blogs", (request, response) => {
  
  var titles = [];
  // retrieve all posts
  Post.find({}).then(function (posts){
    posts.forEach(function(user) {titles.push(user)});
    response.json({message:titles});
  })

});


app.get("/machine-learning", (request, response) => {
 
  var titles = [];
  // retreive post category
  Post.find({blog_category:"Machine Learning"}).then(function (posts){
    posts.forEach(function(var_post) {titles.push(var_post)});
    response.json({message:titles});  
  })

});

app.get("/artificial-intelligence", (request, response) => {
 
  var titles = [];
   // retreive post category
  Post.find({blog_category:"Artificial Intelligence"}).then(function (posts){
    posts.forEach(function(var_post) {titles.push(var_post)});
    response.json({message:titles}); 
  })
  
});

app.get("/computer-security", (request, response) => {
 
  var titles = [];
   // retreive post category
  Post.find({blog_category:"Computer Security"}).then(function (posts){
    posts.forEach(function(var_post) {titles.push(var_post)});
    response.json({message:titles});
  })

});

app.get("/crypto", (request, response) => {
 
  var titles = [];
   // retreive post category
  Post.find({blog_category:"Crypto"}).then(function (posts){
    posts.forEach(function(var_post) {titles.push(var_post)});
    response.json({message:titles});
  })
  
});

app.get("/fitness", (request, response) => {
 
  var titles = [];
   // retreive post category
  Post.find({blog_category:"Fitness"}).then(function (posts){
    posts.forEach(function(user) {titles.push(user)});
    response.json({message:titles});
  })
  
});

app.get("/current-events", (request, response) => {
  var titles = [];

  // retreive post category
  Post.find({blog_category:"Current Events"}).then(function (posts){
    posts.forEach(function(user) {titles.push(user)});
    response.json({message:titles});
  })
  
});

app.post("/get-blog", (request, response) => {
  // retreive a singular blog post
  Post.findOne({ _id:request.body.idx }).then(post => response.json({message:post}))

})


app.post("/search", (request, response) => {
  // search for text in post by post contet / body
  Post.findOne({content: {$regex : request.body.search  }}).then(post => response.json({message:post}))
});

app.get("/posts", async (req, res) => {
  try {
    console.log('req query',req.query)
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    console.log('pageNUmber',pageNumber)
    const limit = parseInt(req.query.limit) || 12;
    const result = {};
    const totalPosts = await Post.countDocuments().exec();
    console.log('total Posts',totalPosts)
    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;
    result.totalPosts = totalPosts;
    // check that it is not the first page then store pervious pageNumber and limit
    if (startIndex > 0) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }

    // check that there a more pages avaible then store the next page
    if (endIndex < (await Post.countDocuments().exec())) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }

    // retreive posts
    result.data = await Post.find()
      .sort("-_id")
      .skip(startIndex)
      .limit(limit)
      .exec();
    result.rowsPerPage = limit;
    return res.json({ msg: "Posts Fetched successfully", data: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
  }
});

app.get("/category", async (req, res) => {
  try {
    console.log('req query',req.query)
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    console.log('pageNUmber',pageNumber)
    const limit = parseInt(req.query.limit) || 12;
    const result = {};

    var category = 'default'
    // format str
    if(req.query.category === 'machine-learning'){
      category = 'Machine Learning'
    }
    if(req.query.category === 'computer-security'){
      category = 'Computer Security'
    }
    if(req.query.category === 'artificial-intelligence'){
      category = 'Artificial Intelligence'
    }
    if(req.query.category === 'fitness'){
      category = 'Fitness'
    }
    if(req.query.category === 'crypto'){
      category = 'Crypto'
    }
    if(req.query.category === 'current-events'){
      category = 'Current Events'
    }

    const totalPosts = await Post.find({blog_category:category}).count()
    console.log('total Posts',totalPosts)
    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;
    result.totalPosts = totalPosts;

    // check that it is not the first page then store pervious pageNumber and limit
    if (startIndex > 0) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }
    // check that there a more pages avaible then store the next page
    if (endIndex < (await Post.find({blog_category:req.query.category}).count())) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }
    // retreive posts for specific category
    result.data = await Post.find({blog_category:category})
      .sort("-_id")
      .skip(startIndex)
      .limit(limit)
      .exec();
    result.rowsPerPage = limit;
    return res.json({ msg: "Posts Fetched successfully", data: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
  }
});

export default app;



