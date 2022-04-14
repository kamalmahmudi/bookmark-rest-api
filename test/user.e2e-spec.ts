import { INestApplication } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import * as request from 'supertest'
import { getApp, signupUser } from './jest-utils'

describe('UserController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let accessToken: string

  beforeEach(async () => {
    ;[app, prisma] = await getApp()
    await prisma.cleanDb()
    const res = await signupUser(app)
    accessToken = res.body.access_token
  })

  describe('GET /users/me', () => {
    describe('negative', () => {
      it('should handle missing auth', async () => {
        await request(app.getHttpServer()).get('/users/me').expect(401)
      })
    })

    describe('positive', () => {
      it('should return correct data', async () => {
        const res = await request(app.getHttpServer())
          .get('/users/me')
          .auth(accessToken, { type: 'bearer' })
          .expect(200)
        expect(res.body.id).toBeDefined()
        expect(res.body.createdAt).toBeDefined()
        expect(res.body.updatedAt).toBeDefined()
        expect(res.body.email).toBe('someone@someplace.com')
        expect(res.body.firstName).toBe(null)
        expect(res.body.lastName).toBe(null)
      })
    })
  })

  describe('PATCH /users', () => {
    describe('negative', () => {
      it('should handle missing auth', async () => {
        await request(app.getHttpServer()).patch('/users').expect(401)
      })
    })

    describe('positive', () => {
      it('should handle correct dto', async () => {
        await request(app.getHttpServer())
          .patch('/users')
          .auth(accessToken, { type: 'bearer' })
          .send({ email: 'john@doe.com' })
          .expect(200)
        const res = await request(app.getHttpServer())
          .patch('/users')
          .auth(accessToken, { type: 'bearer' })
          .send({ firstName: 'John', lastName: 'Doe' })
          .expect(200)
        expect(res.body.id).toBeDefined()
        expect(res.body.createdAt).toBeDefined()
        expect(res.body.updatedAt).toBeDefined()
        expect(res.body.email).toBe('john@doe.com')
        expect(res.body.firstName).toBe('John')
        expect(res.body.lastName).toBe('Doe')
      })
    })
  })
})
