const supertest = require("supertest");
const server = require("./server");
const request = supertest(server);

let cookie;

beforeAll(async (done) => {
  const res = await request.post("/login").send({
    email: "admin@admin.com",
    password: "1234Qwer",
  });
  // Mock cookie
  const cookies = res.headers["set-cookie"][0]
    .split(",")
    .map((item) => item.split(";")[0]);
  cookie = cookies.join(";");
  done();
});

describe("register user", () => {
  test("respond 200", async (done) => {
    const response = await request
      .post("/register")
      .set("Cookie", cookie)
      .send({
        first_name: "Jamie",
        last_name: "Xx",
        email: "jamie@xx.com",
        password: "1234Qwer",
      });
    expect(response.status).toBe(200);
    done();
  });
});

describe("can't register - email exists", () => {
  test("respond 409", async (done) => {
    const response = await request
      .post("/register")
      .set("Cookie", cookie)
      .send({
        first_name: "Qwer",
        last_name: "Qwer",
        email: "admin@admin.com",
        password: "1234Qwer",
      });
    expect(response.status).toBe(409);
    done();
  });
});

describe("user login", () => {
  test("respond 200", async (done) => {
    const response = await request.post("/login").send({
      customer_email: "admin@admin.com",
      email: "admin@admin.com",
      password: "1234Qwer",
    });
    expect(response.status).toBe(200);
    done();
  });
});

describe("show the products", () => {
  test("respond 200", async (done) => {
    const response = await request.get("/products");
    expect(response.status).toBe(200);
    done();
  });
});

describe("testing address update", () => {
  test("respond 200", async (done) => {
    const response = await request
      .post("/customerAddress")
      .send({
        customer_address: "testing address",
        customer_email: "admin@admin.com",
      })
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("testing address");
    done();
  });
});

describe("testing profile picture sending", () => {
  test("respond 200", async (done) => {
    const response = await request
      .post("/uploads")
      .send({
        profile_picture: "testing",
        customer_email: "q@q.com",
      })
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    done();
  });
});

describe("testing delete account", () => {
  test("respond 200", async (done) => {
    const response = await request
      .post("/account")
      .send({
        customer_email: "jamie@xx.com",
      })
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    done();
  });
});

describe("get user information", () => {
  test("respond 200", async (done) => {
    const response = await request.get("/userInfo");
    expect(response.status).toBe(200);
    done();
  });
});

describe("testing sending order", () => {
  test("respond 200", async (done) => {
    const response = await request
      .post("/order")
      .send({
        totals: 22,
        customer_id: 47,
        customer_address: "testing address",
      })
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    done();
  });
});
