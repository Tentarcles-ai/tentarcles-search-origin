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
exports.DuckDuckGoSearch = void 0;
const ttc_origin_server_1 = require("ttc-origin-server");
const zod_1 = require("zod");
const axios_1 = __importDefault(require("axios"));
/**
 * DuckDuckGo Search Module
 *
 * Provides search functionality using DuckDuckGo's free API.
 * No authentication required - completely free and privacy-focused.
 * Returns instant answers and related topics from DuckDuckGo search results.
 *
 * @class DuckDuckGoSearch
 */
class DuckDuckGoSearch {
    /**
     * Search DuckDuckGo using their official API
     *
     * @param query - The search query string
     * @param numResults - Number of results to return (1-10, default: 5)
     * @returns Object containing success status and search results
     * @example
     * await search.search("weather today", 3);
     */
    async search(query, numResults = 5) {
        try {
            // DuckDuckGo API - no API key needed!
            const url = 'https://api.duckduckgo.com/';
            const params = {
                q: query,
                format: 'json',
                no_html: 1,
                no_redirect: 1,
                skip_disambig: 1
            };
            const response = await axios_1.default.get(url, { params });
            const data = response.data;
            // console.log('DuckDuckGo API response:', JSON.stringify(data, null, 2));
            // DuckDuckGo returns AbstractText and RelatedTopics
            const results = [];
            // Add instant answer if available
            if (data.AbstractText) {
                results.push({
                    title: data.Heading || 'Instant Answer',
                    link: data.AbstractURL || '',
                    snippet: data.AbstractText
                });
            }
            // Add related topics (limited to numResults)
            if (data.RelatedTopics && data.RelatedTopics.length > 0) {
                const topics = data.RelatedTopics
                    .filter((topic) => topic.Text && topic.FirstURL)
                    .slice(0, numResults - results.length)
                    .map((topic) => ({
                    title: topic.Text.split(' - ')[0] || topic.Text,
                    link: topic.FirstURL,
                    snippet: topic.Text
                }));
                results.push(...topics);
            }
            console.log(JSON.stringify(results, null, 2));
            return {
                success: true,
                results: results.slice(0, numResults)
            };
        }
        catch (error) {
            console.log('DuckDuckGo search failed:', error.message);
            return {
                success: false,
                results: [],
                error: `DuckDuckGo search failed: ${error.message}`
            };
        }
    }
}
exports.DuckDuckGoSearch = DuckDuckGoSearch;
__decorate([
    ttc_origin_server_1.ttc.describe({
        doc: 'Search DuckDuckGo using their official API',
        inputSchema: zod_1.z.object({
            query: zod_1.z.string(),
            numResults: zod_1.z.number().min(1).max(10).optional().default(5)
        }),
        outputSchema: zod_1.z.object({
            success: zod_1.z.boolean(),
            results: zod_1.z.array(zod_1.z.object({
                title: zod_1.z.string(),
                link: zod_1.z.string(),
                snippet: zod_1.z.string().optional()
            })),
            error: zod_1.z.string().optional()
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], DuckDuckGoSearch.prototype, "search", null);
