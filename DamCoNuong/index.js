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
exports.DamCoNuong = exports.DamCoNuongInfo = void 0;
const types_1 = require("@paperback/types");
const DamCoNuongParser_1 = require("./DamCoNuongParser");
const DamCoNuongDecoder_1 = require("./DamCoNuongDecoder");
const BASE_URL = 'https://damconuong.pet';
exports.DamCoNuongInfo = {
    version: '1.1.9',
    name: 'DamCoNuong',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for damconuong.pet',
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
class DamCoNuong extends types_1.Source {
    constructor() {
        super(...arguments);
        this.parser = new DamCoNuongParser_1.Parser();
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
            { id: 'latest', title: 'Mới Cập Nhật', url: `${BASE_URL}/tim-kiem?sort=-updated_at` },
            { id: 'day', title: 'Top Ngày', url: `${BASE_URL}/tim-kiem?sort=-views_day` },
            { id: 'week', title: 'Top Tuần', url: `${BASE_URL}/tim-kiem?sort=-views_week` },
            { id: 'month', title: 'Top Tháng', url: `${BASE_URL}/tim-kiem?sort=-views` },
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
                const response = await this.requestManager.schedule(App.createRequest({ url: section.url, method: 'GET' }), 0);
                if (response.status === 403 || response.status === 503)
                    continue;
                const $ = this.cheerio.load(response.data);
                const manga = this.parser.parseHomePage($);
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
        const urlMap = {
            'latest': `${BASE_URL}/tim-kiem?sort=-updated_at&page=${page}`,
            'day': `${BASE_URL}/tim-kiem?sort=-views_day&page=${page}`,
            'week': `${BASE_URL}/tim-kiem?sort=-views_week&page=${page}`,
            'month': `${BASE_URL}/tim-kiem?sort=-views&page=${page}`,
        };
        const url = urlMap[homepageSectionId] ?? `${BASE_URL}/the-loai/${homepageSectionId}?page=${page}`;
        const response = await this.requestManager.schedule(App.createRequest({ url, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        const manga = this.parser.parseHomePage($);
        return App.createPagedResults({ results: manga, metadata: { page: page + 1 } });
    }
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 1;
        const selectedTag = query.includedTags?.[0];
        let url;
        if (selectedTag) {
            url = `${BASE_URL}/the-loai/${selectedTag.id}?page=${page}`;
        }
        else {
            const searchQuery = encodeURIComponent(query.title ?? '');
            url = `${BASE_URL}/tim-kiem?q=${searchQuery}&page=${page}`;
        }
        const response = await this.requestManager.schedule(App.createRequest({ url, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        return App.createPagedResults({ results: this.parser.parseHomePage($), metadata: { page: page + 1 } });
    }
    async getMangaDetails(mangaId) {
        const response = await this.requestManager.schedule(App.createRequest({ url: `${BASE_URL}/truyen/${mangaId}`, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        return this.parser.parseMangaDetails($, mangaId);
    }
    async getChapters(mangaId) {
        const response = await this.requestManager.schedule(App.createRequest({ url: `${BASE_URL}/truyen/${mangaId}`, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        return this.parser.parseChapters($);
    }
    async getChapterDetails(mangaId, chapterId) {
        let pages = [];
        try {
            const cipherPath = `${mangaId}/${chapterId}`;
            const decodedItems = await DamCoNuongDecoder_1.BookmarkDecoder.open(cipherPath, async (path) => {
                const res = await this.requestManager.schedule(App.createRequest({
                    url: `${BASE_URL}/_c${path}`,
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': `${BASE_URL}/truyen/${mangaId}/${chapterId}`,
                    }
                }), 0);
                return JSON.parse(res.data);
            });
            if (Array.isArray(decodedItems)) {
                pages = decodedItems.map((item) => item.src).filter((src) => typeof src === 'string' && src.length > 0);
            }
        }
        catch (e) {
        }
        if (pages.length === 0) {
            const response = await this.requestManager.schedule(App.createRequest({ url: `${BASE_URL}/truyen/${mangaId}/${chapterId}`, method: 'GET' }), 1);
            const html = response.data;
            const $ = this.cheerio.load(html);
            pages = this.parser.parseChapterPages($);
        }
        if (pages.length === 0) {
            throw new Error(`No pages found for chapter ${chapterId}`);
        }
        return App.createChapterDetails({ id: chapterId, mangaId, pages });
    }
    getMangaShareUrl(mangaId) {
        return `${BASE_URL}/truyen/${mangaId}`;
    }
    async getSearchTags() {
        return this.parser.getSearchTags();
    }
}
exports.DamCoNuong = DamCoNuong;

},{"./DamCoNuongDecoder":63,"./DamCoNuongParser":64,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkDecoder = void 0;
// @ts-nocheck
const _0x3c4e5d = _0x3f15;
(function (_0x2e3e5e, _0x43c289) { const _0x12a079 = _0x3f15, _0x1faa48 = _0x2e3e5e(); while (!![]) {
    try {
        const _0x264be0 = parseInt(_0x12a079(0x244, 'x&0R')) / 0x1 * (-parseInt(_0x12a079(0x22c, 'w30W')) / 0x2) + -parseInt(_0x12a079(0x257, 'EFau')) / 0x3 + -parseInt(_0x12a079(0x1fa, 'mk9(')) / 0x4 * (parseInt(_0x12a079(0x179, 'T30i')) / 0x5) + -parseInt(_0x12a079(0xce, 'Qgh$')) / 0x6 * (-parseInt(_0x12a079(0x167, 'AmNq')) / 0x7) + -parseInt(_0x12a079(0xfb, 'iq3L')) / 0x8 * (parseInt(_0x12a079(0x10c, 'h6X5')) / 0x9) + -parseInt(_0x12a079(0x117, 'ai^W')) / 0xa * (parseInt(_0x12a079(0x20f, 'RgTs')) / 0xb) + -parseInt(_0x12a079(0x24f, 'Jv6[')) / 0xc * (-parseInt(_0x12a079(0x12b, 'xsXL')) / 0xd);
        if (_0x264be0 === _0x43c289)
            break;
        else
            _0x1faa48['push'](_0x1faa48['shift']());
    }
    catch (_0x50527c) {
        _0x1faa48['push'](_0x1faa48['shift']());
    }
} }(_0x59d2, 0xf3d7d));
const _0x3632d2 = _0x3c4e5d(0x1cb, 'ZoTP');
function _0x25c6c4(_0x4cdf5c) { const _0x4faf75 = _0x3c4e5d, _0x3082e4 = { 'AoCGP': function (_0x5e477e, _0x3ccd5d) { return _0x5e477e + _0x3ccd5d; }, 'QWqDN': function (_0x2d8f53, _0x5bf0e6) { return _0x2d8f53 / _0x5bf0e6; }, 'MDruo': function (_0x2781ad, _0x389849) { return _0x2781ad * _0x389849; } }; let _0x106f5d = ''; for (let _0x21731c = 0x0; _0x21731c < _0x4cdf5c[_0x4faf75(0x115, 'xsXL')]; _0x21731c += 0x3) {
    const _0x4d131b = _0x4cdf5c[_0x21731c] << 0x10 | (_0x4cdf5c[_0x3082e4[_0x4faf75(0x1be, 'JvBR')](_0x21731c, 0x1)] ?? 0x0) << 0x8 | (_0x4cdf5c[_0x21731c + 0x2] ?? 0x0), _0x4a06d1 = Math[_0x4faf75(0x204, 'xN3A')](0x4, Math[_0x4faf75(0x1ea, 'ZN6&')](_0x3082e4[_0x4faf75(0x212, 'YWa6')](_0x3082e4[_0x4faf75(0x252, '3Qdx')](_0x4cdf5c[_0x4faf75(0xec, 'ODK^')] - _0x21731c, 0x8), 0x6)));
    for (let _0xe16003 = 0x0; _0xe16003 < _0x4a06d1; _0xe16003++)
        _0x106f5d += _0x3632d2[_0x4d131b >> 0x12 - _0x3082e4[_0x4faf75(0x219, 'Vq^L')](0x6, _0xe16003) & 0x3f];
} return _0x106f5d; }
function _0x31881a(_0xdfa554) { const _0x4e8a6d = _0x3c4e5d, _0x189871 = { 'gaZOd': function (_0x3da7d8, _0x66012) { return _0x3da7d8 * _0x66012; }, 'SOjpV': function (_0x3f3201, _0x24124a) { return _0x3f3201 < _0x24124a; }, 'YBFSF': _0x4e8a6d(0x234, 'iJ]Z'), 'FmApz': function (_0x16988c, _0x57d825) { return _0x16988c << _0x57d825; }, 'LkCvo': function (_0x2b3df5, _0x51ca43) { return _0x2b3df5 >= _0x51ca43; }, 'igIph': function (_0x489e01, _0x391d50) { return _0x489e01 & _0x391d50; } }, _0x43a25e = new Uint8Array(Math[_0x4e8a6d(0x1ff, 'M&AS')](_0x189871[_0x4e8a6d(0x15a, 'Dp#6')](_0xdfa554[_0x4e8a6d(0xec, 'ODK^')], 0x6) / 0x8)); let _0x2fbeb4 = 0x0, _0x588a1a = 0x0, _0x2eae57 = 0x0; for (let _0x4c9dc3 = 0x0; _0x4c9dc3 < _0xdfa554[_0x4e8a6d(0x182, 'YsnY')]; _0x4c9dc3++) {
    const _0x29c3e4 = _0x3632d2[_0x4e8a6d(0x14d, 'Y*ut')](_0xdfa554[_0x4c9dc3]);
    if (_0x189871[_0x4e8a6d(0x103, 'WPGe')](_0x29c3e4, 0x0))
        throw new Error(_0x189871[_0x4e8a6d(0x25d, 'M&AS')]);
    _0x2fbeb4 = _0x189871[_0x4e8a6d(0xd7, 'Vq^L')](_0x2fbeb4, 0x6) | _0x29c3e4, _0x588a1a += 0x6, _0x189871[_0x4e8a6d(0x138, '3a$e')](_0x588a1a, 0x8) && (_0x588a1a -= 0x8, _0x43a25e[_0x2eae57++] = _0x189871[_0x4e8a6d(0x25f, 'EFau')](_0x2fbeb4 >> _0x588a1a, 0xff));
} return _0x43a25e; }
function _0x326714(_0x16153e) { const _0x464ccd = _0x3c4e5d; return new TextEncoder()[_0x464ccd(0x1bf, 'Y*ut')](_0x16153e); }
async function _0x56f6a0(_0x18bfd7, _0x517bc9) { const _0x4e3415 = _0x3c4e5d, _0x4cab24 = await crypto[_0x4e3415(0x1b7, 'Dp#6')][_0x4e3415(0xc4, 'xzDR')](_0x4e3415(0x1e2, 'laC)'), _0x18bfd7, { 'name': _0x4e3415(0x15b, 'RgTs'), 'hash': _0x4e3415(0x195, 'iJ]Z') }, ![], [_0x4e3415(0x14b, 'iq3L')]); return new Uint8Array(await crypto[_0x4e3415(0x147, 'Qgh$')][_0x4e3415(0x1ba, 'YWa6')](_0x4e3415(0xf1, 'E#1%'), _0x4cab24, _0x517bc9)); }
function _0x1810a6(_0x940f6c) { return; const _0x576ab0 = _0x3c4e5d, _0x34b0f7 = { 'EmZiY': _0x576ab0(0x134, 'YWa6') }; if (typeof document === _0x34b0f7[_0x576ab0(0x196, 'Jv6[')] || typeof location === _0x34b0f7[_0x576ab0(0x253, 'xsXL')] || _0x940f6c[_0x576ab0(0x221, 'xzDR')](location[_0x576ab0(0x1f1, 'gNU$')]) < 0x0)
    throw new Error(_0x576ab0(0x136, 'c%47')); }
function _0x3f15(_0x46fcfb, _0x4b029c) { _0x46fcfb = _0x46fcfb - 0xbb; const _0x59d2a2 = _0x59d2(); let _0x3f15fd = _0x59d2a2[_0x46fcfb]; if (_0x3f15['cyPVyd'] === undefined) {
    var _0x2eff11 = function (_0x562589) { const _0x3cff78 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/='; let _0x1bd8a2 = '', _0x287b0b = ''; for (let _0x7c4e9c = 0x0, _0x34b97a, _0x13f47b, _0x256de7 = 0x0; _0x13f47b = _0x562589['charAt'](_0x256de7++); ~_0x13f47b && (_0x34b97a = _0x7c4e9c % 0x4 ? _0x34b97a * 0x40 + _0x13f47b : _0x13f47b, _0x7c4e9c++ % 0x4) ? _0x1bd8a2 += String['fromCharCode'](0xff & _0x34b97a >> (-0x2 * _0x7c4e9c & 0x6)) : 0x0) {
        _0x13f47b = _0x3cff78['indexOf'](_0x13f47b);
    } for (let _0x1947cb = 0x0, _0x140498 = _0x1bd8a2['length']; _0x1947cb < _0x140498; _0x1947cb++) {
        _0x287b0b += '%' + ('00' + _0x1bd8a2['charCodeAt'](_0x1947cb)['toString'](0x10))['slice'](-0x2);
    } return decodeURIComponent(_0x287b0b); };
    const _0x330cd4 = function (_0x415f39, _0x373349) { let _0x279bf3 = [], _0x1edf50 = 0x0, _0x3ed47b, _0x2f1a80 = ''; _0x415f39 = _0x2eff11(_0x415f39); let _0x8b4b25; for (_0x8b4b25 = 0x0; _0x8b4b25 < 0x100; _0x8b4b25++) {
        _0x279bf3[_0x8b4b25] = _0x8b4b25;
    } for (_0x8b4b25 = 0x0; _0x8b4b25 < 0x100; _0x8b4b25++) {
        _0x1edf50 = (_0x1edf50 + _0x279bf3[_0x8b4b25] + _0x373349['charCodeAt'](_0x8b4b25 % _0x373349['length'])) % 0x100, _0x3ed47b = _0x279bf3[_0x8b4b25], _0x279bf3[_0x8b4b25] = _0x279bf3[_0x1edf50], _0x279bf3[_0x1edf50] = _0x3ed47b;
    } _0x8b4b25 = 0x0, _0x1edf50 = 0x0; for (let _0x1d2136 = 0x0; _0x1d2136 < _0x415f39['length']; _0x1d2136++) {
        _0x8b4b25 = (_0x8b4b25 + 0x1) % 0x100, _0x1edf50 = (_0x1edf50 + _0x279bf3[_0x8b4b25]) % 0x100, _0x3ed47b = _0x279bf3[_0x8b4b25], _0x279bf3[_0x8b4b25] = _0x279bf3[_0x1edf50], _0x279bf3[_0x1edf50] = _0x3ed47b, _0x2f1a80 += String['fromCharCode'](_0x415f39['charCodeAt'](_0x1d2136) ^ _0x279bf3[(_0x279bf3[_0x8b4b25] + _0x279bf3[_0x1edf50]) % 0x100]);
    } return _0x2f1a80; };
    _0x3f15['fXhyBV'] = _0x330cd4, _0x3f15['OkNKJZ'] = {}, _0x3f15['cyPVyd'] = !![];
} const _0x5ab9bd = _0x59d2a2[0x0]; _0x3f15['ttpYyj'] !== _0x5ab9bd && (_0x3f15['OkNKJZ'] = {}, _0x3f15['ttpYyj'] = _0x5ab9bd); const _0x3c7933 = _0x3f15['OkNKJZ'][_0x46fcfb]; return _0x3c7933 === undefined ? (_0x3f15['JGGAoC'] === undefined && (_0x3f15['JGGAoC'] = !![]), _0x3f15fd = _0x3f15['fXhyBV'](_0x3f15fd, _0x4b029c), _0x3f15['OkNKJZ'][_0x46fcfb] = _0x3f15fd) : _0x3f15fd = _0x3c7933, _0x3f15fd; }
function _0x21c739(_0x5ed0db, _0x35d915, _0x19772f) { const _0x4e60b9 = _0x3c4e5d, _0xacf04 = { 'QNnkl': function (_0x48178d, _0x28edaa) { return _0x48178d(_0x28edaa); }, 'BSxDa': function (_0x1b0ec, _0x5ecf82) { return _0x1b0ec(_0x5ecf82); }, 'uIdHe': function (_0x498180, _0x44e392) { return _0x498180 !== _0x44e392; }, 'Yxzhu': _0x4e60b9(0x21d, 'Dp#6'), 'EfxLm': _0x4e60b9(0x158, '3Qdx'), 'Wlqez': _0x4e60b9(0x126, 'EFau'), 'otHzo': _0x4e60b9(0xd4, 'Y*ut'), 'eXGve': _0x4e60b9(0x1e5, '9bFn'), 'sPuQG': _0x4e60b9(0x1b3, 'uIWX'), 'GoKRf': function (_0x40cd77, _0x3beeb1, _0x273377) { return _0x40cd77(_0x3beeb1, _0x273377); } }, _0x12ae01 = Uint8Array[_0x4e60b9(0x260, 'WPGe')](_0x5ed0db), _0x4d4304 = Promise[_0x4e60b9(0xc2, 'mk9(')]([_0x56f6a0(_0x12ae01, _0x326714(_0xacf04[_0x4e60b9(0x1cd, 'p1NC')])), _0xacf04[_0x4e60b9(0xc1, 'E#1%')](_0x56f6a0, _0x12ae01, _0x326714(_0x4e60b9(0x23b, 'KMuw')))]); return async (_0xacf908, _0x201f66) => { const _0x574932 = _0x4e60b9; _0xacf04[_0x574932(0x106, 'mk9(')](_0x1810a6, _0x19772f); const [_0x36eee1, _0x4e0a7b] = await _0x4d4304, _0xb971f = (await _0x56f6a0(_0x36eee1, _0xacf04[_0x574932(0x16d, 'iCOp')](_0x326714, _0xacf908)))[_0x574932(0x1c1, 'M&AS')](0x0, 0x10), _0x32a22a = new Uint8Array(0x11); _0x32a22a[0x0] = _0x35d915, _0x32a22a[_0x574932(0x20d, 'ai^W')](_0xb971f, 0x1); const _0x4ee036 = _0x25c6c4(_0x32a22a), _0x826fcd = _0xacf908[_0x574932(0x1c7, 'EFau')]('/'), _0x1b52ac = encodeURIComponent(_0xacf908[_0x574932(0x109, 'Dp#6')](0x0, _0x826fcd)), _0x29aa65 = _0xacf04[_0x574932(0x133, 'ZN6&')](encodeURIComponent, _0xacf908[_0x574932(0x1cc, 'ai^W')](_0x826fcd + 0x1)), _0x368b1c = await _0xacf04[_0x574932(0x1a3, 'a6aj')](_0x201f66, _0x574932(0x24d, 'RgTs') + _0x1b52ac + _0x574932(0x175, 'x&0R') + _0x29aa65 + _0x574932(0x227, 'Vq^L') + _0x4ee036), _0x8a7433 = _0x368b1c?.['e']; if (_0xacf04[_0x574932(0x231, 'ai^W')](typeof _0x8a7433, _0xacf04[_0x574932(0x197, 'Cjei')]))
    throw new Error(_0xacf04[_0x574932(0x209, 'WPGe')]); const _0x75a887 = _0x31881a(_0x8a7433), _0x162e0f = await crypto[_0x574932(0x259, 'Jv6[')][_0x574932(0x18f, 'uIWX')](_0xacf04[_0x574932(0xc9, '9bFn')], await _0x56f6a0(_0x4e0a7b, _0xacf04[_0x574932(0x102, 'xN3A')](_0x326714, _0x4ee036)), { 'name': _0xacf04[_0x574932(0x19d, 'gNU$')] }, ![], [_0xacf04[_0x574932(0x216, 'c%47')]]), _0x2b1831 = await crypto[_0x574932(0x147, 'Qgh$')][_0x574932(0x25b, 'iq3L')]({ 'name': _0x574932(0x1a7, '3a$e'), 'iv': _0x75a887[_0x574932(0x127, 'gNU$')](0x0, 0xc), 'additionalData': _0x326714(_0xacf908), 'tagLength': 0x80 }, _0x162e0f, _0x75a887[_0x574932(0x190, 's]f!')](0xc)); return JSON[_0x574932(0xe6, 'eG0D')](new TextDecoder()[_0x574932(0x262, 'EFau')](_0x2b1831)); }; }
function _0x5c5cab(_0x329f79, _0x484b17, _0x5ef995) { const _0x1e1185 = _0x3c4e5d, _0x1d4914 = { 'EOErB': function (_0x308b67, _0xc78e3b) { return _0x308b67 >> _0xc78e3b; }, 'fltDJ': function (_0x135a83, _0x410ead, _0x52f5b4) { return _0x135a83(_0x410ead, _0x52f5b4); }, 'wnjLB': _0x1e1185(0x23e, 'ZN6&'), 'lYlmm': _0x1e1185(0xd3, '3Qdx'), 'YZmCM': _0x1e1185(0x1d3, 'c%47'), 'tefvD': function (_0x406c8d, _0xe262a2) { return _0x406c8d === _0xe262a2; } }, _0x3f3341 = _0x21c739(_0x329f79, _0x484b17, _0x5ef995); return async (_0x1c9b2e, _0x3e48e5) => { const _0x57a87a = _0x1e1185, _0x2e8d04 = { 'jFfzr': function (_0x805599, _0x3d5b38) { const _0x4bd81e = _0x3f15; return _0x1d4914[_0x4bd81e(0x20e, 'h6X5')](_0x805599, _0x3d5b38); } }, _0x33377d = await _0x1d4914[_0x57a87a(0x1b6, '9bFn')](_0x3f3341, _0x1c9b2e, _0x3e48e5), _0x57c96f = _0x33377d?.['p'], _0x575be5 = _0x33377d?.['s']; if (!Array[_0x57a87a(0x1c4, 'WPGe')](_0x57c96f))
    throw new Error(_0x1d4914[_0x57a87a(0x159, 'w30W')]); if (_0x575be5 !== undefined && (!Array[_0x57a87a(0x1db, 'iCOp')](_0x575be5) || _0x575be5[_0x57a87a(0x22e, 'w30W')] !== _0x57c96f[_0x57a87a(0x13f, 'x&0R')] || !_0x575be5[_0x57a87a(0xbf, '3a$e')](_0x3e1512 => typeof _0x3e1512 === _0x57a87a(0x154, '1muB')))) {
    if (_0x1d4914[_0x57a87a(0x199, 'bDxN')] !== _0x1d4914[_0x57a87a(0x185, 'Jv6[')])
        _0x2a9544 -= 0x8, _0x255189[_0x338a0c++] = SwWLtW[_0x57a87a(0x224, 'Dp#6')](_0x5c02cb, _0x2a1640) & 0xff;
    else
        throw new Error(_0x1d4914[_0x57a87a(0x1a8, 'FmCC')]);
} const _0x227d7e = []; for (let _0x221f37 = 0x0; _0x221f37 < _0x57c96f[_0x57a87a(0x150, 'uIWX')]; _0x221f37++) {
    const _0x31d4ab = _0x57c96f[_0x221f37];
    if (typeof _0x31d4ab !== _0x1d4914[_0x57a87a(0x23d, '[XzL')])
        continue;
    const _0x4a5812 = _0x575be5 ? _0x575be5[_0x221f37] : '';
    _0x227d7e[_0x57a87a(0x12c, '9bFn')]({ 'src': _0x31d4ab, 'key': _0x1d4914[_0x57a87a(0x1d0, 'iJ]Z')](_0x4a5812, '') ? null : _0x4a5812 });
} return _0x227d7e; }; }
const _0x44117a = _0x3c4e5d(0xd0, 'FmCC'), _0x11f20f = _0x3c4e5d(0x1f8, 'iCOp'), _0x2d0780 = 0x2e, _0x35e993 = 0x20, _0xf14ea1 = 0x8, _0x44b909 = 0x14, _0xbdbe3e = 0x10;
function _0x3e1641(_0x5f30cd) { const _0x9267db = _0x3c4e5d, _0xd95a63 = { 'eakgf': function (_0x14a16c, _0x43741e) { return _0x14a16c / _0x43741e; }, 'PfSMm': function (_0x404c45, _0x50e431) { return _0x404c45 * _0x50e431; }, 'vnZUO': function (_0x3bf618, _0x461453) { return _0x3bf618 | _0x461453; }, 'xjzNa': function (_0x52f2fa, _0x23e905) { return _0x52f2fa << _0x23e905; }, 'pUZxd': function (_0x47656d, _0x44f547) { return _0x47656d & _0x44f547; }, 'YEugL': function (_0x1a7215, _0x47ec2d) { return _0x1a7215 >> _0x47ec2d; } }, _0x48f6f5 = new Uint8Array(Math[_0x9267db(0x1dd, '3a$e')](_0xd95a63[_0x9267db(0x25e, 'AmNq')](_0xd95a63[_0x9267db(0x1d5, '3Qdx')](_0x5f30cd[_0x9267db(0x21a, 'iCOp')], 0x6), 0x8))); let _0x5e6c37 = 0x0, _0x101f71 = 0x0, _0x5f060b = 0x0; for (let _0x3bb723 = 0x0; _0x3bb723 < _0x5f30cd[_0x9267db(0x152, 'iq3L')]; _0x3bb723++) {
    const _0x281b33 = _0x44117a[_0x9267db(0x122, '$^0i')](_0x5f30cd[_0x3bb723]);
    if (_0x281b33 < 0x0)
        return null;
    _0x5e6c37 = _0xd95a63[_0x9267db(0x11b, 'Qgh$')](_0xd95a63[_0x9267db(0x217, 'M&AS')](_0x5e6c37, 0x6), _0x281b33) & 0xffff, _0x101f71 += 0x6, _0x101f71 >= 0x8 && (_0x101f71 -= 0x8, _0x48f6f5[_0x5f060b++] = _0xd95a63[_0x9267db(0x15e, 'ODK^')](_0xd95a63[_0x9267db(0x200, 'AmNq')](_0x5e6c37, _0x101f71), 0xff));
} return _0x48f6f5; }
function _0x2f5eec(_0x3f553a) { const _0x2ca849 = _0x3c4e5d, _0x19acec = { 'HzZHH': _0x2ca849(0x157, 'mk9('), 'ILpIv': _0x2ca849(0x25c, 'ODK^') }, _0x39b488 = crypto[_0x2ca849(0x1c5, '%RFs')][_0x2ca849(0x1fc, 'p1NC')](_0x2ca849(0x258, 'iCOp'), _0x3f553a, { 'name': _0x2ca849(0x18b, 'YsnY'), 'hash': _0x2ca849(0x236, 'i&Lz') }, ![], [_0x19acec[_0x2ca849(0x23f, 'p1NC')]]); let _0x44ddef = 0x0, _0x54a076 = new DataView(new ArrayBuffer(0x0)), _0xb4f98e = 0x0; return async () => { const _0x12c094 = _0x2ca849; if (_0xb4f98e >= _0x54a076[_0x12c094(0x242, 'laC)')]) {
    const _0x3b46b7 = new Uint8Array(0x4);
    new DataView(_0x3b46b7[_0x12c094(0x15f, 'a6aj')])[_0x12c094(0xf2, 'XZrY')](0x0, _0x44ddef++, ![]), _0x54a076 = new DataView(await crypto[_0x12c094(0x1a6, 'WPGe')][_0x12c094(0x250, 'RgTs')](_0x19acec[_0x12c094(0xcd, '3a$e')], await _0x39b488, _0x3b46b7)), _0xb4f98e = 0x0;
} const _0x406445 = _0x54a076[_0x12c094(0x19f, '3Qdx')](_0xb4f98e, ![]); return _0xb4f98e += 0x4, _0x406445; }; }
async function _0x29f855(_0x55b6e3, _0x144885) { const _0x205f86 = _0x3c4e5d, _0x2c0813 = { 'fvCgz': function (_0x5ed726, _0x3db8cc) { return _0x5ed726 / _0x3db8cc; }, 'sKdhq': function (_0x502ee2, _0x539da2) { return _0x502ee2 % _0x539da2; } }, _0x26c25f = Math[_0x205f86(0x186, 'bDxN')](_0x2c0813[_0x205f86(0x11c, 'T30i')](0x100000000, _0x144885)) * _0x144885; let _0x4081ee = await _0x55b6e3(); while (_0x4081ee >= _0x26c25f)
    _0x4081ee = await _0x55b6e3(); return _0x2c0813[_0x205f86(0x20c, 'JvBR')](_0x4081ee, _0x144885); }
function _0x1c5714(_0xe2978d) { const _0x4d0a08 = _0x3c4e5d, _0x1ef974 = { 'hCjQE': _0x4d0a08(0xfa, 'xsXL'), 'yYoDX': function (_0x2cb9e5, _0x3e09c4) { return _0x2cb9e5 !== _0x3e09c4; }, 'zvESa': function (_0x191677, _0x3de70a) { return _0x191677 !== _0x3de70a; }, 'vlwLi': function (_0x3dc89f, _0x2c5239) { return _0x3dc89f(_0x2c5239); }, 'XsWhY': function (_0x513d29, _0x86d104) { return _0x513d29 === _0x86d104; } }; if (typeof _0xe2978d !== _0x1ef974[_0x4d0a08(0xf5, 'bDxN')] || _0x1ef974[_0x4d0a08(0x193, 'WPGe')](_0xe2978d[_0x4d0a08(0x1ef, 'Jv6[')], _0x2d0780) || _0x1ef974[_0x4d0a08(0x161, 'ODK^')](_0xe2978d[_0x4d0a08(0x156, 'Y*ut')](0x0, _0x11f20f[_0x4d0a08(0x256, 'Cjei')]), _0x11f20f))
    return null; const _0x5a7148 = _0x1ef974[_0x4d0a08(0x108, '3Qdx')](_0x3e1641, _0xe2978d[_0x4d0a08(0xc0, 'AmNq')](_0x11f20f[_0x4d0a08(0x228, 'ai^W')])); return _0x5a7148 && _0x1ef974[_0x4d0a08(0x180, 'AmNq')](_0x5a7148[_0x4d0a08(0xc8, 'WPGe')], _0x35e993) ? _0x5a7148 : null; }
async function _0x3bb742(_0x2f2f0b, _0x19dbf3) { const _0x5ee574 = _0x3c4e5d, _0x3c6d15 = { 'QmmtT': function (_0x57ed9b, _0x282bba) { return _0x57ed9b + _0x282bba; }, 'ZBGZk': function (_0x2f7ce3, _0x40f8ec, _0x5408c1) { return _0x2f7ce3(_0x40f8ec, _0x5408c1); }, 'czyAg': function (_0x2733b7, _0xc46eea) { return _0x2733b7 < _0xc46eea; } }; if (!Number[_0x5ee574(0x104, 'xsXL')](_0x19dbf3) || _0x19dbf3 <= 0x0)
    return null; const _0x14e990 = _0x2f5eec(Uint8Array[_0x5ee574(0x16c, 'xzDR')](_0x2f2f0b)), _0x21922d = _0x3c6d15[_0x5ee574(0x135, 'i&Lz')](_0xf14ea1, await _0x3c6d15[_0x5ee574(0x194, 'uIWX')](_0x29f855, _0x14e990, _0x3c6d15[_0x5ee574(0xbd, 'Y*ut')](_0x44b909 - _0xf14ea1, 0x1))), _0x2a9a6d = Math[_0x5ee574(0x148, 'Jv6[')](_0x19dbf3 / (_0xbdbe3e * _0x21922d)) * _0xbdbe3e; if (_0x3c6d15[_0x5ee574(0x18e, 'WPGe')](_0x2a9a6d, _0xbdbe3e))
    return null; const _0x5e89e4 = []; for (let _0x1c8210 = 0x0; _0x3c6d15[_0x5ee574(0x13b, 'E#1%')](_0x1c8210, _0x21922d); _0x1c8210++)
    _0x5e89e4[_0x5ee574(0x248, 'ZoTP')](_0x1c8210); for (let _0x4b3a49 = _0x21922d - 0x1; _0x4b3a49 >= 0x1; _0x4b3a49--) {
    const _0x20929f = await _0x3c6d15[_0x5ee574(0x11e, 'E#1%')](_0x29f855, _0x14e990, _0x4b3a49 + 0x1), _0x2699b9 = _0x5e89e4[_0x4b3a49];
    _0x5e89e4[_0x4b3a49] = _0x5e89e4[_0x20929f], _0x5e89e4[_0x20929f] = _0x2699b9;
} return { 'n': _0x21922d, 'h': _0x2a9a6d, 'perm': _0x5e89e4 }; }
function _0x18f945(_0x551916, _0x4f82e2) { const _0x348e3b = _0x3c4e5d, _0x1931b4 = { 'oGuty': function (_0x3c54f4, _0x1d36e5) { return _0x3c54f4 * _0x1d36e5; }, 'IemcC': function (_0x2192d4, _0x3c1730) { return _0x2192d4 > _0x3c1730; }, 'PTroA': function (_0x5e83fb, _0x104c4d) { return _0x5e83fb - _0x104c4d; } }, _0xd2e2a6 = _0x1931b4[_0x348e3b(0x214, 'eG0D')](_0x551916['n'], _0x551916['h']); if (_0x1931b4[_0x348e3b(0x189, 's]f!')](_0xd2e2a6, _0x4f82e2))
    throw new Error(_0x348e3b(0x1e9, 'M&AS')); const _0xfb047d = []; for (let _0x4ec0fb = 0x0; _0x4ec0fb < _0x551916['n']; _0x4ec0fb++) {
    _0xfb047d[_0x348e3b(0x19e, 'uIWX')]([_0x1931b4[_0x348e3b(0x139, 'T30i')](_0x4ec0fb, _0x551916['h']), _0x551916[_0x348e3b(0x1f0, 'h6X5')][_0x4ec0fb] * _0x551916['h'], _0x551916['h']]);
} if (_0x4f82e2 > _0xd2e2a6)
    _0xfb047d[_0x348e3b(0x116, 'xzDR')]([_0xd2e2a6, _0xd2e2a6, _0x1931b4[_0x348e3b(0x24a, 'h6X5')](_0x4f82e2, _0xd2e2a6)]); return _0xfb047d; }
const _0x531c97 = 0x8;
function _0x3f36a7(_0xe4a8ff, _0x54e904) { const _0x44e856 = _0x3c4e5d, _0x33733b = { 'LMjMS': function (_0x167dd3, _0x38ed53) { return _0x167dd3 < _0x38ed53; }, 'WeLhW': function (_0x156681, _0x4b58e7) { return _0x156681 > _0x4b58e7; }, 'lFOcY': function (_0x21398c, _0x56a1c6) { return _0x21398c * _0x56a1c6; }, 'NwngU': function (_0x234c65, _0x1f1b9d) { return _0x234c65 * _0x1f1b9d; }, 'Sjwyg': function (_0x45be00, _0x592755) { return _0x45be00 + _0x592755; }, 'bZmuM': function (_0x4f6fa1, _0x4f1dab) { return _0x4f6fa1 - _0x4f1dab; }, 'QEaNY': function (_0x51b112, _0x3c38ae) { return _0x51b112 <= _0x3c38ae; }, 'dSugs': function (_0x3b579c, _0x4575e0) { return _0x3b579c + _0x4575e0; }, 'UndFk': function (_0x3d3411, _0x3e7158) { return _0x3d3411 - _0x3e7158; } }, _0x47976f = []; for (let _0x4bd9f1 = 0x0; _0x33733b[_0x44e856(0xc5, 'eG0D')](_0x4bd9f1, _0xe4a8ff['n']); _0x4bd9f1++)
    _0x47976f[_0xe4a8ff[_0x44e856(0xcf, 'EFau')][_0x4bd9f1]] = _0x4bd9f1; const _0x376e23 = _0x33733b[_0x44e856(0x118, 'KMuw')](_0x54e904, _0x33733b[_0x44e856(0x121, '1muB')](_0xe4a8ff['n'], _0xe4a8ff['h'])) ? _0xe4a8ff['n'] : _0xe4a8ff['n'] - 0x1; _0x47976f[_0xe4a8ff['n']] = _0xe4a8ff['n']; const _0x250c92 = []; for (let _0x15525b = 0x1; _0x15525b <= _0x376e23; _0x15525b++) {
    const _0x37a6c = _0x33733b[_0x44e856(0x1a9, 'YsnY')](_0x15525b, _0xe4a8ff['h']);
    _0x47976f[_0x15525b] !== _0x33733b[_0x44e856(0x1af, '[XzL')](_0x47976f[_0x33733b[_0x44e856(0x142, 'w30W')](_0x15525b, 0x1)], 0x1) && _0x33733b[_0x44e856(0x101, 'laC)')](_0x37a6c + _0x531c97, _0x54e904) && _0x250c92[_0x44e856(0xed, 'ZN6&')]({ 'y': _0x37a6c, 'upperEnd': _0x33733b[_0x44e856(0x183, 'Vq^L')](_0x47976f[_0x33733b[_0x44e856(0x10a, 'Y*ut')](_0x15525b, 0x1)], 0x1) * _0xe4a8ff['h'], 'lowerStart': _0x33733b[_0x44e856(0x1d6, 'h6X5')](_0x47976f[_0x15525b], _0xe4a8ff['h']) });
} return _0x250c92; }
const _0x515320 = 0x3, _0x344506 = [0.42, 0.28, 0.14], _0x2738c0 = 0x7, _0x111218 = [0x1, 0.77, 0.63, 0.49, 0.35, 0.21, 0.07], _0x163dc5 = 0x3c;
function _0x59d2() { const _0x4e2d95 = ['oLRdRrNdO8kM', 'gHKotCoo', 'WPiNdK7dVwj2W4xdVConW7K', 'pLRdOZ4', 'luBdQqVdQSkXWQJcQCk9W4C', 'c8kWdf8G', 'fCk9qrCH', 'gYXhW43dNq', 'sHPcW77cOmkV', 'W69yW7mtW5y', 'WOVdQfxcISkZ', 'CKLfDM4', 'hN49w8kS', 'y1KUACkRf2K', 'W6ZdI13cK8oEpW', 'nCkCo8oxW6BdIGtdI8o3iHy', 'W7ZcKmouW4HAW7lcQG', 'kYqpntm', 'WPLgW5xdNYv5fSo/wMtdHW', 'hCkEW6ShW6DZbmoLjLdcJW', 'WRfRWQtcVGSCzSklpZndW6FdSW7cR8orW4aDW7VcVvNcNmkOCaviWOlcRSk1WORdUxiYWRxdVmoEzbVdUmoAW5L9pCodWRWIWO7dIHxdS8kEkaVdU8o5WPKaEMLeWQRcRM/cIa', 'WPSjeCoNW6a', 'WPvjWQSxwW', 'qXpcPCoqWOaBbspdNJFcUSozW4RdI8k8i184WPW5W7e', 'z8o9p8k/W6W', 'W696oSk5WQW', 'fNuGBSkt', 'hSkbc28t', 'W7BdMCopW6eIWRO', 'srhcRWjN', 'rCoCA8oihG', 'kqOomcG', 'dxOgwafiW43dQgSn', 'WPRcHhiyW74', 'lNaQaa', 'W4eBWORcRqS+CSkz', 'WRjbW7ddHtavWOu', 'W4xdTNtcOmob', 'f2G9Emkn', 'WOfGW41pWQZcQ8ks', 'CmkyW5/dRaC', 'WPqtW6JcL08', 'W5iaW4tcUg4', 'W5f2sq', 'tLH+W6GawSo/WPG', 'WP83oSoIW5u', 'umkmW4tdVdqIea', 'zh0FqSkr', 'F8kIEg3cHW', 'W4qaqdfHb8kIjSoxWPmA', 'WPRdPvJdICk6j8onzcr/', 'dCkuW7Cz', 'W6e+hteZEq', 'gbmfwCou', 'WPfeWPlcUai', 'kvRdOJzrWQSWbMBcNa', 'pCkPvXiFW7u', 'fXGsoG', 'EvfwWPOneYtdOG', 'jXm9BCopoW', 'qeGhxCkY', 'W4jkzmkIW5OmiCoUW4JcIq', 'EqtcJmkUWRLkAa', 'W5b8mSkRWR4', 'WP5gW4FcMs80v8kIbq', 'WQmdWP8', 'W4bLwX7cVgLWW5NdRSojW7hcUSka', 'b8o8oMVcGSo4WPNcJ1S', 'zLDbWPOl', 'WO90WQ4PBMtcMKldQa', 'xgzeW4iN', 'FqJcGSkHWQvB', 'WP7dQfpcHSkK', 'k8kXfMSE', 's0LqWQ0o', 'WQHPWPqIxG', 'oKddUH/dRmkMW6dcQmkOW4FdOa', 'iH86', 'tdvrW73cRa', 'W5hdKYTOWPa', 'pbKHEmoekSkyg8oDWR4F', 'WQfFW6f4WOq', 't0Wxv8k0', 'xqNcS8kzWOePbs/dNI3cP8oFW4RdI8oxi183WPu', 'WPjtW6xdPbq', 'kqHGW6ldVa', 'WPSada', 'iJiLjt8', 'WRaYWQfjWP19W5/cMgn3EW', 'hguI', 'xG54W7FcLq', 'hgtdTrr6', 'WPNcIva3W7xdNCk0fqdcK13cTSorrw46us9QW4ZcSt3dSdG', 'W4LKD8kWW4y', 'pLZdSsjxWRX4b3pcNmk4', 'W6ddTCo6W74P', 'WOddRKBcP8k3', 'rcNcTmoUWQ0', 'wcNcMCkZWQi', 'WRDxW5/dKdyC', 'WPlcU8o5Dv/dVW', 'WR9kW4ddTc8', 'oLVdVqtdOCkK', 'WQyqW53cSKDbiHVcUrxcSa', 'W4aCW7/cKxiW', 'W7rJW4axW74', 'WOnhW4tdId5txq', 'qmo+nSk3W5W', 'FGBcNSozWOe', 'i2NdQrFdVq', 'ywenCSks', 'e3WWFmk2', 'oH3cISkHWQHCjumt', 'WOqafSoJW7el', 'W69YsSkwW68', 'zSkDsrSkW5JcOG', 'tCkTW4JdNt8', 'h0JdTCkeW50LiYldTIRcIW', 'AsjWgmolW41PqYZdHSkEpJ8+', 'rHVcQSoqWPeG', 'W4nJW6adW7G', 'WP7dGe3cRmk8', 'WP0ShmomW6a', 'DN/dSgyHW6G', 'W6uTW77cRhy', 'W7L+omoVWOhdKMfuWRS', 'ldCKzSop', 'WQxcKSokmWJcPam', 'uSkIBwZcSq', 'rqNcQSosWPCmbY/dHc7cT8oEW5a', 'W6/dGCoqW7Kb', 'bNmLoCkBCCosi8kFnHhcMeNcL2SjqNq', 'hX0Y', 'sXvmW7lcQ8kKymkYW5qjW7OcoCkz', 'W7eJW7VcTvC', 'dmkqW7PvW7r3umoMp1tcMq', 'WQ9vWQ4pAG', 'WRJdL8otW7r0', 'WPhcV8o/xvxdV0eIrXS', 'W4fUsHRcHgLBW5ldV8om', 'dKddUZldUG', 'WRXxbmk5hMC5WP4', 'W7STpSkbdq', 'WQT4W6ddVdq', 'W43dOGrGWRekWPiTg28', 'WObCWPtcKG', 'cCkDW7exW6v6ASoLpuxcKMr7oCkbWPOkiCkGfNtcPLJcLa', 'nYKsodW', 'wc9AcInNW6hdGe0lW7WzWO3dKgNcH8k0DCoQWQrqWRdcMCkB', 'W5FcV8o8W6rG', 'WQ5NW7qEW4TzW5xdPG', 'ECotx8oTb08A', 'ymo+vciUW7NcK1O', 'W7jJW7iE', 'iuRdPGRdP8k3', 'wmo+sSoWha', 'W7icBYPB', 'W58oW6hdMh4LW7/cQmo/WORcOcjJnmkcWQCYja', 'duNdKZddHW', 'kSkwimocW7hdHW', 'WQBdISkjWP8rWO3dVmoFWQvTW4Ofaa', 'WQLtW4y', 'iSk5wWehW7G', 'EL8CCW', 'ohiRwSkbWOGS', 'kNRdUqG', 'WQhdHNRcUSkq', 'f8kvcgS0', 'W7ZcMCo5W51k', 'BfGaDG', 'WQRdT8oHWOj9ySoNAG', 'W7hcM8otW4jgW5G', 'fXOgrmoZ', 'WPv2WQS0F3xdVeJdPXzH', 'FHLmW6xcKa', 'ySo4aeDyWQ3dSgvmW63cNJddJG', 'fhi3zCkg', 'aCkycM83', 'FWtcVtzq', 'vCkIBG', 'WOngWPlcIc0/dmkSabX6', 'WOneW5ddGJrOCmo1vq', 'W6PUAmkjW6W', 'rbhdPmouWOqMhI3dGG', 'W5TJW4e+W64', 'zK8bFmkThG', 'y8kfW5BdQZC', 'W6eYaSkpaG', 'vKW0jquQl8kv', 'W6WiW67cLfa', 'ox4ix8k3', 'nWq9pHb0mSk8cxhcJZ0o', 'W6xcM8ocW4a', 'FGf2laDnW6xdP2KXW5GMWQNdQKpcMmkvqSolWPfXWO/cOCkTW7VcLCoYWRtdJdZdHrC/aLjvuCo2rCkLWRb3kJKhWPz8rf/cP8k7pCkQASkNW6foWQZdJCork18GgW', 'dwZdRIldGa', 'r8ocuJ9QmZdcPupdU8kq', 'DSoyF8oSfa', 'BJfYWRZcG8kjwa', 'hr8+W5NcRuVdPaxcL8kQzSklW7TkqLtcSWX1FCoFD05Z', 'WQbVWQCjta', 'uWdcQSk2WRC', 'xWBcMHDh', 'WO8jf8oMW6qpvmkUcmoLtG', 'nSk3dmoeW4O', 'WOrNW45cWQdcGCkg', 'WOK2W7BcL3q', 'bHCawCoX', 'hmk7bCoIW7y', 'WPzFW53dSaa', 'q8kQtKtcJq', 'gri/W43cRvq', 'oK0ut8kD', 'e8k1cwSh', 'WRX9WOOfDq', 'WOZdP8o9W4bh', 'W5zcCmk3W5O', 'WOVdQ0NcM8k1i8kzzcDUtq', 'DxVdTK4RW6JcRv8dza', 'WOZcKguxW7O', 'WOPSWRmVCN/cOK7dPqO', 'gguKBCkl', 'nxBdSahdT0C', 'hSkeW60D', 'WRfTWOqwFq', 'CLvgW4C7', 'W4e/p8kPka', 'CcBcTYC', 'WRVdS8oXW7DKBCo0pfm', 'b088xCku', 'W5vmD8k2W5WBACoHW5/cG8oF', 'WObnW4n7WPe', 'W4nPCCkIW68', 'yaFcNCogWQq', 'W6BdN8oyW6K4WRJdMeddNYuJWPddNa', 'W5TUW4eZW4u', 'W4qBrYPSbq', 'BYr+gmoiWPexjc3dQ8k9', 'WOvyWQ4QDa', 'W4ZcQmo/W5DO', 'qJzQF8k+ymoPgCk/', 'fbivjr4IzSkXFmoREa', 'FNFdPwuWW6pcTW', 'W7jsxZhcKq', 'hJG6yCol', 'wwufA8kp', 'W54CFc12b8oOlmot', 'WOzVW51FWQBcHCkynGRdVdxcJW', 'zCkaBgJcRW', 'W5BdHsTVWO8', 'y8owt8ojgG', 'oKpdPG7dQG', 'EHPfW5FcRW', 'vG7cVmktWRG', 'vePrycqQcCkNBSoL', 'EZjncGG', 'zmkeqwdcOa', 'xCk/W5FdNIm', 'ehxdLWhdGW', 'W6u4iHOu', 'jCkYpSojW60', 'WPTHW5XyWRFcGCozdHxdVtm', 'WPaKce/dUgv6W6BdJCo+W6C', 'W5SkwYr2cG', 'WPPCW5pdHq', 'W5PCs8k0W4yGESkfm8o7', 'lryDW5pcMW', 'mSknsrKd', 'CCkHW6xdJYu', 'CL5vwwK', 'W4FdOsPUWQu', 'aMSNzCkCDCksl8kgpry', 'yINcSt5D', 'CWtcH8kQWP5By3bl', 'WPToWQFdGumPW5dcSSo0WO8', 'rhDDW6Cl', 'E3ddPMG8W4NcVW', 'WRjgW6jTWQC', 'ngeMtCkQ', 'zSovtCo3ee9ztG/dIdi', 'W6FcN8oh', 'yLjmWO0g', 'ub3cMafK', 'WQHDW4tdHserW5fKvHxcNG', 'W7JdGq1oWQOXW5Kwbvi5WOBdKg9GWOldQSkWi8oCoMdcISoBWR/dK8kHlLZcMsr7x8klzSkSW5yzWRTkWRSHWPC', 'WOjAdxmXv8k+FCoMWOe4ufq+', 'rmkCW5tdPG', 'W4agutDQ', 'v8oWw8oxmG', 'gSkrcMS6kG', 'wKW2uSkH', 'W5r+wGVcOa', 'WO8admohW6OnyCkNamo5', 'lmkIW6yXW6u', 'of3dOdvsWRa7dwe', 'WQFcT8oMAM4', 'W7ddG8ooW708WQ3dSL7dJI0IW57dJCoeWPyWtmkwWRuHW7pdQCkt', 'WQBdISkcWP8uWONdUSoZWQPtW5Ggmq', 'pw8ryCkq', 'W47dKbX9WQy', 'aaTpW43dVG', 'wXhcJYvr', 'WQVdGColW45O', 'W7BdGSoiW7OVWRJcSepdJc00', 'xrFcOmodWO0', 'W6edpSkSeMi', 'W5morYHNda', 'WQrcW55GWRm', 'sctcQCocWQG', 'WOatfSoHW5C', 'ECkJBKtcGq', 'W7Gii8k+fNOYWQFdIrKnfKbOe8o/', 'amkdihK7', 'D0vTEeOL', 'n8kGvHOz', 'W5fSW4W5W5q', 'WPriWPxcKsS0', 'l34VrG', 'vfjvWP4R', 'rHPfW7tcVmkfCW', 'Bt5cW4pcHq', 'vGfzW7lcJG', 'W6u+gJeVzq', 'A1ldLNW0', 'mhiMt8kmWPa', 'xvVdOwaf', 'w0vGW608wa', 'WRlcQ8oZFha', 'xbHiW7lcOq', 'Fmkdq0a', 'D8oBxmkLau8hurBdGZmL', 'xrdcRSo7WQC', 'lK7dLsldQW', 'W4LhW5qZ', 'cXGomaKV', 'W5zwCCkS', 'kuBdHb7dPW', 'WQmjW5tcTKnF', 's3bIW6G6', 'i2xdMZxdOG', 'r8kHD3hcOmoTW6lcUwldUbq', 'WOKidCogW4K', 'W5SwW6pcHhKHWR/cPmoMWOhcPW', 'EGT3ksO', 'WPfWWROYDa', 'rCkLe2iZgXK', 'fdKSeZS', 'aN0bwCkW', 'WObJWQ/cUZ8', 'sWzaW6BcJCkNDmk6W58', 'WOXBW4/dGa', 'WOP8W5/dNc4', 'rmkesKlcSG', 'bKCNzCkB', 'yuTwWOy', 'W60Pfsesya5+fG', 'W4xdVG9VWROxWOqQdhm', 'aSkLW4WXW6a', 'lsPGW77dPq', 'WQifomkQfN44WQFdJLm', 'u8kJBNdcSG', 'qmonn8kXW44', 'WPlcS8oTEf/dO1aPxaO', 'WPdcP1K4W6OlWQi0gx8d', 'W6JdRLlcT8ol', 'ECoFvSoIb0i', 'lgddJWnX', 'W4bwtHpcOa', 'WOzVW51FWQBcHCkykqBdSsBcJ8ox', 'kNZdQXtdOeOvW6tdM8kGma', 'kSkhngql', 'DSo7smoPgW', 'AmoziCk0W7dcNa', 'Ct7cNSkHWR4', 'rKtdJ1Sa', 'pCkvvrGg', 'WO5IW4zfWQy', 'yffIB0KUCCkAh3NdGYu9W4O', 'xGtcHcfxgti', 'WRFcGfi2W5C', 'FmkMW43dHIe', 'tmoXdSkq', 'W5b2rWxcQG', 'WOfyW5L6WRO', 'AvawwSk+', 'W6a2bdKPEsr8cG', 'WO3cIvy2W7e', 'CCoUf8kzW7y', 'EfneWOKgistdQmogn8opjmoKvSkjCNfECfTE', 'C3max8kb', 'W5mzmWWW', 'W4HxhCoIW5RcIsC', 'fmkHyXWY', 'h8klnmonW7a', 'W54busz6lCoP', 'WOrxW4vhWRK', 'yIpcVsnf', 'WO3dKmoIW5r4', 'W6KhpCkOcwqOWRRdKXThwffKeq', 'FKPTWPqm', 'W7KUbZ4', 'CSoFtmoqgKqaeKS', 'W6BdRmonW6qK', 'iSklp8oMW6G', 'WRHZW4hdMYO', 'WPaYW5ZcU0O', 'W4CTW5NcKN8', 'W4FdOSk/jWVdLeWwrXL/', 'Ev8nB8k1eW', 'meeboSk4u8oY', 'sc1Fjaa', 'sSoliCk0W5e', 'WPJcTCkRFvVdV0mMta', 'W49oy8kJW5OTkCoVW4tcMmohWORcHmoMWRyUWQxdNCoiWP7dIa', 'yejUE28TzCksfa', 'tYxcOmkbWR4', 'W6KpnSkTa3G4WRVdNHK', 'W7StW6hcJ30', 'WQjSW4fSWR8', 'B8o3lCk6W48', 'WP3dKSolW6Tm', 'W700hW', 'W4S4W6BcMNi', 'emkvbYW7maVcVNa', 'uSkfW5pdIGC']; _0x59d2 = function () { return _0x4e2d95; }; return _0x59d2(); }
function _0x19b332(_0x3b78fb, _0x73c8ec, _0x2cebbb, _0x3e2773) { const _0x1996d3 = _0x3c4e5d, _0x42d124 = { 'JbhFk': _0x1996d3(0x247, 'T30i'), 'DqxbJ': function (_0x42fd3a, _0x2567e2, _0x1bcfef, _0x4f7491, _0x264ad6, _0xf3f464, _0xfd89b4) { return _0x42fd3a(_0x2567e2, _0x1bcfef, _0x4f7491, _0x264ad6, _0xf3f464, _0xfd89b4); }, 'cAplh': _0x1996d3(0x207, 'xN3A'), 'gmlsq': function (_0x2db256, _0x256a5b, _0x4a11d5, _0x2b5f0e, _0x53a6ca, _0x1193ad) { return _0x2db256(_0x256a5b, _0x4a11d5, _0x2b5f0e, _0x53a6ca, _0x1193ad); }, 'nRfcz': function (_0x4f5faa, _0x3dbf02) { return _0x4f5faa === _0x3dbf02; }, 'UoZGi': _0x1996d3(0xe1, 'KMuw'), 'sayzb': function (_0x830016, _0x45ab67) { return _0x830016 >= _0x45ab67; }, 'vKnJk': function (_0x336f47, _0x5a79f5) { return _0x336f47 >> _0x5a79f5; }, 'PfYIx': function (_0x469041, _0x5c2c46) { return _0x469041 !== _0x5c2c46; }, 'YVOzJ': _0x1996d3(0xd1, 'Dp#6'), 'lTRDd': function (_0x1cc38c, _0x17941b, _0x355d8b, _0x1f4799, _0x2fab95, _0x54d3d3) { return _0x1cc38c(_0x17941b, _0x355d8b, _0x1f4799, _0x2fab95, _0x54d3d3); }, 'LYobN': function (_0x124d7a, _0x968862) { return _0x124d7a(_0x968862); }, 'iVpPn': function (_0x27c246, _0x9b6034) { return _0x27c246 * _0x9b6034; }, 'EHBAh': function (_0x51b9e7, _0x3dd804, _0xd2a9b, _0x1281f3, _0x418cfd, _0x1b011b, _0x59be5d) { return _0x51b9e7(_0x3dd804, _0xd2a9b, _0x1281f3, _0x418cfd, _0x1b011b, _0x59be5d); }, 'ElppH': function (_0xf4fff0, _0x4a8794) { return _0xf4fff0 / _0x4a8794; }, 'daMMj': function (_0x4f42ff, _0x15fbf5) { return _0x4f42ff * _0x15fbf5; }, 'ZdTCi': function (_0x2cfa16, _0x268161) { return _0x2cfa16 < _0x268161; }, 'rwCui': _0x1996d3(0x1b5, 'AmNq'), 'fDqEj': function (_0x5af79f, _0x4224f3) { return _0x5af79f | _0x4224f3; }, 'BALIB': function (_0x4213bf, _0x232bf0) { return _0x4213bf >= _0x232bf0; }, 'kKbiK': function (_0x1b8982, _0x4cf451) { return _0x1b8982 * _0x4cf451; }, 'XlRNT': function (_0x444074, _0x518d65, _0x1c6c76, _0x251ffd, _0x8f659f, _0xbf6922, _0x3ec149) { return _0x444074(_0x518d65, _0x1c6c76, _0x251ffd, _0x8f659f, _0xbf6922, _0x3ec149); }, 'CcWUu': function (_0x13467f, _0x226b1b) { return _0x13467f >= _0x226b1b; }, 'pJHAq': function (_0x52d9a8, _0x228688) { return _0x52d9a8 !== _0x228688; }, 'NpJdB': _0x1996d3(0xda, 'Cjei'), 'JyYqA': function (_0x2ce783, _0xa4364e) { return _0x2ce783 - _0xa4364e; }, 'lcVLO': function (_0x3aa5e7, _0x541b02) { return _0x3aa5e7 + _0x541b02; }, 'LLwJg': function (_0x90f75e, _0x25a9bc) { return _0x90f75e === _0x25a9bc; }, 'wCurd': function (_0x55e74d, _0x563469, _0x122ff5, _0x5d77f7, _0x2748db, _0x26bef5, _0x446e2e) { return _0x55e74d(_0x563469, _0x122ff5, _0x5d77f7, _0x2748db, _0x26bef5, _0x446e2e); }, 'BiusT': function (_0x3950d4, _0x9279fb, _0x2d92e3, _0x791207, _0x3a203b, _0x17890f, _0x134c88) { return _0x3950d4(_0x9279fb, _0x2d92e3, _0x791207, _0x3a203b, _0x17890f, _0x134c88); }, 'MmlGB': function (_0xedc604, _0x560072, _0x5a5164, _0x4b4f61, _0x16b97b, _0x477d46, _0x43e430) { return _0xedc604(_0x560072, _0x5a5164, _0x4b4f61, _0x16b97b, _0x477d46, _0x43e430); }, 'ZHKGs': _0x1996d3(0x232, '$^0i'), 'jlmqM': function (_0x18cda3, _0x4b5003) { return _0x18cda3 * _0x4b5003; }, 'wdLGN': function (_0x440fa7, _0x420062, _0x1fac04, _0x801b62, _0x32bc50, _0x18c6a5, _0x594839) { return _0x440fa7(_0x420062, _0x1fac04, _0x801b62, _0x32bc50, _0x18c6a5, _0x594839); }, 'hvneR': _0x1996d3(0x1ee, 'YWa6'), 'sDLDF': function (_0x3b5d8a, _0x1003c7, _0x462028, _0x296da2, _0x4aad20, _0x52964a, _0x47c0ea) { return _0x3b5d8a(_0x1003c7, _0x462028, _0x296da2, _0x4aad20, _0x52964a, _0x47c0ea); }, 'BJcRA': function (_0x33f127, _0x5b9cfc, _0x170540, _0x3ecc7e, _0x12e238, _0x1ede4a, _0x140640) { return _0x33f127(_0x5b9cfc, _0x170540, _0x3ecc7e, _0x12e238, _0x1ede4a, _0x140640); }, 'qzYfQ': function (_0x5d22b9, _0x9b54eb, _0x468deb, _0x5c46b3, _0x1f209b, _0x1e6b62) { return _0x5d22b9(_0x9b54eb, _0x468deb, _0x5c46b3, _0x1f209b, _0x1e6b62); }, 'OEcmA': function (_0x5c6e7b, _0x469a5b, _0x2795d7, _0x5ef746, _0x4f4b47, _0x5d410b, _0x1dfb3a) { return _0x5c6e7b(_0x469a5b, _0x2795d7, _0x5ef746, _0x4f4b47, _0x5d410b, _0x1dfb3a); }, 'nWpYH': function (_0x4de36b, _0x8adf43) { return _0x4de36b + _0x8adf43; }, 'amuBL': function (_0x3cc495, _0xc44693, _0xa31b0b, _0x427383, _0xad2d99, _0x2fb6fc, _0x1ae40a, _0x3d4d55, _0x3f36a3) { return _0x3cc495(_0xc44693, _0xa31b0b, _0x427383, _0xad2d99, _0x2fb6fc, _0x1ae40a, _0x3d4d55, _0x3f36a3); }, 'yDoSr': _0x1996d3(0x100, '$^0i'), 'sySNO': _0x1996d3(0x1e7, 'mk9('), 'IaTSV': function (_0x381c95, _0xc7c828) { return _0x381c95 < _0xc7c828; }, 'eJsfP': function (_0x47bee6, _0x89d626) { return _0x47bee6 - _0x89d626; }, 'PJCcc': function (_0x56813a, _0x41c230, _0x5be92c, _0x41ff8c, _0x368158, _0x2d0fee, _0x8a19fa, _0x147ba3) { return _0x56813a(_0x41c230, _0x5be92c, _0x41ff8c, _0x368158, _0x2d0fee, _0x8a19fa, _0x147ba3); }, 'HJDGR': function (_0xb9733f, _0x268e70, _0x3c40b8, _0x450474, _0x457b71, _0x3467d2, _0x34c777) { return _0xb9733f(_0x268e70, _0x3c40b8, _0x450474, _0x457b71, _0x3467d2, _0x34c777); }, 'cWNle': function (_0x18cb64, _0x317226, _0x57a609, _0x3d904a, _0x2ed5af, _0x2b588b, _0x2e1733) { return _0x18cb64(_0x317226, _0x57a609, _0x3d904a, _0x2ed5af, _0x2b588b, _0x2e1733); }, 'yLTqp': _0x1996d3(0x1f5, 'Vq^L'), 'DBydX': function (_0x2b632a, _0x50c858, _0x3ed364, _0x49dccb, _0x261abb, _0x1201d5) { return _0x2b632a(_0x50c858, _0x3ed364, _0x49dccb, _0x261abb, _0x1201d5); }, 'wRBfP': function (_0x11c4a1, _0x44dcdb) { return _0x11c4a1 * _0x44dcdb; }, 'luhcA': function (_0x174abe, _0x4f6741) { return _0x174abe - _0x4f6741; }, 'KcndV': function (_0x34a2da, _0x406963) { return _0x34a2da(_0x406963); }, 'aSKSE': function (_0x50f7d4, _0x3c32ab) { return _0x50f7d4(_0x3c32ab); }, 'WeQSs': function (_0x5d366a, _0x2a989f) { return _0x5d366a(_0x2a989f); }, 'aAjgU': function (_0x2a6c7c, _0x368ee2) { return _0x2a6c7c(_0x368ee2); } }, _0x146d8b = _0x3b78fb[_0x1996d3(0x238, 'w30W')]; if (_0x3e2773[_0x1996d3(0x17b, '3Qdx')] === 0x0 || !_0x146d8b)
    return; const _0x258634 = _0x3b78fb[_0x1996d3(0x1fb, 'gNU$')], _0x5e55d6 = _0x3b78fb[_0x1996d3(0x251, 'Dp#6')], _0x4d05a4 = 0x2 * _0x2738c0, _0x14d329 = [], _0x1b46c2 = _0x228b22 => { const _0x36b4de = _0x1996d3; if (_0x42d124[_0x36b4de(0x1c0, 'RgTs')](_0x36b4de(0x1a4, '[XzL'), _0x36b4de(0x1e1, '[XzL')))
    _0x43120b ? (_0x394fd8(_0x2b3994, 0x0, _0xc579aa, 0x80, _0x36b4de(0xc3, 'ZoTP')), _0x23ba63(_0x45c2e9['c'], _0x4b898f, _0x41bb27, 0x0, _0x42725a, _0x42d124[_0x36b4de(0x1d1, 'iq3L')])) : (_0x42d124[_0x36b4de(0x10d, 'FmCC')](_0x5ee301, _0x522e45['c'], _0x42a825, _0x37feba, 0x0, _0x27254c, _0x42d124[_0x36b4de(0x1cf, 'YsnY')]), _0x42d124[_0x36b4de(0xd8, 'E#1%')](_0x4b9f30, _0x4d397e, 0x0, _0x37a2d1, 0x80, _0x42d124[_0x36b4de(0x1b0, 'bDxN')]));
else {
    const _0x25d116 = _0x146d8b[_0x36b4de(0xf8, 'c%47')](_0x42d124[_0x36b4de(0x1b8, 'xN3A')]);
    _0x14d329[_0x36b4de(0x25a, 'WPGe')](_0x25d116), _0x25d116[_0x36b4de(0x13e, 'w30W')] = _0x258634, _0x25d116[_0x36b4de(0x1eb, 'uIWX')] = _0x228b22;
    const _0x3f830b = _0x25d116[_0x36b4de(0x132, 'ai^W')]('2d');
    if (!_0x3f830b)
        throw new Error(_0x36b4de(0x1aa, 'i&Lz'));
    return _0x3f830b[_0x36b4de(0x192, 'gNU$')] = ![], { 'c': _0x25d116, 'x': _0x3f830b };
} }, _0x464b3a = (_0x2a5091, _0x1700fa, _0x64bd26, _0x45bb7d, _0x55177d, _0x3d7748, _0x9e3a7f = 0x1, _0x1189e2 = _0x55177d) => { const _0x3f1a44 = _0x1996d3; _0x64bd26['x'][_0x3f1a44(0x24b, 'FmCC')] = _0x3d7748, _0x64bd26['x'][_0x3f1a44(0x21e, 'a6aj')] = _0x9e3a7f, _0x64bd26['x'][_0x3f1a44(0x1ac, 'Qgh$')](_0x2a5091, 0x0, _0x1700fa, _0x258634, _0x55177d, 0x0, _0x45bb7d, _0x258634, _0x1189e2); }, _0x480191 = (_0x3ff7dc, _0xb69361, _0x1008f5, _0x1a76e2, _0x370683) => { const _0x37253f = _0x1996d3; if (_0x37253f(0x246, 'iCOp') !== _0x37253f(0x201, 'gNU$'))
    _0x3ff7dc['x'][_0x37253f(0x213, 's]f!')] = _0x370683, _0x3ff7dc['x'][_0x37253f(0xd9, 'ai^W')] = 0x1, _0x3ff7dc['x'][_0x37253f(0x11f, 'Vq^L')] = _0x37253f(0x1d9, 'iq3L') + _0x1a76e2 + ',' + _0x1a76e2 + ',' + _0x1a76e2 + ')', _0x3ff7dc['x'][_0x37253f(0x1e3, '1muB')](0x0, _0xb69361, _0x258634, _0x1008f5);
else {
    const _0x5e30e3 = _0x37e0be[_0x37253f(0x198, 'xsXL')](_0x126887[_0x3f2a24]);
    if (_0x5e30e3 < 0x0)
        return null;
    _0x5441fc = (_0x363d52 << 0x6 | _0x5e30e3) & 0xffff, _0xa070e7 += 0x6, WjOzpa[_0x37253f(0x18c, 'laC)')](_0x4a6888, 0x8) && (_0x55c0e0 -= 0x8, _0x2a8a66[_0xa221d5++] = WjOzpa[_0x37253f(0xf3, '3a$e')](_0x2b011d, _0x1aa84d) & 0xff);
} }, _0x341bcc = (_0x2c8ce5, _0x173f8c, _0x337c15, _0x5eeba7, _0x4d7631) => { const _0x475c1a = _0x1996d3; if (_0x42d124[_0x475c1a(0x149, 'RgTs')](_0x42d124[_0x475c1a(0xfd, 'EFau')], _0x475c1a(0x240, 'XZrY')))
    _0x2c8ce5 ? (_0x42d124[_0x475c1a(0xca, 'x&0R')](_0x480191, _0x5eeba7, 0x0, _0x4d7631, 0x80, _0x475c1a(0xff, 'h6X5')), _0x42d124[_0x475c1a(0xcc, '[XzL')](_0x464b3a, _0x173f8c['c'], _0x337c15, _0x5eeba7, 0x0, _0x4d7631, _0x475c1a(0xea, 'p1NC'))) : (_0x42d124[_0x475c1a(0x1df, '9bFn')](_0x464b3a, _0x173f8c['c'], _0x337c15, _0x5eeba7, 0x0, _0x4d7631, _0x475c1a(0x1e8, 'xsXL')), _0x480191(_0x5eeba7, 0x0, _0x4d7631, 0x80, _0x42d124[_0x475c1a(0x1f3, 'WPGe')]));
else
    for (const _0xa799dd of _0x348785) {
        _0xa799dd[_0x475c1a(0x174, 'JvBR')] = 0x0, _0xa799dd[_0x475c1a(0x1fe, 'Vq^L')] = 0x0;
    } }; try {
    const _0x4ba6e6 = _0x3e2773[_0x1996d3(0x210, '3a$e')](({ y: _0x289bd5 }) => { const _0x809b35 = _0x1996d3, _0xfded2e = _0x42d124[_0x809b35(0x1c8, 'h6X5')](_0x1b46c2, _0x42d124[_0x809b35(0x18d, 'bDxN')](0x2, _0x531c97)); return _0x42d124[_0x809b35(0x11a, '9bFn')](_0x464b3a, _0x3b78fb, _0x289bd5 - _0x531c97, _0xfded2e, 0x0, _0x42d124[_0x809b35(0x10f, '9bFn')](0x2, _0x531c97), _0x809b35(0x1c9, 'xzDR')), _0xfded2e; }), _0x2d1ddb = _0x1b46c2(0x8), _0x65a7a5 = _0x1b46c2(0x8), _0x40e93d = _0x42d124[_0x1996d3(0x1f6, 'iJ]Z')](_0x1b46c2, 0x2), _0x8ff58a = _0x1b46c2(0x2), _0x50b261 = _0x42d124[_0x1996d3(0x17c, 'YWa6')](_0x1b46c2, 0x2), _0x3316a0 = _0x1b46c2(0x2), _0x2038a7 = _0x1b46c2(0x2), _0x1cbf8b = _0x1b46c2(0x2), _0x2671e9 = _0x42d124[_0x1996d3(0x1ec, 'xN3A')](_0x1b46c2, _0x4d05a4), _0x44aa7c = _0x1b46c2(_0x4d05a4), _0x260fb9 = _0x1b46c2(_0x4d05a4), _0x1fdd61 = _0x1b46c2(_0x4d05a4), _0x1f5b48 = _0x1b46c2(_0x4d05a4), _0x105ba8 = _0x42d124[_0x1996d3(0xe3, 'AmNq')](_0x1b46c2, _0x4d05a4), _0xbb7b0b = _0x1b46c2(_0x4d05a4);
    _0x3e2773[_0x1996d3(0x188, 'E#1%')](({ upperEnd: _0xea557d, lowerStart: _0x5d8040 }, _0x59760c) => { const _0x1086ac = _0x1996d3, _0x2246e2 = _0x4ba6e6[_0x59760c], _0x27ec5c = _0xea557d + 0x4 <= _0x5e55d6, _0x1b170e = _0x42d124[_0x1086ac(0x10b, 'Vq^L')](_0x5d8040, 0x4); if (_0x27ec5c) {
        if (_0x42d124[_0x1086ac(0x16a, 'ZoTP')](_0x42d124[_0x1086ac(0x202, 'p1NC')], _0x1086ac(0x206, 'T30i'))) {
            const _0x28351e = _0x38e5d9[_0x1086ac(0x1f9, 'laC)')](_0x42d124[_0x1086ac(0x1e0, 'a6aj')]);
            _0x159266[_0x1086ac(0x170, 'gNU$')](_0x28351e), _0x28351e[_0x1086ac(0x12d, 'xsXL')] = _0x3ca5f8, _0x28351e[_0x1086ac(0x21f, '[XzL')] = _0x32b9e8;
            const _0x5ed24e = _0x28351e[_0x1086ac(0x241, 'i&Lz')]('2d');
            if (!_0x5ed24e)
                throw new _0xa17841(_0x1086ac(0x1f7, 'ZoTP'));
            return _0x5ed24e[_0x1086ac(0x1ab, 'eG0D')] = ![], { 'c': _0x28351e, 'x': _0x5ed24e };
        }
        else
            _0x42d124[_0x1086ac(0x1bd, 'Jv6[')](_0x464b3a, _0x2cebbb, _0x42d124[_0x1086ac(0xf7, 'w30W')](_0xea557d, 0x4), _0x2d1ddb, 0x0, 0x1, _0x42d124[_0x1086ac(0x160, '1muB')]), _0x464b3a(_0x2cebbb, _0x42d124[_0x1086ac(0x111, 'uIWX')](_0xea557d, 0x3), _0x2d1ddb, 0x2, 0x1, _0x42d124[_0x1086ac(0x1b4, '[XzL')]), _0x464b3a(_0x2cebbb, _0xea557d - 0x1, _0x2d1ddb, 0x4, 0x1, _0x42d124[_0x1086ac(0x205, 'Y*ut')]), _0x42d124[_0x1086ac(0x177, 'YsnY')](_0x464b3a, _0x2cebbb, _0xea557d, _0x2d1ddb, 0x6, 0x1, _0x42d124[_0x1086ac(0xfc, 'p1NC')]);
    } _0x1b170e && (_0x464b3a(_0x2cebbb, _0x5d8040 + 0x3, _0x2d1ddb, 0x1, 0x1, _0x42d124[_0x1086ac(0x17d, 'laC)')]), _0x42d124[_0x1086ac(0x165, 'FmCC')](_0x464b3a, _0x2cebbb, _0x5d8040 - 0x4, _0x2d1ddb, 0x3, 0x1, _0x42d124[_0x1086ac(0x205, 'Y*ut')]), _0x464b3a(_0x2cebbb, _0x5d8040, _0x2d1ddb, 0x5, 0x1, _0x1086ac(0x125, '3Qdx')), _0x464b3a(_0x2cebbb, _0x5d8040 - 0x1, _0x2d1ddb, 0x7, 0x1, _0x1086ac(0x215, 'YWa6'))); for (const _0x286b00 of [![], !![]]) {
        if (_0x42d124[_0x1086ac(0x141, 'bDxN')](_0x1086ac(0x21c, 'iCOp'), _0x1086ac(0x1a1, 'Cjei'))) {
            const _0x55de2e = _0x286b00 ? _0x515320 : _0x2738c0, _0x47db03 = _0x286b00 ? _0x344506 : _0x111218, _0x417d6f = _0x531c97 - _0x55de2e, _0x47f450 = _0x42d124[_0x1086ac(0x225, 'WPGe')](0x2, _0x55de2e);
            _0x341bcc(_0x286b00, _0x2d1ddb, 0x0, _0x65a7a5, 0x8), _0x42d124[_0x1086ac(0x16f, '3a$e')](_0x464b3a, _0x65a7a5['c'], 0x0, _0x40e93d, 0x0, 0x2, _0x42d124[_0x1086ac(0x1a2, 'iCOp')]), _0x42d124[_0x1086ac(0x22f, 'RgTs')](_0x464b3a, _0x65a7a5['c'], 0x2, _0x40e93d, 0x0, 0x2, _0x1086ac(0x24e, '3Qdx')), _0x464b3a(_0x40e93d['c'], 0x0, _0x8ff58a, 0x0, 0x2, _0x1086ac(0x1ca, 'ZN6&')), _0x42d124[_0x1086ac(0x1c3, 'iq3L')](_0x464b3a, _0x65a7a5['c'], 0x0, _0x8ff58a, 0x0, 0x2, _0x1086ac(0x1bb, 'Dp#6')), _0x42d124[_0x1086ac(0x155, 'i&Lz')](_0x464b3a, _0x40e93d['c'], 0x0, _0x50b261, 0x0, 0x2, _0x1086ac(0x164, '[XzL')), _0x464b3a(_0x65a7a5['c'], 0x2, _0x50b261, 0x0, 0x2, _0x1086ac(0x1f4, 'eG0D'));
            if (_0x286b00) {
                for (const _0x1ff317 of [_0x8ff58a, _0x50b261]) {
                    _0x42d124[_0x1086ac(0x144, 'mk9(')](_0x464b3a, _0x1ff317['c'], 0x0, _0x3316a0, 0x0, 0x2, _0x42d124[_0x1086ac(0x1a0, 'c%47')]), _0x480191(_0x3316a0, 0x0, 0x2, 0x2 * _0x163dc5, _0x42d124[_0x1086ac(0x13a, 'JvBR')]), _0x480191(_0x3316a0, 0x0, 0x2, _0x42d124[_0x1086ac(0x239, 'c%47')](0x2, _0x163dc5), _0x1086ac(0x172, 'T30i')), _0x42d124[_0x1086ac(0xe0, 'mk9(')](_0x464b3a, _0x3316a0['c'], 0x0, _0x1ff317, 0x0, 0x2, _0x42d124[_0x1086ac(0x1ad, 'Vq^L')]);
                }
                _0x42d124[_0x1086ac(0xdf, 'iCOp')](_0x464b3a, _0x65a7a5['c'], 0x4, _0x3316a0, 0x0, 0x2, _0x42d124[_0x1086ac(0x112, 'Cjei')]), _0x464b3a(_0x65a7a5['c'], 0x6, _0x3316a0, 0x0, 0x2, _0x42d124[_0x1086ac(0x124, 'iq3L')]), _0x42d124[_0x1086ac(0x168, 'h6X5')](_0x464b3a, _0x3316a0['c'], 0x0, _0x2038a7, 0x0, 0x2, _0x1086ac(0x1c6, 'Cjei')), _0x464b3a(_0x2038a7['c'], 0x0, _0x3316a0, 0x0, 0x2, _0x1086ac(0xdb, 'bDxN')), _0x42d124[_0x1086ac(0x173, 'ZN6&')](_0x480191, _0x3316a0, 0x0, 0x2, 0xff, _0x42d124[_0x1086ac(0x128, 'E#1%')]), _0x42d124[_0x1086ac(0xe5, 'XZrY')](_0x464b3a, _0x3316a0['c'], 0x0, _0x8ff58a, 0x0, 0x2, _0x42d124[_0x1086ac(0x19a, 'E#1%')]), _0x42d124[_0x1086ac(0x14e, 'Y*ut')](_0x464b3a, _0x3316a0['c'], 0x0, _0x50b261, 0x0, 0x2, _0x1086ac(0x14a, 'ZoTP'));
            }
            !_0x27ec5c && (_0x480191(_0x8ff58a, 0x0, 0x1, 0x0, _0x1086ac(0x13d, 'c%47')), _0x480191(_0x50b261, 0x0, 0x1, 0x0, _0x42d124[_0x1086ac(0x17d, 'laC)')]));
            !_0x1b170e && (_0x42d124[_0x1086ac(0x211, 'Y*ut')](_0x480191, _0x8ff58a, 0x1, 0x1, 0x0, _0x1086ac(0xbc, 'p1NC')), _0x42d124[_0x1086ac(0x1d4, 'E#1%')](_0x480191, _0x50b261, 0x1, 0x1, 0x0, _0x42d124[_0x1086ac(0x119, 'Jv6[')]));
            _0x464b3a(_0x2246e2['c'], _0x417d6f - 0x1, _0x3316a0, 0x0, 0x1, _0x1086ac(0x203, 'Dp#6')), _0x42d124[_0x1086ac(0x153, '$^0i')](_0x464b3a, _0x2246e2['c'], _0x42d124[_0x1086ac(0x1e6, 'WPGe')](_0x417d6f, _0x47f450), _0x3316a0, 0x1, 0x1, _0x1086ac(0x17f, 'ODK^')), _0x341bcc(_0x286b00, _0x3316a0, 0x0, _0x1cbf8b, 0x2), _0x464b3a(_0x1cbf8b['c'], 0x0, _0x2671e9, 0x0, 0x1, _0x1086ac(0x162, 'mk9('), 0x1, _0x47f450), _0x42d124[_0x1086ac(0x1ed, 'ZoTP')](_0x464b3a, _0x1cbf8b['c'], 0x1, _0x2671e9, 0x0, 0x1, _0x1086ac(0x21b, 'i&Lz'), 0x1, _0x47f450), _0x42d124[_0x1086ac(0x163, 'ai^W')](_0x464b3a, _0x1cbf8b['c'], 0x0, _0x44aa7c, 0x0, 0x1, _0x1086ac(0xbc, 'p1NC'), 0x1, _0x47f450), _0x464b3a(_0x1cbf8b['c'], 0x1, _0x44aa7c, 0x0, 0x1, _0x42d124[_0x1086ac(0x1bc, 'AmNq')], 0x1, _0x47f450), _0x480191(_0x260fb9, 0x0, _0x47f450, 0x0, _0x1086ac(0x129, 'iCOp')), _0x480191(_0x1fdd61, 0x0, _0x47f450, 0x0, _0x1086ac(0xc3, 'ZoTP'));
            for (let _0x76248e = 0x0; _0x42d124[_0x1086ac(0xf9, 'RgTs')](_0x76248e, _0x47f450); _0x76248e++) {
                if (_0x42d124[_0x1086ac(0x16e, 'mk9(')](_0x42d124[_0x1086ac(0x169, '3a$e')], _0x1086ac(0x223, 'w30W'))) {
                    const _0x53561e = _0x42d124[_0x1086ac(0xdd, 'xN3A')](_0x76248e, _0x55de2e) ? 0x0 : 0x1, _0x3c0b4d = _0x47db03[_0x42d124[_0x1086ac(0x20b, 'iCOp')](_0x76248e, _0x55de2e) ? _0x42d124[_0x1086ac(0xf7, 'w30W')](_0x42d124[_0x1086ac(0xf6, 'eG0D')](_0x55de2e, 0x1), _0x76248e) : _0x76248e - _0x55de2e];
                    _0x42d124[_0x1086ac(0x10e, 'mk9(')](_0x464b3a, _0x8ff58a['c'], _0x53561e, _0x260fb9, _0x76248e, 0x1, _0x1086ac(0xe7, 'M&AS'), _0x3c0b4d), _0x464b3a(_0x50b261['c'], _0x53561e, _0x1fdd61, _0x76248e, 0x1, _0x1086ac(0x13d, 'c%47'), _0x3c0b4d);
                }
                else {
                    const _0x5a7cf4 = new _0x3aa8fd(_0x386b3f[_0x1086ac(0x237, 'mk9(')](WjOzpa[_0x1086ac(0x14c, 'gNU$')](WjOzpa[_0x1086ac(0x1d8, 's]f!')](_0x4aef96[_0x1086ac(0x15c, 'h6X5')], 0x6), 0x8)));
                    let _0x2b6fa7 = 0x0, _0x29986d = 0x0, _0xb2c237 = 0x0;
                    for (let _0x11b7cb = 0x0; WjOzpa[_0x1086ac(0xe4, 'p1NC')](_0x11b7cb, _0x474b89[_0x1086ac(0x22e, 'w30W')]); _0x11b7cb++) {
                        const _0x265d80 = _0x3f144c[_0x1086ac(0x1de, 'bDxN')](_0x544f16[_0x11b7cb]);
                        if (WjOzpa[_0x1086ac(0xef, '1muB')](_0x265d80, 0x0))
                            throw new _0x419bc7(WjOzpa[_0x1086ac(0x146, 'AmNq')]);
                        _0x2b6fa7 = WjOzpa[_0x1086ac(0x230, 'M&AS')](_0x2b6fa7 << 0x6, _0x265d80), _0x29986d += 0x6, WjOzpa[_0x1086ac(0x24c, 'EFau')](_0x29986d, 0x8) && (_0x29986d -= 0x8, _0x5a7cf4[_0xb2c237++] = WjOzpa[_0x1086ac(0x245, 'x&0R')](_0x2b6fa7, _0x29986d) & 0xff);
                    }
                    return _0x5a7cf4;
                }
            }
            _0x341bcc(_0x286b00, _0x2246e2, _0x417d6f, _0x1f5b48, _0x47f450), _0x464b3a(_0x1f5b48['c'], 0x0, _0x105ba8, 0x0, _0x47f450, _0x42d124[_0x1086ac(0x181, '3Qdx')]), _0x464b3a(_0x44aa7c['c'], 0x0, _0x105ba8, 0x0, _0x47f450, _0x42d124[_0x1086ac(0x22b, '9bFn')]), _0x464b3a(_0x44aa7c['c'], 0x0, _0x105ba8, 0x0, _0x47f450, _0x42d124[_0x1086ac(0x143, 'ai^W')]), _0x464b3a(_0x260fb9['c'], 0x0, _0x105ba8, 0x0, _0x47f450, _0x42d124[_0x1086ac(0xde, 'Cjei')]), _0x42d124[_0x1086ac(0xdc, 'a6aj')](_0x464b3a, _0x1f5b48['c'], 0x0, _0xbb7b0b, 0x0, _0x47f450, _0x42d124[_0x1086ac(0x235, 'xN3A')]), _0x464b3a(_0x2671e9['c'], 0x0, _0xbb7b0b, 0x0, _0x47f450, _0x1086ac(0x140, 'xsXL')), _0x464b3a(_0x2671e9['c'], 0x0, _0xbb7b0b, 0x0, _0x47f450, _0x1086ac(0x1ae, 'x&0R')), _0x464b3a(_0x1fdd61['c'], 0x0, _0xbb7b0b, 0x0, _0x47f450, _0x42d124[_0x1086ac(0x1dc, '%RFs')]), _0x464b3a(_0x2246e2['c'], _0x417d6f, _0x105ba8, 0x0, _0x47f450, _0x42d124[_0x1086ac(0x123, 'bDxN')]), _0x42d124[_0x1086ac(0x12e, '3Qdx')](_0x464b3a, _0x105ba8['c'], 0x0, _0x2246e2, _0x417d6f, _0x47f450, _0x1086ac(0x178, 'i&Lz')), _0x42d124[_0x1086ac(0x13c, 'XZrY')](_0x464b3a, _0xbb7b0b['c'], 0x0, _0x2246e2, _0x417d6f, _0x47f450, _0x42d124[_0x1086ac(0x151, '$^0i')]);
        }
        else {
            const _0x581a4b = _0x42d124[_0x1086ac(0xf0, 'x&0R')](_0x1bc5d7, _0x42d124[_0x1086ac(0x1b1, 'YsnY')](0x2, _0x258b3b));
            return _0x42d124[_0x1086ac(0xbb, 'xN3A')](_0x4d5581, _0x742ac4, _0x2cb5ee - _0x4d6b8f, _0x581a4b, 0x0, 0x2 * _0x321bed, _0x42d124[_0x1086ac(0x17d, 'laC)')]), _0x581a4b;
        }
    } }), _0x73c8ec[_0x1996d3(0xd5, 'KMuw')] = _0x1996d3(0xf4, 'eG0D'), _0x3e2773[_0x1996d3(0x188, 'E#1%')](({ y: _0x51ae45 }, _0x214de8) => { const _0x22ccaa = _0x1996d3; _0x42d124[_0x22ccaa(0x130, 'WPGe')](_0x22ccaa(0x184, '$^0i'), _0x22ccaa(0x255, 'ODK^')) ? (_0x42d124[_0x22ccaa(0x222, 'YsnY')](_0xca68b9, _0x2f13e7, 0x0, 0x1, 0x0, _0x22ccaa(0x113, 'bDxN')), _0x42d124[_0x22ccaa(0x176, 'mk9(')](_0x63e16c, _0x46d721, 0x0, 0x1, 0x0, _0x22ccaa(0x11d, '3a$e'))) : _0x73c8ec[_0x22ccaa(0x16b, 'Y*ut')](_0x4ba6e6[_0x214de8]['c'], 0x0, 0x1, _0x258634, _0x42d124[_0x22ccaa(0x1e4, 'ai^W')](0x2, _0x531c97) - 0x2, 0x0, _0x42d124[_0x22ccaa(0x218, 'w30W')](_0x42d124[_0x22ccaa(0x1d2, 'AmNq')](_0x51ae45, _0x531c97), 0x1), _0x258634, _0x42d124[_0x22ccaa(0x107, 'T30i')](0x2, _0x531c97) - 0x2); }), _0x73c8ec[_0x1996d3(0x249, 'ZN6&')] = _0x1996d3(0x125, '3Qdx');
}
finally {
    for (const _0x489cf6 of _0x14d329) {
        _0x489cf6[_0x1996d3(0x166, 'p1NC')] = 0x0, _0x489cf6[_0x1996d3(0x12f, 'AmNq')] = 0x0;
    }
} }
function _0x3d7215(_0x51bb37) { const _0x2f046f = _0x3c4e5d, _0x54ba9d = { 'wPmPy': function (_0x5ab677, _0x4b0304) { return _0x5ab677 !== _0x4b0304; }, 'OkxTN': function (_0x386125, _0x2886d0) { return _0x386125 + _0x2886d0; }, 'IQHRP': function (_0x2db314, _0x39ec9e) { return _0x2db314 - _0x39ec9e; }, 'MThZl': function (_0x41c4d8, _0x572009) { return _0x41c4d8 <= _0x572009; }, 'vyJzH': function (_0x3c8093, _0x18c7fc) { return _0x3c8093 + _0x18c7fc; }, 'EFgvu': function (_0x3f58a0, _0x272673) { return _0x3f58a0 * _0x272673; }, 'tWVFu': function (_0x49652d, _0x57d0ae) { return _0x49652d > _0x57d0ae; }, 'HOjHl': _0x2f046f(0x261, 'XZrY'), 'WtZPa': _0x2f046f(0xd6, 'p1NC'), 'DrlEs': function (_0x38eb43, _0xe7aab2, _0x2a742d, _0x4af709, _0x1c07d8) { return _0x38eb43(_0xe7aab2, _0x2a742d, _0x4af709, _0x1c07d8); }, 'ZiTNB': function (_0x450512, _0x12fad2, _0x5ee794) { return _0x450512(_0x12fad2, _0x5ee794); } }; return async (_0x4bc279, _0x2e67d1, _0x149077) => { const _0x497ffd = _0x2f046f; _0x51bb37(); const _0x59b66a = _0x1c5714(_0x149077); if (!_0x59b66a)
    throw new Error(_0x497ffd(0x145, 'x&0R')); const _0x595e49 = _0x2e67d1[_0x497ffd(0x105, 'bDxN')], _0x5a74cb = _0x2e67d1[_0x497ffd(0x17e, 'bDxN')], _0x4675be = _0x54ba9d[_0x497ffd(0x1fd, '1muB')](_0x595e49, 0x0) ? await _0x3bb742(_0x59b66a, _0x5a74cb) : null; if (!_0x4675be)
    throw new Error(_0x54ba9d[_0x497ffd(0x18a, '9bFn')]); _0x4bc279[_0x497ffd(0x131, 'laC)')] = _0x595e49, _0x4bc279[_0x497ffd(0x1f2, 'xN3A')] = _0x5a74cb; const _0x5e77e7 = _0x4bc279[_0x497ffd(0xe8, '$^0i')]('2d'); if (!_0x5e77e7)
    throw new Error(_0x497ffd(0xc6, 'w30W')); _0x5e77e7[_0x497ffd(0x1ce, 'w30W')] = ![]; for (const [_0x5614e0, _0x21d131, _0x3b837] of _0x18f945(_0x4675be, _0x5a74cb)) {
    if (_0x54ba9d[_0x497ffd(0xee, 'p1NC')] !== _0x497ffd(0x110, 'Dp#6'))
        _0x5e77e7[_0x497ffd(0x171, 'uIWX')](_0x2e67d1, 0x0, _0x5614e0, _0x595e49, _0x3b837, 0x0, _0x21d131, _0x595e49, _0x3b837);
    else {
        const _0x11ab6a = _0x211779 * _0x5d63d9['h'];
        zacrbi[_0x497ffd(0x17a, '%RFs')](_0x403b51[_0x5106cd], zacrbi[_0x497ffd(0x226, 'iq3L')](_0x48aba8[zacrbi[_0x497ffd(0x229, 'eG0D')](_0x5a57bd, 0x1)], 0x1)) && zacrbi[_0x497ffd(0x233, '[XzL')](zacrbi[_0x497ffd(0x1c2, 'Qgh$')](_0x11ab6a, _0x46df6e), _0x242a8a) && _0xe3e2f7[_0x497ffd(0x15d, 'eG0D')]({ 'y': _0x11ab6a, 'upperEnd': zacrbi[_0x497ffd(0x19b, 'XZrY')](_0x3dd109[zacrbi[_0x497ffd(0x208, 'bDxN')](_0x2cfa3d, 0x1)] + 0x1, _0x5c86e0['h']), 'lowerStart': _0x55eb76[_0x1f582c] * _0x40f21e['h'] });
    }
} try {
    _0x54ba9d[_0x497ffd(0xeb, 'iq3L')](_0x19b332, _0x4bc279, _0x5e77e7, _0x2e67d1, _0x54ba9d[_0x497ffd(0xc7, 'RgTs')](_0x3f36a7, _0x4675be, _0x5a74cb));
}
catch { } }; }
exports.BookmarkDecoder = ((() => { const _0x55e1db = _0x3c4e5d, _0x5ad11d = { 'uiUgR': _0x55e1db(0x23a, '3a$e'), 'ruZBn': _0x55e1db(0x19c, 'x&0R'), 'KIFXb': _0x55e1db(0x20a, 'w30W'), 'uRXJr': _0x55e1db(0x23c, 'Y*ut'), 'yuxcJ': _0x55e1db(0x254, '[XzL'), 'WSeTy': function (_0x2e801d, _0x36f407, _0x31e7cb, _0x5b3333) { return _0x2e801d(_0x36f407, _0x31e7cb, _0x5b3333); }, 'UDNIA': function (_0x43e6b4, _0x32a551) { return _0x43e6b4(_0x32a551); } }, _0x24f1c1 = [_0x55e1db(0x187, 'Qgh$'), _0x5ad11d[_0x55e1db(0x220, 'RgTs')], _0x5ad11d[_0x55e1db(0xe9, 's]f!')], _0x5ad11d[_0x55e1db(0xe2, '3a$e')], _0x5ad11d[_0x55e1db(0x191, 'YsnY')], _0x5ad11d[_0x55e1db(0x14f, 'Y*ut')]]; return { 'open': _0x5ad11d[_0x55e1db(0x243, 'ODK^')](_0x5c5cab, _0x5ad11d[_0x55e1db(0x1b2, 'XZrY')](_0x31881a, _0x55e1db(0x12a, 'T30i')), 0x1, _0x24f1c1), 'paint': _0x3d7215(() => _0x1810a6(_0x24f1c1)) }; })());

},{}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    parseHomePage($) {
        const results = [];
        $('.manga-vertical').each((_, el) => {
            const titleLink = $('h3 a', el).first();
            const title = titleLink.text().trim();
            const href = titleLink.attr('href') ?? '';
            // Strictly ignore chapter links or empty hrefs
            if (!href || href.includes('/chapter-'))
                return;
            // Extract the clean manga ID. Pattern: /truyen/manga-slug
            // We want to ensure we don't accidentally capture chapter paths
            const idMatch = href.match(/\/truyen\/([^/?#]+)$/);
            if (!idMatch)
                return;
            const id = idMatch[1].trim();
            if (!id || id.includes('/'))
                return; // Double check for sub-paths
            const img = $('.cover-frame img', el).first();
            let rawImage = img.attr('src') ?? img.attr('data-src') ?? '';
            // Prepend base URL if relative
            if (rawImage && rawImage.startsWith('/')) {
                rawImage = `https://damconuong.pet${rawImage}`;
            }
            if (!title || !rawImage)
                return;
            results.push(App.createPartialSourceManga({ mangaId: id, title, image: rawImage }));
        });
        return this.deduplicate(results);
    }
    parseMangaDetails($, mangaId) {
        let title = $('h1.text-xl').text().trim() || $('h1').not('.text-sm').first().text().trim();
        if (!title || title.includes('Tên Miền Chính Thức')) {
            title = $('h1').last().text().trim() || mangaId;
        }
        const rawImage = $('meta[property="og:image"]').attr('content')?.trim() ?? '';
        const desc = $('.summary-content, .description, .manga-content, #synopsis, .mt-4.text-sm, .prose').text().trim() || '';
        const genres = [];
        $('.genre a, .the-loai a').each((_, el) => {
            const href = $(el).attr('href') ?? '';
            const genreId = href.replace('/the-loai/', '').trim();
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
            mangaInfo: App.createMangaInfo({ titles: [title], image: rawImage, desc, author: '', artist: '', status: '', tags: tagSections }),
        });
    }
    parseChapters($) {
        const chapters = [];
        const seen = new Set();
        // Look for chapter links: /chuong-123, /chapter-123, or /{mangaId}/{chapterId}
        $('a[href*="/truyen/"]').each((_, el) => {
            const href = ($(el).attr('href') ?? '').trim();
            // Match /truyen/{mangaId}/{chapterId} where chapterId is numeric or chapter-X or chuong-X
            const match = href.match(/\/truyen\/[^/?#]+\/((?:chapter-|chuong-)?[\d.]+)\/?$/i);
            if (!match)
                return;
            const rawChapter = match[1];
            const chapterNum = rawChapter.replace(/^(?:chapter|chuong)-/i, '');
            if (seen.has(chapterNum))
                return;
            seen.add(chapterNum);
            const title = $(el).find('.text-ellipsis').first().text().trim()
                || $(el).text().trim().split('\n')[0].trim()
                || `Chương ${chapterNum}`;
            chapters.push(App.createChapter({
                id: rawChapter,
                chapNum: parseFloat(chapterNum) || chapters.length + 1,
                name: title,
                time: new Date(),
            }));
        });
        return chapters.reverse();
    }
    parseChapterPages($) {
        const pages = [];
        $('img[data-original-src], img[data-src], img.chapter-img').each((_, el) => {
            let imgSrc = ($(el).attr('data-original-src') ?? $(el).attr('data-src') ?? $(el).attr('src') ?? '').trim();
            if (!imgSrc || imgSrc.includes('logo') || imgSrc.includes('data:image'))
                return;
            // Prepend base URL if relative or protocol‑relative
            if (imgSrc.startsWith('/') || imgSrc.startsWith('//')) {
                const prefix = imgSrc.startsWith('//') ? 'https:' : 'https://damconuong.pet';
                imgSrc = `${prefix}${imgSrc}`;
            }
            const isImage = /\.(jpg|jpeg|png|webp|gif)($|\?)/i.test(imgSrc);
            const isChapterFolder = /\/(chapters|images|truyen)\//i.test(imgSrc);
            if (imgSrc && (isImage || isChapterFolder)) {
                if (!pages.includes(imgSrc))
                    pages.push(imgSrc);
            }
        });
        if (pages.length === 0) {
            $('img').each((_, el) => {
                const imgSrc = $(el).attr('src') ?? '';
                if (imgSrc && imgSrc.includes('/chapters/') && imgSrc.endsWith('.jpg')) {
                    if (!pages.includes(imgSrc)) {
                        pages.push(imgSrc);
                    }
                }
            });
        }
        return pages;
    }
    getSearchTags() {
        const genres = [
            ['18', '18+'], ['19', '19+'], ['3d-hentai', '3D Hentai'], ['3p', '3P'],
            ['ahegao', 'Ahegao'], ['anal', 'Anal'], ['bdsm', 'BDSM'], ['big-ass', 'Big Ass'],
            ['big-boobs', 'Big Boobs'], ['blowjobs', 'Blowjobs'], ['body-swap', 'Body Swap'],
            ['bondage', 'Bondage'], ['cheating', 'Cheating'], ['cosplay', 'Cosplay'],
            ['dark-skin', 'Dark Skin'], ['daughter', 'Daughter'], ['deepthroat', 'Deepthroat'],
            ['doujinshi', 'Doujinshi'], ['ecchi', 'Ecchi'], ['elf', 'Elf'],
            ['exhibitionism', 'Exhibitionism'], ['femdom', 'Femdom'], ['fingering', 'Fingering'],
            ['footjob', 'Footjob'], ['full-color', 'Full Color'], ['futanari', 'Futanari'],
            ['group', 'Group'], ['harem', 'Harem'], ['incest', 'Incest'],
            ['lactation', 'Lactation'], ['maid', 'Maid'], ['milf', 'Milf'],
            ['mind-break', 'Mind Break'], ['mind-control', 'Mind Control'], ['monster', 'Monster'],
            ['ntr', 'NTR'], ['nurse', 'Nurse'], ['oral', 'Oral'], ['orgy', 'Orgy'],
            ['paizuri', 'Paizuri'], ['pregnant', 'Pregnant'], ['rape', 'Rape'],
            ['schoolgirl', 'Schoolgirl'], ['sex-toys', 'Sex Toys'], ['sister', 'Sister'],
            ['small-boobs', 'Small Boobs'], ['stockings', 'Stockings'], ['swimsuit', 'Swimsuit'],
            ['tentacles', 'Tentacles'], ['threesome', 'Threesome'], ['virgin', 'Virgin'],
            ['yaoi', 'Yaoi'], ['yuri', 'Yuri'],
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
