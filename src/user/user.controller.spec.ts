import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('UserController', () => {
  let controller: UserController
  let userService: UserService
  const user = {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    email: 'someone@someplace.com',
    hash: '$argon2i$v=19$m=4096,t=3,p=1$UoCA7SrlxEg//ckSzIsKLg$pNVj7KjeejFnADTn+BT0gUUY9q9JSZTO3OZDsFG4vRM',
    firstName: 'Someone',
    lastName: null
  }
  delete user.hash

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [ConfigService, PrismaService, UserService]
    }).compile()

    controller = module.get<UserController>(UserController)
    userService = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getMe', () => {
    it('should return current user', () => {
      const res = controller.getMe(user)
      expect(res).toMatchObject(user)
    })
  })

  describe('editUser', () => {
    it('should update and return correct data', async () => {
      userService.editUser = jest.fn().mockImplementationOnce(() => user)
      const res = await controller.editUser(1, { firstName: 'Someone' })
      expect(userService.editUser).toBeCalledWith(1, { firstName: 'Someone' })
      expect(res).toMatchObject(user)
    })
  })
})
