const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById, addOrderToHistory } = require('../controllers/user');
const { create, listOrders, getStatusValues, orderById, updateOrderStatus } = require('../controllers/order');
const { decreaseQuantity } = require('../controllers/product');


router.get('/list/:userId', requireSignin, isAuth, isAdmin, listOrders);
router.get('/statusValues/:userId', requireSignin, isAuth, isAdmin, getStatusValues);


router.post('/create/:userId', requireSignin, isAuth, addOrderToHistory, decreaseQuantity, create);

router.put('/:orderId/status/:userId', requireSignin, isAuth, isAdmin, updateOrderStatus);


router.param('userId', userById);
router.param('orderId', orderById);

module.exports = router;