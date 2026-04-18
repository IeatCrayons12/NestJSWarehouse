import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    login(user: User): {
        access_token: string;
    };
}
