import { Schema, model } from "mongoose";

interface User {
  photo: string;
  name: string;
  bio: string;
  phone: string;
  email: string;
  password: string;
}

const UsuarioSchema = new Schema<User>({
  photo: { type: String },
  name: { type: String },
  bio: { type: String },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UsuarioSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();

  object.uid = _id;
  return object;
});

export = model("User", UsuarioSchema);
