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
exports.HoaPhungLieuNguyen = exports.HoaPhungLieuNguyenInfo = void 0;
const types_1 = require("@paperback/types");
const HoaPhungLieuNguyenParser_1 = require("./HoaPhungLieuNguyenParser");
const HoaPhungLieuNguyenSetting_1 = require("./HoaPhungLieuNguyenSetting");
exports.HoaPhungLieuNguyenInfo = {
    version: '1.0.0',
    name: 'HoaPhungLieuNguyen',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension đọc Hỏa Phụng Liêu Nguyên full HD, cập nhật liên tục từ hoaphunglieunguyen.com',
    contentRating: types_1.ContentRating.EVERYONE,
    websiteBaseURL: 'https://hoaphunglieunguyen.com',
    sourceTags: [],
    intents: types_1.SourceIntents.MANGA_CHAPTERS | types_1.SourceIntents.HOMEPAGE_SECTIONS | types_1.SourceIntents.SETTINGS_UI,
};
class HoaPhungLieuNguyen extends types_1.Source {
    constructor() {
        super(...arguments);
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 4,
            requestTimeout: 20000,
        });
        this.parser = new HoaPhungLieuNguyenParser_1.Parser();
        this.stateManager = App.createSourceStateManager();
    }
    async getSourceMenu() {
        return App.createDUISection({
            id: 'main',
            header: 'Cài đặt nguồn',
            isHidden: false,
            rows: async () => [
                (0, HoaPhungLieuNguyenSetting_1.domainSettings)(this.stateManager),
                (0, HoaPhungLieuNguyenSetting_1.resetSettings)(this.stateManager),
            ],
        });
    }
    getMangaShareUrl(mangaId) {
        if (mangaId === 'hoa-phung-lieu-nguyen-full') {
            return `${HoaPhungLieuNguyenSetting_1.DEFAULT_BASE_URL}/`;
        }
        return `${HoaPhungLieuNguyenSetting_1.DEFAULT_BASE_URL}/tap/${mangaId}/`;
    }
    async getHomePageSections(sectionCallback) {
        const baseUrl = await (0, HoaPhungLieuNguyenSetting_1.getDomain)(this.stateManager);
        const sectionFull = App.createHomeSection({
            id: 'hpln_full',
            title: 'Hỏa Phụng Liêu Nguyên - Trọn Bộ',
            containsMoreItems: false,
            type: types_1.HomeSectionType.singleRowNormal,
        });
        const sectionTaps = App.createHomeSection({
            id: 'hpln_taps',
            title: 'Danh Sách Theo Tập (Tập 1 - 82+)',
            containsMoreItems: false,
            type: types_1.HomeSectionType.singleRowNormal,
        });
        sectionCallback(sectionFull);
        sectionCallback(sectionTaps);
        // Fetch tap taxonomy list from WordPress REST API
        try {
            const request = App.createRequest({
                url: `${baseUrl}/wp-json/wp/v2/tap?per_page=100`,
                method: 'GET',
            });
            const response = await this.requestManager.schedule(request, 1);
            const taps = JSON.parse(response.data);
            const allManga = this.parser.parseTapsList(taps, baseUrl);
            sectionFull.items = allManga.slice(0, 1);
            sectionTaps.items = allManga.slice(1);
        }
        catch (e) {
            // Fallback: at least show full entry
            sectionFull.items = [
                App.createPartialSourceManga({
                    mangaId: 'hoa-phung-lieu-nguyen-full',
                    title: 'Hỏa Phụng Liêu Nguyên (Toàn bộ hồi)',
                    image: `${baseUrl}/wp-content/uploads/2026/09/hoa-phung-lieu-nguyen-bia-hero.webp`,
                    subtitle: 'Full 637+ Hồi',
                }),
            ];
        }
        sectionCallback(sectionFull);
        sectionCallback(sectionTaps);
    }
    async getMangaDetails(mangaId) {
        const baseUrl = await (0, HoaPhungLieuNguyenSetting_1.getDomain)(this.stateManager);
        if (mangaId === 'hoa-phung-lieu-nguyen-full') {
            return this.parser.parseMangaDetails(null, mangaId, baseUrl);
        }
        const url = `${baseUrl}/tap/${mangaId}/`;
        const request = App.createRequest({
            url: url,
            method: 'GET',
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        return this.parser.parseMangaDetails($, mangaId, baseUrl);
    }
    async getChapters(mangaId) {
        const baseUrl = await (0, HoaPhungLieuNguyenSetting_1.getDomain)(this.stateManager);
        if (mangaId === 'hoa-phung-lieu-nguyen-full') {
            // Read from any chapter page dropdown which contains ALL 640+ chapters
            const request = App.createRequest({
                url: `${baseUrl}/tap/tap-1/hoi-1/`,
                method: 'GET',
            });
            const response = await this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return this.parser.parseChaptersFromHtml($, mangaId);
        }
        // Single tap page
        const url = `${baseUrl}/tap/${mangaId}/`;
        const request = App.createRequest({
            url: url,
            method: 'GET',
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        return this.parser.parseChaptersFromHtml($, mangaId);
    }
    async getChapterDetails(mangaId, chapterId) {
        let url = chapterId;
        if (!url.startsWith('http')) {
            const baseUrl = await (0, HoaPhungLieuNguyenSetting_1.getDomain)(this.stateManager);
            url = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
        }
        const request = App.createRequest({
            url: url,
            method: 'GET',
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        return this.parser.parseChapterDetails($, chapterId);
    }
    async getSearchResults(query, metadata) {
        const baseUrl = await (0, HoaPhungLieuNguyenSetting_1.getDomain)(this.stateManager);
        const title = (query.title || '').trim().toLowerCase();
        // Single manga source: match if searched query matches
        const matches = 'hỏa phụng liêu nguyên hoa phung lieu nguyen ravages of time'.includes(title) || title === '';
        const results = [];
        if (matches) {
            results.push(App.createPartialSourceManga({
                mangaId: 'hoa-phung-lieu-nguyen-full',
                title: 'Hỏa Phụng Liêu Nguyên (Toàn bộ hồi)',
                image: `${baseUrl}/wp-content/uploads/2026/09/hoa-phung-lieu-nguyen-bia-hero.webp`,
                subtitle: 'Hơn 637+ Hồi Full',
            }));
        }
        return App.createPagedResults({
            results: results,
        });
    }
}
exports.HoaPhungLieuNguyen = HoaPhungLieuNguyen;

},{"./HoaPhungLieuNguyenParser":63,"./HoaPhungLieuNguyenSetting":64,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    parseTapsList(taps, baseUrl) {
        const mangaList = [];
        // 1. Single entry for reading all chapters
        mangaList.push(App.createPartialSourceManga({
            mangaId: 'hoa-phung-lieu-nguyen-full',
            title: 'Hỏa Phụng Liêu Nguyên (Toàn bộ hồi)',
            image: `${baseUrl}/wp-content/uploads/2026/09/hoa-phung-lieu-nguyen-bia-hero.webp`,
            subtitle: 'Hơn 637+ Hồi Full',
        }));
        // Sort taps numerically if possible: 'tap-1', 'tap-2' ...
        const sortedTaps = [...taps].sort((a, b) => {
            const numA = parseInt((a.slug || '').replace(/\D+/g, ''), 10) || 0;
            const numB = parseInt((b.slug || '').replace(/\D+/g, ''), 10) || 0;
            return numA - numB;
        });
        for (const tap of sortedTaps) {
            const tapNum = (tap.slug || '').replace(/\D+/g, '') || tap.name;
            mangaList.push(App.createPartialSourceManga({
                mangaId: tap.slug,
                title: tap.name || `Tập ${tapNum}`,
                image: `${baseUrl}/wp-content/uploads/2026/09/Tap-${tapNum}-bia-768x1135.jpg`,
                subtitle: `${tap.count || 0} Hồi`,
            }));
        }
        return mangaList;
    }
    parseMangaDetails($, mangaId, baseUrl) {
        if (mangaId === 'hoa-phung-lieu-nguyen-full') {
            return App.createSourceManga({
                id: mangaId,
                mangaInfo: App.createMangaInfo({
                    titles: ['Hỏa Phụng Liêu Nguyên', 'The Ravages of Time', '火鳳燎原'],
                    image: `${baseUrl}/wp-content/uploads/2026/09/hoa-phung-lieu-nguyen-bia-hero.webp`,
                    desc: 'Hỏa Phụng Liêu Nguyên (The Ravages of Time) là tác phẩm truyện tranh dã sử kinh điển của tác giả Trần Mưu. Lấy bối cảnh thời Tam Quốc đầy biến động, xoay quanh mưu trí tuyệt đỉnh của Bát Kỳ cùng những trận chiến hào hùng của Liệu Nguyên Hỏa và Tư Mã Ý.',
                    author: 'Trần Mưu (Chan Mou)',
                    artist: 'Trần Mưu (Chan Mou)',
                    status: 'Đang tiến hành',
                    tags: [
                        App.createTagSection({
                            id: 'genres',
                            label: 'Thể loại',
                            tags: [
                                App.createTag({ id: 'action', label: 'Action' }),
                                App.createTag({ id: 'historical', label: 'Historical' }),
                                App.createTag({ id: 'martial-arts', label: 'Martial Arts' }),
                                App.createTag({ id: 'seinen', label: 'Seinen' }),
                                App.createTag({ id: 'strategy', label: 'Chiến thuật' }),
                            ],
                        }),
                    ],
                }),
            });
        }
        // It is a specific Tap (e.g. tap-1)
        const title = $('h1').first().text().trim() || mangaId;
        const desc = $('.tap-description, .entry-content, p').first().text().trim() || 'Hỏa Phụng Liêu Nguyên';
        let coverImg = $('img[src*="Tap-"], img[src*="tap-"]').first().attr('src') || '';
        if (!coverImg) {
            coverImg = `${baseUrl}/wp-content/uploads/2026/09/hoa-phung-lieu-nguyen-bia-hero.webp`;
        }
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title, 'Hỏa Phụng Liêu Nguyên'],
                image: coverImg,
                desc: desc,
                author: 'Trần Mưu (Chan Mou)',
                artist: 'Trần Mưu (Chan Mou)',
                status: 'Đang tiến hành',
                tags: [
                    App.createTagSection({
                        id: 'genres',
                        label: 'Thể loại',
                        tags: [
                            App.createTag({ id: 'action', label: 'Action' }),
                            App.createTag({ id: 'historical', label: 'Historical' }),
                            App.createTag({ id: 'martial-arts', label: 'Martial Arts' }),
                        ],
                    }),
                ],
            }),
        });
    }
    parseChaptersFromHtml($, mangaId) {
        const chapters = [];
        if (mangaId === 'hoa-phung-lieu-nguyen-full') {
            // Parse from select reader dropdown (<select class="reader-chapter-select">)
            $('select option').each((_, elem) => {
                const url = $(elem).attr('value');
                const title = $(elem).text().trim();
                if (!url || !url.includes('/hoi-'))
                    return;
                // Extract chapter number
                const numMatch = title.match(/Hồi\s*(\d+(\.\d+)?)/i) || url.match(/hoi-(\d+(\.\d+)?)/i);
                const chapNum = numMatch ? parseFloat(numMatch[1]) : 0;
                chapters.push(App.createChapter({
                    id: url,
                    chapNum: chapNum,
                    name: title,
                    langCode: '🇻🇳',
                }));
            });
            // Sort descending: newest on top
            return chapters.sort((a, b) => b.chapNum - a.chapNum);
        }
        // Single tap page: list of chapters
        $('a[href*="/hoi-"]').each((_, elem) => {
            const url = $(elem).attr('href');
            let name = $(elem).find('.chuong-list-title').text().trim();
            if (!name)
                name = $(elem).text().trim();
            if (!url || !url.includes('/hoi-'))
                return;
            const numMatch = name.match(/Hồi\s*(\d+(\.\d+)?)/i) || url.match(/hoi-(\d+(\.\d+)?)/i);
            const chapNum = numMatch ? parseFloat(numMatch[1]) : 0;
            chapters.push(App.createChapter({
                id: url,
                chapNum: chapNum,
                name: name,
                langCode: '🇻🇳',
            }));
        });
        // Filter duplicates by id
        const seen = new Set();
        const unique = chapters.filter(c => {
            if (seen.has(c.id))
                return false;
            seen.add(c.id);
            return true;
        });
        return unique.sort((a, b) => b.chapNum - a.chapNum);
    }
    parseChapterDetails($, chapterId) {
        const pages = [];
        // In reader: <img class="hpln-page" data-src="..." src="..." ...>
        $('img.hpln-page, .reader-content img, .entry-content img, article img').each((_, elem) => {
            let src = $(elem).attr('data-src') || $(elem).attr('data-lazy-src') || $(elem).attr('src') || '';
            src = src.trim();
            if (src && !src.startsWith('data:image') && (src.includes('.webp') || src.includes('.jpg') || src.includes('.png') || src.includes('.jpeg'))) {
                pages.push(src);
            }
        });
        // Remove duplicates while preserving order
        const uniquePages = [...new Set(pages)];
        return App.createChapterDetails({
            id: chapterId,
            mangaId: 'hoa-phung-lieu-nguyen',
            pages: uniquePages,
        });
    }
}
exports.Parser = Parser;

},{}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetSettings = exports.domainSettings = exports.getDomain = exports.DEFAULT_BASE_URL = void 0;
exports.DEFAULT_BASE_URL = 'https://hoaphunglieunguyen.com';
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
