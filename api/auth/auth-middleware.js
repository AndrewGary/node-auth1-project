const Users = require('../users/users-model');

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if(req.session.user){
    next()
  }else{
    next({ status: 401, message: 'you shall not pass'})
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  try{
    const test = await Users.findBy({ username: req.body.username })

    if(test.length){
      next({ status: 422, message: 'Username taken'})
    }else{
      next();
    }
  }catch(error){
    next(error);
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try{
    const test = await Users.findBy({ username: req.body.username });

    if(test.length){
      req.user = test[0];
      next();
    }else{
      next({ status: 401, message: 'Invalid credentials'})
    }
  }catch(error){
    next(error);
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
    if(req.body.password.length < 4){
      next({status: 422, message: 'Password must be longer than 3 chars'})
    }else{
      next();
    }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = { 
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength 
  
};