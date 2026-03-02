var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { getAuthKey, ttc } from 'ttc-origin-server';
import { z } from 'zod';
import Exa from 'exa-js';
/**
 * Exa AI Search Module
 *
 * Provides semantic search functionality using Exa AI's API.
 * Requires API key in Authorization header for authentication.
 * Offers neural search, keyword search, find similar pages,
 * and AI-generated answers with citations.
 *
 * @class ExaSearch
 */
export class ExaSearch {
    /**
     * Search the web using Exa AI
     *
     * @param query - The search query string
     * @param numResults - Number of results to return (1-20, default: 5)
     * @param includeText - Include text content in results (default: true)
     * @param type - Search type: 'neural', 'keyword', 'auto' (default: 'auto')
     * @returns Object containing success status and search results
     * @example
     * await exa.search("machine learning", 5, true, "neural");
     */
    async search(query, numResults = 5, includeText = true, type = 'auto') {
        try {
            const apiKey = getAuthKey(arguments, {
                provider: 'Exa',
                credentialKey: 'apiKey'
            });
            if (!apiKey) {
                return {
                    success: false,
                    results: [],
                    error: 'Exa API key required in Authorization header'
                };
            }
            const exa = new Exa(apiKey);
            let result;
            if (includeText) {
                result = await exa.search(query, {
                    numResults,
                    type,
                    contents: { text: true }
                });
            }
            else {
                result = await exa.search(query, {
                    numResults,
                    type,
                    contents: false
                });
            }
            const results = result.results.map((r) => ({
                title: r.title,
                url: r.url,
                text: r.text,
                score: r.score
            }));
            console.log('Exa search results:', JSON.stringify(results, null, 2));
            return {
                success: true,
                results: results.slice(0, numResults)
            };
        }
        catch (error) {
            return {
                success: false,
                results: [],
                error: error.message || 'Search failed'
            };
        }
    }
    /**
     * Find similar pages to a URL using Exa AI
     *
     * @param url - Source URL to find similar pages for
     * @param numResults - Number of results to return (1-20, default: 5)
     * @param includeText - Include text content in results (default: true)
     * @returns Object containing success status and similar page results
     * @example
     * await exa.findSimilar("https://example.com/article", 5, true);
     */
    async findSimilar(url, numResults = 5, includeText = true) {
        try {
            const apiKey = getAuthKey(arguments, {
                provider: 'Exa',
                credentialKey: 'apiKey'
            });
            if (!apiKey) {
                return {
                    success: false,
                    results: [],
                    error: 'Exa API key required'
                };
            }
            const exa = new Exa(apiKey);
            let result;
            if (includeText) {
                result = await exa.findSimilar(url, {
                    numResults,
                    contents: { text: true }
                });
            }
            else {
                result = await exa.findSimilar(url, {
                    numResults,
                    contents: false
                });
            }
            const results = result.results.map((r) => ({
                title: r.title,
                url: r.url,
                text: r.text,
                score: r.score
            }));
            return {
                success: true,
                results: results.slice(0, numResults)
            };
        }
        catch (error) {
            return {
                success: false,
                results: [],
                error: error.message || 'Find similar failed'
            };
        }
    }
    /**
     * Get answer with citations using Exa AI
     *
     * @param question - Question to get an answer for
     * @param includeText - Include text content in citations (default: true)
     * @returns Object containing success status, AI answer, and citations
     * @example
     * await exa.answer("What is quantum computing?", true);
     */
    async answer(question, includeText = true) {
        try {
            const apiKey = getAuthKey(arguments, {
                provider: 'Exa',
                credentialKey: 'apiKey'
            });
            if (!apiKey) {
                return {
                    success: false,
                    error: 'Exa API key required'
                };
            }
            const exa = new Exa(apiKey);
            const result = await exa.answer(question, {
                text: includeText
            });
            return {
                success: true,
                answer: result.answer,
                citations: result.citations?.map((c) => ({
                    title: c.title,
                    url: c.url,
                    text: c.text
                }))
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Answer failed'
            };
        }
    }
}
__decorate([
    ttc.describe({
        doc: 'Search the web using Exa AI',
        inputSchema: z.object({
            query: z.string(),
            numResults: z.number().min(1).max(20).optional().default(5),
            includeText: z.boolean().optional().default(true),
            type: z.enum(['neural', 'keyword', 'auto']).optional().default('auto')
        }),
        outputSchema: z.object({
            success: z.boolean(),
            results: z.array(z.object({
                title: z.string(),
                url: z.string(),
                text: z.string().optional(),
                score: z.number().optional()
            })),
            error: z.string().optional()
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Boolean, String]),
    __metadata("design:returntype", Promise)
], ExaSearch.prototype, "search", null);
__decorate([
    ttc.describe({
        doc: 'Find similar pages to a URL using Exa AI',
        inputSchema: z.object({
            url: z.string().url(),
            numResults: z.number().min(1).max(20).optional().default(5),
            includeText: z.boolean().optional().default(true)
        }),
        outputSchema: z.object({
            success: z.boolean(),
            results: z.array(z.object({
                title: z.string(),
                url: z.string(),
                text: z.string().optional(),
                score: z.number().optional()
            })),
            error: z.string().optional()
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Boolean]),
    __metadata("design:returntype", Promise)
], ExaSearch.prototype, "findSimilar", null);
__decorate([
    ttc.describe({
        doc: 'Get answer with citations using Exa AI',
        inputSchema: z.object({
            question: z.string(),
            includeText: z.boolean().optional().default(true)
        }),
        outputSchema: z.object({
            success: z.boolean(),
            answer: z.string().optional(),
            citations: z.array(z.object({
                title: z.string(),
                url: z.string(),
                text: z.string().optional()
            })).optional(),
            error: z.string().optional()
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], ExaSearch.prototype, "answer", null);
