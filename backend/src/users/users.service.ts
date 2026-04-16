import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

async findOrCreate(profile: {
  googleId: string;
  email: string;
  name: string;
  picture: string;
}): Promise<User> {
  // Try by googleId first
  let user = await this.userRepo.findOne({ where: { googleId: profile.googleId } });
  
  // Fallback: find by email (for users created before googleId was stored)
  if (!user) {
    user = await this.userRepo.findOne({ where: { email: profile.email } });
  }

  if (!user) {
    user = this.userRepo.create(profile);
  } else {
    // Update googleId if missing
    user.googleId = profile.googleId;
    user.picture = profile.picture;
  }

  return this.userRepo.save(user);
}

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }
}