"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BraveSearch = void 0;
const ttc_origin_server_1 = require("ttc-origin-server");
const zod_1 = require("zod");
const axios_1 = __importDefault(require("axios"));
/**
 * Brave Search Module
 *
 * Provides search functionality using Brave Search API.
 * Requires API key in Authorization header for authentication.
 * Offers privacy-focused search with configurable safe search,
 * country/language targeting, and freshness filtering.
 *
 * @class BraveSearch
 */
class BraveSearch {
    baseUrl = 'https://api.search.brave.com/res/v1';
    /**
     * Search using Brave Search API
     *
     * @param query - The search query string
     * @param numResults - Number of results to return (1-20, default: 10)
     * @param country - Country code for search results (default: 'us')
     * @param searchLang - Search language (default: 'en')
     * @param safeSearch - Safe search level: 'off', 'moderate', 'strict' (default: 'moderate')
     * @param freshness - Time filter: 'pd' (past day), 'pw', 'pm', 'py'
     * @returns Object containing success status and search results
     * @example
     * await brave.search("latest tech", 10, "us", "en", "moderate", "pd");
     */
    async search(query, numResults = 10, country = 'us', searchLang = 'en', safeSearch = 'moderate', freshness) {
        try {
            // Get API key from request headers
            const apiKey = (0, ttc_origin_server_1.getAuthKey)(arguments, {
                provider: 'brave',
                credentialKey: 'apiKey'
            });
            if (!apiKey) {
                return {
                    success: false,
                    results: [],
                    error: 'Brave Search API key not provided in Authorization header.'
                };
            }
            const params = {
                q: query,
                count: numResults,
                country,
                search_lang: searchLang,
                safesearch: safeSearch
            };
            if (freshness) {
                params.freshness = freshness;
            }
            const response = await axios_1.default.get(`${this.baseUrl}/web/search`, {
                params,
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'X-Subscription-Token': apiKey
                }
            });
            const data = response.data;
            // Transform Brave response to our format
            const results = data.web?.results?.map((result) => ({
                title: result.title,
                url: result.url,
                description: result.description,
                publishedDate: result.published_date,
                language: result.language,
                score: result.score
            })) || [];
            return {
                success: true,
                results: results.slice(0, numResults)
            };
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            console.log('Brave search failed:', errorMessage);
            return {
                success: false,
                results: [],
                error: `Brave search failed: ${errorMessage}`
            };
        }
    }
}
exports.BraveSearch = BraveSearch;
__decorate([
    ttc_origin_server_1.ttc.describe({
        doc: 'Search using Brave Search API',
        inputSchema: zod_1.z.object({
            query: zod_1.z.string(),
            numResults: zod_1.z.number().min(1).max(20).optional().default(10),
            country: zod_1.z.string().optional().default('us'),
            searchLang: zod_1.z.string().optional().default('en'),
            safeSearch: zod_1.z.enum(['off', 'moderate', 'strict']).optional().default('moderate'),
            freshness: zod_1.z.string().optional() // e.g., 'pd' (past day), 'pw', 'pm', 'py'
        }),
        outputSchema: zod_1.z.object({
            success: zod_1.z.boolean(),
            results: zod_1.z.array(zod_1.z.object({
                title: zod_1.z.string(),
                url: zod_1.z.string(),
                description: zod_1.z.string().optional(),
                publishedDate: zod_1.z.string().optional(),
                language: zod_1.z.string().optional(),
                score: zod_1.z.number().optional()
            })),
            error: zod_1.z.string().optional()
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], BraveSearch.prototype, "search", null);
