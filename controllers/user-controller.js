const { User } = require('../models');
const { db } = require('../models/User');

const userController = {
    //get all users
    getAllUsers(req,res) {
        User.find({})
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // get one user by id
    getUserById({params}, res) {
        User.findOne({_id: params.id})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({message: 'No user with this id found'});
                    return;
                }
                res.json(dbUserData);
            }).catch(err => console.log(err));
    },
    // create user
    createUser({body}, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },
    // update user by id
    updateUser({params, body}, res) {
        User.findOneAndUpdate({_id: params.id}, body, {new:true, runValidators: true})
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({message: 'no user found with thiis id'});
                    return;
                }
                res.json(dbUserData);
            }).catch(err => console.log(err));
    },
    // delete user
    deleteUser({params}, res) {
        User.findOneAndDelete({_id: params.id})
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({message: 'no user with this id found'});
                    return;
                }
                res.json(dbUserData);
            }).catch(err => console.log(err));
    },
    // add friend
    addFriend({params}, res) {
        User.findOneAndUpdate(
            {_id: params.userId},
            {$push: {friends: params.friendId}},
            {new: true, runValidators: true}
            ).then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({message: 'no user found with this is'});
                    return;
                }
                res.json(dbUserData);
            }).catch(err => console.log(err));
    },
    // delete friend
    deleteFriend({params}, res) {
        User.findOneAndUpdate(
            {_id: params.userId},
            {$pull: {friends: params.friendId}},
            {new: true}
        ).then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'no user found with this id'});
                return;
            }
            res.json(dbUserData);
        }).catch(err => console.log(err));
    }
}

module.exports = userController;