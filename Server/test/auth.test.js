const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // Import file app.js của bạn
const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
/* Test các trường hợp:
Đăng ký thành công.
Đăng ký với email trùng.
Đăng nhập thành công.
Sai mật khẩu.
Tài khoản bị vô hiệu hóa.
*/

// Chạy một MongoDB memory server trước khi test
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Cleanup sau mỗi test case
afterEach(async () => {
  await User.deleteMany();
});

// Đóng kết nối sau khi test xong
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Test case cho đăng ký
describe("POST /api/auth/register", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      phone: "0123456789"
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty("_id");
    expect(res.body.user.email).toBe("test@example.com");
  });

  it("should return error if email already exists", async () => {
    await User.create({
      email: "test@example.com",
      password: await bcryptjs.hash("password123", 10),
      name: "Test User",
      phone: "0123456789"
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      phone: "0123456789"
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("User already exists");
  });
});

// Test case cho login
describe("POST /api/auth/login", () => {
  it("should login successfully", async () => {
    const hashedPassword = await bcryptjs.hash("password123", 10);
    await User.create({
      email: "test@example.com",
      password: hashedPassword,
      name: "Test User",
      phone: "0123456789",
      status: "active"
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123"
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty("_id");
  });

  it("should return error for incorrect password", async () => {
    const hashedPassword = await bcryptjs.hash("password123", 10);
    await User.create({
      email: "test@example.com",
      password: hashedPassword,
      name: "Test User",
      phone: "0123456789",
      status: "active"
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword"
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should return error for inactive account", async () => {
    const hashedPassword = await bcryptjs.hash("password123", 10);
    await User.create({
      email: "test@example.com",
      password: hashedPassword,
      name: "Test User",
      phone: "0123456789",
      status: "inactive"
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123"
    });

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toBe("Tài khoản của bạn đã bị hạn chế");
  });
});
