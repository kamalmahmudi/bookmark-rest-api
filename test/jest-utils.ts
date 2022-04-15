import { INestApplication, ValidationPipe } from '@nestjs/common'
import { TestingModule, Test } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { AuthDto } from 'src/auth/dto'
import { PrismaService } from 'src/prisma/prisma.service'

export const getApp = async (): Promise<
  [app: INestApplication, prisma: PrismaService]
> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule]
  }).compile()

  const app = moduleFixture.createNestApplication()
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
  await app.init()
  const prisma = app.get<PrismaService>(PrismaService)

  return [app, prisma]
}

export const signupUser = async (
  app: INestApplication,
  dto: AuthDto = {
    email: 'someone@someplace.com',
    password: '123'
  }
): Promise<request.Response> => {
  return request(app.getHttpServer()).post('/auth/signup').send(dto)
}
