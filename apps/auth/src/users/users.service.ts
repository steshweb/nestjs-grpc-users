import {
  User as ProtoUser,
  CreateUserDto,
  UpdateUserDto,
  Users,
} from '@app/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User as MongooseUser } from './users.model';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(MongooseUser.name)
    private readonly userModel: Model<MongooseUser>,
  ) {}

  private userIdNormalize(user: MongooseUser): ProtoUser {
    return {
      id: user._id.toString(),
      username: user.username,
      password: user.password,
      subscribed: user.subscribed,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<ProtoUser> {
    const user = new this.userModel({
      ...createUserDto,
    });

    const createdUser = await user.save();
    return this.userIdNormalize(createdUser);
  }

  async findAll(): Promise<Users> {
    const users = await this.userModel.find().exec();
    return {
      users: users.map((user) => this.userIdNormalize(user)),
    };
  }

  async findOne(id: string): Promise<ProtoUser> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User not found by id ${id}.`);
    }

    return this.userIdNormalize(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<ProtoUser> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { subscribed: updateUserDto.subscribed } },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new NotFoundException(`User not found by id ${id}.`);
    }

    return this.userIdNormalize(user);
  }

  async remove(id: string): Promise<ProtoUser> {
    const user = await this.userModel.findOneAndDelete({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException(`User not found by id ${id}.`);
    }
    return this.userIdNormalize(user);
  }
}
