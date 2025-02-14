// Name - Aditya Suri
// Student id - 101410341

require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./config/db");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const app = express();

connectDB();

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
});
