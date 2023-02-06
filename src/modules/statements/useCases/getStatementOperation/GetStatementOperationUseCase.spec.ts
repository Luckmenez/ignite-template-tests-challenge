import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository,inMemoryStatementsRepository)
  })

  it("it should be able to get a statement an specific statement", async () => {
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const user = await createUserUseCase.execute({
      email:"test@test.com.br",
      password:"test",
      name:"test",
    })

    let { id: user_id } = user;

    if(user_id === undefined){
      //user typeguard
      user_id = "error";
    }

    const depositStatement = await createStatementUseCase.execute({
      user_id: user_id,
      amount: 2000,
      description: "Test Description",
      type: OperationType.DEPOSIT,
    })

    let { id: statement_id } = depositStatement;

    if(statement_id === undefined){
      //typeguard for statement
      statement_id = "error"
    }


    const getStatement = await getStatementOperationUseCase.execute({user_id, statement_id})

  })
})
