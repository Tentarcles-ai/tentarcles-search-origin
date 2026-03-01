import { ttc } from 'ttc-origin-server';
import { z } from 'zod';
import Exa from 'exa-js';

export class ExaSearch {
  @ttc.describe({
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
  })
  async search(
    query: string, 
    numResults: number = 5,
    includeText: boolean = true,
    type: 'neural' | 'keyword' | 'auto' = 'auto'
  ) {
    try {
      const context = ttc.requestContext(arguments);
      const apiKey = context.request.headers['authorization'];
      
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
          contents: { text: true } as const
        });
      } else {
        result = await exa.search(query, {
          numResults,
          type,
          contents: false
        });
      }

      const results = result.results.map((r: any) => ({
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
    } catch (error: any) {
      return {
        success: false,
        results: [],
        error: error.message || 'Search failed'
      };
    }
  }

  @ttc.describe({
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
  })
  async findSimilar(
    url: string,
    numResults: number = 5,
    includeText: boolean = true
  ) {
    try {
      const context = ttc.requestContext(arguments);
      const apiKey = context.request.headers['authorization'];
      
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
          contents: { text: true } as const
        });
      } else {
        result = await exa.findSimilar(url, {
          numResults,
          contents: false
        });
      }

      const results = result.results.map((r: any) => ({
        title: r.title,
        url: r.url,
        text: r.text,
        score: r.score
      }));

      return {
        success: true,
        results: results.slice(0, numResults)
      };
    } catch (error: any) {
      return {
        success: false,
        results: [],
        error: error.message || 'Find similar failed'
      };
    }
  }

  @ttc.describe({
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
  })
  async answer(
    question: string,
    includeText: boolean = true
  ) {
    try {
      const context = ttc.requestContext(arguments);
      const apiKey = context.request.headers['authorization'];
      
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
        citations: result.citations?.map((c: any) => ({
          title: c.title,
          url: c.url,
          text: c.text
        }))
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Answer failed'
      };
    }
  }
}
