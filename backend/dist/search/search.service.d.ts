import { OnModuleInit } from '@nestjs/common';
export declare class SearchService implements OnModuleInit {
    private readonly logger;
    private client;
    onModuleInit(): Promise<void>;
    private ensureIndices;
    indexProject(doc: any): Promise<void>;
    removeProject(id: string): Promise<void>;
    indexUnit(doc: any): Promise<void>;
    removeUnit(id: string): Promise<void>;
    search(q: string, offset?: number, limit?: number): Promise<{
        projects: any[];
        units: any[];
    }>;
}
