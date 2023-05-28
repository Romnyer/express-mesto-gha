const userRouter = require('express').Router();

const {getUsers,
      getUserById,
      createUser,
      updateProfile,
      updateAvatar} = require('../controllers/users');

//All users route
userRouter.get('/', getUsers);

//User by id route
userRouter.get('/:userId', getUserById);

//Create user
userRouter.post('/', createUser);

//Update profile
userRouter.patch('/me', updateProfile);

//Update avatar
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;