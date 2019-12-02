const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../../config");
const {UserInputError} = require("apollo-server");
const {validateRegisterInput, validateLoginInputs} = require("../../util/validators")

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        username: user.username,
        email:user.email
    }, SECRET_KEY, {expiresIn:"1h"});
    
}


module.exports = {
    Mutation: {
        async login(_, {username, password}) {
            const {errors, valid} = validateLoginInputs(username,password);
            if(!valid) {
                throw new UserInputError("Errors", {errors})
            }
            const user = await User.findOne({username});

            if(!user) {
                errors.general = "User not found";
                throw new UserInputError("User doesn't exist", {errors})
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                errors.general = "Wrong credentials";
                throw new UserInputError("Wrong credentials",{errors})
            }
            const token = await generateToken(user);

            return {
                ...user._doc,
                id:user._id,
                token
            }
        },
        async register(_, {registerInput: {username, email, password, confirmPassword}}, context, info) {
            // TODO: validate user data
            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError("Errors", {errors})
            }
            // TODO: make sure user doesn't already exist
            const user = await User.findOne({username});
            if (user) {
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: "This username is taken"
                    }
                })
            } 
            password = await bcrypt.hash(password, 12);
            const newUser = new User({
                email,
                username,
                password,
                createdAt : new Date().toISOString()
            });

            const res = await newUser.save();
            const token = await generateToken(res);


            return {
                ...res._doc,
                id:res._id,
                token
            }
        }
    }
}