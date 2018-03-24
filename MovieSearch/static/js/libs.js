! function(e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
}(function(e) {
    "use strict";
    var t = "animsition",
        i = {
            init: function(n) {
                n = e.extend({
                    inClass: "fade-in",
                    outClass: "fade-out",
                    inDuration: 1500,
                    outDuration: 800,
                    linkElement: ".animsition-link",
                    loading: !0,
                    loadingParentElement: "body",
                    loadingClass: "animsition-loading",
                    loadingInner: "",
                    timeout: !1,
                    timeoutCountdown: 5e3,
                    onLoadEvent: !0,
                    browser: ["animation-duration", "-webkit-animation-duration"],
                    overlay: !1,
                    overlayClass: "animsition-overlay-slide",
                    overlayParentElement: "body",
                    transition: function(e) {
                        window.location.href = e
                    }
                }, n), i.settings = {
                    timer: !1,
                    data: {
                        inClass: "animsition-in-class",
                        inDuration: "animsition-in-duration",
                        outClass: "animsition-out-class",
                        outDuration: "animsition-out-duration",
                        overlay: "animsition-overlay"
                    },
                    events: {
                        inStart: "animsition.inStart",
                        inEnd: "animsition.inEnd",
                        outStart: "animsition.outStart",
                        outEnd: "animsition.outEnd"
                    }
                };
                var o = i.supportCheck.call(this, n);
                if (!o && n.browser.length > 0 && (!o || !this.length)) return "console" in window || (window.console = {}, window.console.log = function(e) {
                    return e
                }), this.length || console.log("Animsition: Element does not exist on page."), o || console.log("Animsition: Does not support this browser."), i.destroy.call(this);
                var a = i.optionCheck.call(this, n);
                return a && i.addOverlay.call(this, n), n.loading && i.addLoading.call(this, n), this.each(function() {
                    var o = this,
                        a = e(this),
                        r = e(window),
                        s = e(document),
                        l = a.data(t);
                    l || (n = e.extend({}, n), a.data(t, {
                        options: n
                    }), n.timeout && i.addTimer.call(o), n.onLoadEvent && r.on("load." + t, function() {
                        i.settings.timer && clearTimeout(i.settings.timer), i["in"].call(o)
                    }), r.on("pageshow." + t, function(e) {
                        e.originalEvent.persisted && i["in"].call(o)
                    }), r.on("unload." + t, function() {}), s.on("click." + t, n.linkElement, function(t) {
                        t.preventDefault();
                        var n = e(this),
                            a = n.attr("href");
                        2 === t.which || t.metaKey || t.shiftKey || -1 !== navigator.platform.toUpperCase().indexOf("WIN") && t.ctrlKey ? window.open(a, "_blank") : i.out.call(o, n, a)
                    }))
                })
            },
            addOverlay: function(t) {
                e(t.overlayParentElement).prepend('<div class="' + t.overlayClass + '"></div>')
            },
            addLoading: function(t) {
                e(t.loadingParentElement).append('<div class="' + t.loadingClass + '">' + t.loadingInner + "</div>")
            },
            removeLoading: function() {
                var i = e(this),
                    n = i.data(t).options,
                    o = e(n.loadingParentElement).children("." + n.loadingClass);
                o.fadeOut().remove()
            },
            addTimer: function() {
                var n = this,
                    o = e(this),
                    a = o.data(t).options;
                i.settings.timer = setTimeout(function() {
                    i["in"].call(n), e(window).off("load." + t)
                }, a.timeoutCountdown)
            },
            supportCheck: function(t) {
                var i = e(this),
                    n = t.browser,
                    o = n.length,
                    a = !1;
                0 === o && (a = !0);
                for (var r = 0; o > r; r++)
                    if ("string" == typeof i.css(n[r])) {
                        a = !0;
                        break
                    }
                return a
            },
            optionCheck: function(t) {
                var n, o = e(this);
                return n = !(!t.overlay && !o.data(i.settings.data.overlay))
            },
            animationCheck: function(i, n, o) {
                var a = e(this),
                    r = a.data(t).options,
                    s = typeof i,
                    l = !n && "number" === s,
                    p = n && "string" === s && i.length > 0;
                return l || p ? i = i : n && o ? i = r.inClass : !n && o ? i = r.inDuration : n && !o ? i = r.outClass : n || o || (i = r.outDuration), i
            },
            "in": function() {
                var n = this,
                    o = e(this),
                    a = o.data(t).options,
                    r = o.data(i.settings.data.inDuration),
                    s = o.data(i.settings.data.inClass),
                    l = i.animationCheck.call(n, r, !1, !0),
                    p = i.animationCheck.call(n, s, !0, !0),
                    d = i.optionCheck.call(n, a),
                    u = o.data(t).outClass;
                a.loading && i.removeLoading.call(n), u && o.removeClass(u), d ? i.inOverlay.call(n, p, l) : i.inDefault.call(n, p, l)
            },
            inDefault: function(t, n) {
                var o = e(this);
                o.css({
                    "animation-duration": n + "ms"
                }).addClass(t).trigger(i.settings.events.inStart).animateCallback(function() {
                    o.removeClass(t).css({
                        opacity: 1
                    }).trigger(i.settings.events.inEnd)
                })
            },
            inOverlay: function(n, o) {
                var a = e(this),
                    r = a.data(t).options;
                a.css({
                    opacity: 1
                }).trigger(i.settings.events.inStart), e(r.overlayParentElement).children("." + r.overlayClass).css({
                    "animation-duration": o + "ms"
                }).addClass(n).animateCallback(function() {
                    a.trigger(i.settings.events.inEnd)
                })
            },
            out: function(n, o) {
                var a = this,
                    r = e(this),
                    s = r.data(t).options,
                    l = n.data(i.settings.data.outClass),
                    p = r.data(i.settings.data.outClass),
                    d = n.data(i.settings.data.outDuration),
                    u = r.data(i.settings.data.outDuration),
                    c = l ? l : p,
                    f = d ? d : u,
                    h = i.animationCheck.call(a, c, !0, !1),
                    m = i.animationCheck.call(a, f, !1, !1),
                    g = i.optionCheck.call(a, s);
                r.data(t).outClass = h, g ? i.outOverlay.call(a, h, m, o) : i.outDefault.call(a, h, m, o)
            },
            outDefault: function(n, o, a) {
                var r = e(this),
                    s = r.data(t).options;
                r.css({
                    "animation-duration": o + 1 + "ms"
                }).addClass(n).trigger(i.settings.events.outStart).animateCallback(function() {
                    r.trigger(i.settings.events.outEnd), s.transition(a)
                })
            },
            outOverlay: function(n, o, a) {
                var r = this,
                    s = e(this),
                    l = s.data(t).options,
                    p = s.data(i.settings.data.inClass),
                    d = i.animationCheck.call(r, p, !0, !0);
                e(l.overlayParentElement).children("." + l.overlayClass).css({
                    "animation-duration": o + 1 + "ms"
                }).removeClass(d).addClass(n).trigger(i.settings.events.outStart).animateCallback(function() {
                    s.trigger(i.settings.events.outEnd), l.transition(a)
                })
            },
            destroy: function() {
                return this.each(function() {
                    var i = e(this);
                    e(window).off("." + t), i.css({
                        opacity: 1
                    }).removeData(t)
                })
            }
        };
    e.fn.animateCallback = function(t) {
        var i = "animationend webkitAnimationEnd";
        return this.each(function() {
            var n = e(this);
            n.on(i, function() {
                return n.off(i), t.call(this)
            })
        })
    }, e.fn.animsition = function(n) {
        return i[n] ? i[n].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof n && n ? void e.error("Method " + n + " does not exist on jQuery." + t) : i.init.apply(this, arguments)
    }
}), ! function(e) {
    e.fn.appear = function(t, i) {
        var n = e.extend({
            data: void 0,
            one: !0,
            accX: 0,
            accY: 0
        }, i);
        return this.each(function() {
            var i = e(this);
            if (i.appeared = !1, !t) return void i.trigger("appear", n.data);
            var o = e(window),
                a = function() {
                    if (!i.is(":visible")) return void(i.appeared = !1);
                    var e = o.scrollLeft(),
                        t = o.scrollTop(),
                        a = i.offset(),
                        r = a.left,
                        s = a.top,
                        l = n.accX,
                        p = n.accY,
                        d = i.height(),
                        u = o.height(),
                        c = i.width(),
                        f = o.width();
                    s + d + p >= t && t + u + p >= s && r + c + l >= e && e + f + l >= r ? i.appeared || i.trigger("appear", n.data) : i.appeared = !1
                },
                r = function() {
                    if (i.appeared = !0, n.one) {
                        o.unbind("scroll", a);
                        var r = e.inArray(a, e.fn.appear.checks);
                        r >= 0 && e.fn.appear.checks.splice(r, 1)
                    }
                    t.apply(this, arguments)
                };
            n.one ? i.one("appear", n.data, r) : i.bind("appear", n.data, r), o.scroll(a), e.fn.appear.checks.push(a), a()
        })
    }, e.extend(e.fn.appear, {
        checks: [],
        timeout: null,
        checkAll: function() {
            var t = e.fn.appear.checks.length;
            if (t > 0)
                for (; t--;) e.fn.appear.checks[t]()
        },
        run: function() {
            e.fn.appear.timeout && clearTimeout(e.fn.appear.timeout), e.fn.appear.timeout = setTimeout(e.fn.appear.checkAll, 20)
        }
    }), e.each(["append", "prepend", "after", "before", "attr", "removeAttr", "addClass", "removeClass", "toggleClass", "remove", "css", "show", "hide"], function(t, i) {
        var n = e.fn[i];
        n && (e.fn[i] = function() {
            var t = n.apply(this, arguments);
            return e.fn.appear.run(), t
        })
    })
}(jQuery), ! function(e) {
    e.fn.countTo = function(t) {
        t = e.extend({}, e.fn.countTo.defaults, t || {});
        var i = Math.ceil(t.speed / t.refreshInterval),
            n = (t.to - t.from) / i;
        return e(this).each(function() {
            function o() {
                s += n, r++, e(a).html(s.toFixed(t.decimals)), "function" == typeof t.onUpdate && t.onUpdate.call(a, s), r >= i && (clearInterval(l), s = t.to, "function" == typeof t.onComplete && t.onComplete.call(a, s))
            }
            var a = this,
                r = 0,
                s = t.from,
                l = setInterval(o, t.refreshInterval)
        })
    }, e.fn.countTo.defaults = {
        from: 0,
        to: 100,
        speed: 1e3,
        refreshInterval: 100,
        decimals: 0,
        onUpdate: null,
        onComplete: null
    }
}(jQuery), ! function(e, t) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", t) : "object" == typeof module && module.exports ? module.exports = t() : e.EvEmitter = t()
}(this, function() {
    function e() {}
    var t = e.prototype;
    return t.on = function(e, t) {
        if (e && t) {
            var i = this._events = this._events || {},
                n = i[e] = i[e] || [];
            return -1 == n.indexOf(t) && n.push(t), this
        }
    }, t.once = function(e, t) {
        if (e && t) {
            this.on(e, t);
            var i = this._onceEvents = this._onceEvents || {},
                n = i[e] = i[e] || [];
            return n[t] = !0, this
        }
    }, t.off = function(e, t) {
        var i = this._events && this._events[e];
        if (i && i.length) {
            var n = i.indexOf(t);
            return -1 != n && i.splice(n, 1), this
        }
    }, t.emitEvent = function(e, t) {
        var i = this._events && this._events[e];
        if (i && i.length) {
            var n = 0,
                o = i[n];
            t = t || [];
            for (var a = this._onceEvents && this._onceEvents[e]; o;) {
                var r = a && a[o];
                r && (this.off(e, o), delete a[o]), o.apply(this, t), n += r ? 0 : 1, o = i[n]
            }
            return this
        }
    }, e
}),
function(e, t) {
    "use strict";
    "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function(i) {
        return t(e, i)
    }) : "object" == typeof module && module.exports ? module.exports = t(e, require("ev-emitter")) : e.imagesLoaded = t(e, e.EvEmitter)
}(window, function(e, t) {
    function i(e, t) {
        for (var i in t) e[i] = t[i];
        return e
    }

    function n(e) {
        var t = [];
        if (Array.isArray(e)) t = e;
        else if ("number" == typeof e.length)
            for (var i = 0; i < e.length; i++) t.push(e[i]);
        else t.push(e);
        return t
    }

    function o(e, t, a) {
        return this instanceof o ? ("string" == typeof e && (e = document.querySelectorAll(e)), this.elements = n(e), this.options = i({}, this.options), "function" == typeof t ? a = t : i(this.options, t), a && this.on("always", a), this.getImages(), s && (this.jqDeferred = new s.Deferred), void setTimeout(function() {
            this.check()
        }.bind(this))) : new o(e, t, a)
    }

    function a(e) {
        this.img = e
    }

    function r(e, t) {
        this.url = e, this.element = t, this.img = new Image
    }
    var s = e.jQuery,
        l = e.console;
    o.prototype = Object.create(t.prototype), o.prototype.options = {}, o.prototype.getImages = function() {
        this.images = [], this.elements.forEach(this.addElementImages, this)
    }, o.prototype.addElementImages = function(e) {
        "IMG" == e.nodeName && this.addImage(e), this.options.background === !0 && this.addElementBackgroundImages(e);
        var t = e.nodeType;
        if (t && p[t]) {
            for (var i = e.querySelectorAll("img"), n = 0; n < i.length; n++) {
                var o = i[n];
                this.addImage(o)
            }
            if ("string" == typeof this.options.background) {
                var a = e.querySelectorAll(this.options.background);
                for (n = 0; n < a.length; n++) {
                    var r = a[n];
                    this.addElementBackgroundImages(r)
                }
            }
        }
    };
    var p = {
        1: !0,
        9: !0,
        11: !0
    };
    return o.prototype.addElementBackgroundImages = function(e) {
        var t = getComputedStyle(e);
        if (t)
            for (var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(t.backgroundImage); null !== n;) {
                var o = n && n[2];
                o && this.addBackground(o, e), n = i.exec(t.backgroundImage)
            }
    }, o.prototype.addImage = function(e) {
        var t = new a(e);
        this.images.push(t)
    }, o.prototype.addBackground = function(e, t) {
        var i = new r(e, t);
        this.images.push(i)
    }, o.prototype.check = function() {
        function e(e, i, n) {
            setTimeout(function() {
                t.progress(e, i, n)
            })
        }
        var t = this;
        return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach(function(t) {
            t.once("progress", e), t.check()
        }) : void this.complete()
    }, o.prototype.progress = function(e, t, i) {
        this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded, this.emitEvent("progress", [this, e, t]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, e), this.progressedCount == this.images.length && this.complete(), this.options.debug && l && l.log("progress: " + i, e, t)
    }, o.prototype.complete = function() {
        var e = this.hasAnyBroken ? "fail" : "done";
        if (this.isComplete = !0, this.emitEvent(e, [this]), this.emitEvent("always", [this]), this.jqDeferred) {
            var t = this.hasAnyBroken ? "reject" : "resolve";
            this.jqDeferred[t](this)
        }
    }, a.prototype = Object.create(t.prototype), a.prototype.check = function() {
        var e = this.getIsImageComplete();
        return e ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), void(this.proxyImage.src = this.img.src))
    }, a.prototype.getIsImageComplete = function() {
        return this.img.complete && void 0 !== this.img.naturalWidth
    }, a.prototype.confirm = function(e, t) {
        this.isLoaded = e, this.emitEvent("progress", [this, this.img, t])
    }, a.prototype.handleEvent = function(e) {
        var t = "on" + e.type;
        this[t] && this[t](e)
    }, a.prototype.onload = function() {
        this.confirm(!0, "onload"), this.unbindEvents()
    }, a.prototype.onerror = function() {
        this.confirm(!1, "onerror"), this.unbindEvents()
    }, a.prototype.unbindEvents = function() {
        this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, r.prototype = Object.create(a.prototype), r.prototype.check = function() {
        this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url;
        var e = this.getIsImageComplete();
        e && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
    }, r.prototype.unbindEvents = function() {
        this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, r.prototype.confirm = function(e, t) {
        this.isLoaded = e, this.emitEvent("progress", [this, this.element, t])
    }, o.makeJQueryPlugin = function(t) {
        t = t || e.jQuery, t && (s = t, s.fn.imagesLoaded = function(e, t) {
            var i = new o(this, e, t);
            return i.jqDeferred.promise(s(this))
        })
    }, o.makeJQueryPlugin(), o
}), ! function(e) {
    function t() {}

    function i(e) {
        function i(t) {
            t.prototype.option || (t.prototype.option = function(t) {
                e.isPlainObject(t) && (this.options = e.extend(!0, this.options, t))
            })
        }

        function o(t, i) {
            e.fn[t] = function(o) {
                if ("string" == typeof o) {
                    for (var r = n.call(arguments, 1), s = 0, l = this.length; l > s; s++) {
                        var p = this[s],
                            d = e.data(p, t);
                        if (d)
                            if (e.isFunction(d[o]) && "_" !== o.charAt(0)) {
                                var u = d[o].apply(d, r);
                                if (void 0 !== u) return u
                            } else a("no such method '" + o + "' for " + t + " instance");
                        else a("cannot call methods on " + t + " prior to initialization; attempted to call '" + o + "'")
                    }
                    return this
                }
                return this.each(function() {
                    var n = e.data(this, t);
                    n ? (n.option(o), n._init()) : (n = new i(this, o), e.data(this, t, n))
                })
            }
        }
        if (e) {
            var a = "undefined" == typeof console ? t : function(e) {
                console.error(e)
            };
            return e.bridget = function(e, t) {
                i(t), o(e, t)
            }, e.bridget
        }
    }
    var n = Array.prototype.slice;
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], i) : i("object" == typeof exports ? require("jquery") : e.jQuery)
}(window),
function(e) {
    function t(t) {
        var i = e.event;
        return i.target = i.target || i.srcElement || t, i
    }
    var i = document.documentElement,
        n = function() {};
    i.addEventListener ? n = function(e, t, i) {
        e.addEventListener(t, i, !1)
    } : i.attachEvent && (n = function(e, i, n) {
        e[i + n] = n.handleEvent ? function() {
            var i = t(e);
            n.handleEvent.call(n, i)
        } : function() {
            var i = t(e);
            n.call(e, i)
        }, e.attachEvent("on" + i, e[i + n])
    });
    var o = function() {};
    i.removeEventListener ? o = function(e, t, i) {
        e.removeEventListener(t, i, !1)
    } : i.detachEvent && (o = function(e, t, i) {
        e.detachEvent("on" + t, e[t + i]);
        try {
            delete e[t + i]
        } catch (n) {
            e[t + i] = void 0
        }
    });
    var a = {
        bind: n,
        unbind: o
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", a) : "object" == typeof exports ? module.exports = a : e.eventie = a
}(window),
function() {
    "use strict";

    function e() {}

    function t(e, t) {
        for (var i = e.length; i--;)
            if (e[i].listener === t) return i;
        return -1
    }

    function i(e) {
        return function() {
            return this[e].apply(this, arguments)
        }
    }
    var n = e.prototype,
        o = this,
        a = o.EventEmitter;
    n.getListeners = function(e) {
        var t, i, n = this._getEvents();
        if (e instanceof RegExp) {
            t = {};
            for (i in n) n.hasOwnProperty(i) && e.test(i) && (t[i] = n[i])
        } else t = n[e] || (n[e] = []);
        return t
    }, n.flattenListeners = function(e) {
        var t, i = [];
        for (t = 0; t < e.length; t += 1) i.push(e[t].listener);
        return i
    }, n.getListenersAsObject = function(e) {
        var t, i = this.getListeners(e);
        return i instanceof Array && (t = {}, t[e] = i), t || i
    }, n.addListener = function(e, i) {
        var n, o = this.getListenersAsObject(e),
            a = "object" == typeof i;
        for (n in o) o.hasOwnProperty(n) && -1 === t(o[n], i) && o[n].push(a ? i : {
            listener: i,
            once: !1
        });
        return this
    }, n.on = i("addListener"), n.addOnceListener = function(e, t) {
        return this.addListener(e, {
            listener: t,
            once: !0
        })
    }, n.once = i("addOnceListener"), n.defineEvent = function(e) {
        return this.getListeners(e), this
    }, n.defineEvents = function(e) {
        for (var t = 0; t < e.length; t += 1) this.defineEvent(e[t]);
        return this
    }, n.removeListener = function(e, i) {
        var n, o, a = this.getListenersAsObject(e);
        for (o in a) a.hasOwnProperty(o) && (n = t(a[o], i), -1 !== n && a[o].splice(n, 1));
        return this
    }, n.off = i("removeListener"), n.addListeners = function(e, t) {
        return this.manipulateListeners(!1, e, t)
    }, n.removeListeners = function(e, t) {
        return this.manipulateListeners(!0, e, t)
    }, n.manipulateListeners = function(e, t, i) {
        var n, o, a = e ? this.removeListener : this.addListener,
            r = e ? this.removeListeners : this.addListeners;
        if ("object" != typeof t || t instanceof RegExp)
            for (n = i.length; n--;) a.call(this, t, i[n]);
        else
            for (n in t) t.hasOwnProperty(n) && (o = t[n]) && ("function" == typeof o ? a.call(this, n, o) : r.call(this, n, o));
        return this
    }, n.removeEvent = function(e) {
        var t, i = typeof e,
            n = this._getEvents();
        if ("string" === i) delete n[e];
        else if (e instanceof RegExp)
            for (t in n) n.hasOwnProperty(t) && e.test(t) && delete n[t];
        else delete this._events;
        return this
    }, n.removeAllListeners = i("removeEvent"), n.emitEvent = function(e, t) {
        var i, n, o, a, r = this.getListenersAsObject(e);
        for (o in r)
            if (r.hasOwnProperty(o))
                for (n = r[o].length; n--;) i = r[o][n], i.once === !0 && this.removeListener(e, i.listener), a = i.listener.apply(this, t || []), a === this._getOnceReturnValue() && this.removeListener(e, i.listener);
        return this
    }, n.trigger = i("emitEvent"), n.emit = function(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(e, t)
    }, n.setOnceReturnValue = function(e) {
        return this._onceReturnValue = e, this
    }, n._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, n._getEvents = function() {
        return this._events || (this._events = {})
    }, e.noConflict = function() {
        return o.EventEmitter = a, e
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return e
    }) : "object" == typeof module && module.exports ? module.exports = e : o.EventEmitter = e
}.call(this),
    function(e) {
        function t(e) {
            if (e) {
                if ("string" == typeof n[e]) return e;
                e = e.charAt(0).toUpperCase() + e.slice(1);
                for (var t, o = 0, a = i.length; a > o; o++)
                    if (t = i[o] + e, "string" == typeof n[t]) return t
            }
        }
        var i = "Webkit Moz ms Ms O".split(" "),
            n = document.documentElement.style;
        "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function() {
            return t
        }) : "object" == typeof exports ? module.exports = t : e.getStyleProperty = t
    }(window),
    function(e, t) {
        function i(e) {
            var t = parseFloat(e),
                i = -1 === e.indexOf("%") && !isNaN(t);
            return i && t
        }

        function n() {}

        function o() {
            for (var e = {
                    width: 0,
                    height: 0,
                    innerWidth: 0,
                    innerHeight: 0,
                    outerWidth: 0,
                    outerHeight: 0
                }, t = 0, i = s.length; i > t; t++) {
                var n = s[t];
                e[n] = 0
            }
            return e
        }

        function a(t) {
            function n() {
                if (!c) {
                    c = !0;
                    var n = e.getComputedStyle;
                    if (p = function() {
                            var e = n ? function(e) {
                                return n(e, null)
                            } : function(e) {
                                return e.currentStyle
                            };
                            return function(t) {
                                var i = e(t);
                                return i || r("Style returned " + i + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), i
                            }
                        }(), d = t("boxSizing")) {
                        var o = document.createElement("div");
                        o.style.width = "200px", o.style.padding = "1px 2px 3px 4px", o.style.borderStyle = "solid", o.style.borderWidth = "1px 2px 3px 4px", o.style[d] = "border-box";
                        var a = document.body || document.documentElement;
                        a.appendChild(o);
                        var s = p(o);
                        u = 200 === i(s.width), a.removeChild(o)
                    }
                }
            }

            function a(e) {
                if (n(), "string" == typeof e && (e = document.querySelector(e)), e && "object" == typeof e && e.nodeType) {
                    var t = p(e);
                    if ("none" === t.display) return o();
                    var a = {};
                    a.width = e.offsetWidth, a.height = e.offsetHeight;
                    for (var r = a.isBorderBox = !(!d || !t[d] || "border-box" !== t[d]), c = 0, f = s.length; f > c; c++) {
                        var h = s[c],
                            m = t[h];
                        m = l(e, m);
                        var g = parseFloat(m);
                        a[h] = isNaN(g) ? 0 : g
                    }
                    var v = a.paddingLeft + a.paddingRight,
                        y = a.paddingTop + a.paddingBottom,
                        w = a.marginLeft + a.marginRight,
                        b = a.marginTop + a.marginBottom,
                        x = a.borderLeftWidth + a.borderRightWidth,
                        S = a.borderTopWidth + a.borderBottomWidth,
                        T = r && u,
                        C = i(t.width);
                    C !== !1 && (a.width = C + (T ? 0 : v + x));
                    var P = i(t.height);
                    return P !== !1 && (a.height = P + (T ? 0 : y + S)), a.innerWidth = a.width - (v + x), a.innerHeight = a.height - (y + S), a.outerWidth = a.width + w, a.outerHeight = a.height + b, a
                }
            }

            function l(t, i) {
                if (e.getComputedStyle || -1 === i.indexOf("%")) return i;
                var n = t.style,
                    o = n.left,
                    a = t.runtimeStyle,
                    r = a && a.left;
                return r && (a.left = t.currentStyle.left), n.left = i, i = n.pixelLeft, n.left = o, r && (a.left = r), i
            }
            var p, d, u, c = !1;
            return a
        }
        var r = "undefined" == typeof console ? n : function(e) {
                console.error(e)
            },
            s = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
        "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], a) : "object" == typeof exports ? module.exports = a(require("desandro-get-style-property")) : e.getSize = a(e.getStyleProperty)
    }(window),
    function(e) {
        function t(e) {
            "function" == typeof e && (t.isReady ? e() : r.push(e))
        }

        function i(e) {
            var i = "readystatechange" === e.type && "complete" !== a.readyState;
            t.isReady || i || n()
        }

        function n() {
            t.isReady = !0;
            for (var e = 0, i = r.length; i > e; e++) {
                var n = r[e];
                n()
            }
        }

        function o(o) {
            return "complete" === a.readyState ? n() : (o.bind(a, "DOMContentLoaded", i), o.bind(a, "readystatechange", i), o.bind(e, "load", i)), t
        }
        var a = e.document,
            r = [];
        t.isReady = !1, "function" == typeof define && define.amd ? define("doc-ready/doc-ready", ["eventie/eventie"], o) : "object" == typeof exports ? module.exports = o(require("eventie")) : e.docReady = o(e.eventie)
    }(window),
    function(e) {
        "use strict";

        function t(e, t) {
            return e[r](t)
        }

        function i(e) {
            if (!e.parentNode) {
                var t = document.createDocumentFragment();
                t.appendChild(e)
            }
        }

        function n(e, t) {
            i(e);
            for (var n = e.parentNode.querySelectorAll(t), o = 0, a = n.length; a > o; o++)
                if (n[o] === e) return !0;
            return !1
        }

        function o(e, n) {
            return i(e), t(e, n)
        }
        var a, r = function() {
            if (e.matches) return "matches";
            if (e.matchesSelector) return "matchesSelector";
            for (var t = ["webkit", "moz", "ms", "o"], i = 0, n = t.length; n > i; i++) {
                var o = t[i],
                    a = o + "MatchesSelector";
                if (e[a]) return a
            }
        }();
        if (r) {
            var s = document.createElement("div"),
                l = t(s, "div");
            a = l ? t : o
        } else a = n;
        "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [], function() {
            return a
        }) : "object" == typeof exports ? module.exports = a : window.matchesSelector = a
    }(Element.prototype),
    function(e, t) {
        "use strict";
        "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["doc-ready/doc-ready", "matches-selector/matches-selector"], function(i, n) {
            return t(e, i, n)
        }) : "object" == typeof exports ? module.exports = t(e, require("doc-ready"), require("desandro-matches-selector")) : e.fizzyUIUtils = t(e, e.docReady, e.matchesSelector)
    }(window, function(e, t, i) {
        var n = {};
        n.extend = function(e, t) {
            for (var i in t) e[i] = t[i];
            return e
        }, n.modulo = function(e, t) {
            return (e % t + t) % t
        };
        var o = Object.prototype.toString;
        n.isArray = function(e) {
            return "[object Array]" == o.call(e)
        }, n.makeArray = function(e) {
            var t = [];
            if (n.isArray(e)) t = e;
            else if (e && "number" == typeof e.length)
                for (var i = 0, o = e.length; o > i; i++) t.push(e[i]);
            else t.push(e);
            return t
        }, n.indexOf = Array.prototype.indexOf ? function(e, t) {
            return e.indexOf(t)
        } : function(e, t) {
            for (var i = 0, n = e.length; n > i; i++)
                if (e[i] === t) return i;
            return -1
        }, n.removeFrom = function(e, t) {
            var i = n.indexOf(e, t); - 1 != i && e.splice(i, 1)
        }, n.isElement = "function" == typeof HTMLElement || "object" == typeof HTMLElement ? function(e) {
            return e instanceof HTMLElement
        } : function(e) {
            return e && "object" == typeof e && 1 == e.nodeType && "string" == typeof e.nodeName
        }, n.setText = function() {
            function e(e, i) {
                t = t || (void 0 !== document.documentElement.textContent ? "textContent" : "innerText"), e[t] = i
            }
            var t;
            return e
        }(), n.getParent = function(e, t) {
            for (; e != document.body;)
                if (e = e.parentNode, i(e, t)) return e
        }, n.getQueryElement = function(e) {
            return "string" == typeof e ? document.querySelector(e) : e
        }, n.handleEvent = function(e) {
            var t = "on" + e.type;
            this[t] && this[t](e)
        }, n.filterFindElements = function(e, t) {
            e = n.makeArray(e);
            for (var o = [], a = 0, r = e.length; r > a; a++) {
                var s = e[a];
                if (n.isElement(s))
                    if (t) {
                        i(s, t) && o.push(s);
                        for (var l = s.querySelectorAll(t), p = 0, d = l.length; d > p; p++) o.push(l[p])
                    } else o.push(s)
            }
            return o
        }, n.debounceMethod = function(e, t, i) {
            var n = e.prototype[t],
                o = t + "Timeout";
            e.prototype[t] = function() {
                var e = this[o];
                e && clearTimeout(e);
                var t = arguments,
                    a = this;
                this[o] = setTimeout(function() {
                    n.apply(a, t), delete a[o]
                }, i || 100)
            }
        }, n.toDashed = function(e) {
            return e.replace(/(.)([A-Z])/g, function(e, t, i) {
                return t + "-" + i
            }).toLowerCase()
        };
        var a = e.console;
        return n.htmlInit = function(i, o) {
            t(function() {
                for (var t = n.toDashed(o), r = document.querySelectorAll(".js-" + t), s = "data-" + t + "-options", l = 0, p = r.length; p > l; l++) {
                    var d, u = r[l],
                        c = u.getAttribute(s);
                    try {
                        d = c && JSON.parse(c)
                    } catch (f) {
                        a && a.error("Error parsing " + s + " on " + u.nodeName.toLowerCase() + (u.id ? "#" + u.id : "") + ": " + f);
                        continue
                    }
                    var h = new i(u, d),
                        m = e.jQuery;
                    m && m.data(u, o, h)
                }
            })
        }, n
    }),
    function(e, t) {
        "use strict";
        "function" == typeof define && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property", "fizzy-ui-utils/utils"], function(i, n, o, a) {
            return t(e, i, n, o, a)
        }) : "object" == typeof exports ? module.exports = t(e, require("wolfy87-eventemitter"), require("get-size"), require("desandro-get-style-property"), require("fizzy-ui-utils")) : (e.Outlayer = {}, e.Outlayer.Item = t(e, e.EventEmitter, e.getSize, e.getStyleProperty, e.fizzyUIUtils))
    }(window, function(e, t, i, n, o) {
        "use strict";

        function a(e) {
            for (var t in e) return !1;
            return t = null, !0
        }

        function r(e, t) {
            e && (this.element = e, this.layout = t, this.position = {
                x: 0,
                y: 0
            }, this._create())
        }

        function s(e) {
            return e.replace(/([A-Z])/g, function(e) {
                return "-" + e.toLowerCase()
            })
        }
        var l = e.getComputedStyle,
            p = l ? function(e) {
                return l(e, null)
            } : function(e) {
                return e.currentStyle
            },
            d = n("transition"),
            u = n("transform"),
            c = d && u,
            f = !!n("perspective"),
            h = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "otransitionend",
                transition: "transitionend"
            }[d],
            m = ["transform", "transition", "transitionDuration", "transitionProperty"],
            g = function() {
                for (var e = {}, t = 0, i = m.length; i > t; t++) {
                    var o = m[t],
                        a = n(o);
                    a && a !== o && (e[o] = a)
                }
                return e
            }();
        o.extend(r.prototype, t.prototype), r.prototype._create = function() {
            this._transn = {
                ingProperties: {},
                clean: {},
                onEnd: {}
            }, this.css({
                position: "absolute"
            })
        }, r.prototype.handleEvent = function(e) {
            var t = "on" + e.type;
            this[t] && this[t](e)
        }, r.prototype.getSize = function() {
            this.size = i(this.element)
        }, r.prototype.css = function(e) {
            var t = this.element.style;
            for (var i in e) {
                var n = g[i] || i;
                t[n] = e[i]
            }
        }, r.prototype.getPosition = function() {
            var e = p(this.element),
                t = this.layout.options,
                i = t.isOriginLeft,
                n = t.isOriginTop,
                o = e[i ? "left" : "right"],
                a = e[n ? "top" : "bottom"],
                r = this.layout.size,
                s = -1 != o.indexOf("%") ? parseFloat(o) / 100 * r.width : parseInt(o, 10),
                l = -1 != a.indexOf("%") ? parseFloat(a) / 100 * r.height : parseInt(a, 10);
            s = isNaN(s) ? 0 : s, l = isNaN(l) ? 0 : l, s -= i ? r.paddingLeft : r.paddingRight, l -= n ? r.paddingTop : r.paddingBottom, this.position.x = s, this.position.y = l
        }, r.prototype.layoutPosition = function() {
            var e = this.layout.size,
                t = this.layout.options,
                i = {},
                n = t.isOriginLeft ? "paddingLeft" : "paddingRight",
                o = t.isOriginLeft ? "left" : "right",
                a = t.isOriginLeft ? "right" : "left",
                r = this.position.x + e[n];
            i[o] = this.getXValue(r), i[a] = "";
            var s = t.isOriginTop ? "paddingTop" : "paddingBottom",
                l = t.isOriginTop ? "top" : "bottom",
                p = t.isOriginTop ? "bottom" : "top",
                d = this.position.y + e[s];
            i[l] = this.getYValue(d), i[p] = "", this.css(i), this.emitEvent("layout", [this])
        }, r.prototype.getXValue = function(e) {
            var t = this.layout.options;
            return t.percentPosition && !t.isHorizontal ? e / this.layout.size.width * 100 + "%" : e + "px"
        }, r.prototype.getYValue = function(e) {
            var t = this.layout.options;
            return t.percentPosition && t.isHorizontal ? e / this.layout.size.height * 100 + "%" : e + "px"
        }, r.prototype._transitionTo = function(e, t) {
            this.getPosition();
            var i = this.position.x,
                n = this.position.y,
                o = parseInt(e, 10),
                a = parseInt(t, 10),
                r = o === this.position.x && a === this.position.y;
            if (this.setPosition(e, t), r && !this.isTransitioning) return void this.layoutPosition();
            var s = e - i,
                l = t - n,
                p = {};
            p.transform = this.getTranslate(s, l), this.transition({
                to: p,
                onTransitionEnd: {
                    transform: this.layoutPosition
                },
                isCleaning: !0
            })
        }, r.prototype.getTranslate = function(e, t) {
            var i = this.layout.options;
            return e = i.isOriginLeft ? e : -e, t = i.isOriginTop ? t : -t, f ? "translate3d(" + e + "px, " + t + "px, 0)" : "translate(" + e + "px, " + t + "px)"
        }, r.prototype.goTo = function(e, t) {
            this.setPosition(e, t), this.layoutPosition()
        }, r.prototype.moveTo = c ? r.prototype._transitionTo : r.prototype.goTo, r.prototype.setPosition = function(e, t) {
            this.position.x = parseInt(e, 10), this.position.y = parseInt(t, 10)
        }, r.prototype._nonTransition = function(e) {
            this.css(e.to), e.isCleaning && this._removeStyles(e.to);
            for (var t in e.onTransitionEnd) e.onTransitionEnd[t].call(this)
        }, r.prototype._transition = function(e) {
            if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(e);
            var t = this._transn;
            for (var i in e.onTransitionEnd) t.onEnd[i] = e.onTransitionEnd[i];
            for (i in e.to) t.ingProperties[i] = !0, e.isCleaning && (t.clean[i] = !0);
            if (e.from) {
                this.css(e.from);
                var n = this.element.offsetHeight;
                n = null
            }
            this.enableTransition(e.to), this.css(e.to), this.isTransitioning = !0
        };
        var v = "opacity," + s(g.transform || "transform");
        r.prototype.enableTransition = function() {
            this.isTransitioning || (this.css({
                transitionProperty: v,
                transitionDuration: this.layout.options.transitionDuration
            }), this.element.addEventListener(h, this, !1))
        }, r.prototype.transition = r.prototype[d ? "_transition" : "_nonTransition"], r.prototype.onwebkitTransitionEnd = function(e) {
            this.ontransitionend(e)
        }, r.prototype.onotransitionend = function(e) {
            this.ontransitionend(e)
        };
        var y = {
            "-webkit-transform": "transform",
            "-moz-transform": "transform",
            "-o-transform": "transform"
        };
        r.prototype.ontransitionend = function(e) {
            if (e.target === this.element) {
                var t = this._transn,
                    i = y[e.propertyName] || e.propertyName;
                if (delete t.ingProperties[i], a(t.ingProperties) && this.disableTransition(), i in t.clean && (this.element.style[e.propertyName] = "", delete t.clean[i]), i in t.onEnd) {
                    var n = t.onEnd[i];
                    n.call(this), delete t.onEnd[i]
                }
                this.emitEvent("transitionEnd", [this])
            }
        }, r.prototype.disableTransition = function() {
            this.removeTransitionStyles(), this.element.removeEventListener(h, this, !1), this.isTransitioning = !1
        }, r.prototype._removeStyles = function(e) {
            var t = {};
            for (var i in e) t[i] = "";
            this.css(t)
        };
        var w = {
            transitionProperty: "",
            transitionDuration: ""
        };
        return r.prototype.removeTransitionStyles = function() {
            this.css(w)
        }, r.prototype.removeElem = function() {
            this.element.parentNode.removeChild(this.element), this.css({
                display: ""
            }), this.emitEvent("remove", [this])
        }, r.prototype.remove = function() {
            if (!d || !parseFloat(this.layout.options.transitionDuration)) return void this.removeElem();
            var e = this;
            this.once("transitionEnd", function() {
                e.removeElem()
            }), this.hide()
        }, r.prototype.reveal = function() {
            delete this.isHidden, this.css({
                display: ""
            });
            var e = this.layout.options,
                t = {},
                i = this.getHideRevealTransitionEndProperty("visibleStyle");
            t[i] = this.onRevealTransitionEnd, this.transition({
                from: e.hiddenStyle,
                to: e.visibleStyle,
                isCleaning: !0,
                onTransitionEnd: t
            })
        }, r.prototype.onRevealTransitionEnd = function() {
            this.isHidden || this.emitEvent("reveal")
        }, r.prototype.getHideRevealTransitionEndProperty = function(e) {
            var t = this.layout.options[e];
            if (t.opacity) return "opacity";
            for (var i in t) return i
        }, r.prototype.hide = function() {
            this.isHidden = !0, this.css({
                display: ""
            });
            var e = this.layout.options,
                t = {},
                i = this.getHideRevealTransitionEndProperty("hiddenStyle");
            t[i] = this.onHideTransitionEnd, this.transition({
                from: e.visibleStyle,
                to: e.hiddenStyle,
                isCleaning: !0,
                onTransitionEnd: t
            })
        }, r.prototype.onHideTransitionEnd = function() {
            this.isHidden && (this.css({
                display: "none"
            }), this.emitEvent("hide"))
        }, r.prototype.destroy = function() {
            this.css({
                position: "",
                left: "",
                right: "",
                top: "",
                bottom: "",
                transition: "",
                transform: ""
            })
        }, r
    }),
    function(e, t) {
        "use strict";
        "function" == typeof define && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "eventEmitter/EventEmitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function(i, n, o, a, r) {
            return t(e, i, n, o, a, r)
        }) : "object" == typeof exports ? module.exports = t(e, require("eventie"), require("wolfy87-eventemitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : e.Outlayer = t(e, e.eventie, e.EventEmitter, e.getSize, e.fizzyUIUtils, e.Outlayer.Item)
    }(window, function(e, t, i, n, o, a) {
        "use strict";

        function r(e, t) {
            var i = o.getQueryElement(e);
            if (!i) return void(s && s.error("Bad element for " + this.constructor.namespace + ": " + (i || e)));
            this.element = i, l && (this.$element = l(this.element)), this.options = o.extend({}, this.constructor.defaults), this.option(t);
            var n = ++d;
            this.element.outlayerGUID = n, u[n] = this, this._create(), this.options.isInitLayout && this.layout()
        }
        var s = e.console,
            l = e.jQuery,
            p = function() {},
            d = 0,
            u = {};
        return r.namespace = "outlayer", r.Item = a, r.defaults = {
            containerStyle: {
                position: "relative"
            },
            isInitLayout: !0,
            isOriginLeft: !0,
            isOriginTop: !0,
            isResizeBound: !0,
            isResizingContainer: !0,
            transitionDuration: "0.4s",
            hiddenStyle: {
                opacity: 0,
                transform: "scale(0.001)"
            },
            visibleStyle: {
                opacity: 1,
                transform: "scale(1)"
            }
        }, o.extend(r.prototype, i.prototype), r.prototype.option = function(e) {
            o.extend(this.options, e)
        }, r.prototype._create = function() {
            this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), o.extend(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize()
        }, r.prototype.reloadItems = function() {
            this.items = this._itemize(this.element.children);
        }, r.prototype._itemize = function(e) {
            for (var t = this._filterFindItemElements(e), i = this.constructor.Item, n = [], o = 0, a = t.length; a > o; o++) {
                var r = t[o],
                    s = new i(r, this);
                n.push(s)
            }
            return n
        }, r.prototype._filterFindItemElements = function(e) {
            return o.filterFindElements(e, this.options.itemSelector)
        }, r.prototype.getItemElements = function() {
            for (var e = [], t = 0, i = this.items.length; i > t; t++) e.push(this.items[t].element);
            return e
        }, r.prototype.layout = function() {
            this._resetLayout(), this._manageStamps();
            var e = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
            this.layoutItems(this.items, e), this._isLayoutInited = !0
        }, r.prototype._init = r.prototype.layout, r.prototype._resetLayout = function() {
            this.getSize()
        }, r.prototype.getSize = function() {
            this.size = n(this.element)
        }, r.prototype._getMeasurement = function(e, t) {
            var i, a = this.options[e];
            a ? ("string" == typeof a ? i = this.element.querySelector(a) : o.isElement(a) && (i = a), this[e] = i ? n(i)[t] : a) : this[e] = 0
        }, r.prototype.layoutItems = function(e, t) {
            e = this._getItemsForLayout(e), this._layoutItems(e, t), this._postLayout()
        }, r.prototype._getItemsForLayout = function(e) {
            for (var t = [], i = 0, n = e.length; n > i; i++) {
                var o = e[i];
                o.isIgnored || t.push(o)
            }
            return t
        }, r.prototype._layoutItems = function(e, t) {
            if (this._emitCompleteOnItems("layout", e), e && e.length) {
                for (var i = [], n = 0, o = e.length; o > n; n++) {
                    var a = e[n],
                        r = this._getItemLayoutPosition(a);
                    r.item = a, r.isInstant = t || a.isLayoutInstant, i.push(r)
                }
                this._processLayoutQueue(i)
            }
        }, r.prototype._getItemLayoutPosition = function() {
            return {
                x: 0,
                y: 0
            }
        }, r.prototype._processLayoutQueue = function(e) {
            for (var t = 0, i = e.length; i > t; t++) {
                var n = e[t];
                this._positionItem(n.item, n.x, n.y, n.isInstant)
            }
        }, r.prototype._positionItem = function(e, t, i, n) {
            n ? e.goTo(t, i) : e.moveTo(t, i)
        }, r.prototype._postLayout = function() {
            this.resizeContainer()
        }, r.prototype.resizeContainer = function() {
            if (this.options.isResizingContainer) {
                var e = this._getContainerSize();
                e && (this._setContainerMeasure(e.width, !0), this._setContainerMeasure(e.height, !1))
            }
        }, r.prototype._getContainerSize = p, r.prototype._setContainerMeasure = function(e, t) {
            if (void 0 !== e) {
                var i = this.size;
                i.isBorderBox && (e += t ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth), e = Math.max(e, 0), this.element.style[t ? "width" : "height"] = e + "px"
            }
        }, r.prototype._emitCompleteOnItems = function(e, t) {
            function i() {
                o.dispatchEvent(e + "Complete", null, [t])
            }

            function n() {
                r++, r === a && i()
            }
            var o = this,
                a = t.length;
            if (!t || !a) return void i();
            for (var r = 0, s = 0, l = t.length; l > s; s++) {
                var p = t[s];
                p.once(e, n)
            }
        }, r.prototype.dispatchEvent = function(e, t, i) {
            var n = t ? [t].concat(i) : i;
            if (this.emitEvent(e, n), l)
                if (this.$element = this.$element || l(this.element), t) {
                    var o = l.Event(t);
                    o.type = e, this.$element.trigger(o, i)
                } else this.$element.trigger(e, i)
        }, r.prototype.ignore = function(e) {
            var t = this.getItem(e);
            t && (t.isIgnored = !0)
        }, r.prototype.unignore = function(e) {
            var t = this.getItem(e);
            t && delete t.isIgnored
        }, r.prototype.stamp = function(e) {
            if (e = this._find(e)) {
                this.stamps = this.stamps.concat(e);
                for (var t = 0, i = e.length; i > t; t++) {
                    var n = e[t];
                    this.ignore(n)
                }
            }
        }, r.prototype.unstamp = function(e) {
            if (e = this._find(e))
                for (var t = 0, i = e.length; i > t; t++) {
                    var n = e[t];
                    o.removeFrom(this.stamps, n), this.unignore(n)
                }
        }, r.prototype._find = function(e) {
            return e ? ("string" == typeof e && (e = this.element.querySelectorAll(e)), e = o.makeArray(e)) : void 0
        }, r.prototype._manageStamps = function() {
            if (this.stamps && this.stamps.length) {
                this._getBoundingRect();
                for (var e = 0, t = this.stamps.length; t > e; e++) {
                    var i = this.stamps[e];
                    this._manageStamp(i)
                }
            }
        }, r.prototype._getBoundingRect = function() {
            var e = this.element.getBoundingClientRect(),
                t = this.size;
            this._boundingRect = {
                left: e.left + t.paddingLeft + t.borderLeftWidth,
                top: e.top + t.paddingTop + t.borderTopWidth,
                right: e.right - (t.paddingRight + t.borderRightWidth),
                bottom: e.bottom - (t.paddingBottom + t.borderBottomWidth)
            }
        }, r.prototype._manageStamp = p, r.prototype._getElementOffset = function(e) {
            var t = e.getBoundingClientRect(),
                i = this._boundingRect,
                o = n(e),
                a = {
                    left: t.left - i.left - o.marginLeft,
                    top: t.top - i.top - o.marginTop,
                    right: i.right - t.right - o.marginRight,
                    bottom: i.bottom - t.bottom - o.marginBottom
                };
            return a
        }, r.prototype.handleEvent = function(e) {
            var t = "on" + e.type;
            this[t] && this[t](e)
        }, r.prototype.bindResize = function() {
            this.isResizeBound || (t.bind(e, "resize", this), this.isResizeBound = !0)
        }, r.prototype.unbindResize = function() {
            this.isResizeBound && t.unbind(e, "resize", this), this.isResizeBound = !1
        }, r.prototype.onresize = function() {
            function e() {
                t.resize(), delete t.resizeTimeout
            }
            this.resizeTimeout && clearTimeout(this.resizeTimeout);
            var t = this;
            this.resizeTimeout = setTimeout(e, 100)
        }, r.prototype.resize = function() {
            this.isResizeBound && this.needsResizeLayout() && this.layout()
        }, r.prototype.needsResizeLayout = function() {
            var e = n(this.element),
                t = this.size && e;
            return t && e.innerWidth !== this.size.innerWidth
        }, r.prototype.addItems = function(e) {
            var t = this._itemize(e);
            return t.length && (this.items = this.items.concat(t)), t
        }, r.prototype.appended = function(e) {
            var t = this.addItems(e);
            t.length && (this.layoutItems(t, !0), this.reveal(t))
        }, r.prototype.prepended = function(e) {
            var t = this._itemize(e);
            if (t.length) {
                var i = this.items.slice(0);
                this.items = t.concat(i), this._resetLayout(), this._manageStamps(), this.layoutItems(t, !0), this.reveal(t), this.layoutItems(i)
            }
        }, r.prototype.reveal = function(e) {
            this._emitCompleteOnItems("reveal", e);
            for (var t = e && e.length, i = 0; t && t > i; i++) {
                var n = e[i];
                n.reveal()
            }
        }, r.prototype.hide = function(e) {
            this._emitCompleteOnItems("hide", e);
            for (var t = e && e.length, i = 0; t && t > i; i++) {
                var n = e[i];
                n.hide()
            }
        }, r.prototype.revealItemElements = function(e) {
            var t = this.getItems(e);
            this.reveal(t)
        }, r.prototype.hideItemElements = function(e) {
            var t = this.getItems(e);
            this.hide(t)
        }, r.prototype.getItem = function(e) {
            for (var t = 0, i = this.items.length; i > t; t++) {
                var n = this.items[t];
                if (n.element === e) return n
            }
        }, r.prototype.getItems = function(e) {
            e = o.makeArray(e);
            for (var t = [], i = 0, n = e.length; n > i; i++) {
                var a = e[i],
                    r = this.getItem(a);
                r && t.push(r)
            }
            return t
        }, r.prototype.remove = function(e) {
            var t = this.getItems(e);
            if (this._emitCompleteOnItems("remove", t), t && t.length)
                for (var i = 0, n = t.length; n > i; i++) {
                    var a = t[i];
                    a.remove(), o.removeFrom(this.items, a)
                }
        }, r.prototype.destroy = function() {
            var e = this.element.style;
            e.height = "", e.position = "", e.width = "";
            for (var t = 0, i = this.items.length; i > t; t++) {
                var n = this.items[t];
                n.destroy()
            }
            this.unbindResize();
            var o = this.element.outlayerGUID;
            delete u[o], delete this.element.outlayerGUID, l && l.removeData(this.element, this.constructor.namespace)
        }, r.data = function(e) {
            e = o.getQueryElement(e);
            var t = e && e.outlayerGUID;
            return t && u[t]
        }, r.create = function(e, t) {
            function i() {
                r.apply(this, arguments)
            }
            return Object.create ? i.prototype = Object.create(r.prototype) : o.extend(i.prototype, r.prototype), i.prototype.constructor = i, i.defaults = o.extend({}, r.defaults), o.extend(i.defaults, t), i.prototype.settings = {}, i.namespace = e, i.data = r.data, i.Item = function() {
                a.apply(this, arguments)
            }, i.Item.prototype = new a, o.htmlInit(i, e), l && l.bridget && l.bridget(e, i), i
        }, r.Item = a, r
    }),
    function(e, t) {
        "use strict";
        "function" == typeof define && define.amd ? define("isotope/js/item", ["outlayer/outlayer"], t) : "object" == typeof exports ? module.exports = t(require("outlayer")) : (e.Isotope = e.Isotope || {}, e.Isotope.Item = t(e.Outlayer))
    }(window, function(e) {
        "use strict";

        function t() {
            e.Item.apply(this, arguments)
        }
        t.prototype = new e.Item, t.prototype._create = function() {
            this.id = this.layout.itemGUID++, e.Item.prototype._create.call(this), this.sortData = {}
        }, t.prototype.updateSortData = function() {
            if (!this.isIgnored) {
                this.sortData.id = this.id, this.sortData["original-order"] = this.id, this.sortData.random = Math.random();
                var e = this.layout.options.getSortData,
                    t = this.layout._sorters;
                for (var i in e) {
                    var n = t[i];
                    this.sortData[i] = n(this.element, this)
                }
            }
        };
        var i = t.prototype.destroy;
        return t.prototype.destroy = function() {
            i.apply(this, arguments), this.css({
                display: ""
            })
        }, t
    }),
    function(e, t) {
        "use strict";
        "function" == typeof define && define.amd ? define("isotope/js/layout-mode", ["get-size/get-size", "outlayer/outlayer"], t) : "object" == typeof exports ? module.exports = t(require("get-size"), require("outlayer")) : (e.Isotope = e.Isotope || {}, e.Isotope.LayoutMode = t(e.getSize, e.Outlayer))
    }(window, function(e, t) {
        "use strict";

        function i(e) {
            this.isotope = e, e && (this.options = e.options[this.namespace], this.element = e.element, this.items = e.filteredItems, this.size = e.size)
        }
        return function() {
            function e(e) {
                return function() {
                    return t.prototype[e].apply(this.isotope, arguments)
                }
            }
            for (var n = ["_resetLayout", "_getItemLayoutPosition", "_manageStamp", "_getContainerSize", "_getElementOffset", "needsResizeLayout"], o = 0, a = n.length; a > o; o++) {
                var r = n[o];
                i.prototype[r] = e(r)
            }
        }(), i.prototype.needsVerticalResizeLayout = function() {
            var t = e(this.isotope.element),
                i = this.isotope.size && t;
            return i && t.innerHeight != this.isotope.size.innerHeight
        }, i.prototype._getMeasurement = function() {
            this.isotope._getMeasurement.apply(this, arguments)
        }, i.prototype.getColumnWidth = function() {
            this.getSegmentSize("column", "Width")
        }, i.prototype.getRowHeight = function() {
            this.getSegmentSize("row", "Height")
        }, i.prototype.getSegmentSize = function(e, t) {
            var i = e + t,
                n = "outer" + t;
            if (this._getMeasurement(i, n), !this[i]) {
                var o = this.getFirstItemSize();
                this[i] = o && o[n] || this.isotope.size["inner" + t]
            }
        }, i.prototype.getFirstItemSize = function() {
            var t = this.isotope.filteredItems[0];
            return t && t.element && e(t.element)
        }, i.prototype.layout = function() {
            this.isotope.layout.apply(this.isotope, arguments)
        }, i.prototype.getSize = function() {
            this.isotope.getSize(), this.size = this.isotope.size
        }, i.modes = {}, i.create = function(e, t) {
            function n() {
                i.apply(this, arguments)
            }
            return n.prototype = new i, t && (n.options = t), n.prototype.namespace = e, i.modes[e] = n, n
        }, i
    }),
    function(e, t) {
        "use strict";
        "function" == typeof define && define.amd ? define("masonry/masonry", ["outlayer/outlayer", "get-size/get-size", "fizzy-ui-utils/utils"], t) : "object" == typeof exports ? module.exports = t(require("outlayer"), require("get-size"), require("fizzy-ui-utils")) : e.Masonry = t(e.Outlayer, e.getSize, e.fizzyUIUtils)
    }(window, function(e, t, i) {
        var n = e.create("masonry");
        return n.prototype._resetLayout = function() {
            this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
            var e = this.cols;
            for (this.colYs = []; e--;) this.colYs.push(0);
            this.maxY = 0
        }, n.prototype.measureColumns = function() {
            if (this.getContainerWidth(), !this.columnWidth) {
                var e = this.items[0],
                    i = e && e.element;
                this.columnWidth = i && t(i).outerWidth || this.containerWidth
            }
            var n = this.columnWidth += this.gutter,
                o = this.containerWidth + this.gutter,
                a = o / n,
                r = n - o % n,
                s = r && 1 > r ? "round" : "floor";
            a = Math[s](a), this.cols = Math.max(a, 1)
        }, n.prototype.getContainerWidth = function() {
            var e = this.options.isFitWidth ? this.element.parentNode : this.element,
                i = t(e);
            this.containerWidth = i && i.innerWidth
        }, n.prototype._getItemLayoutPosition = function(e) {
            e.getSize();
            var t = e.size.outerWidth % this.columnWidth,
                n = t && 1 > t ? "round" : "ceil",
                o = Math[n](e.size.outerWidth / this.columnWidth);
            o = Math.min(o, this.cols);
            for (var a = this._getColGroup(o), r = Math.min.apply(Math, a), s = i.indexOf(a, r), l = {
                    x: this.columnWidth * s,
                    y: r
                }, p = r + e.size.outerHeight, d = this.cols + 1 - a.length, u = 0; d > u; u++) this.colYs[s + u] = p;
            return l
        }, n.prototype._getColGroup = function(e) {
            if (2 > e) return this.colYs;
            for (var t = [], i = this.cols + 1 - e, n = 0; i > n; n++) {
                var o = this.colYs.slice(n, n + e);
                t[n] = Math.max.apply(Math, o)
            }
            return t
        }, n.prototype._manageStamp = function(e) {
            var i = t(e),
                n = this._getElementOffset(e),
                o = this.options.isOriginLeft ? n.left : n.right,
                a = o + i.outerWidth,
                r = Math.floor(o / this.columnWidth);
            r = Math.max(0, r);
            var s = Math.floor(a / this.columnWidth);
            s -= a % this.columnWidth ? 0 : 1, s = Math.min(this.cols - 1, s);
            for (var l = (this.options.isOriginTop ? n.top : n.bottom) + i.outerHeight, p = r; s >= p; p++) this.colYs[p] = Math.max(l, this.colYs[p])
        }, n.prototype._getContainerSize = function() {
            this.maxY = Math.max.apply(Math, this.colYs);
            var e = {
                height: this.maxY
            };
            return this.options.isFitWidth && (e.width = this._getContainerFitWidth()), e
        }, n.prototype._getContainerFitWidth = function() {
            for (var e = 0, t = this.cols; --t && 0 === this.colYs[t];) e++;
            return (this.cols - e) * this.columnWidth - this.gutter
        }, n.prototype.needsResizeLayout = function() {
            var e = this.containerWidth;
            return this.getContainerWidth(), e !== this.containerWidth
        }, n
    }),
    function(e, t) {
        "use strict";
        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/masonry", ["../layout-mode", "masonry/masonry"], t) : "object" == typeof exports ? module.exports = t(require("../layout-mode"), require("masonry-layout")) : t(e.Isotope.LayoutMode, e.Masonry)
    }(window, function(e, t) {
        "use strict";

        function i(e, t) {
            for (var i in t) e[i] = t[i];
            return e
        }
        var n = e.create("masonry"),
            o = n.prototype._getElementOffset,
            a = n.prototype.layout,
            r = n.prototype._getMeasurement;
        i(n.prototype, t.prototype), n.prototype._getElementOffset = o, n.prototype.layout = a, n.prototype._getMeasurement = r;
        var s = n.prototype.measureColumns;
        n.prototype.measureColumns = function() {
            this.items = this.isotope.filteredItems, s.call(this)
        };
        var l = n.prototype._manageStamp;
        return n.prototype._manageStamp = function() {
            this.options.isOriginLeft = this.isotope.options.isOriginLeft, this.options.isOriginTop = this.isotope.options.isOriginTop, l.apply(this, arguments)
        }, n
    }),
    function(e, t) {
        "use strict";
        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/fit-rows", ["../layout-mode"], t) : "object" == typeof exports ? module.exports = t(require("../layout-mode")) : t(e.Isotope.LayoutMode)
    }(window, function(e) {
        "use strict";
        var t = e.create("fitRows");
        return t.prototype._resetLayout = function() {
            this.x = 0, this.y = 0, this.maxY = 0, this._getMeasurement("gutter", "outerWidth")
        }, t.prototype._getItemLayoutPosition = function(e) {
            e.getSize();
            var t = e.size.outerWidth + this.gutter,
                i = this.isotope.size.innerWidth + this.gutter;
            0 !== this.x && t + this.x > i && (this.x = 0, this.y = this.maxY);
            var n = {
                x: this.x,
                y: this.y
            };
            return this.maxY = Math.max(this.maxY, this.y + e.size.outerHeight), this.x += t, n
        }, t.prototype._getContainerSize = function() {
            return {
                height: this.maxY
            }
        }, t
    }),
    function(e, t) {
        "use strict";
        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/vertical", ["../layout-mode"], t) : "object" == typeof exports ? module.exports = t(require("../layout-mode")) : t(e.Isotope.LayoutMode)
    }(window, function(e) {
        "use strict";
        var t = e.create("vertical", {
            horizontalAlignment: 0
        });
        return t.prototype._resetLayout = function() {
            this.y = 0
        }, t.prototype._getItemLayoutPosition = function(e) {
            e.getSize();
            var t = (this.isotope.size.innerWidth - e.size.outerWidth) * this.options.horizontalAlignment,
                i = this.y;
            return this.y += e.size.outerHeight, {
                x: t,
                y: i
            }
        }, t.prototype._getContainerSize = function() {
            return {
                height: this.y
            }
        }, t
    }),
    function(e, t) {
        "use strict";
        "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "matches-selector/matches-selector", "fizzy-ui-utils/utils", "isotope/js/item", "isotope/js/layout-mode", "isotope/js/layout-modes/masonry", "isotope/js/layout-modes/fit-rows", "isotope/js/layout-modes/vertical"], function(i, n, o, a, r, s) {
            return t(e, i, n, o, a, r, s)
        }) : "object" == typeof exports ? module.exports = t(e, require("outlayer"), require("get-size"), require("desandro-matches-selector"), require("fizzy-ui-utils"), require("./item"), require("./layout-mode"), require("./layout-modes/masonry"), require("./layout-modes/fit-rows"), require("./layout-modes/vertical")) : e.Isotope = t(e, e.Outlayer, e.getSize, e.matchesSelector, e.fizzyUIUtils, e.Isotope.Item, e.Isotope.LayoutMode)
    }(window, function(e, t, i, n, o, a, r) {
        function s(e, t) {
            return function(i, n) {
                for (var o = 0, a = e.length; a > o; o++) {
                    var r = e[o],
                        s = i.sortData[r],
                        l = n.sortData[r];
                    if (s > l || l > s) {
                        var p = void 0 !== t[r] ? t[r] : t,
                            d = p ? 1 : -1;
                        return (s > l ? 1 : -1) * d
                    }
                }
                return 0
            }
        }
        var l = e.jQuery,
            p = String.prototype.trim ? function(e) {
                return e.trim()
            } : function(e) {
                return e.replace(/^\s+|\s+$/g, "")
            },
            d = document.documentElement,
            u = d.textContent ? function(e) {
                return e.textContent
            } : function(e) {
                return e.innerText
            },
            c = t.create("isotope", {
                layoutMode: "masonry",
                isJQueryFiltering: !0,
                sortAscending: !0
            });
        c.Item = a, c.LayoutMode = r, c.prototype._create = function() {
            this.itemGUID = 0, this._sorters = {}, this._getSorters(), t.prototype._create.call(this), this.modes = {}, this.filteredItems = this.items, this.sortHistory = ["original-order"];
            for (var e in r.modes) this._initLayoutMode(e)
        }, c.prototype.reloadItems = function() {
            this.itemGUID = 0, t.prototype.reloadItems.call(this)
        }, c.prototype._itemize = function() {
            for (var e = t.prototype._itemize.apply(this, arguments), i = 0, n = e.length; n > i; i++) {
                var o = e[i];
                o.id = this.itemGUID++
            }
            return this._updateItemsSortData(e), e
        }, c.prototype._initLayoutMode = function(e) {
            var t = r.modes[e],
                i = this.options[e] || {};
            this.options[e] = t.options ? o.extend(t.options, i) : i, this.modes[e] = new t(this)
        }, c.prototype.layout = function() {
            return !this._isLayoutInited && this.options.isInitLayout ? void this.arrange() : void this._layout()
        }, c.prototype._layout = function() {
            var e = this._getIsInstant();
            this._resetLayout(), this._manageStamps(), this.layoutItems(this.filteredItems, e), this._isLayoutInited = !0
        }, c.prototype.arrange = function(e) {
            function t() {
                n.reveal(i.needReveal), n.hide(i.needHide)
            }
            this.option(e), this._getIsInstant();
            var i = this._filter(this.items);
            this.filteredItems = i.matches;
            var n = this;
            this._bindArrangeComplete(), this._isInstant ? this._noTransition(t) : t(), this._sort(), this._layout()
        }, c.prototype._init = c.prototype.arrange, c.prototype._getIsInstant = function() {
            var e = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
            return this._isInstant = e, e
        }, c.prototype._bindArrangeComplete = function() {
            function e() {
                t && i && n && o.dispatchEvent("arrangeComplete", null, [o.filteredItems])
            }
            var t, i, n, o = this;
            this.once("layoutComplete", function() {
                t = !0, e()
            }), this.once("hideComplete", function() {
                i = !0, e()
            }), this.once("revealComplete", function() {
                n = !0, e()
            })
        }, c.prototype._filter = function(e) {
            var t = this.options.filter;
            t = t || "*";
            for (var i = [], n = [], o = [], a = this._getFilterTest(t), r = 0, s = e.length; s > r; r++) {
                var l = e[r];
                if (!l.isIgnored) {
                    var p = a(l);
                    p && i.push(l), p && l.isHidden ? n.push(l) : p || l.isHidden || o.push(l)
                }
            }
            return {
                matches: i,
                needReveal: n,
                needHide: o
            }
        }, c.prototype._getFilterTest = function(e) {
            return l && this.options.isJQueryFiltering ? function(t) {
                return l(t.element).is(e)
            } : "function" == typeof e ? function(t) {
                return e(t.element)
            } : function(t) {
                return n(t.element, e)
            }
        }, c.prototype.updateSortData = function(e) {
            var t;
            e ? (e = o.makeArray(e), t = this.getItems(e)) : t = this.items, this._getSorters(), this._updateItemsSortData(t)
        }, c.prototype._getSorters = function() {
            var e = this.options.getSortData;
            for (var t in e) {
                var i = e[t];
                this._sorters[t] = f(i)
            }
        }, c.prototype._updateItemsSortData = function(e) {
            for (var t = e && e.length, i = 0; t && t > i; i++) {
                var n = e[i];
                n.updateSortData()
            }
        };
        var f = function() {
            function e(e) {
                if ("string" != typeof e) return e;
                var i = p(e).split(" "),
                    n = i[0],
                    o = n.match(/^\[(.+)\]$/),
                    a = o && o[1],
                    r = t(a, n),
                    s = c.sortDataParsers[i[1]];
                return e = s ? function(e) {
                    return e && s(r(e))
                } : function(e) {
                    return e && r(e)
                }
            }

            function t(e, t) {
                var i;
                return i = e ? function(t) {
                    return t.getAttribute(e)
                } : function(e) {
                    var i = e.querySelector(t);
                    return i && u(i)
                }
            }
            return e
        }();
        c.sortDataParsers = {
            parseInt: function(e) {
                return parseInt(e, 10)
            },
            parseFloat: function(e) {
                return parseFloat(e)
            }
        }, c.prototype._sort = function() {
            var e = this.options.sortBy;
            if (e) {
                var t = [].concat.apply(e, this.sortHistory),
                    i = s(t, this.options.sortAscending);
                this.filteredItems.sort(i), e != this.sortHistory[0] && this.sortHistory.unshift(e)
            }
        }, c.prototype._mode = function() {
            var e = this.options.layoutMode,
                t = this.modes[e];
            if (!t) throw new Error("No layout mode: " + e);
            return t.options = this.options[e], t
        }, c.prototype._resetLayout = function() {
            t.prototype._resetLayout.call(this), this._mode()._resetLayout()
        }, c.prototype._getItemLayoutPosition = function(e) {
            return this._mode()._getItemLayoutPosition(e)
        }, c.prototype._manageStamp = function(e) {
            this._mode()._manageStamp(e)
        }, c.prototype._getContainerSize = function() {
            return this._mode()._getContainerSize()
        }, c.prototype.needsResizeLayout = function() {
            return this._mode().needsResizeLayout()
        }, c.prototype.appended = function(e) {
            var t = this.addItems(e);
            if (t.length) {
                var i = this._filterRevealAdded(t);
                this.filteredItems = this.filteredItems.concat(i)
            }
        }, c.prototype.prepended = function(e) {
            var t = this._itemize(e);
            if (t.length) {
                this._resetLayout(), this._manageStamps();
                var i = this._filterRevealAdded(t);
                this.layoutItems(this.filteredItems), this.filteredItems = i.concat(this.filteredItems), this.items = t.concat(this.items)
            }
        }, c.prototype._filterRevealAdded = function(e) {
            var t = this._filter(e);
            return this.hide(t.needHide), this.reveal(t.matches), this.layoutItems(t.matches, !0), t.matches
        }, c.prototype.insert = function(e) {
            var t = this.addItems(e);
            if (t.length) {
                var i, n, o = t.length;
                for (i = 0; o > i; i++) n = t[i], this.element.appendChild(n.element);
                var a = this._filter(t).matches;
                for (i = 0; o > i; i++) t[i].isLayoutInstant = !0;
                for (this.arrange(), i = 0; o > i; i++) delete t[i].isLayoutInstant;
                this.reveal(a)
            }
        };
        var h = c.prototype.remove;
        return c.prototype.remove = function(e) {
            e = o.makeArray(e);
            var t = this.getItems(e);
            h.call(this, e);
            var i = t && t.length;
            if (i)
                for (var n = 0; i > n; n++) {
                    var a = t[n];
                    o.removeFrom(this.filteredItems, a)
                }
        }, c.prototype.shuffle = function() {
            for (var e = 0, t = this.items.length; t > e; e++) {
                var i = this.items[e];
                i.sortData.random = Math.random()
            }
            this.options.sortBy = "random", this._sort(), this._layout()
        }, c.prototype._noTransition = function(e) {
            var t = this.options.transitionDuration;
            this.options.transitionDuration = 0;
            var i = e.call(this);
            return this.options.transitionDuration = t, i
        }, c.prototype.getFilteredItemElements = function() {
            for (var e = [], t = 0, i = this.filteredItems.length; i > t; t++) e.push(this.filteredItems[t].element);
            return e
        }, c
    }), ! function(e) {
        "use strict";

        function t() {
            o = e.innerWidth || document.documentElement.clientWidth, a = e.innerHeight || document.documentElement.clientHeight
        }

        function i(e, t, i) {
            e.addEventListener ? e.addEventListener(t, i) : e.attachEvent("on" + t, function() {
                i.call(e)
            })
        }

        function n(i) {
            e.requestAnimationFrame(function() {
                "scroll" !== i.type && t();
                for (var e = 0, n = h.length; n > e; e++) "scroll" !== i.type && (h[e].coverImage(), h[e].clipContainer()), h[e].onScroll()
            })
        }
        Date.now || (Date.now = function() {
            return (new Date).getTime()
        }), e.requestAnimationFrame || ! function() {
            for (var t = ["webkit", "moz"], i = 0; i < t.length && !e.requestAnimationFrame; ++i) {
                var n = t[i];
                e.requestAnimationFrame = e[n + "RequestAnimationFrame"], e.cancelAnimationFrame = e[n + "CancelAnimationFrame"] || e[n + "CancelRequestAnimationFrame"]
            }
            if (/iP(ad|hone|od).*OS 6/.test(e.navigator.userAgent) || !e.requestAnimationFrame || !e.cancelAnimationFrame) {
                var o = 0;
                e.requestAnimationFrame = function(e) {
                    var t = Date.now(),
                        i = Math.max(o + 16, t);
                    return setTimeout(function() {
                        e(o = i)
                    }, i - t)
                }, e.cancelAnimationFrame = clearTimeout
            }
        }();
        var o, a, r = function() {
                if (!e.getComputedStyle) return !1;
                var t, i = document.createElement("p"),
                    n = {
                        webkitTransform: "-webkit-transform",
                        OTransform: "-o-transform",
                        msTransform: "-ms-transform",
                        MozTransform: "-moz-transform",
                        transform: "transform"
                    };
                (document.body || document.documentElement).insertBefore(i, null);
                for (var o in n) "undefined" != typeof i.style[o] && (i.style[o] = "translate3d(1px,1px,1px)", t = e.getComputedStyle(i).getPropertyValue(n[o]));
                return (document.body || document.documentElement).removeChild(i), "undefined" != typeof t && t.length > 0 && "none" !== t
            }(),
            s = navigator.userAgent.toLowerCase().indexOf("android") > -1,
            l = /iPad|iPhone|iPod/.test(navigator.userAgent) && !e.MSStream,
            p = !!e.opera,
            d = /Edge\/\d+/.test(navigator.userAgent),
            u = /Trident.*rv[ :]*11\./.test(navigator.userAgent),
            c = !!Function("/*@cc_on return document.documentMode===10@*/")(),
            f = document.all && !e.atob;
        t();
        var h = [],
            m = function() {
                function e(e, i) {
                    var n, o = this;
                    o.$item = e, o.defaults = {
                        type: "scroll",
                        speed: .5,
                        imgSrc: null,
                        imgWidth: null,
                        imgHeight: null,
                        enableTransform: !0,
                        zIndex: -100,
                        noAdnroid: !1,
                        noIos: !0,
                        onScroll: null,
                        onInit: null,
                        onDestroy: null,
                        onCoverImage: null
                    }, n = JSON.parse(o.$item.getAttribute("data-jarallax") || "{}"), o.options = o.extend({}, o.defaults, n, i), s && o.options.noAdnroid || l && o.options.noIos || (o.options.speed = Math.min(2, Math.max(-1, parseFloat(o.options.speed))), o.instanceID = t++, o.image = {
                        src: o.options.imgSrc || null,
                        $container: null,
                        $item: null,
                        width: o.options.imgWidth || null,
                        height: o.options.imgHeight || null,
                        useImgTag: l || s || p || u || c || d
                    }, o.initImg() && o.init())
                }
                var t = 0;
                return e
            }();
        m.prototype.css = function(e, t) {
            if ("string" == typeof t) return e.style[t];
            t.transform && (t.WebkitTransform = t.MozTransform = t.transform);
            for (var i in t) e.style[i] = t[i];
            return e
        }, m.prototype.extend = function(e) {
            e = e || {};
            for (var t = 1; t < arguments.length; t++)
                if (arguments[t])
                    for (var i in arguments[t]) arguments[t].hasOwnProperty(i) && (e[i] = arguments[t][i]);
            return e
        }, m.prototype.initImg = function() {
            var e = this;
            return null === e.image.src && (e.image.src = e.css(e.$item, "background-image").replace(/^url\(['"]?/g, "").replace(/['"]?\)$/g, "")), !(!e.image.src || "none" === e.image.src)
        }, m.prototype.init = function() {
            function e() {
                t.coverImage(), t.clipContainer(), t.onScroll(!0), t.$item.setAttribute("data-jarallax-original-styles", t.$item.getAttribute("style")), t.options.onInit && t.options.onInit.call(t), setTimeout(function() {
                    t.$item && t.css(t.$item, {
                        "background-image": "none",
                        "background-attachment": "scroll",
                        "background-size": "auto"
                    })
                }, 0)
            }
            var t = this,
                i = {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    pointerEvents: "none"
                },
                n = {
                    position: "fixed"
                };
            t.image.$container = document.createElement("div"), t.css(t.image.$container, i), t.css(t.image.$container, {
                visibility: "hidden",
                "z-index": t.options.zIndex
            }), t.image.$container.setAttribute("id", "jarallax-container-" + t.instanceID), t.$item.appendChild(t.image.$container), t.image.useImgTag && r && t.options.enableTransform ? (t.image.$item = document.createElement("img"), t.image.$item.setAttribute("src", t.image.src), n = t.extend({
                "max-width": "none"
            }, i, n)) : (t.image.$item = document.createElement("div"), n = t.extend({
                "background-position": "50% 50%",
                "background-size": "100% auto",
                "background-repeat": "no-repeat no-repeat",
                "background-image": 'url("' + t.image.src + '")'
            }, i, n)), f && (n.backgroundAttachment = "fixed"), t.parentWithTransform = 0;
            for (var o = t.$item; null !== o && o !== document && 0 === t.parentWithTransform;)(t.css(o, "-webkit-transform") || t.css(o, "-moz-transform") || t.css(o, "transform")) && (t.parentWithTransform = 1, t.css(t.image.$container, {
                transform: "translateX(0) translateY(0)"
            })), o = o.parentNode;
            t.css(t.image.$item, n), t.image.$container.appendChild(t.image.$item), t.image.width && t.image.height ? e() : t.getImageSize(t.image.src, function(i, n) {
                t.image.width = i, t.image.height = n, e()
            }), h.push(t)
        }, m.prototype.destroy = function() {
            for (var e = this, t = 0, i = h.length; i > t; t++)
                if (h[t].instanceID === e.instanceID) {
                    h.splice(t, 1);
                    break
                }
            e.$item.setAttribute("style", e.$item.getAttribute("data-jarallax-original-styles")), e.$item.removeAttribute("data-jarallax-original-styles"), e.$clipStyles && e.$clipStyles.parentNode.removeChild(e.$clipStyles), e.image.$container.parentNode.removeChild(e.image.$container), e.options.onDestroy && e.options.onDestroy.call(e), delete e.$item.jarallax;
            for (var n in e) delete e[n]
        }, m.prototype.getImageSize = function(e, t) {
            if (e && t) {
                var i = new Image;
                i.onload = function() {
                    t(i.width, i.height)
                }, i.src = e
            }
        }, m.prototype.clipContainer = function() {
            if (!f) {
                var e = this,
                    t = e.image.$container.getBoundingClientRect(),
                    i = t.width,
                    n = t.height;
                if (!e.$clipStyles) {
                    e.$clipStyles = document.createElement("style"), e.$clipStyles.setAttribute("type", "text/css"), e.$clipStyles.setAttribute("id", "#jarallax-clip-" + e.instanceID);
                    var o = document.head || document.getElementsByTagName("head")[0];
                    o.appendChild(e.$clipStyles)
                }
                var a = ["#jarallax-container-" + e.instanceID + " {", "   clip: rect(0 " + i + "px " + n + "px 0);", "   clip: rect(0, " + i + "px, " + n + "px, 0);", "}"].join("\n");
                e.$clipStyles.styleSheet ? e.$clipStyles.styleSheet.cssText = a : e.$clipStyles.innerHTML = a
            }
        }, m.prototype.coverImage = function() {
            var e = this;
            if (e.image.width && e.image.height) {
                var t = e.image.$container.getBoundingClientRect(),
                    i = t.width,
                    n = t.height,
                    o = t.left,
                    s = e.image.width,
                    l = e.image.height,
                    p = e.options.speed,
                    d = "scroll" === e.options.type || "scroll-opacity" === e.options.type,
                    u = 0,
                    c = 0,
                    f = n,
                    h = 0,
                    m = 0;
                d && (u = p * (n + a) / 2, (0 > p || p > 1) && (u = p * Math.max(n, a) / 2), 0 > p || p > 1 ? f = Math.max(n, a) + 2 * Math.abs(u) : f += Math.abs(a - n) * (1 - p)), c = f * s / l, i > c && (c = i, f = c * l / s), e.bgPosVerticalCenter = 0, !(d && a > f) || r && e.options.enableTransform || (e.bgPosVerticalCenter = (a - f) / 2, f = a), d ? (h = o + (i - c) / 2, m = (a - f) / 2) : (h = (i - c) / 2, m = (n - f) / 2), e.parentWithTransform && (h -= o), e.parallaxScrollDistance = u, e.css(e.image.$item, {
                    width: c + "px",
                    height: f + "px",
                    marginLeft: h + "px",
                    marginTop: m + "px"
                }), e.options.onCoverImage && e.options.onCoverImage.call(e)
            }
        }, m.prototype.isVisible = function() {
            return this.isElementInViewport || !1
        }, m.prototype.onScroll = function(e) {
            var t = this;
            if (t.image.width && t.image.height) {
                var i = t.$item.getBoundingClientRect(),
                    n = i.top,
                    s = i.height,
                    l = {
                        position: "absolute",
                        visibility: "visible",
                        backgroundPosition: "50% 50%"
                    };
                t.isElementInViewport = i.bottom >= 0 && i.right >= 0 && a >= n && i.left <= o;
                var p = e ? !1 : !t.isElementInViewport;
                if (!p) {
                    var d = Math.max(0, n),
                        u = Math.max(0, s + n),
                        c = Math.max(0, -n),
                        h = Math.max(0, n + s - a),
                        m = Math.max(0, s - (n + s - a)),
                        g = Math.max(0, -n + a - s),
                        v = 1 - 2 * (a - n) / (a + s),
                        y = 1;
                    if (a > s ? y = 1 - (c || h) / s : a >= u ? y = u / a : a >= m && (y = m / a), ("opacity" === t.options.type || "scale-opacity" === t.options.type || "scroll-opacity" === t.options.type) && (l.transform = "translate3d(0, 0, 0)", l.opacity = y), "scale" === t.options.type || "scale-opacity" === t.options.type) {
                        var w = 1;
                        t.options.speed < 0 ? w -= t.options.speed * y : w += t.options.speed * (1 - y), l.transform = "scale(" + w + ") translate3d(0, 0, 0)"
                    }
                    if ("scroll" === t.options.type || "scroll-opacity" === t.options.type) {
                        var b = t.parallaxScrollDistance * v;
                        r && t.options.enableTransform ? (t.parentWithTransform && (b -= n), l.transform = "translate3d(0, " + b + "px, 0)") : (t.bgPosVerticalCenter && (b += t.bgPosVerticalCenter), l.backgroundPosition = "50% " + b + "px"), l.position = f ? "absolute" : "fixed"
                    }
                    t.css(t.image.$item, l), t.options.onScroll && t.options.onScroll.call(t, {
                        section: i,
                        beforeTop: d,
                        beforeTopEnd: u,
                        afterTop: c,
                        beforeBottom: h,
                        beforeBottomEnd: m,
                        afterBottom: g,
                        visiblePercent: y,
                        fromViewportCenter: v
                    })
                }
            }
        }, i(e, "scroll", n), i(e, "resize", n), i(e, "orientationchange", n), i(e, "load", n);
        var g = function(e) {
            ("object" == typeof HTMLElement ? e instanceof HTMLElement : e && "object" == typeof e && null !== e && 1 === e.nodeType && "string" == typeof e.nodeName) && (e = [e]);
            var t, i = arguments[1],
                n = Array.prototype.slice.call(arguments, 2),
                o = e.length,
                a = 0;
            for (a; o > a; a++)
                if ("object" == typeof i || "undefined" == typeof i ? e[a].jarallax || (e[a].jarallax = new m(e[a], i)) : e[a].jarallax && (t = e[a].jarallax[i].apply(e[a].jarallax, n)), "undefined" != typeof t) return t;
            return e
        };
        g.constructor = m;
        var v = e.jarallax;
        if (e.jarallax = g, e.jarallax.noConflict = function() {
                return e.jarallax = v, this
            }, "undefined" != typeof jQuery) {
            var y = function() {
                var t = arguments || [];
                Array.prototype.unshift.call(t, this);
                var i = g.apply(e, t);
                return "object" != typeof i ? i : this
            };
            y.constructor = m;
            var w = jQuery.fn.jarallax;
            jQuery.fn.jarallax = y, jQuery.fn.jarallax.noConflict = function() {
                return jQuery.fn.jarallax = w, this
            }
        }
        i(e, "DOMContentLoaded", function() {
            g(document.querySelectorAll("[data-jarallax]"))
        })
    }(window), ! function(e) {
        "use strict";

        function t(e) {
            e = e || {};
            for (var t = 1; t < arguments.length; t++)
                if (arguments[t])
                    for (var i in arguments[t]) arguments[t].hasOwnProperty(i) && (e[i] = arguments[t][i]);
            return e
        }

        function i() {
            this._done = [], this._fail = []
        }
        i.prototype = {
            execute: function(e, t) {
                var i = e.length;
                for (t = Array.prototype.slice.call(t); i--;) e[i].apply(null, t)
            },
            resolve: function() {
                this.execute(this._done, arguments)
            },
            reject: function() {
                this.execute(this._fail, arguments)
            },
            done: function(e) {
                this._done.push(e)
            },
            fail: function(e) {
                this._fail.push(e)
            }
        };
        var n = function() {
            function e(e, n) {
                var o = this;
                o.url = e, o.options_default = {
                    autoplay: 1,
                    loop: 1,
                    mute: 1,
                    controls: 0
                }, o.options = t({}, o.options_default, n), o.videoID = o.parseURL(e), o.videoID && (o.ID = i++, o.loadAPI(), o.init())
            }
            var i = 0;
            return e
        }();
        n.prototype.parseURL = function(e) {
            function t(e) {
                var t = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,
                    i = e.match(t);
                return i && 11 === i[1].length ? i[1] : !1
            }

            function i(e) {
                var t = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/,
                    i = e.match(t);
                return i && i[3] ? i[3] : !1
            }
            var n = t(e),
                o = i(e);
            return n ? (this.type = "youtube", n) : o ? (this.type = "vimeo", o) : !1
        }, n.prototype.isValid = function() {
            return !!this.videoID
        }, n.prototype.on = function(e, t) {
            this.userEventsList = this.userEventsList || [], (this.userEventsList[e] || (this.userEventsList[e] = [])).push(t)
        }, n.prototype.off = function(e, t) {
            if (this.userEventsList && this.userEventsList[e])
                if (t)
                    for (var i = 0; i < this.userEventsList[e].length; i++) this.userEventsList[e][i] === t && (this.userEventsList[e][i] = !1);
                else delete this.userEventsList[e]
        }, n.prototype.fire = function(e) {
            var t = [].slice.call(arguments, 1);
            if (this.userEventsList && "undefined" != typeof this.userEventsList[e])
                for (var i in this.userEventsList[e]) this.userEventsList[e][i] && this.userEventsList[e][i].apply(this, t);
        }, n.prototype.play = function() {
            this.player && ("youtube" === this.type && this.player.playVideo && this.player.playVideo(), "vimeo" === this.type && this.player.api("play"))
        }, n.prototype.pause = function() {
            this.player && ("youtube" === this.type && this.player.pauseVideo && this.player.pauseVideo(), "vimeo" === this.type && this.player.api("pause"))
        }, n.prototype.getImageURL = function(e) {
            var t = this;
            if (t.videoImage) return void e(t.videoImage);
            if ("youtube" === t.type && (t.videoImage = "https://img.youtube.com/vi/" + t.videoID + "/maxresdefault.jpg", e(t.videoImage)), "vimeo" === t.type) {
                var i = new XMLHttpRequest;
                i.open("GET", "https://vimeo.com/api/v2/video/" + t.videoID + ".json", !0), i.onreadystatechange = function() {
                    if (4 === this.readyState && this.status >= 200 && this.status < 400) {
                        var i = JSON.parse(this.responseText);
                        t.videoImage = i[0].thumbnail_large, e(t.videoImage)
                    }
                }, i.send(), i = null
            }
        }, n.prototype.getIframe = function(t) {
            var i = this;
            return i.$iframe ? void t(i.$iframe) : void i.onAPIready(function() {
                var n;
                if (i.$iframe || (n = document.createElement("div"), n.style.display = "none"), "youtube" === i.type) {
                    i.playerOptions = {}, i.playerOptions.videoId = i.videoID, i.playerOptions.width = e.innerWidth || document.documentElement.clientWidth, i.playerOptions.playerVars = {
                        autohide: 1,
                        rel: 0,
                        autoplay: 0
                    }, i.options.controls || (i.playerOptions.playerVars.iv_load_policy = 3, i.playerOptions.playerVars.modestbranding = 1, i.playerOptions.playerVars.controls = 0, i.playerOptions.playerVars.showinfo = 0, i.playerOptions.playerVars.disablekb = 1);
                    var o;
                    i.playerOptions.events = {
                        onReady: function(e) {
                            i.options.mute && e.target.mute(), i.options.autoplay && i.play(), i.fire("ready", e)
                        },
                        onStateChange: function(e) {
                            i.options.loop && e.data === YT.PlayerState.ENDED && e.target.playVideo(), o || e.data !== YT.PlayerState.PLAYING || (o = 1, i.fire("started", e)), e.data === YT.PlayerState.PLAYING && i.fire("play", e), e.data === YT.PlayerState.PAUSED && i.fire("pause", e), e.data === YT.PlayerState.ENDED && i.fire("end", e)
                        }
                    };
                    var a = !i.$iframe;
                    if (a) {
                        var r = document.createElement("div");
                        r.setAttribute("id", i.playerID), n.appendChild(r), document.body.appendChild(n)
                    }
                    i.player = i.player || new e.YT.Player(i.playerID, i.playerOptions), a && (i.$iframe = document.getElementById(i.playerID))
                }
                "vimeo" === i.type && (i.playerOptions = "", i.playerOptions += "player_id=" + i.playerID, i.playerOptions += "&autopause=0", i.options.controls || (i.playerOptions += "&badge=0&byline=0&portrait=0&title=0"), i.playerOptions += "&autoplay=0", i.playerOptions += "&loop=" + (i.options.loop ? 1 : 0), i.$iframe || (i.$iframe = document.createElement("iframe"), i.$iframe.setAttribute("id", i.playerID), i.$iframe.setAttribute("src", "https://player.vimeo.com/video/" + i.videoID + "?" + i.playerOptions), i.$iframe.setAttribute("frameborder", "0"), n.appendChild(i.$iframe), document.body.appendChild(n)), i.player = i.player || $f(i.$iframe), i.player.addEvent("ready", function(e) {
                    i.player.api("setVolume", i.options.mute ? 0 : 100), i.options.autoplay && i.play();
                    var t;
                    i.player.addEvent("playProgress", function(e) {
                        t || i.fire("started", e), t = 1
                    }), i.player.addEvent("play", function(e) {
                        i.fire("play", e)
                    }), i.player.addEvent("pause", function(e) {
                        i.fire("pause", e)
                    }), i.player.addEvent("finish", function(e) {
                        i.fire("end", e)
                    }), i.fire("ready", e)
                })), t(i.$iframe)
            })
        }, n.prototype.init = function() {
            var e = this;
            e.playerID = "VideoWorker-" + e.ID
        };
        var o = 0,
            a = 0;
        n.prototype.loadAPI = function() {
            var t = this;
            if (!o || !a) {
                var i = "";
                "youtube" !== t.type || o || (o = 1, i = "//www.youtube.com/iframe_api"), "vimeo" !== t.type || a || (a = 1, i = "//f.vimeocdn.com/js/froogaloop2.min.js"), "file://" === e.location.origin && (i = "http:" + i);
                var n = document.createElement("script"),
                    r = document.getElementsByTagName("head")[0];
                n.src = i, r.appendChild(n), r = null, n = null
            }
        };
        var r = 0,
            s = 0,
            l = new i,
            p = new i;
        n.prototype.onAPIready = function(t) {
            var i = this;
            if ("youtube" === i.type && ("undefined" != typeof YT && 0 !== YT.loaded || r ? "object" == typeof YT && 1 === YT.loaded ? t() : l.done(function() {
                    t()
                }) : (r = 1, e.onYouTubeIframeAPIReady = function() {
                    e.onYouTubeIframeAPIReady = null, l.resolve("done"), t()
                })), "vimeo" === i.type)
                if ("undefined" != typeof $f || s) "undefined" != typeof $f ? t() : p.done(function() {
                    t()
                });
                else {
                    s = 1;
                    var n = setInterval(function() {
                        "undefined" != typeof $f && (clearInterval(n), p.resolve("done"), t())
                    }, 20)
                }
        }, e.VideoWorker = n
    }(window),
    function() {
        "use strict";
        if ("undefined" != typeof jarallax) {
            var e = jarallax.constructor,
                t = e.prototype.init;
            e.prototype.init = function() {
                var e = this;
                t.apply(e), e.video && e.video.getIframe(function(t) {
                    e.css(t, {
                        position: "fixed",
                        top: "0px",
                        left: "0px",
                        right: "0px",
                        bottom: "0px",
                        width: "100%",
                        height: "100%",
                        visibility: "visible",
                        zIndex: -1
                    }), e.$video = t, e.image.$container.appendChild(t)
                })
            };
            var i = e.prototype.coverImage;
            e.prototype.coverImage = function() {
                var e = this;
                i.apply(e), e.video && "IFRAME" === e.image.$item.nodeName && e.css(e.image.$item, {
                    height: e.image.$item.getBoundingClientRect().height + 400 + "px",
                    top: "-200px"
                })
            };
            var n = e.prototype.initImg;
            e.prototype.initImg = function() {
                var e = this;
                if (e.options.videoSrc || (e.options.videoSrc = e.$item.getAttribute("data-jarallax-video") || !1), e.options.videoSrc) {
                    var t = new VideoWorker(e.options.videoSrc);
                    return t.isValid() && (e.image.useImgTag = !0, t.on("ready", function() {
                        var i = e.onScroll;
                        e.onScroll = function() {
                            i.apply(e), e.isVisible() ? t.play() : t.pause()
                        }
                    }), t.on("started", function() {
                        e.image.$default_item = e.image.$item, e.image.$item = e.$video, e.image.width = e.imgWidth = 1280, e.image.height = e.imgHeight = 720, e.coverImage(), e.clipContainer(), e.onScroll(), e.image.$default_item && (e.image.$default_item.style.display = "none")
                    }), e.video = t, t.getImageURL(function(t) {
                        e.image.src = t, e.init()
                    })), !1
                }
                return n.apply(e)
            };
            var o = e.prototype.destroy;
            e.prototype.destroy = function() {
                var e = this;
                o.apply(e)
            }
        }
    }(),
    function(e, t, i, n) {
        "use strict";
        var o = i("html"),
            a = i(e),
            r = i(t),
            s = i.fancybox = function() {
                s.open.apply(this, arguments)
            },
            l = navigator.userAgent.match(/msie/i),
            p = null,
            d = t.createTouch !== n,
            u = function(e) {
                return e && e.hasOwnProperty && e instanceof i
            },
            c = function(e) {
                return e && "string" === i.type(e)
            },
            f = function(e) {
                return c(e) && e.indexOf("%") > 0
            },
            h = function(e) {
                return e && !(e.style.overflow && "hidden" === e.style.overflow) && (e.clientWidth && e.scrollWidth > e.clientWidth || e.clientHeight && e.scrollHeight > e.clientHeight)
            },
            m = function(e, t) {
                var i = parseInt(e, 10) || 0;
                return t && f(e) && (i = s.getViewport()[t] / 100 * i), Math.ceil(i)
            },
            g = function(e, t) {
                return m(e, t) + "px"
            };
        i.extend(s, {
            version: "2.1.5",
            defaults: {
                padding: 15,
                margin: 20,
                width: 800,
                height: 600,
                minWidth: 100,
                minHeight: 100,
                maxWidth: 9999,
                maxHeight: 9999,
                pixelRatio: 1,
                autoSize: !0,
                autoHeight: !1,
                autoWidth: !1,
                autoResize: !0,
                autoCenter: !d,
                fitToView: !0,
                aspectRatio: !1,
                topRatio: .5,
                leftRatio: .5,
                scrolling: "auto",
                wrapCSS: "",
                arrows: !0,
                closeBtn: !0,
                closeClick: !1,
                nextClick: !1,
                mouseWheel: !0,
                autoPlay: !1,
                playSpeed: 3e3,
                preload: 3,
                modal: !1,
                loop: !0,
                ajax: {
                    dataType: "html",
                    headers: {
                        "X-fancyBox": !0
                    }
                },
                iframe: {
                    scrolling: "auto",
                    preload: !0
                },
                swf: {
                    wmode: "transparent",
                    allowfullscreen: "true",
                    allowscriptaccess: "always"
                },
                keys: {
                    next: {
                        13: "left",
                        34: "up",
                        39: "left",
                        40: "up"
                    },
                    prev: {
                        8: "right",
                        33: "down",
                        37: "right",
                        38: "down"
                    },
                    close: [27],
                    play: [32],
                    toggle: [70]
                },
                direction: {
                    next: "left",
                    prev: "right"
                },
                scrollOutside: !0,
                index: 0,
                type: null,
                href: null,
                content: null,
                title: null,
                tpl: {
                    wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                    image: '<img class="fancybox-image" src="{href}" alt="" />',
                    iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (l ? ' allowtransparency="true"' : "") + "></iframe>",
                    error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
                    closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                    next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                    prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
                },
                openEffect: "fade",
                openSpeed: 250,
                openEasing: "swing",
                openOpacity: !0,
                openMethod: "zoomIn",
                closeEffect: "fade",
                closeSpeed: 250,
                closeEasing: "swing",
                closeOpacity: !0,
                closeMethod: "zoomOut",
                nextEffect: "elastic",
                nextSpeed: 250,
                nextEasing: "swing",
                nextMethod: "changeIn",
                prevEffect: "elastic",
                prevSpeed: 250,
                prevEasing: "swing",
                prevMethod: "changeOut",
                helpers: {
                    overlay: !0,
                    title: !0
                },
                onCancel: i.noop,
                beforeLoad: i.noop,
                afterLoad: i.noop,
                beforeShow: i.noop,
                afterShow: i.noop,
                beforeChange: i.noop,
                beforeClose: i.noop,
                afterClose: i.noop
            },
            group: {},
            opts: {},
            previous: null,
            coming: null,
            current: null,
            isActive: !1,
            isOpen: !1,
            isOpened: !1,
            wrap: null,
            skin: null,
            outer: null,
            inner: null,
            player: {
                timer: null,
                isActive: !1
            },
            ajaxLoad: null,
            imgPreload: null,
            transitions: {},
            helpers: {},
            open: function(e, t) {
                return e && (i.isPlainObject(t) || (t = {}), !1 !== s.close(!0)) ? (i.isArray(e) || (e = u(e) ? i(e).get() : [e]), i.each(e, function(o, a) {
                    var r, l, p, d, f, h, m, g = {};
                    "object" === i.type(a) && (a.nodeType && (a = i(a)), u(a) ? (g = {
                        href: a.data("fancybox-href") || a.attr("href"),
                        title: a.data("fancybox-title") || a.attr("title"),
                        isDom: !0,
                        element: a
                    }, i.metadata && i.extend(!0, g, a.metadata())) : g = a), r = t.href || g.href || (c(a) ? a : null), l = t.title !== n ? t.title : g.title || "", p = t.content || g.content, d = p ? "html" : t.type || g.type, !d && g.isDom && (d = a.data("fancybox-type"), d || (f = a.prop("class").match(/fancybox\.(\w+)/), d = f ? f[1] : null)), c(r) && (d || (s.isImage(r) ? d = "image" : s.isSWF(r) ? d = "swf" : "#" === r.charAt(0) ? d = "inline" : c(a) && (d = "html", p = a)), "ajax" === d && (h = r.split(/\s+/, 2), r = h.shift(), m = h.shift())), p || ("inline" === d ? r ? p = i(c(r) ? r.replace(/.*(?=#[^\s]+$)/, "") : r) : g.isDom && (p = a) : "html" === d ? p = r : d || r || !g.isDom || (d = "inline", p = a)), i.extend(g, {
                        href: r,
                        type: d,
                        content: p,
                        title: l,
                        selector: m
                    }), e[o] = g
                }), s.opts = i.extend(!0, {}, s.defaults, t), t.keys !== n && (s.opts.keys = t.keys ? i.extend({}, s.defaults.keys, t.keys) : !1), s.group = e, s._start(s.opts.index)) : void 0
            },
            cancel: function() {
                var e = s.coming;
                e && !1 !== s.trigger("onCancel") && (s.hideLoading(), s.ajaxLoad && s.ajaxLoad.abort(), s.ajaxLoad = null, s.imgPreload && (s.imgPreload.onload = s.imgPreload.onerror = null), e.wrap && e.wrap.stop(!0, !0).trigger("onReset").remove(), s.coming = null, s.current || s._afterZoomOut(e))
            },
            close: function(e) {
                s.cancel(), !1 !== s.trigger("beforeClose") && (s.unbindEvents(), s.isActive && (s.isOpen && e !== !0 ? (s.isOpen = s.isOpened = !1, s.isClosing = !0, i(".fancybox-item, .fancybox-nav").remove(), s.wrap.stop(!0, !0).removeClass("fancybox-opened"), s.transitions[s.current.closeMethod]()) : (i(".fancybox-wrap").stop(!0).trigger("onReset").remove(), s._afterZoomOut())))
            },
            play: function(e) {
                var t = function() {
                        clearTimeout(s.player.timer)
                    },
                    i = function() {
                        t(), s.current && s.player.isActive && (s.player.timer = setTimeout(s.next, s.current.playSpeed))
                    },
                    n = function() {
                        t(), r.unbind(".player"), s.player.isActive = !1, s.trigger("onPlayEnd")
                    },
                    o = function() {
                        s.current && (s.current.loop || s.current.index < s.group.length - 1) && (s.player.isActive = !0, r.bind({
                            "onCancel.player beforeClose.player": n,
                            "onUpdate.player": i,
                            "beforeLoad.player": t
                        }), i(), s.trigger("onPlayStart"))
                    };
                e === !0 || !s.player.isActive && e !== !1 ? o() : n()
            },
            next: function(e) {
                var t = s.current;
                t && (c(e) || (e = t.direction.next), s.jumpto(t.index + 1, e, "next"))
            },
            prev: function(e) {
                var t = s.current;
                t && (c(e) || (e = t.direction.prev), s.jumpto(t.index - 1, e, "prev"))
            },
            jumpto: function(e, t, i) {
                var o = s.current;
                o && (e = m(e), s.direction = t || o.direction[e >= o.index ? "next" : "prev"], s.router = i || "jumpto", o.loop && (0 > e && (e = o.group.length + e % o.group.length), e %= o.group.length), o.group[e] !== n && (s.cancel(), s._start(e)))
            },
            reposition: function(e, t) {
                var n, o = s.current,
                    a = o ? o.wrap : null;
                a && (n = s._getPosition(t), e && "scroll" === e.type ? (delete n.position, a.stop(!0, !0).animate(n, 200)) : (a.css(n), o.pos = i.extend({}, o.dim, n)))
            },
            update: function(e) {
                var t = e && e.type,
                    i = !t || "orientationchange" === t;
                i && (clearTimeout(p), p = null), s.isOpen && !p && (p = setTimeout(function() {
                    var n = s.current;
                    n && !s.isClosing && (s.wrap.removeClass("fancybox-tmp"), (i || "load" === t || "resize" === t && n.autoResize) && s._setDimension(), "scroll" === t && n.canShrink || s.reposition(e), s.trigger("onUpdate"), p = null)
                }, i && !d ? 0 : 300))
            },
            toggle: function(e) {
                s.isOpen && (s.current.fitToView = "boolean" === i.type(e) ? e : !s.current.fitToView, d && (s.wrap.removeAttr("style").addClass("fancybox-tmp"), s.trigger("onUpdate")), s.update())
            },
            hideLoading: function() {
                r.unbind(".loading"), i("#fancybox-loading").remove()
            },
            showLoading: function() {
                var e, t;
                s.hideLoading(), e = i('<div id="fancybox-loading"><div></div></div>').click(s.cancel).appendTo("body"), r.bind("keydown.loading", function(e) {
                    27 === (e.which || e.keyCode) && (e.preventDefault(), s.cancel())
                }), s.defaults.fixed || (t = s.getViewport(), e.css({
                    position: "absolute",
                    top: .5 * t.h + t.y,
                    left: .5 * t.w + t.x
                }))
            },
            getViewport: function() {
                var t = s.current && s.current.locked || !1,
                    i = {
                        x: a.scrollLeft(),
                        y: a.scrollTop()
                    };
                return t ? (i.w = t[0].clientWidth, i.h = t[0].clientHeight) : (i.w = d && e.innerWidth ? e.innerWidth : a.width(), i.h = d && e.innerHeight ? e.innerHeight : a.height()), i
            },
            unbindEvents: function() {
                s.wrap && u(s.wrap) && s.wrap.unbind(".fb"), r.unbind(".fb"), a.unbind(".fb")
            },
            bindEvents: function() {
                var e, t = s.current;
                t && (a.bind("orientationchange.fb" + (d ? "" : " resize.fb") + (t.autoCenter && !t.locked ? " scroll.fb" : ""), s.update), e = t.keys, e && r.bind("keydown.fb", function(o) {
                    var a = o.which || o.keyCode,
                        r = o.target || o.srcElement;
                    return 27 === a && s.coming ? !1 : void(o.ctrlKey || o.altKey || o.shiftKey || o.metaKey || r && (r.type || i(r).is("[contenteditable]")) || i.each(e, function(e, r) {
                        return t.group.length > 1 && r[a] !== n ? (s[e](r[a]), o.preventDefault(), !1) : i.inArray(a, r) > -1 ? (s[e](), o.preventDefault(), !1) : void 0
                    }))
                }), i.fn.mousewheel && t.mouseWheel && s.wrap.bind("mousewheel.fb", function(e, n, o, a) {
                    for (var r = e.target || null, l = i(r), p = !1; l.length && !(p || l.is(".fancybox-skin") || l.is(".fancybox-wrap"));) p = h(l[0]), l = i(l).parent();
                    0 === n || p || s.group.length > 1 && !t.canShrink && (a > 0 || o > 0 ? s.prev(a > 0 ? "down" : "left") : (0 > a || 0 > o) && s.next(0 > a ? "up" : "right"), e.preventDefault())
                }))
            },
            trigger: function(e, t) {
                var n, o = t || s.coming || s.current;
                if (o) {
                    if (i.isFunction(o[e]) && (n = o[e].apply(o, Array.prototype.slice.call(arguments, 1))), n === !1) return !1;
                    o.helpers && i.each(o.helpers, function(t, n) {
                        n && s.helpers[t] && i.isFunction(s.helpers[t][e]) && s.helpers[t][e](i.extend(!0, {}, s.helpers[t].defaults, n), o)
                    }), r.trigger(e)
                }
            },
            isImage: function(e) {
                return c(e) && e.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i)
            },
            isSWF: function(e) {
                return c(e) && e.match(/\.(swf)((\?|#).*)?$/i)
            },
            _start: function(e) {
                var t, n, o, a, r, l = {};
                if (e = m(e), t = s.group[e] || null, !t) return !1;
                if (l = i.extend(!0, {}, s.opts, t), a = l.margin, r = l.padding, "number" === i.type(a) && (l.margin = [a, a, a, a]), "number" === i.type(r) && (l.padding = [r, r, r, r]), l.modal && i.extend(!0, l, {
                        closeBtn: !1,
                        closeClick: !1,
                        nextClick: !1,
                        arrows: !1,
                        mouseWheel: !1,
                        keys: null,
                        helpers: {
                            overlay: {
                                closeClick: !1
                            }
                        }
                    }), l.autoSize && (l.autoWidth = l.autoHeight = !0), "auto" === l.width && (l.autoWidth = !0), "auto" === l.height && (l.autoHeight = !0), l.group = s.group, l.index = e, s.coming = l, !1 === s.trigger("beforeLoad")) return void(s.coming = null);
                if (o = l.type, n = l.href, !o) return s.coming = null, s.current && s.router && "jumpto" !== s.router ? (s.current.index = e, s[s.router](s.direction)) : !1;
                if (s.isActive = !0, "image" !== o && "swf" !== o || (l.autoHeight = l.autoWidth = !1, l.scrolling = "visible"), "image" === o && (l.aspectRatio = !0), "iframe" === o && d && (l.scrolling = "scroll"), l.wrap = i(l.tpl.wrap).addClass("fancybox-" + (d ? "mobile" : "desktop") + " fancybox-type-" + o + " fancybox-tmp " + l.wrapCSS).appendTo(l.parent || "body"), i.extend(l, {
                        skin: i(".fancybox-skin", l.wrap),
                        outer: i(".fancybox-outer", l.wrap),
                        inner: i(".fancybox-inner", l.wrap)
                    }), i.each(["Top", "Right", "Bottom", "Left"], function(e, t) {
                        l.skin.css("padding" + t, g(l.padding[e]))
                    }), s.trigger("onReady"), "inline" === o || "html" === o) {
                    if (!l.content || !l.content.length) return s._error("content")
                } else if (!n) return s._error("href");
                "image" === o ? s._loadImage() : "ajax" === o ? s._loadAjax() : "iframe" === o ? s._loadIframe() : s._afterLoad()
            },
            _error: function(e) {
                i.extend(s.coming, {
                    type: "html",
                    autoWidth: !0,
                    autoHeight: !0,
                    minWidth: 0,
                    minHeight: 0,
                    scrolling: "no",
                    hasError: e,
                    content: s.coming.tpl.error
                }), s._afterLoad()
            },
            _loadImage: function() {
                var e = s.imgPreload = new Image;
                e.onload = function() {
                    this.onload = this.onerror = null, s.coming.width = this.width / s.opts.pixelRatio, s.coming.height = this.height / s.opts.pixelRatio, s._afterLoad()
                }, e.onerror = function() {
                    this.onload = this.onerror = null, s._error("image")
                }, e.src = s.coming.href, e.complete !== !0 && s.showLoading()
            },
            _loadAjax: function() {
                var e = s.coming;
                s.showLoading(), s.ajaxLoad = i.ajax(i.extend({}, e.ajax, {
                    url: e.href,
                    error: function(e, t) {
                        s.coming && "abort" !== t ? s._error("ajax", e) : s.hideLoading()
                    },
                    success: function(t, i) {
                        "success" === i && (e.content = t, s._afterLoad())
                    }
                }))
            },
            _loadIframe: function() {
                var e = s.coming,
                    t = i(e.tpl.iframe.replace(/\{rnd\}/g, (new Date).getTime())).attr("scrolling", d ? "auto" : e.iframe.scrolling).attr("src", e.href);
                i(e.wrap).bind("onReset", function() {
                    try {
                        i(this).find("iframe").hide().attr("src", "//about:blank").end().empty()
                    } catch (e) {}
                }), e.iframe.preload && (s.showLoading(), t.one("load", function() {
                    i(this).data("ready", 1), d || i(this).bind("load.fb", s.update), i(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show(), s._afterLoad()
                })), e.content = t.appendTo(e.inner), e.iframe.preload || s._afterLoad()
            },
            _preloadImages: function() {
                var e, t, i = s.group,
                    n = s.current,
                    o = i.length,
                    a = n.preload ? Math.min(n.preload, o - 1) : 0;
                for (t = 1; a >= t; t += 1) e = i[(n.index + t) % o], "image" === e.type && e.href && ((new Image).src = e.href)
            },
            _afterLoad: function() {
                var e, t, n, o, a, r, l = s.coming,
                    p = s.current,
                    d = "fancybox-placeholder";
                if (s.hideLoading(), l && s.isActive !== !1) {
                    if (!1 === s.trigger("afterLoad", l, p)) return l.wrap.stop(!0).trigger("onReset").remove(), void(s.coming = null);
                    switch (p && (s.trigger("beforeChange", p), p.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove()), s.unbindEvents(), e = l, t = l.content, n = l.type, o = l.scrolling, i.extend(s, {
                        wrap: e.wrap,
                        skin: e.skin,
                        outer: e.outer,
                        inner: e.inner,
                        current: e,
                        previous: p
                    }), a = e.href, n) {
                        case "inline":
                        case "ajax":
                        case "html":
                            e.selector ? t = i("<div>").html(t).find(e.selector) : u(t) && (t.data(d) || t.data(d, i('<div class="' + d + '"></div>').insertAfter(t).hide()), t = t.show().detach(), e.wrap.bind("onReset", function() {
                                i(this).find(t).length && t.hide().replaceAll(t.data(d)).data(d, !1)
                            }));
                            break;
                        case "image":
                            t = e.tpl.image.replace("{href}", a);
                            break;
                        case "swf":
                            t = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + a + '"></param>', r = "", i.each(e.swf, function(e, i) {
                                t += '<param name="' + e + '" value="' + i + '"></param>', r += " " + e + '="' + i + '"'
                            }), t += '<embed src="' + a + '" type="application/x-shockwave-flash" width="100%" height="100%"' + r + "></embed></object>"
                    }
                    u(t) && t.parent().is(e.inner) || e.inner.append(t), s.trigger("beforeShow"), e.inner.css("overflow", "yes" === o ? "scroll" : "no" === o ? "hidden" : o), s._setDimension(), s.reposition(), s.isOpen = !1, s.coming = null, s.bindEvents(), s.isOpened ? p.prevMethod && s.transitions[p.prevMethod]() : i(".fancybox-wrap").not(e.wrap).stop(!0).trigger("onReset").remove(), s.transitions[s.isOpened ? e.nextMethod : e.openMethod](), s._preloadImages()
                }
            },
            _setDimension: function() {
                var e, t, n, o, a, r, l, p, d, u, c, h, v, y, w, b = s.getViewport(),
                    x = 0,
                    S = !1,
                    T = !1,
                    C = s.wrap,
                    P = s.skin,
                    I = s.inner,
                    E = s.current,
                    k = E.width,
                    z = E.height,
                    M = E.minWidth,
                    L = E.minHeight,
                    A = E.maxWidth,
                    _ = E.maxHeight,
                    O = E.scrolling,
                    D = E.scrollOutside ? E.scrollbarWidth : 0,
                    H = E.margin,
                    N = m(H[1] + H[3]),
                    W = m(H[0] + H[2]);
                if (C.add(P).add(I).width("auto").height("auto").removeClass("fancybox-tmp"), e = m(P.outerWidth(!0) - P.width()), t = m(P.outerHeight(!0) - P.height()), n = N + e, o = W + t, a = f(k) ? (b.w - n) * m(k) / 100 : k, r = f(z) ? (b.h - o) * m(z) / 100 : z, "iframe" === E.type) {
                    if (y = E.content, E.autoHeight && 1 === y.data("ready")) try {
                        y[0].contentWindow.document.location && (I.width(a).height(9999), w = y.contents().find("body"), D && w.css("overflow-x", "hidden"), r = w.outerHeight(!0))
                    } catch (R) {}
                } else(E.autoWidth || E.autoHeight) && (I.addClass("fancybox-tmp"), E.autoWidth || I.width(a), E.autoHeight || I.height(r), E.autoWidth && (a = I.width()), E.autoHeight && (r = I.height()), I.removeClass("fancybox-tmp"));
                if (k = m(a), z = m(r), d = a / r, M = m(f(M) ? m(M, "w") - n : M), A = m(f(A) ? m(A, "w") - n : A), L = m(f(L) ? m(L, "h") - o : L), _ = m(f(_) ? m(_, "h") - o : _), l = A, p = _, E.fitToView && (A = Math.min(b.w - n, A), _ = Math.min(b.h - o, _)), h = b.w - N, v = b.h - W, E.aspectRatio ? (k > A && (k = A, z = m(k / d)), z > _ && (z = _, k = m(z * d)), M > k && (k = M, z = m(k / d)), L > z && (z = L, k = m(z * d))) : (k = Math.max(M, Math.min(k, A)), E.autoHeight && "iframe" !== E.type && (I.width(k), z = I.height()), z = Math.max(L, Math.min(z, _))), E.fitToView)
                    if (I.width(k).height(z), C.width(k + e), u = C.width(), c = C.height(), E.aspectRatio)
                        for (;
                            (u > h || c > v) && k > M && z > L && !(x++ > 19);) z = Math.max(L, Math.min(_, z - 10)), k = m(z * d), M > k && (k = M, z = m(k / d)), k > A && (k = A, z = m(k / d)), I.width(k).height(z), C.width(k + e), u = C.width(), c = C.height();
                    else k = Math.max(M, Math.min(k, k - (u - h))), z = Math.max(L, Math.min(z, z - (c - v)));
                D && "auto" === O && r > z && h > k + e + D && (k += D), I.width(k).height(z), C.width(k + e), u = C.width(), c = C.height(), S = (u > h || c > v) && k > M && z > L, T = E.aspectRatio ? l > k && p > z && a > k && r > z : (l > k || p > z) && (a > k || r > z), i.extend(E, {
                    dim: {
                        width: g(u),
                        height: g(c)
                    },
                    origWidth: a,
                    origHeight: r,
                    canShrink: S,
                    canExpand: T,
                    wPadding: e,
                    hPadding: t,
                    wrapSpace: c - P.outerHeight(!0),
                    skinSpace: P.height() - z
                }), !y && E.autoHeight && z > L && _ > z && !T && I.height("auto")
            },
            _getPosition: function(e) {
                var t = s.current,
                    i = s.getViewport(),
                    n = t.margin,
                    o = s.wrap.width() + n[1] + n[3],
                    a = s.wrap.height() + n[0] + n[2],
                    r = {
                        position: "absolute",
                        top: n[0],
                        left: n[3]
                    };
                return t.autoCenter && t.fixed && !e && a <= i.h && o <= i.w ? r.position = "fixed" : t.locked || (r.top += i.y, r.left += i.x), r.top = g(Math.max(r.top, r.top + (i.h - a) * t.topRatio)), r.left = g(Math.max(r.left, r.left + (i.w - o) * t.leftRatio)), r
            },
            _afterZoomIn: function() {
                var e = s.current;
                e && (s.isOpen = s.isOpened = !0, s.wrap.css("overflow", "visible").addClass("fancybox-opened"), s.update(), (e.closeClick || e.nextClick && s.group.length > 1) && s.inner.css("cursor", "pointer").bind("click.fb", function(t) {
                    i(t.target).is("a") || i(t.target).parent().is("a") || (t.preventDefault(), s[e.closeClick ? "close" : "next"]())
                }), e.closeBtn && i(e.tpl.closeBtn).appendTo(s.skin).bind("click.fb", function(e) {
                    e.preventDefault(), s.close()
                }), e.arrows && s.group.length > 1 && ((e.loop || e.index > 0) && i(e.tpl.prev).appendTo(s.outer).bind("click.fb", s.prev), (e.loop || e.index < s.group.length - 1) && i(e.tpl.next).appendTo(s.outer).bind("click.fb", s.next)), s.trigger("afterShow"), e.loop || e.index !== e.group.length - 1 ? s.opts.autoPlay && !s.player.isActive && (s.opts.autoPlay = !1, s.play()) : s.play(!1))
            },
            _afterZoomOut: function(e) {
                e = e || s.current, i(".fancybox-wrap").trigger("onReset").remove(), i.extend(s, {
                    group: {},
                    opts: {},
                    router: !1,
                    current: null,
                    isActive: !1,
                    isOpened: !1,
                    isOpen: !1,
                    isClosing: !1,
                    wrap: null,
                    skin: null,
                    outer: null,
                    inner: null
                }), s.trigger("afterClose", e)
            }
        }), s.transitions = {
            getOrigPosition: function() {
                var e = s.current,
                    t = e.element,
                    i = e.orig,
                    n = {},
                    o = 50,
                    a = 50,
                    r = e.hPadding,
                    l = e.wPadding,
                    p = s.getViewport();
                return !i && e.isDom && t.is(":visible") && (i = t.find("img:first"), i.length || (i = t)), u(i) ? (n = i.offset(), i.is("img") && (o = i.outerWidth(), a = i.outerHeight())) : (n.top = p.y + (p.h - a) * e.topRatio, n.left = p.x + (p.w - o) * e.leftRatio), ("fixed" === s.wrap.css("position") || e.locked) && (n.top -= p.y, n.left -= p.x), n = {
                    top: g(n.top - r * e.topRatio),
                    left: g(n.left - l * e.leftRatio),
                    width: g(o + l),
                    height: g(a + r)
                }
            },
            step: function(e, t) {
                var i, n, o, a = t.prop,
                    r = s.current,
                    l = r.wrapSpace,
                    p = r.skinSpace;
                "width" !== a && "height" !== a || (i = t.end === t.start ? 1 : (e - t.start) / (t.end - t.start), s.isClosing && (i = 1 - i), n = "width" === a ? r.wPadding : r.hPadding, o = e - n, s.skin[a](m("width" === a ? o : o - l * i)), s.inner[a](m("width" === a ? o : o - l * i - p * i)))
            },
            zoomIn: function() {
                var e = s.current,
                    t = e.pos,
                    n = e.openEffect,
                    o = "elastic" === n,
                    a = i.extend({
                        opacity: 1
                    }, t);
                delete a.position, o ? (t = this.getOrigPosition(), e.openOpacity && (t.opacity = .1)) : "fade" === n && (t.opacity = .1), s.wrap.css(t).animate(a, {
                    duration: "none" === n ? 0 : e.openSpeed,
                    easing: e.openEasing,
                    step: o ? this.step : null,
                    complete: s._afterZoomIn
                })
            },
            zoomOut: function() {
                var e = s.current,
                    t = e.closeEffect,
                    i = "elastic" === t,
                    n = {
                        opacity: .1
                    };
                i && (n = this.getOrigPosition(), e.closeOpacity && (n.opacity = .1)), s.wrap.animate(n, {
                    duration: "none" === t ? 0 : e.closeSpeed,
                    easing: e.closeEasing,
                    step: i ? this.step : null,
                    complete: s._afterZoomOut
                })
            },
            changeIn: function() {
                var e, t = s.current,
                    i = t.nextEffect,
                    n = t.pos,
                    o = {
                        opacity: 1
                    },
                    a = s.direction,
                    r = 200;
                n.opacity = .1, "elastic" === i && (e = "down" === a || "up" === a ? "top" : "left", "down" === a || "right" === a ? (n[e] = g(m(n[e]) - r), o[e] = "+=" + r + "px") : (n[e] = g(m(n[e]) + r), o[e] = "-=" + r + "px")), "none" === i ? s._afterZoomIn() : s.wrap.css(n).animate(o, {
                    duration: t.nextSpeed,
                    easing: t.nextEasing,
                    complete: s._afterZoomIn
                })
            },
            changeOut: function() {
                var e = s.previous,
                    t = e.prevEffect,
                    n = {
                        opacity: .1
                    },
                    o = s.direction,
                    a = 200;
                "elastic" === t && (n["down" === o || "up" === o ? "top" : "left"] = ("up" === o || "left" === o ? "-" : "+") + "=" + a + "px"), e.wrap.animate(n, {
                    duration: "none" === t ? 0 : e.prevSpeed,
                    easing: e.prevEasing,
                    complete: function() {
                        i(this).trigger("onReset").remove()
                    }
                })
            }
        }, s.helpers.overlay = {
            defaults: {
                closeClick: !0,
                speedOut: 200,
                showEarly: !0,
                css: {},
                locked: !d,
                fixed: !0
            },
            overlay: null,
            fixed: !1,
            el: i("html"),
            create: function(e) {
                e = i.extend({}, this.defaults, e), this.overlay && this.close(), this.overlay = i('<div class="fancybox-overlay"></div>').appendTo(s.coming ? s.coming.parent : e.parent), this.fixed = !1, e.fixed && s.defaults.fixed && (this.overlay.addClass("fancybox-overlay-fixed"), this.fixed = !0)
            },
            open: function(e) {
                var t = this;
                e = i.extend({}, this.defaults, e), this.overlay ? this.overlay.unbind(".overlay").width("auto").height("auto") : this.create(e), this.fixed || (a.bind("resize.overlay", i.proxy(this.update, this)), this.update()), e.closeClick && this.overlay.bind("click.overlay", function(e) {
                    return i(e.target).hasClass("fancybox-overlay") ? (s.isActive ? s.close() : t.close(), !1) : void 0
                }), this.overlay.css(e.css).show()
            },
            close: function() {
                var e, t;
                a.unbind("resize.overlay"), this.el.hasClass("fancybox-lock") && (i(".fancybox-margin").removeClass("fancybox-margin"), e = a.scrollTop(), t = a.scrollLeft(), this.el.removeClass("fancybox-lock"), a.scrollTop(e).scrollLeft(t)), i(".fancybox-overlay").remove().hide(), i.extend(this, {
                    overlay: null,
                    fixed: !1
                })
            },
            update: function() {
                var e, i = "100%";
                this.overlay.width(i).height("100%"), l ? (e = Math.max(t.documentElement.offsetWidth, t.body.offsetWidth), r.width() > e && (i = r.width())) : r.width() > a.width() && (i = r.width()), this.overlay.width(i).height(r.height())
            },
            onReady: function(e, t) {
                var n = this.overlay;
                i(".fancybox-overlay").stop(!0, !0), n || this.create(e), e.locked && this.fixed && t.fixed && (n || (this.margin = r.height() > a.height() ? i("html").css("margin-right").replace("px", "") : !1), t.locked = this.overlay.append(t.wrap), t.fixed = !1), e.showEarly === !0 && this.beforeShow.apply(this, arguments)
            },
            beforeShow: function(e, t) {
                var n, o;
                t.locked && (this.margin !== !1 && (i("*").filter(function() {
                    return "fixed" === i(this).css("position") && !i(this).hasClass("fancybox-overlay") && !i(this).hasClass("fancybox-wrap")
                }).addClass("fancybox-margin"), this.el.addClass("fancybox-margin")), n = a.scrollTop(), o = a.scrollLeft(), this.el.addClass("fancybox-lock"), a.scrollTop(n).scrollLeft(o)), this.open(e)
            },
            onUpdate: function() {
                this.fixed || this.update()
            },
            afterClose: function(e) {
                this.overlay && !s.coming && this.overlay.fadeOut(e.speedOut, i.proxy(this.close, this))
            }
        }, s.helpers.title = {
            defaults: {
                type: "float",
                position: "bottom"
            },
            beforeShow: function(e) {
                var t, n, o = s.current,
                    a = o.title,
                    r = e.type;
                if (i.isFunction(a) && (a = a.call(o.element, o)), c(a) && "" !== i.trim(a)) {
                    switch (t = i('<div class="fancybox-title fancybox-title-' + r + '-wrap">' + a + "</div>"), r) {
                        case "inside":
                            n = s.skin;
                            break;
                        case "outside":
                            n = s.wrap;
                            break;
                        case "over":
                            n = s.inner;
                            break;
                        default:
                            n = s.skin, t.appendTo("body"), l && t.width(t.width()), t.wrapInner('<span class="child"></span>'), s.current.margin[2] += Math.abs(m(t.css("margin-bottom")))
                    }
                    t["top" === e.position ? "prependTo" : "appendTo"](n)
                }
            }
        }, i.fn.fancybox = function(e) {
            var t, n = i(this),
                o = this.selector || "",
                a = function(a) {
                    var r, l, p = i(this).blur(),
                        d = t;
                    a.ctrlKey || a.altKey || a.shiftKey || a.metaKey || p.is(".fancybox-wrap") || (r = e.groupAttr || "data-fancybox-group", l = p.attr(r), l || (r = "rel", l = p.get(0)[r]), l && "" !== l && "nofollow" !== l && (p = o.length ? i(o) : n, p = p.filter("[" + r + '="' + l + '"]'), d = p.index(this)), e.index = d, s.open(p, e) !== !1 && a.preventDefault())
                };
            return e = e || {}, t = e.index || 0, o && e.live !== !1 ? r.undelegate(o, "click.fb-start").delegate(o + ":not('.fancybox-item, .fancybox-nav')", "click.fb-start", a) : n.unbind("click.fb-start").bind("click.fb-start", a), this.filter("[data-fancybox-start=1]").trigger("click"), this
        }, r.ready(function() {
            var t, a;
            i.scrollbarWidth === n && (i.scrollbarWidth = function() {
                var e = i('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),
                    t = e.children(),
                    n = t.innerWidth() - t.height(99).innerWidth();
                return e.remove(), n
            }), i.support.fixedPosition === n && (i.support.fixedPosition = function() {
                var e = i('<div style="position:fixed;top:20px;"></div>').appendTo("body"),
                    t = 20 === e[0].offsetTop || 15 === e[0].offsetTop;
                return e.remove(), t
            }()), i.extend(s.defaults, {
                scrollbarWidth: i.scrollbarWidth(),
                fixed: i.support.fixedPosition,
                parent: i("body")
            }), t = i(e).width(), o.addClass("fancybox-lock-test"), a = i(e).width(), o.removeClass("fancybox-lock-test"), i("<style type='text/css'>.fancybox-margin{margin-right:" + (a - t) + "px;}</style>").appendTo("head")
        })
    }(window, document, jQuery), ! function(e) {
        var t = !0;
        e.flexslider = function(i, n) {
            var o = e(i);
            o.vars = e.extend({}, e.flexslider.defaults, n);
            var a, r = o.vars.namespace,
                s = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
                l = ("ontouchstart" in window || s || window.DocumentTouch && document instanceof DocumentTouch) && o.vars.touch,
                p = "click touchend MSPointerUp keyup",
                d = "",
                u = "vertical" === o.vars.direction,
                c = o.vars.reverse,
                f = o.vars.itemWidth > 0,
                h = "fade" === o.vars.animation,
                m = "" !== o.vars.asNavFor,
                g = {};
            e.data(i, "flexslider", o), g = {
                init: function() {
                    o.animating = !1, o.currentSlide = parseInt(o.vars.startAt ? o.vars.startAt : 0, 10), isNaN(o.currentSlide) && (o.currentSlide = 0), o.animatingTo = o.currentSlide, o.atEnd = 0 === o.currentSlide || o.currentSlide === o.last, o.containerSelector = o.vars.selector.substr(0, o.vars.selector.search(" ")), o.slides = e(o.vars.selector, o), o.container = e(o.containerSelector, o), o.count = o.slides.length, o.syncExists = e(o.vars.sync).length > 0, "slide" === o.vars.animation && (o.vars.animation = "swing"), o.prop = u ? "top" : "marginLeft", o.args = {}, o.manualPause = !1, o.stopped = !1, o.started = !1, o.startTimeout = null, o.transitions = !o.vars.video && !h && o.vars.useCSS && function() {
                        var e = document.createElement("div"),
                            t = ["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
                        for (var i in t)
                            if (void 0 !== e.style[t[i]]) return o.pfx = t[i].replace("Perspective", "").toLowerCase(), o.prop = "-" + o.pfx + "-transform", !0;
                        return !1
                    }(), o.ensureAnimationEnd = "", "" !== o.vars.controlsContainer && (o.controlsContainer = e(o.vars.controlsContainer).length > 0 && e(o.vars.controlsContainer)), "" !== o.vars.manualControls && (o.manualControls = e(o.vars.manualControls).length > 0 && e(o.vars.manualControls)), "" !== o.vars.customDirectionNav && (o.customDirectionNav = 2 === e(o.vars.customDirectionNav).length && e(o.vars.customDirectionNav)), o.vars.randomize && (o.slides.sort(function() {
                        return Math.round(Math.random()) - .5
                    }), o.container.empty().append(o.slides)), o.doMath(), o.setup("init"), o.vars.controlNav && g.controlNav.setup(), o.vars.directionNav && g.directionNav.setup(), o.vars.keyboard && (1 === e(o.containerSelector).length || o.vars.multipleKeyboard) && e(document).bind("keyup", function(e) {
                        var t = e.keyCode;
                        if (!o.animating && (39 === t || 37 === t)) {
                            var i = 39 === t ? o.getTarget("next") : 37 === t ? o.getTarget("prev") : !1;
                            o.flexAnimate(i, o.vars.pauseOnAction)
                        }
                    }), o.vars.mousewheel && o.bind("mousewheel", function(e, t, i, n) {
                        e.preventDefault();
                        var a = 0 > t ? o.getTarget("next") : o.getTarget("prev");
                        o.flexAnimate(a, o.vars.pauseOnAction)
                    }), o.vars.pausePlay && g.pausePlay.setup(), o.vars.slideshow && o.vars.pauseInvisible && g.pauseInvisible.init(), o.vars.slideshow && (o.vars.pauseOnHover && o.hover(function() {
                        o.manualPlay || o.manualPause || o.pause()
                    }, function() {
                        o.manualPause || o.manualPlay || o.stopped || o.play()
                    }), o.vars.pauseInvisible && g.pauseInvisible.isHidden() || (o.vars.initDelay > 0 ? o.startTimeout = setTimeout(o.play, o.vars.initDelay) : o.play())), m && g.asNav.setup(), l && o.vars.touch && g.touch(), (!h || h && o.vars.smoothHeight) && e(window).bind("resize orientationchange focus", g.resize), o.find("img").attr("draggable", "false"), setTimeout(function() {
                        o.vars.start(o)
                    }, 200)
                },
                asNav: {
                    setup: function() {
                        o.asNav = !0, o.animatingTo = Math.floor(o.currentSlide / o.move), o.currentItem = o.currentSlide, o.slides.removeClass(r + "active-slide").eq(o.currentItem).addClass(r + "active-slide"), s ? (i._slider = o, o.slides.each(function() {
                            var t = this;
                            t._gesture = new MSGesture, t._gesture.target = t, t.addEventListener("MSPointerDown", function(e) {
                                e.preventDefault(), e.currentTarget._gesture && e.currentTarget._gesture.addPointer(e.pointerId)
                            }, !1), t.addEventListener("MSGestureTap", function(t) {
                                t.preventDefault();
                                var i = e(this),
                                    n = i.index();
                                e(o.vars.asNavFor).data("flexslider").animating || i.hasClass("active") || (o.direction = o.currentItem < n ? "next" : "prev", o.flexAnimate(n, o.vars.pauseOnAction, !1, !0, !0))
                            })
                        })) : o.slides.on(p, function(t) {
                            t.preventDefault();
                            var i = e(this),
                                n = i.index(),
                                a = i.offset().left - e(o).scrollLeft();
                            0 >= a && i.hasClass(r + "active-slide") ? o.flexAnimate(o.getTarget("prev"), !0) : e(o.vars.asNavFor).data("flexslider").animating || i.hasClass(r + "active-slide") || (o.direction = o.currentItem < n ? "next" : "prev", o.flexAnimate(n, o.vars.pauseOnAction, !1, !0, !0))
                        })
                    }
                },
                controlNav: {
                    setup: function() {
                        o.manualControls ? g.controlNav.setupManual() : g.controlNav.setupPaging()
                    },
                    setupPaging: function() {
                        var t, i, n = "thumbnails" === o.vars.controlNav ? "control-thumbs" : "control-paging",
                            a = 1;
                        if (o.controlNavScaffold = e('<ol class="' + r + "control-nav " + r + n + '"></ol>'), o.pagingCount > 1)
                            for (var s = 0; s < o.pagingCount; s++) {
                                if (i = o.slides.eq(s), void 0 === i.attr("data-thumb-alt") && i.attr("data-thumb-alt", ""), altText = "" !== i.attr("data-thumb-alt") ? altText = ' alt="' + i.attr("data-thumb-alt") + '"' : "", t = "thumbnails" === o.vars.controlNav ? '<img src="' + i.attr("data-thumb") + '"' + altText + "/>" : '<a href="#">' + a + "</a>", "thumbnails" === o.vars.controlNav && !0 === o.vars.thumbCaptions) {
                                    var l = i.attr("data-thumbcaption");
                                    "" !== l && void 0 !== l && (t += '<span class="' + r + 'caption">' + l + "</span>")
                                }
                                o.controlNavScaffold.append("<li>" + t + "</li>"), a++
                            }
                        o.controlsContainer ? e(o.controlsContainer).append(o.controlNavScaffold) : o.append(o.controlNavScaffold), g.controlNav.set(), g.controlNav.active(), o.controlNavScaffold.delegate("a, img", p, function(t) {
                            if (t.preventDefault(), "" === d || d === t.type) {
                                var i = e(this),
                                    n = o.controlNav.index(i);
                                i.hasClass(r + "active") || (o.direction = n > o.currentSlide ? "next" : "prev", o.flexAnimate(n, o.vars.pauseOnAction))
                            }
                            "" === d && (d = t.type), g.setToClearWatchedEvent()
                        })
                    },
                    setupManual: function() {
                        o.controlNav = o.manualControls, g.controlNav.active(), o.controlNav.bind(p, function(t) {
                            if (t.preventDefault(), "" === d || d === t.type) {
                                var i = e(this),
                                    n = o.controlNav.index(i);
                                i.hasClass(r + "active") || (n > o.currentSlide ? o.direction = "next" : o.direction = "prev", o.flexAnimate(n, o.vars.pauseOnAction))
                            }
                            "" === d && (d = t.type), g.setToClearWatchedEvent()
                        })
                    },
                    set: function() {
                        var t = "thumbnails" === o.vars.controlNav ? "img" : "a";
                        o.controlNav = e("." + r + "control-nav li " + t, o.controlsContainer ? o.controlsContainer : o)
                    },
                    active: function() {
                        o.controlNav.removeClass(r + "active").eq(o.animatingTo).addClass(r + "active")
                    },
                    update: function(t, i) {
                        o.pagingCount > 1 && "add" === t ? o.controlNavScaffold.append(e('<li><a href="#">' + o.count + "</a></li>")) : 1 === o.pagingCount ? o.controlNavScaffold.find("li").remove() : o.controlNav.eq(i).closest("li").remove(), g.controlNav.set(), o.pagingCount > 1 && o.pagingCount !== o.controlNav.length ? o.update(i, t) : g.controlNav.active()
                    }
                },
                directionNav: {
                    setup: function() {
                        var t = e('<ul class="' + r + 'direction-nav"><li class="' + r + 'nav-prev"><a class="' + r + 'prev" href="#">' + o.vars.prevText + '</a></li><li class="' + r + 'nav-next"><a class="' + r + 'next" href="#">' + o.vars.nextText + "</a></li></ul>");
                        o.customDirectionNav ? o.directionNav = o.customDirectionNav : o.controlsContainer ? (e(o.controlsContainer).append(t), o.directionNav = e("." + r + "direction-nav li a", o.controlsContainer)) : (o.append(t), o.directionNav = e("." + r + "direction-nav li a", o)), g.directionNav.update(), o.directionNav.bind(p, function(t) {
                            t.preventDefault();
                            var i;
                            ("" === d || d === t.type) && (i = e(this).hasClass(r + "next") ? o.getTarget("next") : o.getTarget("prev"), o.flexAnimate(i, o.vars.pauseOnAction)), "" === d && (d = t.type), g.setToClearWatchedEvent()
                        })
                    },
                    update: function() {
                        var e = r + "disabled";
                        1 === o.pagingCount ? o.directionNav.addClass(e).attr("tabindex", "-1") : o.vars.animationLoop ? o.directionNav.removeClass(e).removeAttr("tabindex") : 0 === o.animatingTo ? o.directionNav.removeClass(e).filter("." + r + "prev").addClass(e).attr("tabindex", "-1") : o.animatingTo === o.last ? o.directionNav.removeClass(e).filter("." + r + "next").addClass(e).attr("tabindex", "-1") : o.directionNav.removeClass(e).removeAttr("tabindex")
                    }
                },
                pausePlay: {
                    setup: function() {
                        var t = e('<div class="' + r + 'pauseplay"><a href="#"></a></div>');
                        o.controlsContainer ? (o.controlsContainer.append(t), o.pausePlay = e("." + r + "pauseplay a", o.controlsContainer)) : (o.append(t), o.pausePlay = e("." + r + "pauseplay a", o)), g.pausePlay.update(o.vars.slideshow ? r + "pause" : r + "play"), o.pausePlay.bind(p, function(t) {
                            t.preventDefault(), ("" === d || d === t.type) && (e(this).hasClass(r + "pause") ? (o.manualPause = !0, o.manualPlay = !1, o.pause()) : (o.manualPause = !1, o.manualPlay = !0, o.play())), "" === d && (d = t.type), g.setToClearWatchedEvent()
                        })
                    },
                    update: function(e) {
                        "play" === e ? o.pausePlay.removeClass(r + "pause").addClass(r + "play").html(o.vars.playText) : o.pausePlay.removeClass(r + "play").addClass(r + "pause").html(o.vars.pauseText)
                    }
                },
                touch: function() {
                    function e(e) {
                        e.stopPropagation(), o.animating ? e.preventDefault() : (o.pause(), i._gesture.addPointer(e.pointerId), S = 0, p = u ? o.h : o.w, m = Number(new Date), l = f && c && o.animatingTo === o.last ? 0 : f && c ? o.limit - (o.itemW + o.vars.itemMargin) * o.move * o.animatingTo : f && o.currentSlide === o.last ? o.limit : f ? (o.itemW + o.vars.itemMargin) * o.move * o.currentSlide : c ? (o.last - o.currentSlide + o.cloneOffset) * p : (o.currentSlide + o.cloneOffset) * p)
                    }

                    function t(e) {
                        e.stopPropagation();
                        var t = e.target._slider;
                        if (t) {
                            var n = -e.translationX,
                                o = -e.translationY;
                            return S += u ? o : n, d = S, w = u ? Math.abs(S) < Math.abs(-n) : Math.abs(S) < Math.abs(-o), e.detail === e.MSGESTURE_FLAG_INERTIA ? void setImmediate(function() {
                                i._gesture.stop()
                            }) : void((!w || Number(new Date) - m > 500) && (e.preventDefault(), !h && t.transitions && (t.vars.animationLoop || (d = S / (0 === t.currentSlide && 0 > S || t.currentSlide === t.last && S > 0 ? Math.abs(S) / p + 2 : 1)), t.setProps(l + d, "setTouch"))))
                        }
                    }

                    function n(e) {
                        e.stopPropagation();
                        var t = e.target._slider;
                        if (t) {
                            if (t.animatingTo === t.currentSlide && !w && null !== d) {
                                var i = c ? -d : d,
                                    n = i > 0 ? t.getTarget("next") : t.getTarget("prev");
                                t.canAdvance(n) && (Number(new Date) - m < 550 && Math.abs(i) > 50 || Math.abs(i) > p / 2) ? t.flexAnimate(n, t.vars.pauseOnAction) : h || t.flexAnimate(t.currentSlide, t.vars.pauseOnAction, !0)
                            }
                            a = null, r = null, d = null, l = null, S = 0
                        }
                    }
                    var a, r, l, p, d, m, g, v, y, w = !1,
                        b = 0,
                        x = 0,
                        S = 0;
                    s ? (i.style.msTouchAction = "none", i._gesture = new MSGesture, i._gesture.target = i, i.addEventListener("MSPointerDown", e, !1), i._slider = o, i.addEventListener("MSGestureChange", t, !1), i.addEventListener("MSGestureEnd", n, !1)) : (g = function(e) {
                        o.animating ? e.preventDefault() : (window.navigator.msPointerEnabled || 1 === e.touches.length) && (o.pause(), p = u ? o.h : o.w, m = Number(new Date), b = e.touches[0].pageX, x = e.touches[0].pageY, l = f && c && o.animatingTo === o.last ? 0 : f && c ? o.limit - (o.itemW + o.vars.itemMargin) * o.move * o.animatingTo : f && o.currentSlide === o.last ? o.limit : f ? (o.itemW + o.vars.itemMargin) * o.move * o.currentSlide : c ? (o.last - o.currentSlide + o.cloneOffset) * p : (o.currentSlide + o.cloneOffset) * p, a = u ? x : b, r = u ? b : x, i.addEventListener("touchmove", v, !1), i.addEventListener("touchend", y, !1))
                    }, v = function(e) {
                        b = e.touches[0].pageX, x = e.touches[0].pageY, d = u ? a - x : a - b, w = u ? Math.abs(d) < Math.abs(b - r) : Math.abs(d) < Math.abs(x - r);
                        var t = 500;
                        (!w || Number(new Date) - m > t) && (e.preventDefault(), !h && o.transitions && (o.vars.animationLoop || (d /= 0 === o.currentSlide && 0 > d || o.currentSlide === o.last && d > 0 ? Math.abs(d) / p + 2 : 1), o.setProps(l + d, "setTouch")))
                    }, y = function(e) {
                        if (i.removeEventListener("touchmove", v, !1), o.animatingTo === o.currentSlide && !w && null !== d) {
                            var t = c ? -d : d,
                                n = t > 0 ? o.getTarget("next") : o.getTarget("prev");
                            o.canAdvance(n) && (Number(new Date) - m < 550 && Math.abs(t) > 50 || Math.abs(t) > p / 2) ? o.flexAnimate(n, o.vars.pauseOnAction) : h || o.flexAnimate(o.currentSlide, o.vars.pauseOnAction, !0)
                        }
                        i.removeEventListener("touchend", y, !1), a = null, r = null, d = null, l = null
                    }, i.addEventListener("touchstart", g, !1))
                },
                resize: function() {
                    !o.animating && o.is(":visible") && (f || o.doMath(), h ? g.smoothHeight() : f ? (o.slides.width(o.computedW), o.update(o.pagingCount), o.setProps()) : u ? (o.viewport.height(o.h), o.setProps(o.h, "setTotal")) : (o.vars.smoothHeight && g.smoothHeight(), o.newSlides.width(o.computedW), o.setProps(o.computedW, "setTotal")))
                },
                smoothHeight: function(e) {
                    if (!u || h) {
                        var t = h ? o : o.viewport;
                        e ? t.animate({
                            height: o.slides.eq(o.animatingTo).height()
                        }, e) : t.height(o.slides.eq(o.animatingTo).height())
                    }
                },
                sync: function(t) {
                    var i = e(o.vars.sync).data("flexslider"),
                        n = o.animatingTo;
                    switch (t) {
                        case "animate":
                            i.flexAnimate(n, o.vars.pauseOnAction, !1, !0);
                            break;
                        case "play":
                            i.playing || i.asNav || i.play();
                            break;
                        case "pause":
                            i.pause()
                    }
                },
                uniqueID: function(t) {
                    return t.filter("[id]").add(t.find("[id]")).each(function() {
                        var t = e(this);
                        t.attr("id", t.attr("id") + "_clone")
                    }), t
                },
                pauseInvisible: {
                    visProp: null,
                    init: function() {
                        var e = g.pauseInvisible.getHiddenProp();
                        if (e) {
                            var t = e.replace(/[H|h]idden/, "") + "visibilitychange";
                            document.addEventListener(t, function() {
                                g.pauseInvisible.isHidden() ? o.startTimeout ? clearTimeout(o.startTimeout) : o.pause() : o.started ? o.play() : o.vars.initDelay > 0 ? setTimeout(o.play, o.vars.initDelay) : o.play()
                            })
                        }
                    },
                    isHidden: function() {
                        var e = g.pauseInvisible.getHiddenProp();
                        return e ? document[e] : !1
                    },
                    getHiddenProp: function() {
                        var e = ["webkit", "moz", "ms", "o"];
                        if ("hidden" in document) return "hidden";
                        for (var t = 0; t < e.length; t++)
                            if (e[t] + "Hidden" in document) return e[t] + "Hidden";
                        return null
                    }
                },
                setToClearWatchedEvent: function() {
                    clearTimeout(a), a = setTimeout(function() {
                        d = ""
                    }, 3e3)
                }
            }, o.flexAnimate = function(t, i, n, a, s) {
                if (o.vars.animationLoop || t === o.currentSlide || (o.direction = t > o.currentSlide ? "next" : "prev"), m && 1 === o.pagingCount && (o.direction = o.currentItem < t ? "next" : "prev"), !o.animating && (o.canAdvance(t, s) || n) && o.is(":visible")) {
                    if (m && a) {
                        var p = e(o.vars.asNavFor).data("flexslider");
                        if (o.atEnd = 0 === t || t === o.count - 1, p.flexAnimate(t, !0, !1, !0, s), o.direction = o.currentItem < t ? "next" : "prev", p.direction = o.direction, Math.ceil((t + 1) / o.visible) - 1 === o.currentSlide || 0 === t) return o.currentItem = t, o.slides.removeClass(r + "active-slide").eq(t).addClass(r + "active-slide"), !1;
                        o.currentItem = t, o.slides.removeClass(r + "active-slide").eq(t).addClass(r + "active-slide"), t = Math.floor(t / o.visible)
                    }
                    if (o.animating = !0, o.animatingTo = t, i && o.pause(), o.vars.before(o), o.syncExists && !s && g.sync("animate"), o.vars.controlNav && g.controlNav.active(), f || o.slides.removeClass(r + "active-slide").eq(t).addClass(r + "active-slide"), o.atEnd = 0 === t || t === o.last, o.vars.directionNav && g.directionNav.update(), t === o.last && (o.vars.end(o), o.vars.animationLoop || o.pause()), h) l ? (o.slides.eq(o.currentSlide).css({
                        opacity: 0,
                        zIndex: 1
                    }), o.slides.eq(t).css({
                        opacity: 1,
                        zIndex: 2
                    }), o.wrapup(w)) : (o.slides.eq(o.currentSlide).css({
                        zIndex: 1
                    }).animate({
                        opacity: 0
                    }, o.vars.animationSpeed, o.vars.easing), o.slides.eq(t).css({
                        zIndex: 2
                    }).animate({
                        opacity: 1
                    }, o.vars.animationSpeed, o.vars.easing, o.wrapup));
                    else {
                        var d, v, y, w = u ? o.slides.filter(":first").height() : o.computedW;
                        f ? (d = o.vars.itemMargin, y = (o.itemW + d) * o.move * o.animatingTo, v = y > o.limit && 1 !== o.visible ? o.limit : y) : v = 0 === o.currentSlide && t === o.count - 1 && o.vars.animationLoop && "next" !== o.direction ? c ? (o.count + o.cloneOffset) * w : 0 : o.currentSlide === o.last && 0 === t && o.vars.animationLoop && "prev" !== o.direction ? c ? 0 : (o.count + 1) * w : c ? (o.count - 1 - t + o.cloneOffset) * w : (t + o.cloneOffset) * w, o.setProps(v, "", o.vars.animationSpeed), o.transitions ? (o.vars.animationLoop && o.atEnd || (o.animating = !1, o.currentSlide = o.animatingTo), o.container.unbind("webkitTransitionEnd transitionend"), o.container.bind("webkitTransitionEnd transitionend", function() {
                            clearTimeout(o.ensureAnimationEnd), o.wrapup(w)
                        }), clearTimeout(o.ensureAnimationEnd), o.ensureAnimationEnd = setTimeout(function() {
                            o.wrapup(w)
                        }, o.vars.animationSpeed + 100)) : o.container.animate(o.args, o.vars.animationSpeed, o.vars.easing, function() {
                            o.wrapup(w)
                        })
                    }
                    o.vars.smoothHeight && g.smoothHeight(o.vars.animationSpeed)
                }
            }, o.wrapup = function(e) {
                h || f || (0 === o.currentSlide && o.animatingTo === o.last && o.vars.animationLoop ? o.setProps(e, "jumpEnd") : o.currentSlide === o.last && 0 === o.animatingTo && o.vars.animationLoop && o.setProps(e, "jumpStart")), o.animating = !1, o.currentSlide = o.animatingTo, o.vars.after(o)
            }, o.animateSlides = function() {
                !o.animating && t && o.flexAnimate(o.getTarget("next"))
            }, o.pause = function() {
                clearInterval(o.animatedSlides), o.animatedSlides = null, o.playing = !1, o.vars.pausePlay && g.pausePlay.update("play"), o.syncExists && g.sync("pause")
            }, o.play = function() {
                o.playing && clearInterval(o.animatedSlides), o.animatedSlides = o.animatedSlides || setInterval(o.animateSlides, o.vars.slideshowSpeed), o.started = o.playing = !0, o.vars.pausePlay && g.pausePlay.update("pause"), o.syncExists && g.sync("play")
            }, o.stop = function() {
                o.pause(), o.stopped = !0
            }, o.canAdvance = function(e, t) {
                var i = m ? o.pagingCount - 1 : o.last;
                return t ? !0 : m && o.currentItem === o.count - 1 && 0 === e && "prev" === o.direction ? !0 : m && 0 === o.currentItem && e === o.pagingCount - 1 && "next" !== o.direction ? !1 : e !== o.currentSlide || m ? o.vars.animationLoop ? !0 : o.atEnd && 0 === o.currentSlide && e === i && "next" !== o.direction ? !1 : !o.atEnd || o.currentSlide !== i || 0 !== e || "next" !== o.direction : !1
            }, o.getTarget = function(e) {
                return o.direction = e, "next" === e ? o.currentSlide === o.last ? 0 : o.currentSlide + 1 : 0 === o.currentSlide ? o.last : o.currentSlide - 1
            }, o.setProps = function(e, t, i) {
                var n = function() {
                    var i = e ? e : (o.itemW + o.vars.itemMargin) * o.move * o.animatingTo,
                        n = function() {
                            if (f) return "setTouch" === t ? e : c && o.animatingTo === o.last ? 0 : c ? o.limit - (o.itemW + o.vars.itemMargin) * o.move * o.animatingTo : o.animatingTo === o.last ? o.limit : i;
                            switch (t) {
                                case "setTotal":
                                    return c ? (o.count - 1 - o.currentSlide + o.cloneOffset) * e : (o.currentSlide + o.cloneOffset) * e;
                                case "setTouch":
                                    return c ? e : e;
                                case "jumpEnd":
                                    return c ? e : o.count * e;
                                case "jumpStart":
                                    return c ? o.count * e : e;
                                default:
                                    return e
                            }
                        }();
                    return -1 * n + "px"
                }();
                o.transitions && (n = u ? "translate3d(0," + n + ",0)" : "translate3d(" + n + ",0,0)", i = void 0 !== i ? i / 1e3 + "s" : "0s", o.container.css("-" + o.pfx + "-transition-duration", i), o.container.css("transition-duration", i)), o.args[o.prop] = n, (o.transitions || void 0 === i) && o.container.css(o.args), o.container.css("transform", n)
            }, o.setup = function(t) {
                if (h) o.slides.css({
                    width: "100%",
                    "float": "left",
                    marginRight: "-100%",
                    position: "relative"
                }), "init" === t && (l ? o.slides.css({
                    opacity: 0,
                    display: "block",
                    webkitTransition: "opacity " + o.vars.animationSpeed / 1e3 + "s ease",
                    zIndex: 1
                }).eq(o.currentSlide).css({
                    opacity: 1,
                    zIndex: 2
                }) : 0 == o.vars.fadeFirstSlide ? o.slides.css({
                    opacity: 0,
                    display: "block",
                    zIndex: 1
                }).eq(o.currentSlide).css({
                    zIndex: 2
                }).css({
                    opacity: 1
                }) : o.slides.css({
                    opacity: 0,
                    display: "block",
                    zIndex: 1
                }).eq(o.currentSlide).css({
                    zIndex: 2
                }).animate({
                    opacity: 1
                }, o.vars.animationSpeed, o.vars.easing)), o.vars.smoothHeight && g.smoothHeight();
                else {
                    var i, n;
                    "init" === t && (o.viewport = e('<div class="' + r + 'viewport"></div>').css({
                        overflow: "hidden",
                        position: "relative"
                    }).appendTo(o).append(o.container), o.cloneCount = 0, o.cloneOffset = 0, c && (n = e.makeArray(o.slides).reverse(), o.slides = e(n), o.container.empty().append(o.slides))), o.vars.animationLoop && !f && (o.cloneCount = 2, o.cloneOffset = 1, "init" !== t && o.container.find(".clone").remove(), o.container.append(g.uniqueID(o.slides.first().clone().addClass("clone")).attr("aria-hidden", "true")).prepend(g.uniqueID(o.slides.last().clone().addClass("clone")).attr("aria-hidden", "true"))), o.newSlides = e(o.vars.selector, o), i = c ? o.count - 1 - o.currentSlide + o.cloneOffset : o.currentSlide + o.cloneOffset, u && !f ? (o.container.height(200 * (o.count + o.cloneCount) + "%").css("position", "absolute").width("100%"), setTimeout(function() {
                        o.newSlides.css({
                            display: "block"
                        }), o.doMath(), o.viewport.height(o.h), o.setProps(i * o.h, "init")
                    }, "init" === t ? 100 : 0)) : (o.container.width(200 * (o.count + o.cloneCount) + "%"), o.setProps(i * o.computedW, "init"), setTimeout(function() {
                        o.doMath(), o.newSlides.css({
                            width: o.computedW,
                            marginRight: o.computedM,
                            "float": "left",
                            display: "block"
                        }), o.vars.smoothHeight && g.smoothHeight()
                    }, "init" === t ? 100 : 0))
                }
                f || o.slides.removeClass(r + "active-slide").eq(o.currentSlide).addClass(r + "active-slide"), o.vars.init(o)
            }, o.doMath = function() {
                var e = o.slides.first(),
                    t = o.vars.itemMargin,
                    i = o.vars.minItems,
                    n = o.vars.maxItems;
                o.w = void 0 === o.viewport ? o.width() : o.viewport.width(), o.h = e.height(), o.boxPadding = e.outerWidth() - e.width(), f ? (o.itemT = o.vars.itemWidth + t, o.itemM = t, o.minW = i ? i * o.itemT : o.w, o.maxW = n ? n * o.itemT - t : o.w, o.itemW = o.minW > o.w ? (o.w - t * (i - 1)) / i : o.maxW < o.w ? (o.w - t * (n - 1)) / n : o.vars.itemWidth > o.w ? o.w : o.vars.itemWidth, o.visible = Math.floor(o.w / o.itemW), o.move = o.vars.move > 0 && o.vars.move < o.visible ? o.vars.move : o.visible, o.pagingCount = Math.ceil((o.count - o.visible) / o.move + 1), o.last = o.pagingCount - 1, o.limit = 1 === o.pagingCount ? 0 : o.vars.itemWidth > o.w ? o.itemW * (o.count - 1) + t * (o.count - 1) : (o.itemW + t) * o.count - o.w - t) : (o.itemW = o.w, o.itemM = t, o.pagingCount = o.count, o.last = o.count - 1), o.computedW = o.itemW - o.boxPadding, o.computedM = o.itemM
            }, o.update = function(e, t) {
                o.doMath(), f || (e < o.currentSlide ? o.currentSlide += 1 : e <= o.currentSlide && 0 !== e && (o.currentSlide -= 1), o.animatingTo = o.currentSlide), o.vars.controlNav && !o.manualControls && ("add" === t && !f || o.pagingCount > o.controlNav.length ? g.controlNav.update("add") : ("remove" === t && !f || o.pagingCount < o.controlNav.length) && (f && o.currentSlide > o.last && (o.currentSlide -= 1, o.animatingTo -= 1), g.controlNav.update("remove", o.last))), o.vars.directionNav && g.directionNav.update()
            }, o.addSlide = function(t, i) {
                var n = e(t);
                o.count += 1, o.last = o.count - 1, u && c ? void 0 !== i ? o.slides.eq(o.count - i).after(n) : o.container.prepend(n) : void 0 !== i ? o.slides.eq(i).before(n) : o.container.append(n), o.update(i, "add"), o.slides = e(o.vars.selector + ":not(.clone)", o), o.setup(), o.vars.added(o)
            }, o.removeSlide = function(t) {
                var i = isNaN(t) ? o.slides.index(e(t)) : t;
                o.count -= 1, o.last = o.count - 1, isNaN(t) ? e(t, o.slides).remove() : u && c ? o.slides.eq(o.last).remove() : o.slides.eq(t).remove(), o.doMath(), o.update(i, "remove"), o.slides = e(o.vars.selector + ":not(.clone)", o), o.setup(), o.vars.removed(o)
            }, g.init()
        }, e(window).blur(function(e) {
            t = !1
        }).focus(function(e) {
            t = !0
        }), e.flexslider.defaults = {
            namespace: "flex-",
            selector: ".slides > li",
            animation: "fade",
            easing: "swing",
            direction: "horizontal",
            reverse: !1,
            animationLoop: !0,
            smoothHeight: !1,
            startAt: 0,
            slideshow: !0,
            slideshowSpeed: 7e3,
            animationSpeed: 600,
            initDelay: 0,
            randomize: !1,
            fadeFirstSlide: !0,
            thumbCaptions: !1,
            pauseOnAction: !0,
            pauseOnHover: !1,
            pauseInvisible: !0,
            useCSS: !0,
            touch: !0,
            video: !1,
            controlNav: !0,
            directionNav: !0,
            prevText: "Previous",
            nextText: "Next",
            keyboard: !0,
            multipleKeyboard: !1,
            mousewheel: !1,
            pausePlay: !1,
            pauseText: "Pause",
            playText: "Play",
            controlsContainer: "",
            manualControls: "",
            customDirectionNav: "",
            sync: "",
            asNavFor: "",
            itemWidth: 0,
            itemMargin: 0,
            minItems: 1,
            maxItems: 0,
            move: 0,
            allowOneSlide: !0,
            start: function() {},
            before: function() {},
            after: function() {},
            end: function() {},
            added: function() {},
            removed: function() {},
            init: function() {}
        }, e.fn.flexslider = function(t) {
            if (void 0 === t && (t = {}), "object" == typeof t) return this.each(function() {
                var i = e(this),
                    n = t.selector ? t.selector : ".slides > li",
                    o = i.find(n);
                1 === o.length && t.allowOneSlide === !0 || 0 === o.length ? (o.fadeIn(400), t.start && t.start(i)) : void 0 === i.data("flexslider") && new e.flexslider(this, t)
            });
            var i = e(this).data("flexslider");
            switch (t) {
                case "play":
                    i.play();
                    break;
                case "pause":
                    i.pause();
                    break;
                case "stop":
                    i.stop();
                    break;
                case "next":
                    i.flexAnimate(i.getTarget("next"), !0);
                    break;
                case "prev":
                case "previous":
                    i.flexAnimate(i.getTarget("prev"), !0);
                    break;
                default:
                    "number" == typeof t && i.flexAnimate(t, !0)
            }
        }
    }(jQuery),
    function(e, t, i) {
        function n(t, i) {
            this.bodyOverflowX, this.callbacks = {
                hide: [],
                show: []
            }, this.checkInterval = null, this.Content, this.$el = e(t), this.$elProxy, this.elProxyPosition, this.enabled = !0, this.options = e.extend({}, l, i), this.mouseIsOverProxy = !1, this.namespace = "tooltipster-" + Math.round(1e5 * Math.random()), this.Status = "hidden", this.timerHide = null, this.timerShow = null, this.$tooltip, this.options.iconTheme = this.options.iconTheme.replace(".", ""), this.options.theme = this.options.theme.replace(".", ""), this._init()
        }

        function o(t, i) {
            var n = !0;
            return e.each(t, function(e, o) {
                return "undefined" == typeof i[e] || t[e] !== i[e] ? (n = !1, !1) : void 0
            }), n
        }

        function a() {
            return !d && p
        }

        function r() {
            var e = i.body || i.documentElement,
                t = e.style,
                n = "transition";
            if ("string" == typeof t[n]) return !0;
            v = ["Moz", "Webkit", "Khtml", "O", "ms"], n = n.charAt(0).toUpperCase() + n.substr(1);
            for (var o = 0; o < v.length; o++)
                if ("string" == typeof t[v[o] + n]) return !0;
            return !1
        }
        var s = "tooltipster",
            l = {
                animation: "fade",
                arrow: !0,
                arrowColor: "",
                autoClose: !0,
                content: null,
                contentAsHTML: !1,
                contentCloning: !0,
                debug: !0,
                delay: 200,
                minWidth: 0,
                maxWidth: null,
                functionInit: function(e, t) {},
                functionBefore: function(e, t) {
                    t()
                },
                functionReady: function(e, t) {},
                functionAfter: function(e) {},
                hideOnClick: !1,
                icon: "(?)",
                iconCloning: !0,
                iconDesktop: !1,
                iconTouch: !1,
                iconTheme: "tooltipster-icon",
                interactive: !1,
                interactiveTolerance: 350,
                multiple: !1,
                offsetX: 0,
                offsetY: 0,
                onlyOne: !1,
                position: "top",
                positionTracker: !1,
                positionTrackerCallback: function(e) {
                    "hover" == this.option("trigger") && this.option("autoClose") && this.hide()
                },
                restoration: "current",
                speed: 350,
                timer: 0,
                theme: "tooltipster-default",
                touchDevices: !0,
                trigger: "hover",
                updateAnimation: !0
            };
        n.prototype = {
            _init: function() {
                var t = this;
                if (i.querySelector) {
                    var n = null;
                    void 0 === t.$el.data("tooltipster-initialTitle") && (n = t.$el.attr("title"), void 0 === n && (n = null), t.$el.data("tooltipster-initialTitle", n)), null !== t.options.content ? t._content_set(t.options.content) : t._content_set(n);
                    var o = t.options.functionInit.call(t.$el, t.$el, t.Content);
                    "undefined" != typeof o && t._content_set(o), t.$el.removeAttr("title").addClass("tooltipstered"), !p && t.options.iconDesktop || p && t.options.iconTouch ? ("string" == typeof t.options.icon ? (t.$elProxy = e('<span class="' + t.options.iconTheme + '"></span>'), t.$elProxy.text(t.options.icon)) : t.options.iconCloning ? t.$elProxy = t.options.icon.clone(!0) : t.$elProxy = t.options.icon, t.$elProxy.insertAfter(t.$el)) : t.$elProxy = t.$el, "hover" == t.options.trigger ? (t.$elProxy.on("mouseenter." + t.namespace, function() {
                        a() && !t.options.touchDevices || (t.mouseIsOverProxy = !0, t._show())
                    }).on("mouseleave." + t.namespace, function() {
                        a() && !t.options.touchDevices || (t.mouseIsOverProxy = !1)
                    }), p && t.options.touchDevices && t.$elProxy.on("touchstart." + t.namespace, function() {
                        t._showNow()
                    })) : "click" == t.options.trigger && t.$elProxy.on("click." + t.namespace, function() {
                        a() && !t.options.touchDevices || t._show()
                    })
                }
            },
            _show: function() {
                var e = this;
                "shown" != e.Status && "appearing" != e.Status && (e.options.delay ? e.timerShow = setTimeout(function() {
                    ("click" == e.options.trigger || "hover" == e.options.trigger && e.mouseIsOverProxy) && e._showNow()
                }, e.options.delay) : e._showNow())
            },
            _showNow: function(i) {
                var n = this;
                n.options.functionBefore.call(n.$el, n.$el, function() {
                    if (n.enabled && null !== n.Content) {
                        i && n.callbacks.show.push(i), n.callbacks.hide = [], clearTimeout(n.timerShow), n.timerShow = null, clearTimeout(n.timerHide), n.timerHide = null, n.options.onlyOne && e(".tooltipstered").not(n.$el).each(function(t, i) {
                            var n = e(i),
                                o = n.data("tooltipster-ns");
                            e.each(o, function(e, t) {
                                var i = n.data(t),
                                    o = i.status(),
                                    a = i.option("autoClose");
                                "hidden" !== o && "disappearing" !== o && a && i.hide()
                            })
                        });
                        var o = function() {
                            n.Status = "shown", e.each(n.callbacks.show, function(e, t) {
                                t.call(n.$el)
                            }), n.callbacks.show = []
                        };
                        if ("hidden" !== n.Status) {
                            var a = 0;
                            "disappearing" === n.Status ? (n.Status = "appearing", r() ? (n.$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-" + n.options.animation + "-show"), n.options.speed > 0 && n.$tooltip.delay(n.options.speed), n.$tooltip.queue(o)) : n.$tooltip.stop().fadeIn(o)) : "shown" === n.Status && o()
                        } else {
                            n.Status = "appearing";
                            var a = n.options.speed;
                            n.bodyOverflowX = e("body").css("overflow-x"), e("body").css("overflow-x", "hidden");
                            var s = "tooltipster-" + n.options.animation,
                                l = "-webkit-transition-duration: " + n.options.speed + "ms; -webkit-animation-duration: " + n.options.speed + "ms; -moz-transition-duration: " + n.options.speed + "ms; -moz-animation-duration: " + n.options.speed + "ms; -o-transition-duration: " + n.options.speed + "ms; -o-animation-duration: " + n.options.speed + "ms; -ms-transition-duration: " + n.options.speed + "ms; -ms-animation-duration: " + n.options.speed + "ms; transition-duration: " + n.options.speed + "ms; animation-duration: " + n.options.speed + "ms;",
                                d = n.options.minWidth ? "min-width:" + Math.round(n.options.minWidth) + "px;" : "",
                                u = n.options.maxWidth ? "max-width:" + Math.round(n.options.maxWidth) + "px;" : "",
                                c = n.options.interactive ? "pointer-events: auto;" : "";
                            if (n.$tooltip = e('<div class="tooltipster-base ' + n.options.theme + '" style="' + d + " " + u + " " + c + " " + l + '"><div class="tooltipster-content"></div></div>'), r() && n.$tooltip.addClass(s), n._content_insert(), n.$tooltip.appendTo("body"), n.reposition(), n.options.functionReady.call(n.$el, n.$el, n.$tooltip), r() ? (n.$tooltip.addClass(s + "-show"), n.options.speed > 0 && n.$tooltip.delay(n.options.speed), n.$tooltip.queue(o)) : n.$tooltip.css("display", "none").fadeIn(n.options.speed, o), n._interval_set(), e(t).on("scroll." + n.namespace + " resize." + n.namespace, function() {
                                    n.reposition()
                                }), n.options.autoClose)
                                if (e("body").off("." + n.namespace), "hover" == n.options.trigger) {
                                    if (p && setTimeout(function() {
                                            e("body").on("touchstart." + n.namespace, function() {
                                                n.hide()
                                            })
                                        }, 0), n.options.interactive) {
                                        p && n.$tooltip.on("touchstart." + n.namespace, function(e) {
                                            e.stopPropagation()
                                        });
                                        var f = null;
                                        n.$elProxy.add(n.$tooltip).on("mouseleave." + n.namespace + "-autoClose", function() {
                                            clearTimeout(f), f = setTimeout(function() {
                                                n.hide()
                                            }, n.options.interactiveTolerance)
                                        }).on("mouseenter." + n.namespace + "-autoClose", function() {
                                            clearTimeout(f)
                                        })
                                    } else n.$elProxy.on("mouseleave." + n.namespace + "-autoClose", function() {
                                        n.hide()
                                    });
                                    n.options.hideOnClick && n.$elProxy.on("click." + n.namespace + "-autoClose", function() {
                                        n.hide()
                                    })
                                } else "click" == n.options.trigger && (setTimeout(function() {
                                    e("body").on("click." + n.namespace + " touchstart." + n.namespace, function() {
                                        n.hide()
                                    })
                                }, 0), n.options.interactive && n.$tooltip.on("click." + n.namespace + " touchstart." + n.namespace, function(e) {
                                    e.stopPropagation()
                                }))
                        }
                        n.options.timer > 0 && (n.timerHide = setTimeout(function() {
                            n.timerHide = null, n.hide()
                        }, n.options.timer + a))
                    }
                })
            },
            _interval_set: function() {
                var t = this;
                t.checkInterval = setInterval(function() {
                    if (0 === e("body").find(t.$el).length || 0 === e("body").find(t.$elProxy).length || "hidden" == t.Status || 0 === e("body").find(t.$tooltip).length) "shown" != t.Status && "appearing" != t.Status || t.hide(), t._interval_cancel();
                    else if (t.options.positionTracker) {
                        var i = t._repositionInfo(t.$elProxy),
                            n = !1;
                        o(i.dimension, t.elProxyPosition.dimension) && ("fixed" === t.$elProxy.css("position") ? o(i.position, t.elProxyPosition.position) && (n = !0) : o(i.offset, t.elProxyPosition.offset) && (n = !0)), n || (t.reposition(), t.options.positionTrackerCallback.call(t, t.$el))
                    }
                }, 200)
            },
            _interval_cancel: function() {
                clearInterval(this.checkInterval), this.checkInterval = null
            },
            _content_set: function(e) {
                "object" == typeof e && null !== e && this.options.contentCloning && (e = e.clone(!0)), this.Content = e
            },
            _content_insert: function() {
                var e = this,
                    t = this.$tooltip.find(".tooltipster-content");
                "string" != typeof e.Content || e.options.contentAsHTML ? t.empty().append(e.Content) : t.text(e.Content)
            },
            _update: function(e) {
                var t = this;
                t._content_set(e), null !== t.Content ? "hidden" !== t.Status && (t._content_insert(), t.reposition(), t.options.updateAnimation && (r() ? (t.$tooltip.css({
                    width: "",
                    "-webkit-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
                    "-moz-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
                    "-o-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
                    "-ms-transition": "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms",
                    transition: "all " + t.options.speed + "ms, width 0ms, height 0ms, left 0ms, top 0ms"
                }).addClass("tooltipster-content-changing"), setTimeout(function() {
                    "hidden" != t.Status && (t.$tooltip.removeClass("tooltipster-content-changing"), setTimeout(function() {
                        "hidden" !== t.Status && t.$tooltip.css({
                            "-webkit-transition": t.options.speed + "ms",
                            "-moz-transition": t.options.speed + "ms",
                            "-o-transition": t.options.speed + "ms",
                            "-ms-transition": t.options.speed + "ms",
                            transition: t.options.speed + "ms"
                        })
                    }, t.options.speed))
                }, t.options.speed)) : t.$tooltip.fadeTo(t.options.speed, .5, function() {
                    "hidden" != t.Status && t.$tooltip.fadeTo(t.options.speed, 1)
                }))) : t.hide()
            },
            _repositionInfo: function(e) {
                return {
                    dimension: {
                        height: e.outerHeight(!1),
                        width: e.outerWidth(!1)
                    },
                    offset: e.offset(),
                    position: {
                        left: parseInt(e.css("left")),
                        top: parseInt(e.css("top"))
                    }
                }
            },
            hide: function(i) {
                var n = this;
                i && n.callbacks.hide.push(i), n.callbacks.show = [], clearTimeout(n.timerShow), n.timerShow = null, clearTimeout(n.timerHide), n.timerHide = null;
                var o = function() {
                    e.each(n.callbacks.hide, function(e, t) {
                        t.call(n.$el)
                    }), n.callbacks.hide = []
                };
                if ("shown" == n.Status || "appearing" == n.Status) {
                    n.Status = "disappearing";
                    var a = function() {
                        n.Status = "hidden", "object" == typeof n.Content && null !== n.Content && n.Content.detach(), n.$tooltip.remove(), n.$tooltip = null, e(t).off("." + n.namespace), e("body").off("." + n.namespace).css("overflow-x", n.bodyOverflowX), e("body").off("." + n.namespace), n.$elProxy.off("." + n.namespace + "-autoClose"), n.options.functionAfter.call(n.$el, n.$el), o()
                    };
                    r() ? (n.$tooltip.clearQueue().removeClass("tooltipster-" + n.options.animation + "-show").addClass("tooltipster-dying"), n.options.speed > 0 && n.$tooltip.delay(n.options.speed), n.$tooltip.queue(a)) : n.$tooltip.stop().fadeOut(n.options.speed, a)
                } else "hidden" == n.Status && o();
                return n
            },
            show: function(e) {
                return this._showNow(e), this
            },
            update: function(e) {
                return this.content(e)
            },
            content: function(e) {
                return "undefined" == typeof e ? this.Content : (this._update(e), this)
            },
            reposition: function() {
                function i() {
                    var i = e(t).scrollLeft();
                    0 > k - i && (a = k - i, k = i), k + l - i > r && (a = k - (r + i - l), k = r + i - l)
                }

                function n(i, n) {
                    s.offset.top - e(t).scrollTop() - p - L - 12 < 0 && n.indexOf("top") > -1 && (_ = i), s.offset.top + s.dimension.height + p + 12 + L > e(t).scrollTop() + e(t).height() && n.indexOf("bottom") > -1 && (_ = i, M = s.offset.top - p - L - 12)
                }
                var o = this;
                if (0 !== e("body").find(o.$tooltip).length) {
                    o.$tooltip.css("width", ""), o.elProxyPosition = o._repositionInfo(o.$elProxy);
                    var a = null,
                        r = e(t).width(),
                        s = o.elProxyPosition,
                        l = o.$tooltip.outerWidth(!1),
                        p = (o.$tooltip.innerWidth() + 1, o.$tooltip.outerHeight(!1));
                    if (o.$elProxy.is("area")) {
                        var d = o.$elProxy.attr("shape"),
                            u = o.$elProxy.parent().attr("name"),
                            c = e('img[usemap="#' + u + '"]'),
                            f = c.offset().left,
                            h = c.offset().top,
                            m = void 0 !== o.$elProxy.attr("coords") ? o.$elProxy.attr("coords").split(",") : void 0;
                        if ("circle" == d) {
                            var g = parseInt(m[0]),
                                v = parseInt(m[1]),
                                y = parseInt(m[2]);
                            s.dimension.height = 2 * y, s.dimension.width = 2 * y, s.offset.top = h + v - y, s.offset.left = f + g - y
                        } else if ("rect" == d) {
                            var g = parseInt(m[0]),
                                v = parseInt(m[1]),
                                w = parseInt(m[2]),
                                b = parseInt(m[3]);
                            s.dimension.height = b - v, s.dimension.width = w - g, s.offset.top = h + v, s.offset.left = f + g
                        } else if ("poly" == d) {
                            for (var x = 0, S = 0, T = 0, C = 0, P = "even", I = 0; I < m.length; I++) {
                                var E = parseInt(m[I]);
                                "even" == P ? (E > T && (T = E, 0 === I && (x = T)), x > E && (x = E), P = "odd") : (E > C && (C = E, 1 == I && (S = C)), S > E && (S = E), P = "even")
                            }
                            s.dimension.height = C - S, s.dimension.width = T - x, s.offset.top = h + S, s.offset.left = f + x
                        } else s.dimension.height = c.outerHeight(!1), s.dimension.width = c.outerWidth(!1), s.offset.top = h, s.offset.left = f
                    }
                    var k = 0,
                        z = 0,
                        M = 0,
                        L = parseInt(o.options.offsetY),
                        A = parseInt(o.options.offsetX),
                        _ = o.options.position;
                    if ("top" == _) {
                        var O = s.offset.left + l - (s.offset.left + s.dimension.width);
                        k = s.offset.left + A - O / 2, M = s.offset.top - p - L - 12, i(), n("bottom", "top")
                    }
                    if ("top-left" == _ && (k = s.offset.left + A, M = s.offset.top - p - L - 12, i(), n("bottom-left", "top-left")), "top-right" == _ && (k = s.offset.left + s.dimension.width + A - l, M = s.offset.top - p - L - 12, i(), n("bottom-right", "top-right")), "bottom" == _) {
                        var O = s.offset.left + l - (s.offset.left + s.dimension.width);
                        k = s.offset.left - O / 2 + A, M = s.offset.top + s.dimension.height + L + 12, i(), n("top", "bottom")
                    }
                    if ("bottom-left" == _ && (k = s.offset.left + A, M = s.offset.top + s.dimension.height + L + 12, i(), n("top-left", "bottom-left")), "bottom-right" == _ && (k = s.offset.left + s.dimension.width + A - l, M = s.offset.top + s.dimension.height + L + 12, i(), n("top-right", "bottom-right")), "left" == _) {
                        k = s.offset.left - A - l - 12, z = s.offset.left + A + s.dimension.width + 12;
                        var D = s.offset.top + p - (s.offset.top + s.dimension.height);
                        if (M = s.offset.top - D / 2 - L, 0 > k && z + l > r) {
                            var H = 2 * parseFloat(o.$tooltip.css("border-width")),
                                N = l + k - H;
                            o.$tooltip.css("width", N + "px"), p = o.$tooltip.outerHeight(!1), k = s.offset.left - A - N - 12 - H, D = s.offset.top + p - (s.offset.top + s.dimension.height), M = s.offset.top - D / 2 - L
                        } else 0 > k && (k = s.offset.left + A + s.dimension.width + 12, a = "left")
                    }
                    if ("right" == _) {
                        k = s.offset.left + A + s.dimension.width + 12, z = s.offset.left - A - l - 12;
                        var D = s.offset.top + p - (s.offset.top + s.dimension.height);
                        if (M = s.offset.top - D / 2 - L, k + l > r && 0 > z) {
                            var H = 2 * parseFloat(o.$tooltip.css("border-width")),
                                N = r - k - H;
                            o.$tooltip.css("width", N + "px"), p = o.$tooltip.outerHeight(!1), D = s.offset.top + p - (s.offset.top + s.dimension.height), M = s.offset.top - D / 2 - L
                        } else k + l > r && (k = s.offset.left - A - l - 12, a = "right")
                    }
                    if (o.options.arrow) {
                        var W = "tooltipster-arrow-" + _;
                        if (o.options.arrowColor.length < 1) var R = o.$tooltip.css("background-color");
                        else var R = o.options.arrowColor;
                        if (a ? "left" == a ? (W = "tooltipster-arrow-right", a = "") : "right" == a ? (W = "tooltipster-arrow-left", a = "") : a = "left:" + Math.round(a) + "px;" : a = "", "top" == _ || "top-left" == _ || "top-right" == _) var $ = parseFloat(o.$tooltip.css("border-bottom-width")),
                            B = o.$tooltip.css("border-bottom-color");
                        else if ("bottom" == _ || "bottom-left" == _ || "bottom-right" == _) var $ = parseFloat(o.$tooltip.css("border-top-width")),
                            B = o.$tooltip.css("border-top-color");
                        else if ("left" == _) var $ = parseFloat(o.$tooltip.css("border-right-width")),
                            B = o.$tooltip.css("border-right-color");
                        else if ("right" == _) var $ = parseFloat(o.$tooltip.css("border-left-width")),
                            B = o.$tooltip.css("border-left-color");
                        else var $ = parseFloat(o.$tooltip.css("border-bottom-width")),
                            B = o.$tooltip.css("border-bottom-color");
                        $ > 1 && $++;
                        var j = "";
                        if (0 !== $) {
                            var V = "",
                                F = "border-color: " + B + ";"; - 1 !== W.indexOf("bottom") ? V = "margin-top: -" + Math.round($) + "px;" : -1 !== W.indexOf("top") ? V = "margin-bottom: -" + Math.round($) + "px;" : -1 !== W.indexOf("left") ? V = "margin-right: -" + Math.round($) + "px;" : -1 !== W.indexOf("right") && (V = "margin-left: -" + Math.round($) + "px;"), j = '<span class="tooltipster-arrow-border" style="' + V + " " + F + ';"></span>'
                        }
                        o.$tooltip.find(".tooltipster-arrow").remove();
                        var q = '<div class="' + W + ' tooltipster-arrow" style="' + a + '">' + j + '<span style="border-color:' + R + ';"></span></div>';
                        o.$tooltip.append(q)
                    }
                    o.$tooltip.css({
                        top: Math.round(M) + "px",
                        left: Math.round(k) + "px"
                    })
                }
                return o
            },
            enable: function() {
                return this.enabled = !0, this
            },
            disable: function() {
                return this.hide(), this.enabled = !1, this
            },
            destroy: function() {
                var t = this;
                t.hide(), t.$el[0] !== t.$elProxy[0] && t.$elProxy.remove(), t.$el.removeData(t.namespace).off("." + t.namespace);
                var i = t.$el.data("tooltipster-ns");
                if (1 === i.length) {
                    var n = null;
                    "previous" === t.options.restoration ? n = t.$el.data("tooltipster-initialTitle") : "current" === t.options.restoration && (n = "string" == typeof t.Content ? t.Content : e("<div></div>").append(t.Content).html()), n && t.$el.attr("title", n), t.$el.removeClass("tooltipstered").removeData("tooltipster-ns").removeData("tooltipster-initialTitle")
                } else i = e.grep(i, function(e, i) {
                    return e !== t.namespace
                }), t.$el.data("tooltipster-ns", i);
                return t
            },
            elementIcon: function() {
                return this.$el[0] !== this.$elProxy[0] ? this.$elProxy[0] : void 0
            },
            elementTooltip: function() {
                return this.$tooltip ? this.$tooltip[0] : void 0
            },
            option: function(e, t) {
                return "undefined" == typeof t ? this.options[e] : (this.options[e] = t, this)
            },
            status: function() {
                return this.Status
            }
        }, e.fn[s] = function() {
            var t = arguments;
            if (0 === this.length) {
                if ("string" == typeof t[0]) {
                    var i = !0;
                    switch (t[0]) {
                        case "setDefaults":
                            e.extend(l, t[1]);
                            break;
                        default:
                            i = !1
                    }
                    return i ? !0 : this
                }
                return this
            }
            if ("string" == typeof t[0]) {
                var o = "#*$~&";
                return this.each(function() {
                    var i = e(this).data("tooltipster-ns"),
                        n = i ? e(this).data(i[0]) : null;
                    if (!n) throw new Error("You called Tooltipster's \"" + t[0] + '" method on an uninitialized element');
                    if ("function" != typeof n[t[0]]) throw new Error('Unknown method .tooltipster("' + t[0] + '")');
                    var a = n[t[0]](t[1], t[2]);
                    return a !== n ? (o = a, !1) : void 0
                }), "#*$~&" !== o ? o : this
            }
            var a = [],
                r = t[0] && "undefined" != typeof t[0].multiple,
                s = r && t[0].multiple || !r && l.multiple,
                p = t[0] && "undefined" != typeof t[0].debug,
                d = p && t[0].debug || !p && l.debug;
            return this.each(function() {
                var i = !1,
                    o = e(this).data("tooltipster-ns"),
                    r = null;
                o ? s ? i = !0 : d && console.log('Tooltipster: one or more tooltips are already attached to this element: ignoring. Use the "multiple" option to attach more tooltips.') : i = !0, i && (r = new n(this, t[0]), o || (o = []), o.push(r.namespace), e(this).data("tooltipster-ns", o), e(this).data(r.namespace, r)), a.push(r)
            }), s ? a : this
        };
        var p = !!("ontouchstart" in t),
            d = !1;
        e("body").one("mousemove", function() {
            d = !0
        })
    }(jQuery, window, document), ! function() {
        function e() {}

        function t(e) {
            return a.retinaImageSuffix + e
        }

        function i(e, i) {
            if (this.path = e || "", "undefined" != typeof i && null !== i) this.at_2x_path = i, this.perform_check = !1;
            else {
                if (void 0 !== document.createElement) {
                    var n = document.createElement("a");
                    n.href = this.path, n.pathname = n.pathname.replace(r, t), this.at_2x_path = n.href
                } else {
                    var o = this.path.split("?");
                    o[0] = o[0].replace(r, t), this.at_2x_path = o.join("?")
                }
                this.perform_check = !0
            }
        }

        function n(e) {
            this.el = e, this.path = new i(this.el.getAttribute("src"), this.el.getAttribute("data-at2x"));
            var t = this;
            this.path.check_2x_variant(function(e) {
                e && t.swap()
            })
        }
        var o = "undefined" == typeof exports ? window : exports,
            a = {
                retinaImageSuffix: "@2x",
                check_mime_type: !0,
                force_original_dimensions: !0
            };
        o.Retina = e, e.configure = function(e) {
            null === e && (e = {});
            for (var t in e) e.hasOwnProperty(t) && (a[t] = e[t])
        }, e.init = function(e) {
            null === e && (e = o);
            var t = e.onload || function() {};
            e.onload = function() {
                var e, i, o = document.getElementsByTagName("img"),
                    a = [];
                for (e = 0; e < o.length; e += 1) i = o[e], i.getAttributeNode("data-no-retina") || a.push(new n(i));
                t()
            }
        }, e.isRetina = function() {
            var e = "(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)";
            return o.devicePixelRatio > 1 ? !0 : !(!o.matchMedia || !o.matchMedia(e).matches)
        };
        var r = /\.\w+$/;
        o.RetinaImagePath = i, i.confirmed_paths = [], i.prototype.is_external = function() {
            return !(!this.path.match(/^https?\:/i) || this.path.match("//" + document.domain))
        }, i.prototype.check_2x_variant = function(e) {
            var t, n = this;
            return this.is_external() ? e(!1) : this.perform_check || "undefined" == typeof this.at_2x_path || null === this.at_2x_path ? this.at_2x_path in i.confirmed_paths ? e(!0) : (t = new XMLHttpRequest, t.open("HEAD", this.at_2x_path), t.onreadystatechange = function() {
                if (4 !== t.readyState) return e(!1);
                if (t.status >= 200 && t.status <= 399) {
                    if (a.check_mime_type) {
                        var o = t.getResponseHeader("Content-Type");
                        if (null === o || !o.match(/^image/i)) return e(!1)
                    }
                    return i.confirmed_paths.push(n.at_2x_path), e(!0)
                }
                return e(!1)
            }, void t.send()) : e(!0)
        }, o.RetinaImage = n, n.prototype.swap = function(e) {
            function t() {
                i.el.complete ? (a.force_original_dimensions && (i.el.setAttribute("width", i.el.offsetWidth), i.el.setAttribute("height", i.el.offsetHeight)), i.el.setAttribute("src", e)) : setTimeout(t, 5)
            }
            "undefined" == typeof e && (e = this.path.at_2x_path);
            var i = this;
            t()
        }, e.isRetina() && e.init(o)
    }(),
    function() {
        function e() {
            M.keyboardSupport && f("keydown", a)
        }

        function t() {
            if (!O && document.body) {
                O = !0;
                var t = document.body,
                    i = document.documentElement,
                    n = window.innerHeight,
                    o = t.scrollHeight;
                if (D = document.compatMode.indexOf("CSS") >= 0 ? i : t, C = t, e(), top != self) A = !0;
                else if (o > n && (t.offsetHeight <= n || i.offsetHeight <= n)) {
                    var a = document.createElement("div");
                    a.style.cssText = "position:absolute; z-index:-10000; top:0; left:0; right:0; height:" + D.scrollHeight + "px", document.body.appendChild(a);
                    var r;
                    I = function() {
                        r || (r = setTimeout(function() {
                            L || (a.style.height = "0", a.style.height = D.scrollHeight + "px", r = null)
                        }, 500))
                    }, setTimeout(I, 10), f("resize", I);
                    var s = {
                        attributes: !0,
                        childList: !0,
                        characterData: !1
                    };
                    if (P = new G(I), P.observe(t, s), D.offsetHeight <= n) {
                        var l = document.createElement("div");
                        l.style.clear = "both", t.appendChild(l)
                    }
                }
                M.fixedBackground || L || (t.style.backgroundAttachment = "scroll", i.style.backgroundAttachment = "scroll")
            }
        }

        function i() {
            P && P.disconnect(), h(F, o), h("mousedown", r), h("keydown", a), h("resize", I), h("load", t)
        }

        function n(e, t, i) {
            if (g(t, i), 1 != M.accelerationMax) {
                var n = Date.now(),
                    o = n - B;
                if (o < M.accelerationDelta) {
                    var a = (1 + 50 / o) / 2;
                    a > 1 && (a = Math.min(a, M.accelerationMax), t *= a, i *= a)
                }
                B = Date.now()
            }
            if (R.push({
                    x: t,
                    y: i,
                    lastX: 0 > t ? .99 : -.99,
                    lastY: 0 > i ? .99 : -.99,
                    start: Date.now()
                }), !$) {
                var r = e === document.body,
                    s = function(n) {
                        for (var o = Date.now(), a = 0, l = 0, p = 0; p < R.length; p++) {
                            var d = R[p],
                                u = o - d.start,
                                c = u >= M.animationTime,
                                f = c ? 1 : u / M.animationTime;
                            M.pulseAlgorithm && (f = S(f));
                            var h = d.x * f - d.lastX >> 0,
                                m = d.y * f - d.lastY >> 0;
                            a += h, l += m, d.lastX += h, d.lastY += m, c && (R.splice(p, 1), p--)
                        }
                        r ? window.scrollBy(a, l) : (a && (e.scrollLeft += a), l && (e.scrollTop += l)), t || i || (R = []), R.length ? q(s, e, 1e3 / M.frameRate + 1) : $ = !1
                    };
                q(s, e, 0), $ = !0
            }
        }

        function o(e) {
            O || t();
            var i = e.target,
                o = p(i);
            if (!o || e.defaultPrevented || e.ctrlKey) return !0;
            if (m(C, "embed") || m(i, "embed") && /\.pdf/i.test(i.src) || m(C, "object")) return !0;
            var a = -e.wheelDeltaX || e.deltaX || 0,
                r = -e.wheelDeltaY || e.deltaY || 0;
            return N && (e.wheelDeltaX && y(e.wheelDeltaX, 120) && (a = -120 * (e.wheelDeltaX / Math.abs(e.wheelDeltaX))), e.wheelDeltaY && y(e.wheelDeltaY, 120) && (r = -120 * (e.wheelDeltaY / Math.abs(e.wheelDeltaY)))), a || r || (r = -e.wheelDelta || 0), 1 === e.deltaMode && (a *= 40, r *= 40), !M.touchpadSupport && v(r) ? !0 : (Math.abs(a) > 1.2 && (a *= M.stepSize / 120), Math.abs(r) > 1.2 && (r *= M.stepSize / 120), n(o, a, r), e.preventDefault(), void s())
        }

        function a(e) {
            var t = e.target,
                i = e.ctrlKey || e.altKey || e.metaKey || e.shiftKey && e.keyCode !== W.spacebar;
            document.contains(C) || (C = document.activeElement);
            var o = /^(textarea|select|embed|object)$/i,
                a = /^(button|submit|radio|checkbox|file|color|image)$/i;
            if (o.test(t.nodeName) || m(t, "input") && !a.test(t.type) || m(C, "video") || b(e) || t.isContentEditable || e.defaultPrevented || i) return !0;
            if ((m(t, "button") || m(t, "input") && a.test(t.type)) && e.keyCode === W.spacebar) return !0;
            var r, l = 0,
                d = 0,
                u = p(C),
                c = u.clientHeight;
            switch (u == document.body && (c = window.innerHeight), e.keyCode) {
                case W.up:
                    d = -M.arrowScroll;
                    break;
                case W.down:
                    d = M.arrowScroll;
                    break;
                case W.spacebar:
                    r = e.shiftKey ? 1 : -1, d = -r * c * .9;
                    break;
                case W.pageup:
                    d = .9 * -c;
                    break;
                case W.pagedown:
                    d = .9 * c;
                    break;
                case W.home:
                    d = -u.scrollTop;
                    break;
                case W.end:
                    var f = u.scrollHeight - u.scrollTop - c;
                    d = f > 0 ? f + 10 : 0;
                    break;
                case W.left:
                    l = -M.arrowScroll;
                    break;
                case W.right:
                    l = M.arrowScroll;
                    break;
                default:
                    return !0
            }
            n(u, l, d), e.preventDefault(), s()
        }

        function r(e) {
            C = e.target
        }

        function s() {
            clearTimeout(E), E = setInterval(function() {
                V = {}
            }, 1e3)
        }

        function l(e, t) {
            for (var i = e.length; i--;) V[j(e[i])] = t;
            return t
        }

        function p(e) {
            var t = [],
                i = document.body,
                n = D.scrollHeight;
            do {
                var o = V[j(e)];
                if (o) return l(t, o);
                if (t.push(e), n === e.scrollHeight) {
                    var a = u(D) && u(i),
                        r = a || c(D);
                    if (A && d(D) || !A && r) return l(t, Y())
                } else if (d(e) && c(e)) return l(t, e)
            } while (e = e.parentElement)
        }

        function d(e) {
            return e.clientHeight + 10 < e.scrollHeight
        }

        function u(e) {
            var t = getComputedStyle(e, "").getPropertyValue("overflow-y");
            return "hidden" !== t
        }

        function c(e) {
            var t = getComputedStyle(e, "").getPropertyValue("overflow-y");
            return "scroll" === t || "auto" === t
        }

        function f(e, t) {
            window.addEventListener(e, t, !1)
        }

        function h(e, t) {
            window.removeEventListener(e, t, !1)
        }

        function m(e, t) {
            return (e.nodeName || "").toLowerCase() === t.toLowerCase()
        }

        function g(e, t) {
            e = e > 0 ? 1 : -1, t = t > 0 ? 1 : -1, _.x === e && _.y === t || (_.x = e, _.y = t, R = [], B = 0)
        }

        function v(e) {
            return e ? (H.length || (H = [e, e, e]), e = Math.abs(e), H.push(e), H.shift(), clearTimeout(k), k = setTimeout(function() {
                window.localStorage && (localStorage.SS_deltaBuffer = H.join(","))
            }, 1e3), !w(120) && !w(100)) : void 0
        }

        function y(e, t) {
            return Math.floor(e / t) == e / t
        }

        function w(e) {
            return y(H[0], e) && y(H[1], e) && y(H[2], e)
        }

        function b(e) {
            var t = e.target,
                i = !1;
            if (-1 != document.URL.indexOf("www.youtube.com/watch"))
                do
                    if (i = t.classList && t.classList.contains("html5-video-controls")) break; while (t = t.parentNode);
            return i
        }

        function x(e) {
            var t, i, n;
            return e *= M.pulseScale, 1 > e ? t = e - (1 - Math.exp(-e)) : (i = Math.exp(-1), e -= 1, n = 1 - Math.exp(-e), t = i + n * (1 - i)), t * M.pulseNormalize
        }

        function S(e) {
            return e >= 1 ? 1 : 0 >= e ? 0 : (1 == M.pulseNormalize && (M.pulseNormalize /= x(1)), x(e))
        }

        function T(e) {
            for (var t in e) z.hasOwnProperty(t) && (M[t] = e[t])
        }
        var C, P, I, E, k, z = {
                frameRate: 150,
                animationTime: 400,
                stepSize: 100,
                pulseAlgorithm: !0,
                pulseScale: 4,
                pulseNormalize: 1,
                accelerationDelta: 50,
                accelerationMax: 3,
                keyboardSupport: !0,
                arrowScroll: 50,
                touchpadSupport: !1,
                fixedBackground: !0,
                excluded: ""
            },
            M = z,
            L = !1,
            A = !1,
            _ = {
                x: 0,
                y: 0
            },
            O = !1,
            D = document.documentElement,
            H = [],
            N = /^Mac/.test(navigator.platform),
            W = {
                left: 37,
                up: 38,
                right: 39,
                down: 40,
                spacebar: 32,
                pageup: 33,
                pagedown: 34,
                end: 35,
                home: 36
            },
            R = [],
            $ = !1,
            B = Date.now(),
            j = function() {
                var e = 0;
                return function(t) {
                    return t.uniqueID || (t.uniqueID = e++)
                }
            }(),
            V = {};
        window.localStorage && localStorage.SS_deltaBuffer && (H = localStorage.SS_deltaBuffer.split(","));
        var F, q = function() {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(e, t, i) {
                    window.setTimeout(e, i || 1e3 / 60)
                }
            }(),
            G = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
            Y = function() {
                var e;
                return function() {
                    if (!e) {
                        var t = document.createElement("div");
                        t.style.cssText = "height:10000px;width:1px;", document.body.appendChild(t);
                        var i = document.body.scrollTop;
                        document.documentElement.scrollTop;
                        window.scrollBy(0, 3), e = document.body.scrollTop != i ? document.body : document.documentElement, window.scrollBy(0, -3), document.body.removeChild(t)
                    }
                    return e
                }
            }(),
            X = window.navigator.userAgent,
            U = /Edge/.test(X),
            Q = /chrome/i.test(X) && !U,
            K = /safari/i.test(X) && !U,
            Z = /mobile/i.test(X),
            J = (Q || K) && !Z;
        "onwheel" in document.createElement("div") ? F = "wheel" : "onmousewheel" in document.createElement("div") && (F = "mousewheel"), F && J && (f(F, o), f("mousedown", r), f("load", t)), T.destroy = i, window.SmoothScrollOptions && T(window.SmoothScrollOptions), "function" == typeof define && define.amd ? define(function() {
            return T
        }) : "object" == typeof exports ? module.exports = T : window.SmoothScroll = T
    }(), ! function() {
        "use strict";

        function e(e) {
            e.fn.swiper = function(t) {
                var n;
                return e(this).each(function() {
                    var e = new i(this, t);
                    n || (n = e)
                }), n
            }
        }
        var t, i = function(e, n) {
            function o(e) {
                return Math.floor(e)
            }

            function a() {
                w.autoplayTimeoutId = setTimeout(function() {
                    w.params.loop ? (w.fixLoop(), w._slideNext(), w.emit("onAutoplay", w)) : w.isEnd ? n.autoplayStopOnLast ? w.stopAutoplay() : (w._slideTo(0), w.emit("onAutoplay", w)) : (w._slideNext(), w.emit("onAutoplay", w))
                }, w.params.autoplay)
            }

            function r(e, i) {
                var n = t(e.target);
                if (!n.is(i))
                    if ("string" == typeof i) n = n.parents(i);
                    else if (i.nodeType) {
                    var o;
                    return n.parents().each(function(e, t) {
                        t === i && (o = i)
                    }), o ? i : void 0
                }
                return 0 !== n.length ? n[0] : void 0
            }

            function s(e, t) {
                t = t || {};
                var i = window.MutationObserver || window.WebkitMutationObserver,
                    n = new i(function(e) {
                        e.forEach(function(e) {
                            w.onResize(!0), w.emit("onObserverUpdate", w, e)
                        })
                    });
                n.observe(e, {
                    attributes: "undefined" == typeof t.attributes ? !0 : t.attributes,
                    childList: "undefined" == typeof t.childList ? !0 : t.childList,
                    characterData: "undefined" == typeof t.characterData ? !0 : t.characterData
                }), w.observers.push(n)
            }

            function l(e) {
                e.originalEvent && (e = e.originalEvent);
                var t = e.keyCode || e.charCode;
                if (!w.params.allowSwipeToNext && (w.isHorizontal() && 39 === t || !w.isHorizontal() && 40 === t)) return !1;
                if (!w.params.allowSwipeToPrev && (w.isHorizontal() && 37 === t || !w.isHorizontal() && 38 === t)) return !1;
                if (!(e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || document.activeElement && document.activeElement.nodeName && ("input" === document.activeElement.nodeName.toLowerCase() || "textarea" === document.activeElement.nodeName.toLowerCase()))) {
                    if (37 === t || 39 === t || 38 === t || 40 === t) {
                        var i = !1;
                        if (w.container.parents(".swiper-slide").length > 0 && 0 === w.container.parents(".swiper-slide-active").length) return;
                        var n = {
                                left: window.pageXOffset,
                                top: window.pageYOffset
                            },
                            o = window.innerWidth,
                            a = window.innerHeight,
                            r = w.container.offset();
                        w.rtl && (r.left = r.left - w.container[0].scrollLeft);
                        for (var s = [
                                [r.left, r.top],
                                [r.left + w.width, r.top],
                                [r.left, r.top + w.height],
                                [r.left + w.width, r.top + w.height]
                            ], l = 0; l < s.length; l++) {
                            var p = s[l];
                            p[0] >= n.left && p[0] <= n.left + o && p[1] >= n.top && p[1] <= n.top + a && (i = !0)
                        }
                        if (!i) return
                    }
                    w.isHorizontal() ? ((37 === t || 39 === t) && (e.preventDefault ? e.preventDefault() : e.returnValue = !1), (39 === t && !w.rtl || 37 === t && w.rtl) && w.slideNext(), (37 === t && !w.rtl || 39 === t && w.rtl) && w.slidePrev()) : ((38 === t || 40 === t) && (e.preventDefault ? e.preventDefault() : e.returnValue = !1), 40 === t && w.slideNext(), 38 === t && w.slidePrev())
                }
            }

            function p(e) {
                e.originalEvent && (e = e.originalEvent);
                var t = w.mousewheel.event,
                    i = 0,
                    n = w.rtl ? -1 : 1;
                if ("mousewheel" === t)
                    if (w.params.mousewheelForceToAxis)
                        if (w.isHorizontal()) {
                            if (!(Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY))) return;
                            i = e.wheelDeltaX * n
                        } else {
                            if (!(Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX))) return;
                            i = e.wheelDeltaY
                        }
                else i = Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY) ? -e.wheelDeltaX * n : -e.wheelDeltaY;
                else if ("DOMMouseScroll" === t) i = -e.detail;
                else if ("wheel" === t)
                    if (w.params.mousewheelForceToAxis)
                        if (w.isHorizontal()) {
                            if (!(Math.abs(e.deltaX) > Math.abs(e.deltaY))) return;
                            i = -e.deltaX * n
                        } else {
                            if (!(Math.abs(e.deltaY) > Math.abs(e.deltaX))) return;
                            i = -e.deltaY
                        }
                else i = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? -e.deltaX * n : -e.deltaY;
                if (0 !== i) {
                    if (w.params.mousewheelInvert && (i = -i), w.params.freeMode) {
                        var o = w.getWrapperTranslate() + i * w.params.mousewheelSensitivity,
                            a = w.isBeginning,
                            r = w.isEnd;
                        if (o >= w.minTranslate() && (o = w.minTranslate()), o <= w.maxTranslate() && (o = w.maxTranslate()), w.setWrapperTransition(0), w.setWrapperTranslate(o), w.updateProgress(), w.updateActiveIndex(), (!a && w.isBeginning || !r && w.isEnd) && w.updateClasses(), w.params.freeModeSticky ? (clearTimeout(w.mousewheel.timeout), w.mousewheel.timeout = setTimeout(function() {
                                w.slideReset()
                            }, 300)) : w.params.lazyLoading && w.lazy && w.lazy.load(), 0 === o || o === w.maxTranslate()) return
                    } else {
                        if ((new window.Date).getTime() - w.mousewheel.lastScrollTime > 60)
                            if (0 > i)
                                if (w.isEnd && !w.params.loop || w.animating) {
                                    if (w.params.mousewheelReleaseOnEdges) return !0
                                } else w.slideNext();
                        else if (w.isBeginning && !w.params.loop || w.animating) {
                            if (w.params.mousewheelReleaseOnEdges) return !0
                        } else w.slidePrev();
                        w.mousewheel.lastScrollTime = (new window.Date).getTime()
                    }
                    return w.params.autoplay && w.stopAutoplay(), e.preventDefault ? e.preventDefault() : e.returnValue = !1, !1
                }
            }

            function d(e, i) {
                e = t(e);
                var n, o, a, r = w.rtl ? -1 : 1;
                n = e.attr("data-swiper-parallax") || "0", o = e.attr("data-swiper-parallax-x"), a = e.attr("data-swiper-parallax-y"), o || a ? (o = o || "0", a = a || "0") : w.isHorizontal() ? (o = n, a = "0") : (a = n, o = "0"), o = o.indexOf("%") >= 0 ? parseInt(o, 10) * i * r + "%" : o * i * r + "px", a = a.indexOf("%") >= 0 ? parseInt(a, 10) * i + "%" : a * i + "px", e.transform("translate3d(" + o + ", " + a + ",0px)")
            }

            function u(e) {
                return 0 !== e.indexOf("on") && (e = e[0] !== e[0].toUpperCase() ? "on" + e[0].toUpperCase() + e.substring(1) : "on" + e), e
            }
            if (!(this instanceof i)) return new i(e, n);
            var c = {
                    direction: "horizontal",
                    touchEventsTarget: "container",
                    initialSlide: 0,
                    speed: 300,
                    autoplay: !1,
                    autoplayDisableOnInteraction: !0,
                    autoplayStopOnLast: !1,
                    iOSEdgeSwipeDetection: !1,
                    iOSEdgeSwipeThreshold: 20,
                    freeMode: !1,
                    freeModeMomentum: !0,
                    freeModeMomentumRatio: 1,
                    freeModeMomentumBounce: !0,
                    freeModeMomentumBounceRatio: 1,
                    freeModeSticky: !1,
                    freeModeMinimumVelocity: .02,
                    autoHeight: !1,
                    setWrapperSize: !1,
                    virtualTranslate: !1,
                    effect: "slide",
                    coverflow: {
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: !0
                    },
                    flip: {
                        slideShadows: !0,
                        limitRotation: !0
                    },
                    cube: {
                        slideShadows: !0,
                        shadow: !0,
                        shadowOffset: 20,
                        shadowScale: .94
                    },
                    fade: {
                        crossFade: !1
                    },
                    parallax: !1,
                    scrollbar: null,
                    scrollbarHide: !0,
                    scrollbarDraggable: !1,
                    scrollbarSnapOnRelease: !1,
                    keyboardControl: !1,
                    mousewheelControl: !1,
                    mousewheelReleaseOnEdges: !1,
                    mousewheelInvert: !1,
                    mousewheelForceToAxis: !1,
                    mousewheelSensitivity: 1,
                    hashnav: !1,
                    breakpoints: void 0,
                    spaceBetween: 0,
                    slidesPerView: 1,
                    slidesPerColumn: 1,
                    slidesPerColumnFill: "column",
                    slidesPerGroup: 1,
                    centeredSlides: !1,
                    slidesOffsetBefore: 0,
                    slidesOffsetAfter: 0,
                    roundLengths: !1,
                    touchRatio: 1,
                    touchAngle: 45,
                    simulateTouch: !0,
                    shortSwipes: !0,
                    longSwipes: !0,
                    longSwipesRatio: .5,
                    longSwipesMs: 300,
                    followFinger: !0,
                    onlyExternal: !1,
                    threshold: 0,
                    touchMoveStopPropagation: !0,
                    uniqueNavElements: !0,
                    pagination: null,
                    paginationElement: "span",
                    paginationClickable: !1,
                    paginationHide: !1,
                    paginationBulletRender: null,
                    paginationProgressRender: null,
                    paginationFractionRender: null,
                    paginationCustomRender: null,
                    paginationType: "bullets",
                    resistance: !0,
                    resistanceRatio: .85,
                    nextButton: null,
                    prevButton: null,
                    watchSlidesProgress: !1,
                    watchSlidesVisibility: !1,
                    grabCursor: !1,
                    preventClicks: !0,
                    preventClicksPropagation: !0,
                    slideToClickedSlide: !1,
                    lazyLoading: !1,
                    lazyLoadingInPrevNext: !1,
                    lazyLoadingInPrevNextAmount: 1,
                    lazyLoadingOnTransitionStart: !1,
                    preloadImages: !0,
                    updateOnImagesReady: !0,
                    loop: !1,
                    loopAdditionalSlides: 0,
                    loopedSlides: null,
                    control: void 0,
                    controlInverse: !1,
                    controlBy: "slide",
                    allowSwipeToPrev: !0,
                    allowSwipeToNext: !0,
                    swipeHandler: null,
                    noSwiping: !0,
                    noSwipingClass: "swiper-no-swiping",
                    slideClass: "swiper-slide",
                    slideActiveClass: "swiper-slide-active",
                    slideVisibleClass: "swiper-slide-visible",
                    slideDuplicateClass: "swiper-slide-duplicate",
                    slideNextClass: "swiper-slide-next",
                    slidePrevClass: "swiper-slide-prev",
                    wrapperClass: "swiper-wrapper",
                    bulletClass: "swiper-pagination-bullet",
                    bulletActiveClass: "swiper-pagination-bullet-active",
                    buttonDisabledClass: "swiper-button-disabled",
                    paginationCurrentClass: "swiper-pagination-current",
                    paginationTotalClass: "swiper-pagination-total",
                    paginationHiddenClass: "swiper-pagination-hidden",
                    paginationProgressbarClass: "swiper-pagination-progressbar",
                    observer: !1,
                    observeParents: !1,
                    a11y: !1,
                    prevSlideMessage: "Previous slide",
                    nextSlideMessage: "Next slide",
                    firstSlideMessage: "This is the first slide",
                    lastSlideMessage: "This is the last slide",
                    paginationBulletMessage: "Go to slide {{index}}",
                    runCallbacksOnInit: !0
                },
                f = n && n.virtualTranslate;
            n = n || {};
            var h = {};
            for (var m in n)
                if ("object" != typeof n[m] || null === n[m] || n[m].nodeType || n[m] === window || n[m] === document || "undefined" != typeof Dom7 && n[m] instanceof Dom7 || "undefined" != typeof jQuery && n[m] instanceof jQuery) h[m] = n[m];
                else {
                    h[m] = {};
                    for (var g in n[m]) h[m][g] = n[m][g]
                }
            for (var v in c)
                if ("undefined" == typeof n[v]) n[v] = c[v];
                else if ("object" == typeof n[v])
                for (var y in c[v]) "undefined" == typeof n[v][y] && (n[v][y] = c[v][y]);
            var w = this;
            if (w.params = n, w.originalParams = h, w.classNames = [], "undefined" != typeof t && "undefined" != typeof Dom7 && (t = Dom7), ("undefined" != typeof t || (t = "undefined" == typeof Dom7 ? window.Dom7 || window.Zepto || window.jQuery : Dom7)) && (w.$ = t, w.currentBreakpoint = void 0, w.getActiveBreakpoint = function() {
                    if (!w.params.breakpoints) return !1;
                    var e, t = !1,
                        i = [];
                    for (e in w.params.breakpoints) w.params.breakpoints.hasOwnProperty(e) && i.push(e);
                    i.sort(function(e, t) {
                        return parseInt(e, 10) > parseInt(t, 10)
                    });
                    for (var n = 0; n < i.length; n++) e = i[n], e >= window.innerWidth && !t && (t = e);
                    return t || "max"
                }, w.setBreakpoint = function() {
                    var e = w.getActiveBreakpoint();
                    if (e && w.currentBreakpoint !== e) {
                        var t = e in w.params.breakpoints ? w.params.breakpoints[e] : w.originalParams,
                            i = w.params.loop && t.slidesPerView !== w.params.slidesPerView;
                        for (var n in t) w.params[n] = t[n];
                        w.currentBreakpoint = e, i && w.destroyLoop && w.reLoop(!0)
                    }
                }, w.params.breakpoints && w.setBreakpoint(), w.container = t(e), 0 !== w.container.length)) {
                if (w.container.length > 1) {
                    var b = [];
                    return w.container.each(function() {
                        b.push(new i(this, n))
                    }), b
                }
                w.container[0].swiper = w, w.container.data("swiper", w), w.classNames.push("swiper-container-" + w.params.direction), w.params.freeMode && w.classNames.push("swiper-container-free-mode"), w.support.flexbox || (w.classNames.push("swiper-container-no-flexbox"), w.params.slidesPerColumn = 1), w.params.autoHeight && w.classNames.push("swiper-container-autoheight"), (w.params.parallax || w.params.watchSlidesVisibility) && (w.params.watchSlidesProgress = !0), ["cube", "coverflow", "flip"].indexOf(w.params.effect) >= 0 && (w.support.transforms3d ? (w.params.watchSlidesProgress = !0, w.classNames.push("swiper-container-3d")) : w.params.effect = "slide"), "slide" !== w.params.effect && w.classNames.push("swiper-container-" + w.params.effect), "cube" === w.params.effect && (w.params.resistanceRatio = 0, w.params.slidesPerView = 1, w.params.slidesPerColumn = 1, w.params.slidesPerGroup = 1, w.params.centeredSlides = !1, w.params.spaceBetween = 0, w.params.virtualTranslate = !0, w.params.setWrapperSize = !1), ("fade" === w.params.effect || "flip" === w.params.effect) && (w.params.slidesPerView = 1, w.params.slidesPerColumn = 1, w.params.slidesPerGroup = 1, w.params.watchSlidesProgress = !0, w.params.spaceBetween = 0, w.params.setWrapperSize = !1, "undefined" == typeof f && (w.params.virtualTranslate = !0)), w.params.grabCursor && w.support.touch && (w.params.grabCursor = !1), w.wrapper = w.container.children("." + w.params.wrapperClass), w.params.pagination && (w.paginationContainer = t(w.params.pagination), w.params.uniqueNavElements && "string" == typeof w.params.pagination && w.paginationContainer.length > 1 && 1 === w.container.find(w.params.pagination).length && (w.paginationContainer = w.container.find(w.params.pagination)), "bullets" === w.params.paginationType && w.params.paginationClickable ? w.paginationContainer.addClass("swiper-pagination-clickable") : w.params.paginationClickable = !1, w.paginationContainer.addClass("swiper-pagination-" + w.params.paginationType)), (w.params.nextButton || w.params.prevButton) && (w.params.nextButton && (w.nextButton = t(w.params.nextButton), w.params.uniqueNavElements && "string" == typeof w.params.nextButton && w.nextButton.length > 1 && 1 === w.container.find(w.params.nextButton).length && (w.nextButton = w.container.find(w.params.nextButton))), w.params.prevButton && (w.prevButton = t(w.params.prevButton), w.params.uniqueNavElements && "string" == typeof w.params.prevButton && w.prevButton.length > 1 && 1 === w.container.find(w.params.prevButton).length && (w.prevButton = w.container.find(w.params.prevButton)))), w.isHorizontal = function() {
                    return "horizontal" === w.params.direction
                }, w.rtl = w.isHorizontal() && ("rtl" === w.container[0].dir.toLowerCase() || "rtl" === w.container.css("direction")), w.rtl && w.classNames.push("swiper-container-rtl"), w.rtl && (w.wrongRTL = "-webkit-box" === w.wrapper.css("display")), w.params.slidesPerColumn > 1 && w.classNames.push("swiper-container-multirow"), w.device.android && w.classNames.push("swiper-container-android"), w.container.addClass(w.classNames.join(" ")), w.translate = 0, w.progress = 0, w.velocity = 0, w.lockSwipeToNext = function() {
                    w.params.allowSwipeToNext = !1
                }, w.lockSwipeToPrev = function() {
                    w.params.allowSwipeToPrev = !1
                }, w.lockSwipes = function() {
                    w.params.allowSwipeToNext = w.params.allowSwipeToPrev = !1
                }, w.unlockSwipeToNext = function() {
                    w.params.allowSwipeToNext = !0
                }, w.unlockSwipeToPrev = function() {
                    w.params.allowSwipeToPrev = !0
                }, w.unlockSwipes = function() {
                    w.params.allowSwipeToNext = w.params.allowSwipeToPrev = !0
                }, w.params.grabCursor && (w.container[0].style.cursor = "move", w.container[0].style.cursor = "-webkit-grab", w.container[0].style.cursor = "-moz-grab", w.container[0].style.cursor = "grab"), w.imagesToLoad = [], w.imagesLoaded = 0, w.loadImage = function(e, t, i, n, o) {
                    function a() {
                        o && o()
                    }
                    var r;
                    e.complete && n ? a() : t ? (r = new window.Image, r.onload = a, r.onerror = a, i && (r.srcset = i), t && (r.src = t)) : a()
                }, w.preloadImages = function() {
                    function e() {
                        "undefined" != typeof w && null !== w && (void 0 !== w.imagesLoaded && w.imagesLoaded++, w.imagesLoaded === w.imagesToLoad.length && (w.params.updateOnImagesReady && w.update(), w.emit("onImagesReady", w)))
                    }
                    w.imagesToLoad = w.container.find("img");
                    for (var t = 0; t < w.imagesToLoad.length; t++) w.loadImage(w.imagesToLoad[t], w.imagesToLoad[t].currentSrc || w.imagesToLoad[t].getAttribute("src"), w.imagesToLoad[t].srcset || w.imagesToLoad[t].getAttribute("srcset"), !0, e)
                }, w.autoplayTimeoutId = void 0, w.autoplaying = !1, w.autoplayPaused = !1, w.startAutoplay = function() {
                    return "undefined" != typeof w.autoplayTimeoutId ? !1 : w.params.autoplay ? w.autoplaying ? !1 : (w.autoplaying = !0, w.emit("onAutoplayStart", w), void a()) : !1
                }, w.stopAutoplay = function(e) {
                    w.autoplayTimeoutId && (w.autoplayTimeoutId && clearTimeout(w.autoplayTimeoutId), w.autoplaying = !1, w.autoplayTimeoutId = void 0, w.emit("onAutoplayStop", w))
                }, w.pauseAutoplay = function(e) {
                    w.autoplayPaused || (w.autoplayTimeoutId && clearTimeout(w.autoplayTimeoutId), w.autoplayPaused = !0, 0 === e ? (w.autoplayPaused = !1, a()) : w.wrapper.transitionEnd(function() {
                        w && (w.autoplayPaused = !1, w.autoplaying ? a() : w.stopAutoplay())
                    }))
                }, w.minTranslate = function() {
                    return -w.snapGrid[0]
                }, w.maxTranslate = function() {
                    return -w.snapGrid[w.snapGrid.length - 1]
                }, w.updateAutoHeight = function() {
                    var e = w.slides.eq(w.activeIndex)[0];
                    if ("undefined" != typeof e) {
                        var t = e.offsetHeight;
                        t && w.wrapper.css("height", t + "px")
                    }
                }, w.updateContainerSize = function() {
                    var e, t;
                    e = "undefined" != typeof w.params.width ? w.params.width : w.container[0].clientWidth, t = "undefined" != typeof w.params.height ? w.params.height : w.container[0].clientHeight, 0 === e && w.isHorizontal() || 0 === t && !w.isHorizontal() || (e = e - parseInt(w.container.css("padding-left"), 10) - parseInt(w.container.css("padding-right"), 10), t = t - parseInt(w.container.css("padding-top"), 10) - parseInt(w.container.css("padding-bottom"), 10), w.width = e, w.height = t, w.size = w.isHorizontal() ? w.width : w.height)
                }, w.updateSlidesSize = function() {
                    w.slides = w.wrapper.children("." + w.params.slideClass), w.snapGrid = [], w.slidesGrid = [], w.slidesSizesGrid = [];
                    var e, t = w.params.spaceBetween,
                        i = -w.params.slidesOffsetBefore,
                        n = 0,
                        a = 0;
                    if ("undefined" != typeof w.size) {
                        "string" == typeof t && t.indexOf("%") >= 0 && (t = parseFloat(t.replace("%", "")) / 100 * w.size), w.virtualSize = -t, w.rtl ? w.slides.css({
                            marginLeft: "",
                            marginTop: ""
                        }) : w.slides.css({
                            marginRight: "",
                            marginBottom: ""
                        });
                        var r;
                        w.params.slidesPerColumn > 1 && (r = Math.floor(w.slides.length / w.params.slidesPerColumn) === w.slides.length / w.params.slidesPerColumn ? w.slides.length : Math.ceil(w.slides.length / w.params.slidesPerColumn) * w.params.slidesPerColumn, "auto" !== w.params.slidesPerView && "row" === w.params.slidesPerColumnFill && (r = Math.max(r, w.params.slidesPerView * w.params.slidesPerColumn)));
                        var s, l = w.params.slidesPerColumn,
                            p = r / l,
                            d = p - (w.params.slidesPerColumn * p - w.slides.length);
                        for (e = 0; e < w.slides.length; e++) {
                            s = 0;
                            var u = w.slides.eq(e);
                            if (w.params.slidesPerColumn > 1) {
                                var c, f, h;
                                "column" === w.params.slidesPerColumnFill ? (f = Math.floor(e / l), h = e - f * l, (f > d || f === d && h === l - 1) && ++h >= l && (h = 0, f++), c = f + h * r / l, u.css({
                                    "-webkit-box-ordinal-group": c,
                                    "-moz-box-ordinal-group": c,
                                    "-ms-flex-order": c,
                                    "-webkit-order": c,
                                    order: c
                                })) : (h = Math.floor(e / p), f = e - h * p), u.css({
                                    "margin-top": 0 !== h && w.params.spaceBetween && w.params.spaceBetween + "px"
                                }).attr("data-swiper-column", f).attr("data-swiper-row", h)
                            }
                            "none" !== u.css("display") && ("auto" === w.params.slidesPerView ? (s = w.isHorizontal() ? u.outerWidth(!0) : u.outerHeight(!0), w.params.roundLengths && (s = o(s))) : (s = (w.size - (w.params.slidesPerView - 1) * t) / w.params.slidesPerView, w.params.roundLengths && (s = o(s)), w.isHorizontal() ? w.slides[e].style.width = s + "px" : w.slides[e].style.height = s + "px"), w.slides[e].swiperSlideSize = s, w.slidesSizesGrid.push(s), w.params.centeredSlides ? (i = i + s / 2 + n / 2 + t, 0 === e && (i = i - w.size / 2 - t), Math.abs(i) < .001 && (i = 0), a % w.params.slidesPerGroup === 0 && w.snapGrid.push(i), w.slidesGrid.push(i)) : (a % w.params.slidesPerGroup === 0 && w.snapGrid.push(i), w.slidesGrid.push(i), i = i + s + t), w.virtualSize += s + t, n = s, a++)
                        }
                        w.virtualSize = Math.max(w.virtualSize, w.size) + w.params.slidesOffsetAfter;
                        var m;
                        if (w.rtl && w.wrongRTL && ("slide" === w.params.effect || "coverflow" === w.params.effect) && w.wrapper.css({
                                width: w.virtualSize + w.params.spaceBetween + "px"
                            }), (!w.support.flexbox || w.params.setWrapperSize) && (w.isHorizontal() ? w.wrapper.css({
                                width: w.virtualSize + w.params.spaceBetween + "px"
                            }) : w.wrapper.css({
                                height: w.virtualSize + w.params.spaceBetween + "px"
                            })), w.params.slidesPerColumn > 1 && (w.virtualSize = (s + w.params.spaceBetween) * r, w.virtualSize = Math.ceil(w.virtualSize / w.params.slidesPerColumn) - w.params.spaceBetween, w.wrapper.css({
                                width: w.virtualSize + w.params.spaceBetween + "px"
                            }), w.params.centeredSlides)) {
                            for (m = [], e = 0; e < w.snapGrid.length; e++) w.snapGrid[e] < w.virtualSize + w.snapGrid[0] && m.push(w.snapGrid[e]);
                            w.snapGrid = m
                        }
                        if (!w.params.centeredSlides) {
                            for (m = [], e = 0; e < w.snapGrid.length; e++) w.snapGrid[e] <= w.virtualSize - w.size && m.push(w.snapGrid[e]);
                            w.snapGrid = m, Math.floor(w.virtualSize - w.size) - Math.floor(w.snapGrid[w.snapGrid.length - 1]) > 1 && w.snapGrid.push(w.virtualSize - w.size)
                        }
                        0 === w.snapGrid.length && (w.snapGrid = [0]), 0 !== w.params.spaceBetween && (w.isHorizontal() ? w.rtl ? w.slides.css({
                            marginLeft: t + "px"
                        }) : w.slides.css({
                            marginRight: t + "px"
                        }) : w.slides.css({
                            marginBottom: t + "px"
                        })), w.params.watchSlidesProgress && w.updateSlidesOffset()
                    }
                }, w.updateSlidesOffset = function() {
                    for (var e = 0; e < w.slides.length; e++) w.slides[e].swiperSlideOffset = w.isHorizontal() ? w.slides[e].offsetLeft : w.slides[e].offsetTop
                }, w.updateSlidesProgress = function(e) {
                    if ("undefined" == typeof e && (e = w.translate || 0), 0 !== w.slides.length) {
                        "undefined" == typeof w.slides[0].swiperSlideOffset && w.updateSlidesOffset();
                        var t = -e;
                        w.rtl && (t = e), w.slides.removeClass(w.params.slideVisibleClass);
                        for (var i = 0; i < w.slides.length; i++) {
                            var n = w.slides[i],
                                o = (t - n.swiperSlideOffset) / (n.swiperSlideSize + w.params.spaceBetween);
                            if (w.params.watchSlidesVisibility) {
                                var a = -(t - n.swiperSlideOffset),
                                    r = a + w.slidesSizesGrid[i],
                                    s = a >= 0 && a < w.size || r > 0 && r <= w.size || 0 >= a && r >= w.size;
                                s && w.slides.eq(i).addClass(w.params.slideVisibleClass)
                            }
                            n.progress = w.rtl ? -o : o
                        }
                    }
                }, w.updateProgress = function(e) {
                    "undefined" == typeof e && (e = w.translate || 0);
                    var t = w.maxTranslate() - w.minTranslate(),
                        i = w.isBeginning,
                        n = w.isEnd;
                    0 === t ? (w.progress = 0, w.isBeginning = w.isEnd = !0) : (w.progress = (e - w.minTranslate()) / t, w.isBeginning = w.progress <= 0, w.isEnd = w.progress >= 1), w.isBeginning && !i && w.emit("onReachBeginning", w), w.isEnd && !n && w.emit("onReachEnd", w), w.params.watchSlidesProgress && w.updateSlidesProgress(e), w.emit("onProgress", w, w.progress)
                }, w.updateActiveIndex = function() {
                    var e, t, i, n = w.rtl ? w.translate : -w.translate;
                    for (t = 0; t < w.slidesGrid.length; t++) "undefined" != typeof w.slidesGrid[t + 1] ? n >= w.slidesGrid[t] && n < w.slidesGrid[t + 1] - (w.slidesGrid[t + 1] - w.slidesGrid[t]) / 2 ? e = t : n >= w.slidesGrid[t] && n < w.slidesGrid[t + 1] && (e = t + 1) : n >= w.slidesGrid[t] && (e = t);
                    (0 > e || "undefined" == typeof e) && (e = 0), i = Math.floor(e / w.params.slidesPerGroup), i >= w.snapGrid.length && (i = w.snapGrid.length - 1), e !== w.activeIndex && (w.snapIndex = i, w.previousIndex = w.activeIndex, w.activeIndex = e, w.updateClasses())
                }, w.updateClasses = function() {
                    w.slides.removeClass(w.params.slideActiveClass + " " + w.params.slideNextClass + " " + w.params.slidePrevClass);
                    var e = w.slides.eq(w.activeIndex);
                    e.addClass(w.params.slideActiveClass);
                    var i = e.next("." + w.params.slideClass).addClass(w.params.slideNextClass);
                    w.params.loop && 0 === i.length && w.slides.eq(0).addClass(w.params.slideNextClass);
                    var n = e.prev("." + w.params.slideClass).addClass(w.params.slidePrevClass);
                    if (w.params.loop && 0 === n.length && w.slides.eq(-1).addClass(w.params.slidePrevClass), w.paginationContainer && w.paginationContainer.length > 0) {
                        var o, a = w.params.loop ? Math.ceil((w.slides.length - 2 * w.loopedSlides) / w.params.slidesPerGroup) : w.snapGrid.length;
                        if (w.params.loop ? (o = Math.ceil((w.activeIndex - w.loopedSlides) / w.params.slidesPerGroup), o > w.slides.length - 1 - 2 * w.loopedSlides && (o -= w.slides.length - 2 * w.loopedSlides), o > a - 1 && (o -= a), 0 > o && "bullets" !== w.params.paginationType && (o = a + o)) : o = "undefined" != typeof w.snapIndex ? w.snapIndex : w.activeIndex || 0, "bullets" === w.params.paginationType && w.bullets && w.bullets.length > 0 && (w.bullets.removeClass(w.params.bulletActiveClass), w.paginationContainer.length > 1 ? w.bullets.each(function() {
                                t(this).index() === o && t(this).addClass(w.params.bulletActiveClass)
                            }) : w.bullets.eq(o).addClass(w.params.bulletActiveClass)), "fraction" === w.params.paginationType && (w.paginationContainer.find("." + w.params.paginationCurrentClass).text(o + 1), w.paginationContainer.find("." + w.params.paginationTotalClass).text(a)), "progress" === w.params.paginationType) {
                            var r = (o + 1) / a,
                                s = r,
                                l = 1;
                            w.isHorizontal() || (l = r, s = 1), w.paginationContainer.find("." + w.params.paginationProgressbarClass).transform("translate3d(0,0,0) scaleX(" + s + ") scaleY(" + l + ")").transition(w.params.speed)
                        }
                        "custom" === w.params.paginationType && w.params.paginationCustomRender && (w.paginationContainer.html(w.params.paginationCustomRender(w, o + 1, a)), w.emit("onPaginationRendered", w, w.paginationContainer[0]))
                    }
                    w.params.loop || (w.params.prevButton && w.prevButton && w.prevButton.length > 0 && (w.isBeginning ? (w.prevButton.addClass(w.params.buttonDisabledClass), w.params.a11y && w.a11y && w.a11y.disable(w.prevButton)) : (w.prevButton.removeClass(w.params.buttonDisabledClass), w.params.a11y && w.a11y && w.a11y.enable(w.prevButton))), w.params.nextButton && w.nextButton && w.nextButton.length > 0 && (w.isEnd ? (w.nextButton.addClass(w.params.buttonDisabledClass), w.params.a11y && w.a11y && w.a11y.disable(w.nextButton)) : (w.nextButton.removeClass(w.params.buttonDisabledClass), w.params.a11y && w.a11y && w.a11y.enable(w.nextButton))))
                }, w.updatePagination = function() {
                    if (w.params.pagination && w.paginationContainer && w.paginationContainer.length > 0) {
                        var e = "";
                        if ("bullets" === w.params.paginationType) {
                            for (var t = w.params.loop ? Math.ceil((w.slides.length - 2 * w.loopedSlides) / w.params.slidesPerGroup) : w.snapGrid.length, i = 0; t > i; i++) e += w.params.paginationBulletRender ? w.params.paginationBulletRender(i, w.params.bulletClass) : "<" + w.params.paginationElement + ' class="' + w.params.bulletClass + '"></' + w.params.paginationElement + ">";
                            w.paginationContainer.html(e), w.bullets = w.paginationContainer.find("." + w.params.bulletClass), w.params.paginationClickable && w.params.a11y && w.a11y && w.a11y.initPagination()
                        }
                        "fraction" === w.params.paginationType && (e = w.params.paginationFractionRender ? w.params.paginationFractionRender(w, w.params.paginationCurrentClass, w.params.paginationTotalClass) : '<span class="' + w.params.paginationCurrentClass + '"></span> / <span class="' + w.params.paginationTotalClass + '"></span>', w.paginationContainer.html(e)), "progress" === w.params.paginationType && (e = w.params.paginationProgressRender ? w.params.paginationProgressRender(w, w.params.paginationProgressbarClass) : '<span class="' + w.params.paginationProgressbarClass + '"></span>', w.paginationContainer.html(e)), "custom" !== w.params.paginationType && w.emit("onPaginationRendered", w, w.paginationContainer[0])
                    }
                }, w.update = function(e) {
                    function t() {
                        n = Math.min(Math.max(w.translate, w.maxTranslate()), w.minTranslate()), w.setWrapperTranslate(n), w.updateActiveIndex(), w.updateClasses()
                    }
                    if (w.updateContainerSize(), w.updateSlidesSize(), w.updateProgress(), w.updatePagination(), w.updateClasses(), w.params.scrollbar && w.scrollbar && w.scrollbar.set(), e) {
                        var i, n;
                        w.controller && w.controller.spline && (w.controller.spline = void 0), w.params.freeMode ? (t(), w.params.autoHeight && w.updateAutoHeight()) : (i = ("auto" === w.params.slidesPerView || w.params.slidesPerView > 1) && w.isEnd && !w.params.centeredSlides ? w.slideTo(w.slides.length - 1, 0, !1, !0) : w.slideTo(w.activeIndex, 0, !1, !0), i || t())
                    } else w.params.autoHeight && w.updateAutoHeight()
                }, w.onResize = function(e) {
                    w.params.breakpoints && w.setBreakpoint();
                    var t = w.params.allowSwipeToPrev,
                        i = w.params.allowSwipeToNext;
                    w.params.allowSwipeToPrev = w.params.allowSwipeToNext = !0, w.updateContainerSize(), w.updateSlidesSize(), ("auto" === w.params.slidesPerView || w.params.freeMode || e) && w.updatePagination(), w.params.scrollbar && w.scrollbar && w.scrollbar.set(), w.controller && w.controller.spline && (w.controller.spline = void 0);
                    var n = !1;
                    if (w.params.freeMode) {
                        var o = Math.min(Math.max(w.translate, w.maxTranslate()), w.minTranslate());
                        w.setWrapperTranslate(o), w.updateActiveIndex(), w.updateClasses(), w.params.autoHeight && w.updateAutoHeight()
                    } else w.updateClasses(), n = ("auto" === w.params.slidesPerView || w.params.slidesPerView > 1) && w.isEnd && !w.params.centeredSlides ? w.slideTo(w.slides.length - 1, 0, !1, !0) : w.slideTo(w.activeIndex, 0, !1, !0);
                    w.params.lazyLoading && !n && w.lazy && w.lazy.load(), w.params.allowSwipeToPrev = t, w.params.allowSwipeToNext = i
                };
                var x = ["mousedown", "mousemove", "mouseup"];
                window.navigator.pointerEnabled ? x = ["pointerdown", "pointermove", "pointerup"] : window.navigator.msPointerEnabled && (x = ["MSPointerDown", "MSPointerMove", "MSPointerUp"]), w.touchEvents = {
                    start: w.support.touch || !w.params.simulateTouch ? "touchstart" : x[0],
                    move: w.support.touch || !w.params.simulateTouch ? "touchmove" : x[1],
                    end: w.support.touch || !w.params.simulateTouch ? "touchend" : x[2]
                }, (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) && ("container" === w.params.touchEventsTarget ? w.container : w.wrapper).addClass("swiper-wp8-" + w.params.direction), w.initEvents = function(e) {
                    var t = e ? "off" : "on",
                        i = e ? "removeEventListener" : "addEventListener",
                        o = "container" === w.params.touchEventsTarget ? w.container[0] : w.wrapper[0],
                        a = w.support.touch ? o : document,
                        r = !!w.params.nested;
                    w.browser.ie ? (o[i](w.touchEvents.start, w.onTouchStart, !1), a[i](w.touchEvents.move, w.onTouchMove, r), a[i](w.touchEvents.end, w.onTouchEnd, !1)) : (w.support.touch && (o[i](w.touchEvents.start, w.onTouchStart, !1), o[i](w.touchEvents.move, w.onTouchMove, r), o[i](w.touchEvents.end, w.onTouchEnd, !1)), !n.simulateTouch || w.device.ios || w.device.android || (o[i]("mousedown", w.onTouchStart, !1), document[i]("mousemove", w.onTouchMove, r), document[i]("mouseup", w.onTouchEnd, !1))), window[i]("resize", w.onResize), w.params.nextButton && w.nextButton && w.nextButton.length > 0 && (w.nextButton[t]("click", w.onClickNext), w.params.a11y && w.a11y && w.nextButton[t]("keydown", w.a11y.onEnterKey)), w.params.prevButton && w.prevButton && w.prevButton.length > 0 && (w.prevButton[t]("click", w.onClickPrev), w.params.a11y && w.a11y && w.prevButton[t]("keydown", w.a11y.onEnterKey)), w.params.pagination && w.params.paginationClickable && (w.paginationContainer[t]("click", "." + w.params.bulletClass, w.onClickIndex), w.params.a11y && w.a11y && w.paginationContainer[t]("keydown", "." + w.params.bulletClass, w.a11y.onEnterKey)), (w.params.preventClicks || w.params.preventClicksPropagation) && o[i]("click", w.preventClicks, !0)
                }, w.attachEvents = function() {
                    w.initEvents()
                }, w.detachEvents = function() {
                    w.initEvents(!0)
                }, w.allowClick = !0, w.preventClicks = function(e) {
                    w.allowClick || (w.params.preventClicks && e.preventDefault(), w.params.preventClicksPropagation && w.animating && (e.stopPropagation(), e.stopImmediatePropagation()))
                }, w.onClickNext = function(e) {
                    e.preventDefault(), (!w.isEnd || w.params.loop) && w.slideNext()
                }, w.onClickPrev = function(e) {
                    e.preventDefault(), (!w.isBeginning || w.params.loop) && w.slidePrev()
                }, w.onClickIndex = function(e) {
                    e.preventDefault();
                    var i = t(this).index() * w.params.slidesPerGroup;
                    w.params.loop && (i += w.loopedSlides), w.slideTo(i)
                }, w.updateClickedSlide = function(e) {
                    var i = r(e, "." + w.params.slideClass),
                        n = !1;
                    if (i)
                        for (var o = 0; o < w.slides.length; o++) w.slides[o] === i && (n = !0);
                    if (!i || !n) return w.clickedSlide = void 0, void(w.clickedIndex = void 0);
                    if (w.clickedSlide = i, w.clickedIndex = t(i).index(), w.params.slideToClickedSlide && void 0 !== w.clickedIndex && w.clickedIndex !== w.activeIndex) {
                        var a, s = w.clickedIndex;
                        if (w.params.loop) {
                            if (w.animating) return;
                            a = t(w.clickedSlide).attr("data-swiper-slide-index"), w.params.centeredSlides ? s < w.loopedSlides - w.params.slidesPerView / 2 || s > w.slides.length - w.loopedSlides + w.params.slidesPerView / 2 ? (w.fixLoop(), s = w.wrapper.children("." + w.params.slideClass + '[data-swiper-slide-index="' + a + '"]:not(.swiper-slide-duplicate)').eq(0).index(), setTimeout(function() {
                                w.slideTo(s)
                            }, 0)) : w.slideTo(s) : s > w.slides.length - w.params.slidesPerView ? (w.fixLoop(), s = w.wrapper.children("." + w.params.slideClass + '[data-swiper-slide-index="' + a + '"]:not(.swiper-slide-duplicate)').eq(0).index(), setTimeout(function() {
                                w.slideTo(s)
                            }, 0)) : w.slideTo(s)
                        } else w.slideTo(s)
                    }
                };
                var S, T, C, P, I, E, k, z, M, L, A = "input, select, textarea, button",
                    _ = Date.now(),
                    O = [];
                w.animating = !1, w.touches = {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                };
                var D, H;
                if (w.onTouchStart = function(e) {
                        if (e.originalEvent && (e = e.originalEvent), D = "touchstart" === e.type, D || !("which" in e) || 3 !== e.which) {
                            if (w.params.noSwiping && r(e, "." + w.params.noSwipingClass)) return void(w.allowClick = !0);
                            if (!w.params.swipeHandler || r(e, w.params.swipeHandler)) {
                                var i = w.touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX,
                                    n = w.touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY;
                                if (!(w.device.ios && w.params.iOSEdgeSwipeDetection && i <= w.params.iOSEdgeSwipeThreshold)) {
                                    if (S = !0, T = !1, C = !0, I = void 0, H = void 0, w.touches.startX = i, w.touches.startY = n, P = Date.now(), w.allowClick = !0, w.updateContainerSize(), w.swipeDirection = void 0, w.params.threshold > 0 && (z = !1), "touchstart" !== e.type) {
                                        var o = !0;
                                        t(e.target).is(A) && (o = !1), document.activeElement && t(document.activeElement).is(A) && document.activeElement.blur(), o && e.preventDefault()
                                    }
                                    w.emit("onTouchStart", w, e)
                                }
                            }
                        }
                    }, w.onTouchMove = function(e) {
                        if (e.originalEvent && (e = e.originalEvent), !D || "mousemove" !== e.type) {
                            if (e.preventedByNestedSwiper) return w.touches.startX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, void(w.touches.startY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY);
                            if (w.params.onlyExternal) return w.allowClick = !1, void(S && (w.touches.startX = w.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, w.touches.startY = w.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, P = Date.now()));
                            if (D && document.activeElement && e.target === document.activeElement && t(e.target).is(A)) return T = !0, void(w.allowClick = !1);
                            if (C && w.emit("onTouchMove", w, e), !(e.targetTouches && e.targetTouches.length > 1)) {
                                if (w.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, w.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, "undefined" == typeof I) {
                                    var i = 180 * Math.atan2(Math.abs(w.touches.currentY - w.touches.startY), Math.abs(w.touches.currentX - w.touches.startX)) / Math.PI;
                                    I = w.isHorizontal() ? i > w.params.touchAngle : 90 - i > w.params.touchAngle
                                }
                                if (I && w.emit("onTouchMoveOpposite", w, e), "undefined" == typeof H && w.browser.ieTouch && (w.touches.currentX !== w.touches.startX || w.touches.currentY !== w.touches.startY) && (H = !0), S) {
                                    if (I) return void(S = !1);
                                    if (H || !w.browser.ieTouch) {
                                        w.allowClick = !1, w.emit("onSliderMove", w, e), e.preventDefault(), w.params.touchMoveStopPropagation && !w.params.nested && e.stopPropagation(), T || (n.loop && w.fixLoop(), k = w.getWrapperTranslate(), w.setWrapperTransition(0), w.animating && w.wrapper.trigger("webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd"), w.params.autoplay && w.autoplaying && (w.params.autoplayDisableOnInteraction ? w.stopAutoplay() : w.pauseAutoplay()), L = !1, w.params.grabCursor && (w.container[0].style.cursor = "move", w.container[0].style.cursor = "-webkit-grabbing", w.container[0].style.cursor = "-moz-grabbin", w.container[0].style.cursor = "grabbing")), T = !0;
                                        var o = w.touches.diff = w.isHorizontal() ? w.touches.currentX - w.touches.startX : w.touches.currentY - w.touches.startY;
                                        o *= w.params.touchRatio, w.rtl && (o = -o), w.swipeDirection = o > 0 ? "prev" : "next", E = o + k;
                                        var a = !0;
                                        if (o > 0 && E > w.minTranslate() ? (a = !1, w.params.resistance && (E = w.minTranslate() - 1 + Math.pow(-w.minTranslate() + k + o, w.params.resistanceRatio))) : 0 > o && E < w.maxTranslate() && (a = !1, w.params.resistance && (E = w.maxTranslate() + 1 - Math.pow(w.maxTranslate() - k - o, w.params.resistanceRatio))), a && (e.preventedByNestedSwiper = !0), !w.params.allowSwipeToNext && "next" === w.swipeDirection && k > E && (E = k), !w.params.allowSwipeToPrev && "prev" === w.swipeDirection && E > k && (E = k), w.params.followFinger) {
                                            if (w.params.threshold > 0) {
                                                if (!(Math.abs(o) > w.params.threshold || z)) return void(E = k);
                                                if (!z) return z = !0, w.touches.startX = w.touches.currentX, w.touches.startY = w.touches.currentY, E = k, void(w.touches.diff = w.isHorizontal() ? w.touches.currentX - w.touches.startX : w.touches.currentY - w.touches.startY)
                                            }(w.params.freeMode || w.params.watchSlidesProgress) && w.updateActiveIndex(), w.params.freeMode && (0 === O.length && O.push({
                                                position: w.touches[w.isHorizontal() ? "startX" : "startY"],
                                                time: P
                                            }), O.push({
                                                position: w.touches[w.isHorizontal() ? "currentX" : "currentY"],
                                                time: (new window.Date).getTime()
                                            })), w.updateProgress(E), w.setWrapperTranslate(E)
                                        }
                                    }
                                }
                            }
                        }
                    }, w.onTouchEnd = function(e) {
                        if (e.originalEvent && (e = e.originalEvent), C && w.emit("onTouchEnd", w, e), C = !1, S) {
                            w.params.grabCursor && T && S && (w.container[0].style.cursor = "move", w.container[0].style.cursor = "-webkit-grab", w.container[0].style.cursor = "-moz-grab", w.container[0].style.cursor = "grab");
                            var i = Date.now(),
                                n = i - P;
                            if (w.allowClick && (w.updateClickedSlide(e), w.emit("onTap", w, e), 300 > n && i - _ > 300 && (M && clearTimeout(M), M = setTimeout(function() {
                                    w && (w.params.paginationHide && w.paginationContainer.length > 0 && !t(e.target).hasClass(w.params.bulletClass) && w.paginationContainer.toggleClass(w.params.paginationHiddenClass), w.emit("onClick", w, e))
                                }, 300)), 300 > n && 300 > i - _ && (M && clearTimeout(M), w.emit("onDoubleTap", w, e))), _ = Date.now(), setTimeout(function() {
                                    w && (w.allowClick = !0)
                                }, 0), !S || !T || !w.swipeDirection || 0 === w.touches.diff || E === k) return void(S = T = !1);
                            S = T = !1;
                            var o;
                            if (o = w.params.followFinger ? w.rtl ? w.translate : -w.translate : -E, w.params.freeMode) {
                                if (o < -w.minTranslate()) return void w.slideTo(w.activeIndex);
                                if (o > -w.maxTranslate()) return void(w.slides.length < w.snapGrid.length ? w.slideTo(w.snapGrid.length - 1) : w.slideTo(w.slides.length - 1));
                                if (w.params.freeModeMomentum) {
                                    if (O.length > 1) {
                                        var a = O.pop(),
                                            r = O.pop(),
                                            s = a.position - r.position,
                                            l = a.time - r.time;
                                        w.velocity = s / l, w.velocity = w.velocity / 2, Math.abs(w.velocity) < w.params.freeModeMinimumVelocity && (w.velocity = 0), (l > 150 || (new window.Date).getTime() - a.time > 300) && (w.velocity = 0)
                                    } else w.velocity = 0;
                                    O.length = 0;
                                    var p = 1e3 * w.params.freeModeMomentumRatio,
                                        d = w.velocity * p,
                                        u = w.translate + d;
                                    w.rtl && (u = -u);
                                    var c, f = !1,
                                        h = 20 * Math.abs(w.velocity) * w.params.freeModeMomentumBounceRatio;
                                    if (u < w.maxTranslate()) w.params.freeModeMomentumBounce ? (u + w.maxTranslate() < -h && (u = w.maxTranslate() - h), c = w.maxTranslate(), f = !0, L = !0) : u = w.maxTranslate();
                                    else if (u > w.minTranslate()) w.params.freeModeMomentumBounce ? (u - w.minTranslate() > h && (u = w.minTranslate() + h), c = w.minTranslate(), f = !0, L = !0) : u = w.minTranslate();
                                    else if (w.params.freeModeSticky) {
                                        var m, g = 0;
                                        for (g = 0; g < w.snapGrid.length; g += 1)
                                            if (w.snapGrid[g] > -u) {
                                                m = g;
                                                break
                                            }
                                        u = Math.abs(w.snapGrid[m] - u) < Math.abs(w.snapGrid[m - 1] - u) || "next" === w.swipeDirection ? w.snapGrid[m] : w.snapGrid[m - 1], w.rtl || (u = -u)
                                    }
                                    if (0 !== w.velocity) p = w.rtl ? Math.abs((-u - w.translate) / w.velocity) : Math.abs((u - w.translate) / w.velocity);
                                    else if (w.params.freeModeSticky) return void w.slideReset();
                                    w.params.freeModeMomentumBounce && f ? (w.updateProgress(c), w.setWrapperTransition(p), w.setWrapperTranslate(u), w.onTransitionStart(), w.animating = !0, w.wrapper.transitionEnd(function() {
                                        w && L && (w.emit("onMomentumBounce", w), w.setWrapperTransition(w.params.speed), w.setWrapperTranslate(c), w.wrapper.transitionEnd(function() {
                                            w && w.onTransitionEnd()
                                        }))
                                    })) : w.velocity ? (w.updateProgress(u), w.setWrapperTransition(p), w.setWrapperTranslate(u), w.onTransitionStart(), w.animating || (w.animating = !0, w.wrapper.transitionEnd(function() {
                                        w && w.onTransitionEnd()
                                    }))) : w.updateProgress(u), w.updateActiveIndex()
                                }
                                return void((!w.params.freeModeMomentum || n >= w.params.longSwipesMs) && (w.updateProgress(), w.updateActiveIndex()))
                            }
                            var v, y = 0,
                                b = w.slidesSizesGrid[0];
                            for (v = 0; v < w.slidesGrid.length; v += w.params.slidesPerGroup) "undefined" != typeof w.slidesGrid[v + w.params.slidesPerGroup] ? o >= w.slidesGrid[v] && o < w.slidesGrid[v + w.params.slidesPerGroup] && (y = v, b = w.slidesGrid[v + w.params.slidesPerGroup] - w.slidesGrid[v]) : o >= w.slidesGrid[v] && (y = v, b = w.slidesGrid[w.slidesGrid.length - 1] - w.slidesGrid[w.slidesGrid.length - 2]);
                            var x = (o - w.slidesGrid[y]) / b;
                            if (n > w.params.longSwipesMs) {
                                if (!w.params.longSwipes) return void w.slideTo(w.activeIndex);
                                "next" === w.swipeDirection && (x >= w.params.longSwipesRatio ? w.slideTo(y + w.params.slidesPerGroup) : w.slideTo(y)), "prev" === w.swipeDirection && (x > 1 - w.params.longSwipesRatio ? w.slideTo(y + w.params.slidesPerGroup) : w.slideTo(y))
                            } else {
                                if (!w.params.shortSwipes) return void w.slideTo(w.activeIndex);
                                "next" === w.swipeDirection && w.slideTo(y + w.params.slidesPerGroup), "prev" === w.swipeDirection && w.slideTo(y)
                            }
                        }
                    }, w._slideTo = function(e, t) {
                        return w.slideTo(e, t, !0, !0)
                    }, w.slideTo = function(e, t, i, n) {
                        "undefined" == typeof i && (i = !0), "undefined" == typeof e && (e = 0), 0 > e && (e = 0), w.snapIndex = Math.floor(e / w.params.slidesPerGroup), w.snapIndex >= w.snapGrid.length && (w.snapIndex = w.snapGrid.length - 1);
                        var o = -w.snapGrid[w.snapIndex];
                        w.params.autoplay && w.autoplaying && (n || !w.params.autoplayDisableOnInteraction ? w.pauseAutoplay(t) : w.stopAutoplay()), w.updateProgress(o);
                        for (var a = 0; a < w.slidesGrid.length; a++) - Math.floor(100 * o) >= Math.floor(100 * w.slidesGrid[a]) && (e = a);
                        return !w.params.allowSwipeToNext && o < w.translate && o < w.minTranslate() ? !1 : !w.params.allowSwipeToPrev && o > w.translate && o > w.maxTranslate() && (w.activeIndex || 0) !== e ? !1 : ("undefined" == typeof t && (t = w.params.speed), w.previousIndex = w.activeIndex || 0, w.activeIndex = e, w.rtl && -o === w.translate || !w.rtl && o === w.translate ? (w.params.autoHeight && w.updateAutoHeight(), w.updateClasses(), "slide" !== w.params.effect && w.setWrapperTranslate(o), !1) : (w.updateClasses(), w.onTransitionStart(i), 0 === t ? (w.setWrapperTranslate(o), w.setWrapperTransition(0), w.onTransitionEnd(i)) : (w.setWrapperTranslate(o), w.setWrapperTransition(t), w.animating || (w.animating = !0, w.wrapper.transitionEnd(function() {
                            w && w.onTransitionEnd(i)
                        }))), !0))
                    }, w.onTransitionStart = function(e) {
                        "undefined" == typeof e && (e = !0), w.params.autoHeight && w.updateAutoHeight(), w.lazy && w.lazy.onTransitionStart(), e && (w.emit("onTransitionStart", w), w.activeIndex !== w.previousIndex && (w.emit("onSlideChangeStart", w), w.activeIndex > w.previousIndex ? w.emit("onSlideNextStart", w) : w.emit("onSlidePrevStart", w)))
                    }, w.onTransitionEnd = function(e) {
                        w.animating = !1, w.setWrapperTransition(0), "undefined" == typeof e && (e = !0), w.lazy && w.lazy.onTransitionEnd(), e && (w.emit("onTransitionEnd", w), w.activeIndex !== w.previousIndex && (w.emit("onSlideChangeEnd", w), w.activeIndex > w.previousIndex ? w.emit("onSlideNextEnd", w) : w.emit("onSlidePrevEnd", w))), w.params.hashnav && w.hashnav && w.hashnav.setHash()
                    }, w.slideNext = function(e, t, i) {
                        return w.params.loop ? w.animating ? !1 : (w.fixLoop(), w.container[0].clientLeft, w.slideTo(w.activeIndex + w.params.slidesPerGroup, t, e, i)) : w.slideTo(w.activeIndex + w.params.slidesPerGroup, t, e, i)
                    }, w._slideNext = function(e) {
                        return w.slideNext(!0, e, !0)
                    }, w.slidePrev = function(e, t, i) {
                        return w.params.loop ? w.animating ? !1 : (w.fixLoop(), w.container[0].clientLeft, w.slideTo(w.activeIndex - 1, t, e, i)) : w.slideTo(w.activeIndex - 1, t, e, i)
                    }, w._slidePrev = function(e) {
                        return w.slidePrev(!0, e, !0)
                    }, w.slideReset = function(e, t, i) {
                        return w.slideTo(w.activeIndex, t, e)
                    }, w.setWrapperTransition = function(e, t) {
                        w.wrapper.transition(e), "slide" !== w.params.effect && w.effects[w.params.effect] && w.effects[w.params.effect].setTransition(e), w.params.parallax && w.parallax && w.parallax.setTransition(e), w.params.scrollbar && w.scrollbar && w.scrollbar.setTransition(e), w.params.control && w.controller && w.controller.setTransition(e, t), w.emit("onSetTransition", w, e)
                    }, w.setWrapperTranslate = function(e, t, i) {
                        var n = 0,
                            a = 0,
                            r = 0;
                        w.isHorizontal() ? n = w.rtl ? -e : e : a = e, w.params.roundLengths && (n = o(n), a = o(a)), w.params.virtualTranslate || (w.support.transforms3d ? w.wrapper.transform("translate3d(" + n + "px, " + a + "px, " + r + "px)") : w.wrapper.transform("translate(" + n + "px, " + a + "px)")), w.translate = w.isHorizontal() ? n : a;
                        var s, l = w.maxTranslate() - w.minTranslate();
                        s = 0 === l ? 0 : (e - w.minTranslate()) / l, s !== w.progress && w.updateProgress(e), t && w.updateActiveIndex(), "slide" !== w.params.effect && w.effects[w.params.effect] && w.effects[w.params.effect].setTranslate(w.translate), w.params.parallax && w.parallax && w.parallax.setTranslate(w.translate), w.params.scrollbar && w.scrollbar && w.scrollbar.setTranslate(w.translate), w.params.control && w.controller && w.controller.setTranslate(w.translate, i), w.emit("onSetTranslate", w, w.translate)
                    }, w.getTranslate = function(e, t) {
                        var i, n, o, a;
                        return "undefined" == typeof t && (t = "x"), w.params.virtualTranslate ? w.rtl ? -w.translate : w.translate : (o = window.getComputedStyle(e, null), window.WebKitCSSMatrix ? (n = o.transform || o.webkitTransform, n.split(",").length > 6 && (n = n.split(", ").map(function(e) {
                            return e.replace(",", ".")
                        }).join(", ")), a = new window.WebKitCSSMatrix("none" === n ? "" : n)) : (a = o.MozTransform || o.OTransform || o.MsTransform || o.msTransform || o.transform || o.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), i = a.toString().split(",")), "x" === t && (n = window.WebKitCSSMatrix ? a.m41 : 16 === i.length ? parseFloat(i[12]) : parseFloat(i[4])), "y" === t && (n = window.WebKitCSSMatrix ? a.m42 : 16 === i.length ? parseFloat(i[13]) : parseFloat(i[5])), w.rtl && n && (n = -n), n || 0)
                    }, w.getWrapperTranslate = function(e) {
                        return "undefined" == typeof e && (e = w.isHorizontal() ? "x" : "y"), w.getTranslate(w.wrapper[0], e)
                    }, w.observers = [], w.initObservers = function() {
                        if (w.params.observeParents)
                            for (var e = w.container.parents(), t = 0; t < e.length; t++) s(e[t]);
                        s(w.container[0], {
                            childList: !1
                        }), s(w.wrapper[0], {
                            attributes: !1
                        })
                    }, w.disconnectObservers = function() {
                        for (var e = 0; e < w.observers.length; e++) w.observers[e].disconnect();
                        w.observers = []
                    }, w.createLoop = function() {
                        w.wrapper.children("." + w.params.slideClass + "." + w.params.slideDuplicateClass).remove();
                        var e = w.wrapper.children("." + w.params.slideClass);
                        "auto" !== w.params.slidesPerView || w.params.loopedSlides || (w.params.loopedSlides = e.length), w.loopedSlides = parseInt(w.params.loopedSlides || w.params.slidesPerView, 10), w.loopedSlides = w.loopedSlides + w.params.loopAdditionalSlides, w.loopedSlides > e.length && (w.loopedSlides = e.length);
                        var i, n = [],
                            o = [];
                        for (e.each(function(i, a) {
                                var r = t(this);
                                i < w.loopedSlides && o.push(a), i < e.length && i >= e.length - w.loopedSlides && n.push(a), r.attr("data-swiper-slide-index", i)
                            }), i = 0; i < o.length; i++) w.wrapper.append(t(o[i].cloneNode(!0)).addClass(w.params.slideDuplicateClass));
                        for (i = n.length - 1; i >= 0; i--) w.wrapper.prepend(t(n[i].cloneNode(!0)).addClass(w.params.slideDuplicateClass))
                    }, w.destroyLoop = function() {
                        w.wrapper.children("." + w.params.slideClass + "." + w.params.slideDuplicateClass).remove(), w.slides.removeAttr("data-swiper-slide-index")
                    }, w.reLoop = function(e) {
                        var t = w.activeIndex - w.loopedSlides;
                        w.destroyLoop(), w.createLoop(), w.updateSlidesSize(), e && w.slideTo(t + w.loopedSlides, 0, !1)
                    }, w.fixLoop = function() {
                        var e;
                        w.activeIndex < w.loopedSlides ? (e = w.slides.length - 3 * w.loopedSlides + w.activeIndex, e += w.loopedSlides, w.slideTo(e, 0, !1, !0)) : ("auto" === w.params.slidesPerView && w.activeIndex >= 2 * w.loopedSlides || w.activeIndex > w.slides.length - 2 * w.params.slidesPerView) && (e = -w.slides.length + w.activeIndex + w.loopedSlides, e += w.loopedSlides, w.slideTo(e, 0, !1, !0))
                    }, w.appendSlide = function(e) {
                        if (w.params.loop && w.destroyLoop(), "object" == typeof e && e.length)
                            for (var t = 0; t < e.length; t++) e[t] && w.wrapper.append(e[t]);
                        else w.wrapper.append(e);
                        w.params.loop && w.createLoop(), w.params.observer && w.support.observer || w.update(!0)
                    }, w.prependSlide = function(e) {
                        w.params.loop && w.destroyLoop();
                        var t = w.activeIndex + 1;
                        if ("object" == typeof e && e.length) {
                            for (var i = 0; i < e.length; i++) e[i] && w.wrapper.prepend(e[i]);
                            t = w.activeIndex + e.length
                        } else w.wrapper.prepend(e);
                        w.params.loop && w.createLoop(), w.params.observer && w.support.observer || w.update(!0), w.slideTo(t, 0, !1)
                    }, w.removeSlide = function(e) {
                        w.params.loop && (w.destroyLoop(), w.slides = w.wrapper.children("." + w.params.slideClass));
                        var t, i = w.activeIndex;
                        if ("object" == typeof e && e.length) {
                            for (var n = 0; n < e.length; n++) t = e[n], w.slides[t] && w.slides.eq(t).remove(), i > t && i--;
                            i = Math.max(i, 0)
                        } else t = e, w.slides[t] && w.slides.eq(t).remove(), i > t && i--, i = Math.max(i, 0);
                        w.params.loop && w.createLoop(), w.params.observer && w.support.observer || w.update(!0), w.params.loop ? w.slideTo(i + w.loopedSlides, 0, !1) : w.slideTo(i, 0, !1)
                    }, w.removeAllSlides = function() {
                        for (var e = [], t = 0; t < w.slides.length; t++) e.push(t);
                        w.removeSlide(e)
                    }, w.effects = {
                        fade: {
                            setTranslate: function() {
                                for (var e = 0; e < w.slides.length; e++) {
                                    var t = w.slides.eq(e),
                                        i = t[0].swiperSlideOffset,
                                        n = -i;
                                    w.params.virtualTranslate || (n -= w.translate);
                                    var o = 0;
                                    w.isHorizontal() || (o = n, n = 0);
                                    var a = w.params.fade.crossFade ? Math.max(1 - Math.abs(t[0].progress), 0) : 1 + Math.min(Math.max(t[0].progress, -1), 0);
                                    t.css({
                                        opacity: a
                                    }).transform("translate3d(" + n + "px, " + o + "px, 0px)")
                                }
                            },
                            setTransition: function(e) {
                                if (w.slides.transition(e), w.params.virtualTranslate && 0 !== e) {
                                    var t = !1;
                                    w.slides.transitionEnd(function() {
                                        if (!t && w) {
                                            t = !0, w.animating = !1;
                                            for (var e = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], i = 0; i < e.length; i++) w.wrapper.trigger(e[i])
                                        }
                                    })
                                }
                            }
                        },
                        flip: {
                            setTranslate: function() {
                                for (var e = 0; e < w.slides.length; e++) {
                                    var i = w.slides.eq(e),
                                        n = i[0].progress;
                                    w.params.flip.limitRotation && (n = Math.max(Math.min(i[0].progress, 1), -1));
                                    var o = i[0].swiperSlideOffset,
                                        a = -180 * n,
                                        r = a,
                                        s = 0,
                                        l = -o,
                                        p = 0;
                                    if (w.isHorizontal() ? w.rtl && (r = -r) : (p = l, l = 0, s = -r, r = 0), i[0].style.zIndex = -Math.abs(Math.round(n)) + w.slides.length, w.params.flip.slideShadows) {
                                        var d = w.isHorizontal() ? i.find(".swiper-slide-shadow-left") : i.find(".swiper-slide-shadow-top"),
                                            u = w.isHorizontal() ? i.find(".swiper-slide-shadow-right") : i.find(".swiper-slide-shadow-bottom");
                                        0 === d.length && (d = t('<div class="swiper-slide-shadow-' + (w.isHorizontal() ? "left" : "top") + '"></div>'), i.append(d)), 0 === u.length && (u = t('<div class="swiper-slide-shadow-' + (w.isHorizontal() ? "right" : "bottom") + '"></div>'), i.append(u)), d.length && (d[0].style.opacity = Math.max(-n, 0)), u.length && (u[0].style.opacity = Math.max(n, 0))
                                    }
                                    i.transform("translate3d(" + l + "px, " + p + "px, 0px) rotateX(" + s + "deg) rotateY(" + r + "deg)")
                                }
                            },
                            setTransition: function(e) {
                                if (w.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), w.params.virtualTranslate && 0 !== e) {
                                    var i = !1;
                                    w.slides.eq(w.activeIndex).transitionEnd(function() {
                                        if (!i && w && t(this).hasClass(w.params.slideActiveClass)) {
                                            i = !0, w.animating = !1;
                                            for (var e = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], n = 0; n < e.length; n++) w.wrapper.trigger(e[n])
                                        }
                                    })
                                }
                            }
                        },
                        cube: {
                            setTranslate: function() {
                                var e, i = 0;
                                w.params.cube.shadow && (w.isHorizontal() ? (e = w.wrapper.find(".swiper-cube-shadow"), 0 === e.length && (e = t('<div class="swiper-cube-shadow"></div>'), w.wrapper.append(e)), e.css({
                                    height: w.width + "px"
                                })) : (e = w.container.find(".swiper-cube-shadow"), 0 === e.length && (e = t('<div class="swiper-cube-shadow"></div>'), w.container.append(e))));
                                for (var n = 0; n < w.slides.length; n++) {
                                    var o = w.slides.eq(n),
                                        a = 90 * n,
                                        r = Math.floor(a / 360);
                                    w.rtl && (a = -a, r = Math.floor(-a / 360));
                                    var s = Math.max(Math.min(o[0].progress, 1), -1),
                                        l = 0,
                                        p = 0,
                                        d = 0;
                                    n % 4 === 0 ? (l = 4 * -r * w.size, d = 0) : (n - 1) % 4 === 0 ? (l = 0, d = 4 * -r * w.size) : (n - 2) % 4 === 0 ? (l = w.size + 4 * r * w.size, d = w.size) : (n - 3) % 4 === 0 && (l = -w.size, d = 3 * w.size + 4 * w.size * r), w.rtl && (l = -l), w.isHorizontal() || (p = l, l = 0);
                                    var u = "rotateX(" + (w.isHorizontal() ? 0 : -a) + "deg) rotateY(" + (w.isHorizontal() ? a : 0) + "deg) translate3d(" + l + "px, " + p + "px, " + d + "px)";
                                    if (1 >= s && s > -1 && (i = 90 * n + 90 * s, w.rtl && (i = 90 * -n - 90 * s)), o.transform(u), w.params.cube.slideShadows) {
                                        var c = w.isHorizontal() ? o.find(".swiper-slide-shadow-left") : o.find(".swiper-slide-shadow-top"),
                                            f = w.isHorizontal() ? o.find(".swiper-slide-shadow-right") : o.find(".swiper-slide-shadow-bottom");
                                        0 === c.length && (c = t('<div class="swiper-slide-shadow-' + (w.isHorizontal() ? "left" : "top") + '"></div>'), o.append(c)), 0 === f.length && (f = t('<div class="swiper-slide-shadow-' + (w.isHorizontal() ? "right" : "bottom") + '"></div>'), o.append(f)), c.length && (c[0].style.opacity = Math.max(-s, 0)), f.length && (f[0].style.opacity = Math.max(s, 0))
                                    }
                                }
                                if (w.wrapper.css({
                                        "-webkit-transform-origin": "50% 50% -" + w.size / 2 + "px",
                                        "-moz-transform-origin": "50% 50% -" + w.size / 2 + "px",
                                        "-ms-transform-origin": "50% 50% -" + w.size / 2 + "px",
                                        "transform-origin": "50% 50% -" + w.size / 2 + "px"
                                    }), w.params.cube.shadow)
                                    if (w.isHorizontal()) e.transform("translate3d(0px, " + (w.width / 2 + w.params.cube.shadowOffset) + "px, " + -w.width / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + w.params.cube.shadowScale + ")");
                                    else {
                                        var h = Math.abs(i) - 90 * Math.floor(Math.abs(i) / 90),
                                            m = 1.5 - (Math.sin(2 * h * Math.PI / 360) / 2 + Math.cos(2 * h * Math.PI / 360) / 2),
                                            g = w.params.cube.shadowScale,
                                            v = w.params.cube.shadowScale / m,
                                            y = w.params.cube.shadowOffset;
                                        e.transform("scale3d(" + g + ", 1, " + v + ") translate3d(0px, " + (w.height / 2 + y) + "px, " + -w.height / 2 / v + "px) rotateX(-90deg)")
                                    }
                                var b = w.isSafari || w.isUiWebView ? -w.size / 2 : 0;
                                w.wrapper.transform("translate3d(0px,0," + b + "px) rotateX(" + (w.isHorizontal() ? 0 : i) + "deg) rotateY(" + (w.isHorizontal() ? -i : 0) + "deg)")
                            },
                            setTransition: function(e) {
                                w.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), w.params.cube.shadow && !w.isHorizontal() && w.container.find(".swiper-cube-shadow").transition(e)
                            }
                        },
                        coverflow: {
                            setTranslate: function() {
                                for (var e = w.translate, i = w.isHorizontal() ? -e + w.width / 2 : -e + w.height / 2, n = w.isHorizontal() ? w.params.coverflow.rotate : -w.params.coverflow.rotate, o = w.params.coverflow.depth, a = 0, r = w.slides.length; r > a; a++) {
                                    var s = w.slides.eq(a),
                                        l = w.slidesSizesGrid[a],
                                        p = s[0].swiperSlideOffset,
                                        d = (i - p - l / 2) / l * w.params.coverflow.modifier,
                                        u = w.isHorizontal() ? n * d : 0,
                                        c = w.isHorizontal() ? 0 : n * d,
                                        f = -o * Math.abs(d),
                                        h = w.isHorizontal() ? 0 : w.params.coverflow.stretch * d,
                                        m = w.isHorizontal() ? w.params.coverflow.stretch * d : 0;
                                    Math.abs(m) < .001 && (m = 0), Math.abs(h) < .001 && (h = 0), Math.abs(f) < .001 && (f = 0), Math.abs(u) < .001 && (u = 0), Math.abs(c) < .001 && (c = 0);
                                    var g = "translate3d(" + m + "px," + h + "px," + f + "px)  rotateX(" + c + "deg) rotateY(" + u + "deg)";
                                    if (s.transform(g), s[0].style.zIndex = -Math.abs(Math.round(d)) + 1, w.params.coverflow.slideShadows) {
                                        var v = w.isHorizontal() ? s.find(".swiper-slide-shadow-left") : s.find(".swiper-slide-shadow-top"),
                                            y = w.isHorizontal() ? s.find(".swiper-slide-shadow-right") : s.find(".swiper-slide-shadow-bottom");
                                        0 === v.length && (v = t('<div class="swiper-slide-shadow-' + (w.isHorizontal() ? "left" : "top") + '"></div>'), s.append(v)), 0 === y.length && (y = t('<div class="swiper-slide-shadow-' + (w.isHorizontal() ? "right" : "bottom") + '"></div>'), s.append(y)), v.length && (v[0].style.opacity = d > 0 ? d : 0), y.length && (y[0].style.opacity = -d > 0 ? -d : 0)
                                    }
                                }
                                if (w.browser.ie) {
                                    var b = w.wrapper[0].style;
                                    b.perspectiveOrigin = i + "px 50%"
                                }
                            },
                            setTransition: function(e) {
                                w.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)
                            }
                        }
                    }, w.lazy = {
                        initialImageLoaded: !1,
                        loadImageInSlide: function(e, i) {
                            if ("undefined" != typeof e && ("undefined" == typeof i && (i = !0), 0 !== w.slides.length)) {
                                var n = w.slides.eq(e),
                                    o = n.find(".swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)");
                                !n.hasClass("swiper-lazy") || n.hasClass("swiper-lazy-loaded") || n.hasClass("swiper-lazy-loading") || (o = o.add(n[0])), 0 !== o.length && o.each(function() {
                                    var e = t(this);
                                    e.addClass("swiper-lazy-loading");
                                    var o = e.attr("data-background"),
                                        a = e.attr("data-src"),
                                        r = e.attr("data-srcset");
                                    w.loadImage(e[0], a || o, r, !1, function() {
                                        if (o ? (e.css("background-image", 'url("' + o + '")'), e.removeAttr("data-background")) : (r && (e.attr("srcset", r), e.removeAttr("data-srcset")), a && (e.attr("src", a), e.removeAttr("data-src"))), e.addClass("swiper-lazy-loaded").removeClass("swiper-lazy-loading"), n.find(".swiper-lazy-preloader, .preloader").remove(), w.params.loop && i) {
                                            var t = n.attr("data-swiper-slide-index");
                                            if (n.hasClass(w.params.slideDuplicateClass)) {
                                                var s = w.wrapper.children('[data-swiper-slide-index="' + t + '"]:not(.' + w.params.slideDuplicateClass + ")");
                                                w.lazy.loadImageInSlide(s.index(), !1)
                                            } else {
                                                var l = w.wrapper.children("." + w.params.slideDuplicateClass + '[data-swiper-slide-index="' + t + '"]');
                                                w.lazy.loadImageInSlide(l.index(), !1)
                                            }
                                        }
                                        w.emit("onLazyImageReady", w, n[0], e[0])
                                    }), w.emit("onLazyImageLoad", w, n[0], e[0])
                                })
                            }
                        },
                        load: function() {
                            var e;
                            if (w.params.watchSlidesVisibility) w.wrapper.children("." + w.params.slideVisibleClass).each(function() {
                                w.lazy.loadImageInSlide(t(this).index())
                            });
                            else if (w.params.slidesPerView > 1)
                                for (e = w.activeIndex; e < w.activeIndex + w.params.slidesPerView; e++) w.slides[e] && w.lazy.loadImageInSlide(e);
                            else w.lazy.loadImageInSlide(w.activeIndex);
                            if (w.params.lazyLoadingInPrevNext)
                                if (w.params.slidesPerView > 1 || w.params.lazyLoadingInPrevNextAmount && w.params.lazyLoadingInPrevNextAmount > 1) {
                                    var i = w.params.lazyLoadingInPrevNextAmount,
                                        n = w.params.slidesPerView,
                                        o = Math.min(w.activeIndex + n + Math.max(i, n), w.slides.length),
                                        a = Math.max(w.activeIndex - Math.max(n, i), 0);
                                    for (e = w.activeIndex + w.params.slidesPerView; o > e; e++) w.slides[e] && w.lazy.loadImageInSlide(e);
                                    for (e = a; e < w.activeIndex; e++) w.slides[e] && w.lazy.loadImageInSlide(e)
                                } else {
                                    var r = w.wrapper.children("." + w.params.slideNextClass);
                                    r.length > 0 && w.lazy.loadImageInSlide(r.index());
                                    var s = w.wrapper.children("." + w.params.slidePrevClass);
                                    s.length > 0 && w.lazy.loadImageInSlide(s.index())
                                }
                        },
                        onTransitionStart: function() {
                            w.params.lazyLoading && (w.params.lazyLoadingOnTransitionStart || !w.params.lazyLoadingOnTransitionStart && !w.lazy.initialImageLoaded) && w.lazy.load()
                        },
                        onTransitionEnd: function() {
                            w.params.lazyLoading && !w.params.lazyLoadingOnTransitionStart && w.lazy.load()
                        }
                    }, w.scrollbar = {
                        isTouched: !1,
                        setDragPosition: function(e) {
                            var t = w.scrollbar,
                                i = w.isHorizontal() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX || e.clientX : "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY || e.clientY,
                                n = i - t.track.offset()[w.isHorizontal() ? "left" : "top"] - t.dragSize / 2,
                                o = -w.minTranslate() * t.moveDivider,
                                a = -w.maxTranslate() * t.moveDivider;
                            o > n ? n = o : n > a && (n = a), n = -n / t.moveDivider, w.updateProgress(n), w.setWrapperTranslate(n, !0)
                        },
                        dragStart: function(e) {
                            var t = w.scrollbar;
                            t.isTouched = !0, e.preventDefault(), e.stopPropagation(), t.setDragPosition(e), clearTimeout(t.dragTimeout), t.track.transition(0), w.params.scrollbarHide && t.track.css("opacity", 1), w.wrapper.transition(100), t.drag.transition(100), w.emit("onScrollbarDragStart", w)
                        },
                        dragMove: function(e) {
                            var t = w.scrollbar;
                            t.isTouched && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, t.setDragPosition(e), w.wrapper.transition(0), t.track.transition(0), t.drag.transition(0), w.emit("onScrollbarDragMove", w))
                        },
                        dragEnd: function(e) {
                            var t = w.scrollbar;
                            t.isTouched && (t.isTouched = !1, w.params.scrollbarHide && (clearTimeout(t.dragTimeout), t.dragTimeout = setTimeout(function() {
                                t.track.css("opacity", 0), t.track.transition(400)
                            }, 1e3)), w.emit("onScrollbarDragEnd", w), w.params.scrollbarSnapOnRelease && w.slideReset())
                        },
                        enableDraggable: function() {
                            var e = w.scrollbar,
                                i = w.support.touch ? e.track : document;
                            t(e.track).on(w.touchEvents.start, e.dragStart), t(i).on(w.touchEvents.move, e.dragMove), t(i).on(w.touchEvents.end, e.dragEnd)
                        },
                        disableDraggable: function() {
                            var e = w.scrollbar,
                                i = w.support.touch ? e.track : document;
                            t(e.track).off(w.touchEvents.start, e.dragStart), t(i).off(w.touchEvents.move, e.dragMove), t(i).off(w.touchEvents.end, e.dragEnd)
                        },
                        set: function() {
                            if (w.params.scrollbar) {
                                var e = w.scrollbar;
                                e.track = t(w.params.scrollbar), w.params.uniqueNavElements && "string" == typeof w.params.scrollbar && e.track.length > 1 && 1 === w.container.find(w.params.scrollbar).length && (e.track = w.container.find(w.params.scrollbar)), e.drag = e.track.find(".swiper-scrollbar-drag"), 0 === e.drag.length && (e.drag = t('<div class="swiper-scrollbar-drag"></div>'), e.track.append(e.drag)), e.drag[0].style.width = "", e.drag[0].style.height = "", e.trackSize = w.isHorizontal() ? e.track[0].offsetWidth : e.track[0].offsetHeight, e.divider = w.size / w.virtualSize, e.moveDivider = e.divider * (e.trackSize / w.size), e.dragSize = e.trackSize * e.divider, w.isHorizontal() ? e.drag[0].style.width = e.dragSize + "px" : e.drag[0].style.height = e.dragSize + "px", e.divider >= 1 ? e.track[0].style.display = "none" : e.track[0].style.display = "", w.params.scrollbarHide && (e.track[0].style.opacity = 0)
                            }
                        },
                        setTranslate: function() {
                            if (w.params.scrollbar) {
                                var e, t = w.scrollbar,
                                    i = (w.translate || 0, t.dragSize);
                                e = (t.trackSize - t.dragSize) * w.progress, w.rtl && w.isHorizontal() ? (e = -e, e > 0 ? (i = t.dragSize - e, e = 0) : -e + t.dragSize > t.trackSize && (i = t.trackSize + e)) : 0 > e ? (i = t.dragSize + e, e = 0) : e + t.dragSize > t.trackSize && (i = t.trackSize - e), w.isHorizontal() ? (w.support.transforms3d ? t.drag.transform("translate3d(" + e + "px, 0, 0)") : t.drag.transform("translateX(" + e + "px)"), t.drag[0].style.width = i + "px") : (w.support.transforms3d ? t.drag.transform("translate3d(0px, " + e + "px, 0)") : t.drag.transform("translateY(" + e + "px)"), t.drag[0].style.height = i + "px"), w.params.scrollbarHide && (clearTimeout(t.timeout), t.track[0].style.opacity = 1, t.timeout = setTimeout(function() {
                                    t.track[0].style.opacity = 0, t.track.transition(400)
                                }, 1e3))
                            }
                        },
                        setTransition: function(e) {
                            w.params.scrollbar && w.scrollbar.drag.transition(e)
                        }
                    }, w.controller = {
                        LinearSpline: function(e, t) {
                            this.x = e, this.y = t, this.lastIndex = e.length - 1;
                            var i, n;
                            this.x.length, this.interpolate = function(e) {
                                return e ? (n = o(this.x, e), i = n - 1, (e - this.x[i]) * (this.y[n] - this.y[i]) / (this.x[n] - this.x[i]) + this.y[i]) : 0
                            };
                            var o = function() {
                                var e, t, i;
                                return function(n, o) {
                                    for (t = -1, e = n.length; e - t > 1;) n[i = e + t >> 1] <= o ? t = i : e = i;
                                    return e
                                }
                            }()
                        },
                        getInterpolateFunction: function(e) {
                            w.controller.spline || (w.controller.spline = w.params.loop ? new w.controller.LinearSpline(w.slidesGrid, e.slidesGrid) : new w.controller.LinearSpline(w.snapGrid, e.snapGrid))
                        },
                        setTranslate: function(e, t) {
                            function n(t) {
                                e = t.rtl && "horizontal" === t.params.direction ? -w.translate : w.translate, "slide" === w.params.controlBy && (w.controller.getInterpolateFunction(t), a = -w.controller.spline.interpolate(-e)), a && "container" !== w.params.controlBy || (o = (t.maxTranslate() - t.minTranslate()) / (w.maxTranslate() - w.minTranslate()), a = (e - w.minTranslate()) * o + t.minTranslate()), w.params.controlInverse && (a = t.maxTranslate() - a), t.updateProgress(a), t.setWrapperTranslate(a, !1, w), t.updateActiveIndex()
                            }
                            var o, a, r = w.params.control;
                            if (w.isArray(r))
                                for (var s = 0; s < r.length; s++) r[s] !== t && r[s] instanceof i && n(r[s]);
                            else r instanceof i && t !== r && n(r)
                        },
                        setTransition: function(e, t) {
                            function n(t) {
                                t.setWrapperTransition(e, w), 0 !== e && (t.onTransitionStart(), t.wrapper.transitionEnd(function() {
                                    a && (t.params.loop && "slide" === w.params.controlBy && t.fixLoop(), t.onTransitionEnd())
                                }))
                            }
                            var o, a = w.params.control;
                            if (w.isArray(a))
                                for (o = 0; o < a.length; o++) a[o] !== t && a[o] instanceof i && n(a[o]);
                            else a instanceof i && t !== a && n(a)
                        }
                    }, w.hashnav = {
                        init: function() {
                            if (w.params.hashnav) {
                                w.hashnav.initialized = !0;
                                var e = document.location.hash.replace("#", "");
                                if (e)
                                    for (var t = 0, i = 0, n = w.slides.length; n > i; i++) {
                                        var o = w.slides.eq(i),
                                            a = o.attr("data-hash");
                                        if (a === e && !o.hasClass(w.params.slideDuplicateClass)) {
                                            var r = o.index();
                                            w.slideTo(r, t, w.params.runCallbacksOnInit, !0)
                                        }
                                    }
                            }
                        },
                        setHash: function() {
                            w.hashnav.initialized && w.params.hashnav && (document.location.hash = w.slides.eq(w.activeIndex).attr("data-hash") || "")
                        }
                    }, w.disableKeyboardControl = function() {
                        w.params.keyboardControl = !1, t(document).off("keydown", l)
                    }, w.enableKeyboardControl = function() {
                        w.params.keyboardControl = !0, t(document).on("keydown", l)
                    }, w.mousewheel = {
                        event: !1,
                        lastScrollTime: (new window.Date).getTime()
                    }, w.params.mousewheelControl) {
                    try {
                        new window.WheelEvent("wheel"), w.mousewheel.event = "wheel"
                    } catch (N) {
                        (window.WheelEvent || w.container[0] && "wheel" in w.container[0]) && (w.mousewheel.event = "wheel")
                    }!w.mousewheel.event && window.WheelEvent, w.mousewheel.event || void 0 === document.onmousewheel || (w.mousewheel.event = "mousewheel"), w.mousewheel.event || (w.mousewheel.event = "DOMMouseScroll")
                }
                w.disableMousewheelControl = function() {
                    return w.mousewheel.event ? (w.container.off(w.mousewheel.event, p), !0) : !1
                }, w.enableMousewheelControl = function() {
                    return w.mousewheel.event ? (w.container.on(w.mousewheel.event, p), !0) : !1
                }, w.parallax = {
                    setTranslate: function() {
                        w.container.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                            d(this, w.progress)
                        }), w.slides.each(function() {
                            var e = t(this);
                            e.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                                var t = Math.min(Math.max(e[0].progress, -1), 1);
                                d(this, t)
                            })
                        })
                    },
                    setTransition: function(e) {
                        "undefined" == typeof e && (e = w.params.speed), w.container.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                            var i = t(this),
                                n = parseInt(i.attr("data-swiper-parallax-duration"), 10) || e;
                            0 === e && (n = 0), i.transition(n)
                        })
                    }
                }, w._plugins = [];
                for (var W in w.plugins) {
                    var R = w.plugins[W](w, w.params[W]);
                    R && w._plugins.push(R)
                }
                return w.callPlugins = function(e) {
                    for (var t = 0; t < w._plugins.length; t++) e in w._plugins[t] && w._plugins[t][e](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
                }, w.emitterEventListeners = {}, w.emit = function(e) {
                    w.params[e] && w.params[e](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                    var t;
                    if (w.emitterEventListeners[e])
                        for (t = 0; t < w.emitterEventListeners[e].length; t++) w.emitterEventListeners[e][t](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                    w.callPlugins && w.callPlugins(e, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
                }, w.on = function(e, t) {
                    return e = u(e), w.emitterEventListeners[e] || (w.emitterEventListeners[e] = []), w.emitterEventListeners[e].push(t), w
                }, w.off = function(e, t) {
                    var i;
                    if (e = u(e), "undefined" == typeof t) return w.emitterEventListeners[e] = [], w;
                    if (w.emitterEventListeners[e] && 0 !== w.emitterEventListeners[e].length) {
                        for (i = 0; i < w.emitterEventListeners[e].length; i++) w.emitterEventListeners[e][i] === t && w.emitterEventListeners[e].splice(i, 1);
                        return w
                    }
                }, w.once = function(e, t) {
                    e = u(e);
                    var i = function() {
                        t(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]), w.off(e, i)
                    };
                    return w.on(e, i), w
                }, w.a11y = {
                    makeFocusable: function(e) {
                        return e.attr("tabIndex", "0"), e
                    },
                    addRole: function(e, t) {
                        return e.attr("role", t), e
                    },
                    addLabel: function(e, t) {
                        return e.attr("aria-label", t), e
                    },
                    disable: function(e) {
                        return e.attr("aria-disabled", !0), e
                    },
                    enable: function(e) {
                        return e.attr("aria-disabled", !1), e
                    },
                    onEnterKey: function(e) {
                        13 === e.keyCode && (t(e.target).is(w.params.nextButton) ? (w.onClickNext(e), w.isEnd ? w.a11y.notify(w.params.lastSlideMessage) : w.a11y.notify(w.params.nextSlideMessage)) : t(e.target).is(w.params.prevButton) && (w.onClickPrev(e), w.isBeginning ? w.a11y.notify(w.params.firstSlideMessage) : w.a11y.notify(w.params.prevSlideMessage)), t(e.target).is("." + w.params.bulletClass) && t(e.target)[0].click())
                    },
                    liveRegion: t('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),
                    notify: function(e) {
                        var t = w.a11y.liveRegion;
                        0 !== t.length && (t.html(""), t.html(e))
                    },
                    init: function() {
                        w.params.nextButton && w.nextButton && w.nextButton.length > 0 && (w.a11y.makeFocusable(w.nextButton), w.a11y.addRole(w.nextButton, "button"), w.a11y.addLabel(w.nextButton, w.params.nextSlideMessage)), w.params.prevButton && w.prevButton && w.prevButton.length > 0 && (w.a11y.makeFocusable(w.prevButton), w.a11y.addRole(w.prevButton, "button"), w.a11y.addLabel(w.prevButton, w.params.prevSlideMessage)), t(w.container).append(w.a11y.liveRegion)
                    },
                    initPagination: function() {
                        w.params.pagination && w.params.paginationClickable && w.bullets && w.bullets.length && w.bullets.each(function() {
                            var e = t(this);
                            w.a11y.makeFocusable(e), w.a11y.addRole(e, "button"), w.a11y.addLabel(e, w.params.paginationBulletMessage.replace(/{{index}}/, e.index() + 1))
                        })
                    },
                    destroy: function() {
                        w.a11y.liveRegion && w.a11y.liveRegion.length > 0 && w.a11y.liveRegion.remove()
                    }
                }, w.init = function() {
                    w.params.loop && w.createLoop(), w.updateContainerSize(), w.updateSlidesSize(), w.updatePagination(), w.params.scrollbar && w.scrollbar && (w.scrollbar.set(), w.params.scrollbarDraggable && w.scrollbar.enableDraggable()), "slide" !== w.params.effect && w.effects[w.params.effect] && (w.params.loop || w.updateProgress(), w.effects[w.params.effect].setTranslate()), w.params.loop ? w.slideTo(w.params.initialSlide + w.loopedSlides, 0, w.params.runCallbacksOnInit) : (w.slideTo(w.params.initialSlide, 0, w.params.runCallbacksOnInit), 0 === w.params.initialSlide && (w.parallax && w.params.parallax && w.parallax.setTranslate(), w.lazy && w.params.lazyLoading && (w.lazy.load(), w.lazy.initialImageLoaded = !0))), w.attachEvents(), w.params.observer && w.support.observer && w.initObservers(), w.params.preloadImages && !w.params.lazyLoading && w.preloadImages(), w.params.autoplay && w.startAutoplay(), w.params.keyboardControl && w.enableKeyboardControl && w.enableKeyboardControl(), w.params.mousewheelControl && w.enableMousewheelControl && w.enableMousewheelControl(), w.params.hashnav && w.hashnav && w.hashnav.init(), w.params.a11y && w.a11y && w.a11y.init(), w.emit("onInit", w)
                }, w.cleanupStyles = function() {
                    w.container.removeClass(w.classNames.join(" ")).removeAttr("style"), w.wrapper.removeAttr("style"), w.slides && w.slides.length && w.slides.removeClass([w.params.slideVisibleClass, w.params.slideActiveClass, w.params.slideNextClass, w.params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-column").removeAttr("data-swiper-row"), w.paginationContainer && w.paginationContainer.length && w.paginationContainer.removeClass(w.params.paginationHiddenClass), w.bullets && w.bullets.length && w.bullets.removeClass(w.params.bulletActiveClass), w.params.prevButton && t(w.params.prevButton).removeClass(w.params.buttonDisabledClass), w.params.nextButton && t(w.params.nextButton).removeClass(w.params.buttonDisabledClass), w.params.scrollbar && w.scrollbar && (w.scrollbar.track && w.scrollbar.track.length && w.scrollbar.track.removeAttr("style"), w.scrollbar.drag && w.scrollbar.drag.length && w.scrollbar.drag.removeAttr("style"))
                }, w.destroy = function(e, t) {
                    w.detachEvents(), w.stopAutoplay(), w.params.scrollbar && w.scrollbar && w.params.scrollbarDraggable && w.scrollbar.disableDraggable(), w.params.loop && w.destroyLoop(), t && w.cleanupStyles(), w.disconnectObservers(), w.params.keyboardControl && w.disableKeyboardControl && w.disableKeyboardControl(), w.params.mousewheelControl && w.disableMousewheelControl && w.disableMousewheelControl(), w.params.a11y && w.a11y && w.a11y.destroy(), w.emit("onDestroy"), e !== !1 && (w = null)
                }, w.init(), w
            }
        };
        i.prototype = {
            isSafari: function() {
                var e = navigator.userAgent.toLowerCase();
                return e.indexOf("safari") >= 0 && e.indexOf("chrome") < 0 && e.indexOf("android") < 0
            }(),
            isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
            isArray: function(e) {
                return "[object Array]" === Object.prototype.toString.apply(e)
            },
            browser: {
                ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
                ieTouch: window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1
            },
            device: function() {
                var e = navigator.userAgent,
                    t = e.match(/(Android);?[\s\/]+([\d.]+)?/),
                    i = e.match(/(iPad).*OS\s([\d_]+)/),
                    n = e.match(/(iPod)(.*OS\s([\d_]+))?/),
                    o = !i && e.match(/(iPhone\sOS)\s([\d_]+)/);
                return {
                    ios: i || o || n,
                    android: t
                }
            }(),
            support: {
                touch: window.Modernizr && Modernizr.touch === !0 || function() {
                    return !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch)
                }(),
                transforms3d: window.Modernizr && Modernizr.csstransforms3d === !0 || function() {
                    var e = document.createElement("div").style;
                    return "webkitPerspective" in e || "MozPerspective" in e || "OPerspective" in e || "MsPerspective" in e || "perspective" in e
                }(),
                flexbox: function() {
                    for (var e = document.createElement("div").style, t = "alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "), i = 0; i < t.length; i++)
                        if (t[i] in e) return !0
                }(),
                observer: function() {
                    return "MutationObserver" in window || "WebkitMutationObserver" in window
                }()
            },
            plugins: {}
        };
        for (var n = ["jQuery", "Zepto", "Dom7"], o = 0; o < n.length; o++) window[n[o]] && e(window[n[o]]);
        var a;
        a = "undefined" == typeof Dom7 ? window.Dom7 || window.Zepto || window.jQuery : Dom7, a && ("transitionEnd" in a.fn || (a.fn.transitionEnd = function(e) {
            function t(a) {
                if (a.target === this)
                    for (e.call(this, a), i = 0; i < n.length; i++) o.off(n[i], t)
            }
            var i, n = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"],
                o = this;
            if (e)
                for (i = 0; i < n.length; i++) o.on(n[i], t);
            return this
        }), "transform" in a.fn || (a.fn.transform = function(e) {
            for (var t = 0; t < this.length; t++) {
                var i = this[t].style;
                i.webkitTransform = i.MsTransform = i.msTransform = i.MozTransform = i.OTransform = i.transform = e
            }
            return this
        }), "transition" in a.fn || (a.fn.transition = function(e) {
            "string" != typeof e && (e += "ms");
            for (var t = 0; t < this.length; t++) {
                var i = this[t].style;
                i.webkitTransitionDuration = i.MsTransitionDuration = i.msTransitionDuration = i.MozTransitionDuration = i.OTransitionDuration = i.transitionDuration = e
            }
            return this
        })), window.Swiper = i
    }(), "undefined" != typeof module ? module.exports = window.Swiper : "function" == typeof define && define.amd && define([], function() {
        "use strict";
        return window.Swiper
    }), ! function(e) {
        function t(e) {
            var t = e.length,
                n = i.type(e);
            return "function" === n || i.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
        }
        if (!e.jQuery) {
            var i = function(e, t) {
                return new i.fn.init(e, t)
            };
            i.isWindow = function(e) {
                return null != e && e == e.window
            }, i.type = function(e) {
                return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? o[r.call(e)] || "object" : typeof e
            }, i.isArray = Array.isArray || function(e) {
                return "array" === i.type(e)
            }, i.isPlainObject = function(e) {
                var t;
                if (!e || "object" !== i.type(e) || e.nodeType || i.isWindow(e)) return !1;
                try {
                    if (e.constructor && !a.call(e, "constructor") && !a.call(e.constructor.prototype, "isPrototypeOf")) return !1
                } catch (n) {
                    return !1
                }
                for (t in e);
                return void 0 === t || a.call(e, t)
            }, i.each = function(e, i, n) {
                var o, a = 0,
                    r = e.length,
                    s = t(e);
                if (n) {
                    if (s)
                        for (; r > a && (o = i.apply(e[a], n), o !== !1); a++);
                    else
                        for (a in e)
                            if (o = i.apply(e[a], n), o === !1) break
                } else if (s)
                    for (; r > a && (o = i.call(e[a], a, e[a]), o !== !1); a++);
                else
                    for (a in e)
                        if (o = i.call(e[a], a, e[a]), o === !1) break;
                return e
            }, i.data = function(e, t, o) {
                if (void 0 === o) {
                    var a = e[i.expando],
                        r = a && n[a];
                    if (void 0 === t) return r;
                    if (r && t in r) return r[t]
                } else if (void 0 !== t) {
                    var a = e[i.expando] || (e[i.expando] = ++i.uuid);
                    return n[a] = n[a] || {}, n[a][t] = o, o
                }
            }, i.removeData = function(e, t) {
                var o = e[i.expando],
                    a = o && n[o];
                a && i.each(t, function(e, t) {
                    delete a[t]
                })
            }, i.extend = function() {
                var e, t, n, o, a, r, s = arguments[0] || {},
                    l = 1,
                    p = arguments.length,
                    d = !1;
                for ("boolean" == typeof s && (d = s, s = arguments[l] || {}, l++), "object" != typeof s && "function" !== i.type(s) && (s = {}), l === p && (s = this, l--); p > l; l++)
                    if (null != (a = arguments[l]))
                        for (o in a) e = s[o], n = a[o], s !== n && (d && n && (i.isPlainObject(n) || (t = i.isArray(n))) ? (t ? (t = !1, r = e && i.isArray(e) ? e : []) : r = e && i.isPlainObject(e) ? e : {}, s[o] = i.extend(d, r, n)) : void 0 !== n && (s[o] = n));
                return s
            }, i.queue = function(e, n, o) {
                function a(e, i) {
                    var n = i || [];
                    return null != e && (t(Object(e)) ? ! function(e, t) {
                        for (var i = +t.length, n = 0, o = e.length; i > n;) e[o++] = t[n++];
                        if (i !== i)
                            for (; void 0 !== t[n];) e[o++] = t[n++];
                        return e.length = o, e
                    }(n, "string" == typeof e ? [e] : e) : [].push.call(n, e)), n
                }
                if (e) {
                    n = (n || "fx") + "queue";
                    var r = i.data(e, n);
                    return o ? (!r || i.isArray(o) ? r = i.data(e, n, a(o)) : r.push(o), r) : r || []
                }
            }, i.dequeue = function(e, t) {
                i.each(e.nodeType ? [e] : e, function(e, n) {
                    t = t || "fx";
                    var o = i.queue(n, t),
                        a = o.shift();
                    "inprogress" === a && (a = o.shift()), a && ("fx" === t && o.unshift("inprogress"), a.call(n, function() {
                        i.dequeue(n, t)
                    }))
                })
            }, i.fn = i.prototype = {
                init: function(e) {
                    if (e.nodeType) return this[0] = e, this;
                    throw new Error("Not a DOM node.")
                },
                offset: function() {
                    var t = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : {
                        top: 0,
                        left: 0
                    };
                    return {
                        top: t.top + (e.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
                        left: t.left + (e.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
                    }
                },
                position: function() {
                    function e() {
                        for (var e = this.offsetParent || document; e && "html" === !e.nodeType.toLowerCase && "static" === e.style.position;) e = e.offsetParent;
                        return e || document
                    }
                    var t = this[0],
                        e = e.apply(t),
                        n = this.offset(),
                        o = /^(?:body|html)$/i.test(e.nodeName) ? {
                            top: 0,
                            left: 0
                        } : i(e).offset();
                    return n.top -= parseFloat(t.style.marginTop) || 0, n.left -= parseFloat(t.style.marginLeft) || 0, e.style && (o.top += parseFloat(e.style.borderTopWidth) || 0, o.left += parseFloat(e.style.borderLeftWidth) || 0), {
                        top: n.top - o.top,
                        left: n.left - o.left
                    }
                }
            };
            var n = {};
            i.expando = "velocity" + (new Date).getTime(), i.uuid = 0;
            for (var o = {}, a = o.hasOwnProperty, r = o.toString, s = "Boolean Number String Function Array Date RegExp Object Error".split(" "), l = 0; l < s.length; l++) o["[object " + s[l] + "]"] = s[l].toLowerCase();
            i.fn.init.prototype = i.fn, e.Velocity = {
                Utilities: i
            }
        }
    }(window),
    function(e) {
        "object" == typeof module && "object" == typeof module.exports ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : e()
    }(function() {
        return function(e, t, i, n) {
            function o(e) {
                for (var t = -1, i = e ? e.length : 0, n = []; ++t < i;) {
                    var o = e[t];
                    o && n.push(o)
                }
                return n
            }

            function a(e) {
                return m.isWrapped(e) ? e = [].slice.call(e) : m.isNode(e) && (e = [e]), e
            }

            function r(e) {
                var t = c.data(e, "velocity");
                return null === t ? n : t
            }

            function s(e) {
                return function(t) {
                    return Math.round(t * e) * (1 / e)
                }
            }

            function l(e, i, n, o) {
                function a(e, t) {
                    return 1 - 3 * t + 3 * e
                }

                function r(e, t) {
                    return 3 * t - 6 * e
                }

                function s(e) {
                    return 3 * e
                }

                function l(e, t, i) {
                    return ((a(t, i) * e + r(t, i)) * e + s(t)) * e
                }

                function p(e, t, i) {
                    return 3 * a(t, i) * e * e + 2 * r(t, i) * e + s(t)
                }

                function d(t, i) {
                    for (var o = 0; m > o; ++o) {
                        var a = p(i, e, n);
                        if (0 === a) return i;
                        var r = l(i, e, n) - t;
                        i -= r / a
                    }
                    return i
                }

                function u() {
                    for (var t = 0; w > t; ++t) T[t] = l(t * b, e, n)
                }

                function c(t, i, o) {
                    var a, r, s = 0;
                    do r = i + (o - i) / 2, a = l(r, e, n) - t, a > 0 ? o = r : i = r; while (Math.abs(a) > v && ++s < y);
                    return r
                }

                function f(t) {
                    for (var i = 0, o = 1, a = w - 1; o != a && T[o] <= t; ++o) i += b;
                    --o;
                    var r = (t - T[o]) / (T[o + 1] - T[o]),
                        s = i + r * b,
                        l = p(s, e, n);
                    return l >= g ? d(t, s) : 0 == l ? s : c(t, i, i + b)
                }

                function h() {
                    C = !0, (e != i || n != o) && u()
                }
                var m = 4,
                    g = .001,
                    v = 1e-7,
                    y = 10,
                    w = 11,
                    b = 1 / (w - 1),
                    x = "Float32Array" in t;
                if (4 !== arguments.length) return !1;
                for (var S = 0; 4 > S; ++S)
                    if ("number" != typeof arguments[S] || isNaN(arguments[S]) || !isFinite(arguments[S])) return !1;
                e = Math.min(e, 1), n = Math.min(n, 1), e = Math.max(e, 0), n = Math.max(n, 0);
                var T = x ? new Float32Array(w) : new Array(w),
                    C = !1,
                    P = function(t) {
                        return C || h(), e === i && n === o ? t : 0 === t ? 0 : 1 === t ? 1 : l(f(t), i, o)
                    };
                P.getControlPoints = function() {
                    return [{
                        x: e,
                        y: i
                    }, {
                        x: n,
                        y: o
                    }]
                };
                var I = "generateBezier(" + [e, i, n, o] + ")";
                return P.toString = function() {
                    return I
                }, P
            }

            function p(e, t) {
                var i = e;
                return m.isString(e) ? w.Easings[e] || (i = !1) : i = m.isArray(e) && 1 === e.length ? s.apply(null, e) : m.isArray(e) && 2 === e.length ? b.apply(null, e.concat([t])) : m.isArray(e) && 4 === e.length ? l.apply(null, e) : !1, i === !1 && (i = w.Easings[w.defaults.easing] ? w.defaults.easing : y), i
            }

            function d(e) {
                if (e) {
                    var t = (new Date).getTime(),
                        i = w.State.calls.length;
                    i > 1e4 && (w.State.calls = o(w.State.calls));
                    for (var a = 0; i > a; a++)
                        if (w.State.calls[a]) {
                            var s = w.State.calls[a],
                                l = s[0],
                                p = s[2],
                                f = s[3],
                                h = !!f,
                                g = null;
                            f || (f = w.State.calls[a][3] = t - 16);
                            for (var v = Math.min((t - f) / p.duration, 1), y = 0, b = l.length; b > y; y++) {
                                var S = l[y],
                                    C = S.element;
                                if (r(C)) {
                                    var P = !1;
                                    if (p.display !== n && null !== p.display && "none" !== p.display) {
                                        if ("flex" === p.display) {
                                            var I = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];
                                            c.each(I, function(e, t) {
                                                x.setPropertyValue(C, "display", t)
                                            })
                                        }
                                        x.setPropertyValue(C, "display", p.display)
                                    }
                                    p.visibility !== n && "hidden" !== p.visibility && x.setPropertyValue(C, "visibility", p.visibility);
                                    for (var E in S)
                                        if ("element" !== E) {
                                            var k, z = S[E],
                                                M = m.isString(z.easing) ? w.Easings[z.easing] : z.easing;
                                            if (1 === v) k = z.endValue;
                                            else {
                                                var L = z.endValue - z.startValue;
                                                if (k = z.startValue + L * M(v, p, L), !h && k === z.currentValue) continue
                                            }
                                            if (z.currentValue = k, "tween" === E) g = k;
                                            else {
                                                if (x.Hooks.registered[E]) {
                                                    var A = x.Hooks.getRoot(E),
                                                        _ = r(C).rootPropertyValueCache[A];
                                                    _ && (z.rootPropertyValue = _)
                                                }
                                                var O = x.setPropertyValue(C, E, z.currentValue + (0 === parseFloat(k) ? "" : z.unitType), z.rootPropertyValue, z.scrollData);
                                                x.Hooks.registered[E] && (r(C).rootPropertyValueCache[A] = x.Normalizations.registered[A] ? x.Normalizations.registered[A]("extract", null, O[1]) : O[1]), "transform" === O[0] && (P = !0)
                                            }
                                        }
                                    p.mobileHA && r(C).transformCache.translate3d === n && (r(C).transformCache.translate3d = "(0px, 0px, 0px)", P = !0), P && x.flushTransformCache(C)
                                }
                            }
                            p.display !== n && "none" !== p.display && (w.State.calls[a][2].display = !1), p.visibility !== n && "hidden" !== p.visibility && (w.State.calls[a][2].visibility = !1), p.progress && p.progress.call(s[1], s[1], v, Math.max(0, f + p.duration - t), f, g), 1 === v && u(a)
                        }
                }
                w.State.isTicking && T(d)
            }

            function u(e, t) {
                if (!w.State.calls[e]) return !1;
                for (var i = w.State.calls[e][0], o = w.State.calls[e][1], a = w.State.calls[e][2], s = w.State.calls[e][4], l = !1, p = 0, d = i.length; d > p; p++) {
                    var u = i[p].element;
                    if (t || a.loop || ("none" === a.display && x.setPropertyValue(u, "display", a.display), "hidden" === a.visibility && x.setPropertyValue(u, "visibility", a.visibility)), a.loop !== !0 && (c.queue(u)[1] === n || !/\.velocityQueueEntryFlag/i.test(c.queue(u)[1])) && r(u)) {
                        r(u).isAnimating = !1, r(u).rootPropertyValueCache = {};
                        var f = !1;
                        c.each(x.Lists.transforms3D, function(e, t) {
                            var i = /^scale/.test(t) ? 1 : 0,
                                o = r(u).transformCache[t];
                            r(u).transformCache[t] !== n && new RegExp("^\\(" + i + "[^.]").test(o) && (f = !0, delete r(u).transformCache[t])
                        }), a.mobileHA && (f = !0, delete r(u).transformCache.translate3d), f && x.flushTransformCache(u), x.Values.removeClass(u, "velocity-animating")
                    }
                    if (!t && a.complete && !a.loop && p === d - 1) try {
                        a.complete.call(o, o)
                    } catch (h) {
                        setTimeout(function() {
                            throw h
                        }, 1)
                    }
                    s && a.loop !== !0 && s(o), r(u) && a.loop === !0 && !t && (c.each(r(u).tweensContainer, function(e, t) {
                        /^rotate/.test(e) && 360 === parseFloat(t.endValue) && (t.endValue = 0, t.startValue = 360), /^backgroundPosition/.test(e) && 100 === parseFloat(t.endValue) && "%" === t.unitType && (t.endValue = 0, t.startValue = 100)
                    }), w(u, "reverse", {
                        loop: !0,
                        delay: a.delay
                    })), a.queue !== !1 && c.dequeue(u, a.queue)
                }
                w.State.calls[e] = !1;
                for (var m = 0, g = w.State.calls.length; g > m; m++)
                    if (w.State.calls[m] !== !1) {
                        l = !0;
                        break
                    }
                l === !1 && (w.State.isTicking = !1, delete w.State.calls, w.State.calls = [])
            }
            var c, f = function() {
                    if (i.documentMode) return i.documentMode;
                    for (var e = 7; e > 4; e--) {
                        var t = i.createElement("div");
                        if (t.innerHTML = "<!--[if IE " + e + "]><span></span><![endif]-->", t.getElementsByTagName("span").length) return t = null, e
                    }
                    return n
                }(),
                h = function() {
                    var e = 0;
                    return t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || function(t) {
                        var i, n = (new Date).getTime();
                        return i = Math.max(0, 16 - (n - e)), e = n + i, setTimeout(function() {
                            t(n + i)
                        }, i)
                    }
                }(),
                m = {
                    isString: function(e) {
                        return "string" == typeof e
                    },
                    isArray: Array.isArray || function(e) {
                        return "[object Array]" === Object.prototype.toString.call(e)
                    },
                    isFunction: function(e) {
                        return "[object Function]" === Object.prototype.toString.call(e)
                    },
                    isNode: function(e) {
                        return e && e.nodeType
                    },
                    isNodeList: function(e) {
                        return "object" == typeof e && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(e)) && e.length !== n && (0 === e.length || "object" == typeof e[0] && e[0].nodeType > 0)
                    },
                    isWrapped: function(e) {
                        return e && (e.jquery || t.Zepto && t.Zepto.zepto.isZ(e))
                    },
                    isSVG: function(e) {
                        return t.SVGElement && e instanceof t.SVGElement
                    },
                    isEmptyObject: function(e) {
                        for (var t in e) return !1;
                        return !0
                    }
                },
                g = !1;
            if (e.fn && e.fn.jquery ? (c = e, g = !0) : c = t.Velocity.Utilities, 8 >= f && !g) throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
            if (7 >= f) return void(jQuery.fn.velocity = jQuery.fn.animate);
            var v = 400,
                y = "swing",
                w = {
                    State: {
                        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                        isAndroid: /Android/i.test(navigator.userAgent),
                        isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
                        isChrome: t.chrome,
                        isFirefox: /Firefox/i.test(navigator.userAgent),
                        prefixElement: i.createElement("div"),
                        prefixMatches: {},
                        scrollAnchor: null,
                        scrollPropertyLeft: null,
                        scrollPropertyTop: null,
                        isTicking: !1,
                        calls: []
                    },
                    CSS: {},
                    Utilities: c,
                    Redirects: {},
                    Easings: {},
                    Promise: t.Promise,
                    defaults: {
                        queue: "",
                        duration: v,
                        easing: y,
                        begin: n,
                        complete: n,
                        progress: n,
                        display: n,
                        visibility: n,
                        loop: !1,
                        delay: !1,
                        mobileHA: !0,
                        _cacheValues: !0
                    },
                    init: function(e) {
                        c.data(e, "velocity", {
                            isSVG: m.isSVG(e),
                            isAnimating: !1,
                            computedStyle: null,
                            tweensContainer: null,
                            rootPropertyValueCache: {},
                            transformCache: {}
                        })
                    },
                    hook: null,
                    mock: !1,
                    version: {
                        major: 1,
                        minor: 2,
                        patch: 2
                    },
                    debug: !1
                };
            t.pageYOffset !== n ? (w.State.scrollAnchor = t, w.State.scrollPropertyLeft = "pageXOffset", w.State.scrollPropertyTop = "pageYOffset") : (w.State.scrollAnchor = i.documentElement || i.body.parentNode || i.body, w.State.scrollPropertyLeft = "scrollLeft", w.State.scrollPropertyTop = "scrollTop");
            var b = function() {
                function e(e) {
                    return -e.tension * e.x - e.friction * e.v
                }

                function t(t, i, n) {
                    var o = {
                        x: t.x + n.dx * i,
                        v: t.v + n.dv * i,
                        tension: t.tension,
                        friction: t.friction
                    };
                    return {
                        dx: o.v,
                        dv: e(o)
                    }
                }

                function i(i, n) {
                    var o = {
                            dx: i.v,
                            dv: e(i)
                        },
                        a = t(i, .5 * n, o),
                        r = t(i, .5 * n, a),
                        s = t(i, n, r),
                        l = 1 / 6 * (o.dx + 2 * (a.dx + r.dx) + s.dx),
                        p = 1 / 6 * (o.dv + 2 * (a.dv + r.dv) + s.dv);
                    return i.x = i.x + l * n, i.v = i.v + p * n, i
                }
                return function n(e, t, o) {
                    var a, r, s, l = {
                            x: -1,
                            v: 0,
                            tension: null,
                            friction: null
                        },
                        p = [0],
                        d = 0,
                        u = 1e-4,
                        c = .016;
                    for (e = parseFloat(e) || 500, t = parseFloat(t) || 20, o = o || null, l.tension = e, l.friction = t, a = null !== o, a ? (d = n(e, t), r = d / o * c) : r = c; s = i(s || l, r), p.push(1 + s.x), d += 16, Math.abs(s.x) > u && Math.abs(s.v) > u;);
                    return a ? function(e) {
                        return p[e * (p.length - 1) | 0]
                    } : d
                }
            }();
            w.Easings = {
                linear: function(e) {
                    return e
                },
                swing: function(e) {
                    return .5 - Math.cos(e * Math.PI) / 2
                },
                spring: function(e) {
                    return 1 - Math.cos(4.5 * e * Math.PI) * Math.exp(6 * -e)
                }
            }, c.each([
                ["ease", [.25, .1, .25, 1]],
                ["ease-in", [.42, 0, 1, 1]],
                ["ease-out", [0, 0, .58, 1]],
                ["ease-in-out", [.42, 0, .58, 1]],
                ["easeInSine", [.47, 0, .745, .715]],
                ["easeOutSine", [.39, .575, .565, 1]],
                ["easeInOutSine", [.445, .05, .55, .95]],
                ["easeInQuad", [.55, .085, .68, .53]],
                ["easeOutQuad", [.25, .46, .45, .94]],
                ["easeInOutQuad", [.455, .03, .515, .955]],
                ["easeInCubic", [.55, .055, .675, .19]],
                ["easeOutCubic", [.215, .61, .355, 1]],
                ["easeInOutCubic", [.645, .045, .355, 1]],
                ["easeInQuart", [.895, .03, .685, .22]],
                ["easeOutQuart", [.165, .84, .44, 1]],
                ["easeInOutQuart", [.77, 0, .175, 1]],
                ["easeInQuint", [.755, .05, .855, .06]],
                ["easeOutQuint", [.23, 1, .32, 1]],
                ["easeInOutQuint", [.86, 0, .07, 1]],
                ["easeInExpo", [.95, .05, .795, .035]],
                ["easeOutExpo", [.19, 1, .22, 1]],
                ["easeInOutExpo", [1, 0, 0, 1]],
                ["easeInCirc", [.6, .04, .98, .335]],
                ["easeOutCirc", [.075, .82, .165, 1]],
                ["easeInOutCirc", [.785, .135, .15, .86]]
            ], function(e, t) {
                w.Easings[t[0]] = l.apply(null, t[1])
            });
            var x = w.CSS = {
                RegEx: {
                    isHex: /^#([A-f\d]{3}){1,2}$/i,
                    valueUnwrap: /^[A-z]+\((.*)\)$/i,
                    wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
                    valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi
                },
                Lists: {
                    colors: ["fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor"],
                    transformsBase: ["translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ"],
                    transforms3D: ["transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY"]
                },
                Hooks: {
                    templates: {
                        textShadow: ["Color X Y Blur", "black 0px 0px 0px"],
                        boxShadow: ["Color X Y Blur Spread", "black 0px 0px 0px 0px"],
                        clip: ["Top Right Bottom Left", "0px 0px 0px 0px"],
                        backgroundPosition: ["X Y", "0% 0%"],
                        transformOrigin: ["X Y Z", "50% 50% 0px"],
                        perspectiveOrigin: ["X Y", "50% 50%"]
                    },
                    registered: {},
                    register: function() {
                        for (var e = 0; e < x.Lists.colors.length; e++) {
                            var t = "color" === x.Lists.colors[e] ? "0 0 0 1" : "255 255 255 1";
                            x.Hooks.templates[x.Lists.colors[e]] = ["Red Green Blue Alpha", t]
                        }
                        var i, n, o;
                        if (f)
                            for (i in x.Hooks.templates) {
                                n = x.Hooks.templates[i], o = n[0].split(" ");
                                var a = n[1].match(x.RegEx.valueSplit);
                                "Color" === o[0] && (o.push(o.shift()), a.push(a.shift()), x.Hooks.templates[i] = [o.join(" "), a.join(" ")])
                            }
                        for (i in x.Hooks.templates) {
                            n = x.Hooks.templates[i], o = n[0].split(" ");
                            for (var e in o) {
                                var r = i + o[e],
                                    s = e;
                                x.Hooks.registered[r] = [i, s]
                            }
                        }
                    },
                    getRoot: function(e) {
                        var t = x.Hooks.registered[e];
                        return t ? t[0] : e
                    },
                    cleanRootPropertyValue: function(e, t) {
                        return x.RegEx.valueUnwrap.test(t) && (t = t.match(x.RegEx.valueUnwrap)[1]), x.Values.isCSSNullValue(t) && (t = x.Hooks.templates[e][1]), t
                    },
                    extractValue: function(e, t) {
                        var i = x.Hooks.registered[e];
                        if (i) {
                            var n = i[0],
                                o = i[1];
                            return t = x.Hooks.cleanRootPropertyValue(n, t), t.toString().match(x.RegEx.valueSplit)[o]
                        }
                        return t
                    },
                    injectValue: function(e, t, i) {
                        var n = x.Hooks.registered[e];
                        if (n) {
                            var o, a, r = n[0],
                                s = n[1];
                            return i = x.Hooks.cleanRootPropertyValue(r, i), o = i.toString().match(x.RegEx.valueSplit), o[s] = t, a = o.join(" ")
                        }
                        return i
                    }
                },
                Normalizations: {
                    registered: {
                        clip: function(e, t, i) {
                            switch (e) {
                                case "name":
                                    return "clip";
                                case "extract":
                                    var n;
                                    return x.RegEx.wrappedValueAlreadyExtracted.test(i) ? n = i : (n = i.toString().match(x.RegEx.valueUnwrap), n = n ? n[1].replace(/,(\s+)?/g, " ") : i), n;
                                case "inject":
                                    return "rect(" + i + ")"
                            }
                        },
                        blur: function(e, t, i) {
                            switch (e) {
                                case "name":
                                    return w.State.isFirefox ? "filter" : "-webkit-filter";
                                case "extract":
                                    var n = parseFloat(i);
                                    if (!n && 0 !== n) {
                                        var o = i.toString().match(/blur\(([0-9]+[A-z]+)\)/i);
                                        n = o ? o[1] : 0
                                    }
                                    return n;
                                case "inject":
                                    return parseFloat(i) ? "blur(" + i + ")" : "none"
                            }
                        },
                        opacity: function(e, t, i) {
                            if (8 >= f) switch (e) {
                                case "name":
                                    return "filter";
                                case "extract":
                                    var n = i.toString().match(/alpha\(opacity=(.*)\)/i);
                                    return i = n ? n[1] / 100 : 1;
                                case "inject":
                                    return t.style.zoom = 1, parseFloat(i) >= 1 ? "" : "alpha(opacity=" + parseInt(100 * parseFloat(i), 10) + ")"
                            } else switch (e) {
                                case "name":
                                    return "opacity";
                                case "extract":
                                    return i;
                                case "inject":
                                    return i
                            }
                        }
                    },
                    register: function() {
                        9 >= f || w.State.isGingerbread || (x.Lists.transformsBase = x.Lists.transformsBase.concat(x.Lists.transforms3D));
                        for (var e = 0; e < x.Lists.transformsBase.length; e++) ! function() {
                            var t = x.Lists.transformsBase[e];
                            x.Normalizations.registered[t] = function(e, i, o) {
                                switch (e) {
                                    case "name":
                                        return "transform";
                                    case "extract":
                                        return r(i) === n || r(i).transformCache[t] === n ? /^scale/i.test(t) ? 1 : 0 : r(i).transformCache[t].replace(/[()]/g, "");
                                    case "inject":
                                        var a = !1;
                                        switch (t.substr(0, t.length - 1)) {
                                            case "translate":
                                                a = !/(%|px|em|rem|vw|vh|\d)$/i.test(o);
                                                break;
                                            case "scal":
                                            case "scale":
                                                w.State.isAndroid && r(i).transformCache[t] === n && 1 > o && (o = 1), a = !/(\d)$/i.test(o);
                                                break;
                                            case "skew":
                                                a = !/(deg|\d)$/i.test(o);
                                                break;
                                            case "rotate":
                                                a = !/(deg|\d)$/i.test(o)
                                        }
                                        return a || (r(i).transformCache[t] = "(" + o + ")"), r(i).transformCache[t]
                                }
                            }
                        }();
                        for (var e = 0; e < x.Lists.colors.length; e++) ! function() {
                            var t = x.Lists.colors[e];
                            x.Normalizations.registered[t] = function(e, i, o) {
                                switch (e) {
                                    case "name":
                                        return t;
                                    case "extract":
                                        var a;
                                        if (x.RegEx.wrappedValueAlreadyExtracted.test(o)) a = o;
                                        else {
                                            var r, s = {
                                                black: "rgb(0, 0, 0)",
                                                blue: "rgb(0, 0, 255)",
                                                gray: "rgb(128, 128, 128)",
                                                green: "rgb(0, 128, 0)",
                                                red: "rgb(255, 0, 0)",
                                                white: "rgb(255, 255, 255)"
                                            };
                                            /^[A-z]+$/i.test(o) ? r = s[o] !== n ? s[o] : s.black : x.RegEx.isHex.test(o) ? r = "rgb(" + x.Values.hexToRgb(o).join(" ") + ")" : /^rgba?\(/i.test(o) || (r = s.black), a = (r || o).toString().match(x.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ")
                                        }
                                        return 8 >= f || 3 !== a.split(" ").length || (a += " 1"), a;
                                    case "inject":
                                        return 8 >= f ? 4 === o.split(" ").length && (o = o.split(/\s+/).slice(0, 3).join(" ")) : 3 === o.split(" ").length && (o += " 1"), (8 >= f ? "rgb" : "rgba") + "(" + o.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")"
                                }
                            }
                        }()
                    }
                },
                Names: {
                    camelCase: function(e) {
                        return e.replace(/-(\w)/g, function(e, t) {
                            return t.toUpperCase()
                        })
                    },
                    SVGAttribute: function(e) {
                        var t = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";
                        return (f || w.State.isAndroid && !w.State.isChrome) && (t += "|transform"), new RegExp("^(" + t + ")$", "i").test(e)
                    },
                    prefixCheck: function(e) {
                        if (w.State.prefixMatches[e]) return [w.State.prefixMatches[e], !0];
                        for (var t = ["", "Webkit", "Moz", "ms", "O"], i = 0, n = t.length; n > i; i++) {
                            var o;
                            if (o = 0 === i ? e : t[i] + e.replace(/^\w/, function(e) {
                                    return e.toUpperCase()
                                }), m.isString(w.State.prefixElement.style[o])) return w.State.prefixMatches[e] = o, [o, !0]
                        }
                        return [e, !1]
                    }
                },
                Values: {
                    hexToRgb: function(e) {
                        var t, i = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                            n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
                        return e = e.replace(i, function(e, t, i, n) {
                            return t + t + i + i + n + n
                        }), t = n.exec(e), t ? [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)] : [0, 0, 0]
                    },
                    isCSSNullValue: function(e) {
                        return 0 == e || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(e)
                    },
                    getUnitType: function(e) {
                        return /^(rotate|skew)/i.test(e) ? "deg" : /(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(e) ? "" : "px"
                    },
                    getDisplayType: function(e) {
                        var t = e && e.tagName.toString().toLowerCase();
                        return /^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(t) ? "inline" : /^(li)$/i.test(t) ? "list-item" : /^(tr)$/i.test(t) ? "table-row" : /^(table)$/i.test(t) ? "table" : /^(tbody)$/i.test(t) ? "table-row-group" : "block"
                    },
                    addClass: function(e, t) {
                        e.classList ? e.classList.add(t) : e.className += (e.className.length ? " " : "") + t
                    },
                    removeClass: function(e, t) {
                        e.classList ? e.classList.remove(t) : e.className = e.className.toString().replace(new RegExp("(^|\\s)" + t.split(" ").join("|") + "(\\s|$)", "gi"), " ")
                    }
                },
                getPropertyValue: function(e, i, o, a) {
                    function s(e, i) {
                        function o() {
                            p && x.setPropertyValue(e, "display", "none")
                        }
                        var l = 0;
                        if (8 >= f) l = c.css(e, i);
                        else {
                            var p = !1;
                            if (/^(width|height)$/.test(i) && 0 === x.getPropertyValue(e, "display") && (p = !0, x.setPropertyValue(e, "display", x.Values.getDisplayType(e))), !a) {
                                if ("height" === i && "border-box" !== x.getPropertyValue(e, "boxSizing").toString().toLowerCase()) {
                                    var d = e.offsetHeight - (parseFloat(x.getPropertyValue(e, "borderTopWidth")) || 0) - (parseFloat(x.getPropertyValue(e, "borderBottomWidth")) || 0) - (parseFloat(x.getPropertyValue(e, "paddingTop")) || 0) - (parseFloat(x.getPropertyValue(e, "paddingBottom")) || 0);
                                    return o(), d
                                }
                                if ("width" === i && "border-box" !== x.getPropertyValue(e, "boxSizing").toString().toLowerCase()) {
                                    var u = e.offsetWidth - (parseFloat(x.getPropertyValue(e, "borderLeftWidth")) || 0) - (parseFloat(x.getPropertyValue(e, "borderRightWidth")) || 0) - (parseFloat(x.getPropertyValue(e, "paddingLeft")) || 0) - (parseFloat(x.getPropertyValue(e, "paddingRight")) || 0);
                                    return o(), u
                                }
                            }
                            var h;
                            h = r(e) === n ? t.getComputedStyle(e, null) : r(e).computedStyle ? r(e).computedStyle : r(e).computedStyle = t.getComputedStyle(e, null), "borderColor" === i && (i = "borderTopColor"), l = 9 === f && "filter" === i ? h.getPropertyValue(i) : h[i], ("" === l || null === l) && (l = e.style[i]), o()
                        }
                        if ("auto" === l && /^(top|right|bottom|left)$/i.test(i)) {
                            var m = s(e, "position");
                            ("fixed" === m || "absolute" === m && /top|left/i.test(i)) && (l = c(e).position()[i] + "px")
                        }
                        return l
                    }
                    var l;
                    if (x.Hooks.registered[i]) {
                        var p = i,
                            d = x.Hooks.getRoot(p);
                        o === n && (o = x.getPropertyValue(e, x.Names.prefixCheck(d)[0])), x.Normalizations.registered[d] && (o = x.Normalizations.registered[d]("extract", e, o)), l = x.Hooks.extractValue(p, o)
                    } else if (x.Normalizations.registered[i]) {
                        var u, h;
                        u = x.Normalizations.registered[i]("name", e), "transform" !== u && (h = s(e, x.Names.prefixCheck(u)[0]), x.Values.isCSSNullValue(h) && x.Hooks.templates[i] && (h = x.Hooks.templates[i][1])), l = x.Normalizations.registered[i]("extract", e, h)
                    }
                    if (!/^[\d-]/.test(l))
                        if (r(e) && r(e).isSVG && x.Names.SVGAttribute(i))
                            if (/^(height|width)$/i.test(i)) try {
                                l = e.getBBox()[i]
                            } catch (m) {
                                l = 0
                            } else l = e.getAttribute(i);
                            else l = s(e, x.Names.prefixCheck(i)[0]);
                    return x.Values.isCSSNullValue(l) && (l = 0), w.debug >= 2 && console.log("Get " + i + ": " + l), l
                },
                setPropertyValue: function(e, i, n, o, a) {
                    var s = i;
                    if ("scroll" === i) a.container ? a.container["scroll" + a.direction] = n : "Left" === a.direction ? t.scrollTo(n, a.alternateValue) : t.scrollTo(a.alternateValue, n);
                    else if (x.Normalizations.registered[i] && "transform" === x.Normalizations.registered[i]("name", e)) x.Normalizations.registered[i]("inject", e, n), s = "transform", n = r(e).transformCache[i];
                    else {
                        if (x.Hooks.registered[i]) {
                            var l = i,
                                p = x.Hooks.getRoot(i);
                            o = o || x.getPropertyValue(e, p), n = x.Hooks.injectValue(l, n, o), i = p
                        }
                        if (x.Normalizations.registered[i] && (n = x.Normalizations.registered[i]("inject", e, n), i = x.Normalizations.registered[i]("name", e)), s = x.Names.prefixCheck(i)[0], 8 >= f) try {
                            e.style[s] = n
                        } catch (d) {
                            w.debug && console.log("Browser does not support [" + n + "] for [" + s + "]")
                        } else r(e) && r(e).isSVG && x.Names.SVGAttribute(i) ? e.setAttribute(i, n) : e.style[s] = n;
                        w.debug >= 2 && console.log("Set " + i + " (" + s + "): " + n)
                    }
                    return [s, n]
                },
                flushTransformCache: function(e) {
                    function t(t) {
                        return parseFloat(x.getPropertyValue(e, t))
                    }
                    var i = "";
                    if ((f || w.State.isAndroid && !w.State.isChrome) && r(e).isSVG) {
                        var n = {
                            translate: [t("translateX"), t("translateY")],
                            skewX: [t("skewX")],
                            skewY: [t("skewY")],
                            scale: 1 !== t("scale") ? [t("scale"), t("scale")] : [t("scaleX"), t("scaleY")],
                            rotate: [t("rotateZ"), 0, 0]
                        };
                        c.each(r(e).transformCache, function(e) {
                            /^translate/i.test(e) ? e = "translate" : /^scale/i.test(e) ? e = "scale" : /^rotate/i.test(e) && (e = "rotate"), n[e] && (i += e + "(" + n[e].join(" ") + ") ", delete n[e])
                        })
                    } else {
                        var o, a;
                        c.each(r(e).transformCache, function(t) {
                            return o = r(e).transformCache[t], "transformPerspective" === t ? (a = o, !0) : (9 === f && "rotateZ" === t && (t = "rotate"), void(i += t + o + " "))
                        }), a && (i = "perspective" + a + " " + i)
                    }
                    x.setPropertyValue(e, "transform", i)
                }
            };
            x.Hooks.register(), x.Normalizations.register(), w.hook = function(e, t, i) {
                var o = n;
                return e = a(e), c.each(e, function(e, a) {
                    if (r(a) === n && w.init(a), i === n) o === n && (o = w.CSS.getPropertyValue(a, t));
                    else {
                        var s = w.CSS.setPropertyValue(a, t, i);
                        "transform" === s[0] && w.CSS.flushTransformCache(a), o = s
                    }
                }), o
            };
            var S = function() {
                function e() {
                    return s ? E.promise || null : l
                }

                function o() {
                    function e() {
                        function e(e, t) {
                            var i = n,
                                o = n,
                                r = n;
                            return m.isArray(e) ? (i = e[0], !m.isArray(e[1]) && /^[\d-]/.test(e[1]) || m.isFunction(e[1]) || x.RegEx.isHex.test(e[1]) ? r = e[1] : (m.isString(e[1]) && !x.RegEx.isHex.test(e[1]) || m.isArray(e[1])) && (o = t ? e[1] : p(e[1], s.duration), e[2] !== n && (r = e[2]))) : i = e, t || (o = o || s.easing), m.isFunction(i) && (i = i.call(a, C, T)), m.isFunction(r) && (r = r.call(a, C, T)), [i || 0, o, r]
                        }

                        function u(e, t) {
                            var i, n;
                            return n = (t || "0").toString().toLowerCase().replace(/[%A-z]+$/, function(e) {
                                return i = e, ""
                            }), i || (i = x.Values.getUnitType(e)), [n, i]
                        }

                        function f() {
                            var e = {
                                    myParent: a.parentNode || i.body,
                                    position: x.getPropertyValue(a, "position"),
                                    fontSize: x.getPropertyValue(a, "fontSize")
                                },
                                n = e.position === O.lastPosition && e.myParent === O.lastParent,
                                o = e.fontSize === O.lastFontSize;
                            O.lastParent = e.myParent, O.lastPosition = e.position, O.lastFontSize = e.fontSize;
                            var s = 100,
                                l = {};
                            if (o && n) l.emToPx = O.lastEmToPx, l.percentToPxWidth = O.lastPercentToPxWidth, l.percentToPxHeight = O.lastPercentToPxHeight;
                            else {
                                var p = r(a).isSVG ? i.createElementNS("http://www.w3.org/2000/svg", "rect") : i.createElement("div");
                                w.init(p), e.myParent.appendChild(p), c.each(["overflow", "overflowX", "overflowY"], function(e, t) {
                                    w.CSS.setPropertyValue(p, t, "hidden")
                                }), w.CSS.setPropertyValue(p, "position", e.position), w.CSS.setPropertyValue(p, "fontSize", e.fontSize), w.CSS.setPropertyValue(p, "boxSizing", "content-box"), c.each(["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"], function(e, t) {
                                    w.CSS.setPropertyValue(p, t, s + "%")
                                }), w.CSS.setPropertyValue(p, "paddingLeft", s + "em"), l.percentToPxWidth = O.lastPercentToPxWidth = (parseFloat(x.getPropertyValue(p, "width", null, !0)) || 1) / s, l.percentToPxHeight = O.lastPercentToPxHeight = (parseFloat(x.getPropertyValue(p, "height", null, !0)) || 1) / s, l.emToPx = O.lastEmToPx = (parseFloat(x.getPropertyValue(p, "paddingLeft")) || 1) / s, e.myParent.removeChild(p)
                            }
                            return null === O.remToPx && (O.remToPx = parseFloat(x.getPropertyValue(i.body, "fontSize")) || 16), null === O.vwToPx && (O.vwToPx = parseFloat(t.innerWidth) / 100, O.vhToPx = parseFloat(t.innerHeight) / 100), l.remToPx = O.remToPx, l.vwToPx = O.vwToPx, l.vhToPx = O.vhToPx, w.debug >= 1 && console.log("Unit ratios: " + JSON.stringify(l), a), l
                        }
                        if (s.begin && 0 === C) try {
                            s.begin.call(h, h)
                        } catch (v) {
                            setTimeout(function() {
                                throw v
                            }, 1)
                        }
                        if ("scroll" === k) {
                            var b, S, P, I = /^x$/i.test(s.axis) ? "Left" : "Top",
                                z = parseFloat(s.offset) || 0;
                            s.container ? m.isWrapped(s.container) || m.isNode(s.container) ? (s.container = s.container[0] || s.container, b = s.container["scroll" + I], P = b + c(a).position()[I.toLowerCase()] + z) : s.container = null : (b = w.State.scrollAnchor[w.State["scrollProperty" + I]], S = w.State.scrollAnchor[w.State["scrollProperty" + ("Left" === I ? "Top" : "Left")]], P = c(a).offset()[I.toLowerCase()] + z), l = {
                                scroll: {
                                    rootPropertyValue: !1,
                                    startValue: b,
                                    currentValue: b,
                                    endValue: P,
                                    unitType: "",
                                    easing: s.easing,
                                    scrollData: {
                                        container: s.container,
                                        direction: I,
                                        alternateValue: S
                                    }
                                },
                                element: a
                            }, w.debug && console.log("tweensContainer (scroll): ", l.scroll, a)
                        } else if ("reverse" === k) {
                            if (!r(a).tweensContainer) return void c.dequeue(a, s.queue);
                            "none" === r(a).opts.display && (r(a).opts.display = "auto"), "hidden" === r(a).opts.visibility && (r(a).opts.visibility = "visible"), r(a).opts.loop = !1, r(a).opts.begin = null, r(a).opts.complete = null, y.easing || delete s.easing, y.duration || delete s.duration, s = c.extend({}, r(a).opts, s);
                            var M = c.extend(!0, {}, r(a).tweensContainer);
                            for (var L in M)
                                if ("element" !== L) {
                                    var A = M[L].startValue;
                                    M[L].startValue = M[L].currentValue = M[L].endValue, M[L].endValue = A, m.isEmptyObject(y) || (M[L].easing = s.easing), w.debug && console.log("reverse tweensContainer (" + L + "): " + JSON.stringify(M[L]), a)
                                }
                            l = M
                        } else if ("start" === k) {
                            var M;
                            r(a).tweensContainer && r(a).isAnimating === !0 && (M = r(a).tweensContainer), c.each(g, function(t, i) {
                                if (RegExp("^" + x.Lists.colors.join("$|^") + "$").test(t)) {
                                    var o = e(i, !0),
                                        a = o[0],
                                        r = o[1],
                                        s = o[2];
                                    if (x.RegEx.isHex.test(a)) {
                                        for (var l = ["Red", "Green", "Blue"], p = x.Values.hexToRgb(a), d = s ? x.Values.hexToRgb(s) : n, u = 0; u < l.length; u++) {
                                            var c = [p[u]];
                                            r && c.push(r), d !== n && c.push(d[u]), g[t + l[u]] = c
                                        }
                                        delete g[t]
                                    }
                                }
                            });
                            for (var _ in g) {
                                var H = e(g[_]),
                                    N = H[0],
                                    W = H[1],
                                    R = H[2];
                                _ = x.Names.camelCase(_);
                                var $ = x.Hooks.getRoot(_),
                                    B = !1;
                                if (r(a).isSVG || "tween" === $ || x.Names.prefixCheck($)[1] !== !1 || x.Normalizations.registered[$] !== n) {
                                    (s.display !== n && null !== s.display && "none" !== s.display || s.visibility !== n && "hidden" !== s.visibility) && /opacity|filter/.test(_) && !R && 0 !== N && (R = 0), s._cacheValues && M && M[_] ? (R === n && (R = M[_].endValue + M[_].unitType), B = r(a).rootPropertyValueCache[$]) : x.Hooks.registered[_] ? R === n ? (B = x.getPropertyValue(a, $), R = x.getPropertyValue(a, _, B)) : B = x.Hooks.templates[$][1] : R === n && (R = x.getPropertyValue(a, _));
                                    var j, V, F, q = !1;
                                    if (j = u(_, R), R = j[0], F = j[1], j = u(_, N), N = j[0].replace(/^([+-\/*])=/, function(e, t) {
                                            return q = t, ""
                                        }), V = j[1], R = parseFloat(R) || 0, N = parseFloat(N) || 0, "%" === V && (/^(fontSize|lineHeight)$/.test(_) ? (N /= 100, V = "em") : /^scale/.test(_) ? (N /= 100, V = "") : /(Red|Green|Blue)$/i.test(_) && (N = N / 100 * 255, V = "")), /[\/*]/.test(q)) V = F;
                                    else if (F !== V && 0 !== R)
                                        if (0 === N) V = F;
                                        else {
                                            o = o || f();
                                            var G = /margin|padding|left|right|width|text|word|letter/i.test(_) || /X$/.test(_) || "x" === _ ? "x" : "y";
                                            switch (F) {
                                                case "%":
                                                    R *= "x" === G ? o.percentToPxWidth : o.percentToPxHeight;
                                                    break;
                                                case "px":
                                                    break;
                                                default:
                                                    R *= o[F + "ToPx"]
                                            }
                                            switch (V) {
                                                case "%":
                                                    R *= 1 / ("x" === G ? o.percentToPxWidth : o.percentToPxHeight);
                                                    break;
                                                case "px":
                                                    break;
                                                default:
                                                    R *= 1 / o[V + "ToPx"]
                                            }
                                        }
                                    switch (q) {
                                        case "+":
                                            N = R + N;
                                            break;
                                        case "-":
                                            N = R - N;
                                            break;
                                        case "*":
                                            N = R * N;
                                            break;
                                        case "/":
                                            N = R / N
                                    }
                                    l[_] = {
                                        rootPropertyValue: B,
                                        startValue: R,
                                        currentValue: R,
                                        endValue: N,
                                        unitType: V,
                                        easing: W
                                    }, w.debug && console.log("tweensContainer (" + _ + "): " + JSON.stringify(l[_]), a)
                                } else w.debug && console.log("Skipping [" + $ + "] due to a lack of browser support.")
                            }
                            l.element = a
                        }
                        l.element && (x.Values.addClass(a, "velocity-animating"), D.push(l), "" === s.queue && (r(a).tweensContainer = l, r(a).opts = s), r(a).isAnimating = !0, C === T - 1 ? (w.State.calls.push([D, h, s, null, E.resolver]), w.State.isTicking === !1 && (w.State.isTicking = !0, d())) : C++)
                    }
                    var o, a = this,
                        s = c.extend({}, w.defaults, y),
                        l = {};
                    switch (r(a) === n && w.init(a), parseFloat(s.delay) && s.queue !== !1 && c.queue(a, s.queue, function(e) {
                        w.velocityQueueEntryFlag = !0, r(a).delayTimer = {
                            setTimeout: setTimeout(e, parseFloat(s.delay)),
                            next: e
                        }
                    }), s.duration.toString().toLowerCase()) {
                        case "fast":
                            s.duration = 200;
                            break;
                        case "normal":
                            s.duration = v;
                            break;
                        case "slow":
                            s.duration = 600;
                            break;
                        default:
                            s.duration = parseFloat(s.duration) || 1
                    }
                    w.mock !== !1 && (w.mock === !0 ? s.duration = s.delay = 1 : (s.duration *= parseFloat(w.mock) || 1, s.delay *= parseFloat(w.mock) || 1)), s.easing = p(s.easing, s.duration), s.begin && !m.isFunction(s.begin) && (s.begin = null), s.progress && !m.isFunction(s.progress) && (s.progress = null), s.complete && !m.isFunction(s.complete) && (s.complete = null), s.display !== n && null !== s.display && (s.display = s.display.toString().toLowerCase(), "auto" === s.display && (s.display = w.CSS.Values.getDisplayType(a))), s.visibility !== n && null !== s.visibility && (s.visibility = s.visibility.toString().toLowerCase()), s.mobileHA = s.mobileHA && w.State.isMobile && !w.State.isGingerbread, s.queue === !1 ? s.delay ? setTimeout(e, s.delay) : e() : c.queue(a, s.queue, function(t, i) {
                        return i === !0 ? (E.promise && E.resolver(h), !0) : (w.velocityQueueEntryFlag = !0, void e(t))
                    }), "" !== s.queue && "fx" !== s.queue || "inprogress" === c.queue(a)[0] || c.dequeue(a)
                }
                var s, l, f, h, g, y, b = arguments[0] && (arguments[0].p || c.isPlainObject(arguments[0].properties) && !arguments[0].properties.names || m.isString(arguments[0].properties));
                if (m.isWrapped(this) ? (s = !1, f = 0, h = this, l = this) : (s = !0, f = 1, h = b ? arguments[0].elements || arguments[0].e : arguments[0]), h = a(h)) {
                    b ? (g = arguments[0].properties || arguments[0].p, y = arguments[0].options || arguments[0].o) : (g = arguments[f], y = arguments[f + 1]);
                    var T = h.length,
                        C = 0;
                    if (!/^(stop|finish|finishAll)$/i.test(g) && !c.isPlainObject(y)) {
                        var P = f + 1;
                        y = {};
                        for (var I = P; I < arguments.length; I++) m.isArray(arguments[I]) || !/^(fast|normal|slow)$/i.test(arguments[I]) && !/^\d/.test(arguments[I]) ? m.isString(arguments[I]) || m.isArray(arguments[I]) ? y.easing = arguments[I] : m.isFunction(arguments[I]) && (y.complete = arguments[I]) : y.duration = arguments[I]
                    }
                    var E = {
                        promise: null,
                        resolver: null,
                        rejecter: null
                    };
                    s && w.Promise && (E.promise = new w.Promise(function(e, t) {
                        E.resolver = e, E.rejecter = t
                    }));
                    var k;
                    switch (g) {
                        case "scroll":
                            k = "scroll";
                            break;
                        case "reverse":
                            k = "reverse";
                            break;
                        case "finish":
                        case "finishAll":
                        case "stop":
                            c.each(h, function(e, t) {
                                r(t) && r(t).delayTimer && (clearTimeout(r(t).delayTimer.setTimeout), r(t).delayTimer.next && r(t).delayTimer.next(), delete r(t).delayTimer), "finishAll" !== g || y !== !0 && !m.isString(y) || (c.each(c.queue(t, m.isString(y) ? y : ""), function(e, t) {
                                    m.isFunction(t) && t()
                                }), c.queue(t, m.isString(y) ? y : "", []))
                            });
                            var z = [];
                            return c.each(w.State.calls, function(e, t) {
                                t && c.each(t[1], function(i, o) {
                                    var a = y === n ? "" : y;
                                    return a === !0 || t[2].queue === a || y === n && t[2].queue === !1 ? void c.each(h, function(i, n) {
                                        n === o && ((y === !0 || m.isString(y)) && (c.each(c.queue(n, m.isString(y) ? y : ""), function(e, t) {
                                            m.isFunction(t) && t(null, !0)
                                        }), c.queue(n, m.isString(y) ? y : "", [])), "stop" === g ? (r(n) && r(n).tweensContainer && a !== !1 && c.each(r(n).tweensContainer, function(e, t) {
                                            t.endValue = t.currentValue
                                        }), z.push(e)) : ("finish" === g || "finishAll" === g) && (t[2].duration = 1))
                                    }) : !0
                                })
                            }), "stop" === g && (c.each(z, function(e, t) {
                                u(t, !0)
                            }), E.promise && E.resolver(h)), e();
                        default:
                            if (!c.isPlainObject(g) || m.isEmptyObject(g)) {
                                if (m.isString(g) && w.Redirects[g]) {
                                    var M = c.extend({}, y),
                                        L = M.duration,
                                        A = M.delay || 0;
                                    return M.backwards === !0 && (h = c.extend(!0, [], h).reverse()), c.each(h, function(e, t) {
                                        parseFloat(M.stagger) ? M.delay = A + parseFloat(M.stagger) * e : m.isFunction(M.stagger) && (M.delay = A + M.stagger.call(t, e, T)), M.drag && (M.duration = parseFloat(L) || (/^(callout|transition)/.test(g) ? 1e3 : v), M.duration = Math.max(M.duration * (M.backwards ? 1 - e / T : (e + 1) / T), .75 * M.duration, 200)), w.Redirects[g].call(t, t, M || {}, e, T, h, E.promise ? E : n)
                                    }), e()
                                }
                                var _ = "Velocity: First argument (" + g + ") was not a property map, a known action, or a registered redirect. Aborting.";
                                return E.promise ? E.rejecter(new Error(_)) : console.log(_), e()
                            }
                            k = "start"
                    }
                    var O = {
                            lastParent: null,
                            lastPosition: null,
                            lastFontSize: null,
                            lastPercentToPxWidth: null,
                            lastPercentToPxHeight: null,
                            lastEmToPx: null,
                            remToPx: null,
                            vwToPx: null,
                            vhToPx: null
                        },
                        D = [];
                    c.each(h, function(e, t) {
                        m.isNode(t) && o.call(t)
                    });
                    var H, M = c.extend({}, w.defaults, y);
                    if (M.loop = parseInt(M.loop), H = 2 * M.loop - 1, M.loop)
                        for (var N = 0; H > N; N++) {
                            var W = {
                                delay: M.delay,
                                progress: M.progress
                            };
                            N === H - 1 && (W.display = M.display, W.visibility = M.visibility, W.complete = M.complete), S(h, "reverse", W)
                        }
                    return e()
                }
            };
            w = c.extend(S, w), w.animate = S;
            var T = t.requestAnimationFrame || h;
            return w.State.isMobile || i.hidden === n || i.addEventListener("visibilitychange", function() {
                i.hidden ? (T = function(e) {
                    return setTimeout(function() {
                        e(!0)
                    }, 16)
                }, d()) : T = t.requestAnimationFrame || h
            }), e.Velocity = w, e !== t && (e.fn.velocity = S, e.fn.velocity.defaults = w.defaults), c.each(["Down", "Up"], function(e, t) {
                w.Redirects["slide" + t] = function(e, i, o, a, r, s) {
                    var l = c.extend({}, i),
                        p = l.begin,
                        d = l.complete,
                        u = {
                            height: "",
                            marginTop: "",
                            marginBottom: "",
                            paddingTop: "",
                            paddingBottom: ""
                        },
                        f = {};
                    l.display === n && (l.display = "Down" === t ? "inline" === w.CSS.Values.getDisplayType(e) ? "inline-block" : "block" : "none"), l.begin = function() {
                        p && p.call(r, r);
                        for (var i in u) {
                            f[i] = e.style[i];
                            var n = w.CSS.getPropertyValue(e, i);
                            u[i] = "Down" === t ? [n, 0] : [0, n]
                        }
                        f.overflow = e.style.overflow, e.style.overflow = "hidden"
                    }, l.complete = function() {
                        for (var t in f) e.style[t] = f[t];
                        d && d.call(r, r), s && s.resolver(r)
                    }, w(e, u, l)
                }
            }), c.each(["In", "Out"], function(e, t) {
                w.Redirects["fade" + t] = function(e, i, o, a, r, s) {
                    var l = c.extend({}, i),
                        p = {
                            opacity: "In" === t ? 1 : 0
                        },
                        d = l.complete;
                    l.complete = o !== a - 1 ? l.begin = null : function() {
                        d && d.call(r, r), s && s.resolver(r)
                    }, l.display === n && (l.display = "In" === t ? "auto" : "none"), w(this, p, l)
                }
            }), w
        }(window.jQuery || window.Zepto || window, window, document)
    }), ! function(e) {
        "use strict";

        function t(t) {
            this.options = e.extend({
                slickyClass: "fixed",
                extraOffset: ".js-offset",
                fakeBlock: !0,
                fakeBlockClass: "fake-block",
                scrollClasses: !1,
                scrollTopClass: "scroll-up",
                scrollBottomClass: "scroll-down",
                offset: 0
            }, t), this.init()
        }
        var i = e(window);
        t.prototype = {
            init: function() {
                this.options.panel && (this.initStructure(), this.attachEvents())
            },
            initStructure: function() {
                this.panel = e(this.options.panel), this.height = this.panel.outerHeight(), this.offset = this.getTargetOffset(this.options.extraOffset), this.fake = e('<div class="' + this.options.fakeBlockClass + '"></div>'), this.resizeFlag = !1, this.isActive = !1, this.scrollPosition = 0, this.scrollPositionPrev = 0, this.options.fakeBlock && this.fake.insertBefore(this.panel).css({
                    display: "none",
                    height: this.height
                })
            },
            attachEvents: function() {
                var e = this;
                this.onScrollHandler = function() {
                    e.scrollHandler()
                }, this.onResizeWindow = function() {
                    e.resizeFlag || e.windowResize()
                }, i.on("scroll", this.onScrollHandler), i.on("resize orientationchange", this.onResizeWindow)
            },
            getTargetOffset: function(t) {
                return "number" == typeof this.options.extraOffset ? t = this.options.extraOffset : "string" == typeof this.options.extraOffset && (t = e(this.options.extraOffset).offset().top + e(this.options.extraOffset).outerHeight()), t
            },
            scrollHandler: function() {
                var e = i.scrollTop();
                e > this.offset ? this.isActive || (this.panel.addClass(this.options.slickyClass), this.options.fakeBlock && this.fake.show(), this.isActive = !0) : this.isActive && (this.panel.removeClass(this.options.slickyClass), this.options.fakeBlock && this.fake.hide(), this.isActive = !1), this.options.scrollClasses && (this.scrollPosition = e, this.scrollPosition > this.scrollPositionPrev ? (this.panel.addClass(this.options.scrollBottomClass), this.panel.removeClass(this.options.scrollTopClass)) : (this.panel.addClass(this.options.scrollTopClass), this.panel.removeClass(this.options.scrollBottomClass)), this.scrollPositionPrev = this.scrollPosition)
            },
            windowResize: function() {
                this.options.fakeBlock ? (this.height = this.panel.outerHeight(), this.offset = this.getTargetOffset(this.options.extraOffset), this.fake.css({
                    height: this.height
                })) : this.offset = this.getTargetOffset(this.options.extraOffset), this.scrollHandler()
            },
            destroy: function() {
                console.log(1), this.options.fakeBlock && this.fake.remove(), this.resizeFlag = !0, this.panel.removeClass(this.options.slickyClass).removeClass(this.options.scrollTopClass).removeClass(this.options.scrollBottomClass), i.off("scroll", this.onScrollHandler), i.off("resize", this.onResizeWindow)
            }
        }, e.fn.stickyPanel = function(i) {
            return this.each(function() {
                jQuery(this).data("StickyPanel", new t(e.extend(i, {
                    panel: this
                })))
            })
        }
    }(jQuery);