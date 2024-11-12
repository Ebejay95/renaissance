const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();
router.use(express.json()); // For parsing application/json
router.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/pw-gen', authController.getPwGen);

router.post('/pw-gen', authController.processPwGen);

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);

router.post('/ajax-username', authController.validateUserName);

router.get('/logout', authController.postLogout);

router.get('/reset/:token', authController.getReset);
router.post('/reset', authController.postReset); 

module.exports = router;