/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @ignore */
var ENTRIES = 'ENTRIES';
/** @ignore */
var KEYS = 'KEYS';
/** @ignore */
var VALUES = 'VALUES';
/** @ignore */
var LEAF = '';
/**
 * @private
 */
var TreeIterator = /** @class */ (function () {
    function TreeIterator(set, type) {
        var node = set._tree;
        var keys = Object.keys(node);
        this.set = set;
        this._type = type;
        this._path = keys.length > 0 ? [{ node: node, keys: keys }] : [];
    }
    TreeIterator.prototype.next = function () {
        var value = this.dive();
        this.backtrack();
        return value;
    };
    TreeIterator.prototype.dive = function () {
        if (this._path.length === 0) {
            return { done: true, value: undefined };
        }
        var _a = last$1(this._path), node = _a.node, keys = _a.keys;
        if (last$1(keys) === LEAF) {
            return { done: false, value: this.result() };
        }
        this._path.push({ node: node[last$1(keys)], keys: Object.keys(node[last$1(keys)]) });
        return this.dive();
    };
    TreeIterator.prototype.backtrack = function () {
        if (this._path.length === 0) {
            return;
        }
        last$1(this._path).keys.pop();
        if (last$1(this._path).keys.length > 0) {
            return;
        }
        this._path.pop();
        this.backtrack();
    };
    TreeIterator.prototype.key = function () {
        return this.set._prefix + this._path
            .map(function (_a) {
            var keys = _a.keys;
            return last$1(keys);
        })
            .filter(function (key) { return key !== LEAF; })
            .join('');
    };
    TreeIterator.prototype.value = function () {
        return last$1(this._path).node[LEAF];
    };
    TreeIterator.prototype.result = function () {
        if (this._type === VALUES) {
            return this.value();
        }
        if (this._type === KEYS) {
            return this.key();
        }
        return [this.key(), this.value()];
    };
    TreeIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    return TreeIterator;
}());
var last$1 = function (array) {
    return array[array.length - 1];
};

var NONE = 0;
var CHANGE = 1;
var ADD = 2;
var DELETE = 3;
/**
 * @ignore
 */
var fuzzySearch = function (node, query, maxDistance) {
    var stack = [{ distance: 0, i: 0, key: '', node: node }];
    var results = {};
    var innerStack = [];
    var _loop_1 = function () {
        var _a = stack.pop(), node_1 = _a.node, distance = _a.distance, key = _a.key, i = _a.i, edit = _a.edit;
        Object.keys(node_1).forEach(function (k) {
            if (k === LEAF) {
                var totDistance = distance + (query.length - i);
                var _a = __read(results[key] || [null, Infinity], 2), d = _a[1];
                if (totDistance <= maxDistance && totDistance < d) {
                    results[key] = [node_1[k], totDistance];
                }
            }
            else {
                withinDistance(query, k, maxDistance - distance, i, edit, innerStack).forEach(function (_a) {
                    var d = _a.distance, i = _a.i, edit = _a.edit;
                    stack.push({ node: node_1[k], distance: distance + d, key: key + k, i: i, edit: edit });
                });
            }
        });
    };
    while (stack.length > 0) {
        _loop_1();
    }
    return results;
};
/**
 * @ignore
 */
var withinDistance = function (a, b, maxDistance, i, edit, stack) {
    stack.push({ distance: 0, ia: i, ib: 0, edit: edit });
    var results = [];
    while (stack.length > 0) {
        var _a = stack.pop(), distance = _a.distance, ia = _a.ia, ib = _a.ib, edit_1 = _a.edit;
        if (ib === b.length) {
            results.push({ distance: distance, i: ia, edit: edit_1 });
            continue;
        }
        if (a[ia] === b[ib]) {
            stack.push({ distance: distance, ia: ia + 1, ib: ib + 1, edit: NONE });
        }
        else {
            if (distance >= maxDistance) {
                continue;
            }
            if (edit_1 !== ADD) {
                stack.push({ distance: distance + 1, ia: ia, ib: ib + 1, edit: DELETE });
            }
            if (ia < a.length) {
                if (edit_1 !== DELETE) {
                    stack.push({ distance: distance + 1, ia: ia + 1, ib: ib, edit: ADD });
                }
                if (edit_1 !== DELETE && edit_1 !== ADD) {
                    stack.push({ distance: distance + 1, ia: ia + 1, ib: ib + 1, edit: CHANGE });
                }
            }
        }
    }
    return results;
};

/**
 * A class implementing the same interface as a standard JavaScript
 * [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
 * with string keys, but adding support for efficiently searching entries with
 * prefix or fuzzy search. This class is used internally by [[MiniSearch]] as
 * the inverted index data structure. The implementation is a radix tree
 * (compressed prefix tree).
 *
 * Since this class can be of general utility beyond _MiniSearch_, it is
 * exported by the `minisearch` package and can be imported (or required) as
 * `minisearch/SearchableMap`.
 *
 * @typeParam T  The type of the values stored in the map.
 */
var SearchableMap = /** @class */ (function () {
    /**
     * The constructor is normally called without arguments, creating an empty
     * map. In order to create a [[SearchableMap]] from an iterable or from an
     * object, check [[SearchableMap.from]] and [[SearchableMap.fromObject]].
     *
     * The constructor arguments are for internal use, when creating derived
     * mutable views of a map at a prefix.
     */
    function SearchableMap(tree, prefix) {
        if (tree === void 0) { tree = {}; }
        if (prefix === void 0) { prefix = ''; }
        this._tree = tree;
        this._prefix = prefix;
    }
    /**
     * Creates and returns a mutable view of this [[SearchableMap]], containing only
     * entries that share the given prefix.
     *
     * ### Usage:
     *
     * ```javascript
     * let map = new SearchableMap()
     * map.set("unicorn", 1)
     * map.set("universe", 2)
     * map.set("university", 3)
     * map.set("unique", 4)
     * map.set("hello", 5)
     *
     * let uni = map.atPrefix("uni")
     * uni.get("unique") // => 4
     * uni.get("unicorn") // => 1
     * uni.get("hello") // => undefined
     *
     * let univer = map.atPrefix("univer")
     * univer.get("unique") // => undefined
     * univer.get("universe") // => 2
     * univer.get("university") // => 3
     * ```
     *
     * @param prefix  The prefix
     * @return A [[SearchableMap]] representing a mutable view of the original Map at the given prefix
     */
    SearchableMap.prototype.atPrefix = function (prefix) {
        var _a;
        if (!prefix.startsWith(this._prefix)) {
            throw new Error('Mismatched prefix');
        }
        var _b = __read(trackDown(this._tree, prefix.slice(this._prefix.length)), 2), node = _b[0], path = _b[1];
        if (node === undefined) {
            var _c = __read(last(path), 2), parentNode = _c[0], key_1 = _c[1];
            var nodeKey = Object.keys(parentNode).find(function (k) { return k !== LEAF && k.startsWith(key_1); });
            if (nodeKey !== undefined) {
                return new SearchableMap((_a = {}, _a[nodeKey.slice(key_1.length)] = parentNode[nodeKey], _a), prefix);
            }
        }
        return new SearchableMap(node || {}, prefix);
    };
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear
     */
    SearchableMap.prototype.clear = function () {
        delete this._size;
        this._tree = {};
    };
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete
     * @param key  Key to delete
     */
    SearchableMap.prototype.delete = function (key) {
        delete this._size;
        return remove(this._tree, key);
    };
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries
     * @return An iterator iterating through `[key, value]` entries.
     */
    SearchableMap.prototype.entries = function () {
        return new TreeIterator(this, ENTRIES);
    };
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach
     * @param fn  Iteration function
     */
    SearchableMap.prototype.forEach = function (fn) {
        var e_1, _a;
        try {
            for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                fn(key, value, this);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /**
     * Returns a key-value object of all the entries that have a key within the
     * given edit distance from the search key. The keys of the returned object are
     * the matching keys, while the values are two-elements arrays where the first
     * element is the value associated to the key, and the second is the edit
     * distance of the key to the search key.
     *
     * ### Usage:
     *
     * ```javascript
     * let map = new SearchableMap()
     * map.set('hello', 'world')
     * map.set('hell', 'yeah')
     * map.set('ciao', 'mondo')
     *
     * // Get all entries that match the key 'hallo' with a maximum edit distance of 2
     * map.fuzzyGet('hallo', 2)
     * // => { "hello": ["world", 1], "hell": ["yeah", 2] }
     *
     * // In the example, the "hello" key has value "world" and edit distance of 1
     * // (change "e" to "a"), the key "hell" has value "yeah" and edit distance of 2
     * // (change "e" to "a", delete "o")
     * ```
     *
     * @param key  The search key
     * @param maxEditDistance  The maximum edit distance (Levenshtein)
     * @return A key-value object of the matching keys to their value and edit distance
     */
    SearchableMap.prototype.fuzzyGet = function (key, maxEditDistance) {
        return fuzzySearch(this._tree, key, maxEditDistance);
    };
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get
     * @param key  Key to get
     * @return Value associated to the key, or `undefined` if the key is not
     * found.
     */
    SearchableMap.prototype.get = function (key) {
        var node = lookup(this._tree, key);
        return node !== undefined ? node[LEAF] : undefined;
    };
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has
     * @param key  Key
     * @return True if the key is in the map, false otherwise
     */
    SearchableMap.prototype.has = function (key) {
        var node = lookup(this._tree, key);
        return node !== undefined && node.hasOwnProperty(LEAF);
    };
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys
     * @return An `Iterable` iterating through keys
     */
    SearchableMap.prototype.keys = function () {
        return new TreeIterator(this, KEYS);
    };
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set
     * @param key  Key to set
     * @param value  Value to associate to the key
     * @return The [[SearchableMap]] itself, to allow chaining
     */
    SearchableMap.prototype.set = function (key, value) {
        if (typeof key !== 'string') {
            throw new Error('key must be a string');
        }
        delete this._size;
        var node = createPath(this._tree, key);
        node[LEAF] = value;
        return this;
    };
    Object.defineProperty(SearchableMap.prototype, "size", {
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size
         */
        get: function () {
            var _this = this;
            if (this._size) {
                return this._size;
            }
            /** @ignore */
            this._size = 0;
            this.forEach(function () { _this._size += 1; });
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Updates the value at the given key using the provided function. The function
     * is called with the current value at the key, and its return value is used as
     * the new value to be set.
     *
     * ### Example:
     *
     * ```javascript
     * // Increment the current value by one
     * searchableMap.update('somekey', (currentValue) => currentValue == null ? 0 : currentValue + 1)
     * ```
     *
     * @param key  The key to update
     * @param fn  The function used to compute the new value from the current one
     * @return The [[SearchableMap]] itself, to allow chaining
     */
    SearchableMap.prototype.update = function (key, fn) {
        if (typeof key !== 'string') {
            throw new Error('key must be a string');
        }
        delete this._size;
        var node = createPath(this._tree, key);
        node[LEAF] = fn(node[LEAF]);
        return this;
    };
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values
     * @return An `Iterable` iterating through values.
     */
    SearchableMap.prototype.values = function () {
        return new TreeIterator(this, VALUES);
    };
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/@@iterator
     */
    SearchableMap.prototype[Symbol.iterator] = function () {
        return this.entries();
    };
    /**
     * Creates a [[SearchableMap]] from an `Iterable` of entries
     *
     * @param entries  Entries to be inserted in the [[SearchableMap]]
     * @return A new [[SearchableMap]] with the given entries
     */
    SearchableMap.from = function (entries) {
        var e_2, _a;
        var tree = new SearchableMap();
        try {
            for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                var _b = __read(entries_1_1.value, 2), key = _b[0], value = _b[1];
                tree.set(key, value);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return tree;
    };
    /**
     * Creates a [[SearchableMap]] from the iterable properties of a JavaScript object
     *
     * @param object  Object of entries for the [[SearchableMap]]
     * @return A new [[SearchableMap]] with the given entries
     */
    SearchableMap.fromObject = function (object) {
        return SearchableMap.from(Object.entries(object));
    };
    return SearchableMap;
}());
var trackDown = function (tree, key, path) {
    if (path === void 0) { path = []; }
    if (key.length === 0 || tree == null) {
        return [tree, path];
    }
    var nodeKey = Object.keys(tree).find(function (k) { return k !== LEAF && key.startsWith(k); });
    if (nodeKey === undefined) {
        path.push([tree, key]); // performance: update in place
        return trackDown(undefined, '', path);
    }
    path.push([tree, nodeKey]); // performance: update in place
    return trackDown(tree[nodeKey], key.slice(nodeKey.length), path);
};
var lookup = function (tree, key) {
    if (key.length === 0 || tree == null) {
        return tree;
    }
    var nodeKey = Object.keys(tree).find(function (k) { return k !== LEAF && key.startsWith(k); });
    if (nodeKey === undefined) {
        return undefined;
    }
    return lookup(tree[nodeKey], key.slice(nodeKey.length));
};
var createPath = function (tree, key) {
    var _a;
    if (key.length === 0 || tree == null) {
        return tree;
    }
    var nodeKey = Object.keys(tree).find(function (k) { return k !== LEAF && key.startsWith(k); });
    if (nodeKey === undefined) {
        var toSplit = Object.keys(tree).find(function (k) { return k !== LEAF && k.startsWith(key[0]); });
        if (toSplit === undefined) {
            tree[key] = {};
        }
        else {
            var prefix = commonPrefix(key, toSplit);
            tree[prefix] = (_a = {}, _a[toSplit.slice(prefix.length)] = tree[toSplit], _a);
            delete tree[toSplit];
            return createPath(tree[prefix], key.slice(prefix.length));
        }
        return tree[key];
    }
    return createPath(tree[nodeKey], key.slice(nodeKey.length));
};
var commonPrefix = function (a, b, i, length, prefix) {
    if (i === void 0) { i = 0; }
    if (length === void 0) { length = Math.min(a.length, b.length); }
    if (prefix === void 0) { prefix = ''; }
    if (i >= length) {
        return prefix;
    }
    if (a[i] !== b[i]) {
        return prefix;
    }
    return commonPrefix(a, b, i + 1, length, prefix + a[i]);
};
var remove = function (tree, key) {
    var _a = __read(trackDown(tree, key), 2), node = _a[0], path = _a[1];
    if (node === undefined) {
        return;
    }
    delete node[LEAF];
    var keys = Object.keys(node);
    if (keys.length === 0) {
        cleanup(path);
    }
    if (keys.length === 1) {
        merge(path, keys[0], node[keys[0]]);
    }
};
var cleanup = function (path) {
    if (path.length === 0) {
        return;
    }
    var _a = __read(last(path), 2), node = _a[0], key = _a[1];
    delete node[key];
    var keys = Object.keys(node);
    if (keys.length === 0) {
        cleanup(path.slice(0, -1));
    }
    if (keys.length === 1 && keys[0] !== LEAF) {
        merge(path.slice(0, -1), keys[0], node[keys[0]]);
    }
};
var merge = function (path, key, value) {
    if (path.length === 0) {
        return;
    }
    var _a = __read(last(path), 2), node = _a[0], nodeKey = _a[1];
    node[nodeKey + key] = value;
    delete node[nodeKey];
};
var last = function (array) {
    return array[array.length - 1];
};

export { SearchableMap as default };
//# sourceMappingURL=SearchableMap.js.map
