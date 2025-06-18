import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.usersService.findOneByUsername(loginDto.username);
    if (user && user.password === loginDto.password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

}
