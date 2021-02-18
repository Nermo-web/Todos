const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    items: [
        {
            name: {
                type: String,
                require: true, 
            },
            completed: {
                type: Boolean,
                default: false,
            }
        }
    ],
    completed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    contributors: [{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
});

todoSchema.pre('save', async function(next) {
    if (this.isModified('item')) {
        let isCompleted = true;
        
        this.items.forEach(value => {
            if (!value.completed) {
                isCompleted = false;
            }
        });

        this.completed = isCompleted;
    }

    next();
})

module.exports = mongoose.model('Todo', todoSchema)