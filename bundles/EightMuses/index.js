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
exports.EightMuses = exports.EightMusesInfo = void 0;
const types_1 = require("@paperback/types");
const EightMusesParser_1 = require("./EightMusesParser");
const EightMusesSetting_1 = require("./EightMusesSetting");
exports.EightMusesInfo = {
    version: '1.0.1',
    name: 'EightMuses',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for EightMuses (8muses.io) - Free Adult Comics, 3D Cartoons & Manga',
    contentRating: types_1.ContentRating.ADULT,
    websiteBaseURL: EightMusesSetting_1.DEFAULT_BASE_URL,
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
        types_1.SourceIntents.SETTINGS_UI,
};
class EightMuses extends types_1.Source {
    constructor() {
        super(...arguments);
        this.stateManager = App.createSourceStateManager();
        this.parser = new EightMusesParser_1.EightMusesParser();
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 3,
            requestTimeout: 25000,
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
        return await (0, EightMusesSetting_1.getDomain)(this.stateManager);
    }
    async getSourceMenu() {
        return App.createDUISection({
            id: 'main',
            header: 'Cài đặt nguồn EightMuses',
            rows: async () => [
                (0, EightMusesSetting_1.domainSettings)(this.stateManager),
                (0, EightMusesSetting_1.resetSettings)(this.stateManager),
            ],
            isHidden: false,
        });
    }
    getMangaShareUrl(mangaId) {
        return `${EightMusesSetting_1.DEFAULT_BASE_URL}/g/${mangaId}`;
    }
    async DOMHTML(url) {
        const request = App.createRequest({ url, method: 'GET' });
        const response = await this.requestManager.schedule(request, 1);
        return this.cheerio.load(response.data);
    }
    async getHomePageSections(sectionCallback) {
        const baseUrl = await this.getBaseUrl();
        const sections = [
            { id: 'popular', title: 'Xem Nhiều (Popular)', url: `${baseUrl}/popular` },
            { id: 'new', title: 'Mới Nhất (New Uploads)', url: `${baseUrl}/new` },
            { id: 'uncensored', title: 'Uncensored Manga', url: `${baseUrl}/tag/uncensored` },
            { id: 'hentai_en', title: 'Hentai & Manga English', url: `${baseUrl}/collection/hentai-and-manga-english-42635` },
            { id: 'fakku', title: 'Fakku Comics', url: `${baseUrl}/collection/fakku-comics-32996` },
            { id: 'anal', title: 'Top Anal', url: `${baseUrl}/search?tag=anal&sort=popular` },
        ];
        for (const item of sections) {
            sectionCallback(App.createHomeSection({
                id: item.id,
                title: item.title,
                containsMoreItems: true,
                type: types_1.HomeSectionType.singleRowNormal,
            }));
        }
        for (const item of sections) {
            try {
                const $ = await this.DOMHTML(item.url);
                const manga = this.parser.parseCards($, baseUrl);
                sectionCallback(App.createHomeSection({
                    id: item.id,
                    title: item.title,
                    containsMoreItems: true,
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: manga,
                }));
            }
            catch (e) {
                sectionCallback(App.createHomeSection({
                    id: item.id,
                    title: item.title,
                    containsMoreItems: true,
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: [],
                }));
            }
        }
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const page = metadata?.page ?? 1;
        const baseUrl = await this.getBaseUrl();
        let url = '';
        if (homepageSectionId === 'popular') {
            url = page === 1 ? `${baseUrl}/popular` : `${baseUrl}/popular/page/${page}`;
        }
        else if (homepageSectionId === 'new') {
            url = page === 1 ? `${baseUrl}/new` : `${baseUrl}/new/page/${page}`;
        }
        else if (homepageSectionId === 'uncensored') {
            url = page === 1 ? `${baseUrl}/tag/uncensored` : `${baseUrl}/tag/uncensored/page/${page}`;
        }
        else if (homepageSectionId === 'hentai_en') {
            url = page === 1 ? `${baseUrl}/collection/hentai-and-manga-english-42635` : `${baseUrl}/collection/hentai-and-manga-english-42635/page/${page}`;
        }
        else if (homepageSectionId === 'fakku') {
            url = page === 1 ? `${baseUrl}/collection/fakku-comics-32996` : `${baseUrl}/collection/fakku-comics-32996/page/${page}`;
        }
        else if (homepageSectionId === 'anal') {
            url = page === 1 ? `${baseUrl}/search?tag=anal&sort=popular` : `${baseUrl}/search/page/${page}?tag=anal&sort=popular`;
        }
        if (!url) {
            return App.createPagedResults({ results: [], metadata: undefined });
        }
        const $ = await this.DOMHTML(url);
        const manga = this.parser.parseCards($, baseUrl);
        const isLastPage = this.parser.isLastPage($);
        return App.createPagedResults({
            results: manga,
            metadata: isLastPage ? undefined : { page: page + 1 },
        });
    }
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 1;
        const baseUrl = await this.getBaseUrl();
        let url = '';
        const searchTag = query.includedTags?.find(tag => tag.id);
        if (query.title) {
            const cleanTitle = encodeURIComponent(query.title.trim());
            url = page === 1
                ? `${baseUrl}/search?q=${cleanTitle}`
                : `${baseUrl}/search/page/${page}?q=${cleanTitle}`;
        }
        else if (searchTag) {
            if (searchTag.id.startsWith('collection/')) {
                url = page === 1
                    ? `${baseUrl}/${searchTag.id}`
                    : `${baseUrl}/${searchTag.id}/page/${page}`;
            }
            else {
                url = page === 1
                    ? `${baseUrl}/tag/${searchTag.id}`
                    : `${baseUrl}/tag/${searchTag.id}/page/${page}`;
            }
        }
        else {
            url = page === 1 ? `${baseUrl}/popular` : `${baseUrl}/popular/page/${page}`;
        }
        const $ = await this.DOMHTML(url);
        const manga = this.parser.parseCards($, baseUrl);
        const isLastPage = this.parser.isLastPage($);
        return App.createPagedResults({
            results: manga,
            metadata: isLastPage ? undefined : { page: page + 1 },
        });
    }
    async getSearchTags() {
        return this.parser.getSearchTags();
    }
    async getMangaDetails(mangaId) {
        const baseUrl = await this.getBaseUrl();
        const url = `${baseUrl}/g/${mangaId}`;
        const $ = await this.DOMHTML(url);
        return this.parser.parseMangaDetails($, mangaId, baseUrl);
    }
    async getChapters(mangaId) {
        const baseUrl = await this.getBaseUrl();
        const url = `${baseUrl}/g/${mangaId}`;
        const $ = await this.DOMHTML(url);
        return this.parser.parseChapters($, mangaId);
    }
    async getChapterDetails(mangaId, chapterId) {
        const baseUrl = await this.getBaseUrl();
        const url = `${baseUrl}/g/${mangaId}`;
        const request = App.createRequest({ url, method: 'GET' });
        const response = await this.requestManager.schedule(request, 1);
        const rawHtml = response.data;
        return this.parser.parseChapterDetails(mangaId, chapterId, rawHtml, baseUrl);
    }
}
exports.EightMuses = EightMuses;

},{"./EightMusesParser":63,"./EightMusesSetting":64,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EightMusesParser = void 0;
class EightMusesParser {
    parseCards($, baseUrl) {
        const mangaList = [];
        const seenIds = new Set();
        $('a[href^="/g/"]').each((_, el) => {
            const href = $(el).attr('href') || '';
            const mangaId = href.replace(/^\/g\//, '').replace(/\/+$/, '').trim();
            if (!mangaId || seenIds.has(mangaId))
                return;
            seenIds.add(mangaId);
            let title = $(el).find('strong').first().text().trim();
            if (!title) {
                title = $(el).find('img').attr('alt') || $(el).text().replace(/\s+/g, ' ').trim();
            }
            if (!title)
                return;
            let image = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || '';
            if (image && !image.startsWith('http')) {
                image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
            }
            if (!image)
                return;
            const badge = $(el).find('.cover__mark, .cover__label').text().trim();
            mangaList.push(App.createPartialSourceManga({
                mangaId,
                image,
                title,
                subtitle: badge || undefined,
            }));
        });
        return mangaList;
    }
    parseMangaDetails($, mangaId, baseUrl) {
        const title = $('h1').first().text().trim() ||
            $('meta[property="og:title"]').attr('content') ||
            $('title').text().replace(/· 8Muse.*$/i, '').trim() ||
            mangaId;
        let image = $('meta[property="og:image"]').attr('content') ||
            $('img').first().attr('src') ||
            '';
        if (image && !image.startsWith('http')) {
            image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
        }
        const desc = $('.description, .summary').first().text().trim() || 'No description available';
        const author = $('a[href*="/artists/"]').first().text().trim() || 'Unknown';
        const tags = [];
        $('a[href*="/genres/"], a[href*="/collections/"]').each((_, el) => {
            const href = $(el).attr('href') || '';
            const tagId = href.replace(/^\//, '').replace(/\/+$/, '').trim();
            const label = $(el).text().trim();
            if (tagId && label && !tags.some(t => t.id === tagId)) {
                tags.push({ id: tagId, label });
            }
        });
        const tagSections = [
            App.createTagSection({
                id: 'genres',
                label: 'Genres',
                tags: tags.map(t => App.createTag({ id: t.id, label: t.label })),
            }),
        ];
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image || `${baseUrl}/icon-192.png`,
                desc,
                status: 'Hoàn thành',
                author,
                tags: tagSections,
            }),
        });
    }
    parseChapters($, mangaId) {
        return [
            App.createChapter({
                id: mangaId,
                name: 'Full Comic',
                chapNum: 1,
                langCode: 'en',
                time: new Date(),
            }),
        ];
    }
    parseChapterDetails(mangaId, chapterId, rawHtml, baseUrl) {
        const match = rawHtml.match(/([0-9]+)\s*pages/i);
        const totalPages = match ? parseInt(match[1], 10) : 1;
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(`${baseUrl}/api/legacy-media/${chapterId}/${i}`);
        }
        return App.createChapterDetails({
            id: chapterId,
            mangaId,
            pages,
        });
    }
    isLastPage($) {
        const hasNext = $('.catalog-pagination a:contains("Next")').length > 0;
        const itemCount = $('a[href^="/g/"]').length;
        if (!hasNext && itemCount < 10) {
            return true;
        }
        return false;
    }
    getSearchTags() {
        return [
            App.createTagSection({
                id: 'collections',
                label: 'Collections',
                tags: [
                    App.createTag({ id: 'collection/hentai-and-manga-english-42635', label: 'Hentai and Manga English' }),
                    App.createTag({ id: 'collection/fakku-comics-32996', label: 'Fakku Comics' }),
                    App.createTag({ id: 'collection/affect3d-comics-146084', label: 'Affect3D Comics' }),
                    App.createTag({ id: 'collection/renderotica-comics-87107', label: 'Renderotica Comics' }),
                    App.createTag({ id: 'collection/fansadox-comics-333415', label: 'Fansadox Comics' }),
                    App.createTag({ id: 'collection/various-authors-1', label: 'Various Authors' }),
                ],
            }),
            App.createTagSection({
                id: 'genres',
                label: 'Tags & Genres',
                tags: [
                    App.createTag({ id: 'uncensored', label: 'Uncensored' }),
                    App.createTag({ id: '3d', label: '3D' }),
                    App.createTag({ id: 'big-tits', label: 'Big Tits' }),
                    App.createTag({ id: 'milf', label: 'Milf' }),
                    App.createTag({ id: 'incest', label: 'Incest' }),
                    App.createTag({ id: 'cheating', label: 'Cheating' }),
                    App.createTag({ id: 'harem', label: 'Harem' }),
                    App.createTag({ id: 'anal', label: 'Anal' }),
                    App.createTag({ id: 'blowjob', label: 'Blowjob' }),
                    App.createTag({ id: 'creampie', label: 'Creampie' }),
                ],
            }),
        ];
    }
}
exports.EightMusesParser = EightMusesParser;

},{}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetSettings = exports.domainSettings = exports.getDomain = exports.DEFAULT_BASE_URL = void 0;
exports.DEFAULT_BASE_URL = 'https://8muses.io';
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
