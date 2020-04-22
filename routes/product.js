const express = require('express');
const router = express.Router();

const { create, productById, read, remove, update} = require('../controllers/product');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');


router.get('/:productId', read);

router.post('/create/:userId', requireSignin, isAuth, isAdmin, create);

router.delete('/:productId/:userId',isAdmin, requireSignin, isAuth, remove);

router.put('/:productId/:userId',isAdmin, requireSignin, isAuth, update);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;