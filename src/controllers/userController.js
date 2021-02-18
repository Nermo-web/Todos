const User = require('../db/user');

const updateKeys = ['email', 'password', 'name', 'phone', 'avatar', 'friend', 'gender', 'tags'];

module.exports.userList = async (req, res) => {
    try {
        const users = await User.find().populate('todos');
        res.status(200).send(users);
    }
    catch(error) {
        res.status(400).send({
            error: error.message
        })
    }
};

module.exports.userDetails = async ({ params } , res) => {
    try {
        const user = await User.findById(params.id)
            .populate('todos');

        res.status(200).send(user);
    }
    catch(error) {
        res.status(400).send({
            error: error.message
        })
    }
};

module.exports.userUpdate = async ({ params, body }, res) => {
    try {

        let validUpdate = Object.keys(body).every((key) => {
            return updateKeys.includes(key);
        })
        
        if (!validUpdate) {
            throw new Error('Invalid update parameters');
        }

        let db = await User.findById(params.id);
        Object.keys(body).forEach((key) => {
            db[key] = body[key];
        });
        
        await db.save();
        res.status(200).send(db);
    }
    catch(error) {
        res.status(400).send({
            error: error.message
        })
    }
};

module.exports.userCreate = async ( { body }, res) => {
    try {
        const db = new User(body);
        await db.save();
        
        res.status(201).send({ 
            user: db.toJSON(),
            token: await db.generateToken(),
        })
    }
    catch(error) {
        res.status(400).send({
            error: error.message
        })
    }
};

module.exports.userDelete = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id });
        res.status(200).send({});
    }
    catch(error) {
        res.status(400).send({
            error: error.message
        })
    }
};

module.exports.userLogin = async ({ body }, res) => {
    try {
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateToken();

        res.status(200).send(token);
    }
    catch(error) {
        res.status(401).send({
            error: "Invalid username/password"
        })
    }
};

module.exports.userLogout = async ({ body }, res) => {
    try {
        await User.removeToken(body.token)
        res.status(200).send({ });
    }
    catch(error) {
        res.status(401).send({
            error: "Invalid username/password"
        })
    }
};