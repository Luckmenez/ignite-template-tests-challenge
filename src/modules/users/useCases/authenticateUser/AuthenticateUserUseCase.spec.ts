import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"


let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to create an user authentication", async () => {
    await createUserUseCase.execute({
      email:"test@test.com.br",
      password:"test",
      name:"test",
    })

    const userAuthenticated = await authenticateUserUseCase.execute({
      email:"test@test.com.br",
      password:"test"
    })

    expect(userAuthenticated).toHaveProperty("token")
  })
})
