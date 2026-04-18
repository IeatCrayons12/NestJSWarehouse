import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    findOrCreate(profile: {
        googleId: string;
        email: string;
        name: string;
        picture: string;
    }): Promise<User>;
    findById(id: string): Promise<User | null>;
}
