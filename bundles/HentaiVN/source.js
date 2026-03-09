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
exports.HentaiVN = exports.HentaiVNInfo = void 0;
const types_1 = require("@paperback/types");
const HentaiVNParser_1 = require("./HentaiVNParser");
const BASE_URL = 'https://hentaivn.college';
const PROXY_URL = 'https://nhentai-club-proxy.feedandafk2018.workers.dev'; // Reuse proxy if images are blocked
exports.HentaiVNInfo = {
    version: '1.0.3',
    name: 'HentaiVN',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for HentaiVN (hentaivn.college)',
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
class HentaiVN extends types_1.Source {
    constructor() {
        super(...arguments);
        this.parser = new HentaiVNParser_1.Parser();
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 3,
            requestTimeout: 30000,
            interceptor: {
                interceptRequest: async (request) => {
                    request.headers = {
                        ...(request.headers ?? {}),
                        'referer': BASE_URL,
                        'user-agent': await this.requestManager.getDefaultUserAgent(),
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
    slugFromUrl(url) {
        return url.replace(/\/$/, '').split('/').pop() ?? url;
    }
    async fetchHTML(url) {
        const response = await this.requestManager.schedule(this.buildRequest(url), 0);
        return this.cheerio.load(response.data);
    }
    async getHomePageSections(sectionCallback) {
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: BASE_URL },
            { id: 'full', title: 'Truyện Full', url: `${BASE_URL}/tim-truyen?status=completed` },
            { id: 'top', title: 'Top View', url: `${BASE_URL}/tim-truyen?sort=view` },
        ];
        for (const section of sections) {
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal,
            }));
            const $ = await this.fetchHTML(section.url);
            const items = this.parser.parseHomePage($, PROXY_URL);
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal,
                items,
            }));
        }
    }
    async getMangaDetails(mangaId) {
        const url = `${BASE_URL}/truyen-hentai/${mangaId}`;
        const response = await this.requestManager.schedule(App.createRequest({ url, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        return this.parser.parseMangaDetails($, mangaId, PROXY_URL);
    }
    async getChapters(mangaId) {
        const url = `${BASE_URL}/truyen-hentai/${mangaId}`;
        const $ = await this.fetchHTML(url);
        return this.parser.parseChapters($, mangaId);
    }
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 1;
        const url = `${BASE_URL}/tim-truyen?keyword=${encodeURIComponent(query.title ?? '')}&page=${page}`;
        const $ = await this.fetchHTML(url);
        const manga = this.parser.parseHomePage($, PROXY_URL);
        const hasNextPage = $('a[rel="next"], .next, .page-next, .pagination next').length > 0;
        return App.createPagedResults({
            results: manga,
            metadata: hasNextPage ? { page: page + 1 } : undefined
        });
    }
    async getSearchTags() {
        return this.parser.getSearchTags();
    }
    async getChapterDetails(mangaId, chapterId) {
        const url = `${BASE_URL}/${chapterId}-doc-truyen-${mangaId}.html`;
        const $ = await this.fetchHTML(url);
        const pages = this.parser.parseChapterDetails($, chapterId, mangaId, PROXY_URL);
        return App.createChapterDetails({ id: chapterId, mangaId, pages });
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const page = metadata?.page ?? 1;
        let url;
        switch (homepageSectionId) {
            case 'latest':
                url = `${BASE_URL}/trang/${page}`;
                break;
            case 'full':
                url = `${BASE_URL}/truyen-full/trang/${page}`;
                break;
            case 'top':
                url = `${BASE_URL}/top-view/trang/${page}`;
                break;
            default:
                throw new Error(`Unknown section: ${homepageSectionId}`);
        }
        const $ = await this.fetchHTML(url);
        const items = this.parser.parseHomePage($, PROXY_URL);
        const hasNextPage = $('a[rel="next"], .next, .page-next').length > 0;
        return App.createPagedResults({
            results: items,
            metadata: hasNextPage ? { page: page + 1 } : undefined,
        });
    }
    getMangaShareUrl(mangaId) {
        return `${BASE_URL}/truyen-hentai/${mangaId}`;
    }
}
exports.HentaiVN = HentaiVN;

},{"./HentaiVNParser":63,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    constructor() {
        this.BASE_DOMAIN = 'hentaivn.college';
    }
    // ─── Home Page ─────────────────────────────────────────────────────────────
    parseHomePage($, proxyUrl) {
        const results = [];
        // Primary: .items-slide .owl-item .item (carousel on homepage)
        // Also check for .manga-vertical .item (list view)
        const selectors = [
            '.items-slide .owl-item .item',
            '.manga-vertical .item',
            '.comic-item',
            '.story-item'
        ];
        for (const selector of selectors) {
            $(selector).each((_, el) => {
                const $el = $(el);
                // Find manga link - pattern: /truyen-hentai/slug-id
                const titleLink = $el.find('a[href*="/truyen-hentai/"]').first();
                const href = titleLink.attr('href') || '';
                // Skip if no valid href
                if (!href || !href.includes('/truyen-hentai/'))
                    return;
                // Extract manga ID from URL pattern: /truyen-hentai/slug-12345
                // Store the full path (without domain) as ID so we can reconstruct the URL
                const pathMatch = href.match(/\/truyen-hentai\/([^-]+-[^/?#]+)/);
                let mangaId = '';
                if (pathMatch) {
                    mangaId = pathMatch[1]; // e.g., "tinh-duc-ngot-ngao-voi-nguoi-yeu-9"
                }
                else {
                    // Fallback: just use the numeric ID
                    const idMatch = href.match(/-(\d+)(?:\/|$|\?)/);
                    if (idMatch)
                        mangaId = idMatch[1];
                }
                if (!mangaId)
                    return;
                // Get title from img alt attribute
                const img = $el.find('img.lazy').first();
                let title = img.attr('alt') || titleLink.attr('title') || '';
                // Fallback to slide-caption title
                if (!title) {
                    title = $el.find('.slide-caption h3 a').text().trim();
                }
                if (!title)
                    return;
                // Get image - use data-original for lazy loaded images
                let image = img.attr('data-original') || img.attr('src') || '';
                if (!image)
                    return;
                // Add domain if relative URL
                if (!image.startsWith('http')) {
                    image = `https://www.${this.BASE_DOMAIN}${image.startsWith('/') ? '' : '/'}${image}`;
                }
                results.push(App.createPartialSourceManga({
                    mangaId: mangaId,
                    title,
                    image
                }));
            });
            if (results.length > 0)
                break;
        }
        console.log(`[HentaiVN] parseHomePage: Found ${results.length} items`);
        return results;
    }
    // ─── Manga Details ─────────────────────────────────────────────────────────
    parseMangaDetails($, mangaId, proxyUrl) {
        // Try multiple selectors for title
        const title = $('.page-info h1').text().trim() ||
            $('.manga-title').text().trim() ||
            $('h1.title').text().trim() ||
            $('meta[property="og:title"]').attr('content')?.trim() ||
            $('.itemcrumb.active span').text().trim() ||
            'Unknown Title';
        // Try multiple selectors for image
        let image = $('.col-image img').attr('src') ||
            $('.image-manga img').attr('src') ||
            $('meta[property="og:image"]').attr('content') ||
            $('.cover img').attr('src') ||
            $('.manga-cover img').attr('src') ||
            '';
        if (image && !image.startsWith('http')) {
            image = `https://hentaivn.college${image.startsWith('/') ? '' : '/'}${image}`;
        }
        if (image) {
            image = `${proxyUrl}?url=${encodeURIComponent(image)}`;
        }
        let author = 'Unknown';
        let status = 'Ongoing';
        // Try multiple selectors for author and status
        $('p, .info-item, .detail-info li').each((_, el) => {
            const text = $(el).text();
            if (text.includes('Tác giả') || text.includes('Author')) {
                author = $(el).find('a').text().trim() || text.replace(/Tác giả|Author|:/g, '').trim();
                if (!author || author === 'Unknown')
                    author = 'Unknown';
            }
            if (text.includes('Tình trạng') || text.includes('Status')) {
                const statusText = $(el).find('span').text().trim() || text.replace(/Tình trạng|Status|:/g, '').trim();
                if (statusText.toLowerCase().includes('đã hoàn thành') || statusText.toLowerCase().includes('completed') || statusText.toLowerCase().includes('full')) {
                    status = 'Completed';
                }
            }
        });
        const tags = [];
        // Try multiple selectors for genres/tags
        const tagSelectors = [
            'a[href*="tim-truyen/"]',
            'a[href*="/the-loai/"]',
            'a[href*="/genre/"]',
            '.genre a',
            '.tags a',
            '.taxonomy a'
        ];
        for (const selector of tagSelectors) {
            $(selector).each((_, el) => {
                const href = $(el).attr('href') || '';
                const label = $(el).text().trim();
                if (label && !label.includes('Tác giả') && !label.includes('Tình trạng')) {
                    const id = href.split('/').pop()?.replace(/\?.*$/, '') || label.toLowerCase().replace(/\s+/g, '-');
                    tags.push(App.createTag({ id, label }));
                }
            });
            if (tags.length > 0)
                break;
        }
        const desc = $('.detail-content').text().trim() ||
            $('.summary').text().trim() ||
            $('.description').text().trim() ||
            $('meta[property="og:description"]').attr('content')?.trim() ||
            '';
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image,
                status: status === 'Completed' ? 'completed' : 'ongoing',
                author: author,
                desc: desc,
                tags: [App.createTagSection({ id: '0', label: 'genres', tags: tags })],
            })
        });
    }
    // ─── Chapters ─────────────────────────────────────────────────────────────
    parseChapters($, mangaId) {
        const chapters = [];
        // Try multiple selectors for chapter list
        const selectors = [
            '.list-chapter a',
            'a[href*="-doc-truyen-"]',
            'a[href*="-xem-truyen-"]',
            '.chapter-list a',
            '.chapters a',
            '.episode-list a',
            'ul.chapters li a',
            '.chapter-item a'
        ];
        for (const selector of selectors) {
            $(selector).each((_, el) => {
                const href = $(el).attr('href') || '';
                const title = $(el).text().trim() || 'Chapter';
                // Skip if no href
                if (!href)
                    return;
                // Extract chapter ID from URL
                // Pattern: /12345-60558-xem-truyen-name.html or /manga-id/chapter-id
                let id = '';
                // Match: 12345-60558-xem-truyen -> chapter ID is 60558
                const xemMatch = href.match(/-(\d+)-xem-truyen/);
                // Match: /12345-doc-truyen -> manga ID from doc (but we need chapter)
                const docMatch = href.match(/\/(\d+)-doc-truyen/);
                if (xemMatch) {
                    id = xemMatch[1];
                }
                else if (docMatch) {
                    // Use the full path minus domain as ID
                    id = href.replace(/https?:\/\/hentaivn\.college/, '').replace(/^\//, '').replace(/\.html$/, '');
                }
                else {
                    // Use the path as is
                    id = href.replace(/https?:\/\/hentaivn\.college/, '').replace(/^\//, '').replace(/\.html$/, '');
                }
                if (!id)
                    return;
                // Try to extract chapter number
                const numMatch = title.match(/chapter\s*(\d+)/i) || title.match(/ch\.?\s*(\d+)/i) || title.match(/(\d+)/);
                const chapNum = numMatch ? parseFloat(numMatch[1]) : chapters.length + 1;
                // Try to get date
                let time = new Date();
                const dateText = $(el).parent().find('.time, .date, .chapter-date').text().trim();
                if (dateText) {
                    const parsed = new Date(dateText);
                    if (!isNaN(parsed.getTime()))
                        time = parsed;
                }
                chapters.push(App.createChapter({
                    id: id,
                    name: title,
                    chapNum,
                    time,
                    langCode: 'vi'
                }));
            });
            if (chapters.length > 0)
                break;
        }
        // Reverse to show newest first
        return chapters.reverse();
    }
    // ─── Pages ────────────────────────────────────────────────────────────────
    parseChapterDetails($, chapterId, mangaId, proxyUrl) {
        const pages = [];
        // HentaiVN typically has images in .page-image img or similar selectors
        // Common patterns: .page-image img, #page img, .content img
        const selectors = [
            '.page-image img',
            '#page img',
            '.content img',
            '.chapter-content img',
            'div[data-index] img',
            'img[src*="hentaivn"]',
            'img.chapter-img'
        ];
        for (const selector of selectors) {
            $(selector).each((_, el) => {
                let src = $(el).attr('data-src') || $(el).attr('src') || '';
                if (src && !src.startsWith('data:') && src.includes('.')) {
                    src = `${proxyUrl}?url=${encodeURIComponent(src)}`;
                    if (!pages.includes(src)) {
                        pages.push(src);
                    }
                }
            });
            if (pages.length > 0)
                break;
        }
        // Fallback: try to find all images with numeric src patterns
        if (pages.length === 0) {
            $('img').each((_, el) => {
                let src = $(el).attr('data-src') || $(el).attr('src') || '';
                if (src && !src.startsWith('data:') && (src.match(/\.(jpg|jpeg|png|gif|webp)/i) || src.match(/\/\d+\//))) {
                    src = `${proxyUrl}?url=${encodeURIComponent(src)}`;
                    if (!pages.includes(src)) {
                        pages.push(src);
                    }
                }
            });
        }
        return pages;
    }
    // ─── Search Tags ──────────────────────────────────────────────────────────
    getSearchTags() {
        const tags = [
            { id: 'action', label: 'Hành Động' },
            { id: 'adventure', label: 'Phiêu Lưu' },
            { id: 'comedy', label: 'Hài Hước' },
            { id: 'doujinshi', label: 'Doujinshi' },
            { id: 'drama', label: 'Drama' },
            { id: 'ecchi', label: 'Ecchi' },
            { id: 'fantasy', label: 'Fantasy' },
            { id: 'gender-bender', label: 'Gender Bender' },
            { id: 'harem', label: 'Harem' },
            { id: 'historical', label: 'Lịch Sử' },
            { id: 'horror', label: 'Kinh Dị' },
            { id: 'joshi', label: 'Joshi' },
            { id: 'lolicon', label: 'Lolicon' },
            { id: 'manga', label: 'Manga' },
            { id: 'manhwa', label: 'Manhwa' },
            { id: 'martial-arts', label: 'Võ Thuật' },
            { id: 'mature', label: 'Mature' },
            { id: 'mecha', label: 'Mecha' },
            { id: 'mystery', label: ' Bí Ẩn' },
            { id: 'netorare', label: 'Netorare' },
            { id: 'ntr', label: 'NTR' },
            { id: 'psychological', label: 'Tâm Lý' },
            { id: 'romance', label: 'Lãng Mạn' },
            { id: 'school-life', label: 'School Life' },
            { id: 'sci-fi', label: 'Khoa Học' },
            { id: 'seinen', label: 'Seinen' },
            { id: 'shoujo', label: 'Shoujo' },
            { id: 'shounen', label: 'Shounen' },
            { id: 'slice-of-life', label: 'Đời Thường' },
            { id: 'smut', label: 'Smut' },
            { id: 'sports', label: 'Thể Thao' },
            { id: 'supernatural', label: 'Siêu Nhiên' },
            { id: 'tragedy', label: 'Bi Kịch' },
            { id: 'yaoi', label: 'Yaoi' },
            { id: 'yuri', label: 'Yuri' },
        ];
        return [App.createTagSection({ id: '0', label: 'Thể Loại', tags })];
    }
}
exports.Parser = Parser;

},{}]},{},[62])(62)
});
