
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("should be able to create a deposit statement", async () => {
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
      //type guard for undefined user;
      id = "error"
    }

    const statement = await createStatementUseCase.execute({
      user_id: id,
      amount: 2000,
      description: "Test Description",
      type: OperationType.DEPOSIT,
    })

    const balance = await getBalanceUseCase.execute({user_id: id})

    expect(balance).not.toBe(undefined)
    expect(balance).toHaveProperty("balance")
  })

  it("should be able to create a withdraw statement", async () => {
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const user = await createUserUseCase.execute({
      email:"testwithdraw@test.com.br",
      password:"test",
      name:"test",
    })

    let { id } = user;

    if(id === undefined){
      //type guard for undefined user;
      id = "error"
    }

    const depositStatement = await createStatementUseCase.execute({
      user_id: id,
      amount: 2000,
      description: "Test Description",
      type: OperationType.DEPOSIT,
    })

    const withdrawStatement = await createStatementUseCase.execute({
      user_id: id,
      amount: 500,
      description: "Test Description",
      type: OperationType.WITHDRAW,
    })

    const balance = await getBalanceUseCase.execute({user_id: id})

    expect(balance).not.toBe(undefined)
    expect(balance.balance).toBe(1500)
  })

  it("should not be able to create a withdraw statement bigger than actual balance", () => {
    expect(async () => {
      enum OperationType {
        DEPOSIT = 'deposit',
        WITHDRAW = 'withdraw',
      }
      const user = await createUserUseCase.execute({
        email:"testwithdraw@test.com.br",
        password:"test",
        name:"test",
      })

      let { id } = user;

      if(id === undefined){
        //type guard for undefined user;
        id = "error"
      }
      const depositStatement = await createStatementUseCase.execute({
        user_id: id,
        amount: 2000,
        description: "Test Description",
        type: OperationType.DEPOSIT,
      })

      const withdrawStatement = await createStatementUseCase.execute({
        user_id: id,
        amount: 2500,
        description: "Test Description",
        type: OperationType.WITHDRAW,
      })

      const balance = await getBalanceUseCase.execute({user_id: id})

      expect(balance).not.toBe(undefined)
      expect(balance.balance).toBe(1500)
    }).rejects.toBeInstanceOf(AppError)
  })
})
