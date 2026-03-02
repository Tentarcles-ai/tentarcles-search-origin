"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ttc_origin_server_1 = require("ttc-origin-server");
const duckduckgo_1 = require("./modules/duckduckgo");
const tavily_1 = require("./modules/tavily");
const brave_1 = require("./modules/brave");
const exa_1 = require("./modules/exa");
const google_1 = require("./modules/google");
(0, ttc_origin_server_1.runServer)({
    name: 'search-origin',
    description: 'Multiple search providers: DuckDuckGo (free), Tavily (AI search), Brave (privacy), Exa (semantic search)',
    modules: [duckduckgo_1.DuckDuckGoSearch, tavily_1.TavilySearch, brave_1.BraveSearch, exa_1.ExaSearch, google_1.GoogleSearch],
    port: 3097,
    credentials: [
        {
            provider: 'tavily',
            credentialKeys: ['apiKey']
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
