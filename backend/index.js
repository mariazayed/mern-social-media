const {ApolloServer} = require("apollo-server");
const mongoose = require("mongoose");
const gql = require("graphql-tag");

const {MONGODB_URL} = require("./config");
const Post = require("./models/Post");

const typeDefs = gql`
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        userName: String!
    }

    type Query {
        getPosts: [Post]
    }
`;

const resolvers = {
	Query: {
		async getPosts() {
			try {
				return await Post.find();
			}
			catch (error) {
				throw new Error(error);
			}
		}
	}
};

const server = new ApolloServer({
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


