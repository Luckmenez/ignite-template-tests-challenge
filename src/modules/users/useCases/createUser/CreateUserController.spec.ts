import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;
describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close()
  })

  it("should be able to create a new user", async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: "SuperTest",
      email: "supertest@supertest.com.br",
      password: "supertest"
    })

    expect(response.status).toBe(201);
  })

  it("should not be able to create the same user twice", async () => {
    const responseUser = await request(app).post('/api/v1/users').send({
      name: "SuperTest",
      email: "supertest1@supertest.com.br",
      password: "supertest"
    })

    const responseRepeatedUser = await request(app).post('/api/v1/users').send({
      name: "SuperTest",
      email: "supertest1@supertest.com.br",
      password: "supertest"
    })

    expect(responseRepeatedUser.status).toBe(400);
    expect(responseRepeatedUser.body.message).toBe('User already exists');
  })
})
