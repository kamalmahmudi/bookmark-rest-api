import { INestApplication } from '@nestjs/common'
import { AuthDto } from 'src/auth/dto'
import { PrismaService } from 'src/prisma/prisma.service'
import * as request from 'supertest'
import { getApp, signupUser } from './jest-utils'

describe('AuthController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  const dto: AuthDto = {
    email: 'someone@someplace.com',
    password: '123'
  }

  beforeEach(async () => {
    ;[app, prisma] = await getApp()
    await prisma.cleanDb()
  })

  describe('POST /auth/signup', () => {
    // negative testing
    it('should handle missing data', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .expect(400)
      expect(res.body.message).toMatchSnapshot()
    })

    it('should handle duplicate user', async () => {
      await signupUser(app, dto)
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(403)
      expect(res.body.message).toBe('Credentials taken')
    })

    // positive testing
    it('should handle correct dto', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(201)
      expect(res)
      expect(res.body.access_token).toBeDefined()
    })
  })

  describe('POST /auth/signin', () => {
    // negative testing
    it('should handle missing data', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .expect(400)
      expect(res.body.message).toMatchSnapshot()
    })

    it('should handle unknown user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(dto)
        .expect(403)
      expect(res.body.message).toBe('Credentials incorrect')
    })

    it('should handle incorrect password', async () => {
      await signupUser(app, dto)
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          ...dto,
          password: 'wrong-password'
        })
        .expect(403)
      expect(res.body.message).toBe('Credentials incorrect')
    })

    // positive testing
    it('should handle correct dto', async () => {
      await signupUser(app, dto)
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(dto)
        .expect(200)
      expect(res.body.access_token).toBeDefined()
    })
  })
})
