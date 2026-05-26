import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }


    @Post('register')
    @ApiOperation({
        summary: 'Register User',
    })
    register(
        @Body()
        data: CreateUserDto,
    ) {
        return this.authService.register(data)
    }



    @Get('login')
    @ApiOperation({
        summary: 'Login User',
    })
    login(
        @Body()
        data: LoginUserDto
    ) {
        return this.authService.login(data)
    }
}
