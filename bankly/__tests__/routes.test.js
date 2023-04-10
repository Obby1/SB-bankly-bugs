// Set ENV VAR to test before we load anything, so our app's config will use
// testing settings

process.env.NODE_ENV = "test";

const app = require("../app");
const request = require("supertest");
const db = require("../db");
const bcrypt = require("bcrypt");
const createToken = require("../helpers/createToken");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

// tokens for our sample users
const tokens = {};

/** before each test, insert u1, u2, and u3  [u3 is admin] */
beforeEach(async function() {
  async function _pwd(password) {
    return await bcrypt.hash(password, 1);
  }

  let sampleUsers = [
    ["u1", "fn1", "ln1", "email1", "phone1", await _pwd("pwd1"), false],
    ["u2", "fn2", "ln2", "email2", "phone2", await _pwd("pwd2"), false],
    ["u3", "fn3", "ln3", "email3", "phone3", await _pwd("pwd3"), true]
  ];

  for (let user of sampleUsers) {
    await db.query(
      `INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      user
    );
    tokens[user[0]] = createToken(user[0], user[6]);
  }
});

afterEach(async function() {
  await db.query("DELETE FROM users");
});

afterAll(function() {
  db.end();
});


describe("POST /auth/register", function() {
  test("should allow a user to register in", async function() {
    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "new_user",
        password: "new_password",
        first_name: "new_first",
        last_name: "new_last",
        email: "new@newuser.com",
        phone: "1233211221"
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ token: expect.any(String) });

    let { username, admin } = jwt.verify(response.body.token, SECRET_KEY);
    expect(username).toBe("new_user");
    expect(admin).toBe(false);
  });


  test("should not allow a user to register with an existing username", async function() {
    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "u1",
        password: "pwd1",
        first_name: "new_first",
        last_name: "new_last",
        email: "new@newuser.com",
        phone: "1233211221"
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      status: 400,
      message: `There already exists a user with username 'u1'`
    });
  });
});

describe("POST /auth/login", function() {
  test("should allow a correct username/password to log in", async function() {
    const response = await request(app)
      .post("/auth/login")
      .send({
        username: "u1",
        password: "pwd1"
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ token: expect.any(String) });

    let { username, admin } = jwt.verify(response.body.token, SECRET_KEY);
    expect(username).toBe("u1");
    expect(admin).toBe(false);
  });

  // TESTS BUG #6
  test("should reject wrong user log in", async function() {
    const response = await request(app)
      .post("/auth/login")
      .send({
        username: "u1",
        password: "123sadfpwd1"
      });
    expect(response.statusCode).toBe(401);

  });
});
 
describe("GET /users", function() {
  test("should deny access if no token provided", async function() {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(401);
  });

  // TESTS BUG #5
  test("should list all users BASIC info only", async function() {
    const response = await request(app)
      .get("/users")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    response.body.users.forEach((user) => {
      const userKeys = Object.keys(user).sort();
      const expectedKeys = ["username", "first_name", "last_name"].sort();
      expect(userKeys).toEqual(expectedKeys);
    });
  });

  test("should list all 3 test users", async function() {
    const response = await request(app)
      .get("/users")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body.users.length).toBe(3) ;
  });

});

describe("GET /users/[username]", function() {
  test("should deny access if no token provided", async function() {
    const response = await request(app).get("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  test("should return data on u1", async function() {
    const response = await request(app)
      .get("/users/u1")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1"
    });
  });

  // tests for bug #7
  test("should return 404 if the user is not found", async function () {
    const response = await request(app)
      .get("/users/nonexistent-user")
      .send({ _token: tokens.u3 }); // u3 is admin
    expect(response.statusCode).toBe(404);
  });

});

describe("PATCH /users/[username]", function() {
  test("should deny access if no token provided", async function() {
    const response = await request(app).patch("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  test("should deny access if not admin/right user", async function() {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u2 }); // wrong user token
    expect(response.statusCode).toBe(401);
  });

  test("should patch data if admin", async function() {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u3, first_name: "new-fn1" }); // u3 is admin
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "new-fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1",
      admin: false,
      password: expect.any(String)
    });
  });

  test("should disallow patching not-allowed-fields if not admin", async function() {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u1, admin: true });
    expect(response.statusCode).toBe(401);
  });


  test("should return 404 if cannot find user", async function() {
    const response = await request(app)
      .patch("/users/not-a-user")
      .send({ _token: tokens.u3, first_name: "new-fn" }); // u3 is admin
    expect(response.statusCode).toBe(404);
  });

  // tests bug #2
  test("u1 user can patch own u1 route", async function () {
    const response = await request(app)
        .patch("/users/u1")
        .send({ _token: tokens.u1, first_name: "new1-fn1" }); // u1 is self 
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "new1-fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1",
      admin: false,
      password: expect.any(String)
    });
  });

  test("u1 user cannot patch u2 user route", async function () {
    const response = await request(app)
        .patch("/users/u2")
        .send({ _token: tokens.u1, first_name: "new1-fn1" }); // u1 is self 
    expect(response.statusCode).toBe(401);
  });

  // tests bug #3
  test("should allow patching another user to admin if user is admin", async function() {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u3, admin: true });
    expect(response.statusCode).toBe(200);
  });


  // tests bug #4
  test("should grant access with a correct token", async function() {
    const correctToken = tokens.u1;
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: correctToken, first_name: "new-fn1" });

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "new-fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1",
      admin: false,
      password: expect.any(String)
    });
  });

  // tests bug #4
  test("should reject access with an invalid token", async function() {
    const invalidToken = jwt.sign({ username: 'u1', admin: false }, 'wrong_secret_key');
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: invalidToken, first_name: "new-fn1" });

    expect(response.statusCode).toBe(401);
  });


});

describe("DELETE /users/[username]", function() {
  test("should deny access if no token provided", async function() {
    const response = await request(app).delete("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  // shouldn't users be allowed to delete themself?
  test("should deny access if not admin", async function() {
    const response = await request(app)
      .delete("/users/u1")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(401);
  });

  
  test("should deny access if deleting another user and not admin", async function() {
    const response = await request(app)
      .delete("/users/u2")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(401);
  });


  test("should allow if admin", async function() {
    const response = await request(app)
      .delete("/users/u1")
      .send({ _token: tokens.u3 }); // u3 is admin
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "deleted" });
  });
});

