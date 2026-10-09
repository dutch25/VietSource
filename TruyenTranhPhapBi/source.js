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
exports.TruyenTranhPhapBi = exports.TruyenTranhPhapBiInfo = void 0;
const types_1 = require("@paperback/types");
const TruyenTranhPhapBiParser_1 = require("./TruyenTranhPhapBiParser");
const BASE_URL = 'https://truyentranhphapbi.blogspot.com';
const DRAGON_BALL_SUPER_CHAPTERS = [
    { id: '2021_11_dragon-ball-super-tap-1-truyen-mau', num: 1, name: 'Dragon Ball Super tập 1 (Truyện màu) - Những chiến binh từ vũ trụ thứ 6' },
    { id: '2021_12_dragon-ball-super-tap-2-va-vu-tru-thang', num: 2, name: 'Dragon Ball Super Tập 2 - Và Vũ trụ thắng cuộc là.. (Preview)' },
    { id: '2020_01_dragon-ball-super-mau-tap-3', num: 3, name: 'Dragon Ball Super Tập 3 - Kế hoạch Vô nhân' },
    { id: '2020_03_dragon-ball-super-mau-tap-4', num: 4, name: 'DRAGON BALL SUPER (TRUYỆN MÀU) TẬP 4 - CƠ HỘI CUỐI CÙNG CHO HOPE' },
    { id: '2020_11_dragon-ball-super-hoi-future-trunks-tap', num: 5, name: 'Dragon Ball Super Tập 5 - Trận chiến cuối cùng - Vĩnh biệt Trunks' },
    { id: '2022_01_dragon-ball-super-tap-6-cac-chien-binh', num: 6, name: 'Dragon Ball Super Tập 6 - Các chiến binh siêu cấp tụ hội (Preview)' },
    { id: '2022_02_dragon-ball-super-tap-7-ai-hoi-sieu', num: 7, name: 'Dragon Ball Super Tập 7 - Đại hội Siêu chiến binh Bắt đầu' },
    { id: '2022_03_dragon-ball-super-tap-8-dau-hieu-thuc', num: 8, name: 'Dragon Ball Super tập 8 (truyện màu) - Dấu hiệu thức tỉnh của Goku' },
    { id: '2022_04_dragon-ball-super-tap-9-tan-cuoc-preview', num: 9, name: 'Dragon Ball Super Tập 9 - Tàn Cuộc (Preview)' },
    { id: '2022_05_dragon-ball-super-tap-10-ieu-uoc-cua', num: 10, name: 'Dragon Ball Super Tập 10 - Điều ước của Moro (Preview)' },
    { id: '2022_07_dragon-ball-super-tap-11-cuoc-ai-vuot', num: 11, name: 'Dragon Ball Super Tập 11 - Cuộc đại vượt ngục' },
    { id: '2022_08_dragon-ball-super-tap-12-than-phan-that', num: 12, name: 'Dragon Ball Super Tập 12 - Thân phận thật sự của Merus' },
    { id: '2022_11_dragon-ball-super-tap-13-ten-tung-chien', num: 13, name: 'Dragon Ball Super Tập 13 - Trên từng chiến tuyến (Preview)' },
    { id: '2023_05_dragon-ball-super-tap-14-son-goku-chang', num: 14, name: 'Dragon Ball Super - Tập 14 - Son Goku, chàng tuần tra viên ngân hà' },
    { id: '2023_07_dragon-ball-super-tap-15-moro-ke-hanh', num: 15, name: 'Dragon Ball Super Tập 15 - Moro, kẻ ăn hành tinh (Preview)' },
    { id: '2023_10_dragon-ball-super-tap-16-chien-binh', num: 16, name: 'Dragon Ball Super Tập 16 - Chiến binh mạnh nhất vũ trụ' },
    { id: '2024_03_dragon-ball-super-tap-17-suc-manh-cua', num: 17, name: 'Dragon Ball Super tập 17 - Sức mạnh của thần hủy diệt (Preview)' },
    { id: '2024_07_dragon-ball-super-tap-18-bardock-cha-e', num: 18, name: 'Dragon Ball Super Tập 18 - Bardock, cha đẻ của Goku' },
    { id: '2024_10_dragon-ball-super-tap-19-niem-tu-hao', num: 19, name: 'Dragon Ball Super Tập 19 - Niềm tự hào nguồn cội (Preview)' },
    { id: '2025_01_dragon-ball-super-tap-20-toan-luc-chien', num: 20, name: 'Dragon Ball Super tập 20 - Toàn lực chiến (Preview)' },
    { id: '2025_03_dragon-ball-super-tap-21-truyen-mau-ai', num: 21, name: 'Dragon Ball Super Tập 21 (truyện màu) Đại chiến Dr.Hedo' },
    { id: '2025_06_dragon-ball-super-tap-22-thay-tro-cung', num: 22, name: 'Dragon Ball Super Tập 22 (Truyện màu) - Thầy trò cùng xuất trận (Preview)' },
    { id: '2025_08_dragon-ball-super-tap-23-son-gohan-ai', num: 23, name: 'Dragon Ball Super tập 23 - Son Gohan đại thức tỉnh (Preview)' },
    { id: '2026_09_dragon-ball-super-tap-24-ke-thua-cho_0231872861', num: 24, name: 'Dragon Ball Super Tập 24 - Kế thừa cho tương lai' }
];
const DRAGON_BALL_CHAPTERS = [
    { id: '2020_05_dragon-ball-truyen-mau-tap-1', num: 1, name: 'DRAGON BALL - HỒI TUỔI THƠ (TRUYỆN MÀU FULL COLOR) TẬP 1' },
    { id: '2020_07_dragon-ball-hoi-tuoi-tho-truyen-mau-tap', num: 2, name: 'DRAGON BALL - HỒI TUỔI THƠ (TRUYỆN MÀU) TẬP 2' },
    { id: '2020_07_dragon-ball-hoi-tuoi-tho-truyen-mau-tap_23', num: 3, name: 'DRAGON BALL - HỒI TUỔI THƠ (TRUYỆN MÀU) TẬP 3 (PREVIEW)' },
    { id: '2020_08_dragon-ball-hoi-tuoi-tho-truyen-mau-tap', num: 4, name: 'DRAGON BALL- HỒI TUỔI THƠ (TRUYỆN MÀU) TẬP 4 (Preview)' },
    { id: '2020_10_dragon-ball-hoi-tuoi-tho-tap-5', num: 5, name: 'Dragon Ball - Hồi Tuổi thơ - tập 5' },
    { id: '2020_12_dragon-ball-hoi-tuoi-tho-tap-6', num: 6, name: 'Dragon Ball hồi Tuổi thơ - Tập 6' },
    { id: '2021_01_dragon-ball-hoi-tuoi-tho-tap-7-preview', num: 7, name: 'Dragon Ball hồi Tuổi thơ - Tập 7 (Preview)' },
    { id: '2021_02_dragon-ball-hoi-tuoi-tho-tap-8-preview', num: 8, name: 'Dragon Ball hồi Tuổi thơ - Tập 8 (Preview)' },
    { id: '2021_03_dragon-ball-hoi-tuoi-tho-tap-9', num: 9, name: 'Dragon Ball hồi Tuổi Thơ - Tập 9' },
    { id: '2021_05_dragon-ball-hoi-piccolo-tap-1', num: 10, name: 'Dragon Ball Hồi Piccolo - Tập 1' },
    { id: '2021_06_dragon-ball-hoi-piccolo-tap-2-preview', num: 11, name: 'Dragon Ball hồi Piccolo - Tập 2 (Preview)' },
    { id: '2021_07_dragon-ball-hoi-piccolo-tap-3-preview', num: 12, name: 'Dragon Ball hồi Piccolo - Tập 3 (Preview)' },
    { id: '2021_07_dragon-ball-hoi-piccolo-tap-4', num: 13, name: 'Dragon Ball hồi Piccolo - Tập 4' },
    { id: '2021_08_dragon-ball-hoi-piccolo-tap-5', num: 14, name: 'Dragon Ball hồi Piccolo - Tập 5' },
    { id: '2021_08_dragon-ball-hoi-piccolo-tap-6-preview', num: 15, name: 'Dragon Ball hồi Piccolo - Tập 6 (Preview)' },
    { id: '2021_08_dragon-ball-hoi-piccolo-tap-cuoi', num: 16, name: 'Dragon Ball hồi Piccolo - Tập cuối' },
    { id: '2019_08_bay-vien-ngoc-rong-ban-mau-hoi-saiyan', num: 17, name: 'Dragon Ball (Truyện màu Full Color) - Hồi Saiyan - Tập 1' },
    { id: '2019_09_bay-vien-ngoc-rong-truyen-mau-hoi', num: 18, name: 'BẢY VIÊN NGỌC RỒNG (TRUYỆN MÀU) - HỒI SAIYAN - TẬP 2' },
    { id: '2019_10_bay-vien-ngoc-rong-truyen-mau-hoi', num: 19, name: 'BẢY VIÊN NGỌC RỒNG MÀU - HỒI SAIYAN - Tập 3 (PREVIEW)' },
    { id: '2025_02_dragon-ball-truyen-mau-hoi-siayan-tap-4', num: 20, name: 'Dragon Ball Truyện màu - Hồi Siayan - Tập 4 (Preview)' },
    { id: '2019_11_bay-vien-ngoc-rong-ban-mau-hoi-frieza', num: 21, name: 'BẢY VIÊN NGỌC RỒNG (MÀU) - HỒI FRIEZA -TẬP 1' },
    { id: '2019_12_bay-vien-ngoc-rong-mau-hoi-frieza-tap-2', num: 22, name: 'BẢY VIÊN NGỌC RỒNG (MÀU) - HỒI FRIEZA - TẬP 2' },
    { id: '2020_03_7-vien-ngoc-rong-truyen-mau-hoi-frieza', num: 23, name: '7 VIÊN NGỌC RỒNG (TRUYỆN  MÀU) HỒI FRIEZA - TẬP 3' },
    { id: '2020_04_7-vien-ngoc-rong-hoi-frieza-mau-tap-4', num: 24, name: '7 VIÊN NGỌC RỒNG (HỒI FRIEZA) MÀU - TẬP 4' },
    { id: '2020_04_bay-vien-ngoc-rong-hoi-frieza-tap-cuoi', num: 25, name: 'BẢY VIÊN NGỌC RỒNG - HỒI FRIEZA - TẬP CUỐI' },
    { id: '2020_09_dragon-ball-hoi-cellandroid-tap-1', num: 26, name: 'DRAGON BALL HỒI CELL/ANDROID - TẬP 1  (Preview)' },
    { id: '2020_10_dragon-ball-hoi-cellandroid-tap-2', num: 27, name: 'Dragon Ball hồi Cell/Android - tập 2 (Preview)' },
    { id: '2020_10_dragon-ball-hoi-cellandroid-tap-3', num: 28, name: 'Dragon Ball hồi Cell/Android - Tập 3' },
    { id: '2020_11_dragon-ball-hoi-cellandroid-tap-4', num: 29, name: 'Dragon Ball hồi Cell/Android - Tập 4' },
    { id: '2020_11_dragon-ball-hoi-cellandroid-tap-5', num: 30, name: 'Dragon Ball hồi Cell/Android - Tập 5 (Preview)' },
    { id: '2020_12_dragon-ball-hoi-cellandroid-tap-6', num: 31, name: 'Dragon Ball hồi Cell/Android - Tập 6' },
    { id: '2020_12_dragon-ball-hoi-cellandroid-tap-7', num: 32, name: 'Dragon Ball hồi Cell/Android - Tập 7' },
    { id: '2021_01_dragon-ball-hoi-cellandroid-tap-cuoi', num: 33, name: 'Dragon Ball hồi Cell/Android - Tập cuối (Preview)' },
    { id: '2021_01_dragon-ball-hoi-mabu-tap-1', num: 34, name: 'Dragon Ball hồi Mabu - Tập 1' },
    { id: '2021_01_dragon-ball-hoi-mabu-tap-2', num: 35, name: 'Dragon Ball - Hồi Mabu - Tập 2' },
    { id: '2021_02_dragon-ball-hoi-mabu-tap-3-preview', num: 36, name: 'Dragon Ball - hồi Mabu - Tập 3 (Preview)' },
    { id: '2021_03_dragon-ball-hoi-mabu-tap-4-preview', num: 37, name: 'Dragon Ball hồi Mabu - Tập 4 (Preview)' },
    { id: '2021_03_dragon-ball-hoi-mabu-tap-5', num: 38, name: 'Dragon Ball hồi Mabu - Tập 5' },
    { id: '2021_04_dragon-ball-hoi-mabu-tap-6', num: 39, name: 'Dragon Ball hồi Mabu - Tập 6' },
    { id: '2021_04_dragon-ball-hoi-mabu-tap-7', num: 40, name: 'Dragon Ball hồi Mabu - Tập 7 (Preview)' },
    { id: '2021_04_dragon-ball-hoi-mabu-tap-cuoi', num: 41, name: 'Dragon Ball hồi Mabu - Tập cuối' }
];
exports.TruyenTranhPhapBiInfo = {
    version: '1.1.1',
    name: 'TruyenTranhPhapBi',
    icon: 'icon.png',
    author: 'Dutch25',
    authorWebsite: 'https://github.com/Dutch25',
    description: 'Extension for truyentranhphapbi.blogspot.com',
    contentRating: types_1.ContentRating.EVERYONE,
    websiteBaseURL: BASE_URL,
    sourceTags: [],
    intents: types_1.SourceIntents.MANGA_CHAPTERS |
        types_1.SourceIntents.HOMEPAGE_SECTIONS |
        types_1.SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
};
class TruyenTranhPhapBi extends types_1.Source {
    constructor() {
        super(...arguments);
        this.parser = new TruyenTranhPhapBiParser_1.Parser();
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
        sectionCallback(App.createHomeSection({
            id: 'Dragon Ball',
            title: 'Dragon Ball',
            containsMoreItems: false,
            type: types_1.HomeSectionType.singleRowNormal,
            items: [
                App.createPartialSourceManga({
                    mangaId: 'dragon-ball-super-aggregated',
                    title: 'Dragon Ball Super (Trọn Bộ Từ Tập 1-24)',
                    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7b3DqX3P9jD3D53C-R7d5D-2fG-34R33X34_5Z3/s400/cover.jpg'
                }),
                App.createPartialSourceManga({
                    mangaId: 'dragon-ball-aggregated',
                    title: 'Dragon Ball (Trọn Bộ 41 Tập)',
                    image: 'https://blogger.googleusercontent.com/img/a/AVvXsEjX06T5X0M9Vj9v6Q/s400/cover.jpg'
                })
            ]
        }));
        const sections = [
            { id: 'latest', title: 'Mới Cập Nhật', url: `${BASE_URL}/?m=0` },
            { id: 'Asterix', title: 'Asterix', url: `${BASE_URL}/search/label/Asterix?m=0` },
            { id: 'Lucky Luke', title: 'Lucky Luke', url: `${BASE_URL}/search/label/Lucky%20Luke?m=0` },
            { id: 'Xì trum', title: 'Xì trum', url: `${BASE_URL}/search/label/X%C3%AC%20trum?m=0` },
            { id: 'Tintin', title: 'Tintin', url: `${BASE_URL}/search/label/Tintin?m=0` },
            { id: 'Doremon', title: 'Doremon', url: `${BASE_URL}/search/label/Doremon?m=0` },
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
                const $ = this.cheerio.load(response.data);
                let items = this.parser.parseHomePage($);
                // Filter out individual Dragon Ball posts
                items = items.filter(item => !item.title.toLowerCase().includes('dragon ball'));
                sectionCallback(App.createHomeSection({
                    id: section.id,
                    title: section.title,
                    containsMoreItems: true,
                    type: types_1.HomeSectionType.singleRowNormal,
                    items: items,
                }));
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        return App.createPagedResults({ results: [], metadata: undefined });
    }
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 1;
        const searchQuery = encodeURIComponent(query.title ?? '');
        const url = `${BASE_URL}/search?q=${searchQuery}&m=0`;
        const response = await this.requestManager.schedule(App.createRequest({ url, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        let items = this.parser.parseHomePage($);
        items = items.filter(item => !item.title.toLowerCase().includes('dragon ball'));
        if (query.title && query.title.toLowerCase().includes('dragon ball')) {
            items.unshift(App.createPartialSourceManga({
                mangaId: 'dragon-ball-aggregated',
                title: 'Dragon Ball (Trọn Bộ 41 Tập)',
                image: 'https://blogger.googleusercontent.com/img/a/AVvXsEjX06T5X0M9Vj9v6Q/s400/cover.jpg'
            }));
            items.unshift(App.createPartialSourceManga({
                mangaId: 'dragon-ball-super-aggregated',
                title: 'Dragon Ball Super (Trọn Bộ Từ Tập 1-24)',
                image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7b3DqX3P9jD3D53C-R7d5D-2fG-34R33X34_5Z3/s400/cover.jpg'
            }));
        }
        return App.createPagedResults({ results: items, metadata: undefined });
    }
    async getMangaDetails(mangaId) {
        if (mangaId === 'dragon-ball-super-aggregated') {
            return App.createSourceManga({
                id: mangaId,
                mangaInfo: App.createMangaInfo({
                    titles: ['Dragon Ball Super (Trọn Bộ)'],
                    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7b3DqX3P9jD3D53C-R7d5D-2fG-34R33X34_5Z3/s400/cover.jpg',
                    status: 'ONGOING',
                    desc: 'Tổng hợp toàn bộ các tập truyện màu siêu nét của Dragon Ball Super.',
                })
            });
        }
        if (mangaId === 'dragon-ball-aggregated') {
            return App.createSourceManga({
                id: mangaId,
                mangaInfo: App.createMangaInfo({
                    titles: ['Dragon Ball (Trọn Bộ)'],
                    image: 'https://blogger.googleusercontent.com/img/a/AVvXsEjX06T5X0M9Vj9v6Q/s400/cover.jpg',
                    status: 'COMPLETED',
                    desc: 'Tổng hợp toàn bộ các tập truyện Dragon Ball Hồi Tuổi Thơ, Piccolo, Saiyan, Frieza, Cell, Mabu.',
                })
            });
        }
        const realId = mangaId.replace(/_/g, '/');
        const url = `${BASE_URL}/${realId}.html?m=0`;
        const response = await this.requestManager.schedule(App.createRequest({ url, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        return this.parser.parseMangaDetails($, mangaId);
    }
    async getChapters(mangaId) {
        if (mangaId === 'dragon-ball-super-aggregated') {
            return DRAGON_BALL_SUPER_CHAPTERS.map(ch => App.createChapter({
                id: ch.id,
                name: ch.name,
                chapNum: ch.num,
                langCode: 'vi'
            }));
        }
        if (mangaId === 'dragon-ball-aggregated') {
            return DRAGON_BALL_CHAPTERS.map(ch => App.createChapter({
                id: ch.id,
                name: ch.name,
                chapNum: ch.num,
                langCode: 'vi'
            }));
        }
        const realId = mangaId.replace(/_/g, '/');
        const url = `${BASE_URL}/${realId}.html?m=0`;
        const response = await this.requestManager.schedule(App.createRequest({ url, method: 'GET' }), 0);
        const $ = this.cheerio.load(response.data);
        return this.parser.parseChapters($, mangaId);
    }
    async getChapterDetails(mangaId, chapterId) {
        const realId = chapterId.replace(/_/g, '/');
        const url = `${BASE_URL}/${realId}.html?m=0`;
        const response = await this.requestManager.schedule(App.createRequest({ url, method: 'GET' }), 1);
        const $ = this.cheerio.load(response.data);
        const pages = this.parser.parseChapterPages($);
        if (pages.length === 0) {
            throw new Error(`No pages found for chapter ${chapterId}`);
        }
        return App.createChapterDetails({ id: chapterId, mangaId, pages });
    }
    getMangaShareUrl(mangaId) {
        const realId = mangaId.replace(/_/g, '/');
        return `${BASE_URL}/${realId}.html`;
    }
    async getSearchTags() {
        return this.parser.getSearchTags();
    }
}
exports.TruyenTranhPhapBi = TruyenTranhPhapBi;

},{"./TruyenTranhPhapBiParser":63,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    parseHomePage($) {
        const results = [];
        $('.post').each((_, el) => {
            const titleLink = $(el).find('.post-title a').first();
            if (titleLink.length === 0)
                return;
            const title = titleLink.text().trim();
            const href = titleLink.attr('href') ?? '';
            if (!href || !title)
                return;
            const match = href.match(/\/(\d{4}\/\d{2}\/[^/]+)\.html/);
            if (!match)
                return;
            const id = match[1].replace(/\//g, '_');
            let image = 'https://truyentranhphapbi.blogspot.com/favicon.ico';
            const htmlContent = $(el).html() || '';
            const imgMatch = htmlContent.match(/snips_image_creator\("([^"]+)"/);
            if (imgMatch) {
                image = imgMatch[1].replace(/\/s\d+[a-z-]*\//, '/s0/');
            }
            else {
                const fallbackImg = $(el).find('img').first().attr('src');
                if (fallbackImg && !fallbackImg.includes('icon18_edit')) {
                    image = fallbackImg;
                }
            }
            results.push(App.createPartialSourceManga({ mangaId: id, title, image }));
        });
        return results;
    }
    parseMangaDetails($, mangaId) {
        const title = $('meta[property="og:title"]').attr('content')?.trim()
            || $('h3.post-title').first().text().trim()
            || mangaId;
        const rawImage = $('meta[property="og:image"]').attr('content')?.trim() ?? '';
        const desc = $('meta[property="og:description"]').attr('content')?.trim() ?? '';
        const genres = [];
        $('.post-labels a').each((_, el) => {
            const label = $(el).text().trim();
            if (label) {
                genres.push(App.createTag({ id: label, label }));
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
    parseChapters($, mangaId) {
        const chapters = [];
        const title = $('h3.post-title').first().text().trim() || 'Chương 1';
        const timeText = $('.date-header span').first().text().trim();
        let time = new Date();
        if (timeText) {
            const parsed = new Date(timeText);
            if (!isNaN(parsed.getTime())) {
                time = parsed;
            }
        }
        chapters.push(App.createChapter({
            id: mangaId,
            chapNum: 1,
            name: title,
            time: time,
        }));
        return chapters;
    }
    parseChapterPages($) {
        const pages = [];
        $('.post-body img').each((_, el) => {
            let imgSrc = ($(el).attr('src') ?? '').trim();
            if (!imgSrc)
                return;
            const isImage = /\.(jpg|jpeg|png|webp|gif)($|\?)/i.test(imgSrc) || imgSrc.includes('blogger.googleusercontent.com') || imgSrc.includes('bp.blogspot.com');
            if (imgSrc && isImage) {
                // Handle /sXXX/ format
                imgSrc = imgSrc.replace(/\/[swh]\d+[a-z-]*\//, '/s0/');
                // Handle =sXXX format
                imgSrc = imgSrc.replace(/=s\d+[^/]*$/, '=s0');
                if (!pages.includes(imgSrc))
                    pages.push(imgSrc);
            }
        });
        return pages;
    }
    getSearchTags() {
        return [];
    }
}
exports.Parser = Parser;

},{}]},{},[62])(62)
});
