import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an empty email or password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      password: 123,
    })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);
  await request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app).post("/api/users/signup").send({
    email:"test@test.com",
    password: "password",
  }).expect(201);
  await request(app).post("/api/users/signup").send({
    email:"test@test.com",
    password: "password2",
  }).expect(400);

})

//remember to add this to app.ts
// app.use(
//   cookieSession({
//     signed: false, // disable encryption
//     secure: process.env.NODE_ENV !== "test", // only use cookies over https
//   })
// );

it("sets a cookie after successful signup", async () => {
  const response = await request(app).post("/api/users/signup").send({
    email:"test@test.com",
    password: "password",
  }).expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
})