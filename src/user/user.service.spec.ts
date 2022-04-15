import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from './user.service'

describe('UserService', () => {
  let service: UserService
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, PrismaService, UserService]
    }).compile()

    service = module.get<UserService>(UserService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('editUser', () => {
    it('should update and return correct data', async () => {
      prisma.user.update = jest.fn().mockImplementationOnce(() => ({
        id: 1,
        createdAt: '2022-04-15T04:24:05.525Z',
        updatedAt: '2022-04-15T04:24:05.526Z',
        email: 'someone@someplace.com',
        hash: '$argon2i$v=19$m=4096,t=3,p=1$UoCA7SrlxEg//ckSzIsKLg$pNVj7KjeejFnADTn+BT0gUUY9q9JSZTO3OZDsFG4vRM',
        firstName: 'Someone',
        lastName: null
      }))
      const res = await service.editUser(1, { firstName: 'Someone' })
      expect(prisma.user.update).toBeCalledWith({
        data: { firstName: 'Someone' },
        where: { id: 1 }
      })
      expect(res.hash).toBeUndefined()
    })
  })
})
