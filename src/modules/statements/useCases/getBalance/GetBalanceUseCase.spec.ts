import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository,inMemoryUsersRepository)
  })

  it("should be able to get an user balance", async () => {
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const user = await createUserUseCase.execute({
      email:"test@test.com.br",
      password:"test",
      name:"test",
    })

    let { id } = user;

    if(id === undefined){
      //user typeguard
      id = "error"
    }

    const depositStatement = await createStatementUseCase.execute({
        user_id: id,
        amount: 2000,
        description: "Test Description",
        type: OperationType.DEPOSIT,
      })

    const balance = await getBalanceUseCase.execute({user_id: id})

    console.log("alguma coisa", balance)

    expect(balance).not.toBe(undefined)
    expect(balance).toHaveProperty("balance")
  })
})
