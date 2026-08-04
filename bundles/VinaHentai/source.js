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
exports.VinaHentai = exports.VinaHentaiInfo = void 0;
const types_1 = require("@paperback/types");
const VinaHentaiParser_1 = require("./VinaHentaiParser");
const BASE_URL = 'https://vinahentai.one';
exports.VinaHentaiInfo = {
    version: '1.1.17',
    name: 'VinaHentai',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for VinaHentai',
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
class VinaHentai extends types_1.Source {
    constructor() {
        super(...arguments);
        this.parser = new VinaHentaiParser_1.Parser();
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
                interceptResponse: async (response) => response,
            }
        });
    }
    async getCloudflareBypassRequestAsync() {
        return App.createRequest({
            url: BASE_URL,
            method: 'GET',
            headers: {
                'referer': BASE_URL,
                'user-agent': await this.requestManager.getDefaultUserAgent(),
            }
        });
    }
    async getHomePageSections(sectionCallback) {
        const sections = [
            { id: 'hot', title: 'Truyện HOT', url: `${BASE_URL}` },
            { id: 'latest', title: 'Truyện Hentai Mới', url: `${BASE_URL}` },
            { id: 'week', title: 'Top Tuần', url: `${BASE_URL}/leaderboard/manga?period=weekly` },
            { id: 'month', title: 'Top Tháng', url: `${BASE_URL}/leaderboard/manga?period=monthly` },
            { id: 'private', title: 'Bộ Sưu Tập Riêng', url: `${BASE_URL}/genres/anal` },
            { id: 'private2', title: 'Bộ Sưu Tập Riêng 2', url: `${BASE_URL}/genres/anal` },
            { id: 'private3', title: 'Bộ Sưu Tập Riêng 3', url: `${BASE_URL}/genres/anal` },
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
                let manga = [];
                if (section.id === 'private' || section.id === 'private2' || section.id === 'private3') {
                    const sortParam = section.id === 'private2' ? '&sort=viewNumber' : section.id === 'private3' ? '&sort=likeNumber' : '';
                    try {
                        const response = await this.requestManager.schedule(App.createRequest({ url: `${BASE_URL}/search/advanced?apply=1&excludeGenres=yaoi%2Ctrap%2Cfutanari%2Cfurry&includeGenres=anal%2Ckhong-che&page=1${sortParam}`, method: 'GET' }), 0);
                        if (response.status === 200) {
                            const $ = this.cheerio.load(response.data);
                            manga = this.parser.parseHomePage($);
                        }
                    }
                    catch (e) { }
                    if (manga.length === 0)
                        continue;
                }
                else {
                    const response = await this.requestManager.schedule(App.createRequest({ url: section.url, method: 'GET' }), 0);
                    if (response.status === 403 || response.status === 503)
                        continue;
                    const $ = this.cheerio.load(response.data);
                    if (section.id === 'hot') {
                        manga = this.parser.parseSection($, 'hot');
                    }
                    else if (section.id === 'latest') {
                        manga = this.parser.parseSection($, 'mới');
                    }
                    else {
                        manga = this.parser.parseHomePage($);
                    }
                }
                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: manga,
                }));
            }
            catch (e) {
            }
        }
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const page = metadata?.page ?? 1;
        let url = `${BASE_URL}/danh-sach?page=${page}`;
        if (homepageSectionId === 'private' || homepageSectionId === 'private2' || homepageSectionId === 'private3') {
            const sortParam = homepageSectionId === 'private2' ? '&sort=viewNumber' : homepageSectionId === 'private3' ? '&sort=likeNumber' : '';
            try {
                const response = await this.requestManager.schedule(App.createRequest({ url: `${BASE_URL}/search/advanced?apply=1&excludeGenres=yaoi%2Ctrap%2Cfutanari%2Cfurry&includeGenres=anal%2Ckhong-che&page=${page}${sortParam}`, method: 'GET' }), 0);
                if (response.status === 200) {
                    const $ = this.cheerio.load(response.data);
                    const manga = this.parser.parseHomePage($);
                    return App.createPagedResults({ results: manga, metadata: { page: page + 1 } });
                }
            }
            catch (e) { }
            return App.createPagedResults({ results: [], metadata: undefined });
        }
        if (homepageSectionId === 'week') {
            url = `${BASE_URL}/leaderboard/manga?period=weekly&page=${page}`;
        }
        else if (homepageSectionId === 'month') {
            url = `${BASE_URL}/leaderboard/manga?period=monthly&page=${page}`;
        }
        const response = await this.requestManager.schedule(App.createRequest({ url, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        const manga = this.parser.parseHomePage($);
        const isLast = manga.length === 0 || this.parser.isLastPage($, page);
        return App.createPagedResults({ results: manga, metadata: isLast ? undefined : { page: page + 1 } });
    }
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 1;
        const selectedTag = query.includedTags?.[0];
        let url;
        if (selectedTag) {
            if (selectedTag.id.startsWith('author:')) {
                const authorId = selectedTag.id.replace('author:', '');
                url = `${BASE_URL}/authors/${authorId}?page=${page}`;
            }
            else {
                url = `${BASE_URL}/genres/${selectedTag.id}?page=${page}`;
            }
        }
        else {
            const searchQuery = encodeURIComponent(query.title ?? '');
            url = `${BASE_URL}/search?q=${searchQuery}&page=${page}`;
        }
        const response = await this.requestManager.schedule(App.createRequest({ url, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        const manga = this.parser.parseHomePage($);
        const isLast = manga.length === 0 || this.parser.isLastPage($, page);
        return App.createPagedResults({ results: manga, metadata: isLast ? undefined : { page: page + 1 } });
    }
    async getMangaDetails(mangaId) {
        const response = await this.requestManager.schedule(App.createRequest({ url: `${BASE_URL}/truyen-hentai/${mangaId}`, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        return this.parser.parseMangaDetails($, mangaId);
    }
    async getChapters(mangaId) {
        const response = await this.requestManager.schedule(App.createRequest({ url: `${BASE_URL}/truyen-hentai/${mangaId}`, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        return this.parser.parseChapters($);
    }
    async getChapterDetails(mangaId, chapterId) {
        const response = await this.requestManager.schedule(App.createRequest({ url: `${BASE_URL}/truyen-hentai/${mangaId}/${chapterId}`, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        const pages = this.parser.parseChapterPages($);
        if (pages.length === 0) {
            throw new Error(`No pages found for chapter ${chapterId}`);
        }
        return App.createChapterDetails({ id: chapterId, mangaId, pages });
    }
    getMangaShareUrl(mangaId) {
        return `${BASE_URL}/truyen-hentai/${mangaId}`;
    }
    async getSearchTags() {
        return this.parser.getSearchTags();
    }
}
exports.VinaHentai = VinaHentai;

},{"./VinaHentaiParser":63,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    parseHomePage($) {
        const cards = $('a[href^="/truyen-hentai/"]');
        const imageMap = this.buildImageMap($);
        return this.parseCards($, cards, imageMap);
    }
    parseSection($, sectionTitle) {
        const header = $('h2').filter((_, el) => $(el).text().trim().toLowerCase().includes(sectionTitle.toLowerCase()));
        if (header.length === 0)
            return [];
        const imageMap = this.buildImageMap($);
        let current = header;
        for (let i = 0; i < 5; i++) {
            const next = current.next();
            if (next.length > 0) {
                const cards = next.find('a[href^="/truyen-hentai/"]');
                if (cards.length > 0) {
                    return this.parseCards($, cards, imageMap);
                }
            }
            const parentNext = current.parent().next();
            if (parentNext.length > 0) {
                const cards = parentNext.find('a[href^="/truyen-hentai/"]');
                if (cards.length > 0) {
                    return this.parseCards($, cards, imageMap);
                }
            }
            current = current.parent();
        }
        return [];
    }
    parseCards($, cardsEl, imageMap) {
        const results = [];
        cardsEl.each((_, el) => {
            const href = $(el).attr('href');
            if (!href)
                return;
            const parts = href.split('/').filter(Boolean);
            if (parts.length !== 2)
                return;
            const slug = parts[1].trim();
            if (slug === 'manage')
                return;
            let title = $(el).attr('aria-label') || $(el).attr('title') || '';
            if (!title) {
                const titleEl = $(el).find('.truncate').last();
                title = titleEl.attr('title') || titleEl.text().trim();
            }
            if (!title) {
                const titleEl = $(el).find('h2, h3, p').first();
                title = titleEl.attr('title') || titleEl.text().trim() || slug;
            }
            const img = $(el).find('img').first();
            let image = img.attr('src') ?? img.attr('data-src') ?? '';
            if (!image) {
                image = imageMap.get(slug) ?? '';
            }
            if (!image) {
                image = 'https://via.placeholder.com/320x424.png?text=No+Image';
            }
            if (slug && title) {
                try {
                    results.push(App.createPartialSourceManga({ mangaId: slug, title, image }));
                }
                catch (e) { }
            }
        });
        return this.deduplicate(results);
    }
    parseMangaDetails($, mangaId) {
        const title = $('h1').first().text().trim()
            || $('meta[property="og:title"]').attr('content')?.split('|')[0].trim()
            || mangaId;
        const rawImage = $('meta[property="og:image"]').attr('content')?.trim() ?? '';
        const desc = $('meta[property="og:description"]').attr('content')?.trim() ?? '';
        const authors = [];
        $('a[href^="/authors/"]').each((_, el) => {
            if (el.parent && el.parent.name === 'li')
                return;
            const href = $(el).attr('href') ?? '';
            const authorId = href.replace('/authors/', '').trim();
            const label = $(el).find('span').first().text().trim() || $(el).text().trim();
            if (authorId && label) {
                authors.push(App.createTag({ id: 'author:' + authorId, label }));
            }
        });
        const genres = [];
        $('a[href^="/genres/"]').each((_, el) => {
            if (el.parent && el.parent.name === 'li')
                return;
            const href = $(el).attr('href') ?? '';
            const genreId = href.replace('/genres/', '').trim();
            const label = $(el).text().trim();
            if (genreId && label) {
                genres.push(App.createTag({ id: genreId, label }));
            }
        });
        const tagSections = [];
        const combinedTags = [];
        if (authors.length > 0) {
            combinedTags.push(...authors);
        }
        if (genres.length > 0) {
            combinedTags.push(...genres);
        }
        if (combinedTags.length > 0) {
            tagSections.push(App.createTagSection({ id: 'genres', label: 'Thể Loại', tags: combinedTags }));
        }
        const authorName = authors.length > 0 ? authors[0].label : '';
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: rawImage,
                desc,
                author: authorName,
                artist: authorName,
                status: '',
                tags: tagSections
            }),
        });
    }
    parseChapters($) {
        const chapters = [];
        $('a[href^="/truyen-hentai/"]').each((_, el) => {
            const href = $(el).attr('href') ?? '';
            const parts = href.split('/').filter(Boolean);
            if (parts.length !== 3)
                return; // /truyen-hentai/{slug}/{chapterSlug}
            const chapterId = parts[2];
            const title = $(el).find('.text-txt-primary').first().text().trim()
                || $(el).text().trim()
                || `Chapter ${chapterId}`;
            const lowerTitle = title.toLowerCase();
            if (lowerTitle.includes('từ đầu') || lowerTitle.includes('mới nhất') || lowerTitle.includes('đọc tiếp')) {
                return;
            }
            const timeStr = $(el).find('time').first().attr('dateTime') ?? '';
            const time = timeStr ? new Date(timeStr) : new Date();
            // Try to extract chapter number
            const chapNumMatch = chapterId.match(/(?:chap|chapter)-([\d.]+)/i);
            const chapNum = chapNumMatch ? parseFloat(chapNumMatch[1]) : (chapters.length + 1);
            chapters.push(App.createChapter({
                id: chapterId,
                chapNum: chapNum,
                name: title,
                time: time,
            }));
        });
        return chapters;
    }
    parseChapterPages($) {
        const html = $.html();
        const regex = /https:\/\/cdn\.vinahentai\.one\/manga-images\/[^\s"'\\]+\.(webp|jpg|jpeg|png|gif)/g;
        const matches = html.match(regex) ?? [];
        const pages = [];
        const seen = new Set();
        for (const url of matches) {
            if (!seen.has(url)) {
                seen.add(url);
                pages.push(url);
            }
        }
        return pages;
    }
    buildImageMap($) {
        const imageMap = new Map();
        const html = $.html();
        const regex = /"([^"]+)"|\\"([^"]+)\\"/g;
        const tokens = [];
        let match;
        while ((match = regex.exec(html)) !== null) {
            tokens.push(match[1] ?? match[2] ?? '');
        }
        for (let i = 0; i < tokens.length; i++) {
            const part = tokens[i];
            if (part && /^https:\/\/cdn\.vinahentai\.one\/[^\s"'\\]+\.(webp|jpg|jpeg|png)$/.test(part)) {
                for (let j = 1; j <= 20; j++) {
                    const prev = tokens[i - j];
                    if (prev && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(prev) && prev.length > 3 && prev.length < 100) {
                        imageMap.set(prev, part);
                        break;
                    }
                }
            }
        }
        return imageMap;
    }
    getSearchTags() {
        const genres = [
            ['3d-hentai', '3D Hentai'], ['action', 'Action'], ['adult', 'Adult'],
            ['adventure', 'Adventure'], ['ahegao', 'Ahegao'], ['anal', 'Anal'],
            ['angel', 'Angel'], ['anh-dong', 'Ảnh động'], ['animal', 'Animal'],
            ['animal-girl', 'Animal Girl'], ['ao-dai', 'Áo dài'], ['apron', 'Apron'],
            ['artist-cg', 'Artist CG'], ['based-game', 'Based Game'], ['bdsm', 'BDSM'],
            ['big-ass', 'Big Ass'], ['big-boobs', 'Big Boobs'], ['big-penis', 'Big Penis'],
            ['bikini', 'Bikini'], ['blindfold', 'Blindfold'], ['black-skin', 'Black Skin'],
            ['blackmail', 'Blackmail'], ['blowjobs', 'BlowJobs'], ['body-swap', 'Body Swap'],
            ['bodysuit', 'Bodysuit'], ['bondage', 'Bondage'], ['breastjobs', 'BreastJobs'],
            ['brocon', 'Brocon'], ['brother', 'Brother'], ['business-suit', 'Business Suit'],
            ['che-it', 'Che ít'], ['che-nhieu', 'Che nhiều'], ['cheating', 'Cheating'],
            ['chikan', 'Chikan'], ['chinese-dress', 'Chinese Dress'], ['co-che', 'Có che'],
            ['comedy', 'Comedy'], ['comic', 'Comic'], ['condom', 'Condom'],
            ['cosplay', 'Cosplay'], ['cousin', 'Cousin'], ['crotch-tattoo', 'Crotch Tattoo'],
            ['cunnilingus', 'Cunnilingus'], ['dark-skin', 'Dark Skin'], ['daughter', 'Daughter'],
            ['deepthroat', 'Deepthroat'], ['demon', 'Demon'], ['demongirl', 'DemonGirl'],
            ['devil', 'Devil'], ['devilgirl', 'DevilGirl'], ['dirty', 'Dirty'],
            ['dirtyoldman', 'DirtyOldMan'], ['double-penetration', 'Double Penetration'],
            ['doujinshi', 'Doujinshi'], ['drama', 'Drama'], ['drug', 'Drug'],
            ['ecchi', 'Ecchi'], ['elf', 'Elf'], ['fantasy', 'Fantasy'],
            ['father', 'Father'], ['femdom', 'Femdom'], ['footjob', 'Footjob'],
            ['full-color', 'Full Color'], ['furry', 'Furry'], ['futanari', 'Futanari'],
            ['gangbang', 'Gangbang'], ['ghost', 'Ghost'], ['glasses', 'Glasses'],
            ['gothic-lolita', 'Gothic Lolita'], ['guro', 'Guro'], ['handjob', 'Handjob'],
            ['harem', 'Harem'], ['horror', 'Horror'], ['housewife', 'Housewife'],
            ['idol', 'Idol'], ['incest', 'Incest'], ['isekai', 'Isekai'],
            ['hentai-khong-che', 'Không che'], ['kimono', 'Kimono'], ['maids', 'Maids'],
            ['manhua', 'Manhua'], ['manhwa', 'Manhwa'], ['milf', 'Milf'],
            ['mind-break', 'Mind Break'], ['mind-control', 'Mind Control'], ['monster', 'Monster'],
            ['mother', 'Mother'], ['nakadashi', 'Nakadashi'], ['netori', 'Netori'],
            ['ntr', 'NTR'], ['nun', 'Nun'], ['nurse', 'Nurse'],
            ['oneshot', 'Oneshot'], ['pregnant', 'Pregnant'], ['princess', 'Princess'],
            ['rape', 'Rape'], ['romance', 'Romance'], ['school-uniform', 'School uniform'],
            ['schoolgirl', 'SchoolGirl'], ['sex-toys', 'Sex Toys'], ['shota', 'Shota'],
            ['siscon', 'Siscon'], ['sister', 'Sister'], ['slave', 'Slave'],
            ['sleeping', 'Sleeping'], ['small-boobs', 'Small Boobs'], ['soft-incest', 'Soft Incest'],
            ['son', 'Son'], ['sport', 'Sport'], ['squirting', 'Squirting'],
            ['stockings', 'Stockings'], ['swimsuit', 'Swimsuit'], ['teacher', 'Teacher'],
            ['tentacles', 'Tentacles'], ['time-stop', 'Time Stop'], ['tomboy', 'Tomboy'],
            ['truyen-viet', 'Truyện Việt'], ['tsundere', 'Tsundere'], ['twins', 'Twins'],
            ['underwater', 'Underwater'], ['vanilla', 'Vanilla'], ['virgin', 'Virgin'],
            ['webtoon', 'Webtoon'], ['x-ray', 'X-ray'], ['yandere', 'Yandere'],
            ['yaoi', 'Yaoi'], ['yuri', 'Yuri'], ['beach', 'Beach'],
            ['creampie', 'Creampie'], ['fingering', 'Fingering'], ['gender-bender', 'Gender Bender'],
            ['group', 'Group'], ['lingerie', 'Lingerie'], ['masturbation', 'Masturbation'],
            ['series', 'Series'], ['short', 'Short'], ['succubus', 'Succubus'],
            ['supernatural', 'Supernatural'], ['threesome', 'Threesome'], ['insect', 'Insect'],
            ['lolicon', 'Lolicon']
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
    isLastPage($, currentPage = 1) {
        let isLast = true;
        let hasPagination = false;
        $('a').each((_, el) => {
            const href = $(el).attr('href') || '';
            if (href.includes('page=')) {
                hasPagination = true;
            }
        });
        $('button').each((_, el) => {
            const text = $(el).text().trim().toLowerCase();
            if (text === 'cuối' || text === 'tiếp' || text === 'sau' || text === '>') {
                hasPagination = true;
            }
            if (text === String(currentPage + 1)) {
                hasPagination = true;
            }
        });
        if (hasPagination) {
            $('a').each((_, el) => {
                const text = $(el).text().trim().toLowerCase();
                const href = $(el).attr('href') || '';
                const rel = $(el).attr('rel') || '';
                if (href.includes('page=')) {
                    if (text.includes('sau') || text.includes('next') || text.includes('»') || text.includes('>') || rel === 'next') {
                        isLast = false;
                    }
                    if (href.includes(`page=${currentPage + 1}`)) {
                        isLast = false;
                    }
                }
            });
            $('button').each((_, el) => {
                const text = $(el).text().trim().toLowerCase();
                if (text === 'cuối' || text === 'tiếp' || text === 'sau' || text === '>') {
                    isLast = false;
                }
                if (text === String(currentPage + 1)) {
                    isLast = false;
                }
            });
        }
        else {
            isLast = true;
        }
        return isLast;
    }
    parseGenrePage($) {
        const manga = this.parseHomePage($);
        const genresMap = this.extractMangaGenresMap($);
        return manga.filter(m => {
            const genres = genresMap.get(m.mangaId);
            if (genres) {
                return !genres.includes('yaoi') && !genres.includes('furry');
            }
            return true;
        });
    }
    extractMangaGenresMap($) {
        const genresMap = new Map();
        try {
            const html = $.html();
            const regex = /streamController\.enqueue\("([\s\S]*?)"\)/g;
            let match;
            let concatenated = '';
            while ((match = regex.exec(html)) !== null) {
                concatenated += match[1];
            }
            if (!concatenated)
                return genresMap;
            const safeLiteral = concatenated.replace(/\r/g, '\\r').replace(/\n/g, '\\n');
            const decodedStr = JSON.parse('"' + safeLiteral + '"');
            const parsed = JSON.parse(decodedStr);
            if (!Array.isArray(parsed))
                return genresMap;
            const cache = new Map();
            const resolve = (idx) => {
                if (idx === null || idx === undefined)
                    return idx;
                if (typeof idx !== 'number')
                    return idx;
                if (cache.has(idx))
                    return cache.get(idx);
                cache.set(idx, null);
                const raw = parsed[idx];
                if (raw === null || raw === undefined || typeof raw !== 'object') {
                    cache.set(idx, raw);
                    return raw;
                }
                if (Array.isArray(raw)) {
                    const resolvedArr = [];
                    cache.set(idx, resolvedArr);
                    for (const item of raw) {
                        resolvedArr.push(resolve(item));
                    }
                    return resolvedArr;
                }
                const keys = Object.keys(raw);
                const isRefObj = keys.every(k => k.startsWith('_'));
                if (isRefObj) {
                    const resolvedObj = {};
                    cache.set(idx, resolvedObj);
                    for (const k of keys) {
                        const keyIdx = parseInt(k.slice(1), 10);
                        const propName = resolve(keyIdx);
                        const valIdx = raw[k];
                        resolvedObj[propName] = resolve(valIdx);
                    }
                    return resolvedObj;
                }
                else {
                    const resolvedObj = {};
                    cache.set(idx, resolvedObj);
                    for (const k of keys) {
                        resolvedObj[k] = resolve(raw[k]);
                    }
                    return resolvedObj;
                }
            };
            for (let i = 0; i < parsed.length; i++) {
                const resObj = resolve(i);
                if (resObj && typeof resObj === 'object' && resObj.slug && resObj.title && resObj.chapters !== undefined) {
                    if (Array.isArray(resObj.genres)) {
                        genresMap.set(resObj.slug, resObj.genres.filter((g) => typeof g === 'string'));
                    }
                }
            }
        }
        catch (e) {
            // Silence parsing errors
        }
        return genresMap;
    }
}
exports.Parser = Parser;

},{}]},{},[62])(62)
});
