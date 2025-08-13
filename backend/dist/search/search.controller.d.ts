import { SearchService } from './search.service';
export declare class SearchController {
    private readonly search;
    constructor(search: SearchService);
    query(q: string, offset?: string, limit?: string): Promise<{
        projects: any[];
        units: any[];
    }>;
}
