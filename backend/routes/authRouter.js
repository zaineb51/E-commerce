const authController = require('../controllers/authController');
const auth = require('../middleware/verif');

const route = require('express').Router();

route.post("/login", authController.login);
route.get("/logout", authController.logout);
route.post("/forgot", authController.forget);
route.post("/reset/:token", authController.resetPassword);
route.get("/",auth, authController.fetchUser);

module.exports = route;
