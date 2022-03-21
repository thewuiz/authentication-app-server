import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MDB_CNN || "");
    console.log("DB CONNECT");
  } catch (error) {
    console.log("Ups");
    console.log(error);
    throw new Error("DB CONNECT ERROR");
  }
};

export = dbConnection;
