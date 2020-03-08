import mongoose from 'mongoose';

const CONNECTION_URL = "mongodb+srv://admin:P%40ssw0rd@projectsaas-9da5p.mongodb.net/test?retryWrites=true&w=majority"

const clientOption = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  reconnectTries: 30000,
  poolSize: 50,
  useNewUrlParser: true,
  autoIndex: false
};
const option = { useNewUrlParser: true };

const initDbConnection = () => {
  const db = mongoose.createConnection(CONNECTION_URL, clientOption);

  db.on("error", console.error.bind(console, "MongoDB Connection Error>> : "));
  db.once("open", function() {
    console.log("client MongoDB Connection ok!");
  });
//   require('./model/user.js');
  return db;
};

export default {
    initDbConnection
};