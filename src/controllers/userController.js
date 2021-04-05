const UserService = require('../services/userService');
const service = new UserService();

module.exports.friends = (req, res) => {
    service.friends(req.user._id)
        .then((friends) => res.status(200).send(friends))
        .catch(({ message }) =>  res.status(400).send({ error: message }));
};

module.exports.details = (req , res) => {
    service.details(req.params.id)
        .then((user) => res.status(200).send(user))
        .catch(({ message }) =>  res.status(400).send({ error: message }));
};

module.exports.update = (req, res) => {
    service.update(req.user._id, req.body)
        .then((user) => res.status(200).send(user))
        .catch(({ message }) =>  res.status(400).send({ error: message }));
};

module.exports.create = (req, res) => {
    service.create(req.body)
        .then((user) => res.status(201).send(user))
        .catch(({ message }) =>  res.status(400).send({ error: message }));
};

module.exports.delete = (req, res) => {
    service.delete(req.user._id)
        .then((user) => res.status(200).send(user))
        .catch(({ message }) =>  res.status(400).send({ error: message }));
};

module.exports.addFriends = (req, res) => {
    service.addFriends(req.user._id, req.body)
        .then(_ => res.status(200).send())
        .catch(({ message }) =>  res.status(400).send({ error: message }));
};

module.exports.removeFriends = (req, res) => {
    service.removeFriends(req.user._id, req.body)
        .then(_ => res.status(200).send())
        .catch(({ message }) =>  res.status(400).send({ error: message }));
};

module.exports.setAvatar = (req, res) => {
    service.setAvatar(req.user._id, req.file.buffer)
        .then(_ => res.status(200).send())
        .catch(({ message }) =>  res.status(400).send({ error: message }));
};

module.exports.getAvatar = (req, res) => {
    service.getAvatar(req.params.id)
        .then((avatar) => res.set('Content-Type', 'image/jpg').status(200).send(avatar))
        .catch(({ message }) =>  res.status(400).send({ error: message }));
};

module.exports.login = (req, res) => {
    service.generateToken(req.body.email, req.body.password)
        .then((token) => res.status(200).send(token))
        .catch(({ message }) => {
            console.log("Error:", message);
            res.status(401).send({ error: "Invalid username/password." });
        });
};

module.exports.logout = (req, res) => {
    service.destroyToken(req.token)
        .then(_ => res.status(200).send())
        .catch(({ message }) =>  res.status(400).send({ error: message }));
};
