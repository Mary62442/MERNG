const {ApolloServer, PubSub} = require("apollo-server");
const mongoose = require("mongoose");
const {MONGODB} = require("./config.js");
const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers");

const pubSub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req, pubSub})
})


mongoose.connect(MONGODB, {useNewUrlParser:true, useUnifiedTopology:true})
.then(() => {
    console.log("MongoDB connected")
    return server.listen({port : 5000})
})
.then(res => {
    console.log(`Server running at ${res.url}`)
})
