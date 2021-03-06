import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto } from './dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password)
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash
        }
      })
      return this.signToken(user.id, user.email)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Credentials taken')
      }
      throw error
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email }
    })
    if (!user) throw new ForbiddenException('Credentials incorrect')
    const pwMatches = await argon.verify(user.hash, dto.password)
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect')
    return this.signToken(user.id, user.email)
  }

  signToken(userId: number, email: string): { access_token } {
    const payload = {
      sub: userId,
      email
    }
    const token = this.jwt.sign(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET')
    })
    return { access_token: token }
  }
}
