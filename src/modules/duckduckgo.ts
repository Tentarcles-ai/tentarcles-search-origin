import { ttc } from 'ttc-origin-server';
import { z } from 'zod';
import axios from 'axios';

export class DuckDuckGoSearch {
  @ttc.describe({
    doc: 'Search DuckDuckGo using their official API',
    inputSchema: z.object({
      query: z.string(),
      numResults: z.number().min(1).max(10).optional().default(5)
    }),
    outputSchema: z.object({
      success: z.boolean(),
      results: z.array(z.object({
        title: z.string(),
        link: z.string(),
        snippet: z.string().optional()
      })),
      error: z.string().optional()
    })
  })
  async search(query: string, numResults: number = 5): Promise<{
    success: boolean;
    results: Array<{ title: string; link: string; snippet?: string }>;
    error?: string;
  }> {
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
      
      const response = await axios.get(url, { params });
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
          .filter((topic: any) => topic.Text && topic.FirstURL)
          .slice(0, numResults - results.length)
          .map((topic: any) => ({
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
    } catch (error: any) {
      console.log('DuckDuckGo search failed:', error.message);
      return {
        success: false,
        results: [],
        error: `DuckDuckGo search failed: ${error.message}`
      };
    }
  }
}
