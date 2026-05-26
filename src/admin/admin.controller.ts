import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService:AdminService){}

    @Get('users')
    @ApiOperation({
        summary:"Get All Users"
    })
    @UseGuards(JwtAuthGuard)
    getAllUsers(
        @Query('page')
        page = 1,

        @Query('limit')
        limit = 10,
        @Query('search')
        search = '',
    ){
        return this.adminService.getAllUsers(Number(page), Number(limit), search);
    }

    @ApiOperation({
        summary:"Get a User  By id"
    })
    @Get('users/:id')
    @UseGuards(JwtAuthGuard)
    getSingleUser(@Param('id') id:string,){
        return this.adminService.getSingleUser(id)
    }

    @Patch('users/:id/status')
    @ApiOperation({
        summary:"Update user Status "
    })
    @UseGuards(JwtAuthGuard)
    updateUserStatus(
        @Param('id') id:string,
        @Body() data:UpdateStatusDto,
    ){
        return this.adminService.updateUserStatus(id, data.isActive);
    }

    @Delete('users/:id')

    @ApiOperation({
        summary:"Delete User"
    })
    @UseGuards(JwtAuthGuard)
    softDeleteUser(
        @Param('id') id:string,
    ){
        return this.adminService.softDelete(id)
    }

}
