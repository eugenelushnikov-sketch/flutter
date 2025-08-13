import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchService } from '../search/search.service';
export declare class IndexingProcessor implements OnModuleInit {
    private readonly prisma;
    private readonly search;
    private readonly logger;
    private connection;
    constructor(prisma: PrismaService, search: SearchService);
    onModuleInit(): Promise<void>;
}
