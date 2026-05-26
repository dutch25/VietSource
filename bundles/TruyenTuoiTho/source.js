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
exports.TruyenTuoiTho = exports.TruyenTuoiThoInfo = void 0;
const types_1 = require("@paperback/types");
const TruyenTuoiThoParser_1 = require("./TruyenTuoiThoParser");
const BASE_URL = 'https://truyentuoitho.com';
const PROXY_URL = 'https://nhentai-club-proxy.feedandafk2018.workers.dev';
exports.TruyenTuoiThoInfo = {
    version: '1.1.4',
    name: 'TruyenTuoiTho',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for truyentuoitho.com (Madara Theme with Proxy Support)',
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
class TruyenTuoiTho extends types_1.Source {
    constructor() {
        super(...arguments);
        this.parser = new TruyenTuoiThoParser_1.Parser();
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 3,
            requestTimeout: 30000,
            interceptor: {
                interceptRequest: async (request) => {
                    request.headers = {
                        ...(request.headers ?? {}),
                        'referer': `${BASE_URL}/`,
                        'user-agent': await this.requestManager.getDefaultUserAgent(),
                    };
                    return request;
                },
                interceptResponse: async (response) => response,
            }
        });
    }
    async getCloudflareBypassRequestAsync() {
        return App.createRequest({
            url: BASE_URL,
            method: 'GET',
            headers: {
                'referer': `${BASE_URL}/`,
                'user-agent': await this.requestManager.getDefaultUserAgent(),
            }
        });
    }
    async fetchHTML(url, method = 'GET', data) {
        // 1. Try fetching via proxy worker first
        try {
            const proxyRequestUrl = `${PROXY_URL}/?url=${encodeURIComponent(url)}`;
            const response = await this.requestManager.schedule(App.createRequest({
                url: proxyRequestUrl,
                method,
                headers: {
                    'content-type': method === 'POST' ? 'application/x-www-form-urlencoded; charset=UTF-8' : undefined
                },
                data
            }), 0);
            if (response.status === 200) {
                const html = response.data;
                if (!html.includes('challenges.cloudflare.com') &&
                    !html.includes('cf-challenge') &&
                    !html.includes('<title>Just a moment...</title>') &&
                    !html.includes('id="challenge-error-title"')) {
                    return response;
                }
            }
        }
        catch (e) {
            // Silently fall back to direct request on error
        }
        // 2. Direct request fallback
        const response = await this.requestManager.schedule(App.createRequest({
            url,
            method,
            headers: {
                'content-type': method === 'POST' ? 'application/x-www-form-urlencoded; charset=UTF-8' : undefined
            },
            data
        }), 0);
        this.checkCloudflare(response);
        return response;
    }
    async getHomePageSections(sectionCallback) {
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${BASE_URL}/manga/?m_orderby=latest` },
            { id: 'views', title: 'Phổ Biến', url: `${BASE_URL}/manga/?m_orderby=views` },
            { id: 'new', title: 'Truyện Mới', url: `${BASE_URL}/manga/?m_orderby=new-manga` },
            { id: 'trending', title: 'Trending', url: `${BASE_URL}/manga/?m_orderby=trending` },
        ];
        for (const section of sections) {
            sectionCallback(App.createHomeSection({
                id: section.id,
                title: section.title,
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal,
            }));
        }
        for (const section of sections) {
            try {
                const response = await this.fetchHTML(section.url);
                const $ = this.cheerio.load(response.data);
                const manga = this.parser.parseHomePage($, PROXY_URL);
                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: manga,
                }));
            }
            catch (e) {
                // Silently ignore individual section failures to avoid breaking others
            }
        }
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const page = metadata?.page ?? 1;
        const urlMap = {
            'latest': `${BASE_URL}/manga/?m_orderby=latest&page=${page}`,
            'views': `${BASE_URL}/manga/?m_orderby=views&page=${page}`,
            'new': `${BASE_URL}/manga/?m_orderby=new-manga&page=${page}`,
            'trending': `${BASE_URL}/manga/?m_orderby=trending&page=${page}`,
        };
        const url = urlMap[homepageSectionId] ?? `${BASE_URL}/manga-genre/${homepageSectionId}?page=${page}`;
        const response = await this.fetchHTML(url);
        const $ = this.cheerio.load(response.data);
        const manga = this.parser.parseHomePage($, PROXY_URL);
        return App.createPagedResults({ results: manga, metadata: { page: page + 1 } });
    }
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 1;
        const selectedTag = query.includedTags?.[0];
        let url;
        if (selectedTag) {
            url = `${BASE_URL}/manga-genre/${selectedTag.id}/page/${page}/`;
        }
        else {
            const searchQuery = encodeURIComponent(query.title ?? '');
            url = `${BASE_URL}/page/${page}/?s=${searchQuery}&post_type=wp-manga`;
        }
        const response = await this.fetchHTML(url);
        const $ = this.cheerio.load(response.data);
        return App.createPagedResults({ results: this.parser.parseHomePage($, PROXY_URL), metadata: { page: page + 1 } });
    }
    async getMangaDetails(mangaId) {
        const response = await this.fetchHTML(`${BASE_URL}/manga/${mangaId}/`);
        const $ = this.cheerio.load(response.data);
        return this.parser.parseMangaDetails($, mangaId);
    }
    async getChapters(mangaId) {
        // 1. Try to fetch the AJAX chapters endpoint directly
        try {
            const ajaxResponse = await this.fetchHTML(`${BASE_URL}/manga/${mangaId}/ajax/chapters/`, 'POST');
            const ajaxHtml = ajaxResponse.data;
            const $ajax = this.cheerio.load(ajaxHtml);
            const chapters = this.parser.parseChapters($ajax, mangaId);
            if (chapters.length > 0) {
                return chapters;
            }
        }
        catch (e) {
            // Fail silently and fall back to fetching the main page HTML
        }
        // 2. Fallback: Fetch main page HTML and parse chapters
        const response = await this.fetchHTML(`${BASE_URL}/manga/${mangaId}/`);
        const $ = this.cheerio.load(response.data);
        return this.parser.parseChapters($, mangaId);
    }
    async getChapterDetails(mangaId, chapterId) {
        const response = await this.fetchHTML(`${BASE_URL}/manga/${mangaId}/${chapterId}/`);
        const $ = this.cheerio.load(response.data);
        const pages = this.parser.parseChapterPages($);
        if (pages.length === 0) {
            throw new Error(`No pages found for chapter ${chapterId}`);
        }
        // Apply proxy to all page image URLs
        const proxiedPages = pages.map(page => `${PROXY_URL}/?url=${encodeURIComponent(page)}`);
        return App.createChapterDetails({ id: chapterId, mangaId, pages: proxiedPages });
    }
    getMangaShareUrl(mangaId) {
        return `${BASE_URL}/manga/${mangaId}/`;
    }
    async getSearchTags() {
        return this.parser.getSearchTags();
    }
    checkCloudflare(response) {
        const status = response.status;
        const html = response.data;
        if (status === 403 ||
            status === 503 ||
            html.includes('challenges.cloudflare.com') ||
            html.includes('cf-challenge') ||
            html.includes('<title>Just a moment...</title>') ||
            html.includes('id="challenge-error-title"')) {
            throw new Error('CLOUDFLARE_BYPASS_REQUIRED');
        }
    }
}
exports.TruyenTuoiTho = TruyenTuoiTho;

},{"./TruyenTuoiThoParser":63,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    parseHomePage($, proxyUrl) {
        const results = [];
        $('.page-item-detail, .manga-item, .page-listing-item, .row.c-tabs-item__content').each((_, el) => {
            const thumbLink = $('.item-thumb a, .manga-thumb a, .tab-thumb a', el).first();
            const titleLink = $('.post-title h3 a, .post-title a, .manga-title a, .h5 a, .post-title a', el).first();
            const href = thumbLink.attr('href') ?? titleLink.attr('href') ?? '';
            let title = thumbLink.attr('title') ?? titleLink.text() ?? '';
            // Clean title if it has "Full" or extra descriptions
            if (title.includes(' Full')) {
                title = title.split(' Full')[0];
            }
            title = title.trim();
            if (!href || !title)
                return;
            const idMatch = href.match(/\/manga\/([^/]+)\/?$/);
            if (!idMatch)
                return;
            const id = idMatch[1].trim();
            if (!id)
                return;
            const img = $('.item-thumb img, .manga-thumb img, .tab-thumb img, img', el).first();
            const rawImage = img.attr('data-src') ?? img.attr('data-lazy-src') ?? img.attr('src') ?? '';
            if (!rawImage)
                return;
            const image = proxyUrl ? `${proxyUrl}/?url=${encodeURIComponent(rawImage)}` : rawImage;
            results.push(App.createPartialSourceManga({ mangaId: id, title, image }));
        });
        return this.deduplicate(results);
    }
    parseMangaDetails($, mangaId) {
        const title = $('meta[property="og:title"]').attr('content')?.trim()
            || $('.post-title h1').first().text().trim()
            || mangaId;
        const rawImage = $('meta[property="og:image"]').attr('content')?.trim()
            || $('.summary_image img').attr('src')
            || $('.summary_image img').attr('data-src')
            || '';
        const desc = $('meta[property="og:description"]').attr('content')?.trim()
            || $('.description-summary').text().trim()
            || $('.summary__content').text().trim()
            || '';
        const author = $('.author-content a').text().trim() || '';
        const artist = $('.artist-content a').text().trim() || '';
        const status = $('.post-status .summary-content').text().trim() || 'Ongoing';
        const genres = [];
        $('.genres-content a, .manga-genres a, .genres a, .genres-content a[href*="/manga-genre/"]').each((_, el) => {
            const href = $(el).attr('href') ?? '';
            const genreMatch = href.match(/\/manga-genre\/([^/]+)/) || href.match(/\/genre\/([^/]+)/);
            const genreId = genreMatch ? genreMatch[1].trim() : '';
            const label = $(el).text().trim();
            if (genreId && label) {
                genres.push(App.createTag({ id: genreId, label }));
            }
        });
        const tagSections = [];
        if (genres.length > 0) {
            tagSections.push(App.createTagSection({ id: 'genres', label: 'Thể Loại', tags: genres }));
        }
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: rawImage,
                desc,
                author,
                artist,
                status,
                tags: tagSections
            }),
        });
    }
    parseChapters($, mangaId) {
        const chapters = [];
        const seenUrls = new Set();
        // Scoping search to actual chapter containers to prevent grabbing sidebar links
        const container = $('.listing-chapters_wrap, #manga-chapters-holder, .version-chap');
        const target = container.length > 0 ? container.find('a') : $('.wp-manga-chapter a, .chapter-item a');
        target.each((_, el) => {
            const href = $(el).attr('href') ?? '';
            if (!href || seenUrls.has(href))
                return;
            // Filter out non-chapter anchor elements
            if (href === '#' || href.includes('javascript:void(0)'))
                return;
            seenUrls.add(href);
            const match = href.match(/\/manga\/[^/]+\/([^/]+)\/?$/);
            if (!match)
                return;
            const chapterId = match[1];
            const title = $(el).text().trim() || chapterId;
            let time = new Date();
            const parentEl = $(el).closest('li, .chapter-item, .wp-manga-chapter').first();
            if (parentEl.length) {
                const dateText = parentEl.find('.post-on, .chapter-release-date').first().text().trim();
                if (dateText) {
                    const parsed = new Date(dateText);
                    if (!isNaN(parsed.getTime())) {
                        time = parsed;
                    }
                }
            }
            chapters.push(App.createChapter({
                id: chapterId,
                chapNum: this.extractChapterNumber(chapterId),
                name: title,
                time: time,
            }));
        });
        return chapters.reverse();
    }
    extractChapterNumber(chapterId) {
        const numMatch = chapterId.match(/(\d+)/);
        if (numMatch) {
            return parseFloat(numMatch[1]);
        }
        return 0;
    }
    parseChapterPages($) {
        const pages = [];
        $('.reading-content img, .page-break img').each((_, el) => {
            const imgSrc = ($(el).attr('data-src') ?? $(el).attr('data-lazy-src') ?? $(el).attr('src') ?? '').trim();
            if (!imgSrc || imgSrc.includes('logo') || imgSrc.includes('data:image'))
                return;
            if (!pages.includes(imgSrc))
                pages.push(imgSrc);
        });
        return pages;
    }
    getSearchTags() {
        const genres = [
            ['action', 'Action'],
            ['adult', 'Adult'],
            ['adventure', 'Adventure'],
            ['anime', 'Anime'],
            ['comedy', 'Comedy'],
            ['comic', 'Comic'],
            ['cooking', 'Cooking'],
            ['drama', 'Drama'],
            ['fantasy', 'Fantasy'],
            ['harem', 'Harem'],
            ['historical', 'Historical'],
            ['horror', 'Horror'],
            ['josei', 'Josei'],
            ['live-action', 'Live action'],
            ['manga', 'Manga'],
            ['manhua', 'Manhua'],
            ['manhwa', 'Manhwa'],
            ['martial-arts', 'Martial Arts'],
            ['mature', 'Mature'],
            ['mecha', 'Mecha'],
            ['mystery', 'Mystery'],
            ['one-shot', 'One shot'],
            ['psychological', 'Psychological'],
            ['romance', 'Romance'],
            ['school-life', 'School Life'],
            ['sci-fi', 'Sci-fi'],
            ['seinen', 'Seinen'],
            ['shoujo', 'Shoujo'],
            ['shounen', 'Shounen'],
            ['slice-of-life', 'Slice of Life'],
            ['sports', 'Sports'],
            ['thieu-nhi', 'Thiếu Nhi'],
            ['detective', 'Trinh thám'],
            ['truyen-giay', 'truyện giấy'],
            ['truyen-hay', 'Truyện hay'],
            ['webtoon', 'Webtoon']
        ];
        const tags = genres.map(([id, label]) => App.createTag({ id, label }));
        return [App.createTagSection({ id: 'genre', label: 'Thể Loại', tags })];
    }
    deduplicate(items) {
        const seen = new Set();
        return items.filter(item => {
            if (seen.has(item.mangaId))
                return false;
            seen.add(item.mangaId);
            return true;
        });
    }
}
exports.Parser = Parser;

},{}]},{},[62])(62)
});
