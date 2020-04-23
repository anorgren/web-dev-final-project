const express = require('express');
const router = express.Router();

const { create, productById, read, remove, update, photo,
    list, listRelated, listCategories, listBySearch} = require('../controllers/product');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');


router.get('/product/photo/:productId', photo);
router.get('/product/:productId', read);
router.get('/products', list);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories', listCategories);

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.post("/products/by/search", listBySearch);

router.delete('/product/:productId/:userId',isAdmin, requireSignin, isAuth, remove);

router.put('/product/:productId/:userId',isAdmin, requireSignin, isAuth, update);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;