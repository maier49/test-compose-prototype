(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'dojo-core/WeakMap', './aspect'], factory);
    }
})(function (require, exports) {
    "use strict";
    var WeakMap_1 = require('dojo-core/WeakMap');
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
    /**
     * A helper function that copies own properties and their descriptors
     * from one or more sources to a target object. Includes non-enumerable properties
     */
    function copyProperties(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        sources.forEach(function (source) {
            Object.defineProperties(target, Object.getOwnPropertyNames(source).reduce(function (descriptors, key) {
                descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
                return descriptors;
            }, {}));
        });
        return target;
    }
    /* The rebased functions we need to decorate compose constructors with */
    var doExtend = rebase(extend);
    var doMixin = rebase(mixin);
    var doOverlay = rebase(overlay);
    var doAspect = rebase(aspect);
    /**
     * A convenience function to decorate compose class constructors
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
    function cloneFactory(base) {
        function factory() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (this && this.constructor === factory) {
                throw new SyntaxError('Factories cannot be called with "new".');
            }
            var instance = Object.create(factory.prototype);
            args.unshift(instance);
            initFnMap.get(factory).forEach(function (fn) { return fn.apply(null, args); });
            return instance;
        }
        if (base) {
            copyProperties(factory.prototype, base.prototype);
            initFnMap.set(factory, [].concat(initFnMap.get(base)));
        }
        else {
            initFnMap.set(factory, []);
        }
        factory.prototype.constructor = factory;
        stamp(factory);
        Object.freeze(factory);
        return factory;
    }
    /**
     * Takes any init functions from source and concats them to base
     * @param target The compose factory to copy the init functions onto
     * @param source The ComposeFactory to copy the init functions from
     */
    function concatInitFn(target, source) {
        var sourceInitFns = initFnMap.get(source);
        /* making sure only unique functions get added */
        var targetInitFns = initFnMap.get(target).filter(function (fn) {
            return sourceInitFns.indexOf(fn) < 0;
        });
        /* now prepend the source init functions to the unique init functions for the target */
        initFnMap.set(target, sourceInitFns.concat(targetInitFns));
    }
    /**
     * A custom type guard that determines if the value is a ComposeFactory
     * @param   value The target to check
     * @returns       Return true if it is a ComposeFactory, otherwise false
     */
    function isComposeFactory(value) {
        return Boolean(initFnMap.get(value));
    }
    exports.isComposeFactory = isComposeFactory;
    function extend(base, extension) {
        base = cloneFactory(base);
        copyProperties(base.prototype, typeof extension === 'function' ? extension.prototype : extension);
        return base;
    }
    function overlay(base, overlayFunction) {
        base = cloneFactory(base);
        overlayFunction(base.prototype);
        return base;
    }
    function mixin(base, mixin) {
        base = cloneFactory(base);
        var baseInitFns = initFnMap.get(base);
        if (mixin.mixin) {
            var mixinFactory = isComposeFactory(mixin.mixin) ? mixin.mixin : create(mixin.mixin);
            if (mixin.initializer) {
                if (baseInitFns.indexOf(mixin.initializer) < 0) {
                    baseInitFns.unshift(mixin.initializer);
                }
            }
            concatInitFn(base, mixinFactory);
            copyProperties(base.prototype, mixinFactory.prototype);
        }
        else if (mixin.initializer) {
            if (baseInitFns.indexOf(mixin.initializer) < 0) {
                baseInitFns.unshift(mixin.initializer);
            }
        }
        if (mixin.aspectAdvice) {
            base = aspect(base, mixin.aspectAdvice);
        }
        return base;
    }
    function from(base, method) {
        return base.prototype[method];
    }
    function doFrom(base, method) {
        var clone = cloneFactory(this);
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
        var clone = cloneFactory(this);
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
        var clone = cloneFactory(this);
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
        var clone = cloneFactory(this);
        clone.prototype[method] = aspect_1.around(clone.prototype[method], advice);
        return clone;
    }
    function aspect(base, advice) {
        var clone = cloneFactory(base);
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
        var factory = cloneFactory();
        if (initFunction) {
            initFnMap.get(factory).push(initFunction);
        }
        /* mixin the base into the prototype */
        copyProperties(factory.prototype, typeof base === 'function' ? base.prototype : base);
        /* return the new constructor */
        return factory;
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