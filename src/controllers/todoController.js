const Todos = require('../db/todos');

const updateKeys = ['description', 'completed', 'title', 'items', 'contributors'];

module.exports.todoList = async (req, res) => {
    try {
        const todos = await Todos.find();

        res.status(200).send(todos);
    }
    catch(error) {
        console.log(error);
        res.status(400).send({
            error: error.message
        })
    }
};

module.exports.todoDetails = async ({ params } , res) => {
    try {
        const todo = await Todos.findById(params.id)   
            .populate('owner')
            .populate('contributors');
        
        if (todo == null || todo === undefined) {
            res.status(404).send({
                error: `Record with id ${params.id} not found`
            });
            return;
        }

        res.status(200).send(todo);
    }
    catch(error) {
        res.status(400).send({
            error: error.message
        })
    }
};

module.exports.todoUpdate = async ({ params, body }, res) => {
    try {

        let validUpdate = Object.keys(body).every((key) => {
            return updateKeys.includes(key);
        })
        
        if (!validUpdate) {
            throw new Error('Invalid update parameters');
        }

        let db = await Todos.findById(params.id);
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

module.exports.todoShare = async ({ body }, res) => {
    try {
        body.forEach(async item => {
            let db = await Todos.findById(item.id);
            var found = db.contributors.find(c => c == item.contributor);

            if (!found) {
                db.contributors.push(item.contributor);
                await db.save();
            }
        });

        res.status(200).send();
    }
    catch(error) {
        res.status(400).send({
            error: error.message
        })
    }
};

module.exports.todoCreate = async ( { body }, res) => {
    try {
        const db = new Todos(body);
        await db.save();
        
        res.status(201).send(db);
    }
    catch(error) {
        res.status(400).send({
            error: error.message
        })
    }
};

module.exports.todoDelete = async (req, res) => {
    try {
        console.log(req.params);
        await Todos.deleteOne({ _id: req.params.id });
        res.status(200).send({});
    }
    catch(error) {
        res.status(400).send({
            error: error.message
        })
    }
};