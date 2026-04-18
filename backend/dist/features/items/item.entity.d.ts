import { User } from '../../users/user.entity';
export declare class Item {
    id: string;
    name: string;
    description: string;
    sku: string;
    category: string;
    quantity: number;
    price: number;
    location: string;
    createdBy: User;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
}
