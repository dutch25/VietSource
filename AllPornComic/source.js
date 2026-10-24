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
exports.AllPornComic = exports.AllPornComicInfo = void 0;
const types_1 = require("@paperback/types");
const AllPornComicParser_1 = require("./AllPornComicParser");
const AllPornComicSetting_1 = require("./AllPornComicSetting");
exports.AllPornComicInfo = {
    version: '1.0.0',
    name: 'AllPornComic',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for AllPornComic (allporncomic.com) - Adult Comics, 3D, Hentai & Manhwa',
    contentRating: types_1.ContentRating.ADULT,
    websiteBaseURL: AllPornComicSetting_1.DEFAULT_BASE_URL,
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
class AllPornComic extends types_1.Source {
    constructor() {
        super(...arguments);
        this.stateManager = App.createSourceStateManager();
        this.parser = new AllPornComicParser_1.AllPornComicParser();
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
        return await (0, AllPornComicSetting_1.getDomain)(this.stateManager);
    }
    async getSourceMenu() {
        return App.createDUISection({
            id: 'main',
            header: 'Cài đặt nguồn AllPornComic',
            rows: async () => [
                (0, AllPornComicSetting_1.domainSettings)(this.stateManager),
                (0, AllPornComicSetting_1.resetSettings)(this.stateManager),
            ],
            isHidden: false,
        });
    }
    getMangaShareUrl(mangaId) {
        return `${AllPornComicSetting_1.DEFAULT_BASE_URL}/porncomic/${mangaId}/`;
    }
    async DOMHTML(url) {
        const request = App.createRequest({ url, method: 'GET' });
        const response = await this.requestManager.schedule(request, 1);
        return this.cheerio.load(response.data);
    }
    async getHomePageSections(sectionCallback) {
        const baseUrl = await this.getBaseUrl();
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${baseUrl}/porncomic/?m_orderby=latest` },
            { id: 'trending', title: 'Xem Nhiều (Trending)', url: `${baseUrl}/porncomic/?m_orderby=views` },
            { id: 'rating', title: 'Đánh Giá Cao', url: `${baseUrl}/porncomic/?m_orderby=rating` },
            { id: '3d', title: '3D Comics', url: `${baseUrl}/porncomic-category/3dd/` },
            { id: 'manhwa', title: 'Manhwa 18+', url: `${baseUrl}/porncomic-category/manhwad/` },
            { id: 'hentai', title: 'Hentai Manga', url: `${baseUrl}/porncomic-category/hentaib/` },
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
        if (homepageSectionId === 'latest') {
            url = page === 1 ? `${baseUrl}/porncomic/?m_orderby=latest` : `${baseUrl}/porncomic/page/${page}/?m_orderby=latest`;
        }
        else if (homepageSectionId === 'trending') {
            url = page === 1 ? `${baseUrl}/porncomic/?m_orderby=views` : `${baseUrl}/porncomic/page/${page}/?m_orderby=views`;
        }
        else if (homepageSectionId === 'rating') {
            url = page === 1 ? `${baseUrl}/porncomic/?m_orderby=rating` : `${baseUrl}/porncomic/page/${page}/?m_orderby=rating`;
        }
        else if (homepageSectionId === '3d') {
            url = page === 1 ? `${baseUrl}/porncomic-category/3dd/` : `${baseUrl}/porncomic-category/3dd/page/${page}/`;
        }
        else if (homepageSectionId === 'manhwa') {
            url = page === 1 ? `${baseUrl}/porncomic-category/manhwad/` : `${baseUrl}/porncomic-category/manhwad/page/${page}/`;
        }
        else if (homepageSectionId === 'hentai') {
            url = page === 1 ? `${baseUrl}/porncomic-category/hentaib/` : `${baseUrl}/porncomic-category/hentaib/page/${page}/`;
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
                ? `${baseUrl}/?s=${cleanTitle}&post_type=wp-manga`
                : `${baseUrl}/page/${page}/?s=${cleanTitle}&post_type=wp-manga`;
        }
        else if (searchTag) {
            url = page === 1
                ? `${baseUrl}/porncomic-category/${searchTag.id}/`
                : `${baseUrl}/porncomic-category/${searchTag.id}/page/${page}/`;
        }
        else {
            url = page === 1
                ? `${baseUrl}/porncomic/?m_orderby=latest`
                : `${baseUrl}/porncomic/page/${page}/?m_orderby=latest`;
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
        const url = `${baseUrl}/porncomic/${mangaId}/`;
        const $ = await this.DOMHTML(url);
        return this.parser.parseMangaDetails($, mangaId, baseUrl);
    }
    async getChapters(mangaId) {
        const baseUrl = await this.getBaseUrl();
        const url = `${baseUrl}/porncomic/${mangaId}/`;
        const $ = await this.DOMHTML(url);
        return this.parser.parseChapters($, mangaId);
    }
    async getChapterDetails(mangaId, chapterId) {
        const baseUrl = await this.getBaseUrl();
        const url = `${baseUrl}/porncomic/${mangaId}/${chapterId}/`;
        const $ = await this.DOMHTML(url);
        return this.parser.parseChapterDetails($, mangaId, chapterId, baseUrl);
    }
}
exports.AllPornComic = AllPornComic;

},{"./AllPornComicParser":63,"./AllPornComicSetting":64,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllPornComicParser = void 0;
class AllPornComicParser {
    parseCards($, baseUrl) {
        const mangaList = [];
        const seenIds = new Set();
        $('.page-item-detail, .c-tabs-item__content, .manga-item').each((_, el) => {
            const linkEl = $(el).find('a[href*="/porncomic/"]').first();
            const href = linkEl.attr('href') || '';
            const match = href.match(/\/porncomic\/([^/?#]+)/);
            const mangaId = match ? match[1].trim() : '';
            if (!mangaId || seenIds.has(mangaId))
                return;
            seenIds.add(mangaId);
            let title = $(el).find('.post-title a, h3 a, h4 a, h5 a').first().text().replace(/\s+/g, ' ').trim();
            if (!title) {
                title = linkEl.attr('title')?.trim() || linkEl.text().trim() || '';
            }
            if (!title)
                return;
            let image = $(el).find('img').attr('data-src') ||
                $(el).find('img').attr('data-lazy-src') ||
                $(el).find('img').attr('src') || '';
            if (image.includes('dflazy')) {
                image = $(el).find('img').attr('data-src') || '';
            }
            if (image && !image.startsWith('http')) {
                image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
            }
            const chapter = $(el).find('.chapter-item, .list-chapter .chapter, .chapter').first().text().replace(/\s+/g, ' ').trim();
            mangaList.push(App.createPartialSourceManga({
                mangaId,
                image: image || `${baseUrl}/wp-content/uploads/2020/03/cropped-favicon-192x192.png`,
                title,
                subtitle: chapter || undefined,
            }));
        });
        return mangaList;
    }
    parseMangaDetails($, mangaId, baseUrl) {
        const title = $('.post-title h1, h1').first().text().trim() ||
            $('meta[property="og:title"]').attr('content') ||
            mangaId;
        let image = $('.summary_image img').attr('data-src') ||
            $('.summary_image img').attr('src') ||
            $('meta[property="og:image"]').attr('content') ||
            '';
        if (image.includes('dflazy')) {
            image = $('.summary_image img').attr('data-src') || '';
        }
        if (image && !image.startsWith('http')) {
            image = `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
        }
        const desc = $('.description-summary .summary__content, .description-summary, .manga-excerpt').first().text().trim() || 'No description available';
        const author = $('.author-content a, .artist-content a').first().text().trim() || 'Unknown';
        const statusText = $('.post-status .summary-content').first().text().trim().toLowerCase();
        const status = statusText.includes('completed') ? 'Hoàn thành' : 'Đang cập nhật';
        const tags = [];
        $('.genres-content a, a[href*="/porncomic-category/"]').each((_, el) => {
            const href = $(el).attr('href') || '';
            const match = href.match(/\/porncomic-category\/([^/?#]+)/);
            const tagId = match ? match[1] : href.replace(/.*?\/manga-genre\//, '').replace(/\/+$/, '').trim();
            const label = $(el).text().trim();
            if (tagId && label && !tags.some(t => t.id === tagId)) {
                tags.push({ id: tagId, label });
            }
        });
        const tagSections = [
            App.createTagSection({
                id: 'genres',
                label: 'Thể loại',
                tags: tags.map(t => App.createTag({ id: t.id, label: t.label })),
            }),
        ];
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image || `${baseUrl}/wp-content/uploads/2020/03/cropped-favicon-192x192.png`,
                desc,
                status,
                author,
                tags: tagSections,
            }),
        });
    }
    parseChapters($, mangaId) {
        const chapters = [];
        const seenIds = new Set();
        $('.wp-manga-chapter a').each((i, el) => {
            const rawHref = $(el).attr('href') || '';
            const match = rawHref.match(/\/porncomic\/[^\/]+\/([^\/]+)/);
            const chapId = match ? match[1].trim() : rawHref.replace(/.*?\/porncomic\//, '').replace(/\/+$/, '').trim();
            if (!chapId || seenIds.has(chapId))
                return;
            seenIds.add(chapId);
            const name = $(el).text().trim() || `Chapter ${i + 1}`;
            const numMatch = name.match(/(?:issue|chapter|chap|part|chương)\s*([0-9.]+)/i);
            const chapNum = numMatch ? parseFloat(numMatch[1]) : (i + 1);
            chapters.push(App.createChapter({
                id: chapId,
                name,
                chapNum,
                langCode: 'en',
                time: new Date(),
            }));
        });
        return chapters;
    }
    parseChapterDetails($, mangaId, chapterId, baseUrl) {
        const pages = [];
        $('.page-break img, .reading-content img').each((_, el) => {
            let src = $(el).attr('data-src') || $(el).attr('src') || '';
            src = src.trim();
            if (!src || src.includes('dflazy') || src.includes('logo'))
                return;
            if (src.startsWith('//')) {
                src = 'https:' + src;
            }
            else if (src.startsWith('/')) {
                src = `${baseUrl}${src}`;
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
    isLastPage($) {
        const hasNext = $('a.next, .nav-previous a, a[rel="next"]').length > 0;
        const itemCount = $('.page-item-detail, .c-tabs-item__content, .manga-item').length;
        if (!hasNext && itemCount < 24) {
            return true;
        }
        return false;
    }
    getSearchTags() {
        const tags = [
            { id: '3dd', label: '3D Comics' },
            { id: 'manhwad', label: 'Manhwa 18+' },
            { id: 'hentaib', label: 'Hentai Manga' },
            { id: 'westernh', label: 'Western Comics' },
            { id: 'big-breasts', label: 'Big Breasts' },
            { id: 'milfg', label: 'MILF' },
            { id: 'nakadashi', label: 'Nakadashi / Creampie' },
            { id: 'cheatinge', label: 'Cheating' },
            { id: 'netorarea', label: 'Netorare / Cuckold' },
            { id: 'groupb', label: 'Group' },
            { id: 'ahegao', label: 'Ahegao' },
            { id: 'analc', label: 'Anal' },
            { id: 'interracialb', label: 'Interracial' },
            { id: 'animeh', label: 'Anime' },
            { id: 'gamea', label: 'Game' },
            { id: 'cartoonc', label: 'Cartoon' },
            { id: 'furryb', label: 'Furry' },
            { id: 'yuric', label: 'Yuri / Lesbian' },
            { id: 'yaoib', label: 'Yaoi / Gay' },
            { id: 'indiane', label: 'Indian' },
            { id: 'retro', label: 'Retro' },
        ];
        return [
            App.createTagSection({
                id: 'categories',
                label: 'Thể loại',
                tags: tags.map(t => App.createTag({ id: t.id, label: t.label })),
            }),
        ];
    }
}
exports.AllPornComicParser = AllPornComicParser;

},{}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetSettings = exports.domainSettings = exports.getDomain = exports.DEFAULT_BASE_URL = void 0;
exports.DEFAULT_BASE_URL = 'https://allporncomic.com';
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
