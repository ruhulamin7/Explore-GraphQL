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
  GraphQLInputObjectType,
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
        console.log(post);
        return users.find((user) => user.id == post.user);
      },
    },
  }),
});

// UserTypeInput
const UserTypeInput = new GraphQLInputObjectType({
  name: 'UserTypeInput',
  description: 'Taking input to add a new user',
  fields: () => ({
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    gender: {
      type: new GraphQLNonNull(GenderEnumType),
    },
    phone: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    // createdAt: {
    //   type: DateType,
    // },
    // password: {
    //   type: PasswordType,
    // },
  }),
});

// update user input type
const UpdateUserTypeInput = new GraphQLInputObjectType({
  name: 'UpdateUserTypeInput',
  description: 'Taking input to update an existing user',
  fields: () => ({
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    gander: {
      type: GenderEnumType,
    },
    phone: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
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

// Root Mutation Type
const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addUser: {
      type: UserType,
      args: {
        input: {
          type: UserTypeInput,
        },
      },
      resolve: (
        _,
        {
          input: {
            firstName,
            lastName,
            gender,
            phone,
            email,
            createdAt,
            password,
          },
        }
      ) => {
        const user = {
          id: users.length + 1,
          firstName,
          lastName,
          gender,
          phone,
          email,
          posts: [],
          createdAt,
          password,
        };

        users.push(user);
        return user;
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: {
          type: GraphQLID,
        },
        input: {
          type: UpdateUserTypeInput,
        },
      },
      resolve: (
        _,
        { id, input: { firstName, lastName, gender, phone, email } }
      ) => {
        let updatedUser = null;
        users.forEach((user) => {
          if (user.id == id) {
            if (firstName) {
              user.firstName = firstName;
            }
            if (lastName) {
              user.lastName = lastName;
            }
            if (gender) {
              user.gender = gender;
            }
            if (phone) {
              user.phone = phone;
            }
            if (email) {
              user.email = email;
            }
            updatedUser = user;
          }
        });

        return updatedUser;
      },
    },
    // deleteUser: {
    //   type: GraphQLNonNull(GraphQLBoolean),
    //   args: {
    //     id: {
    //       type: GraphQLID,
    //     },
    //   },
    //   resolve: (_, { id }) => {
    //     const index = users.findIndex((user) => user.id == id);
    //     if (index >= 0) {
    //       users.splice(index, 1);
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   },
    // },
  }),
});

module.exports = { RootQueryType, UserType, RootMutationType };
