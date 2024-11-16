const express = require('express');
const profileController = require('../controllers/profile');

const router = express.Router();
router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));

router.get('/profile', profileController.getProfile);
router.post('/profile/update-username', profileController.updateUsername);
router.get('/profile/search-friends', profileController.searchFriends);
router.post('/profile/add-friend', profileController.addFriend);
router.delete('/profile/remove-friend/:friendId', profileController.removeFriend);

module.exports = router;