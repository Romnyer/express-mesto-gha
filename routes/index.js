const router = require('express').Router();

const { login, createUser } = require('../controllers/users');
const userRouter = require('./users');
const cardRouter = require('./cards');
const {
  NOT_FOUND_ERROR_CODE,
} = require('../constants/constants');
const {
  loginValidation,
  createUserValidation,
} = require('../middlewares/validation');
const auth = require('../middlewares/auth');

// Public routes
router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);

// Authorization protection
router.use(auth);

// Protected routes
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({
    message: 'Страница не найдена',
  });
});

module.exports = router;
