const express = require('express');
const router = express.Router();
const { getAll, getById, follow, unfollow, create, login, edit, deleteUser } = require('../controllers/user');
const { auth } = require('../middlewares/auth');

router.get('/', async (req, res, next) => {
    try {
        const users = await getAll();
        res.json(users);
    } catch (e) {
        next(e);
    }
});

router.get('/profile', auth, async (req, res, next) => {
    const { user: { id } } = req;
    console.log(id)
    try {
        const loggedUser = await getById(id);
        res.json({ profilePage: loggedUser });
    } catch (e) {
        next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const user = await getById(id);
        if (!user) throw Error('user not found');
        res.json(user);
    } catch (e) {
        next(e)
    }
});


router.post('/register', async (req, res, next) => {
    const body = req.body;
    try {
        const newUser = await create(body);
        res.json({ message: "User added!", newUser: newUser })
    } catch (e) {
        next(e);
    }
});

router.post('/login', async (req, res, next) => {
    const body = req.body;
    console.log(body)
    try {
        const user = await login(body);
        res.json(user);
    } catch (e) {
        next(e);
    }
});

router.patch('/follow/:id', auth, async (req, res, next) => {
    const { id } = req.params;
    const { user } = req;
    try {
        const followedUser = await follow(id, user);
        res.json({ message: "Followed a new user!", user: followedUser });
    } catch (e) {
        next(e);
    }
});

router.patch('/unfollow/:id', auth, async (req, res, next) => {
    const { id } = req.params;
    const { user } = req;
    try {
        const followedUser = await unfollow(id, user);
        res.json({ message: "Followed a new user!", user: followedUser });
    } catch (e) {
        next(e);
    }
});

router.patch('/', auth, async (req, res, next) => {
    const { body, user: { id } } = req;
    try {
        const editedUser = await edit(id, body);
        res.json({ message: "user was edited successfully", user: editedUser });
    } catch (e) {
        next(e);
    }
});

router.delete('/', auth, async (req, res, next) => {
    let { user: { id } } = req;
    try {
        debugger
        const deletedUser = await deleteUser(id);
        res.json({ message: "user deleted", user: deletedUser });
    } catch (e) {
        next(e);
    }
});

module.exports = router;