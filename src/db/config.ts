import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    let mongo_url = process.env.MDB_CNN || "";
    console.log(mongo_url);
    if (mongo_url !== "") {
      console.log("DB CONNECT");
      return await mongoose.connect(mongo_url);
    }
    throw new Error("DB CONNECT ERROR");
  } catch (error) {
    console.log(error);
    throw new Error("DB CONNECT ERROR");
  }
};

export = dbConnection;
