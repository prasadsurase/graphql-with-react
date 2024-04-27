const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = require("graphql")
const _ = require('lodash')

const users = [
  {id: '1', firstName: 'Prasad', age: 37},
  {id: '2', firstName: 'Pratik', age: 40}
];

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {type: GraphQLString},
    firstName: {type: GraphQLString},
    age: {type: GraphQLInt}
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {id: {type: GraphQLString}},
      resolve(parentValue, args){
        _.find(users, {id: args.id})
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
