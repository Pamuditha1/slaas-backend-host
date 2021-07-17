const {User} = require('../modules/userModule');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid Email.');

    // user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password 
    // });
    const validPassword= await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid Password.');

    const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));
    res.send(token);

});

function validateLogin(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
}

module.exports = router;