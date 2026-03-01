# Search Origin Server

A TTC Origins service providing multiple search providers with varying capabilities and authentication requirements.

## Server Information

- **Name:** search-origin
- **Description:** Multiple search providers: DuckDuckGo (free), Tavily (AI search), Brave (privacy), Exa (semantic search)
- **Port:** 3097
- **Authentication:** Tavily and Exa require API keys via Authorization header

## Available Modules

### 1. DuckDuckGoSearch
- **Authentication:** None required (free)
- **Functions:**
  - `search(query, numResults)` - Search DuckDuckGo

### 2. TavilySearch
- **Authentication:** API key required
- **Functions:**
  - `search(query, numResults, includeAnswer, includeImages, includeRawContent)` - AI-powered search
  - `getUsage()` - Check API usage

### 3. BraveSearch
- **Authentication:** API key required
- **Functions:**
  - `search(query, numResults, country, searchLang, safeSearch, freshness)` - Privacy-focused search

### 4. ExaSearch
- **Authentication:** API key required
- **Functions:**
  - `search(query, numResults, includeText, type)` - Semantic search
  - `findSimilar(url, numResults, includeText)` - Find similar pages
  - `answer(question, includeText)` - Get AI answers with citations

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode (auto-restart on changes):
   ```bash
   npm run dev
   ```

3. Or run once:
   ```bash
   npm run start
   ```

## Project Structure

- `src/index.ts` - Main server entry point
- `src/modules/` - Search provider modules with @ttc.describe decorators
