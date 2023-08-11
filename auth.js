
import jwt from "jsonwebtoken";

const auth = async (request, response, next) => {
  try {
    //   get the token from the authorization header
    console.log("auth",request.body)
    const token = request.headers
    
    console.log('token',token)
    //console.log("token",token)
    //check if the token matches the supposed origin
    //const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");
   // console.log('dec',decodedToken)
    // retrieve the user details of the logged in user
    
    // pass the user down to the endpoints here
    //request.user = user;
     //const user = request.user
    // console.log('user',user)
    // pass down functionality to the endpoint
   // next(user);
    
     

  } catch (error) {
    console.log(error)
    
  }
};

export default auth;
