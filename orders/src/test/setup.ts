import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

let mongo: any;

declare global {
  var signup: () => string[];
}

jest.mock("../nats-wrapper");

beforeAll(async () => {
  jest.clearAllMocks();
  process.env.JWT_KEY = "asdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  // Clear all collections
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signup = () => {
  // Build a JWT payload { id, email }
  const email = "test@test.com";
  const paylod = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email,
  };

  // Create the JWT!
  const token = jwt.sign(paylod, process.env.JWT_KEY!);

  // Build
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string that is the cookie with the encoded data
  return [`session=${base64}`];
};
