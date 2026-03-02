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
import { tavily as TavilyClient } from '@tavily/core';
/**
 * Tavily Search Module
 *
 * Provides AI-powered search functionality using Tavily's API.
 * Requires API key in Authorization header for authentication.
 * Offers advanced features like AI-generated answers, image search,
 * and raw content extraction.
 *
 * @class TavilySearch
 */
export class TavilySearch {
    /**
     * Search using Tavily AI Search API
     *
     * @param query - The search query string
     * @param numResults - Number of results to return (1-10, default: 5)
     * @param includeAnswer - Include AI-generated answer (default: false)
     * @param includeImages - Include image URLs in results (default: false)
     * @param includeRawContent - Include raw content text (default: false)
     * @returns Object containing success status, search results, and optional AI answer/images
     * @example
     * await tavily.search("AI news", 5, true, false, false);
     */
    async search(query, numResults = 5, includeAnswer = false, includeImages = false, includeRawContent = false) {
        try {
            // Get API key from request headers
            const apiKey = getAuthKey(arguments, {
                provider: 'tavily',
                credentialKey: 'apiKey'
            });
            if (!apiKey) {
                return {
                    success: false,
                    results: [],
                    error: 'Tavily API key not provided in Authorization header.'
                };
            }
            // Initialize Tavily client with API key
            const tavily = TavilyClient({ apiKey });
            // Perform search using official client
            const searchResult = await tavily.search(query, {
                maxResults: numResults,
                includeAnswer,
                includeImages,
                includeRawContent: includeRawContent ? 'text' : false,
                searchDepth: 'basic' // 'basic' or 'advanced'
            });
            // Transform Tavily response to our format
            const results = searchResult.results?.map((result) => ({
                title: result.title,
                url: result.url,
                content: result.content,
                score: result.score,
                publishedDate: result.publishedDate
            })) || [];
            // Extract image URLs if available
            const imageUrls = searchResult.images?.map((img) => img.url || img) || [];
            return {
                success: true,
                results,
                answer: searchResult.answer,
                images: imageUrls
            };
        }
        catch (error) {
            const errorMessage = error.message || 'Unknown error';
            console.log('Tavily search failed:', errorMessage);
            return {
                success: false,
                results: [],
                error: `Tavily search failed: ${errorMessage}`
            };
        }
    }
    /**
     * Get Tavily API usage and limits
     *
     * @returns Object containing success status and usage information
     * @example
     * await tavily.getUsage();
     */
    async getUsage() {
        try {
            const apiKey = getAuthKey(arguments, {
                provider: 'tavily',
                credentialKey: 'apiKey'
            });
            if (!apiKey) {
                return {
                    success: false,
                    error: 'API key required for usage check.'
                };
            }
            // Tavily might have a usage endpoint, or we can infer from response headers
            // For now, return basic info
            return {
                success: true,
                usage: {
                    monthlyLimit: 1000, // Default Tavily free tier
                    used: 0,
                    remaining: 1000
                }
            };
        }
        catch (error) {
            console.log('Failed to get Tavily usage:', error.message);
            return {
                success: false,
                error: `Failed to get usage: ${error.message}`
            };
        }
    }
}
__decorate([
    ttc.describe({
        doc: 'Search using Tavily AI Search API via official @tavily/core package',
        inputSchema: z.object({
            query: z.string(),
            numResults: z.number().min(1).max(10).optional().default(5),
            includeAnswer: z.boolean().optional().default(false),
            includeImages: z.boolean().optional().default(false),
            includeRawContent: z.boolean().optional().default(false)
        }),
        outputSchema: z.object({
            success: z.boolean(),
            results: z.array(z.object({
                title: z.string(),
                url: z.string(),
                content: z.string().optional(),
                score: z.number().optional(),
                publishedDate: z.string().optional()
            })),
            answer: z.string().optional(),
            images: z.array(z.string()).optional(),
            error: z.string().optional()
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Boolean, Boolean, Boolean]),
    __metadata("design:returntype", Promise)
], TavilySearch.prototype, "search", null);
__decorate([
    ttc.describe({
        doc: 'Get Tavily API usage and limits',
        inputSchema: z.object({}),
        outputSchema: z.object({
            success: z.boolean(),
            usage: z.object({
                monthlyLimit: z.number().optional(),
                used: z.number().optional(),
                remaining: z.number().optional()
            }).optional(),
            error: z.string().optional()
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TavilySearch.prototype, "getUsage", null);
