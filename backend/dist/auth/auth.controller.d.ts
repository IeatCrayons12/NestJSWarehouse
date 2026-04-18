import type { Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googleLogin(): void;
    googleCallback(req: any, res: Response): void;
    me(req: any): any;
}
