import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user-schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { error } from 'console';



@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async createUser(data: any) {
        return await this.userModel.create(data);
    }

    async findByEmail(email: string) {
        return await this.userModel.findOne({ email }).select('+password')

    }

    async findById(id: string) {
        return await this.userModel.findById(id).select('-password')
    }



    async updateUser(id: string, data: any,) {
        return await this.userModel.findByIdAndUpdate(id, data, { new: true },).select('-password');
    }

    async changePassword(
        id: string,
        oldPassword: string,
        newPassword: string,
    ) {
        const user = await this.userModel.findById(id)
        if (!user) {
            throw new BadRequestException("Invalid User")
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password)

        if (!isPasswordCorrect) {
            throw new BadRequestException('Old password is incorrect')
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)


        user.password = hashedPassword;

        await user.save()

        return {
            message:
                'Password changed successfully',
        };
    }
}
