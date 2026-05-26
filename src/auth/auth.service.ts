import { BadRequestException, Body, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
                private readonly jwtService: JwtService
    ){}

    async register(data:CreateUserDto){

        const existingUser = await this.userService.findByEmail(data.email)

        if(existingUser){
            throw new BadRequestException("User Already Exist With This Email Id")
        }

        const hashedPassword = await bcrypt.hash( data.password ,10)

        const user = await this.userService.createUser({
            ...data,
            password: hashedPassword
        })

        return {
            message:"User registered successfully",
            user,
        }
    }


    async login(data:LoginUserDto){

        const user =  await this.userService.findByEmail(data.email)
        
        if(!user){
            throw new BadRequestException(
            "Invalid Email , Register First"
        )}

        console.log(user.password)
        console.log(data.password)

        const isPasswordCorret = await bcrypt.compare(data.password , user.password)

        console.log({isPasswordCorret})
        if(!isPasswordCorret){
            throw new BadRequestException("Invalid PassWORD")
        }

        const payload = {
            userId :user?._id,
            email: user?.email,
            role:user?.role,

        }

        const token = this.jwtService.sign(payload)

        return {
            message: "Login Successful",
            token : token
        }

    }
}
