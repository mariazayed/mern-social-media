const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {UserInputError} = require("apollo-server");

const {SECRET_KEY} = require("../../config");
const User = require("../../models/User");
const {validateRegisterInput} = require("../../utils/validators");

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
			const {
				valid,
				errors
			} = validateRegisterInput(userName, email, password, confirmPassword);

			if (!valid) {
				throw new UserInputError("Errors", {errors});
			}

			// Check if the user already exists
			const user = await User.findOne({userName});
			if (user) {
				throw new UserInputError("User Name is Taken", {
					errors: {
						userName: "This User Name is Taken"
					}
				});
			}

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
			                       {expiresIn: "1h"});

			return {
				...res._doc,
				id: res._id,
				token
			};
		}
	}
};
