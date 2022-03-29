// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const bcrypt = require('bcryptjs');
const Users = require('../users/users-model');

const router = require('express').Router();
const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require('./auth-middleware');

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
router.post('/register', checkUsernameFree, checkPasswordLength, (req, res, next) => {
  const hash = bcrypt.hashSync(req.body.password);
  
  Users.add({ username: req.body.username, password: hash})
  .then(resp => {
    res.json(resp);
  })
  .catch(error => {
    next(error); 
  })
})

router.post('/login', checkUsernameExists, (req, res, next) => {
  if(bcrypt.compareSync(req.body.password, req.user.password)){
     
    req.session.user = req.user
    res.json({ message: `Welcome ${req.user.username}`})
  }else{
    next({ status: 401, message: 'Invalid credentials'})
  }
})
/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */

router.get('/logout', (req, res, next) => {
  if(req.session.user){
    req.session.destroy(err => {
      if(err){
        next(err);
      }else{
        res.json({ message : 'logged out'})
      }
    });
  }else{
    next({ status: 200, message: 'no session'})
  }
})
/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

 
// Don't forget to add the router to the `exports` object so it can be required in other modules

module.exports = router;