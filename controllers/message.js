const Message = require('../models/message');
const Game = require('../models/game');
const User = require('../models/user');


exports.postMessage = async (req, res, next) => {
    try {
        console.log('Received message request:', req.body);
        const { content, gameId, username } = req.body;

        if (!content || !gameId || !username) {
            console.log('Validation failed:', { content, gameId, username });
            return res.status(400).json({
                status: 'error',
                message: 'Content, gameId and username are required'
            });
        }

        console.log('Find user by username');
        const user = typeof username === 'string' 
            ? await User.findOne({ name: username }) 
            : await User.findById(username);
        if (!user) {
			console.log('Find User not foun by username');
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        console.log('Found user:', user._id);

        console.log('Finding game with ID:', gameId);
        const game = await Game.findById(gameId);
        if (!game) {
            console.log('Game not found:', gameId);
            return res.status(404).json({
                status: 'error',
                message: 'Game not found'
            });
        }
        console.log('Found game:', game._id);

        console.log('Creating message with:', {
            content,
            sender: user._id,
            game: gameId
        });
        
        const message = new Message({
            content: content,
            sender: user._id,
            game: gameId
        });

        console.log('Message object before save:', message);

        try {
            const savedMessage = await message.save();
            console.log('Message saved successfully:', savedMessage);
        } catch (saveError) {
            console.error('Error saving message:', saveError);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to save message',
                error: saveError.message
            });
        }

        await message.populate('sender', 'username');
        console.log('Populated message:', message);

        res.status(201).json({
            status: 'success',
            data: {
                message
            }
        });

    } catch (error) {
        console.error('Controller error:', error);
        if (next) {
            next(error);
        } else {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};


exports.getMessages = async (req, res, next) => {
    try {
        const { gameId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        if (!gameId) {
            return res.status(400).json({
                status: 'error',
                message: 'GameId is required'
            });
        }

        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({
                status: 'error',
                message: 'Game not found'
            });
        }

        const messages = await Message.find({ game: gameId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('sender', 'username')
            .lean();

        const totalMessages = await Message.countDocuments({ game: gameId });

        res.status(200).json({
            status: 'success',
            data: {
                messages,
                pagination: {
                    current: page,
                    pages: Math.ceil(totalMessages / limit),
                    total: totalMessages,
                    limit
                }
            }
        });

    } catch (error) {
        next(error);
    }
};


exports.deleteMessagesByGameId = async (gameId) => {
    return await Message.deleteMany({ game: gameId });
};