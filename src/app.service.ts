import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getVersion() {
    return { version: '0.0.1' }
  }
}
