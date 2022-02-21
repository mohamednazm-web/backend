const dotenv = require('dotenv');

dotenv.config({
  path: './config.env'
});

const app = require('./app');

// to run http://127.0.0.1:3000/
const port = process.env.PORT || 8000; // no internet
app.listen(port, () => {
  console.log(`App runinig on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
