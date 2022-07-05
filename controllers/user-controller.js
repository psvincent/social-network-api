const { User, Thought } = require('../models')

const userController = {
    getUsers(req, res) {
        User.find({})
        .populate({ path: 'thoughts', select: '-_v'})
        .populate({ path: 'friends', select: '-_v'})
        .select('-_v')
        .then(userData => res.json(userData))
        .catch(err => res.status(500).json(err))
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({ path: 'friends', select: '-_v' })
        .populate({ path: 'thoughts', select: '-_v', populate: { path: 'reactions' }})
        .select('-_v')
        .then(userData => userData ? res.json(userData) : res.status(404).json({ message: 'No user with that ID :('}))
        .catch(err => res.status(404).json(err))
    },

    createUser({ body}, res) {
        User.create({ username: body.username, email: body.email })
        .then(userData => res.json(userData))
        .catch(err => res.status(400).json(err))
    },

    updateUser({ params, body  }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(userData => userData ? res.json(userData) : res.status(404).json({ message: 'No user with that ID :('}))
        .catch(err => res.status(400).json(err))
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(userData => {
            if (!userData) {
                return res.status(404).json({ message: 'No user with that ID :('})
            }
            Thought.deleteMany({ username: userData.username}).then(deletedData => deletedData ? res.json({ message: 'User Successfully Deleted' }) : res.status(404).json({ message: 'No user with that ID :( '}))
        })
        .catch(err => res.status(400).json(err))
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.userId}, { $push: { friends: params.friendId } }, { new: true, runValidators: true })
        .then(userData => res.json(userData))
        .catch(err => res.status(400).json(err))
    },

    removeFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.userId}, { $pull: { friends: params.friendId} })
        .then(userData => res.status(200).json('User Successfully Deleted'))
        .catch(err => res.json(err))
    }
}

module.exports = userController;
