import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user-schema';

@Injectable()
export class AdminService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async getAllUsers(
        page = 1,
        limit = 10,
        search = '',
    ) {
        const skip = (page - 1) * limit

        const filter: any = {
            isDeleted: false,
        }

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: 'i',
                    },
                },

                {
                    email: {
                        $regex: search,
                        $options: 'i',
                    }
                }
            ]
        }



        const users = await this.userModel.find(filter)
            .select("-password")
            .skip(skip)
            .limit(limit);

        const totalUsers = users.length

        return {
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            users
        }
    }

    async getSingleUser(id: string) {
        const user = await this.userModel.findOne({
            _id: id,
            isDeleted: false,
        }).select('-password');

        if (!user) {
            throw new NotFoundException('User not Found')
        }

        return user;

    }

    async updateUserStatus(
        id: string,
        isActive: boolean,
    ) {

        const user = await this.userModel.findByIdAndUpdate(id,
            { isActive, },
            { new: true },
        ).select('-password');


        if(!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }


    async softDelete(id: string) {
        const user = await this.userModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true },).select('-password');

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            message: 'User Deleted Successfully',
            user,
        }
    }


}
