import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  JwtAuthGuard,
  type AuthenticatedRequest,
} from './guards/jwt-auth/jwt-auth.guard';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  registerUser(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
  @Post('login')
  loginUser(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Req() request: AuthenticatedRequest) {
    return this.authService.getCurrentUser(request.user!.sub);
  }
}
