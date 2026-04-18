import { ItemsService } from './items.service';
import { CreateItemDto, UpdateItemDto } from './item.dto';
export declare class ItemsController {
    private readonly itemsService;
    constructor(itemsService: ItemsService);
    findAll(): Promise<import("./item.entity").Item[]>;
    findOne(id: string): Promise<import("./item.entity").Item>;
    create(dto: CreateItemDto, req: any): Promise<import("./item.entity").Item>;
    update(id: string, dto: UpdateItemDto): Promise<import("./item.entity").Item>;
    remove(id: string): Promise<void>;
}
