import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private client!: Client;

  async onModuleInit() {
    const node = process.env.ELASTIC_URL || 'http://localhost:9200';
    this.client = new Client({ node });
    await this.ensureIndices();
  }

  private async ensureIndices() {
    const indices = ['projects', 'units'];
    for (const index of indices) {
      const exists = await this.client.indices.exists({ index });
      if (!exists) {
        await this.client.indices.create({
          index,
          settings: {
            analysis: {
              filter: {
                edge_ngram_filter: {
                  type: 'edge_ngram',
                  min_gram: 1,
                  max_gram: 20,
                },
              },
              analyzer: {
                autocomplete: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'edge_ngram_filter'],
                },
              },
            },
          },
          mappings: {
            properties: {
              name: { type: 'text', analyzer: 'autocomplete' },
              title: { type: 'text', analyzer: 'autocomplete' },
              slug: { type: 'keyword' },
              city: { type: 'keyword' },
              status: { type: 'keyword' },
              listingType: { type: 'keyword' },
              featuresText: { type: 'text' },
            },
          },
        });
        this.logger.log(`Created index ${index}`);
      }
    }
  }

  async indexProject(doc: any) {
    await this.client.index({ index: 'projects', id: doc.id, document: doc, refresh: 'wait_for' });
  }

  async removeProject(id: string) {
    await this.client.delete({ index: 'projects', id, refresh: 'wait_for' }).catch(() => undefined);
  }

  async indexUnit(doc: any) {
    await this.client.index({ index: 'units', id: doc.id, document: doc, refresh: 'wait_for' });
  }

  async removeUnit(id: string) {
    await this.client.delete({ index: 'units', id, refresh: 'wait_for' }).catch(() => undefined);
  }

  async search(q: string, offset = 0, limit = 10) {
    const [projects, units] = await Promise.all([
      this.client.search({ index: 'projects', from: offset, size: limit, q: q ? `${q}` : undefined }),
      this.client.search({ index: 'units', from: offset, size: limit, q: q ? `${q}` : undefined }),
    ]);
    const mapHits = (hits: any[], type: string) => hits.map((h) => ({ id: h._id, type, ...(h as any)._source }));
    return {
      projects: mapHits(projects.hits.hits as any[], 'project'),
      units: mapHits(units.hits.hits as any[], 'unit'),
    };
  }
}