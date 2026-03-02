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
import axios from 'axios';
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
export class BraveSearch {
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
            const apiKey = getAuthKey(arguments, {
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
            const response = await axios.get(`${this.baseUrl}/web/search`, {
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
__decorate([
    ttc.describe({
        doc: 'Search using Brave Search API',
        inputSchema: z.object({
            query: z.string(),
            numResults: z.number().min(1).max(20).optional().default(10),
            country: z.string().optional().default('us'),
            searchLang: z.string().optional().default('en'),
            safeSearch: z.enum(['off', 'moderate', 'strict']).optional().default('moderate'),
            freshness: z.string().optional() // e.g., 'pd' (past day), 'pw', 'pm', 'py'
        }),
        outputSchema: z.object({
            success: z.boolean(),
            results: z.array(z.object({
                title: z.string(),
                url: z.string(),
                description: z.string().optional(),
                publishedDate: z.string().optional(),
                language: z.string().optional(),
                score: z.number().optional()
            })),
            error: z.string().optional()
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], BraveSearch.prototype, "search", null);
