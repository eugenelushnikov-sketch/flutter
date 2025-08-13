"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const elasticsearch_1 = require("@elastic/elasticsearch");
let SearchService = SearchService_1 = class SearchService {
    logger = new common_1.Logger(SearchService_1.name);
    client;
    async onModuleInit() {
        const node = process.env.ELASTIC_URL || 'http://localhost:9200';
        this.client = new elasticsearch_1.Client({ node });
        await this.ensureIndices();
    }
    async ensureIndices() {
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
    async indexProject(doc) {
        await this.client.index({ index: 'projects', id: doc.id, document: doc, refresh: 'wait_for' });
    }
    async removeProject(id) {
        await this.client.delete({ index: 'projects', id, refresh: 'wait_for' }).catch(() => undefined);
    }
    async indexUnit(doc) {
        await this.client.index({ index: 'units', id: doc.id, document: doc, refresh: 'wait_for' });
    }
    async removeUnit(id) {
        await this.client.delete({ index: 'units', id, refresh: 'wait_for' }).catch(() => undefined);
    }
    async search(q, offset = 0, limit = 10) {
        const [projects, units] = await Promise.all([
            this.client.search({ index: 'projects', from: offset, size: limit, q: q ? `${q}` : undefined }),
            this.client.search({ index: 'units', from: offset, size: limit, q: q ? `${q}` : undefined }),
        ]);
        const mapHits = (hits, type) => hits.map((h) => ({ id: h._id, type, ...h._source }));
        return {
            projects: mapHits(projects.hits.hits, 'project'),
            units: mapHits(units.hits.hits, 'unit'),
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = SearchService_1 = __decorate([
    (0, common_1.Injectable)()
], SearchService);
//# sourceMappingURL=search.service.js.map