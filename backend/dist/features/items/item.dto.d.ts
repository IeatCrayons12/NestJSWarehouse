export declare class CreateItemDto {
    name: string;
    description?: string;
    sku?: string;
    category?: string;
    quantity?: number;
    price?: number;
    location?: string;
}
export declare class UpdateItemDto extends CreateItemDto {
}
