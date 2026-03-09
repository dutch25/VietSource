(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeColor = void 0;
var BadgeColor;
(function (BadgeColor) {
    BadgeColor["BLUE"] = "default";
    BadgeColor["GREEN"] = "success";
    BadgeColor["GREY"] = "info";
    BadgeColor["YELLOW"] = "warning";
    BadgeColor["RED"] = "danger";
})(BadgeColor = exports.BadgeColor || (exports.BadgeColor = {}));

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeSectionType = void 0;
var HomeSectionType;
(function (HomeSectionType) {
    HomeSectionType["singleRowNormal"] = "singleRowNormal";
    HomeSectionType["singleRowLarge"] = "singleRowLarge";
    HomeSectionType["doubleRow"] = "doubleRow";
    HomeSectionType["featured"] = "featured";
})(HomeSectionType = exports.HomeSectionType || (exports.HomeSectionType = {}));

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],5:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlEncodeObject = exports.convertTime = exports.Source = void 0;
/**
* @deprecated Use {@link PaperbackExtensionBase}
*/
class Source {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
    /**
     * @deprecated use {@link Source.getSearchResults getSearchResults} instead
     */
    searchRequest(query, metadata) {
        return this.getSearchResults(query, metadata);
    }
    /**
     * @deprecated use {@link Source.getSearchTags} instead
     */
    async getTags() {
        // @ts-ignore
        return this.getSearchTags?.();
    }
}
exports.Source = Source;
// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
function convertTime(timeAgo) {
    let time;
    let trimmed = Number((/\d*/.exec(timeAgo) ?? [])[0]);
    trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('minutes')) {
        time = new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('hours')) {
        time = new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('days')) {
        time = new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('year') || timeAgo.includes('years')) {
        time = new Date(Date.now() - trimmed * 31556952000);
    }
    else {
        time = new Date(Date.now());
    }
    return time;
}
exports.convertTime = convertTime;
/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj
 */
function urlEncodeObject(obj) {
    let ret = {};
    for (const entry of Object.entries(obj)) {
        ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
    }
    return ret;
}
exports.urlEncodeObject = urlEncodeObject;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRating = exports.SourceIntents = void 0;
var SourceIntents;
(function (SourceIntents) {
    SourceIntents[SourceIntents["MANGA_CHAPTERS"] = 1] = "MANGA_CHAPTERS";
    SourceIntents[SourceIntents["MANGA_TRACKING"] = 2] = "MANGA_TRACKING";
    SourceIntents[SourceIntents["HOMEPAGE_SECTIONS"] = 4] = "HOMEPAGE_SECTIONS";
    SourceIntents[SourceIntents["COLLECTION_MANAGEMENT"] = 8] = "COLLECTION_MANAGEMENT";
    SourceIntents[SourceIntents["CLOUDFLARE_BYPASS_REQUIRED"] = 16] = "CLOUDFLARE_BYPASS_REQUIRED";
    SourceIntents[SourceIntents["SETTINGS_UI"] = 32] = "SETTINGS_UI";
})(SourceIntents = exports.SourceIntents || (exports.SourceIntents = {}));
/**
 * A content rating to be attributed to each source.
 */
var ContentRating;
(function (ContentRating) {
    ContentRating["EVERYONE"] = "EVERYONE";
    ContentRating["MATURE"] = "MATURE";
    ContentRating["ADULT"] = "ADULT";
})(ContentRating = exports.ContentRating || (exports.ContentRating = {}));

},{}],7:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);
__exportStar(require("./ByteArray"), exports);
__exportStar(require("./Badge"), exports);
__exportStar(require("./interfaces"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./HomeSectionType"), exports);
__exportStar(require("./PaperbackExtensionBase"), exports);

},{"./Badge":1,"./ByteArray":2,"./HomeSectionType":3,"./PaperbackExtensionBase":4,"./Source":5,"./SourceInfo":6,"./interfaces":15}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],15:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./ChapterProviding"), exports);
__exportStar(require("./CloudflareBypassRequestProviding"), exports);
__exportStar(require("./HomePageSectionsProviding"), exports);
__exportStar(require("./MangaProgressProviding"), exports);
__exportStar(require("./MangaProviding"), exports);
__exportStar(require("./RequestManagerProviding"), exports);
__exportStar(require("./SearchResultsProviding"), exports);

},{"./ChapterProviding":8,"./CloudflareBypassRequestProviding":9,"./HomePageSectionsProviding":10,"./MangaProgressProviding":11,"./MangaProviding":12,"./RequestManagerProviding":13,"./SearchResultsProviding":14}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],60:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./DynamicUI/Exports/DUIBinding"), exports);
__exportStar(require("./DynamicUI/Exports/DUIForm"), exports);
__exportStar(require("./DynamicUI/Exports/DUIFormRow"), exports);
__exportStar(require("./DynamicUI/Exports/DUISection"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIHeader"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIInputField"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUILabel"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUILink"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIMultilineLabel"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUINavigationButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIOAuthButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISecureInputField"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISelect"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIStepper"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISwitch"), exports);
__exportStar(require("./Exports/ChapterDetails"), exports);
__exportStar(require("./Exports/Chapter"), exports);
__exportStar(require("./Exports/Cookie"), exports);
__exportStar(require("./Exports/HomeSection"), exports);
__exportStar(require("./Exports/IconText"), exports);
__exportStar(require("./Exports/MangaInfo"), exports);
__exportStar(require("./Exports/MangaProgress"), exports);
__exportStar(require("./Exports/PartialSourceManga"), exports);
__exportStar(require("./Exports/MangaUpdates"), exports);
__exportStar(require("./Exports/PBCanvas"), exports);
__exportStar(require("./Exports/PBImage"), exports);
__exportStar(require("./Exports/PagedResults"), exports);
__exportStar(require("./Exports/RawData"), exports);
__exportStar(require("./Exports/Request"), exports);
__exportStar(require("./Exports/SourceInterceptor"), exports);
__exportStar(require("./Exports/RequestManager"), exports);
__exportStar(require("./Exports/Response"), exports);
__exportStar(require("./Exports/SearchField"), exports);
__exportStar(require("./Exports/SearchRequest"), exports);
__exportStar(require("./Exports/SourceCookieStore"), exports);
__exportStar(require("./Exports/SourceManga"), exports);
__exportStar(require("./Exports/SecureStateManager"), exports);
__exportStar(require("./Exports/SourceStateManager"), exports);
__exportStar(require("./Exports/Tag"), exports);
__exportStar(require("./Exports/TagSection"), exports);
__exportStar(require("./Exports/TrackedMangaChapterReadAction"), exports);
__exportStar(require("./Exports/TrackerActionQueue"), exports);

},{"./DynamicUI/Exports/DUIBinding":17,"./DynamicUI/Exports/DUIForm":18,"./DynamicUI/Exports/DUIFormRow":19,"./DynamicUI/Exports/DUISection":20,"./DynamicUI/Rows/Exports/DUIButton":21,"./DynamicUI/Rows/Exports/DUIHeader":22,"./DynamicUI/Rows/Exports/DUIInputField":23,"./DynamicUI/Rows/Exports/DUILabel":24,"./DynamicUI/Rows/Exports/DUILink":25,"./DynamicUI/Rows/Exports/DUIMultilineLabel":26,"./DynamicUI/Rows/Exports/DUINavigationButton":27,"./DynamicUI/Rows/Exports/DUIOAuthButton":28,"./DynamicUI/Rows/Exports/DUISecureInputField":29,"./DynamicUI/Rows/Exports/DUISelect":30,"./DynamicUI/Rows/Exports/DUIStepper":31,"./DynamicUI/Rows/Exports/DUISwitch":32,"./Exports/Chapter":33,"./Exports/ChapterDetails":34,"./Exports/Cookie":35,"./Exports/HomeSection":36,"./Exports/IconText":37,"./Exports/MangaInfo":38,"./Exports/MangaProgress":39,"./Exports/MangaUpdates":40,"./Exports/PBCanvas":41,"./Exports/PBImage":42,"./Exports/PagedResults":43,"./Exports/PartialSourceManga":44,"./Exports/RawData":45,"./Exports/Request":46,"./Exports/RequestManager":47,"./Exports/Response":48,"./Exports/SearchField":49,"./Exports/SearchRequest":50,"./Exports/SecureStateManager":51,"./Exports/SourceCookieStore":52,"./Exports/SourceInterceptor":53,"./Exports/SourceManga":54,"./Exports/SourceStateManager":55,"./Exports/Tag":56,"./Exports/TagSection":57,"./Exports/TrackedMangaChapterReadAction":58,"./Exports/TrackerActionQueue":59}],61:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./generated/_exports"), exports);
__exportStar(require("./base/index"), exports);
__exportStar(require("./compat/DyamicUI"), exports);

},{"./base/index":7,"./compat/DyamicUI":16,"./generated/_exports":60}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HV2T = exports.HV2TInfo = void 0;
const types_1 = require("@paperback/types");
const HV2TParser_1 = require("./HV2TParser");
const BASE_URL = 'https://hv2t.store';
const PROXY_URL = 'https://nhentai-club-proxy.feedandafk2018.workers.dev';
exports.HV2TInfo = {
    version: '1.1.7',
    name: 'HV2T',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for HV2T',
    contentRating: types_1.ContentRating.ADULT,
    websiteBaseURL: BASE_URL,
    sourceTags: [
        { text: 'Adult', type: types_1.BadgeColor.RED },
        { text: '18+', type: types_1.BadgeColor.YELLOW },
    ],
    intents: types_1.SourceIntents.MANGA_CHAPTERS |
        types_1.SourceIntents.HOMEPAGE_SECTIONS |
        types_1.SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
};
class HV2T extends types_1.Source {
    constructor() {
        super(...arguments);
        this.parser = new HV2TParser_1.Parser();
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 3,
            requestTimeout: 60000,
            interceptor: {
                interceptRequest: async (request) => {
                    request.headers = {
                        ...(request.headers ?? {}),
                        'referer': BASE_URL,
                        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
                        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'accept-language': 'en-US,en;q=0.5',
                    };
                    return request;
                },
                interceptResponse: async (response) => {
                    return response;
                },
            }
        });
    }
    async getCloudflareBypassRequestAsync() {
        return App.createRequest({ url: BASE_URL, method: 'GET' });
    }
    buildRequest(url) {
        return App.createRequest({ url, method: 'GET' });
    }
    async fetchHTML(url) {
        console.log(`[HV2T] Fetching HTML: ${url}`);
        // Use proxy for HTML fetching to bypass Cloudflare
        const proxyUrl = `${PROXY_URL}?url=${encodeURIComponent(url)}`;
        try {
            const response = await this.requestManager.schedule(this.buildRequest(proxyUrl), 0);
            const data = response.data;
            return this.cheerio.load(data);
        }
        catch (e) {
            console.log(`[HV2T] Error fetching HTML: ${e}`);
            throw e;
        }
    }
    async fetchJSON(url) {
        console.log(`[HV2T] Fetching JSON: ${url}`);
        const proxyUrl = `${PROXY_URL}?url=${encodeURIComponent(url)}`;
        try {
            const response = await this.requestManager.schedule(this.buildRequest(proxyUrl), 0);
            return JSON.parse(response.data);
        }
        catch (e) {
            console.log(`[HV2T] Error fetching JSON: ${e}`);
            throw e;
        }
    }
    async getHomePageSections(sectionCallback) {
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${BASE_URL}/?sort=latest` },
            { id: 'most_followed', title: 'Theo Dõi Nhiều', url: `${BASE_URL}/?sort=follow` },
            { id: 'most_viewed', title: 'Lượt Xem Nhiều', url: `${BASE_URL}/?sort=view` },
            { id: 'completed', title: 'Đã Hoàn Thành', url: `${BASE_URL}/?sort=completed` },
        ];
        for (const section of sections) {
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal,
            }));
            try {
                const proxyFetchUrl = `${PROXY_URL}?url=${encodeURIComponent(section.url)}`;
                const response = await this.requestManager.schedule(this.buildRequest(proxyFetchUrl), 0);
                const $ = this.cheerio.load(response.data);
                const items = this.parser.parseHomePage($, PROXY_URL);
                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: types_1.HomeSectionType.singleRowNormal,
                    items,
                }));
            }
            catch (e) {
                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: [],
                }));
            }
        }
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const page = metadata?.page ?? 1;
        let sort = 'latest';
        if (homepageSectionId === 'most_followed')
            sort = 'follow';
        if (homepageSectionId === 'most_viewed')
            sort = 'view';
        if (homepageSectionId === 'completed')
            sort = 'completed';
        const url = `${BASE_URL}/?sort=${sort}&page=${page}`;
        const $ = await this.fetchHTML(url);
        const items = this.parser.parseHomePage($, PROXY_URL);
        return App.createPagedResults({
            results: items,
            metadata: { page: page + 1 },
        });
    }
    async getSearchResults(query, metadata) {
        const search = encodeURIComponent(query.title ?? '');
        const url = `${BASE_URL}/tim-kiem?q=${search}`;
        const $ = await this.fetchHTML(url);
        const items = this.parser.parseHomePage($, PROXY_URL);
        return App.createPagedResults({
            results: items,
        });
    }
    async getMangaDetails(mangaId) {
        const url = `${BASE_URL}/truyen/${mangaId}`;
        const $ = await this.fetchHTML(url);
        return this.parser.parseMangaDetails($, mangaId, PROXY_URL);
    }
    async getChapters(mangaId) {
        const url = `${BASE_URL}/api/comics/${mangaId}`;
        const json = await this.fetchJSON(url);
        return this.parser.parseChapters(json, mangaId);
    }
    async getChapterDetails(mangaId, chapterId) {
        const url = `${BASE_URL}/api/comics/${mangaId}/${chapterId}/view`;
        const json = await this.fetchJSON(url);
        const pages = this.parser.parseChapterDetails(json, chapterId, mangaId, PROXY_URL);
        return App.createChapterDetails({ id: chapterId, mangaId, pages });
    }
    getMangaShareUrl(mangaId) {
        return `${BASE_URL}/truyen/${mangaId}`;
    }
    async getSearchTags() {
        return this.parser.getSearchTags();
    }
}
exports.HV2T = HV2T;

},{"./HV2TParser":63,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    constructor() {
        this.BASE_DOMAIN = 'hv2t.store';
        this.CDN_DOMAIN = 'cdn.hv2t.com';
    }
    normalizeUrl(url, defaultDomain = this.BASE_DOMAIN) {
        if (!url)
            return '';
        if (url.startsWith('http'))
            return url;
        if (url.startsWith('//'))
            return `https:${url}`;
        if (url.startsWith('/'))
            return `https://${defaultDomain}${url}`;
        return `https://${defaultDomain}/${url}`;
    }
    // ─── Home Page ─────────────────────────────────────────────────────────────
    parseHomePage($, proxyUrl) {
        const results = [];
        // Try to parse JSON-LD data first (most reliable for Next.js)
        const jsonLdScripts = $('script[type="application/ld+json"]');
        jsonLdScripts.each((_, el) => {
            try {
                const jsonContent = $(el).html();
                if (!jsonContent)
                    return;
                const data = JSON.parse(jsonContent);
                const items = this.extractMangaItems(data);
                for (const item of items) {
                    if (item.url && item.name && item.image) {
                        const isChapter = item.url.includes('/chapter-') || item.url.includes('/chuong-') ||
                            item.name.toLowerCase().includes('chương') ||
                            item.name.toLowerCase().includes('chapter');
                        if (isChapter)
                            continue;
                        const match = item.url.match(/\/truyen\/([^/]+)/);
                        const slug = match ? match[1] : '';
                        if (!slug || slug.includes('chapter-') || results.some(r => r.mangaId === slug))
                            continue;
                        let image = this.normalizeUrl(item.image, this.CDN_DOMAIN);
                        // Remove webp to jpg conversion as it may cause 404s
                        // image = image.replace('.webp', '.jpg')
                        // Only add proxy if proxyUrl is not empty
                        if (proxyUrl && image) {
                            image = `${proxyUrl}?url=${encodeURIComponent(image)}`;
                        }
                        results.push(App.createPartialSourceManga({
                            mangaId: slug,
                            title: item.name,
                            image
                        }));
                    }
                }
            }
            catch (e) {
                // Not valid JSON, skip
            }
        });
        // Fallback: try to parse from DOM elements
        if (results.length === 0) {
            // Use contains instead of starts with for absolute/relative flexibility
            $('a[href*="/truyen/"]').each((_, el) => {
                const $el = $(el);
                const href = $el.attr('href') || '';
                const title = $el.attr('title') || $el.text().trim();
                const titleLower = title.toLowerCase();
                // Skip if it's a chapter link, just the base link, or has "Chương" in title
                const isChapter = href.includes('/chapter-') || href.includes('/chuong-') ||
                    titleLower.includes('chương') || titleLower.includes('chapter');
                if (!href || isChapter || href.endsWith('/truyen/'))
                    return;
                const match = href.match(/\/truyen\/([^/]+)/);
                const slug = match ? match[1] : '';
                if (!slug || results.some(r => r.mangaId === slug))
                    return;
                // Check if this looks like a manga card link (often has an image or is in a specific container)
                let image = this.normalizeUrl($el.find('img').attr('src') || $el.find('img').attr('data-src') || '', this.CDN_DOMAIN);
                if (!image) {
                    // Try to find image in siblings or parent container
                    const $container = $el.closest('div, article, section');
                    image = this.normalizeUrl($container.find('img').attr('src') || $container.find('img').attr('data-src') || '', this.CDN_DOMAIN);
                }
                if (image && proxyUrl) {
                    image = `${proxyUrl}?url=${encodeURIComponent(image)}`;
                }
                results.push(App.createPartialSourceManga({
                    mangaId: slug,
                    title: title.replace('Truyện ', '').trim() || slug,
                    image
                }));
            });
        }
        console.log(`[HV2T] parseHomePage: Found ${results.length} items`);
        return results;
    }
    extractMangaItems(data) {
        const items = [];
        if (Array.isArray(data)) {
            for (const item of data) {
                items.push(...this.extractMangaItems(item));
            }
        }
        else if (data && typeof data === 'object') {
            // Check if this is an ItemList
            if (data['@type'] === 'ItemList' && Array.isArray(data.itemListElement)) {
                for (const item of data.itemListElement) {
                    if (item['@type'] === 'ComicSeries' || item['@type'] === 'ListItem') {
                        const itemData = item.item || item;
                        const isChapter = (itemData.url ?? '').includes('/chapter-') || (itemData.url ?? '').includes('/chuong-') ||
                            (itemData.name ?? '').toLowerCase().includes('chương') ||
                            (itemData.name ?? '').toLowerCase().includes('chapter');
                        if (itemData.url && itemData.name && !isChapter) {
                            items.push({
                                name: itemData.name,
                                url: itemData.url,
                                image: itemData.image || ''
                            });
                        }
                    }
                }
            }
        }
        return items;
    }
    // ─── Manga Details ─────────────────────────────────────────────────────────
    parseMangaDetails($, mangaId, proxyUrl) {
        // Try to get title from various selectors
        const title = $('h1').first().text().trim() ||
            $('meta[property="og:title"]').attr('content')?.replace(' - HV2T', '').trim() ||
            $('title').text().replace(' - HV2T', '').trim() ||
            'Unknown Title';
        // Get cover image
        let image = $('meta[property="og:image"]').attr('content') ||
            $('img[class*="cover"]').attr('src') ||
            $('img[class*="cover"]').attr('data-src') ||
            $('main img').first().attr('src') ||
            '';
        if (image) {
            image = this.normalizeUrl(image, this.CDN_DOMAIN);
            image = `${proxyUrl}?url=${encodeURIComponent(image)}`;
        }
        // Get description
        const desc = $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            '';
        // Get author
        let author = 'Unknown';
        $('[class*="author"], [class*="tac-gia"], a[href*="/author/"]').each((_, el) => {
            const text = $(el).text().trim();
            if (text && text !== 'Unknown') {
                author = text;
                return false;
            }
        });
        // Get status
        let status = 'Ongoing';
        $('[class*="status"], [class*="tinh-trang"]').each((_, el) => {
            const text = $(el).text().toLowerCase();
            if (text.includes('hoàn thành') || text.includes('completed') || text.includes('full')) {
                status = 'Completed';
                return false;
            }
        });
        // Get genres/tags
        const tags = [];
        $('a[href*="/tags/"], a[href*="/genre/"], [class*="genre"] a, [class*="tag"] a').each((_, el) => {
            const href = $(el).attr('href') || '';
            const label = $(el).text().trim();
            if (label && !label.includes('Tác giả')) {
                const id = href.split('/').pop() || label.toLowerCase().replace(/\s+/g, '-');
                tags.push(App.createTag({ id, label }));
            }
        });
        const tagSections = [];
        if (tags.length > 0) {
            tagSections.push(App.createTagSection({ id: 'genre', label: 'Thể Loại', tags }));
        }
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image,
                status: status === 'Completed' ? 'completed' : 'ongoing',
                author: author,
                desc: desc,
                tags: tagSections,
            })
        });
    }
    // ─── Chapters ─────────────────────────────────────────────────────────────
    parseChapters(json, mangaId) {
        const chapters = [];
        const data = json?.data?.chapters;
        if (!Array.isArray(data)) {
            console.log(`[HV2T] parseChapters: No chapters found in JSON data`);
            return [];
        }
        for (const item of data) {
            const chapterId = item.slug || String(item.id);
            if (!chapterId)
                continue;
            const name = item.title || `Chương ${item.chapter_number || ''}`.trim();
            const chapNum = item.chapter_number || 0;
            chapters.push(App.createChapter({
                id: chapterId,
                name: name,
                chapNum,
                time: item.published_at ? new Date(item.published_at) : new Date(),
                langCode: 'vi'
            }));
        }
        console.log(`[HV2T] parseChapters: Parsed ${chapters.length} chapters`);
        return chapters;
    }
    // ─── Pages ────────────────────────────────────────────────────────────────
    parseChapterDetails(json, chapterId, mangaId, proxyUrl) {
        const pages = [];
        const images = json?.data?.images;
        if (!Array.isArray(images)) {
            console.log(`[HV2T] parseChapterDetails: No images found in JSON data`);
            return [];
        }
        for (let src of images) {
            if (!src || typeof src !== 'string')
                continue;
            // Normalize and proxy
            src = this.normalizeUrl(src, this.BASE_DOMAIN);
            src = `${proxyUrl}?url=${encodeURIComponent(src)}`;
            if (!pages.includes(src)) {
                pages.push(src);
            }
        }
        console.log(`[HV2T] parseChapterDetails: Found ${pages.length} pages`);
        return pages;
    }
    // ─── Search Tags ──────────────────────────────────────────────────────────
    getSearchTags() {
        const tags = [
            { id: 'action', label: 'Action' },
            { id: 'adult', label: 'Adult' },
            { id: 'adventure', label: 'Adventure' },
            { id: 'comedy', label: 'Comedy' },
            { id: 'drama', label: 'Drama' },
            { id: 'ecchi', label: 'Ecchi' },
            { id: 'fantasy', label: 'Fantasy' },
            { id: 'harem', label: 'Harem' },
            { id: 'historical', label: 'Historical' },
            { id: 'horror', label: 'Horror' },
            { id: 'isekai', label: 'Isekai' },
            { id: 'josei', label: 'Josei' },
            { id: 'manga', label: 'Manga' },
            { id: 'manhwa', label: 'Manhwa' },
            { id: 'martial-arts', label: 'Martial Arts' },
            { id: 'mature', label: 'Mature' },
            { id: 'mecha', label: 'Mecha' },
            { id: 'mystery', label: 'Mystery' },
            { id: 'netorare', label: 'Netorare' },
            { id: 'ntr', label: 'NTR' },
            { id: 'psychological', label: 'Psychological' },
            { id: 'romance', label: 'Romance' },
            { id: 'school-life', label: 'School Life' },
            { id: 'sci-fi', label: 'Sci-Fi' },
            { id: 'seinen', label: 'Seinen' },
            { id: 'shoujo', label: 'Shoujo' },
            { id: 'shounen', label: 'Shounen' },
            { id: 'slice-of-life', label: 'Slice of Life' },
            { id: 'smut', label: 'Smut' },
            { id: 'sports', label: 'Sports' },
            { id: 'supernatural', label: 'Supernatural' },
            { id: 'tragedy', label: 'Tragedy' },
            { id: 'yaoi', label: 'Yaoi' },
            { id: 'yuri', label: 'Yuri' },
        ];
        const tagsList = tags.map((tag) => App.createTag({ id: tag.id, label: tag.label }));
        return [App.createTagSection({ id: 'genre', label: 'Thể Loại', tags: tagsList })];
    }
}
exports.Parser = Parser;

},{}]},{},[62])(62)
});
