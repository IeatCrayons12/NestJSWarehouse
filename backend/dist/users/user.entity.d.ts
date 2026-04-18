import { Item } from '../features/items/item.entity';
export declare class User {
    id: string;
    email: string;
    name: string;
    picture: string;
    googleId: string;
    password: string;
    items: Item[];
    createdAt: Date;
    updatedAt: Date;
}
