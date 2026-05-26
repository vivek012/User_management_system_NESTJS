import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get('profile')
    @ApiOperation({
        summary: 'Get Profile',
    })
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req: any) {

        const user = await this.userService.findById(req.user.userId)

        return user;
    }


    @Patch('profile')
    @ApiOperation({
        summary:
            'Update Profile',
    })
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Req() req: any,
        @Body()
        data: UpdateUserDto,
    ) {

        return await this.userService.updateUser(req.user.userId, data,);
    }


    @Patch('change-password')
    @ApiOperation({
        summary:
            'Change Password',
    })
    @UseGuards(JwtAuthGuard)
    async changePassword(@Req() req: any,
        @Body()
        data: ChangePasswordDto

    ) {
        return this.userService.changePassword(req.user.userId, data.oldPassword, data.newPassword,);
    }
}


