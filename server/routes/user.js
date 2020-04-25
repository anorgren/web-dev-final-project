const express = require('express');
const router = express.Router();


const { requireSignin, isAdmin, isAuth } = require("../controllers/auth");
const { userById, read, update, purchaseHistory } = require("../controllers/user");

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    })
});

router.get('/:userId', requireSignin, isAuth, read);
router.get('/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory);

router.put('/:userId', requireSignin, isAuth, update);

router.param('userId', userById);

module.exports = router;