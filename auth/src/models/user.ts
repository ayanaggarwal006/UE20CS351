import mongoose from "mongoose";
import { Password } from "../services/password";

export interface UserI {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<UserI>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  // this keyword refers to the document that we are trying to save
  if (this.isModified("password")) {
    // will be true if the password is being created or modified
    // this.get("password") is the same as this.password
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
    done();
  }
});

 const UserModel = mongoose.model<UserI>("User", userSchema);

 export class User extends UserModel{
  constructor(attrs: UserI) {
    super(attrs);
  }
 }


