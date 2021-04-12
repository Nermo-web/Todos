const Todos = require('./../db/todos');

class TodosService {
    constructor() {

    }

    static get validFields() {
        return  ['description', 'completed', 'title', 'items'];
    }

    async list(userId, filters) {

        this.validateUserId(userId);

        const todos = await Todos.find({ $or: [
            { owner: userId, ...filters }, 
            { contributors: userId }
        ]});

        return todos;
    }
    
    async details(userId, todoId) {

        this.validateUserId(userId);

        const todo = await Todos.findOne({ _id: todoId, $or: [
            { owner: userId }, 
            { contributors: userId }
        ]});

        return todo;
    }

    async create(userId, todoDetails) {

        this.validateUserId(userId);

        todoDetails.owner = userId;
        const todo = new Todos(todoDetails);
        return await todo.save();
    }

    async update(userId, todoId, updates) {

        this.validateUserId(userId);

        let validUpdate = Object.keys(updates).every((key) => {
            return TodosService.validFields.includes(key);
        })
        
        if (!validUpdate) {
            throw new Error('Invalid update parameters');
        }

        let todo = await Todos.findOne({ _id: todoId, $or: [
            { owner: userId }, 
            { contributors: userId }
        ]});

        Object.keys(updates).forEach((key) => {
            todo[key] = updates[key];
        });
        
        await todo.save();
    }

    async delete(userId, todoId) {

        this.validateUserId(userId);
        await Todos.deleteOne({ _id: todoId, owner: userId });
    }

    async share(userId, todoId, contributors) {

        this.validateUserId(userId);
        const todo = await Todos.findOne({ _id: todoId, owner: userId })
            .populate('owner')
            .populate('owner.friends');

        contributors.forEach(async contributor => {
            const isFound = todo.contributors.find(c => c == contributor);
            const isFriend = todo.owner.friends.find(c => c == contributor);

            if (!isFound && isFriend) {
                todo.contributors.push(contributor);
            }
        });

        await todo.save();
    }

    validateUserId(userId) {
        if (!userId) {
            throw Error("Invalid or missing user id");
        }
    }
}

module.exports = TodosService;