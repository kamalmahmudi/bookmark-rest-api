import { INestApplication } from '@nestjs/common'
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto'
import { PrismaService } from 'src/prisma/prisma.service'
import * as request from 'supertest'
import { getApp, signupUser } from './jest-utils'

describe('BookmarkController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let accessToken: string
  let accessToken2: string
  let createdBookmarkId: number
  const createDto: CreateBookmarkDto = {
    title: 'First Bookmark',
    link: 'https://someplace.com/some/path'
  }
  const editDto: EditBookmarkDto = {
    title: 'Edited First Bookmark',
    link: 'https://someplace.com/some/path/edited'
  }
  const editDto2: EditBookmarkDto = {
    description: 'Description of first bookmark'
  }
  const expectedResult = {
    id: expect.any(Number),
    createdAt: expect.anything(),
    updatedAt: expect.anything(),
    title: createDto.title,
    description: null,
    link: createDto.link,
    userId: expect.any(Number)
  }

  beforeAll(async () => {
    ;[app, prisma] = await getApp()
    await prisma.cleanDb()
    let res = await signupUser(app)
    accessToken = res.body.access_token
    res = await signupUser(app, {
      email: 'john@doe.com',
      password: 'secret'
    })
    accessToken2 = res.body.access_token
  })

  describe('POST /bookmarks', () => {
    // negative testing
    it('should handle missing auth', async () => {
      await request(app.getHttpServer()).post('/bookmarks').expect(401)
    })

    it('should handle missing data', async () => {
      const res = await request(app.getHttpServer())
        .post('/bookmarks')
        .auth(accessToken, { type: 'bearer' })
        .expect(400)
      expect(res.body.message).toMatchSnapshot()
    })

    // positive testing
    it('should handle correct dto', async () => {
      const res = await request(app.getHttpServer())
        .post('/bookmarks')
        .auth(accessToken, { type: 'bearer' })
        .send(createDto)
        .expect(201)
      expect(res.body).toMatchObject({
        ...expectedResult
      })
      createdBookmarkId = res.body.id
    })
  })

  describe('GET /bookmarks', () => {
    // negative testing
    it('should handle missing auth', async () => {
      await request(app.getHttpServer()).get('/bookmarks').expect(401)
    })

    // positive testing
    it('should return correct and non empty data', async () => {
      const res = await request(app.getHttpServer())
        .get('/bookmarks')
        .auth(accessToken, { type: 'bearer' })
        .expect(200)
      expect(res.body.length).toBe(1)
      expect(res.body[0]).toMatchObject({
        ...expectedResult,
        id: createdBookmarkId
      })
    })

    it('should return correct and empty data', async () => {
      const res = await request(app.getHttpServer())
        .get('/bookmarks')
        .auth(accessToken2, { type: 'bearer' })
        .expect(200)
      expect(res.body.length).toBe(0)
    })
  })

  describe('GET /bookmarks/:id', () => {
    // negative testing
    it('should handle missing auth', async () => {
      await request(app.getHttpServer())
        .get(`/bookmarks/${createdBookmarkId}`)
        .expect(401)
    })

    it('should handle unknown bookmark', async () => {
      const res = await request(app.getHttpServer())
        .get(`/bookmarks/${createdBookmarkId + 1}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(404)
      expect(res.body.message).toBe('Not Found')
    })

    it('should handle non accessible bookmark', async () => {
      const res = await request(app.getHttpServer())
        .get(`/bookmarks/${createdBookmarkId}`)
        .auth(accessToken2, { type: 'bearer' })
        .expect(404)
      expect(res.body.message).toBe('Not Found')
    })

    // positive testing
    it('should return correct data', async () => {
      const res = await request(app.getHttpServer())
        .get(`/bookmarks/${createdBookmarkId}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(200)
      expect(res.body).toMatchObject({
        ...expectedResult,
        id: createdBookmarkId
      })
    })
  })

  describe('PATCH /bookmarks/:id', () => {
    // negative testing
    it('should handle missing auth', async () => {
      await request(app.getHttpServer())
        .patch(`/bookmarks/${createdBookmarkId}`)
        .send(editDto)
        .expect(401)
    })

    it('should handle unknown bookmark', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/bookmarks/${createdBookmarkId + 1}`)
        .auth(accessToken, { type: 'bearer' })
        .send(editDto)
        .expect(404)
      expect(res.body.message).toBe('Not Found')
    })

    it('should handle non accessible bookmark', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/bookmarks/${createdBookmarkId}`)
        .auth(accessToken2, { type: 'bearer' })
        .send(editDto)
        .expect(404)
      expect(res.body.message).toBe('Not Found')
    })

    // positive testing
    it('should handle correct dto', async () => {
      await request(app.getHttpServer())
        .patch(`/bookmarks/${createdBookmarkId}`)
        .auth(accessToken, { type: 'bearer' })
        .send(editDto)
        .expect(200)
      const res = await request(app.getHttpServer())
        .patch(`/bookmarks/${createdBookmarkId}`)
        .auth(accessToken, { type: 'bearer' })
        .send(editDto2)
        .expect(200)
      expect(res.body).toMatchObject({
        ...expectedResult,
        id: createdBookmarkId,
        title: editDto.title,
        description: editDto2.description,
        link: editDto.link
      })
    })
  })

  describe('DELETE /bookmarks/:id', () => {
    // negative testing
    it('should handle missing auth', async () => {
      await request(app.getHttpServer())
        .delete(`/bookmarks/${createdBookmarkId}`)
        .expect(401)
    })

    it('should handle unknown bookmark', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/bookmarks/${createdBookmarkId + 1}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(404)
      expect(res.body.message).toBe('Not Found')
    })

    it('should handle non accessible bookmark', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/bookmarks/${createdBookmarkId}`)
        .auth(accessToken2, { type: 'bearer' })
        .expect(404)
      expect(res.body.message).toBe('Not Found')
    })

    // positive testing
    it('should delete the bookmark', async () => {
      await request(app.getHttpServer())
        .delete(`/bookmarks/${createdBookmarkId}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(204)
      const n = await prisma.bookmark.count({
        where: { id: createdBookmarkId }
      })
      expect(n).toBe(0)
    })
  })
})
