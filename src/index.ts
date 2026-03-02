import { runServer } from 'ttc-origin-server';
import { DuckDuckGoSearch } from './modules/duckduckgo';
import { TavilySearch } from './modules/tavily';
import { BraveSearch } from './modules/brave';
import { ExaSearch } from './modules/exa';
import { GoogleSearch } from './modules/google';


runServer({
  name: 'search-origin',
  description: 'Multiple search providers: DuckDuckGo (free), Tavily (AI search), Brave (privacy), Exa (semantic search)',
  modules: [DuckDuckGoSearch, TavilySearch, BraveSearch, ExaSearch, GoogleSearch],
  port: 3097,
  credentials: [
    {
      provider: 'tavily',
      credentialKeys: [ 'apiKey' ]
    },
    {
      provider: 'Exa',
      credentialKeys: ['apiKey']
    },
    {
      provider: 'brave',
      credentialKeys: ['apiKey']
    },
    {
      provider: 'google',
      credentialKeys: ['apiKey', 'searchEngineId']
    }
  ],
  modifyable: false,
  authCb: async (req) => {
    // Allow all requests; API keys are in headers
    return true;
  }
});
