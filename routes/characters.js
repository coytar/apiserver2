var express = require('express');
var router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');// authorization
const Character = require('../models/character.js'); // User Model

router.get('/', async (req, res) => {
  if (Object.keys(req.query).length > 0) {
    const keys = Object.keys(req.query);
    const key = keys[0];
    const value = req.query[key];
    const resp = await Character.GetMany(key, value);
    return res.send(resp);
  }
  const resp = await Character.GetAll();
  return res.send(resp);
});

router.get('/:userId', connectEnsureLogin.ensureLoggedIn('/mustlogin'), async (req, res) => {
  const resp = await Character.Get(req.params.userId);
  return res.send(resp);
});

router.get('/:userId/:prop', connectEnsureLogin.ensureLoggedIn('/mustlogin'), async (req, res) => {
  try {
    const resp = await Character.GetField(req.params.userId, req.params.prop);
    return res.send(resp.get(req.params.prop, String));
  }
  catch (ex) {
    console.log(ex);
    return res.send("Error!");
  }
});

router.post('/:userId', connectEnsureLogin.ensureLoggedIn('/mustlogin'), async (req, res) => {
  return res.status(405).send("");
});

router.put('/:userId', connectEnsureLogin.ensureLoggedIn('/mustlogin'), async (req, res) => {
  const keys = Object.keys(req.body);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = req.body[key];
    await Character.SetField(req.params.userId, key, value);
  }
  return res.send("OK");
});

router.delete('/:userId', connectEnsureLogin.ensureLoggedIn('/mustlogin'), async (req, res) => {
  return res.status(405).send("");
});

module.exports = router;
