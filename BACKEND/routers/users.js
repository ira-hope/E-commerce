const { User } = require('../models/user');
const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

userRouter.get(`/`, async (req, res) => {
    const userList = await User.find().select('-passwordHash');
    if (!userList) {
        res.status(500).json({ success: false });
    } else {
        res.send(userList);
    }
});

userRouter.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
        res.status(500).json({ message: 'The user with the given ID was not found' });
    } else {
        res.status(200).send(user);
    }
});

userRouter.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });

    user = await user.save();

    if (!user) {
        return res.status(404).send('The user cannot be created');
    } else {
        res.send(user);
    }
});

userRouter.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });

    user = await user.save();

    if (!user) {
        return res.status(404).send('The user cannot be registered');
    } else {
        res.send(user);
    }
});

userRouter.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;

    if (!user) {
        return res.status(400).send('The user not found');
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            { expiresIn: '1d' }
        )
        return res.status(200).send({ user: user.email, token: token });
    } else {
        return res.status(400).send('The password is wrong');
    }
});

userRouter.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments();

    if (!userCount) {
        res.status(500).json({ success: false });
    } else {
        res.send({
            userCount: userCount
        });
    }
});

userRouter.delete('/:Id', (req, res) => {
    User.findByIdAndRemove(req.params.Id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: 'The user is deleted' });
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err });
    });
});

module.exports = userRouter;
