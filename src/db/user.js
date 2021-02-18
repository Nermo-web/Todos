const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const Todo = require('./todos');

const Secret = process.env.SECRET || "SUPER COOL SECRET KEY!@";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        require: true,
        min: 6
    },
    name: {
        type: String,
        require: true,
    },
    avatar: {
        type: mongoose.Schema.Types.ObjectId,
    },
    gender: {
        type: String,
    },
    tags: [{
        type: String,
    }],
    roles: [{
        type: String,
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tokens: [
        {
            token: {
                type: String,
                require: true,
            },
            expires: {
                type: Number,
                require: true,
            },
            revoked : {
                type: Boolean,
                require: true,
                default: false
            },
        }
    ]
},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
})

userSchema.virtual('todos', {
    ref: 'Todo',
    localField: '_id',
    foreignField: 'owner',
})

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hash(this.password, 8)
    }
    next();
})

userSchema.pre('remove', async function(next) {
    await Todo.deleteMany({ owner: this._id });
    next();
})

userSchema.methods.generateToken = async function() {
    const user = this;

    const activeTokens = user.tokens.filter((value) => {
        return !value.revoked && validateToken(value.token, Secret)
    });

    if (activeTokens.length > 0) {
        return activeTokens[0].token;
    }

    const token = {
        token: generateToken(user._id, Secret),
        expires: Math.floor(Date.now() / 1000) + (60 * 60),
        revoked: false,
    }

    user.tokens.push(token);
    await user.save();
    return token.token;
}

const generateToken = (id, secret) => {
    return jwt.sign({
        id: id,
        iat: Math.floor(Date.now() / 1000) - 30
    }, secret, {
        expiresIn: 60 * 60,
        audience: '*',
        issuer: 'todo.api',
        subject: '*',
        jwtid: uuid.v4(),
        algorithm: 'HS256',
        encoding: 'UTF8'
    })
}

const validateToken = (token, secret) => {
    try
    {
        return jwt.verify(token, secret, {
            audience: '*',
            issuer: 'todo.api',
            subject: '*',
            algorithm: 'HS256',
            encoding: 'UTF8'
        });
    }
    catch(e) {
        return false;
    }
}

userSchema.statics.findByCredentials = async function(email, password) {
    const user = await this.findOne({ email });

    if (!user) {
        console.log('Email is not correct');
        throw new Error("Invalid username/password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log('Password is not correct');
        throw new Error("Invalid username/password");
    }

    return user;
}

userSchema.statics.revokeToken = async function(token) {
    const user = await this.findOne({ 'tokens.token': token });

    if (!user) {
        throw new Error("Invalid token was provided");
    }

    user.tokens.forEach(value => {
        if (value.token == token) {
            value.revoked = true;
        }
    });

    user.save();
}

userSchema.methods.toJSON = function() {
    const user = this;

    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

module.exports = mongoose.model('User', userSchema)