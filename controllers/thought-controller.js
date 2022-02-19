const {Thought, User} = require('../models');

const thoughtController = {
    getAllThoughts(req,res) {
        Thought.find({})
        .then(response => res.json(response))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    getThoughtById({params}, res) {
        Thought.findOne({_id: params.id})
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({message: 'no thought found with this id'});
                    return;
                }
                res.json(dbThoughtData);
            }).catch(err => console.log(err));
    },
    createThought({body}, res) {
        Thought.create(body)
            .then(({_id}) => {
                console.log(_id);
                return User.findOneAndUpdate(
                    {_id: body.userId},
                    {$push: {thoughts: _id}},
                    {new: true}
                )
            }).then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({message: 'no user with this id found'});
                    return;
                }
                res.json(dbUserData);
            }).catch(err => res.json(err));
    },
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({_id: params.id}, body)
            .then(updatedThought => {
                if(!updatedThought) {
                    res.status(404).json({message: 'no thought with this id found'});
                    return;
                }
                res.json(updatedThought);

            }).catch(err => {
                console.log(err);
                res.json(err);
            })
    },
    deleteThought({params}, res) {
        Thought.findOneAndDelete({_id: params.thoughtId})
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({message: 'no thought with this id found'});
                }
                return User.findOneAndUpdate(
                    {_id: params.userId},
                    {$pull: {thoughts: params.thoughtId}},
                    {new: true}
                ).then(dbUserData => {
                    if (!dbUserData) {
                        res.status(404).json({message: 'no user found with this id'});
                        return;
                    }
                    res.json(dbUserData);
                }).catch(err => res.json(err));
            })
    },
    addReply({params, body}, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId}, 
            {$push: {reactions: body}},
            {new: true, runValidators: true}
            )
            .then(reactionRespone => {
                if(!reactionRespone) {
                    res.status(404).json({message: "no thought foundd with this id"});
                    return;
                }
                res.json(reactionRespone);
            }).catch(err => {
                console.log(err);
                res.json(err);
            })
    },
    deleteReply({params}, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$pull: {reactions: {reactionId: params.reactionId}}},
            {new: true}
        ).then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'no thought with this id found'});
                return;
            }
            res.json(dbThoughtData);
        }).catch(err => {
            console.log(err);
            res.json(err);
        });
    }
        
}

module.exports = thoughtController;