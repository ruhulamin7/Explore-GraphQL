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

// post type
const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'It represents a single post',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    title: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    user: {
      type: UserType,
      resolve: (post, args) => {
        return users.find((user) => user.id == post.user);
      },
    },
  }),
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
    posts: {
      type: new GraphQLList(PostType),
      resolve: () => {
        return posts;
      },
    },
    post: {
      type: PostType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (_, { id }) => {
        return posts.find((post) => post.id == id);
      },
    },
  }),
});

module.exports = { RootQueryType, UserType };
