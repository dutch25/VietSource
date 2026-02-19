/*! For license information please see read.js.LICENSE.txt */
(() => {
    var t, e, n, r, i, o = {
        2207: (t, e, n) => {
            t.exports = n(7452)
        }
        ,
        3317: function (t) {
            t.exports = function () {
                "use strict";
                function t() {
                    return "undefined" != typeof window
                }
                function e() {
                    var t = !1;
                    try {
                        var e = {
                            get passive() {
                                t = !0
                            }
                        };
                        window.addEventListener("test", e, e),
                            window.removeEventListener("test", e, e)
                    } catch (e) {
                        t = !1
                    }
                    return t
                }
                function n() {
                    return !!(t() && function () { }
                        .bind && "classList" in document.documentElement && Object.assign && Object.keys && requestAnimationFrame)
                }
                function r(t) {
                    return 9 === t.nodeType
                }
                function i(t) {
                    return t && t.document && r(t.document)
                }
                function o(t) {
                    var e = t.document
                        , n = e.body
                        , r = e.documentElement;
                    return {
                        scrollHeight: function () {
                            return Math.max(n.scrollHeight, r.scrollHeight, n.offsetHeight, r.offsetHeight, n.clientHeight, r.clientHeight)
                        },
                        height: function () {
                            return t.innerHeight || r.clientHeight || n.clientHeight
                        },
                        scrollY: function () {
                            return void 0 !== t.pageYOffset ? t.pageYOffset : (r || n.parentNode || n).scrollTop
                        }
                    }
                }
                function s(t) {
                    return {
                        scrollHeight: function () {
                            return Math.max(t.scrollHeight, t.offsetHeight, t.clientHeight)
                        },
                        height: function () {
                            return Math.max(t.offsetHeight, t.clientHeight)
                        },
                        scrollY: function () {
                            return t.scrollTop
                        }
                    }
                }
                function a(t) {
                    return i(t) ? o(t) : s(t)
                }
                function c(t, n, r) {
                    var i, o = e(), s = !1, c = a(t), l = c.scrollY(), u = {};
                    function d() {
                        var t = Math.round(c.scrollY())
                            , e = c.height()
                            , i = c.scrollHeight();
                        u.scrollY = t,
                            u.lastScrollY = l,
                            u.direction = t > l ? "down" : "up",
                            u.distance = Math.abs(t - l),
                            u.isOutOfBounds = t < 0 || t + e > i,
                            u.top = t <= n.offset[u.direction],
                            u.bottom = t + e >= i,
                            u.toleranceExceeded = u.distance > n.tolerance[u.direction],
                            r(u),
                            l = t,
                            s = !1
                    }
                    function h() {
                        s || (s = !0,
                            i = requestAnimationFrame(d))
                    }
                    var f = !!o && {
                        passive: !0,
                        capture: !1
                    };
                    return t.addEventListener("scroll", h, f),
                        d(),
                    {
                        destroy: function () {
                            cancelAnimationFrame(i),
                                t.removeEventListener("scroll", h, f)
                        }
                    }
                }
                function l(t) {
                    return t === Object(t) ? t : {
                        down: t,
                        up: t
                    }
                }
                function u(t, e) {
                    e = e || {},
                        Object.assign(this, u.options, e),
                        this.classes = Object.assign({}, u.options.classes, e.classes),
                        this.elem = t,
                        this.tolerance = l(this.tolerance),
                        this.offset = l(this.offset),
                        this.initialised = !1,
                        this.frozen = !1
                }
                return u.prototype = {
                    constructor: u,
                    init: function () {
                        return u.cutsTheMustard && !this.initialised && (this.addClass("initial"),
                            this.initialised = !0,
                            setTimeout(function (t) {
                                t.scrollTracker = c(t.scroller, {
                                    offset: t.offset,
                                    tolerance: t.tolerance
                                }, t.update.bind(t))
                            }, 100, this)),
                            this
                    },
                    destroy: function () {
                        this.initialised = !1,
                            Object.keys(this.classes).forEach(this.removeClass, this),
                            this.scrollTracker.destroy()
                    },
                    unpin: function () {
                        !this.hasClass("pinned") && this.hasClass("unpinned") || (this.addClass("unpinned"),
                            this.removeClass("pinned"),
                            this.onUnpin && this.onUnpin.call(this))
                    },
                    pin: function () {
                        this.hasClass("unpinned") && (this.addClass("pinned"),
                            this.removeClass("unpinned"),
                            this.onPin && this.onPin.call(this))
                    },
                    freeze: function () {
                        this.frozen = !0,
                            this.addClass("frozen")
                    },
                    unfreeze: function () {
                        this.frozen = !1,
                            this.removeClass("frozen")
                    },
                    top: function () {
                        this.hasClass("top") || (this.addClass("top"),
                            this.removeClass("notTop"),
                            this.onTop && this.onTop.call(this))
                    },
                    notTop: function () {
                        this.hasClass("notTop") || (this.addClass("notTop"),
                            this.removeClass("top"),
                            this.onNotTop && this.onNotTop.call(this))
                    },
                    bottom: function () {
                        this.hasClass("bottom") || (this.addClass("bottom"),
                            this.removeClass("notBottom"),
                            this.onBottom && this.onBottom.call(this))
                    },
                    notBottom: function () {
                        this.hasClass("notBottom") || (this.addClass("notBottom"),
                            this.removeClass("bottom"),
                            this.onNotBottom && this.onNotBottom.call(this))
                    },
                    shouldUnpin: function (t) {
                        return "down" === t.direction && !t.top && t.toleranceExceeded
                    },
                    shouldPin: function (t) {
                        return "up" === t.direction && t.toleranceExceeded || t.top
                    },
                    addClass: function (t) {
                        this.elem.classList.add.apply(this.elem.classList, this.classes[t].split(" "))
                    },
                    removeClass: function (t) {
                        this.elem.classList.remove.apply(this.elem.classList, this.classes[t].split(" "))
                    },
                    hasClass: function (t) {
                        return this.classes[t].split(" ").every(function (t) {
                            return this.classList.contains(t)
                        }, this.elem)
                    },
                    update: function (t) {
                        t.isOutOfBounds || !0 !== this.frozen && (t.top ? this.top() : this.notTop(),
                            t.bottom ? this.bottom() : this.notBottom(),
                            this.shouldUnpin(t) ? this.unpin() : this.shouldPin(t) && this.pin())
                    }
                },
                    u.options = {
                        tolerance: {
                            up: 0,
                            down: 0
                        },
                        offset: 0,
                        scroller: t() ? window : null,
                        classes: {
                            frozen: "headroom--frozen",
                            pinned: "headroom--pinned",
                            unpinned: "headroom--unpinned",
                            top: "headroom--top",
                            notTop: "headroom--not-top",
                            bottom: "headroom--bottom",
                            notBottom: "headroom--not-bottom",
                            initial: "headroom"
                        }
                    },
                    u.cutsTheMustard = n(),
                    u
            }()
        },
        4447: (t, e, n) => {
            "use strict";
            n.a(t, async (t, e) => {
                try {
                    var r = n(2207)
                        , i = n.n(r)
                        , o = n(9082)
                        , s = n(3317);
                    function p(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }
                    function m(t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1,
                                r.configurable = !0,
                                "value" in r && (r.writable = !0),
                                Object.defineProperty(t, r.key, r)
                        }
                    }
                    function g(t, e, n) {
                        return e in t ? Object.defineProperty(t, e, {
                            value: n,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : t[e] = n,
                            t
                    }
                    function v(t, e, n, r, i, o, s) {
                        try {
                            var a = t[o](s)
                                , c = a.value
                        } catch (t) {
                            return void n(t)
                        }
                        a.done ? e(c) : Promise.resolve(c).then(r, i)
                    }
                    function y(t) {
                        return function () {
                            var e = this
                                , n = arguments;
                            return new Promise(function (r, i) {
                                var o = t.apply(e, n);
                                function s(t) {
                                    v(o, r, i, s, a, "next", t)
                                }
                                function a(t) {
                                    v(o, r, i, s, a, "throw", t)
                                }
                                s(void 0)
                            }
                            )
                        }
                    }
                    var a = new (n.n(s)())(document.querySelector("#chapter-nav"), {
                        classes: {
                            initial: "-translate-x-1/2 -translate-y-0 md:-translate-y-1",
                            pinned: "!-translate-y-0 md:!-translate-y-1",
                            unpinned: "!translate-y-full",
                            top: "chapter-nav--top",
                            notTop: "chapter-nav--not-top",
                            bottom: "chapter-nav--bottom",
                            notBottom: "chapter-nav--not-bottom",
                            frozen: "chapter-nav--frozen"
                        }
                    });
                    a.init(),
                        document.addEventListener("DOMContentLoaded", function () {
                            setTimeout(function () {
                                axios.post("/action/views", {
                                    chapter_id,
                                    _token: csrf_token
                                }).then(function (t) {
                                    var e = t.data.data;
                                    2 === e.s && Toast.fire({
                                        icon: "success",
                                        title: "Bạn được cộng ".concat(e.p, " điểm shop và ").concat(e.a, " điểm danh hiệu!")
                                    })
                                })
                            }, 5e3)
                        }),
                        window.nm5213 = function (t) {
                            t ? Swal.fire({
                                title: "Thông báo!",
                                text: "Bạn đang ở chương đầu",
                                icon: "info"
                            }) : Swal.fire({
                                title: "Thông báo!",
                                text: "Bạn đang ở chương cuối",
                                icon: "info"
                            })
                        }
                        ,
                        window.onCommentInputKeyDown = function (t) {
                            ["ArrowLeft", "ArrowRight"].includes(t.key) && t.stopPropagation()
                        }
                        ;
                    var c = new o.A(".glide", {
                        type: "carousel",
                        perView: 5,
                        autoplay: 2e3,
                        breakpoints: {
                            1024: {
                                perView: 5
                            },
                            800: {
                                perView: 3
                            },
                            640: {
                                perView: 2
                            }
                        }
                    });
                    c.on("mount.after", function () {
                        document.querySelector(".glide__track").classList.remove("opacity-0")
                    });
                    try {
                        c.mount()
                    } catch (H) { }
                    var l = document.getElementById("btn-top");
                    function w(t) {
                        document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ? l.removeAttribute("disabled") : l.setAttribute("disabled", "")
                    }
                    if (w(null),
                        l.addEventListener("click", function (t) {
                            scrollTo({
                                top: 0,
                                behavior: "smooth"
                            })
                        }),
                        window.onscroll = w,
                        document.getElementById("chapter-selector").addEventListener("change", function (t) {
                            var e = t.target.value;
                            window.location.replace(e)
                        }),
                        document.getElementById("btn-report-error").addEventListener("click", function (t) {
                            var e;
                            document.querySelector('a[href="/login"]') ? Swal.fire({
                                title: "Lỗi!",
                                text: "Để tránh spam, bạn cần đăng nhập để báo lỗi!",
                                icon: "error"
                            }) : Swal.fire({
                                input: "textarea",
                                inputLabel: "Báo lỗi",
                                inputPlaceholder: "Mô tả lỗi bạn đang gặp phải, không quá 255 ký tự...",
                                inputAttributes: {
                                    "aria-label": "Mô tả lỗi bạn đang gặp phải, không quá 255 ký tự..."
                                },
                                confirmButtonText: "Gửi báo lỗi",
                                showCancelButton: !0,
                                showLoaderOnConfirm: !0,
                                backdrop: !0,
                                preConfirm: (e = y(i().mark(function t(e) {
                                    return i().wrap(function (t) {
                                        for (; ;)
                                            switch (t.prev = t.next) {
                                                case 0:
                                                    if (e) {
                                                        t.next = 3;
                                                        break
                                                    }
                                                    return window.Toast.fire({
                                                        icon: "error",
                                                        title: "Vui lòng nhập mô tả"
                                                    }),
                                                        t.abrupt("return");
                                                case 3:
                                                    axios.post("/action/report-bugs", {
                                                        desc: e,
                                                        chapter_id,
                                                        _token: csrf_token
                                                    }).then(function (t) {
                                                        window.Toast.fire({
                                                            icon: "success",
                                                            title: "Báo lỗi thành công!"
                                                        })
                                                    }).catch(function (t) {
                                                        var e = t.response.data.error.message;
                                                        window.Toast.fire({
                                                            icon: "error",
                                                            title: e
                                                        })
                                                    });
                                                case 4:
                                                case "end":
                                                    return t.stop()
                                            }
                                    }, t)
                                })),
                                    function (t) {
                                        return e.apply(this, arguments)
                                    }
                                ),
                                allowOutsideClick: function () {
                                    return !Swal.isLoading()
                                }
                            })
                        }),
                        document.querySelector(".text-center.encrypted"))
                        try {
                            var u = new Go
                                , d = await fetch("/wasm/descrambler.wasm")
                                , h = await d.arrayBuffer()
                                , f = await WebAssembly.instantiate(h, u.importObject);
                            u.run(f.instance),
                                await new Promise(function (t) {
                                    return setTimeout(t, 100)
                                }
                                ),
                                b()
                        } catch (E) {
                            Swal.fire({
                                title: "Lỗi!",
                                text: "Failed to load WASM",
                                icon: "error"
                            })
                        }
                    function b() {
                        return x.apply(this, arguments)
                    }
                    function x() {
                        return x = y(i().mark(function t() {
                            var e, n, r, o, s, a;
                            return i().wrap(function (t) {
                                for (; ;)
                                    switch (t.prev = t.next) {
                                        case 0:
                                            for (e = document.querySelectorAll(".page"),
                                                console.log("Found ".concat(e.length, " pages to process in batches of ").concat(3)),
                                                n = [],
                                                r = 0; r < e.length; r += 3)
                                                n.push(Array.from(e).slice(r, r + 3));
                                            console.log("Processing ".concat(n.length, " batches sequentially")),
                                                o = i().mark(function t(r) {
                                                    var o, s, a, c, l, u, d;
                                                    return i().wrap(function (t) {
                                                        for (; ;)
                                                            switch (t.prev = t.next) {
                                                                case 0:
                                                                    return o = n[r],
                                                                        console.log("📦 Starting batch ".concat(r + 1, "/").concat(n.length, " (").concat(o.length, " items)")),
                                                                        s = document.getElementById("processing-status"),
                                                                        a = document.getElementById("processing-info"),
                                                                        s && a && (s.style.display = "block",
                                                                            a.textContent = "Processing batch ".concat(r + 1, "/").concat(n.length, "...")),
                                                                        c = o.map(function () {
                                                                            var t = y(i().mark(function t(n, o) {
                                                                                var s, a, c, l;
                                                                                return i().wrap(function (t) {
                                                                                    for (; ;)
                                                                                        switch (t.prev = t.next) {
                                                                                            case 0:
                                                                                                if (s = n.querySelector("canvas"),
                                                                                                    a = n.querySelector(".loading-status"),
                                                                                                    c = 3 * r + o + 1,
                                                                                                    !s || !s.dataset.img) {
                                                                                                    t.next = 22;
                                                                                                    break
                                                                                                }
                                                                                                return s.hasAttribute("data-context-menu-handled") || (s.addEventListener("contextmenu", function (t) {
                                                                                                    return t.preventDefault()
                                                                                                }),
                                                                                                    s.setAttribute("data-context-menu-handled", "true")),
                                                                                                    l = s.dataset.img,
                                                                                                    console.log("🔄 Batch ".concat(r + 1, " - Processing item ").concat(c, "/").concat(e.length, ": ").concat(l)),
                                                                                                    a && (a.textContent = "🔄 Batch ".concat(r + 1, " - Loading ").concat(l, "..."),
                                                                                                        a.className = "loading-status"),
                                                                                                    t.prev = 8,
                                                                                                    t.next = 11,
                                                                                                    k(s, l, a);
                                                                                            case 11:
                                                                                                return console.log("✅ Batch ".concat(r + 1, " - Item ").concat(c, " processed successfully")),
                                                                                                    t.abrupt("return", {
                                                                                                        success: !0,
                                                                                                        index: c
                                                                                                    });
                                                                                            case 15:
                                                                                                return t.prev = 15,
                                                                                                    t.t0 = t.catch(8),
                                                                                                    console.error("❌ Batch ".concat(r + 1, " - Failed to process item ").concat(c, ":"), t.t0),
                                                                                                    a && (a.textContent = "❌ Failed to load ".concat(l),
                                                                                                        a.className = "loading-status error"),
                                                                                                    t.abrupt("return", {
                                                                                                        success: !1,
                                                                                                        index: c,
                                                                                                        error: t.t0
                                                                                                    });
                                                                                            case 20:
                                                                                                t.next = 25;
                                                                                                break;
                                                                                            case 22:
                                                                                                return console.warn("⚠️ Batch ".concat(r + 1, " - Item ").concat(c, " missing canvas or data-img attribute")),
                                                                                                    a && (a.textContent = "❌ Missing image source",
                                                                                                        a.className = "loading-status error"),
                                                                                                    t.abrupt("return", {
                                                                                                        success: !1,
                                                                                                        index: c,
                                                                                                        error: "Missing canvas or data-img"
                                                                                                    });
                                                                                            case 25:
                                                                                            case "end":
                                                                                                return t.stop()
                                                                                        }
                                                                                }, t, null, [[8, 15]])
                                                                            }));
                                                                            return function (e, n) {
                                                                                return t.apply(this, arguments)
                                                                            }
                                                                        }()),
                                                                        t.next = 8,
                                                                        Promise.allSettled(c);
                                                                case 8:
                                                                    if (l = t.sent,
                                                                        u = l.filter(function (t) {
                                                                            return "fulfilled" === t.status && t.value.success
                                                                        }).length,
                                                                        d = l.length - u,
                                                                        console.log("📦 Batch ".concat(r + 1, " completed: ").concat(u, " successful, ").concat(d, " failed")),
                                                                        !(r < n.length - 1)) {
                                                                        t.next = 17;
                                                                        break
                                                                    }
                                                                    return console.log("⏱️ Waiting before starting batch ".concat(r + 2, "...")),
                                                                        window.gc && window.gc(),
                                                                        t.next = 17,
                                                                        new Promise(function (t) {
                                                                            return setTimeout(t, 1e3)
                                                                        }
                                                                        );
                                                                case 17:
                                                                case "end":
                                                                    return t.stop()
                                                            }
                                                    }, t)
                                                }),
                                                s = 0;
                                        case 8:
                                            if (!(s < n.length)) {
                                                t.next = 13;
                                                break
                                            }
                                            return t.delegateYield(o(s), "t0", 10);
                                        case 10:
                                            s++,
                                                t.next = 8;
                                            break;
                                        case 13:
                                            (a = document.getElementById("processing-status")) && (a.style.display = "none"),
                                                console.log("🧹 Performing final cleanup..."),
                                                window.gc && window.gc(),
                                                console.log("🎉 Finished processing all batches");
                                        case 18:
                                        case "end":
                                            return t.stop()
                                    }
                            }, t)
                        })),
                            x.apply(this, arguments)
                    }
                    function k(t, e, n) {
                        return _.apply(this, arguments)
                    }
                    function _() {
                        return (_ = y(i().mark(function t(e, n, r) {
                            var o, s, a, c, l, u;
                            return i().wrap(function (t) {
                                for (; ;)
                                    switch (t.prev = t.next) {
                                        case 0:
                                            return o = null,
                                                s = null,
                                                a = null,
                                                c = null,
                                                t.prev = 4,
                                                r && (r.textContent = "🔄 Loading image data..."),
                                                t.next = 8,
                                                fetch(n);
                                        case 8:
                                            return l = t.sent,
                                                t.next = 11,
                                                l.arrayBuffer();
                                        case 11:
                                            return c = t.sent,
                                                a = new Uint8Array(c),
                                                o = document.createElement("img"),
                                                u = new Blob([a]),
                                                s = URL.createObjectURL(u),
                                                t.abrupt("return", new Promise(function (t, l) {
                                                    var u = function () {
                                                        s && (URL.revokeObjectURL(s),
                                                            s = null),
                                                            o && (o.onload = null,
                                                                o.onerror = null,
                                                                o.src = "",
                                                                o.remove(),
                                                                o = null),
                                                            a = null,
                                                            c = null
                                                    };
                                                    o.onload = y(i().mark(function n() {
                                                        return i().wrap(function (n) {
                                                            for (; ;)
                                                                switch (n.prev = n.next) {
                                                                    case 0:
                                                                        return n.prev = 0,
                                                                            r && (r.textContent = "🔄 Descrambling..."),
                                                                            n.next = 4,
                                                                            L(o, a, e);
                                                                    case 4:
                                                                        r && (r.textContent = "✅ Successfully descrambled",
                                                                            r.className = "loading-status success hidden"),
                                                                            u(),
                                                                            t(),
                                                                            n.next = 14;
                                                                        break;
                                                                    case 9:
                                                                        n.prev = 9,
                                                                            n.t0 = n.catch(0),
                                                                            r && (r.textContent = "❌ Descrambling failed",
                                                                                r.className = "loading-status error"),
                                                                            u(),
                                                                            l(n.t0);
                                                                    case 14:
                                                                    case "end":
                                                                        return n.stop()
                                                                }
                                                        }, n, null, [[0, 9]])
                                                    })),
                                                        o.onerror = function () {
                                                            var t = "Failed to load image: ".concat(n);
                                                            console.error(t),
                                                                r && (r.textContent = "❌ Image load failed",
                                                                    r.className = "loading-status error"),
                                                                u(),
                                                                l(new Error(t))
                                                        }
                                                        ,
                                                        o.src = s
                                                }
                                                ));
                                        case 19:
                                            throw t.prev = 19,
                                            t.t0 = t.catch(4),
                                            s && URL.revokeObjectURL(s),
                                            o && (o.onload = null,
                                                o.onerror = null,
                                                o.src = "",
                                                o.remove()),
                                            a = null,
                                            c = null,
                                            r && (r.textContent = "❌ Fetch failed",
                                                r.className = "loading-status error"),
                                            t.t0;
                                        case 27:
                                        case "end":
                                            return t.stop()
                                    }
                            }, t, null, [[4, 19]])
                        }))).apply(this, arguments)
                    }
                    function L(t, e, n) {
                        return S.apply(this, arguments)
                    }
                    function S() {
                        return S = y(i().mark(function t(e, n, r) {
                            var o, s;
                            return i().wrap(function (t) {
                                for (; ;)
                                    switch (t.prev = t.next) {
                                        case 0:
                                            return o = null,
                                                t.prev = 1,
                                                console.log("Processing image:", e.src),
                                                r.width = e.naturalWidth,
                                                r.height = e.naturalHeight,
                                                t.next = 7,
                                                descrambleImageWithCanvasSecure(e, n, r);
                                        case 7:
                                            if (!(o = t.sent) || !o.success) {
                                                t.next = 15;
                                                break
                                            }
                                            return console.log("✅ Successfully descrambled:", e.src),
                                                r.style.display = "block",
                                                o = null,
                                                t.abrupt("return", !0);
                                        case 15:
                                            throw s = o ? o.error : "Unknown WASM error",
                                            console.error("❌ Descrambling failed:", s),
                                            o = null,
                                            new Error(s);
                                        case 19:
                                            t.next = 26;
                                            break;
                                        case 21:
                                            throw t.prev = 21,
                                            t.t0 = t.catch(1),
                                            console.error("Error processing image:", e.src, t.t0),
                                            o = null,
                                            t.t0;
                                        case 26:
                                        case "end":
                                            return t.stop()
                                    }
                            }, t, null, [[1, 21]])
                        })),
                            S.apply(this, arguments)
                    }
                    window.KuroReader = function () {
                        function t(e, n) {
                            var r = this
                                , i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                            p(this, t),
                                g(this, "wrapper", void 0),
                                g(this, "images", []),
                                g(this, "is_encrypted", !1),
                                g(this, "reading_mode", 1),
                                g(this, "reading_rtl", !1),
                                g(this, "observer", null),
                                g(this, "loadedImages", new Set),
                                g(this, "currentIndex", 0),
                                g(this, "hashChangeHandler", null),
                                g(this, "keydownHandler", null),
                                this.images = n,
                                this.wrapper = document.querySelector(e),
                                this.is_encrypted = i,
                                this.loadSetting(),
                                document.querySelectorAll(".reader-setting").forEach(function (t) {
                                    t.addEventListener("click", function () {
                                        return r.openSettingModal()
                                    })
                                }),
                                this.setupKeyboardNavigation()
                        }
                        var e, n, r;
                        return e = t,
                            n = [{
                                key: "loadSetting",
                                value: function () {
                                    this.wrapper.removeAttribute("id");
                                    var t = localStorage.getItem("kuro_reader_settings");
                                    if (t)
                                        try {
                                            var e = JSON.parse(t);
                                            this.reading_mode = e.reading_mode || this.reading_mode,
                                                this.reading_rtl = e.reading_rtl || this.reading_rtl
                                        } catch (t) {
                                            console.error("Failed to load settings:", t)
                                        }
                                    2 == this.reading_mode && "scrollRestoration" in history && (history.scrollRestoration = "manual")
                                }
                            }, {
                                key: "openSettingModal",
                                value: function () {
                                    var t = this
                                        , e = document.createElement("div");
                                    e.className = "fixed inset-0 bg-black/70 z-50 flex items-center justify-center",
                                        e.id = "reader-setting-modal";
                                    var n = document.createElement("div");
                                    n.className = "border border-gray-200 dark:border-primary-highlight bg-neutral-100 dark:bg-secondary-background rounded-lg p-6 max-w-md w-full mx-4",
                                        n.innerHTML = '\n            <div class="flex justify-between items-center mb-6">\n                <h3 class="text-xl font-bold">Cấu hình</h3>\n                <button class="text-gray-400 hover:text-white" onclick="this.closest(\'#reader-setting-modal\').remove()">\n                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>\n                    </svg>\n                </button>\n            </div>\n            \n            <div class="space-y-4">\n                \x3c!-- Reading Mode --\x3e\n                <div>\n                    <label class="block text-sm font-medium mb-2">Chế độ đọc</label>\n                    <div class="flex gap-2">\n                        <button class="reading-mode-btn flex-1 py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 '.concat(1 === this.reading_mode ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600", '" data-mode="1">\n                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>\n                            </svg>\n                            Dọc\n                        </button>\n                        <button class="reading-mode-btn flex-1 py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 ').concat(2 === this.reading_mode ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600", '" data-mode="2">\n                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>\n                            </svg>\n                            Ngang\n                        </button>\n                    </div>\n                </div>\n                \n                \x3c!-- Reading Direction (only for horizontal mode) --\x3e\n                <div id="rtl-setting" class="').concat(1 === this.reading_mode ? "hidden" : "", '">\n                    <label class="block text-sm font-medium mb-2">Hướng đọc</label>\n                    <div class="flex gap-2">\n                        <button class="reading-rtl-btn flex-1 py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 ').concat(this.reading_rtl ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-pink-500 text-white", '" data-rtl="false">\n                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>\n                            </svg>\n                            Trái sang phải\n                        </button>\n                        <button class="reading-rtl-btn flex-1 py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 ').concat(this.reading_rtl ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600", '" data-rtl="true">\n                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>\n                            </svg>\n                            Phải sang trái\n                        </button>\n                    </div>\n                </div>\n                \n                \x3c!-- Save Button --\x3e\n                <button id="save-settings-btn" class="w-full py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-medium transition-colors mt-6">\n                    Lưu\n                </button>\n            </div>\n        '),
                                        e.appendChild(n),
                                        document.body.appendChild(e);
                                    var r = this.reading_mode
                                        , i = this.reading_rtl;
                                    n.querySelectorAll(".reading-mode-btn").forEach(function (t) {
                                        t.addEventListener("click", function () {
                                            r = parseInt(this.dataset.mode),
                                                n.querySelectorAll(".reading-mode-btn").forEach(function (t) {
                                                    t.className = "reading-mode-btn flex-1 py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                }),
                                                this.className = "reading-mode-btn flex-1 py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 bg-pink-500 text-white";
                                            var t = n.querySelector("#rtl-setting");
                                            1 === r ? t.classList.add("hidden") : t.classList.remove("hidden")
                                        })
                                    }),
                                        n.querySelectorAll(".reading-rtl-btn").forEach(function (t) {
                                            t.addEventListener("click", function () {
                                                i = "true" === this.dataset.rtl,
                                                    n.querySelectorAll(".reading-rtl-btn").forEach(function (t) {
                                                        t.className = "reading-rtl-btn flex-1 py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                    }),
                                                    this.className = "reading-rtl-btn flex-1 py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 bg-pink-500 text-white"
                                            })
                                        }),
                                        n.querySelector("#save-settings-btn").addEventListener("click", function () {
                                            t.saveSettings(r, i),
                                                e.remove()
                                        }),
                                        e.addEventListener("click", function (t) {
                                            t.target === e && e.remove()
                                        })
                                }
                            }, {
                                key: "saveSettings",
                                value: function (t, e) {
                                    var n = this
                                        , r = {
                                            reading_mode: t,
                                            reading_rtl: e
                                        };
                                    localStorage.setItem("kuro_reader_settings", JSON.stringify(r));
                                    var i = this.reading_mode !== t
                                        , o = this.reading_rtl !== e;
                                    i || o ? (this.reading_mode = t,
                                        this.reading_rtl = e,
                                        window.Toast && window.Toast.fire({
                                            icon: "success",
                                            title: "Đã lưu và áp dụng cài đặt mới!"
                                        }),
                                        setTimeout(function () {
                                            n.reinitialize()
                                        }, 500)) : window.Toast && window.Toast.fire({
                                            icon: "info",
                                            title: "Không có thay đổi!"
                                        })
                                }
                            }, {
                                key: "reinitialize",
                                value: function () {
                                    var t = this;
                                    this.wrapper.innerHTML = "",
                                        this.wrapper.removeAttribute("style"),
                                        this.wrapper.removeAttribute("class"),
                                        this.loadedImages.clear(),
                                        this.currentIndex = 0,
                                        this.observer && (this.observer.disconnect(),
                                            this.observer = null),
                                        this.hashChangeHandler && (window.removeEventListener("hashchange", this.hashChangeHandler),
                                            this.hashChangeHandler = null),
                                        1 === this.reading_mode && window.location.hash && history.replaceState(null, "", window.location.pathname + window.location.search),
                                        2 == this.reading_mode && "scrollRestoration" in history ? history.scrollRestoration = "manual" : "scrollRestoration" in history && (history.scrollRestoration = "auto"),
                                        this.setupKeyboardNavigation(),
                                        this.render(),
                                        setTimeout(function () {
                                            t.wrapper.scrollIntoView({
                                                behavior: "auto",
                                                block: "start"
                                            })
                                        }, 100)
                                }
                            }, {
                                key: "setupKeyboardNavigation",
                                value: function () {
                                    var t = this;
                                    this.keydownHandler && (document.removeEventListener("keydown", this.keydownHandler),
                                        this.keydownHandler = null),
                                        this.keydownHandler = function (e) {
                                            "ArrowLeft" !== e.key && "ArrowRight" !== e.key || t.handleKeydown(e)
                                        }
                                        ,
                                        document.addEventListener("keydown", this.keydownHandler)
                                }
                            }, {
                                key: "handleKeydown",
                                value: function (t) {
                                    var e = document.getElementById("btn-next")
                                        , n = document.getElementById("btn-prev");
                                    if (e && n)
                                        if (1 !== this.reading_mode) {
                                            if (2 === this.reading_mode) {
                                                var r = !1
                                                    , i = !1;
                                                this.reading_rtl ? "ArrowLeft" === t.key ? r = !0 : "ArrowRight" === t.key && (i = !0) : "ArrowRight" === t.key ? r = !0 : "ArrowLeft" === t.key && (i = !0),
                                                    r ? this.currentIndex >= this.images.length - 1 ? e.click() : (this.currentIndex++,
                                                        this.displayHorizontalImage(this.currentIndex),
                                                        this.preloadHorizontalImages(this.currentIndex),
                                                        this.wrapper.scrollIntoView({
                                                            behavior: "auto",
                                                            block: "start"
                                                        }),
                                                        a.unpin(),
                                                        mainNavheadroom.unpin()) : i && (this.currentIndex <= 0 ? n.click() : (this.currentIndex--,
                                                            this.displayHorizontalImage(this.currentIndex),
                                                            this.preloadHorizontalImages(this.currentIndex),
                                                            this.wrapper.scrollIntoView({
                                                                behavior: "auto",
                                                                block: "start"
                                                            }),
                                                            a.unpin(),
                                                            mainNavheadroom.unpin()))
                                            }
                                        } else
                                            "ArrowLeft" === t.key ? n.click() : "ArrowRight" === t.key && e.click()
                                }
                            }, {
                                key: "render",
                                value: function () {
                                    1 === this.reading_mode ? this.renderVertical() : this.renderHorizontal()
                                }
                            }, {
                                key: "goToNext",
                                value: function () {
                                    2 === this.reading_mode && this.navigateHorizontal(this.reading_rtl ? "left" : "right")
                                }
                            }, {
                                key: "goToPrevious",
                                value: function () {
                                    2 === this.reading_mode && this.navigateHorizontal(this.reading_rtl ? "right" : "left")
                                }
                            }, {
                                key: "renderVertical",
                                value: function () {
                                    var t = this;
                                    this.images.forEach(function (e, n) {
                                        var r = document.createElement("div");
                                        r.className = "image-container relative w-full",
                                            r.dataset.index = n,
                                            r.style.minHeight = "500px",
                                            r.style.backgroundColor = "#f0f0f0";
                                        var i = document.createElement("div");
                                        i.className = "loading-placeholder absolute inset-0 flex items-center justify-center",
                                            i.innerHTML = '\n                <div class="text-center">\n                    <svg class="animate-spin h-10 w-10 mx-auto mb-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\n                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>\n                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\n                    </svg>\n                    <p class="text-gray-500 text-sm">Loading image '.concat(n + 1, "</p>\n                </div>\n            ");
                                        var o = document.createElement("img");
                                        o.dataset.src = e,
                                            o.dataset.index = n,
                                            o.className = "w-full lazy-image hidden",
                                            o.alt = "Page ".concat(n + 1),
                                            r.appendChild(i),
                                            r.appendChild(o),
                                            t.wrapper.appendChild(r)
                                    }),
                                        this.setupIntersectionObserver()
                                }
                            }, {
                                key: "setupIntersectionObserver",
                                value: function () {
                                    var t = this;
                                    this.observer = new IntersectionObserver(function (e) {
                                        e.forEach(function (e) {
                                            if (e.isIntersecting) {
                                                var n = e.target
                                                    , r = parseInt(n.dataset.index);
                                                t.loadImage(r);
                                                for (var i = -2; i <= 3; i++) {
                                                    var o = r + i;
                                                    o >= 0 && o < t.images.length && o !== r && t.loadImage(o)
                                                }
                                            }
                                        })
                                    }
                                        , {
                                            root: null,
                                            rootMargin: "1000px",
                                            threshold: .01
                                        }),
                                        this.wrapper.querySelectorAll(".image-container").forEach(function (e) {
                                            return t.observer.observe(e)
                                        })
                                }
                            }, {
                                key: "loadImage",
                                value: function (t) {
                                    var e = this;
                                    if (!this.loadedImages.has(t)) {
                                        this.loadedImages.add(t);
                                        var n = this.wrapper.querySelector('[data-index="'.concat(t, '"]'));
                                        if (n) {
                                            var r = n.querySelector(".lazy-image")
                                                , i = n.querySelector(".loading-placeholder")
                                                , o = r.dataset.src;
                                            if (o) {
                                                var s = new Image;
                                                s.onload = function () {
                                                    i && i.remove(),
                                                        r.src = o,
                                                        r.classList.remove("hidden"),
                                                        r.removeAttribute("data-src"),
                                                        n.style.minHeight = "",
                                                        n.style.backgroundColor = "",
                                                        e.observer.unobserve(n)
                                                }
                                                    ,
                                                    s.onerror = function () {
                                                        console.error("❌ Failed to load image ".concat(t + 1, ": ").concat(o)),
                                                            i && (i.innerHTML = '\n                    <div class="text-center">\n                        <svg class="h-10 w-10 mx-auto mb-2 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">\n                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />\n                        </svg>\n                        <p class="text-red-500 text-sm">Failed to load image '.concat(t + 1, '</p>\n                        <button class="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600" onclick="window.kuroReader.retryImage(').concat(t, ')">\n                            Retry\n                        </button>\n                    </div>\n                ')),
                                                            n.style.backgroundColor = "#fee"
                                                    }
                                                    ,
                                                    s.src = o
                                            }
                                        }
                                    }
                                }
                            }, {
                                key: "retryImage",
                                value: function (t) {
                                    this.loadedImages.delete(t);
                                    var e = this.wrapper.querySelector('[data-index="'.concat(t, '"]'));
                                    if (e) {
                                        var n = e.querySelector(".loading-placeholder");
                                        n && (n.innerHTML = '\n                    <div class="text-center">\n                        <svg class="animate-spin h-10 w-10 mx-auto mb-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\n                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>\n                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\n                        </svg>\n                        <p class="text-gray-500 text-sm">Retrying image '.concat(t + 1, "</p>\n                    </div>\n                ")),
                                            e.style.backgroundColor = "#f0f0f0",
                                            this.loadImage(t)
                                    }
                                }
                            }, {
                                key: "renderHorizontal",
                                value: function () {
                                    var t = this;
                                    this.wrapper.style.height = "100vh",
                                        this.wrapper.style.position = "relative",
                                        this.wrapper.style.overflow = "hidden",
                                        this.wrapper.className = "w-full flex items-center justify-center bg-white dark:bg-black";
                                    var e = window.location.hash;
                                    if (e && e.startsWith("#page-")) {
                                        var n = parseInt(e.replace("#page-", ""));
                                        !isNaN(n) && n >= 1 && n <= this.images.length && (this.currentIndex = n - 1)
                                    }
                                    var r = document.createElement("div");
                                    r.id = "horizontal-image-container",
                                        r.className = "relative w-full h-full flex items-center justify-center";
                                    var i = document.createElement("div");
                                    i.className = "absolute left-0 top-0 h-full w-1/3 cursor-pointer z-10 hover:bg-white/5 transition-colors",
                                        i.addEventListener("click", function () {
                                            return t.navigateHorizontal("left")
                                        });
                                    var o = document.createElement("div");
                                    o.className = "absolute right-0 top-0 h-full w-1/3 cursor-pointer z-10 hover:bg-white/5 transition-colors",
                                        o.addEventListener("click", function () {
                                            return t.navigateHorizontal("right")
                                        });
                                    var s = document.createElement("div");
                                    s.id = "image-display",
                                        s.className = "relative w-full h-full flex items-center justify-center",
                                        r.appendChild(s),
                                        r.appendChild(i),
                                        r.appendChild(o),
                                        this.wrapper.appendChild(r),
                                        this.createProgressBar(),
                                        this.displayHorizontalImage(this.currentIndex),
                                        this.preloadHorizontalImages(this.currentIndex),
                                        this.hashChangeHandler && window.removeEventListener("hashchange", this.hashChangeHandler),
                                        this.hashChangeHandler = function () {
                                            var e = window.location.hash;
                                            if (e && e.startsWith("#page-")) {
                                                var n = parseInt(e.replace("#page-", ""));
                                                if (!isNaN(n) && n >= 1 && n <= t.images.length) {
                                                    var r = n - 1;
                                                    r !== t.currentIndex && (t.currentIndex = r,
                                                        t.displayHorizontalImage(t.currentIndex, !1),
                                                        t.preloadHorizontalImages(t.currentIndex))
                                                }
                                            }
                                        }
                                        ,
                                        window.addEventListener("hashchange", this.hashChangeHandler),
                                        this.wrapper.scrollIntoView({
                                            behavior: "auto",
                                            block: "start"
                                        }),
                                        a.unpin(),
                                        mainNavheadroom.unpin()
                                }
                            }, {
                                key: "navigateHorizontal",
                                value: function (t) {
                                    var e;
                                    if ((e = this.reading_rtl ? "left" === t ? this.currentIndex + 1 : this.currentIndex - 1 : "right" === t ? this.currentIndex + 1 : this.currentIndex - 1) < 0) {
                                        var n = document.getElementById("btn-prev");
                                        n && n.click()
                                    } else if (e >= this.images.length) {
                                        var r = document.getElementById("btn-next");
                                        r && r.click()
                                    } else
                                        this.currentIndex = e,
                                            this.displayHorizontalImage(this.currentIndex),
                                            this.preloadHorizontalImages(this.currentIndex),
                                            this.wrapper.scrollIntoView({
                                                behavior: "auto",
                                                block: "start"
                                            }),
                                            a.unpin(),
                                            mainNavheadroom.unpin()
                                }
                            }, {
                                key: "displayHorizontalImage",
                                value: function (t) {
                                    var e = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]
                                        , n = document.getElementById("image-display");
                                    if (n) {
                                        e && window.history.replaceState(null, "", "#page-".concat(t + 1)),
                                            this.updateProgressBar(t),
                                            n.innerHTML = "";
                                        var r = this.images[t]
                                            , i = document.createElement("div");
                                        if (i.className = "relative w-full h-full flex items-center justify-center",
                                            i.dataset.index = t,
                                            this.loadedImages.has(t)) {
                                            var o = document.createElement("img");
                                            o.src = r,
                                                o.className = "max-w-full max-h-full object-contain",
                                                o.alt = "Page ".concat(t + 1),
                                                i.appendChild(o)
                                        } else {
                                            var s = document.createElement("div");
                                            s.className = "loading-placeholder flex items-center justify-center",
                                                s.innerHTML = '\n                <div class="text-center">\n                    <svg class="animate-spin h-10 w-10 mx-auto mb-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\n                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>\n                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\n                    </svg>\n                    <p class="text-gray-400 text-sm">Loading image '.concat(t + 1, "/").concat(this.images.length, "</p>\n                </div>\n            "),
                                                i.appendChild(s),
                                                this.loadHorizontalImage(t, i)
                                        }
                                        n.appendChild(i),
                                            this.updatePageCounter(t)
                                    }
                                }
                            }, {
                                key: "loadHorizontalImage",
                                value: function (t) {
                                    var e = this
                                        , n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
                                    if (this.loadedImages.has(t))
                                        return Promise.resolve();
                                    this.loadedImages.add(t);
                                    var r = this.images[t];
                                    return new Promise(function (i, o) {
                                        var s = new Image;
                                        s.onload = function () {
                                            if (n && t === e.currentIndex) {
                                                var o = n.querySelector(".loading-placeholder");
                                                o && o.remove();
                                                var s = document.createElement("img");
                                                s.src = r,
                                                    s.className = "max-w-full max-h-full object-contain",
                                                    s.alt = "Page ".concat(t + 1),
                                                    n.appendChild(s)
                                            }
                                            i()
                                        }
                                            ,
                                            s.onerror = function () {
                                                if (console.error("❌ Failed to load image ".concat(t + 1, ": ").concat(r)),
                                                    n && t === e.currentIndex) {
                                                    var i = n.querySelector(".loading-placeholder");
                                                    i && (i.innerHTML = '\n                            <div class="text-center">\n                                <svg class="h-10 w-10 mx-auto mb-2 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">\n                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />\n                                </svg>\n                                <p class="text-red-400 text-sm">Failed to load image '.concat(t + 1, '</p>\n                                <button class="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600" onclick="window.kuroReader.retryHorizontalImage(').concat(t, ')">\n                                    Retry\n                                </button>\n                            </div>\n                        '))
                                                }
                                                o(new Error("Failed to load image: ".concat(r)))
                                            }
                                            ,
                                            s.src = r
                                    }
                                    )
                                }
                            }, {
                                key: "preloadHorizontalImages",
                                value: function (t) {
                                    for (var e = -2; e <= 2; e++)
                                        if (0 !== e) {
                                            var n = t + e;
                                            n >= 0 && n < this.images.length && this.loadHorizontalImage(n)
                                        }
                                }
                            }, {
                                key: "retryHorizontalImage",
                                value: function (t) {
                                    this.loadedImages.delete(t);
                                    var e = document.querySelector('[data-index="'.concat(t, '"]'));
                                    if (e && t === this.currentIndex) {
                                        var n = e.querySelector(".loading-placeholder");
                                        n && (n.innerHTML = '\n                    <div class="text-center">\n                        <svg class="animate-spin h-10 w-10 mx-auto mb-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\n                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>\n                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\n                        </svg>\n                        <p class="text-gray-400 text-sm">Retrying image '.concat(t + 1, "</p>\n                    </div>\n                ")),
                                            this.loadHorizontalImage(t, e)
                                    }
                                }
                            }, {
                                key: "updatePageCounter",
                                value: function (t) {
                                    var e = document.querySelector("#page-counter");
                                    e && (e.textContent = "".concat(t + 1, " / ").concat(this.images.length))
                                }
                            }, {
                                key: "createProgressBar",
                                value: function () {
                                    var t = this
                                        , e = document.createElement("div");
                                    e.id = "horizontal-progress-bar",
                                        e.className = "absolute bottom-0 left-0 right-0 z-10 bg-black/60 backdrop-blur-sm flex ".concat(this.reading_rtl ? "flex-row-reverse" : "flex-row", " items-center gap-0.5 px-1 py-1 transition-all"),
                                        this.images.forEach(function (n, r) {
                                            var i = document.createElement("div");
                                            i.className = "progress-dot flex-1 h-1 bg-gray-400 cursor-pointer hover:bg-gray-200 transition-all",
                                                i.dataset.index = r,
                                                i.title = "Page ".concat(r + 1),
                                                i.addEventListener("click", function () {
                                                    t.currentIndex = r,
                                                        t.displayHorizontalImage(r),
                                                        t.preloadHorizontalImages(r)
                                                }),
                                                e.appendChild(i)
                                        }),
                                        e.addEventListener("mouseenter", function () {
                                            e.classList.add("py-2"),
                                                document.querySelectorAll(".progress-dot").forEach(function (e, n) {
                                                    n <= t.currentIndex ? (e.classList.remove("h-1.5"),
                                                        e.classList.add("h-3")) : (e.classList.remove("h-1"),
                                                            e.classList.add("h-2"))
                                                })
                                        }),
                                        e.addEventListener("mouseleave", function () {
                                            e.classList.remove("py-2"),
                                                document.querySelectorAll(".progress-dot").forEach(function (e, n) {
                                                    n <= t.currentIndex ? (e.classList.remove("h-3"),
                                                        e.classList.add("h-1.5")) : (e.classList.remove("h-2"),
                                                            e.classList.add("h-1"))
                                                })
                                        }),
                                        this.wrapper.appendChild(e)
                                }
                            }, {
                                key: "updateProgressBar",
                                value: function (t) {
                                    var e = document.querySelectorAll(".progress-dot")
                                        , n = document.getElementById("horizontal-progress-bar")
                                        , r = n && n.matches(":hover");
                                    e.forEach(function (e, n) {
                                        n <= t ? (e.classList.remove("bg-gray-400"),
                                            e.classList.add("bg-pink-400"),
                                            r ? (e.classList.remove("h-1", "h-1.5", "h-2"),
                                                e.classList.add("h-3")) : (e.classList.remove("h-1", "h-2", "h-3"),
                                                    e.classList.add("h-1.5"))) : (e.classList.remove("bg-pink-400"),
                                                        e.classList.add("bg-gray-400"),
                                                        r ? (e.classList.remove("h-1", "h-1.5", "h-3"),
                                                            e.classList.add("h-2")) : (e.classList.remove("h-1.5", "h-2", "h-3"),
                                                                e.classList.add("h-1")))
                                    })
                                }
                            }],
                            n && m(e.prototype, n),
                            r && m(e, r),
                            Object.defineProperty(e, "prototype", {
                                writable: !1
                            }),
                            t
                    }(),
                        e()
                } catch (C) {
                    e(C)
                }
            }
                , 1)
        }
        ,
        7452: t => {
            var e = function (t) {
                "use strict";
                var e, n = Object.prototype, r = n.hasOwnProperty, i = "function" == typeof Symbol ? Symbol : {}, o = i.iterator || "@@iterator", s = i.asyncIterator || "@@asyncIterator", a = i.toStringTag || "@@toStringTag";
                function c(t, e, n) {
                    return Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }),
                        t[e]
                }
                try {
                    c({}, "")
                } catch (t) {
                    c = function (t, e, n) {
                        return t[e] = n
                    }
                }
                function l(t, e, n, r) {
                    var i = e && e.prototype instanceof g ? e : g
                        , o = Object.create(i.prototype)
                        , s = new C(r || []);
                    return o._invoke = function (t, e, n) {
                        var r = d;
                        return function (i, o) {
                            if (r === f)
                                throw new Error("Generator is already running");
                            if (r === p) {
                                if ("throw" === i)
                                    throw o;
                                return T()
                            }
                            for (n.method = i,
                                n.arg = o; ;) {
                                var s = n.delegate;
                                if (s) {
                                    var a = S(s, n);
                                    if (a) {
                                        if (a === m)
                                            continue;
                                        return a
                                    }
                                }
                                if ("next" === n.method)
                                    n.sent = n._sent = n.arg;
                                else if ("throw" === n.method) {
                                    if (r === d)
                                        throw r = p,
                                        n.arg;
                                    n.dispatchException(n.arg)
                                } else
                                    "return" === n.method && n.abrupt("return", n.arg);
                                r = f;
                                var c = u(t, e, n);
                                if ("normal" === c.type) {
                                    if (r = n.done ? p : h,
                                        c.arg === m)
                                        continue;
                                    return {
                                        value: c.arg,
                                        done: n.done
                                    }
                                }
                                "throw" === c.type && (r = p,
                                    n.method = "throw",
                                    n.arg = c.arg)
                            }
                        }
                    }(t, n, s),
                        o
                }
                function u(t, e, n) {
                    try {
                        return {
                            type: "normal",
                            arg: t.call(e, n)
                        }
                    } catch (t) {
                        return {
                            type: "throw",
                            arg: t
                        }
                    }
                }
                t.wrap = l;
                var d = "suspendedStart"
                    , h = "suspendedYield"
                    , f = "executing"
                    , p = "completed"
                    , m = {};
                function g() { }
                function v() { }
                function y() { }
                var w = {};
                c(w, o, function () {
                    return this
                });
                var b = Object.getPrototypeOf
                    , x = b && b(b(I([])));
                x && x !== n && r.call(x, o) && (w = x);
                var k = y.prototype = g.prototype = Object.create(w);
                function _(t) {
                    ["next", "throw", "return"].forEach(function (e) {
                        c(t, e, function (t) {
                            return this._invoke(e, t)
                        })
                    })
                }
                function L(t, e) {
                    function n(i, o, s, a) {
                        var c = u(t[i], t, o);
                        if ("throw" !== c.type) {
                            var l = c.arg
                                , d = l.value;
                            return d && "object" == typeof d && r.call(d, "__await") ? e.resolve(d.__await).then(function (t) {
                                n("next", t, s, a)
                            }, function (t) {
                                n("throw", t, s, a)
                            }) : e.resolve(d).then(function (t) {
                                l.value = t,
                                    s(l)
                            }, function (t) {
                                return n("throw", t, s, a)
                            })
                        }
                        a(c.arg)
                    }
                    var i;
                    this._invoke = function (t, r) {
                        function o() {
                            return new e(function (e, i) {
                                n(t, r, e, i)
                            }
                            )
                        }
                        return i = i ? i.then(o, o) : o()
                    }
                }
                function S(t, n) {
                    var r = t.iterator[n.method];
                    if (r === e) {
                        if (n.delegate = null,
                            "throw" === n.method) {
                            if (t.iterator.return && (n.method = "return",
                                n.arg = e,
                                S(t, n),
                                "throw" === n.method))
                                return m;
                            n.method = "throw",
                                n.arg = new TypeError("The iterator does not provide a 'throw' method")
                        }
                        return m
                    }
                    var i = u(r, t.iterator, n.arg);
                    if ("throw" === i.type)
                        return n.method = "throw",
                            n.arg = i.arg,
                            n.delegate = null,
                            m;
                    var o = i.arg;
                    return o ? o.done ? (n[t.resultName] = o.value,
                        n.next = t.nextLoc,
                        "return" !== n.method && (n.method = "next",
                            n.arg = e),
                        n.delegate = null,
                        m) : o : (n.method = "throw",
                            n.arg = new TypeError("iterator result is not an object"),
                            n.delegate = null,
                            m)
                }
                function H(t) {
                    var e = {
                        tryLoc: t[0]
                    };
                    1 in t && (e.catchLoc = t[1]),
                        2 in t && (e.finallyLoc = t[2],
                            e.afterLoc = t[3]),
                        this.tryEntries.push(e)
                }
                function E(t) {
                    var e = t.completion || {};
                    e.type = "normal",
                        delete e.arg,
                        t.completion = e
                }
                function C(t) {
                    this.tryEntries = [{
                        tryLoc: "root"
                    }],
                        t.forEach(H, this),
                        this.reset(!0)
                }
                function I(t) {
                    if (t) {
                        var n = t[o];
                        if (n)
                            return n.call(t);
                        if ("function" == typeof t.next)
                            return t;
                        if (!isNaN(t.length)) {
                            var i = -1
                                , s = function n() {
                                    for (; ++i < t.length;)
                                        if (r.call(t, i))
                                            return n.value = t[i],
                                                n.done = !1,
                                                n;
                                    return n.value = e,
                                        n.done = !0,
                                        n
                                };
                            return s.next = s
                        }
                    }
                    return {
                        next: T
                    }
                }
                function T() {
                    return {
                        value: e,
                        done: !0
                    }
                }
                return v.prototype = y,
                    c(k, "constructor", y),
                    c(y, "constructor", v),
                    v.displayName = c(y, a, "GeneratorFunction"),
                    t.isGeneratorFunction = function (t) {
                        var e = "function" == typeof t && t.constructor;
                        return !!e && (e === v || "GeneratorFunction" === (e.displayName || e.name))
                    }
                    ,
                    t.mark = function (t) {
                        return Object.setPrototypeOf ? Object.setPrototypeOf(t, y) : (t.__proto__ = y,
                            c(t, a, "GeneratorFunction")),
                            t.prototype = Object.create(k),
                            t
                    }
                    ,
                    t.awrap = function (t) {
                        return {
                            __await: t
                        }
                    }
                    ,
                    _(L.prototype),
                    c(L.prototype, s, function () {
                        return this
                    }),
                    t.AsyncIterator = L,
                    t.async = function (e, n, r, i, o) {
                        void 0 === o && (o = Promise);
                        var s = new L(l(e, n, r, i), o);
                        return t.isGeneratorFunction(n) ? s : s.next().then(function (t) {
                            return t.done ? t.value : s.next()
                        })
                    }
                    ,
                    _(k),
                    c(k, a, "Generator"),
                    c(k, o, function () {
                        return this
                    }),
                    c(k, "toString", function () {
                        return "[object Generator]"
                    }),
                    t.keys = function (t) {
                        var e = [];
                        for (var n in t)
                            e.push(n);
                        return e.reverse(),
                            function n() {
                                for (; e.length;) {
                                    var r = e.pop();
                                    if (r in t)
                                        return n.value = r,
                                            n.done = !1,
                                            n
                                }
                                return n.done = !0,
                                    n
                            }
                    }
                    ,
                    t.values = I,
                    C.prototype = {
                        constructor: C,
                        reset: function (t) {
                            if (this.prev = 0,
                                this.next = 0,
                                this.sent = this._sent = e,
                                this.done = !1,
                                this.delegate = null,
                                this.method = "next",
                                this.arg = e,
                                this.tryEntries.forEach(E),
                                !t)
                                for (var n in this)
                                    "t" === n.charAt(0) && r.call(this, n) && !isNaN(+n.slice(1)) && (this[n] = e)
                        },
                        stop: function () {
                            this.done = !0;
                            var t = this.tryEntries[0].completion;
                            if ("throw" === t.type)
                                throw t.arg;
                            return this.rval
                        },
                        dispatchException: function (t) {
                            if (this.done)
                                throw t;
                            var n = this;
                            function i(r, i) {
                                return a.type = "throw",
                                    a.arg = t,
                                    n.next = r,
                                    i && (n.method = "next",
                                        n.arg = e),
                                    !!i
                            }
                            for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                                var s = this.tryEntries[o]
                                    , a = s.completion;
                                if ("root" === s.tryLoc)
                                    return i("end");
                                if (s.tryLoc <= this.prev) {
                                    var c = r.call(s, "catchLoc")
                                        , l = r.call(s, "finallyLoc");
                                    if (c && l) {
                                        if (this.prev < s.catchLoc)
                                            return i(s.catchLoc, !0);
                                        if (this.prev < s.finallyLoc)
                                            return i(s.finallyLoc)
                                    } else if (c) {
                                        if (this.prev < s.catchLoc)
                                            return i(s.catchLoc, !0)
                                    } else {
                                        if (!l)
                                            throw new Error("try statement without catch or finally");
                                        if (this.prev < s.finallyLoc)
                                            return i(s.finallyLoc)
                                    }
                                }
                            }
                        },
                        abrupt: function (t, e) {
                            for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                                var i = this.tryEntries[n];
                                if (i.tryLoc <= this.prev && r.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
                                    var o = i;
                                    break
                                }
                            }
                            o && ("break" === t || "continue" === t) && o.tryLoc <= e && e <= o.finallyLoc && (o = null);
                            var s = o ? o.completion : {};
                            return s.type = t,
                                s.arg = e,
                                o ? (this.method = "next",
                                    this.next = o.finallyLoc,
                                    m) : this.complete(s)
                        },
                        complete: function (t, e) {
                            if ("throw" === t.type)
                                throw t.arg;
                            return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg,
                                this.method = "return",
                                this.next = "end") : "normal" === t.type && e && (this.next = e),
                                m
                        },
                        finish: function (t) {
                            for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                                var n = this.tryEntries[e];
                                if (n.finallyLoc === t)
                                    return this.complete(n.completion, n.afterLoc),
                                        E(n),
                                        m
                            }
                        },
                        catch: function (t) {
                            for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                                var n = this.tryEntries[e];
                                if (n.tryLoc === t) {
                                    var r = n.completion;
                                    if ("throw" === r.type) {
                                        var i = r.arg;
                                        E(n)
                                    }
                                    return i
                                }
                            }
                            throw new Error("illegal catch attempt")
                        },
                        delegateYield: function (t, n, r) {
                            return this.delegate = {
                                iterator: I(t),
                                resultName: n,
                                nextLoc: r
                            },
                                "next" === this.method && (this.arg = e),
                                m
                        }
                    },
                    t
            }(t.exports);
            try {
                regeneratorRuntime = e
            } catch (t) {
                "object" == typeof globalThis ? globalThis.regeneratorRuntime = e : Function("r", "regeneratorRuntime = r")(e)
            }
        }
        ,
        9082: (t, e, n) => {
            "use strict";
            function r(t) {
                return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                    return typeof t
                }
                    : function (t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                    }
                    ,
                    r(t)
            }
            function i(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }
            function o(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value" in r && (r.writable = !0),
                        Object.defineProperty(t, r.key, r)
                }
            }
            function s(t, e, n) {
                return e && o(t.prototype, e),
                    n && o(t, n),
                    t
            }
            function a(t) {
                return a = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
                    return t.__proto__ || Object.getPrototypeOf(t)
                }
                    ,
                    a(t)
            }
            function c(t, e) {
                return c = Object.setPrototypeOf || function (t, e) {
                    return t.__proto__ = e,
                        t
                }
                    ,
                    c(t, e)
            }
            function l(t, e) {
                if (e && ("object" == typeof e || "function" == typeof e))
                    return e;
                if (void 0 !== e)
                    throw new TypeError("Derived constructors may only return object or undefined");
                return function (t) {
                    if (void 0 === t)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return t
                }(t)
            }
            function u(t) {
                var e = function () {
                    if ("undefined" == typeof Reflect || !Reflect.construct)
                        return !1;
                    if (Reflect.construct.sham)
                        return !1;
                    if ("function" == typeof Proxy)
                        return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () { })),
                            !0
                    } catch (t) {
                        return !1
                    }
                }();
                return function () {
                    var n, r = a(t);
                    if (e) {
                        var i = a(this).constructor;
                        n = Reflect.construct(r, arguments, i)
                    } else
                        n = r.apply(this, arguments);
                    return l(this, n)
                }
            }
            function d() {
                return d = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) {
                    var r = function (t, e) {
                        for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = a(t));)
                            ;
                        return t
                    }(t, e);
                    if (r) {
                        var i = Object.getOwnPropertyDescriptor(r, e);
                        return i.get ? i.get.call(arguments.length < 3 ? t : n) : i.value
                    }
                }
                    ,
                    d.apply(this, arguments)
            }
            n.d(e, {
                A: () => J
            });
            var h = {
                type: "slider",
                startAt: 0,
                perView: 1,
                focusAt: 0,
                gap: 10,
                autoplay: !1,
                hoverpause: !0,
                keyboard: !0,
                bound: !1,
                swipeThreshold: 80,
                dragThreshold: 120,
                perSwipe: "",
                touchRatio: .5,
                touchAngle: 45,
                animationDuration: 400,
                rewind: !0,
                rewindDuration: 800,
                animationTimingFunc: "cubic-bezier(.165, .840, .440, 1)",
                waitForTransition: !0,
                throttle: 10,
                direction: "ltr",
                peek: 0,
                cloningRatio: 1,
                breakpoints: {},
                classes: {
                    swipeable: "glide--swipeable",
                    dragging: "glide--dragging",
                    direction: {
                        ltr: "glide--ltr",
                        rtl: "glide--rtl"
                    },
                    type: {
                        slider: "glide--slider",
                        carousel: "glide--carousel"
                    },
                    slide: {
                        clone: "glide__slide--clone",
                        active: "glide__slide--active"
                    },
                    arrow: {
                        disabled: "glide__arrow--disabled"
                    },
                    nav: {
                        active: "glide__bullet--active"
                    }
                }
            };
            function f(t) {
                console.error("[Glide warn]: ".concat(t))
            }
            function p(t) {
                return parseInt(t)
            }
            function m(t) {
                return "string" == typeof t
            }
            function g(t) {
                var e = r(t);
                return "function" === e || "object" === e && !!t
            }
            function v(t) {
                return "function" == typeof t
            }
            function y(t) {
                return void 0 === t
            }
            function w(t) {
                return t.constructor === Array
            }
            function b(t, e, n) {
                Object.defineProperty(t, e, n)
            }
            function x(t, e) {
                var n = Object.assign({}, t, e);
                return e.hasOwnProperty("classes") && (n.classes = Object.assign({}, t.classes, e.classes),
                    e.classes.hasOwnProperty("direction") && (n.classes.direction = Object.assign({}, t.classes.direction, e.classes.direction)),
                    e.classes.hasOwnProperty("type") && (n.classes.type = Object.assign({}, t.classes.type, e.classes.type)),
                    e.classes.hasOwnProperty("slide") && (n.classes.slide = Object.assign({}, t.classes.slide, e.classes.slide)),
                    e.classes.hasOwnProperty("arrow") && (n.classes.arrow = Object.assign({}, t.classes.arrow, e.classes.arrow)),
                    e.classes.hasOwnProperty("nav") && (n.classes.nav = Object.assign({}, t.classes.nav, e.classes.nav))),
                    e.hasOwnProperty("breakpoints") && (n.breakpoints = Object.assign({}, t.breakpoints, e.breakpoints)),
                    n
            }
            var k = function () {
                function t() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    i(this, t),
                        this.events = e,
                        this.hop = e.hasOwnProperty
                }
                return s(t, [{
                    key: "on",
                    value: function (t, e) {
                        if (!w(t)) {
                            this.hop.call(this.events, t) || (this.events[t] = []);
                            var n = this.events[t].push(e) - 1;
                            return {
                                remove: function () {
                                    delete this.events[t][n]
                                }
                            }
                        }
                        for (var r = 0; r < t.length; r++)
                            this.on(t[r], e)
                    }
                }, {
                    key: "emit",
                    value: function (t, e) {
                        if (w(t))
                            for (var n = 0; n < t.length; n++)
                                this.emit(t[n], e);
                        else
                            this.hop.call(this.events, t) && this.events[t].forEach(function (t) {
                                t(e || {})
                            })
                    }
                }]),
                    t
            }()
                , _ = function () {
                    function t(e) {
                        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                        i(this, t),
                            this._c = {},
                            this._t = [],
                            this._e = new k,
                            this.disabled = !1,
                            this.selector = e,
                            this.settings = x(h, n),
                            this.index = this.settings.startAt
                    }
                    return s(t, [{
                        key: "mount",
                        value: function () {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                            return this._e.emit("mount.before"),
                                g(t) ? this._c = function (t, e, n) {
                                    var r = {};
                                    for (var i in e)
                                        v(e[i]) ? r[i] = e[i](t, r, n) : f("Extension must be a function");
                                    for (var o in r)
                                        v(r[o].mount) && r[o].mount();
                                    return r
                                }(this, t, this._e) : f("You need to provide a object on `mount()`"),
                                this._e.emit("mount.after"),
                                this
                        }
                    }, {
                        key: "mutate",
                        value: function () {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
                            return w(t) ? this._t = t : f("You need to provide a array on `mutate()`"),
                                this
                        }
                    }, {
                        key: "update",
                        value: function () {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                            return this.settings = x(this.settings, t),
                                t.hasOwnProperty("startAt") && (this.index = t.startAt),
                                this._e.emit("update"),
                                this
                        }
                    }, {
                        key: "go",
                        value: function (t) {
                            return this._c.Run.make(t),
                                this
                        }
                    }, {
                        key: "move",
                        value: function (t) {
                            return this._c.Transition.disable(),
                                this._c.Move.make(t),
                                this
                        }
                    }, {
                        key: "destroy",
                        value: function () {
                            return this._e.emit("destroy"),
                                this
                        }
                    }, {
                        key: "play",
                        value: function () {
                            var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                            return t && (this.settings.autoplay = t),
                                this._e.emit("play"),
                                this
                        }
                    }, {
                        key: "pause",
                        value: function () {
                            return this._e.emit("pause"),
                                this
                        }
                    }, {
                        key: "disable",
                        value: function () {
                            return this.disabled = !0,
                                this
                        }
                    }, {
                        key: "enable",
                        value: function () {
                            return this.disabled = !1,
                                this
                        }
                    }, {
                        key: "on",
                        value: function (t, e) {
                            return this._e.on(t, e),
                                this
                        }
                    }, {
                        key: "isType",
                        value: function (t) {
                            return this.settings.type === t
                        }
                    }, {
                        key: "settings",
                        get: function () {
                            return this._o
                        },
                        set: function (t) {
                            g(t) ? this._o = t : f("Options must be an `object` instance.")
                        }
                    }, {
                        key: "index",
                        get: function () {
                            return this._i
                        },
                        set: function (t) {
                            this._i = p(t)
                        }
                    }, {
                        key: "type",
                        get: function () {
                            return this.settings.type
                        }
                    }, {
                        key: "disabled",
                        get: function () {
                            return this._d
                        },
                        set: function (t) {
                            this._d = !!t
                        }
                    }]),
                        t
                }();
            function L() {
                return (new Date).getTime()
            }
            function S(t, e, n) {
                var r, i, o, s, a = 0;
                n || (n = {});
                var c = function () {
                    a = !1 === n.leading ? 0 : L(),
                        r = null,
                        s = t.apply(i, o),
                        r || (i = o = null)
                }
                    , l = function () {
                        var l = L();
                        a || !1 !== n.leading || (a = l);
                        var u = e - (l - a);
                        return i = this,
                            o = arguments,
                            u <= 0 || u > e ? (r && (clearTimeout(r),
                                r = null),
                                a = l,
                                s = t.apply(i, o),
                                r || (i = o = null)) : r || !1 === n.trailing || (r = setTimeout(c, u)),
                            s
                    };
                return l.cancel = function () {
                    clearTimeout(r),
                        a = 0,
                        r = i = o = null
                }
                    ,
                    l
            }
            var H = {
                ltr: ["marginLeft", "marginRight"],
                rtl: ["marginRight", "marginLeft"]
            };
            function E(t) {
                if (t && t.parentNode) {
                    for (var e = t.parentNode.firstChild, n = []; e; e = e.nextSibling)
                        1 === e.nodeType && e !== t && n.push(e);
                    return n
                }
                return []
            }
            function C(t) {
                return !!(t && t instanceof window.HTMLElement)
            }
            var I = '[data-glide-el="track"]';
            var T = function () {
                function t() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    i(this, t),
                        this.listeners = e
                }
                return s(t, [{
                    key: "on",
                    value: function (t, e, n) {
                        var r = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                        m(t) && (t = [t]);
                        for (var i = 0; i < t.length; i++)
                            this.listeners[t[i]] = n,
                                e.addEventListener(t[i], this.listeners[t[i]], r)
                    }
                }, {
                    key: "off",
                    value: function (t, e) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                        m(t) && (t = [t]);
                        for (var r = 0; r < t.length; r++)
                            e.removeEventListener(t[r], this.listeners[t[r]], n)
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        delete this.listeners
                    }
                }]),
                    t
            }();
            var O = ["ltr", "rtl"]
                , z = {
                    ">": "<",
                    "<": ">",
                    "=": "="
                };
            function j(t, e) {
                return {
                    modify: function (t) {
                        return e.Direction.is("rtl") ? -t : t
                    }
                }
            }
            function A(t, e) {
                return {
                    modify: function (t) {
                        var n = Math.floor(t / e.Sizes.slideWidth);
                        return t + e.Gaps.value * n
                    }
                }
            }
            function P(t, e) {
                return {
                    modify: function (t) {
                        return t + e.Clones.grow / 2
                    }
                }
            }
            function B(t, e) {
                return {
                    modify: function (n) {
                        if (t.settings.focusAt >= 0) {
                            var r = e.Peek.value;
                            return g(r) ? n - r.before : n - r
                        }
                        return n
                    }
                }
            }
            function M(t, e) {
                return {
                    modify: function (n) {
                        var r = e.Gaps.value
                            , i = e.Sizes.width
                            , o = t.settings.focusAt
                            , s = e.Sizes.slideWidth;
                        return "center" === o ? n - (i / 2 - s / 2) : n - s * o - r * o
                    }
                }
            }
            var R = !1;
            try {
                var N = Object.defineProperty({}, "passive", {
                    get: function () {
                        R = !0
                    }
                });
                window.addEventListener("testPassive", null, N),
                    window.removeEventListener("testPassive", null, N)
            } catch (t) { }
            var q = R
                , D = ["touchstart", "mousedown"]
                , F = ["touchmove", "mousemove"]
                , V = ["touchend", "touchcancel", "mouseup", "mouseleave"]
                , W = ["mousedown", "mousemove", "mouseup", "mouseleave"];
            var G = '[data-glide-el^="controls"]'
                , Y = "".concat(G, ' [data-glide-dir*="<"]')
                , U = "".concat(G, ' [data-glide-dir*=">"]');
            function K(t) {
                return g(t) ? (e = t,
                    Object.keys(e).sort().reduce(function (t, n) {
                        return t[n] = e[n],
                            t[n],
                            t
                    }, {})) : (f("Breakpoints option must be an object"),
                        {});
                var e
            }
            var X = {
                Html: function (t, e, n) {
                    var r = {
                        mount: function () {
                            this.root = t.selector,
                                this.track = this.root.querySelector(I),
                                this.collectSlides()
                        },
                        collectSlides: function () {
                            this.slides = Array.prototype.slice.call(this.wrapper.children).filter(function (e) {
                                return !e.classList.contains(t.settings.classes.slide.clone)
                            })
                        }
                    };
                    return b(r, "root", {
                        get: function () {
                            return r._r
                        },
                        set: function (t) {
                            m(t) && (t = document.querySelector(t)),
                                C(t) ? r._r = t : f("Root element must be a existing Html node")
                        }
                    }),
                        b(r, "track", {
                            get: function () {
                                return r._t
                            },
                            set: function (t) {
                                C(t) ? r._t = t : f("Could not find track element. Please use ".concat(I, " attribute."))
                            }
                        }),
                        b(r, "wrapper", {
                            get: function () {
                                return r.track.children[0]
                            }
                        }),
                        n.on("update", function () {
                            r.collectSlides()
                        }),
                        r
                },
                Translate: function (t, e, n) {
                    var r = {
                        set: function (n) {
                            var r = function (t, e, n) {
                                var r = [A, P, B, M].concat(t._t, [j]);
                                return {
                                    mutate: function (i) {
                                        for (var o = 0; o < r.length; o++) {
                                            var s = r[o];
                                            v(s) && v(s().modify) ? i = s(t, e, n).modify(i) : f("Transformer should be a function that returns an object with `modify()` method")
                                        }
                                        return i
                                    }
                                }
                            }(t, e).mutate(n)
                                , i = "translate3d(".concat(-1 * r, "px, 0px, 0px)");
                            e.Html.wrapper.style.mozTransform = i,
                                e.Html.wrapper.style.webkitTransform = i,
                                e.Html.wrapper.style.transform = i
                        },
                        remove: function () {
                            e.Html.wrapper.style.transform = ""
                        },
                        getStartIndex: function () {
                            var n = e.Sizes.length
                                , r = t.index
                                , i = t.settings.perView;
                            return e.Run.isOffset(">") || e.Run.isOffset("|>") ? n + (r - i) : (r + i) % n
                        },
                        getTravelDistance: function () {
                            var n = e.Sizes.slideWidth * t.settings.perView;
                            return e.Run.isOffset(">") || e.Run.isOffset("|>") ? -1 * n : n
                        }
                    };
                    return n.on("move", function (i) {
                        if (!t.isType("carousel") || !e.Run.isOffset())
                            return r.set(i.movement);
                        e.Transition.after(function () {
                            n.emit("translate.jump"),
                                r.set(e.Sizes.slideWidth * t.index)
                        });
                        var o = e.Sizes.slideWidth * e.Translate.getStartIndex();
                        return r.set(o - e.Translate.getTravelDistance())
                    }),
                        n.on("destroy", function () {
                            r.remove()
                        }),
                        r
                },
                Transition: function (t, e, n) {
                    var r = !1
                        , i = {
                            compose: function (e) {
                                var n = t.settings;
                                return r ? "".concat(e, " 0ms ").concat(n.animationTimingFunc) : "".concat(e, " ").concat(this.duration, "ms ").concat(n.animationTimingFunc)
                            },
                            set: function () {
                                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "transform";
                                e.Html.wrapper.style.transition = this.compose(t)
                            },
                            remove: function () {
                                e.Html.wrapper.style.transition = ""
                            },
                            after: function (t) {
                                setTimeout(function () {
                                    t()
                                }, this.duration)
                            },
                            enable: function () {
                                r = !1,
                                    this.set()
                            },
                            disable: function () {
                                r = !0,
                                    this.set()
                            }
                        };
                    return b(i, "duration", {
                        get: function () {
                            var n = t.settings;
                            return t.isType("slider") && e.Run.offset ? n.rewindDuration : n.animationDuration
                        }
                    }),
                        n.on("move", function () {
                            i.set()
                        }),
                        n.on(["build.before", "resize", "translate.jump"], function () {
                            i.disable()
                        }),
                        n.on("run", function () {
                            i.enable()
                        }),
                        n.on("destroy", function () {
                            i.remove()
                        }),
                        i
                },
                Direction: function (t, e, n) {
                    var r = {
                        mount: function () {
                            this.value = t.settings.direction
                        },
                        resolve: function (t) {
                            var e = t.slice(0, 1);
                            return this.is("rtl") ? t.split(e).join(z[e]) : t
                        },
                        is: function (t) {
                            return this.value === t
                        },
                        addClass: function () {
                            e.Html.root.classList.add(t.settings.classes.direction[this.value])
                        },
                        removeClass: function () {
                            e.Html.root.classList.remove(t.settings.classes.direction[this.value])
                        }
                    };
                    return b(r, "value", {
                        get: function () {
                            return r._v
                        },
                        set: function (t) {
                            O.indexOf(t) > -1 ? r._v = t : f("Direction value must be `ltr` or `rtl`")
                        }
                    }),
                        n.on(["destroy", "update"], function () {
                            r.removeClass()
                        }),
                        n.on("update", function () {
                            r.mount()
                        }),
                        n.on(["build.before", "update"], function () {
                            r.addClass()
                        }),
                        r
                },
                Peek: function (t, e, n) {
                    var r = {
                        mount: function () {
                            this.value = t.settings.peek
                        }
                    };
                    return b(r, "value", {
                        get: function () {
                            return r._v
                        },
                        set: function (t) {
                            g(t) ? (t.before = p(t.before),
                                t.after = p(t.after)) : t = p(t),
                                r._v = t
                        }
                    }),
                        b(r, "reductor", {
                            get: function () {
                                var e = r.value
                                    , n = t.settings.perView;
                                return g(e) ? e.before / n + e.after / n : 2 * e / n
                            }
                        }),
                        n.on(["resize", "update"], function () {
                            r.mount()
                        }),
                        r
                },
                Sizes: function (t, e, n) {
                    var r = {
                        setupSlides: function () {
                            for (var t = "".concat(this.slideWidth, "px"), n = e.Html.slides, r = 0; r < n.length; r++)
                                n[r].style.width = t
                        },
                        setupWrapper: function () {
                            e.Html.wrapper.style.width = "".concat(this.wrapperSize, "px")
                        },
                        remove: function () {
                            for (var t = e.Html.slides, n = 0; n < t.length; n++)
                                t[n].style.width = "";
                            e.Html.wrapper.style.width = ""
                        }
                    };
                    return b(r, "length", {
                        get: function () {
                            return e.Html.slides.length
                        }
                    }),
                        b(r, "width", {
                            get: function () {
                                return e.Html.track.offsetWidth
                            }
                        }),
                        b(r, "wrapperSize", {
                            get: function () {
                                return r.slideWidth * r.length + e.Gaps.grow + e.Clones.grow
                            }
                        }),
                        b(r, "slideWidth", {
                            get: function () {
                                return r.width / t.settings.perView - e.Peek.reductor - e.Gaps.reductor
                            }
                        }),
                        n.on(["build.before", "resize", "update"], function () {
                            r.setupSlides(),
                                r.setupWrapper()
                        }),
                        n.on("destroy", function () {
                            r.remove()
                        }),
                        r
                },
                Gaps: function (t, e, n) {
                    var r = {
                        apply: function (t) {
                            for (var n = 0, r = t.length; n < r; n++) {
                                var i = t[n].style
                                    , o = e.Direction.value;
                                i[H[o][0]] = 0 !== n ? "".concat(this.value / 2, "px") : "",
                                    n !== t.length - 1 ? i[H[o][1]] = "".concat(this.value / 2, "px") : i[H[o][1]] = ""
                            }
                        },
                        remove: function (t) {
                            for (var e = 0, n = t.length; e < n; e++) {
                                var r = t[e].style;
                                r.marginLeft = "",
                                    r.marginRight = ""
                            }
                        }
                    };
                    return b(r, "value", {
                        get: function () {
                            return p(t.settings.gap)
                        }
                    }),
                        b(r, "grow", {
                            get: function () {
                                return r.value * e.Sizes.length
                            }
                        }),
                        b(r, "reductor", {
                            get: function () {
                                var e = t.settings.perView;
                                return r.value * (e - 1) / e
                            }
                        }),
                        n.on(["build.after", "update"], S(function () {
                            r.apply(e.Html.wrapper.children)
                        }, 30)),
                        n.on("destroy", function () {
                            r.remove(e.Html.wrapper.children)
                        }),
                        r
                },
                Move: function (t, e, n) {
                    var r = {
                        mount: function () {
                            this._o = 0
                        },
                        make: function () {
                            var t = this
                                , r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                            this.offset = r,
                                n.emit("move", {
                                    movement: this.value
                                }),
                                e.Transition.after(function () {
                                    n.emit("move.after", {
                                        movement: t.value
                                    })
                                })
                        }
                    };
                    return b(r, "offset", {
                        get: function () {
                            return r._o
                        },
                        set: function (t) {
                            r._o = y(t) ? 0 : p(t)
                        }
                    }),
                        b(r, "translate", {
                            get: function () {
                                return e.Sizes.slideWidth * t.index
                            }
                        }),
                        b(r, "value", {
                            get: function () {
                                var t = this.offset
                                    , n = this.translate;
                                return e.Direction.is("rtl") ? n + t : n - t
                            }
                        }),
                        n.on(["build.before", "run"], function () {
                            r.make()
                        }),
                        r
                },
                Clones: function (t, e, n) {
                    var r = {
                        mount: function () {
                            this.items = [],
                                t.isType("carousel") && (this.items = this.collect())
                        },
                        collect: function () {
                            var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : []
                                , r = e.Html.slides
                                , i = t.settings
                                , o = i.perView
                                , s = i.classes
                                , a = i.cloningRatio;
                            if (0 !== r.length)
                                for (var c = o + +!!t.settings.peek + Math.round(o / 2), l = r.slice(0, c).reverse(), u = r.slice(-1 * c), d = 0; d < Math.max(a, Math.floor(o / r.length)); d++) {
                                    for (var h = 0; h < l.length; h++) {
                                        var f = l[h].cloneNode(!0);
                                        f.classList.add(s.slide.clone),
                                            n.push(f)
                                    }
                                    for (var p = 0; p < u.length; p++) {
                                        var m = u[p].cloneNode(!0);
                                        m.classList.add(s.slide.clone),
                                            n.unshift(m)
                                    }
                                }
                            return n
                        },
                        append: function () {
                            for (var t = this.items, n = e.Html, r = n.wrapper, i = n.slides, o = Math.floor(t.length / 2), s = t.slice(0, o).reverse(), a = t.slice(-1 * o).reverse(), c = "".concat(e.Sizes.slideWidth, "px"), l = 0; l < a.length; l++)
                                r.appendChild(a[l]);
                            for (var u = 0; u < s.length; u++)
                                r.insertBefore(s[u], i[0]);
                            for (var d = 0; d < t.length; d++)
                                t[d].style.width = c
                        },
                        remove: function () {
                            for (var t = this.items, n = 0; n < t.length; n++)
                                e.Html.wrapper.removeChild(t[n])
                        }
                    };
                    return b(r, "grow", {
                        get: function () {
                            return (e.Sizes.slideWidth + e.Gaps.value) * r.items.length
                        }
                    }),
                        n.on("update", function () {
                            r.remove(),
                                r.mount(),
                                r.append()
                        }),
                        n.on("build.before", function () {
                            t.isType("carousel") && r.append()
                        }),
                        n.on("destroy", function () {
                            r.remove()
                        }),
                        r
                },
                Resize: function (t, e, n) {
                    var r = new T
                        , i = {
                            mount: function () {
                                this.bind()
                            },
                            bind: function () {
                                r.on("resize", window, S(function () {
                                    n.emit("resize")
                                }, t.settings.throttle))
                            },
                            unbind: function () {
                                r.off("resize", window)
                            }
                        };
                    return n.on("destroy", function () {
                        i.unbind(),
                            r.destroy()
                    }),
                        i
                },
                Build: function (t, e, n) {
                    var r = {
                        mount: function () {
                            n.emit("build.before"),
                                this.typeClass(),
                                this.activeClass(),
                                n.emit("build.after")
                        },
                        typeClass: function () {
                            e.Html.root.classList.add(t.settings.classes.type[t.settings.type])
                        },
                        activeClass: function () {
                            var n = t.settings.classes
                                , r = e.Html.slides[t.index];
                            r && (r.classList.add(n.slide.active),
                                E(r).forEach(function (t) {
                                    t.classList.remove(n.slide.active)
                                }))
                        },
                        removeClasses: function () {
                            var n = t.settings.classes
                                , r = n.type
                                , i = n.slide;
                            e.Html.root.classList.remove(r[t.settings.type]),
                                e.Html.slides.forEach(function (t) {
                                    t.classList.remove(i.active)
                                })
                        }
                    };
                    return n.on(["destroy", "update"], function () {
                        r.removeClasses()
                    }),
                        n.on(["resize", "update"], function () {
                            r.mount()
                        }),
                        n.on("move.after", function () {
                            r.activeClass()
                        }),
                        r
                },
                Run: function (t, e, n) {
                    var r = {
                        mount: function () {
                            this._o = !1
                        },
                        make: function (r) {
                            var i = this;
                            t.disabled || (!t.settings.waitForTransition || t.disable(),
                                this.move = r,
                                n.emit("run.before", this.move),
                                this.calculate(),
                                n.emit("run", this.move),
                                e.Transition.after(function () {
                                    i.isStart() && n.emit("run.start", i.move),
                                        i.isEnd() && n.emit("run.end", i.move),
                                        i.isOffset() && (i._o = !1,
                                            n.emit("run.offset", i.move)),
                                        n.emit("run.after", i.move),
                                        t.enable()
                                }))
                        },
                        calculate: function () {
                            var e = this.move
                                , n = this.length
                                , i = e.steps
                                , o = e.direction
                                , s = 1;
                            if ("=" === o)
                                return t.settings.bound && p(i) > n ? void (t.index = n) : void (t.index = i);
                            if (">" !== o || ">" !== i)
                                if ("<" !== o || "<" !== i) {
                                    if ("|" === o && (s = t.settings.perView || 1),
                                        ">" === o || "|" === o && ">" === i) {
                                        var a = function (e) {
                                            var n = t.index;
                                            if (t.isType("carousel"))
                                                return n + e;
                                            return n + (e - n % e)
                                        }(s);
                                        return a > n && (this._o = !0),
                                            void (t.index = function (e, n) {
                                                var i = r.length;
                                                if (e <= i)
                                                    return e;
                                                if (t.isType("carousel"))
                                                    return e - (i + 1);
                                                if (t.settings.rewind)
                                                    return r.isBound() && !r.isEnd() ? i : 0;
                                                if (r.isBound())
                                                    return i;
                                                return Math.floor(i / n) * n
                                            }(a, s))
                                    }
                                    if ("<" === o || "|" === o && "<" === i) {
                                        var c = function (e) {
                                            var n = t.index;
                                            if (t.isType("carousel"))
                                                return n - e;
                                            var r = Math.ceil(n / e);
                                            return (r - 1) * e
                                        }(s);
                                        return c < 0 && (this._o = !0),
                                            void (t.index = function (e, n) {
                                                var i = r.length;
                                                if (e >= 0)
                                                    return e;
                                                if (t.isType("carousel"))
                                                    return e + (i + 1);
                                                if (t.settings.rewind)
                                                    return r.isBound() && r.isStart() ? i : Math.floor(i / n) * n;
                                                return 0
                                            }(c, s))
                                    }
                                    f("Invalid direction pattern [".concat(o).concat(i, "] has been used"))
                                } else
                                    t.index = 0;
                            else
                                t.index = n
                        },
                        isStart: function () {
                            return t.index <= 0
                        },
                        isEnd: function () {
                            return t.index >= this.length
                        },
                        isOffset: function () {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0;
                            return t ? !!this._o && ("|>" === t ? "|" === this.move.direction && ">" === this.move.steps : "|<" === t ? "|" === this.move.direction && "<" === this.move.steps : this.move.direction === t) : this._o
                        },
                        isBound: function () {
                            return t.isType("slider") && "center" !== t.settings.focusAt && t.settings.bound
                        }
                    };
                    return b(r, "move", {
                        get: function () {
                            return this._m
                        },
                        set: function (t) {
                            var e = t.substr(1);
                            this._m = {
                                direction: t.substr(0, 1),
                                steps: e ? p(e) ? p(e) : e : 0
                            }
                        }
                    }),
                        b(r, "length", {
                            get: function () {
                                var n = t.settings
                                    , r = e.Html.slides.length;
                                return this.isBound() ? r - 1 - (p(n.perView) - 1) + p(n.focusAt) : r - 1
                            }
                        }),
                        b(r, "offset", {
                            get: function () {
                                return this._o
                            }
                        }),
                        r
                },
                Swipe: function (t, e, n) {
                    var r = new T
                        , i = 0
                        , o = 0
                        , s = 0
                        , a = !1
                        , c = !!q && {
                            passive: !0
                        }
                        , l = {
                            mount: function () {
                                this.bindSwipeStart()
                            },
                            start: function (e) {
                                if (!a && !t.disabled) {
                                    this.disable();
                                    var r = this.touches(e);
                                    i = null,
                                        o = p(r.pageX),
                                        s = p(r.pageY),
                                        this.bindSwipeMove(),
                                        this.bindSwipeEnd(),
                                        n.emit("swipe.start")
                                }
                            },
                            move: function (r) {
                                if (!t.disabled) {
                                    var a = t.settings
                                        , c = a.touchAngle
                                        , l = a.touchRatio
                                        , u = a.classes
                                        , d = this.touches(r)
                                        , h = p(d.pageX) - o
                                        , f = p(d.pageY) - s
                                        , m = Math.abs(h << 2)
                                        , g = Math.abs(f << 2)
                                        , v = Math.sqrt(m + g)
                                        , y = Math.sqrt(g);
                                    if (!(180 * (i = Math.asin(y / v)) / Math.PI < c))
                                        return !1;
                                    r.stopPropagation(),
                                        e.Move.make(h * parseFloat(l)),
                                        e.Html.root.classList.add(u.dragging),
                                        n.emit("swipe.move")
                                }
                            },
                            end: function (r) {
                                if (!t.disabled) {
                                    var s = t.settings
                                        , a = s.perSwipe
                                        , c = s.touchAngle
                                        , l = s.classes
                                        , u = this.touches(r)
                                        , d = this.threshold(r)
                                        , h = u.pageX - o
                                        , f = 180 * i / Math.PI;
                                    this.enable(),
                                        h > d && f < c ? e.Run.make(e.Direction.resolve("".concat(a, "<"))) : h < -d && f < c ? e.Run.make(e.Direction.resolve("".concat(a, ">"))) : e.Move.make(),
                                        e.Html.root.classList.remove(l.dragging),
                                        this.unbindSwipeMove(),
                                        this.unbindSwipeEnd(),
                                        n.emit("swipe.end")
                                }
                            },
                            bindSwipeStart: function () {
                                var n = this
                                    , i = t.settings
                                    , o = i.swipeThreshold
                                    , s = i.dragThreshold;
                                o && r.on(D[0], e.Html.wrapper, function (t) {
                                    n.start(t)
                                }, c),
                                    s && r.on(D[1], e.Html.wrapper, function (t) {
                                        n.start(t)
                                    }, c)
                            },
                            unbindSwipeStart: function () {
                                r.off(D[0], e.Html.wrapper, c),
                                    r.off(D[1], e.Html.wrapper, c)
                            },
                            bindSwipeMove: function () {
                                var n = this;
                                r.on(F, e.Html.wrapper, S(function (t) {
                                    n.move(t)
                                }, t.settings.throttle), c)
                            },
                            unbindSwipeMove: function () {
                                r.off(F, e.Html.wrapper, c)
                            },
                            bindSwipeEnd: function () {
                                var t = this;
                                r.on(V, e.Html.wrapper, function (e) {
                                    t.end(e)
                                })
                            },
                            unbindSwipeEnd: function () {
                                r.off(V, e.Html.wrapper)
                            },
                            touches: function (t) {
                                return W.indexOf(t.type) > -1 ? t : t.touches[0] || t.changedTouches[0]
                            },
                            threshold: function (e) {
                                var n = t.settings;
                                return W.indexOf(e.type) > -1 ? n.dragThreshold : n.swipeThreshold
                            },
                            enable: function () {
                                return a = !1,
                                    e.Transition.enable(),
                                    this
                            },
                            disable: function () {
                                return a = !0,
                                    e.Transition.disable(),
                                    this
                            }
                        };
                    return n.on("build.after", function () {
                        e.Html.root.classList.add(t.settings.classes.swipeable)
                    }),
                        n.on("destroy", function () {
                            l.unbindSwipeStart(),
                                l.unbindSwipeMove(),
                                l.unbindSwipeEnd(),
                                r.destroy()
                        }),
                        l
                },
                Images: function (t, e, n) {
                    var r = new T
                        , i = {
                            mount: function () {
                                this.bind()
                            },
                            bind: function () {
                                r.on("dragstart", e.Html.wrapper, this.dragstart)
                            },
                            unbind: function () {
                                r.off("dragstart", e.Html.wrapper)
                            },
                            dragstart: function (t) {
                                t.preventDefault()
                            }
                        };
                    return n.on("destroy", function () {
                        i.unbind(),
                            r.destroy()
                    }),
                        i
                },
                Anchors: function (t, e, n) {
                    var r = new T
                        , i = !1
                        , o = !1
                        , s = {
                            mount: function () {
                                this._a = e.Html.wrapper.querySelectorAll("a"),
                                    this.bind()
                            },
                            bind: function () {
                                r.on("click", e.Html.wrapper, this.click)
                            },
                            unbind: function () {
                                r.off("click", e.Html.wrapper)
                            },
                            click: function (t) {
                                o && (t.stopPropagation(),
                                    t.preventDefault())
                            },
                            detach: function () {
                                if (o = !0,
                                    !i) {
                                    for (var t = 0; t < this.items.length; t++)
                                        this.items[t].draggable = !1;
                                    i = !0
                                }
                                return this
                            },
                            attach: function () {
                                if (o = !1,
                                    i) {
                                    for (var t = 0; t < this.items.length; t++)
                                        this.items[t].draggable = !0;
                                    i = !1
                                }
                                return this
                            }
                        };
                    return b(s, "items", {
                        get: function () {
                            return s._a
                        }
                    }),
                        n.on("swipe.move", function () {
                            s.detach()
                        }),
                        n.on("swipe.end", function () {
                            e.Transition.after(function () {
                                s.attach()
                            })
                        }),
                        n.on("destroy", function () {
                            s.attach(),
                                s.unbind(),
                                r.destroy()
                        }),
                        s
                },
                Controls: function (t, e, n) {
                    var r = new T
                        , i = !!q && {
                            passive: !0
                        }
                        , o = {
                            mount: function () {
                                this._n = e.Html.root.querySelectorAll('[data-glide-el="controls[nav]"]'),
                                    this._c = e.Html.root.querySelectorAll(G),
                                    this._arrowControls = {
                                        previous: e.Html.root.querySelectorAll(Y),
                                        next: e.Html.root.querySelectorAll(U)
                                    },
                                    this.addBindings()
                            },
                            setActive: function () {
                                for (var t = 0; t < this._n.length; t++)
                                    this.addClass(this._n[t].children)
                            },
                            removeActive: function () {
                                for (var t = 0; t < this._n.length; t++)
                                    this.removeClass(this._n[t].children)
                            },
                            addClass: function (e) {
                                var n = t.settings
                                    , r = e[t.index];
                                r && r && (r.classList.add(n.classes.nav.active),
                                    E(r).forEach(function (t) {
                                        t.classList.remove(n.classes.nav.active)
                                    }))
                            },
                            removeClass: function (e) {
                                var n = e[t.index];
                                n && n.classList.remove(t.settings.classes.nav.active)
                            },
                            setArrowState: function () {
                                if (!t.settings.rewind) {
                                    var n = o._arrowControls.next
                                        , r = o._arrowControls.previous;
                                    this.resetArrowState(n, r),
                                        0 === t.index && this.disableArrow(r),
                                        t.index === e.Run.length && this.disableArrow(n)
                                }
                            },
                            resetArrowState: function () {
                                for (var e = t.settings, n = arguments.length, r = new Array(n), i = 0; i < n; i++)
                                    r[i] = arguments[i];
                                r.forEach(function (t) {
                                    t.forEach(function (t) {
                                        t.classList.remove(e.classes.arrow.disabled)
                                    })
                                })
                            },
                            disableArrow: function () {
                                for (var e = t.settings, n = arguments.length, r = new Array(n), i = 0; i < n; i++)
                                    r[i] = arguments[i];
                                r.forEach(function (t) {
                                    t.forEach(function (t) {
                                        t.classList.add(e.classes.arrow.disabled)
                                    })
                                })
                            },
                            addBindings: function () {
                                for (var t = 0; t < this._c.length; t++)
                                    this.bind(this._c[t].children)
                            },
                            removeBindings: function () {
                                for (var t = 0; t < this._c.length; t++)
                                    this.unbind(this._c[t].children)
                            },
                            bind: function (t) {
                                for (var e = 0; e < t.length; e++)
                                    r.on("click", t[e], this.click),
                                        r.on("touchstart", t[e], this.click, i)
                            },
                            unbind: function (t) {
                                for (var e = 0; e < t.length; e++)
                                    r.off(["click", "touchstart"], t[e])
                            },
                            click: function (t) {
                                q || "touchstart" !== t.type || t.preventDefault();
                                var n = t.currentTarget.getAttribute("data-glide-dir");
                                e.Run.make(e.Direction.resolve(n))
                            }
                        };
                    return b(o, "items", {
                        get: function () {
                            return o._c
                        }
                    }),
                        n.on(["mount.after", "move.after"], function () {
                            o.setActive()
                        }),
                        n.on(["mount.after", "run"], function () {
                            o.setArrowState()
                        }),
                        n.on("destroy", function () {
                            o.removeBindings(),
                                o.removeActive(),
                                r.destroy()
                        }),
                        o
                },
                Keyboard: function (t, e, n) {
                    var r = new T
                        , i = {
                            mount: function () {
                                t.settings.keyboard && this.bind()
                            },
                            bind: function () {
                                r.on("keyup", document, this.press)
                            },
                            unbind: function () {
                                r.off("keyup", document)
                            },
                            press: function (n) {
                                var r = t.settings.perSwipe;
                                39 === n.keyCode && e.Run.make(e.Direction.resolve("".concat(r, ">"))),
                                    37 === n.keyCode && e.Run.make(e.Direction.resolve("".concat(r, "<")))
                            }
                        };
                    return n.on(["destroy", "update"], function () {
                        i.unbind()
                    }),
                        n.on("update", function () {
                            i.mount()
                        }),
                        n.on("destroy", function () {
                            r.destroy()
                        }),
                        i
                },
                Autoplay: function (t, e, n) {
                    var r = new T
                        , i = {
                            mount: function () {
                                this.enable(),
                                    this.start(),
                                    t.settings.hoverpause && this.bind()
                            },
                            enable: function () {
                                this._e = !0
                            },
                            disable: function () {
                                this._e = !1
                            },
                            start: function () {
                                var r = this;
                                this._e && (this.enable(),
                                    t.settings.autoplay && y(this._i) && (this._i = setInterval(function () {
                                        r.stop(),
                                            e.Run.make(">"),
                                            r.start(),
                                            n.emit("autoplay")
                                    }, this.time)))
                            },
                            stop: function () {
                                this._i = clearInterval(this._i)
                            },
                            bind: function () {
                                var t = this;
                                r.on("mouseover", e.Html.root, function () {
                                    t._e && t.stop()
                                }),
                                    r.on("mouseout", e.Html.root, function () {
                                        t._e && t.start()
                                    })
                            },
                            unbind: function () {
                                r.off(["mouseover", "mouseout"], e.Html.root)
                            }
                        };
                    return b(i, "time", {
                        get: function () {
                            var n = e.Html.slides[t.index].getAttribute("data-glide-autoplay");
                            return p(n || t.settings.autoplay)
                        }
                    }),
                        n.on(["destroy", "update"], function () {
                            i.unbind()
                        }),
                        n.on(["run.before", "swipe.start", "update"], function () {
                            i.stop()
                        }),
                        n.on(["pause", "destroy"], function () {
                            i.disable(),
                                i.stop()
                        }),
                        n.on(["run.after", "swipe.end"], function () {
                            i.start()
                        }),
                        n.on(["play"], function () {
                            i.enable(),
                                i.start()
                        }),
                        n.on("update", function () {
                            i.mount()
                        }),
                        n.on("destroy", function () {
                            r.destroy()
                        }),
                        i
                },
                Breakpoints: function (t, e, n) {
                    var r = new T
                        , i = t.settings
                        , o = K(i.breakpoints)
                        , s = Object.assign({}, i)
                        , a = {
                            match: function (t) {
                                if (void 0 !== window.matchMedia)
                                    for (var e in t)
                                        if (t.hasOwnProperty(e) && window.matchMedia("(max-width: ".concat(e, "px)")).matches)
                                            return t[e];
                                return s
                            }
                        };
                    return Object.assign(i, a.match(o)),
                        r.on("resize", window, S(function () {
                            t.settings = x(i, a.match(o))
                        }, t.settings.throttle)),
                        n.on("update", function () {
                            o = K(o),
                                s = Object.assign({}, i)
                        }),
                        n.on("destroy", function () {
                            r.off("resize", window)
                        }),
                        a
                }
            }
                , J = function (t) {
                    !function (t, e) {
                        if ("function" != typeof e && null !== e)
                            throw new TypeError("Super expression must either be null or a function");
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                writable: !0,
                                configurable: !0
                            }
                        }),
                            e && c(t, e)
                    }(n, t);
                    var e = u(n);
                    function n() {
                        return i(this, n),
                            e.apply(this, arguments)
                    }
                    return s(n, [{
                        key: "mount",
                        value: function () {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                            return d(a(n.prototype), "mount", this).call(this, Object.assign({}, X, t))
                        }
                    }]),
                        n
                }(_)
        }
    }, s = {};
    function a(t) {
        var e = s[t];
        if (void 0 !== e)
            return e.exports;
        var n = s[t] = {
            exports: {}
        };
        return o[t].call(n.exports, n, n.exports, a),
            n.exports
    }
    t = "function" == typeof Symbol,
        e = t ? Symbol("webpack queues") : "__webpack_queues__",
        n = t ? Symbol("webpack exports") : "__webpack_exports__",
        r = t ? Symbol("webpack error") : "__webpack_error__",
        i = t => {
            t && t.d < 1 && (t.d = 1,
                t.forEach(t => t.r--),
                t.forEach(t => t.r-- ? t.r++ : t()))
        }
        ,
        a.a = (t, o, s) => {
            var a;
            s && ((a = []).d = -1);
            var c, l, u, d = new Set, h = t.exports, f = new Promise((t, e) => {
                u = e,
                    l = t
            }
            );
            f[n] = h,
                f[e] = t => (a && t(a),
                    d.forEach(t),
                    f.catch(t => { }
                    )),
                t.exports = f,
                o(t => {
                    var o;
                    c = (t => t.map(t => {
                        if (null !== t && "object" == typeof t) {
                            if (t[e])
                                return t;
                            if (t.then) {
                                var o = [];
                                o.d = 0,
                                    t.then(t => {
                                        s[n] = t,
                                            i(o)
                                    }
                                        , t => {
                                            s[r] = t,
                                                i(o)
                                        }
                                    );
                                var s = {};
                                return s[e] = t => t(o),
                                    s
                            }
                        }
                        var a = {};
                        return a[e] = t => { }
                            ,
                            a[n] = t,
                            a
                    }
                    ))(t);
                    var s = () => c.map(t => {
                        if (t[r])
                            throw t[r];
                        return t[n]
                    }
                    )
                        , l = new Promise(t => {
                            (o = () => t(s)).r = 0;
                            var n = t => t !== a && !d.has(t) && (d.add(t),
                                t && !t.d && (o.r++,
                                    t.push(o)));
                            c.map(t => t[e](n))
                        }
                        );
                    return o.r ? l : s()
                }
                    , t => (t ? u(f[r] = t) : l(h),
                        i(a))),
                a && a.d < 0 && (a.d = 0)
        }
        ,
        a.n = t => {
            var e = t && t.__esModule ? () => t.default : () => t;
            return a.d(e, {
                a: e
            }),
                e
        }
        ,
        a.d = (t, e) => {
            for (var n in e)
                a.o(e, n) && !a.o(t, n) && Object.defineProperty(t, n, {
                    enumerable: !0,
                    get: e[n]
                })
        }
        ,
        a.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e);
    a(4447)
}
)();
