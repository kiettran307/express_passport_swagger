const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
  // const { body: { user } } = req;
  console.log('req.body ', req.body);
  const user = req.body;
  if(!user.email) {
    return res.send({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.send({
      errors: {
        password: 'is required',
      },
    });
  }

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  return finalUser.save()
    .then(() => res.send({ user: finalUser }));
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  // const { body: { user } } = req;
  // console.log('user ', user);
  const user = {email: req.body.email, password: req.body.password};
  console.log('user ', user);

  if(!user.email) {
    return res.send({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.send({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, user, info) => {
    if(err) {
      return next(err);
    }
    if(user) {
      return res.send({ user: user.toAuthJSON() });
    }
    return res.status(400).send(info);
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const { body: { id } } = req;
  console.log('id', req.body.id);
  return Users.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
});
router.get('/all', auth.required, (req, res, next) => {
  return Users.find({})
    .then((users) => {
      if(!users) {
        return res.sendStatus(400);
      }

      return res.json({ users });
    });
});
module.exports = router;