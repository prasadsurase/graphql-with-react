const graphql = require("graphql")
const axios = require('axios');
const { first } = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args){
        console.log("Received id:", parentValue.id)
        return axios.get(`http://localhost:3000/users?companyId=${parentValue.id}`)
        .then(resp => resp.data);
      }
    },
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
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
  })
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
    },
    company: {
      type: CompanyType,
      args: {id: {type: GraphQLString}},
      resolve(parentValue, args){
        console.log("Received id:", args.id)
        console.log(`http://localhost:3000/companies/${args.id}`)
        return axios.get(`http://localhost:3000/companies/${args.id}`)
        .then(resp => resp.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: {type: new graphql.GraphQLNonNull(GraphQLString)},
        age: {type: new graphql.GraphQLNonNull(GraphQLInt)},
        companyId: {type: GraphQLString}
      },
      resolve(parentValue, {firstName, age}){
        return axios.post('http://localhost:3000/users', {firstName, age})
        .then(resp => resp.data)
      }
    },
    deleteUser:{
      type: UserType,
      args: {
        id: {type: new graphql.GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {id}) {
        console.table(parentValue)
        console.table(id)
        return axios.delete(`http://localhost:3000/users/${id}`)
        .then(resp => resp.data)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
});
