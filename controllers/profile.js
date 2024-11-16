const { authRedirect } = require('./auth');
const User = require('../models/user');
const Game = require('../models/game');

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.user._id).populate('friends');
        
        const games = await Game.find({
            users: req.session.user._id
        });

        res.render('profile/profile', {
            path: '/profile',
            pageTitle: "Profil von " + user.name,
            user: user,
            friends: user.friends,
            games: games
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Ein Fehler ist aufgetreten.');
        res.redirect('/');
    }
};


exports.updateUsername = async (req, res, next) => {
    const { newUsername } = req.body;
    const userId = req.session.user._id;

    const nameRegex = /^[a-z0-9_]+$/;
    if (!nameRegex.test(newUsername)) {
        req.flash('error', 'Der Name darf nur kleine Buchstaben, Zahlen und Unterstriche enthalten.');
        return res.redirect('/profile');
    }

    try {
        const existingUser = await User.findOne({ name: newUsername });
        if (existingUser && existingUser._id.toString() !== userId) {
            req.flash('error', 'Dieser Benutzername ist bereits vergeben.');
            return res.redirect('/profile');
        }

        const user = await User.findById(userId);
        user.name = newUsername;
        await user.save();
        
        req.session.user = user;
        req.flash('success', 'Benutzername erfolgreich geändert.');
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Ein Fehler ist aufgetreten.');
        res.redirect('/profile');
    }
};

exports.searchFriends = async (req, res, next) => {
    const { username } = req.query;
    const userId = req.session.user._id;
    
    try {
        const user = await User.findById(userId).populate('friends');
        const potentialFriend = await User.findOne({ name: username });
        
        if (!potentialFriend || potentialFriend._id.toString() === userId) {
            return res.json({ success: true, found: false });
        }
        
        const isAlreadyFriend = user.friends.some(friend => 
            friend._id.toString() === potentialFriend._id.toString()
        );
        
        if (isAlreadyFriend) {
            return res.json({ 
                success: true, 
                found: false, 
                message: 'Bereits befreundet' 
            });
        }

        return res.json({
            success: true,
            found: true,
            user: {
                id: potentialFriend._id,
                name: potentialFriend.name
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: 'Ein Fehler ist aufgetreten.' 
        });
    }
};

exports.addFriend = async (req, res, next) => {
    const { friendId } = req.body;
    const userId = req.session.user._id;

    try {
        const [user, friend] = await Promise.all([
            User.findById(userId),
            User.findById(friendId)
        ]);

        if (!friend) {
            return res.json({ 
                success: false, 
                message: 'Benutzer nicht gefunden.' 
            });
        }

        if (user.friends.includes(friendId) || friend.friends.includes(userId)) {
            return res.json({ 
                success: false, 
                message: 'Ihr seid bereits befreundet.' 
            });
        }

		const isDuplicateForUser = user.friends.filter(id => id.toString() === friendId.toString()).length > 0;
		const isDuplicateForFriend = friend.friends.filter(id => id.toString() === userId.toString()).length > 0;
		
		if (!isDuplicateForUser && !isDuplicateForFriend) {
			user.friends.push(friendId);
			friend.friends.push(userId);
		}

        await Promise.all([user.save(), friend.save()]);
        
        res.json({ 
            success: true, 
            message: `${friend.name} wurde als Freund hinzugefügt.`,
            friend: { id: friend._id, name: friend.name }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: 'Ein Fehler ist aufgetreten.' 
        });
    }
};

exports.removeFriend = async (req, res, next) => {
    const { friendId } = req.params;
    const userId = req.session.user._id;

    try {
        const [user, friend] = await Promise.all([
            User.findById(userId),
            User.findById(friendId)
        ]);

        if (!friend) {
            return res.json({ 
                success: false, 
                message: 'Benutzer nicht gefunden.' 
            });
        }

        const commonGames = await Game.find({
            users: { $all: [userId, friendId] }
        });

        if (commonGames.length > 0) {
            return res.json({ 
                success: false, 
                message: 'Freund kann nicht entfernt werden - ihr habt noch gemeinsame Spiele.' 
            });
        }

        user.friends = user.friends.filter(id => id.toString() !== friendId.toString());
        friend.friends = friend.friends.filter(id => id.toString() !== userId.toString());

        await Promise.all([user.save(), friend.save()]);

        res.json({ 
            success: true, 
            message: `${friend.name} wurde aus deiner Freundesliste entfernt.` 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: 'Ein Fehler ist aufgetreten.' 
        });
    }
};