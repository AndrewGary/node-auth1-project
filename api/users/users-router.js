// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!

const router = require('express').Router();
const Users = require('./users-model');
const { restricted } = require('../auth/auth-middleware');

router.get('/', restricted, (req, res, next) => {
  
  Users.find()
  .then(resp => {
    res.status(200).json(resp)
  })
  .catch(error => {
    next(error);
  })
})

router.get('/:id', (req, res, next) => {
  
  Users.findById(req.params.id)
  .then(resp => {
    console.log('yeahhh')
    console.log('resp: ', resp);
    res.status(200).json(resp);
  })
  .catch(error => {
    next(error);
  })
})

/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */


// Don't forget to add the router to the `exports` object so it can be required in other modules

module.exports = router;