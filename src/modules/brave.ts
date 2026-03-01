import { ttc } from 'ttc-origin-server';
import { z } from 'zod';
import axios from 'axios';

export class BraveSearch {
  private baseUrl: string = 'https://api.search.brave.com/res/v1';

  @ttc.describe({
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
  })
  async search(
    query: string, 
    numResults: number = 10,
    country: string = 'us',
    searchLang: string = 'en',
    safeSearch: string = 'moderate',
    freshness?: string
  ): Promise<{
    success: boolean;
    results: Array<{ 
      title: string; 
      url: string; 
      description?: string;
      publishedDate?: string;
      language?: string;
      score?: number;
    }>;
    error?: string;
  }> {
    try {
      // Get API key from request headers
      const context = ttc.requestContext(arguments);
      const apiKey = context.request.headers['authorization'];
      
      if (!apiKey) {
        return {
          success: false,
          results: [],
          error: 'Brave Search API key not provided in Authorization header.'
        };
      }

      const params: any = {
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
      const results = data.web?.results?.map((result: any) => ({
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
    } catch (error: any) {
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
