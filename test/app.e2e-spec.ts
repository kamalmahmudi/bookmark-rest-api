import { INestApplication } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import * as request from 'supertest'
import { getApp } from './jest-utils'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeEach(async () => {
    ;[app, prisma] = await getApp()
    await prisma.cleanDb()
  })

  describe('GET /version', () => {
    it('pos: should return current version', async () => {
      return await request(app.getHttpServer())
        .get('/version')
        .expect(200)
        .expect({ version: '0.0.1' })
    })
  })
})
