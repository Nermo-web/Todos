const sharp = require('sharp');
const User = require('../db/user');

class UserService
{
    constructor() {

    }

    static get validFields() {
        return  ['email', 'password', 'name', 'phone', 'avatar', 'friends', 'gender', 'tags'];
    }

    static get excludedDbFields() {
        return '-password -tokens -__v -friends -roles -createdAt -updatedAt';
    }

    async friends(userId) {

        // Validate if user id is something
        this.validateUserId(userId);

        const user = await User.findById(userId)
            .populate('friends', this.excludedDbFields)
            .exec();

        return user.friends;
    }

    async details(userId) {

        // Validate if user id is something
        this.validateUserId(userId);

        const user = await User.findById(userId);
        return user;
    }

    async update(userId, updates) {

        // Validate if user id is something
        this.validateUserId(userId);

        let validUpdate = Object.keys(updates).every((key) => {
            return UserService.validFields.includes(key);
        })
        
        if (!validUpdate) {
            throw new Error('Invalid update parameters.');
        }

        let user = await User.findById(userId);
        if (!db) {
            throw new Error('Invalid user. User not foud.');
        }
        
        Object.keys(updates).forEach((key) => {
            user[key] = updates[key];
        });
        
        await user.save();
        return user;
    }

    async create(userDetails) {
        if (!userDetails) {
            throw Error("Invalid input parameters.");
        }

        const user = new User(userDetails);
        await user.save();

        return { 
            user: user.toJSON(),
            token: await user.generateToken(),
        };
    }

    async addFriends(userId, friends) {

        // Validate if user id is something
        this.validateUserId(userId);

        // Validate if firends list is correct
        await this.validateFirendList(friends);
            
        const user = await User.findById(userId);

        friends.forEach(friend => {
            const isFound = user.friends.find(c => c == friend);

            if (!isFound) {
                user.friends.push(friend);
            }
        });

        await user.save();
    }

    async removeFriends(userId, friends) {

        // Validate if user id is something
        this.validateUserId(userId);

        // Validate if firends list is correct
        await this.validateFirendList(friends);
     
        const user = await User.findById(userId);

        friends.forEach(friend => {
            const index = user.friends.indexOf(c => c == friend);
            if (index > -1) {
                user.friends.splice(index, 1);
                
            }
        });

        await user.save();
    }

    async delete(userId) {
        
        // Validate if user id is something
        this.validateUserId(userId);

        var user = await User.deleteOne({ _id: userId });
        return user;
    }

    async setAvatar(userId, imageBuffer) {
        // Validate if user id is something
        this.validateUserId(userId);

        const user = User.findById(userId);

        user.avatar =  await sharp(imageBuffer)
            .resize({ width:250, height:250 })
            .png()
            .toBuffer();

        await user.save();
    }

    async getAvatar(userId) {

        // Validate if user id is something
        this.validateUserId(userId);

        const user = await User.findById(userId);
        return user.avatar;
    }

    async generateToken(email, password) {
        
        if (!email || !password) {
            throw Error("Invalid email or password.");
        }

        const user = await User.findByCredentials(email, password);
        const token = await user.generateToken();
        return token;
    }

    async destroyToken(token) {
          
        if (!token) {
            throw Error("Invalid token. Missing token value");
        }

        await User.revokeToken(token);
    }

    async validateFirendList(friends) {
        if (!friends || friends.length == 0) {
            throw Error("Invalid input parameters. At least one friend should be specified.");
        }

        for (let index = 0; index < friends.length; index++) {
            const friend = friends[index];
            
            var found = await User.findById(friend);
            if (!found) {
                throw Error("Invalid friend id. User with that id could not be found.");
            }
        }
    }

    validateUserId(userId) {
        if (!userId) {
            throw Error("Invalid or missing user id");
        }
    }
}


module.exports = UserService;