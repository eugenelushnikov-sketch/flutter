import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get()
  query(@Query('q') q: string, @Query('offset') offset = '0', @Query('limit') limit = '10') {
    return this.search.search(q || '', parseInt(offset, 10), parseInt(limit, 10));
  }
}