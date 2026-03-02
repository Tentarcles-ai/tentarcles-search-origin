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
 * Google Custom Search module for performing web searches using Google's Custom Search JSON API
 *
 * This module provides search functionality through Google's Custom Search API,
 * requiring both an API key and a Custom Search Engine ID (cx).
 *
 * @class GoogleSearch
 * @example
 * // Search for "quantum computing"
 * await google.search("quantum computing", 5);
 */
export class GoogleSearch {
    /**
     * Perform a web search using Google Custom Search API
     *
     * @param query - Search query string
     * @param numResults - Number of results to return (1-10, default: 5)
     * @returns Object containing success status and search results
     * @example
     * await google.search("artificial intelligence", 5);
     */
    async search(query, numResults = 5) {
        try {
            // Get API key and Search Engine ID from request headers
            const apiKey = getAuthKey(arguments, {
                provider: 'google',
                credentialKey: 'apiKey'
            });
            const searchEngineId = getAuthKey(arguments, {
                provider: 'google',
                credentialKey: 'searchEngineId'
            });
            if (!apiKey || !searchEngineId) {
                return {
                    success: false,
                    results: [],
                    error: 'Google API key and Search Engine ID required in Authorization headers.'
                };
            }
            const url = 'https://www.googleapis.com/customsearch/v1';
            const params = {
                key: apiKey,
                cx: searchEngineId,
                q: query,
                num: Math.min(Math.max(numResults, 1), 10) // Limit to 1-10
            };
            const response = await axios.get(url, { params });
            const items = response.data.items || [];
            const results = items.map((item) => ({
                title: item.title,
                url: item.link,
                snippet: item.snippet,
                displayLink: item.displayLink
            }));
            return {
                success: true,
                results
            };
        }
        catch (error) {
            return {
                success: false,
                results: [],
                error: error.message || 'Google search failed'
            };
        }
    }
}
__decorate([
    ttc.describe({
        doc: 'Perform a web search using Google Custom Search API',
        inputSchema: z.object({
            query: z.string(),
            numResults: z.number().min(1).max(10).optional().default(5)
        }),
        outputSchema: z.object({
            success: z.boolean(),
            results: z.array(z.object({
                title: z.string(),
                url: z.string(),
                snippet: z.string().optional(),
                displayLink: z.string().optional()
            })),
            error: z.string().optional()
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], GoogleSearch.prototype, "search", null);
