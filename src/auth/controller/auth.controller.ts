import { JwtAuthGuard } from './../guards/jwt-auth.guard';
import { Controller, Post, UseGuards, Body, Param, Get, Request, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { LocalAuthGuard } from '../guards/local-auth.guard';

import { AuthService } from '../service/auth.service';

import { LoginUsuarioDto } from './../../usuario/dto/login-usuario.dto';

@ApiTags('Token')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }
    
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: LoginUsuarioDto) {
    return await this.authService.login(body);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async user(@Request() req) {    
    if (!req.user) {
      throw new UnauthorizedException('Login necessário.');
    }
    
    return await this.authService.login(req.user);
  }
}
