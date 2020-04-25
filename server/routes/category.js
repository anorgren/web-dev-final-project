const express = require('express');
const router = express.Router();

const { create, read, update, remove, list, categoryById} = require('../controllers/category');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');


router.get('/category/:categoryId', read);

router.post('/category/create/:userId', requireSignin, isAdmin, isAuth, create);

router.put('/category/:categoryId/:userId', requireSignin, isAdmin, isAuth, update);

router.delete('/category/:categoryId/:userId', requireSignin, isAdmin, isAuth, remove);

router.get('/categories', list);


router.param("categoryId", categoryById);
router.param("userId", userById);

module.exports = router;