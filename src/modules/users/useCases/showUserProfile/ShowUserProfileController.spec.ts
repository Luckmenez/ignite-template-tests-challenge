import { Connection } from "typeorm"
import { app } from "../../../../app";
import request from 'supertest';
import createConnection from "../../../../database";


let connection: Connection;
describe("Show User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close()
  })

  it('it should be able to show users profile', async () => {
    await request(app).post('/api/v1/users').send({
      name: "SuperTest2",
      email: "supertest2@supertestasdfas.com.br",
      password: "supertest2",
    })

    const authenticatedUser = await request(app).post('/api/v1/sessions').send({
      email: "supertest2@supertestasdfas.com.br",
      password: "supertest2",
    })

    const userResponse = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${authenticatedUser.body.token}`
    })

    expect(userResponse.status).toBe(200);
    expect(userResponse.body).toHaveProperty("id");
  })

})
