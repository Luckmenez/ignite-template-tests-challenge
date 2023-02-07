import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";


let connection: Connection;
describe("Create Statement", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close()
  })

  it('should be able to create a deposit statement', async () => {
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

    const { id: depositId } = statementDeposit.body;

    const balance = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${userAuthenticated.body.token}`
    })

    const { statement } = balance.body;

    statement.includes((statementObj: { id: string }) => {
    });

    expect(statement.some((obj:any) => obj.id === depositId)).toBe(true);
  })

  it('should be able to create a withdraw statement', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: "SuperTest700",
      email: "supertest700@supertest.com.br",
      password: "supertest700"
    })

    const userAuthenticated = await request(app).post('/api/v1/sessions').send({
      email: "supertest700@supertest.com.br",
      password: "supertest700"
    })


    const statementDeposit = await request(app).post('/api/v1/statements/deposit').send({
      amount: 800,
      description: "Weekend work payment"
    }).set({
      Authorization: `Bearer ${userAuthenticated.body.token}`
    })

    const statementWithdraw = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 800,
      description: "Weekend payment"
    }).set({
      Authorization: `Bearer ${userAuthenticated.body.token}`
    })

    const { id: depositId } = statementWithdraw.body;

    const balance = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${userAuthenticated.body.token}`
    })

    const { statement } = balance.body;

    expect(statement.some((obj:any) => obj.id === depositId)).toBe(true);
  })

  it('should not be able to create a withdraw statement bigger than actual balance', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: "SuperTest600",
      email: "supertest600@supertest.com.br",
      password: "supertest600"
    })

    const userAuthenticated = await request(app).post('/api/v1/sessions').send({
      email: "supertest600@supertest.com.br",
      password: "supertest600"
    })


    const statementDeposit = await request(app).post('/api/v1/statements/deposit').send({
      amount: 800,
      description: "Weekend work payment"
    }).set({
      Authorization: `Bearer ${userAuthenticated.body.token}`
    })

    const statementWithdraw = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 900,
      description: "Weekend payment"
    }).set({
      Authorization: `Bearer ${userAuthenticated.body.token}`
    })

    const userBalance = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${userAuthenticated.body.token}`
    })


    expect(userBalance.body.balance).toBe(800);
  })
})
