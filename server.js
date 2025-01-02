const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./index.js');
dotenv.config({ path: './config.env' });
const port = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace(
  '<PASWWORD>',
  process.env.DATABASE_PASSWORD
).replace('<USERNAME>', process.env.DATABASE_USERNAME);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.log('Database connection error:  ' + err);
  });

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
