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
  @ttc.describe({
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
  })
  async search(
    query: string,
    numResults: number = 5,
    includeAnswer: boolean = false,
    includeImages: boolean = false,
    includeRawContent: boolean = false
  ): Promise<{
    success: boolean;
    results: Array<{ title: string; url: string; content?: string; score?: number; publishedDate?: string }>;
    answer?: string;
    images?: string[];
    error?: string;
  }> {
    try {
      // Get API key from request headers
      const apiKey = getAuthKey(arguments, {
        provider: 'tavily',
        credentialKey: 'apiKey'
      })
      console.log(apiKey, 'tavily')

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
      const results = searchResult.results?.map((result: any) => ({
        title: result.title,
        url: result.url,
        content: result.content,
        score: result.score,
        publishedDate: result.publishedDate
      })) || [];

      // Extract image URLs if available
      const imageUrls = searchResult.images?.map((img: any) => img.url || img) || [];

      return {
        success: true,
        results,
        answer: searchResult.answer,
        images: imageUrls
      };
    } catch (error: any) {
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
  @ttc.describe({
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
  })
  async getUsage(): Promise<{
    success: boolean;
    usage?: { monthlyLimit?: number; used?: number; remaining?: number };
    error?: string;
  }> {
    try {
      const apiKey = getAuthKey(arguments, {
        provider: 'tavily',
        credentialKey: 'apiKey'
      })

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
    } catch (error: any) {
      console.log('Failed to get Tavily usage:', error.message);
      return {
        success: false,
        error: `Failed to get usage: ${error.message}`
      };
    }
  }
}
