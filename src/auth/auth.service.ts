import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    if (user && user.password === loginDto.password) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new UnauthorizedException('Email ou senha inválidos.');
    }
    return null;
  }

}
