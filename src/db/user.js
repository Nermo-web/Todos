const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        require: true,
    },
    age: {
        type: Number,
        require: true,
        validate: (value) => {
            if (value <= 0) {
                throw new Error("Age should be a positive number.")
            }
        }
    }
})

userSchema.methods.toJSON = function() {
    const user = this;

    const userObject = user.toObject();

    delete userObject.password;
    return userObject;
}

module.exports = mongoose.model('User', userSchema)