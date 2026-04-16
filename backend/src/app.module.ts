import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { User } from './users/user.entity';
import { Item } from './items/item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      process.env.DATABASE_URL
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [User, Item],
            synchronize: process.env.NODE_ENV !== 'production',
            ssl: { rejectUnauthorized: false },
          }
        : {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USER || 'warehouse',
            password: process.env.DB_PASSWORD || 'warehouse123',
            database: process.env.DB_NAME || 'warehouse_db',
            entities: [User, Item],
            synchronize: true,
          },
    ),
    AuthModule,
    UsersModule,
    ItemsModule,
  ],
})
export class AppModule {}
