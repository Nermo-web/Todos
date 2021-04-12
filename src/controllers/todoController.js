const TodoService = require('./../services/todoService');
const todoService = new TodoService();

module.exports.list = (req, res) => {
    return todoService.list(req.user._id, req.params)
        .then((todos) =>  res.status(200).send(todos))
        .catch(({ message }) =>  res.status(400).send({ error: message }));
};

module.exports.details = (req , res) => {
    return todoService.details(req.user._id, req.params.id) 
        .then((todo) =>  res.status(200).send(todo))
        .catch(({ message }) =>  res.status(404).send({ error: message }));
};

module.exports.update = (req, res) => {
    return todoService.update(req.user._id, req.params.id, req.body) 
        .then((_) =>  res.status(200).send())
        .catch(({ message }) =>  res.status(400).send({ error: message }));
};

module.exports.create = ( req, res) => {
    return todoService.create(req.user._id, req.body) 
        .then((_) =>  res.status(201).send())
        .catch(({ message }) =>  res.status(400).send({ error: message }));
};

module.exports.delete = (req, res) => {
    return todoService.delete(req.user._id, req.params.id) 
        .then((_) =>  res.status(200).send())
        .catch(({ message }) =>  res.status(400).send({ error: message }));
};

module.exports.share = (req, res) => {
    return todoService.share(req.user._id, req.params.id, req.body) 
        .then((_) =>  res.status(200).send())
        .catch(({ message }) =>  res.status(400).send({ error: message }));
};