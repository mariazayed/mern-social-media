const {ApolloServer} = require("apollo-server");
const mongoose = require("mongoose");

const {MONGODB_URL} = require("./config");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer(
	{
		typeDefs,
		resolvers
	});

// mongoose.connect(MONGODB_URL, {useNewUrlParser: true})
mongoose.connect(MONGODB_URL)
        .then(() => {
	        console.log("Connected to DB");
	        return server.listen({port: 8000});
        })
        .then(res => {
	        console.log("Server Running @ " + res.url);
        })
        .catch(() => {
	        console.log("Error While Connecting");
        });


