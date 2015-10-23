(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", 'dojo-core/WeakMap', 'dojo-core/lang', './aspect'], function (require, exports) {
    var WeakMap_1 = require('dojo-core/WeakMap');
    var lang_1 = require('dojo-core/lang');
    var aspect_1 = require('./aspect');
    /* A weakmap that will store initialization functions for compose constructors */
    var initFnMap = new WeakMap_1.default();
    /**
     * A helper funtion to return a function that is rebased
     * @param  {Function} fn The function to be rebased
     * @return {Function}    The rebased function
     */
    function rebase(fn) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return fn.apply(this, [this].concat(args));
        };
    }
    /* The rebased functions we need to decorate compose constructors with */
    var doExtend = rebase(extend);
    var doMixin = rebase(mixin);
    var doOverlay = rebase(overlay);
    var doAspect = rebase(aspect);
    /**
     * A convience function to decorate a compose class constructors
     * @param {any} base The target constructor
     */
    function stamp(base) {
        base.extend = doExtend;
        base.mixin = doMixin;
        base.overlay = doOverlay;
        base.from = doFrom;
        base.before = doBefore;
        base.after = doAfter;
        base.around = doAround;
        base.aspect = doAspect;
    }
    function cloneCreator(base) {
        function Creator() {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            initFnMap.get(this.constructor).forEach(function (fn) { return fn.apply(_this, args); });
        }
        if (base) {
            lang_1.assign(Creator.prototype, base.prototype);
            initFnMap.set(Creator, [].concat(initFnMap.get(base)));
        }
        else {
            initFnMap.set(Creator, []);
        }
        Creator.prototype.constructor = Creator;
        stamp(Creator);
        Object.freeze(Creator);
        return Creator;
    }
    function extend(base, extension) {
        base = cloneCreator(base);
        Object.keys(extension).forEach(function (key) { return base.prototype[key] = extension[key]; });
        Object.freeze(base.prototype);
        return base;
    }
    function mixin(base, mixin) {
        base = cloneCreator(base);
        Object.keys(mixin.prototype).forEach(function (key) { return base.prototype[key] = mixin.prototype[key]; });
        Object.freeze(base.prototype);
        return base;
    }
    function overlay(base, overlayFunction) {
        base = cloneCreator(base);
        overlayFunction(base.prototype);
        return base;
    }
    function from(base, method) {
        return base.prototype[method];
    }
    function doFrom(base, method) {
        var clone = cloneCreator(this);
        clone.prototype[method] = base.prototype[method];
        return clone;
    }
    function before() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var base;
        var method;
        var advice;
        if (args.length >= 3) {
            base = args[0], method = args[1], advice = args[2];
            method = base.prototype[method];
        }
        else {
            method = args[0], advice = args[1];
        }
        return aspect_1.before(method, advice);
    }
    function doBefore(method, advice) {
        var clone = cloneCreator(this);
        clone.prototype[method] = aspect_1.before(clone.prototype[method], advice);
        return clone;
    }
    function after() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var base;
        var method;
        var advice;
        if (args.length >= 3) {
            base = args[0], method = args[1], advice = args[2];
            method = base.prototype[method];
        }
        else {
            method = args[0], advice = args[1];
        }
        return aspect_1.after(method, advice);
    }
    function doAfter(method, advice) {
        var clone = cloneCreator(this);
        clone.prototype[method] = aspect_1.after(clone.prototype[method], advice);
        return clone;
    }
    function around() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var base;
        var method;
        var advice;
        if (args.length >= 3) {
            base = args[0], method = args[1], advice = args[2];
            method = base.prototype[method];
        }
        else {
            method = args[0], advice = args[1];
        }
        return aspect_1.around(method, advice);
    }
    function doAround(method, advice) {
        var clone = cloneCreator(this);
        clone.prototype[method] = aspect_1.around(clone.prototype[method], advice);
        return clone;
    }
    function aspect(base, advice) {
        var clone = cloneCreator(base);
        function mapAdvice(adviceHash, advisor) {
            for (var key in adviceHash) {
                if (key in clone.prototype) {
                    clone.prototype[key] = advisor(clone.prototype[key], adviceHash[key]);
                }
                else {
                    throw new Error('Trying to advise non-existing method: "' + key + '"');
                }
            }
        }
        if (advice.before) {
            mapAdvice(advice.before, before);
        }
        if (advice.after) {
            mapAdvice(advice.after, after);
        }
        if (advice.around) {
            mapAdvice(advice.around, around);
        }
        return clone;
    }
    function create(base, initFunction) {
        var Creator = cloneCreator();
        if (initFunction) {
            initFnMap.get(Creator).push(initFunction);
        }
        /* mixin the base into the prototype */
        lang_1.assign(Creator.prototype, typeof base === 'function' ? base.prototype : base);
        /* return the new constructor */
        return Creator;
    }
    /* Generate compose */
    create.create = create;
    create.extend = extend;
    create.mixin = mixin;
    create.overlay = overlay;
    create.from = from;
    create.before = before;
    create.after = after;
    create.around = around;
    create.aspect = aspect;
    var compose = create;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = compose;
});
//# sourceMappingURL=_debug/compose.js.map