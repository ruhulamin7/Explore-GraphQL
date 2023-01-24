const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphQL/schema');
const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    // rootValue
  })
);

app.get('/', (req, res) => {
  res.send('<h1>Welcome to GraphQL learning!</h1>');
});

app.listen(3000, console.log('Server running on port 3000'));
