const {
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLError,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLString,
  GraphQLObjectType,
} = require('graphql');
const { users, posts } = require('../data');

// User Type
const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'It represents a single user!',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    gender: {
      type: GenderEnumType,
    },
    phone: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

// GenderEnumType
const GenderEnumType = new GraphQLEnumType({
  name: 'GenderEnumType',
  description: 'Enum type for gender',
  values: {
    male: {
      value: 'male',
    },
    female: {
      value: 'female',
    },
  },
});

// Root Query Type
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    users: {
      type: new GraphQLList(new GraphQLNonNull(UserType)),
      resolve: () => {
        return users;
      },
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (_, { id }) => {
        const user = users.find((user) => user.id == id);
        return user;
      },
    },
  }),
});

module.exports = { RootQueryType, UserType };
