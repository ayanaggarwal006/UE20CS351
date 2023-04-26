import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

//script works on callbacks, but we want to use async await
const scryptAsync = promisify(scrypt);

export class Password {
  //static methods are functions that we can access without building an instance of the class
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = (
      (await scryptAsync(suppliedPassword, salt, 64)) as Buffer
    ).toString("hex");

    return buf === hashedPassword;
  }
}
