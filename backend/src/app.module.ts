import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrgsModule } from './orgs/orgs.module';
import { ProjectsModule } from './projects/projects.module';
import { UnitsModule } from './units/units.module';
import { FavoritesModule } from './favorites/favorites.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { UploadModule } from './upload/upload.module';
import { SearchModule } from './search/search.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PrismaModule,
    CacheModule,
    AuthModule,
    UsersModule,
    OrgsModule,
    ProjectsModule,
    UnitsModule,
    FavoritesModule,
    InquiriesModule,
    UploadModule,
    SearchModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
