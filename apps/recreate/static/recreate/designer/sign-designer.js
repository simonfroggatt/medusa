import { n as e } from "./interface-bJtS-5-D.js";
//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function t(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var n = {}, r = [], i = () => {}, a = () => !1, o = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), s = (e) => e.startsWith("onUpdate:"), c = Object.assign, l = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, u = Object.prototype.hasOwnProperty, d = (e, t) => u.call(e, t), f = Array.isArray, p = (e) => S(e) === "[object Map]", m = (e) => S(e) === "[object Set]", h = (e) => S(e) === "[object Date]", g = (e) => typeof e == "function", _ = (e) => typeof e == "string", v = (e) => typeof e == "symbol", y = (e) => typeof e == "object" && !!e, b = (e) => (y(e) || g(e)) && g(e.then) && g(e.catch), x = Object.prototype.toString, S = (e) => x.call(e), C = (e) => S(e).slice(8, -1), w = (e) => S(e) === "[object Object]", T = (e) => _(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, E = /* @__PURE__ */ t(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), ee = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, te = /-\w/g, D = ee((e) => e.replace(te, (e) => e.slice(1).toUpperCase())), ne = /\B([A-Z])/g, re = ee((e) => e.replace(ne, "-$1").toLowerCase()), ie = ee((e) => e.charAt(0).toUpperCase() + e.slice(1)), ae = ee((e) => e ? `on${ie(e)}` : ""), oe = (e, t) => !Object.is(e, t), O = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, se = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, ce = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, le, ue = () => le ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function k(e) {
	if (f(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = _(r) ? me(r) : k(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (_(e) || y(e)) return e;
}
var de = /;(?![^(]*\))/g, fe = /:([^]+)/, pe = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function me(e) {
	let t = {};
	return e.replace(pe, (e) => e.startsWith("/*") ? "" : e).split(de).forEach((e) => {
		if (e) {
			let n = e.split(fe);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function he(e) {
	let t = "";
	if (_(e)) t = e;
	else if (f(e)) for (let n = 0; n < e.length; n++) {
		let r = he(e[n]);
		r && (t += r + " ");
	}
	else if (y(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var ge = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", _e = /* @__PURE__ */ t(ge);
ge + "";
function ve(e) {
	return !!e || e === "";
}
function ye(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = xe(e[i], t[i], n);
	return r;
}
function A(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && xe(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function be(e, t, n) {
	let r = p(e), i = p(t);
	if (r || i || (r = m(e), i = m(t), r || i)) return r && i ? A(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !xe(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function j(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function xe(e, t, n) {
	if (e === t) return !0;
	let r = h(e), i = h(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = v(e), i = v(t), r || i ? e === t : (r = f(e), i = f(t), r || i ? r && i ? j(e, t, n, ye) : !1 : (r = y(e), i = y(t), r || i ? !r || !i ? !1 : j(e, t, n, be) : String(e) === String(t))));
}
var Se = (e) => !!(e && e.__v_isRef === !0), M = (e) => _(e) ? e : e == null ? "" : f(e) || y(e) && (e.toString === x || !g(e.toString)) ? Se(e) ? M(e.value) : JSON.stringify(e, Ce, 2) : String(e), Ce = (e, t) => Se(t) ? Ce(e, t.value) : p(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[we(t, r) + " =>"] = n, e), {}) } : m(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => we(e)) } : v(t) ? we(t) : y(t) && !f(t) && !w(t) ? String(t) : t, we = (e, t = "") => v(e) ? `Symbol(${e.description ?? t})` : e, Te, Ee = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Te && (Te.active ? (this.parent = Te, this.index = (Te.scopes || (Te.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].pause();
			}
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].resume();
			}
			let n = this.effects.slice();
			for (e = 0, t = n.length; e < t; e++) n[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = Te;
			try {
				return Te = this, e();
			} finally {
				Te = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Te, Te = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Te === this) Te = this.prevScope;
			else {
				let e = Te;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				let e = this.scopes.slice();
				for (t = 0, n = e.length; t < n; t++) e[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function De() {
	return Te;
}
var N, Oe = /* @__PURE__ */ new WeakSet(), ke = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Te && (Te.active ? Te.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Oe.has(this) && (Oe.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ne(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ke(this), Ie(this);
		let e = N, t = He;
		N = this, He = !0;
		try {
			return this.fn();
		} finally {
			Le(this), N = e, He = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Be(e);
			this.deps = this.depsTail = void 0, Ke(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Oe.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Re(this) && this.run();
	}
	get dirty() {
		return Re(this);
	}
}, Ae = 0, je, Me;
function Ne(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Me, Me = e;
		return;
	}
	e.next = je, je = e;
}
function Pe() {
	Ae++;
}
function Fe() {
	if (--Ae > 0) return;
	if (Me) {
		let e = Me;
		for (Me = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; je;) {
		let t = je;
		for (je = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function Ie(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Le(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Be(r), Ve(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Re(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (ze(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function ze(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === qe) || (e.globalVersion = qe, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Re(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = N, r = He;
	N = e, He = !0;
	try {
		Ie(e);
		let n = e.fn(e._value);
		(t.version === 0 || oe(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		N = n, He = r, Le(e), e.flags &= -3;
	}
}
function Be(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Be(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ve(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var He = !0, Ue = [];
function We() {
	Ue.push(He), He = !1;
}
function Ge() {
	let e = Ue.pop();
	He = e === void 0 || e;
}
function Ke(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = N;
		N = void 0;
		try {
			t();
		} finally {
			N = e;
		}
	}
}
var qe = 0, Je = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ye = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!N || !He || N === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== N) t = this.activeLink = new Je(N, this), N.deps ? (t.prevDep = N.depsTail, N.depsTail.nextDep = t, N.depsTail = t) : N.deps = N.depsTail = t, Xe(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = N.depsTail, t.nextDep = void 0, N.depsTail.nextDep = t, N.depsTail = t, N.deps === t && (N.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, qe++, this.notify(e);
	}
	notify(e) {
		Pe();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Fe();
		}
	}
};
function Xe(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Xe(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Ze = /* @__PURE__ */ new WeakMap(), Qe = /* @__PURE__ */ Symbol(""), $e = /* @__PURE__ */ Symbol(""), et = /* @__PURE__ */ Symbol("");
function tt(e, t, n) {
	if (He && N) {
		let t = Ze.get(e);
		t || Ze.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Ye()), r.map = t, r.key = n), r.track();
	}
}
function nt(e, t, n, r, i, a) {
	let o = Ze.get(e);
	if (!o) {
		qe++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Pe(), t === "clear") o.forEach(s);
	else {
		let i = f(e), a = i && T(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === et || !v(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(et)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Qe)), p(e) && s(o.get($e)));
				break;
			case "delete":
				i || (s(o.get(Qe)), p(e) && s(o.get($e)));
				break;
			case "set": p(e) && s(o.get(Qe));
		}
	}
	Fe();
}
function rt(e) {
	let t = /* @__PURE__ */ F(e);
	return t === e || (tt(t, "iterate", et), /* @__PURE__ */ Vt(e)) ? t : /* @__PURE__ */ Bt(e) ? /* @__PURE__ */ zt(e) ? t.map((e) => Gt(Wt(e))) : t.map(Gt) : t.map(Wt);
}
function it(e) {
	return tt(e = /* @__PURE__ */ F(e), "iterate", et), e;
}
function at(e, t) {
	return /* @__PURE__ */ Bt(e) ? Gt(/* @__PURE__ */ zt(e) ? Wt(t) : t) : Wt(t);
}
var ot = {
	__proto__: null,
	[Symbol.iterator]() {
		return st(this, Symbol.iterator, (e) => at(this, e));
	},
	concat(...e) {
		return rt(this).concat(...e.map((e) => f(e) ? rt(e) : e));
	},
	entries() {
		return st(this, "entries", (e) => (e[1] = at(this, e[1]), e));
	},
	every(e, t) {
		return lt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return lt(this, "filter", e, t, (e) => e.map((e) => at(this, e)), arguments);
	},
	find(e, t) {
		return lt(this, "find", e, t, (e) => at(this, e), arguments);
	},
	findIndex(e, t) {
		return lt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return lt(this, "findLast", e, t, (e) => at(this, e), arguments);
	},
	findLastIndex(e, t) {
		return lt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return lt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ut(this, "includes", e);
	},
	indexOf(...e) {
		return ut(this, "indexOf", e);
	},
	join(e) {
		return rt(this).join(e);
	},
	lastIndexOf(...e) {
		return ut(this, "lastIndexOf", e);
	},
	map(e, t) {
		return lt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return dt(this, "pop");
	},
	push(...e) {
		return dt(this, "push", e);
	},
	reduce(e, ...t) {
		return P(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return P(this, "reduceRight", e, t);
	},
	shift() {
		return dt(this, "shift");
	},
	some(e, t) {
		return lt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return dt(this, "splice", e);
	},
	toReversed() {
		return rt(this).toReversed();
	},
	toSorted(e) {
		return rt(this).toSorted(e);
	},
	toSpliced(...e) {
		return rt(this).toSpliced(...e);
	},
	unshift(...e) {
		return dt(this, "unshift", e);
	},
	values() {
		return st(this, "values", (e) => at(this, e));
	}
};
function st(e, t, n) {
	let r = it(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Vt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var ct = Array.prototype;
function lt(e, t, n, r, i, a) {
	let o = it(e), s = o !== e && !/* @__PURE__ */ Vt(e), c = o[t];
	if (c !== ct[t]) {
		let t = c.apply(e, a);
		return s ? Wt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, at(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function P(e, t, n, r) {
	let i = it(e), a = i !== e && !/* @__PURE__ */ Vt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = at(e, t)), n.call(this, t, at(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? at(e, c) : c;
}
function ut(e, t, n) {
	let r = /* @__PURE__ */ F(e);
	tt(r, "iterate", et);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Ht(n[0]) ? (n[0] = /* @__PURE__ */ F(n[0]), r[t](...n)) : i;
}
function dt(e, t, n = []) {
	We(), Pe();
	let r = (/* @__PURE__ */ F(e))[t].apply(e, n);
	return Fe(), Ge(), r;
}
var ft = /* @__PURE__ */ t("__proto__,__v_isRef,__isVue"), pt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(v));
function mt(e) {
	v(e) || (e = String(e));
	let t = /* @__PURE__ */ F(this);
	return tt(t, "has", e), t.hasOwnProperty(e);
}
var ht = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Nt : Mt : i ? jt : At).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = f(e);
		if (!r) {
			let e;
			if (a && (e = ot[t])) return e;
			if (t === "hasOwnProperty") return mt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ Kt(e) ? e : n);
		if ((v(t) ? pt.has(t) : ft(t)) || (r || tt(e, "get", t), i)) return o;
		if (/* @__PURE__ */ Kt(o)) {
			let e = a && T(t) ? o : o.value;
			return r && y(e) ? /* @__PURE__ */ Lt(e) : e;
		}
		return y(o) ? r ? /* @__PURE__ */ Lt(o) : /* @__PURE__ */ Ft(o) : o;
	}
}, gt = class extends ht {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = f(e) && T(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Bt(i);
			if (!/* @__PURE__ */ Vt(n) && !/* @__PURE__ */ Bt(n) && (i = /* @__PURE__ */ F(i), n = /* @__PURE__ */ F(n)), !a && /* @__PURE__ */ Kt(i) && !/* @__PURE__ */ Kt(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : d(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ Kt(e) ? e : r);
		return e === /* @__PURE__ */ F(r) && s && (o ? oe(n, i) && nt(e, "set", t, n, i) : nt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = d(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && nt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!v(t) || !pt.has(t)) && tt(e, "has", t), n;
	}
	ownKeys(e) {
		return tt(e, "iterate", f(e) ? "length" : Qe), Reflect.ownKeys(e);
	}
}, _t = class extends ht {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, vt = /* @__PURE__ */ new gt(), yt = /* @__PURE__ */ new _t(), bt = /* @__PURE__ */ new gt(!0), xt = (e) => e, St = (e) => Reflect.getPrototypeOf(e);
function Ct(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ F(i), o = p(a), s = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? xt : t ? Gt : Wt;
		return !t && tt(a, "iterate", l ? $e : Qe), c(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: s ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function wt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Tt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ F(r), a = /* @__PURE__ */ F(n);
			e || (oe(n, a) && tt(i, "get", n), tt(i, "get", a));
			let { has: o } = St(i), s = t ? xt : e ? Gt : Wt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && tt(/* @__PURE__ */ F(t), "iterate", Qe), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ F(n), i = /* @__PURE__ */ F(t);
			return e || (oe(t, i) && tt(r, "has", t), tt(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ F(a), s = t ? xt : e ? Gt : Wt;
			return !e && tt(o, "iterate", Qe), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return c(n, e ? {
		add: wt("add"),
		set: wt("set"),
		delete: wt("delete"),
		clear: wt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ F(this), r = St(n), i = /* @__PURE__ */ F(e), a = !t && !/* @__PURE__ */ Vt(e) && !/* @__PURE__ */ Bt(e) ? i : e;
			return r.has.call(n, a) || oe(e, a) && r.has.call(n, e) || oe(i, a) && r.has.call(n, i) || (n.add(a), nt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Vt(n) && !/* @__PURE__ */ Bt(n) && (n = /* @__PURE__ */ F(n));
			let r = /* @__PURE__ */ F(this), { has: i, get: a } = St(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ F(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? oe(n, s) && nt(r, "set", e, n, s) : nt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ F(this), { has: n, get: r } = St(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ F(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && nt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ F(this), t = e.size !== 0, n = e.clear();
			return t && nt(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Ct(r, e, t);
	}), n;
}
function Et(e, t) {
	let n = Tt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(d(n, r) && r in t ? n : t, r, i);
}
var Dt = { get: /* @__PURE__ */ Et(!1, !1) }, Ot = { get: /* @__PURE__ */ Et(!1, !0) }, kt = { get: /* @__PURE__ */ Et(!0, !1) }, At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap(), Mt = /* @__PURE__ */ new WeakMap(), Nt = /* @__PURE__ */ new WeakMap();
function Pt(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return /* @__PURE__ */ Bt(e) ? e : Rt(e, !1, vt, Dt, At);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return Rt(e, !1, bt, Ot, jt);
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return Rt(e, !0, yt, kt, Mt);
}
function Rt(e, t, n, r, i) {
	if (!y(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Pt(C(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return /* @__PURE__ */ Bt(e) ? /* @__PURE__ */ zt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Ht(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function F(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ F(t) : e;
}
function Ut(e) {
	return !d(e, "__v_skip") && Object.isExtensible(e) && se(e, "__v_skip", !0), e;
}
var Wt = (e) => y(e) ? /* @__PURE__ */ Ft(e) : e, Gt = (e) => y(e) ? /* @__PURE__ */ Lt(e) : e;
// @__NO_SIDE_EFFECTS__
function Kt(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function I(e) {
	return Jt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function qt(e) {
	return Jt(e, !0);
}
function Jt(e, t) {
	return /* @__PURE__ */ Kt(e) ? e : new Yt(e, t);
}
var Yt = class {
	constructor(e, t) {
		this.dep = new Ye(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ F(e), this._value = t ? e : Wt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Vt(e) || /* @__PURE__ */ Bt(e);
		e = n ? e : /* @__PURE__ */ F(e), oe(e, t) && (this._rawValue = e, this._value = n ? e : Wt(e), this.dep.trigger());
	}
};
function L(e) {
	return /* @__PURE__ */ Kt(e) ? e.value : e;
}
var Xt = {
	get: (e, t, n) => t === "__v_raw" ? e : L(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ Kt(i) && !/* @__PURE__ */ Kt(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Zt(e) {
	return /* @__PURE__ */ zt(e) ? e : new Proxy(e, Xt);
}
var Qt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ye(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = qe - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && N !== this) return Ne(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return ze(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function $t(e, t, n = !1) {
	let r, i;
	return g(e) ? r = e : (r = e.get, i = e.set), new Qt(r, i, n);
}
var en = {}, tn = /* @__PURE__ */ new WeakMap(), nn = void 0;
function rn(e, t = !1, n = nn) {
	if (n) {
		let t = tn.get(n);
		t || tn.set(n, t = []), t.push(e);
	}
}
function an(e, t, r = n) {
	let { immediate: a, deep: o, once: s, scheduler: c, augmentJob: u, call: d } = r, p = (e) => o ? e : /* @__PURE__ */ Vt(e) || o === !1 || o === 0 ? on(e, 1) : on(e), m, h, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ Kt(e) ? (h = () => e.value, y = /* @__PURE__ */ Vt(e)) : /* @__PURE__ */ zt(e) ? (h = () => p(e), y = !0) : f(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ zt(e) || /* @__PURE__ */ Vt(e)), h = () => e.map((e) => {
		if (/* @__PURE__ */ Kt(e)) return e.value;
		if (/* @__PURE__ */ zt(e)) return p(e);
		if (g(e)) return d ? d(e, 2) : e();
	})) : h = g(e) ? t ? d ? () => d(e, 2) : e : () => {
		if (_) {
			We();
			try {
				_();
			} finally {
				Ge();
			}
		}
		let t = nn;
		nn = m;
		try {
			return d ? d(e, 3, [v]) : e(v);
		} finally {
			nn = t;
		}
	} : i, t && o) {
		let e = h, t = o === !0 ? Infinity : o;
		h = () => on(e(), t);
	}
	let x = De(), S = () => {
		m.stop(), x && x.active && l(x.effects, m);
	};
	if (s && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(en) : en, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (t) {
				let n = m.run();
				if (e || o || y || (b ? n.some((e, t) => oe(e, C[t])) : oe(n, C))) {
					_ && _();
					let e = nn;
					nn = m;
					try {
						let e = [
							n,
							C === en ? void 0 : b && C[0] === en ? [] : C,
							v
						];
						C = n, d ? d(t, 3, e) : t(...e);
					} finally {
						nn = e;
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new ke(h), m.scheduler = c ? () => c(w, !1) : w, v = (e) => rn(e, !1, m), _ = m.onStop = () => {
		let e = tn.get(m);
		if (e) {
			if (d) d(e, 4);
			else for (let t of e) t();
			tn.delete(m);
		}
	}, t ? a ? w(!0) : C = m.run() : c ? c(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function on(e, t = Infinity, n) {
	if (t <= 0 || !y(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ Kt(e)) on(e.value, t, n);
	else if (f(e)) for (let r = 0; r < e.length; r++) on(e[r], t, n);
	else if (m(e) || p(e)) e.forEach((e) => {
		on(e, t, n);
	});
	else if (w(e)) {
		for (let r in e) on(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && on(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function sn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		ln(e, t, n);
	}
}
function cn(e, t, n, r) {
	if (g(e)) {
		let i = sn(e, t, n, r);
		return i && b(i) && i.catch((e) => {
			ln(e, t, n);
		}), i;
	}
	if (f(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(cn(e[a], t, n, r));
		return i;
	}
}
function ln(e, t, r, i = !0) {
	let a = t ? t.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = t && t.appContext.config || n;
	if (t) {
		let n = t.parent, i = t.proxy, a = `https://vuejs.org/error-reference/#runtime-${r}`;
		for (; n;) {
			let t = n.ec;
			if (t) {
				for (let n = 0; n < t.length; n++) if (t[n](e, i, a) === !1) return;
			}
			n = n.parent;
		}
		if (o) {
			We(), sn(o, null, 10, [
				e,
				i,
				a
			]), Ge();
			return;
		}
	}
	un(e, r, a, i, s);
}
function un(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var dn = [], fn = -1, pn = [], mn = null, hn = 0, gn = /* @__PURE__ */ Promise.resolve(), _n = null;
function vn(e) {
	let t = _n || gn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function yn(e) {
	let t = fn + 1, n = dn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = dn[r], a = Tn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function bn(e) {
	if (!(e.flags & 1)) {
		let t = Tn(e), n = dn[dn.length - 1];
		!n || !(e.flags & 2) && t >= Tn(n) ? dn.push(e) : dn.splice(yn(t), 0, e), e.flags |= 1, xn();
	}
}
function xn() {
	_n ||= gn.then(En);
}
function Sn(e) {
	if (!f(e)) mn && e.id === -1 ? mn.splice(hn + 1, 0, e) : e.flags & 1 || (pn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) pn.push(e[t]);
	xn();
}
function Cn(e, t, n = fn + 1) {
	for (; n < dn.length; n++) {
		let t = dn[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			dn.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function wn(e) {
	if (pn.length) {
		let e = [...new Set(pn)].sort((e, t) => Tn(e) - Tn(t));
		if (pn.length = 0, mn) {
			for (let t = 0; t < e.length; t++) mn.push(e[t]);
			return;
		}
		for (mn = e, hn = 0; hn < mn.length; hn++) {
			let e = mn[hn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		mn = null, hn = 0;
	}
}
var Tn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function En(e) {
	try {
		for (fn = 0; fn < dn.length; fn++) {
			let e = dn[fn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), sn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; fn < dn.length; fn++) {
			let e = dn[fn];
			e && (e.flags &= -2);
		}
		fn = -1, dn.length = 0, wn(e), _n = null, (dn.length || pn.length) && En(e);
	}
}
var Dn = null, On = null;
function kn(e) {
	let t = Dn;
	return Dn = e, On = e && e.type.__scopeId || null, t;
}
function An(e, t = Dn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Li(-1);
		let i = kn(t), a = Ni.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Ni.length; e > a; e--) Fi();
			kn(i), r._d && Li(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function jn(e, t) {
	if (Dn === null) return e;
	let r = ha(Dn), i = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [a, o, s, c = n] = t[e];
		a && (g(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && on(o), i.push({
			dir: a,
			instance: r,
			value: o,
			oldValue: void 0,
			arg: s,
			modifiers: c
		}));
	}
	return e;
}
function Mn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (We(), cn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ge());
	}
}
function Nn(e, t) {
	if (ta) {
		let n = ta.provides, r = ta.parent && ta.parent.provides;
		r === n && (n = ta.provides = Object.create(r)), n[e] = t;
	}
}
function Pn(e, t, n = !1) {
	let r = na();
	if (r || Br) {
		let i = Br ? Br._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && g(t) ? t.call(r && r.proxy) : t;
	}
}
var Fn = /* @__PURE__ */ Symbol.for("v-scx"), In = () => Pn(Fn);
function Ln(e, t, n) {
	return Rn(e, t, n);
}
function Rn(e, t, r = n) {
	let { immediate: a, deep: o, flush: s, once: l } = r, u = c({}, r), d = t && a || !t && s !== "post", f;
	if (ca) {
		if (s === "sync") {
			let e = In();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = i, e.resume = i, e.pause = i, e;
		}
	}
	let p = ta;
	u.call = (e, t, n) => cn(e, p, t, n);
	let m = !1;
	s === "post" ? u.scheduler = (e) => {
		_i(e, p && p.suspense);
	} : s !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : bn(e);
	}), u.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = an(e, t, u);
	return ca && (f ? f.push(h) : d && h()), h;
}
function zn(e, t, n) {
	let r = this.proxy, i = _(e) ? e.includes(".") ? Bn(r, e) : () => r[e] : e.bind(r, r), a;
	g(t) ? a = t : (a = t.handler, n = t);
	let o = aa(this), s = Rn(i, a.bind(r), n);
	return o(), s;
}
function Bn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Vn = /* @__PURE__ */ Symbol("_vte"), Hn = (e) => e.__isTeleport, Un = /* @__PURE__ */ Symbol("_leaveCb");
function Wn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== ji) {
			t = n;
			break;
		}
	}
	return t;
}
function Gn(e) {
	if (!$n(e)) return Hn(e.type) && e.children ? Wn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && g(n.default)) return n.default();
	}
}
function Kn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Kn(Hn(n.type) && Gn(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function R(e, t) {
	return g(e) ? /* @__PURE__ */ c({ name: e.name }, t, { setup: e }) : e;
}
function qn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Jn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Yn = /* @__PURE__ */ new WeakMap();
function Xn(e, t, r, i, o = !1) {
	if (f(e)) {
		e.forEach((e, n) => Xn(e, t && (f(t) ? t[n] : t), r, i, o));
		return;
	}
	if (Qn(i) && !o) {
		i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && Xn(e, t, r, i.component.subTree);
		return;
	}
	let s = i.shapeFlag & 4 ? ha(i.component) : i.el, c = o ? null : s, { i: u, r: p } = e, m = t && t.r, h = u.refs === n ? u.refs = {} : u.refs, v = u.setupState, y = /* @__PURE__ */ F(v), b = v === n ? a : (e) => !Jn(h, e) && d(y, e), x = (e, t) => !(t && Jn(h, t));
	if (m != null && m !== p) {
		if (Zn(t), _(m)) h[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ Kt(m)) {
			let e = t;
			x(m, e.k) && (m.value = null), e.k && (h[e.k] = null);
		}
	}
	if (g(p)) sn(p, u, 12, [c, h]);
	else {
		let t = _(p), n = /* @__PURE__ */ Kt(p);
		if (t || n) {
			let i = () => {
				if (e.f) {
					let n = t ? b(p) ? v[p] : h[p] : x(p) || !e.k ? p.value : h[e.k];
					if (o) f(n) && l(n, s);
					else if (f(n)) n.includes(s) || n.push(s);
					else if (t) h[p] = [s], b(p) && (v[p] = h[p]);
					else {
						let t = [s];
						x(p, e.k) && (p.value = t), e.k && (h[e.k] = t);
					}
				} else t ? (h[p] = c, b(p) && (v[p] = c)) : n && (x(p, e.k) && (p.value = c), e.k && (h[e.k] = c));
			};
			if (c) {
				let t = () => {
					i(), Yn.delete(e);
				};
				t.id = -1, Yn.set(e, t), _i(t, r);
			} else Zn(e), i();
		}
	}
}
function Zn(e) {
	let t = Yn.get(e);
	t && (t.flags |= 8, Yn.delete(e));
}
ue().requestIdleCallback, ue().cancelIdleCallback;
var Qn = (e) => !!e.type.__asyncLoader, $n = (e) => e.type.__isKeepAlive;
function er(e, t) {
	nr(e, "a", t);
}
function tr(e, t) {
	nr(e, "da", t);
}
function nr(e, t, n = ta) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (ir(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) $n(e.parent.vnode) && rr(r, t, n, e), e = e.parent;
	}
}
function rr(e, t, n, r) {
	let i = ir(t, e, r, !0);
	dr(() => {
		l(r[t], i);
	}, n);
}
function ir(e, t, n = ta, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			We();
			let i = aa(n), a = cn(t, n, e, r);
			return i(), Ge(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var ar = (e) => (t, n = ta) => {
	(!ca || e === "sp") && ir(e, (...e) => t(...e), n);
}, or = ar("bm"), sr = ar("m"), cr = ar("bu"), lr = ar("u"), ur = ar("bum"), dr = ar("um"), fr = ar("sp"), pr = ar("rtg"), mr = ar("rtc");
function hr(e, t = ta) {
	ir("ec", e, t);
}
var gr = /* @__PURE__ */ Symbol.for("v-ndc");
function z(e, t, n, r) {
	let i, a = n && n[r], o = f(e);
	if (o || _(e)) {
		let n = o && /* @__PURE__ */ zt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Vt(e), s = /* @__PURE__ */ Bt(e), e = it(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Gt(Wt(e[n])) : Wt(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (y(e)) {
		if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
		else {
			let n = Object.keys(e);
			i = Array(n.length);
			for (let r = 0, o = n.length; r < o; r++) {
				let o = n[r];
				i[r] = t(e[o], o, r, a && a[r]);
			}
		}
	} else i = [];
	return n && (n[r] = i), i;
}
var _r = (e) => e ? sa(e) ? ha(e) : _r(e.parent) : null, vr = /* @__PURE__ */ c(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => _r(e.parent),
	$root: (e) => _r(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Dr(e),
	$forceUpdate: (e) => e.f ||= () => {
		bn(e.update);
	},
	$nextTick: (e) => e.n ||= vn.bind(e.proxy),
	$watch: (e) => zn.bind(e)
}), yr = (e, t) => e !== n && !e.__isScriptSetup && d(e, t), br = {
	get({ _: e }, t) {
		if (t === "__v_skip") return !0;
		let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (t[0] !== "$") {
			let e = s[t];
			if (e !== void 0) switch (e) {
				case 1: return i[t];
				case 2: return a[t];
				case 4: return r[t];
				case 3: return o[t];
			}
			else if (yr(i, t)) return s[t] = 1, i[t];
			else if (a !== n && d(a, t)) return s[t] = 2, a[t];
			else if (d(o, t)) return s[t] = 3, o[t];
			else if (r !== n && d(r, t)) return s[t] = 4, r[t];
			else Sr && (s[t] = 0);
		}
		let u = vr[t], f, p;
		if (u) return t === "$attrs" && tt(e.attrs, "get", ""), u(e);
		if ((f = c.__cssModules) && (f = f[t])) return f;
		if (r !== n && d(r, t)) return s[t] = 4, r[t];
		if (p = l.config.globalProperties, d(p, t)) return p[t];
	},
	set({ _: e }, t, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return yr(a, t) ? (a[t] = r, !0) : i !== n && d(i, t) ? (i[t] = r, !0) : d(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (o[t] = r, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== n && c[0] !== "$" && d(e, c) || yr(t, c) || d(o, c) || d(i, c) || d(vr, c) || d(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? d(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function xr(e) {
	return f(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var Sr = !0;
function Cr(e) {
	let t = Dr(e), n = e.proxy, r = e.ctx;
	Sr = !1, t.beforeCreate && Tr(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: d, beforeMount: p, mounted: m, beforeUpdate: h, updated: _, activated: v, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: ee, errorCaptured: te, serverPrefetch: D, expose: ne, inheritAttrs: re, components: ie, directives: ae, filters: oe } = t;
	if (u && wr(u, r, null), s) for (let e in s) {
		let t = s[e];
		g(t) && (r[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		y(t) && (e.data = /* @__PURE__ */ Ft(t));
	}
	if (Sr = !0, o) for (let e in o) {
		let t = o[e], a = J({
			get: g(t) ? t.bind(n, n) : g(t.get) ? t.get.bind(n, n) : i,
			set: !g(t) && g(t.set) ? t.set.bind(n) : i
		});
		Object.defineProperty(r, e, {
			enumerable: !0,
			configurable: !0,
			get: () => a.value,
			set: (e) => a.value = e
		});
	}
	if (c) for (let e in c) Er(c[e], r, n, e);
	if (l) {
		let e = g(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Nn(t, e[t]);
		});
	}
	d && Tr(d, e, "c");
	function O(e, t) {
		f(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (O(or, p), O(sr, m), O(cr, h), O(lr, _), O(er, v), O(tr, b), O(hr, te), O(mr, E), O(pr, ee), O(ur, S), O(dr, w), O(fr, D), f(ne)) {
		if (ne.length) {
			let t = e.exposed ||= {};
			ne.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	T && e.render === i && (e.render = T), re != null && (e.inheritAttrs = re), ie && (e.components = ie), ae && (e.directives = ae), D && qn(e);
}
function wr(e, t, n = i) {
	f(e) && (e = Mr(e));
	for (let n in e) {
		let r = e[n], i;
		i = y(r) ? "default" in r ? Pn(r.from || n, r.default, !0) : Pn(r.from || n) : Pn(r), /* @__PURE__ */ Kt(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Tr(e, t, n) {
	cn(f(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Er(e, t, n, r) {
	let i = r.includes(".") ? Bn(n, r) : () => n[r];
	if (_(e)) {
		let n = t[e];
		g(n) && Ln(i, n);
	} else if (g(e)) Ln(i, e.bind(n));
	else if (y(e)) {
		if (f(e)) e.forEach((e) => Er(e, t, n, r));
		else {
			let r = g(e.handler) ? e.handler.bind(n) : t[e.handler];
			g(r) && Ln(i, r, e);
		}
	}
}
function Dr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Or(c, e, o, !0)), Or(c, t, o)), y(t) && a.set(t, c), c;
}
function Or(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Or(e, a, n, !0), i && i.forEach((t) => Or(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = kr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var kr = {
	data: Ar,
	props: Fr,
	emits: Fr,
	methods: Pr,
	computed: Pr,
	beforeCreate: Nr,
	created: Nr,
	beforeMount: Nr,
	mounted: Nr,
	beforeUpdate: Nr,
	updated: Nr,
	beforeDestroy: Nr,
	beforeUnmount: Nr,
	destroyed: Nr,
	unmounted: Nr,
	activated: Nr,
	deactivated: Nr,
	errorCaptured: Nr,
	serverPrefetch: Nr,
	components: Pr,
	directives: Pr,
	watch: Ir,
	provide: Ar,
	inject: jr
};
function Ar(e, t) {
	return t ? e ? function() {
		return c(g(e) ? e.call(this, this) : e, g(t) ? t.call(this, this) : t);
	} : t : e;
}
function jr(e, t) {
	return Pr(Mr(e), Mr(t));
}
function Mr(e) {
	if (f(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function Nr(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Pr(e, t) {
	return e ? c(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Fr(e, t) {
	return e ? f(e) && f(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : c(/* @__PURE__ */ Object.create(null), xr(e), xr(t ?? {})) : t;
}
function Ir(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = c(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = Nr(e[r], t[r]);
	return n;
}
function Lr() {
	return {
		app: null,
		config: {
			isNativeTag: a,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var Rr = 0;
function zr(e, t) {
	return function(n, r = null) {
		g(n) || (n = c({}, n)), r != null && !y(r) && (r = null);
		let i = Lr(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, l = i.app = {
			_uid: Rr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: _a,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && g(e.install) ? (a.add(e), e.install(l, ...t)) : g(e) && (a.add(e), e(l, ...t))), l;
			},
			mixin(e) {
				return i.mixins.includes(e) || i.mixins.push(e), l;
			},
			component(e, t) {
				return t ? (i.components[e] = t, l) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, l) : i.directives[e];
			},
			mount(a, o, c) {
				if (!s) {
					let u = l._ceVNode || G(n, r);
					return u.appContext = i, c === !0 ? c = "svg" : c === !1 && (c = void 0), o && t ? t(u, a) : e(u, a, c), s = !0, l._container = a, a.__vue_app__ = l, ha(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (cn(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = Br;
				Br = l;
				try {
					return e();
				} finally {
					Br = t;
				}
			}
		};
		return l;
	};
}
var Br = null, Vr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${D(t)}Modifiers`] || e[`${re(t)}Modifiers`];
function Hr(e, t, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || n, a = r, o = t.startsWith("update:"), s = o && Vr(i, t.slice(7));
	s && (s.trim && (a = r.map((e) => _(e) ? e.trim() : e)), s.number && (a = a.map(ce)));
	let c, l = i[c = ae(t)] || i[c = ae(D(t))];
	!l && o && (l = i[c = ae(re(t))]), l && cn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, cn(u, e, 6, a);
	}
}
var Ur = /* @__PURE__ */ new WeakMap();
function Wr(e, t, n = !1) {
	let r = n ? Ur : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!g(e)) {
		let r = (e) => {
			let n = Wr(e, t, !0);
			n && (s = !0, c(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (y(e) && r.set(e, null), null) : (f(a) ? a.forEach((e) => o[e] = null) : c(o, a), y(e) && r.set(e, o), o);
}
function Gr(e, t) {
	return !e || !o(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), d(e, t[0].toLowerCase() + t.slice(1)) || d(e, re(t)) || d(e, t));
}
function Kr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = kn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = qi(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = qi(e.length > 1 ? e(f, {
				attrs: c,
				slots: o,
				emit: l
			}) : e(f, null)), y = t.props ? c : qr(c);
		}
	} catch (t) {
		Ni.length = 0, ln(t, e, 1), v = G(ji);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(s) && (y = Jr(y, a)), b = Gi(b, y, !1, !0));
	}
	return n.dirs && (b = Gi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Kn(Hn(b.type) && Gn(b) || b, n.transition), v = b, kn(_), v;
}
var qr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || o(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Jr = (e, t) => {
	let n = {};
	for (let r in e) (!s(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Yr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Xr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Zr(o, r, n) && !Gr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Xr(r, o, l) : !!o;
	return !1;
}
function Xr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Zr(t, e, a) && !Gr(n, a)) return !0;
	}
	return !1;
}
function Zr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && y(r) && y(i) ? !xe(r, i) : r !== i;
}
function Qr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var $r = {}, ei = () => Object.create($r), ti = (e) => Object.getPrototypeOf(e) === $r;
function ni(e, t, n, r = !1) {
	let i = {}, a = ei();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), ii(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ It(i) : e.type.props ? i : a, e.attrs = a;
}
function ri(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ F(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Gr(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (d(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = D(o);
						i[t] = ai(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		ii(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !d(t, a) && ((r = re(a)) === a || !d(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = ai(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !d(t, e)) && (delete a[e], l = !0);
	}
	l && nt(e.attrs, "set", "");
}
function ii(e, t, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let n in t) {
		if (E(n)) continue;
		let l = t[n], u;
		a && d(a, u = D(n)) ? !o || !o.includes(u) ? r[u] = l : (c ||= {})[u] = l : Gr(e.emitsOptions, n) || (!(n in i) || l !== i[n]) && (i[n] = l, s = !0);
	}
	if (o) {
		let t = /* @__PURE__ */ F(r), i = c || n;
		for (let n = 0; n < o.length; n++) {
			let s = o[n];
			r[s] = ai(a, t, s, i[s], e, !d(i, s));
		}
	}
	return s;
}
function ai(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = d(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && g(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = aa(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === re(n)) && (r = !0));
	}
	return r;
}
var oi = /* @__PURE__ */ new WeakMap();
function si(e, t, i = !1) {
	let a = i ? oi : t.propsCache, o = a.get(e);
	if (o) return o;
	let s = e.props, l = {}, u = [], p = !1;
	if (!g(e)) {
		let n = (e) => {
			p = !0;
			let [n, r] = si(e, t, !0);
			c(l, n), r && u.push(...r);
		};
		!i && t.mixins.length && t.mixins.forEach(n), e.extends && n(e.extends), e.mixins && e.mixins.forEach(n);
	}
	if (!s && !p) return y(e) && a.set(e, r), r;
	if (f(s)) for (let e = 0; e < s.length; e++) {
		let t = D(s[e]);
		ci(t) && (l[t] = n);
	}
	else if (s) for (let e in s) {
		let t = D(e);
		if (ci(t)) {
			let n = s[e], r = l[t] = f(n) || g(n) ? { type: n } : c({}, n), i = r.type, a = !1, o = !0;
			if (f(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = g(t) && t.name;
				if (n === "Boolean") {
					a = !0;
					break;
				}
				n === "String" && (o = !1);
			}
			else a = g(i) && i.name === "Boolean";
			r[0] = a, r[1] = o, (a || d(r, "default")) && u.push(t);
		}
	}
	let m = [l, u];
	return y(e) && a.set(e, m), m;
}
function ci(e) {
	return e[0] !== "$" && !E(e);
}
var li = (e) => e === "_" || e === "_ctx" || e === "$stable", ui = (e) => f(e) ? e.map(qi) : [qi(e)], di = (e, t, n) => {
	if (t._n) return t;
	let r = An((...e) => ui(t(...e)), n);
	return r._c = !1, r;
}, fi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (li(n)) continue;
		let i = e[n];
		if (g(i)) t[n] = di(n, i, r);
		else if (i != null) {
			let e = ui(i);
			t[n] = () => e;
		}
	}
}, pi = (e, t) => {
	let n = ui(t);
	e.slots.default = () => n;
}, mi = (e, t, n) => {
	for (let r in t) (n || !li(r)) && (e[r] = t[r]);
}, hi = (e, t, n) => {
	let r = e.slots = ei();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (mi(r, t, n), n && se(r, "_", e, !0)) : fi(t, r);
	} else t && pi(e, t);
}, gi = (e, t, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = n;
	if (i.shapeFlag & 32) {
		let e = t._;
		e ? r && e === 1 ? o = !1 : mi(a, t, r) : (o = !t.$stable, fi(t, a)), s = t;
	} else t && (pi(e, t), s = { default: 1 });
	if (o) for (let e in a) !li(e) && s[e] == null && delete a[e];
}, _i = ki;
function vi(e) {
	return yi(e);
}
function yi(e, t) {
	let a = ue();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = i, insertStaticContent: _ } = e, v = (e, t, n, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Bi(e, t) && (i = ye(e), me(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === r && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case Ai:
				y(e, t, n, i);
				break;
			case ji:
				b(e, t, n, i);
				break;
			case Mi:
				e ?? x(t, n, i, s);
				break;
			case B:
				ie(e, t, n, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, n, i, a, o, s, c, l) : f & 6 ? ae(e, t, n, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, n, i, a, o, s, c, l, j);
		}
		d != null && a ? Xn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Xn(e.ref, null, o, e, !0);
	}, y = (e, t, n, r) => {
		if (e == null) o(t.el = u(t.children), n, r);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, r) => {
		e == null ? o(t.el = d(t.children || ""), n, r) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) T(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), D(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && te(e.children, d, null, r, i, bi(e, a), s, u), _ && Mn(e, null, r, "created"), ee(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !E(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Zi(f, r, e);
		}
		_ && Mn(e, null, r, "beforeMount");
		let v = Si(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && _i(() => {
			try {
				f && Zi(f, r, e), v && g.enter(d), _ && Mn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, ee = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Oi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ee(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, te = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Ji(e[l]) : qi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, D = (e, t, r, i, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || n, h = t.props || n, g;
		if (r && xi(r, !1), (g = h.onVnodeBeforeUpdate) && Zi(g, r, t, e), f && Mn(t, e, r, "beforeUpdate"), r && xi(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? ne(e.dynamicChildren, d, l, r, i, bi(t, a), o) : s || k(e, t, l, null, r, i, bi(t, a), o, !1), u > 0) {
			if (u & 16) re(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== t.children && p(l, t.children);
		} else !s && d == null && re(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && _i(() => {
			g && Zi(g, r, t, e), f && Mn(t, e, r, "updated");
		}, i);
	}, ne = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === B || !Bi(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, re = (e, t, r, i, a) => {
		if (t !== r) {
			if (t !== n) for (let n in t) !E(n) && !(n in r) && c(e, n, t[n], null, a, i);
			for (let n in r) {
				if (E(n)) continue;
				let o = r[n], s = t[n];
				o !== s && n !== "value" && c(e, n, s, o, a, i);
			}
			"value" in r && c(e, "value", t.value, r.value, a);
		}
	}, ie = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), te(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (ne(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Ci(e, t, !0)) : k(e, t, n, f, i, a, s, c, l);
	}, ae = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : oe(t, n, r, i, a, o, c) : se(e, t, c);
	}, oe = (e, t, n, r, i, a, o) => {
		let s = e.component = ea(e, r, i);
		if ($n(e) && (s.ctx.renderer = j), la(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ce, o), !e.el) {
				let r = s.subTree = G(ji);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ce(s, e, t, n, i, a, o);
	}, se = (e, t, n) => {
		let r = t.component = e.component;
		if (Yr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, le(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, ce = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Ti(e);
					if (n) {
						t && (t.el = c.el, le(e, t, o)), n.asyncDep.then(() => {
							_i(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				xi(e, !1), t ? (t.el = c.el, le(e, t, o)) : t = c, n && O(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Zi(d, s, t, c), xi(e, !0);
				let f = Kr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ye(p), e, i, a), t.el = f.el, u === null && Qr(e, f.el), r && _i(r, i), (d = t.props && t.props.onVnodeUpdated) && _i(() => Zi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Qn(t);
				if (xi(e, !1), l && O(l), !m && (o = c && c.onVnodeBeforeMount) && Zi(o, d, t), xi(e, !0), s && Se) {
					let t = () => {
						e.subTree = Kr(e), Se(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Kr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && _i(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					_i(() => Zi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Qn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && _i(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new ke(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => bn(u), xi(e, !0), l();
	}, le = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, ri(e, t.props, r, n), gi(e, t.children, n), We(), Cn(e), Ge();
	}, k = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				fe(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				de(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && ve(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? fe(l, d, n, r, i, a, o, s, c) : ve(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && te(d, n, r, i, a, o, s, c));
	}, de = (e, t, n, i, a, o, s, c, l) => {
		e ||= r, t ||= r;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? Ji(t[p]) : qi(t[p]);
			v(e[p], r, n, null, a, o, s, c, l);
		}
		u > d ? ve(e, a, o, !0, !1, f) : te(t, n, i, a, o, s, c, l, f);
	}, fe = (e, t, n, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let r = e[u], i = t[u] = l ? Ji(t[u]) : qi(t[u]);
			if (Bi(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let r = e[f], i = t[p] = l ? Ji(t[p]) : qi(t[p]);
			if (Bi(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, r = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? Ji(t[u]) : qi(t[u]), n, r, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) me(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Ji(t[u]) : qi(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let r = e[u];
				if (y >= b) {
					me(r, a, o, !0);
					continue;
				}
				let i;
				if (r.key != null) i = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Bi(r, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? me(r, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(r, t[i], n, null, a, o, s, c, l), y++);
			}
			let w = x ? wi(C) : r;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, r = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Di(f) : i;
				C[u] === 0 ? v(null, r, n, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? pe(r, n, p, 2) : _--);
			}
		}
	}, pe = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			pe(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, j);
			return;
		}
		if (c === B) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) pe(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Mi) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Un] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), _i(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Un];
					a._isLeaving && a[Un](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, me = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (We(), Xn(s, null, n, e, !0), Ge()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Qn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Zi(_, t, e), u & 6) _e(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Mn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, j, r) : l && !l.hasOnce && (a !== B || d > 0 && d & 64) ? ve(l, t, n, !1, !0) : (a === B && d & 384 || !i && u & 16) && ve(c, t, n), r && he(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && _i(() => {
			_ && Zi(_, t, e), h && Mn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, he = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === B) {
			ge(n, r);
			return;
		}
		if (t === Mi) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let a = () => {
			s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (e.shapeFlag & 1 && i && !i.persisted) {
			let { leave: t, delayLeave: r } = i, o = () => t(n, a);
			r ? r(e.el, a, o) : o();
		} else a();
	}, ge = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, _e = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Ei(c), Ei(l), r && O(r), i.stop(), a ? (a.flags |= 8, me(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, me(o, e, t, n)), s && _i(s, t), _i(() => {
			e.isUnmounted = !0;
		}, t);
	}, ve = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) me(e[o], t, n, r, i);
	}, ye = (e) => {
		if (e.shapeFlag & 6) return ye(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Vn];
		return n ? h(n) : t;
	}, A = !1, be = (e, t, n) => {
		let r;
		e == null ? t._vnode && (me(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, A ||= (A = !0, Cn(r), wn(), !1);
	}, j = {
		p: v,
		um: me,
		m: pe,
		r: he,
		mt: oe,
		mc: te,
		pc: k,
		pbc: ne,
		n: ye,
		o: e
	}, xe, Se;
	return t && ([xe, Se] = t(j)), {
		render: be,
		hydrate: xe,
		createApp: zr(be, xe)
	};
}
function bi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function xi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Si(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Ci(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (f(r) && f(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Ji(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Ci(t, a)), a.type === Ai && (a.patchFlag === -1 && (a = i[e] = Ji(a)), a.el = t.el), a.type === ji && !a.el && (a.el = t.el);
	}
}
function wi(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function Ti(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Ti(t);
}
function Ei(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Di(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Di(t.subTree) : null;
}
var Oi = (e) => e.__isSuspense;
function ki(e, t) {
	t && t.pendingBranch ? f(e) ? t.effects.push(...e) : t.effects.push(e) : Sn(e);
}
var B = /* @__PURE__ */ Symbol.for("v-fgt"), Ai = /* @__PURE__ */ Symbol.for("v-txt"), ji = /* @__PURE__ */ Symbol.for("v-cmt"), Mi = /* @__PURE__ */ Symbol.for("v-stc"), Ni = [], Pi = null;
function V(e = !1) {
	Ni.push(Pi = e ? null : []);
}
function Fi() {
	Ni.pop(), Pi = Ni[Ni.length - 1] || null;
}
var Ii = 1;
function Li(e, t = !1) {
	Ii += e, e < 0 && Pi && t && (Pi.hasOnce = !0);
}
function Ri(e) {
	return e.dynamicChildren = Ii > 0 ? Pi || r : null, Fi(), Ii > 0 && Pi && Pi.push(e), e;
}
function H(e, t, n, r, i, a) {
	return Ri(W(e, t, n, r, i, a, !0));
}
function U(e, t, n, r, i) {
	return Ri(G(e, t, n, r, i, !0));
}
function zi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Bi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Vi = ({ key: e }) => e ?? null, Hi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : _(e) || /* @__PURE__ */ Kt(e) || g(e) ? {
	i: Dn,
	r: e,
	k: t,
	f: !!n
} : e);
function W(e, t = null, n = null, r = 0, i = null, a = e === B ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Vi(t),
		ref: t && Hi(t),
		scopeId: On,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: Dn
	};
	return s ? (Yi(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= _(n) ? 8 : 16), Ii > 0 && !o && Pi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Pi.push(c), c;
}
var G = Ui;
function Ui(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === gr) && (e = ji), zi(e)) {
		let r = Gi(e, t, !0);
		return n && Yi(r, n), Ii > 0 && !a && Pi && (r.shapeFlag & 6 ? Pi[Pi.indexOf(e)] = r : Pi.push(r)), r.patchFlag = -2, r;
	}
	if (ga(e) && (e = e.__vccOpts), t) {
		t = Wi(t);
		let { class: e, style: n } = t;
		e && !_(e) && (t.class = he(e)), y(n) && (/* @__PURE__ */ Ht(n) && !f(n) && (n = c({}, n)), t.style = k(n));
	}
	let o = _(e) ? 1 : Oi(e) ? 128 : Hn(e) ? 64 : y(e) ? 4 : g(e) ? 2 : 0;
	return W(e, t, n, r, i, o, a, !0);
}
function Wi(e) {
	return e ? /* @__PURE__ */ Ht(e) || ti(e) ? c({}, e) : e : null;
}
function Gi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Xi(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Vi(l),
		ref: t && t.ref ? n && a ? f(a) ? a.concat(Hi(t)) : [a, Hi(t)] : Hi(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== B ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Gi(e.ssContent),
		ssFallback: e.ssFallback && Gi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Kn(u, c.clone(u)), u;
}
function K(e = " ", t = 0) {
	return G(Ai, null, e, t);
}
function Ki(e, t) {
	let n = G(Mi, null, e);
	return n.staticCount = t, n;
}
function q(e = "", t = !1) {
	return t ? (V(), U(ji, null, e)) : G(ji, null, e);
}
function qi(e) {
	return e == null || typeof e == "boolean" ? G(ji) : f(e) ? G(B, null, e.slice()) : zi(e) ? Ji(e) : G(Ai, null, String(e));
}
function Ji(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Gi(e);
}
function Yi(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (f(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Yi(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !ti(t) ? t._ctx = Dn : r === 3 && Dn && (Dn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (g(t)) {
		if (r & 65) {
			Yi(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Dn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [K(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Xi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = he([t.class, r.class]));
		else if (e === "style") t.style = k([t.style, r.style]);
		else if (o(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(f(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !s(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Zi(e, t, n, r = null) {
	cn(e, t, 7, [n, r]);
}
var Qi = Lr(), $i = 0;
function ea(e, t, r) {
	let i = e.type, a = (t ? t.appContext : e.appContext) || Qi, o = {
		uid: $i++,
		vnode: e,
		type: i,
		parent: t,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new Ee(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: t ? t.provides : Object.create(a.provides),
		ids: t ? t.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: si(i, a),
		emitsOptions: Wr(i, a),
		emit: null,
		emitted: null,
		propsDefaults: n,
		inheritAttrs: i.inheritAttrs,
		ctx: n,
		data: n,
		props: n,
		attrs: n,
		slots: n,
		refs: n,
		setupState: n,
		setupContext: null,
		suspense: r,
		suspenseId: r ? r.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = Hr.bind(null, o), e.ce && e.ce(o), o;
}
var ta = null, na = () => ta || Dn, ra, ia;
{
	let e = ue(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ra = t("__VUE_INSTANCE_SETTERS__", (e) => ta = e), ia = t("__VUE_SSR_SETTERS__", (e) => ca = e);
}
var aa = (e) => {
	let t = ta;
	return ra(e), e.scope.on(), () => {
		e.scope.off(), ra(t);
	};
}, oa = () => {
	ta && ta.scope.off(), ra(null);
};
function sa(e) {
	return e.vnode.shapeFlag & 4;
}
var ca = !1;
function la(e, t = !1, n = !1) {
	t && ia(t);
	let { props: r, children: i } = e.vnode, a = sa(e);
	ni(e, r, a, t), hi(e, i, n || t);
	let o = a ? ua(e, t) : void 0;
	return t && ia(!1), o;
}
function ua(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, br);
	let { setup: r } = n;
	if (r) {
		We();
		let n = e.setupContext = r.length > 1 ? ma(e) : null, i = aa(e), a = sn(r, e, 0, [e.props, n]), o = b(a);
		if (Ge(), i(), (o || e.sp) && !Qn(e) && qn(e), o) {
			if (a.then(oa, oa), t) return a.then((n) => {
				ia(!0);
				try {
					da(e, n, t);
				} finally {
					ia(!1);
				}
			}).catch((t) => {
				ln(t, e, 0);
			});
			e.asyncDep = a;
		} else da(e, a, t);
	} else fa(e, t);
}
function da(e, t, n) {
	g(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : y(t) && (e.setupState = Zt(t)), fa(e, n);
}
function fa(e, t, n) {
	let r = e.type;
	e.render ||= r.render || i;
	{
		let t = aa(e);
		We();
		try {
			Cr(e);
		} finally {
			Ge(), t();
		}
	}
}
var pa = { get(e, t) {
	return tt(e, "get", ""), e[t];
} };
function ma(e) {
	return {
		attrs: new Proxy(e.attrs, pa),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function ha(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Zt(Ut(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in vr) return vr[n](e);
		},
		has(e, t) {
			return t in e || t in vr;
		}
	}) : e.proxy;
}
function ga(e) {
	return g(e) && "__vccOpts" in e;
}
var J = (e, t) => /* @__PURE__ */ $t(e, t, ca), _a = "3.5.43", va = void 0, ya = typeof window < "u" && window.trustedTypes;
if (ya) try {
	va = /* @__PURE__ */ ya.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var ba = va ? (e) => va.createHTML(e) : (e) => e, xa = "http://www.w3.org/2000/svg", Sa = "http://www.w3.org/1998/Math/MathML", Ca = typeof document < "u" ? document : null, wa = Ca && /* @__PURE__ */ Ca.createElement("template"), Ta = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Ca.createElementNS(xa, e) : t === "mathml" ? Ca.createElementNS(Sa, e) : n ? Ca.createElement(e, { is: n }) : Ca.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Ca.createTextNode(e),
	createComment: (e) => Ca.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Ca.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			wa.innerHTML = ba(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = wa.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ea = /* @__PURE__ */ Symbol("_vtc");
function Da(e, t, n) {
	let r = e[Ea];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Oa = /* @__PURE__ */ Symbol("_vod"), ka = /* @__PURE__ */ Symbol("_vsh"), Aa = /* @__PURE__ */ Symbol(""), ja = /(?:^|;)\s*display\s*:/;
function Ma(e, t, n) {
	let r = e.style, i = _(n), a = !1;
	if (n && !i) {
		if (t) {
			if (_(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Pa(r, t, "");
			}
			else for (let e in t) n[e] ?? Pa(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Pa(r, i, "") : Ra(e, i, !_(t) && t ? t[i] : void 0, o) || Pa(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Aa];
			e && (n += ";" + e), r.cssText = n, a = ja.test(n);
		}
	} else t && e.removeAttribute("style");
	Oa in e && (e[Oa] = a ? r.display : "", e[ka] && (r.display = "none"));
}
var Na = /\s*!important$/;
function Pa(e, t, n) {
	if (f(n)) n.forEach((n) => Pa(e, t, n));
	else if (n ??= "", t.startsWith("--")) Na.test(n) ? e.setProperty(t, n.replace(Na, ""), "important") : e.setProperty(t, n);
	else {
		let r = La(e, t);
		Na.test(n) ? e.setProperty(re(r), n.replace(Na, ""), "important") : e[r] = n;
	}
}
var Fa = [
	"Webkit",
	"Moz",
	"ms"
], Ia = {};
function La(e, t) {
	let n = Ia[t];
	if (n) return n;
	let r = D(t);
	if (r !== "filter" && r in e) return Ia[t] = r;
	r = ie(r);
	for (let n = 0; n < Fa.length; n++) {
		let i = Fa[n] + r;
		if (i in e) return Ia[t] = i;
	}
	return t;
}
function Ra(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && _(r) && n === r;
}
var za = "http://www.w3.org/1999/xlink";
function Ba(e, t, n, r, i, a = _e(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(za, t.slice(6, t.length)) : e.setAttributeNS(za, t, n) : n == null || a && !ve(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : v(n) ? String(n) : n);
}
function Va(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? ba(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		(r !== i || !("_value" in e)) && (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = ve(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Ha(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Ua(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Wa = /* @__PURE__ */ Symbol("_vei");
function Ga(e, t, n, r, i = null) {
	let a = e[Wa] || (e[Wa] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Ja(t);
		r ? Ha(e, n, a[t] = Qa(r, i), s) : o && (Ua(e, n, o, s), a[t] = void 0);
	}
}
var Ka = /(Once|Passive|Capture)$/, qa = /^on:?(?:Once|Passive|Capture)$/;
function Ja(e) {
	let t, n;
	for (; (n = e.match(Ka)) && !qa.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : re(e.slice(2)), t];
}
var Ya = 0, Xa = /* @__PURE__ */ Promise.resolve(), Za = () => Ya ||= (Xa.then(() => Ya = 0), Date.now());
function Qa(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (f(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && cn(e, t, 5, a);
			}
		} else cn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Za(), n;
}
var $a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, eo = (e, t, n, r, i, a) => {
	let c = i === "svg";
	t === "class" ? Da(e, r, c) : t === "style" ? Ma(e, n, r) : o(t) ? s(t) || Ga(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : to(e, t, r, c)) ? (Va(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ba(e, t, r, c, a, t !== "value")) : e._isVueCE && (no(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !_(r))) ? Va(e, D(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Ba(e, t, r, c));
};
function to(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && $a(t) && g(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return $a(t) && _(n) ? !1 : t in e;
}
function no(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = D(t);
	return Array.isArray(n) ? n.some((e) => D(e) === r) : Object.keys(n).some((e) => D(e) === r);
}
var ro = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return f(t) ? (e) => O(t, e) : t;
};
function io(e) {
	e.target.composing = !0;
}
function ao(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var oo = /* @__PURE__ */ Symbol("_assign"), so = /* @__PURE__ */ Symbol("_initialValue");
function co(e, t, n) {
	return t && (e = e.trim()), n && (e = ce(e)), e;
}
var lo = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[so] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[so] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[oo] = ro(i);
		let a = r || i.props && i.props.type === "number";
		Ha(e, t ? "change" : "input", (t) => {
			t.target.composing || e[oo](co(e.value, n, a));
		}), (n || a) && Ha(e, "change", () => {
			e.value = co(e.value, n, a);
		}), t || (Ha(e, "compositionstart", io), Ha(e, "compositionend", ao), Ha(e, "change", ao));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[so];
		delete e[so], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[oo](co(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[oo] = ro(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? ce(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, uo = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], fo = {
	stop: (e) => e.stopPropagation(),
	prevent: (e) => e.preventDefault(),
	self: (e) => e.target !== e.currentTarget,
	ctrl: (e) => !e.ctrlKey,
	shift: (e) => !e.shiftKey,
	alt: (e) => !e.altKey,
	meta: (e) => !e.metaKey,
	left: (e) => "button" in e && e.button !== 0,
	middle: (e) => "button" in e && e.button !== 1,
	right: (e) => "button" in e && e.button !== 2,
	exact: (e, t) => uo.some((n) => e[`${n}Key`] && !t.includes(n))
}, po = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = fo[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, mo = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, ho = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = re(n.key);
		if (t.some((e) => e === r || mo[e] === r)) return e(n);
	}));
}, go = /* @__PURE__ */ c({ patchProp: eo }, Ta), _o;
function vo() {
	return _o ||= vi(go);
}
var yo = ((...e) => {
	let t = vo().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = xo(e);
		if (!r) return;
		let i = t._component;
		!g(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, bo(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function bo(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function xo(e) {
	return _(e) ? document.querySelector(e) : e;
}
//#endregion
//#region editor/src/components/BuyPanel.vue?vue&type=script&setup=true&lang.ts
var So = {
	class: "card",
	"aria-label": "Price and basket"
}, Co = { class: "buy-row" }, wo = {
	class: "label",
	for: "qty",
	style: {
		display: "flex",
		"align-items": "center",
		gap: "8px",
		color: "var(--ink)"
	}
}, To = ["disabled", "aria-describedby"], Eo = {
	key: 0,
	id: "buy-blocked",
	class: "small",
	style: {
		margin: "0",
		color: "var(--danger)"
	}
}, Do = { style: { margin: "0 0 16px" } }, Oo = { style: {
	display: "flex",
	"flex-direction": "column",
	gap: "8px"
} }, ko = /* @__PURE__ */ R({
	__name: "BuyPanel",
	props: {
		designJson: { type: Function },
		previewSvg: { type: Function },
		fileStem: {},
		blocked: {}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ I(1), r = /* @__PURE__ */ I(null);
		function i(e, t, n) {
			let r = URL.createObjectURL(new Blob([t], { type: n })), i = document.createElement("a");
			i.href = r, i.download = e, i.click(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
		}
		return (e, a) => (V(), H(B, null, [W("section", So, [
			a[6] ||= W("div", { class: "price" }, [W("span", { class: "amount display" }, "[PRICE]"), W("span", { class: "small muted" }, "ex VAT · prices come from the shop")], -1),
			W("div", Co, [W("label", wo, [a[5] ||= K(" Qty ", -1), jn(W("input", {
				id: "qty",
				"onUpdate:modelValue": a[0] ||= (e) => n.value = e,
				class: "qty",
				type: "number",
				min: "1"
			}, null, 512), [[
				lo,
				n.value,
				void 0,
				{ number: !0 }
			]])]), W("button", {
				class: "btn go grow",
				style: { height: "48px" },
				disabled: !!t.blocked,
				"aria-describedby": t.blocked ? "buy-blocked" : void 0,
				onClick: a[1] ||= (e) => r.value?.showModal()
			}, "Add to basket", 8, To)]),
			t.blocked ? (V(), H("p", Eo, M(t.blocked), 1)) : q("", !0)
		]), W("dialog", {
			ref_key: "dialog",
			ref: r,
			"aria-labelledby": "saved-heading"
		}, [
			a[7] ||= W("h2", {
				id: "saved-heading",
				class: "display",
				style: {
					margin: "0 0 8px",
					"font-size": "26px"
				}
			}, "Design captured", -1),
			W("p", Do, "This is the test site, so nothing was added to a basket. On the shop, this design would be saved with the order (" + M(n.value) + " × this sign).", 1),
			W("div", Oo, [
				W("button", {
					class: "btn",
					onClick: a[2] ||= (e) => i(`${t.fileStem}.json`, t.designJson(), "application/json")
				}, "Download design (JSON)"),
				W("button", {
					class: "btn",
					onClick: a[3] ||= (e) => t.previewSvg().then((e) => i(`${t.fileStem}.svg`, e, "image/svg+xml"))
				}, "Download artwork (SVG)"),
				W("button", {
					class: "btn accent",
					onClick: a[4] ||= (e) => r.value?.close()
				}, "Back to the design")
			])
		], 512)], 64));
	}
}), Ao = {
	key: "__unknown__",
	title: "Unknown category",
	background: { hex: "#FFFFFF" },
	panel: { hex: "#808080" },
	panel_text: { hex: "#000000" },
	border: { hex: "#000000" }
}, jo = (e) => e.symbol_frame?.symbols[0]?.category ?? e.category;
function Mo(e, t) {
	switch (e) {
		case "background": return t.background;
		case "panel": return t.panel;
		case "panel_text": return t.panel_text;
		case "symbol_background": return t.symbol_background;
		case "border": return t.border ?? { hex: "#000000" };
	}
}
function No(e, t, n) {
	return e ? "token" in e ? Mo(e.token, n) : e : Mo(t, n);
}
//#endregion
//#region src/engine/context.ts
var Po = (e) => ({
	shaper: e.shaper,
	ruleset: e.ruleset,
	ratios: e.ruleset.ratios,
	nodes: [],
	findings: [],
	unitRef: 0,
	gap: null,
	corners: {
		rounded: !1,
		radius: null
	}
});
function Fo(e, t) {
	e.unitRef = t, e.gap = e.ratios.UNIFORM_GAP === null ? null : e.ratios.UNIFORM_GAP * t;
}
function Io(e, t, n) {
	let r = {
		unitRef: e.unitRef,
		gap: e.gap
	};
	Fo(e, t);
	try {
		return n();
	} finally {
		e.unitRef = r.unitRef, e.gap = r.gap;
	}
}
function Lo(e) {
	return e.corners.rounded ? e.corners.radius === null ? e.ratios.CORNER_RADIUS === null ? e.gap ?? e.ratios.MARGIN * e.unitRef : e.ratios.CORNER_RADIUS * e.unitRef : e.corners.radius : 0;
}
var Ro = (e) => ({
	...e,
	nodes: [],
	findings: []
});
function zo(e, t) {
	e.findings.some((e) => e.code === t.code && e.path === t.path) || e.findings.push(t);
}
function Bo(e, t, n) {
	let r = jo(e);
	return (r === void 0 ? void 0 : t.ruleset.theme(r)) || (zo(t, {
		severity: "error",
		code: "E_UNKNOWN_CATEGORY",
		path: n,
		message: r === void 0 ? "Section has no category (text-only sections need `category`)" : `Category "${r}" is not defined in ruleset "${t.ruleset.id}"`
	}), Ao);
}
//#endregion
//#region src/engine/report.ts
function Vo(e, t, n) {
	return {
		sections: e,
		findings: [...t.findings, ...t.ruleset.check(n, {
			sections: e,
			findings: t.findings
		})]
	};
}
//#endregion
//#region src/engine/geometry.ts
var Ho = 1e-6, Uo = (e, t, n) => Math.min(Math.max(e, t), n), Y = (e, t = 3) => {
	let n = 10 ** t, r = Math.round(e * n) / n;
	return Object.is(r, -0) ? 0 : r;
}, Wo = (e) => Math.floor(e * 10 + 1e-9) / 10, Go = (e, t) => Math.min(e, t);
function Ko(e, [t, n, r, i]) {
	return {
		x: e.x + i,
		y: e.y + t,
		w: Math.max(0, e.w - i - n),
		h: Math.max(0, e.h - t - r)
	};
}
var qo = (e) => [
	e,
	e,
	e,
	e
], Jo = (e, t) => t === "vertical" ? e.h : e.w, Yo = (e, t) => t === "vertical" ? e.w : e.h, Xo = (e, t) => t === "vertical" ? e.y : e.x;
function Zo(e, t, n, r) {
	return t === "vertical" ? {
		x: e.x,
		y: n,
		w: e.w,
		h: r
	} : {
		x: n,
		y: e.y,
		w: r,
		h: e.h
	};
}
//#endregion
//#region src/engine/resolveSign.ts
var Qo = { hex: "#FF00FF" }, $o = .25, es = (e, t = 0) => {
	let n = Math.max(0, Math.min(t, e.w / 2, e.h / 2));
	if (n <= 0) return `M${Y(e.x)} ${Y(e.y)}H${Y(e.x + e.w)}V${Y(e.y + e.h)}H${Y(e.x)}Z`;
	let [r, i, a, o, s] = [
		e.x,
		e.y,
		e.w,
		e.h,
		n
	];
	return `M${Y(r + s)} ${Y(i)}H${Y(r + a - s)}A${Y(s)} ${Y(s)} 0 0 1 ${Y(r + a)} ${Y(i + s)}V${Y(i + o - s)}A${Y(s)} ${Y(s)} 0 0 1 ${Y(r + a - s)} ${Y(i + o)}H${Y(r + s)}A${Y(s)} ${Y(s)} 0 0 1 ${Y(r)} ${Y(i + o - s)}V${Y(i + s)}A${Y(s)} ${Y(s)} 0 0 1 ${Y(r + s)} ${Y(i)}Z`;
};
function ts(e, t, n) {
	let r = Go(e.width, e.height);
	Fo(n, r);
	let i = e.corner_radius ?? 0, a = {
		x: 0,
		y: 0,
		w: e.width,
		h: e.height
	}, o = e.substrate ? No(e.substrate, "background", t) : void 0;
	o && n.nodes.push({
		type: "rect",
		id: `${e.id}--substrate`,
		source_id: e.id,
		layer: "substrate",
		x: 0,
		y: 0,
		width: e.width,
		height: e.height,
		radius: [
			i,
			i,
			i,
			i
		],
		fill: o
	});
	let s = o && e.background === void 0 ? void 0 : No(e.background, "background", t);
	n.nodes.push({
		type: "rect",
		id: e.id,
		source_id: e.id,
		layer: "artwork",
		x: 0,
		y: 0,
		width: e.width,
		height: e.height,
		radius: [
			i,
			i,
			i,
			i
		],
		...s ? { fill: s } : {}
	}), n.corners = {
		rounded: e.corners ? e.corners.rounded : n.ratios.CORNERS_ROUNDED,
		radius: e.corners && e.corners.radius !== "auto" ? Math.max(0, e.corners.radius) : null
	};
	let c = Ko(a, qo(e.margin === void 0 || e.margin === "auto" ? n.gap ?? n.ratios.MARGIN * r : e.margin));
	if (e.border) {
		let i = e.border.width === "auto" ? n.ratios.BORDER * r : e.border.width, a = No(e.border.colour, "border", t), o = Ko(c, qo(i));
		if (i > 0 && a) {
			let t = n.corners.rounded ? n.corners.radius ?? i : 0;
			n.nodes.push({
				type: "path",
				id: `${e.id}--border`,
				source_id: e.id,
				layer: "artwork",
				d: `${es(c, t + i)}${es(o, t)}`,
				fill: a,
				fill_rule: "evenodd"
			});
		}
		c = o;
	}
	if (e.padding !== void 0) {
		let t = e.padding === "auto" ? n.gap ?? n.ratios.MARGIN * r : e.padding;
		c = Ko(c, qo(Math.max(0, t)));
	}
	return c;
}
function ns(e, t) {
	let n = e.corner_radius ?? 0, r = $o / 2;
	t.nodes.push({
		type: "rect",
		id: `${e.id}--cut`,
		source_id: e.id,
		layer: "guide",
		x: r,
		y: r,
		width: e.width - $o,
		height: e.height - $o,
		radius: [
			n,
			n,
			n,
			n
		],
		stroke: {
			colour: Qo,
			width: $o
		}
	});
}
//#endregion
//#region src/engine/cells.ts
var rs = (e, t, n) => e ? e.width === "auto" ? t.ratios.CELL_OUTLINE * n : e.width : 0, is = (e, t) => e?.layer === "artwork" ? t : 0;
function as(e, t, n, r) {
	let i = r.ratios, a = Go(e.w, e.h);
	return {
		outer: e,
		inner: Ko(e, qo(t === void 0 || t === "auto" ? (i.UNIFORM_GAP ?? i.CELL_PADDING) * a + n : t))
	};
}
function os(e, t, n, r, i, a) {
	if (!t) return;
	let o = No(t.colour, "border", a);
	!o || n <= 0 || e.forEach((e, a) => i.nodes.push({
		type: "rect",
		id: `${r.id}--cell-${a + 1}`,
		source_id: r.id,
		layer: t.layer,
		x: e.outer.x + n / 2,
		y: e.outer.y + n / 2,
		width: Math.max(0, e.outer.w - n),
		height: Math.max(0, e.outer.h - n),
		radius: [
			0,
			0,
			0,
			0
		],
		stroke: {
			colour: o,
			width: n
		}
	}));
}
//#endregion
//#region src/engine/stack.ts
function ss(e, t, n, r) {
	let i = e.length;
	if (i === 0) return [];
	let a = n * (i - 1), o = e.map((e) => Math.max(0, e.min)), s = e.map((e, t) => Math.max(o[t], e.max)), c = e.map((e, t) => Math.min(Math.max(e.basis, o[t]), s[t])), l = [...c], u = e.map(() => !1);
	for (let n = 0; n <= i; n++) {
		let n = l.reduce((e, t, n) => e + (u[n] ? t : 0), 0), r = c.reduce((e, t, n) => e + (u[n] ? 0 : t), 0), d = t - a - n - r, f = e.map((e, t) => u[t] ? 0 : d >= 0 ? Math.max(0, e.grow) : Math.max(0, e.shrink) * c[t]), p = f.reduce((e, t) => e + t, 0), m = !1;
		for (let e = 0; e < i; e++) {
			if (u[e]) continue;
			let t = p > 0 ? c[e] + d * (f[e] / p) : c[e];
			t < o[e] - 1e-6 ? (l[e] = o[e], u[e] = !0, m = !0) : t > s[e] + 1e-6 ? (l[e] = s[e], u[e] = !0, m = !0) : l[e] = Math.min(Math.max(t, o[e]), s[e]);
		}
		if (!m) break;
	}
	let d = l.reduce((e, t) => e + t, 0) + a, f = Math.max(0, t - d), p = 0, m = n;
	switch (r) {
		case "start": break;
		case "centre":
			p = f / 2;
			break;
		case "end":
			p = f;
			break;
		case "space-between":
			i === 1 ? p = f / 2 : m = n + f / (i - 1);
			break;
		case "space-evenly": p = f / (i + 1), m = n + f / (i + 1);
	}
	let h = [], g = p;
	for (let e = 0; e < i; e++) h.push({
		offset: g,
		size: l[e]
	}), g += l[e] + m;
	return h;
}
//#endregion
//#region src/engine/resolveBoard.ts
var cs = (e) => typeof e == "number" && Number.isFinite(e) && e > 0 ? e : 1;
function ls(e, t, n, r, i) {
	let a = Go(e.width, e.height), o = t.gutter === "auto" ? r.ratios.GRID_GUTTER * a : t.gutter, s = t.rows.length ? t.rows : [{ cells: 1 }], c = ss(s.map((e) => ({
		basis: 0,
		min: 0,
		max: Infinity,
		grow: cs(e.weight),
		shrink: 0
	})), n.h, o, "start"), l = rs(t.cell_outline, r, a), u = is(t.cell_outline, l), d = [];
	return s.forEach((e, i) => {
		let a = Math.max(1, Math.floor(e.cells)), s = Math.max(0, (n.w - o * (a - 1)) / a);
		for (let e = 0; e < a; e++) {
			let a = as({
				x: n.x + e * (s + o),
				y: n.y + c[i].offset,
				w: s,
				h: c[i].size
			}, t.cell_padding, u, r);
			d.push({
				...a,
				group: i
			});
		}
	}), os(d, t.cell_outline, l, e, r, i), d;
}
//#endregion
//#region src/engine/resolveGrid.ts
function us(e, t, n, r, i) {
	let a = r.ratios, o = Go(e.width, e.height), s = Math.max(1, Math.floor(t.rows)), c = Math.max(1, Math.floor(t.cols)), l = t.gutter === "auto" ? a.GRID_GUTTER * o : t.gutter, u = Math.max(0, (n.w - l * (c - 1)) / c), d = Math.max(0, (n.h - l * (s - 1)) / s), f = rs(t.cell_outline, r, o), p = is(t.cell_outline, f), m = [];
	for (let e = 0; e < s; e++) for (let i = 0; i < c; i++) m.push(as({
		x: n.x + i * (u + l),
		y: n.y + e * (d + l),
		w: u,
		h: d
	}, t.cell_padding, p, r));
	if (os(m, t.cell_outline, f, e, r, i), t.dividers && t.dividers.width > 0) {
		let a = No(t.dividers.colour, "border", i), o = t.dividers.width, f = [];
		for (let e = 1; e < c; e++) {
			let t = n.x + e * (u + l) - l / 2;
			f.push(`M${Y(t)} ${Y(n.y)}V${Y(n.y + n.h)}`);
		}
		for (let e = 1; e < s; e++) {
			let t = n.y + e * (d + l) - l / 2;
			f.push(`M${Y(n.x)} ${Y(t)}H${Y(n.x + n.w)}`);
		}
		a && f.length && r.nodes.push({
			type: "path",
			id: `${e.id}--dividers`,
			source_id: e.id,
			layer: "artwork",
			d: f.join(""),
			stroke: {
				colour: a,
				width: o
			}
		});
	}
	return m;
}
//#endregion
//#region src/engine/resolveSymbolFrame.ts
var ds = (e) => e[2] / e[3], fs = (e, t) => t === "start" ? 0 : t === "end" ? e : e / 2, ps = (e, t, n) => e.spacing === "auto" ? t.ratios.SYMBOL_SPACING * n : e.spacing, ms = (e, t) => {
	let n = e.ratios.SYMBOL_PADDING * t;
	return {
		main: e.gap === null ? n : 0,
		cross: n
	};
}, hs = (e, t, n) => Ko(e, t === "vertical" ? [
	n.main,
	n.cross,
	n.main,
	n.cross
] : [
	n.cross,
	n.main,
	n.cross,
	n.main
]);
function gs(e, t, n, r, i) {
	let a = e.symbols.length;
	if (a === 0) return 0;
	let o = ps(e, r, i), s = ms(r, i), c = Math.max(0, t - 2 * s.cross - o * (a - 1)), l = e.symbols.map((e) => ds(e.source.view_box));
	return (n === "vertical" ? c / l.reduce((e, t) => e + t, 0) : c / l.reduce((e, t) => e + 1 / t, 0)) + 2 * s.main;
}
function _s(e, t, n, r, i, a) {
	let o = t.background ? No(t.background, "symbol_background", i) : void 0, s = t.symbols.length;
	if (s === 0) {
		o && r.nodes.push({
			type: "rect",
			id: t.id,
			source_id: t.id,
			layer: "artwork",
			x: n.x,
			y: n.y,
			width: n.w,
			height: n.h,
			radius: [
				0,
				0,
				0,
				0
			],
			fill: o
		});
		return;
	}
	let c = ms(r, a), l = hs(n, e.orientation, c), u = ps(t, r, a), d = t.symbols.map((e) => ds(e.source.view_box)), f = [], p = (e, t, n, r, i) => {
		f.push({
			sym: e,
			x: t,
			y: n,
			w: r,
			h: i
		});
	}, m = () => {
		if (o && f.length) {
			let e = Math.max(c.main, c.cross), i = Math.max(n.x, Math.min(...f.map((e) => e.x)) - e), a = Math.max(n.y, Math.min(...f.map((e) => e.y)) - e), s = Math.min(n.x + n.w, Math.max(...f.map((e) => e.x + e.w)) + e), l = Math.min(n.y + n.h, Math.max(...f.map((e) => e.y + e.h)) + e);
			r.nodes.push({
				type: "rect",
				id: t.id,
				source_id: t.id,
				layer: "artwork",
				x: i,
				y: a,
				width: Math.max(0, s - i),
				height: Math.max(0, l - a),
				radius: [
					0,
					0,
					0,
					0
				],
				fill: o
			});
		}
		for (let e of f) {
			let t = e.sym.source.view_box;
			r.nodes.push({
				type: "symbol",
				id: e.sym.id,
				source_id: e.sym.id,
				layer: "artwork",
				x: e.x,
				y: e.y,
				width: e.w,
				height: e.h,
				scale: e.w / t[2],
				view_box: t,
				body: e.sym.source.body
			});
		}
	};
	if (e.orientation === "vertical") {
		let e = Math.max(0, l.w - u * (s - 1)) / d.reduce((e, t) => e + t, 0), n = Math.max(0, Math.min(l.h, e)), r = d.reduce((e, t) => e + t * n, 0) + u * (s - 1), i = l.x + fs(l.w - r, t.align), a = l.y + fs(l.h - n, t.align);
		t.symbols.forEach((e, t) => {
			let r = d[t] * n;
			p(e, i, a, r, n), i += r + u;
		}), m();
	} else {
		let e = Math.max(0, l.h - u * (s - 1)) / d.reduce((e, t) => e + 1 / t, 0), n = Math.max(0, Math.min(l.w, e)), r = d.reduce((e, t) => e + n / t, 0) + u * (s - 1), i = l.y + fs(l.h - r, t.align), a = l.x + fs(l.w - n, t.align);
		t.symbols.forEach((e, t) => {
			let r = n / d[t];
			p(e, a, i, n, r), i += r + u;
		}), m();
	}
}
//#endregion
//#region src/engine/fit.ts
var vs = (e, t) => Math.max(t.min, Math.min(t.recommended, Wo(e * t.recommended))), ys = 18;
function bs(e, t = 1) {
	let n = Math.min(1, Math.max(0, t));
	if (e(n)) return {
		k: n,
		overflow: !1
	};
	if (!e(0)) return {
		k: 0,
		overflow: !0
	};
	let r = 0, i = n;
	for (let t = 0; t < ys; t++) {
		let t = (r + i) / 2;
		e(t) ? r = t : i = t;
	}
	return {
		k: r,
		overflow: !1
	};
}
//#endregion
//#region src/engine/placeBlocks.ts
function xs(e, t, n, r, i) {
	let a = n.map(() => e), o = n.map(() => 0), s = e, c = !1;
	n.forEach((e, t) => {
		e.placement === "pin-top" && (a[t] = s, e.height !== 0 && (s += e.height + r, c = !0));
	}), c || (s = e);
	let l = t, u = !1;
	for (let e = n.length - 1; e >= 0; e--) {
		let t = n[e];
		if (t.placement === "pin-bottom") {
			if (t.height === 0) {
				a[e] = l;
				continue;
			}
			l -= t.height, a[e] = l, l -= r, u = !0;
		}
	}
	u || (l = t);
	let d = n.map((e, t) => ({
		it: e,
		i: t
	})).filter((e) => e.it.placement === "flow"), f = d.filter((e) => e.it.height > 0);
	for (let e of d) e.it.height === 0 && (a[e.i] = s);
	if (f.length === 0) {
		for (let e of d) a[e.i] = s;
		return {
			y: a,
			applied: o
		};
	}
	let p = ss(f.map((e) => ({
		basis: e.it.height,
		min: e.it.height,
		max: e.it.height,
		grow: 0,
		shrink: 0
	})), Math.max(0, l - s), r, i).map((e) => s + e.offset), m = f[f.length - 1].it, h = u ? 0 : Math.max(0, (m.trail ?? 0) - (m.ink ?? m.trail ?? 0));
	if (i === "centre" || i === "space-evenly") {
		let e = f.reduce((e, t) => e + t.it.height, 0) + r * (f.length - 1), t = Math.max(0, l - s - e), n = Math.min((m.trail ?? 0) / 2, t / 2 + h);
		for (let e = 0; e < p.length; e++) p[e] += n;
	}
	let g = -Infinity;
	for (let e = 0; e < f.length; e++) {
		let { it: t, i } = f[e], c = e === 0 ? s : g + r, u = f.slice(e).reduce((e, t) => e + t.it.height, 0) + r * (f.length - e - 1), d = l - u + h, m = Math.max(p[e], c), _ = d < c ? c : Uo(m + t.y_offset, c, d);
		a[i] = _, o[i] = _ - m, g = _ + t.height;
		for (let e = i + 1; e < n.length && n[e].placement === "flow" && n[e].height === 0; e++) a[e] = g;
		for (let t = e + 1; t < f.length; t++) {
			let n = g + r + f.slice(e + 1, t).reduce((e, t) => e + t.it.height + r, 0);
			p[t] < n && (p[t] = n);
		}
	}
	for (let e = 0; e < n.length && e < f[0].i; e++) n[e].placement === "flow" && n[e].height === 0 && (a[e] = a[f[0].i]);
	return {
		y: a,
		applied: o
	};
}
//#endregion
//#region src/engine/textLayout.ts
var Ss = "gjpqy";
function Cs(e) {
	return e.trim() === "" ? [] : e.split("\n").map((e) => e.split(/\s+/).filter(Boolean));
}
function ws(e, t, n) {
	if (e.length === 0) return [""];
	let r = [], i = "";
	for (let a of e) {
		let e = i ? `${i} ${a}` : a;
		!i || n(e) <= t + 1e-6 ? i = e : (r.push(i), i = a);
	}
	return r.push(i), r;
}
function Ts(e, t, n) {
	let r = ws(e, t, n);
	if (r.length <= 1) return r;
	let i = r.length, a = Math.min(t, Math.max(...r.map(n))), o = Math.max(...e.map(n));
	if (o >= a) return r;
	for (let t = 0; t < 16; t++) {
		let t = (o + a) / 2;
		ws(e, t, n).length <= i ? a = t : o = t;
	}
	return ws(e, a, n);
}
function Es(e, t, n, r) {
	let i = n === "balanced" ? Ts : ws;
	return Cs(e).flatMap((e) => i(e, t, r));
}
var Ds = (e, t, n) => {
	let r = e.metrics(t);
	return n * r.unitsPerEm / r.capHeight;
};
function Os(e, t, n, r) {
	let i = Ds(r, e.variant, t), a = i * e.line_spacing, o = (t) => r.advance(t, e.variant, i), s = Es(e.text, n, e.wrap, o).map((e) => ({
		text: e,
		width: o(e)
	}));
	return {
		letterHeight: t,
		em: i,
		pitch: a,
		lines: s,
		textHeight: s.length === 0 ? 0 : t + (s.length - 1) * a + r.descent(Ss, e.variant, i),
		fits: s.every((e) => e.width <= n + Ho)
	};
}
var ks = (e) => e.padding ?? [
	0,
	0,
	0,
	0
], As = (e, t) => {
	let [n, , r] = ks(e);
	return n + t.textHeight + r;
}, js = "1.0.0", Ms = {
	MIN_LETTER_HEIGHT: 2,
	MAX_LETTER_HEIGHT: 500,
	MAX_SIGN_SIZE: 5e3,
	MIN_LINE_SPACING: .7,
	MIN_TEXT_SCALE: .1,
	MAX_TEXT_SCALE: 4
}, Ns = (e) => Uo(e, Ms.MIN_LETTER_HEIGHT, Ms.MAX_LETTER_HEIGHT);
function Ps(e, t, n) {
	let r = Ns(Wo(e.recommended === "auto" ? n.LETTER_HEIGHT[e.role] * t * (e.scale ?? 1) : e.recommended));
	return {
		recommended: r,
		min: Ns(e.min === "auto" ? Math.min(n.MIN_LETTER_HEIGHT_MM[e.role], r) : Math.min(e.min, r))
	};
}
//#endregion
//#region src/engine/resolveTextFrame.ts
function Fs(e, t) {
	if (e.text_transform !== "uppercase") return e;
	let n;
	try {
		n = e.text.toLocaleUpperCase(t ?? "en-GB");
	} catch {
		n = e.text.toUpperCase();
	}
	return {
		...e,
		text: n
	};
}
function Is(e, t, n) {
	let r = t.ratios, i = e.panels.map((e) => ({
		panel: e,
		padding: e.padding === "auto" ? qo(r.PANEL_PADDING * n.sectionRef) : e.padding,
		spacing: e.spacing === "auto" ? r.BLOCK_SPACING * n.sectionRef : e.spacing,
		blocks: e.blocks.map((e) => ({
			block: Fs(e, n.lang),
			auto: e.size.mode === "auto" ? Ps(e.size, n.textRefHeight, r) : null,
			fixed: e.size.mode === "fixed" ? e.size.letter_height : 0
		}))
	}));
	return {
		frame: e,
		spacing: e.spacing === "auto" ? t.gap ?? r.PANEL_SPACING * n.sectionRef : e.spacing,
		panels: i,
		hasAuto: i.some((e) => e.blocks.some((e) => e.auto))
	};
}
var Ls = (e, t) => e.auto ? vs(t, e.auto) : e.fixed, Rs = (e, t, n) => {
	let [, r, , i] = ks(n.block);
	return Math.max(0, e - t.padding[1] - t.padding[3] - r - i);
};
function zs(e, t, n, r) {
	let i = !0, a = [], o = [];
	for (let s of e.panels) {
		let e = s.blocks.map((e) => {
			let a = Os(e.block, Ls(e, n), Rs(t, s, e), r.shaper);
			return a.fits || (i = !1), a;
		}), c = e.filter((e) => e.lines.length > 0), l = e.reduce((e, t, n) => e + (t.lines.length ? As(s.blocks[n].block, t) : 0), 0);
		o.push(s.padding[0] + l + s.spacing * Math.max(0, c.length - 1) + s.padding[2]), a.push(e);
	}
	return {
		blocks: a,
		panelHeights: o,
		frameHeight: o.reduce((e, t) => e + t, 0) + e.spacing * Math.max(0, o.length - 1),
		fits: i
	};
}
function Bs(e, t) {
	let n = 0;
	for (let r of e.panels) for (let e of r.blocks) {
		let i = Ls(e, 0), a = Ds(t.shaper, e.block.variant, i), [, o, , s] = ks(e.block);
		for (let i of Cs(e.block.text).flat()) {
			let c = t.shaper.advance(i, e.block.variant, a) + o + s + r.padding[1] + r.padding[3];
			c > n && (n = c);
		}
	}
	return n;
}
function Vs(e, t, n, r = 1) {
	return bs((r) => {
		let i = zs(e, t.w, r, n);
		return i.fits && i.frameHeight <= t.h + 1e-6;
	}, r);
}
function Hs(e, t, n, r) {
	return e.category ? n.ruleset.theme(e.category) || (zo(n, {
		severity: "error",
		code: "E_UNKNOWN_CATEGORY",
		path: `${r}.category`,
		message: `Panel category "${e.category}" is not defined in ruleset "${n.ruleset.id}"`
	}), t) : t;
}
function Us(e, t, n, r, i, a, o = 1) {
	let s = Vs(e, t, n, o), c = s.k, l = zs(e, t.w, c, n);
	s.overflow && zo(n, {
		severity: "error",
		code: "E_TEXT_OVERFLOW",
		path: i,
		message: l.fits ? "The text does not fit the section even at the minimum size" : "A word is too wide for the panel even at the minimum size"
	});
	let u = ss(e.panels.map((e, t) => ({
		basis: l.panelHeights[t],
		min: l.panelHeights[t],
		max: Infinity,
		grow: Math.max(0, e.panel.grow),
		shrink: 0
	})), t.h, e.spacing, "start"), d = [];
	return e.panels.forEach((o, c) => {
		let f = u[c], p = {
			x: t.x,
			y: t.y + f.offset,
			w: t.w,
			h: f.size
		}, m = a.top && c === 0, h = a.bottom && c === e.panels.length - 1, g = Math.min(Lo(n), p.w / 2, p.h / 2), _ = (e, t) => e && t ? g : 0, v = [
			_(m, a.left),
			_(m, a.right),
			_(h, a.right),
			_(h, a.left)
		], y = Hs(o.panel, r, n, `${i}.panels[${c}]`), b = o.panel.fill === "none" ? void 0 : No(o.panel.fill, "panel", y);
		n.nodes.push({
			type: "rect",
			id: o.panel.id,
			source_id: o.panel.id,
			layer: "artwork",
			x: p.x,
			y: p.y,
			width: p.w,
			height: p.h,
			radius: v,
			...b ? { fill: b } : {}
		});
		let x = Ko(p, o.padding), S = l.blocks[c], C = S.map((e, t) => e.lines.length ? As(o.blocks[t].block, e) : 0), w = xs(x.y, x.y + x.h, o.blocks.map((e, t) => {
			let r = S[t], i = r.lines.length ? r.textHeight - r.letterHeight - (r.lines.length - 1) * r.pitch : 0, a = r.lines[r.lines.length - 1]?.text ?? "", o = a ? Math.min(i, n.shaper.descent(a, e.block.variant, r.em)) : 0;
			return {
				height: C[t],
				placement: e.block.placement,
				y_offset: e.block.y_offset,
				trail: i,
				ink: o
			};
		}), o.spacing, o.panel.justify);
		o.blocks.forEach((e, t) => {
			let r = S[t], a = e.block, [o, u, , f] = ks(a), p = w.y[t], m = x.x + f, h = Math.max(0, x.w - f - u), g = s.overflow && l.fits ? !0 : !r.fits;
			!r.fits && !s.overflow && zo(n, {
				severity: "error",
				code: "E_TEXT_OVERFLOW",
				path: `${i}.panels[${c}].blocks[${t}]`,
				message: "A word is too wide for the panel at this fixed size"
			});
			let _ = No(a.colour, "panel_text", y) ?? { hex: "#000000" }, v = r.lines.map((e, t) => {
				let i = Y(a.align === "left" ? m : a.align === "right" ? m + h - e.width : m + (h - e.width) / 2), s = Y(p + o + r.letterHeight + t * r.pitch), c = n.shaper.outline && e.text ? n.shaper.outline(e.text, a.variant, r.em, i, s) : void 0;
				return {
					text: e.text,
					x: i,
					baseline: s,
					width: e.width,
					...c === void 0 ? {} : { d: c }
				};
			}), b = !!e.auto && r.letterHeight < e.auto.recommended;
			n.nodes.push({
				type: "text",
				id: a.id,
				source_id: a.id,
				layer: "artwork",
				x: x.x,
				y: p,
				width: x.w,
				height: C[t],
				text: a.text,
				letter_height: r.letterHeight,
				colour: _,
				variant: a.variant,
				em: r.em,
				font_family: n.shaper.family,
				lines: v,
				shrunk: b,
				overflow: g
			}), d.push({
				id: a.id,
				recommended: e.auto?.recommended ?? null,
				letter_height: r.letterHeight,
				lines: r.lines.length,
				y_offset: {
					requested: a.y_offset,
					applied: w.applied[t]
				},
				shrunk: b,
				overflow: g
			});
		});
	}), {
		k: e.hasAuto ? Math.floor(c * 1e6) / 1e6 : null,
		blocks: d
	};
}
//#endregion
//#region src/engine/resolveSection.ts
var Ws = (e, t, n) => e.spacing === "auto" ? n.gap ?? n.ratios.SYMBOL_TEXT_SPACING * Go(t.w, t.h) : e.spacing;
function Gs(e, t, n, r) {
	let i = Ks(e, t, n, r);
	if (!i) return null;
	let { L: a, min: o, max: s, wanted: c } = i;
	return {
		orientation: e.orientation,
		available: a,
		min: o * a,
		max: s * a,
		wanted: c * a
	};
}
function Ks(e, t, n, r) {
	let i = e.symbol_frame;
	if (!i || i.symbols.length === 0) return null;
	let a = n.ratios, o = e.orientation, s = Go(t.w, t.h), c = Jo(t, o) - Ws(e, t, n);
	if (c <= 1e-6) return {
		L: c,
		min: 0,
		max: 0,
		wanted: 0,
		tooSmall: !0
	};
	let l = Is(e.text_frame, n, {
		textRefHeight: r.textRefHeight,
		sectionRef: s,
		lang: e.lang
	}), u = o === "vertical" ? zs(l, t.w, 0, n).frameHeight : Bs(l, n), d = 1 - Math.max(u, a.MIN_TEXT_SHARE * c) / c, f = gs(i, Yo(t, o), o, n, s) / c, p = Math.min(a.MIN_SYMBOL_SHARE, f), m = Math.min(a.MAX_SYMBOL_SHARE, d, f), h = e.symbol_share;
	return {
		L: c,
		min: p,
		max: m,
		wanted: Number.isFinite(h) ? h : a.DEFAULT_SYMBOL_SHARE,
		tooSmall: !1
	};
}
function qs(e, t, n, r) {
	let i = e.symbol_share, a = Ks(e, t, n, r);
	if (!a) return {
		symbolBox: null,
		textBox: t,
		share: {
			requested: i,
			applied: 0,
			min: 0,
			max: 0
		}
	};
	let o = e.orientation, s = Ws(e, t, n), c = a.L;
	if (a.tooSmall) return zo(n, {
		severity: "error",
		code: "E_SECTION_TOO_SMALL",
		path: r.path,
		message: "Section is too small to lay out"
	}), {
		symbolBox: null,
		textBox: t,
		share: {
			requested: i,
			applied: 0,
			min: 0,
			max: 0
		}
	};
	let { min: l, max: u } = a;
	u < l - 1e-6 && (zo(n, {
		severity: "error",
		code: "E_SECTION_TOO_SMALL",
		path: r.path,
		message: "The text needs more room than this section can give it with the smallest symbol"
	}), u = l);
	let d = Uo(a.wanted, l, u);
	r.symbolLength && (d = Uo(r.symbolLength.length / c, l, u), l = r.symbolLength.min / c, u = r.symbolLength.max / c);
	let f = Xo(t, o), p = Jo(t, o), m = d * c, h = e.symbol_side === "end";
	return {
		symbolBox: Zo(t, o, h ? f + p - m : f, m),
		textBox: Zo(t, o, h ? f : f + m + s, p - m - s),
		share: {
			requested: i,
			applied: d,
			min: l,
			max: u
		}
	};
}
function Js(e, t, n, r) {
	let i = qs(e, t, n, r), a = Is(e.text_frame, n, {
		textRefHeight: r.textRefHeight,
		sectionRef: Go(t.w, t.h),
		lang: e.lang
	});
	return a.hasAuto ? Vs(a, i.textBox, n).k : null;
}
function Ys(e, t, n, r) {
	let i = Bo(e, n, r.path), a = Go(t.w, t.h), o = qs(e, t, n, r);
	o.symbolBox && e.symbol_frame && _s(e, e.symbol_frame, o.symbolBox, n, i, a);
	let s = Is(e.text_frame, n, {
		textRefHeight: r.textRefHeight,
		sectionRef: a,
		lang: e.lang
	}), c = o.symbolBox !== null, l = e.orientation === "vertical", u = e.symbol_side === "end", d = {
		top: !(c && l && !u),
		right: !(c && !l && u),
		bottom: !(c && l && u),
		left: !(c && !l && !u)
	}, f = Us(s, o.textBox, n, i, `${r.path}.text_frame`, d, r.kCap ?? 1);
	return {
		id: e.id,
		symbol_share: o.share,
		k: f.k,
		blocks: f.blocks
	};
}
//#endregion
//#region src/engine/resolveSections.ts
function Xs(e, t) {
	let n = Ro(t), r = e.map((e) => {
		let t = () => Gs(e.section, e.box, n, e.opts);
		return {
			it: e,
			b: e.unitRef === null ? t() : Io(n, e.unitRef, t)
		};
	}).filter((e) => e.b !== null), i = /* @__PURE__ */ new Map();
	for (let e of r) {
		let t = `${e.b.orientation}|${e.b.available.toFixed(3)}`;
		i.set(t, [...i.get(t) ?? [], e]);
	}
	for (let e of i.values()) {
		if (e.length < 2) continue;
		let t = Math.max(...e.map((e) => e.b.min)), n = Math.min(...e.map((e) => e.b.max));
		if (t > n + 1e-6) continue;
		let r = Math.min(Math.max(e[0].b.wanted, t), n);
		for (let i of e) i.it.opts.symbolLength = {
			length: r,
			min: t,
			max: n
		};
	}
}
function Zs(e, t, n, r) {
	let i = e.layout, a = (e) => `root.sections[${e}]`;
	if (i.type === "stack") {
		let r = e.sections.length, o = i.direction, s = i.spacing === "auto" ? n.gap ?? n.ratios.SECTION_SPACING * Go(e.width, e.height) : i.spacing, c = ss(e.sections.map(() => ({
			basis: 0,
			min: 0,
			max: Infinity,
			grow: 1,
			shrink: 0
		})), Jo(t, o), s, "start"), l = e.sections.map((n, i) => {
			let s = Zo(t, o, Xo(t, o) + c[i].offset, c[i].size);
			return {
				section: n,
				box: s,
				unitRef: null,
				opts: {
					path: a(i),
					textRefHeight: r === 1 ? e.height : s.h
				}
			};
		});
		return (i.align_symbols ?? !0) && Xs(l, n), l.map((e) => Ys(e.section, e.box, n, e.opts));
	}
	let o = i.type === "board", s = o ? ls(e, i, t, n, r) : us(e, i, t, n, r);
	s.length !== e.sections.length && zo(n, {
		severity: "error",
		code: "E_GRID_CELL_COUNT",
		path: "root.layout",
		message: `${o ? "Board" : "Grid"} has ${s.length} cells but the sign has ${e.sections.length} sections`
	});
	let c = e.sections.slice(0, s.length).map((e, t) => ({
		section: e,
		cell: s[t],
		i: t
	})).map(({ section: e, cell: t, i: n }) => ({
		section: e,
		box: t.inner,
		unitRef: Go(t.outer.w, t.outer.h),
		opts: {
			path: a(n),
			textRefHeight: t.outer.h
		}
	}));
	if ((i.align_symbols ?? !0) && Xs(c, n), o ? i.sync_rows ?? !0 : i.sync_text) {
		let e = Ro(n), t = /* @__PURE__ */ new Map();
		c.forEach((e, n) => {
			let r = o ? s[n].group ?? 0 : 0;
			t.set(r, [...t.get(r) ?? [], e]);
		});
		for (let n of t.values()) {
			let t = 1;
			for (let r of n) {
				let n = Io(e, r.unitRef, () => Js(r.section, r.box, e, r.opts));
				n !== null && (t = Math.min(t, n));
			}
			for (let e of n) e.opts.kCap = t;
		}
	}
	return c.map((e) => Io(n, e.unitRef, () => Ys(e.section, e.box, n, e.opts)));
}
//#endregion
//#region src/engine/index.ts
function Qs(e, t) {
	let n = Po(t), r = e.root, i = () => ({
		width: r.width,
		height: r.height,
		shaper_id: t.shaper.id,
		ruleset_id: t.ruleset.id,
		nodes: n.nodes
	});
	try {
		let e = r.sections[0], t = e ? Bo(e, n, "root.sections[0]") : Ao, a = Zs(r, ts(r, t, n), n, t);
		ns(r, n);
		let o = i();
		return {
			scene: o,
			report: Vo(a, n, o)
		};
	} catch (e) {
		return n.findings.push({
			severity: "error",
			code: "E_LAYOUT_FAILED",
			path: "root",
			message: `Layout failed: ${e instanceof Error ? e.message : String(e)}`
		}), {
			scene: i(),
			report: {
				sections: [],
				findings: n.findings
			}
		};
	}
}
//#endregion
//#region src/renderer/format.ts
function X(e) {
	if (!Number.isFinite(e)) return "0";
	let t = Math.round(e * 1e3) / 1e3;
	return Object.is(t, -0) || t === 0 ? "0" : String(t);
}
var $s = (e) => e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"), Z = (e, t) => ` ${e}="${typeof t == "number" ? X(t) : $s(t)}"`, ec = class extends Error {
	name = "OutlineUnavailable";
}, tc = /__SYM__/g, nc = (e, t) => !!e && !!t && e.hex.trim().toLowerCase() === t.hex.trim().toLowerCase(), rc = (e, t) => t && nc(e, t.from) ? t.to : e, ic = (e, t) => {
	let n = t.from.hex.trim().toLowerCase(), r = n.length === 7 && n[1] === n[2] && n[3] === n[4] && n[5] === n[6] ? `#${n[1]}${n[3]}${n[5]}` : n, i = RegExp(`(${n}|${r})`, "gi"), a = t.to?.hex;
	return e.replace(/fill\s*:\s*(#[0-9a-f]{3,6})/gi, (e, t) => i.test(t) ? `fill: ${a ?? "none"}` : e).replace(/fill="(#[0-9a-f]{3,6})"/gi, (e, t) => i.test(t) ? `fill="${a ?? "none"}"` : e);
}, ac = (e) => {
	if (!e) return Z("fill", "none");
	let t = Z("fill", e.hex);
	return e.cmyk && (t += Z("data-cmyk", e.cmyk.map(X).join(","))), e.spot && (t += Z("data-spot", e.spot)), t;
}, oc = (e) => e ? Z("stroke", e.colour.hex) + Z("stroke-width", e.width) : "";
function sc(e) {
	let [t, n, r, i] = e.radius, { x: a, y: o, width: s, height: c } = e, l = (e, t, n) => e > 0 ? `A${X(e)} ${X(e)} 0 0 1 ${X(t)} ${X(n)}` : `L${X(t)} ${X(n)}`;
	return [
		`M${X(a + t)} ${X(o)}`,
		`H${X(a + s - n)}`,
		l(n, a + s, o + n),
		`V${X(o + c - r)}`,
		l(r, a + s - r, o + c),
		`H${X(a + i)}`,
		l(i, a, o + c - i),
		`V${X(o + t)}`,
		l(t, a + t, o),
		"Z"
	].join("");
}
function cc(e, t) {
	let n = ac(rc(e.fill, t)) + oc(e.stroke), [r, i, a, o] = e.radius;
	if (r === i && i === a && a === o) {
		let t = r > 0 ? Z("rx", r) : "";
		return `<rect${Z("x", e.x)}${Z("y", e.y)}${Z("width", e.width)}${Z("height", e.height)}${t}${n}/>`;
	}
	return `<path${Z("d", sc(e))}${n}/>`;
}
var lc = (e, t) => `<path${Z("d", e.d)}${ac(rc(e.fill, t))}${e.fill_rule ? Z("fill-rule", e.fill_rule) : ""}${oc(e.stroke)}/>`;
function uc(e, t) {
	let [n, r] = e.view_box, i = `translate(${X(e.x)} ${X(e.y)}) scale(${dc(e.scale)}) translate(${X(-n)} ${X(-r)})`, a = (t ? ic(e.body, t) : e.body).replace(tc, `${e.id}--`);
	return `<g${Z("transform", i)}>${a}</g>`;
}
var dc = (e) => {
	let t = Math.round(e * 1e6) / 1e6;
	return Object.is(t, -0) ? "0" : String(t);
};
function fc(e, t, n) {
	let r = rc(e.colour, n);
	if (t === "outline") {
		let t = e.lines.map((t) => {
			if (t.text === "") return "";
			if (t.d === void 0) throw new ec(`Text node ${e.id} has no outlines — render with an outlining shaper`);
			return `<path${Z("d", t.d)}/>`;
		}).join("");
		return `<g${Z("aria-label", e.text)}${ac(r)}>${t}</g>`;
	}
	let i = `${e.font_family}, Arimo, 'Liberation Sans', Arial, sans-serif`, a = e.variant.includes("bold") ? "bold" : "normal", o = e.variant.includes("italic") ? "italic" : "normal", s = e.lines.filter((e) => e.text !== "").map((t) => `<text${Z("x", t.x)}${Z("y", t.baseline)}${Z("font-family", i)}${Z("font-size", e.em)}${Z("font-weight", a)}${Z("font-style", o)}${Z("text-anchor", "start")}${Z("style", "font-kerning:normal;font-variant-ligatures:none")}${ac(r)}>${$s(t.text)}</text>`).join("");
	return `<g${Z("aria-label", e.text)}>${s}</g>`;
}
function pc(e, t, n) {
	let r;
	switch (e.type) {
		case "rect":
			r = cc(e, n);
			break;
		case "path":
			r = lc(e, n);
			break;
		case "symbol":
			r = uc(e, n);
			break;
		case "text": r = fc(e, t.text, n);
	}
	return `<g${Z("id", e.id)}${Z("data-source", e.source_id)}>${r}</g>`;
}
var mc = (e) => Math.max(e.width, e.height) / 100;
function hc(e) {
	let t = mc(e), { width: n, height: r } = e, i = 4 * t, a = 1.5 * t, o = "#333333", s = (e, t, n, r) => `<line${Z("x1", e)}${Z("y1", t)}${Z("x2", n)}${Z("y2", r)}/>`, c = (e, t, n, r) => `<text${Z("x", t)}${Z("y", n)}${Z("text-anchor", "middle")}${r ? Z("transform", `rotate(-90 ${X(t)} ${X(n)})`) : ""}>${$s(e)}</text>`, l = r + i, u = n + i;
	return `<g id="dimensions"${Z("stroke", o)}${Z("stroke-width", .12 * t)}${Z("fill", o)}${Z("font-family", "Arial, Arimo, sans-serif")}${Z("font-size", 2.6 * t)}>` + s(0, r + t, 0, l + a) + s(n, r + t, n, l + a) + s(0, l, n, l) + s(n + t, 0, u + a, 0) + s(n + t, r, u + a, r) + s(u, 0, u, r) + `<g${Z("stroke", "none")}>` + c(`${X(n)}mm`, n / 2, l + 3.4 * t, !1) + c(`${X(r)}mm`, u + 3.4 * t, r / 2, !0) + "</g></g>";
}
var gc = {
	hex: "#FFFFFF",
	cmyk: [
		0,
		0,
		0,
		0
	]
};
function _c(e, t) {
	let n = e.nodes.find((e) => e.layer === "substrate"), r = t.substrate !== !1, i = r && n ? `<g id="substrate">${pc(n, t)}</g>` : "", a = n?.type === "rect" ? n.fill : void 0, o = t.unprinted ? { hex: t.unprinted } : a, s = o ? r ? a && !nc(o, a) ? {
		from: o,
		to: a
	} : void 0 : nc(o, gc) ? void 0 : {
		from: o,
		to: gc
	} : void 0, c = e.nodes.filter((e) => e.layer === "artwork").map((e) => pc(e, t, s)).join(""), l = t.guides ? `<g id="guides">${e.nodes.filter((e) => e.layer === "guide").map((e) => pc(e, t)).join("")}</g>` : "", u = t.dimensions ? 9 * mc(e) : 0, d = e.width + u, f = e.height + u;
	return `<svg xmlns="http://www.w3.org/2000/svg"${Z("width", `${X(d)}mm`)}${Z("height", `${X(f)}mm`)}${Z("viewBox", `0 0 ${X(d)} ${X(f)}`)}>${i}<g id="artwork">${c}</g>${l}${t.dimensions ? hc(e) : ""}</svg>`;
}
//#endregion
//#region src/renderer/index.ts
function vc(e, t) {
	return _c(e, t);
}
//#endregion
//#region src/migration/migrations.ts
var yc = [], bc = class extends Error {
	name = "UnknownSchemaVersion";
};
function xc(e, t = yc, n = js) {
	if (typeof e?.schema_version != "string") throw new bc("Document has no schema_version");
	let r = structuredClone(e), i = /* @__PURE__ */ new Set();
	for (; r.schema_version !== n;) {
		if (i.has(r.schema_version)) throw new bc(`Migration loop at ${r.schema_version}`);
		i.add(r.schema_version);
		let e = t.find((e) => e.from === r.schema_version);
		if (!e) throw new bc(`No migration path from schema ${r.schema_version} to ${n}`);
		r = {
			...e.up(r),
			schema_version: e.to
		};
	}
	return r;
}
//#endregion
//#region src/symbols/guard.ts
var Sc = [
	[/<\s*script/i, "script element"],
	[/<\s*foreignObject/i, "foreignObject element"],
	[/<\s*iframe/i, "iframe element"],
	[/<\s*(?:image|a)\b/i, "image or link element"],
	[/\son[a-z]+\s*=/i, "event handler attribute"],
	[/javascript\s*:/i, "javascript: URL"],
	[/\b(?:href|src)\s*=\s*["'](?!#)/i, "external reference"],
	[/url\(\s*['"]?(?!#)/i, "external url()"],
	[/@import/i, "CSS import"]
];
function Cc(e) {
	return Sc.filter(([t]) => t.test(e)).map(([, e]) => e);
}
//#endregion
//#region src/validation/index.ts
var wc = (e) => typeof e == "object" && !!e && !Array.isArray(e), Tc = (e) => typeof e == "number" && Number.isFinite(e), Ec = /^#[0-9a-fA-F]{6}$/, Dc = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/, Oc = [
	"background",
	"panel",
	"panel_text",
	"symbol_background",
	"border"
], kc = (e) => e.some((e) => e.severity === "error");
function Ac(e, t) {
	let n = [], r = (e, t, r = "E_INVALID") => n.push({
		severity: "error",
		code: r,
		path: e,
		message: t
	}), i = (e, t, r) => n.push({
		severity: "warning",
		code: r,
		path: e,
		message: t
	}), a = /* @__PURE__ */ new Map(), o = (e, t) => {
		if (typeof e.id != "string" || e.id === "") return r(t, "Missing id");
		let n = a.get(e.id);
		n ? r(t, `Duplicate id "${e.id}" (also at ${n})`, "E_DUPLICATE_ID") : a.set(e.id, t);
	}, s = (e, t, n, i) => {
		(typeof e != "string" || !t.includes(e)) && r(n, `${i} must be one of ${t.join(", ")}`);
	}, c = (e, t, n) => {
		e !== "auto" && !(Tc(e) && e >= 0) && r(t, `${n} must be 'auto' or a non-negative number`);
	}, l = (e, t) => {
		if (e !== void 0) {
			if (wc(e) && typeof e.token == "string") return s(e.token, Oc, t, "Colour token");
			(!wc(e) || typeof e.hex != "string" || !Ec.test(e.hex)) && r(t, "Colour must be { hex: \"#RRGGBB\" } or { token }");
		}
	}, u = (e, n) => {
		(typeof e != "string" || !t.theme(e)) && r(n, `Category "${String(e)}" is not defined in ruleset "${t.id}"`, "E_UNKNOWN_CATEGORY");
	}, d = (e, t, n) => !Array.isArray(e) || e.length === 0 ? (r(t, `${n} must be a non-empty array`), []) : e;
	if (!wc(e)) return r("", "Document must be an object"), n;
	e.schema_version !== "1.0.0" && r("schema_version", `Unknown schema version "${String(e.schema_version)}"`, "E_SCHEMA_VERSION"), typeof e.id != "string" && r("id", "Missing document id"), typeof e.ruleset_id == "string" ? e.ruleset_id !== t.id && i("ruleset_id", `Document expects ruleset "${e.ruleset_id}" but "${t.id}" was supplied`, "W_RULESET_MISMATCH") : r("ruleset_id", "Missing ruleset_id");
	let f = e.root;
	if (!wc(f) || f.role !== "sign") return r("root", "root must be a sign node"), n;
	o(f, "root");
	for (let e of ["width", "height"]) {
		let t = f[e];
		(!Tc(t) || t <= 0 || t > Ms.MAX_SIGN_SIZE) && r(`root.${e}`, `${e} must be between 0 and ${Ms.MAX_SIGN_SIZE} mm`);
	}
	f.margin !== void 0 && c(f.margin, "root.margin", "margin"), l(f.background, "root.background"), f.corners !== void 0 && (!wc(f.corners) || typeof f.corners.rounded != "boolean" ? r("root.corners", "corners must be { rounded: true|false, radius }") : c(f.corners.radius, "root.corners.radius", "corner radius")), l(f.substrate, "root.substrate"), f.padding !== void 0 && c(f.padding, "root.padding", "padding"), f.border !== void 0 && (wc(f.border) ? (c(f.border.width, "root.border.width", "border width"), l(f.border.colour, "root.border.colour")) : r("root.border", "border must be an object"));
	let p = d(f.sections, "root.sections", "sections"), m = f.layout;
	if (!wc(m)) r("root.layout", "layout is required");
	else if (m.type === "stack") s(m.direction, ["vertical", "horizontal"], "root.layout.direction", "direction"), m.align_symbols !== void 0 && typeof m.align_symbols != "boolean" && r("root.layout.align_symbols", "align_symbols must be true or false"), c(m.spacing, "root.layout.spacing", "spacing");
	else if (m.type === "grid") {
		let { rows: e, cols: t } = m;
		(!Number.isInteger(e) || e < 1) && r("root.layout.rows", "rows must be an integer ≥ 1"), (!Number.isInteger(t) || t < 1) && r("root.layout.cols", "cols must be an integer ≥ 1"), Number.isInteger(e) && Number.isInteger(t) && e * t !== p.length && r("root.layout", `Grid has ${e * t} cells but ${p.length} sections`, "E_GRID_CELL_COUNT"), c(m.gutter, "root.layout.gutter", "gutter"), typeof m.sync_text != "boolean" && r("root.layout.sync_text", "sync_text must be true or false"), m.align_symbols !== void 0 && typeof m.align_symbols != "boolean" && r("root.layout.align_symbols", "align_symbols must be true or false"), wc(m.cell_outline) && (c(m.cell_outline.width, "root.layout.cell_outline.width", "outline width"), s(m.cell_outline.layer, ["artwork", "guide"], "root.layout.cell_outline.layer", "layer"), l(m.cell_outline.colour, "root.layout.cell_outline.colour"));
	} else if (m.type === "board") {
		let e = d(m.rows, "root.layout.rows", "rows");
		e.length || r("root.layout.rows", "A board needs at least one row");
		let t = 0;
		e.forEach((e, n) => {
			let i = `root.layout.rows[${n}]`;
			if (!wc(e)) return r(i, "Expected a row");
			!Number.isInteger(e.cells) || e.cells < 1 ? r(`${i}.cells`, "cells must be an integer ≥ 1") : t += e.cells, e.weight !== void 0 && (typeof e.weight != "number" || !Number.isFinite(e.weight) || e.weight <= 0) && r(`${i}.weight`, "weight must be a number greater than 0");
		}), t !== p.length && r("root.layout", `Board has ${t} cells but ${p.length} sections`, "E_GRID_CELL_COUNT"), c(m.gutter, "root.layout.gutter", "gutter"), m.sync_rows !== void 0 && typeof m.sync_rows != "boolean" && r("root.layout.sync_rows", "sync_rows must be true or false"), m.align_symbols !== void 0 && typeof m.align_symbols != "boolean" && r("root.layout.align_symbols", "align_symbols must be true or false"), wc(m.cell_outline) && (c(m.cell_outline.width, "root.layout.cell_outline.width", "outline width"), s(m.cell_outline.layer, ["artwork", "guide"], "root.layout.cell_outline.layer", "layer"), l(m.cell_outline.colour, "root.layout.cell_outline.colour"));
	} else r("root.layout.type", "layout.type must be 'stack', 'grid' or 'board'");
	return p.forEach((e, t) => {
		let n = `root.sections[${t}]`;
		if (!wc(e) || e.role !== "section") return r(n, "Expected a section node");
		o(e, n), s(e.orientation, ["vertical", "horizontal"], `${n}.orientation`, "orientation"), e.symbol_side !== void 0 && s(e.symbol_side, ["start", "end"], `${n}.symbol_side`, "symbol_side"), c(e.spacing, `${n}.spacing`, "spacing"), Tc(e.symbol_share) ? (e.symbol_share < 0 || e.symbol_share > 1) && i(`${n}.symbol_share`, "symbol_share is outside 0..1 and will be clamped", "W_SHARE_RANGE") : r(`${n}.symbol_share`, "symbol_share must be a number"), e.placeholder !== void 0 && typeof e.placeholder != "boolean" && r(`${n}.placeholder`, "placeholder must be true or false"), e.lang !== void 0 && !(typeof e.lang == "string" && Dc.test(e.lang)) && r(`${n}.lang`, "lang must be a language tag such as \"pl\" or \"pt-BR\"");
		let a = e.translation;
		if (a !== void 0) {
			let t = `${n}.translation`;
			wc(a) ? ((typeof a.of != "string" || !p.some((t) => wc(t) && t.id === a.of && t !== e)) && r(`${t}.of`, "translation.of must be the id of another section"), typeof a.checked != "boolean" && r(`${t}.checked`, "checked must be true or false"), typeof a.machine != "boolean" && r(`${t}.machine`, "machine must be true or false"), (!wc(a.lines) || !Object.values(a.lines).every((e) => wc(e) && typeof e.from == "string" && typeof e.manual == "boolean")) && r(`${t}.lines`, "lines must map block ids to { from, manual }")) : r(t, "translation must be an object");
		}
		let f = e.symbol_frame;
		if (f === null) u(e.category, `${n}.category`);
		else if (!wc(f) || f.role !== "symbol_frame") r(`${n}.symbol_frame`, "symbol_frame must be a symbol_frame node or null");
		else {
			let e = `${n}.symbol_frame`;
			o(f, e), c(f.spacing, `${e}.spacing`, "spacing"), s(f.align, [
				"start",
				"centre",
				"end"
			], `${e}.align`, "align"), l(f.background, `${e}.background`), d(f.symbols, `${e}.symbols`, "symbols").forEach((t, n) => {
				let i = `${e}.symbols[${n}]`;
				if (!wc(t) || t.role !== "symbol") return r(i, "Expected a symbol node");
				o(t, i), u(t.category, `${i}.category`);
				let a = t.source;
				if (!wc(a)) return r(`${i}.source`, "Symbol has no prepared source");
				let s = a.view_box;
				if ((!Array.isArray(s) || s.length !== 4 || !s.every(Tc) || s[2] <= 0 || s[3] <= 0) && r(`${i}.source.view_box`, "view_box must be [x, y, w, h] with positive size"), typeof a.body != "string" || a.body === "") r(`${i}.source.body`, "Symbol body is empty");
				else {
					let e = Cc(a.body);
					e.length && r(`${i}.source.body`, `Unsafe symbol markup: ${e.join(", ")}`, "E_UNSAFE_SYMBOL");
				}
			});
		}
		let m = e.text_frame, h = `${n}.text_frame`;
		if (!wc(m) || m.role !== "text_frame") return r(h, "text_frame is required");
		o(m, h), c(m.spacing, `${h}.spacing`, "spacing"), d(m.panels, `${h}.panels`, "panels").forEach((e, t) => {
			let n = `${h}.panels[${t}]`;
			if (!wc(e) || e.role !== "text_panel") return r(n, "Expected a text_panel node");
			o(e, n), e.padding !== "auto" && !(Array.isArray(e.padding) && e.padding.length === 4 && e.padding.every((e) => Tc(e) && e >= 0)) && r(`${n}.padding`, "padding must be 'auto' or four non-negative numbers"), c(e.spacing, `${n}.spacing`, "spacing"), s(e.justify, [
				"start",
				"centre",
				"end",
				"space-between",
				"space-evenly"
			], `${n}.justify`, "justify"), (!Tc(e.grow) || e.grow < 0) && r(`${n}.grow`, "grow must be ≥ 0"), e.fill !== "none" && l(e.fill, `${n}.fill`), e.category !== void 0 && u(e.category, `${n}.category`), d(e.blocks, `${n}.blocks`, "blocks").forEach((e, t) => {
				let a = `${n}.blocks[${t}]`;
				if (!wc(e) || e.role !== "text_block") return r(a, "Expected a text_block node");
				o(e, a), typeof e.text == "string" ? e.text.trim() === "" && i(`${a}.text`, "Text block is empty", "W_EMPTY_TEXT") : r(`${a}.text`, "text must be a string"), s(e.variant, [
					"regular",
					"bold",
					"italic",
					"bold-italic"
				], `${a}.variant`, "variant"), s(e.align, [
					"left",
					"centre",
					"right"
				], `${a}.align`, "align"), s(e.wrap, ["balanced", "greedy"], `${a}.wrap`, "wrap"), s(e.placement, [
					"flow",
					"pin-top",
					"pin-bottom"
				], `${a}.placement`, "placement"), (!Tc(e.line_spacing) || e.line_spacing < Ms.MIN_LINE_SPACING || e.line_spacing > 3) && r(`${a}.line_spacing`, `line_spacing must be ${Ms.MIN_LINE_SPACING}–3`), Tc(e.y_offset) || r(`${a}.y_offset`, "y_offset must be a number"), e.text_transform !== void 0 && s(e.text_transform, ["uppercase"], `${a}.text_transform`, "text_transform"), e.padding !== void 0 && !(Array.isArray(e.padding) && e.padding.length === 4 && e.padding.every((e) => Tc(e) && e >= 0)) && r(`${a}.padding`, "padding must be four non-negative numbers"), l(e.colour, `${a}.colour`);
				let c = e.size, u = Ms.MIN_LETTER_HEIGHT, d = Ms.MAX_LETTER_HEIGHT, f = (e) => Tc(e) && e >= u && e <= d;
				if (!wc(c)) return r(`${a}.size`, "size is required");
				if (c.mode === "auto") {
					s(c.role, [
						"title",
						"body",
						"footer"
					], `${a}.size.role`, "role");
					for (let e of ["recommended", "min"]) c[e] !== "auto" && !f(c[e]) && r(`${a}.size.${e}`, `${e} must be 'auto' or ${u}–${d} mm`);
					c.scale !== void 0 && !(Tc(c.scale) && c.scale >= Ms.MIN_TEXT_SCALE && c.scale <= Ms.MAX_TEXT_SCALE) && r(`${a}.size.scale`, `scale must be ${Ms.MIN_TEXT_SCALE}–${Ms.MAX_TEXT_SCALE}`), Tc(c.min) && Tc(c.recommended) && c.min > c.recommended && r(`${a}.size`, "min must not exceed recommended");
				} else c.mode === "fixed" ? f(c.letter_height) || r(`${a}.size.letter_height`, `letter_height must be ${u}–${d} mm`) : r(`${a}.size.mode`, "size.mode must be 'auto' or 'fixed'");
			});
		});
	}), n;
}
//#endregion
//#region src/pipeline.ts
function jc(e, t, n) {
	if (!t?.shaper || !t?.ruleset) throw Error("renderSign needs { shaper, ruleset }");
	let r;
	try {
		r = xc(e);
	} catch (e) {
		return {
			svg: null,
			scene: null,
			report: null,
			doc: null,
			findings: [{
				severity: "error",
				code: "E_SCHEMA_VERSION",
				path: "schema_version",
				message: String(e.message ?? e)
			}]
		};
	}
	let i = Ac(r, t.ruleset);
	if (kc(i)) return {
		svg: null,
		scene: null,
		report: null,
		doc: r,
		findings: i
	};
	let { scene: a, report: o } = Qs(r, t);
	return {
		svg: vc(a, n),
		scene: a,
		report: o,
		doc: r,
		findings: [...i, ...o.findings]
	};
}
//#endregion
//#region src/template/index.ts
var Mc = () => {
	let e = /* @__PURE__ */ new Map();
	return (t) => {
		let n = (e.get(t) ?? 0) + 1;
		return e.set(t, n), `${t}-${n}`;
	};
}, Nc = (e, t, n) => ({
	id: e("block"),
	role: "text_block",
	text: t,
	variant: "bold",
	align: "centre",
	size: {
		mode: "auto",
		role: n,
		recommended: "auto",
		min: "auto"
	},
	line_spacing: 1.15,
	wrap: "balanced",
	placement: "flow",
	y_offset: 0
});
function Pc(e, t, n, r) {
	let i = [Nc(e, t.title, "title")];
	return t.body && i.push(Nc(e, t.body, "body")), {
		id: e("section"),
		role: "section",
		orientation: n,
		spacing: "auto",
		symbol_share: r.ratios.DEFAULT_SYMBOL_SHARE,
		symbol_frame: {
			id: e("symbol-frame"),
			role: "symbol_frame",
			spacing: "auto",
			align: "centre",
			symbols: t.symbols.map((t) => ({
				id: e("symbol"),
				role: "symbol",
				symbol_code: t.symbol_code,
				category: t.category,
				source: t.source
			}))
		},
		text_frame: {
			id: e("text-frame"),
			role: "text_frame",
			spacing: "auto",
			panels: [{
				id: e("panel"),
				role: "text_panel",
				padding: "auto",
				spacing: "auto",
				justify: "centre",
				grow: 1,
				blocks: i
			}]
		}
	};
}
var Fc = (e, t, n) => {
	let r = (/* @__PURE__ */ new Date()).toISOString();
	return {
		schema_version: js,
		id: `sign-${r}`,
		created_at: r,
		updated_at: r,
		...t.catalogue_size_id === void 0 ? {} : { catalogue_size_id: t.catalogue_size_id },
		ruleset_id: e.id,
		root: n
	};
};
function Ic(e) {
	let t = Mc(), { width: n, height: r } = e.size, i = e.orientation ?? (r >= n ? "vertical" : "horizontal");
	return Fc(e.ruleset, e.size, {
		id: t("sign"),
		role: "sign",
		width: n,
		height: r,
		layout: {
			type: "stack",
			direction: "vertical",
			spacing: "auto"
		},
		sections: [Pc(t, e, i, e.ruleset)]
	});
}
//#endregion
//#region src/symbols/sha256.ts
var Lc = new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
function Rc(e) {
	let t = new TextEncoder().encode(e), n = t.length * 8, r = new Uint8Array(t.length + 9 + 63 >> 6 << 6);
	r.set(t), r[t.length] = 128;
	let i = new DataView(r.buffer);
	i.setUint32(r.length - 8, Math.floor(n / 2 ** 32)), i.setUint32(r.length - 4, n >>> 0);
	let a = new Uint32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]), o = /* @__PURE__ */ new Uint32Array(64), s = (e, t) => e >>> t | e << 32 - t;
	for (let e = 0; e < r.length; e += 64) {
		for (let t = 0; t < 16; t++) o[t] = i.getUint32(e + t * 4);
		for (let e = 16; e < 64; e++) {
			let t = o[e - 15], n = o[e - 2], r = s(t, 7) ^ s(t, 18) ^ t >>> 3, i = s(n, 17) ^ s(n, 19) ^ n >>> 10;
			o[e] = o[e - 16] + r + o[e - 7] + i | 0;
		}
		let [t, n, r, c, l, u, d, f] = a;
		for (let e = 0; e < 64; e++) {
			let i = f + (s(l, 6) ^ s(l, 11) ^ s(l, 25)) + (l & u ^ ~l & d) + Lc[e] + o[e] | 0, a = (s(t, 2) ^ s(t, 13) ^ s(t, 22)) + (t & n ^ t & r ^ n & r) | 0;
			f = d, d = u, u = l, l = c + i | 0, c = r, r = n, n = t, t = i + a | 0;
		}
		a[0] += t, a[1] += n, a[2] += r, a[3] += c, a[4] += l, a[5] += u, a[6] += d, a[7] += f;
	}
	return Array.from(a, (e) => e.toString(16).padStart(8, "0")).join("");
}
var zc = "__SYM__", Bc = class extends Error {
	name = "InvalidSymbol";
}, Vc = /* @__PURE__ */ new Set([
	"g",
	"path",
	"rect",
	"circle",
	"ellipse",
	"line",
	"polyline",
	"polygon",
	"defs",
	"linearGradient",
	"radialGradient",
	"stop",
	"clipPath",
	"mask",
	"use",
	"symbol"
]), Hc = /* @__PURE__ */ new Set(/* @__PURE__ */ "id.d.points.x.y.x1.y1.x2.y2.cx.cy.r.rx.ry.fx.fy.width.height.transform.viewBox.preserveAspectRatio.href.offset.gradientUnits.gradientTransform.spreadMethod.clipPathUnits.maskUnits.maskContentUnits.fill.fill-opacity.fill-rule.stroke.stroke-width.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-dasharray.stroke-dashoffset.stroke-opacity.opacity.clip-path.clip-rule.mask.stop-color.stop-opacity.display.visibility.style".split(".")), Uc = /* @__PURE__ */ new Set([
	"fill",
	"fill-opacity",
	"fill-rule",
	"stroke",
	"stroke-width",
	"stroke-linecap",
	"stroke-linejoin",
	"stroke-miterlimit",
	"stroke-dasharray",
	"stroke-dashoffset",
	"stroke-opacity",
	"opacity",
	"clip-rule",
	"clip-path",
	"mask",
	"display",
	"visibility",
	"stop-color",
	"stop-opacity",
	"isolation"
]), Wc = [
	"fill",
	"fill-rule",
	"stroke",
	"stroke-width",
	"opacity",
	"style"
], Gc = (e) => /javascript\s*:|expression\s*\(|@import|\\/i.test(e) || /url\(\s*['"]?(?!#)/i.test(e);
function Kc(e) {
	return e.split(";").flatMap((e) => {
		let t = e.indexOf(":");
		if (t < 0) return [];
		let n = e.slice(0, t).trim().toLowerCase(), r = e.slice(t + 1).trim();
		return n && r ? [[n, r]] : [];
	});
}
function qc(e) {
	let t = e.replace(/\/\*[\s\S]*?\*\//g, ""), n = [];
	for (let e of t.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) n.push({
		selectors: e[1].split(",").map((e) => e.trim()),
		decls: Kc(e[2])
	});
	return n;
}
function Jc(e, t) {
	let n = /^([a-zA-Z]*)((?:\.[\w-]+)*)$/.exec(e);
	if (!n) return !1;
	let [, r, i] = n;
	if (r && r !== t.localName) return !1;
	let a = (t.getAttribute("class") ?? "").split(/\s+/);
	return i.split(".").filter(Boolean).every((e) => a.includes(e));
}
var Yc = (e) => e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function Xc(e) {
	let t = e.getAttribute("viewBox"), n;
	if (n = t ? t.trim().split(/[\s,]+/).map(Number) : [
		0,
		0,
		parseFloat(e.getAttribute("width") ?? ""),
		parseFloat(e.getAttribute("height") ?? "")
	], n.length !== 4 || n.some((e) => !Number.isFinite(e)) || n[2] <= 0 || n[3] <= 0) throw new Bc("Symbol SVG has no usable viewBox or width/height");
	return n;
}
function Zc(e, t = {}) {
	let n = t.DOMParser ?? globalThis.DOMParser;
	if (!n) throw new Bc("No DOMParser available");
	let r = t.purify ? t.purify(e) : e, i = new n().parseFromString(r, "image/svg+xml"), a = i.documentElement;
	if (!a || a.localName !== "svg" || i.getElementsByTagName("parsererror").length > 0) throw new Bc("Not an SVG document");
	let o = Xc(a), s = [];
	for (let e of Array.from(a.getElementsByTagName("style"))) s.push(...qc(e.textContent ?? ""));
	let c = /* @__PURE__ */ new Set(), l = (e) => {
		let t = e.getAttribute("id");
		t && c.add(t);
		for (let t of Array.from(e.children)) l(t);
	};
	l(a);
	let u = (e) => e.replace(/url\(\s*(['"]?)#([^)'"]+)\1\s*\)/g, (e, t, n) => c.has(n) ? `url(#${zc}${n})` : e), d = (e) => e.filter(([e, t]) => Uc.has(e) && !Gc(t)).map(([e, t]) => `${e}:${u(t)}`).join(";"), f = (e) => {
		let t = [], n = s.filter((t) => t.selectors.some((t) => Jc(t, e))).flatMap((e) => e.decls), r = Kc(e.getAttribute("style") ?? "");
		for (let n of Array.from(e.attributes)) {
			let e = n.name, r = n.value;
			if (e === "xlink:href" && (e = "href"), e !== "style" && Hc.has(e) && !/^on/i.test(e)) {
				if (e === "href") {
					if (!r.startsWith("#")) continue;
					let e = r.slice(1);
					r = c.has(e) ? `#${zc}${e}` : r;
				} else if (e === "id") r = `${zc}${r}`;
				else {
					if (Gc(r)) continue;
					r = u(r);
				}
				t.push(`${e}="${Yc(r)}"`);
			}
		}
		let i = d([...n, ...r]);
		return i && t.push(`style="${Yc(i)}"`), t.length ? ` ${t.join(" ")}` : "";
	}, p = (e) => {
		let t = e.localName === "a" ? "g" : e.localName;
		if (!Vc.has(t)) return "";
		let n = Array.from(e.children).map(p).join(""), r = f(e);
		return n ? `<${t}${r}>${n}</${t}>` : `<${t}${r}/>`;
	}, m = Array.from(a.children).map(p).join(""), h = Wc.map((e) => [e, a.getAttribute(e)]).filter((e) => !!e[1] && !Gc(e[1]));
	if (h.length && (m = `<g ${h.map(([e, t]) => e === "style" ? `style="${Yc(d(Kc(t)))}"` : `${e}="${Yc(t)}"`).join(" ")}>${m}</g>`), !m) throw new Bc("Symbol has no drawable content");
	return {
		view_box: o,
		body: m,
		hash: Rc(m),
		prepared_with: "1"
	};
}
//#endregion
//#region src/text/canvasShaper.ts
var Qc = 100, $c = 1e3, el = {
	regular: "/arimo/Arimo-Regular.ttf",
	bold: "/arimo/Arimo-Bold.ttf",
	italic: "/arimo/Arimo-Italic.ttf",
	"bold-italic": "/arimo/Arimo-BoldItalic.ttf"
};
function tl() {
	if (typeof OffscreenCanvas < "u") {
		let e = new OffscreenCanvas(8, 8).getContext("2d");
		if (e) return e;
	}
	let e = document.createElement("canvas").getContext("2d");
	if (!e) throw Error("Canvas 2D is not available");
	return e;
}
var nl = (e, t, n = Qc) => `${e === "italic" || e === "bold-italic" ? "italic" : "normal"} ${e === "bold" || e === "bold-italic" ? "bold" : "normal"} ${n}px "${t}"`;
function rl(e, t = tl()) {
	let n = (e) => (t.font = e, t.measureText("mmmmmmmmmmlliWWQ@#0123").width);
	return ["monospace", "serif"].every((t) => n(`100px "${e}", ${t}`) !== n(`100px ${t}`));
}
async function il(e, t) {
	if (typeof FontFace > "u" || typeof document > "u") return !1;
	try {
		let n = Object.keys(t).map((n) => new FontFace(e, `url(${t[n]})`, {
			style: n.includes("italic") ? "italic" : "normal",
			weight: n.includes("bold") ? "bold" : "normal"
		}));
		return (await Promise.all(n.map((e) => e.load()))).forEach((e) => document.fonts.add(e)), !0;
	} catch {
		return !1;
	}
}
async function al(t) {
	let n = tl();
	n.fontKerning = "normal";
	let r = t.family;
	if (!rl(r, n)) {
		let e = {
			...el,
			...t.fallbackUrls
		};
		r = await il(t.fallback, e) ? t.fallback : "sans-serif";
	}
	let i = (e, t) => (n.font = r === "sans-serif" ? nl(t, r).replace(/"/g, "") : nl(t, r), n.measureText(e)), a = {};
	for (let e of [
		"regular",
		"bold",
		"italic",
		"bold-italic"
	]) {
		let t = i("H", e);
		a[e] = {
			unitsPerEm: $c,
			capHeight: t.actualBoundingBoxAscent / Qc * $c,
			ascender: t.fontBoundingBoxAscent / Qc * $c,
			descender: -(t.fontBoundingBoxDescent / Qc) * $c
		};
	}
	let o = new e(2e3);
	return {
		id: `canvas:${r}`,
		family: r,
		metrics: (e) => a[e],
		advance: (e, t, n) => o.get(`a|${t}|${e}`, () => i(e, t).width / Qc) * n,
		descent: (e, t, n) => Math.max(0, o.get(`d|${t}|${e}`, () => i(e, t).actualBoundingBoxDescent / Qc)) * n
	};
}
//#endregion
//#region src/rulesets/checks.ts
var ol = (e) => {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
};
function sl(e) {
	let t = /^#?([0-9a-f]{6})$/i.exec(e.trim());
	if (!t) return 0;
	let n = parseInt(t[1], 16);
	return .2126 * ol(n >> 16 & 255) + .7152 * ol(n >> 8 & 255) + .0722 * ol(n & 255);
}
function cl(e, t) {
	let [n, r] = [sl(e.hex), sl(t.hex)].sort((e, t) => t - e);
	return (n + .05) / (r + .05);
}
function ll(e, t, n) {
	let r = t.x + t.width / 2, i = t.y + t.height / 2;
	for (let t = n - 1; t >= 0; t--) {
		let n = e.nodes[t];
		if (n.type !== "rect" || n.layer !== "artwork" || !n.fill) continue;
		let a = n;
		if (r >= a.x && r <= a.x + a.width && i >= a.y && i <= a.y + a.height) return a.fill;
	}
}
function ul(e, t) {
	let n = [], r = e.limits?.min_letter_height;
	return t.nodes.forEach((e, i) => {
		if (e.type !== "text" || e.lines.length === 0) return;
		r !== void 0 && e.letter_height < r && n.push({
			severity: "warning",
			code: "W_LETTER_HEIGHT_BELOW_MIN",
			path: e.source_id,
			message: `Letter height ${e.letter_height} mm is below the ${r} mm minimum for this standard`
		});
		let a = ll(t, e, i);
		a && cl(a, e.colour) < 3 && n.push({
			severity: "warning",
			code: "W_LOW_CONTRAST",
			path: e.source_id,
			message: `Text colour ${e.colour.hex} has low contrast against ${a.hex}`
		});
	}), n;
}
//#endregion
//#region src/rulesets/createRuleset.ts
function dl(e) {
	let t = new Map(e.categories.map((e) => [e.key, e]));
	return {
		...e,
		theme: (e) => t.get(e),
		check: (t) => ul(e, t)
	};
}
var fl = {
	$schema: "./sign-rules.schema.json",
	spacing: {
		same_gap_everywhere: !0,
		gap_percent: 3.333
	},
	corners: {
		rounded_by_default: !0,
		radius_same_as_gap: !0,
		radius_percent: 3.333
	},
	text_size: {
		start_percent_of_height: {
			title: 20,
			body: 12,
			footer: 5
		},
		minimum_mm: {
			title: 5,
			body: 5,
			footer: 5
		}
	},
	sign: {
		margin_percent: 3.333,
		border_percent: 2,
		section_gap_percent: 3.333
	},
	symbol: {
		gap_to_text_percent: 2.143,
		clear_space_percent: 3.179,
		gap_between_symbols_percent: 4,
		default_share_percent: 37.2,
		min_share_percent: 25,
		max_share_percent: 75
	},
	text_panel: {
		padding_percent: 4,
		gap_between_panels_percent: 3.333,
		gap_between_blocks_percent: 1.5,
		min_share_percent: 15
	},
	grid: {
		gutter_percent: 2,
		cell_padding_percent: 3,
		cell_outline_percent: .2
	},
	limits: { warn_below_letter_height_mm: null }
}, pl = [
	{
		id: 1,
		title: "prohibition",
		description: "Prohibition\n\n",
		default_colour_RGB: "237,28,38",
		default_colour_HEX: "#ED1C24",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: 41077,
		show_search_tab: 1
	},
	{
		id: 2,
		title: "warning",
		description: "Hazard Warning",
		default_colour_RGB: "255,242,0",
		default_colour_HEX: "#FFF200",
		default_text_HEX: "#000000",
		default_colour: null,
		bespoke_product_id: 41079,
		show_search_tab: 1
	},
	{
		id: 3,
		title: "mandatory",
		description: "Mandatory Actions",
		default_colour_RGB: "5,107,179",
		default_colour_HEX: "#056BB3",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: 41078,
		show_search_tab: 1
	},
	{
		id: 4,
		title: "fire & emergency",
		description: "Fire Safety & Emergency",
		default_colour_RGB: "9,145,70",
		default_colour_HEX: "#099146",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: 41080,
		show_search_tab: 1
	},
	{
		id: 5,
		title: "fire",
		description: "Fire equipment",
		default_colour_RGB: "237,28,38",
		default_colour_HEX: "#ED1C24",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: 41081,
		show_search_tab: 1
	},
	{
		id: 6,
		title: "info",
		description: "Information & Direction",
		default_colour_RGB: null,
		default_colour_HEX: null,
		default_text_HEX: null,
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 0
	},
	{
		id: 7,
		title: "imo",
		description: "Maritime (IMO)",
		default_colour_RGB: null,
		default_colour_HEX: null,
		default_text_HEX: null,
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 0
	},
	{
		id: 8,
		title: "road traffic",
		description: "Road Traffic",
		default_colour_RGB: null,
		default_colour_HEX: null,
		default_text_HEX: null,
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 9,
		title: "workplace",
		description: "Workplace Safety",
		default_colour_RGB: null,
		default_colour_HEX: null,
		default_text_HEX: null,
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 10,
		title: "public",
		description: "Public Buildings",
		default_colour_RGB: null,
		default_colour_HEX: null,
		default_text_HEX: null,
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 11,
		title: "construction",
		description: "Construction & Site Safety",
		default_colour_RGB: "255,165,0",
		default_colour_HEX: "#FFA500",
		default_text_HEX: "#000000",
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 12,
		title: "hygiene",
		description: "Hygiene & Catering",
		default_colour_RGB: "0,128,255",
		default_colour_HEX: "#0080FF",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 13,
		title: "social_distancing",
		description: "Social Distancing & COVID-19",
		default_colour_RGB: "128,0,128",
		default_colour_HEX: "#800080",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 14,
		title: "nhs",
		description: "NHS & Healthcare",
		default_colour_RGB: "0,48,135",
		default_colour_HEX: "#003087",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 15,
		title: "school",
		description: "School & Education",
		default_colour_RGB: "0,150,57",
		default_colour_HEX: "#009639",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 16,
		title: "environmental",
		description: "Environmental & Recycling",
		default_colour_RGB: "34,139,34",
		default_colour_HEX: "#228B22",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 17,
		title: "uk_transport",
		description: "UK Transport & Fleet",
		default_colour_RGB: "25,25,112",
		default_colour_HEX: "#191970",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 18,
		title: "garage_mot",
		description: "Garage & MOT",
		default_colour_RGB: "105,105,105",
		default_colour_HEX: "#696969",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 19,
		title: "camping",
		description: "Camping & Parks",
		default_colour_RGB: "107,142,35",
		default_colour_HEX: "#6B8E23",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 20,
		title: "coshh",
		description: "COSHH & Chemical Safety",
		default_colour_RGB: "220,20,60",
		default_colour_HEX: "#DC143C",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 21,
		title: "ghs",
		description: "GHS (Global Harmonization System)",
		default_colour_RGB: "255,69,0",
		default_colour_HEX: "#FF4500",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 22,
		title: "cctv",
		description: "CCTV & Security",
		default_colour_RGB: "47,79,79",
		default_colour_HEX: "#2F4F4F",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 23,
		title: "quality",
		description: "Quality Control",
		default_colour_RGB: "72,61,139",
		default_colour_HEX: "#483D8B",
		default_text_HEX: "#FFFFFF",
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 24,
		title: "glass",
		description: "Glass Awareness",
		default_colour_RGB: "135,206,235",
		default_colour_HEX: "#87CEEB",
		default_text_HEX: "#000000",
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	},
	{
		id: 25,
		title: "directional",
		description: "Direction Arrows",
		default_colour_RGB: "255,242,0",
		default_colour_HEX: "#FFF200",
		default_text_HEX: "#000000",
		default_colour: null,
		bespoke_product_id: null,
		show_search_tab: 1
	}
], ml = class extends Error {
	name = "SignRulesError";
}, hl = [
	"title",
	"body",
	"footer"
];
function gl(e) {
	let t = [], n = e, r = (e, n, r = 100) => {
		typeof n != "number" || !Number.isFinite(n) ? t.push(`${e} must be a number`) : (n < 0 || n > r) && t.push(`${e} must be between 0 and ${r} (got ${n})`);
	}, i = (t) => t.split(".").reduce((e, t) => e && typeof e == "object" ? e[t] : void 0, e);
	for (let e of hl) r(`text_size.start_percent_of_height.${e}`, i(`text_size.start_percent_of_height.${e}`)), r(`text_size.minimum_mm.${e}`, i(`text_size.minimum_mm.${e}`), 500);
	for (let e of [
		"sign.margin_percent",
		"sign.border_percent",
		"sign.section_gap_percent",
		"symbol.gap_to_text_percent",
		"symbol.clear_space_percent",
		"symbol.gap_between_symbols_percent",
		"symbol.default_share_percent",
		"symbol.min_share_percent",
		"symbol.max_share_percent",
		"text_panel.padding_percent",
		"text_panel.gap_between_panels_percent",
		"text_panel.gap_between_blocks_percent",
		"text_panel.min_share_percent",
		"grid.gutter_percent",
		"grid.cell_padding_percent",
		"grid.cell_outline_percent"
	]) r(e, i(e));
	if (i("spacing") !== void 0 && (typeof i("spacing.same_gap_everywhere") != "boolean" && t.push("spacing.same_gap_everywhere must be true or false"), r("spacing.gap_percent", i("spacing.gap_percent"), 25)), i("corners") !== void 0) {
		for (let e of ["rounded_by_default", "radius_same_as_gap"]) typeof i(`corners.${e}`) != "boolean" && t.push(`corners.${e} must be true or false`);
		r("corners.radius_percent", i("corners.radius_percent"), 25);
	}
	if (t.length === 0) {
		n.symbol.min_share_percent > n.symbol.max_share_percent && t.push("symbol.min_share_percent must not exceed symbol.max_share_percent"), n.sign.margin_percent >= 50 && t.push("sign.margin_percent must be under 50");
		let e = n.limits?.warn_below_letter_height_mm;
		e != null && !(typeof e == "number" && e > 0) && t.push("limits.warn_below_letter_height_mm must be a positive number or null");
	}
	if (t.length) throw new ml(`config/sign-rules.json has problems:\n- ${t.join("\n- ")}`);
	return n;
}
var _l = (e) => e / 100;
function vl(e) {
	let t = gl(e), n = t.text_size.start_percent_of_height;
	return {
		MARGIN: _l(t.sign.margin_percent),
		BORDER: _l(t.sign.border_percent),
		SECTION_SPACING: _l(t.sign.section_gap_percent),
		SYMBOL_TEXT_SPACING: _l(t.symbol.gap_to_text_percent),
		SYMBOL_SPACING: _l(t.symbol.gap_between_symbols_percent),
		SYMBOL_PADDING: _l(t.symbol.clear_space_percent),
		PANEL_PADDING: _l(t.text_panel.padding_percent),
		PANEL_SPACING: _l(t.text_panel.gap_between_panels_percent),
		BLOCK_SPACING: _l(t.text_panel.gap_between_blocks_percent),
		MIN_SYMBOL_SHARE: _l(t.symbol.min_share_percent),
		MAX_SYMBOL_SHARE: _l(t.symbol.max_share_percent),
		MIN_TEXT_SHARE: _l(t.text_panel.min_share_percent),
		DEFAULT_SYMBOL_SHARE: _l(t.symbol.default_share_percent),
		GRID_GUTTER: _l(t.grid.gutter_percent),
		CELL_PADDING: _l(t.grid.cell_padding_percent),
		CELL_OUTLINE: _l(t.grid.cell_outline_percent),
		UNIFORM_GAP: t.spacing?.same_gap_everywhere ? _l(t.spacing.gap_percent) : null,
		CORNERS_ROUNDED: t.corners?.rounded_by_default ?? !1,
		CORNER_RADIUS: !t.corners || t.corners.radius_same_as_gap ? null : _l(t.corners.radius_percent),
		LETTER_HEIGHT: {
			title: _l(n.title),
			body: _l(n.body),
			footer: _l(n.footer)
		},
		MIN_LETTER_HEIGHT_MM: { ...t.text_size.minimum_mm }
	};
}
function yl(e) {
	let t = gl(e).limits?.warn_below_letter_height_mm;
	return typeof t == "number" ? { min_letter_height: t } : {};
}
//#endregion
//#region src/rulesets/fromDb.ts
var bl = {
	hex: "#FFFFFF",
	cmyk: [
		0,
		0,
		0,
		0
	]
}, xl = {
	hex: "#000000",
	cmyk: [
		0,
		0,
		0,
		100
	]
}, Sl = /^#[0-9a-fA-F]{6}$/, Cl = (e) => e.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
function wl(e) {
	if (!e) return;
	let t = e.replace(/^cmyk\(|\)$/gi, "").split(",").map(Number);
	return t.length === 4 && t.every((e) => Number.isFinite(e) && e >= 0 && e <= 100) ? t : void 0;
}
var Tl = {
	key: "plain",
	title: "White",
	background: bl,
	panel: bl,
	panel_text: xl,
	border: xl
};
function El(e) {
	let t = [Tl], n = [];
	for (let r of e) {
		let e = r.default_colour_HEX?.trim().toUpperCase(), i = r.default_text_HEX?.trim().toUpperCase();
		if (!e || !Sl.test(e) || !i || !Sl.test(i)) {
			n.push({
				id: r.id,
				title: r.title,
				reason: "no default_colour_HEX / default_text_HEX"
			});
			continue;
		}
		let a = wl(r.default_colour);
		t.push({
			key: Cl(r.title),
			db_id: r.id,
			title: r.description?.trim() || r.title,
			background: bl,
			panel: a ? {
				hex: e,
				cmyk: a
			} : { hex: e },
			panel_text: i === "#000000" ? xl : i === "#FFFFFF" ? bl : { hex: i },
			border: xl
		});
	}
	return {
		categories: t,
		skipped: n
	};
}
//#endregion
//#region src/rulesets/iso7010.ts
var Dl = El(pl), Ol = Dl.categories;
Dl.skipped;
var kl = fl;
vl(kl);
function Al(e = kl, t = Ol) {
	return dl({
		id: "iso7010",
		ratios: vl(e),
		categories: t,
		limits: yl(e)
	});
}
Al();
//#endregion
//#region editor/src/config.ts
function jl() {
	if (typeof document > "u") return null;
	let e = document.getElementById("sign-designer-config");
	if (!e?.textContent) return null;
	try {
		let t = JSON.parse(e.textContent);
		return t && typeof t == "object" ? t : null;
	} catch {
		return null;
	}
}
var Ml = jl(), Nl = () => Ml ? "same-origin" : "omit", Pl = Ml?.assetBase ?? "./", Fl = {
	regular: `${Pl}nimbus/NimbusSanL-Reg.otf`,
	bold: `${Pl}nimbus/NimbusSanL-Bol.otf`,
	italic: `${Pl}nimbus/NimbusSanL-RegIta.otf`,
	"bold-italic": `${Pl}nimbus/NimbusSanL-BolIta.otf`
}, Il = {
	regular: `${Pl}arimo/Arimo-Regular.ttf`,
	bold: `${Pl}arimo/Arimo-Bold.ttf`,
	italic: `${Pl}arimo/Arimo-Italic.ttf`,
	"bold-italic": `${Pl}arimo/Arimo-BoldItalic.ttf`
}, Ll = (e, t) => (e ?? "").split(";")[0].replace(/\s+-\s*test$/i, "").trim() || t;
function Rl(e, t) {
	return e.filter((e) => e.usable && e.category).flatMap((e) => {
		let n = t(e);
		return n ? [{
			code: e.code,
			name: Ll(e.referent, e.code),
			category: e.category,
			url: n
		}] : [];
	});
}
function zl(e, t, n = Bl()) {
	return e.includes("{name}") ? new URL(e.replace("{name}", t), n) : new URL(`${t}.json`, new URL(e.endsWith("/") ? e : `${e}/`, n));
}
var Bl = () => typeof location > "u" ? void 0 : location.href;
async function Vl(e) {
	let t = async (t) => {
		let n = await fetch(zl(e, t), { credentials: Nl() });
		if (!n.ok) throw Error(`${t}: HTTP ${n.status}`);
		return n.json();
	}, [n, r, i] = await Promise.all([
		t("categories"),
		t("symbols"),
		t("sizes")
	]), a = zl(e, "symbols").href;
	return {
		source: new URL(a).origin,
		categories: n,
		symbols: Rl(r, (e) => e.url ? new URL(e.url, a).href : void 0),
		sizes: i
	};
}
async function Hl(e = location.search) {
	let t = Ml?.dataUrl ?? new URLSearchParams(e).get("data") ?? "https://www.safetysignsandnotices.co.uk/index.php?route=bespoke/api/{name}";
	if (t && t !== "bundled") return Vl(t);
	let { loadBundledData: n } = await import("./bundledData.embed-DiqJWvnl.js");
	return n();
}
//#endregion
//#region editor/src/engineSetup.ts
async function Ul() {
	let e = await al({
		family: "Nimbus Sans",
		fallback: "Nimbus Sans",
		fallbackUrls: Fl
	});
	return e.family === "sans-serif" ? al({
		family: "Arimo",
		fallback: "Arimo",
		fallbackUrls: Il
	}) : e;
}
async function Wl() {
	let e = await Hl(), t = El(e.categories).categories;
	return {
		data: e,
		ruleset: Al(kl, t),
		shaper: await Ul()
	};
}
//#endregion
//#region editor/src/printShaper.ts
async function Gl(e) {
	let t = await Promise.all(Object.entries(e).map(async ([e, t]) => {
		let n = await fetch(t);
		if (!n.ok) throw Error(`${t}: HTTP ${n.status}`);
		return [e, await n.arrayBuffer()];
	}));
	return Object.fromEntries(t);
}
var Kl = null;
function ql() {
	return Kl || (Kl = (async () => {
		let { createOpenTypeShaper: e } = await import("./opentypeShaper-RM5NMCu7.js");
		try {
			return await e(await Gl(Fl));
		} catch {
			return e(await Gl(Il));
		}
	})(), Kl.catch(() => {
		Kl = null;
	})), Kl;
}
//#endregion
//#region data/approved.json
var Jl = [
	{
		product_id: 3,
		name: "No smoking - site",
		sign_reads: "<p>Sign reads - site</p>",
		image: "https://cdn.totalsafetygroup.com/stores/products/ps146.gif",
		size: {
			size_id: 3,
			name: "300mm x 100mm",
			width: 300,
			height: 100
		},
		design: {
			schema_version: "1.0.0",
			id: "sign-2026-09-18T06:08:18.154Z",
			created_at: "2026-09-18T06:08:18.154Z",
			updated_at: "2026-09-18T06:08:18.154Z",
			catalogue_size_id: 3,
			ruleset_id: "iso7010",
			root: {
				id: "sign-1",
				role: "sign",
				width: 300,
				height: 100,
				layout: {
					type: "stack",
					direction: "vertical",
					spacing: "auto",
					align_symbols: !0
				},
				sections: [{
					id: "section-mu6k4w6x4",
					role: "section",
					orientation: "horizontal",
					spacing: "auto",
					symbol_share: .37200000000000005,
					symbol_frame: {
						id: "symbol_frame-mu6k4w6x5",
						role: "symbol_frame",
						spacing: "auto",
						align: "centre",
						symbols: [{
							id: "symbol-mu6k4w6x6",
							role: "symbol",
							symbol_code: "P002",
							category: "prohibition"
						}]
					},
					text_frame: {
						id: "text_frame-mu6k4w6x7",
						role: "text_frame",
						spacing: "auto",
						panels: [{
							id: "text_panel-mu6k4w6x1",
							role: "text_panel",
							padding: "auto",
							spacing: "auto",
							justify: "centre",
							grow: 1,
							blocks: [{
								id: "text_block-mu6k4w6x3",
								role: "text_block",
								text: "No smoking beyond this point",
								variant: "bold",
								align: "centre",
								size: {
									mode: "auto",
									role: "title",
									recommended: "auto",
									min: "auto"
								},
								line_spacing: 1.15,
								wrap: "balanced",
								placement: "flow",
								y_offset: 0
							}],
							category: "prohibition"
						}]
					}
				}]
			}
		}
	},
	{
		product_id: 5,
		name: "No Smoking by Law sign sign",
		sign_reads: "",
		image: "https://cdn.totalsafetygroup.com/stores/products/sd2.gif",
		size: {
			size_id: 13,
			name: "150mm x 200mm",
			width: 150,
			height: 200
		},
		design: {
			schema_version: "1.0.0",
			id: "sign-2026-09-18T06:06:31.166Z",
			created_at: "2026-09-18T06:06:31.166Z",
			updated_at: "2026-09-18T06:06:31.166Z",
			catalogue_size_id: 13,
			ruleset_id: "iso7010",
			root: {
				id: "sign-1",
				role: "sign",
				width: 150,
				height: 200,
				layout: {
					type: "stack",
					direction: "vertical",
					spacing: "auto",
					align_symbols: !0
				},
				sections: [{
					id: "section-mu6k2lne5",
					role: "section",
					orientation: "vertical",
					spacing: "auto",
					symbol_share: .57,
					symbol_frame: {
						id: "symbol_frame-mu6k2lne6",
						role: "symbol_frame",
						spacing: "auto",
						align: "centre",
						symbols: [{
							id: "symbol-mu6k2lne7",
							role: "symbol",
							symbol_code: "P002",
							category: "prohibition"
						}]
					},
					text_frame: {
						id: "text_frame-mu6k2lne8",
						role: "text_frame",
						spacing: "auto",
						panels: [{
							id: "text_panel-mu6k2lne1",
							role: "text_panel",
							padding: "auto",
							spacing: "auto",
							justify: "centre",
							grow: 1,
							blocks: [{
								id: "text_block-mu6k2lne3",
								role: "text_block",
								text: "No smoking",
								variant: "bold",
								align: "centre",
								size: {
									mode: "auto",
									role: "title",
									recommended: "auto",
									min: "auto",
									scale: .718
								},
								line_spacing: 1.15,
								wrap: "balanced",
								placement: "flow",
								y_offset: 0
							}, {
								id: "text_block-mu6k2lne4",
								role: "text_block",
								text: "It is against the law\nto smoke in these\npremises.",
								variant: "bold",
								align: "centre",
								size: {
									mode: "auto",
									role: "body",
									recommended: "auto",
									min: "auto",
									scale: .847
								},
								line_spacing: 1.15,
								wrap: "balanced",
								placement: "flow",
								y_offset: 0
							}],
							category: "prohibition"
						}]
					}
				}]
			}
		}
	},
	{
		product_id: 9,
		name: "No Smoking Disciplinary offence sign",
		sign_reads: "",
		image: "https://cdn.totalsafetygroup.com/stores/products/ps259.gif",
		size: {
			size_id: 2,
			name: "200mm x 300mm",
			width: 200,
			height: 300
		},
		design: {
			schema_version: "1.0.0",
			id: "sign-2026-09-18T06:08:31.703Z",
			created_at: "2026-09-18T06:08:31.703Z",
			updated_at: "2026-09-18T06:08:31.703Z",
			catalogue_size_id: 2,
			ruleset_id: "iso7010",
			root: {
				id: "sign-1",
				role: "sign",
				width: 200,
				height: 300,
				layout: {
					type: "stack",
					direction: "vertical",
					spacing: "auto",
					align_symbols: !0
				},
				sections: [{
					id: "section-mu6k56pw5",
					role: "section",
					orientation: "vertical",
					spacing: "auto",
					symbol_share: .37200000000000005,
					symbol_frame: {
						id: "symbol_frame-mu6k56pw6",
						role: "symbol_frame",
						spacing: "auto",
						align: "centre",
						symbols: [{
							id: "symbol-mu6k56pw7",
							role: "symbol",
							symbol_code: "P002",
							category: "prohibition"
						}]
					},
					text_frame: {
						id: "text_frame-mu6k56pw8",
						role: "text_frame",
						spacing: "auto",
						panels: [{
							id: "text_panel-mu6k56pw1",
							role: "text_panel",
							padding: "auto",
							spacing: "auto",
							justify: "centre",
							grow: 1,
							blocks: [{
								id: "text_block-mu6k56pw3",
								role: "text_block",
								text: "No smoking",
								variant: "bold",
								align: "centre",
								size: {
									mode: "auto",
									role: "title",
									recommended: "auto",
									min: "auto"
								},
								line_spacing: 1.15,
								wrap: "balanced",
								placement: "flow",
								y_offset: 0
							}, {
								id: "text_block-mu6k56pw4",
								role: "text_block",
								text: "You are reminded that it is a disciplinary offence to smoke in this area. Any persons found doing so will be liable for dismissal.",
								variant: "bold",
								align: "centre",
								size: {
									mode: "auto",
									role: "body",
									recommended: "auto",
									min: "auto"
								},
								line_spacing: 1.15,
								wrap: "balanced",
								placement: "flow",
								y_offset: 0
							}],
							category: "prohibition"
						}]
					}
				}]
			}
		}
	}
], Yl = (e) => [...new Set(e.root.sections.flatMap((e) => e.symbol_frame?.symbols.map((e) => e.symbol_code) ?? []))];
function Xl(e, t) {
	let n = structuredClone(e);
	for (let e of n.root.sections) {
		let n = e.symbol_frame;
		if (!n) continue;
		let r = n.symbols.find((e) => !t.has(e.symbol_code));
		n.symbols = n.symbols.filter((e) => t.has(e.symbol_code));
		for (let e of n.symbols) e.source = t.get(e.symbol_code);
		n.symbols.length || (e.category ??= r?.category ?? "prohibition", e.symbol_frame = null);
	}
	return n;
}
//#endregion
//#region editor/src/model/approved.ts
var Zl = Jl, Ql = (e) => Zl.find((t) => t.product_id === e) ?? null;
function $l(e = location.search) {
	let t = Number(new URLSearchParams(e).get("approved"));
	return Number.isInteger(t) && t > 0 ? t : null;
}
async function eu(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of Yl(e.design)) {
		let e = await t(r);
		e && n.set(r, e);
	}
	return xc(Xl(e.design, n));
}
var tu = 0, nu = Date.now().toString(36), ru = (e) => `${e}-${nu}${(++tu).toString(36)}`;
function iu(e) {
	let t = structuredClone(e), n = (e) => {
		if (Array.isArray(e)) e.forEach(n);
		else if (e && typeof e == "object") {
			let t = e;
			typeof t.id == "string" && typeof t.role == "string" && (t.id = ru(t.role)), Object.values(t).forEach(n);
		}
	};
	return n(t), t;
}
var au = (e, t) => ({
	id: ru("text_block"),
	role: "text_block",
	text: e,
	variant: "bold",
	align: "centre",
	size: {
		mode: "auto",
		role: t,
		recommended: "auto",
		min: "auto"
	},
	line_spacing: 1.15,
	wrap: "balanced",
	placement: "flow",
	y_offset: 0
}), ou = (e = "Your text here") => ({
	id: ru("text_panel"),
	role: "text_panel",
	padding: "auto",
	spacing: "auto",
	justify: "centre",
	grow: 1,
	blocks: [au(e, "title")]
}), su = (e) => ({
	id: ru("symbol"),
	role: "symbol",
	symbol_code: e.code,
	category: e.category,
	source: e.source
});
function cu(e, t) {
	let n = e.root.sections;
	for (let e = 0; e < n.length; e++) {
		let r = n[e], i = {
			section: e,
			panel: null,
			block: null,
			symbol: null
		};
		if (r.id === t || r.text_frame.id === t || r.symbol_frame?.id === t) return i;
		let a = r.symbol_frame?.symbols.findIndex((e) => e.id === t) ?? -1;
		if (a >= 0) return {
			...i,
			symbol: a
		};
		for (let e = 0; e < r.text_frame.panels.length; e++) {
			let n = r.text_frame.panels[e];
			if (n.id === t) return {
				...i,
				panel: e
			};
			let a = n.blocks.findIndex((e) => e.id === t);
			if (a >= 0) return {
				...i,
				panel: e,
				block: a
			};
		}
	}
	return null;
}
function lu(e) {
	if (e.placeholder) {
		delete e.placeholder;
		for (let t of e.text_frame.panels) {
			delete t.fill;
			for (let e of t.blocks) delete e.colour, e.variant = "bold";
		}
	}
}
function uu(e, t) {
	let n = e.root.sections.find((e) => e.id === t);
	if (!n) throw Error(`No section ${t}`);
	return n;
}
function du(e, t) {
	for (let n of e.root.sections) {
		let e = n.text_frame.panels.findIndex((e) => e.id === t);
		if (e >= 0) return {
			section: n,
			panel: n.text_frame.panels[e],
			index: e
		};
	}
	throw Error(`No panel ${t}`);
}
function fu(e, t) {
	for (let n of e.root.sections) for (let e of n.text_frame.panels) {
		let r = e.blocks.findIndex((e) => e.id === t);
		if (r >= 0) return {
			section: n,
			panel: e,
			block: e.blocks[r],
			index: r
		};
	}
	throw Error(`No text line ${t}`);
}
var pu = (e, t, n) => {
	if (t === n || t < 0 || n < 0 || t >= e.length || n >= e.length) return;
	let [r] = e.splice(t, 1);
	e.splice(n, 0, r);
};
function mu(e) {
	let t = e.root.sections.find((e) => e.translation);
	return (t && e.root.sections.find((e) => e.id === t.translation.of)) ?? null;
}
function hu(e) {
	let t = mu(e);
	return t ? (t.symbol_frame?.symbols.length ?? 0) > 1 ? "multi" : "single" : e.root.layout.type === "board" ? "board" : e.root.layout.type === "grid" ? "grid" : e.root.sections.length > 1 ? "stacked" : (e.root.sections[0]?.symbol_frame?.symbols.length ?? 0) > 1 ? "multi" : "single";
}
var gu = (e, t) => e > t ? "left" : "above", _u = (e) => e === "left" || e === "right" ? "horizontal" : "vertical";
function vu(e) {
	let { root: t } = e;
	if (t.layout.type === "board") return yu(e, t.layout);
	if (t.layout.type !== "grid" && t.sections.length > 1) return;
	let [n, r] = t.layout.type === "grid" ? [t.width / t.layout.cols, t.height / t.layout.rows] : [t.width, t.height], i = t.sections[0]?.symbol_side === "end";
	for (let e of t.sections) e.orientation = _u(gu(n, r)), i || delete e.symbol_side;
}
function yu(e, t) {
	let { root: n } = e, r = zd(t), i = Bd(t), a = r.reduce((e, t) => e + t, 0) || 1, o = 0;
	t.rows.forEach((e, t) => {
		let s = n.width / i[t], c = r[t] / a * n.height;
		for (let e = 0; e < i[t]; e++) {
			let t = n.sections[o + e];
			if (!t) continue;
			let r = t.symbol_side === "end";
			t.orientation = _u(gu(s, c)), r || delete t.symbol_side;
		}
		o += i[t];
	});
}
function bu(e) {
	let t = e.root.sections[0], n = t?.symbol_side === "end";
	return t?.orientation === "horizontal" ? n ? "right" : "left" : n ? "below" : "above";
}
function xu(e, t) {
	let n = t === "below" || t === "right";
	for (let r of e.root.sections) r.orientation = _u(t), n ? r.symbol_side = "end" : delete r.symbol_side;
}
function Su(e, t) {
	let { root: n } = e, r = hu(e);
	if (t === r) return null;
	let i = null, a = mu(e);
	if (a) {
		let e = a.symbol_frame;
		return !e || t !== "single" && t !== "multi" ? null : (t === "single" ? e.symbols.length = 1 : e.symbols.length < 2 && (e.symbols.push(iu(e.symbols[0])), i = {
			section: n.sections.indexOf(a),
			symbol: e.symbols.length - 1
		}), i);
	}
	let o = n.sections[0], s = Wu(e);
	if (t === "single" || t === "multi") {
		let r = t === "multi" && n.sections.length > 1 ? Tu(n.sections) : o;
		n.sections = [r], n.layout = {
			type: "stack",
			direction: "vertical",
			spacing: "auto",
			align_symbols: s
		};
		let a = r.symbol_frame;
		if (t === "single" && a && a.symbols.length > 1 && (a.symbols.length = 1), t === "multi") {
			if (!a) return null;
			a.symbols.length < 2 && (a.symbols.push(iu(a.symbols[0])), i = {
				section: 0,
				symbol: a.symbols.length - 1
			});
		}
		vu(e);
	} else if (t === "stacked") {
		let t = r === "multi" ? wu(o) : n.sections.slice(0, 4);
		t.length < 2 && t.push(iu(o)), n.sections = t, n.layout = {
			type: "stack",
			direction: "vertical",
			spacing: "auto",
			align_symbols: s
		}, xu(e, "left");
	} else if (t === "board") {
		let t = (r === "multi" ? wu(o) : n.sections).slice(0, 8);
		n.sections = t.length ? t : [o], n.layout = {
			type: "board",
			rows: n.sections.map(() => ({ cells: 1 })),
			gutter: "auto",
			sync_rows: !0,
			align_symbols: !1
		}, vu(e);
	} else {
		let t = r === "multi" ? wu(o).slice(0, 4) : null, i = t?.length ?? 2, [a, c] = n.width >= n.height ? [1, i] : [i, 1];
		t && (n.sections = t), n.layout = {
			type: "grid",
			rows: a,
			cols: c,
			gutter: "auto",
			cell_outline: {
				width: "auto",
				layer: "artwork"
			},
			sync_text: !0,
			align_symbols: s
		}, Eu(e), vu(e);
	}
	return i;
}
function Cu(e) {
	let t = [];
	for (let n of e) {
		let e = t[t.length - 1];
		e && (e[0].category === n.category || t.length >= 4) ? e.push(n) : t.push([n]);
	}
	return t;
}
function wu(e) {
	let t = Cu(e.symbol_frame?.symbols ?? []);
	if (t.length < 2) return [e];
	let n = t.length, r = e.text_frame.panels, i = t.map(() => []);
	if (r.length >= n) r.forEach((e, t) => i[Math.min(t, n - 1)].push(e));
	else {
		let e = r.flatMap((e) => e.blocks), t = Math.max(1, e.length - (n - 1)), a = r[0], o = (e, t) => ({
			...a,
			id: t ? a.id : ru("text_panel"),
			blocks: e
		});
		i[0].push(o(e.slice(0, t), !0));
		for (let r = 1; r < n; r++) {
			let n = e[t + r - 1];
			i[r].push(n ? o([fd(n, "title")], !1) : ou());
		}
	}
	return t.map((t, n) => {
		let r = n === 0 ? e : iu({
			...e,
			symbol_frame: null,
			text_frame: {
				...e.text_frame,
				panels: []
			}
		});
		return {
			...r,
			symbol_frame: {
				...e.symbol_frame,
				id: n === 0 ? e.symbol_frame.id : ru("symbol_frame"),
				symbols: t
			},
			text_frame: {
				...r.text_frame,
				panels: i[n]
			}
		};
	});
}
function Tu(e) {
	let t = e[0], n = e.flatMap((e) => e.symbol_frame?.symbols ?? []).slice(0, 4), r = e.flatMap((e) => e.text_frame.panels), i = e.every((e) => e.text_frame.panels.length === 1) && r.every((e) => e.category === void 0), a = (e) => e.symbol_frame?.symbols[0]?.category ?? e.category, o = i ? [{
		...r[0],
		blocks: r.flatMap((e, t) => e.blocks.map((e) => t > 0 && dd(e) === "title" ? fd(e, "body") : e))
	}] : e.flatMap((e, t) => e.text_frame.panels.map((n) => {
		let r = n.category ?? (t === 0 ? void 0 : a(e));
		return r === void 0 ? n : {
			...n,
			category: r
		};
	})), s = t.symbol_frame ?? e.find((e) => e.symbol_frame)?.symbol_frame ?? null;
	return {
		...t,
		symbol_frame: s && n.length ? {
			...s,
			symbols: n
		} : null,
		text_frame: {
			...t.text_frame,
			panels: o
		}
	};
}
function Eu(e) {
	let { root: t } = e;
	if (t.layout.type !== "grid") return;
	let n = t.layout.rows * t.layout.cols;
	for (; t.sections.length < n;) t.sections.push(iu(t.sections[t.sections.length - 1]));
	t.sections.length = n;
}
function Du(e, t, n) {
	let r = e.root.layout;
	r.type === "grid" && (r.rows = Math.max(1, Math.min(4, Math.round(t))), r.cols = Math.max(1, Math.min(4, Math.round(n))), Eu(e), vu(e));
}
function Ou(e, t) {
	e.root.width = t.width, e.root.height = t.height, e.catalogue_size_id = t.size_id, vu(e);
}
var ku = 1200, Au = 2400, ju = (e) => Math.round(Math.min(Au, Math.max(50, Number.isFinite(e) ? e : 50)));
function Mu(e, t, n, r) {
	let i = ju(e);
	if (r && n.width > 0 && n.height > 0) {
		let e = n.width / n.height, r = t === "width" ? i : i * e, a = t === "width" ? i / e : i, o = Math.min(1, ku / Math.min(r, a), Au / Math.max(r, a));
		return r *= o, a *= o, {
			width: ju(r),
			height: ju(a)
		};
	}
	let a = t === "width" ? i : ju(n.width), o = t === "height" ? i : ju(n.height);
	return Math.min(a, o) > 1200 && (t === "width" ? a = ku : o = ku), {
		width: a,
		height: o
	};
}
function Nu(e, t, n, r) {
	let i = ju(t), a = ju(n);
	Math.min(i, a) > 1200 && (i <= a ? i = ku : a = ku);
	let o = r.find((e) => e.width === i && e.height === a);
	if (o) return Ou(e, o);
	e.root.width = i, e.root.height = a, delete e.catalogue_size_id, vu(e);
}
function Pu(e, t) {
	let n = e.root.sections;
	return e.root.layout.type !== "stack" || n.length >= 4 ? t : (n.splice(t + 1, 0, iu(n[t])), t + 1);
}
function Fu(e, t) {
	let n = e.root.sections;
	e.root.layout.type !== "stack" || n.length <= 1 || (n.splice(t, 1), n.length === 1 && vu(e));
}
var Iu = (e, t, n) => pu(e.root.sections, t, n);
function Lu(e, t, n) {
	let r = e.root.sections;
	t !== n && r[t] && r[n] && ([r[t], r[n]] = [r[n], r[t]]);
}
function Ru(e, t) {
	let n = e.root.sections[t];
	n && (e.root.sections = e.root.sections.map((e, r) => r === t ? e : iu(n)));
}
function zu(e, t) {
	for (let n of e.root.sections[t]?.text_frame.panels ?? []) for (let e of n.blocks) e.text = "";
}
function Bu(e, t, n) {
	let r = uu(e, t);
	lu(r), r.symbol_frame || (r.symbol_frame = {
		id: ru("symbol_frame"),
		role: "symbol_frame",
		spacing: "auto",
		align: "centre",
		symbols: []
	}, delete r.category);
	let i = r.symbol_frame.symbols;
	return i.length >= 4 || i.push(su(n)), i.length - 1;
}
function Vu(e, t, n, r) {
	lu(uu(e, t));
	let i = uu(e, t).symbol_frame?.symbols, a = i?.[n];
	i && a && (i[n] = {
		...a,
		symbol_code: r.code,
		category: r.category,
		source: r.source
	});
}
function Hu(e, t, n) {
	let r = uu(e, t), i = r.symbol_frame, a = i?.symbols[n];
	i && a && (i.symbols.splice(n, 1), i.symbols.length === 0 && (r.symbol_frame = null, r.category = a.category));
}
var Uu = (e, t, n, r) => {
	let i = uu(e, t).symbol_frame?.symbols;
	i && pu(i, n, r);
}, Wu = (e) => e.root.layout.align_symbols ?? !0;
function Gu(e, t) {
	e.root.layout.align_symbols = t;
}
function Ku(e, t, n) {
	let r = Wu(e) ? e.root.sections : [uu(e, t)];
	for (let e of r) e.symbol_share = n;
}
function qu(e, t, n) {
	let r = uu(e, t);
	lu(r), r.category = n;
}
function Ju(e, t) {
	let n = uu(e, t).text_frame.panels;
	if (n.length >= 4) return null;
	let r = ou("More text");
	return r.blocks[0].size = {
		...r.blocks[0].size,
		role: "body"
	}, n.push(r), r.id;
}
function Yu(e, t) {
	let { section: n, index: r } = du(e, t);
	n.text_frame.panels.length > 1 && n.text_frame.panels.splice(r, 1);
}
function Xu(e, t, n) {
	let { section: r, index: i } = du(e, t);
	pu(r.text_frame.panels, i, i + n);
}
function Zu(e, t, n) {
	lu(du(e, t).section);
	let { panel: r } = du(e, t);
	n ? r.category = n : delete r.category;
}
var Qu = [
	"prohibition",
	"warning",
	"mandatory",
	"fire_emergency",
	"fire"
];
function $u(e) {
	let t = [...Qu, "plain"].flatMap((t) => e.filter((e) => e.key === t)), n = new Set(t.map((e) => `${e.panel.hex}/${e.panel_text.hex}`));
	return {
		main: t,
		more: e.filter((e) => {
			let t = `${e.panel.hex}/${e.panel_text.hex}`;
			return Qu.includes(e.key) || n.has(t) ? !1 : (n.add(t), !0);
		})
	};
}
function ed(e, t) {
	let { panel: n } = du(e, t);
	if (n.blocks.length >= 4) return null;
	let r = au("More text", "body");
	return n.blocks.push(r), r.id;
}
function td(e, t) {
	let { section: n, panel: r, index: i } = fu(e, t);
	r.blocks.length > 1 ? r.blocks.splice(i, 1) : n.text_frame.panels.length > 1 ? Yu(e, r.id) : r.blocks[0].text = "";
}
function nd(e, t, n) {
	let { panel: r, index: i } = fu(e, t);
	pu(r.blocks, i, i + n);
}
var rd = (e, t, n) => {
	let { section: r, block: i } = fu(e, t);
	lu(r), i.text = n;
}, id = (e, t, n) => {
	fu(e, t).block.align = n;
};
function ad(e, t, n) {
	fu(e, t).block.variant = n ? "bold" : "regular";
}
var od = (e) => e.variant === "bold" || e.variant === "bold-italic", sd = (e) => e.text_transform === "uppercase";
function cd(e, t) {
	t ? e.text_transform = "uppercase" : delete e.text_transform;
}
var ld = (e, t, n) => cd(fu(e, t).block, n);
function ud(e, t, n) {
	let { block: r } = fu(e, t);
	r.size = r.size.mode === "auto" ? {
		...r.size,
		role: n
	} : {
		mode: "auto",
		role: n,
		recommended: "auto",
		min: "auto"
	};
}
var dd = (e) => e.size.mode === "auto" ? e.size.role : "title", fd = (e, t) => ({
	...e,
	size: e.size.mode === "auto" ? {
		...e.size,
		role: t
	} : {
		mode: "auto",
		role: t,
		recommended: "auto",
		min: "auto"
	}
}), pd = {
	min: .8,
	max: 1.6,
	step: .05,
	default: 1.15
};
function md(e, t, n) {
	let r = Number.isFinite(n) ? n : pd.default;
	fu(e, t).block.line_spacing = Math.round(Math.min(pd.max, Math.max(pd.min, r)) * 100) / 100;
}
var hd = (e) => e.placement === "pin-bottom";
function gd(e, t, n) {
	fu(e, t).block.placement = n ? "pin-bottom" : "flow";
}
function _d(e, t, n) {
	fu(e, t).block.y_offset = Math.round(n * 10) / 10;
}
var vd = 1.18;
function yd(e) {
	if (e.size.mode !== "auto" || e.size.recommended !== "auto") return 0;
	let t = Math.round(Math.log(e.size.scale ?? 1) / Math.log(vd));
	return Math.max(-12, Math.min(8, t));
}
function bd(e, t) {
	let n = Math.max(-12, Math.min(8, Math.round(t))), r = e.size.mode === "auto" ? {
		mode: "auto",
		role: e.size.role,
		recommended: "auto",
		min: e.size.min
	} : {
		mode: "auto",
		role: "title",
		recommended: "auto",
		min: "auto"
	}, i = Math.min(Ms.MAX_TEXT_SCALE, Math.max(Ms.MIN_TEXT_SCALE, vd ** n));
	e.size = n === 0 ? r : {
		...r,
		scale: Math.round(i * 1e3) / 1e3
	};
}
function xd(e, t) {
	return e > 0 && t ? "Max fit" : e === 0 ? "Auto" : e > 0 ? `+${e}` : `${e}`;
}
var Sd = (e) => e.root.background && "token" in e.root.background && e.root.background.token === "panel" ? "colour" : "white";
function Cd(e) {
	let t = [];
	for (let n of e.matchAll(/#([0-9a-f]{3}|[0-9a-f]{6})\b/gi)) {
		let e = n[1].length === 3 ? n[1].split("").map((e) => e + e).join("") : n[1];
		t.push([
			0,
			2,
			4
		].map((t) => parseInt(e.slice(t, t + 2), 16)));
	}
	for (let n of e.matchAll(/rgb\(\s*(\d+)\D+(\d+)\D+(\d+)/gi)) t.push([
		Number(n[1]),
		Number(n[2]),
		Number(n[3])
	]);
	return t;
}
var wd = (e, t, n) => Math.hypot(e[0] - t[0], e[1] - t[1], e[2] - t[2]) <= n;
function Td(e, t) {
	if (e.category !== "prohibition") return !1;
	let n = t.replace("#", "");
	if (n.length !== 6) return !1;
	let r = [
		0,
		2,
		4
	].map((e) => parseInt(n.slice(e, e + 2), 16));
	return Cd(e.source?.body ?? "").some((e) => wd(e, r, 40));
}
var Ed = (e) => !!e.symbol_frame?.background;
function Dd(e, t) {
	for (let n of e.root.sections) {
		let e = n.symbol_frame;
		e && (t ? e.background = { token: "background" } : delete e.background);
	}
}
function Od(e, t) {
	return e.root.sections.some((e) => {
		let n = e.category ?? e.symbol_frame?.symbols[0]?.category, r = t.find((e) => e.key === n)?.panel.hex;
		return !!r && (e.symbol_frame?.symbols ?? []).some((e) => Td(e, r));
	});
}
function kd(e, t, n = []) {
	if (t !== "colour") {
		delete e.root.background, Dd(e, !1);
		return;
	}
	e.root.background = { token: "panel" }, Od(e, n) && Dd(e, !0);
}
var Ad = (e, t) => e.root.corners?.rounded ?? t;
function jd(e, t) {
	e.root.corners = {
		rounded: t,
		radius: e.root.corners?.radius ?? "auto"
	};
}
function Md(e, t) {
	e.root.layout.type === "grid" && (e.root.layout.sync_text = t);
}
var Nd = (e) => e.root.layout.type === "grid" && e.root.layout.cell_outline !== void 0;
function Pd(e, t) {
	let n = e.root.layout;
	n.type === "grid" && (t ? n.cell_outline = {
		width: "auto",
		layer: "artwork"
	} : delete n.cell_outline);
}
var Fd = (e) => mu(e) ?? e.root.sections[0];
function Id(e) {
	if (!mu(e) && (e.root.layout.type !== "stack" || e.root.sections.length !== 1)) return !1;
	let t = Fd(e);
	return t.symbol_frame?.symbols.length === 1 && t.text_frame.panels.length === 1 && t.text_frame.panels[0].blocks.length <= 2 && t.text_frame.panels[0].category === void 0;
}
function Ld(e) {
	let t = Fd(e).text_frame.panels[0].blocks;
	t.length < 2 && t.push(au("", "body"));
}
function Rd(e) {
	return [
		e.id,
		...e.symbol_frame ? [e.symbol_frame.id, ...e.symbol_frame.symbols.map((e) => e.id)] : [],
		e.text_frame.id,
		...e.text_frame.panels.flatMap((e) => [e.id, ...e.blocks.map((e) => e.id)])
	];
}
var zd = (e) => e.rows.map((e) => typeof e.weight == "number" && Number.isFinite(e.weight) && e.weight > 0 ? e.weight : 1), Bd = (e) => e.rows.map((e) => Math.max(1, Math.min(2, Math.floor(e.cells))));
function Vd(e, t, n, r, i) {
	if (r < 0 || i < 0 || r > t || i > n || !e.rows.length) return null;
	let a = zd(e), o = Bd(e), s = a.reduce((e, t) => e + t, 0) || 1, c = 0, l = 0;
	for (let u = 0; u < e.rows.length; u++) {
		let d = a[u] / s * n;
		if (i < c + d || u === e.rows.length - 1) {
			let e = o[u], n = Math.min(e - 1, Math.max(0, Math.floor(r / t * e)));
			return l + n;
		}
		c += d, l += o[u];
	}
	return null;
}
function Hd(e, t, n) {
	let { root: r } = e;
	if (r.layout.type === "board") return Vd(r.layout, r.width, r.height, t, n);
	if (r.layout.type !== "grid") return null;
	let { rows: i, cols: a } = r.layout, o = Math.floor(t / r.width * a), s = Math.floor(n / r.height * i);
	return o < 0 || s < 0 || o >= a || s >= i ? null : s * a + o;
}
function Ud(e) {
	let t = /^root\.sections\[(\d+)\]/.exec(e);
	return t ? Number(t[1]) : null;
}
function Wd(e) {
	let { root: t } = e, { layout: n } = t, r = n.type === "grid" ? t.height / n.rows : n.type === "board" ? t.height / Math.max(1, n.rows.length) : t.height / Math.max(1, n.direction === "vertical" ? t.sections.length : 1);
	return Math.max(5, Math.round(r / 4));
}
//#endregion
//#region editor/src/model/recipe.ts
var Gd = "plain", Kd = {
	hex: "#000000",
	cmyk: [
		0,
		0,
		0,
		100
	]
}, qd = 14, Jd = 4, Yd = 8, Xd = [
	"title",
	"body",
	"footer"
], Zd = [
	"above",
	"below",
	"left",
	"right"
], Qd = (e, t) => typeof e == "string" ? e.slice(0, t) : "", $d = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, ef = (e) => Array.isArray(e) ? e : [];
function tf(e) {
	let t = $d(e);
	if (!t) return null;
	let n = ef(t.sections).slice(0, qd).map((e) => {
		let t = $d(e) ?? {};
		return {
			symbols: ef(t.symbols).filter((e) => typeof e == "string").slice(0, 4).map((e) => e.trim().toUpperCase()),
			colour: typeof t.colour == "string" ? t.colour : null,
			panels: ef(t.panels).slice(0, Jd).map((e) => {
				let t = $d(e) ?? {};
				return {
					colour: typeof t.colour == "string" ? t.colour : null,
					lines: ef(t.lines).slice(0, Yd).map((e) => {
						let t = $d(e) ?? {}, n = typeof t.min == "number" && Number.isFinite(t.min) ? Math.min(20, Math.max(Ms.MIN_LETTER_HEIGHT, t.min)) : void 0;
						return {
							text: Qd(t.text, 200),
							style: Xd.includes(t.style) ? t.style : "body",
							caps: t.caps === !0,
							bold: t.bold !== !1,
							...n === void 0 ? {} : { min: n }
						};
					}).filter((e) => e.text.trim() !== "")
				};
			}).filter((e) => e.lines.length > 0)
		};
	}).filter((e) => e.symbols.length > 0 || e.panels.length > 0);
	if (!n.length) return null;
	let r = nf(t.rows_spec, n.length), i = t.layout === "board" && r ? "board" : t.layout === "stacked" || t.layout === "grid" ? t.layout : "single", a = (e) => typeof e == "number" && Number.isInteger(e) && e > 0 && e <= 6 ? e : void 0, o = a(t.rows), s = a(t.cols);
	return {
		version: 1,
		layout: i === "single" && n.length > 1 ? "stacked" : i,
		...r ? { rows_spec: r } : {},
		...t.background === "colour" ? { background: "colour" } : {},
		...o === void 0 ? {} : { rows: o },
		...s === void 0 ? {} : { cols: s },
		symbol_position: Zd.includes(t.symbol_position) ? t.symbol_position : null,
		sections: n
	};
}
function nf(e, t) {
	let n = ef(e).slice(0, 8).map((e) => {
		let t = $d(e) ?? {}, n = typeof t.cells == "number" ? Math.round(t.cells) : 1, r = typeof t.weight == "number" && t.weight > 0 ? Math.min(3, Math.max(.4, t.weight)) : void 0;
		return {
			cells: Math.max(1, Math.min(2, n)),
			...r === void 0 ? {} : { weight: r }
		};
	});
	return !n.length || n.reduce((e, t) => e + t.cells, 0) !== t ? null : n;
}
var rf = (e) => [...new Set(e.sections.flatMap((e) => e.symbols))];
function af(e, t, n) {
	let r = new Set(n.categories.map((e) => e.key)), i = (e) => e && r.has(e) ? e : void 0, a = n.categories[0]?.key ?? "prohibition", o = e.symbols.map((e) => t.get(e)).filter((e) => !!e), s = e.colour === Gd, c = (e.panels.length ? e.panels : [{ lines: [{ text: "" }] }]).map((e) => {
		let t = ou(), n = e.colour === "plain" || s && !e.colour, r = i(e.colour);
		return r && (t.category = r), n && (t.fill = { token: "background" }), t.blocks = e.lines.map((e) => {
			let t = au(e.text, e.style ?? "body");
			return e.bold === !1 && (t.variant = "regular"), e.min !== void 0 && t.size.mode === "auto" && (t.size.min = e.min), n && (t.colour = {
				...Kd,
				cmyk: [...Kd.cmyk]
			}), cd(t, e.caps === !0), t;
		}), t;
	}), l = {
		id: ru("section"),
		role: "section",
		orientation: "vertical",
		spacing: "auto",
		symbol_share: n.ratios.DEFAULT_SYMBOL_SHARE,
		symbol_frame: o.length ? {
			id: ru("symbol_frame"),
			role: "symbol_frame",
			spacing: "auto",
			align: "centre",
			symbols: o.map((e) => ({
				id: ru("symbol"),
				role: "symbol",
				symbol_code: e.code,
				category: e.category,
				source: e.source
			}))
		} : null,
		text_frame: {
			id: ru("text_frame"),
			role: "text_frame",
			spacing: "auto",
			panels: c
		}
	};
	return o.length || (l.category = i(e.colour) ?? i(e.panels[0]?.colour) ?? a), l;
}
function of(e, t, n, r) {
	let i = Ic({
		symbols: [],
		title: "",
		size: {
			width: t.width,
			height: t.height,
			catalogue_size_id: t.size_id
		},
		ruleset: r
	}), a = e.sections.map((e) => af(e, n, r));
	i.root.sections = a;
	let o = a.length;
	if (e.layout === "board" && e.rows_spec?.length) {
		let t = e.rows_spec, n = t.reduce((e, t) => e + t.cells, 0);
		for (; i.root.sections.length < n;) i.root.sections.push(iu(i.root.sections[i.root.sections.length - 1]));
		i.root.sections.length = n, i.root.layout = {
			type: "board",
			rows: t,
			gutter: "auto",
			sync_rows: !0,
			align_symbols: !1
		}, vu(i);
	} else if (e.layout === "grid" && o > 1) {
		let n = e.rows && e.cols && e.rows * e.cols === o ? e.rows : t.width >= t.height ? 1 : o;
		i.root.layout = {
			type: "grid",
			rows: n,
			cols: o / n,
			gutter: "auto",
			cell_outline: {
				width: "auto",
				layer: "artwork"
			},
			sync_text: !0,
			align_symbols: !0
		}, vu(i);
	} else i.root.layout = {
		type: "stack",
		direction: "vertical",
		spacing: "auto",
		align_symbols: !0
	}, o > 1 ? xu(i, "left") : vu(i);
	return e.symbol_position && xu(i, e.symbol_position), e.background === "colour" && kd(i, "colour", r.categories), i;
}
//#endregion
//#region editor/src/model/photo.ts
var sf = 1500, cf = .85, lf = (e) => /* @__PURE__ */ Error(/\.hei[cf]$/i.test(e) ? "iPhone HEIC photos can’t be read here. In Settings → Camera → Formats choose “Most Compatible”, or save the photo as JPEG first." : "That file couldn’t be read as a photo. JPEG or PNG works best.");
async function uf(e) {
	if (e.size > 26214400) throw Error("That photo is very large. Please use one under 25 MB.");
	if (e.type && !e.type.startsWith("image/")) throw lf(e.name);
	let t;
	try {
		t = await createImageBitmap(e, { imageOrientation: "from-image" });
	} catch {
		throw lf(e.name);
	}
	let n = Math.min(1, sf / Math.max(t.width, t.height)), r = Math.max(1, Math.round(t.width * n)), i = Math.max(1, Math.round(t.height * n)), a = document.createElement("canvas");
	a.width = r, a.height = i;
	let o = a.getContext("2d");
	if (!o) throw lf(e.name);
	o.fillStyle = "#ffffff", o.fillRect(0, 0, r, i), o.drawImage(t, 0, 0, r, i), t.close();
	let s = a.toDataURL("image/jpeg", cf);
	if (!s.startsWith("data:image/jpeg")) throw lf(e.name);
	return {
		dataUrl: s,
		width: r,
		height: i,
		bytes: Math.round((s.length - 23) * .75)
	};
}
//#endregion
//#region editor/src/model/tidy.ts
var df = .05, ff = .9, pf = 1.2, mf = 1.15;
function hf(e, t) {
	let { report: n } = Qs(e, t), r = n.sections.map((e) => e.k ?? 1), i = n.sections.flatMap((e) => e.blocks.map((e) => e.letter_height));
	return {
		ok: !n.findings.some((e) => e.severity === "error"),
		k: r.length ? Math.min(...r) : 1,
		mm: i.length ? Math.max(...i) : 0,
		share: e.root.sections[0]?.symbol_share ?? 0,
		lines: n.sections.reduce((e, t) => e + t.blocks.reduce((e, t) => e + t.lines, 0), 0)
	};
}
var gf = (e, t) => e.ok === t.ok ? Math.abs(e.k - t.k) > .001 ? e.k > t.k : e.lines === t.lines ? e.share > t.share : e.lines < t.lines : e.ok;
function _f(e) {
	let t = [];
	for (let n of e.root.sections) for (let e of n.text_frame.panels) {
		let n = e.blocks.filter((e) => e.text.trim() !== "");
		n.length && n.length !== e.blocks.length && (e.blocks = n, t.push("empty lines removed"));
		for (let n of e.blocks) n.y_offset !== 0 && (n.y_offset = 0, t.push("nudges reset")), n.line_spacing !== pd.default && (n.line_spacing = pd.default, t.push("line spacing reset"));
	}
	return [...new Set(t)];
}
var vf = (e) => e.root.sections.some((e) => (e.symbol_frame?.symbols.length ?? 0) > 0);
function yf(e, t) {
	if (!vf(e)) return [e];
	let { MIN_SYMBOL_SHARE: n, MAX_SYMBOL_SHARE: r } = t.ratios, i = [];
	for (let t of ["vertical", "horizontal"]) for (let a = n; a <= r + .001; a += df) {
		let n = structuredClone(e);
		for (let e of n.root.sections) e.orientation = t, e.symbol_share = Math.round(a * 100) / 100;
		i.push(n);
	}
	return i;
}
var bf = (e, t) => e.map((e) => ({
	doc: e,
	score: hf(e, t)
})).reduce((e, t) => gf(t.score, e.score) ? t : e), xf = (e) => "root" in e ? e.root.width * e.root.height : e.width * e.height;
function Sf(e, t, n, r) {
	if (r.k >= ff) return null;
	let i = null;
	for (let a of t) {
		if (a.width === e.root.width && a.height === e.root.height) continue;
		let t = structuredClone(e);
		if (t.root.width = a.width, t.root.height = a.height, t.catalogue_size_id = a.size_id, xf(a) > xf(e) * pf) continue;
		let o = bf(yf(t, n.ruleset), n).score;
		if (!o.ok || o.mm < r.mm * mf) continue;
		let s = Math.round((o.mm - r.mm) * 10) / 10;
		(!i || s > i.gain) && (i = {
			size: a,
			gain: s
		});
	}
	return i;
}
function Cf(e, t, n = []) {
	let r = hf(e, t), i = structuredClone(e), a = _f(i), o = bf(yf(i, t.ruleset), t), s = e.root.sections[0]?.orientation === "horizontal", c = o.doc.root.sections[0]?.orientation === "horizontal";
	vf(e) && s !== c && a.unshift(c ? "symbol moved beside the text" : "symbol moved above the text");
	let l = o.doc.root.sections[0]?.symbol_share ?? 0;
	return vf(e) && Math.abs(l - (e.root.sections[0]?.symbol_share ?? 0)) > .001 && a.push(`symbol size ${Math.round(l * 100)}%`), {
		doc: o.doc,
		outcome: {
			changed: a.length > 0 || JSON.stringify(o.doc.root) !== JSON.stringify(e.root),
			notes: a,
			before: Math.round(r.k * 100) / 100,
			after: Math.round(o.score.k * 100) / 100,
			suggestion: Sf(o.doc, n, t, o.score)
		}
	};
}
//#endregion
//#region editor/src/model/translation.ts
var wf = [
	{
		code: "pl",
		name: "Polish",
		native: "Polski"
	},
	{
		code: "ro",
		name: "Romanian",
		native: "Română"
	},
	{
		code: "lt",
		name: "Lithuanian",
		native: "Lietuvių"
	},
	{
		code: "lv",
		name: "Latvian",
		native: "Latviešu"
	},
	{
		code: "cy",
		name: "Welsh",
		native: "Cymraeg"
	},
	{
		code: "ga",
		name: "Irish",
		native: "Gaeilge"
	},
	{
		code: "pt",
		name: "Portuguese",
		native: "Português"
	},
	{
		code: "es",
		name: "Spanish",
		native: "Español"
	},
	{
		code: "fr",
		name: "French",
		native: "Français"
	},
	{
		code: "de",
		name: "German",
		native: "Deutsch"
	},
	{
		code: "it",
		name: "Italian",
		native: "Italiano"
	},
	{
		code: "nl",
		name: "Dutch",
		native: "Nederlands"
	},
	{
		code: "bg",
		name: "Bulgarian",
		native: "Български"
	},
	{
		code: "ru",
		name: "Russian",
		native: "Русский"
	},
	{
		code: "uk",
		name: "Ukrainian",
		native: "Українська"
	},
	{
		code: "sk",
		name: "Slovak",
		native: "Slovenčina"
	},
	{
		code: "cs",
		name: "Czech",
		native: "Čeština"
	},
	{
		code: "hu",
		name: "Hungarian",
		native: "Magyar"
	},
	{
		code: "hr",
		name: "Croatian",
		native: "Hrvatski"
	},
	{
		code: "sl",
		name: "Slovenian",
		native: "Slovenščina"
	},
	{
		code: "sq",
		name: "Albanian",
		native: "Shqip"
	},
	{
		code: "et",
		name: "Estonian",
		native: "Eesti"
	},
	{
		code: "el",
		name: "Greek",
		native: "Ελληνικά"
	},
	{
		code: "tr",
		name: "Turkish",
		native: "Türkçe"
	}
], Tf = (e) => wf.find((t) => t.code === e)?.name ?? e ?? "", Ef = "~t", Df = (e) => `${e}${Ef}`;
function Of(e) {
	let t = e.root.sections.find((e) => e.translation), n = t && e.root.sections.find((e) => e.id === t.translation.of);
	return t && n ? {
		source: n,
		target: t,
		meta: t.translation
	} : null;
}
var kf = (e) => Of(e) !== null, Af = (e) => e.root.sections.length === 1 && !kf(e), jf = (e) => e.text_frame.panels.flatMap((e) => e.blocks);
function Mf(e) {
	let t = e.root.layout;
	return t.type === "grid" && t.rows > 1 ? "stacked" : "side";
}
var Nf = (e) => e.root.width >= e.root.height ? "side" : "stacked";
function Pf(e, t) {
	let n = e.root.layout.align_symbols ?? !0;
	e.root.layout = {
		type: "grid",
		rows: t === "side" ? 1 : 2,
		cols: t === "side" ? 2 : 1,
		gutter: "auto",
		cell_outline: {
			width: "auto",
			layer: "artwork"
		},
		sync_text: !0,
		align_symbols: n
	}, vu(e);
}
function Ff(e, t, n, r) {
	let i = new Map(t ? jf(t).map((e) => [e.id, e.text]) : []), { translation: a, lang: o, ...s } = e, c = structuredClone(s), l = (e) => {
		if (Array.isArray(e)) e.forEach(l);
		else if (e && typeof e == "object") {
			let t = e;
			typeof t.id == "string" && typeof t.role == "string" && (t.id = Df(t.id));
			for (let [e, n] of Object.entries(t)) e !== "source" && l(n);
		}
	};
	l(c);
	let u = /* @__PURE__ */ new Set();
	for (let e of jf(c)) e.text = i.get(e.id) ?? "", u.add(e.id);
	let d = Object.fromEntries(Object.entries(n.lines).filter(([e]) => u.has(e)));
	return c.symbol_frame?.symbols.forEach((t, n) => {
		t.source = e.symbol_frame.symbols[n].source;
	}), {
		...c,
		lang: r,
		translation: {
			...n,
			lines: d
		}
	};
}
function If(e, t, n = Nf(e)) {
	if (!Af(e)) return;
	let r = e.root.sections[0], i = {
		of: r.id,
		checked: !1,
		machine: !1,
		lines: {}
	};
	e.root.sections.push(Ff(r, null, i, t)), Pf(e, n);
}
function Lf(e, t) {
	kf(e) && Pf(e, t);
}
function Rf(e, t) {
	let n = Of(e);
	if (n && n.target.lang !== t) {
		n.target.lang = t, n.meta.lines = {}, n.meta.checked = !1, n.meta.machine = !1;
		for (let e of jf(n.target)) e.text = "";
	}
}
function zf(e) {
	let t = e.root.sections, n = t.findIndex((e) => e.translation);
	if (n < 0) return;
	let r = t[n], i = t.find((e) => e.id === r.translation.of);
	if (!i) {
		delete r.translation;
		return;
	}
	t[n] = Ff(i, r, r.translation, r.lang ?? "en");
}
function Bf(e) {
	let t = Of(e);
	if (!t) return [];
	let n = new Map(jf(t.target).map((e) => [e.id, e]));
	return jf(t.source).map((e) => {
		let r = Df(e.id), i = t.meta.lines[r];
		return {
			id: r,
			sourceId: e.id,
			source: e.text,
			text: n.get(r)?.text ?? "",
			manual: i?.manual ?? !1,
			stale: !i || i.from !== e.text
		};
	});
}
function Vf(e, t = !1) {
	let n = Of(e);
	if (!n) return [];
	let r = [];
	for (let i of Bf(e)) if (t || i.stale && !i.manual) {
		if (!i.source.trim()) {
			Hf(n, i.id, "", "", !1);
			continue;
		}
		r.push({
			id: i.id,
			text: i.source
		});
	}
	return r;
}
function Hf(e, t, n, r, i) {
	let a = jf(e.target).find((e) => e.id === t);
	a && (a.text !== n && (e.meta.checked = !1), a.text = n, e.meta.lines[t] = {
		from: r,
		manual: i
	});
}
function Uf(e, t) {
	let n = Of(e);
	if (!n) return;
	let r = new Map(Bf(e).map((e) => [e.id, e]));
	for (let e of t) r.get(e.id)?.source === e.from && (Hf(n, e.id, e.text, e.from, !1), n.meta.machine = !0);
}
function Wf(e, t, n) {
	let r = Of(e), i = Bf(e).find((e) => e.id === t);
	r && i && Hf(r, t, n, i.source, !0);
}
function Gf(e, t) {
	let n = Of(e), r = Bf(e).find((e) => e.id === t);
	n && r && (n.meta.lines[t] = {
		from: r.source,
		manual: !0
	});
}
function Kf(e, t) {
	let n = Of(e);
	n && (n.meta.checked = t);
}
function qf(e) {
	let t = Of(e);
	if (!t) return !0;
	let n = Bf(e);
	return t.meta.checked && n.every((e) => !e.stale && (e.text.trim() !== "" || e.source.trim() === ""));
}
function Jf(e, t) {
	let n = Of(e);
	n && (n.meta.lines[t] = {
		from: "",
		manual: !1
	});
}
function Yf(e) {
	let t = Of(e);
	if (!t) return !1;
	let n = e.root.sections;
	return n.indexOf(t.target) < n.indexOf(t.source);
}
function Xf(e, t) {
	let n = Of(e);
	n && (e.root.sections = t ? [n.target, n.source] : [n.source, n.target]);
}
//#endregion
//#region editor/src/model/product.ts
var Zf = "", Qf = {
	directional: ["ARL-L"],
	prohibition: ["P002"],
	warning: ["W001"],
	mandatory: ["M001"],
	fire_emergency: ["E001"],
	fire: ["F001"]
}, $f = (e) => e.replace(/\b([a-z])/g, (e) => e.toUpperCase());
function ep(e, t, n) {
	let r = new URLSearchParams(e), i = Ml?.product, a = i?.kind === "standard" ? "" : i?.kind || Zf || r.get("product") || "", o = r.get("type") ?? "prohibition", s = a === "board", c = a === "roadsign", l = a === "bilingual", u = r.get("lang"), d = i?.category ?? (c ? "directional" : o), f = t.find((e) => e.key === d), p = f ? f.key : null, m = n.filter((e) => !p || e.category === p), h = (Qf[p ?? "prohibition"] ?? []).find((e) => m.some((t) => t.code === e)), g = l ? "Two-Language " : "";
	return {
		type: c ? "roadsign" : s ? "board" : f ? f.key : "combination",
		heading: i?.heading ? i.heading : c ? "Temporary Site Sign" : s ? "Site Safety Board" : f ? `Custom ${g}${$f(f.title)} Sign` : l ? "Custom Two-Language Sign" : "Custom Combination Sign",
		category: p,
		defaultSymbol: i?.symbol ?? h ?? m[0]?.code ?? n[0]?.code ?? null,
		bilingual: l,
		language: wf.find((e) => e.code === (i?.language ?? u))?.code ?? wf[0].code,
		board: s,
		roadsign: c
	};
}
//#endregion
//#region editor/src/model/signModel.ts
var tp = (e) => e.symbol_position === "left" ? "horizontal" : "vertical";
function np(e, t, n, r, i) {
	let a = Ic({
		symbols: [{
			symbol_code: t.code,
			category: t.category,
			source: t.source
		}],
		title: n,
		body: r || " ",
		size: {
			width: e.width,
			height: e.height,
			catalogue_size_id: e.size_id
		},
		orientation: tp(e),
		ruleset: i
	});
	return r || (ip(a, "subtitle").text = ""), a;
}
var rp = Fd;
function ip(e, t) {
	let n = rp(e).text_frame.panels[0].blocks;
	return t === "title" ? n[0] : n[1];
}
function ap(e, t) {
	if (e.root.width = t.width, e.root.height = t.height, e.catalogue_size_id = t.size_id, mu(e)) vu(e);
	else for (let n of e.root.sections) n.orientation = tp(t);
}
function op(e, t) {
	let n = rp(e).symbol_frame;
	if (!n) return;
	let r = n.symbols[0];
	n.symbols[0] = {
		...r,
		symbol_code: t.code,
		category: t.category,
		source: t.source
	};
}
var sp = (e) => rp(e).symbol_frame?.symbols[0]?.symbol_code;
function cp(e, t, n) {
	ip(e, t).text = n;
}
function lp(e, t, n) {
	ip(e, t).align = n;
}
var up = (e, t, n) => cd(ip(e, t), n), dp = (e, t) => yd(ip(e, t)), fp = (e, t, n) => bd(ip(e, t), n);
//#endregion
//#region node_modules/dompurify/dist/purify.es.mjs
function pp(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function mp(e) {
	if (Array.isArray(e)) return e;
}
function hp(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t !== 0) for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function gp() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _p(e, t) {
	return mp(e) || hp(e, t) || vp(e, t) || gp();
}
function vp(e, t) {
	if (e) {
		if (typeof e == "string") return pp(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? pp(e, t) : void 0;
	}
}
var yp = Object.entries, bp = Object.setPrototypeOf, xp = Object.isFrozen, Sp = Object.getPrototypeOf, Cp = Object.getOwnPropertyDescriptor, wp = Object.freeze, Tp = Object.seal, Ep = Object.create, Dp = typeof Reflect < "u" && Reflect, Op = Dp.apply, kp = Dp.construct;
wp ||= function(e) {
	return e;
}, Tp ||= function(e) {
	return e;
}, Op ||= function(e, t) {
	var n = [...arguments].slice(2);
	return e.apply(t, n);
}, kp ||= function(e) {
	return new e(...[...arguments].slice(1));
};
var Ap = Xp(Array.prototype.forEach), jp = Xp(Array.prototype.lastIndexOf), Mp = Xp(Array.prototype.pop), Np = Xp(Array.prototype.push), Pp = Xp(Array.prototype.splice), Fp = Array.isArray, Ip = Xp(String.prototype.toLowerCase), Lp = Xp(String.prototype.toString), Rp = Xp(String.prototype.match), zp = Xp(String.prototype.replace), Bp = Xp(String.prototype.indexOf), Vp = Xp(String.prototype.trim), Hp = Xp(Number.prototype.toString), Up = Xp(Boolean.prototype.toString), Wp = typeof BigInt > "u" ? null : Xp(BigInt.prototype.toString), Gp = typeof Symbol > "u" ? null : Xp(Symbol.prototype.toString), Kp = Xp(Object.prototype.hasOwnProperty), qp = Xp(Object.prototype.toString), Jp = Xp(RegExp.prototype.test), Yp = Zp(TypeError);
function Xp(e) {
	return function(t) {
		t instanceof RegExp && (t.lastIndex = 0);
		var n = [...arguments].slice(1);
		return Op(e, t, n);
	};
}
function Zp(e) {
	return function() {
		return kp(e, [...arguments]);
	};
}
function Q(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ip;
	if (bp && bp(e, null), !Fp(t)) return e;
	let r = t.length;
	for (; r--;) {
		let i = t[r];
		if (typeof i == "string") {
			let e = n(i);
			e !== i && (xp(t) || (t[r] = e), i = e);
		}
		e[i] = !0;
	}
	return e;
}
function Qp(e) {
	for (let t = 0; t < e.length; t++) Kp(e, t) || (e[t] = null);
	return e;
}
function $p(e) {
	let t = Ep(null);
	for (let r of yp(e)) {
		var n = _p(r, 2);
		let i = n[0], a = n[1];
		Kp(e, i) && (t[i] = Fp(a) ? Qp(a) : a && typeof a == "object" && a.constructor === Object ? $p(a) : a);
	}
	return t;
}
function em(e) {
	switch (typeof e) {
		case "string": return e;
		case "number": return Hp(e);
		case "boolean": return Up(e);
		case "bigint": return Wp ? Wp(e) : "0";
		case "symbol": return Gp ? Gp(e) : "Symbol()";
		case "undefined": return qp(e);
		case "function":
		case "object": {
			if (e === null) return qp(e);
			let t = e, n = tm(t, "toString");
			if (typeof n == "function") {
				let e = n(t);
				return typeof e == "string" ? e : qp(e);
			}
			return qp(e);
		}
		default: return qp(e);
	}
}
function tm(e, t) {
	for (; e !== null;) {
		let n = Cp(e, t);
		if (n) {
			if (n.get) return Xp(n.get);
			if (typeof n.value == "function") return Xp(n.value);
		}
		e = Sp(e);
	}
	function n() {
		return null;
	}
	return n;
}
function nm(e) {
	try {
		return Jp(e, ""), !0;
	} catch {
		return !1;
	}
}
var rm = wp(/* @__PURE__ */ "a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr".split(".")), im = wp(/* @__PURE__ */ "svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern".split(".")), am = wp([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]), om = wp([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]), sm = wp(/* @__PURE__ */ "math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts".split(".")), cm = wp([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]), lm = wp(["#text"]), um = wp(/* @__PURE__ */ "accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns".split(".")), dm = wp(/* @__PURE__ */ "accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.pointer-events.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.vector-effect.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan".split(".")), fm = wp(/* @__PURE__ */ "accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns".split(".")), pm = wp([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]), mm = Tp(/{{[\w\W]*|^[\w\W]*}}/g), hm = Tp(/<%[\w\W]*|^[\w\W]*%>/g), gm = Tp(/\${[\w\W]*/g), _m = Tp(/^data-[\-\w.\u00B7-\uFFFF]+$/), vm = Tp(/^aria-[\-\w]+$/), ym = Tp(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), bm = Tp(/^(?:\w+script|data):/i), xm = Tp(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), Sm = Tp(/^html$/i), Cm = Tp(/^[a-z][.\w]*(-[.\w]+)+$/i), wm = Tp(/<[/\w!]/g), Tm = Tp(/<[/\w]/g), Em = Tp(/<\/no(script|embed|frames)/i), Dm = Tp(/\/>/i), Om = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	processingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
}, km = [
	"style",
	"script",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext",
	"noscript"
], Am = wp(Q({}, km)), jm = function() {
	let e = {};
	return Ap(km, (t) => {
		e[t] = Tp(RegExp("</" + t + "(?=[\\t\\n\\f\\r />])", "i"));
	}), wp(e);
}(), Mm = function() {
	return typeof window > "u" ? null : window;
}, Nm = function(e, t) {
	if (typeof e != "object" || typeof e.createPolicy != "function") return null;
	let n = null, r = "data-tt-policy-suffix";
	t && t.hasAttribute(r) && (n = t.getAttribute(r));
	let i = "dompurify" + (n ? "#" + n : "");
	try {
		return e.createPolicy(i, {
			createHTML(e) {
				return e;
			},
			createScriptURL(e) {
				return e;
			}
		});
	} catch {
		return console.warn("TrustedTypes policy " + i + " could not be created."), null;
	}
}, Pm = function() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
}, Fm = function(e, t, n, r) {
	return Kp(e, t) && Fp(e[t]) ? Q(r.base ? $p(r.base) : {}, e[t], r.transform) : n;
}, Im = function(e, t, n) {
	let r = Kp(e, t) ? e[t] : void 0;
	return r && typeof r == "object" ? $p(r) : n();
};
function Lm() {
	let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Mm(), t = (e) => Lm(e);
	if (t.version = "3.4.15", t.removed = [], !e || !e.document || e.document.nodeType !== Om.document || !e.Element) return t.isSupported = !1, t;
	let n = e.document, r = n, i = r.currentScript;
	e.DocumentFragment;
	let a = e.HTMLTemplateElement, o = e.Node, s = e.Element, c = e.NodeFilter;
	e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
	let l = e.DOMParser, u = e.trustedTypes, d = s.prototype, f = tm(d, "cloneNode"), p = tm(d, "remove"), m = tm(d, "removeAttributeNode"), h = tm(d, "nextSibling"), g = tm(d, "childNodes"), _ = tm(d, "parentNode"), v = tm(d, "shadowRoot"), y = tm(d, "attributes"), b = o && o.prototype ? tm(o.prototype, "nodeType") : null, x = o && o.prototype ? tm(o.prototype, "nodeName") : null, S = o && o.prototype ? tm(o.prototype, "ownerDocument") : null, C = function(e) {
		return b ? b(e) : e.nodeType;
	}, w = function(e) {
		return x ? x(e) : e.nodeName;
	};
	if (typeof a == "function") {
		let e = n.createElement("template");
		e.content && e.content.ownerDocument && (n = e.content.ownerDocument);
	}
	let T, E = "", ee, te = !1, D = 0, ne = function() {
		if (D > 0) throw Yp("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
	}, re = function(e) {
		ne(), D++;
		try {
			return T.createHTML(e);
		} finally {
			D--;
		}
	}, ie = function(e) {
		ne(), D++;
		try {
			return T.createScriptURL(e);
		} finally {
			D--;
		}
	}, ae = function() {
		return te ||= (ee = Nm(u, i), !0), ee;
	}, oe = n, O = oe.implementation, se = oe.createNodeIterator, ce = oe.createDocumentFragment, le = oe.getElementsByTagName, ue = r.importNode, k = Pm();
	t.isSupported = typeof yp == "function" && typeof _ == "function" && O && O.createHTMLDocument !== void 0;
	let de = mm, fe = hm, pe = gm, me = _m, he = vm, ge = bm, _e = xm, ve = Cm, ye = ym, A = null, be = Q({}, [
		...rm,
		...im,
		...am,
		...sm,
		...lm
	]), j = null, xe = Q({}, [
		...um,
		...dm,
		...fm,
		...pm
	]), Se = Object.seal(Ep(null, {
		tagNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: !1
		}
	})), M = null, Ce = null, we = Object.seal(Ep(null, {
		tagCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		}
	})), Te = !0, Ee = !0, De = !1, N = !0, Oe = !1, ke = !0, Ae = !1, je = !1, Me = null, Ne = null, Pe = !1, Fe = !1, Ie = !1, Le = !1, Re = !0, ze = !1, Be = "user-content-", Ve = !0, He = !1, Ue = {}, We = null, Ge = Q({}, /* @__PURE__ */ "annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp".split(".")), Ke = null, qe = Q({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]), Je = null, Ye = Q({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]), Xe = "http://www.w3.org/1998/Math/MathML", Ze = "http://www.w3.org/2000/svg", Qe = "http://www.w3.org/1999/xhtml", $e = Qe, et = !1, tt = null, nt = Q({}, [
		Xe,
		Ze,
		Qe
	], Lp), rt = wp([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]), it = Q({}, rt), at = wp(["annotation-xml"]), ot = Q({}, at), st = Q({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]), ct = null, lt = ["application/xhtml+xml", "text/html"], P = null, ut = null, dt = n.createElement("form"), ft = function(e) {
		return e instanceof RegExp || e instanceof Function;
	}, pt = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (ut && ut === e) return;
		(!e || typeof e != "object") && (e = {}), e = $p(e), ct = lt.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? "text/html" : e.PARSER_MEDIA_TYPE, P = ct === "application/xhtml+xml" ? Lp : Ip, A = Fm(e, "ALLOWED_TAGS", be, { transform: P }), j = Fm(e, "ALLOWED_ATTR", xe, { transform: P }), tt = Fm(e, "ALLOWED_NAMESPACES", nt, { transform: Lp }), Je = Fm(e, "ADD_URI_SAFE_ATTR", Ye, {
			transform: P,
			base: Ye
		}), Ke = Fm(e, "ADD_DATA_URI_TAGS", qe, {
			transform: P,
			base: qe
		}), We = Fm(e, "FORBID_CONTENTS", Ge, { transform: P }), M = Fm(e, "FORBID_TAGS", $p({}), { transform: P }), Ce = Fm(e, "FORBID_ATTR", $p({}), { transform: P }), Ue = Kp(e, "USE_PROFILES") ? e.USE_PROFILES && typeof e.USE_PROFILES == "object" ? $p(e.USE_PROFILES) : e.USE_PROFILES : !1, Te = e.ALLOW_ARIA_ATTR !== !1, Ee = e.ALLOW_DATA_ATTR !== !1, De = e.ALLOW_UNKNOWN_PROTOCOLS || !1, N = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Oe = e.SAFE_FOR_TEMPLATES || !1, ke = e.SAFE_FOR_XML !== !1, Ae = e.WHOLE_DOCUMENT || !1, Fe = e.RETURN_DOM || !1, Ie = e.RETURN_DOM_FRAGMENT || !1, Le = e.RETURN_TRUSTED_TYPE || !1, Pe = e.FORCE_BODY || !1, Re = e.SANITIZE_DOM !== !1, ze = e.SANITIZE_NAMED_PROPS || !1, Ve = e.KEEP_CONTENT !== !1, He = e.IN_PLACE || !1, ye = nm(e.ALLOWED_URI_REGEXP) ? e.ALLOWED_URI_REGEXP : ym, $e = typeof e.NAMESPACE == "string" ? e.NAMESPACE : Qe, it = Im(e, "MATHML_TEXT_INTEGRATION_POINTS", () => Q({}, rt)), ot = Im(e, "HTML_INTEGRATION_POINTS", () => Q({}, at));
		let t = Im(e, "CUSTOM_ELEMENT_HANDLING", () => Ep(null));
		if (Se = Ep(null), Kp(t, "tagNameCheck") && ft(t.tagNameCheck) && (Se.tagNameCheck = t.tagNameCheck), Kp(t, "attributeNameCheck") && ft(t.attributeNameCheck) && (Se.attributeNameCheck = t.attributeNameCheck), Kp(t, "allowCustomizedBuiltInElements") && typeof t.allowCustomizedBuiltInElements == "boolean" && (Se.allowCustomizedBuiltInElements = t.allowCustomizedBuiltInElements), Tp(Se), Oe && (Ee = !1), Ie && (Fe = !0), Ue && (A = Q({}, lm), j = Ep(null), Ue.html === !0 && (Q(A, rm), Q(j, um)), Ue.svg === !0 && (Q(A, im), Q(j, dm), Q(j, pm)), Ue.svgFilters === !0 && (Q(A, am), Q(j, dm), Q(j, pm)), Ue.mathMl === !0 && (Q(A, sm), Q(j, fm), Q(j, pm))), we.tagCheck = null, we.attributeCheck = null, Kp(e, "ADD_TAGS") && (typeof e.ADD_TAGS == "function" ? we.tagCheck = e.ADD_TAGS : Fp(e.ADD_TAGS) && (A === be && (A = $p(A)), Q(A, e.ADD_TAGS, P))), Kp(e, "ADD_ATTR") && (typeof e.ADD_ATTR == "function" ? we.attributeCheck = e.ADD_ATTR : Fp(e.ADD_ATTR) && (j === xe && (j = $p(j)), Q(j, e.ADD_ATTR, P))), Kp(e, "ADD_FORBID_CONTENTS") && Fp(e.ADD_FORBID_CONTENTS) && (We === Ge && (We = $p(We)), Q(We, e.ADD_FORBID_CONTENTS, P)), Ve && (A["#text"] = !0), Ae && Q(A, [
			"html",
			"head",
			"body"
		]), A.table && (Q(A, ["tbody"]), delete M.tbody), e.TRUSTED_TYPES_POLICY) {
			if (typeof e.TRUSTED_TYPES_POLICY.createHTML != "function") throw Yp("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw Yp("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			let t = T;
			T = e.TRUSTED_TYPES_POLICY;
			try {
				E = re("");
			} catch (e) {
				throw T = t, e;
			}
		} else e.TRUSTED_TYPES_POLICY === null ? (T = void 0, E = "") : (T === void 0 && (T = ae()), T && typeof E == "string" && (E = re("")));
		wp && wp(e), ut = e;
	}, mt = Q({}, [
		...im,
		...am,
		...om
	]), ht = Q({}, [...sm, ...cm]), gt = function(e, t, n) {
		return t.namespaceURI === Qe ? e === "svg" : t.namespaceURI === Xe ? e === "svg" && (n === "annotation-xml" || it[n]) : !!mt[e];
	}, _t = function(e, t, n) {
		return t.namespaceURI === Qe ? e === "math" : t.namespaceURI === Ze ? e === "math" && ot[n] : !!ht[e];
	}, vt = function(e, t, n) {
		return t.namespaceURI === Ze && !ot[n] || t.namespaceURI === Xe && !it[n] ? !1 : !ht[e] && (st[e] || !mt[e]);
	}, yt = function(e) {
		let t = _(e);
		(!t || !t.tagName) && (t = {
			namespaceURI: $e,
			tagName: "template"
		});
		let n = Ip(e.tagName), r = Ip(t.tagName);
		return tt[e.namespaceURI] ? e.namespaceURI === Ze ? gt(n, t, r) : e.namespaceURI === Xe ? _t(n, t, r) : e.namespaceURI === Qe ? vt(n, t, r) : !!(ct === "application/xhtml+xml" && tt[e.namespaceURI]) : !1;
	}, bt = function(e) {
		Np(t.removed, { element: e });
		try {
			_(e).removeChild(e);
		} catch {
			if (p(e), !_(e)) throw Yp("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	}, xt = function(e, t, n) {
		try {
			m(e, t);
		} catch {
			try {
				e.removeAttribute(n);
			} catch {}
		}
	}, St = function(e) {
		Tt(e);
		let t = g(e);
		if (t) {
			let e = [];
			Ap(t, (t) => {
				Np(e, t);
			}), Ap(e, (e) => {
				try {
					p(e);
				} catch {}
			});
		}
		let n = y(e);
		if (n) for (let t = n.length - 1; t >= 0; --t) {
			let r = n[t], i = r && r.name;
			typeof i == "string" && xt(e, r, i);
		}
	}, Ct = function(e, n, r) {
		if (!r) try {
			r = n.getAttributeNode(e);
		} catch {
			r = null;
		}
		Np(t.removed, {
			attribute: r || null,
			from: n
		});
		try {
			r ? m(n, r) : n.removeAttribute(e);
		} catch {
			try {
				n.removeAttribute(e);
			} catch {}
		}
		if (e === "is") {
			if (Fe || Ie) try {
				bt(n);
			} catch {}
			else try {
				n.setAttribute(e, "");
			} catch {}
		}
	}, wt = function(e) {
		let t = y(e);
		if (t) for (let n = t.length - 1; n >= 0; --n) {
			let r = t[n], i = r && r.name;
			typeof i != "string" || j[P(i)] || xt(e, r, i);
		}
	}, Tt = function(e) {
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop();
			C(e) === Om.element && wt(e);
			let n = g(e);
			if (n) for (let e = n.length - 1; e >= 0; --e) t.push(n[e]);
		}
	}, Et = function(e, t) {
		return ke ? e === "patchsrc" || e === "for" && t !== "label" && t !== "output" : !1;
	}, Dt = function(e) {
		if (!ke) return;
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop(), n = C(e);
			if (n === Om.processingInstruction || n === Om.comment && Jp(Tm, e.data)) {
				try {
					p(e);
				} catch {}
				continue;
			}
			if (n === Om.element) {
				let t = e, n = P(w(e));
				try {
					t.hasAttribute && t.hasAttribute("patchsrc") && t.removeAttribute("patchsrc"), t.hasAttribute && t.hasAttribute("for") && Et("for", n) && t.removeAttribute("for");
				} catch {}
			}
			let r = g(e);
			if (r) for (let e = r.length - 1; e >= 0; --e) t.push(r[e]);
		}
	}, Ot = function(e) {
		let t = null, r = null;
		if (Pe) e = "<remove></remove>" + e;
		else {
			let t = Rp(e, /^[\r\n\t ]+/);
			r = t && t[0];
		}
		ct === "application/xhtml+xml" && $e === Qe && (e = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + e + "</body></html>");
		let i = T ? re(e) : e;
		if ($e === Qe) try {
			t = new l().parseFromString(i, ct);
		} catch {}
		if (!t || !t.documentElement) {
			t = O.createDocument($e, "template", null);
			try {
				t.documentElement.innerHTML = et ? E : i;
			} catch {}
		}
		let a = t.body || t.documentElement;
		return e && r && a.insertBefore(n.createTextNode(r), a.childNodes[0] || null), $e === Qe ? le.call(t, Ae ? "html" : "body")[0] : Ae ? t.documentElement : a;
	}, kt = function(e) {
		let t = S ? S(e) : e.ownerDocument;
		return se.call(t || e, e, c.SHOW_ELEMENT | c.SHOW_COMMENT | c.SHOW_TEXT | c.SHOW_PROCESSING_INSTRUCTION | c.SHOW_CDATA_SECTION, null);
	}, At = function(e) {
		return e = zp(e, de, " "), e = zp(e, fe, " "), e = zp(e, pe, " "), e;
	}, jt = function(e) {
		e.normalize();
		let t = S ? S(e) : e.ownerDocument, n = se.call(t || e, e, c.SHOW_TEXT | c.SHOW_COMMENT | c.SHOW_CDATA_SECTION | c.SHOW_PROCESSING_INSTRUCTION, null), r = n.nextNode();
		for (; r;) r.data = At(r.data), r = n.nextNode();
		let i = e.querySelectorAll?.call(e, "template");
		i && Ap(i, (e) => {
			Nt(e.content) && jt(e.content);
		});
	}, Mt = function(e) {
		let t = x ? x(e) : null;
		return typeof t != "string" || P(t) !== "form" ? !1 : typeof e.nodeName != "string" || typeof e.textContent != "string" || typeof e.removeChild != "function" || e.attributes !== y(e) || typeof e.removeAttribute != "function" || typeof e.removeAttributeNode != "function" || typeof e.getAttributeNode != "function" || typeof e.setAttribute != "function" || typeof e.namespaceURI != "string" || typeof e.insertBefore != "function" || typeof e.hasChildNodes != "function" || e.nodeType !== b(e) || e.childNodes !== g(e);
	}, Nt = function(e) {
		if (!b || typeof e != "object" || !e) return !1;
		try {
			return b(e) === Om.documentFragment;
		} catch {
			return !1;
		}
	}, Pt = function(e) {
		if (!b || typeof e != "object" || !e) return !1;
		try {
			return typeof b(e) == "number";
		} catch {
			return !1;
		}
	};
	function Ft(e, n, r) {
		e.length !== 0 && Ap(e, (e) => {
			e.call(t, n, r, ut);
		});
	}
	let It = function(e, t) {
		return !!(ke && e.hasChildNodes() && !Pt(e.firstElementChild) && Jp(wm, e.textContent) && Jp(wm, e.innerHTML) || ke && e.namespaceURI === Qe && Am[t] && (Pt(e.firstElementChild) || typeof e.textContent == "string" && Jp(jm[t], e.textContent)) || e.nodeType === Om.processingInstruction || ke && e.nodeType === Om.comment && Jp(Tm, e.data));
	}, Lt = function(e, t) {
		return e instanceof RegExp ? Jp(e, t) : e instanceof Function && !!e(t, ...[...arguments].slice(2));
	}, Rt = function(e, t, n) {
		if (!M[t] && Ut(t) && Lt(Se.tagNameCheck, t)) return !1;
		if (Ve && !We[t]) {
			let t = _(e), r = g(e);
			if (r && t) {
				let i = r.length;
				for (let a = i - 1; a >= 0; --a) {
					let i = e === n ? f(r[a], !0) : r[a];
					t.insertBefore(i, h(e));
				}
			}
		}
		return bt(e), !0;
	}, zt = function(e, t, n, r) {
		return e.length === 0 ? t : t === n || t === r ? $p(t) : t;
	}, Bt = function(e, t) {
		return e === t || _(e) !== null ? !1 : (He && Tt(e), !0);
	}, Vt = function(e, n) {
		if (Ft(k.beforeSanitizeElements, e, null), Bt(e, n)) return !0;
		if (Mt(e)) return bt(e), !0;
		let r = P(w(e));
		if (A = zt(k.uponSanitizeElement, A, be, Me), Ft(k.uponSanitizeElement, e, {
			tagName: r,
			allowedTags: A
		}), Bt(e, n)) return !0;
		if (It(e, r)) return bt(e), !0;
		if (M[r] || !(we.tagCheck instanceof Function && we.tagCheck(r)) && !A[r]) {
			let t = Rt(e, r, n);
			return t === !1 && Ft(k.afterSanitizeElements, e, null), t;
		}
		if (C(e) === Om.element && !yt(e) || (r === "noscript" || r === "noembed" || r === "noframes") && Jp(Em, e.innerHTML)) return bt(e), !0;
		if (Oe && e.nodeType === Om.text) {
			let n = At(e.textContent);
			e.textContent !== n && (Np(t.removed, { element: e.cloneNode() }), e.textContent = n);
		}
		return Ft(k.afterSanitizeElements, e, null), !1;
	}, Ht = function(e, t, r) {
		if (Ce[t] || Et(t, e) || Re && (t === "id" || t === "name") && (r in n || r in dt)) return !1;
		let i = j[t] || we.attributeCheck instanceof Function && we.attributeCheck(t, e);
		return Ee && Jp(me, t) || Te && Jp(he, t) ? !0 : i ? Je[t] || Jp(ye, zp(r, _e, "")) || (t === "src" || t === "xlink:href" || t === "href") && e !== "script" && Bp(r, "data:") === 0 && Ke[e] || De && !Jp(ge, zp(r, _e, "")) ? !0 : !r : Ut(e) && Lt(Se.tagNameCheck, e) && Lt(Se.attributeNameCheck, t, e) || t === "is" && Se.allowCustomizedBuiltInElements && Lt(Se.tagNameCheck, r);
	}, F = Q({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]), Ut = function(e) {
		return !F[Ip(e)] && Jp(ve, e);
	}, Wt = function(e, t, n, r) {
		if (T && typeof u == "object" && typeof u.getAttributeType == "function" && !n) switch (u.getAttributeType(e, t)) {
			case "TrustedHTML": return re(r);
			case "TrustedScriptURL": return ie(r);
		}
		return r;
	}, Gt = function(e, t, n, r) {
		try {
			return n ? e.setAttributeNS(n, t, r) : e.setAttribute(t, r), !Mt(e) || (bt(e), !1);
		} catch {
			return Ct(t, e), !1;
		}
	}, Kt = function(e) {
		Ft(k.beforeSanitizeAttributes, e, null);
		let n = e.attributes;
		if (!n || Mt(e)) return;
		j = zt(k.uponSanitizeAttribute, j, xe, Ne);
		let r = {
			attrName: "",
			attrValue: "",
			keepAttr: !0,
			allowedAttributes: j,
			forceKeepAttr: void 0
		}, i = n.length, a = P(e.nodeName);
		for (; i--;) {
			let o = n[i], s = o.name, c = o.namespaceURI, l = o.value, u = P(s), d = l, f = s === "value" ? d : Vp(d), p = !1;
			if (r.attrName = u, r.attrValue = f, r.keepAttr = !0, r.forceKeepAttr = void 0, Ft(k.uponSanitizeAttribute, e, r), f = r.attrValue, ze && (u === "id" || u === "name") && Bp(f, Be) !== 0 && (Ct(s, e, o), f = Be + f, p = !0), ke && Jp(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, f)) {
				Ct(s, e, o);
				continue;
			}
			if (u === "attributename" && Rp(f, "href")) {
				Ct(s, e, o);
				continue;
			}
			if (!r.forceKeepAttr) {
				if (!r.keepAttr) {
					Ct(s, e, o);
					continue;
				}
				if (!N && Jp(Dm, f)) {
					Ct(s, e, o);
					continue;
				}
				if (Oe && (f = At(f)), !Ht(a, u, f)) {
					Ct(s, e, o);
					continue;
				}
				f = Wt(a, u, c, f), f !== d && Gt(e, s, c, f) && p && Mp(t.removed);
			}
		}
		Ft(k.afterSanitizeAttributes, e, null);
	}, I = function(e) {
		let t = null, n = kt(e);
		for (Ft(k.beforeSanitizeShadowDOM, e, null); t = n.nextNode();) if (Ft(k.uponSanitizeShadowNode, t, null), Vt(t, e), Kt(t), Nt(t.content) && I(t.content), C(t) === Om.element) {
			let e = v(t);
			Nt(e) && (qt(e), I(e));
		}
		Ft(k.afterSanitizeShadowDOM, e, null);
	}, qt = function(e) {
		let t = [{
			node: e,
			shadow: null
		}];
		for (; t.length > 0;) {
			let e = t.pop();
			if (e.shadow) {
				I(e.shadow);
				continue;
			}
			let n = e.node, r = C(n) === Om.element, i = g(n);
			if (i) for (let e = i.length - 1; e >= 0; --e) t.push({
				node: i[e],
				shadow: null
			});
			if (r) {
				let e = x ? x(n) : null;
				if (typeof e == "string" && P(e) === "template") {
					let e = n.content;
					Nt(e) && t.push({
						node: e,
						shadow: null
					});
				}
			}
			if (r) {
				let e = v(n);
				Nt(e) && t.push({
					node: null,
					shadow: e
				}, {
					node: e,
					shadow: null
				});
			}
		}
	};
	return t.sanitize = function(e) {
		let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = null, a = null, o = null, s = null;
		if (et = !e, et && (e = "<!-->"), typeof e != "string" && !Pt(e) && (e = em(e), typeof e != "string")) throw Yp("dirty is not a string, aborting");
		if (!t.isSupported) return e;
		je ? (A = Me, j = Ne) : pt(n), (k.uponSanitizeElement.length > 0 || k.uponSanitizeAttribute.length > 0) && (A = $p(A)), k.uponSanitizeAttribute.length > 0 && (j = $p(j)), t.removed = [];
		let c = He && typeof e != "string" && Pt(e);
		if (c) {
			Dt(e);
			let t = w(e);
			if (typeof t == "string") {
				let n = P(t);
				if (!A[n] || M[n]) throw St(e), Yp("root node is forbidden and cannot be sanitized in-place");
			}
			if (Mt(e)) throw St(e), Yp("root node is clobbered and cannot be sanitized in-place");
			try {
				qt(e);
			} catch (t) {
				throw St(e), t;
			}
		} else if (Pt(e)) i = Ot("<!---->"), a = i.ownerDocument.importNode(e, !0), a.nodeType === Om.element && a.nodeName === "BODY" || a.nodeName === "HTML" ? i = a : i.appendChild(a), qt(i);
		else {
			if (!Fe && !Oe && !Ae && e.indexOf("<") === -1) return T && Le ? re(e) : e;
			if (i = Ot(e), !i) return Fe ? null : Le ? E : "";
		}
		i && Pe && bt(i.firstChild);
		let l = c ? e : i;
		try {
			let e = kt(l);
			for (; o = e.nextNode();) Vt(o, l), Kt(o), Nt(o.content) && I(o.content);
		} catch (n) {
			throw c && (St(e), Ap(t.removed, (e) => {
				e.element && Tt(e.element);
			})), n;
		}
		if (c) return Ap(t.removed, (e) => {
			e.element && Tt(e.element);
		}), Oe && jt(e), e;
		if (Fe) {
			if (Oe && jt(i), Ie) for (s = ce.call(i.ownerDocument); i.firstChild;) s.appendChild(i.firstChild);
			else s = i;
			return (j.shadowroot || j.shadowrootmode) && (s = ue.call(r, s, !0)), s;
		}
		let u = Ae ? i.outerHTML : i.innerHTML;
		return Ae && A["!doctype"] && i.ownerDocument && i.ownerDocument.doctype && i.ownerDocument.doctype.name && Jp(Sm, i.ownerDocument.doctype.name) && (u = "<!DOCTYPE " + i.ownerDocument.doctype.name + ">\n" + u), Oe && (u = At(u)), T && Le ? re(u) : u;
	}, t.setConfig = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		pt(e), je = !0, Me = A, Ne = j;
	}, t.clearConfig = function() {
		ut = null, je = !1, Me = null, Ne = null, T = ee, E = "";
	}, t.isValidAttribute = function(e, t, n) {
		ut || pt({});
		let r = P(e), i = P(t);
		return Ht(r, i, n);
	}, t.addHook = function(e, t) {
		typeof t == "function" && Kp(k, e) && Np(k[e], t);
	}, t.removeHook = function(e, t) {
		if (Kp(k, e)) {
			if (t !== void 0) {
				let n = jp(k[e], t);
				return n === -1 ? void 0 : Pp(k[e], n, 1)[0];
			}
			return Mp(k[e]);
		}
	}, t.removeHooks = function(e) {
		Kp(k, e) && (k[e] = []);
	}, t.removeAllHooks = function() {
		k = Pm();
	}, t;
}
var Rm = Lm(), zm = (e) => Rm.sanitize(e, {
	USE_PROFILES: {
		svg: !0,
		svgFilters: !0
	},
	ADD_TAGS: ["style"]
}), Bm = /* @__PURE__ */ new Map();
function Vm(e) {
	let t = Bm.get(e.url);
	return t || (t = fetch(e.url, { credentials: Nl() }).then((t) => {
		if (!t.ok) throw Error(`Symbol ${e.code}: HTTP ${t.status}`);
		return t.text();
	}).then((e) => Zc(e, { purify: zm })), t.catch(() => Bm.delete(e.url)), Bm.set(e.url, t)), t;
}
function Hm(e, t) {
	let n = t.trim().toLowerCase();
	return !n || e.name.toLowerCase().includes(n) || e.code.toLowerCase().includes(n);
}
//#endregion
//#region editor/src/model/rowPresets.ts
var $ = (e, t, n, r) => ({
	id: e,
	group: t,
	label: n,
	cells: r.cells ?? 1,
	...r.weight === void 0 ? {} : { weight: r.weight },
	section: {
		symbols: r.symbols ?? [],
		colour: r.colour ?? null,
		panels: [{
			colour: r.colour ?? null,
			lines: [...r.title ? [{
				text: r.title,
				style: "title",
				caps: r.caps ?? !0,
				bold: !0
			}] : [], ...r.lines.map((e) => ({
				text: e,
				style: r.style ?? (r.title ? "body" : "title"),
				caps: !1,
				bold: !0,
				...r.min === void 0 ? {} : { min: r.min }
			}))]
		}]
	}
}), Um = [
	$("header-site-safety", "Headers", "SITE SAFETY header", {
		colour: "fire_emergency",
		title: "Site safety",
		lines: [],
		cells: 1,
		weight: .7
	}),
	$("header-danger", "Headers", "DANGER header", {
		colour: "fire",
		title: "Danger",
		lines: [],
		cells: 1,
		weight: .7
	}),
	$("header-warning", "Headers", "WARNING header", {
		colour: "warning",
		title: "Warning",
		lines: [],
		cells: 1,
		weight: .7
	}),
	$("header-construction", "Headers", "CONSTRUCTION SITE header", {
		colour: "fire_emergency",
		title: "Construction site",
		lines: [],
		cells: 1,
		weight: .7
	}),
	$("rules-hasawa", "Wording only", "Health and Safety at Work Act notice", {
		colour: Gd,
		lines: ["Under the Health and Safety at Work Act 1974, all persons entering this site must comply with all regulations under this act. All visitors must report to the site office and obtain permission to proceed onto the site or any other work area. Safety signs and procedures must be observed and personal protection and safety equipment must be used at all times."],
		cells: 1,
		weight: 1.2,
		style: "footer",
		min: 3
	}),
	$("rules-parents", "Wording only", "Construction work in progress (parents)", {
		colour: "warning",
		symbols: ["W001"],
		lines: ["Construction work in progress. Parents are advised to warn children of the dangers of entering this site"],
		cells: 1
	}),
	$("rules-report", "Site rules", "All visitors report to site office", {
		colour: "mandatory",
		symbols: ["M001"],
		lines: ["All visitors and drivers must report to the site office"]
	}),
	$("rules-accidents", "Site rules", "Report all accidents immediately", {
		colour: "mandatory",
		symbols: ["M001"],
		lines: ["Report all accidents immediately"]
	}),
	$("rules-permission", "Site rules", "No entry without permission", {
		colour: "mandatory",
		symbols: ["M001"],
		lines: ["No entry to this site without permission"]
	}),
	$("rules-obey", "Site rules", "Obey all safety signs", {
		colour: "mandatory",
		symbols: ["M001"],
		lines: ["Obey all safety signs and site rules"]
	}),
	$("ppe-helmet", "PPE", "Safety helmets must be worn", {
		colour: "mandatory",
		symbols: ["M014"],
		lines: ["Safety helmets must be worn"]
	}),
	$("ppe-hivis", "PPE", "High visibility jackets must be worn", {
		colour: "mandatory",
		symbols: ["M015"],
		lines: ["High visibility jackets must be worn"]
	}),
	$("ppe-boots", "PPE", "Protective footwear must be worn", {
		colour: "mandatory",
		symbols: ["M008"],
		lines: ["Protective footwear must be worn"]
	}),
	$("ppe-eyes", "PPE", "Eye protection must be worn", {
		colour: "mandatory",
		symbols: ["M004"],
		lines: ["Eye protection must be worn"]
	}),
	$("ppe-ears", "PPE", "Ear protection must be worn", {
		colour: "mandatory",
		symbols: ["M003"],
		lines: ["Ear protection must be worn"]
	}),
	$("ppe-gloves", "PPE", "Protective gloves must be worn", {
		colour: "mandatory",
		symbols: ["M009"],
		lines: ["Protective gloves must be worn"]
	}),
	$("ppe-harness", "PPE", "Safety harness must be worn", {
		colour: "mandatory",
		symbols: ["M018"],
		lines: ["Safety harness must be worn"]
	}),
	$("ppe-mask", "PPE", "Respiratory protection must be worn", {
		colour: "mandatory",
		symbols: ["M017"],
		lines: ["Respiratory protection must be worn"]
	}),
	$("ppe-clothing", "PPE", "Protective clothing must be worn", {
		colour: "mandatory",
		symbols: ["M010"],
		lines: ["Protective clothing must be worn"]
	}),
	$("warn-danger-work", "Warnings", "Dangerous work in operation", {
		colour: "warning",
		symbols: ["W001"],
		title: "Warning",
		lines: ["Dangerous work in operation"]
	}),
	$("warn-excavations", "Warnings", "Danger — deep excavations", {
		colour: "warning",
		symbols: ["W001"],
		title: "Danger",
		lines: ["Deep excavations"]
	}),
	$("warn-trucks", "Warnings", "Danger — beware of trucks", {
		colour: "warning",
		symbols: ["W014"],
		title: "Danger",
		lines: ["Beware of trucks"]
	}),
	$("warn-overhead", "Warnings", "Warning — overhead loads", {
		colour: "warning",
		symbols: ["W015"],
		lines: ["Warning: overhead loads"]
	}),
	$("warn-falling", "Warnings", "Warning — falling objects", {
		colour: "warning",
		symbols: ["W035"],
		lines: ["Warning: falling objects"]
	}),
	$("warn-electricity", "Warnings", "Warning — electricity", {
		colour: "warning",
		symbols: ["W012"],
		lines: ["Warning: electricity"]
	}),
	$("warn-drop", "Warnings", "Warning — drop (fall)", {
		colour: "warning",
		symbols: ["W008"],
		lines: ["Warning: risk of falling"]
	}),
	$("warn-scaffold", "Warnings", "Warning — incomplete scaffolding", {
		colour: "warning",
		symbols: ["W001"],
		lines: ["Incomplete scaffolding must not be used"]
	}),
	$("no-unauthorised", "Prohibitions", "No unauthorised access", {
		colour: "prohibition",
		symbols: ["P080"],
		lines: ["No unauthorised access"]
	}),
	$("no-entry-strict", "Prohibitions", "Unauthorised entry strictly forbidden", {
		colour: "prohibition",
		symbols: ["P080"],
		lines: ["Unauthorised entry to this site is strictly forbidden"]
	}),
	$("no-children", "Prohibitions", "Children must not play on this site", {
		colour: "prohibition",
		symbols: ["P036"],
		lines: ["Children must not play on this site"]
	}),
	$("no-smoking", "Prohibitions", "No smoking", {
		colour: "prohibition",
		symbols: ["P002"],
		lines: ["No smoking on this site"]
	}),
	$("no-flame", "Prohibitions", "No naked flames", {
		colour: "prohibition",
		symbols: ["P003"],
		lines: ["No naked flames"]
	}),
	$("no-forklift", "Prohibitions", "No access for forklift trucks", {
		colour: "prohibition",
		symbols: ["P006"],
		lines: ["No access for forklift trucks"]
	}),
	$("no-dogs", "Prohibitions", "No dogs", {
		colour: "prohibition",
		symbols: ["P021"],
		lines: ["No dogs on this site"]
	}),
	$("text-contact", "Wording only", "Site contact details", {
		colour: Gd,
		lines: ["Site manager: 00000 000000"],
		cells: 1,
		weight: .7
	}),
	$("text-blank", "Wording only", "Blank row (your own wording)", {
		colour: Gd,
		lines: ["Your text here"]
	})
], Wm = (e) => Um.find((t) => t.id === e), Gm = () => [
	"Headers",
	"Site rules",
	"PPE",
	"Warnings",
	"Prohibitions",
	"Wording only"
].map((e) => ({
	group: e,
	presets: Um.filter((t) => t.group === e)
})), Km = [
	{
		id: "site-safety",
		label: "Site safety",
		hint: "Header, the Act notice, then the usual site rules",
		rows: [
			"header-site-safety",
			"rules-hasawa",
			"rules-parents",
			["ppe-helmet", "ppe-hivis"],
			["ppe-boots", "no-unauthorised"]
		]
	},
	{
		id: "construction",
		label: "Construction site",
		hint: "Warning header with PPE and access rules",
		rows: [
			"header-construction",
			"warn-danger-work",
			["no-unauthorised", "no-children"],
			["ppe-helmet", "ppe-hivis"],
			["ppe-boots", "warn-trucks"]
		]
	},
	{
		id: "visitors",
		label: "Visitors and deliveries",
		hint: "Reporting in, speed and site rules",
		rows: [
			"header-site-safety",
			"rules-hasawa",
			["rules-report", "rules-accidents"],
			["ppe-hivis", "warn-trucks"],
			["no-children", "no-unauthorised"]
		]
	}
], qm = [
	{
		weight: .7,
		label: "Short"
	},
	{
		weight: 1,
		label: "Normal"
	},
	{
		weight: 1.5,
		label: "Tall"
	},
	{
		weight: 2,
		label: "Double"
	}
], Jm = (e) => e.root.layout.type === "board" ? e.root.layout : null;
function Ym(e) {
	let t = Jm(e);
	if (!t) return [];
	let n = Bd(t), r = zd(t), i = 0;
	return t.rows.map((e, t) => {
		let a = {
			index: t,
			cells: n[t],
			weight: r[t],
			start: i
		};
		return i += n[t], a;
	});
}
function Xm(e, t) {
	for (let n of Ym(e)) if (t >= n.start && t < n.start + n.cells) return n.index;
	return -1;
}
var Zm = "Choose a message";
function Qm(e) {
	let t = af({
		symbols: [],
		colour: Gd,
		panels: [{
			colour: Gd,
			lines: [{
				text: Zm,
				style: "body"
			}]
		}]
	}, /* @__PURE__ */ new Map(), e);
	t.placeholder = !0;
	for (let e of t.text_frame.panels) {
		e.fill = {
			hex: "#EDEDE9",
			cmyk: [
				0,
				0,
				2,
				8
			]
		};
		for (let t of e.blocks) t.colour = {
			hex: "#8A8F97",
			cmyk: [
				0,
				0,
				0,
				45
			]
		}, t.variant = "regular";
	}
	return t;
}
var $m = (e) => e.root.sections.filter((e) => e.placeholder).length, eh = (e, t) => e.root.sections.splice(t.start, t.cells);
function th(e, t) {
	t.rows = t.rows.slice(0, 8).map((e) => ({
		...e,
		cells: Math.max(1, Math.min(2, Math.floor(e.cells)))
	})), vu(e);
}
function nh(e, t, n, r) {
	let i = af(e.section, t, n);
	return [i, ...Array.from({ length: Math.max(0, r - 1) }, () => iu(i))];
}
function rh(e, t, n, r, i) {
	let a = Jm(e);
	if (!a || a.rows.length >= 8) return null;
	let o = Ym(e), s = Math.max(0, Math.min(o.length, t + 1)), c = n?.cells ?? 2, l = n ? nh(n, r, i, c) : Array.from({ length: c }, () => Qm(i)), u = s < o.length ? o[s].start : e.root.sections.length;
	return e.root.sections.splice(u, 0, ...l), a.rows.splice(s, 0, {
		cells: c,
		...n?.weight === void 0 ? {} : { weight: n.weight }
	}), th(e, a), s;
}
function ih(e, t) {
	let n = Jm(e), r = Ym(e)[t];
	!n || !r || n.rows.length <= 1 || (eh(e, r), n.rows.splice(t, 1), th(e, n));
}
function ah(e, t) {
	let n = Jm(e), r = Ym(e)[t];
	if (!n || !r || n.rows.length >= 8) return null;
	let i = e.root.sections.slice(r.start, r.start + r.cells).map((e) => iu(e));
	return e.root.sections.splice(r.start + r.cells, 0, ...i), n.rows.splice(t + 1, 0, { ...n.rows[t] }), th(e, n), t + 1;
}
function oh(e, t, n) {
	let r = Jm(e), i = Ym(e);
	if (!r || t === n || !i[t] || n < 0 || n >= i.length) return;
	let a = eh(e, i[t]), [o] = r.rows.splice(t, 1);
	r.rows.splice(n, 0, o);
	let s = Ym(e)[n].start;
	e.root.sections.splice(s, 0, ...a), th(e, r);
}
function sh(e, t, n) {
	let r = Jm(e), i = Ym(e)[t];
	if (!r || !i) return;
	let a = Math.max(1, Math.min(2, Math.floor(n)));
	if (a !== i.cells) {
		if (a > i.cells) {
			let t = e.root.sections[i.start], n = Array.from({ length: a - i.cells }, () => iu(t));
			e.root.sections.splice(i.start + i.cells, 0, ...n);
		} else e.root.sections.splice(i.start + a, i.cells - a);
		r.rows[t] = {
			...r.rows[t],
			cells: a
		}, th(e, r);
	}
}
function ch(e, t, n) {
	let r = Jm(e);
	if (!r || !r.rows[t]) return;
	let i = Math.max(.4, Math.min(3, n));
	r.rows[t] = {
		...r.rows[t],
		...i === 1 ? {} : { weight: i }
	}, i === 1 && delete r.rows[t].weight, vu(e);
}
function lh(e, t, n) {
	let r = Jm(e);
	if (!r) return;
	let i = Math.max(1, Math.min(8, Math.round(t)));
	for (; r.rows.length > i;) ih(e, r.rows.length - 1);
	for (; r.rows.length < i;) {
		let t = r.rows[r.rows.length - 1]?.cells ?? 1;
		e.root.sections.push(...Array.from({ length: t }, () => Qm(n))), r.rows.push({ cells: t });
	}
	th(e, r);
}
function uh(e, t, n) {
	let r = Jm(e);
	if (!r) return;
	let i = Math.max(1, Math.min(2, Math.round(t)));
	for (let t = r.rows.length - 1; t >= 1; t--) {
		let a = Ym(e)[t];
		a.cells !== i && (i > a.cells ? e.root.sections.splice(a.start + a.cells, 0, ...Array.from({ length: i - a.cells }, () => Qm(n))) : e.root.sections.splice(a.start + i, a.cells - i), r.rows[t] = {
			...r.rows[t],
			cells: i
		});
	}
	th(e, r);
}
function dh(e) {
	let t = Ym(e).slice(1);
	return t.length && t.every((e) => e.cells === 2) ? 2 : 1;
}
function fh(e, t, n, r, i) {
	Jm(e) && e.root.sections[t] && (e.root.sections[t] = nh(n, r, i, 1)[0], vu(e));
}
function ph(e, t, n, r = 5, i = 1) {
	let a = Wm("header-site-safety"), o = Ic({
		symbols: [],
		title: "",
		size: {
			width: e.width,
			height: e.height,
			catalogue_size_id: e.size_id
		},
		ruleset: n
	}), s = a ? nh(a, t, n, 1) : [Qm(n)], c = [{
		cells: 1,
		...a?.weight === void 0 ? {} : { weight: a.weight }
	}];
	return o.root.sections = s, o.root.layout = {
		type: "board",
		rows: c,
		gutter: "auto",
		sync_rows: !0,
		align_symbols: !1
	}, e.size_id || delete o.catalogue_size_id, lh(o, r, n), i > 1 && uh(o, i, n), o;
}
function mh(e, t, n) {
	let r = e.root.sections;
	t !== n && r[t] && r[n] && ([r[t], r[n]] = [r[n], r[t]]);
}
function hh(e, t, n, r) {
	let i = ((Km.find((e) => e.id === t) ?? null)?.rows ?? ["header-site-safety", "ppe-helmet"]).slice(0, 8), a = [], o = [];
	for (let e of i) {
		let t = (Array.isArray(e) ? e : [e]).map((e) => Wm(e)).filter((e) => !!e);
		if (!t.length) continue;
		for (let e of t) a.push(...nh(e, n, r, 1));
		let i = t[0].weight;
		o.push({
			cells: t.length,
			...i === void 0 ? {} : { weight: i }
		});
	}
	let s = Ic({
		symbols: [],
		title: "",
		size: {
			width: e.width,
			height: e.height,
			catalogue_size_id: e.size_id
		},
		ruleset: r
	});
	return s.root.sections = a, s.root.layout = {
		type: "board",
		rows: o,
		gutter: "auto",
		sync_rows: !0,
		align_symbols: !1
	}, e.size_id || delete s.catalogue_size_id, vu(s), s;
}
//#endregion
//#region editor/src/model/variants.ts
var gh = {
	mm: 1,
	mmm: 1,
	cm: 10,
	m: 1e3,
	in: 25.4,
	inch: 25.4,
	ft: 304.8,
	feet: 304.8
}, _h = /^#[0-9a-f]{6}$/i, vh = (e) => {
	let t = (e ?? "").trim();
	return _h.test(t) ? t : null;
}, yh = (e) => vh(e.face_hex), bh = (e) => vh(e.unprinted_hex) ?? yh(e);
function xh(e) {
	let t = gh[(e.size_units ?? "mm").toLowerCase()] ?? 0, n = Number(e.size_width) * t, r = Number(e.size_height) * t;
	return n > 0 && r > 0 ? {
		width: n,
		height: r
	} : null;
}
function Sh(e) {
	if (!e) return [];
	let t = [];
	for (let [n, r] of Object.entries(e)) {
		let e = Object.entries(r ?? {});
		if (!e.length) continue;
		let i = e[0][1], a = xh(i);
		a && t.push({
			size_id: Number(i.size_id ?? n),
			name: i.size_name?.trim() || `${a.width}mm x ${a.height}mm`,
			width: a.width,
			height: a.height,
			symbol_position: Number(i.symbol_default_location) === 1 ? "left" : "above",
			materials: e.map(([e, t]) => ({
				material_id: Number(t.material_id ?? e),
				name: t.material_name?.trim() || `Material ${t.material_id ?? e}`,
				face_hex: yh(t),
				unprinted_hex: bh(t),
				row: t
			}))
		});
	}
	return t;
}
var Ch = (e, t) => e?.materials.find((e) => e.material_id === t) ?? e?.materials[0], wh = [
	{
		key: "yellow",
		label: "Yellow",
		face: {
			hex: "#FFD200",
			cmyk: [
				0,
				16,
				100,
				0
			],
			spot: "PANTONE 116"
		},
		ink: {
			hex: "#000000",
			cmyk: [
				0,
				0,
				0,
				100
			]
		},
		category: "warning",
		material: !0
	},
	{
		key: "red",
		label: "Red",
		face: {
			hex: "#E31837",
			cmyk: [
				0,
				100,
				81,
				4
			],
			spot: "PANTONE 186"
		},
		ink: {
			hex: "#FFFFFF",
			cmyk: [
				0,
				0,
				0,
				0
			]
		},
		category: "prohibition"
	},
	{
		key: "blue",
		label: "Blue",
		face: {
			hex: "#0079C1",
			cmyk: [
				100,
				44,
				0,
				0
			],
			spot: "PANTONE 300"
		},
		ink: {
			hex: "#FFFFFF",
			cmyk: [
				0,
				0,
				0,
				0
			]
		},
		category: "mandatory"
	}
], Th = "directional", Eh = (e) => wh.find((t) => t.key === e) ?? wh[0], Dh = [
	{
		size_id: 7,
		name: "600mm x 450mm",
		width: 600,
		height: 450,
		symbol_position: "left"
	},
	{
		size_id: -1050750,
		name: "1050mm x 750mm",
		width: 1050,
		height: 750,
		symbol_position: "left"
	},
	{
		size_id: -600600,
		name: "600mm x 600mm",
		width: 600,
		height: 600,
		symbol_position: "left"
	},
	{
		size_id: -750750,
		name: "750mm x 750mm",
		width: 750,
		height: 750,
		symbol_position: "left"
	}
], Oh = .04, kh = 1.5, Ah = .84, jh = .42, Mh = (e, t) => Math.max(6, Math.round(Math.min(e, t) * Oh)), Nh = (e, t) => Math.round(Mh(e, t) * kh), Ph = (e) => {
	let t = e.root.substrate ?? e.root.background, n = t && "hex" in t ? t.hex : "";
	return wh.find((e) => e.face.hex === n) ?? wh[0];
};
function Fh(e, t, n) {
	let { root: r } = e;
	t.material ? (r.substrate = { ...t.face }, delete r.background) : (delete r.substrate, r.background = { ...t.face });
	let i = Mh(r.width, r.height);
	r.border = {
		width: i,
		colour: { ...t.ink }
	}, r.margin = 0, r.corner_radius = i * 2, r.corners = {
		rounded: !0,
		radius: "auto"
	};
	for (let e of r.sections) {
		e.category = t.category;
		for (let n of e.text_frame.panels) {
			n.fill = "none";
			for (let e of n.blocks) e.colour = { ...t.ink };
		}
		for (let n of e.symbol_frame?.symbols ?? []) Lh(n, t);
	}
}
function Ih(e, t) {
	let n = e.body.replace(/fill\s*:\s*#[0-9a-fA-F]{3,8}/g, `fill: ${t}`).replace(/fill="#[0-9a-fA-F]{3,8}"/g, `fill="${t}"`);
	return n === e.body ? e : {
		...e,
		body: n,
		hash: `${e.hash}-${t.slice(1)}`
	};
}
var Lh = (e, t) => {
	e.source = Ih(e.source, t.ink.hex);
};
function Rh(e, t, n) {
	e.root.width = t.width, e.root.height = t.height, t.size_id > 0 ? e.catalogue_size_id = t.size_id : delete e.catalogue_size_id, Fh(e, Ph(e), n), zh(e, n);
}
function zh(e, t) {
	let n = Nh(e.root.width, e.root.height);
	e.root.padding = n;
	for (let t of e.root.sections) {
		t.spacing = n, t.text_frame.spacing = n;
		for (let e of t.text_frame.panels) e.padding = [
			0,
			0,
			0,
			0
		];
	}
}
function Bh(e) {
	let t = au(e, "title");
	return t.size.mode === "auto" && (t.size.scale = Ah), t;
}
function Vh(e, t, n, r) {
	let i = Ic({
		symbols: [],
		title: n,
		size: {
			width: e.width,
			height: e.height,
			catalogue_size_id: Math.max(0, e.size_id)
		},
		ruleset: r
	});
	e.size_id <= 0 && delete i.catalogue_size_id;
	let a = i.root.sections[0];
	a.symbol_frame = null, a.orientation = "horizontal", a.symbol_share = jh;
	let o = a.text_frame.panels[0];
	return o.blocks = [Bh(n)], Fh(i, t, r), zh(i, r), i;
}
//#endregion
//#region editor/src/model/translator.ts
function Hh(e) {
	return {
		name: "shop",
		async translate(t, n) {
			let r = await fetch(e, {
				method: "POST",
				credentials: "omit",
				headers: { "Content-Type": "text/plain" },
				body: JSON.stringify({
					target: n,
					texts: t
				})
			}), i = await r.json().catch(() => null);
			if (!r.ok) throw Error(i?.error ?? `Translation failed (HTTP ${r.status})`);
			let a = i?.texts;
			if (!Array.isArray(a) || a.length !== t.length || !a.every((e) => typeof e == "string")) throw Error("Translation service returned something unexpected");
			return a;
		}
	};
}
var Uh = (e, t, n) => Promise.race([e, new Promise((e, r) => setTimeout(() => r(Error(n)), t))]);
function Wh() {
	let e = globalThis.Translator;
	if (!e) return null;
	let t = /* @__PURE__ */ new Map(), n = (n) => {
		let r = t.get(n);
		return r || (r = e.create({
			sourceLanguage: "en",
			targetLanguage: n
		}), t.set(n, r), r.catch(() => t.delete(n))), r;
	};
	return {
		name: "browser",
		prepare: (e) => n(e).then(() => void 0),
		async translate(e, r) {
			let i = n(r), a = await Uh(i, 2e4, "Your browser is still getting this language ready. Press “Translate all again” to carry on, or type the translation.").catch((e) => {
				throw t.get(r) === i && t.delete(r), e instanceof DOMException && e.name === "NotAllowedError" ? Error("Press “Translate all again” to download this language in your browser, or type the translation.") : e instanceof DOMException && e.name === "NotSupportedError" ? Error("This browser can’t translate to that language. Please type the translation.") : e;
			});
			return Promise.all(e.map((e) => Promise.all(e.split("\n").map((e) => e.trim() ? a.translate(e) : Promise.resolve(e))).then((e) => e.join("\n"))));
		}
	};
}
function Gh(e = location.search) {
	if (Ml) return Ml.translateUrl ? Hh(Ml.translateUrl) : null;
	let t = new URLSearchParams(e).get("translate") ?? "https://www.safetysignsandnotices.co.uk/index.php?route=bespoke/api/translate";
	return t && t !== "off" ? Hh(t) : t === "off" ? null : Wh();
}
//#endregion
//#region editor/src/model/wizard.ts
var Kh = [
	"above",
	"below",
	"left",
	"right"
], qh = "[,:;.!\\u2013\\u2014-]", Jh = RegExp(`^(?:(danger|warning|caution)\\s*${qh}*\\s+|(notice|important)\\s*${qh}+\\s*)(.+)$`, "i");
function Yh(e) {
	let t = Jh.exec(e.title.trim());
	if (!t) return e;
	let n = t[1] ?? t[2], r = t[3].trim(), i = r === r.toUpperCase() ? r : r.charAt(0).toUpperCase() + r.slice(1);
	return {
		...e,
		title: n,
		lines: [i, ...e.lines]
	};
}
function Xh(e = location.search) {
	if (Ml) return Ml.suggestUrl ?? null;
	let t = new URLSearchParams(e).get("suggest") ?? "https://www.safetysignsandnotices.co.uk/index.php?route=bespoke/api/suggest";
	return t && t !== "off" ? t : null;
}
function Zh(e = location.search) {
	if (Ml) return Ml.photoUrl ?? null;
	let t = new URLSearchParams(e).get("photo") ?? "https://www.safetysignsandnotices.co.uk/index.php?route=bespoke/api/photo";
	return t && t !== "off" ? t : null;
}
var Qh = (e = location.search) => (new URLSearchParams(e).get("describe") ?? "").trim().slice(0, 300), $h = 4, eg = (e) => Array.isArray(e) && e.every((e) => typeof e == "string");
function tg(e) {
	let t = e;
	return !t || typeof t != "object" || !eg(t.symbols) || typeof t.title != "string" || !eg(t.lines) || !t.symbols.length && !t.title.trim() ? null : {
		symbols: t.symbols.slice(0, 4),
		colour: typeof t.colour == "string" ? t.colour : null,
		background: t.background === "colour" ? "colour" : "white",
		symbol_position: Kh.includes(t.symbol_position) ? t.symbol_position : null,
		title: t.title.slice(0, 120),
		lines: t.lines.slice(0, 4).map((e) => e.slice(0, 160)),
		size_id: typeof t.size_id == "number" ? t.size_id : null,
		alternatives: eg(t.alternatives) ? t.alternatives.slice(0, 6) : [],
		note: typeof t.note == "string" ? t.note.slice(0, 300) : "",
		sections: ng(e.sections)
	};
}
function ng(e) {
	if (!Array.isArray(e)) return [];
	let t = e.slice(0, $h).map((e) => {
		let t = e;
		if (!t || typeof t != "object") return null;
		let n = eg(t.symbols) ? t.symbols.slice(0, 2) : [], r = typeof t.title == "string" ? t.title.slice(0, 120) : "", i = eg(t.lines) ? t.lines.slice(0, 3).map((e) => e.slice(0, 160)) : [];
		return !n.length && !r.trim() && !i.length ? null : {
			symbols: n,
			colour: typeof t.colour == "string" ? t.colour : null,
			title: r,
			lines: i
		};
	}).filter((e) => e !== null);
	return t.length > 1 ? t : [];
}
async function rg(e, t) {
	let n = await fetch(e, {
		method: "POST",
		credentials: "omit",
		headers: { "Content-Type": "text/plain" },
		body: JSON.stringify(t)
	}), r = await n.json().catch(() => null);
	if (!n.ok) throw Error(r?.error ?? `Suggestion failed (HTTP ${n.status})`);
	return r;
}
var ig = () => /* @__PURE__ */ Error("The suggestion service returned something unexpected");
async function ag(e, t, n) {
	let r = tg(await rg(e, {
		description: t,
		...og(n)
	}));
	if (!r) throw ig();
	return r;
}
var og = (e) => e?.length ? { size_ids: e } : {};
async function sg(e, t, n) {
	let r = tg(await rg(e, {
		image: t,
		...og(n)
	}));
	if (!r) throw ig();
	return r;
}
var cg = (e) => {
	let t = atob(e.replace(/-/g, "+").replace(/_/g, "/"));
	return new TextDecoder().decode(Uint8Array.from(t, (e) => e.charCodeAt(0)));
};
function lg(e = location.search) {
	let t = new URLSearchParams(e).get("design");
	if (!t || t.length > 4e3) return null;
	try {
		let e = JSON.parse(cg(t)), n = tg(e);
		return n ? {
			...n,
			description: typeof e.description == "string" ? e.description.slice(0, 300) : ""
		} : null;
	} catch {
		return null;
	}
}
function ug(e, t, n, r, i) {
	if (t = Yh(t), t.sections.length > 1) {
		let e = new Map(n.map((e) => [e.code, e]));
		return {
			doc: of({
				version: 1,
				layout: "stacked",
				sections: t.sections.map((e) => ({
					symbols: e.symbols,
					colour: e.colour,
					panels: [{
						colour: e.colour,
						lines: [...e.title.trim() ? [{
							text: e.title,
							style: "title",
							caps: !1,
							bold: !0
						}] : [], ...e.lines.map((t) => ({
							text: t,
							style: e.title.trim() ? "body" : "title",
							caps: !1,
							bold: !0
						}))]
					}]
				})),
				...t.symbol_position ? { symbol_position: t.symbol_position } : {},
				...t.background === "colour" ? { background: "colour" } : {}
			}, r, e, i),
			basic: !1
		};
	}
	let [a, ...o] = n;
	if (!a) {
		let e = of({
			version: 1,
			layout: "single",
			symbol_position: null,
			sections: [{
				symbols: [],
				colour: t.colour,
				panels: [{
					colour: null,
					lines: [{
						text: t.title,
						style: "title",
						caps: !1,
						bold: !0
					}, ...t.lines.map((e) => ({
						text: e,
						style: "body",
						caps: !1,
						bold: !0
					}))]
				}]
			}],
			...t.background === "colour" ? { background: "colour" } : {}
		}, r, /* @__PURE__ */ new Map(), i);
		return {
			doc: e,
			basic: Id(e)
		};
	}
	let s = np(r, a, t.title, t.lines[0] ?? "", i), c = Fd(s);
	for (let e of o) Bu(s, c.id, e);
	let l = c.text_frame.panels[0];
	for (let e of t.lines.slice(1)) l.blocks.push(au(e, "body"));
	t.symbol_position && xu(s, t.symbol_position), t.background === "colour" && kd(s, "colour", i.categories);
	let u = Of(e);
	return u && (If(s, u.target.lang ?? "pl", Mf(e)), Xf(s, Yf(e))), {
		doc: s,
		basic: Id(s)
	};
}
//#endregion
//#region editor/src/useEditor.ts
function dg(e) {
	if (Array.isArray(e)) return e.map(dg);
	if (e && typeof e == "object") {
		let t = {};
		for (let [n, r] of Object.entries(e)) t[n] = n === "source" ? r : dg(r);
		return t;
	}
	return e;
}
var fg = /* @__PURE__ */ new Set(["W_EMPTY_TEXT"]), pg = 60, mg = 400, hg = 500, gg = (e) => e.filter((e) => e.width >= mg && e.height >= hg).sort((e, t) => e.width * e.height - t.width * t.height)[0] ?? e[0] ?? {
	size_id: 0,
	name: "450mm x 600mm",
	width: 450,
	height: 600,
	symbol_position: "left"
}, _g = 1500, vg = 700;
function yg() {
	let e = /* @__PURE__ */ Ft({
		status: "loading",
		error: "",
		symbolBusy: "",
		symbolError: "",
		translating: !1,
		translateError: "",
		suggesting: !1,
		suggestError: "",
		saving: !1,
		saveError: "",
		reviewStatus: Ml?.review?.status ?? "",
		savedAt: ""
	}), t = Ml?.open ?? null, n = Ml?.review ?? null, r = Xh(), i = Zh(), a = /* @__PURE__ */ qt(null), o = /* @__PURE__ */ qt(null), s = /* @__PURE__ */ I(Qh()), c = Gh(), l = /* @__PURE__ */ qt([]), u, d = 0, f = 0, p = null, m = null, h = null, g = /* @__PURE__ */ qt(null), _ = /* @__PURE__ */ qt(null), v = /* @__PURE__ */ qt(""), y = /* @__PURE__ */ qt(null), b = /* @__PURE__ */ qt([]), x = /* @__PURE__ */ qt(null), S = /* @__PURE__ */ I(0), C = /* @__PURE__ */ I(new URLSearchParams(location.search).get("mode") === "advanced" ? "advanced" : "basic"), w = /* @__PURE__ */ Ft({
		section: 0,
		panel: 0
	}), T = /* @__PURE__ */ I(null), E = [], ee = [], te = /* @__PURE__ */ Ft({
		canUndo: !1,
		canRedo: !1
	}), D = "", ne = 0, re = [];
	function ie() {
		if (!_.value || !h || !m) return;
		let e = jc(_.value, {
			shaper: h,
			ruleset: m
		}, {
			guides: !1,
			text: "live",
			dimensions: !0,
			unprinted: Be.value
		});
		v.value = e.svg ?? "", y.value = e.report, b.value = e.findings.filter((e) => !fg.has(e.code)), x.value = dg(_.value), S.value++;
		for (let e of re) e();
	}
	function ae() {
		let e = _.value?.root.sections ?? [];
		w.section = Math.max(0, Math.min(w.section, e.length - 1));
		let t = e[w.section]?.text_frame.panels.length ?? 1;
		w.panel = Math.max(0, Math.min(w.panel, t - 1));
	}
	function oe() {
		te.canUndo = E.length > 0, te.canRedo = ee.length > 0;
	}
	function O(e, t = "") {
		if (!_.value || !m) return;
		let n = Date.now();
		(!t || t !== D || n - ne > _g) && (E.push(JSON.stringify(_.value)), E.length > pg && E.shift(), ee.length = 0), D = t, ne = n, e(_.value, m), zf(_.value), ae(), oe(), ie(), se();
	}
	function se(e = vg, t = !1) {
		clearTimeout(u), _.value && kf(_.value) && (u = setTimeout(() => void ce(t), e));
	}
	async function ce(t) {
		let n = _.value;
		if (!n) return;
		let r = Of(n)?.target.lang, i = Vf(n, t);
		if (!r || !i.length) {
			ie();
			return;
		}
		if (!c) {
			e.translateError = "Automatic translation isn’t available here. Please type the translation.", ie();
			return;
		}
		let a = ++f;
		d++, e.translating = !0, l.value = i.map((e) => e.id), e.translateError = "";
		try {
			let e = await c.translate(i.map((e) => e.text), r);
			if (_.value !== n || Of(n)?.target.lang !== r) return;
			Uf(n, i.map((t, n) => ({
				id: t.id,
				from: t.text,
				text: e[n]
			}))), zf(n), ie();
		} catch (t) {
			a === f && (e.translateError = t instanceof Error ? t.message : String(t));
		} finally {
			e.translating = --d > 0, a === f && (l.value = []);
		}
	}
	function le(e, t) {
		let n = e.pop();
		n && _.value && (t.push(JSON.stringify(_.value)), _.value = JSON.parse(n), D = "", C.value === "basic" && (Id(_.value) ? Ld(_.value) : C.value = "advanced"), ae(), oe(), ie(), se());
	}
	async function ue() {
		try {
			({data: p, ruleset: m, shaper: h} = await Wl()), ql().catch(() => void 0), g.value = ep(location.search, m.categories, p.symbols);
			let i = $l() === null ? null : Ql($l());
			if (i) {
				g.value = {
					...g.value,
					heading: `Customise: ${i.name}`,
					bilingual: !1
				}, _.value = await eu(i, async (e) => {
					let t = k(e);
					return t ? Vm(t) : null;
				}), Id(_.value) || (C.value = "advanced"), e.status = "ready", ie();
				return;
			}
			if (t) {
				let r = await de(t);
				g.value = {
					...g.value,
					heading: t.productName,
					board: hu(r) === "board",
					bilingual: Of(r) !== null
				}, _.value = r, n ? C.value = "advanced" : Id(_.value) || (C.value = "advanced"), e.status = "ready", ie();
				return;
			}
			if (g.value.roadsign) {
				C.value = "advanced", _.value = Vh(Dh[0], wh[0], "Site traffic only", m), e.status = "ready", ie();
				return;
			}
			if (g.value.board) {
				C.value = "advanced";
				let t = gg(p.sizes), n = await we(Wm("header-site-safety")?.section.symbols ?? []);
				_.value = ph(t, n, m), e.status = "ready", ie();
				return;
			}
			let a = p.symbols.find((e) => e.code === g.value.defaultSymbol) ?? p.symbols[0], o = (g.value.bilingual ? p.sizes.find((e) => e.width === 300 && e.height === 200) ?? p.sizes.find((e) => e.width > e.height) : void 0) ?? p.sizes.find((e) => e.symbol_position === "above") ?? p.sizes[0];
			if (!a || !o) throw Error("No symbols or sizes available");
			let c = await Vm(a);
			_.value = np(o, {
				code: a.code,
				category: a.category,
				source: c
			}, "Your text here", "", m), g.value.bilingual && If(_.value, g.value.language, "side"), e.status = "ready", ie(), se(0);
			let l = lg(), u = Qh();
			l ? (s.value = l.description, await _e(l, l.description).catch((t) => {
				e.suggestError = t instanceof Error ? t.message : String(t);
			}), E.length = 0, oe()) : u && r && ve(u);
		} catch (t) {
			e.status = "error", e.error = t instanceof Error ? t.message : String(t);
		}
	}
	let k = (e) => p?.symbols.find((t) => t.code === e) ?? null;
	async function de(e) {
		if (!p || !m) throw Error("Not ready");
		if (e.design) try {
			let t = xc(e.design);
			if (!kc(Ac(t, m))) return t;
		} catch {}
		let t = e.size ?? {
			size_id: null,
			name: "",
			width: 200,
			height: 300
		}, n = {
			size_id: t.size_id ?? 0,
			name: t.name,
			width: t.width,
			height: t.height,
			symbol_position: t.width > t.height ? "left" : "above"
		}, r = tf(e.recipe), i = (r ? rf(r) : [g.value?.defaultSymbol ?? p.symbols[0].code]).map((e) => k(e)).filter((e) => e !== null), a = new Map(await Promise.all(i.map(async (e) => [e.code, {
			code: e.code,
			category: e.category,
			source: await Vm(e)
		}]))), o = r ? of(r, n, a, m) : np(n, [...a.values()][0], "Your text here", "", m);
		return t.size_id === null && delete o.catalogue_size_id, o;
	}
	async function fe(t) {
		if (!n || !_.value || e.saving) return !1;
		e.saving = !0, e.saveError = "";
		try {
			let r = await fetch(n.saveUrl, {
				method: "POST",
				credentials: "same-origin",
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": n.csrfToken
				},
				body: JSON.stringify({
					design: _.value,
					status: t
				})
			}), i = await r.json().catch(() => null);
			if (!r.ok) throw Error(i?.error ?? `Save failed (HTTP ${r.status})`);
			return e.reviewStatus = i?.status ?? t, e.savedAt = (/* @__PURE__ */ new Date()).toLocaleTimeString(), window.parent?.postMessage({
				type: "recreate-saved",
				productId: n.productId,
				status: e.reviewStatus,
				symbols: i?.symbols ?? null
			}, location.origin), !0;
		} catch (t) {
			return e.saveError = t instanceof Error ? t.message : String(t), !1;
		} finally {
			e.saving = !1;
		}
	}
	function pe(t) {
		e.symbolError = "", T.value = t;
	}
	async function me(t) {
		let n = T.value;
		if (n) {
			e.symbolBusy = t.code, e.symbolError = "";
			try {
				let e = await Vm(t), r = {
					code: t.code,
					category: t.category,
					source: e
				}, i = n.index === "new";
				if (C.value === "basic") O((e) => op(e, r));
				else if (n.index === "new") {
					let e = 0;
					O((t) => {
						e = Bu(t, n.sectionId, r);
					}), T.value = {
						...n,
						index: e
					};
				} else {
					let e = n.index;
					O((t) => Vu(t, n.sectionId, e, r));
				}
				g.value?.roadsign && O((e) => {
					i && xu(e, "below"), Fh(e, Ph(e), m);
				});
			} catch (t) {
				e.symbolError = t instanceof Error ? t.message : String(t);
			} finally {
				e.symbolBusy = "";
			}
		}
	}
	let he = J(() => {
		S.value;
		let e = T.value;
		return !e || !_.value || e.index === "new" ? null : _.value.root.sections.find((t) => t.id === e.sectionId)?.symbol_frame?.symbols[e.index]?.symbol_code ?? null;
	}), ge = () => Re.value.map((e) => e.size_id);
	async function _e(e, t) {
		if (!p) return;
		let n = e.symbols.map((e) => k(e)).filter((e) => e !== null);
		if (e.symbols.length && !n.length) throw Error("None of the suggested symbols are available here. Please choose one yourself.");
		let r = await Promise.all(n.map(async (e) => ({
			code: e.code,
			category: e.category,
			source: await Vm(e)
		}))), i = _.value;
		if (!i || !m) return;
		let o = Re.value, s = o.length ? o.find((t) => t.size_id === e.size_id) ?? o.find((e) => e.size_id === ze.value?.size_id) ?? o[0] : null, c = ug(i, e, r, s ? Fe(s) : p.sizes.find((t) => t.size_id === e.size_id) ?? p.sizes.find((e) => e.size_id === i.catalogue_size_id) ?? p.sizes[0], m);
		if (O((e) => {
			e.root = c.doc.root, c.doc.catalogue_size_id === void 0 ? delete e.catalogue_size_id : e.catalogue_size_id = c.doc.catalogue_size_id;
		}), s && s.size_id !== ze.value?.size_id) {
			let e = Ch(s, ze.value?.material_id ?? 0);
			ze.value = {
				size_id: s.size_id,
				material_id: e?.material_id ?? 0
			};
			for (let e of Ve) e(s.size_id, ze.value.material_id);
		}
		w.section = 0, w.panel = 0, T.value = null, c.basic || (C.value = "advanced"), a.value = {
			...e,
			description: t,
			alternatives: e.alternatives.filter((e) => k(e))
		};
	}
	async function ve(t) {
		let n = t.trim().slice(0, 300);
		if (r && n && p && !e.suggesting) {
			e.suggesting = !0, e.suggestError = "";
			try {
				await _e(await ag(r, n, ge()), n);
			} catch (t) {
				e.suggestError = t instanceof Error ? t.message : String(t);
			} finally {
				e.suggesting = !1;
			}
		}
	}
	async function ye(t) {
		if (i && !e.suggesting) {
			e.suggesting = !0, e.suggestError = "";
			try {
				let e = await uf(t);
				await _e(await sg(i, e.dataUrl, ge()), s.value.trim());
			} catch (t) {
				e.suggestError = t instanceof Error ? t.message : String(t);
			} finally {
				e.suggesting = !1;
			}
		}
	}
	async function A(e) {
		let t = k(e), n = _.value;
		if (!t || !n) return;
		let r = {
			sectionId: Fd(n).id,
			index: 0
		}, i = T.value;
		T.value = r;
		try {
			await me(t);
		} finally {
			T.value = i;
		}
	}
	function be() {
		if (!_.value || !m || !h) return;
		let e = Cf(_.value, {
			shaper: h,
			ruleset: m
		}, p?.sizes ?? []);
		o.value = e.outcome, e.outcome.changed && O((t) => {
			t.root = e.doc.root;
		});
	}
	function j(e) {
		if (e === C.value || !_.value) return !0;
		if (T.value = null, e === "basic") {
			if (!Id(_.value)) return !1;
			O((e) => Ld(e));
		}
		return C.value = e, !0;
	}
	async function xe() {
		let e = _.value;
		if (!e || !m || !p) return;
		let t = Of(e)?.source ?? e.root.sections[0], n = [t, ...e.root.sections].flatMap((e) => e.symbol_frame?.symbols ?? []), r = t.text_frame.panels.flatMap((e) => e.blocks.map((e) => e.text)).filter((e) => e.trim()), i;
		if (n[0]) i = {
			code: n[0].symbol_code,
			category: n[0].category,
			source: n[0].source
		};
		else {
			let e = k(g.value?.defaultSymbol ?? void 0) ?? p.symbols[0];
			i = {
				code: e.code,
				category: e.category,
				source: await Vm(e)
			};
		}
		let a = np(p.sizes.find((t) => t.size_id === e.catalogue_size_id) ?? {
			size_id: e.catalogue_size_id ?? 0,
			name: "",
			width: e.root.width,
			height: e.root.height,
			symbol_position: e.root.width > e.root.height ? "left" : "above"
		}, i, r[0] ?? "", r[1] ?? "", m), o = Of(e);
		o && (If(a, o.target.lang ?? g.value?.language ?? "pl", Mf(e)), Xf(a, Yf(e))), O((e) => {
			e.root = a.root, a.catalogue_size_id === void 0 ? delete e.catalogue_size_id : e.catalogue_size_id = a.catalogue_size_id;
		}), w.section = 0, w.panel = 0, T.value = null, C.value = "basic";
	}
	let Se = (e) => {
		for (let t of y.value?.sections ?? []) {
			let n = t.blocks.find((t) => t.id === e);
			if (n) return n;
		}
	}, M = (e, t) => {
		let n = Se(e), r = n?.recommended ?? 0, i = n?.letter_height ?? 0;
		return {
			step: t,
			label: xd(t, i < r - .05),
			mm: i,
			lines: n?.lines ?? 1
		};
	}, Ce = (e) => J(() => {
		S.value;
		let t = {
			text: "",
			align: "centre",
			caps: !1,
			step: 0,
			label: "Auto",
			mm: 0,
			lines: 1
		};
		if (!_.value || !Id(_.value)) return t;
		let n = ip(_.value, e);
		return n ? {
			text: n.text,
			align: n.align,
			caps: sd(n),
			...M(n.id, dp(_.value, e))
		} : t;
	});
	async function we(e) {
		let t = e.map((e) => k(e)).filter((e) => e !== null);
		return new Map(await Promise.all(t.map(async (e) => [e.code, {
			code: e.code,
			category: e.category,
			source: await Vm(e)
		}])));
	}
	async function Te(t, n) {
		if (_.value && m) {
			e.symbolError = "";
			try {
				let e = await we(t?.section.symbols ?? []), r = null;
				O((i) => {
					r = rh(i, n, t, e, m);
				});
				let i = r === null ? null : Ym(_.value)[r];
				i && (w.section = i.start), w.panel = 0;
			} catch (t) {
				e.symbolError = t instanceof Error ? t.message : String(t);
			}
		}
	}
	async function Ee(t) {
		if (_.value && m) {
			e.symbolError = "";
			try {
				let e = await we(t.section.symbols), n = w.section;
				O((r) => fh(r, n, t, e, m)), w.panel = 0;
			} catch (t) {
				e.symbolError = t instanceof Error ? t.message : String(t);
			}
		}
	}
	async function De(t) {
		if (!_.value || !m || !p) return;
		let n = Km.find((e) => e.id === t);
		if (n) {
			e.symbolError = "";
			try {
				let e = await we(n.rows.flatMap((e) => Array.isArray(e) ? e : [e]).flatMap((e) => Wm(e)?.section.symbols ?? [])), { width: r, height: i } = _.value.root, a = r >= mg && i >= hg, o = p.sizes.filter((e) => e.width >= mg && e.height >= hg).sort((e, t) => e.width * e.height - t.width * t.height)[0], s = a || !o ? {
					size_id: _.value.catalogue_size_id ?? 0,
					name: "",
					width: r,
					height: i,
					symbol_position: "left"
				} : o;
				O((n) => {
					let r = hh(s, t, e, m);
					n.root.width = r.root.width, n.root.height = r.root.height, r.catalogue_size_id && (n.catalogue_size_id = r.catalogue_size_id), n.root.layout = r.root.layout, n.root.sections = r.root.sections;
				}), w.section = 0, w.panel = 0;
			} catch (t) {
				e.symbolError = t instanceof Error ? t.message : String(t);
			}
		}
	}
	function N(e) {
		_.value?.root.sections[e]?.placeholder ? ke("replace", e) : Oe.value?.mode === "replace" && (Oe.value = null);
	}
	let Oe = /* @__PURE__ */ I(null);
	function ke(t, n) {
		e.symbolError = "", Oe.value = {
			mode: t,
			at: n
		};
	}
	async function Ae(e) {
		let t = Oe.value;
		t && (t.mode === "replace" ? await Ee(e) : await Te(e, t.at), Oe.value = null);
	}
	let je = {
		rows: J(() => (S.value, _.value ? Ym(_.value) : [])),
		selectedRow: J(() => (S.value, _.value ? Xm(_.value, w.section) : -1)),
		add: Te,
		templates: Km,
		useTemplate: De,
		usePreset: Ee,
		remove: (e) => O((t) => ih(t, e)),
		duplicate: (e) => O((t) => {
			ah(t, e);
		}),
		move: (e, t) => {
			O((n) => oh(n, e, t));
			let n = Ym(_.value)[t];
			n && (w.section = n.start);
		},
		setCells: (e, t) => O((n) => sh(n, e, t)),
		setRowCount: (e) => O((t) => lh(t, e, m)),
		setColumns: (e) => O((t) => uh(t, e, m)),
		columns: J(() => (S.value, _.value ? dh(_.value) : 1)),
		empty: J(() => (S.value, _.value ? $m(_.value) : 0)),
		setWeight: (e, t) => O((n) => ch(n, e, t)),
		select: (e) => {
			let t = Ym(_.value)[e];
			t && (w.section = t.start, w.panel = 0, N(t.start));
		},
		picker: Oe,
		openPicker: ke,
		closePicker: () => {
			Oe.value = null;
		},
		takePreset: Ae
	}, Me = {
		schemes: wh,
		sizes: Dh,
		scheme: J(() => (S.value, _.value ? Ph(_.value) : wh[0])),
		size: J(() => {
			S.value;
			let e = _.value;
			return e ? Dh.find((t) => t.width === e.root.width && t.height === e.root.height) ?? null : null;
		}),
		setScheme: (e) => O((t) => Fh(t, Eh(e), m)),
		setSize: (e) => O((t) => Rh(t, e, m))
	}, Ne = J(() => ({
		doc: x.value,
		report: y.value
	}));
	async function Pe(e) {
		if (!_.value || !m) return "";
		let t = await ql();
		return jc(_.value, {
			shaper: t,
			ruleset: m
		}, {
			guides: !1,
			text: "outline",
			unprinted: Be.value,
			...e ? { substrate: !1 } : {}
		}).svg ?? "";
	}
	let Fe = (e) => ({
		size_id: e.size_id,
		name: e.name,
		width: e.width,
		height: e.height,
		symbol_position: e.symbol_position
	});
	function Ie(e, t, n) {
		let r = Re.value.find((t) => t.size_id === e);
		if (!r) return;
		let i = Ch(r, t);
		ze.value = {
			size_id: r.size_id,
			material_id: i?.material_id ?? t
		};
		let a = Fe(r);
		if (Be.value = i?.unprinted_hex ?? void 0, O((e) => {
			g.value?.roadsign ? Rh(e, a, m) : C.value === "basic" ? ap(e, a) : Ou(e, a);
			let t = i?.face_hex ?? null;
			t ? (e.root.substrate = { hex: t }, delete e.root.background) : delete e.root.substrate;
		}), n) for (let e of Ve) e(ze.value.size_id, ze.value.material_id);
	}
	let Le = /* @__PURE__ */ I(null), Re = J(() => Sh(Le.value)), ze = /* @__PURE__ */ I(null), Be = /* @__PURE__ */ I(/^#[0-9a-f]{6}$/i.test(Ml?.unprinted ?? "") ? Ml.unprinted : void 0), Ve = [];
	return {
		state: e,
		product: g,
		svg: v,
		findings: b,
		mode: C,
		selection: w,
		picker: T,
		history: te,
		view: Ne,
		rev: S,
		sizes: J(() => e.status === "ready" && p ? p.sizes : []),
		symbols: J(() => e.status === "ready" && p ? p.symbols : []),
		dataSource: J(() => e.status === "ready" && p ? p.source : ""),
		categories: J(() => e.status === "ready" && m ? m.categories : []),
		roundedByDefault: () => m?.ratios.CORNERS_ROUNDED ?? !0,
		shareRange: () => ({
			min: m?.ratios.MIN_SYMBOL_SHARE ?? .25,
			max: m?.ratios.MAX_SYMBOL_SHARE ?? .75
		}),
		currentSize: J(() => (S.value, _.value?.catalogue_size_id ?? null)),
		currentSymbol: J(() => (S.value, k(_.value ? sp(_.value) : void 0))),
		pickerCurrent: he,
		symbolEntry: k,
		board: je,
		roadSign: Me,
		offerPreset: N,
		title: Ce("title"),
		subtitle: Ce("subtitle"),
		lineInfo: (e) => (S.value, _.value ? M(e, yd(fu(_.value, e).block)) : {
			step: 0,
			label: "Auto",
			mm: 0,
			lines: 1
		}),
		document: _,
		designJson: () => JSON.stringify(_.value, null, 2),
		previewSvg: () => Pe(!1),
		printSvg: () => Pe(!0),
		init: ue,
		commit: O,
		undo: () => le(E, ee),
		redo: () => le(ee, E),
		setMode: j,
		resetToBasic: xe,
		openPicker: pe,
		closePicker: () => {
			T.value = null;
		},
		pickSymbol: me,
		review: n,
		saveReview: fe,
		tidied: o,
		tidyUp: be,
		canSuggest: r !== null,
		canPhoto: i !== null,
		suggestFromPhoto: ye,
		suggestion: a,
		describeText: s,
		suggest: ve,
		useAlternative: A,
		translatorName: c?.name ?? null,
		translatingIds: l,
		prepareTranslation: (t) => {
			e.translateError = "", c?.prepare?.(t).then(() => se(0)).catch(() => {});
		},
		translateAgain: () => {
			let e = _.value && Of(_.value)?.target.lang;
			e && c?.prepare?.(e).catch(() => {}), se(0, !0);
		},
		pickSizeById: (e, t, n, r) => {
			let i = p?.sizes.find((t) => t.size_id === e), a = t && n ? {
				size_id: e,
				name: i?.name ?? `${t}mm x ${n}mm`,
				width: t,
				height: n,
				symbol_position: r ?? i?.symbol_position ?? (t > n ? "left" : "above")
			} : i;
			a && O((e) => g.value?.roadsign ? Rh(e, a, m) : C.value === "basic" ? ap(e, a) : Ou(e, a));
		},
		setMaterialFace: (e) => {
			Be.value = e ?? void 0, O((t) => {
				e ? (t.root.substrate = { hex: e }, delete t.root.background) : delete t.root.substrate;
			});
		},
		cartReady: () => {
			S.value;
			let e = _.value;
			return !e || !m || $m(e) > 0 ? !1 : !Ac(e, m).some((e) => e.severity === "error");
		},
		variantSizes: Re,
		variantChoice: ze,
		setHostVariants: (e, t) => {
			Le.value = e;
			let n = Re.value;
			if (!n.length) return;
			let r = _.value?.root, i = n.find((e) => e.size_id === Number(t?.size_id)) ?? (r && n.find((e) => e.width === r.width && e.height === r.height)) ?? n[0], a = Ch(i, Number(t?.material_id));
			Ie(i.size_id, a?.material_id ?? 0, !1);
		},
		chooseVariant: (e, t) => Ie(e, t, !0),
		onVariant: (e) => {
			Ve.push(e);
		},
		onChange: (e) => {
			re.push(e);
		},
		setCustomSize: (e, t) => O((n) => Nu(n, e, t, p?.sizes ?? [])),
		currentDimensions: J(() => ({
			width: Ne.value.doc?.root.width ?? 0,
			height: Ne.value.doc?.root.height ?? 0
		})),
		pickSize: (e) => O((t) => C.value === "basic" ? ap(t, e) : Ou(t, e)),
		setText: (e, t) => O((n) => cp(n, e, t), `text:${e}`),
		setAlign: (e, t) => O((n) => lp(n, e, t)),
		setCaps: (e, t) => O((n) => up(n, e, t)),
		bumpSize: (e, t) => O((n) => fp(n, e, dp(n, e) + t))
	};
}
var bg = Symbol("editor");
function xg() {
	let e = Pn(bg);
	if (!e) throw Error("Editor not provided");
	return e;
}
//#endregion
//#region editor/src/components/ReviewPanel.vue?vue&type=script&setup=true&lang.ts
var Sg = {
	class: "card review-panel",
	"aria-label": "Review"
}, Cg = { class: "row-controls" }, wg = { class: "grow" }, Tg = {
	key: 0,
	class: "small muted"
}, Eg = { class: "row-controls wrap" }, Dg = ["disabled"], Og = ["disabled"], kg = {
	key: 0,
	class: "small",
	style: {
		margin: "0",
		color: "var(--danger)"
	},
	role: "alert"
}, Ag = /* @__PURE__ */ R({
	__name: "ReviewPanel",
	setup(e) {
		let t = xg(), n = J(() => t.state.reviewStatus), r = {
			pending: "Not recreated yet",
			review: "To review",
			needs_symbol: "Needs a symbol",
			unsuitable: "Not suitable",
			approved: "Approved",
			failed: "Failed"
		};
		return (e, i) => (V(), H("section", Sg, [
			W("div", Cg, [W("strong", wg, "Status: " + M(r[n.value] ?? n.value), 1), L(t).state.savedAt ? (V(), H("span", Tg, "Saved " + M(L(t).state.savedAt), 1)) : q("", !0)]),
			W("div", Eg, [W("button", {
				class: "btn",
				disabled: L(t).state.saving,
				onClick: i[0] ||= (e) => L(t).saveReview("review")
			}, "Save", 8, Dg), W("button", {
				class: "btn go grow",
				disabled: L(t).state.saving,
				onClick: i[1] ||= (e) => L(t).saveReview("approved")
			}, M(L(t).state.saving ? "Saving…" : "Save & approve"), 9, Og)]),
			L(t).state.saveError ? (V(), H("p", kg, M(L(t).state.saveError), 1)) : q("", !0),
			i[2] ||= W("p", {
				class: "small muted",
				style: { margin: "0" }
			}, "Approved designs are what “Customise me” will start from.", -1)
		]));
	}
}), jg = {
	class: "card tidy",
	"aria-labelledby": "tidy-heading"
}, Mg = { class: "row-controls" }, Ng = {
	key: 0,
	class: "small muted",
	style: { margin: "0" },
	role: "status"
}, Pg = {
	key: 1,
	class: "small",
	style: { margin: "0" },
	role: "status"
}, Fg = {
	key: 2,
	class: "row-controls wrap"
}, Ig = { class: "small grow" }, Lg = /* @__PURE__ */ R({
	__name: "TidyButton",
	setup(e) {
		let t = xg(), n = t.tidied, r = (e) => `${Math.round(e * 100)}%`;
		return (e, i) => (V(), H("section", jg, [
			W("div", Mg, [i[2] ||= W("div", { class: "grow" }, [W("strong", { id: "tidy-heading" }, "Tidy up the layout"), W("p", {
				class: "small muted",
				style: { margin: "0" }
			}, "Makes your wording as large as it can be on this sign.")], -1), W("button", {
				class: "btn strong",
				onClick: i[0] ||= (e) => L(t).tidyUp()
			}, "Tidy up")]),
			L(n) && !L(n).changed ? (V(), H("p", Ng, " Already as good as it gets on this size. ")) : L(n) ? (V(), H("p", Pg, [
				L(n).notes.length ? (V(), H(B, { key: 0 }, [K(M(L(n).notes.join(", ")) + ".", 1)], 64)) : q("", !0),
				L(n).after > L(n).before ? (V(), H(B, { key: 1 }, [K(" Text now fits at " + M(r(L(n).after)) + " of the recommended size (was " + M(r(L(n).before)) + "). ", 1)], 64)) : q("", !0),
				i[3] ||= K(" You can undo this. ", -1)
			])) : q("", !0),
			L(n)?.suggestion ? (V(), H("div", Fg, [W("span", Ig, " Your wording is tight here. A " + M(L(n).suggestion.size.width) + "×" + M(L(n).suggestion.size.height) + " mm sign suits it better: letters " + M(L(n).suggestion.gain) + " mm bigger for much the same sign. ", 1), W("button", {
				class: "btn small-btn",
				onClick: i[1] ||= (e) => {
					L(t).pickSize(L(n).suggestion.size), L(t).tidyUp();
				}
			}, " Use " + M(L(n).suggestion.size.width) + "×" + M(L(n).suggestion.size.height), 1)])) : q("", !0)
		]));
	}
}), Rg = ["maxlength", "disabled"], zg = ["disabled"], Bg = {
	key: 0,
	class: "spinner dark",
	"aria-hidden": "true"
}, Vg = ["disabled"], Hg = { class: "small describe-hint photo-drop-hint" }, Ug = {
	key: 1,
	class: "small describe-error",
	role: "alert"
}, Wg = {
	key: 2,
	class: "small describe-hint",
	role: "status"
}, Gg = {
	key: 3,
	class: "describe-result",
	role: "status"
}, Kg = {
	key: 0,
	class: "small",
	style: { margin: "0" }
}, qg = { class: "alt-tiles" }, Jg = [
	"title",
	"aria-label",
	"aria-busy",
	"onClick"
], Yg = ["src"], Xg = {
	key: 4,
	class: "small describe-hint"
}, Zg = /* @__PURE__ */ R({
	__name: "DescribeCard",
	setup(e) {
		let t = xg(), n = /* @__PURE__ */ I(null), r = /* @__PURE__ */ I(!1), i = (e) => {
			e && t.suggestFromPhoto(e);
		};
		function a(e) {
			let t = e.target, n = t.files?.[0];
			t.value = "", i(n);
		}
		let o = (e, t) => {
			for (let t of e ?? []) if (t.kind === "file") {
				let e = t.getAsFile();
				if (e?.type.startsWith("image/")) return e;
			}
			return [...t ?? []].find((e) => e.type.startsWith("image/")) ?? null;
		};
		function s(e) {
			r.value = !1, i(o(e.dataTransfer?.items, e.dataTransfer?.files));
		}
		function c(e) {
			let t = o(e.clipboardData?.items, e.clipboardData?.files);
			t && (e.preventDefault(), i(t));
		}
		let l = t.describeText, u = J(() => {
			let e = t.suggestion.value;
			return e && e.description === l.value.trim() ? e : null;
		});
		function d() {
			l.value.trim() && t.suggest(l.value);
		}
		return (e, i) => (V(), H("section", {
			class: "card dark describe",
			"aria-labelledby": "describe-label",
			onPaste: c
		}, [
			i[10] ||= W("label", {
				id: "describe-label",
				for: "describe",
				style: { "font-weight": "600" }
			}, "Describe your sign", -1),
			W("form", {
				class: "row-controls",
				onSubmit: po(d, ["prevent"])
			}, [jn(W("input", {
				id: "describe",
				"onUpdate:modelValue": i[0] ||= (e) => /* @__PURE__ */ Kt(l) ? l.value = e : null,
				class: "field",
				style: { border: "0" },
				maxlength: L(300),
				placeholder: "e.g. DANGER 450 volts, keep out",
				autocomplete: "off",
				disabled: L(t).state.suggesting
			}, null, 8, Rg), [[lo, L(l)]]), W("button", {
				class: "btn accent",
				type: "submit",
				disabled: L(t).state.suggesting || !L(l).trim()
			}, [L(t).state.suggesting ? (V(), H("span", Bg)) : q("", !0), K(" " + M(L(t).state.suggesting ? "Designing…" : "Suggest"), 1)], 8, zg)], 32),
			L(t).canPhoto ? (V(), H("div", {
				key: 0,
				class: he(["photo-row", { dragging: r.value }]),
				onDragover: i[2] ||= po((e) => r.value = !0, ["prevent"]),
				onDragenter: i[3] ||= po((e) => r.value = !0, ["prevent"]),
				onDragleave: i[4] ||= (e) => r.value = !1,
				onDrop: po(s, ["prevent"])
			}, [
				W("input", {
					ref_key: "photoInput",
					ref: n,
					class: "sr-only",
					type: "file",
					accept: "image/jpeg,image/png,image/webp,image/gif",
					onChange: a
				}, null, 544),
				W("button", {
					class: "btn small-btn",
					disabled: L(t).state.suggesting,
					onClick: i[1] ||= (e) => n.value?.click()
				}, [...i[5] ||= [W("svg", {
					viewBox: "0 0 24 24",
					width: "16",
					height: "16",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "2",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"aria-hidden": "true"
				}, [W("path", { d: "M3 8h3l2-2h8l2 2h3v12H3z" }), W("circle", {
					cx: "12",
					cy: "13",
					r: "3.5"
				})], -1), K(" Upload a photo ", -1)]], 8, Vg),
				W("span", Hg, M(r.value ? "Drop the photo here" : "or drag one here, or paste it"), 1)
			], 34)) : q("", !0),
			L(t).state.suggestError ? (V(), H("p", Ug, M(L(t).state.suggestError), 1)) : L(t).state.suggesting ? (V(), H("p", Wg, "Reading your sign: symbols, wording and a size…")) : u.value ? (V(), H("div", Gg, [
				u.value.note ? (V(), H("p", Kg, M(u.value.note), 1)) : q("", !0),
				u.value.alternatives.length ? (V(), H(B, { key: 1 }, [i[6] ||= W("span", { class: "small describe-hint" }, "Other symbols that could fit:", -1), W("div", qg, [(V(!0), H(B, null, z(u.value.alternatives, (e) => (V(), H("button", {
					key: e,
					class: "alt-tile",
					title: L(t).symbolEntry(e)?.name ?? e,
					"aria-label": `Use ${L(t).symbolEntry(e)?.name ?? e} (${e})`,
					"aria-busy": L(t).state.symbolBusy === e,
					onClick: (n) => L(t).useAlternative(e)
				}, [W("img", {
					src: L(t).symbolEntry(e)?.url,
					alt: ""
				}, null, 8, Yg), W("span", null, M(e), 1)], 8, Jg))), 128))])], 64)) : q("", !0),
				i[7] ||= W("span", { class: "small describe-hint" }, "Change anything below. Undo takes you back.", -1)
			])) : (V(), H("p", Xg, [
				i[8] ||= K(" Tell us what the sign is for", -1),
				L(t).canPhoto ? (V(), H(B, { key: 0 }, [K(", or send a photo of one you already have")], 64)) : q("", !0),
				i[9] ||= K("; we’ll suggest symbols, wording and a size. ", -1)
			]))
		], 32));
	}
}), Qg = ["innerHTML"], $g = "http://www.w3.org/2000/svg", e_ = /* @__PURE__ */ R({
	__name: "SignPreview",
	props: {
		svg: {},
		label: {},
		interactive: {
			type: Boolean,
			default: !1
		},
		highlights: { default: () => [] },
		dragItem: {},
		movables: {}
	},
	emits: ["pick", "drop"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ I(null), a = /* @__PURE__ */ I(null), o = /* @__PURE__ */ I(null), s = /* @__PURE__ */ I(!1), c = null, l = () => a.value?.querySelector("svg") ?? null;
		function u() {
			let e = l();
			if (!e || !i.value) return;
			let [, , t = 1, r = 1] = (e.getAttribute("viewBox") ?? "").split(" ").map(Number), a = getComputedStyle(i.value), o = i.value.clientWidth - parseFloat(a.paddingLeft) - parseFloat(a.paddingRight);
			if (o <= 0) return;
			let s = Math.min(window.innerHeight * .72, 720), c = Math.min(o / t, s / r);
			e.style.width = `${t * c}px`, e.style.height = `${r * c}px`, e.setAttribute("role", "img"), e.setAttribute("aria-label", n.label), g();
		}
		function d(e) {
			let t = l();
			if (!t) return null;
			let n = null;
			for (let r of e) for (let e of t.querySelectorAll(`#artwork [data-source="${CSS.escape(r)}"]`)) {
				let t = e.getBBox();
				(t.width || t.height) && (n = n ? {
					x1: Math.min(n.x1, t.x),
					y1: Math.min(n.y1, t.y),
					x2: Math.max(n.x2, t.x + t.width),
					y2: Math.max(n.y2, t.y + t.height)
				} : {
					x1: t.x,
					y1: t.y,
					x2: t.x + t.width,
					y2: t.y + t.height
				});
			}
			return n ? new DOMRect(n.x1, n.y1, n.x2 - n.x1, n.y2 - n.y1) : null;
		}
		function f() {
			let e = l(), [, , t = 1] = (e?.getAttribute("viewBox") ?? "").split(" ").map(Number);
			return e ? t / Math.max(1, e.getBoundingClientRect().width) : 1;
		}
		function p(e, t, n, r) {
			let i = f(), a = r * i, o = document.createElementNS($g, "rect");
			o.setAttribute("x", String(t.x - a)), o.setAttribute("y", String(t.y - a)), o.setAttribute("width", String(t.width + 2 * a)), o.setAttribute("height", String(t.height + 2 * a)), o.setAttribute("rx", String(4 * i)), o.setAttribute("class", n), o.setAttribute("stroke-width", String((n === "ov-selected" ? 3 : 2) * i)), n !== "ov-selected" && o.setAttribute("stroke-dasharray", `${6 * i} ${4 * i}`), e.appendChild(o);
		}
		function m(e) {
			let t = l();
			if (!t) return null;
			t.querySelector(`#${e}`)?.remove();
			let n = document.createElementNS($g, "g");
			return n.setAttribute("id", e), n.setAttribute("pointer-events", "none"), t.appendChild(n), n;
		}
		function h(e, t, n) {
			let r = f(), i = document.createElementNS($g, "rect");
			if (i.setAttribute("x", String(t.x)), i.setAttribute("y", String(t.y)), i.setAttribute("width", String(t.width)), i.setAttribute("height", String(t.height)), i.setAttribute("class", "ov-busy"), e.appendChild(i), !n) return;
			let a = 14 * r, o = Math.min(t.width - 8 * r, (n.length * .56 + 3.4) * a), s = a * 2.2, c = t.x + (t.width - o) / 2, l = t.y + (t.height - s) / 2, u = document.createElementNS($g, "rect");
			for (let [e, t] of Object.entries({
				x: c,
				y: l,
				width: o,
				height: s,
				rx: s / 2
			})) u.setAttribute(e, String(t));
			u.setAttribute("class", "ov-pill");
			let d = document.createElementNS($g, "circle");
			for (let [e, t] of Object.entries({
				cx: c + s / 2 + 2 * r,
				cy: l + s / 2,
				r: a * .45
			})) d.setAttribute(e, String(t));
			d.setAttribute("class", "ov-spin"), d.setAttribute("stroke-width", String(2 * r)), d.setAttribute("pathLength", "100");
			let p = document.createElementNS($g, "text");
			p.setAttribute("x", String(c + s - r + (o - s) / 2)), p.setAttribute("y", String(l + s / 2)), p.setAttribute("font-size", String(a)), p.setAttribute("class", "ov-label"), p.textContent = n, e.append(u, d, p);
		}
		function g() {
			let e = n.highlights.filter((e) => n.interactive || e.kind === "busy");
			if (!e.length) {
				l()?.querySelector("#ui-overlay")?.remove();
				return;
			}
			let t = m("ui-overlay");
			if (t) for (let n of e) {
				let e = d(n.ids);
				e && (n.kind === "busy" ? h(t, e, n.label ?? "") : p(t, e, n.kind === "selected" ? "ov-selected" : "ov-panel", n.kind === "selected" ? 6 : 3));
			}
		}
		function _() {
			let e = l();
			if (!e || (e.querySelector("#ui-movable")?.remove(), !n.interactive || !s.value || b?.dragging)) return;
			let t = n.movables?.() ?? [];
			if (t.length < 2) return;
			let r = m("ui-movable");
			if (r) for (let e of t) {
				let t = d(e.ids);
				t && p(r, t, e.key === o.value ? "ov-hover" : "ov-movable", 4);
			}
		}
		function v() {
			n.interactive && (s.value = !0, _());
		}
		function y() {
			s.value = !1, o.value = null, l()?.querySelector("#ui-movable")?.remove();
		}
		let b = null, x = (e, t) => document.elementFromPoint(e, t)?.closest("#artwork [data-source]")?.getAttribute("data-source") ?? null;
		function S(e, t) {
			let n = l(), r = n?.getScreenCTM();
			if (!n || !r) return {
				x: 0,
				y: 0
			};
			let i = new DOMPoint(e, t).matrixTransform(r.inverse());
			return {
				x: i.x,
				y: i.y
			};
		}
		function C(e) {
			let t = l();
			if (t?.querySelectorAll(".ov-dragging").forEach((e) => e.classList.remove("ov-dragging")), t && e) for (let n of e.ids) t.querySelectorAll(`#artwork [data-source="${CSS.escape(n)}"]`).forEach((e) => e.classList.add("ov-dragging"));
		}
		function w(e) {
			if (!n.interactive || e.button !== 0) return;
			let t = x(e.clientX, e.clientY), r = e.pointerType === "touch" ? null : n.dragItem?.(t) ?? null;
			b = {
				x: e.clientX,
				y: e.clientY,
				source: t,
				item: r,
				dragging: !1,
				target: null
			}, r && e.currentTarget.setPointerCapture(e.pointerId);
		}
		function T(e) {
			if (!b?.item) {
				if (!n.interactive || e.pointerType === "touch") return;
				let t = n.dragItem?.(x(e.clientX, e.clientY)) ?? null;
				if ((t?.key ?? null) === o.value && s.value) return;
				o.value = t?.key ?? null, s.value = !0, _();
				return;
			}
			if (!b.dragging && Math.hypot(e.clientX - b.x, e.clientY - b.y) < 6) return;
			b.dragging || (b.dragging = !0, C(b.item), l()?.querySelector("#ui-movable")?.remove());
			let t = n.dragItem?.(x(e.clientX, e.clientY)) ?? null, r = t && t.group === b.item.group && t.key !== b.item.key ? t : null;
			if (r?.key === b.target?.key) return;
			b.target = r;
			let i = m("ui-drop"), a = r ? d(r.ids) : null;
			i && a && p(i, a, "ov-drop", 5);
		}
		function E(e) {
			let t = b;
			if (b = null, t) {
				if (t.dragging) {
					C(null), m("ui-drop")?.remove(), t.item && t.target && r("drop", t.item.key, t.target.key), vn(_);
					return;
				}
				r("pick", t.source, S(e.clientX, e.clientY));
			}
		}
		function ee() {
			b = null, C(null), m("ui-drop")?.remove(), _();
		}
		return Ln(() => n.svg, () => vn(() => {
			u(), _();
		})), Ln(() => [n.highlights, n.interactive], () => vn(() => {
			g(), _();
		}), { deep: !0 }), sr(() => {
			c = new ResizeObserver(u), i.value && c.observe(i.value), u();
		}), ur(() => c?.disconnect()), (e, t) => (V(), H("div", {
			ref_key: "stage",
			ref: i,
			class: he(["stage", { interactive: n.interactive }]),
			style: { overflow: "hidden" }
		}, [W("div", {
			ref_key: "holder",
			ref: a,
			innerHTML: n.svg,
			class: he({ grabbable: o.value !== null }),
			onPointerdown: w,
			onPointermove: T,
			onPointerup: E,
			onPointercancel: ee,
			onPointerenter: v,
			onPointerleave: y
		}, null, 42, Qg)], 2));
	}
}), t_ = { class: "scale-panel" }, n_ = { class: "step-head" }, r_ = {
	key: 0,
	class: "notice",
	role: "alert"
}, i_ = {
	key: 1,
	class: "small muted"
}, a_ = ["viewBox"], o_ = [
	"y1",
	"x2",
	"y2"
], s_ = [
	"y",
	"width",
	"height"
], c_ = [
	"y",
	"width",
	"height"
], l_ = ["cx", "cy"], u_ = ["innerHTML"], d_ = {
	key: 3,
	class: "small muted",
	style: { margin: "0" }
}, f_ = 1500, p_ = 180, m_ = /* @__PURE__ */ R({
	__name: "ScalePreview",
	emits: ["close"],
	setup(e, { emit: t }) {
		let n = xg(), r = t, i = {
			w: 762,
			h: 1981
		}, a = /* @__PURE__ */ I(""), o = /* @__PURE__ */ I(!1);
		sr(async () => {
			try {
				a.value = await n.previewSvg();
			} catch {
				o.value = !0;
			}
		});
		let s = J(() => {
			let e = n.view.value.doc?.root;
			return {
				w: e?.width ?? 0,
				h: e?.height ?? 0
			};
		}), c = J(() => s.value.w <= i.w - 120 && s.value.h <= 1200), l = J(() => {
			let e = s.value, t = c.value ? i.w : i.w + p_ + e.w, n = i.h + 90, r = c.value ? (i.w - e.w) / 2 : i.w + p_, a = n - f_ - e.h / 2, o = (e, t) => `${e / t * 100}%`;
			return {
				width: t,
				height: n,
				box: {
					left: o(r, t),
					top: o(a, n),
					width: o(e.w, t),
					height: o(e.h, n)
				}
			};
		});
		return (e, t) => (V(), H("div", {
			class: "scale-backdrop",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Your sign at true scale",
			onClick: t[1] ||= po((e) => r("close"), ["self"])
		}, [W("div", t_, [
			W("div", n_, [t[2] ||= W("h2", { class: "grow" }, "Your sign, actual size", -1), W("button", {
				class: "icon-btn",
				"aria-label": "Close",
				onClick: t[0] ||= (e) => r("close")
			}, "×")]),
			o.value ? (V(), H("p", r_, "The artwork could not be prepared. Please try again.")) : a.value ? q("", !0) : (V(), H("p", i_, "Preparing the artwork…")),
			a.value ? (V(), H("div", {
				key: 2,
				class: "scale-stage",
				style: k({ aspectRatio: `${l.value.width} / ${l.value.height}` })
			}, [(V(), H("svg", {
				class: "scale-door",
				viewBox: `0 0 ${l.value.width} ${l.value.height}`,
				"aria-hidden": "true"
			}, [
				W("line", {
					x1: 0,
					y1: l.value.height,
					x2: l.value.width,
					y2: l.value.height,
					class: "floor"
				}, null, 8, o_),
				W("rect", {
					x: 0,
					y: l.value.height - i.h,
					width: i.w,
					height: i.h,
					class: "frame"
				}, null, 8, s_),
				W("rect", {
					x: 28,
					y: l.value.height - i.h + 28,
					width: i.w - 56,
					height: i.h - 56,
					class: "leaf"
				}, null, 8, c_),
				W("circle", {
					cx: i.w - 90,
					cy: l.value.height - 1050,
					r: "26",
					class: "knob"
				}, null, 8, l_)
			], 8, a_)), W("div", {
				class: "scale-sign",
				style: k(l.value.box),
				innerHTML: a.value
			}, null, 12, u_)], 4)) : q("", !0),
			a.value ? (V(), H("p", d_, [
				K(M(s.value.w) + " × " + M(s.value.h) + " mm, shown against a standard door (" + M(i.w) + " × " + M(i.h) + " mm) ", 1),
				c.value ? (V(), H(B, { key: 0 }, [K(" at the usual height")], 64)) : q("", !0),
				t[3] ||= K(". ", -1)
			])) : q("", !0)
		])]));
	}
}), h_ = {
	class: "card",
	"aria-labelledby": "size-heading"
}, g_ = { class: "step-head" }, __ = { class: "step-no" }, v_ = {
	class: "chips",
	role: "group",
	"aria-label": "Sign size in millimetres"
}, y_ = [
	"aria-pressed",
	"title",
	"onClick"
], b_ = {
	key: 0,
	class: "custom-size"
}, x_ = {
	class: "label",
	id: "custom-label"
}, S_ = {
	class: "row-controls",
	role: "group",
	"aria-labelledby": "custom-label"
}, C_ = ["min", "max"], w_ = ["min", "max"], T_ = [
	"aria-pressed",
	"aria-label",
	"title"
], E_ = {
	viewBox: "0 0 20 20",
	width: "18",
	height: "18",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"aria-hidden": "true"
}, D_ = {
	key: 0,
	d: "M7 9V6.5a3 3 0 0 1 6 0V9"
}, O_ = {
	key: 1,
	d: "M7 9V6.5a3 3 0 0 1 5.8-1.1"
}, k_ = {
	class: "small muted",
	style: { margin: "0" }
}, A_ = /* @__PURE__ */ R({
	__name: "SizeStep",
	props: {
		sizes: {},
		current: {},
		step: { default: 1 },
		custom: {
			type: Boolean,
			default: !1
		},
		dimensions: { default: () => ({
			width: 0,
			height: 0
		}) }
	},
	emits: ["pick", "custom"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ I(n.dimensions.width), a = /* @__PURE__ */ I(n.dimensions.height), o = /* @__PURE__ */ I(!0);
		Ln(() => n.dimensions, (e) => {
			i.value = e.width, a.value = e.height;
		});
		function s(e) {
			let t = n.dimensions, s = Mu(e === "width" ? i.value : a.value, e, t, o.value);
			i.value = s.width, a.value = s.height, (s.width !== t.width || s.height !== t.height) && r("custom", s.width, s.height);
		}
		return (t, n) => (V(), H("section", h_, [
			W("div", g_, [W("span", __, M(e.step), 1), n[9] ||= W("h2", { id: "size-heading" }, "Size & material", -1)]),
			W("div", v_, [(V(!0), H(B, null, z(e.sizes, (t) => (V(), H("button", {
				key: t.size_id,
				class: "chip",
				"aria-pressed": t.size_id === e.current,
				title: t.name,
				onClick: (e) => r("pick", t)
			}, M(t.width) + "×" + M(t.height), 9, y_))), 128))]),
			e.custom ? (V(), H("div", b_, [
				W("span", x_, [n[12] ||= K(" Custom size (mm)", -1), e.current === null ? (V(), H(B, { key: 0 }, [n[10] ||= K(" · ", -1), n[11] ||= W("strong", null, "in use", -1)], 64)) : q("", !0)]),
				W("div", S_, [
					n[14] ||= W("label", {
						class: "sr-only",
						for: "custom-w"
					}, "Width in millimetres", -1),
					jn(W("input", {
						id: "custom-w",
						"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
						class: "field compact size-input",
						type: "number",
						inputmode: "numeric",
						min: L(50),
						max: L(Au),
						onChange: n[1] ||= (e) => s("width"),
						onFocus: n[2] ||= (e) => e.target.select(),
						onKeydown: n[3] ||= ho(po((e) => e.target.blur(), ["prevent"]), ["enter"])
					}, null, 40, C_), [[
						lo,
						i.value,
						void 0,
						{ number: !0 }
					]]),
					n[15] ||= W("span", { "aria-hidden": "true" }, "×", -1),
					n[16] ||= W("label", {
						class: "sr-only",
						for: "custom-h"
					}, "Height in millimetres", -1),
					jn(W("input", {
						id: "custom-h",
						"onUpdate:modelValue": n[4] ||= (e) => a.value = e,
						class: "field compact size-input",
						type: "number",
						inputmode: "numeric",
						min: L(50),
						max: L(Au),
						onChange: n[5] ||= (e) => s("height"),
						onFocus: n[6] ||= (e) => e.target.select(),
						onKeydown: n[7] ||= ho(po((e) => e.target.blur(), ["prevent"]), ["enter"])
					}, null, 40, w_), [[
						lo,
						a.value,
						void 0,
						{ number: !0 }
					]]),
					W("button", {
						class: "icon-btn lock",
						"aria-pressed": o.value,
						"aria-label": o.value ? "Aspect ratio locked" : "Aspect ratio unlocked",
						title: o.value ? "Keeping the shape: click to unlock" : "Click to keep the shape",
						onClick: n[8] ||= (e) => o.value = !o.value
					}, [(V(), H("svg", E_, [n[13] ||= W("rect", {
						x: "4",
						y: "9",
						width: "12",
						height: "8",
						rx: "1.5"
					}, null, -1), o.value ? (V(), H("path", D_)) : (V(), H("path", O_))]))], 8, T_)
				]),
				W("p", k_, "Short side " + M(L(50)) + "–" + M(L(ku)) + " mm, long side up to " + M(L(Au)) + " mm. Press Enter to apply.", 1)
			])) : q("", !0),
			n[17] ||= W("label", {
				class: "label",
				for: "material"
			}, "Material", -1),
			n[18] ||= W("select", {
				id: "material",
				class: "field"
			}, [W("option", null, "Self Adhesive Vinyl Sticker"), W("option", null, "Heavy Duty Double Sided")], -1),
			n[19] ||= W("p", {
				class: "small muted",
				style: { margin: "0" }
			}, "Test site: materials and prices will come from the shop.", -1)
		]));
	}
}), j_ = {
	class: "card",
	"aria-labelledby": "variant-heading"
}, M_ = { class: "step-head" }, N_ = { class: "step-no" }, P_ = {
	class: "chips",
	role: "group",
	"aria-label": "Sign size"
}, F_ = [
	"aria-pressed",
	"title",
	"onClick"
], I_ = {
	class: "chips wide",
	role: "group",
	"aria-labelledby": "material-label"
}, L_ = ["aria-pressed", "onClick"], R_ = /* @__PURE__ */ R({
	__name: "VariantStep",
	props: { step: { default: 1 } },
	setup(e) {
		let t = e, n = xg(), r = n.variantSizes, i = n.variantChoice, a = J(() => r.value.find((e) => e.size_id === i.value?.size_id) ?? r.value[0]), o = J(() => a.value?.materials ?? []), s = (e) => n.chooseVariant(e, i.value?.material_id ?? 0), c = (e) => n.chooseVariant(a.value?.size_id ?? 0, e);
		return (e, n) => (V(), H("section", j_, [
			W("div", M_, [W("span", N_, M(t.step), 1), n[0] ||= W("h2", { id: "variant-heading" }, "Size & material", -1)]),
			W("div", P_, [(V(!0), H(B, null, z(L(r), (e) => (V(), H("button", {
				key: e.size_id,
				class: "chip",
				"aria-pressed": e.size_id === a.value?.size_id,
				title: e.name,
				onClick: (t) => s(e.size_id)
			}, M(e.width) + "×" + M(e.height), 9, F_))), 128))]),
			n[1] ||= W("span", {
				class: "label",
				id: "material-label"
			}, "Material", -1),
			W("div", I_, [(V(!0), H(B, null, z(o.value, (e) => (V(), H("button", {
				key: e.material_id,
				class: "chip",
				"aria-pressed": e.material_id === L(i)?.material_id,
				onClick: (t) => c(e.material_id)
			}, M(e.name), 9, L_))), 128))])
		]));
	}
}), z_ = {
	class: "card outlined",
	"aria-labelledby": "picker-heading"
}, B_ = { class: "step-head" }, V_ = {
	id: "picker-heading",
	class: "grow"
}, H_ = {
	class: "label",
	for: "symbol-search"
}, U_ = {
	key: 0,
	class: "tabs",
	role: "group",
	"aria-label": "Symbol categories"
}, W_ = ["aria-pressed", "onClick"], G_ = {
	class: "small muted",
	"aria-live": "polite"
}, K_ = {
	key: 1,
	class: "notice",
	style: { margin: "0" }
}, q_ = { class: "tiles" }, J_ = [
	"aria-pressed",
	"aria-busy",
	"onClick"
], Y_ = ["src"], X_ = { class: "name" }, Z_ = { class: "small muted" }, Q_ = {
	key: 2,
	class: "muted",
	style: { margin: "0" }
}, $_ = /* @__PURE__ */ R({
	__name: "SymbolPicker",
	props: {
		symbols: {},
		categories: {},
		preferred: {},
		current: {},
		busy: {},
		error: {},
		noun: {}
	},
	emits: ["pick", "done"],
	setup(e, { emit: t }) {
		let n = e, r = J(() => n.noun ?? "symbol"), i = J(() => `${r.value}s`), a = J(() => /^[aeiou]/i.test(r.value) ? "an" : "a"), o = t, s = /* @__PURE__ */ I(""), c = /* @__PURE__ */ I(n.preferred ?? "all"), l = /* @__PURE__ */ I(null);
		sr(() => l.value?.focus());
		let u = J(() => {
			let e = n.categories.filter((e) => n.symbols.some((t) => t.category === e.key));
			return [{
				key: "all",
				title: "All"
			}, ...(n.preferred ? [...e.filter((e) => e.key === n.preferred), ...e.filter((e) => e.key !== n.preferred)] : e).map((e) => ({
				key: e.key,
				title: e.title
			}))];
		}), d = J(() => s.value.trim() ? n.symbols.filter((e) => Hm(e, s.value)) : n.symbols.filter((e) => c.value === "all" || e.category === c.value));
		return (t, n) => (V(), H("section", z_, [
			W("div", B_, [W("h2", V_, "Choose " + M(a.value) + " " + M(r.value), 1), W("button", {
				class: "btn go",
				style: {
					height: "40px",
					"font-size": "15px"
				},
				onClick: n[0] ||= (e) => o("done")
			}, "Done")]),
			W("label", H_, "Search " + M(i.value) + " by what the sign is for", 1),
			jn(W("input", {
				id: "symbol-search",
				ref_key: "search",
				ref: l,
				"onUpdate:modelValue": n[1] ||= (e) => s.value = e,
				class: "field",
				style: { border: "2px solid var(--ink)" },
				placeholder: "e.g. smoking, forklift, ear protection",
				autocomplete: "off"
			}, null, 512), [[lo, s.value]]),
			s.value.trim() ? q("", !0) : (V(), H("div", U_, [(V(!0), H(B, null, z(u.value, (e) => (V(), H("button", {
				key: e.key,
				class: "tab",
				"aria-pressed": c.value === e.key,
				onClick: (t) => c.value = e.key
			}, M(e.title), 9, W_))), 128))])),
			W("div", G_, M(s.value.trim() ? `${d.value.length} match${d.value.length === 1 ? "" : "es"}` : `${d.value.length} ${i.value}`), 1),
			e.error ? (V(), H("p", K_, M(e.error), 1)) : q("", !0),
			W("div", q_, [(V(!0), H(B, null, z(d.value, (t) => (V(), H("button", {
				key: t.code,
				class: "tile",
				"aria-pressed": t.code === e.current,
				"aria-busy": e.busy === t.code,
				onClick: (e) => o("pick", t)
			}, [
				W("img", {
					src: t.url,
					alt: "",
					loading: "lazy"
				}, null, 8, Y_),
				W("span", X_, M(t.name), 1),
				W("span", Z_, M(t.code), 1)
			], 8, J_))), 128))]),
			d.value.length ? q("", !0) : (V(), H("p", Q_, "No " + M(i.value) + " match “" + M(s.value) + "”.", 1)),
			W("button", {
				class: "btn go picker-done",
				onClick: n[2] ||= (e) => o("done")
			}, "Done")
		]));
	}
}), ev = {
	class: "card",
	"aria-labelledby": "symbol-heading"
}, tv = { class: "step-head" }, nv = {
	key: 0,
	class: "current-symbol"
}, rv = ["src"], iv = { style: { "font-weight": "600" } }, av = { class: "small muted" }, ov = /* @__PURE__ */ R({
	__name: "SymbolStep",
	props: { current: {} },
	emits: ["change"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (V(), H("section", ev, [W("div", tv, [
			r[1] ||= W("span", { class: "step-no" }, "2", -1),
			r[2] ||= W("h2", {
				id: "symbol-heading",
				class: "grow"
			}, "Symbol", -1),
			W("button", {
				class: "btn strong",
				onClick: r[0] ||= (e) => n("change")
			}, "Change symbol")
		]), e.current ? (V(), H("div", nv, [W("img", {
			src: e.current.url,
			alt: ""
		}, null, 8, rv), W("div", null, [W("div", iv, M(e.current.name), 1), W("div", av, M(e.current.code) + " · ISO 7010", 1)])])) : q("", !0)]));
	}
}), sv = ["aria-label"], cv = [
	"aria-pressed",
	"aria-label",
	"onClick"
], lv = {
	viewBox: "0 0 20 22",
	width: "18",
	height: "18",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"aria-hidden": "true"
}, uv = ["d"], dv = /* @__PURE__ */ R({
	__name: "AlignButtons",
	props: {
		align: {},
		label: {}
	},
	emits: ["align"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = [
			{
				key: "left",
				label: "left",
				path: "M3 5H17M3 9H12M3 13H17M3 17H12"
			},
			{
				key: "centre",
				label: "centre",
				path: "M3 5H17M6 9H14M3 13H17M6 17H14"
			},
			{
				key: "right",
				label: "right",
				path: "M3 5H17M8 9H17M3 13H17M8 17H17"
			}
		];
		return (e, t) => (V(), H("div", {
			class: "aligns",
			role: "group",
			"aria-label": `${n.label} alignment`
		}, [(V(), H(B, null, z(i, (e) => W("button", {
			key: e.key,
			"aria-pressed": n.align === e.key,
			"aria-label": `Align ${e.label}`,
			onClick: (t) => r("align", e.key)
		}, [(V(), H("svg", lv, [W("path", { d: e.path }, null, 8, uv)]))], 8, cv)), 64))], 8, sv));
	}
}), fv = { style: {
	display: "flex",
	"flex-direction": "column",
	gap: "8px"
} }, pv = ["for"], mv = [
	"id",
	"value",
	"placeholder"
], hv = { class: "line-controls" }, gv = ["aria-label"], _v = ["title"], vv = { key: 0 }, yv = ["aria-label"], bv = ["aria-pressed", "aria-label"], xv = /* @__PURE__ */ R({
	__name: "TextLine",
	props: {
		id: {},
		label: {},
		text: {},
		align: {},
		caps: { type: Boolean },
		sizeLabel: {},
		mm: {},
		placeholder: {}
	},
	emits: [
		"text",
		"bump",
		"align",
		"caps"
	],
	setup(e, { emit: t }) {
		let n = e, r = t;
		return (e, t) => (V(), H("div", fv, [
			W("label", {
				class: "label",
				for: n.id
			}, M(n.label), 9, pv),
			W("input", {
				id: n.id,
				class: he(["field", { caps: n.caps }]),
				value: n.text,
				placeholder: n.placeholder,
				autocomplete: "off",
				onInput: t[0] ||= (e) => r("text", e.target.value)
			}, null, 42, mv),
			W("div", hv, [
				W("button", {
					class: "stepper",
					"aria-label": `${n.label} smaller`,
					onClick: t[1] ||= (e) => r("bump", -1)
				}, "A−", 8, gv),
				W("span", {
					class: "step-label",
					title: n.mm ? `Letters ${n.mm} mm tall` : ""
				}, [K(M(n.sizeLabel), 1), n.mm ? (V(), H("small", vv, M(n.mm) + " mm", 1)) : q("", !0)], 8, _v),
				W("button", {
					class: "stepper",
					style: { "font-size": "17px" },
					"aria-label": `${n.label} larger`,
					onClick: t[2] ||= (e) => r("bump", 1)
				}, "A+", 8, yv),
				W("button", {
					class: "stepper caps-toggle",
					"aria-pressed": n.caps,
					"aria-label": `${n.label} in capitals`,
					title: "CAPITALS",
					onClick: t[3] ||= (e) => r("caps", !n.caps)
				}, "AA", 8, bv),
				G(dv, {
					align: n.align,
					label: n.label,
					onAlign: t[4] ||= (e) => r("align", e)
				}, null, 8, ["align", "label"])
			])
		]));
	}
}), Sv = {
	class: "card",
	"aria-labelledby": "layout-heading"
}, Cv = [
	"aria-pressed",
	"title",
	"onClick"
], wv = {
	key: 0,
	viewBox: "0 0 30 40",
	width: "30",
	height: "40",
	"aria-hidden": "true"
}, Tv = {
	key: 1,
	viewBox: "0 0 30 40",
	width: "30",
	height: "40",
	"aria-hidden": "true"
}, Ev = {
	key: 2,
	viewBox: "0 0 40 30",
	width: "40",
	height: "30",
	"aria-hidden": "true"
}, Dv = {
	key: 3,
	viewBox: "0 0 40 30",
	width: "40",
	height: "30",
	"aria-hidden": "true"
}, Ov = /* @__PURE__ */ R({
	__name: "LayoutStep",
	props: {
		current: {},
		only: {}
	},
	emits: ["pick"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = [
			{
				kind: "single",
				label: "Single",
				hint: "One symbol and its text"
			},
			{
				kind: "multi",
				label: "Multiple symbols",
				hint: "Several symbols over one set of text"
			},
			{
				kind: "stacked",
				label: "Stacked",
				hint: "Two or more symbol-and-text sections, one under another"
			},
			{
				kind: "grid",
				label: "Grid",
				hint: "Rows and columns of complete little signs"
			}
		];
		return (t, a) => (V(), H("section", Sv, [a[4] ||= W("div", { class: "step-head" }, [W("span", { class: "step-no" }, "1"), W("h2", { id: "layout-heading" }, "Layout")], -1), W("div", {
			class: he(["layouts", { two: n.only?.length === 2 }]),
			role: "group",
			"aria-label": "Sign layout"
		}, [(V(!0), H(B, null, z(i.filter((e) => !n.only || n.only.includes(e.kind)), (t) => (V(), H("button", {
			key: t.kind,
			class: "layout-card",
			"aria-pressed": e.current === t.kind,
			title: t.hint,
			onClick: (e) => r("pick", t.kind)
		}, [t.kind === "single" ? (V(), H("svg", wv, [...a[0] ||= [
			W("rect", {
				x: "0.5",
				y: "0.5",
				width: "29",
				height: "39",
				fill: "#fff",
				stroke: "currentColor"
			}, null, -1),
			W("circle", {
				cx: "15",
				cy: "10",
				r: "6",
				fill: "none",
				stroke: "#ED1C24",
				"stroke-width": "2"
			}, null, -1),
			W("rect", {
				x: "3",
				y: "19",
				width: "24",
				height: "18",
				fill: "#ED1C24"
			}, null, -1)
		]])) : t.kind === "multi" ? (V(), H("svg", Tv, [...a[1] ||= [
			W("rect", {
				x: "0.5",
				y: "0.5",
				width: "29",
				height: "39",
				fill: "#fff",
				stroke: "currentColor"
			}, null, -1),
			W("circle", {
				cx: "9",
				cy: "10",
				r: "5",
				fill: "none",
				stroke: "#ED1C24",
				"stroke-width": "2"
			}, null, -1),
			W("path", {
				d: "M21 5 L26 15 L16 15 Z",
				fill: "#FFD200",
				stroke: "#1C1F23"
			}, null, -1),
			W("rect", {
				x: "3",
				y: "19",
				width: "24",
				height: "18",
				fill: "#ED1C24"
			}, null, -1)
		]])) : t.kind === "stacked" ? (V(), H("svg", Ev, [...a[2] ||= [Ki("<rect x=\"0.5\" y=\"0.5\" width=\"39\" height=\"29\" fill=\"#fff\" stroke=\"currentColor\"></rect><path d=\"M7 3 L12 12 L2 12 Z\" fill=\"#FFD200\" stroke=\"#1C1F23\"></path><rect x=\"15\" y=\"3\" width=\"22\" height=\"10\" fill=\"#FFD200\"></rect><circle cx=\"7\" cy=\"21\" r=\"5\" fill=\"none\" stroke=\"#ED1C24\" stroke-width=\"2\"></circle><rect x=\"15\" y=\"16\" width=\"22\" height=\"11\" fill=\"#ED1C24\"></rect>", 5)]])) : (V(), H("svg", Dv, [...a[3] ||= [Ki("<rect x=\"0.5\" y=\"0.5\" width=\"39\" height=\"29\" fill=\"#fff\" stroke=\"currentColor\"></rect><rect x=\"3\" y=\"3\" width=\"10\" height=\"11\" fill=\"#ED1C24\"></rect><rect x=\"15\" y=\"3\" width=\"10\" height=\"11\" fill=\"#056BB3\"></rect><rect x=\"27\" y=\"3\" width=\"10\" height=\"11\" fill=\"#FFD200\"></rect><rect x=\"3\" y=\"16\" width=\"10\" height=\"11\" fill=\"#ED1C24\"></rect><rect x=\"15\" y=\"16\" width=\"10\" height=\"11\" fill=\"#ED1C24\"></rect><rect x=\"27\" y=\"16\" width=\"10\" height=\"11\" fill=\"#099146\"></rect>", 7)]])), W("span", null, M(t.label), 1)], 8, Cv))), 128))], 2)]));
	}
}), kv = {
	key: 0,
	class: "card hint-card",
	"aria-labelledby": "move-hint-heading"
}, Av = {
	class: "hint-picture",
	viewBox: "0 0 96 64",
	width: "96",
	height: "64",
	role: "img",
	"aria-label": "A cell outlined with a dashed box moving to another place on the sign"
}, jv = { key: 0 }, Mv = { key: 1 }, Nv = {
	class: "grow",
	style: { "min-width": "0" }
}, Pv = {
	id: "move-hint-heading",
	class: "hint-title"
}, Fv = {
	class: "small",
	style: { margin: "2px 0 0" }
}, Iv = "signs.moveHint.dismissed", Lv = /* @__PURE__ */ R({
	__name: "MoveHint",
	props: { kind: {} },
	setup(e) {
		let t = e, n = /* @__PURE__ */ I((() => {
			try {
				return localStorage.getItem(Iv) === "1";
			} catch {
				return !1;
			}
		})());
		function r() {
			n.value = !0;
			try {
				localStorage.setItem(Iv, "1");
			} catch {}
		}
		return (e, i) => n.value ? q("", !0) : (V(), H("section", kv, [(V(), H("svg", Av, [i[2] ||= W("rect", {
			x: "1",
			y: "1",
			width: "94",
			height: "62",
			rx: "5",
			fill: "#fff",
			stroke: "#d9d7d0"
		}, null, -1), t.kind === "symbols" ? (V(), H("g", jv, [...i[0] ||= [Ki("<circle cx=\"22\" cy=\"22\" r=\"11\" fill=\"none\" stroke=\"#ED1C24\" stroke-width=\"3.4\"></circle><path d=\"M14 30 30 14\" stroke=\"#ED1C24\" stroke-width=\"3.4\" stroke-linecap=\"round\"></path><rect x=\"42\" y=\"8\" width=\"30\" height=\"28\" rx=\"4\" fill=\"#fff\" stroke=\"var(--focus)\" stroke-width=\"1.6\" stroke-dasharray=\"4 3\"></rect><path d=\"M57 13 69 33H45Z\" fill=\"#FFD200\" stroke=\"#1C1F23\" stroke-width=\"2\" stroke-linejoin=\"round\"></path><rect x=\"8\" y=\"42\" width=\"80\" height=\"14\" rx=\"3\" fill=\"#ED1C24\"></rect>", 5)]])) : (V(), H("g", Mv, [...i[1] ||= [
			W("rect", {
				x: "8",
				y: "7",
				width: "80",
				height: "15",
				rx: "3",
				fill: "#099146"
			}, null, -1),
			W("rect", {
				x: "8",
				y: "26",
				width: "80",
				height: "14",
				rx: "3",
				fill: "#056BB3"
			}, null, -1),
			W("rect", {
				x: "8",
				y: "44",
				width: "80",
				height: "14",
				rx: "3.5",
				fill: "#fff",
				stroke: "var(--focus)",
				"stroke-width": "1.6",
				"stroke-dasharray": "4 3"
			}, null, -1),
			W("path", {
				d: "M48 52v-9m0 0-4 4m4-4 4 4",
				stroke: "var(--focus)",
				"stroke-width": "2",
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				fill: "none"
			}, null, -1)
		]]))])), W("div", Nv, [
			W("h2", Pv, M(t.kind === "symbols" ? "Reorder symbols" : "Move things around"), 1),
			W("p", Fv, [t.kind === "symbols" ? (V(), H(B, { key: 0 }, [K(" Drag a symbol along the row to reorder it. The dashed box shows where it will land. ")], 64)) : (V(), H(B, { key: 1 }, [K(" Rest the pointer on the sign to see what can be moved, then drag one onto another to swap them. The dashed box shows where it will land. ")], 64))]),
			W("button", {
				class: "link",
				onClick: r
			}, "Got it")
		])]));
	}
}), Rv = ["aria-label"], zv = ["aria-pressed"], Bv = ["aria-pressed", "onClick"], Vv = /* @__PURE__ */ R({
	__name: "ColourChoice",
	props: {
		categories: {},
		current: {},
		label: {},
		allowMatch: { type: Boolean }
	},
	emits: ["pick"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = J(() => $u(n.categories)), a = /* @__PURE__ */ I(!1), o = J(() => a.value || i.value.more.some((e) => e.key === n.current));
		return (t, n) => (V(), H("div", {
			class: "swatches",
			role: "group",
			"aria-label": e.label
		}, [
			e.allowMatch ? (V(), H("button", {
				key: 0,
				class: "swatch",
				"aria-pressed": e.current === null,
				onClick: n[0] ||= (e) => r("pick", null)
			}, [...n[2] ||= [W("span", {
				class: "dot match",
				"aria-hidden": "true"
			}, null, -1), K("Match symbol ", -1)]], 8, zv)) : q("", !0),
			(V(!0), H(B, null, z(o.value ? [...i.value.main, ...i.value.more] : i.value.main, (t) => (V(), H("button", {
				key: t.key,
				class: "swatch",
				"aria-pressed": e.current === t.key,
				onClick: (e) => r("pick", t.key)
			}, [W("span", {
				class: "dot",
				style: k({ background: t.panel.hex }),
				"aria-hidden": "true"
			}, null, 4), K(M(t.title), 1)], 8, Bv))), 128)),
			i.value.more.length && !o.value ? (V(), H("button", {
				key: 1,
				class: "link",
				onClick: n[1] ||= (e) => a.value = !0
			}, "More colours")) : q("", !0)
		], 8, Rv));
	}
}), Hv = { class: "line-editor" }, Uv = { class: "row-controls" }, Wv = ["for"], Gv = ["for"], Kv = ["id", "value"], qv = ["value"], Jv = [
	"id",
	"rows",
	"value"
], Yv = { class: "line-controls" }, Xv = ["aria-label"], Zv = ["title"], Qv = { key: 0 }, $v = ["aria-label"], ey = ["aria-pressed", "aria-label"], ty = ["aria-pressed", "aria-label"], ny = { class: "row-controls" }, ry = ["for"], iy = [
	"id",
	"min",
	"max",
	"step",
	"value",
	"disabled"
], ay = ["disabled"], oy = { class: "row-controls" }, sy = ["for"], cy = [
	"id",
	"min",
	"max",
	"value"
], ly = ["disabled"], uy = {
	key: 0,
	class: "small muted",
	style: { margin: "0" }
}, dy = { class: "check small-check" }, fy = ["checked"], py = { class: "row-controls" }, my = ["disabled", "aria-label"], hy = ["disabled", "aria-label"], gy = /* @__PURE__ */ R({
	__name: "LineEditor",
	props: {
		block: {},
		index: {},
		count: {},
		nudgeRange: {}
	},
	setup(e) {
		let t = e, n = xg(), r = J(() => t.block.id), i = J(() => n.lineInfo(r.value)), a = J(() => `Line ${t.index + 1}`), o = J(() => Math.min(3, Math.max(1, t.block.text.split("\n").length))), s = [
			{
				key: "title",
				label: "Title"
			},
			{
				key: "body",
				label: "Additional text"
			},
			{
				key: "footer",
				label: "Small print"
			}
		], c = J(() => {
			for (let e of n.view.value.report?.sections ?? []) {
				let t = e.blocks.find((e) => e.id === r.value);
				if (t) return t.y_offset;
			}
			return {
				requested: 0,
				applied: 0
			};
		});
		return (t, l) => (V(), H("div", Hv, [
			W("div", Uv, [
				W("label", {
					class: "label grow",
					for: `text-${r.value}`
				}, M(a.value), 9, Wv),
				W("label", {
					class: "sr-only",
					for: `role-${r.value}`
				}, M(a.value) + " style", 9, Gv),
				W("select", {
					id: `role-${r.value}`,
					class: "field compact",
					value: dd(e.block),
					onChange: l[0] ||= (e) => L(n).commit((t) => ud(t, r.value, e.target.value))
				}, [(V(), H(B, null, z(s, (e) => W("option", {
					key: e.key,
					value: e.key
				}, M(e.label), 9, qv)), 64))], 40, Kv)
			]),
			W("textarea", {
				id: `text-${r.value}`,
				class: he(["field area", { caps: sd(e.block) }]),
				rows: o.value,
				value: e.block.text,
				placeholder: "Type your text",
				onInput: l[1] ||= (e) => L(n).commit((t) => rd(t, r.value, e.target.value), `text:${r.value}`)
			}, null, 42, Jv),
			W("div", Yv, [
				W("button", {
					class: "stepper",
					"aria-label": `${a.value} smaller`,
					onClick: l[2] ||= (e) => L(n).commit((e) => bd(fu(e, r.value).block, i.value.step - 1))
				}, "A−", 8, Xv),
				W("span", {
					class: "step-label",
					title: i.value.mm ? `Letters ${i.value.mm} mm tall` : ""
				}, [K(M(i.value.label), 1), i.value.mm ? (V(), H("small", Qv, M(i.value.mm) + " mm", 1)) : q("", !0)], 8, Zv),
				W("button", {
					class: "stepper",
					style: { "font-size": "17px" },
					"aria-label": `${a.value} larger`,
					onClick: l[3] ||= (e) => L(n).commit((e) => bd(fu(e, r.value).block, i.value.step + 1))
				}, "A+", 8, $v),
				W("button", {
					class: "stepper bold-toggle",
					"aria-pressed": od(e.block),
					"aria-label": `${a.value} bold`,
					onClick: l[4] ||= (t) => L(n).commit((t) => ad(t, r.value, !od(e.block)))
				}, "B", 8, ey),
				W("button", {
					class: "stepper caps-toggle",
					"aria-pressed": sd(e.block),
					"aria-label": `${a.value} in capitals`,
					title: "CAPITALS",
					onClick: l[5] ||= (t) => L(n).commit((t) => ld(t, r.value, !sd(e.block)))
				}, "AA", 8, ty),
				G(dv, {
					align: e.block.align,
					label: a.value,
					onAlign: l[6] ||= (e) => L(n).commit((t) => id(t, r.value, e))
				}, null, 8, ["align", "label"])
			]),
			W("div", ny, [
				W("label", {
					class: "label",
					for: `spacing-${r.value}`,
					style: { "white-space": "nowrap" }
				}, "Line spacing", 8, ry),
				W("input", {
					id: `spacing-${r.value}`,
					class: "grow",
					type: "range",
					min: pd.min,
					max: pd.max,
					step: pd.step,
					value: e.block.line_spacing,
					disabled: i.value.lines < 2,
					onInput: l[7] ||= (e) => L(n).commit((t) => md(t, r.value, Number(e.target.value)), `spacing:${r.value}`)
				}, null, 40, iy),
				W("button", {
					class: "link",
					disabled: e.block.line_spacing === pd.default,
					onClick: l[8] ||= (e) => L(n).commit((e) => md(e, r.value, pd.default))
				}, "Reset", 8, ay)
			]),
			W("div", oy, [
				W("label", {
					class: "label",
					for: `nudge-${r.value}`,
					style: { "white-space": "nowrap" }
				}, "Move up/down", 8, sy),
				W("input", {
					id: `nudge-${r.value}`,
					class: "grow",
					type: "range",
					min: -e.nudgeRange,
					max: e.nudgeRange,
					step: "0.5",
					value: e.block.y_offset,
					onInput: l[9] ||= (e) => L(n).commit((t) => _d(t, r.value, Number(e.target.value)), `nudge:${r.value}`)
				}, null, 40, cy),
				W("button", {
					class: "link",
					disabled: !e.block.y_offset,
					onClick: l[10] ||= (e) => L(n).commit((e) => _d(e, r.value, 0))
				}, "Reset", 8, ly)
			]),
			c.value.requested === c.value.applied ? q("", !0) : (V(), H("p", uy, " Moved as far as it fits (" + M(c.value.applied) + " mm). ", 1)),
			W("label", dy, [W("input", {
				type: "checkbox",
				checked: hd(e.block),
				onChange: l[11] ||= (e) => L(n).commit((t) => gd(t, r.value, e.target.checked))
			}, null, 40, fy), l[15] ||= K(" Pin to the bottom of the panel ", -1)]),
			W("div", py, [
				W("button", {
					class: "link",
					disabled: e.index === 0,
					"aria-label": `Move ${a.value.toLowerCase()} up`,
					onClick: l[12] ||= (e) => L(n).commit((e) => nd(e, r.value, -1))
				}, "↑ Up", 8, my),
				W("button", {
					class: "link",
					disabled: e.index === e.count - 1,
					"aria-label": `Move ${a.value.toLowerCase()} down`,
					onClick: l[13] ||= (e) => L(n).commit((e) => nd(e, r.value, 1))
				}, "↓ Down", 8, hy),
				l[16] ||= W("span", { class: "grow" }, null, -1),
				W("button", {
					class: "link danger",
					onClick: l[14] ||= (e) => L(n).commit((e) => td(e, r.value))
				}, "Remove line")
			])
		]));
	}
}), _y = { class: "row-controls" }, vy = ["aria-expanded"], yy = { class: "panel-name" }, by = {
	key: 0,
	class: "small muted panel-summary"
}, xy = ["disabled"], Sy = ["disabled"], Cy = /* @__PURE__ */ R({
	__name: "PanelEditor",
	props: {
		panel: {},
		index: {},
		count: {},
		sectionIndex: {},
		expanded: { type: Boolean },
		nudgeRange: {}
	},
	setup(e) {
		let t = e, n = xg(), r = J(() => t.panel.id), i = J(() => n.product.value?.roadsign ?? !1), a = J(() => t.panel.blocks.map((e) => e.text.trim()).filter(Boolean).join(" · ") || "No text yet");
		function o() {
			n.selection.section = t.sectionIndex, n.selection.panel = t.index;
		}
		return (t, s) => (V(), H("div", { class: he(["panel-editor", { expanded: e.expanded }]) }, [W("div", _y, [W("button", {
			class: "panel-title grow",
			"aria-expanded": e.expanded,
			onClick: o
		}, [W("span", yy, [K("Panel " + M(e.index + 1), 1), e.count > 1 ? (V(), H(B, { key: 0 }, [K(" of " + M(e.count), 1)], 64)) : q("", !0)]), e.expanded ? q("", !0) : (V(), H("span", by, M(a.value), 1))], 8, vy), e.count > 1 ? (V(), H(B, { key: 0 }, [
			W("button", {
				class: "link",
				disabled: e.index === 0,
				"aria-label": "Move panel up",
				onClick: s[0] ||= (t) => {
					L(n).commit((e) => Xu(e, r.value, -1)), L(n).selection.panel = e.index - 1;
				}
			}, "↑", 8, xy),
			W("button", {
				class: "link",
				disabled: e.index === e.count - 1,
				"aria-label": "Move panel down",
				onClick: s[1] ||= (t) => {
					L(n).commit((e) => Xu(e, r.value, 1)), L(n).selection.panel = e.index + 1;
				}
			}, "↓", 8, Sy),
			W("button", {
				class: "link danger",
				onClick: s[2] ||= (e) => L(n).commit((e) => Yu(e, r.value))
			}, "Remove")
		], 64)) : q("", !0)]), e.expanded ? (V(), H(B, { key: 0 }, [
			i.value ? q("", !0) : (V(), H(B, { key: 0 }, [s[5] ||= W("span", { class: "label" }, "Panel colour", -1), G(Vv, {
				categories: L(n).categories.value,
				current: e.panel.category ?? null,
				label: `Panel ${e.index + 1} colour`,
				"allow-match": "",
				onPick: s[3] ||= (e) => L(n).commit((t) => Zu(t, r.value, e))
			}, null, 8, [
				"categories",
				"current",
				"label"
			])], 64)),
			(V(!0), H(B, null, z(e.panel.blocks, (t, n) => (V(), U(gy, {
				key: t.id,
				block: t,
				index: n,
				count: e.panel.blocks.length,
				"nudge-range": e.nudgeRange
			}, null, 8, [
				"block",
				"index",
				"count",
				"nudge-range"
			]))), 128)),
			e.panel.blocks.length < 4 ? (V(), H("button", {
				key: 1,
				class: "btn dashed",
				onClick: s[4] ||= (e) => L(n).commit((e) => ed(e, r.value))
			}, "+ Add text line")) : q("", !0)
		], 64)) : q("", !0)], 2));
	}
}), wy = {
	id: "part-editor",
	class: "card selected-card",
	"aria-labelledby": "part-heading"
}, Ty = { class: "step-head" }, Ey = ["aria-label"], Dy = {
	key: 1,
	class: "step-no"
}, Oy = ["aria-label"], ky = {
	key: 0,
	class: "row-controls wrap"
}, Ay = ["disabled"], jy = ["disabled"], My = ["disabled"], Ny = ["disabled"], Py = { class: "sub-head" }, Fy = ["src"], Iy = {
	class: "grow",
	style: { "min-width": "0" }
}, Ly = { class: "symbol-name" }, Ry = { class: "small muted" }, zy = ["disabled", "onClick"], By = ["disabled", "onClick"], Vy = ["onClick"], Hy = ["aria-label", "onClick"], Uy = {
	key: 3,
	class: "row-controls"
}, Wy = ["for"], Gy = [
	"id",
	"min",
	"max",
	"value"
], Ky = {
	key: 4,
	class: "small muted",
	style: { margin: "-6px 0 0" }
}, qy = /* @__PURE__ */ R({
	__name: "PartEditor",
	setup(e) {
		let t = xg(), n = t.selection, r = () => t.view.value.doc, i = J(() => hu(r())), a = J(() => r().root.sections), o = J(() => t.product.value?.roadsign ?? !1), s = J(() => o.value ? "arrow" : "symbol"), c = (e) => e[0].toUpperCase() + e.slice(1), l = J(() => Of(r())), u = J(() => l.value ? a.value.indexOf(l.value.source) : Math.min(n.section, a.value.length - 1)), d = J(() => a.value[u.value]), f = J(() => d.value.symbol_frame?.symbols ?? []), p = J(() => !l.value && (i.value === "grid" || i.value === "stacked" || i.value === "board")), m = J(() => i.value === "stacked" ? "section" : "cell"), h = J(() => i.value === "board" ? Ym(r())[Xm(r(), u.value)] ?? null : null), g = J(() => {
			let e = h.value;
			return !e || e.cells < 2 ? null : u.value === e.start ? e.start + 1 : e.start;
		}), _ = J(() => {
			let e = h.value;
			return e ? e.cells > 1 ? `Row ${e.index + 1}: ${u.value === e.start ? "left" : "right"} cell` : `Row ${e.index + 1}` : p.value ? `Editing ${m.value} ${u.value + 1} of ${a.value.length}` : l.value ? "Symbols & English text" : "Symbols & text";
		}), v = J(() => Wd(r())), y = J(() => {
			let e = r().root.layout;
			return e.type === "grid" ? e : null;
		}), b = J(() => t.shareRange()), x = (e) => {
			n.section = (u.value + e + a.value.length) % a.value.length, n.panel = 0;
		};
		function S(e) {
			let r = u.value + e;
			if (r < 0 || r >= a.value.length) return;
			let i = u.value;
			t.commit((e) => y.value ? Lu(e, i, r) : Iu(e, i, r)), n.section = r;
		}
		function C() {
			let e = 0;
			t.commit((t) => {
				e = Pu(t, u.value);
			}), n.section = e, n.panel = 0;
		}
		function w() {
			let e = d.value.text_frame.panels.length;
			t.commit((e) => Ju(e, d.value.id)), n.panel = e;
		}
		let T = () => d.value.id;
		return (e, i) => (V(), H("section", wy, [
			W("div", Ty, [
				p.value ? (V(), H("button", {
					key: 0,
					class: "icon-btn",
					"aria-label": `Previous ${m.value}`,
					onClick: i[0] ||= (e) => x(-1)
				}, "‹", 8, Ey)) : (V(), H("span", Dy, M(L(t).product.value?.bilingual ? 5 : 4), 1)),
				W("h2", {
					id: "part-heading",
					class: "grow",
					style: k(p.value ? "text-align: center;" : "")
				}, M(_.value), 5),
				p.value ? (V(), H("button", {
					key: 2,
					class: "icon-btn",
					"aria-label": `Next ${m.value}`,
					onClick: i[1] ||= (e) => x(1)
				}, "›", 8, Oy)) : q("", !0)
			]),
			p.value ? (V(), H("div", ky, [h.value ? (V(), H(B, { key: 0 }, [
				g.value === null ? q("", !0) : (V(), H("button", {
					key: 0,
					class: "btn small-btn",
					onClick: i[2] ||= (e) => {
						L(t).commit((e) => mh(e, u.value, g.value)), L(n).section = g.value;
					}
				}, "⇄ Swap sides")),
				W("button", {
					class: "btn small-btn",
					onClick: i[3] ||= (e) => L(t).commit((e) => zu(e, u.value))
				}, "Clear text"),
				i[12] ||= W("span", { class: "small muted" }, "Rows are added and moved in the Rows card above.", -1)
			], 64)) : (V(), H(B, { key: 1 }, [
				W("button", {
					class: "btn small-btn",
					disabled: u.value === 0,
					onClick: i[4] ||= (e) => S(-1)
				}, M(y.value ? "← Swap back" : "↑ Move up"), 9, Ay),
				W("button", {
					class: "btn small-btn",
					disabled: u.value === a.value.length - 1,
					onClick: i[5] ||= (e) => S(1)
				}, M(y.value ? "Swap forward →" : "↓ Move down"), 9, jy),
				y.value ? (V(), H(B, { key: 0 }, [W("button", {
					class: "btn small-btn",
					onClick: i[6] ||= (e) => L(t).commit((e) => Ru(e, u.value))
				}, "Copy to all cells"), W("button", {
					class: "btn small-btn",
					onClick: i[7] ||= (e) => L(t).commit((e) => zu(e, u.value))
				}, "Clear text")], 64)) : (V(), H(B, { key: 1 }, [W("button", {
					class: "btn small-btn",
					disabled: a.value.length >= 4,
					onClick: C
				}, "+ Add section", 8, My), W("button", {
					class: "btn small-btn danger",
					disabled: a.value.length <= 1,
					onClick: i[8] ||= (e) => L(t).commit((e) => Fu(e, u.value))
				}, "Remove section", 8, Ny)], 64))
			], 64))])) : q("", !0),
			W("div", Py, M(c(f.value.length === 1 ? s.value : `${s.value}s`)), 1),
			(V(!0), H(B, null, z(f.value, (e, n) => (V(), H("div", {
				key: e.id,
				class: "symbol-row"
			}, [
				L(t).symbolEntry(e.symbol_code) ? (V(), H("img", {
					key: 0,
					src: L(t).symbolEntry(e.symbol_code).url,
					alt: ""
				}, null, 8, Fy)) : q("", !0),
				W("div", Iy, [W("div", Ly, M(L(t).symbolEntry(e.symbol_code)?.name ?? e.symbol_code), 1), W("div", Ry, M(e.symbol_code), 1)]),
				f.value.length > 1 ? (V(), H(B, { key: 1 }, [W("button", {
					class: "icon-btn",
					disabled: n === 0,
					"aria-label": "Move symbol earlier",
					onClick: (e) => L(t).commit((e) => Uu(e, T(), n, n - 1))
				}, "‹", 8, zy), W("button", {
					class: "icon-btn",
					disabled: n === f.value.length - 1,
					"aria-label": "Move symbol later",
					onClick: (e) => L(t).commit((e) => Uu(e, T(), n, n + 1))
				}, "›", 8, By)], 64)) : q("", !0),
				W("button", {
					class: "btn small-btn strong",
					onClick: (e) => L(t).openPicker({
						sectionId: T(),
						index: n
					})
				}, "Change", 8, Vy),
				W("button", {
					class: "icon-btn danger",
					"aria-label": `Remove ${e.symbol_code}`,
					onClick: (e) => L(t).commit((e) => Hu(e, T(), n))
				}, "×", 8, Hy)
			]))), 128)),
			!f.value.length && !o.value ? (V(), H(B, { key: 1 }, [i[13] ||= W("p", {
				class: "small muted",
				style: { margin: "0" }
			}, "Text only. Colour:", -1), G(Vv, {
				categories: L(t).categories.value,
				current: d.value.category ?? null,
				label: "Section colour",
				onPick: i[9] ||= (e) => e && L(t).commit((t) => qu(t, T(), e))
			}, null, 8, ["categories", "current"])], 64)) : q("", !0),
			f.value.length < 4 ? (V(), H("button", {
				key: 2,
				class: "btn dashed",
				onClick: i[10] ||= (e) => L(t).openPicker({
					sectionId: T(),
					index: "new"
				})
			}, "+ Add " + M(s.value), 1)) : q("", !0),
			f.value.length ? (V(), H("div", Uy, [W("label", {
				class: "label",
				for: `share-${d.value.id}`,
				style: { "white-space": "nowrap" }
			}, M(c(s.value)) + " size", 9, Wy), W("input", {
				id: `share-${d.value.id}`,
				class: "grow",
				type: "range",
				min: b.value.min,
				max: b.value.max,
				step: "0.005",
				value: d.value.symbol_share,
				onInput: i[11] ||= (e) => L(t).commit((t) => Ku(t, T(), Number(e.target.value)), `share:${T()}`)
			}, null, 40, Gy)])) : q("", !0),
			f.value.length && p.value && Wu(r()) ? (V(), H("p", Ky, M(c(s.value)) + " size applies to every " + M(m.value) + " while they are lined up. ", 1)) : q("", !0),
			i[14] ||= W("div", { class: "sub-head" }, "Text", -1),
			(V(!0), H(B, null, z(d.value.text_frame.panels, (e, t) => (V(), U(Cy, {
				key: e.id,
				panel: e,
				index: t,
				count: d.value.text_frame.panels.length,
				"section-index": u.value,
				expanded: t === L(n).panel,
				"nudge-range": v.value
			}, null, 8, [
				"panel",
				"index",
				"count",
				"section-index",
				"expanded",
				"nudge-range"
			]))), 128)),
			d.value.text_frame.panels.length < 4 && !o.value ? (V(), H("button", {
				key: 5,
				class: "btn dashed",
				onClick: w
			}, "+ Add panel")) : q("", !0)
		]));
	}
}), Jy = {
	class: "card",
	"aria-labelledby": "sign-heading"
}, Yy = {
	key: 0,
	class: "row-controls"
}, Xy = ["value"], Zy = ["value"], Qy = ["value"], $y = ["value"], eb = {
	key: 1,
	class: "row-controls"
}, tb = {
	class: "label",
	id: "position-label"
}, nb = {
	class: "segmented",
	role: "group",
	"aria-labelledby": "position-label"
}, rb = ["aria-pressed", "onClick"], ib = {
	key: 2,
	class: "check"
}, ab = ["checked"], ob = {
	key: 3,
	class: "check"
}, sb = ["checked"], cb = {
	key: 4,
	class: "check"
}, lb = ["checked"], ub = { class: "row-controls" }, db = {
	class: "segmented",
	role: "group",
	"aria-labelledby": "background-label"
}, fb = ["aria-pressed"], pb = ["aria-pressed"], mb = {
	key: 5,
	class: "check small-check"
}, hb = ["checked"], gb = { class: "check" }, _b = ["checked"], vb = /* @__PURE__ */ R({
	__name: "SignOptions",
	setup(e) {
		let t = xg(), n = () => t.view.value.doc, r = J(() => hu(n())), i = J(() => kf(n())), a = J(() => {
			let e = n().root.layout;
			return e.type === "grid" && !i.value ? e : null;
		}), o = Array.from({ length: 4 }, (e, t) => t + 1), s = J(() => n().root.sections.some((e) => e.symbol_frame)), c = J(() => bu(n())), l = [
			{
				key: "above",
				label: "Above"
			},
			{
				key: "below",
				label: "Below"
			},
			{
				key: "left",
				label: "Left"
			},
			{
				key: "right",
				label: "Right"
			}
		];
		return (e, i) => (V(), H("section", Jy, [
			i[17] ||= W("div", { class: "step-head" }, [W("span", { class: "step-no" }, "3"), W("h2", { id: "sign-heading" }, "Whole sign")], -1),
			a.value ? (V(), H("div", Yy, [
				i[9] ||= W("label", {
					class: "label",
					for: "grid-rows"
				}, "Rows", -1),
				W("select", {
					id: "grid-rows",
					class: "field compact",
					value: a.value.rows,
					onChange: i[0] ||= (e) => L(t).commit((t) => Du(t, Number(e.target.value), a.value.cols))
				}, [(V(!0), H(B, null, z(L(o), (e) => (V(), H("option", {
					key: e,
					value: e
				}, M(e), 9, Zy))), 128))], 40, Xy),
				i[10] ||= W("label", {
					class: "label",
					for: "grid-cols"
				}, "Columns", -1),
				W("select", {
					id: "grid-cols",
					class: "field compact",
					value: a.value.cols,
					onChange: i[1] ||= (e) => L(t).commit((t) => Du(t, a.value.rows, Number(e.target.value)))
				}, [(V(!0), H(B, null, z(L(o), (e) => (V(), H("option", {
					key: e,
					value: e
				}, M(e), 9, $y))), 128))], 40, Qy)
			])) : q("", !0),
			s.value ? (V(), H("div", eb, [W("span", tb, "Symbol" + M(r.value === "single" ? "" : "s"), 1), W("div", nb, [(V(), H(B, null, z(l, (e) => W("button", {
				key: e.key,
				"aria-pressed": c.value === e.key,
				onClick: (n) => L(t).commit((t) => xu(t, e.key))
			}, M(e.label), 9, rb)), 64))])])) : q("", !0),
			a.value ? (V(), H("label", ib, [W("input", {
				type: "checkbox",
				checked: a.value.sync_text,
				onChange: i[2] ||= (e) => L(t).commit((t) => Md(t, e.target.checked))
			}, null, 40, ab), i[11] ||= K(" Same text size in every cell ", -1)])) : q("", !0),
			r.value === "grid" || r.value === "stacked" ? (V(), H("label", ob, [W("input", {
				type: "checkbox",
				checked: Wu(n()),
				onChange: i[3] ||= (e) => L(t).commit((t) => Gu(t, e.target.checked))
			}, null, 40, sb), i[12] ||= K(" Line up symbols and panels ", -1)])) : q("", !0),
			n().root.layout.type === "grid" ? (V(), H("label", cb, [W("input", {
				type: "checkbox",
				checked: Nd(n()),
				onChange: i[4] ||= (e) => L(t).commit((t) => Pd(t, e.target.checked))
			}, null, 40, lb), i[13] ||= K(" Outline round each cell ", -1)])) : q("", !0),
			W("div", ub, [i[14] ||= W("span", {
				class: "label",
				id: "background-label"
			}, "Background", -1), W("div", db, [W("button", {
				"aria-pressed": Sd(n()) === "white",
				onClick: i[5] ||= (e) => L(t).commit((e) => kd(e, "white", L(t).categories.value))
			}, "White", 8, fb), W("button", {
				"aria-pressed": Sd(n()) === "colour",
				onClick: i[6] ||= (e) => L(t).commit((e) => kd(e, "colour", L(t).categories.value))
			}, "All colour", 8, pb)])]),
			Sd(n()) === "colour" && s.value ? (V(), H("label", mb, [W("input", {
				type: "checkbox",
				checked: Ed(n().root.sections[0]),
				onChange: i[7] ||= (e) => L(t).commit((t) => Dd(t, e.target.checked))
			}, null, 40, hb), i[15] ||= K(" White panel behind the symbol ", -1)])) : q("", !0),
			W("label", gb, [W("input", {
				type: "checkbox",
				checked: Ad(n(), L(t).roundedByDefault()),
				onChange: i[8] ||= (e) => L(t).commit((t) => jd(t, e.target.checked))
			}, null, 40, _b), i[16] ||= K(" Rounded panel corners ", -1)])
		]));
	}
}), yb = {
	id: "translation-card",
	class: "card",
	"aria-labelledby": "translation-heading"
}, bb = { class: "step-head" }, xb = { class: "step-no" }, Sb = ["value"], Cb = ["value"], wb = {
	class: "segmented",
	role: "group",
	"aria-label": "Arrangement"
}, Tb = ["aria-pressed"], Eb = ["aria-pressed"], Db = {
	class: "label",
	id: "tr-order"
}, Ob = {
	class: "segmented",
	role: "group",
	"aria-labelledby": "tr-order"
}, kb = ["aria-pressed"], Ab = ["aria-pressed"], jb = ["for"], Mb = { class: "tr-source" }, Nb = [
	"id",
	"lang",
	"rows",
	"value",
	"disabled",
	"placeholder",
	"aria-busy",
	"onInput"
], Pb = {
	key: 0,
	class: "row-controls wrap small"
}, Fb = ["onClick"], Ib = ["onClick"], Lb = {
	key: 1,
	class: "small muted"
}, Rb = {
	key: 0,
	class: "spinner",
	"aria-hidden": "true"
}, zb = { class: "row-controls wrap" }, Bb = { class: "check-box" }, Vb = { style: { margin: "0" } }, Hb = {
	class: "check",
	style: { "font-weight": "600" }
}, Ub = ["checked"], Wb = /* @__PURE__ */ R({
	__name: "TranslationCard",
	props: { step: {} },
	setup(e) {
		let t = xg(), n = () => t.view.value.doc, r = J(() => Of(n())), i = J(() => Bf(n())), a = J(() => r.value?.target.lang ?? ""), o = J(() => Mf(n())), s = J(() => Yf(n())), c = J(() => o.value === "side" ? "on the left" : "on top");
		function l(e) {
			t.commit((t) => Rf(t, e)), t.prepareTranslation(e);
		}
		let u = J(() => t.state.translating ? `Translating into ${Tf(a.value)}…` : t.state.translateError);
		return (n, d) => (V(), H("section", yb, [W("div", bb, [W("span", xb, M(e.step), 1), d[7] ||= W("h2", { id: "translation-heading" }, "Second language", -1)]), r.value ? (V(), H(B, { key: 0 }, [
			d[11] ||= W("label", {
				class: "sr-only",
				for: "tr-lang"
			}, "Second language", -1),
			W("select", {
				id: "tr-lang",
				class: "field",
				value: a.value,
				onChange: d[0] ||= (e) => l(e.target.value)
			}, [(V(!0), H(B, null, z(wf, (e) => (V(), H("option", {
				key: e.code,
				value: e.code
			}, M(e.name) + " · " + M(e.native), 9, Cb))), 128))], 40, Sb),
			W("div", wb, [W("button", {
				class: "grow",
				"aria-pressed": o.value === "side",
				onClick: d[1] ||= (e) => L(t).commit((e) => Lf(e, "side"))
			}, "Side by side", 8, Tb), W("button", {
				class: "grow",
				"aria-pressed": o.value === "stacked",
				onClick: d[2] ||= (e) => L(t).commit((e) => Lf(e, "stacked"))
			}, "One above the other", 8, Eb)]),
			W("span", Db, "Which language comes first (" + M(c.value) + ")?", 1),
			W("div", Ob, [W("button", {
				class: "grow",
				"aria-pressed": !s.value,
				onClick: d[3] ||= (e) => L(t).commit((e) => Xf(e, !1))
			}, "English first", 8, kb), W("button", {
				class: "grow",
				"aria-pressed": s.value,
				onClick: d[4] ||= (e) => L(t).commit((e) => Xf(e, !0))
			}, M(Tf(a.value)) + " first", 9, Ab)]),
			d[12] ||= W("div", { class: "sub-head" }, "Translated wording", -1),
			d[13] ||= W("p", {
				class: "small muted",
				style: { margin: "0" }
			}, "Write the English in the text step; the translation follows. You can also type over any line here.", -1),
			(V(!0), H(B, null, z(i.value, (e, n) => (V(), H("div", {
				key: e.id,
				class: "tr-line"
			}, [
				W("label", {
					class: "label",
					for: `tr-${e.id}`
				}, [K(" Line " + M(n + 1) + ": ", 1), W("span", Mb, M(e.source.trim() || "(blank)"), 1)], 8, jb),
				W("textarea", {
					id: `tr-${e.id}`,
					class: he(["field area", { "is-busy": L(t).translatingIds.value.includes(e.id) }]),
					lang: a.value,
					rows: Math.min(3, Math.max(1, e.text.split("\n").length)),
					value: e.text,
					disabled: !e.source.trim(),
					placeholder: e.source.trim() ? L(t).translatingIds.value.includes(e.id) ? "Translating…" : "Translation" : "",
					"aria-busy": L(t).translatingIds.value.includes(e.id),
					onInput: (n) => L(t).commit((t) => Wf(t, e.id, n.target.value), `tr:${e.id}`)
				}, null, 42, Nb),
				e.manual && e.stale && e.source.trim() ? (V(), H("div", Pb, [
					d[8] ||= W("span", {
						class: "grow",
						style: { color: "var(--danger)" }
					}, "The English changed since you typed this.", -1),
					W("button", {
						class: "link",
						onClick: (n) => L(t).commit((t) => Gf(t, e.id))
					}, "Keep mine", 8, Fb),
					L(t).translatorName ? (V(), H("button", {
						key: 0,
						class: "link",
						onClick: (n) => L(t).commit((t) => Jf(t, e.id))
					}, "Translate again", 8, Ib)) : q("", !0)
				])) : e.manual ? (V(), H("span", Lb, "Typed by you")) : q("", !0)
			]))), 128)),
			u.value ? (V(), H("p", {
				key: 0,
				class: he(["small tr-status", { busy: L(t).state.translating }]),
				role: "status"
			}, [L(t).state.translating ? (V(), H("span", Rb)) : q("", !0), K(M(u.value), 1)], 2)) : q("", !0),
			W("div", zb, [L(t).translatorName ? (V(), H("button", {
				key: 0,
				class: "btn small-btn",
				onClick: d[5] ||= (e) => L(t).translateAgain()
			}, "Translate all again")) : q("", !0)]),
			W("div", Bb, [
				d[10] ||= W("strong", null, "Please check this translation", -1),
				W("p", Vb, M(r.value.meta.machine ? "Translations are made automatically. Safety signs must be understood exactly, so ask a native speaker to check the wording before you order." : "Safety signs must be understood exactly, so ask a native speaker to check the wording before you order."), 1),
				W("label", Hb, [W("input", {
					type: "checkbox",
					checked: r.value.meta.checked,
					onChange: d[6] ||= (e) => L(t).commit((t) => Kf(t, e.target.checked))
				}, null, 40, Ub), d[9] ||= K(" I have checked the translation ", -1)])
			])
		], 64)) : q("", !0)]));
	}
}), Gb = /* @__PURE__ */ R({
	__name: "AdvancedPanel",
	setup(e) {
		let t = xg(), n = J(() => t.variantSizes.value.length > 0), r = J(() => hu(t.view.value.doc)), i = J(() => t.product.value?.bilingual ?? !1);
		function a(e) {
			let n = null;
			t.commit((t) => {
				n = Su(t, e);
			}), t.selection.section = 0, t.selection.panel = 0;
			let r = n, i = t.view.value.doc;
			r && i && t.openPicker({
				sectionId: i.root.sections[r.section].id,
				index: r.symbol
			});
		}
		return (e, o) => (V(), H(B, null, [
			G(Ov, {
				current: r.value,
				only: i.value ? ["single", "multi"] : void 0,
				onPick: a
			}, null, 8, ["current", "only"]),
			n.value ? (V(), U(R_, {
				key: 0,
				step: 2
			})) : (V(), U(A_, {
				key: 1,
				sizes: L(t).sizes.value,
				current: L(t).currentSize.value,
				step: 2,
				custom: "",
				dimensions: L(t).currentDimensions.value,
				onPick: L(t).pickSize,
				onCustom: L(t).setCustomSize
			}, null, 8, [
				"sizes",
				"current",
				"dimensions",
				"onPick",
				"onCustom"
			])),
			r.value === "grid" || r.value === "stacked" ? (V(), U(Lv, {
				key: 2,
				kind: "cells"
			})) : r.value === "multi" ? (V(), U(Lv, {
				key: 3,
				kind: "symbols"
			})) : q("", !0),
			G(Lg),
			G(vb),
			i.value ? (V(), U(Wb, {
				key: 4,
				step: 4
			})) : q("", !0),
			G(qy)
		], 64));
	}
}), Kb = {
	class: "card",
	"aria-labelledby": "board-heading"
}, qb = { class: "step-head" }, Jb = { class: "small muted" }, Yb = {
	key: 0,
	class: "templates"
}, Xb = { class: "row-controls wrap" }, Zb = [
	"disabled",
	"title",
	"onClick"
], Qb = { class: "row-controls wrap board-size" }, $b = ["value"], ex = ["value"], tx = {
	class: "segmented",
	role: "group",
	"aria-label": "Columns below the header"
}, nx = ["aria-pressed", "onClick"], rx = {
	class: "rows",
	role: "list"
}, ix = [
	"onDragstart",
	"onDragover",
	"onDragleave",
	"onDrop"
], ax = ["aria-pressed", "onClick"], ox = { class: "row-words" }, sx = { class: "small muted" }, cx = { class: "row-buttons" }, lx = ["disabled", "onClick"], ux = ["disabled", "onClick"], dx = [
	"aria-label",
	"title",
	"onClick"
], fx = ["disabled", "onClick"], px = ["disabled", "onClick"], mx = { class: "row-height" }, hx = ["value", "onChange"], gx = ["value"], _x = { class: "row-controls wrap" }, vx = ["disabled"], yx = ["disabled"], bx = ["disabled"], xx = {
	key: 1,
	class: "small muted",
	style: { margin: "0" }
}, Sx = {
	key: 2,
	class: "small muted",
	style: { margin: "0" }
}, Cx = /* @__PURE__ */ R({
	__name: "BoardStep",
	setup(e) {
		let t = xg(), n = () => t.view.value.doc, r = t.board.rows, i = t.board.selectedRow, a = /* @__PURE__ */ I(!1), o = /* @__PURE__ */ I(null), s = /* @__PURE__ */ I(null), c = J(() => r.value.length >= 8), l = J(() => r.value.length <= 1);
		async function u(e) {
			a.value = !0;
			try {
				await t.board.useTemplate(e);
			} finally {
				a.value = !1;
			}
		}
		function d(e) {
			return n().root.sections.slice(e.start, e.start + e.cells).map((e) => e.placeholder ? "Choose a message" : e.text_frame.panels.flatMap((e) => e.blocks.map((e) => e.text)).filter(Boolean).join(" ").trim()).filter(Boolean).join("  |  ") || "Empty row";
		}
		let f = J(() => {
			let e = r.value[i.value];
			return !!e && p(e);
		}), p = (e) => n().root.sections.slice(e.start, e.start + e.cells).every((e) => e.placeholder), m = (e) => qm.reduce((t, n) => Math.abs(n.weight - e) < Math.abs(t - e) ? n.weight : t, 1);
		function h(e) {
			let r = n().root.sections[e.start], i = r?.text_frame.panels[0]?.category ?? r?.category, a = t.categories.value.find((e) => e.key === i);
			return r?.text_frame.panels[0]?.fill ? "#ffffff" : a?.panel.hex ?? "#ffffff";
		}
		function g(e) {
			let n = o.value;
			o.value = null, s.value = null, n !== null && n !== e && t.board.move(n, e);
		}
		return (e, n) => (V(), H("section", Kb, [
			W("div", qb, [
				n[5] ||= W("span", { class: "step-no" }, "1", -1),
				n[6] ||= W("h2", {
					id: "board-heading",
					class: "grow"
				}, "Rows", -1),
				W("span", Jb, M(L(r).length) + " of " + M(L(8)), 1)
			]),
			l.value ? (V(), H("div", Yb, [n[7] ||= W("p", {
				class: "small muted",
				style: { margin: "0" }
			}, "Start from a ready-made board, then change what you like:", -1), W("div", Xb, [(V(!0), H(B, null, z(L(t).board.templates, (e) => (V(), H("button", {
				key: e.id,
				class: "btn small-btn strong",
				disabled: a.value,
				title: e.hint,
				onClick: (t) => u(e.id)
			}, M(e.label), 9, Zb))), 128))])])) : q("", !0),
			W("div", Qb, [
				n[8] ||= W("label", {
					class: "label",
					for: "board-rows"
				}, "Rows", -1),
				W("select", {
					id: "board-rows",
					class: "field compact",
					value: L(r).length,
					onChange: n[0] ||= (e) => L(t).board.setRowCount(Number(e.target.value))
				}, [(V(!0), H(B, null, z(L(8), (e) => (V(), H("option", {
					key: e,
					value: e
				}, M(e), 9, ex))), 128))], 40, $b),
				n[9] ||= W("span", { class: "label" }, "Columns", -1),
				W("div", tx, [(V(!0), H(B, null, z(L(2), (e) => (V(), H("button", {
					key: e,
					"aria-pressed": L(t).board.columns.value === e,
					onClick: (n) => L(t).board.setColumns(e)
				}, M(e), 9, nx))), 128))]),
				n[10] ||= W("span", { class: "small muted" }, "below the header", -1)
			]),
			W("ul", rx, [(V(!0), H(B, null, z(L(r), (e) => (V(), H("li", {
				key: e.index,
				class: he(["board-row", {
					on: e.index === L(i),
					over: s.value === e.index,
					empty: p(e)
				}]),
				draggable: "true",
				onDragstart: (t) => o.value = e.index,
				onDragend: n[1] ||= (e) => {
					o.value = null, s.value = null;
				},
				onDragover: po((t) => s.value = e.index, ["prevent"]),
				onDragleave: (t) => s.value === e.index && (s.value = null),
				onDrop: po((t) => g(e.index), ["prevent"])
			}, [
				n[12] ||= W("span", {
					class: "grip",
					"aria-hidden": "true"
				}, "⠿", -1),
				W("span", {
					class: "row-colour",
					style: k({ background: h(e) }),
					"aria-hidden": "true"
				}, null, 4),
				W("button", {
					class: "row-text grow",
					"aria-pressed": e.index === L(i),
					onClick: (n) => L(t).board.select(e.index)
				}, [W("span", ox, M(d(e)), 1), W("span", sx, M(e.cells === 2 ? "Two cells" : "Full width"), 1)], 8, ax),
				W("div", cx, [
					W("button", {
						class: "icon-btn",
						disabled: e.index === 0,
						"aria-label": "Move row up",
						onClick: (n) => L(t).board.move(e.index, e.index - 1)
					}, "↑", 8, lx),
					W("button", {
						class: "icon-btn",
						disabled: e.index === L(r).length - 1,
						"aria-label": "Move row down",
						onClick: (n) => L(t).board.move(e.index, e.index + 1)
					}, "↓", 8, ux),
					W("button", {
						class: "icon-btn",
						"aria-label": e.cells === 2 ? "Make this row full width" : "Split this row into two",
						title: e.cells === 2 ? "Make full width" : "Split into two",
						onClick: (n) => L(t).board.setCells(e.index, e.cells === 2 ? 1 : 2)
					}, M(e.cells === 2 ? "▭" : "▥"), 9, dx),
					W("button", {
						class: "icon-btn",
						"aria-label": "Duplicate row",
						title: "Duplicate",
						disabled: c.value,
						onClick: (n) => L(t).board.duplicate(e.index)
					}, "⧉", 8, fx),
					W("button", {
						class: "icon-btn danger",
						"aria-label": "Remove row",
						disabled: L(r).length <= 1,
						onClick: (n) => L(t).board.remove(e.index)
					}, "×", 8, px)
				]),
				W("label", mx, [n[11] ||= W("span", { class: "visually-hidden" }, "Row height", -1), W("select", {
					class: "field small-field",
					value: m(e.weight),
					onChange: (n) => L(t).board.setWeight(e.index, Number(n.target.value))
				}, [(V(!0), H(B, null, z(L(qm), (e) => (V(), H("option", {
					key: e.label,
					value: e.weight
				}, M(e.label), 9, gx))), 128))], 40, hx)])
			], 42, ix))), 128))]),
			W("div", _x, [
				W("button", {
					class: "btn strong",
					disabled: c.value || a.value,
					onClick: n[2] ||= (e) => L(t).board.openPicker("add", L(i))
				}, "+ Add a standard row", 8, vx),
				W("button", {
					class: "btn",
					disabled: c.value || a.value,
					onClick: n[3] ||= (e) => L(t).board.add(null, L(i))
				}, "+ Blank row", 8, yx),
				W("button", {
					class: "btn small-btn",
					disabled: a.value || L(i) < 0,
					onClick: n[4] ||= (e) => L(t).board.openPicker("replace", L(r)[L(i)]?.start ?? 0)
				}, M(f.value ? "Choose a message for this row" : "Replace this row"), 9, bx)
			]),
			c.value ? (V(), H("p", xx, "That is as many rows as one board takes.")) : (V(), H("p", Sx, "Drag a row by its handle to move it, or use the arrows."))
		]));
	}
}), wx = /* @__PURE__ */ R({
	__name: "BoardPanel",
	setup(e) {
		let t = xg(), n = J(() => t.variantSizes.value.length > 0);
		return (e, r) => (V(), H(B, null, [
			L(t).board.rows.value.length > 1 ? (V(), U(Lv, {
				key: 0,
				kind: "cells"
			})) : q("", !0),
			G(Cx),
			n.value ? (V(), U(R_, {
				key: 1,
				step: 2
			})) : (V(), U(A_, {
				key: 2,
				sizes: L(t).sizes.value,
				current: L(t).currentSize.value,
				step: 2,
				custom: "",
				dimensions: L(t).currentDimensions.value,
				onPick: L(t).pickSize,
				onCustom: L(t).setCustomSize
			}, null, 8, [
				"sizes",
				"current",
				"dimensions",
				"onPick",
				"onCustom"
			])),
			G(qy)
		], 64));
	}
}), Tx = {
	class: "card",
	"aria-labelledby": "scheme-heading"
}, Ex = {
	class: "swatches",
	role: "group",
	"aria-label": "Sign colour"
}, Dx = ["aria-pressed", "onClick"], Ox = {
	class: "small muted",
	style: { margin: "0" }
}, kx = {
	key: 0,
	class: "card",
	"aria-labelledby": "road-size-heading"
}, Ax = {
	class: "chips",
	style: { "grid-template-columns": "repeat(2, minmax(0, 1fr))" },
	role: "group",
	"aria-label": "Sign size"
}, jx = ["aria-pressed", "onClick"], Mx = {
	key: 1,
	class: "card",
	"aria-labelledby": "arrow-place-heading"
}, Nx = { class: "row-controls" }, Px = {
	class: "segmented",
	role: "group",
	"aria-labelledby": "arrow-place-label"
}, Fx = ["aria-pressed", "onClick"], Ix = /* @__PURE__ */ R({
	__name: "RoadSignPanel",
	props: { sizes: {
		type: Boolean,
		default: !0
	} },
	setup(e) {
		let t = e, n = xg(), r = n.roadSign, i = () => n.view.value.doc, a = J(() => (n.rev.value, !!i().root.sections[0]?.symbol_frame)), o = J(() => (n.rev.value, bu(i()))), s = [
			{
				key: "above",
				label: "Top"
			},
			{
				key: "below",
				label: "Bottom"
			},
			{
				key: "left",
				label: "Left"
			},
			{
				key: "right",
				label: "Right"
			}
		];
		return (e, i) => (V(), H(B, null, [
			W("section", Tx, [
				i[0] ||= W("div", { class: "step-head" }, [W("span", { class: "step-no" }, "1"), W("h2", { id: "scheme-heading" }, "Colour")], -1),
				W("div", Ex, [(V(!0), H(B, null, z(L(r).schemes, (e) => (V(), H("button", {
					key: e.key,
					class: "swatch",
					"aria-pressed": L(r).scheme.value.key === e.key,
					onClick: (t) => L(r).setScheme(e.key)
				}, [W("span", {
					class: "dot",
					style: k({
						background: e.face.hex,
						borderColor: e.ink.hex
					})
				}, null, 4), K(" " + M(e.label), 1)], 8, Dx))), 128))]),
				W("p", Ox, " Printed onto " + M(L(r).scheme.value.label.toLowerCase()) + " reflective material, so the " + M(L(r).scheme.value.label.toLowerCase()) + " itself is not printed — only the border, wording and arrow. ", 1)
			]),
			t.sizes ? (V(), H("section", kx, [
				i[1] ||= W("div", { class: "step-head" }, [W("span", { class: "step-no" }, "2"), W("h2", { id: "road-size-heading" }, "Size")], -1),
				W("div", Ax, [(V(!0), H(B, null, z(L(r).sizes, (e) => (V(), H("button", {
					key: e.name,
					class: "chip",
					"aria-pressed": L(r).size.value?.name === e.name,
					onClick: (t) => L(r).setSize(e)
				}, M(e.width) + "×" + M(e.height), 9, jx))), 128))]),
				i[2] ||= W("p", {
					class: "small muted",
					style: { margin: "0" }
				}, "These fit our standard frames, so there is no custom size.", -1)
			])) : q("", !0),
			a.value ? (V(), H("section", Mx, [i[4] ||= W("div", { class: "step-head" }, [W("span", { class: "step-no" }, "3"), W("h2", { id: "arrow-place-heading" }, "Arrow")], -1), W("div", Nx, [i[3] ||= W("span", {
				class: "label",
				id: "arrow-place-label"
			}, "Goes", -1), W("div", Px, [(V(), H(B, null, z(s, (e) => W("button", {
				key: e.key,
				"aria-pressed": o.value === e.key,
				onClick: (t) => L(n).commit((t) => xu(t, e.key))
			}, M(e.label), 9, Fx)), 64))])])])) : q("", !0),
			G(qy)
		], 64));
	}
}), Lx = {
	class: "card outlined",
	"aria-labelledby": "rows-heading"
}, Rx = { class: "step-head" }, zx = {
	id: "rows-heading",
	class: "grow"
}, Bx = {
	key: 0,
	class: "tabs",
	role: "tablist",
	"aria-label": "Kinds of row"
}, Vx = ["aria-selected", "onClick"], Hx = {
	key: 1,
	class: "notice",
	role: "alert"
}, Ux = {
	key: 2,
	class: "small muted",
	style: { margin: "0" }
}, Wx = { class: "sub-head" }, Gx = ["disabled", "onClick"], Kx = { class: "preset-label" }, qx = { class: "small muted preset-words" }, Jx = /* @__PURE__ */ R({
	__name: "RowPicker",
	setup(e) {
		let t = xg(), n = /* @__PURE__ */ I(""), r = /* @__PURE__ */ I("all"), i = /* @__PURE__ */ I(null), a = /* @__PURE__ */ I("");
		sr(() => i.value?.focus());
		let o = J(() => t.board.picker.value?.mode === "replace"), s = J(() => {
			let e = n.value.trim().toLowerCase();
			return Gm().filter((t) => e || r.value === "all" || t.group === r.value).map((t) => ({
				...t,
				presets: e ? t.presets.filter((t) => `${t.label} ${l(t)}`.toLowerCase().includes(e)) : t.presets
			})).filter((e) => e.presets.length);
		}), c = J(() => ["all", ...Gm().map((e) => e.group)]);
		function l(e) {
			return e.section.panels[0]?.lines.map((e) => e.text).join(" — ") ?? "";
		}
		async function u(e) {
			a.value = e.id;
			try {
				await t.board.takePreset(e);
			} finally {
				a.value = "";
			}
		}
		return (e, d) => (V(), H("section", Lx, [
			W("div", Rx, [W("h2", zx, M(o.value ? "Choose a message for this row" : "Add a row"), 1), W("button", {
				class: "btn go",
				style: {
					height: "40px",
					"font-size": "15px"
				},
				onClick: d[0] ||= (e) => L(t).board.closePicker()
			}, "Done")]),
			d[2] ||= W("label", {
				class: "label",
				for: "row-search"
			}, "Search the standard rows", -1),
			jn(W("input", {
				id: "row-search",
				ref_key: "search",
				ref: i,
				"onUpdate:modelValue": d[1] ||= (e) => n.value = e,
				class: "field",
				type: "search",
				placeholder: "e.g. helmet, children, smoking"
			}, null, 512), [[lo, n.value]]),
			n.value.trim() ? q("", !0) : (V(), H("div", Bx, [(V(!0), H(B, null, z(c.value, (e) => (V(), H("button", {
				key: e,
				role: "tab",
				"aria-selected": r.value === e,
				onClick: (t) => r.value = e
			}, M(e === "all" ? "All" : e), 9, Vx))), 128))])),
			L(t).state.symbolError ? (V(), H("p", Hx, M(L(t).state.symbolError), 1)) : q("", !0),
			s.value.length ? q("", !0) : (V(), H("p", Ux, " No standard row matches that. Close this and use “Blank row” to write your own wording. ")),
			(V(!0), H(B, null, z(s.value, (e) => (V(), H("div", {
				key: e.group,
				class: "preset-group"
			}, [W("div", Wx, M(e.group), 1), (V(!0), H(B, null, z(e.presets, (e) => (V(), H("button", {
				key: e.id,
				class: he(["preset", [`cat-${e.section.colour ?? "plain"}`, { busy: a.value === e.id }]]),
				disabled: !!a.value,
				onClick: (t) => u(e)
			}, [W("span", Kx, M(e.label), 1), W("span", qx, M(l(e)), 1)], 10, Gx))), 128))]))), 128))
		]));
	}
}), Yx = {
	mm: 1,
	mmm: 1,
	cm: 10,
	m: 1e3,
	in: 25.4,
	inch: 25.4,
	ft: 304.8,
	feet: 304.8
}, Xx = (e) => (e.view.value.doc?.root.sections ?? []).flatMap((e) => e.text_frame.panels.flatMap((e) => e.blocks.map((e) => e.text.trim()))).filter(Boolean), Zx = (e) => [...new Set((e.view.value.doc?.root.sections ?? []).flatMap((e) => e.symbol_frame?.symbols.map((e) => e.symbol_code) ?? []))];
function Qx(e) {
	let t = (t) => {
		let n = RegExp(`^<svg[^>]*\\s${t}="([\\d.]+)mm"`).exec(e);
		return n ? Number(n[1]) : null;
	}, n = t("width"), r = t("height");
	if (!n || !r) return e;
	let i = Math.max(n, r) / 300, a = i / 2, o = `<rect x="${a.toFixed(2)}" y="${a.toFixed(2)}" width="${(n - i).toFixed(2)}" height="${(r - i).toFixed(2)}" fill="none" stroke="#b4b1aa" stroke-width="${i.toFixed(2)}" vector-effect="non-scaling-stroke"/>`;
	return e.replace(/<\/svg>\s*$/, `${o}</svg>`);
}
function $x(e) {
	let t = [];
	function n(t) {
		if (typeof t == "number") return e.pickSizeById(t);
		let n = Yx[(t.size_units ?? "mm").toLowerCase()] ?? 0, r = Number(t.size_width) * n, i = Number(t.size_height) * n;
		e.pickSizeById(Number(t.size_id), r > 0 ? r : void 0, i > 0 ? i : void 0, Number(t.symbol_default_location) === 1 ? "left" : "above");
		let a = (t.face_hex ?? "").trim();
		e.setMaterialFace(/^#[0-9a-f]{6}$/i.test(a) ? a : null);
	}
	let r = null;
	Ln(() => e.view.value.doc, (e) => {
		if (!e || r === null) return;
		let t = r;
		r = null, n(t);
	});
	let i = {
		setSize: (t) => {
			if (!e.view.value.doc) {
				r = t;
				return;
			}
			n(t);
		},
		ready: () => e.cartReady(),
		forCart: async () => ({
			svg_raw: Qx(await e.previewSvg()),
			svg_export: await e.printSvg(),
			svg_json: e.designJson(),
			svg_bespoke_texts: JSON.stringify(Xx(e)),
			svg_bespoke_images: JSON.stringify(Zx(e))
		}),
		onChange: (e) => {
			t.push(e);
		},
		setVariants: (t, n) => e.setHostVariants(t, n),
		onVariant: (t) => e.onVariant(t)
	};
	return e.onChange(() => {
		for (let e of t) e(i.ready());
	}), window.signDesigner = i, i;
}
//#endregion
//#region editor/src/App.vue?vue&type=script&setup=true&lang.ts
var eS = {
	key: 0,
	class: "topbar"
}, tS = {
	key: 0,
	class: "loading"
}, nS = {
	key: 1,
	class: "notice",
	role: "alert"
}, rS = {
	key: 0,
	class: "crumbs",
	"aria-label": "Breadcrumb"
}, iS = { class: "layout" }, aS = { class: "preview-col" }, oS = { class: "preview-head" }, sS = {
	key: 0,
	class: "heading display"
}, cS = {
	class: "history",
	role: "group",
	"aria-label": "History"
}, lS = ["disabled"], uS = ["disabled"], dS = { class: "row-controls" }, fS = {
	key: 0,
	class: "small muted hint"
}, pS = {
	key: 1,
	class: "promises"
}, mS = { class: "panel" }, hS = {
	key: 0,
	class: "mode",
	role: "group",
	"aria-label": "Editor mode"
}, gS = ["aria-pressed"], _S = ["aria-pressed"], vS = {
	key: 1,
	class: "card outlined",
	role: "alertdialog",
	"aria-labelledby": "basic-q"
}, yS = { class: "row-controls" }, bS = {
	class: "card",
	"aria-labelledby": "text-heading"
}, xS = {
	key: 1,
	class: "footer"
}, SS = /* @__PURE__ */ R({
	__name: "App",
	setup(e) {
		let t = yg();
		Nn(bg, t);
		let { state: n, product: r, svg: i, findings: a, title: o, subtitle: s, mode: c, picker: l, selection: u, history: d, view: f } = t, p = /* @__PURE__ */ I(!1), m = !!Ml, h = /* @__PURE__ */ I(!1), g = Ml?.pageOwnsSize === !0, _ = J(() => t.variantSizes.value.length > 0);
		sr(() => {
			t.init(), Ml && $x(t), window.addEventListener("keydown", v);
		}), ur(() => window.removeEventListener("keydown", v));
		function v(e) {
			if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") return;
			let n = e.target;
			(!n || n.tagName !== "INPUT" && n.tagName !== "TEXTAREA" && !n.isContentEditable) && (e.preventDefault(), e.shiftKey ? t.redo() : t.undo());
		}
		function y(e) {
			p.value = !1, t.setMode(e) || (p.value = !0);
		}
		let b = J(() => f.value.doc ? hu(f.value.doc) : "single"), x = J(() => f.value.doc ? Of(f.value.doc) : null), S = J(() => !x.value && (b.value === "grid" || b.value === "stacked" || b.value === "board")), C = J(() => r.value?.board ?? !1), w = J(() => r.value?.roadsign ?? !1), T = J(() => w.value ? t.symbols.value.filter((e) => e.category === Th) : t.symbols.value), E = J(() => {
			let e = f.value.doc, n = C.value ? t.board.empty.value : 0;
			return n ? `Fill in ${n === 1 ? "the empty slot" : `the ${n} empty slots`} first — pick a message for each one.` : !e || !x.value || qf(e) ? "" : Bf(e).some((e) => e.source.trim() && (!e.text.trim() || e.stale)) ? "Some lines still need translating." : "Please tick “I have checked the translation” first.";
		}), ee = J(() => a.value.filter((e) => e.severity === "error").map((e) => {
			let t = Ud(e.path), n = t === null ? void 0 : f.value.doc?.root.sections[t], r = x.value && n ? `${n === x.value.target ? Tf(n.lang) : "English"}: ` : t !== null && S.value ? `${b.value === "stacked" ? "Section" : "Cell"} ${t + 1}: ` : "";
			return e.code === "E_TEXT_OVERFLOW" ? `${r}The text doesn’t fit at the smallest size. Try shorter wording, a smaller text setting, or a bigger sign.` : e.code === "E_SECTION_TOO_SMALL" ? `${r}There isn’t room for this much. Try fewer symbols or panels, or a bigger sign.` : `${r}${e.message}`;
		}).filter((e, t, n) => n.indexOf(e) === t)), te = J(() => `bespoke-${r.value?.type ?? "sign"}`), D = J(() => {
			let e = f.value.doc;
			if (!e) return "Sign preview";
			let n = e.root.sections.flatMap((e) => e.text_frame.panels.flatMap((e) => e.blocks.map((e) => e.text))).filter(Boolean);
			return `Sign preview: ${e.root.sections.flatMap((e) => e.symbol_frame?.symbols.map((e) => t.symbolEntry(e.symbol_code)?.name ?? e.symbol_code) ?? []).join(", ") || "no symbol"}${n.length ? `, “${n.join(", ")}”` : ""}`;
		}), ne = J(() => {
			let e = f.value.doc, r = [];
			if (e && n.suggesting) return r.push({
				ids: e.root.sections.flatMap(Rd),
				kind: "busy",
				label: "Designing your sign…"
			}), r;
			if (e && n.translating && x.value && t.translatingIds.value.length && r.push({
				ids: Rd(x.value.target),
				kind: "busy",
				label: `Translating into ${Tf(x.value.target.lang)}…`
			}), c.value !== "advanced" || !e) return r;
			let i = e.root.sections[u.section];
			if (!i) return r;
			S.value && r.push({
				ids: Rd(i),
				kind: "selected"
			});
			let a = i.text_frame.panels[u.panel];
			return a && i.text_frame.panels.length > 1 && r.push({
				ids: [a.id],
				kind: "panel"
			}), r;
		});
		function re(e) {
			let t = f.value.doc, n = t && e ? cu(t, e) : null;
			if (!t || !n) return null;
			let r = t.root.sections[n.section], i = r.symbol_frame?.symbols ?? [];
			return n.symbol !== null && i.length > 1 ? {
				key: `symbol:${n.section}:${n.symbol}`,
				group: `symbols:${n.section}`,
				ids: [i[n.symbol].id]
			} : S.value ? {
				key: `section:${n.section}`,
				group: "sections",
				ids: Rd(r)
			} : null;
		}
		function ie() {
			let e = f.value.doc;
			if (!e || c.value !== "advanced") return [];
			if (S.value) return e.root.sections.map((e, t) => ({
				key: `section:${t}`,
				group: "sections",
				ids: Rd(e)
			}));
			let t = e.root.sections[0]?.symbol_frame?.symbols ?? [];
			return t.length > 1 ? t.map((e, t) => ({
				key: `symbol:0:${t}`,
				group: "symbols:0",
				ids: [e.id]
			})) : [];
		}
		function ae(e, n) {
			let r = f.value.doc;
			if (c.value !== "advanced" || !r) return;
			let i = e ? cu(r, e) : null, a = i?.section ?? Hd(r, n.x, n.y);
			if (a == null) return;
			let o = x.value;
			if (o && r.root.sections[a] === o.target) {
				if (vn(() => document.getElementById("translation-card")?.scrollIntoView({
					behavior: "smooth",
					block: "nearest"
				})), i?.block !== null && i?.block !== void 0) {
					let e = o.target.text_frame.panels[i.panel ?? 0]?.blocks[i.block]?.id;
					e && vn(() => document.getElementById(`tr-${e}`)?.focus({ preventScroll: !0 }));
				}
				return;
			}
			o && (a = r.root.sections.indexOf(o.source)), a !== u.section && (u.panel = 0), u.section = a, i?.panel !== null && i?.panel !== void 0 && (u.panel = i.panel), C.value && t.offerPreset(u.section), window.matchMedia("(max-width: 960px)").matches && vn(() => document.getElementById("part-editor")?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			}));
		}
		function oe(e, n) {
			let [r, i, a] = e.split(":"), [, o, s] = n.split(":"), c = f.value.doc;
			if (c) {
				if (r === "symbol") {
					let e = c.root.sections[Number(i)].id;
					t.commit((t) => Uu(t, e, Number(a), Number(s)));
				} else {
					let [e, n] = [Number(i), Number(o)];
					t.commit((t) => b.value === "grid" || b.value === "board" ? Lu(t, e, n) : Iu(t, e, n)), u.section = n, u.panel = 0;
				}
			}
		}
		let O = J(() => C.value ? "Click a row to edit it, or drag one cell onto another to swap them." : x.value ? "Click the English to edit it, or the translation to jump to its wording." : b.value === "board" ? "Click a row to edit it. Drag one cell onto another to swap them." : b.value === "grid" ? "Click a cell to edit it. Drag one cell onto another to swap them." : b.value === "stacked" ? "Click a section to edit it. Drag a section to move it." : b.value === "multi" ? "Drag a symbol along the row to reorder it." : "Click a panel to edit it."), se = () => {
			let e = f.value.doc?.root.sections[0]?.id;
			e && t.openPicker({
				sectionId: e,
				index: 0
			});
		};
		return (e, a) => (V(), H(B, null, [
			m ? q("", !0) : (V(), H("header", eS, [...a[17] ||= [W("span", { class: "brand display" }, "Safety Signs & Notices", -1), W("span", { class: "tag" }, "Bespoke signs · test site", -1)]])),
			W("main", { class: he(["page", { embedded: m }]) }, [L(n).status === "loading" ? (V(), H("div", tS, "Loading the sign designer…")) : L(n).status === "error" ? (V(), H("div", nS, " The designer couldn’t start: " + M(L(n).error), 1)) : (V(), H(B, { key: 2 }, [
				m ? q("", !0) : (V(), H("nav", rS, [
					a[18] ||= W("span", null, "Safety Signs", -1),
					a[19] ||= W("span", { "aria-hidden": "true" }, "/", -1),
					a[20] ||= W("span", null, "Bespoke", -1),
					a[21] ||= W("span", { "aria-hidden": "true" }, "/", -1),
					W("strong", null, M(L(r)?.heading), 1)
				])),
				W("div", iS, [W("div", aS, [
					W("div", oS, [g ? q("", !0) : (V(), H("h1", sS, M(L(r)?.heading), 1)), W("div", cS, [W("button", {
						class: "btn small-btn",
						disabled: !L(d).canUndo,
						title: "Undo (Ctrl/⌘+Z)",
						onClick: a[0] ||= (e) => L(t).undo()
					}, "↶ Undo", 8, lS), W("button", {
						class: "btn small-btn",
						disabled: !L(d).canRedo,
						title: "Redo (Ctrl/⌘+Shift+Z)",
						onClick: a[1] ||= (e) => L(t).redo()
					}, "↷ Redo", 8, uS)])]),
					G(e_, {
						svg: L(i),
						label: D.value,
						interactive: L(c) === "advanced",
						highlights: ne.value,
						"drag-item": re,
						movables: ie,
						onPick: ae,
						onDrop: oe
					}, null, 8, [
						"svg",
						"label",
						"interactive",
						"highlights"
					]),
					W("div", dS, [W("button", {
						class: "btn",
						onClick: a[2] ||= (e) => h.value = !0
					}, "Preview this sign"), a[22] ||= W("span", { class: "small muted" }, "See it at actual size, against a door.", -1)]),
					L(c) === "advanced" ? (V(), H("p", fS, M(O.value), 1)) : q("", !0),
					(V(!0), H(B, null, z(ee.value, (e) => (V(), H("div", {
						key: e,
						class: "notice",
						role: "status"
					}, M(e), 1))), 128)),
					L(t).review ? q("", !0) : (V(), H("div", pS, [...a[23] ||= [
						W("span", null, "Printed exactly to size", -1),
						W("span", { "aria-hidden": "true" }, "·", -1),
						W("span", null, "Official ISO 7010 symbols", -1)
					]]))
				]), W("div", mS, [
					!C.value && !w.value ? (V(), H("div", hS, [W("button", {
						"aria-pressed": L(c) === "basic",
						onClick: a[3] ||= (e) => y("basic")
					}, "Basic", 8, gS), W("button", {
						"aria-pressed": L(c) === "advanced",
						onClick: a[4] ||= (e) => y("advanced")
					}, "Advanced", 8, _S)])) : q("", !0),
					p.value ? (V(), H("section", vS, [
						a[24] ||= W("h2", {
							id: "basic-q",
							style: {
								margin: "0",
								"font-size": "18px"
							}
						}, "Switch to Basic?", -1),
						a[25] ||= W("p", { style: { margin: "0" } }, "Basic shows one symbol with a title and one more line. Switching keeps the first symbol and the first two lines of text; the rest is removed (you can undo).", -1),
						W("div", yS, [W("button", {
							class: "btn strong",
							onClick: a[5] ||= (e) => {
								p.value = !1, L(t).resetToBasic();
							}
						}, "Switch to Basic"), W("button", {
							class: "btn",
							onClick: a[6] ||= (e) => p.value = !1
						}, "Stay in Advanced")])
					])) : q("", !0),
					L(l) ? (V(), U($_, {
						key: 2,
						symbols: T.value,
						categories: L(t).categories.value,
						preferred: L(r)?.category ?? null,
						current: L(c) === "basic" ? L(t).currentSymbol.value?.code ?? null : L(t).pickerCurrent.value,
						busy: L(n).symbolBusy,
						error: L(n).symbolError,
						noun: w.value ? "arrow" : "symbol",
						onPick: L(t).pickSymbol,
						onDone: a[7] ||= (e) => L(t).closePicker()
					}, null, 8, [
						"symbols",
						"categories",
						"preferred",
						"current",
						"busy",
						"error",
						"noun",
						"onPick"
					])) : w.value ? (V(), U(Ix, {
						key: 3,
						sizes: !g
					}, null, 8, ["sizes"])) : L(t).board.picker.value ? (V(), U(Jx, { key: 4 })) : C.value ? (V(), U(wx, { key: 5 })) : L(c) === "basic" ? (V(), H(B, { key: 6 }, [
						L(t).canSuggest ? (V(), U(Zg, { key: 0 })) : q("", !0),
						_.value ? (V(), U(R_, { key: 1 })) : g ? q("", !0) : (V(), U(A_, {
							key: 2,
							sizes: L(t).sizes.value,
							current: L(t).currentSize.value,
							onPick: L(t).pickSize
						}, null, 8, [
							"sizes",
							"current",
							"onPick"
						])),
						G(ov, {
							current: L(t).currentSymbol.value,
							onChange: se
						}, null, 8, ["current"]),
						W("section", bS, [
							a[26] ||= W("div", { class: "step-head" }, [W("span", { class: "step-no" }, "3"), W("h2", { id: "text-heading" }, "Text")], -1),
							G(xv, {
								id: "title",
								label: "Title",
								text: L(o).text,
								align: L(o).align,
								caps: L(o).caps,
								"size-label": L(o).label,
								mm: L(o).mm,
								onText: a[8] ||= (e) => L(t).setText("title", e),
								onBump: a[9] ||= (e) => L(t).bumpSize("title", e),
								onAlign: a[10] ||= (e) => L(t).setAlign("title", e),
								onCaps: a[11] ||= (e) => L(t).setCaps("title", e)
							}, null, 8, [
								"text",
								"align",
								"caps",
								"size-label",
								"mm"
							]),
							G(xv, {
								id: "subtitle",
								label: "Additional text (optional)",
								placeholder: "e.g. on these premises",
								text: L(s).text,
								align: L(s).align,
								caps: L(s).caps,
								"size-label": L(s).label,
								mm: L(s).mm,
								onText: a[12] ||= (e) => L(t).setText("subtitle", e),
								onBump: a[13] ||= (e) => L(t).bumpSize("subtitle", e),
								onAlign: a[14] ||= (e) => L(t).setAlign("subtitle", e),
								onCaps: a[15] ||= (e) => L(t).setCaps("subtitle", e)
							}, null, 8, [
								"text",
								"align",
								"caps",
								"size-label",
								"mm"
							]),
							a[27] ||= W("p", {
								class: "small muted",
								style: { margin: "0" }
							}, "Text still shrinks to fit if it gets too long. Need more? Try Advanced.", -1)
						]),
						G(Lg),
						L(r)?.bilingual ? (V(), U(Wb, {
							key: 3,
							step: 4
						})) : q("", !0)
					], 64)) : (V(), H(B, { key: 7 }, [L(t).canSuggest ? (V(), U(Zg, { key: 0 })) : q("", !0), G(Gb)], 64)),
					L(t).review && !L(l) && !L(t).board.picker.value ? (V(), U(Ag, { key: 8 })) : !L(l) && !L(t).board.picker.value && !g ? (V(), U(ko, {
						key: 9,
						"design-json": L(t).designJson,
						"preview-svg": L(t).printSvg,
						"file-stem": te.value,
						blocked: E.value
					}, null, 8, [
						"design-json",
						"preview-svg",
						"file-stem",
						"blocked"
					])) : q("", !0)
				])]),
				m ? q("", !0) : (V(), H("p", xS, "Data: " + M(L(t).dataSource.value) + " · Symbols: " + M(L(t).symbols.value.length), 1))
			], 64))], 2),
			h.value ? (V(), U(m_, {
				key: 1,
				onClose: a[16] ||= (e) => h.value = !1
			})) : q("", !0)
		], 64));
	}
});
//#endregion
//#region editor/src/main.ts
Ml || document.documentElement.classList.add("sign-designer-site");
var CS = document.querySelector(Ml?.mount ?? "#app");
CS?.classList.add("sign-designer-root"), yo(SS).mount(CS ?? Ml?.mount ?? "#app");
//#endregion
