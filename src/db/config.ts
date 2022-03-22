import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    let mongo_url = process.env.MDB_CNN || "";
    console.log("mongo_url: " + process.env.MDB_CNN);
    await mongoose.connect(mongo_url);
  } catch (error) {
    console.log("DB CONNECT ERROR");
    console.log(error);
    const err = new Error(`DB CONNECT ERROR: ${error} `);
    return err;
  }
};

export = dbConnection;
