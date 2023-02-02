import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
describe("Create User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  })

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      email:"test@email.com.br",
      name:"Test",
      password:"12345"
    })

    expect(user).not.toBe(undefined)
    expect(user).toHaveProperty("id")
  })

  it("should not be able to crete the same user twice", () => {
    expect(async () => {
      await createUserUseCase.execute({
        email:"test@email.com.br",
        name:"Test",
        password:"12345"
      })

      await createUserUseCase.execute({
        email:"test@email.com.br",
        name:"Test",
        password:"12345"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
