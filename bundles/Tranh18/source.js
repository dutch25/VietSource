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
exports.Tranh18 = exports.Tranh18Info = void 0;
const types_1 = require("@paperback/types");
const Tranh18Parser_1 = require("./Tranh18Parser");
const Tranh18Setting_1 = require("./Tranh18Setting");
const PROXY_URL = 'https://nhentai-club-proxy.dutch25.workers.dev';
exports.Tranh18Info = {
    version: '1.0.5',
    name: 'Tranh18',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for Tranh18.cc (Truyện tranh Manhwa 18+ tiếng Việt)',
    contentRating: types_1.ContentRating.ADULT,
    websiteBaseURL: Tranh18Setting_1.DEFAULT_BASE_URL,
    sourceTags: [
        {
            text: 'Adult',
            type: types_1.BadgeColor.RED,
        },
        {
            text: '18+',
            type: types_1.BadgeColor.YELLOW,
        },
    ],
    intents: types_1.SourceIntents.MANGA_CHAPTERS |
        types_1.SourceIntents.HOMEPAGE_SECTIONS |
        types_1.SourceIntents.SETTINGS_UI |
        types_1.SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
};
class Tranh18 extends types_1.Source {
    constructor() {
        super(...arguments);
        this.stateManager = App.createSourceStateManager();
        this.parser = new Tranh18Parser_1.Tranh18Parser();
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 2,
            requestTimeout: 30000,
            interceptor: {
                interceptRequest: async (request) => {
                    const baseUrl = await this.getBaseUrl();
                    request.headers = {
                        ...(request.headers ?? {}),
                        'referer': `${baseUrl}/`,
                        'user-agent': await this.requestManager.getDefaultUserAgent(),
                    };
                    return request;
                },
                interceptResponse: async (response) => {
                    return response;
                },
            },
        });
    }
    async getBaseUrl() {
        return await (0, Tranh18Setting_1.getDomain)(this.stateManager);
    }
    async getSourceMenu() {
        return App.createDUISection({
            id: 'main',
            header: 'Cài đặt nguồn Tranh18',
            rows: async () => [
                (0, Tranh18Setting_1.domainSettings)(this.stateManager),
                (0, Tranh18Setting_1.resetSettings)(this.stateManager),
            ],
            isHidden: false,
        });
    }
    getMangaShareUrl(mangaId) {
        return `${Tranh18Setting_1.DEFAULT_BASE_URL}/comic/${mangaId}`;
    }
    CloudFlareError(status) {
        if (status === 503 || status === 403) {
            throw new Error(`CLOUDFLARE BYPASS ERROR:\nPlease go to home page ${exports.Tranh18Info.name} source and press the cloud icon.`);
        }
    }
    async getCloudflareBypassRequestAsync() {
        const baseUrl = await this.getBaseUrl();
        return App.createRequest({
            url: baseUrl,
            method: 'GET',
            headers: {
                'referer': `${baseUrl}/`,
                'user-agent': await this.requestManager.getDefaultUserAgent(),
            },
        });
    }
    async DOMHTML(url) {
        // 1. Try proxy worker first (bypasses ISP DPI and Cloudflare blocking)
        try {
            const proxyRequest = App.createRequest({
                url: `${PROXY_URL}/?url=${encodeURIComponent(url)}`,
                method: 'GET',
            });
            const proxyResponse = await this.requestManager.schedule(proxyRequest, 0);
            if (proxyResponse.status === 200 && proxyResponse.data) {
                const html = proxyResponse.data;
                if (!html.includes('challenges.cloudflare.com') && !html.includes('cf-challenge')) {
                    return this.cheerio.load(html);
                }
            }
        }
        catch (e) {
            // Silently fall back to direct request
        }
        // 2. Direct request fallback with retry
        let lastError;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const request = App.createRequest({ url, method: 'GET' });
                const response = await this.requestManager.schedule(request, 1);
                this.CloudFlareError(response.status);
                return this.cheerio.load(response.data);
            }
            catch (err) {
                lastError = err;
                if (attempt < 2) {
                    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
                }
            }
        }
        throw lastError;
    }
    async getHomePageSections(sectionCallback) {
        const baseUrl = await this.getBaseUrl();
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật' },
            { id: 'manhwa', title: 'Manhwa 18+' },
            { id: 'completed', title: 'Truyện Hoàn Thành' },
        ];
        for (const item of sections) {
            sectionCallback(App.createHomeSection({
                id: item.id,
                title: item.title,
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal,
            }));
        }
        try {
            const $home = await this.DOMHTML(baseUrl);
            // 1. Latest section
            const latestEl = $home('.index-title').first().nextUntil('.index-title, .box-header').find('.mh-item');
            const latestItems = this.parser.parseCardElements($home, latestEl.length > 0 ? latestEl : $home('.mh-item').slice(0, 15), baseUrl, PROXY_URL);
            sectionCallback(App.createHomeSection({
                id: 'latest',
                title: 'Mới Cập Nhật',
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal,
                items: latestItems,
            }));
            // 2. Manhwa / Hot section
            const hotHeader = $home('h2:contains("HOT"), h2:contains("Từ khóa HOT")').first().closest('.index-title, .box-header');
            const hotEl = hotHeader.nextUntil('.box-header, .index-title, footer').find('.mh-item');
            const hotItems = this.parser.parseCardElements($home, hotEl.length > 0 ? hotEl : $home('.mh-item').slice(15, 35), baseUrl, PROXY_URL);
            sectionCallback(App.createHomeSection({
                id: 'manhwa',
                title: 'Manhwa 18+',
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal,
                items: hotItems,
            }));
            // 3. Completed section
            const completedHeader = $home('h2:contains("Hoàn thành")').first().closest('.box-header, .index-title');
            const completedEl = completedHeader.nextUntil('.box-header, .index-title, footer').find('.mh-item');
            const completedItems = this.parser.parseCardElements($home, completedEl.length > 0 ? completedEl : $home('.mh-item').slice(35), baseUrl, PROXY_URL);
            sectionCallback(App.createHomeSection({
                id: 'completed',
                title: 'Truyện Hoàn Thành',
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal,
                items: completedItems,
            }));
        }
        catch (e) {
            console.error('[Tranh18 error loading homepage]:', e);
        }
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const page = metadata?.page ?? 1;
        const baseUrl = await this.getBaseUrl();
        let url = '';
        if (homepageSectionId === 'latest') {
            url = `${baseUrl}/update?page=${page}`;
        }
        else if (homepageSectionId === 'manhwa') {
            url = `${baseUrl}/tag/manhwa?page=${page}`;
        }
        else if (homepageSectionId === 'completed') {
            url = `${baseUrl}/completed?page=${page}`;
        }
        if (!url) {
            return App.createPagedResults({ results: [], metadata: undefined });
        }
        const $ = await this.DOMHTML(url);
        const manga = this.parser.parseCards($, baseUrl, PROXY_URL);
        const isLast = manga.length === 0 || this.parser.isLastPage($, page);
        return App.createPagedResults({
            results: manga,
            metadata: isLast ? undefined : { page: page + 1 },
        });
    }
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 1;
        const baseUrl = await this.getBaseUrl();
        let url = '';
        if (query.title && query.title.trim()) {
            url = `${baseUrl}/search?keyword=${encodeURIComponent(query.title.trim())}&page=${page}`;
        }
        else if (query.includedTags && query.includedTags.length > 0) {
            const tag = query.includedTags[0];
            if (tag.id.startsWith('artist:')) {
                const artistName = tag.id.replace(/^artist:/, '');
                url = `${baseUrl}/search?keyword=${encodeURIComponent(artistName)}&page=${page}`;
            }
            else if (tag.id.startsWith('author:')) {
                const authorId = tag.id.replace(/^author:/, '');
                url = `${baseUrl}/author/${encodeURIComponent(authorId)}?page=${page}`;
            }
            else {
                url = `${baseUrl}/comics?tag=${encodeURIComponent(tag.id)}&page=${page}`;
            }
        }
        else {
            url = `${baseUrl}/update?page=${page}`;
        }
        const $ = await this.DOMHTML(url);
        const manga = this.parser.parseCards($, baseUrl, PROXY_URL);
        const isLast = manga.length === 0 || this.parser.isLastPage($, page);
        return App.createPagedResults({
            results: manga,
            metadata: isLast ? undefined : { page: page + 1 },
        });
    }
    async getMangaDetails(mangaId) {
        const baseUrl = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${baseUrl}/comic/${mangaId}`);
        return this.parser.parseMangaDetails($, mangaId, baseUrl, PROXY_URL);
    }
    async getChapters(mangaId) {
        const baseUrl = await this.getBaseUrl();
        const $ = await this.DOMHTML(`${baseUrl}/comic/${mangaId}`);
        return this.parser.parseChapters($, mangaId);
    }
    async getChapterDetails(mangaId, chapterId) {
        const baseUrl = await this.getBaseUrl();
        const cleanId = chapterId.replace(/^\//, '');
        const $ = await this.DOMHTML(`${baseUrl}/${cleanId}`);
        return this.parser.parseChapterDetails($, mangaId, chapterId, baseUrl, PROXY_URL);
    }
    async getSearchTags() {
        return this.parser.getSearchTags();
    }
}
exports.Tranh18 = Tranh18;

},{"./Tranh18Parser":63,"./Tranh18Setting":64,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tranh18Parser = void 0;
class Tranh18Parser {
    parseCardElements($, elements, baseUrl, proxyUrl) {
        const mangaList = [];
        const seenIds = new Set();
        elements.each((_, el) => {
            const linkEl = $(el).find('a[href*="/comic/"]');
            const href = linkEl.attr('href') || '';
            const mangaId = href.replace(/.*?\/comic\//, '').replace(/\/+$/, '').trim();
            if (!mangaId || seenIds.has(mangaId))
                return;
            seenIds.add(mangaId);
            const title = $(el).find('.title a, h3 a, a.title, .title').first().text().trim();
            if (!title)
                return;
            const style = $(el).find('.mh-cover').attr('style') || '';
            const match = style.match(/url\(['"]?([^'")\s]+)['"]?\)/i);
            let image = match ? match[1] : '';
            if (!image) {
                image = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || '';
            }
            if (image && !image.startsWith('http')) {
                image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
            }
            if (proxyUrl && image && image.startsWith('http')) {
                image = `${proxyUrl}/?url=${encodeURIComponent(image)}`;
            }
            const subtitle = $(el).find('.chapter').text().trim().substring(0, 50);
            mangaList.push(App.createPartialSourceManga({
                mangaId,
                image: image || `${baseUrl}/static/images/favicon.ico`,
                title,
                subtitle: subtitle || undefined,
            }));
        });
        return mangaList;
    }
    parseCards($, baseUrl, proxyUrl) {
        return this.parseCardElements($, $('.mh-item'), baseUrl, proxyUrl);
    }
    parseMangaDetails($, mangaId, baseUrl, proxyUrl) {
        const rawTitle = $('h1').first().text().trim() ||
            $('meta[property="og:title"]').attr('content') ||
            mangaId;
        const title = rawTitle.replace(/\s*-\s*Truyện Tranh 18.*$/i, '').trim();
        let image = $('meta[property="og:image"]').attr('content') || '';
        if (!image) {
            const style = $('.mh-cover').attr('style') || '';
            const match = style.match(/url\(['"]?([^'")\s]+)['"]?\)/i);
            if (match)
                image = match[1];
        }
        if (image && !image.startsWith('http')) {
            image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
        }
        if (proxyUrl && image && image.startsWith('http')) {
            image = `${proxyUrl}/?url=${encodeURIComponent(image)}`;
        }
        const desc = $('meta[property="og:description"]').attr('content')?.trim() ||
            $('.detail-info, .desc, .content, .introduction').first().text().trim() ||
            'Không có mô tả';
        let author = 'Đang cập nhật';
        const jsonLdTags = [];
        // 1. Extract from Book JSON-LD schema
        $('script[type="application/ld+json"]').each((_, s) => {
            try {
                const data = JSON.parse($(s).html());
                if (data && data['@type'] === 'Book') {
                    if (data.author?.name && !/dang cap nhat|đang cập nhật/i.test(data.author.name)) {
                        author = data.author.name.trim();
                    }
                    if (Array.isArray(data.genre)) {
                        for (const g of data.genre) {
                            if (g && typeof g === 'string')
                                jsonLdTags.push(g.trim());
                        }
                    }
                    else if (typeof data.genre === 'string') {
                        jsonLdTags.push(data.genre.trim());
                    }
                    if (typeof data.keywords === 'string') {
                        for (const kw of data.keywords.split(',')) {
                            const trimmed = kw.trim();
                            if (trimmed && !/tranh18|truyen tranh 18/i.test(trimmed)) {
                                jsonLdTags.push(trimmed);
                            }
                        }
                    }
                }
            }
            catch (e) { }
        });
        // 2. Check DOM Author
        if (author === 'Đang cập nhật') {
            const authorText = $('.bd-author a').first().text().replace(/\s+/g, ' ').trim() ||
                $('.bd-author').first().text().replace(/Tác giả\s*:\s*/i, '').replace(/\s+/g, ' ').trim();
            if (authorText && !/dang cap nhat|đang cập nhật/i.test(authorText)) {
                author = authorText;
            }
        }
        // 3. Check bracket author in title (e.g. [Artist Name])
        if (author === 'Đang cập nhật') {
            const bracketMatch = rawTitle.match(/^\s*\[([^\]]+)\]/) || rawTitle.match(/^\s*\(([^)]+)\)/);
            if (bracketMatch && bracketMatch[1]) {
                const candidate = bracketMatch[1].trim();
                if (!/tới chap|full|truyện|chapter|chap/i.test(candidate)) {
                    author = candidate;
                }
            }
        }
        const fullText = $.text();
        const status = fullText.includes('Hoàn thành') ? 'Hoàn thành' : 'Đang cập nhật';
        const tags = [];
        const seen = new Set();
        const addTag = (id, label) => {
            const cleanId = id.trim();
            const cleanLabel = label.trim();
            if (cleanId && cleanLabel && !seen.has(cleanId.toLowerCase())) {
                seen.add(cleanId.toLowerCase());
                tags.push({ id: cleanId, label: cleanLabel });
            }
        };
        // 4. Collect tags from .bd-tags and links
        $('.bd-tags a, a[href*="/tag/"], a[href*="comics?tag="]').each((_, el) => {
            const href = $(el).attr('href') || '';
            let tagId = '';
            if (href.includes('/tag/')) {
                tagId = href.replace(/.*?\/tag\//, '').replace(/\/+$/, '').trim();
            }
            else if (href.includes('tag=')) {
                const m = href.match(/[?&]tag=([^&]+)/);
                tagId = m ? decodeURIComponent(m[1]) : '';
            }
            const label = $(el).text().trim();
            if (tagId && label && label.toLowerCase() !== 'từ khóa:') {
                addTag(tagId, label);
            }
        });
        // Collect tags from JSON-LD
        for (const g of jsonLdTags) {
            addTag(g.toLowerCase(), g);
        }
        // Collect genre from .bd-facts (e.g. Thể loại 18+)
        $('.bd-facts a, .bd-facts .bd-fact').each((_, el) => {
            const text = $(el).text().replace(/\s+/g, ' ').trim();
            if (text.includes('Thể loại')) {
                const val = $(el).find('b').text().trim() || text.replace(/Thể loại\s*/i, '').trim();
                if (val && val !== 'Thể loại') {
                    addTag(val.toLowerCase(), val);
                }
            }
        });
        const tagSections = [];
        if (author && author !== 'Đang cập nhật') {
            tagSections.push(App.createTagSection({
                id: 'artist',
                label: 'Tác giả',
                tags: [App.createTag({ id: `artist:${author}`, label: author })],
            }));
        }
        if (tags.length > 0) {
            tagSections.push(App.createTagSection({
                id: 'genres',
                label: 'Thể loại',
                tags: tags.map(t => App.createTag({ id: t.id, label: t.label })),
            }));
        }
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image || `${baseUrl}/static/images/favicon.ico`,
                desc,
                status,
                author,
                artist: author !== 'Đang cập nhật' ? author : undefined,
                tags: tagSections,
            }),
        });
    }
    parseChapters($, mangaId) {
        const chapters = [];
        const seenIds = new Set();
        $('#chapterlistload li a[href*="/chapter/"], .detail-list-select li a[href*="/chapter/"], a[href*="/chapter/"]').each((i, el) => {
            // Skip the "Đọc truyện" button at the top
            if ($(el).parent().hasClass('bottom') || $(el).text().trim() === 'Đọc truyện') {
                return;
            }
            const rawHref = $(el).attr('href') || '';
            const chapId = rawHref.replace(/^\//, '').trim();
            if (!chapId || seenIds.has(chapId))
                return;
            seenIds.add(chapId);
            const name = $(el).text().trim() || $(el).attr('title')?.trim() || `Chapter ${i + 1}`;
            const numMatch = name.match(/(?:chapter|chap|chương)\s*([0-9.]+)/i);
            const chapNum = numMatch ? parseFloat(numMatch[1]) : (i + 1);
            chapters.push(App.createChapter({
                id: chapId,
                name,
                chapNum,
                langCode: 'vi',
                time: new Date(),
            }));
        });
        // Ensure chronological or latest-first order as provided by website
        return chapters;
    }
    parseChapterDetails($, mangaId, chapterId, baseUrl, proxyUrl) {
        const pages = [];
        $('.comiclist img, .comicpage img, #content img, .comic-content img').each((_, el) => {
            let src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original') || '';
            src = src.trim();
            if (!src || src.includes('loading.gif') || src.includes('header-logo') || src.includes('mrtx.gif')) {
                return;
            }
            if (src.startsWith('//')) {
                src = 'https:' + src;
            }
            else if (src.startsWith('/')) {
                src = `${baseUrl}${src}`;
            }
            if (proxyUrl && src && src.startsWith('http')) {
                src = `${proxyUrl}/?url=${encodeURIComponent(src)}`;
            }
            if (!pages.includes(src)) {
                pages.push(src);
            }
        });
        return App.createChapterDetails({
            id: chapterId,
            mangaId,
            pages,
        });
    }
    isLastPage($, currentPage) {
        const lastPage = parseInt($('form.pg-jump').attr('data-last') || '0', 10);
        if (lastPage > 0 && currentPage >= lastPage) {
            return true;
        }
        const hasNext = $('a[rel="next"]').length > 0 || $('li.active + li a').length > 0;
        const itemCount = $('.mh-item').length;
        if (!hasNext && itemCount < 10) {
            return true;
        }
        return false;
    }
    getSearchTags() {
        return [
            App.createTagSection({
                id: 'genres',
                label: 'Thể loại',
                tags: [
                    App.createTag({ id: 'manhwa', label: 'Manhwa' }),
                    App.createTag({ id: '18+', label: '18+' }),
                    App.createTag({ id: 'adult', label: 'Adult' }),
                    App.createTag({ id: 'ahegao', label: 'Ahegao' }),
                    App.createTag({ id: 'anal', label: 'Anal' }),
                    App.createTag({ id: 'bdsm', label: 'BDSM' }),
                    App.createTag({ id: 'big-ass', label: 'Big Ass' }),
                    App.createTag({ id: 'big-boobs', label: 'Big Boobs' }),
                    App.createTag({ id: 'big-penis', label: 'Big Penis' }),
                    App.createTag({ id: 'blowjobs', label: 'BlowJobs' }),
                    App.createTag({ id: 'cheating', label: 'Cheating' }),
                    App.createTag({ id: 'choi-hai-lo', label: 'Chơi Hai Lỗ' }),
                    App.createTag({ id: 'comedy', label: 'Comedy' }),
                    App.createTag({ id: 'cosplay', label: 'Cosplay' }),
                    App.createTag({ id: 'cunnilingus', label: 'Cunnilingus' }),
                    App.createTag({ id: 'doujinshi', label: 'Doujinshi' }),
                    App.createTag({ id: 'drama', label: 'Drama' }),
                    App.createTag({ id: 'ecchi', label: 'Ecchi' }),
                    App.createTag({ id: 'elf', label: 'Elf' }),
                    App.createTag({ id: 'fantasy', label: 'Fantasy' }),
                    App.createTag({ id: 'femdom', label: 'Femdom' }),
                    App.createTag({ id: 'fingering', label: 'Fingering' }),
                    App.createTag({ id: 'footjob', label: 'Footjob' }),
                    App.createTag({ id: 'full-color', label: 'Full Color' }),
                    App.createTag({ id: 'furry', label: 'Furry' }),
                    App.createTag({ id: 'gangbang', label: 'GangBang' }),
                    App.createTag({ id: 'glasses', label: 'Glasses' }),
                    App.createTag({ id: 'group', label: 'Group' }),
                    App.createTag({ id: 'handjob', label: 'Handjob' }),
                    App.createTag({ id: 'harem', label: 'Harem' }),
                    App.createTag({ id: 'hentai', label: 'Hentai' }),
                    App.createTag({ id: 'housewife', label: 'Housewife' }),
                    App.createTag({ id: 'incest', label: 'Incest' }),
                    App.createTag({ id: 'isekai', label: 'Isekai' }),
                    App.createTag({ id: 'lang-man', label: 'Lãng Mạn' }),
                    App.createTag({ id: 'manga', label: 'Manga' }),
                    App.createTag({ id: 'manhua', label: 'Manhua' }),
                    App.createTag({ id: 'masturbation', label: 'Masturbation' }),
                    App.createTag({ id: 'mature', label: 'Mature' }),
                    App.createTag({ id: 'milf', label: 'Milf' }),
                    App.createTag({ id: 'mind-break', label: 'Mind Break' }),
                    App.createTag({ id: 'mind-control', label: 'Mind Control' }),
                    App.createTag({ id: 'mother', label: 'Mother' }),
                    App.createTag({ id: 'nakadashi', label: 'Nakadashi' }),
                    App.createTag({ id: 'netori', label: 'Netori' }),
                    App.createTag({ id: 'ntr', label: 'NTR' }),
                    App.createTag({ id: 'nu-sinh', label: 'Nữ Sinh' }),
                    App.createTag({ id: 'oneshot', label: 'Oneshot' }),
                    App.createTag({ id: 'paizuri', label: 'Paizuri' }),
                    App.createTag({ id: 'pantyhose', label: 'Pantyhose' }),
                    App.createTag({ id: 'pregnant', label: 'Pregnant' }),
                    App.createTag({ id: 'rape', label: 'Rape' }),
                    App.createTag({ id: 'romance', label: 'Romance' }),
                    App.createTag({ id: 'schoolgirl', label: 'SchoolGirl' }),
                    App.createTag({ id: 'sex-toys', label: 'Sex Toys' }),
                    App.createTag({ id: 'shota', label: 'Shota' }),
                    App.createTag({ id: 'sister', label: 'Sister' }),
                    App.createTag({ id: 'slave', label: 'Slave' }),
                    App.createTag({ id: 'small-boobs', label: 'Small Boobs' }),
                    App.createTag({ id: 'smut', label: 'Smut' }),
                    App.createTag({ id: 'stockings', label: 'Stockings' }),
                    App.createTag({ id: 'supernatural', label: 'Supernatural' }),
                    App.createTag({ id: 'swimsuit', label: 'Swimsuit' }),
                    App.createTag({ id: 'tentacles', label: 'Tentacles' }),
                    App.createTag({ id: 'truyen-khong-che', label: 'Truyện Không Che' }),
                    App.createTag({ id: 'truyen-mau', label: 'Truyện Màu' }),
                    App.createTag({ id: 'uncensored', label: 'Uncensored' }),
                    App.createTag({ id: 'vanilla', label: 'Vanilla' }),
                    App.createTag({ id: 'veu-to', label: 'Vếu To' }),
                    App.createTag({ id: 'virgin', label: 'Virgin' }),
                    App.createTag({ id: 'webtoon', label: 'Webtoon' }),
                    App.createTag({ id: 'x-ray', label: 'X-ray' }),
                    App.createTag({ id: 'yaoi', label: 'Yaoi' }),
                    App.createTag({ id: 'yuri', label: 'Yuri' }),
                ],
            }),
        ];
    }
}
exports.Tranh18Parser = Tranh18Parser;

},{}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetSettings = exports.domainSettings = exports.getDomain = exports.DEFAULT_BASE_URL = void 0;
exports.DEFAULT_BASE_URL = 'https://tranh18.cc';
const getDomain = async (stateManager) => {
    return await stateManager.retrieve('baseUrl') ?? exports.DEFAULT_BASE_URL;
};
exports.getDomain = getDomain;
const domainSettings = (stateManager) => {
    return App.createDUINavigationButton({
        id: 'domain_settings',
        label: 'Cài đặt nguồn',
        form: App.createDUIForm({
            sections: async () => [
                App.createDUISection({
                    isHidden: false,
                    id: 'content',
                    rows: async () => [
                        App.createDUIInputField({
                            id: 'baseUrl',
                            label: 'URL cơ sở (Domain)',
                            value: App.createDUIBinding({
                                get: async () => await (0, exports.getDomain)(stateManager),
                                set: async (value) => {
                                    const trimmed = value.trim().replace(/\/+$/, '');
                                    await stateManager.store('baseUrl', trimmed || exports.DEFAULT_BASE_URL);
                                },
                            }),
                        }),
                    ],
                }),
            ],
        }),
    });
};
exports.domainSettings = domainSettings;
function resetSettings(stateManager) {
    return App.createDUIButton({
        id: 'reset',
        label: 'Đặt lại mặc định',
        onTap: async () => {
            await stateManager.store('baseUrl', exports.DEFAULT_BASE_URL);
        },
    });
}
exports.resetSettings = resetSettings;

},{}]},{},[62])(62)
});
