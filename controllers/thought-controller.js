const { Thought, User } = require('../models');

const thoughtController = {
    getThoughts(req, res) {
        Thought.find({})
        .populate({ path: 'reactions', select: '-_v' })
        .select('-_v')
        .then(thoughtData => res.json(thoughtData))
        .catch(err => res.status(500).json(err))
    },

    getThoughtById({ params}, res) {
        Thought.findOne({ _id: params.id })
        .populate({ path: 'reactions', select: '-_v' })
        .select('-_V')
        .then(thoughtData => thoughtData ? res.json(thoughtData) : res.status(404).json({ message: 'No thought with that ID :('}))
        .catch(err => res.status(404).json(err))
    },

    createThought({ body }, res) {
        Thought.create({ thoughtText: body.thoughtText, username: body.username })
        .then(({ _id }) => User.findOneAndUpdate({ _id: body.userId}, { $push: { thoughts: _id } }, { new: true }))
        .then(thoughtData => res.json(thoughtData))
        .catch(err => res.status(400).json(err))
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(thoughtData => thoughtData ? res.json(thoughtData) : res.status(404).json({ message: 'No thought with that ID :)' }))
        .catch(err => res.status(400).json(err))
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(thoughtData => thoughtData ? res.json({ message: 'Thought Successfully Deleted :)'}) : res.status(404).json({ message: 'No thought with that ID :('}))
        .catch(err => res.status(404).json(err))
    },

    createReaction({ params, body}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: { reactionBody: body.reactionBody, username: body.username } } },
            { new: true, runValidators: true }
        )
        .then(thoughtData => thoughtData ? res.json(thoughtData) : res.status(404).json({ message: 'No thought with that ID :(' }))
        .catch(err => res.status(400).json(err))
    },

    removeReaction({ params }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId}, { $pull: { reactions: { _id: params.reactionId } } }, { new: true })
        .then(thoughtData => thoughtData ? res.json(({ message: 'Reaction Successfully Deleted :)' })) : res.status(404).json)({ message: 'No thought with that ID :('})
        .catch(err => res.status(404).json(err))
    }
}

module.exports = thoughtController;
