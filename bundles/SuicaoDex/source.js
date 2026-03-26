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
exports.SuicaoDex = exports.SuicaoDexInfo = void 0;
const types_1 = require("@paperback/types");
const BASE_URL = 'https://suicaodex.com';
const API_BASE = 'https://api.mangadex.org';
exports.SuicaoDexInfo = {
    version: '1.0.2',
    name: 'SuicaoDex',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for suicaodex.com (MangaDex frontend)',
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
class SuicaoDex extends types_1.Source {
    constructor() {
        super(...arguments);
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 3,
            requestTimeout: 30000,
            interceptor: {
                interceptRequest: async (request) => {
                    request.headers = {
                        ...(request.headers ?? {}),
                        'referer': 'https://suicaodex.com/',
                        'user-agent': await this.requestManager.getDefaultUserAgent(),
                    };
                    return request;
                },
                interceptResponse: async (response) => response,
            }
        });
    }
    async getCloudflareBypassRequestAsync() {
        return App.createRequest({ url: 'https://api.mangadex.org', method: 'GET' });
    }
    async fetchApi(url) {
        const response = await this.requestManager.schedule(App.createRequest({ url, method: 'GET' }), 0);
        return JSON.parse(response.data);
    }
    getTitle(manga) {
        return manga.attributes.title.en
            || manga.attributes.title['ja-ro']
            || Object.values(manga.attributes.title)[0]
            || '';
    }
    getCover(manga, mangaId) {
        const coverRel = manga.relationships?.find((r) => r.type === 'cover_art');
        if (coverRel?.attributes?.file) {
            return `https://uploads.mangadex.org/cover/${mangaId}/${coverRel.attributes.file}.256.jpg`;
        }
        return '';
    }
    async getHomePageSections(sectionCallback) {
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', params: 'order[latestUploadedChapter]=desc' },
            { id: 'new', title: 'Truyện Mới', params: 'order[createAt]=desc' },
            { id: 'completed', title: 'Đã Hoàn Thành', params: 'status[]=completed&order[latestUploadedChapter]=desc' },
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
                const url = `${API_BASE}/manga?limit=20&${section.params}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`;
                const data = await this.fetchApi(url);
                const manga = this.parseMangaList(data.data);
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
    parseMangaList(data) {
        const results = [];
        for (const manga of data) {
            const id = manga.id;
            const title = this.getTitle(manga);
            if (!id || !title)
                continue;
            const coverRel = manga.relationships?.find((r) => r.type === 'cover_art');
            let image = '';
            if (coverRel?.attributes?.file) {
                image = `https://uploads.mangadex.org/cover/${id}/${coverRel.attributes.file}.256.jpg`;
            }
            results.push(App.createPartialSourceManga({ mangaId: id, title, image }));
        }
        return results;
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const page = metadata?.page ?? 1;
        const offset = (page - 1) * 20;
        const paramsMap = {
            'latest': 'order[latestUploadedChapter]=desc',
            'new': 'order[createAt]=desc',
            'completed': 'status[]=completed&order[latestUploadedChapter]=desc',
        };
        const params = paramsMap[homepageSectionId] || 'order[latestUploadedChapter]=desc';
        const url = `${API_BASE}/manga?limit=20&offset=${offset}&${params}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`;
        const data = await this.fetchApi(url);
        return App.createPagedResults({ results: this.parseMangaList(data.data), metadata: { page: page + 1 } });
    }
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 1;
        const offset = (page - 1) * 20;
        const url = `${API_BASE}/manga?limit=20&offset=${offset}&title=${encodeURIComponent(query.title ?? '')}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`;
        const data = await this.fetchApi(url);
        return App.createPagedResults({ results: this.parseMangaList(data.data), metadata: { page: page + 1 } });
    }
    async getMangaDetails(mangaId) {
        const url = `${API_BASE}/manga/${mangaId}?includes[]=cover_art&includes[]=author&includes[]=artist&includes[]=tag`;
        const data = await this.fetchApi(url);
        const manga = data.data;
        const attrs = manga.attributes;
        const title = this.getTitle(manga);
        let image = '';
        const coverRel = manga.relationships?.find((r) => r.type === 'cover_art');
        if (coverRel?.attributes?.file) {
            image = `https://uploads.mangadex.org/cover/${mangaId}/${coverRel.attributes.file}.512.jpg`;
        }
        const desc = Object.values(attrs.description || {})[0] || '';
        const authorRel = manga.relationships?.find((r) => r.type === 'author');
        const author = authorRel?.attributes?.name || '';
        const artistRel = manga.relationships?.find((r) => r.type === 'artist');
        const artist = artistRel?.attributes?.name || '';
        const statusMap = {
            'ongoing': 'Ongoing',
            'completed': 'Completed',
            'hiatus': 'Hiatus',
            'cancelled': 'Cancelled',
        };
        const status = statusMap[attrs.status] || attrs.status || '';
        const tags = [];
        if (attrs.tags) {
            for (const tag of attrs.tags) {
                const label = tag.attributes.name?.en || tag.attributes.name?.['ja-ro'] || Object.values(tag.attributes.name || {})[0] || '';
                if (label) {
                    tags.push(App.createTag({
                        id: tag.id,
                        label: label,
                    }));
                }
            }
        }
        const tagSections = tags.length > 0 ? [App.createTagSection({ id: 'genres', label: 'Thể Loại', tags })] : [];
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image,
                desc,
                author,
                artist,
                status,
                tags: tagSections,
            }),
        });
    }
    async getChapters(mangaId) {
        const url = `${API_BASE}/manga/${mangaId}/feed?limit=100&includes[]=scanlation_group&order[chapter]=desc`;
        const data = await this.fetchApi(url);
        const chapters = [];
        const seen = new Set();
        for (const chapter of data.data) {
            const id = chapter.id;
            if (seen.has(id))
                continue;
            seen.add(id);
            const chapNum = chapter.attributes.chapter ?? 0;
            const name = chapter.attributes.title || `Chapter ${chapNum}`;
            const time = new Date(chapter.attributes.publishAt);
            let groupName = 'Unknown';
            const groupRel = chapter.relationships?.find((r) => r.type === 'scanlation_group');
            if (groupRel?.attributes?.name) {
                groupName = groupRel.attributes.name;
            }
            chapters.push(App.createChapter({
                id,
                chapNum,
                name: `${name} (${groupName})`,
                time,
            }));
        }
        return chapters;
    }
    async getChapterDetails(mangaId, chapterId) {
        const url = `${API_BASE}/at-home/server/${chapterId}`;
        const data = await this.fetchApi(url);
        const baseUrl = data.baseUrl;
        const chapter = data.chapter;
        const pages = [];
        for (const page of chapter.data) {
            pages.push(`${baseUrl}/data/${chapter.hash}/${page}`);
        }
        if (pages.length === 0) {
            for (const page of chapter.dataSaver) {
                pages.push(`${baseUrl}/data-saver/${chapter.hash}/${page}`);
            }
        }
        return App.createChapterDetails({
            id: chapterId,
            mangaId,
            pages,
        });
    }
    getMangaShareUrl(mangaId) {
        return `${BASE_URL}/manga/${mangaId}`;
    }
    async getSearchTags() {
        const tags = [
            App.createTag({ id: '4aa2b1ce-0347-4d2a-b3a7-59576dbf40f3', label: 'Action' }),
            App.createTag({ id: 'b873d54d-9d8d-458c-b3fc-4d3d34d34f3e', label: 'Adventure' }),
            App.createTag({ id: 'e64f6749-e7f3-45a2-a4e2-68d7751d4c8b', label: 'Comedy' }),
            App.createTag({ id: '0a39b5a1-4f20-4a54-9d84-5c8a78c2b1b0', label: 'Drama' }),
            App.createTag({ id: 'c8c5b547-8fb7-4e7e-a6e5-1c8d8f9c4e1a', label: 'Fantasy' }),
            App.createTag({ id: '87c8c05d-a9d7-435d-9edf-b96f0d5c8c5d', label: 'Horror' }),
            App.createTag({ id: 'fbe6d9d8-4e6a-4e1e-9c1c-8f7e3a6b5c4d', label: 'Romance' }),
            App.createTag({ id: '3e4a8d7e-5c6b-4a8e-9d2f-6e7c8b5a4d3e', label: 'Sci-Fi' }),
            App.createTag({ id: '2d3e4f5a-6b7c-4d8e-9f0a-1b2c3d4e5f6a', label: 'Slice of Life' }),
            App.createTag({ id: '5a6b7c8d-9e0f-4a1b-2c3d-4e5f6a7b8c9d', label: 'Sports' }),
            App.createTag({ id: '9d8e7f6a-5b4c-3d2e-1f0a-9b8c7d6e5f4a', label: 'Supernatural' }),
            App.createTag({ id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', label: 'Mystery' }),
            App.createTag({ id: '6c7d8e9f-0a1b-2c3d-4e5f-6a7b8c9d0e1f', label: 'Psychological' }),
            App.createTag({ id: '0f1e2d3c-4b5a-6e7f-8a9b-0c1d2e3f4a5b', label: 'Thriller' }),
        ];
        return [App.createTagSection({ id: 'genre', label: 'Thể Loại', tags })];
    }
}
exports.SuicaoDex = SuicaoDex;

},{"@paperback/types":61}]},{},[62])(62)
});
