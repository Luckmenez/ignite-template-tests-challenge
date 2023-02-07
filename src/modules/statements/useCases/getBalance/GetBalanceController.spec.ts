import request from "supertest";
import { app } from "../../../../app";
import { Connection } from "typeorm";
import createConnection from "../../../../database";

let connection: Connection;
describe("Get Balance Controller", () => {
  beforeAll(async() => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('should be able to get user balance', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: "SuperTest800",
      email: "supertest800@supertest.com.br",
      password: "supertest800"
    })

    const userAuthenticated = await request(app).post('/api/v1/sessions').send({
      email: "supertest800@supertest.com.br",
      password: "supertest800"
    })


    const statementDeposit = await request(app).post('/api/v1/statements/deposit').send({
      amount: 800,
      description: "Weekend work payment"
    }).set({
      Authorization: `Bearer ${userAuthenticated.body.token}`
    })

    const balance = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${userAuthenticated.body.token}`
    })

    expect(balance.body).toHaveProperty('balance')
  })
})
