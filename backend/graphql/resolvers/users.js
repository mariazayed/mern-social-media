const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {SECRET_KEY} = require("../../config");
const User = require("../../models/User");

module.exports = {
	Mutation: {
		async register(_, {
			registerInput: {
				userName,
				email,
				password,
				confirmPassword
			}
		}) {
			// User's data validation
			// Check if the user already exists
			// Password hashing + token creation
			password = await bcrypt.hash(password, 12);
			const newUser = new User(
				{
					email,
					userName,
					password,
					confirmPassword,
					createdAt: new Date().toISOString()
				});

			const res = await newUser.save();

			const token = jwt.sign({
				                       id: res.id,
				                       email: res.email,
				                       userName: res.userName
			                       },
			                       SECRET_KEY,
			                       {
				                       expiresIn: "1h"
			                       });

			return {
				...res._doc,
				id: res._id,
				token
			};
		}
	}
};
