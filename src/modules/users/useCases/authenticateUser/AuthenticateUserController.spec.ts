import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";




let connection: Connection;
describe("It should be able to Authenticate an user", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close()
  })

  it("should be able to authenticate an user", async () => {
    await request(app).post('/api/v1/users').send({
      name: "SuperTest",
      email: "supertest@supertest.com.br",
      password: "supertest",
    })

    const userAuthenticated = await request(app).post('/api/v1/sessions').send({
      email: "supertest@supertest.com.br",
      password: "supertest",
    })

    expect(userAuthenticated.body).toHaveProperty('token')
  })
})
