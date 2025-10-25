const mongoose = require("mongoose");

const connectionString = "mongodb://localhost:27017/Bai_3";

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.connection();
    this.handlerExit();
  }

  connection() {
    mongoose
      .connect(connectionString)
      .then(() => {
        console.log("Connection mongoDB successfully!");
      })
      .catch((error) => {
        console.log("Connection mongoDB failed!\n" + error);
      });
  }

  handlerExit() {
    process.on("SIGINT", async () => {
      console.log("The database is disconnecting ...");
      await mongoose.connection.close();
      console.log("The database is disconnected! See you bro.");
      process.exit(0);
    });
  }
}

module.exports = new Database();
