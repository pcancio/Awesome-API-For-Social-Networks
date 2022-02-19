const {Thought, User} = require('../models');

const thoughtController = {
    // get all thoughts
    getAllThoughts(req,res) {
        Thought.find({})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400);
        });
    },
    // get one thought by id
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
    // create thought
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
    // update thought by id
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({_id: params.id}, body, { new: true })
            .then(dbThoughtData => {
                if(!dbThoughtData) {
                    res.status(404).json({message: 'no thought with this id found'});
                    return;
                }
                res.json(dbThoughtData);

            }).catch(err => {
                console.log(err);
                res.json(err);
            })
    },
    // delete thought
    deleteThought({params}, res) {
        Thought.findOneAndDelete({_id: params.id})
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                     res.status(404).json({message: 'no thought with this id found'});
                     return;
                }
                    res.json(dbThoughtData);
                })
                .catch(err => res.json(err));
    },
    // create reaction to thought
    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $push: { reactions: body } }, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thoughts found by id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },
    // delete reaction to thought
    deleteReaction({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, { $pull: { reactions: body } }, { new: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thoughts found by id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    }

          
}

module.exports = thoughtController;