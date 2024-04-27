const graphql = require("graphql")
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLString
    },
    firstName: {
      type: GraphQLString
    },
    age: {
      type: GraphQLInt
    },
    company: {
      type: CompanyType,
      resolve(parentValue, args){
        console.log("Received id:", parentValue.companyId)
        console.log(`http://localhost:3000/companies/${parentValue.companyId}`)
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
        .then(resp => resp.data);
      }
    },
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {id: {type: GraphQLString}},
      resolve(parentValue, args){
        console.log("Received id:", args.id)
        console.log(`http://localhost:3000/users/${args.id}`)
        return axios.get(`http://localhost:3000/users/${args.id}`)
        .then(resp => resp.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
