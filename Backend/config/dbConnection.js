//this file is for the connection to the database
//This file will be used in the server.js file

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      `MongoDB Connected:${conn.connection.host}, ${conn.connection.name}`
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
