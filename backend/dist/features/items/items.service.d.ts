import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { CreateItemDto, UpdateItemDto } from './item.dto';
export declare class ItemsService {
    private readonly itemRepo;
    constructor(itemRepo: Repository<Item>);
    findAll(): Promise<Item[]>;
    findOne(id: string): Promise<Item>;
    create(dto: CreateItemDto, userId: string): Promise<Item>;
    update(id: string, dto: UpdateItemDto): Promise<Item>;
    remove(id: string): Promise<void>;
}
