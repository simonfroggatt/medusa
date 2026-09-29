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
}, u = Object.prototype.hasOwnProperty, d = (e, t) => u.call(e, t), f = Array.isArray, p = (e) => S(e) === "[object Map]", m = (e) => S(e) === "[object Set]", h = (e) => S(e) === "[object Date]", g = (e) => typeof e == "function", _ = (e) => typeof e == "string", v = (e) => typeof e == "symbol", y = (e) => typeof e == "object" && !!e, b = (e) => (y(e) || g(e)) && g(e.then) && g(e.catch), x = Object.prototype.toString, S = (e) => x.call(e), C = (e) => S(e).slice(8, -1), w = (e) => S(e) === "[object Object]", T = (e) => _(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, E = /* @__PURE__ */ t(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), D = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, O = /-\w/g, ee = D((e) => e.replace(O, (e) => e.slice(1).toUpperCase())), te = /\B([A-Z])/g, ne = D((e) => e.replace(te, "-$1").toLowerCase()), re = D((e) => e.charAt(0).toUpperCase() + e.slice(1)), ie = D((e) => e ? `on${re(e)}` : ""), k = (e, t) => !Object.is(e, t), ae = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, oe = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, A = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, se, ce = () => se ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function j(e) {
	if (f(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = _(r) ? fe(r) : j(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (_(e) || y(e)) return e;
}
var le = /;(?![^(]*\))/g, ue = /:([^]+)/, de = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function fe(e) {
	let t = {};
	return e.replace(de, (e) => e.startsWith("/*") ? "" : e).split(le).forEach((e) => {
		if (e) {
			let n = e.split(ue);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function pe(e) {
	let t = "";
	if (_(e)) t = e;
	else if (f(e)) for (let n = 0; n < e.length; n++) {
		let r = pe(e[n]);
		r && (t += r + " ");
	}
	else if (y(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var me = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", he = /* @__PURE__ */ t(me);
me + "";
function ge(e) {
	return !!e || e === "";
}
function _e(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = ye(e[i], t[i], n);
	return r;
}
function M(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && ye(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function ve(e, t, n) {
	let r = p(e), i = p(t);
	if (r || i || (r = m(e), i = m(t), r || i)) return r && i ? M(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !ye(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function N(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function ye(e, t, n) {
	if (e === t) return !0;
	let r = h(e), i = h(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = v(e), i = v(t), r || i ? e === t : (r = f(e), i = f(t), r || i ? r && i ? N(e, t, n, _e) : !1 : (r = y(e), i = y(t), r || i ? !r || !i ? !1 : N(e, t, n, ve) : String(e) === String(t))));
}
var be = (e) => !!(e && e.__v_isRef === !0), P = (e) => _(e) ? e : e == null ? "" : f(e) || y(e) && (e.toString === x || !g(e.toString)) ? be(e) ? P(e.value) : JSON.stringify(e, xe, 2) : String(e), xe = (e, t) => be(t) ? xe(e, t.value) : p(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Se(t, r) + " =>"] = n, e), {}) } : m(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Se(e)) } : v(t) ? Se(t) : y(t) && !f(t) && !w(t) ? String(t) : t, Se = (e, t = "") => v(e) ? `Symbol(${e.description ?? t})` : e, Ce, we = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Ce && (Ce.active ? (this.parent = Ce, this.index = (Ce.scopes || (Ce.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = Ce;
			try {
				return Ce = this, e();
			} finally {
				Ce = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Ce, Ce = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Ce === this) Ce = this.prevScope;
			else {
				let e = Ce;
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
function Te() {
	return Ce;
}
var F, Ee = /* @__PURE__ */ new WeakSet(), De = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ce && (Ce.active ? Ce.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Ee.has(this) && (Ee.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || je(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, We(this), Pe(this);
		let e = F, t = Be;
		F = this, Be = !0;
		try {
			return this.fn();
		} finally {
			Fe(this), F = e, Be = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Re(e);
			this.deps = this.depsTail = void 0, We(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ee.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Ie(this) && this.run();
	}
	get dirty() {
		return Ie(this);
	}
}, Oe = 0, ke, Ae;
function je(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Ae, Ae = e;
		return;
	}
	e.next = ke, ke = e;
}
function Me() {
	Oe++;
}
function Ne() {
	if (--Oe > 0) return;
	if (Ae) {
		let e = Ae;
		for (Ae = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; ke;) {
		let t = ke;
		for (ke = void 0; t;) {
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
function Pe(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Fe(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Re(r), ze(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Ie(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Le(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Le(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ge) || (e.globalVersion = Ge, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ie(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = F, r = Be;
	F = e, Be = !0;
	try {
		Pe(e);
		let n = e.fn(e._value);
		(t.version === 0 || k(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		F = n, Be = r, Fe(e), e.flags &= -3;
	}
}
function Re(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Re(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function ze(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Be = !0, Ve = [];
function He() {
	Ve.push(Be), Be = !1;
}
function Ue() {
	let e = Ve.pop();
	Be = e === void 0 || e;
}
function We(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = F;
		F = void 0;
		try {
			t();
		} finally {
			F = e;
		}
	}
}
var Ge = 0, Ke = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, qe = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!F || !Be || F === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== F) t = this.activeLink = new Ke(F, this), F.deps ? (t.prevDep = F.depsTail, F.depsTail.nextDep = t, F.depsTail = t) : F.deps = F.depsTail = t, Je(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = F.depsTail, t.nextDep = void 0, F.depsTail.nextDep = t, F.depsTail = t, F.deps === t && (F.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ge++, this.notify(e);
	}
	notify(e) {
		Me();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Ne();
		}
	}
};
function Je(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Je(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Ye = /* @__PURE__ */ new WeakMap(), Xe = /* @__PURE__ */ Symbol(""), Ze = /* @__PURE__ */ Symbol(""), Qe = /* @__PURE__ */ Symbol("");
function $e(e, t, n) {
	if (Be && F) {
		let t = Ye.get(e);
		t || Ye.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new qe()), r.map = t, r.key = n), r.track();
	}
}
function et(e, t, n, r, i, a) {
	let o = Ye.get(e);
	if (!o) {
		Ge++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Me(), t === "clear") o.forEach(s);
	else {
		let i = f(e), a = i && T(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Qe || !v(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Qe)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Xe)), p(e) && s(o.get(Ze)));
				break;
			case "delete":
				i || (s(o.get(Xe)), p(e) && s(o.get(Ze)));
				break;
			case "set": p(e) && s(o.get(Xe));
		}
	}
	Ne();
}
function tt(e) {
	let t = /* @__PURE__ */ I(e);
	return t === e || ($e(t, "iterate", Qe), /* @__PURE__ */ Bt(e)) ? t : /* @__PURE__ */ zt(e) ? /* @__PURE__ */ Rt(e) ? t.map((e) => Wt(Ut(e))) : t.map(Wt) : t.map(Ut);
}
function nt(e) {
	return $e(e = /* @__PURE__ */ I(e), "iterate", Qe), e;
}
function rt(e, t) {
	return /* @__PURE__ */ zt(e) ? Wt(/* @__PURE__ */ Rt(e) ? Ut(t) : t) : Ut(t);
}
var it = {
	__proto__: null,
	[Symbol.iterator]() {
		return at(this, Symbol.iterator, (e) => rt(this, e));
	},
	concat(...e) {
		return tt(this).concat(...e.map((e) => f(e) ? tt(e) : e));
	},
	entries() {
		return at(this, "entries", (e) => (e[1] = rt(this, e[1]), e));
	},
	every(e, t) {
		return st(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return st(this, "filter", e, t, (e) => e.map((e) => rt(this, e)), arguments);
	},
	find(e, t) {
		return st(this, "find", e, t, (e) => rt(this, e), arguments);
	},
	findIndex(e, t) {
		return st(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return st(this, "findLast", e, t, (e) => rt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return st(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return st(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return lt(this, "includes", e);
	},
	indexOf(...e) {
		return lt(this, "indexOf", e);
	},
	join(e) {
		return tt(this).join(e);
	},
	lastIndexOf(...e) {
		return lt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return st(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return ut(this, "pop");
	},
	push(...e) {
		return ut(this, "push", e);
	},
	reduce(e, ...t) {
		return ct(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return ct(this, "reduceRight", e, t);
	},
	shift() {
		return ut(this, "shift");
	},
	some(e, t) {
		return st(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return ut(this, "splice", e);
	},
	toReversed() {
		return tt(this).toReversed();
	},
	toSorted(e) {
		return tt(this).toSorted(e);
	},
	toSpliced(...e) {
		return tt(this).toSpliced(...e);
	},
	unshift(...e) {
		return ut(this, "unshift", e);
	},
	values() {
		return at(this, "values", (e) => rt(this, e));
	}
};
function at(e, t, n) {
	let r = nt(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Bt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var ot = Array.prototype;
function st(e, t, n, r, i, a) {
	let o = nt(e), s = o !== e && !/* @__PURE__ */ Bt(e), c = o[t];
	if (c !== ot[t]) {
		let t = c.apply(e, a);
		return s ? Ut(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, rt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function ct(e, t, n, r) {
	let i = nt(e), a = i !== e && !/* @__PURE__ */ Bt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = rt(e, t)), n.call(this, t, rt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? rt(e, c) : c;
}
function lt(e, t, n) {
	let r = /* @__PURE__ */ I(e);
	$e(r, "iterate", Qe);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Vt(n[0]) ? (n[0] = /* @__PURE__ */ I(n[0]), r[t](...n)) : i;
}
function ut(e, t, n = []) {
	He(), Me();
	let r = (/* @__PURE__ */ I(e))[t].apply(e, n);
	return Ne(), Ue(), r;
}
var dt = /* @__PURE__ */ t("__proto__,__v_isRef,__isVue"), ft = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(v));
function pt(e) {
	v(e) || (e = String(e));
	let t = /* @__PURE__ */ I(this);
	return $e(t, "has", e), t.hasOwnProperty(e);
}
var mt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Mt : jt : i ? At : kt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = f(e);
		if (!r) {
			let e;
			if (a && (e = it[t])) return e;
			if (t === "hasOwnProperty") return pt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ Gt(e) ? e : n);
		if ((v(t) ? ft.has(t) : dt(t)) || (r || $e(e, "get", t), i)) return o;
		if (/* @__PURE__ */ Gt(o)) {
			let e = a && T(t) ? o : o.value;
			return r && y(e) ? /* @__PURE__ */ It(e) : e;
		}
		return y(o) ? r ? /* @__PURE__ */ It(o) : /* @__PURE__ */ Pt(o) : o;
	}
}, ht = class extends mt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = f(e) && T(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ zt(i);
			if (!/* @__PURE__ */ Bt(n) && !/* @__PURE__ */ zt(n) && (i = /* @__PURE__ */ I(i), n = /* @__PURE__ */ I(n)), !a && /* @__PURE__ */ Gt(i) && !/* @__PURE__ */ Gt(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : d(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ Gt(e) ? e : r);
		return e === /* @__PURE__ */ I(r) && s && (o ? k(n, i) && et(e, "set", t, n, i) : et(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = d(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && et(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!v(t) || !ft.has(t)) && $e(e, "has", t), n;
	}
	ownKeys(e) {
		return $e(e, "iterate", f(e) ? "length" : Xe), Reflect.ownKeys(e);
	}
}, gt = class extends mt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, _t = /* @__PURE__ */ new ht(), vt = /* @__PURE__ */ new gt(), yt = /* @__PURE__ */ new ht(!0), bt = (e) => e, xt = (e) => Reflect.getPrototypeOf(e);
function St(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ I(i), o = p(a), s = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? bt : t ? Wt : Ut;
		return !t && $e(a, "iterate", l ? Ze : Xe), c(Object.create(u), { next() {
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
function Ct(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function wt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ I(r), a = /* @__PURE__ */ I(n);
			e || (k(n, a) && $e(i, "get", n), $e(i, "get", a));
			let { has: o } = xt(i), s = t ? bt : e ? Wt : Ut;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && $e(/* @__PURE__ */ I(t), "iterate", Xe), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ I(n), i = /* @__PURE__ */ I(t);
			return e || (k(t, i) && $e(r, "has", t), $e(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ I(a), s = t ? bt : e ? Wt : Ut;
			return !e && $e(o, "iterate", Xe), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return c(n, e ? {
		add: Ct("add"),
		set: Ct("set"),
		delete: Ct("delete"),
		clear: Ct("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ I(this), r = xt(n), i = /* @__PURE__ */ I(e), a = !t && !/* @__PURE__ */ Bt(e) && !/* @__PURE__ */ zt(e) ? i : e;
			return r.has.call(n, a) || k(e, a) && r.has.call(n, e) || k(i, a) && r.has.call(n, i) || (n.add(a), et(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Bt(n) && !/* @__PURE__ */ zt(n) && (n = /* @__PURE__ */ I(n));
			let r = /* @__PURE__ */ I(this), { has: i, get: a } = xt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ I(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? k(n, s) && et(r, "set", e, n, s) : et(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ I(this), { has: n, get: r } = xt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ I(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && et(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ I(this), t = e.size !== 0, n = e.clear();
			return t && et(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = St(r, e, t);
	}), n;
}
function Tt(e, t) {
	let n = wt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(d(n, r) && r in t ? n : t, r, i);
}
var Et = { get: /* @__PURE__ */ Tt(!1, !1) }, Dt = { get: /* @__PURE__ */ Tt(!1, !0) }, Ot = { get: /* @__PURE__ */ Tt(!0, !1) }, kt = /* @__PURE__ */ new WeakMap(), At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap(), Mt = /* @__PURE__ */ new WeakMap();
function Nt(e) {
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
function Pt(e) {
	return /* @__PURE__ */ zt(e) ? e : Lt(e, !1, _t, Et, kt);
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return Lt(e, !1, yt, Dt, At);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return Lt(e, !0, vt, Ot, jt);
}
function Lt(e, t, n, r, i) {
	if (!y(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Nt(C(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return /* @__PURE__ */ zt(e) ? /* @__PURE__ */ Rt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function I(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ I(t) : e;
}
function Ht(e) {
	return !d(e, "__v_skip") && Object.isExtensible(e) && oe(e, "__v_skip", !0), e;
}
var Ut = (e) => y(e) ? /* @__PURE__ */ Pt(e) : e, Wt = (e) => y(e) ? /* @__PURE__ */ It(e) : e;
// @__NO_SIDE_EFFECTS__
function Gt(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function L(e) {
	return qt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Kt(e) {
	return qt(e, !0);
}
function qt(e, t) {
	return /* @__PURE__ */ Gt(e) ? e : new Jt(e, t);
}
var Jt = class {
	constructor(e, t) {
		this.dep = new qe(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ I(e), this._value = t ? e : Ut(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Bt(e) || /* @__PURE__ */ zt(e);
		e = n ? e : /* @__PURE__ */ I(e), k(e, t) && (this._rawValue = e, this._value = n ? e : Ut(e), this.dep.trigger());
	}
};
function R(e) {
	return /* @__PURE__ */ Gt(e) ? e.value : e;
}
var Yt = {
	get: (e, t, n) => t === "__v_raw" ? e : R(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ Gt(i) && !/* @__PURE__ */ Gt(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Xt(e) {
	return /* @__PURE__ */ Rt(e) ? e : new Proxy(e, Yt);
}
var Zt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new qe(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ge - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && F !== this) return je(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Le(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Qt(e, t, n = !1) {
	let r, i;
	return g(e) ? r = e : (r = e.get, i = e.set), new Zt(r, i, n);
}
var $t = {}, en = /* @__PURE__ */ new WeakMap(), tn = void 0;
function nn(e, t = !1, n = tn) {
	if (n) {
		let t = en.get(n);
		t || en.set(n, t = []), t.push(e);
	}
}
function rn(e, t, r = n) {
	let { immediate: a, deep: o, once: s, scheduler: c, augmentJob: u, call: d } = r, p = (e) => o ? e : /* @__PURE__ */ Bt(e) || o === !1 || o === 0 ? an(e, 1) : an(e), m, h, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ Gt(e) ? (h = () => e.value, y = /* @__PURE__ */ Bt(e)) : /* @__PURE__ */ Rt(e) ? (h = () => p(e), y = !0) : f(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Rt(e) || /* @__PURE__ */ Bt(e)), h = () => e.map((e) => {
		if (/* @__PURE__ */ Gt(e)) return e.value;
		if (/* @__PURE__ */ Rt(e)) return p(e);
		if (g(e)) return d ? d(e, 2) : e();
	})) : h = g(e) ? t ? d ? () => d(e, 2) : e : () => {
		if (_) {
			He();
			try {
				_();
			} finally {
				Ue();
			}
		}
		let t = tn;
		tn = m;
		try {
			return d ? d(e, 3, [v]) : e(v);
		} finally {
			tn = t;
		}
	} : i, t && o) {
		let e = h, t = o === !0 ? Infinity : o;
		h = () => an(e(), t);
	}
	let x = Te(), S = () => {
		m.stop(), x && x.active && l(x.effects, m);
	};
	if (s && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill($t) : $t, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (t) {
				let n = m.run();
				if (e || o || y || (b ? n.some((e, t) => k(e, C[t])) : k(n, C))) {
					_ && _();
					let e = tn;
					tn = m;
					try {
						let e = [
							n,
							C === $t ? void 0 : b && C[0] === $t ? [] : C,
							v
						];
						C = n, d ? d(t, 3, e) : t(...e);
					} finally {
						tn = e;
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new De(h), m.scheduler = c ? () => c(w, !1) : w, v = (e) => nn(e, !1, m), _ = m.onStop = () => {
		let e = en.get(m);
		if (e) {
			if (d) d(e, 4);
			else for (let t of e) t();
			en.delete(m);
		}
	}, t ? a ? w(!0) : C = m.run() : c ? c(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function an(e, t = Infinity, n) {
	if (t <= 0 || !y(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ Gt(e)) an(e.value, t, n);
	else if (f(e)) for (let r = 0; r < e.length; r++) an(e[r], t, n);
	else if (m(e) || p(e)) e.forEach((e) => {
		an(e, t, n);
	});
	else if (w(e)) {
		for (let r in e) an(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && an(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function on(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		cn(e, t, n);
	}
}
function sn(e, t, n, r) {
	if (g(e)) {
		let i = on(e, t, n, r);
		return i && b(i) && i.catch((e) => {
			cn(e, t, n);
		}), i;
	}
	if (f(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(sn(e[a], t, n, r));
		return i;
	}
}
function cn(e, t, r, i = !0) {
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
			He(), on(o, null, 10, [
				e,
				i,
				a
			]), Ue();
			return;
		}
	}
	ln(e, r, a, i, s);
}
function ln(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var un = [], dn = -1, fn = [], pn = null, mn = 0, hn = /* @__PURE__ */ Promise.resolve(), gn = null;
function _n(e) {
	let t = gn || hn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function vn(e) {
	let t = dn + 1, n = un.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = un[r], a = wn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function yn(e) {
	if (!(e.flags & 1)) {
		let t = wn(e), n = un[un.length - 1];
		!n || !(e.flags & 2) && t >= wn(n) ? un.push(e) : un.splice(vn(t), 0, e), e.flags |= 1, bn();
	}
}
function bn() {
	gn ||= hn.then(Tn);
}
function xn(e) {
	if (!f(e)) pn && e.id === -1 ? pn.splice(mn + 1, 0, e) : e.flags & 1 || (fn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) fn.push(e[t]);
	bn();
}
function Sn(e, t, n = dn + 1) {
	for (; n < un.length; n++) {
		let t = un[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			un.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function Cn(e) {
	if (fn.length) {
		let e = [...new Set(fn)].sort((e, t) => wn(e) - wn(t));
		if (fn.length = 0, pn) {
			for (let t = 0; t < e.length; t++) pn.push(e[t]);
			return;
		}
		for (pn = e, mn = 0; mn < pn.length; mn++) {
			let e = pn[mn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		pn = null, mn = 0;
	}
}
var wn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Tn(e) {
	try {
		for (dn = 0; dn < un.length; dn++) {
			let e = un[dn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), on(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; dn < un.length; dn++) {
			let e = un[dn];
			e && (e.flags &= -2);
		}
		dn = -1, un.length = 0, Cn(e), gn = null, (un.length || fn.length) && Tn(e);
	}
}
var En = null, Dn = null;
function On(e) {
	let t = En;
	return En = e, Dn = e && e.type.__scopeId || null, t;
}
function kn(e, t = En, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Ii(-1);
		let i = On(t), a = Mi.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Mi.length; e > a; e--) Pi();
			On(i), r._d && Ii(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function An(e, t) {
	if (En === null) return e;
	let r = ha(En), i = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [a, o, s, c = n] = t[e];
		a && (g(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && an(o), i.push({
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
function jn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (He(), sn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ue());
	}
}
function Mn(e, t) {
	if (ta) {
		let n = ta.provides, r = ta.parent && ta.parent.provides;
		r === n && (n = ta.provides = Object.create(r)), n[e] = t;
	}
}
function Nn(e, t, n = !1) {
	let r = na();
	if (r || zr) {
		let i = zr ? zr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && g(t) ? t.call(r && r.proxy) : t;
	}
}
var Pn = /* @__PURE__ */ Symbol.for("v-scx"), Fn = () => Nn(Pn);
function In(e, t, n) {
	return Ln(e, t, n);
}
function Ln(e, t, r = n) {
	let { immediate: a, deep: o, flush: s, once: l } = r, u = c({}, r), d = t && a || !t && s !== "post", f;
	if (ca) {
		if (s === "sync") {
			let e = Fn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = i, e.resume = i, e.pause = i, e;
		}
	}
	let p = ta;
	u.call = (e, t, n) => sn(e, p, t, n);
	let m = !1;
	s === "post" ? u.scheduler = (e) => {
		gi(e, p && p.suspense);
	} : s !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : yn(e);
	}), u.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = rn(e, t, u);
	return ca && (f ? f.push(h) : d && h()), h;
}
function Rn(e, t, n) {
	let r = this.proxy, i = _(e) ? e.includes(".") ? zn(r, e) : () => r[e] : e.bind(r, r), a;
	g(t) ? a = t : (a = t.handler, n = t);
	let o = aa(this), s = Ln(i, a.bind(r), n);
	return o(), s;
}
function zn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Bn = /* @__PURE__ */ Symbol("_vte"), Vn = (e) => e.__isTeleport, Hn = /* @__PURE__ */ Symbol("_leaveCb");
function Un(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Ai) {
			t = n;
			break;
		}
	}
	return t;
}
function Wn(e) {
	if (!Qn(e)) return Vn(e.type) && e.children ? Un(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && g(n.default)) return n.default();
	}
}
function Gn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Gn(Vn(n.type) && Wn(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function z(e, t) {
	return g(e) ? /* @__PURE__ */ c({ name: e.name }, t, { setup: e }) : e;
}
function Kn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function qn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Jn = /* @__PURE__ */ new WeakMap();
function Yn(e, t, r, i, o = !1) {
	if (f(e)) {
		e.forEach((e, n) => Yn(e, t && (f(t) ? t[n] : t), r, i, o));
		return;
	}
	if (Zn(i) && !o) {
		i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && Yn(e, t, r, i.component.subTree);
		return;
	}
	let s = i.shapeFlag & 4 ? ha(i.component) : i.el, c = o ? null : s, { i: u, r: p } = e, m = t && t.r, h = u.refs === n ? u.refs = {} : u.refs, v = u.setupState, y = /* @__PURE__ */ I(v), b = v === n ? a : (e) => !qn(h, e) && d(y, e), x = (e, t) => !(t && qn(h, t));
	if (m != null && m !== p) {
		if (Xn(t), _(m)) h[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ Gt(m)) {
			let e = t;
			x(m, e.k) && (m.value = null), e.k && (h[e.k] = null);
		}
	}
	if (g(p)) on(p, u, 12, [c, h]);
	else {
		let t = _(p), n = /* @__PURE__ */ Gt(p);
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
					i(), Jn.delete(e);
				};
				t.id = -1, Jn.set(e, t), gi(t, r);
			} else Xn(e), i();
		}
	}
}
function Xn(e) {
	let t = Jn.get(e);
	t && (t.flags |= 8, Jn.delete(e));
}
ce().requestIdleCallback, ce().cancelIdleCallback;
var Zn = (e) => !!e.type.__asyncLoader, Qn = (e) => e.type.__isKeepAlive;
function $n(e, t) {
	tr(e, "a", t);
}
function er(e, t) {
	tr(e, "da", t);
}
function tr(e, t, n = ta) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (rr(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Qn(e.parent.vnode) && nr(r, t, n, e), e = e.parent;
	}
}
function nr(e, t, n, r) {
	let i = rr(t, e, r, !0);
	ur(() => {
		l(r[t], i);
	}, n);
}
function rr(e, t, n = ta, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			He();
			let i = aa(n), a = sn(t, n, e, r);
			return i(), Ue(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var ir = (e) => (t, n = ta) => {
	(!ca || e === "sp") && rr(e, (...e) => t(...e), n);
}, ar = ir("bm"), or = ir("m"), sr = ir("bu"), cr = ir("u"), lr = ir("bum"), ur = ir("um"), dr = ir("sp"), fr = ir("rtg"), pr = ir("rtc");
function mr(e, t = ta) {
	rr("ec", e, t);
}
var hr = /* @__PURE__ */ Symbol.for("v-ndc");
function B(e, t, n, r) {
	let i, a = n && n[r], o = f(e);
	if (o || _(e)) {
		let n = o && /* @__PURE__ */ Rt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Bt(e), s = /* @__PURE__ */ zt(e), e = nt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Wt(Ut(e[n])) : Ut(e[n]) : e[n], n, void 0, a && a[n]);
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
var gr = (e) => e ? sa(e) ? ha(e) : gr(e.parent) : null, _r = /* @__PURE__ */ c(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => gr(e.parent),
	$root: (e) => gr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Er(e),
	$forceUpdate: (e) => e.f ||= () => {
		yn(e.update);
	},
	$nextTick: (e) => e.n ||= _n.bind(e.proxy),
	$watch: (e) => Rn.bind(e)
}), vr = (e, t) => e !== n && !e.__isScriptSetup && d(e, t), yr = {
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
			else if (vr(i, t)) return s[t] = 1, i[t];
			else if (a !== n && d(a, t)) return s[t] = 2, a[t];
			else if (d(o, t)) return s[t] = 3, o[t];
			else if (r !== n && d(r, t)) return s[t] = 4, r[t];
			else xr && (s[t] = 0);
		}
		let u = _r[t], f, p;
		if (u) return t === "$attrs" && $e(e.attrs, "get", ""), u(e);
		if ((f = c.__cssModules) && (f = f[t])) return f;
		if (r !== n && d(r, t)) return s[t] = 4, r[t];
		if (p = l.config.globalProperties, d(p, t)) return p[t];
	},
	set({ _: e }, t, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return vr(a, t) ? (a[t] = r, !0) : i !== n && d(i, t) ? (i[t] = r, !0) : d(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (o[t] = r, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== n && c[0] !== "$" && d(e, c) || vr(t, c) || d(o, c) || d(i, c) || d(_r, c) || d(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? d(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function br(e) {
	return f(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var xr = !0;
function Sr(e) {
	let t = Er(e), n = e.proxy, r = e.ctx;
	xr = !1, t.beforeCreate && wr(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: d, beforeMount: p, mounted: m, beforeUpdate: h, updated: _, activated: v, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: D, errorCaptured: O, serverPrefetch: ee, expose: te, inheritAttrs: ne, components: re, directives: ie, filters: k } = t;
	if (u && Cr(u, r, null), s) for (let e in s) {
		let t = s[e];
		g(t) && (r[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		y(t) && (e.data = /* @__PURE__ */ Pt(t));
	}
	if (xr = !0, o) for (let e in o) {
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
	if (c) for (let e in c) Tr(c[e], r, n, e);
	if (l) {
		let e = g(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Mn(t, e[t]);
		});
	}
	d && wr(d, e, "c");
	function ae(e, t) {
		f(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (ae(ar, p), ae(or, m), ae(sr, h), ae(cr, _), ae($n, v), ae(er, b), ae(mr, O), ae(pr, E), ae(fr, D), ae(lr, S), ae(ur, w), ae(dr, ee), f(te)) {
		if (te.length) {
			let t = e.exposed ||= {};
			te.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	T && e.render === i && (e.render = T), ne != null && (e.inheritAttrs = ne), re && (e.components = re), ie && (e.directives = ie), ee && Kn(e);
}
function Cr(e, t, n = i) {
	f(e) && (e = jr(e));
	for (let n in e) {
		let r = e[n], i;
		i = y(r) ? "default" in r ? Nn(r.from || n, r.default, !0) : Nn(r.from || n) : Nn(r), /* @__PURE__ */ Gt(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function wr(e, t, n) {
	sn(f(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Tr(e, t, n, r) {
	let i = r.includes(".") ? zn(n, r) : () => n[r];
	if (_(e)) {
		let n = t[e];
		g(n) && In(i, n);
	} else if (g(e)) In(i, e.bind(n));
	else if (y(e)) {
		if (f(e)) e.forEach((e) => Tr(e, t, n, r));
		else {
			let r = g(e.handler) ? e.handler.bind(n) : t[e.handler];
			g(r) && In(i, r, e);
		}
	}
}
function Er(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Dr(c, e, o, !0)), Dr(c, t, o)), y(t) && a.set(t, c), c;
}
function Dr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Dr(e, a, n, !0), i && i.forEach((t) => Dr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Or[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Or = {
	data: kr,
	props: Pr,
	emits: Pr,
	methods: Nr,
	computed: Nr,
	beforeCreate: Mr,
	created: Mr,
	beforeMount: Mr,
	mounted: Mr,
	beforeUpdate: Mr,
	updated: Mr,
	beforeDestroy: Mr,
	beforeUnmount: Mr,
	destroyed: Mr,
	unmounted: Mr,
	activated: Mr,
	deactivated: Mr,
	errorCaptured: Mr,
	serverPrefetch: Mr,
	components: Nr,
	directives: Nr,
	watch: Fr,
	provide: kr,
	inject: Ar
};
function kr(e, t) {
	return t ? e ? function() {
		return c(g(e) ? e.call(this, this) : e, g(t) ? t.call(this, this) : t);
	} : t : e;
}
function Ar(e, t) {
	return Nr(jr(e), jr(t));
}
function jr(e) {
	if (f(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function Mr(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Nr(e, t) {
	return e ? c(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Pr(e, t) {
	return e ? f(e) && f(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : c(/* @__PURE__ */ Object.create(null), br(e), br(t ?? {})) : t;
}
function Fr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = c(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = Mr(e[r], t[r]);
	return n;
}
function Ir() {
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
var Lr = 0;
function Rr(e, t) {
	return function(n, r = null) {
		g(n) || (n = c({}, n)), r != null && !y(r) && (r = null);
		let i = Ir(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, l = i.app = {
			_uid: Lr++,
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
				s && (sn(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = zr;
				zr = l;
				try {
					return e();
				} finally {
					zr = t;
				}
			}
		};
		return l;
	};
}
var zr = null, Br = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${ee(t)}Modifiers`] || e[`${ne(t)}Modifiers`];
function Vr(e, t, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || n, a = r, o = t.startsWith("update:"), s = o && Br(i, t.slice(7));
	s && (s.trim && (a = r.map((e) => _(e) ? e.trim() : e)), s.number && (a = a.map(A)));
	let c, l = i[c = ie(t)] || i[c = ie(ee(t))];
	!l && o && (l = i[c = ie(ne(t))]), l && sn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, sn(u, e, 6, a);
	}
}
var Hr = /* @__PURE__ */ new WeakMap();
function Ur(e, t, n = !1) {
	let r = n ? Hr : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!g(e)) {
		let r = (e) => {
			let n = Ur(e, t, !0);
			n && (s = !0, c(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (y(e) && r.set(e, null), null) : (f(a) ? a.forEach((e) => o[e] = null) : c(o, a), y(e) && r.set(e, o), o);
}
function Wr(e, t) {
	return !e || !o(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), d(e, t[0].toLowerCase() + t.slice(1)) || d(e, ne(t)) || d(e, t));
}
function Gr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = On(e), v, y;
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
			}) : e(f, null)), y = t.props ? c : Kr(c);
		}
	} catch (t) {
		Mi.length = 0, cn(t, e, 1), v = G(Ai);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(s) && (y = qr(y, a)), b = Gi(b, y, !1, !0));
	}
	return n.dirs && (b = Gi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Gn(Vn(b.type) && Wn(b) || b, n.transition), v = b, On(_), v;
}
var Kr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || o(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, qr = (e, t) => {
	let n = {};
	for (let r in e) (!s(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Jr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Yr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Xr(o, r, n) && !Wr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Yr(r, o, l) : !!o;
	return !1;
}
function Yr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Xr(t, e, a) && !Wr(n, a)) return !0;
	}
	return !1;
}
function Xr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && y(r) && y(i) ? !ye(r, i) : r !== i;
}
function Zr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Qr = {}, $r = () => Object.create(Qr), ei = (e) => Object.getPrototypeOf(e) === Qr;
function ti(e, t, n, r = !1) {
	let i = {}, a = $r();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), ri(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Ft(i) : e.type.props ? i : a, e.attrs = a;
}
function ni(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ I(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Wr(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (d(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = ee(o);
						i[t] = ii(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		ri(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !d(t, a) && ((r = ne(a)) === a || !d(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = ii(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !d(t, e)) && (delete a[e], l = !0);
	}
	l && et(e.attrs, "set", "");
}
function ri(e, t, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let n in t) {
		if (E(n)) continue;
		let l = t[n], u;
		a && d(a, u = ee(n)) ? !o || !o.includes(u) ? r[u] = l : (c ||= {})[u] = l : Wr(e.emitsOptions, n) || (!(n in i) || l !== i[n]) && (i[n] = l, s = !0);
	}
	if (o) {
		let t = /* @__PURE__ */ I(r), i = c || n;
		for (let n = 0; n < o.length; n++) {
			let s = o[n];
			r[s] = ii(a, t, s, i[s], e, !d(i, s));
		}
	}
	return s;
}
function ii(e, t, n, r, i, a) {
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
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === ne(n)) && (r = !0));
	}
	return r;
}
var ai = /* @__PURE__ */ new WeakMap();
function oi(e, t, i = !1) {
	let a = i ? ai : t.propsCache, o = a.get(e);
	if (o) return o;
	let s = e.props, l = {}, u = [], p = !1;
	if (!g(e)) {
		let n = (e) => {
			p = !0;
			let [n, r] = oi(e, t, !0);
			c(l, n), r && u.push(...r);
		};
		!i && t.mixins.length && t.mixins.forEach(n), e.extends && n(e.extends), e.mixins && e.mixins.forEach(n);
	}
	if (!s && !p) return y(e) && a.set(e, r), r;
	if (f(s)) for (let e = 0; e < s.length; e++) {
		let t = ee(s[e]);
		si(t) && (l[t] = n);
	}
	else if (s) for (let e in s) {
		let t = ee(e);
		if (si(t)) {
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
function si(e) {
	return e[0] !== "$" && !E(e);
}
var ci = (e) => e === "_" || e === "_ctx" || e === "$stable", li = (e) => f(e) ? e.map(qi) : [qi(e)], ui = (e, t, n) => {
	if (t._n) return t;
	let r = kn((...e) => li(t(...e)), n);
	return r._c = !1, r;
}, di = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (ci(n)) continue;
		let i = e[n];
		if (g(i)) t[n] = ui(n, i, r);
		else if (i != null) {
			let e = li(i);
			t[n] = () => e;
		}
	}
}, fi = (e, t) => {
	let n = li(t);
	e.slots.default = () => n;
}, pi = (e, t, n) => {
	for (let r in t) (n || !ci(r)) && (e[r] = t[r]);
}, mi = (e, t, n) => {
	let r = e.slots = $r();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (pi(r, t, n), n && oe(r, "_", e, !0)) : di(t, r);
	} else t && fi(e, t);
}, hi = (e, t, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = n;
	if (i.shapeFlag & 32) {
		let e = t._;
		e ? r && e === 1 ? o = !1 : pi(a, t, r) : (o = !t.$stable, di(t, a)), s = t;
	} else t && (fi(e, t), s = { default: 1 });
	if (o) for (let e in a) !ci(e) && s[e] == null && delete a[e];
}, gi = Oi;
function _i(e) {
	return vi(e);
}
function vi(e, t) {
	let a = ce();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = i, insertStaticContent: _ } = e, v = (e, t, n, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Bi(e, t) && (i = _e(e), fe(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === r && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case ki:
				y(e, t, n, i);
				break;
			case Ai:
				b(e, t, n, i);
				break;
			case ji:
				e ?? x(t, n, i, s);
				break;
			case V:
				re(e, t, n, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, n, i, a, o, s, c, l) : f & 6 ? ie(e, t, n, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, n, i, a, o, s, c, l, N);
		}
		d != null && a ? Yn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Yn(e.ref, null, o, e, !0);
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
				n && n._beginPatch(), ee(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && O(e.children, d, null, r, i, yi(e, a), s, u), _ && jn(e, null, r, "created"), D(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !E(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Zi(f, r, e);
		}
		_ && jn(e, null, r, "beforeMount");
		let v = xi(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && gi(() => {
			try {
				f && Zi(f, r, e), v && g.enter(d), _ && jn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, D = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Di(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				D(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, O = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Ji(e[l]) : qi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, ee = (e, t, r, i, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || n, h = t.props || n, g;
		if (r && bi(r, !1), (g = h.onVnodeBeforeUpdate) && Zi(g, r, t, e), f && jn(t, e, r, "beforeUpdate"), r && bi(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? te(e.dynamicChildren, d, l, r, i, yi(t, a), o) : s || j(e, t, l, null, r, i, yi(t, a), o, !1), u > 0) {
			if (u & 16) ne(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== t.children && p(l, t.children);
		} else !s && d == null && ne(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && gi(() => {
			g && Zi(g, r, t, e), f && jn(t, e, r, "updated");
		}, i);
	}, te = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === V || !Bi(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, ne = (e, t, r, i, a) => {
		if (t !== r) {
			if (t !== n) for (let n in t) !E(n) && !(n in r) && c(e, n, t[n], null, a, i);
			for (let n in r) {
				if (E(n)) continue;
				let o = r[n], s = t[n];
				o !== s && n !== "value" && c(e, n, s, o, a, i);
			}
			"value" in r && c(e, "value", t.value, r.value, a);
		}
	}, re = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), O(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (te(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Si(e, t, !0)) : j(e, t, n, f, i, a, s, c, l);
	}, ie = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : k(t, n, r, i, a, o, c) : oe(e, t, c);
	}, k = (e, t, n, r, i, a, o) => {
		let s = e.component = ea(e, r, i);
		if (Qn(e) && (s.ctx.renderer = N), la(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, A, o), !e.el) {
				let r = s.subTree = G(Ai);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else A(s, e, t, n, i, a, o);
	}, oe = (e, t, n) => {
		let r = t.component = e.component;
		if (Jr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, se(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, A = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = wi(e);
					if (n) {
						t && (t.el = c.el, se(e, t, o)), n.asyncDep.then(() => {
							gi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				bi(e, !1), t ? (t.el = c.el, se(e, t, o)) : t = c, n && ae(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Zi(d, s, t, c), bi(e, !0);
				let f = Gr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), _e(p), e, i, a), t.el = f.el, u === null && Zr(e, f.el), r && gi(r, i), (d = t.props && t.props.onVnodeUpdated) && gi(() => Zi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Zn(t);
				if (bi(e, !1), l && ae(l), !m && (o = c && c.onVnodeBeforeMount) && Zi(o, d, t), bi(e, !0), s && be) {
					let t = () => {
						e.subTree = Gr(e), be(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Gr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && gi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					gi(() => Zi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Zn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && gi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new De(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => yn(u), bi(e, !0), l();
	}, se = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, ni(e, t.props, r, n), hi(e, t.children, n), He(), Sn(e), Ue();
	}, j = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				ue(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				le(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && ge(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? ue(l, d, n, r, i, a, o, s, c) : ge(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && O(d, n, r, i, a, o, s, c));
	}, le = (e, t, n, i, a, o, s, c, l) => {
		e ||= r, t ||= r;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? Ji(t[p]) : qi(t[p]);
			v(e[p], r, n, null, a, o, s, c, l);
		}
		u > d ? ge(e, a, o, !0, !1, f) : O(t, n, i, a, o, s, c, l, f);
	}, ue = (e, t, n, i, a, o, s, c, l) => {
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
		} else if (u > p) for (; u <= f;) fe(e[u], a, o, !0), u++;
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
					fe(r, a, o, !0);
					continue;
				}
				let i;
				if (r.key != null) i = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Bi(r, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? fe(r, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(r, t[i], n, null, a, o, s, c, l), y++);
			}
			let w = x ? Ci(C) : r;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, r = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Ei(f) : i;
				C[u] === 0 ? v(null, r, n, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? de(r, n, p, 2) : _--);
			}
		}
	}, de = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			de(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, N);
			return;
		}
		if (c === V) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) de(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === ji) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Hn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), gi(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Hn];
					a._isLeaving && a[Hn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, fe = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (He(), Yn(s, null, n, e, !0), Ue()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Zn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Zi(_, t, e), u & 6) he(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && jn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, N, r) : l && !l.hasOnce && (a !== V || d > 0 && d & 64) ? ge(l, t, n, !1, !0) : (a === V && d & 384 || !i && u & 16) && ge(c, t, n), r && pe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && gi(() => {
			_ && Zi(_, t, e), h && jn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, pe = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === V) {
			me(n, r);
			return;
		}
		if (t === ji) {
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
	}, me = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, he = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Ti(c), Ti(l), r && ae(r), i.stop(), a ? (a.flags |= 8, fe(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, fe(o, e, t, n)), s && gi(s, t), gi(() => {
			e.isUnmounted = !0;
		}, t);
	}, ge = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) fe(e[o], t, n, r, i);
	}, _e = (e) => {
		if (e.shapeFlag & 6) return _e(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Bn];
		return n ? h(n) : t;
	}, M = !1, ve = (e, t, n) => {
		let r;
		e == null ? t._vnode && (fe(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, M ||= (M = !0, Sn(r), Cn(), !1);
	}, N = {
		p: v,
		um: fe,
		m: de,
		r: pe,
		mt: k,
		mc: O,
		pc: j,
		pbc: te,
		n: _e,
		o: e
	}, ye, be;
	return t && ([ye, be] = t(N)), {
		render: ve,
		hydrate: ye,
		createApp: Rr(ve, ye)
	};
}
function yi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function bi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function xi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Si(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (f(r) && f(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Ji(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Si(t, a)), a.type === ki && (a.patchFlag === -1 && (a = i[e] = Ji(a)), a.el = t.el), a.type === Ai && !a.el && (a.el = t.el);
	}
}
function Ci(e) {
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
function wi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : wi(t);
}
function Ti(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ei(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Ei(t.subTree) : null;
}
var Di = (e) => e.__isSuspense;
function Oi(e, t) {
	t && t.pendingBranch ? f(e) ? t.effects.push(...e) : t.effects.push(e) : xn(e);
}
var V = /* @__PURE__ */ Symbol.for("v-fgt"), ki = /* @__PURE__ */ Symbol.for("v-txt"), Ai = /* @__PURE__ */ Symbol.for("v-cmt"), ji = /* @__PURE__ */ Symbol.for("v-stc"), Mi = [], Ni = null;
function H(e = !1) {
	Mi.push(Ni = e ? null : []);
}
function Pi() {
	Mi.pop(), Ni = Mi[Mi.length - 1] || null;
}
var Fi = 1;
function Ii(e, t = !1) {
	Fi += e, e < 0 && Ni && t && (Ni.hasOnce = !0);
}
function Li(e) {
	return e.dynamicChildren = Fi > 0 ? Ni || r : null, Pi(), Fi > 0 && Ni && Ni.push(e), e;
}
function U(e, t, n, r, i, a) {
	return Li(W(e, t, n, r, i, a, !0));
}
function Ri(e, t, n, r, i) {
	return Li(G(e, t, n, r, i, !0));
}
function zi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Bi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Vi = ({ key: e }) => e ?? null, Hi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : _(e) || /* @__PURE__ */ Gt(e) || g(e) ? {
	i: En,
	r: e,
	k: t,
	f: !!n
} : e);
function W(e, t = null, n = null, r = 0, i = null, a = e === V ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Vi(t),
		ref: t && Hi(t),
		scopeId: Dn,
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
		ctx: En
	};
	return s ? (Yi(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= _(n) ? 8 : 16), Fi > 0 && !o && Ni && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Ni.push(c), c;
}
var G = Ui;
function Ui(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === hr) && (e = Ai), zi(e)) {
		let r = Gi(e, t, !0);
		return n && Yi(r, n), Fi > 0 && !a && Ni && (r.shapeFlag & 6 ? Ni[Ni.indexOf(e)] = r : Ni.push(r)), r.patchFlag = -2, r;
	}
	if (ga(e) && (e = e.__vccOpts), t) {
		t = Wi(t);
		let { class: e, style: n } = t;
		e && !_(e) && (t.class = pe(e)), y(n) && (/* @__PURE__ */ Vt(n) && !f(n) && (n = c({}, n)), t.style = j(n));
	}
	let o = _(e) ? 1 : Di(e) ? 128 : Vn(e) ? 64 : y(e) ? 4 : g(e) ? 2 : 0;
	return W(e, t, n, r, i, o, a, !0);
}
function Wi(e) {
	return e ? /* @__PURE__ */ Vt(e) || ei(e) ? c({}, e) : e : null;
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
		patchFlag: t && e.type !== V ? o === -1 ? 16 : o | 16 : o,
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
	return c && r && Gn(u, c.clone(u)), u;
}
function K(e = " ", t = 0) {
	return G(ki, null, e, t);
}
function Ki(e, t) {
	let n = G(ji, null, e);
	return n.staticCount = t, n;
}
function q(e = "", t = !1) {
	return t ? (H(), Ri(Ai, null, e)) : G(Ai, null, e);
}
function qi(e) {
	return e == null || typeof e == "boolean" ? G(Ai) : f(e) ? G(V, null, e.slice()) : zi(e) ? Ji(e) : G(ki, null, String(e));
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
			!r && !ei(t) ? t._ctx = En : r === 3 && En && (En.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (g(t)) {
		if (r & 65) {
			Yi(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: En
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [K(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Xi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = pe([t.class, r.class]));
		else if (e === "style") t.style = j([t.style, r.style]);
		else if (o(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(f(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !s(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Zi(e, t, n, r = null) {
	sn(e, t, 7, [n, r]);
}
var Qi = Ir(), $i = 0;
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
		scope: new we(!0),
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
		propsOptions: oi(i, a),
		emitsOptions: Ur(i, a),
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
	return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = Vr.bind(null, o), e.ce && e.ce(o), o;
}
var ta = null, na = () => ta || En, ra, ia;
{
	let e = ce(), t = (t, n) => {
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
	ti(e, r, a, t), mi(e, i, n || t);
	let o = a ? ua(e, t) : void 0;
	return t && ia(!1), o;
}
function ua(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, yr);
	let { setup: r } = n;
	if (r) {
		He();
		let n = e.setupContext = r.length > 1 ? ma(e) : null, i = aa(e), a = on(r, e, 0, [e.props, n]), o = b(a);
		if (Ue(), i(), (o || e.sp) && !Zn(e) && Kn(e), o) {
			if (a.then(oa, oa), t) return a.then((n) => {
				ia(!0);
				try {
					da(e, n, t);
				} finally {
					ia(!1);
				}
			}).catch((t) => {
				cn(t, e, 0);
			});
			e.asyncDep = a;
		} else da(e, a, t);
	} else fa(e, t);
}
function da(e, t, n) {
	g(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : y(t) && (e.setupState = Xt(t)), fa(e, n);
}
function fa(e, t, n) {
	let r = e.type;
	e.render ||= r.render || i;
	{
		let t = aa(e);
		He();
		try {
			Sr(e);
		} finally {
			Ue(), t();
		}
	}
}
var pa = { get(e, t) {
	return $e(e, "get", ""), e[t];
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
	return e.exposed ? e.exposeProxy ||= new Proxy(Xt(Ht(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in _r) return _r[n](e);
		},
		has(e, t) {
			return t in e || t in _r;
		}
	}) : e.proxy;
}
function ga(e) {
	return g(e) && "__vccOpts" in e;
}
var J = (e, t) => /* @__PURE__ */ Qt(e, t, ca), _a = "3.5.43", va = void 0, ya = typeof window < "u" && window.trustedTypes;
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
		Na.test(n) ? e.setProperty(ne(r), n.replace(Na, ""), "important") : e[r] = n;
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
	let r = ee(t);
	if (r !== "filter" && r in e) return Ia[t] = r;
	r = re(r);
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
function Ba(e, t, n, r, i, a = he(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(za, t.slice(6, t.length)) : e.setAttributeNS(za, t, n) : n == null || a && !ge(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : v(n) ? String(n) : n);
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
		r === "boolean" ? n = ge(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
	return [e[2] === ":" ? e.slice(3) : ne(e.slice(2)), t];
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
				e && sn(e, t, 5, a);
			}
		} else sn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Za(), n;
}
var $a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, eo = (e, t, n, r, i, a) => {
	let c = i === "svg";
	t === "class" ? Da(e, r, c) : t === "style" ? Ma(e, n, r) : o(t) ? s(t) || Ga(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : to(e, t, r, c)) ? (Va(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ba(e, t, r, c, a, t !== "value")) : e._isVueCE && (no(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !_(r))) ? Va(e, ee(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Ba(e, t, r, c));
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
	let r = ee(t);
	return Array.isArray(n) ? n.some((e) => ee(e) === r) : Object.keys(n).some((e) => ee(e) === r);
}
var ro = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return f(t) ? (e) => ae(t, e) : t;
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
	return t && (e = e.trim()), n && (e = A(e)), e;
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
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? A(e.value) : e.value, c = t ?? "";
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
		let r = ne(n.key);
		if (t.some((e) => e === r || mo[e] === r)) return e(n);
	}));
}, go = /* @__PURE__ */ c({ patchProp: eo }, Ta), _o;
function vo() {
	return _o ||= _i(go);
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
} }, ko = /* @__PURE__ */ z({
	__name: "BuyPanel",
	props: {
		designJson: { type: Function },
		previewSvg: { type: Function },
		fileStem: {},
		blocked: {}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ L(1), r = /* @__PURE__ */ L(null);
		function i(e, t, n) {
			let r = URL.createObjectURL(new Blob([t], { type: n })), i = document.createElement("a");
			i.href = r, i.download = e, i.click(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
		}
		return (e, a) => (H(), U(V, null, [W("section", So, [
			a[6] ||= W("div", { class: "price" }, [W("span", { class: "amount display" }, "[PRICE]"), W("span", { class: "small muted" }, "ex VAT · prices come from the shop")], -1),
			W("div", Co, [W("label", wo, [a[5] ||= K(" Qty ", -1), An(W("input", {
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
			t.blocked ? (H(), U("p", Eo, P(t.blocked), 1)) : q("", !0)
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
			W("p", Do, "This is the test site, so nothing was added to a basket. On the shop, this design would be saved with the order (" + P(n.value) + " × this sign).", 1),
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
	if (t.tile && s > 0) {
		let e = t.tile, a = e.fill === "none" ? void 0 : No(e.fill, "symbol_background", i), o = a ? Math.min(Lo(r), n.w / 2, n.h / 2) : 0;
		a && r.nodes.push({
			type: "rect",
			id: t.id,
			source_id: t.id,
			layer: "artwork",
			x: n.x,
			y: n.y,
			width: n.w,
			height: n.h,
			radius: [
				o,
				o,
				o,
				o
			],
			fill: a
		});
		let s = o * (1 - Math.SQRT1_2), c = Math.min(n.w, n.h) * Math.min(.45, Math.max(0, e.inset ?? 0)), l = Math.max(c, s), u = {
			x: n.x + l,
			y: n.y + l,
			w: n.w - l * 2,
			h: n.h - l * 2
		}, d = t.symbols[0], f = d.source.view_box, p = f[2] / f[3], m = Math.min(u.h, u.w / p), h = m * p;
		r.nodes.push({
			type: "symbol",
			id: d.id,
			source_id: d.id,
			layer: "artwork",
			x: u.x + (u.w - h) / 2,
			y: u.y + (u.h - m) / 2,
			width: h,
			height: m,
			scale: h / f[2],
			view_box: f,
			body: d.source.body
		});
		return;
	}
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
	if (t.lines.length) return As(e, t);
	if (!e.fill) return 0;
	let [r, , i] = ks(e);
	return r + n * zs + i;
}, zs = 1.3, Bs = (e, t, n) => {
	let r = e.blocks.map((e) => e.block.stretch === !0);
	if (!r.some(Boolean)) return t;
	let i = t.filter((t, n) => t > 0 || e.blocks[n].block.fill).length, a = n - (t.reduce((e, t) => e + t, 0) + e.spacing * Math.max(0, i - 1));
	if (a <= 0) return t;
	let o = a / r.filter(Boolean).length;
	return t.map((e, t) => r[t] ? e + o : e);
}, Vs = (e) => Math.min(.5, Math.max(0, e.lead?.share ?? 0)) + Math.min(.5, Math.max(0, e.trail?.share ?? 0)), Hs = (e, t, n) => {
	let [, r, , i] = ks(n.block);
	return Math.max(0, e * (1 - Vs(t.panel)) - t.padding[1] - t.padding[3] - r - i);
};
function Us(e, t, n, r) {
	let i = !0, a = [], o = [];
	for (let s of e.panels) {
		let e = s.blocks.map((e) => {
			let a = Os(e.block, Ls(e, n), Hs(t, s, e), r.shaper);
			return a.fits || (i = !1), a;
		}), c = e.filter((e, t) => e.lines.length > 0 || s.blocks[t].block.fill), l = e.reduce((e, t, r) => e + Rs(s.blocks[r].block, t, Ls(s.blocks[r], n)), 0);
		o.push(s.padding[0] + l + s.spacing * Math.max(0, c.length - 1) + s.padding[2]), a.push(e);
	}
	return {
		blocks: a,
		panelHeights: o,
		frameHeight: o.reduce((e, t) => e + t, 0) + e.spacing * Math.max(0, o.length - 1),
		fits: i
	};
}
function Ws(e, t) {
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
function Gs(e, t, n, r = 1) {
	return bs((r) => {
		let i = Us(e, t.w, r, n);
		return i.fits && i.frameHeight <= t.h + 1e-6;
	}, r);
}
function Ks(e, t, n, r) {
	return e.category ? n.ruleset.theme(e.category) || (zo(n, {
		severity: "error",
		code: "E_UNKNOWN_CATEGORY",
		path: `${r}.category`,
		message: `Panel category "${e.category}" is not defined in ruleset "${n.ruleset.id}"`
	}), t) : t;
}
function qs(e, t, n, r, i, a, o = 1) {
	let s = Gs(e, t, n, o), c = s.k, l = Us(e, t.w, c, n);
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
		], y = Ks(o.panel, r, n, `${i}.panels[${c}]`), b = o.panel.fill === "none" ? void 0 : No(o.panel.fill, "panel", y);
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
		let x = p.w * Math.min(.5, Math.max(0, o.panel.lead?.share ?? 0)), S = p.w * Math.min(.5, Math.max(0, o.panel.trail?.share ?? 0)), C = (e, t, r) => {
			let i = o.panel[e];
			if (!i || r <= 0) return;
			let a = Math.min(o.padding[0], o.padding[2]), s = {
				x: t + a,
				y: p.y + a,
				w: Math.max(0, r - a * 2),
				h: Math.max(0, p.h - a * 2)
			}, c = i.symbol.source.view_box, l = c[2] / c[3], u = i.tile, d = Math.min(s.w, s.h), f = u ? {
				x: s.x + (s.w - d) / 2,
				y: s.y + (s.h - d) / 2,
				w: d,
				h: d
			} : s;
			if (u) {
				let e = u.fill === "none" ? void 0 : No(u.fill, "symbol_background", y) ?? { hex: "#FFFFFF" };
				e && n.nodes.push({
					type: "rect",
					id: `${i.symbol.id}--tile`,
					source_id: i.symbol.id,
					layer: "artwork",
					x: f.x,
					y: f.y,
					width: f.w,
					height: f.h,
					radius: [
						0,
						0,
						0,
						0
					],
					fill: e
				});
			}
			let m = u ? Math.min(f.w, f.h) * Math.min(.45, Math.max(0, u.inset ?? 0)) : 0, h = {
				x: f.x + m,
				y: f.y + m,
				w: f.w - m * 2,
				h: f.h - m * 2
			}, g = Math.min(h.h, h.w / l), _ = g * l, v = h.h - g, b = u ? v / 2 : i.align === "start" ? 0 : i.align === "end" ? v : v / 2;
			n.nodes.push({
				type: "symbol",
				id: i.symbol.id,
				source_id: i.symbol.id,
				layer: "artwork",
				x: h.x + (h.w - _) / 2,
				y: h.y + b,
				width: _,
				height: g,
				scale: _ / c[2],
				view_box: c,
				body: i.symbol.source.body
			});
		};
		C("lead", p.x, x), C("trail", p.x + p.w - S, S);
		let w = Ko({
			x: p.x + x,
			y: p.y,
			w: Math.max(0, p.w - x - S),
			h: p.h
		}, o.padding), T = l.blocks[c], E = T.map((e, t) => Rs(o.blocks[t].block, e, Ls(o.blocks[t], s.k))), D = Bs(o, E, w.h), O = xs(w.y, w.y + w.h, o.blocks.map((e, t) => {
			let r = T[t], i = r.lines.length ? r.textHeight - r.letterHeight - (r.lines.length - 1) * r.pitch : 0, a = r.lines[r.lines.length - 1]?.text ?? "", o = a ? Math.min(i, n.shaper.descent(a, e.block.variant, r.em)) : 0;
			return {
				height: D[t],
				placement: e.block.placement,
				y_offset: e.block.y_offset,
				trail: i,
				ink: o
			};
		}), o.spacing, o.panel.justify);
		o.blocks.forEach((e, t) => {
			let r = T[t], a = e.block, [o, u, , f] = ks(a), p = O.y[t], m = p + (D[t] - E[t]) / 2, h = w.x + f, g = Math.max(0, w.w - f - u), _ = s.overflow && l.fits ? !0 : !r.fits;
			!r.fits && !s.overflow && zo(n, {
				severity: "error",
				code: "E_TEXT_OVERFLOW",
				path: `${i}.panels[${c}].blocks[${t}]`,
				message: "A word is too wide for the panel at this fixed size"
			});
			let v = No(a.colour, "panel_text", y) ?? { hex: "#000000" }, b = a.fill ? No(a.fill, "panel", y) : void 0;
			b && n.nodes.push({
				type: "rect",
				id: `${a.id}--fill`,
				source_id: a.id,
				layer: "artwork",
				x: Y(h),
				y: Y(p),
				width: Y(g),
				height: Y(D[t]),
				radius: [
					0,
					0,
					0,
					0
				],
				fill: b
			});
			let x = r.lines.map((e, t) => {
				let i = Y(a.align === "left" ? h : a.align === "right" ? h + g - e.width : h + (g - e.width) / 2), s = Y(m + o + r.letterHeight + t * r.pitch), c = n.shaper.outline && e.text ? n.shaper.outline(e.text, a.variant, r.em, i, s) : void 0;
				return {
					text: e.text,
					x: i,
					baseline: s,
					width: e.width,
					...c === void 0 ? {} : { d: c }
				};
			}), S = !!e.auto && r.letterHeight < e.auto.recommended;
			n.nodes.push({
				type: "text",
				id: a.id,
				source_id: a.id,
				layer: "artwork",
				x: w.x,
				y: p,
				width: w.w,
				height: D[t],
				text: a.text,
				letter_height: r.letterHeight,
				colour: v,
				variant: a.variant,
				em: r.em,
				font_family: n.shaper.family,
				lines: x,
				shrunk: S,
				overflow: _
			}), d.push({
				id: a.id,
				recommended: e.auto?.recommended ?? null,
				letter_height: r.letterHeight,
				lines: r.lines.length,
				y_offset: {
					requested: a.y_offset,
					applied: O.applied[t]
				},
				shrunk: S,
				overflow: _
			});
		});
	}), {
		k: e.hasAuto ? Math.floor(c * 1e6) / 1e6 : null,
		blocks: d
	};
}
//#endregion
//#region src/engine/resolveSection.ts
var Js = (e, t, n) => e.spacing === "auto" ? n.gap ?? n.ratios.SYMBOL_TEXT_SPACING * Go(t.w, t.h) : e.spacing;
function Ys(e, t, n, r) {
	let i = Xs(e, t, n, r);
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
function Xs(e, t, n, r) {
	let i = e.symbol_frame;
	if (!i || i.symbols.length === 0) return null;
	let a = n.ratios, o = e.orientation, s = Go(t.w, t.h), c = e.text_frame.panels.length === 0, l = Jo(t, o) - (c ? 0 : Js(e, t, n));
	if (l <= 1e-6) return {
		L: l,
		min: 0,
		max: 0,
		wanted: 0,
		tooSmall: !0
	};
	let u = Is(e.text_frame, n, {
		textRefHeight: r.textRefHeight,
		sectionRef: s,
		lang: e.lang
	}), d = o === "vertical" ? Us(u, t.w, 0, n).frameHeight : Ws(u, n), f = c ? 1 : 1 - Math.max(d, a.MIN_TEXT_SHARE * l) / l, p = gs(i, Yo(t, o), o, n, s) / l, m = Math.min(a.MIN_SYMBOL_SHARE, p), h = c ? Math.min(1, p) : Math.min(a.MAX_SYMBOL_SHARE, f, p), g = e.symbol_share;
	return {
		L: l,
		min: m,
		max: h,
		wanted: Number.isFinite(g) ? g : a.DEFAULT_SYMBOL_SHARE,
		tooSmall: !1
	};
}
function Zs(e, t, n, r) {
	let i = e.symbol_share, a = Xs(e, t, n, r);
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
	let o = e.orientation, s = e.text_frame.panels.length === 0 ? 0 : Js(e, t, n), c = a.L;
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
function Qs(e, t, n, r) {
	let i = Zs(e, t, n, r), a = Is(e.text_frame, n, {
		textRefHeight: r.textRefHeight,
		sectionRef: Go(t.w, t.h),
		lang: e.lang
	});
	return a.hasAuto ? Gs(a, i.textBox, n).k : null;
}
function $s(e, t, n, r) {
	let i = Bo(e, n, r.path), a = Go(t.w, t.h), o = Zs(e, t, n, r);
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
	}, f = qs(s, o.textBox, n, i, `${r.path}.text_frame`, d, r.kCap ?? 1);
	return {
		id: e.id,
		symbol_share: o.share,
		k: f.k,
		blocks: f.blocks
	};
}
//#endregion
//#region src/engine/resolveSections.ts
function ec(e, t) {
	let n = Ro(t), r = e.map((e) => {
		let t = () => Ys(e.section, e.box, n, e.opts);
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
function tc(e, t, n, r) {
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
		return (i.align_symbols ?? !0) && ec(l, n), l.map((e) => $s(e.section, e.box, n, e.opts));
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
	if ((i.align_symbols ?? !0) && ec(c, n), o ? i.sync_rows ?? !0 : i.sync_text) {
		let e = Ro(n), t = /* @__PURE__ */ new Map();
		c.forEach((e, n) => {
			let r = o ? s[n].group ?? 0 : 0;
			t.set(r, [...t.get(r) ?? [], e]);
		});
		for (let n of t.values()) {
			let t = 1;
			for (let r of n) {
				let n = Io(e, r.unitRef, () => Qs(r.section, r.box, e, r.opts));
				n !== null && (t = Math.min(t, n));
			}
			for (let e of n) e.opts.kCap = t;
		}
	}
	return c.map((e) => Io(n, e.unitRef, () => $s(e.section, e.box, n, e.opts)));
}
//#endregion
//#region src/engine/index.ts
function nc(e, t) {
	let n = Po(t), r = e.root, i = () => ({
		width: r.width,
		height: r.height,
		shaper_id: t.shaper.id,
		ruleset_id: t.ruleset.id,
		nodes: n.nodes
	});
	try {
		let e = r.sections[0], t = e ? Bo(e, n, "root.sections[0]") : Ao, a = tc(r, ts(r, t, n), n, t);
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
var rc = (e) => e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"), Z = (e, t) => ` ${e}="${typeof t == "number" ? X(t) : rc(t)}"`, ic = class extends Error {
	name = "OutlineUnavailable";
}, ac = /__SYM__/g, oc = (e, t) => !!e && !!t && e.hex.trim().toLowerCase() === t.hex.trim().toLowerCase(), sc = (e, t) => t && oc(e, t.from) ? t.to : e, cc = (e, t) => {
	let n = t.from.hex.trim().toLowerCase(), r = n.length === 7 && n[1] === n[2] && n[3] === n[4] && n[5] === n[6] ? `#${n[1]}${n[3]}${n[5]}` : n, i = (e) => {
		let t = e.trim().toLowerCase();
		return t === n || t === r;
	}, a = t.to?.hex;
	return e.replace(/fill\s*:\s*(#[0-9a-f]{3,6})/gi, (e, t) => i(t) ? `fill: ${a ?? "none"}` : e).replace(/fill="(#[0-9a-f]{3,6})"/gi, (e, t) => i(t) ? `fill="${a ?? "none"}"` : e);
}, lc = (e) => {
	if (!e) return Z("fill", "none");
	let t = Z("fill", e.hex);
	return e.cmyk && (t += Z("data-cmyk", e.cmyk.map(X).join(","))), e.spot && (t += Z("data-spot", e.spot)), t;
}, uc = (e) => e ? Z("stroke", e.colour.hex) + Z("stroke-width", e.width) : "";
function dc(e) {
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
function fc(e, t) {
	let n = lc(sc(e.fill, t)) + uc(e.stroke), [r, i, a, o] = e.radius;
	if (r === i && i === a && a === o) {
		let t = r > 0 ? Z("rx", r) : "";
		return `<rect${Z("x", e.x)}${Z("y", e.y)}${Z("width", e.width)}${Z("height", e.height)}${t}${n}/>`;
	}
	return `<path${Z("d", dc(e))}${n}/>`;
}
var pc = (e, t) => `<path${Z("d", e.d)}${lc(sc(e.fill, t))}${e.fill_rule ? Z("fill-rule", e.fill_rule) : ""}${uc(e.stroke)}/>`;
function mc(e, t) {
	let [n, r] = e.view_box, i = `translate(${X(e.x)} ${X(e.y)}) scale(${hc(e.scale)}) translate(${X(-n)} ${X(-r)})`, a = (t ? cc(e.body, t) : e.body).replace(ac, `${e.id}--`);
	return `<g${Z("transform", i)}>${a}</g>`;
}
var hc = (e) => {
	let t = Math.round(e * 1e6) / 1e6;
	return Object.is(t, -0) ? "0" : String(t);
};
function gc(e, t, n) {
	let r = sc(e.colour, n);
	if (t === "outline") {
		let t = e.lines.map((t) => {
			if (t.text === "") return "";
			if (t.d === void 0) throw new ic(`Text node ${e.id} has no outlines — render with an outlining shaper`);
			return `<path${Z("d", t.d)}/>`;
		}).join("");
		return `<g${Z("aria-label", e.text)}${lc(r)}>${t}</g>`;
	}
	let i = `${e.font_family}, Arimo, 'Liberation Sans', Arial, sans-serif`, a = e.variant.includes("bold") ? "bold" : "normal", o = e.variant.includes("italic") ? "italic" : "normal", s = e.lines.filter((e) => e.text !== "").map((t) => `<text${Z("x", t.x)}${Z("y", t.baseline)}${Z("font-family", i)}${Z("font-size", e.em)}${Z("font-weight", a)}${Z("font-style", o)}${Z("text-anchor", "start")}${Z("style", "font-kerning:normal;font-variant-ligatures:none")}${lc(r)}>${rc(t.text)}</text>`).join("");
	return `<g${Z("aria-label", e.text)}>${s}</g>`;
}
function _c(e, t, n) {
	let r;
	switch (e.type) {
		case "rect":
			r = fc(e, n);
			break;
		case "path":
			r = pc(e, n);
			break;
		case "symbol":
			r = mc(e, n);
			break;
		case "text": r = gc(e, t.text, n);
	}
	return `<g${Z("id", e.id)}${Z("data-source", e.source_id)}>${r}</g>`;
}
var vc = (e) => Math.max(e.width, e.height) / 100;
function yc(e) {
	let t = vc(e), { width: n, height: r } = e, i = 4 * t, a = 1.5 * t, o = "#333333", s = (e, t, n, r) => `<line${Z("x1", e)}${Z("y1", t)}${Z("x2", n)}${Z("y2", r)}/>`, c = (e, t, n, r) => `<text${Z("x", t)}${Z("y", n)}${Z("text-anchor", "middle")}${r ? Z("transform", `rotate(-90 ${X(t)} ${X(n)})`) : ""}>${rc(e)}</text>`, l = r + i, u = n + i;
	return `<g id="dimensions"${Z("stroke", o)}${Z("stroke-width", .12 * t)}${Z("fill", o)}${Z("font-family", "Arial, Arimo, sans-serif")}${Z("font-size", 2.6 * t)}>` + s(0, r + t, 0, l + a) + s(n, r + t, n, l + a) + s(0, l, n, l) + s(n + t, 0, u + a, 0) + s(n + t, r, u + a, r) + s(u, 0, u, r) + `<g${Z("stroke", "none")}>` + c(`${X(n)}mm`, n / 2, l + 3.4 * t, !1) + c(`${X(r)}mm`, u + 3.4 * t, r / 2, !0) + "</g></g>";
}
var bc = {
	hex: "#FFFFFF",
	cmyk: [
		0,
		0,
		0,
		0
	]
};
function xc(e, t) {
	let n = e.nodes.find((e) => e.layer === "substrate"), r = t.substrate !== !1, i = r && n ? `<g id="substrate">${_c(n, t)}</g>` : "", a = n?.type === "rect" ? n.fill : void 0, o = t.unprinted ? { hex: t.unprinted } : a, s = o ? r ? a && !oc(o, a) ? {
		from: o,
		to: a
	} : void 0 : oc(o, bc) ? void 0 : {
		from: o,
		to: bc
	} : void 0, c = e.nodes.filter((e) => e.layer === "artwork").map((e) => _c(e, t, s)).join(""), l = t.guides ? `<g id="guides">${e.nodes.filter((e) => e.layer === "guide").map((e) => _c(e, t)).join("")}</g>` : "", u = t.dimensions ? 9 * vc(e) : 0, d = e.width + u, f = e.height + u;
	return `<svg xmlns="http://www.w3.org/2000/svg"${Z("width", `${X(d)}mm`)}${Z("height", `${X(f)}mm`)}${Z("viewBox", `0 0 ${X(d)} ${X(f)}`)}>${i}<g id="artwork">${c}</g>${l}${t.dimensions ? yc(e) : ""}</svg>`;
}
//#endregion
//#region src/renderer/index.ts
function Sc(e, t) {
	return xc(e, t);
}
//#endregion
//#region src/migration/migrations.ts
var Cc = [], wc = class extends Error {
	name = "UnknownSchemaVersion";
};
function Tc(e, t = Cc, n = js) {
	if (typeof e?.schema_version != "string") throw new wc("Document has no schema_version");
	let r = structuredClone(e), i = /* @__PURE__ */ new Set();
	for (; r.schema_version !== n;) {
		if (i.has(r.schema_version)) throw new wc(`Migration loop at ${r.schema_version}`);
		i.add(r.schema_version);
		let e = t.find((e) => e.from === r.schema_version);
		if (!e) throw new wc(`No migration path from schema ${r.schema_version} to ${n}`);
		r = {
			...e.up(r),
			schema_version: e.to
		};
	}
	return r;
}
//#endregion
//#region src/symbols/guard.ts
var Ec = [
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
function Dc(e) {
	return Ec.filter(([t]) => t.test(e)).map(([, e]) => e);
}
//#endregion
//#region src/validation/index.ts
var Oc = (e) => typeof e == "object" && !!e && !Array.isArray(e), kc = (e) => typeof e == "number" && Number.isFinite(e), Ac = /^#[0-9a-fA-F]{6}$/, jc = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/, Mc = [
	"background",
	"panel",
	"panel_text",
	"symbol_background",
	"border"
], Nc = (e) => e.some((e) => e.severity === "error");
function Pc(e, t) {
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
		e !== "auto" && !(kc(e) && e >= 0) && r(t, `${n} must be 'auto' or a non-negative number`);
	}, l = (e, t) => {
		if (e !== void 0) {
			if (Oc(e) && typeof e.token == "string") return s(e.token, Mc, t, "Colour token");
			(!Oc(e) || typeof e.hex != "string" || !Ac.test(e.hex)) && r(t, "Colour must be { hex: \"#RRGGBB\" } or { token }");
		}
	}, u = (e, n) => {
		(typeof e != "string" || !t.theme(e)) && r(n, `Category "${String(e)}" is not defined in ruleset "${t.id}"`, "E_UNKNOWN_CATEGORY");
	}, d = (e, t, n, i = !1) => !Array.isArray(e) || e.length === 0 && !i ? (r(t, `${n} must be a non-empty array`), []) : e;
	if (!Oc(e)) return r("", "Document must be an object"), n;
	e.schema_version !== "1.0.0" && r("schema_version", `Unknown schema version "${String(e.schema_version)}"`, "E_SCHEMA_VERSION"), typeof e.id != "string" && r("id", "Missing document id"), typeof e.ruleset_id == "string" ? e.ruleset_id !== t.id && i("ruleset_id", `Document expects ruleset "${e.ruleset_id}" but "${t.id}" was supplied`, "W_RULESET_MISMATCH") : r("ruleset_id", "Missing ruleset_id");
	let f = e.root;
	if (!Oc(f) || f.role !== "sign") return r("root", "root must be a sign node"), n;
	o(f, "root");
	for (let e of ["width", "height"]) {
		let t = f[e];
		(!kc(t) || t <= 0 || t > Ms.MAX_SIGN_SIZE) && r(`root.${e}`, `${e} must be between 0 and ${Ms.MAX_SIGN_SIZE} mm`);
	}
	f.margin !== void 0 && c(f.margin, "root.margin", "margin"), l(f.background, "root.background"), f.corners !== void 0 && (!Oc(f.corners) || typeof f.corners.rounded != "boolean" ? r("root.corners", "corners must be { rounded: true|false, radius }") : c(f.corners.radius, "root.corners.radius", "corner radius")), l(f.substrate, "root.substrate"), f.padding !== void 0 && c(f.padding, "root.padding", "padding"), f.border !== void 0 && (Oc(f.border) ? (c(f.border.width, "root.border.width", "border width"), l(f.border.colour, "root.border.colour")) : r("root.border", "border must be an object"));
	let p = d(f.sections, "root.sections", "sections"), m = f.layout;
	if (!Oc(m)) r("root.layout", "layout is required");
	else if (m.type === "stack") s(m.direction, ["vertical", "horizontal"], "root.layout.direction", "direction"), m.align_symbols !== void 0 && typeof m.align_symbols != "boolean" && r("root.layout.align_symbols", "align_symbols must be true or false"), c(m.spacing, "root.layout.spacing", "spacing");
	else if (m.type === "grid") {
		let { rows: e, cols: t } = m;
		(!Number.isInteger(e) || e < 1) && r("root.layout.rows", "rows must be an integer ≥ 1"), (!Number.isInteger(t) || t < 1) && r("root.layout.cols", "cols must be an integer ≥ 1"), Number.isInteger(e) && Number.isInteger(t) && e * t !== p.length && r("root.layout", `Grid has ${e * t} cells but ${p.length} sections`, "E_GRID_CELL_COUNT"), c(m.gutter, "root.layout.gutter", "gutter"), typeof m.sync_text != "boolean" && r("root.layout.sync_text", "sync_text must be true or false"), m.align_symbols !== void 0 && typeof m.align_symbols != "boolean" && r("root.layout.align_symbols", "align_symbols must be true or false"), Oc(m.cell_outline) && (c(m.cell_outline.width, "root.layout.cell_outline.width", "outline width"), s(m.cell_outline.layer, ["artwork", "guide"], "root.layout.cell_outline.layer", "layer"), l(m.cell_outline.colour, "root.layout.cell_outline.colour"));
	} else if (m.type === "board") {
		let e = d(m.rows, "root.layout.rows", "rows");
		e.length || r("root.layout.rows", "A board needs at least one row");
		let t = 0;
		e.forEach((e, n) => {
			let i = `root.layout.rows[${n}]`;
			if (!Oc(e)) return r(i, "Expected a row");
			!Number.isInteger(e.cells) || e.cells < 1 ? r(`${i}.cells`, "cells must be an integer ≥ 1") : t += e.cells, e.weight !== void 0 && (typeof e.weight != "number" || !Number.isFinite(e.weight) || e.weight <= 0) && r(`${i}.weight`, "weight must be a number greater than 0");
		}), t !== p.length && r("root.layout", `Board has ${t} cells but ${p.length} sections`, "E_GRID_CELL_COUNT"), c(m.gutter, "root.layout.gutter", "gutter"), m.sync_rows !== void 0 && typeof m.sync_rows != "boolean" && r("root.layout.sync_rows", "sync_rows must be true or false"), m.align_symbols !== void 0 && typeof m.align_symbols != "boolean" && r("root.layout.align_symbols", "align_symbols must be true or false"), Oc(m.cell_outline) && (c(m.cell_outline.width, "root.layout.cell_outline.width", "outline width"), s(m.cell_outline.layer, ["artwork", "guide"], "root.layout.cell_outline.layer", "layer"), l(m.cell_outline.colour, "root.layout.cell_outline.colour"));
	} else r("root.layout.type", "layout.type must be 'stack', 'grid' or 'board'");
	return p.forEach((e, t) => {
		let n = `root.sections[${t}]`;
		if (!Oc(e) || e.role !== "section") return r(n, "Expected a section node");
		o(e, n), s(e.orientation, ["vertical", "horizontal"], `${n}.orientation`, "orientation"), e.symbol_side !== void 0 && s(e.symbol_side, ["start", "end"], `${n}.symbol_side`, "symbol_side"), c(e.spacing, `${n}.spacing`, "spacing"), kc(e.symbol_share) ? (e.symbol_share < 0 || e.symbol_share > 1) && i(`${n}.symbol_share`, "symbol_share is outside 0..1 and will be clamped", "W_SHARE_RANGE") : r(`${n}.symbol_share`, "symbol_share must be a number"), e.placeholder !== void 0 && typeof e.placeholder != "boolean" && r(`${n}.placeholder`, "placeholder must be true or false"), e.lang !== void 0 && !(typeof e.lang == "string" && jc.test(e.lang)) && r(`${n}.lang`, "lang must be a language tag such as \"pl\" or \"pt-BR\"");
		let a = e.translation;
		if (a !== void 0) {
			let t = `${n}.translation`;
			Oc(a) ? ((typeof a.of != "string" || !p.some((t) => Oc(t) && t.id === a.of && t !== e)) && r(`${t}.of`, "translation.of must be the id of another section"), typeof a.checked != "boolean" && r(`${t}.checked`, "checked must be true or false"), typeof a.machine != "boolean" && r(`${t}.machine`, "machine must be true or false"), (!Oc(a.lines) || !Object.values(a.lines).every((e) => Oc(e) && typeof e.from == "string" && typeof e.manual == "boolean")) && r(`${t}.lines`, "lines must map block ids to { from, manual }")) : r(t, "translation must be an object");
		}
		let f = e.symbol_frame;
		if (f === null) u(e.category, `${n}.category`);
		else if (!Oc(f) || f.role !== "symbol_frame") r(`${n}.symbol_frame`, "symbol_frame must be a symbol_frame node or null");
		else {
			let e = `${n}.symbol_frame`;
			o(f, e), c(f.spacing, `${e}.spacing`, "spacing"), s(f.align, [
				"start",
				"centre",
				"end"
			], `${e}.align`, "align"), l(f.background, `${e}.background`), d(f.symbols, `${e}.symbols`, "symbols").forEach((t, n) => {
				let i = `${e}.symbols[${n}]`;
				if (!Oc(t) || t.role !== "symbol") return r(i, "Expected a symbol node");
				o(t, i), u(t.category, `${i}.category`);
				let a = t.source;
				if (!Oc(a)) return r(`${i}.source`, "Symbol has no prepared source");
				let s = a.view_box;
				if ((!Array.isArray(s) || s.length !== 4 || !s.every(kc) || s[2] <= 0 || s[3] <= 0) && r(`${i}.source.view_box`, "view_box must be [x, y, w, h] with positive size"), typeof a.body != "string" || a.body === "") r(`${i}.source.body`, "Symbol body is empty");
				else {
					let e = Dc(a.body);
					e.length && r(`${i}.source.body`, `Unsafe symbol markup: ${e.join(", ")}`, "E_UNSAFE_SYMBOL");
				}
			});
		}
		let m = e.text_frame, h = `${n}.text_frame`;
		if (!Oc(m) || m.role !== "text_frame") return r(h, "text_frame is required");
		o(m, h), c(m.spacing, `${h}.spacing`, "spacing");
		let g = Oc(e.symbol_frame) && Array.isArray(e.symbol_frame.symbols) && e.symbol_frame.symbols.length > 0;
		d(m.panels, `${h}.panels`, "panels", g).forEach((e, t) => {
			let n = `${h}.panels[${t}]`;
			if (!Oc(e) || e.role !== "text_panel") return r(n, "Expected a text_panel node");
			o(e, n), e.padding !== "auto" && !(Array.isArray(e.padding) && e.padding.length === 4 && e.padding.every((e) => kc(e) && e >= 0)) && r(`${n}.padding`, "padding must be 'auto' or four non-negative numbers"), c(e.spacing, `${n}.spacing`, "spacing"), s(e.justify, [
				"start",
				"centre",
				"end",
				"space-between",
				"space-evenly"
			], `${n}.justify`, "justify"), (!kc(e.grow) || e.grow < 0) && r(`${n}.grow`, "grow must be ≥ 0"), e.fill !== "none" && l(e.fill, `${n}.fill`), e.category !== void 0 && u(e.category, `${n}.category`), d(e.blocks, `${n}.blocks`, "blocks").forEach((e, t) => {
				let a = `${n}.blocks[${t}]`;
				if (!Oc(e) || e.role !== "text_block") return r(a, "Expected a text_block node");
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
				], `${a}.placement`, "placement"), (!kc(e.line_spacing) || e.line_spacing < Ms.MIN_LINE_SPACING || e.line_spacing > 3) && r(`${a}.line_spacing`, `line_spacing must be ${Ms.MIN_LINE_SPACING}–3`), kc(e.y_offset) || r(`${a}.y_offset`, "y_offset must be a number"), e.text_transform !== void 0 && s(e.text_transform, ["uppercase"], `${a}.text_transform`, "text_transform"), e.padding !== void 0 && !(Array.isArray(e.padding) && e.padding.length === 4 && e.padding.every((e) => kc(e) && e >= 0)) && r(`${a}.padding`, "padding must be four non-negative numbers"), l(e.colour, `${a}.colour`), e.stretch !== void 0 && typeof e.stretch != "boolean" && r(`${a}.stretch`, "stretch must be true or false");
				let c = e.size, u = Ms.MIN_LETTER_HEIGHT, d = Ms.MAX_LETTER_HEIGHT, f = (e) => kc(e) && e >= u && e <= d;
				if (!Oc(c)) return r(`${a}.size`, "size is required");
				if (c.mode === "auto") {
					s(c.role, [
						"title",
						"body",
						"footer"
					], `${a}.size.role`, "role");
					for (let e of ["recommended", "min"]) c[e] !== "auto" && !f(c[e]) && r(`${a}.size.${e}`, `${e} must be 'auto' or ${u}–${d} mm`);
					c.scale !== void 0 && !(kc(c.scale) && c.scale >= Ms.MIN_TEXT_SCALE && c.scale <= Ms.MAX_TEXT_SCALE) && r(`${a}.size.scale`, `scale must be ${Ms.MIN_TEXT_SCALE}–${Ms.MAX_TEXT_SCALE}`), kc(c.min) && kc(c.recommended) && c.min > c.recommended && r(`${a}.size`, "min must not exceed recommended");
				} else c.mode === "fixed" ? f(c.letter_height) || r(`${a}.size.letter_height`, `letter_height must be ${u}–${d} mm`) : r(`${a}.size.mode`, "size.mode must be 'auto' or 'fixed'");
			});
		});
	}), n;
}
//#endregion
//#region src/pipeline.ts
function Fc(e, t, n) {
	if (!t?.shaper || !t?.ruleset) throw Error("renderSign needs { shaper, ruleset }");
	let r;
	try {
		r = Tc(e);
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
	let i = Pc(r, t.ruleset);
	if (Nc(i)) return {
		svg: null,
		scene: null,
		report: null,
		doc: r,
		findings: i
	};
	let { scene: a, report: o } = nc(r, t);
	return {
		svg: Sc(a, n),
		scene: a,
		report: o,
		doc: r,
		findings: [...i, ...o.findings]
	};
}
//#endregion
//#region src/template/index.ts
var Ic = () => {
	let e = /* @__PURE__ */ new Map();
	return (t) => {
		let n = (e.get(t) ?? 0) + 1;
		return e.set(t, n), `${t}-${n}`;
	};
}, Lc = (e, t, n) => ({
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
function Rc(e, t, n, r) {
	let i = [Lc(e, t.title, "title")];
	return t.body && i.push(Lc(e, t.body, "body")), {
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
var zc = (e, t, n) => {
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
function Bc(e) {
	let t = Ic(), { width: n, height: r } = e.size, i = e.orientation ?? (r >= n ? "vertical" : "horizontal");
	return zc(e.ruleset, e.size, {
		id: t("sign"),
		role: "sign",
		width: n,
		height: r,
		layout: {
			type: "stack",
			direction: "vertical",
			spacing: "auto"
		},
		sections: [Rc(t, e, i, e.ruleset)]
	});
}
//#endregion
//#region src/symbols/sha256.ts
var Vc = new Uint32Array([
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
function Hc(e) {
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
			let i = f + (s(l, 6) ^ s(l, 11) ^ s(l, 25)) + (l & u ^ ~l & d) + Vc[e] + o[e] | 0, a = (s(t, 2) ^ s(t, 13) ^ s(t, 22)) + (t & n ^ t & r ^ n & r) | 0;
			f = d, d = u, u = l, l = c + i | 0, c = r, r = n, n = t, t = i + a | 0;
		}
		a[0] += t, a[1] += n, a[2] += r, a[3] += c, a[4] += l, a[5] += u, a[6] += d, a[7] += f;
	}
	return Array.from(a, (e) => e.toString(16).padStart(8, "0")).join("");
}
var Uc = "__SYM__", Wc = class extends Error {
	name = "InvalidSymbol";
}, Gc = /* @__PURE__ */ new Set([
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
]), Kc = /* @__PURE__ */ new Set(/* @__PURE__ */ "id.d.points.x.y.x1.y1.x2.y2.cx.cy.r.rx.ry.fx.fy.width.height.transform.viewBox.preserveAspectRatio.href.offset.gradientUnits.gradientTransform.spreadMethod.clipPathUnits.maskUnits.maskContentUnits.fill.fill-opacity.fill-rule.stroke.stroke-width.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-dasharray.stroke-dashoffset.stroke-opacity.opacity.clip-path.clip-rule.mask.stop-color.stop-opacity.display.visibility.style".split(".")), qc = /* @__PURE__ */ new Set([
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
]), Jc = [
	"fill",
	"fill-rule",
	"stroke",
	"stroke-width",
	"opacity",
	"style"
], Yc = (e) => /javascript\s*:|expression\s*\(|@import|\\/i.test(e) || /url\(\s*['"]?(?!#)/i.test(e);
function Xc(e) {
	return e.split(";").flatMap((e) => {
		let t = e.indexOf(":");
		if (t < 0) return [];
		let n = e.slice(0, t).trim().toLowerCase(), r = e.slice(t + 1).trim();
		return n && r ? [[n, r]] : [];
	});
}
function Zc(e) {
	let t = e.replace(/\/\*[\s\S]*?\*\//g, ""), n = [];
	for (let e of t.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) n.push({
		selectors: e[1].split(",").map((e) => e.trim()),
		decls: Xc(e[2])
	});
	return n;
}
function Qc(e, t) {
	let n = /^([a-zA-Z]*)((?:\.[\w-]+)*)$/.exec(e);
	if (!n) return !1;
	let [, r, i] = n;
	if (r && r !== t.localName) return !1;
	let a = (t.getAttribute("class") ?? "").split(/\s+/);
	return i.split(".").filter(Boolean).every((e) => a.includes(e));
}
var $c = (e) => e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function el(e) {
	let t = e.getAttribute("viewBox"), n;
	if (n = t ? t.trim().split(/[\s,]+/).map(Number) : [
		0,
		0,
		parseFloat(e.getAttribute("width") ?? ""),
		parseFloat(e.getAttribute("height") ?? "")
	], n.length !== 4 || n.some((e) => !Number.isFinite(e)) || n[2] <= 0 || n[3] <= 0) throw new Wc("Symbol SVG has no usable viewBox or width/height");
	return n;
}
function tl(e, t = {}) {
	let n = t.DOMParser ?? globalThis.DOMParser;
	if (!n) throw new Wc("No DOMParser available");
	let r = t.purify ? t.purify(e) : e, i = new n().parseFromString(r, "image/svg+xml"), a = i.documentElement;
	if (!a || a.localName !== "svg" || i.getElementsByTagName("parsererror").length > 0) throw new Wc("Not an SVG document");
	let o = el(a), s = [];
	for (let e of Array.from(a.getElementsByTagName("style"))) s.push(...Zc(e.textContent ?? ""));
	let c = /* @__PURE__ */ new Set(), l = (e) => {
		let t = e.getAttribute("id");
		t && c.add(t);
		for (let t of Array.from(e.children)) l(t);
	};
	l(a);
	let u = (e) => e.replace(/url\(\s*(['"]?)#([^)'"]+)\1\s*\)/g, (e, t, n) => c.has(n) ? `url(#${Uc}${n})` : e), d = (e) => e.filter(([e, t]) => qc.has(e) && !Yc(t)).map(([e, t]) => `${e}:${u(t)}`).join(";"), f = (e) => {
		let t = [], n = s.filter((t) => t.selectors.some((t) => Qc(t, e))).flatMap((e) => e.decls), r = Xc(e.getAttribute("style") ?? "");
		for (let n of Array.from(e.attributes)) {
			let e = n.name, r = n.value;
			if (e === "xlink:href" && (e = "href"), e !== "style" && Kc.has(e) && !/^on/i.test(e)) {
				if (e === "href") {
					if (!r.startsWith("#")) continue;
					let e = r.slice(1);
					r = c.has(e) ? `#${Uc}${e}` : r;
				} else if (e === "id") r = `${Uc}${r}`;
				else {
					if (Yc(r)) continue;
					r = u(r);
				}
				t.push(`${e}="${$c(r)}"`);
			}
		}
		let i = d([...n, ...r]);
		return i && t.push(`style="${$c(i)}"`), t.length ? ` ${t.join(" ")}` : "";
	}, p = (e) => {
		let t = e.localName === "a" ? "g" : e.localName;
		if (!Gc.has(t)) return "";
		let n = Array.from(e.children).map(p).join(""), r = f(e);
		return n ? `<${t}${r}>${n}</${t}>` : `<${t}${r}/>`;
	}, m = Array.from(a.children).map(p).join(""), h = Jc.map((e) => [e, a.getAttribute(e)]).filter((e) => !!e[1] && !Yc(e[1]));
	if (h.length && (m = `<g ${h.map(([e, t]) => e === "style" ? `style="${$c(d(Xc(t)))}"` : `${e}="${$c(t)}"`).join(" ")}>${m}</g>`), !m) throw new Wc("Symbol has no drawable content");
	return {
		view_box: o,
		body: m,
		hash: Hc(m),
		prepared_with: "1"
	};
}
//#endregion
//#region src/text/canvasShaper.ts
var nl = 100, rl = 1e3, il = {
	regular: "/arimo/Arimo-Regular.ttf",
	bold: "/arimo/Arimo-Bold.ttf",
	italic: "/arimo/Arimo-Italic.ttf",
	"bold-italic": "/arimo/Arimo-BoldItalic.ttf"
};
function al() {
	if (typeof OffscreenCanvas < "u") {
		let e = new OffscreenCanvas(8, 8).getContext("2d");
		if (e) return e;
	}
	let e = document.createElement("canvas").getContext("2d");
	if (!e) throw Error("Canvas 2D is not available");
	return e;
}
var ol = (e, t, n = nl) => `${e === "italic" || e === "bold-italic" ? "italic" : "normal"} ${e === "bold" || e === "bold-italic" ? "bold" : "normal"} ${n}px "${t}"`;
function sl(e, t = al()) {
	let n = (e) => (t.font = e, t.measureText("mmmmmmmmmmlliWWQ@#0123").width);
	return ["monospace", "serif"].every((t) => n(`100px "${e}", ${t}`) !== n(`100px ${t}`));
}
async function cl(e, t) {
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
async function ll(t) {
	let n = al();
	n.fontKerning = "normal";
	let r = t.family;
	if (!sl(r, n)) {
		let e = {
			...il,
			...t.fallbackUrls
		};
		r = await cl(t.fallback, e) ? t.fallback : "sans-serif";
	}
	let i = (e, t) => (n.font = r === "sans-serif" ? ol(t, r).replace(/"/g, "") : ol(t, r), n.measureText(e)), a = {};
	for (let e of [
		"regular",
		"bold",
		"italic",
		"bold-italic"
	]) {
		let t = i("H", e);
		a[e] = {
			unitsPerEm: rl,
			capHeight: t.actualBoundingBoxAscent / nl * rl,
			ascender: t.fontBoundingBoxAscent / nl * rl,
			descender: -(t.fontBoundingBoxDescent / nl) * rl
		};
	}
	let o = new e(2e3);
	return {
		id: `canvas:${r}`,
		family: r,
		metrics: (e) => a[e],
		advance: (e, t, n) => o.get(`a|${t}|${e}`, () => i(e, t).width / nl) * n,
		descent: (e, t, n) => Math.max(0, o.get(`d|${t}|${e}`, () => i(e, t).actualBoundingBoxDescent / nl)) * n
	};
}
//#endregion
//#region src/rulesets/checks.ts
var ul = (e) => {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
};
function dl(e) {
	let t = /^#?([0-9a-f]{6})$/i.exec(e.trim());
	if (!t) return 0;
	let n = parseInt(t[1], 16);
	return .2126 * ul(n >> 16 & 255) + .7152 * ul(n >> 8 & 255) + .0722 * ul(n & 255);
}
function fl(e, t) {
	let [n, r] = [dl(e.hex), dl(t.hex)].sort((e, t) => t - e);
	return (n + .05) / (r + .05);
}
function pl(e, t, n) {
	let r = t.x + t.width / 2, i = t.y + t.height / 2;
	for (let t = n - 1; t >= 0; t--) {
		let n = e.nodes[t];
		if (n.type !== "rect" || n.layer !== "artwork" || !n.fill) continue;
		let a = n;
		if (r >= a.x && r <= a.x + a.width && i >= a.y && i <= a.y + a.height) return a.fill;
	}
}
function ml(e, t) {
	let n = [], r = e.limits?.min_letter_height;
	return t.nodes.forEach((e, i) => {
		if (e.type !== "text" || e.lines.length === 0) return;
		r !== void 0 && e.letter_height < r && n.push({
			severity: "warning",
			code: "W_LETTER_HEIGHT_BELOW_MIN",
			path: e.source_id,
			message: `Letter height ${e.letter_height} mm is below the ${r} mm minimum for this standard`
		});
		let a = pl(t, e, i);
		a && fl(a, e.colour) < 3 && n.push({
			severity: "warning",
			code: "W_LOW_CONTRAST",
			path: e.source_id,
			message: `Text colour ${e.colour.hex} has low contrast against ${a.hex}`
		});
	}), n;
}
//#endregion
//#region src/rulesets/createRuleset.ts
function hl(e) {
	let t = new Map(e.categories.map((e) => [e.key, e]));
	return {
		...e,
		theme: (e) => t.get(e),
		check: (t) => ml(e, t)
	};
}
var gl = {
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
}, _l = [
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
], vl = class extends Error {
	name = "SignRulesError";
}, yl = [
	"title",
	"body",
	"footer"
];
function bl(e) {
	let t = [], n = e, r = (e, n, r = 100) => {
		typeof n != "number" || !Number.isFinite(n) ? t.push(`${e} must be a number`) : (n < 0 || n > r) && t.push(`${e} must be between 0 and ${r} (got ${n})`);
	}, i = (t) => t.split(".").reduce((e, t) => e && typeof e == "object" ? e[t] : void 0, e);
	for (let e of yl) r(`text_size.start_percent_of_height.${e}`, i(`text_size.start_percent_of_height.${e}`)), r(`text_size.minimum_mm.${e}`, i(`text_size.minimum_mm.${e}`), 500);
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
	if (t.length) throw new vl(`config/sign-rules.json has problems:\n- ${t.join("\n- ")}`);
	return n;
}
var xl = (e) => e / 100;
function Sl(e) {
	let t = bl(e), n = t.text_size.start_percent_of_height;
	return {
		MARGIN: xl(t.sign.margin_percent),
		BORDER: xl(t.sign.border_percent),
		SECTION_SPACING: xl(t.sign.section_gap_percent),
		SYMBOL_TEXT_SPACING: xl(t.symbol.gap_to_text_percent),
		SYMBOL_SPACING: xl(t.symbol.gap_between_symbols_percent),
		SYMBOL_PADDING: xl(t.symbol.clear_space_percent),
		PANEL_PADDING: xl(t.text_panel.padding_percent),
		PANEL_SPACING: xl(t.text_panel.gap_between_panels_percent),
		BLOCK_SPACING: xl(t.text_panel.gap_between_blocks_percent),
		MIN_SYMBOL_SHARE: xl(t.symbol.min_share_percent),
		MAX_SYMBOL_SHARE: xl(t.symbol.max_share_percent),
		MIN_TEXT_SHARE: xl(t.text_panel.min_share_percent),
		DEFAULT_SYMBOL_SHARE: xl(t.symbol.default_share_percent),
		GRID_GUTTER: xl(t.grid.gutter_percent),
		CELL_PADDING: xl(t.grid.cell_padding_percent),
		CELL_OUTLINE: xl(t.grid.cell_outline_percent),
		UNIFORM_GAP: t.spacing?.same_gap_everywhere ? xl(t.spacing.gap_percent) : null,
		CORNERS_ROUNDED: t.corners?.rounded_by_default ?? !1,
		CORNER_RADIUS: !t.corners || t.corners.radius_same_as_gap ? null : xl(t.corners.radius_percent),
		LETTER_HEIGHT: {
			title: xl(n.title),
			body: xl(n.body),
			footer: xl(n.footer)
		},
		MIN_LETTER_HEIGHT_MM: { ...t.text_size.minimum_mm }
	};
}
function Cl(e) {
	let t = bl(e).limits?.warn_below_letter_height_mm;
	return typeof t == "number" ? { min_letter_height: t } : {};
}
//#endregion
//#region src/rulesets/fromDb.ts
var wl = {
	hex: "#FFFFFF",
	cmyk: [
		0,
		0,
		0,
		0
	]
}, Tl = {
	hex: "#000000",
	cmyk: [
		0,
		0,
		0,
		100
	]
}, El = /^#[0-9a-fA-F]{6}$/, Dl = (e) => e.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
function Ol(e) {
	if (!e) return;
	let t = e.replace(/^cmyk\(|\)$/gi, "").split(",").map(Number);
	return t.length === 4 && t.every((e) => Number.isFinite(e) && e >= 0 && e <= 100) ? t : void 0;
}
var kl = {
	key: "plain",
	title: "White",
	background: wl,
	panel: wl,
	panel_text: Tl,
	border: Tl
}, Al = /* @__PURE__ */ new Set(["fire_emergency", "fire"]);
function jl(e) {
	let t = [kl], n = [];
	for (let r of e) {
		let e = r.default_colour_HEX?.trim().toUpperCase(), i = r.default_text_HEX?.trim().toUpperCase();
		if (!e || !El.test(e) || !i || !El.test(i)) {
			n.push({
				id: r.id,
				title: r.title,
				reason: "no default_colour_HEX / default_text_HEX"
			});
			continue;
		}
		let a = Ol(r.default_colour), o = Dl(r.title), s = a ? {
			hex: e,
			cmyk: a
		} : { hex: e };
		t.push({
			key: o,
			db_id: r.id,
			title: r.description?.trim() || r.title,
			background: wl,
			panel: s,
			panel_text: i === "#000000" ? Tl : i === "#FFFFFF" ? wl : { hex: i },
			border: Tl,
			...Al.has(o) ? { symbol_background: s } : {}
		});
	}
	return {
		categories: t,
		skipped: n
	};
}
//#endregion
//#region src/rulesets/iso7010.ts
var Ml = jl(_l), Nl = Ml.categories;
Ml.skipped;
var Pl = gl;
Sl(Pl);
function Fl(e = Pl, t = Nl) {
	return hl({
		id: "iso7010",
		ratios: Sl(e),
		categories: t,
		limits: Cl(e)
	});
}
Fl();
//#endregion
//#region editor/src/config.ts
function Il() {
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
var Ll = Il(), Rl = () => Ll ? "same-origin" : "omit", zl = {
	mm: 1,
	mmm: 1,
	cm: 10,
	m: 1e3,
	in: 25.4,
	inch: 25.4,
	ft: 304.8,
	feet: 304.8
}, Bl = (e) => (e.view.value.doc?.root.sections ?? []).flatMap((e) => e.text_frame.panels.flatMap((e) => e.blocks.map((e) => e.text.trim()))).filter(Boolean), Vl = (e) => [...new Set((e.view.value.doc?.root.sections ?? []).flatMap((e) => e.symbol_frame?.symbols.map((e) => e.symbol_code) ?? []))];
function Hl(e) {
	let t = (t) => {
		let n = RegExp(`^<svg[^>]*\\s${t}="([\\d.]+)mm"`).exec(e);
		return n ? Number(n[1]) : null;
	}, n = t("width"), r = t("height");
	if (!n || !r) return e;
	let i = Math.max(n, r) / 300, a = i / 2, o = `<rect x="${a.toFixed(2)}" y="${a.toFixed(2)}" width="${(n - i).toFixed(2)}" height="${(r - i).toFixed(2)}" fill="none" stroke="#b4b1aa" stroke-width="${i.toFixed(2)}" vector-effect="non-scaling-stroke"/>`;
	return e.replace(/<\/svg>\s*$/, `${o}</svg>`);
}
function Ul(e) {
	let t = [];
	function n(t) {
		if (typeof t == "number") return e.pickSizeById(t);
		let n = zl[(t.size_units ?? "mm").toLowerCase()] ?? 0, r = Number(t.size_width) * n, i = Number(t.size_height) * n;
		e.pickSizeById(Number(t.size_id), r > 0 ? r : void 0, i > 0 ? i : void 0, Number(t.symbol_default_location) === 1 ? "left" : "above");
		let a = (t.face_hex ?? "").trim();
		e.setMaterialFace(/^#[0-9a-f]{6}$/i.test(a) ? a : null);
	}
	let r = null;
	In(() => e.view.value.doc, (e) => {
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
			svg_raw: Hl(await e.previewSvg()),
			svg_export: await e.printSvg(),
			svg_json: e.designJson(),
			svg_bespoke_texts: JSON.stringify(Bl(e)),
			svg_bespoke_images: JSON.stringify(Vl(e))
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
//#region editor/src/fontFiles.ts
var Wl = Ll?.assetBase ?? "./", Gl = {
	regular: `${Wl}nimbus/NimbusSanL-Reg.otf`,
	bold: `${Wl}nimbus/NimbusSanL-Bol.otf`,
	italic: `${Wl}nimbus/NimbusSanL-RegIta.otf`,
	"bold-italic": `${Wl}nimbus/NimbusSanL-BolIta.otf`
}, Kl = {
	regular: `${Wl}arimo/Arimo-Regular.ttf`,
	bold: `${Wl}arimo/Arimo-Bold.ttf`,
	italic: `${Wl}arimo/Arimo-Italic.ttf`,
	"bold-italic": `${Wl}arimo/Arimo-BoldItalic.ttf`
}, ql = (e, t) => (e ?? "").split(";")[0].replace(/\s+-\s*test$/i, "").trim() || t;
function Jl(e, t) {
	return e.filter((e) => e.usable && e.category).flatMap((e) => {
		let n = t(e);
		return n ? [{
			code: e.code,
			name: ql(e.referent, e.code),
			category: e.category,
			url: n
		}] : [];
	});
}
function Yl(e, t, n = Xl()) {
	return e.includes("{name}") ? new URL(e.replace("{name}", t), n) : new URL(`${t}.json`, new URL(e.endsWith("/") ? e : `${e}/`, n));
}
var Xl = () => typeof location > "u" ? void 0 : location.href;
async function Zl(e) {
	let t = async (t) => {
		let n = await fetch(Yl(e, t), { credentials: Rl() });
		if (!n.ok) throw Error(`${t}: HTTP ${n.status}`);
		return n.json();
	}, [n, r, i] = await Promise.all([
		t("categories"),
		t("symbols"),
		t("sizes")
	]), a = Yl(e, "symbols").href;
	return {
		source: new URL(a).origin,
		categories: n,
		symbols: Jl(r, (e) => e.url ? new URL(e.url, a).href : void 0),
		sizes: i
	};
}
function Ql(e = location.search) {
	let t = Ll?.dataUrl ?? new URLSearchParams(e).get("data") ?? "https://www.safetysignsandnotices.co.uk/index.php?route=bespoke/api/{name}";
	return t && t !== "bundled" ? t : null;
}
async function $l(e = location.search) {
	let t = Ql(e);
	if (t) return Zl(t);
	let { loadBundledData: n } = await import("./bundledData.embed-DiqJWvnl.js");
	return n();
}
var eu = 0, tu = Date.now().toString(36), nu = (e) => `${e}-${tu}${(++eu).toString(36)}`;
function ru(e) {
	let t = structuredClone(e), n = (e) => {
		if (Array.isArray(e)) e.forEach(n);
		else if (e && typeof e == "object") {
			let t = e;
			typeof t.id == "string" && typeof t.role == "string" && (t.id = nu(t.role)), Object.values(t).forEach(n);
		}
	};
	return n(t), t;
}
var iu = (e, t) => ({
	id: nu("text_block"),
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
}), au = (e = "Your text here") => ({
	id: nu("text_panel"),
	role: "text_panel",
	padding: "auto",
	spacing: "auto",
	justify: "centre",
	grow: 1,
	blocks: [iu(e, "title")]
}), ou = (e) => ({
	id: nu("symbol"),
	role: "symbol",
	symbol_code: e.code,
	category: e.category,
	source: e.source
});
function su(e, t) {
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
function cu(e) {
	if (e.placeholder) {
		delete e.placeholder;
		for (let t of e.text_frame.panels) {
			delete t.fill;
			for (let e of t.blocks) delete e.colour, e.variant = "bold";
		}
	}
}
function lu(e, t) {
	let n = e.root.sections.find((e) => e.id === t);
	if (!n) throw Error(`No section ${t}`);
	return n;
}
function uu(e, t) {
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
function du(e, t) {
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
var fu = (e, t, n) => {
	if (t === n || t < 0 || n < 0 || t >= e.length || n >= e.length) return;
	let [r] = e.splice(t, 1);
	e.splice(n, 0, r);
};
function pu(e) {
	let t = e.root.sections.find((e) => e.translation);
	return (t && e.root.sections.find((e) => e.id === t.translation.of)) ?? null;
}
function mu(e) {
	let t = pu(e);
	return t ? (t.symbol_frame?.symbols.length ?? 0) > 1 ? "multi" : "single" : e.root.layout.type === "board" ? "board" : e.root.layout.type === "grid" ? "grid" : e.root.sections.length > 1 ? "stacked" : (e.root.sections[0]?.symbol_frame?.symbols.length ?? 0) > 1 ? "multi" : "single";
}
var hu = (e, t) => e > t ? "left" : "above", gu = (e) => e === "left" || e === "right" ? "horizontal" : "vertical";
function _u(e) {
	let { root: t } = e;
	if (t.layout.type === "board") return vu(e, t.layout);
	if (t.layout.type !== "grid" && t.sections.length > 1) return;
	let [n, r] = t.layout.type === "grid" ? [t.width / t.layout.cols, t.height / t.layout.rows] : [t.width, t.height], i = t.sections[0]?.symbol_side === "end";
	for (let e of t.sections) e.orientation = gu(hu(n, r)), i || delete e.symbol_side;
}
function vu(e, t) {
	let { root: n } = e, r = Vd(t), i = Hd(t), a = r.reduce((e, t) => e + t, 0) || 1, o = 0;
	t.rows.forEach((e, t) => {
		let s = n.width / i[t], c = r[t] / a * n.height;
		for (let e = 0; e < i[t]; e++) {
			let t = n.sections[o + e];
			if (!t || !t.text_frame.panels.length) continue;
			let r = t.symbol_side === "end";
			t.orientation = gu(hu(s, c)), r || delete t.symbol_side;
		}
		o += i[t];
	});
}
function yu(e) {
	let t = e.root.sections[0], n = t?.symbol_side === "end";
	return t?.orientation === "horizontal" ? n ? "right" : "left" : n ? "below" : "above";
}
function bu(e, t) {
	let n = t === "below" || t === "right";
	for (let r of e.root.sections) r.orientation = gu(t), n ? r.symbol_side = "end" : delete r.symbol_side;
}
function xu(e, t) {
	let { root: n } = e, r = mu(e);
	if (t === r) return null;
	let i = null, a = pu(e);
	if (a) {
		let e = a.symbol_frame;
		return !e || t !== "single" && t !== "multi" ? null : (t === "single" ? e.symbols.length = 1 : e.symbols.length < 2 && (e.symbols.push(ru(e.symbols[0])), i = {
			section: n.sections.indexOf(a),
			symbol: e.symbols.length - 1
		}), i);
	}
	let o = n.sections[0], s = Uu(e);
	if (t === "single" || t === "multi") {
		let r = t === "multi" && n.sections.length > 1 ? wu(n.sections) : o;
		n.sections = [r], n.layout = {
			type: "stack",
			direction: "vertical",
			spacing: "auto",
			align_symbols: s
		};
		let a = r.symbol_frame;
		if (t === "single" && a && a.symbols.length > 1 && (a.symbols.length = 1), t === "multi") {
			if (!a) return null;
			a.symbols.length < 2 && (a.symbols.push(ru(a.symbols[0])), i = {
				section: 0,
				symbol: a.symbols.length - 1
			});
		}
		_u(e);
	} else if (t === "stacked") {
		let t = r === "multi" ? Cu(o) : n.sections.slice(0, 4);
		t.length < 2 && t.push(ru(o)), n.sections = t, n.layout = {
			type: "stack",
			direction: "vertical",
			spacing: "auto",
			align_symbols: s
		}, bu(e, "left");
	} else if (t === "board") {
		let t = (r === "multi" ? Cu(o) : n.sections).slice(0, 8);
		n.sections = t.length ? t : [o], n.layout = {
			type: "board",
			rows: n.sections.map(() => ({ cells: 1 })),
			gutter: "auto",
			sync_rows: !0,
			align_symbols: !1
		}, _u(e);
	} else {
		let t = r === "multi" ? Cu(o).slice(0, 4) : null, i = t?.length ?? 2, [a, c] = n.width >= n.height ? [1, i] : [i, 1];
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
		}, Tu(e), _u(e);
	}
	return i;
}
function Su(e) {
	let t = [];
	for (let n of e) {
		let e = t[t.length - 1];
		e && (e[0].category === n.category || t.length >= 4) ? e.push(n) : t.push([n]);
	}
	return t;
}
function Cu(e) {
	let t = Su(e.symbol_frame?.symbols ?? []);
	if (t.length < 2) return [e];
	let n = t.length, r = e.text_frame.panels, i = t.map(() => []);
	if (r.length >= n) r.forEach((e, t) => i[Math.min(t, n - 1)].push(e));
	else {
		let e = r.flatMap((e) => e.blocks), t = Math.max(1, e.length - (n - 1)), a = r[0], o = (e, t) => ({
			...a,
			id: t ? a.id : nu("text_panel"),
			blocks: e
		});
		i[0].push(o(e.slice(0, t), !0));
		for (let r = 1; r < n; r++) {
			let n = e[t + r - 1];
			i[r].push(n ? o([md(n, "title")], !1) : au());
		}
	}
	return t.map((t, n) => {
		let r = n === 0 ? e : ru({
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
				id: n === 0 ? e.symbol_frame.id : nu("symbol_frame"),
				symbols: t
			},
			text_frame: {
				...r.text_frame,
				panels: i[n]
			}
		};
	});
}
function wu(e) {
	let t = e[0], n = e.flatMap((e) => e.symbol_frame?.symbols ?? []).slice(0, 4), r = e.flatMap((e) => e.text_frame.panels), i = e.every((e) => e.text_frame.panels.length === 1) && r.every((e) => e.category === void 0), a = (e) => e.symbol_frame?.symbols[0]?.category ?? e.category, o = i ? [{
		...r[0],
		blocks: r.flatMap((e, t) => e.blocks.map((e) => t > 0 && pd(e) === "title" ? md(e, "body") : e))
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
function Tu(e) {
	let { root: t } = e;
	if (t.layout.type !== "grid") return;
	let n = t.layout.rows * t.layout.cols;
	for (; t.sections.length < n;) t.sections.push(ru(t.sections[t.sections.length - 1]));
	t.sections.length = n;
}
function Eu(e, t, n) {
	let r = e.root.layout;
	r.type === "grid" && (r.rows = Math.max(1, Math.min(4, Math.round(t))), r.cols = Math.max(1, Math.min(4, Math.round(n))), Tu(e), _u(e));
}
function Du(e, t) {
	e.root.width = t.width, e.root.height = t.height, e.catalogue_size_id = t.size_id, _u(e);
}
var Ou = 1200, ku = 2400, Au = (e) => Math.round(Math.min(ku, Math.max(50, Number.isFinite(e) ? e : 50)));
function ju(e, t, n, r) {
	let i = Au(e);
	if (r && n.width > 0 && n.height > 0) {
		let e = n.width / n.height, r = t === "width" ? i : i * e, a = t === "width" ? i / e : i, o = Math.min(1, Ou / Math.min(r, a), ku / Math.max(r, a));
		return r *= o, a *= o, {
			width: Au(r),
			height: Au(a)
		};
	}
	let a = t === "width" ? i : Au(n.width), o = t === "height" ? i : Au(n.height);
	return Math.min(a, o) > 1200 && (t === "width" ? a = Ou : o = Ou), {
		width: a,
		height: o
	};
}
function Mu(e, t, n, r) {
	let i = Au(t), a = Au(n);
	Math.min(i, a) > 1200 && (i <= a ? i = Ou : a = Ou);
	let o = r.find((e) => e.width === i && e.height === a);
	if (o) return Du(e, o);
	e.root.width = i, e.root.height = a, delete e.catalogue_size_id, _u(e);
}
function Nu(e, t) {
	let n = e.root.sections;
	return e.root.layout.type !== "stack" || n.length >= 4 ? t : (n.splice(t + 1, 0, ru(n[t])), t + 1);
}
function Pu(e, t) {
	let n = e.root.sections;
	e.root.layout.type !== "stack" || n.length <= 1 || (n.splice(t, 1), n.length === 1 && _u(e));
}
var Fu = (e, t, n) => fu(e.root.sections, t, n);
function Iu(e, t, n) {
	let r = e.root.sections;
	t !== n && r[t] && r[n] && ([r[t], r[n]] = [r[n], r[t]]);
}
function Lu(e, t) {
	let n = e.root.sections[t];
	n && (e.root.sections = e.root.sections.map((e, r) => r === t ? e : ru(n)));
}
function Ru(e, t) {
	for (let n of e.root.sections[t]?.text_frame.panels ?? []) for (let e of n.blocks) e.text = "";
}
function zu(e, t, n) {
	let r = lu(e, t);
	cu(r), r.symbol_frame || (r.symbol_frame = {
		id: nu("symbol_frame"),
		role: "symbol_frame",
		spacing: "auto",
		align: "centre",
		symbols: []
	}, delete r.category);
	let i = r.symbol_frame.symbols;
	return i.length >= 4 || i.push(ou(n)), i.length - 1;
}
function Bu(e, t, n, r) {
	cu(lu(e, t));
	let i = lu(e, t).symbol_frame?.symbols, a = i?.[n];
	i && a && (i[n] = {
		...a,
		symbol_code: r.code,
		category: r.category,
		source: r.source
	});
}
function Vu(e, t, n) {
	let r = lu(e, t), i = r.symbol_frame, a = i?.symbols[n];
	i && a && (i.symbols.splice(n, 1), i.symbols.length === 0 && (r.symbol_frame = null, r.category = a.category));
}
var Hu = (e, t, n, r) => {
	let i = lu(e, t).symbol_frame?.symbols;
	i && fu(i, n, r);
}, Uu = (e) => e.root.layout.align_symbols ?? !0;
function Wu(e, t) {
	e.root.layout.align_symbols = t;
}
function Gu(e, t, n) {
	let r = Uu(e) ? e.root.sections : [lu(e, t)];
	for (let e of r) e.symbol_share = n;
}
function Ku(e, t, n) {
	let r = lu(e, t);
	cu(r), r.category = n;
}
function qu(e, t) {
	let n = lu(e, t).text_frame.panels;
	if (n.length >= 4) return null;
	let r = au("More text");
	return r.blocks[0].size = {
		...r.blocks[0].size,
		role: "body"
	}, n.push(r), r.id;
}
function Ju(e, t) {
	let { section: n, index: r } = uu(e, t);
	n.text_frame.panels.length > 1 && n.text_frame.panels.splice(r, 1);
}
function Yu(e, t, n) {
	let { section: r, index: i } = uu(e, t);
	fu(r.text_frame.panels, i, i + n);
}
function Xu(e, t, n) {
	cu(uu(e, t).section);
	let { panel: r } = uu(e, t);
	n ? r.category = n : delete r.category;
}
var Zu = [
	"prohibition",
	"warning",
	"mandatory",
	"fire_emergency",
	"fire"
];
function Qu(e) {
	let t = [...Zu, "plain"].flatMap((t) => e.filter((e) => e.key === t)), n = new Set(t.map((e) => `${e.panel.hex}/${e.panel_text.hex}`));
	return {
		main: t,
		more: e.filter((e) => {
			let t = `${e.panel.hex}/${e.panel_text.hex}`;
			return Zu.includes(e.key) || n.has(t) ? !1 : (n.add(t), !0);
		})
	};
}
function $u(e, t) {
	let { panel: n } = uu(e, t);
	if (n.blocks.length >= 4) return null;
	let r = iu("More text", "body");
	return n.blocks.push(r), r.id;
}
function ed(e, t) {
	let { panel: n } = uu(e, t);
	if (n.blocks.length >= 4) return null;
	let r = iu("", "body");
	return r.fill = {
		hex: "#FFFFFF",
		cmyk: [
			0,
			0,
			0,
			0
		]
	}, r.colour = {
		hex: "#000000",
		cmyk: [
			0,
			0,
			0,
			100
		]
	}, r.align = "left", n.blocks.push(r), r.id;
}
function td(e, t) {
	let { panel: n } = uu(e, t), r = n.blocks.findIndex((e) => e.fill !== void 0);
	r >= 0 && n.blocks.splice(r, 1);
}
var nd = (e) => e.blocks.some((e) => e.fill !== void 0);
function rd(e, t) {
	let { section: n, panel: r, index: i } = du(e, t);
	r.blocks.length > 1 ? r.blocks.splice(i, 1) : n.text_frame.panels.length > 1 ? Ju(e, r.id) : r.blocks[0].text = "";
}
function id(e, t, n) {
	let { panel: r, index: i } = du(e, t);
	fu(r.blocks, i, i + n);
}
var ad = (e, t, n) => {
	let { section: r, block: i } = du(e, t);
	cu(r), i.text = n;
}, od = (e, t, n) => {
	du(e, t).block.align = n;
};
function sd(e, t, n) {
	du(e, t).block.variant = n ? "bold" : "regular";
}
var cd = (e) => e.variant === "bold" || e.variant === "bold-italic", ld = (e) => e.text_transform === "uppercase";
function ud(e, t) {
	t ? e.text_transform = "uppercase" : delete e.text_transform;
}
var dd = (e, t, n) => ud(du(e, t).block, n);
function fd(e, t, n) {
	let { block: r } = du(e, t);
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
var pd = (e) => e.size.mode === "auto" ? e.size.role : "title", md = (e, t) => ({
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
}), hd = {
	min: .8,
	max: 1.6,
	step: .05,
	default: 1.15
};
function gd(e, t, n) {
	let r = Number.isFinite(n) ? n : hd.default;
	du(e, t).block.line_spacing = Math.round(Math.min(hd.max, Math.max(hd.min, r)) * 100) / 100;
}
var _d = (e) => e.placement === "pin-bottom";
function vd(e, t, n) {
	du(e, t).block.placement = n ? "pin-bottom" : "flow";
}
function yd(e, t, n) {
	du(e, t).block.y_offset = Math.round(n * 10) / 10;
}
var bd = 1.18;
function xd(e) {
	if (e.size.mode !== "auto" || e.size.recommended !== "auto") return 0;
	let t = Math.round(Math.log(e.size.scale ?? 1) / Math.log(bd));
	return Math.max(-12, Math.min(8, t));
}
function Sd(e, t) {
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
	}, i = Math.min(Ms.MAX_TEXT_SCALE, Math.max(Ms.MIN_TEXT_SCALE, bd ** n));
	e.size = n === 0 ? r : {
		...r,
		scale: Math.round(i * 1e3) / 1e3
	};
}
function Cd(e, t) {
	return e > 0 && t ? "Max fit" : e === 0 ? "Auto" : e > 0 ? `+${e}` : `${e}`;
}
var wd = (e) => e.root.background && "token" in e.root.background && e.root.background.token === "panel" ? "colour" : "white";
function Td(e) {
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
var Ed = (e, t, n) => Math.hypot(e[0] - t[0], e[1] - t[1], e[2] - t[2]) <= n;
function Dd(e, t) {
	if (e.category !== "prohibition") return !1;
	let n = t.replace("#", "");
	if (n.length !== 6) return !1;
	let r = [
		0,
		2,
		4
	].map((e) => parseInt(n.slice(e, e + 2), 16));
	return Td(e.source?.body ?? "").some((e) => Ed(e, r, 40));
}
var Od = (e) => !!e.symbol_frame?.background;
function kd(e, t) {
	for (let n of e.root.sections) {
		let e = n.symbol_frame;
		e && (t ? e.background = { token: "background" } : delete e.background);
	}
}
function Ad(e, t) {
	return e.root.sections.some((e) => {
		let n = e.category ?? e.symbol_frame?.symbols[0]?.category, r = t.find((e) => e.key === n)?.panel.hex;
		return !!r && (e.symbol_frame?.symbols ?? []).some((e) => Dd(e, r));
	});
}
function jd(e, t, n = []) {
	if (t !== "colour") {
		delete e.root.background, kd(e, !1);
		return;
	}
	e.root.background = { token: "panel" }, Ad(e, n) && kd(e, !0);
}
var Md = (e, t) => e.root.corners?.rounded ?? t;
function Nd(e, t) {
	e.root.corners = {
		rounded: t,
		radius: e.root.corners?.radius ?? "auto"
	};
}
function Pd(e, t) {
	e.root.layout.type === "grid" && (e.root.layout.sync_text = t);
}
var Fd = (e) => e.root.layout.type === "grid" && e.root.layout.cell_outline !== void 0;
function Id(e, t) {
	let n = e.root.layout;
	n.type === "grid" && (t ? n.cell_outline = {
		width: "auto",
		layer: "artwork"
	} : delete n.cell_outline);
}
var Ld = (e) => pu(e) ?? e.root.sections[0];
function Rd(e) {
	if (!pu(e) && (e.root.layout.type !== "stack" || e.root.sections.length !== 1)) return !1;
	let t = Ld(e);
	return t.symbol_frame?.symbols.length === 1 && t.text_frame.panels.length === 1 && t.text_frame.panels[0].blocks.length <= 2 && t.text_frame.panels[0].category === void 0;
}
function zd(e) {
	let t = Ld(e).text_frame.panels[0].blocks;
	t.length < 2 && t.push(iu("", "body"));
}
function Bd(e) {
	return [
		e.id,
		...e.symbol_frame ? [e.symbol_frame.id, ...e.symbol_frame.symbols.map((e) => e.id)] : [],
		e.text_frame.id,
		...e.text_frame.panels.flatMap((e) => [e.id, ...e.blocks.map((e) => e.id)])
	];
}
var Vd = (e) => e.rows.map((e) => typeof e.weight == "number" && Number.isFinite(e.weight) && e.weight > 0 ? e.weight : 1), Hd = (e) => e.rows.map((e) => Math.max(1, Math.min(2, Math.floor(e.cells))));
function Ud(e, t, n, r, i) {
	if (r < 0 || i < 0 || r > t || i > n || !e.rows.length) return null;
	let a = Vd(e), o = Hd(e), s = a.reduce((e, t) => e + t, 0) || 1, c = 0, l = 0;
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
function Wd(e, t, n) {
	let { root: r } = e;
	if (r.layout.type === "board") return Ud(r.layout, r.width, r.height, t, n);
	if (r.layout.type !== "grid") return null;
	let { rows: i, cols: a } = r.layout, o = Math.floor(t / r.width * a), s = Math.floor(n / r.height * i);
	return o < 0 || s < 0 || o >= a || s >= i ? null : s * a + o;
}
function Gd(e) {
	let t = /^root\.sections\[(\d+)\]/.exec(e);
	return t ? Number(t[1]) : null;
}
function Kd(e) {
	let { root: t } = e, { layout: n } = t, r = n.type === "grid" ? t.height / n.rows : n.type === "board" ? t.height / Math.max(1, n.rows.length) : t.height / Math.max(1, n.direction === "vertical" ? t.sections.length : 1);
	return Math.max(5, Math.round(r / 4));
}
//#endregion
//#region editor/src/model/recipe.ts
var qd = "plain", Jd = {
	hex: "#000000",
	cmyk: [
		0,
		0,
		0,
		100
	]
}, Yd = 14, Xd = 4, Zd = 8, Qd = [
	"title",
	"body",
	"footer"
], $d = [
	"above",
	"below",
	"left",
	"right"
], ef = (e, t) => typeof e == "string" ? e.slice(0, t) : "", tf = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, nf = (e) => Array.isArray(e) ? e : [];
function rf(e) {
	let t = tf(e);
	if (!t) return null;
	let n = nf(t.sections).slice(0, Yd).map((e) => {
		let t = tf(e) ?? {};
		return {
			symbols: nf(t.symbols).filter((e) => typeof e == "string").slice(0, 4).map((e) => e.trim().toUpperCase()),
			colour: typeof t.colour == "string" ? t.colour : null,
			...t.step === !0 ? { step: !0 } : {},
			...t.write_on === !0 ? { write_on: !0 } : {},
			panels: nf(t.panels).slice(0, Xd).map((e) => {
				let t = tf(e) ?? {};
				return {
					colour: typeof t.colour == "string" ? t.colour : null,
					lines: nf(t.lines).slice(0, Zd).map((e) => {
						let t = tf(e) ?? {}, n = typeof t.min == "number" && Number.isFinite(t.min) ? Math.min(20, Math.max(Ms.MIN_LETTER_HEIGHT, t.min)) : void 0, r = t.align === "left" || t.align === "right" || t.align === "centre" ? t.align : void 0;
						return {
							text: ef(t.text, 200),
							style: Qd.includes(t.style) ? t.style : "body",
							caps: t.caps === !0,
							bold: t.bold !== !1,
							...n === void 0 ? {} : { min: n },
							...r === void 0 ? {} : { align: r }
						};
					}).filter((e) => e.text.trim() !== "")
				};
			}).filter((e) => e.lines.length > 0)
		};
	}).filter((e) => e.symbols.length > 0 || e.panels.length > 0);
	if (!n.length) return null;
	let r = af(t.rows_spec, n.length), i = t.layout === "board" && r ? "board" : t.layout === "stacked" || t.layout === "grid" ? t.layout : "single", a = (e) => typeof e == "number" && Number.isInteger(e) && e > 0 && e <= 6 ? e : void 0, o = a(t.rows), s = a(t.cols);
	return {
		version: 1,
		layout: i === "single" && n.length > 1 ? "stacked" : i,
		...r ? { rows_spec: r } : {},
		...t.background === "colour" ? { background: "colour" } : {},
		...o === void 0 ? {} : { rows: o },
		...s === void 0 ? {} : { cols: s },
		symbol_position: $d.includes(t.symbol_position) ? t.symbol_position : null,
		sections: n
	};
}
function af(e, t) {
	let n = nf(e).slice(0, 8).map((e) => {
		let t = tf(e) ?? {}, n = typeof t.cells == "number" ? Math.round(t.cells) : 1, r = typeof t.weight == "number" && t.weight > 0 ? Math.min(3, Math.max(.4, t.weight)) : void 0;
		return {
			cells: Math.max(1, Math.min(2, n)),
			...r === void 0 ? {} : { weight: r }
		};
	});
	return !n.length || n.reduce((e, t) => e + t.cells, 0) !== t ? null : n;
}
var of = (e) => [...new Set(e.sections.flatMap((e) => e.symbols))];
function sf(e, t, n) {
	let r = new Set(n.categories.map((e) => e.key)), i = (e) => e && r.has(e) ? e : void 0, a = n.categories[0]?.key ?? "prohibition", o = e.symbols.map((e) => t.get(e)).filter((e) => !!e), s = e.colour === qd, c = (e.panels.length ? e.panels : [{ lines: [{ text: "" }] }]).map((e) => {
		let t = au(), n = e.colour === "plain" || s && !e.colour, r = i(e.colour);
		return r && (t.category = r), n && (t.fill = { token: "background" }), t.blocks = e.lines.map((e) => {
			let t = iu(e.text, e.style ?? "body");
			return e.bold === !1 && (t.variant = "regular"), e.align !== void 0 && (t.align = e.align), e.min !== void 0 && t.size.mode === "auto" && (t.size.min = e.min), n && (t.colour = {
				...Jd,
				cmyk: [...Jd.cmyk]
			}), ud(t, e.caps === !0), t;
		}), t;
	}), l = {
		id: nu("section"),
		role: "section",
		orientation: "vertical",
		spacing: "auto",
		symbol_share: n.ratios.DEFAULT_SYMBOL_SHARE,
		symbol_frame: o.length ? {
			id: nu("symbol_frame"),
			role: "symbol_frame",
			spacing: "auto",
			align: "centre",
			symbols: o.map((e) => ({
				id: nu("symbol"),
				role: "symbol",
				symbol_code: e.code,
				category: e.category,
				source: e.source
			}))
		} : null,
		text_frame: {
			id: nu("text_frame"),
			role: "text_frame",
			spacing: "auto",
			panels: c
		}
	};
	return o.length || (l.category = i(e.colour) ?? i(e.panels[0]?.colour) ?? a), l;
}
function cf(e, t, n, r) {
	let i = Bc({
		symbols: [],
		title: "",
		size: {
			width: t.width,
			height: t.height,
			catalogue_size_id: t.size_id
		},
		ruleset: r
	}), a = e.sections.map((e) => sf(e, n, r));
	i.root.sections = a;
	let o = a.length;
	if (e.layout === "board" && e.rows_spec?.length) {
		let t = e.rows_spec, n = t.reduce((e, t) => e + t.cells, 0);
		for (; i.root.sections.length < n;) i.root.sections.push(ru(i.root.sections[i.root.sections.length - 1]));
		i.root.sections.length = n, i.root.layout = {
			type: "board",
			rows: t,
			gutter: "auto",
			sync_rows: !0,
			align_symbols: !1
		}, _u(i);
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
		}, _u(i);
	} else i.root.layout = {
		type: "stack",
		direction: "vertical",
		spacing: "auto",
		align_symbols: !0
	}, o > 1 ? bu(i, "left") : _u(i);
	return e.symbol_position && bu(i, e.symbol_position), e.background === "colour" && jd(i, "colour", r.categories), i;
}
//#endregion
//#region editor/src/model/rowPresets.ts
var Q = (e, t, n, r) => ({
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
}), lf = [
	Q("header-site-safety", "Headers", "SITE SAFETY header", {
		colour: "fire_emergency",
		title: "Site safety",
		lines: [],
		cells: 1,
		weight: .7
	}),
	Q("header-danger", "Headers", "DANGER header", {
		colour: "fire",
		title: "Danger",
		lines: [],
		cells: 1,
		weight: .7
	}),
	Q("header-warning", "Headers", "WARNING header", {
		colour: "warning",
		title: "Warning",
		lines: [],
		cells: 1,
		weight: .7
	}),
	Q("header-construction", "Headers", "CONSTRUCTION SITE header", {
		colour: "fire_emergency",
		title: "Construction site",
		lines: [],
		cells: 1,
		weight: .7
	}),
	Q("rules-hasawa", "Wording only", "Health and Safety at Work Act notice", {
		colour: qd,
		lines: ["Under the Health and Safety at Work Act 1974, all persons entering this site must comply with all regulations under this act. All visitors must report to the site office and obtain permission to proceed onto the site or any other work area. Safety signs and procedures must be observed and personal protection and safety equipment must be used at all times."],
		cells: 1,
		weight: 1.2,
		style: "footer",
		min: 3
	}),
	Q("rules-parents", "Wording only", "Construction work in progress (parents)", {
		colour: "warning",
		symbols: ["W001"],
		lines: ["Construction work in progress. Parents are advised to warn children of the dangers of entering this site"],
		cells: 1
	}),
	Q("rules-report", "Site rules", "All visitors report to site office", {
		colour: "mandatory",
		symbols: ["M001"],
		lines: ["All visitors and drivers must report to the site office"]
	}),
	Q("rules-accidents", "Site rules", "Report all accidents immediately", {
		colour: "mandatory",
		symbols: ["M001"],
		lines: ["Report all accidents immediately"]
	}),
	Q("rules-permission", "Site rules", "No entry without permission", {
		colour: "mandatory",
		symbols: ["M001"],
		lines: ["No entry to this site without permission"]
	}),
	Q("rules-obey", "Site rules", "Obey all safety signs", {
		colour: "mandatory",
		symbols: ["M001"],
		lines: ["Obey all safety signs and site rules"]
	}),
	Q("ppe-helmet", "PPE", "Safety helmets must be worn", {
		colour: "mandatory",
		symbols: ["M014"],
		lines: ["Safety helmets must be worn"]
	}),
	Q("ppe-hivis", "PPE", "High visibility jackets must be worn", {
		colour: "mandatory",
		symbols: ["M015"],
		lines: ["High visibility jackets must be worn"]
	}),
	Q("ppe-boots", "PPE", "Protective footwear must be worn", {
		colour: "mandatory",
		symbols: ["M008"],
		lines: ["Protective footwear must be worn"]
	}),
	Q("ppe-eyes", "PPE", "Eye protection must be worn", {
		colour: "mandatory",
		symbols: ["M004"],
		lines: ["Eye protection must be worn"]
	}),
	Q("ppe-ears", "PPE", "Ear protection must be worn", {
		colour: "mandatory",
		symbols: ["M003"],
		lines: ["Ear protection must be worn"]
	}),
	Q("ppe-gloves", "PPE", "Protective gloves must be worn", {
		colour: "mandatory",
		symbols: ["M009"],
		lines: ["Protective gloves must be worn"]
	}),
	Q("ppe-harness", "PPE", "Safety harness must be worn", {
		colour: "mandatory",
		symbols: ["M018"],
		lines: ["Safety harness must be worn"]
	}),
	Q("ppe-mask", "PPE", "Respiratory protection must be worn", {
		colour: "mandatory",
		symbols: ["M017"],
		lines: ["Respiratory protection must be worn"]
	}),
	Q("ppe-clothing", "PPE", "Protective clothing must be worn", {
		colour: "mandatory",
		symbols: ["M010"],
		lines: ["Protective clothing must be worn"]
	}),
	Q("warn-danger-work", "Warnings", "Dangerous work in operation", {
		colour: "warning",
		symbols: ["W001"],
		title: "Warning",
		lines: ["Dangerous work in operation"]
	}),
	Q("warn-excavations", "Warnings", "Danger — deep excavations", {
		colour: "warning",
		symbols: ["W001"],
		title: "Danger",
		lines: ["Deep excavations"]
	}),
	Q("warn-trucks", "Warnings", "Danger — beware of trucks", {
		colour: "warning",
		symbols: ["W014"],
		title: "Danger",
		lines: ["Beware of trucks"]
	}),
	Q("warn-overhead", "Warnings", "Warning — overhead loads", {
		colour: "warning",
		symbols: ["W015"],
		lines: ["Warning: overhead loads"]
	}),
	Q("warn-falling", "Warnings", "Warning — falling objects", {
		colour: "warning",
		symbols: ["W035"],
		lines: ["Warning: falling objects"]
	}),
	Q("warn-electricity", "Warnings", "Warning — electricity", {
		colour: "warning",
		symbols: ["W012"],
		lines: ["Warning: electricity"]
	}),
	Q("warn-drop", "Warnings", "Warning — drop (fall)", {
		colour: "warning",
		symbols: ["W008"],
		lines: ["Warning: risk of falling"]
	}),
	Q("warn-scaffold", "Warnings", "Warning — incomplete scaffolding", {
		colour: "warning",
		symbols: ["W001"],
		lines: ["Incomplete scaffolding must not be used"]
	}),
	Q("no-unauthorised", "Prohibitions", "No unauthorised access", {
		colour: "prohibition",
		symbols: ["P080"],
		lines: ["No unauthorised access"]
	}),
	Q("no-entry-strict", "Prohibitions", "Unauthorised entry strictly forbidden", {
		colour: "prohibition",
		symbols: ["P080"],
		lines: ["Unauthorised entry to this site is strictly forbidden"]
	}),
	Q("no-children", "Prohibitions", "Children must not play on this site", {
		colour: "prohibition",
		symbols: ["P036"],
		lines: ["Children must not play on this site"]
	}),
	Q("no-smoking", "Prohibitions", "No smoking", {
		colour: "prohibition",
		symbols: ["P002"],
		lines: ["No smoking on this site"]
	}),
	Q("no-flame", "Prohibitions", "No naked flames", {
		colour: "prohibition",
		symbols: ["P003"],
		lines: ["No naked flames"]
	}),
	Q("no-forklift", "Prohibitions", "No access for forklift trucks", {
		colour: "prohibition",
		symbols: ["P006"],
		lines: ["No access for forklift trucks"]
	}),
	Q("no-dogs", "Prohibitions", "No dogs", {
		colour: "prohibition",
		symbols: ["P021"],
		lines: ["No dogs on this site"]
	}),
	Q("text-contact", "Wording only", "Site contact details", {
		colour: qd,
		lines: ["Site manager: 00000 000000"],
		cells: 1,
		weight: .7
	}),
	Q("text-blank", "Wording only", "Blank row (your own wording)", {
		colour: qd,
		lines: ["Your text here"]
	})
], uf = (e) => lf.find((t) => t.id === e), df = () => {
	let e = [
		"Headers",
		"Site rules",
		"PPE",
		"Warnings",
		"Prohibitions",
		"Wording only"
	], t = [...e, ...lf.map((e) => e.group).filter((t) => !e.includes(t))];
	return [...new Set(t)].map((e) => ({
		group: e,
		presets: lf.filter((t) => t.group === e)
	})).filter((e) => e.presets.length);
}, ff = [
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
], pf = (e, t, n, r) => ({
	id: e,
	group: t,
	label: n,
	cells: 1,
	...r.weight === void 0 ? {} : { weight: r.weight },
	section: {
		symbols: r.symbols ?? [],
		colour: r.colour ?? null,
		panels: [{
			colour: r.colour ?? null,
			lines: [...r.title ? [{
				text: r.title,
				style: "title",
				caps: !1,
				bold: !0,
				align: r.align ?? "centre"
			}] : [], ...r.lines.map((e) => ({
				text: e,
				style: r.title ? "body" : "title",
				caps: !1,
				bold: !0,
				align: r.align ?? "centre"
			}))]
		}]
	},
	fireAction: {
		step: r.step ?? !1,
		writeOn: r.writeOn ?? !1
	}
}), mf = [
	pf("fa-header", "Header", "Fire action header", {
		symbols: ["M001"],
		colour: "mandatory",
		title: "Fire action",
		lines: ["If you discover or suspect a fire"],
		weight: 1.15
	}),
	pf("fa-header-plain", "Header", "Fire action (no strapline)", {
		symbols: ["M001"],
		colour: "mandatory",
		title: "Fire action",
		lines: [],
		weight: 1
	}),
	pf("fa-title", "Header", "Fire action (title only)", {
		colour: "mandatory",
		title: "Fire action",
		lines: [],
		weight: 1.5
	}),
	pf("fa-symbol", "Header", "Symbol on its own", {
		symbols: ["M001"],
		colour: null,
		lines: [],
		weight: 1.4
	}),
	pf("fa-alarm", "Raise the alarm", "Raise the alarm", {
		align: "left",
		symbols: ["F001"],
		colour: "fire",
		lines: ["Raise the alarm"],
		step: !0,
		weight: .9
	}),
	pf("fa-alarm-callpoint", "Raise the alarm", "Sound the alarm at the call point", {
		align: "left",
		symbols: ["F005"],
		colour: "fire",
		lines: ["Sound the alarm by operating the nearest fire alarm call point"],
		step: !0
	}),
	pf("fa-dial", "Raise the alarm", "Dial … to call the fire brigade", {
		align: "left",
		symbols: ["F006"],
		colour: "fire",
		lines: ["Call the fire brigade on"],
		writeOn: !0,
		step: !0
	}),
	pf("fa-leave", "Leave", "Leave by the nearest exit", {
		align: "left",
		symbols: ["E001"],
		colour: "fire_emergency",
		lines: ["Leave the building by the nearest available exit"],
		step: !0
	}),
	pf("fa-leave-short", "Leave", "Leave the building", {
		align: "left",
		symbols: ["E001"],
		colour: "fire_emergency",
		lines: ["Leave the building by the nearest exit"],
		step: !0,
		weight: .9
	}),
	pf("fa-assembly", "Assemble", "Report to the assembly point", {
		align: "left",
		symbols: ["E007"],
		colour: "fire_emergency",
		lines: ["Report to person in charge of Assembly Point at:"],
		writeOn: !0,
		step: !0,
		weight: 1.25
	}),
	pf("fa-assembly-short", "Assemble", "Report to assembly point", {
		align: "left",
		symbols: ["E007"],
		colour: "fire_emergency",
		lines: ["Report to assembly point"],
		writeOn: !0,
		step: !0
	}),
	pf("fa-no-belongings", "Do not", "Do not stop for belongings", {
		align: "left",
		symbols: ["P001"],
		colour: "prohibition",
		lines: ["Do not stop to collect personal belongings", "Do not take risks"],
		step: !0
	}),
	pf("fa-no-return", "Do not", "Do not return to the building", {
		align: "left",
		symbols: ["P004"],
		colour: "prohibition",
		lines: ["Do not return to the building until authorised to do so"]
	}),
	pf("fa-no-lifts", "Do not", "Do not use the lifts", {
		align: "left",
		symbols: ["P020"],
		colour: "prohibition",
		lines: ["Do not use the lifts"],
		weight: .9
	}),
	pf("fa-no-risks", "Do not", "Do not take any risks", {
		align: "left",
		symbols: ["P001"],
		colour: "prohibition",
		lines: ["Do not take any risks"],
		weight: .9
	})
], hf = [
	{
		id: "ncp1",
		label: "Four point",
		hint: "Alarm, leave, assemble, do not stop — the common one",
		size: [150, 200],
		rows: [
			"fa-header",
			"fa-alarm",
			"fa-leave",
			"fa-assembly",
			"fa-no-belongings"
		]
	},
	{
		id: "five-point",
		label: "Five point",
		hint: "Adds do-not-return and do-not-take-risks",
		size: [200, 300],
		rows: [
			"fa-header-plain",
			"fa-alarm",
			"fa-leave-short",
			"fa-assembly-short",
			"fa-no-return",
			"fa-no-risks"
		]
	},
	{
		id: "5pfan",
		label: "Five point, symbol on top",
		hint: "Mandatory circle, title, then five unnumbered steps",
		size: [200, 300],
		numbered: !1,
		rows: [
			"fa-symbol",
			"fa-title",
			"fa-alarm",
			"fa-leave-short",
			"fa-assembly-short",
			"fa-no-return",
			"fa-no-risks"
		]
	},
	{
		id: "with-dial",
		label: "With a phone number",
		hint: "A box to print or write the fire brigade number in",
		size: [150, 200],
		rows: [
			"fa-header",
			"fa-alarm-callpoint",
			"fa-dial",
			"fa-leave",
			"fa-assembly",
			"fa-no-belongings"
		]
	}
], gf = (e) => mf.find((t) => t.id === e), _f = () => {
	let e = [
		"Header",
		"Raise the alarm",
		"Leave",
		"Assemble",
		"Do not"
	], t = (e) => e.group, n = [...e, ...mf.map(t).filter((t) => !e.includes(t))];
	return [...new Set(n)].map((e) => ({
		group: e,
		presets: mf.filter((n) => t(n) === e)
	})).filter((e) => e.presets.length);
}, vf = () => [...new Set(mf.flatMap((e) => e.section.symbols))], yf = 4e3;
function bf(e, t, n) {
	let r = typeof n == "string" ? n : typeof location > "u" ? void 0 : location.href;
	if (e.includes("{name}")) {
		let n = new URL(e.replace("{name}", "rows"), r);
		return n.searchParams.set("kind", t), n;
	}
	return new URL(`rows-${t}.json`, new URL(e.endsWith("/") ? e : `${e}/`, r));
}
var xf = (e) => !!e && typeof e == "object" && !Array.isArray(e), Sf = (e) => typeof e == "string" ? e : "", Cf = (e, t) => typeof e == "number" && Number.isFinite(e) ? e : t;
function wf(e, t) {
	if (!xf(e)) return null;
	let n = Sf(e.id), r = Sf(e.label), i = Sf(e.group), a = xf(e.section) ? e.section : null;
	if (!n || !r || !i || !a) return null;
	let o = Array.isArray(a.symbols) ? a.symbols.filter((e) => typeof e == "string" && e !== "") : [], s = typeof a.colour == "string" && a.colour ? a.colour : null, c = (Array.isArray(a.panels) ? a.panels : []).map((e) => {
		let t = xf(e) ? e : {}, n = (Array.isArray(t.lines) ? t.lines : []).map((e) => {
			let t = xf(e) ? e : {}, n = Sf(t.text);
			if (!n) return null;
			let r = t.style === "title" || t.style === "footer" ? t.style : "body", i = t.align === "left" || t.align === "right" || t.align === "centre" ? t.align : void 0;
			return {
				text: n,
				style: r,
				caps: t.caps === !0,
				bold: t.bold !== !1,
				...typeof t.min == "number" && Number.isFinite(t.min) ? { min: t.min } : {},
				...i ? { align: i } : {}
			};
		}).filter((e) => e !== null);
		return {
			colour: typeof t.colour == "string" && t.colour ? t.colour : s,
			lines: n
		};
	});
	if (!c.some((e) => e.lines.length) && !o.length) return null;
	let l = {
		id: n,
		group: i,
		label: r,
		cells: e.cells === 2 ? 2 : 1,
		weight: Cf(e.weight, 1),
		section: {
			symbols: o,
			colour: s,
			panels: c.length ? c : [{
				colour: s,
				lines: []
			}]
		}
	};
	if (t === "fireaction") {
		let t = xf(e.fireAction) ? e.fireAction : {};
		l.fireAction = {
			step: t.step === !0,
			writeOn: t.writeOn === !0
		};
	}
	return l;
}
function Tf(e, t) {
	if (!xf(e)) return null;
	let n = Sf(e.id), r = Sf(e.label);
	if (!n || !r || !Array.isArray(e.rows)) return null;
	let i = e.rows.map((e) => {
		if (Array.isArray(e)) {
			let n = e.filter((e) => typeof e == "string" && t.has(e));
			return n.length === 2 ? n : n[0] ?? null;
		}
		return typeof e == "string" && t.has(e) ? e : null;
	}).filter((e) => e !== null);
	return i.length ? {
		id: n,
		label: r,
		hint: Sf(e.hint),
		rows: i
	} : null;
}
function Ef(e, t) {
	if (!xf(e)) return null;
	let n = Sf(e.id), r = Sf(e.label);
	if (!n || !r || !Array.isArray(e.rows)) return null;
	let i = e.rows.filter((e) => typeof e == "string" && t.has(e));
	if (!i.length) return null;
	let a = Array.isArray(e.size) ? e.size : [], o = Cf(a[0], 0), s = Cf(a[1], 0);
	return o <= 0 || s <= 0 ? null : {
		id: n,
		label: r,
		hint: Sf(e.hint),
		size: [o, s],
		rows: i,
		...e.numbered === !1 ? { numbered: !1 } : {}
	};
}
var Df = (e, t) => {
	e.splice(0, e.length, ...t);
};
function Of(e, t) {
	if (!xf(e)) return null;
	let n = e, r = Array.isArray(n.groups) ? n.groups : [], i = [];
	for (let e of r) if (xf(e) && Array.isArray(e.presets)) for (let n of e.presets) {
		let e = wf(n, t);
		e && i.push(e);
	}
	if (!i.length) return null;
	let a = new Set(i.map((e) => e.id)), o = Array.isArray(n.templates) ? n.templates : [];
	if (t === "fireaction") {
		let e = o.map((e) => Ef(e, a)).filter((e) => e !== null);
		return e.length ? (Df(mf, i), Df(hf, e), {
			rows: i.length,
			templates: e.length
		}) : null;
	}
	let s = o.map((e) => Tf(e, a)).filter((e) => e !== null);
	return Df(lf, i), s.length && Df(ff, s), {
		rows: i.length,
		templates: s.length
	};
}
async function kf(e, t, n) {
	try {
		let r = new AbortController(), i = setTimeout(() => r.abort(), yf);
		try {
			let i = await fetch(bf(e, t), {
				signal: r.signal,
				...n ? { credentials: n } : {}
			});
			return i.ok ? Of(await i.json(), t) : null;
		} finally {
			clearTimeout(i);
		}
	} catch {
		return null;
	}
}
//#endregion
//#region editor/src/engineSetup.ts
async function Af() {
	let e = await ll({
		family: "Nimbus Sans",
		fallback: "Nimbus Sans",
		fallbackUrls: Gl
	});
	return e.family === "sans-serif" ? ll({
		family: "Arimo",
		fallback: "Arimo",
		fallbackUrls: Kl
	}) : e;
}
async function jf(e) {
	let t = Ql(), [n] = await Promise.all([$l(), e && t ? kf(t, e, Rl()) : Promise.resolve(null)]), r = jl(n.categories).categories;
	return {
		data: n,
		ruleset: Fl(Pl, r),
		shaper: await Af()
	};
}
//#endregion
//#region editor/src/printShaper.ts
async function Mf(e) {
	let t = await Promise.all(Object.entries(e).map(async ([e, t]) => {
		let n = await fetch(t);
		if (!n.ok) throw Error(`${t}: HTTP ${n.status}`);
		return [e, await n.arrayBuffer()];
	}));
	return Object.fromEntries(t);
}
var Nf = null;
function Pf() {
	return Nf || (Nf = (async () => {
		let { createOpenTypeShaper: e } = await import("./opentypeShaper-RM5NMCu7.js");
		try {
			return await e(await Mf(Gl));
		} catch {
			return e(await Mf(Kl));
		}
	})(), Nf.catch(() => {
		Nf = null;
	})), Nf;
}
//#endregion
//#region data/approved.json
var Ff = [
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
], If = (e) => [...new Set(e.root.sections.flatMap((e) => e.symbol_frame?.symbols.map((e) => e.symbol_code) ?? []))];
function Lf(e, t) {
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
var Rf = Ff, zf = (e) => Rf.find((t) => t.product_id === e) ?? null;
function Bf(e = location.search) {
	let t = Number(new URLSearchParams(e).get("approved"));
	return Number.isInteger(t) && t > 0 ? t : null;
}
async function Vf(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of If(e.design)) {
		let e = await t(r);
		e && n.set(r, e);
	}
	return Tc(Lf(e.design, n));
}
//#endregion
//#region editor/src/model/photo.ts
var Hf = 1500, Uf = .85, Wf = (e) => /* @__PURE__ */ Error(/\.hei[cf]$/i.test(e) ? "iPhone HEIC photos can’t be read here. In Settings → Camera → Formats choose “Most Compatible”, or save the photo as JPEG first." : "That file couldn’t be read as a photo. JPEG or PNG works best.");
async function Gf(e) {
	if (e.size > 26214400) throw Error("That photo is very large. Please use one under 25 MB.");
	if (e.type && !e.type.startsWith("image/")) throw Wf(e.name);
	let t;
	try {
		t = await createImageBitmap(e, { imageOrientation: "from-image" });
	} catch {
		throw Wf(e.name);
	}
	let n = Math.min(1, Hf / Math.max(t.width, t.height)), r = Math.max(1, Math.round(t.width * n)), i = Math.max(1, Math.round(t.height * n)), a = document.createElement("canvas");
	a.width = r, a.height = i;
	let o = a.getContext("2d");
	if (!o) throw Wf(e.name);
	o.fillStyle = "#ffffff", o.fillRect(0, 0, r, i), o.drawImage(t, 0, 0, r, i), t.close();
	let s = a.toDataURL("image/jpeg", Uf);
	if (!s.startsWith("data:image/jpeg")) throw Wf(e.name);
	return {
		dataUrl: s,
		width: r,
		height: i,
		bytes: Math.round((s.length - 23) * .75)
	};
}
//#endregion
//#region editor/src/model/tidy.ts
var Kf = .05, qf = .9, Jf = 1.2, Yf = 1.15;
function Xf(e, t) {
	let { report: n } = nc(e, t), r = n.sections.map((e) => e.k ?? 1), i = n.sections.flatMap((e) => e.blocks.map((e) => e.letter_height));
	return {
		ok: !n.findings.some((e) => e.severity === "error"),
		k: r.length ? Math.min(...r) : 1,
		mm: i.length ? Math.max(...i) : 0,
		share: e.root.sections[0]?.symbol_share ?? 0,
		lines: n.sections.reduce((e, t) => e + t.blocks.reduce((e, t) => e + t.lines, 0), 0)
	};
}
var Zf = (e, t) => e.ok === t.ok ? Math.abs(e.k - t.k) > .001 ? e.k > t.k : e.lines === t.lines ? e.share > t.share : e.lines < t.lines : e.ok;
function Qf(e) {
	let t = [];
	for (let n of e.root.sections) for (let e of n.text_frame.panels) {
		let n = e.blocks.filter((e) => e.text.trim() !== "");
		n.length && n.length !== e.blocks.length && (e.blocks = n, t.push("empty lines removed"));
		for (let n of e.blocks) n.y_offset !== 0 && (n.y_offset = 0, t.push("nudges reset")), n.line_spacing !== hd.default && (n.line_spacing = hd.default, t.push("line spacing reset"));
	}
	return [...new Set(t)];
}
var $f = (e) => e.root.sections.some((e) => (e.symbol_frame?.symbols.length ?? 0) > 0);
function ep(e, t) {
	if (!$f(e)) return [e];
	let { MIN_SYMBOL_SHARE: n, MAX_SYMBOL_SHARE: r } = t.ratios, i = [];
	for (let t of ["vertical", "horizontal"]) for (let a = n; a <= r + .001; a += Kf) {
		let n = structuredClone(e);
		for (let e of n.root.sections) e.orientation = t, e.symbol_share = Math.round(a * 100) / 100;
		i.push(n);
	}
	return i;
}
var tp = (e, t) => e.map((e) => ({
	doc: e,
	score: Xf(e, t)
})).reduce((e, t) => Zf(t.score, e.score) ? t : e), np = (e) => "root" in e ? e.root.width * e.root.height : e.width * e.height;
function rp(e, t, n, r) {
	if (r.k >= qf) return null;
	let i = null;
	for (let a of t) {
		if (a.width === e.root.width && a.height === e.root.height) continue;
		let t = structuredClone(e);
		if (t.root.width = a.width, t.root.height = a.height, t.catalogue_size_id = a.size_id, np(a) > np(e) * Jf) continue;
		let o = tp(ep(t, n.ruleset), n).score;
		if (!o.ok || o.mm < r.mm * Yf) continue;
		let s = Math.round((o.mm - r.mm) * 10) / 10;
		(!i || s > i.gain) && (i = {
			size: a,
			gain: s
		});
	}
	return i;
}
function ip(e, t, n = []) {
	let r = Xf(e, t), i = structuredClone(e), a = Qf(i), o = tp(ep(i, t.ruleset), t), s = e.root.sections[0]?.orientation === "horizontal", c = o.doc.root.sections[0]?.orientation === "horizontal";
	$f(e) && s !== c && a.unshift(c ? "symbol moved beside the text" : "symbol moved above the text");
	let l = o.doc.root.sections[0]?.symbol_share ?? 0;
	return $f(e) && Math.abs(l - (e.root.sections[0]?.symbol_share ?? 0)) > .001 && a.push(`symbol size ${Math.round(l * 100)}%`), {
		doc: o.doc,
		outcome: {
			changed: a.length > 0 || JSON.stringify(o.doc.root) !== JSON.stringify(e.root),
			notes: a,
			before: Math.round(r.k * 100) / 100,
			after: Math.round(o.score.k * 100) / 100,
			suggestion: rp(o.doc, n, t, o.score)
		}
	};
}
//#endregion
//#region editor/src/model/translation.ts
var ap = [
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
], op = (e) => ap.find((t) => t.code === e)?.name ?? e ?? "", sp = "~t", cp = (e) => `${e}${sp}`;
function lp(e) {
	let t = e.root.sections.find((e) => e.translation), n = t && e.root.sections.find((e) => e.id === t.translation.of);
	return t && n ? {
		source: n,
		target: t,
		meta: t.translation
	} : null;
}
var up = (e) => lp(e) !== null, dp = (e) => e.root.sections.length === 1 && !up(e), fp = (e) => e.text_frame.panels.flatMap((e) => e.blocks);
function pp(e) {
	let t = e.root.layout;
	return t.type === "grid" && t.rows > 1 ? "stacked" : "side";
}
var mp = (e) => e.root.width >= e.root.height ? "side" : "stacked";
function hp(e, t) {
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
	}, _u(e);
}
function gp(e, t, n, r) {
	let i = new Map(t ? fp(t).map((e) => [e.id, e.text]) : []), { translation: a, lang: o, ...s } = e, c = structuredClone(s), l = (e) => {
		if (Array.isArray(e)) e.forEach(l);
		else if (e && typeof e == "object") {
			let t = e;
			typeof t.id == "string" && typeof t.role == "string" && (t.id = cp(t.id));
			for (let [e, n] of Object.entries(t)) e !== "source" && l(n);
		}
	};
	l(c);
	let u = /* @__PURE__ */ new Set();
	for (let e of fp(c)) e.text = i.get(e.id) ?? "", u.add(e.id);
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
function _p(e, t, n = mp(e)) {
	if (!dp(e)) return;
	let r = e.root.sections[0], i = {
		of: r.id,
		checked: !1,
		machine: !1,
		lines: {}
	};
	e.root.sections.push(gp(r, null, i, t)), hp(e, n);
}
function vp(e, t) {
	up(e) && hp(e, t);
}
function yp(e, t) {
	let n = lp(e);
	if (n && n.target.lang !== t) {
		n.target.lang = t, n.meta.lines = {}, n.meta.checked = !1, n.meta.machine = !1;
		for (let e of fp(n.target)) e.text = "";
	}
}
function bp(e) {
	let t = e.root.sections, n = t.findIndex((e) => e.translation);
	if (n < 0) return;
	let r = t[n], i = t.find((e) => e.id === r.translation.of);
	if (!i) {
		delete r.translation;
		return;
	}
	t[n] = gp(i, r, r.translation, r.lang ?? "en");
}
function xp(e) {
	let t = lp(e);
	if (!t) return [];
	let n = new Map(fp(t.target).map((e) => [e.id, e]));
	return fp(t.source).map((e) => {
		let r = cp(e.id), i = t.meta.lines[r];
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
function Sp(e, t = !1) {
	let n = lp(e);
	if (!n) return [];
	let r = [];
	for (let i of xp(e)) if (t || i.stale && !i.manual) {
		if (!i.source.trim()) {
			Cp(n, i.id, "", "", !1);
			continue;
		}
		r.push({
			id: i.id,
			text: i.source
		});
	}
	return r;
}
function Cp(e, t, n, r, i) {
	let a = fp(e.target).find((e) => e.id === t);
	a && (a.text !== n && (e.meta.checked = !1), a.text = n, e.meta.lines[t] = {
		from: r,
		manual: i
	});
}
function wp(e, t) {
	let n = lp(e);
	if (!n) return;
	let r = new Map(xp(e).map((e) => [e.id, e]));
	for (let e of t) r.get(e.id)?.source === e.from && (Cp(n, e.id, e.text, e.from, !1), n.meta.machine = !0);
}
function Tp(e, t, n) {
	let r = lp(e), i = xp(e).find((e) => e.id === t);
	r && i && Cp(r, t, n, i.source, !0);
}
function Ep(e, t) {
	let n = lp(e), r = xp(e).find((e) => e.id === t);
	n && r && (n.meta.lines[t] = {
		from: r.source,
		manual: !0
	});
}
function Dp(e, t) {
	let n = lp(e);
	n && (n.meta.checked = t);
}
function Op(e) {
	let t = lp(e);
	if (!t) return !0;
	let n = xp(e);
	return t.meta.checked && n.every((e) => !e.stale && (e.text.trim() !== "" || e.source.trim() === ""));
}
function kp(e, t) {
	let n = lp(e);
	n && (n.meta.lines[t] = {
		from: "",
		manual: !1
	});
}
function Ap(e) {
	let t = lp(e);
	if (!t) return !1;
	let n = e.root.sections;
	return n.indexOf(t.target) < n.indexOf(t.source);
}
function jp(e, t) {
	let n = lp(e);
	n && (e.root.sections = t ? [n.target, n.source] : [n.source, n.target]);
}
//#endregion
//#region editor/src/model/product.ts
var Mp = "", Np = {
	directional: ["ARL-L"],
	prohibition: ["P002"],
	warning: ["W001"],
	mandatory: ["M001"],
	fire_emergency: ["E001"],
	fire: ["F001"]
}, Pp = (e) => e.replace(/\b([a-z])/g, (e) => e.toUpperCase());
function Fp(e = location.search) {
	let t = Ll?.product;
	return t?.kind === "standard" ? "" : t?.kind || Mp || new URLSearchParams(e).get("product") || "";
}
function Ip(e, t, n) {
	let r = new URLSearchParams(e), i = Ll?.product, a = Fp(e), o = r.get("type") ?? "prohibition", s = a === "board", c = a === "roadsign", l = a === "fireaction", u = a === "bilingual", d = r.get("lang"), f = i?.category ?? (c ? "directional" : o), p = t.find((e) => e.key === f), m = p ? p.key : null, h = n.filter((e) => !m || e.category === m), g = (Np[m ?? "prohibition"] ?? []).find((e) => h.some((t) => t.code === e)), _ = u ? "Two-Language " : "";
	return {
		type: l ? "fireaction" : c ? "roadsign" : s ? "board" : p ? p.key : "combination",
		heading: i?.heading ? i.heading : l ? "Fire Action Notice" : c ? "Temporary Site Sign" : s ? "Site Safety Board" : p ? `Custom ${_}${Pp(p.title)} Sign` : u ? "Custom Two-Language Sign" : "Custom Combination Sign",
		category: m,
		defaultSymbol: i?.symbol ?? g ?? h[0]?.code ?? n[0]?.code ?? null,
		bilingual: u,
		language: ap.find((e) => e.code === (i?.language ?? d))?.code ?? ap[0].code,
		board: s,
		roadsign: c,
		fireaction: l
	};
}
//#endregion
//#region editor/src/model/signModel.ts
var Lp = (e) => e.symbol_position === "left" ? "horizontal" : "vertical";
function Rp(e, t, n, r, i) {
	let a = Bc({
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
		orientation: Lp(e),
		ruleset: i
	});
	return r || (Bp(a, "subtitle").text = ""), a;
}
var zp = Ld;
function Bp(e, t) {
	let n = zp(e).text_frame.panels[0].blocks;
	return t === "title" ? n[0] : n[1];
}
function Vp(e, t) {
	if (e.root.width = t.width, e.root.height = t.height, e.catalogue_size_id = t.size_id, pu(e)) _u(e);
	else for (let n of e.root.sections) n.orientation = Lp(t);
}
function Hp(e, t) {
	let n = zp(e).symbol_frame;
	if (!n) return;
	let r = n.symbols[0];
	n.symbols[0] = {
		...r,
		symbol_code: t.code,
		category: t.category,
		source: t.source
	};
}
var Up = (e) => zp(e).symbol_frame?.symbols[0]?.symbol_code;
function Wp(e, t, n) {
	Bp(e, t).text = n;
}
function Gp(e, t, n) {
	Bp(e, t).align = n;
}
var Kp = (e, t, n) => ud(Bp(e, t), n), qp = (e, t) => xd(Bp(e, t)), Jp = (e, t, n) => Sd(Bp(e, t), n);
//#endregion
//#region node_modules/dompurify/dist/purify.es.mjs
function Yp(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function Xp(e) {
	if (Array.isArray(e)) return e;
}
function Zp(e, t) {
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
function Qp() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function $p(e, t) {
	return Xp(e) || Zp(e, t) || em(e, t) || Qp();
}
function em(e, t) {
	if (e) {
		if (typeof e == "string") return Yp(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Yp(e, t) : void 0;
	}
}
var tm = Object.entries, nm = Object.setPrototypeOf, rm = Object.isFrozen, im = Object.getPrototypeOf, am = Object.getOwnPropertyDescriptor, om = Object.freeze, sm = Object.seal, cm = Object.create, lm = typeof Reflect < "u" && Reflect, um = lm.apply, dm = lm.construct;
om ||= function(e) {
	return e;
}, sm ||= function(e) {
	return e;
}, um ||= function(e, t) {
	var n = [...arguments].slice(2);
	return e.apply(t, n);
}, dm ||= function(e) {
	return new e(...[...arguments].slice(1));
};
var fm = Mm(Array.prototype.forEach), pm = Mm(Array.prototype.lastIndexOf), mm = Mm(Array.prototype.pop), hm = Mm(Array.prototype.push), gm = Mm(Array.prototype.splice), _m = Array.isArray, vm = Mm(String.prototype.toLowerCase), ym = Mm(String.prototype.toString), bm = Mm(String.prototype.match), xm = Mm(String.prototype.replace), Sm = Mm(String.prototype.indexOf), Cm = Mm(String.prototype.trim), wm = Mm(Number.prototype.toString), Tm = Mm(Boolean.prototype.toString), Em = typeof BigInt > "u" ? null : Mm(BigInt.prototype.toString), Dm = typeof Symbol > "u" ? null : Mm(Symbol.prototype.toString), Om = Mm(Object.prototype.hasOwnProperty), km = Mm(Object.prototype.toString), Am = Mm(RegExp.prototype.test), jm = Nm(TypeError);
function Mm(e) {
	return function(t) {
		t instanceof RegExp && (t.lastIndex = 0);
		var n = [...arguments].slice(1);
		return um(e, t, n);
	};
}
function Nm(e) {
	return function() {
		return dm(e, [...arguments]);
	};
}
function $(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : vm;
	if (nm && nm(e, null), !_m(t)) return e;
	let r = t.length;
	for (; r--;) {
		let i = t[r];
		if (typeof i == "string") {
			let e = n(i);
			e !== i && (rm(t) || (t[r] = e), i = e);
		}
		e[i] = !0;
	}
	return e;
}
function Pm(e) {
	for (let t = 0; t < e.length; t++) Om(e, t) || (e[t] = null);
	return e;
}
function Fm(e) {
	let t = cm(null);
	for (let r of tm(e)) {
		var n = $p(r, 2);
		let i = n[0], a = n[1];
		Om(e, i) && (t[i] = _m(a) ? Pm(a) : a && typeof a == "object" && a.constructor === Object ? Fm(a) : a);
	}
	return t;
}
function Im(e) {
	switch (typeof e) {
		case "string": return e;
		case "number": return wm(e);
		case "boolean": return Tm(e);
		case "bigint": return Em ? Em(e) : "0";
		case "symbol": return Dm ? Dm(e) : "Symbol()";
		case "undefined": return km(e);
		case "function":
		case "object": {
			if (e === null) return km(e);
			let t = e, n = Lm(t, "toString");
			if (typeof n == "function") {
				let e = n(t);
				return typeof e == "string" ? e : km(e);
			}
			return km(e);
		}
		default: return km(e);
	}
}
function Lm(e, t) {
	for (; e !== null;) {
		let n = am(e, t);
		if (n) {
			if (n.get) return Mm(n.get);
			if (typeof n.value == "function") return Mm(n.value);
		}
		e = im(e);
	}
	function n() {
		return null;
	}
	return n;
}
function Rm(e) {
	try {
		return Am(e, ""), !0;
	} catch {
		return !1;
	}
}
var zm = om(/* @__PURE__ */ "a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr".split(".")), Bm = om(/* @__PURE__ */ "svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern".split(".")), Vm = om([
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
]), Hm = om([
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
]), Um = om(/* @__PURE__ */ "math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts".split(".")), Wm = om([
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
]), Gm = om(["#text"]), Km = om(/* @__PURE__ */ "accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns".split(".")), qm = om(/* @__PURE__ */ "accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.pointer-events.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.vector-effect.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan".split(".")), Jm = om(/* @__PURE__ */ "accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns".split(".")), Ym = om([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]), Xm = sm(/{{[\w\W]*|^[\w\W]*}}/g), Zm = sm(/<%[\w\W]*|^[\w\W]*%>/g), Qm = sm(/\${[\w\W]*/g), $m = sm(/^data-[\-\w.\u00B7-\uFFFF]+$/), eh = sm(/^aria-[\-\w]+$/), th = sm(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), nh = sm(/^(?:\w+script|data):/i), rh = sm(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), ih = sm(/^html$/i), ah = sm(/^[a-z][.\w]*(-[.\w]+)+$/i), oh = sm(/<[/\w!]/g), sh = sm(/<[/\w]/g), ch = sm(/<\/no(script|embed|frames)/i), lh = sm(/\/>/i), uh = {
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
}, dh = [
	"style",
	"script",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext",
	"noscript"
], fh = om($({}, dh)), ph = function() {
	let e = {};
	return fm(dh, (t) => {
		e[t] = sm(RegExp("</" + t + "(?=[\\t\\n\\f\\r />])", "i"));
	}), om(e);
}(), mh = function() {
	return typeof window > "u" ? null : window;
}, hh = function(e, t) {
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
}, gh = function() {
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
}, _h = function(e, t, n, r) {
	return Om(e, t) && _m(e[t]) ? $(r.base ? Fm(r.base) : {}, e[t], r.transform) : n;
}, vh = function(e, t, n) {
	let r = Om(e, t) ? e[t] : void 0;
	return r && typeof r == "object" ? Fm(r) : n();
};
function yh() {
	let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : mh(), t = (e) => yh(e);
	if (t.version = "3.4.15", t.removed = [], !e || !e.document || e.document.nodeType !== uh.document || !e.Element) return t.isSupported = !1, t;
	let n = e.document, r = n, i = r.currentScript;
	e.DocumentFragment;
	let a = e.HTMLTemplateElement, o = e.Node, s = e.Element, c = e.NodeFilter;
	e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
	let l = e.DOMParser, u = e.trustedTypes, d = s.prototype, f = Lm(d, "cloneNode"), p = Lm(d, "remove"), m = Lm(d, "removeAttributeNode"), h = Lm(d, "nextSibling"), g = Lm(d, "childNodes"), _ = Lm(d, "parentNode"), v = Lm(d, "shadowRoot"), y = Lm(d, "attributes"), b = o && o.prototype ? Lm(o.prototype, "nodeType") : null, x = o && o.prototype ? Lm(o.prototype, "nodeName") : null, S = o && o.prototype ? Lm(o.prototype, "ownerDocument") : null, C = function(e) {
		return b ? b(e) : e.nodeType;
	}, w = function(e) {
		return x ? x(e) : e.nodeName;
	};
	if (typeof a == "function") {
		let e = n.createElement("template");
		e.content && e.content.ownerDocument && (n = e.content.ownerDocument);
	}
	let T, E = "", D, O = !1, ee = 0, te = function() {
		if (ee > 0) throw jm("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
	}, ne = function(e) {
		te(), ee++;
		try {
			return T.createHTML(e);
		} finally {
			ee--;
		}
	}, re = function(e) {
		te(), ee++;
		try {
			return T.createScriptURL(e);
		} finally {
			ee--;
		}
	}, ie = function() {
		return O ||= (D = hh(u, i), !0), D;
	}, k = n, ae = k.implementation, oe = k.createNodeIterator, A = k.createDocumentFragment, se = k.getElementsByTagName, ce = r.importNode, j = gh();
	t.isSupported = typeof tm == "function" && typeof _ == "function" && ae && ae.createHTMLDocument !== void 0;
	let le = Xm, ue = Zm, de = Qm, fe = $m, pe = eh, me = nh, he = rh, ge = ah, _e = th, M = null, ve = $({}, [
		...zm,
		...Bm,
		...Vm,
		...Um,
		...Gm
	]), N = null, ye = $({}, [
		...Km,
		...qm,
		...Jm,
		...Ym
	]), be = Object.seal(cm(null, {
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
	})), P = null, xe = null, Se = Object.seal(cm(null, {
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
	})), Ce = !0, we = !0, Te = !1, F = !0, Ee = !1, De = !0, Oe = !1, ke = !1, Ae = null, je = null, Me = !1, Ne = !1, Pe = !1, Fe = !1, Ie = !0, Le = !1, Re = "user-content-", ze = !0, Be = !1, Ve = {}, He = null, Ue = $({}, /* @__PURE__ */ "annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp".split(".")), We = null, Ge = $({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]), Ke = null, qe = $({}, [
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
	]), Je = "http://www.w3.org/1998/Math/MathML", Ye = "http://www.w3.org/2000/svg", Xe = "http://www.w3.org/1999/xhtml", Ze = Xe, Qe = !1, $e = null, et = $({}, [
		Je,
		Ye,
		Xe
	], ym), tt = om([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]), nt = $({}, tt), rt = om(["annotation-xml"]), it = $({}, rt), at = $({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]), ot = null, st = ["application/xhtml+xml", "text/html"], ct = null, lt = null, ut = n.createElement("form"), dt = function(e) {
		return e instanceof RegExp || e instanceof Function;
	}, ft = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (lt && lt === e) return;
		(!e || typeof e != "object") && (e = {}), e = Fm(e), ot = st.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? "text/html" : e.PARSER_MEDIA_TYPE, ct = ot === "application/xhtml+xml" ? ym : vm, M = _h(e, "ALLOWED_TAGS", ve, { transform: ct }), N = _h(e, "ALLOWED_ATTR", ye, { transform: ct }), $e = _h(e, "ALLOWED_NAMESPACES", et, { transform: ym }), Ke = _h(e, "ADD_URI_SAFE_ATTR", qe, {
			transform: ct,
			base: qe
		}), We = _h(e, "ADD_DATA_URI_TAGS", Ge, {
			transform: ct,
			base: Ge
		}), He = _h(e, "FORBID_CONTENTS", Ue, { transform: ct }), P = _h(e, "FORBID_TAGS", Fm({}), { transform: ct }), xe = _h(e, "FORBID_ATTR", Fm({}), { transform: ct }), Ve = Om(e, "USE_PROFILES") ? e.USE_PROFILES && typeof e.USE_PROFILES == "object" ? Fm(e.USE_PROFILES) : e.USE_PROFILES : !1, Ce = e.ALLOW_ARIA_ATTR !== !1, we = e.ALLOW_DATA_ATTR !== !1, Te = e.ALLOW_UNKNOWN_PROTOCOLS || !1, F = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Ee = e.SAFE_FOR_TEMPLATES || !1, De = e.SAFE_FOR_XML !== !1, Oe = e.WHOLE_DOCUMENT || !1, Ne = e.RETURN_DOM || !1, Pe = e.RETURN_DOM_FRAGMENT || !1, Fe = e.RETURN_TRUSTED_TYPE || !1, Me = e.FORCE_BODY || !1, Ie = e.SANITIZE_DOM !== !1, Le = e.SANITIZE_NAMED_PROPS || !1, ze = e.KEEP_CONTENT !== !1, Be = e.IN_PLACE || !1, _e = Rm(e.ALLOWED_URI_REGEXP) ? e.ALLOWED_URI_REGEXP : th, Ze = typeof e.NAMESPACE == "string" ? e.NAMESPACE : Xe, nt = vh(e, "MATHML_TEXT_INTEGRATION_POINTS", () => $({}, tt)), it = vh(e, "HTML_INTEGRATION_POINTS", () => $({}, rt));
		let t = vh(e, "CUSTOM_ELEMENT_HANDLING", () => cm(null));
		if (be = cm(null), Om(t, "tagNameCheck") && dt(t.tagNameCheck) && (be.tagNameCheck = t.tagNameCheck), Om(t, "attributeNameCheck") && dt(t.attributeNameCheck) && (be.attributeNameCheck = t.attributeNameCheck), Om(t, "allowCustomizedBuiltInElements") && typeof t.allowCustomizedBuiltInElements == "boolean" && (be.allowCustomizedBuiltInElements = t.allowCustomizedBuiltInElements), sm(be), Ee && (we = !1), Pe && (Ne = !0), Ve && (M = $({}, Gm), N = cm(null), Ve.html === !0 && ($(M, zm), $(N, Km)), Ve.svg === !0 && ($(M, Bm), $(N, qm), $(N, Ym)), Ve.svgFilters === !0 && ($(M, Vm), $(N, qm), $(N, Ym)), Ve.mathMl === !0 && ($(M, Um), $(N, Jm), $(N, Ym))), Se.tagCheck = null, Se.attributeCheck = null, Om(e, "ADD_TAGS") && (typeof e.ADD_TAGS == "function" ? Se.tagCheck = e.ADD_TAGS : _m(e.ADD_TAGS) && (M === ve && (M = Fm(M)), $(M, e.ADD_TAGS, ct))), Om(e, "ADD_ATTR") && (typeof e.ADD_ATTR == "function" ? Se.attributeCheck = e.ADD_ATTR : _m(e.ADD_ATTR) && (N === ye && (N = Fm(N)), $(N, e.ADD_ATTR, ct))), Om(e, "ADD_FORBID_CONTENTS") && _m(e.ADD_FORBID_CONTENTS) && (He === Ue && (He = Fm(He)), $(He, e.ADD_FORBID_CONTENTS, ct)), ze && (M["#text"] = !0), Oe && $(M, [
			"html",
			"head",
			"body"
		]), M.table && ($(M, ["tbody"]), delete P.tbody), e.TRUSTED_TYPES_POLICY) {
			if (typeof e.TRUSTED_TYPES_POLICY.createHTML != "function") throw jm("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw jm("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			let t = T;
			T = e.TRUSTED_TYPES_POLICY;
			try {
				E = ne("");
			} catch (e) {
				throw T = t, e;
			}
		} else e.TRUSTED_TYPES_POLICY === null ? (T = void 0, E = "") : (T === void 0 && (T = ie()), T && typeof E == "string" && (E = ne("")));
		om && om(e), lt = e;
	}, pt = $({}, [
		...Bm,
		...Vm,
		...Hm
	]), mt = $({}, [...Um, ...Wm]), ht = function(e, t, n) {
		return t.namespaceURI === Xe ? e === "svg" : t.namespaceURI === Je ? e === "svg" && (n === "annotation-xml" || nt[n]) : !!pt[e];
	}, gt = function(e, t, n) {
		return t.namespaceURI === Xe ? e === "math" : t.namespaceURI === Ye ? e === "math" && it[n] : !!mt[e];
	}, _t = function(e, t, n) {
		return t.namespaceURI === Ye && !it[n] || t.namespaceURI === Je && !nt[n] ? !1 : !mt[e] && (at[e] || !pt[e]);
	}, vt = function(e) {
		let t = _(e);
		(!t || !t.tagName) && (t = {
			namespaceURI: Ze,
			tagName: "template"
		});
		let n = vm(e.tagName), r = vm(t.tagName);
		return $e[e.namespaceURI] ? e.namespaceURI === Ye ? ht(n, t, r) : e.namespaceURI === Je ? gt(n, t, r) : e.namespaceURI === Xe ? _t(n, t, r) : !!(ot === "application/xhtml+xml" && $e[e.namespaceURI]) : !1;
	}, yt = function(e) {
		hm(t.removed, { element: e });
		try {
			_(e).removeChild(e);
		} catch {
			if (p(e), !_(e)) throw jm("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	}, bt = function(e, t, n) {
		try {
			m(e, t);
		} catch {
			try {
				e.removeAttribute(n);
			} catch {}
		}
	}, xt = function(e) {
		wt(e);
		let t = g(e);
		if (t) {
			let e = [];
			fm(t, (t) => {
				hm(e, t);
			}), fm(e, (e) => {
				try {
					p(e);
				} catch {}
			});
		}
		let n = y(e);
		if (n) for (let t = n.length - 1; t >= 0; --t) {
			let r = n[t], i = r && r.name;
			typeof i == "string" && bt(e, r, i);
		}
	}, St = function(e, n, r) {
		if (!r) try {
			r = n.getAttributeNode(e);
		} catch {
			r = null;
		}
		hm(t.removed, {
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
			if (Ne || Pe) try {
				yt(n);
			} catch {}
			else try {
				n.setAttribute(e, "");
			} catch {}
		}
	}, Ct = function(e) {
		let t = y(e);
		if (t) for (let n = t.length - 1; n >= 0; --n) {
			let r = t[n], i = r && r.name;
			typeof i != "string" || N[ct(i)] || bt(e, r, i);
		}
	}, wt = function(e) {
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop();
			C(e) === uh.element && Ct(e);
			let n = g(e);
			if (n) for (let e = n.length - 1; e >= 0; --e) t.push(n[e]);
		}
	}, Tt = function(e, t) {
		return De ? e === "patchsrc" || e === "for" && t !== "label" && t !== "output" : !1;
	}, Et = function(e) {
		if (!De) return;
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop(), n = C(e);
			if (n === uh.processingInstruction || n === uh.comment && Am(sh, e.data)) {
				try {
					p(e);
				} catch {}
				continue;
			}
			if (n === uh.element) {
				let t = e, n = ct(w(e));
				try {
					t.hasAttribute && t.hasAttribute("patchsrc") && t.removeAttribute("patchsrc"), t.hasAttribute && t.hasAttribute("for") && Tt("for", n) && t.removeAttribute("for");
				} catch {}
			}
			let r = g(e);
			if (r) for (let e = r.length - 1; e >= 0; --e) t.push(r[e]);
		}
	}, Dt = function(e) {
		let t = null, r = null;
		if (Me) e = "<remove></remove>" + e;
		else {
			let t = bm(e, /^[\r\n\t ]+/);
			r = t && t[0];
		}
		ot === "application/xhtml+xml" && Ze === Xe && (e = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + e + "</body></html>");
		let i = T ? ne(e) : e;
		if (Ze === Xe) try {
			t = new l().parseFromString(i, ot);
		} catch {}
		if (!t || !t.documentElement) {
			t = ae.createDocument(Ze, "template", null);
			try {
				t.documentElement.innerHTML = Qe ? E : i;
			} catch {}
		}
		let a = t.body || t.documentElement;
		return e && r && a.insertBefore(n.createTextNode(r), a.childNodes[0] || null), Ze === Xe ? se.call(t, Oe ? "html" : "body")[0] : Oe ? t.documentElement : a;
	}, Ot = function(e) {
		let t = S ? S(e) : e.ownerDocument;
		return oe.call(t || e, e, c.SHOW_ELEMENT | c.SHOW_COMMENT | c.SHOW_TEXT | c.SHOW_PROCESSING_INSTRUCTION | c.SHOW_CDATA_SECTION, null);
	}, kt = function(e) {
		return e = xm(e, le, " "), e = xm(e, ue, " "), e = xm(e, de, " "), e;
	}, At = function(e) {
		e.normalize();
		let t = S ? S(e) : e.ownerDocument, n = oe.call(t || e, e, c.SHOW_TEXT | c.SHOW_COMMENT | c.SHOW_CDATA_SECTION | c.SHOW_PROCESSING_INSTRUCTION, null), r = n.nextNode();
		for (; r;) r.data = kt(r.data), r = n.nextNode();
		let i = e.querySelectorAll?.call(e, "template");
		i && fm(i, (e) => {
			Mt(e.content) && At(e.content);
		});
	}, jt = function(e) {
		let t = x ? x(e) : null;
		return typeof t != "string" || ct(t) !== "form" ? !1 : typeof e.nodeName != "string" || typeof e.textContent != "string" || typeof e.removeChild != "function" || e.attributes !== y(e) || typeof e.removeAttribute != "function" || typeof e.removeAttributeNode != "function" || typeof e.getAttributeNode != "function" || typeof e.setAttribute != "function" || typeof e.namespaceURI != "string" || typeof e.insertBefore != "function" || typeof e.hasChildNodes != "function" || e.nodeType !== b(e) || e.childNodes !== g(e);
	}, Mt = function(e) {
		if (!b || typeof e != "object" || !e) return !1;
		try {
			return b(e) === uh.documentFragment;
		} catch {
			return !1;
		}
	}, Nt = function(e) {
		if (!b || typeof e != "object" || !e) return !1;
		try {
			return typeof b(e) == "number";
		} catch {
			return !1;
		}
	};
	function Pt(e, n, r) {
		e.length !== 0 && fm(e, (e) => {
			e.call(t, n, r, lt);
		});
	}
	let Ft = function(e, t) {
		return !!(De && e.hasChildNodes() && !Nt(e.firstElementChild) && Am(oh, e.textContent) && Am(oh, e.innerHTML) || De && e.namespaceURI === Xe && fh[t] && (Nt(e.firstElementChild) || typeof e.textContent == "string" && Am(ph[t], e.textContent)) || e.nodeType === uh.processingInstruction || De && e.nodeType === uh.comment && Am(sh, e.data));
	}, It = function(e, t) {
		return e instanceof RegExp ? Am(e, t) : e instanceof Function && !!e(t, ...[...arguments].slice(2));
	}, Lt = function(e, t, n) {
		if (!P[t] && Ht(t) && It(be.tagNameCheck, t)) return !1;
		if (ze && !He[t]) {
			let t = _(e), r = g(e);
			if (r && t) {
				let i = r.length;
				for (let a = i - 1; a >= 0; --a) {
					let i = e === n ? f(r[a], !0) : r[a];
					t.insertBefore(i, h(e));
				}
			}
		}
		return yt(e), !0;
	}, Rt = function(e, t, n, r) {
		return e.length === 0 ? t : t === n || t === r ? Fm(t) : t;
	}, zt = function(e, t) {
		return e === t || _(e) !== null ? !1 : (Be && wt(e), !0);
	}, Bt = function(e, n) {
		if (Pt(j.beforeSanitizeElements, e, null), zt(e, n)) return !0;
		if (jt(e)) return yt(e), !0;
		let r = ct(w(e));
		if (M = Rt(j.uponSanitizeElement, M, ve, Ae), Pt(j.uponSanitizeElement, e, {
			tagName: r,
			allowedTags: M
		}), zt(e, n)) return !0;
		if (Ft(e, r)) return yt(e), !0;
		if (P[r] || !(Se.tagCheck instanceof Function && Se.tagCheck(r)) && !M[r]) {
			let t = Lt(e, r, n);
			return t === !1 && Pt(j.afterSanitizeElements, e, null), t;
		}
		if (C(e) === uh.element && !vt(e) || (r === "noscript" || r === "noembed" || r === "noframes") && Am(ch, e.innerHTML)) return yt(e), !0;
		if (Ee && e.nodeType === uh.text) {
			let n = kt(e.textContent);
			e.textContent !== n && (hm(t.removed, { element: e.cloneNode() }), e.textContent = n);
		}
		return Pt(j.afterSanitizeElements, e, null), !1;
	}, Vt = function(e, t, r) {
		if (xe[t] || Tt(t, e) || Ie && (t === "id" || t === "name") && (r in n || r in ut)) return !1;
		let i = N[t] || Se.attributeCheck instanceof Function && Se.attributeCheck(t, e);
		return we && Am(fe, t) || Ce && Am(pe, t) ? !0 : i ? Ke[t] || Am(_e, xm(r, he, "")) || (t === "src" || t === "xlink:href" || t === "href") && e !== "script" && Sm(r, "data:") === 0 && We[e] || Te && !Am(me, xm(r, he, "")) ? !0 : !r : Ht(e) && It(be.tagNameCheck, e) && It(be.attributeNameCheck, t, e) || t === "is" && be.allowCustomizedBuiltInElements && It(be.tagNameCheck, r);
	}, I = $({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]), Ht = function(e) {
		return !I[vm(e)] && Am(ge, e);
	}, Ut = function(e, t, n, r) {
		if (T && typeof u == "object" && typeof u.getAttributeType == "function" && !n) switch (u.getAttributeType(e, t)) {
			case "TrustedHTML": return ne(r);
			case "TrustedScriptURL": return re(r);
		}
		return r;
	}, Wt = function(e, t, n, r) {
		try {
			return n ? e.setAttributeNS(n, t, r) : e.setAttribute(t, r), !jt(e) || (yt(e), !1);
		} catch {
			return St(t, e), !1;
		}
	}, Gt = function(e) {
		Pt(j.beforeSanitizeAttributes, e, null);
		let n = e.attributes;
		if (!n || jt(e)) return;
		N = Rt(j.uponSanitizeAttribute, N, ye, je);
		let r = {
			attrName: "",
			attrValue: "",
			keepAttr: !0,
			allowedAttributes: N,
			forceKeepAttr: void 0
		}, i = n.length, a = ct(e.nodeName);
		for (; i--;) {
			let o = n[i], s = o.name, c = o.namespaceURI, l = o.value, u = ct(s), d = l, f = s === "value" ? d : Cm(d), p = !1;
			if (r.attrName = u, r.attrValue = f, r.keepAttr = !0, r.forceKeepAttr = void 0, Pt(j.uponSanitizeAttribute, e, r), f = r.attrValue, Le && (u === "id" || u === "name") && Sm(f, Re) !== 0 && (St(s, e, o), f = Re + f, p = !0), De && Am(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, f)) {
				St(s, e, o);
				continue;
			}
			if (u === "attributename" && bm(f, "href")) {
				St(s, e, o);
				continue;
			}
			if (!r.forceKeepAttr) {
				if (!r.keepAttr) {
					St(s, e, o);
					continue;
				}
				if (!F && Am(lh, f)) {
					St(s, e, o);
					continue;
				}
				if (Ee && (f = kt(f)), !Vt(a, u, f)) {
					St(s, e, o);
					continue;
				}
				f = Ut(a, u, c, f), f !== d && Wt(e, s, c, f) && p && mm(t.removed);
			}
		}
		Pt(j.afterSanitizeAttributes, e, null);
	}, L = function(e) {
		let t = null, n = Ot(e);
		for (Pt(j.beforeSanitizeShadowDOM, e, null); t = n.nextNode();) if (Pt(j.uponSanitizeShadowNode, t, null), Bt(t, e), Gt(t), Mt(t.content) && L(t.content), C(t) === uh.element) {
			let e = v(t);
			Mt(e) && (Kt(e), L(e));
		}
		Pt(j.afterSanitizeShadowDOM, e, null);
	}, Kt = function(e) {
		let t = [{
			node: e,
			shadow: null
		}];
		for (; t.length > 0;) {
			let e = t.pop();
			if (e.shadow) {
				L(e.shadow);
				continue;
			}
			let n = e.node, r = C(n) === uh.element, i = g(n);
			if (i) for (let e = i.length - 1; e >= 0; --e) t.push({
				node: i[e],
				shadow: null
			});
			if (r) {
				let e = x ? x(n) : null;
				if (typeof e == "string" && ct(e) === "template") {
					let e = n.content;
					Mt(e) && t.push({
						node: e,
						shadow: null
					});
				}
			}
			if (r) {
				let e = v(n);
				Mt(e) && t.push({
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
		if (Qe = !e, Qe && (e = "<!-->"), typeof e != "string" && !Nt(e) && (e = Im(e), typeof e != "string")) throw jm("dirty is not a string, aborting");
		if (!t.isSupported) return e;
		ke ? (M = Ae, N = je) : ft(n), (j.uponSanitizeElement.length > 0 || j.uponSanitizeAttribute.length > 0) && (M = Fm(M)), j.uponSanitizeAttribute.length > 0 && (N = Fm(N)), t.removed = [];
		let c = Be && typeof e != "string" && Nt(e);
		if (c) {
			Et(e);
			let t = w(e);
			if (typeof t == "string") {
				let n = ct(t);
				if (!M[n] || P[n]) throw xt(e), jm("root node is forbidden and cannot be sanitized in-place");
			}
			if (jt(e)) throw xt(e), jm("root node is clobbered and cannot be sanitized in-place");
			try {
				Kt(e);
			} catch (t) {
				throw xt(e), t;
			}
		} else if (Nt(e)) i = Dt("<!---->"), a = i.ownerDocument.importNode(e, !0), a.nodeType === uh.element && a.nodeName === "BODY" || a.nodeName === "HTML" ? i = a : i.appendChild(a), Kt(i);
		else {
			if (!Ne && !Ee && !Oe && e.indexOf("<") === -1) return T && Fe ? ne(e) : e;
			if (i = Dt(e), !i) return Ne ? null : Fe ? E : "";
		}
		i && Me && yt(i.firstChild);
		let l = c ? e : i;
		try {
			let e = Ot(l);
			for (; o = e.nextNode();) Bt(o, l), Gt(o), Mt(o.content) && L(o.content);
		} catch (n) {
			throw c && (xt(e), fm(t.removed, (e) => {
				e.element && wt(e.element);
			})), n;
		}
		if (c) return fm(t.removed, (e) => {
			e.element && wt(e.element);
		}), Ee && At(e), e;
		if (Ne) {
			if (Ee && At(i), Pe) for (s = A.call(i.ownerDocument); i.firstChild;) s.appendChild(i.firstChild);
			else s = i;
			return (N.shadowroot || N.shadowrootmode) && (s = ce.call(r, s, !0)), s;
		}
		let u = Oe ? i.outerHTML : i.innerHTML;
		return Oe && M["!doctype"] && i.ownerDocument && i.ownerDocument.doctype && i.ownerDocument.doctype.name && Am(ih, i.ownerDocument.doctype.name) && (u = "<!DOCTYPE " + i.ownerDocument.doctype.name + ">\n" + u), Ee && (u = kt(u)), T && Fe ? ne(u) : u;
	}, t.setConfig = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		ft(e), ke = !0, Ae = M, je = N;
	}, t.clearConfig = function() {
		lt = null, ke = !1, Ae = null, je = null, T = D, E = "";
	}, t.isValidAttribute = function(e, t, n) {
		lt || ft({});
		let r = ct(e), i = ct(t);
		return Vt(r, i, n);
	}, t.addHook = function(e, t) {
		typeof t == "function" && Om(j, e) && hm(j[e], t);
	}, t.removeHook = function(e, t) {
		if (Om(j, e)) {
			if (t !== void 0) {
				let n = pm(j[e], t);
				return n === -1 ? void 0 : gm(j[e], n, 1)[0];
			}
			return mm(j[e]);
		}
	}, t.removeHooks = function(e) {
		Om(j, e) && (j[e] = []);
	}, t.removeAllHooks = function() {
		j = gh();
	}, t;
}
var bh = yh(), xh = (e) => bh.sanitize(e, {
	USE_PROFILES: {
		svg: !0,
		svgFilters: !0
	},
	ADD_TAGS: ["style"]
}), Sh = /* @__PURE__ */ new Map();
function Ch(e) {
	let t = Sh.get(e.url);
	return t || (t = fetch(e.url, { credentials: Rl() }).then((t) => {
		if (!t.ok) throw Error(`Symbol ${e.code}: HTTP ${t.status}`);
		return t.text();
	}).then((e) => tl(e, { purify: xh })), t.catch(() => Sh.delete(e.url)), Sh.set(e.url, t)), t;
}
function wh(e, t) {
	let n = t.trim().toLowerCase();
	return !n || e.name.toLowerCase().includes(n) || e.code.toLowerCase().includes(n);
}
//#endregion
//#region editor/src/model/board.ts
var Th = [
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
], Eh = (e) => e.root.layout.type === "board" ? e.root.layout : null;
function Dh(e) {
	let t = Eh(e);
	if (!t) return [];
	let n = Hd(t), r = Vd(t), i = 0;
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
function Oh(e, t) {
	for (let n of Dh(e)) if (t >= n.start && t < n.start + n.cells) return n.index;
	return -1;
}
var kh = "Choose a message";
function Ah(e) {
	let t = sf({
		symbols: [],
		colour: qd,
		panels: [{
			colour: qd,
			lines: [{
				text: kh,
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
var jh = (e) => e.root.sections.filter((e) => e.placeholder).length, Mh = (e, t) => e.root.sections.splice(t.start, t.cells);
function Nh(e, t) {
	t.rows = t.rows.slice(0, 8).map((e) => ({
		...e,
		cells: Math.max(1, Math.min(2, Math.floor(e.cells)))
	})), _u(e);
}
function Ph(e, t, n, r) {
	let i = sf(e.section, t, n);
	return [i, ...Array.from({ length: Math.max(0, r - 1) }, () => ru(i))];
}
function Fh(e, t, n, r, i) {
	let a = Eh(e);
	if (!a || a.rows.length >= 8) return null;
	let o = Dh(e), s = Math.max(0, Math.min(o.length, t + 1)), c = n?.cells ?? 2, l = n ? Ph(n, r, i, c) : Array.from({ length: c }, () => Ah(i)), u = s < o.length ? o[s].start : e.root.sections.length;
	return e.root.sections.splice(u, 0, ...l), a.rows.splice(s, 0, {
		cells: c,
		...n?.weight === void 0 ? {} : { weight: n.weight }
	}), Nh(e, a), s;
}
function Ih(e, t) {
	let n = Eh(e), r = Dh(e)[t];
	!n || !r || n.rows.length <= 1 || (Mh(e, r), n.rows.splice(t, 1), Nh(e, n));
}
function Lh(e, t) {
	let n = Eh(e), r = Dh(e)[t];
	if (!n || !r || n.rows.length >= 8) return null;
	let i = e.root.sections.slice(r.start, r.start + r.cells).map((e) => ru(e));
	return e.root.sections.splice(r.start + r.cells, 0, ...i), n.rows.splice(t + 1, 0, { ...n.rows[t] }), Nh(e, n), t + 1;
}
function Rh(e, t, n) {
	let r = Eh(e), i = Dh(e);
	if (!r || t === n || !i[t] || n < 0 || n >= i.length) return;
	let a = Mh(e, i[t]), [o] = r.rows.splice(t, 1);
	r.rows.splice(n, 0, o);
	let s = Dh(e)[n].start;
	e.root.sections.splice(s, 0, ...a), Nh(e, r);
}
function zh(e, t, n) {
	let r = Eh(e), i = Dh(e)[t];
	if (!r || !i) return;
	let a = Math.max(1, Math.min(2, Math.floor(n)));
	if (a !== i.cells) {
		if (a > i.cells) {
			let t = e.root.sections[i.start], n = Array.from({ length: a - i.cells }, () => ru(t));
			e.root.sections.splice(i.start + i.cells, 0, ...n);
		} else e.root.sections.splice(i.start + a, i.cells - a);
		r.rows[t] = {
			...r.rows[t],
			cells: a
		}, Nh(e, r);
	}
}
function Bh(e, t, n) {
	let r = Eh(e);
	if (!r || !r.rows[t]) return;
	let i = Math.max(.4, Math.min(3, n));
	r.rows[t] = {
		...r.rows[t],
		...i === 1 ? {} : { weight: i }
	}, i === 1 && delete r.rows[t].weight, _u(e);
}
function Vh(e, t, n) {
	let r = Eh(e);
	if (!r) return;
	let i = Math.max(1, Math.min(8, Math.round(t)));
	for (; r.rows.length > i;) Ih(e, r.rows.length - 1);
	for (; r.rows.length < i;) {
		let t = r.rows[r.rows.length - 1]?.cells ?? 1;
		e.root.sections.push(...Array.from({ length: t }, () => Ah(n))), r.rows.push({ cells: t });
	}
	Nh(e, r);
}
function Hh(e, t, n) {
	let r = Eh(e);
	if (!r) return;
	let i = Math.max(1, Math.min(2, Math.round(t)));
	for (let t = r.rows.length - 1; t >= 1; t--) {
		let a = Dh(e)[t];
		a.cells !== i && (i > a.cells ? e.root.sections.splice(a.start + a.cells, 0, ...Array.from({ length: i - a.cells }, () => Ah(n))) : e.root.sections.splice(a.start + i, a.cells - i), r.rows[t] = {
			...r.rows[t],
			cells: i
		});
	}
	Nh(e, r);
}
function Uh(e) {
	let t = Dh(e).slice(1);
	return t.length && t.every((e) => e.cells === 2) ? 2 : 1;
}
function Wh(e, t, n, r, i) {
	Eh(e) && e.root.sections[t] && (e.root.sections[t] = Ph(n, r, i, 1)[0], _u(e));
}
function Gh(e, t, n, r = 5, i = 1) {
	let a = uf("header-site-safety"), o = Bc({
		symbols: [],
		title: "",
		size: {
			width: e.width,
			height: e.height,
			catalogue_size_id: e.size_id
		},
		ruleset: n
	}), s = a ? Ph(a, t, n, 1) : [Ah(n)], c = [{
		cells: 1,
		...a?.weight === void 0 ? {} : { weight: a.weight }
	}];
	return o.root.sections = s, o.root.layout = {
		type: "board",
		rows: c,
		gutter: "auto",
		sync_rows: !0,
		align_symbols: !1
	}, e.size_id || delete o.catalogue_size_id, Vh(o, r, n), i > 1 && Hh(o, i, n), o;
}
function Kh(e, t, n) {
	let r = e.root.sections;
	t !== n && r[t] && r[n] && ([r[t], r[n]] = [r[n], r[t]]);
}
function qh(e, t, n, r) {
	let i = ((ff.find((e) => e.id === t) ?? null)?.rows ?? ["header-site-safety", "ppe-helmet"]).slice(0, 8), a = [], o = [];
	for (let e of i) {
		let t = (Array.isArray(e) ? e : [e]).map((e) => uf(e)).filter((e) => !!e);
		if (!t.length) continue;
		for (let e of t) a.push(...Ph(e, n, r, 1));
		let i = t[0].weight;
		o.push({
			cells: t.length,
			...i === void 0 ? {} : { weight: i }
		});
	}
	let s = Bc({
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
	}, e.size_id || delete s.catalogue_size_id, _u(s), s;
}
//#endregion
//#region editor/src/model/variants.ts
var Jh = {
	mm: 1,
	mmm: 1,
	cm: 10,
	m: 1e3,
	in: 25.4,
	inch: 25.4,
	ft: 304.8,
	feet: 304.8
}, Yh = /^#[0-9a-f]{6}$/i, Xh = (e) => {
	let t = (e ?? "").trim();
	return Yh.test(t) ? t : null;
}, Zh = (e) => Xh(e.face_hex), Qh = (e) => Xh(e.unprinted_hex) ?? Zh(e);
function $h(e) {
	let t = Jh[(e.size_units ?? "mm").toLowerCase()] ?? 0, n = Number(e.size_width) * t, r = Number(e.size_height) * t;
	return n > 0 && r > 0 ? {
		width: n,
		height: r
	} : null;
}
function eg(e) {
	if (!e) return [];
	let t = [];
	for (let [n, r] of Object.entries(e)) {
		let e = Object.entries(r ?? {});
		if (!e.length) continue;
		let i = e[0][1], a = $h(i);
		a && t.push({
			size_id: Number(i.size_id ?? n),
			name: i.size_name?.trim() || `${a.width}mm x ${a.height}mm`,
			width: a.width,
			height: a.height,
			symbol_position: Number(i.symbol_default_location) === 1 ? "left" : "above",
			materials: e.map(([e, t]) => ({
				material_id: Number(t.material_id ?? e),
				name: t.material_name?.trim() || `Material ${t.material_id ?? e}`,
				face_hex: Zh(t),
				unprinted_hex: Qh(t),
				row: t
			}))
		});
	}
	return t;
}
var tg = (e, t) => e?.materials.find((e) => e.material_id === t) ?? e?.materials[0], ng = [
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
], rg = "directional", ig = (e) => ng.find((t) => t.key === e) ?? ng[0], ag = [
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
], og = .04, sg = 1.5, cg = .84, lg = .42, ug = (e, t) => Math.max(6, Math.round(Math.min(e, t) * og)), dg = (e, t) => Math.round(ug(e, t) * sg), fg = (e) => {
	let t = e.root.substrate ?? e.root.background, n = t && "hex" in t ? t.hex : "";
	return ng.find((e) => e.face.hex === n) ?? ng[0];
};
function pg(e, t, n) {
	let { root: r } = e;
	t.material ? (r.substrate = { ...t.face }, delete r.background) : (delete r.substrate, r.background = { ...t.face });
	let i = ug(r.width, r.height);
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
		for (let n of e.symbol_frame?.symbols ?? []) hg(n, t);
	}
}
function mg(e, t) {
	let n = e.body.replace(/fill\s*:\s*#[0-9a-fA-F]{3,8}/g, `fill: ${t}`).replace(/fill="#[0-9a-fA-F]{3,8}"/g, `fill="${t}"`);
	return n === e.body ? e : {
		...e,
		body: n,
		hash: `${e.hash}-${t.slice(1)}`
	};
}
var hg = (e, t) => {
	e.source = mg(e.source, t.ink.hex);
};
function gg(e, t, n) {
	e.root.width = t.width, e.root.height = t.height, t.size_id > 0 ? e.catalogue_size_id = t.size_id : delete e.catalogue_size_id, pg(e, fg(e), n), _g(e, n);
}
function _g(e, t) {
	let n = dg(e.root.width, e.root.height);
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
function vg(e) {
	let t = iu(e, "title");
	return t.size.mode === "auto" && (t.size.scale = cg), t;
}
function yg(e, t, n, r) {
	let i = Bc({
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
	a.symbol_frame = null, a.orientation = "horizontal", a.symbol_share = lg;
	let o = a.text_frame.panels[0];
	return o.blocks = [vg(n)], pg(i, t, r), _g(i, r), i;
}
//#endregion
//#region editor/src/model/numerals.ts
var bg = 718, xg = {
	1: [556, "M238 489V0H378V709H285C263 625 190 582 68 582V489Z"],
	2: [556, "M512 125H211C230 163 252 184 356 259C479 349 515 402 515 499C515 636 420 724 272 724C125 724 39 637 39 487V462H174V485C174 564 211 610 275 610C337 610 375 567 375 496C375 417 351 388 193 276C73 194 36 132 30 0H512Z"],
	3: [556, "M217 317C271 317 274 317 299 310C346 297 376 256 376 204C376 141 332 97 271 97C205 97 169 135 165 208H29C30 66 122 -23 268 -23C419 -23 516 66 516 204C516 287 480 341 400 380C465 421 493 466 493 531C493 649 405 724 268 724C165 724 86 679 55 602C42 568 38 545 38 486H168C169 524 172 543 179 561C192 592 224 611 265 611C321 611 353 577 353 518C353 446 312 411 229 411H217Z"],
	4: [556, "M522 273H448V709H283L24 275V157H308V0H448V157H522ZM308 273H123L308 576Z"],
	5: [556, "M489 709H110L47 314H173C188 349 220 368 263 368C334 368 377 317 377 231C377 148 334 97 263 97C202 97 168 128 165 185H27C29 61 123 -23 261 -23C413 -23 517 81 517 234C517 380 427 479 296 479C249 479 214 467 173 436L196 584H489Z"],
	6: [556, "M507 548C500 594 491 617 473 643C436 694 371 724 294 724C206 724 134 685 91 614C49 545 32 466 32 337C32 215 47 139 83 82C124 16 198 -23 282 -23C423 -23 519 82 519 237C519 373 435 467 313 467C255 467 216 450 172 404L173 419C175 485 178 506 188 533C207 585 241 611 290 611C335 611 359 593 377 548ZM278 356C344 356 386 306 386 227C386 152 340 97 278 97C214 97 170 149 170 225C170 302 214 356 278 356Z"],
	7: [556, "M528 709H29V584H382C339 538 254 409 226 347C177 244 152 151 133 0H274C287 224 360 396 528 599Z"],
	8: [556, "M409 386C433 399 444 406 455 416C484 443 501 486 501 532C501 643 405 724 274 724C142 724 46 643 46 531C46 463 74 420 138 386C56 341 22 288 22 204C22 70 125 -23 274 -23C422 -23 525 70 525 204C525 288 491 341 409 386ZM275 611C337 611 380 573 380 518C380 464 336 425 275 425C212 425 169 463 169 519C169 573 212 611 275 611ZM273 330C342 330 385 284 385 210C385 142 341 97 273 97C205 97 162 142 162 212C162 284 205 330 273 330Z"],
	9: [556, "M38 165C41 56 133 -24 255 -24C346 -24 415 14 457 86C494 149 516 256 516 370C516 474 500 554 467 608C422 684 352 724 267 724C125 724 28 622 28 474C28 328 114 228 240 228C276 228 310 238 332 254C345 263 353 272 376 298C376 161 338 96 259 96C209 96 176 123 173 165ZM263 610C331 610 373 558 373 474C373 396 330 344 265 344C201 344 161 394 161 476C161 558 200 610 263 610Z"]
}, Sg = /* @__PURE__ */ new Map();
function Cg(e) {
	let t = xg[e];
	if (!t) return null;
	let n = Sg.get(e);
	if (!n) {
		let [r, i] = t;
		n = tl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r} ${bg}" width="${r}" height="${bg}"><g transform="translate(0 ${bg}) scale(1 -1)"><path d="${i}" fill="#FFFFFF"/></g></svg>`), Sg.set(e, n);
	}
	return n;
}
var wg = 0;
function Tg(e) {
	let t = Cg(e);
	return t ? {
		id: `step-${e}-${++wg}`,
		role: "symbol",
		symbol_code: `STEP${e}`,
		category: "plain",
		source: t
	} : null;
}
//#endregion
//#region editor/src/model/fireAction.ts
var Eg = {
	hex: "#FFFFFF",
	cmyk: [
		0,
		0,
		0,
		0
	]
}, Dg = {
	hex: "#000000",
	cmyk: [
		0,
		0,
		0,
		100
	]
}, Og = .13, kg = .2, Ag = .83, jg = .35;
function Mg(e) {
	let t = 0;
	for (let n of e.root.sections) {
		let e = n.text_frame.panels[0];
		if (!e) continue;
		if (n.step !== !0) {
			delete e.lead;
			continue;
		}
		t += 1;
		let r = Tg(String(t));
		if (!r) {
			delete e.lead;
			continue;
		}
		e.lead = {
			symbol: r,
			share: Og
		};
	}
}
function Ng(e) {
	let t = 0;
	return e.root.sections.map((e) => e.step === !0 ? ++t : null);
}
function Pg(e, t) {
	let n = e.root.sections[t];
	n && (n.step = n.step !== !0, Mg(e));
}
function Fg(e, t, n) {
	let [r] = Ph(e, t, n, 1), i = r;
	if (i.step = e.fireAction?.step ?? !1, !Ig(e)) return i.text_frame.panels = [], i.symbol_share = 1, i.orientation = "vertical", i.symbol_frame && delete i.symbol_frame.tile, {
		section: i,
		spec: {
			cells: 1,
			weight: Lg(e)
		}
	};
	if (i.symbol_frame && (i.symbol_frame.tile = { inset: 0 }), i.symbol_share = kg, i.orientation = "horizontal", e.fireAction?.writeOn) {
		let e = i.text_frame.panels[0];
		e && e.blocks.push({
			id: `${e.id}-box`,
			role: "text_block",
			text: "",
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
			placement: "pin-bottom",
			y_offset: 0,
			fill: Eg,
			colour: Dg,
			stretch: !0
		});
	}
	return {
		section: i,
		spec: {
			cells: 1,
			weight: Lg(e)
		}
	};
}
var Ig = (e) => e.section.panels.some((e) => e.lines.some((e) => e.text.trim() !== "")), Lg = (e) => e.section.symbols.length && Ig(e) ? 1 : e.weight ?? 1;
function Rg(e, t, n, r) {
	let i = hf.find((e) => e.id === t) ?? hf[0] ?? null, a = i?.rows ?? [
		"fa-header",
		"fa-alarm",
		"fa-leave",
		"fa-assembly",
		"fa-no-belongings"
	], o = [], s = [];
	for (let e of a) {
		let t = gf(e);
		if (!t) continue;
		let { section: i, spec: a } = Fg(t, n, r);
		o.push(i), s.push(a);
	}
	let c = Bc({
		symbols: [],
		title: "",
		size: {
			width: e.width,
			height: e.height,
			catalogue_size_id: e.size_id
		},
		ruleset: r
	});
	if (c.root.sections = o, c.root.layout = {
		type: "board",
		rows: s,
		gutter: "auto",
		sync_rows: !1,
		align_symbols: !0
	}, e.size_id || delete c.catalogue_size_id, i?.numbered === !1) for (let e of c.root.sections) e.step = !1;
	return zg(c), Mg(c), c;
}
function zg(e) {
	let t = .03333 * Math.min(e.root.width, e.root.height), [n, r] = [t * Ag, t * jg];
	for (let i of e.root.sections) {
		i.spacing = t;
		for (let e of i.text_frame.panels) e.padding = [
			r,
			n,
			r,
			n
		];
	}
	let i = e.root.corners?.radius, a = typeof i == "number" ? Math.min(i, Bg(e)) : t;
	e.root.corners = {
		rounded: e.root.corners?.rounded ?? !0,
		radius: a
	};
}
var Bg = (e) => .03333 * Math.min(e.root.width, e.root.height), Vg = (e) => {
	let t = e.root.corners?.radius;
	return typeof t == "number" ? t : Bg(e);
};
function Hg(e, t) {
	let n = Math.max(0, Math.min(Bg(e), t));
	e.root.corners = {
		rounded: n > 0,
		radius: n
	};
}
var Ug = (e) => e.fill !== void 0, Wg = (e) => e.blocks.some(Ug);
function Gg(e) {
	e.blocks.push({
		id: `${e.id}-box-${Date.now().toString(36)}`,
		role: "text_block",
		text: "",
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
		placement: "pin-bottom",
		y_offset: 0,
		fill: Eg,
		colour: Dg,
		stretch: !0
	});
}
function Kg(e, t, n, r, i) {
	let a = e.root.layout;
	if (a.type !== "board" || !e.root.sections[t]) return;
	let o = Oh(e, t), { section: s, spec: c } = Fg(n, r, i);
	e.root.sections[t] = s, o >= 0 && a.rows[o] && (a.rows[o] = c), zg(e), Mg(e);
}
function qg(e, t, n) {
	let r = e.root.layout;
	if (r.type !== "board" || r.rows.length >= 8) return null;
	let i = Dh(e), a = Math.max(0, Math.min(i.length, t + 1)), o = a < i.length ? i[a].start : e.root.sections.length;
	return e.root.sections.splice(o, 0, Ah(n)), r.rows.splice(a, 0, {
		cells: 1,
		weight: 1
	}), zg(e), Mg(e), a;
}
function Jg(e, t) {
	let n = e.root.sections.map(() => ({
		cells: 1,
		weight: 1
	}));
	e.root.layout = {
		type: "board",
		rows: n,
		gutter: "auto",
		sync_rows: !1,
		align_symbols: !0
	}, e.root.sections.forEach((e, n) => {
		let r = t[n], i = e.text_frame.panels.some((e) => e.blocks.some((e) => e.text.trim() !== ""));
		e.step = r?.step === !0, e.symbol_frame && !i ? (e.text_frame.panels = [], e.symbol_share = 1, e.orientation = "vertical", delete e.symbol_frame.tile) : e.symbol_frame && (e.symbol_frame.tile = { inset: 0 }, e.symbol_share = kg, e.orientation = "horizontal");
		let a = e.text_frame.panels[0];
		r?.write_on && a && !Wg(a) && Gg(a);
	}), zg(e), Mg(e);
}
function Yg(e, t, n, r, i = null) {
	let a = e.root.layout;
	if (a.type !== "board") return;
	let { section: o, spec: s } = Fg(t, n, r), c = i === null ? e.root.sections.length : Math.max(0, Math.min(i, e.root.sections.length));
	e.root.sections.splice(c, 0, o), a.rows.splice(c, 0, s), zg(e), Mg(e);
}
//#endregion
//#region editor/src/model/rowThumb.ts
var Xg = (e, t, n) => `${e.id}|${t.width.toFixed(1)}x${t.height.toFixed(1)}|${n ? "n" : "b"}`, Zg = /* @__PURE__ */ new Map(), Qg = () => {
	Zg.clear();
};
function $g(e, t, n, r) {
	let i = Xg(e, t, n), a = Zg.get(i);
	if (a !== void 0) return a;
	let o = "";
	try {
		o = e_(e, t, n, r);
	} catch {
		o = "";
	}
	return Zg.set(i, o), o;
}
function e_(e, t, n, r) {
	let { ruleset: i, shaper: a, symbols: o } = r, s = e.section, c = Bc({
		symbols: [],
		title: "",
		size: {
			width: t.width,
			height: t.height
		},
		ruleset: i
	}), l = sf(s, o, i);
	if (n) {
		l.step = e.fireAction?.step ?? !1, l.symbol_frame && (l.symbol_frame.tile = { inset: 0 }), l.symbol_share = kg, l.orientation = "horizontal", s.panels.some((e) => e.lines.length) || (l.text_frame.panels = [], l.symbol_share = 1, l.orientation = "vertical", l.symbol_frame && delete l.symbol_frame.tile);
		let t = l.text_frame.panels[0];
		e.fireAction?.writeOn && t && Gg(t);
	}
	return c.root.sections = [l], c.root.layout = {
		type: "board",
		rows: [{
			cells: 1,
			weight: 1
		}],
		gutter: "auto",
		sync_rows: !1,
		align_symbols: !0
	}, n ? (zg(c), Mg(c)) : _u(c), Fc(c, {
		shaper: a,
		ruleset: i
	}, {
		guides: !1,
		text: "live"
	}).svg ?? "";
}
var t_ = (e) => [...new Set(e.flatMap((e) => e.section.symbols))];
//#endregion
//#region editor/src/model/translator.ts
function n_(e) {
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
var r_ = (e, t, n) => Promise.race([e, new Promise((e, r) => setTimeout(() => r(Error(n)), t))]);
function i_() {
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
			let i = n(r), a = await r_(i, 2e4, "Your browser is still getting this language ready. Press “Translate all again” to carry on, or type the translation.").catch((e) => {
				throw t.get(r) === i && t.delete(r), e instanceof DOMException && e.name === "NotAllowedError" ? Error("Press “Translate all again” to download this language in your browser, or type the translation.") : e instanceof DOMException && e.name === "NotSupportedError" ? Error("This browser can’t translate to that language. Please type the translation.") : e;
			});
			return Promise.all(e.map((e) => Promise.all(e.split("\n").map((e) => e.trim() ? a.translate(e) : Promise.resolve(e))).then((e) => e.join("\n"))));
		}
	};
}
function a_(e = location.search) {
	if (Ll) return Ll.translateUrl ? n_(Ll.translateUrl) : null;
	let t = new URLSearchParams(e).get("translate") ?? "https://www.safetysignsandnotices.co.uk/index.php?route=bespoke/api/translate";
	return t && t !== "off" ? n_(t) : t === "off" ? null : i_();
}
//#endregion
//#region editor/src/model/wizard.ts
var o_ = [
	"above",
	"below",
	"left",
	"right"
], s_ = "[,:;.!\\u2013\\u2014-]", c_ = RegExp(`^(?:(danger|warning|caution)\\s*${s_}*\\s+|(notice|important)\\s*${s_}+\\s*)(.+)$`, "i");
function l_(e) {
	let t = c_.exec(e.title.trim());
	if (!t) return e;
	let n = t[1] ?? t[2], r = t[3].trim(), i = r === r.toUpperCase() ? r : r.charAt(0).toUpperCase() + r.slice(1);
	return {
		...e,
		title: n,
		lines: [i, ...e.lines]
	};
}
function u_(e = location.search) {
	if (Ll) return Ll.suggestUrl ?? null;
	let t = new URLSearchParams(e).get("suggest") ?? "https://www.safetysignsandnotices.co.uk/index.php?route=bespoke/api/suggest";
	return t && t !== "off" ? t : null;
}
function d_(e = location.search) {
	if (Ll) return Ll.photoUrl ?? null;
	let t = new URLSearchParams(e).get("photo") ?? "https://www.safetysignsandnotices.co.uk/index.php?route=bespoke/api/photo";
	return t && t !== "off" ? t : null;
}
var f_ = (e = location.search) => (new URLSearchParams(e).get("describe") ?? "").trim().slice(0, 300), p_ = 4, m_ = (e) => Array.isArray(e) && e.every((e) => typeof e == "string");
function h_(e) {
	let t = e;
	return !t || typeof t != "object" || !m_(t.symbols) || typeof t.title != "string" || !m_(t.lines) || !t.symbols.length && !t.title.trim() ? null : {
		symbols: t.symbols.slice(0, 4),
		colour: typeof t.colour == "string" ? t.colour : null,
		background: t.background === "colour" ? "colour" : "white",
		symbol_position: o_.includes(t.symbol_position) ? t.symbol_position : null,
		title: t.title.slice(0, 120),
		lines: t.lines.slice(0, 4).map((e) => e.slice(0, 160)),
		size_id: typeof t.size_id == "number" ? t.size_id : null,
		alternatives: m_(t.alternatives) ? t.alternatives.slice(0, 6) : [],
		note: typeof t.note == "string" ? t.note.slice(0, 300) : "",
		sections: g_(e.sections)
	};
}
function g_(e) {
	if (!Array.isArray(e)) return [];
	let t = e.slice(0, p_).map((e) => {
		let t = e;
		if (!t || typeof t != "object") return null;
		let n = m_(t.symbols) ? t.symbols.slice(0, 2) : [], r = typeof t.title == "string" ? t.title.slice(0, 120) : "", i = m_(t.lines) ? t.lines.slice(0, 3).map((e) => e.slice(0, 160)) : [];
		return !n.length && !r.trim() && !i.length ? null : {
			symbols: n,
			colour: typeof t.colour == "string" ? t.colour : null,
			title: r,
			lines: i
		};
	}).filter((e) => e !== null);
	return t.length > 1 ? t : [];
}
async function __(e, t) {
	let n = await fetch(e, {
		method: "POST",
		credentials: "omit",
		headers: { "Content-Type": "text/plain" },
		body: JSON.stringify(t)
	}), r = await n.json().catch(() => null);
	if (!n.ok) throw Error(r?.error ?? `Suggestion failed (HTTP ${n.status})`);
	return r;
}
var v_ = () => /* @__PURE__ */ Error("The suggestion service returned something unexpected");
async function y_(e, t, n) {
	let r = h_(await __(e, {
		description: t,
		...b_(n)
	}));
	if (!r) throw v_();
	return r;
}
var b_ = (e) => e?.length ? { size_ids: e } : {};
async function x_(e, t, n) {
	let r = h_(await __(e, {
		image: t,
		...b_(n)
	}));
	if (!r) throw v_();
	return r;
}
async function S_(e, t, n, r) {
	let i = await __(e, {
		description: t,
		count: n,
		...b_(r)
	}), a = (Array.isArray(i?.designs) ? i.designs : [i]).map(h_).filter((e) => e !== null);
	if (!a.length) throw v_();
	return a;
}
var C_ = (e) => {
	let t = atob(e.replace(/-/g, "+").replace(/_/g, "/"));
	return new TextDecoder().decode(Uint8Array.from(t, (e) => e.charCodeAt(0)));
};
function w_(e = location.search) {
	let t = new URLSearchParams(e).get("design");
	if (!t || t.length > 4e3) return null;
	try {
		let e = JSON.parse(C_(t)), n = h_(e);
		return n ? {
			...n,
			description: typeof e.description == "string" ? e.description.slice(0, 300) : ""
		} : null;
	} catch {
		return null;
	}
}
function T_(e, t, n, r, i) {
	if (t = l_(t), t.sections.length > 1) {
		let e = new Map(n.map((e) => [e.code, e]));
		return {
			doc: cf({
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
		let e = cf({
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
			basic: Rd(e)
		};
	}
	let s = Rp(r, a, t.title, t.lines[0] ?? "", i), c = Ld(s);
	for (let e of o) zu(s, c.id, e);
	let l = c.text_frame.panels[0];
	for (let e of t.lines.slice(1)) l.blocks.push(iu(e, "body"));
	t.symbol_position && bu(s, t.symbol_position), t.background === "colour" && jd(s, "colour", i.categories);
	let u = lp(e);
	return u && (_p(s, u.target.lang ?? "pl", pp(e)), jp(s, Ap(e))), {
		doc: s,
		basic: Rd(s)
	};
}
//#endregion
//#region editor/src/useEditor.ts
function E_(e) {
	if (Array.isArray(e)) return e.map(E_);
	if (e && typeof e == "object") {
		let t = {};
		for (let [n, r] of Object.entries(e)) t[n] = n === "source" ? r : E_(r);
		return t;
	}
	return e;
}
var D_ = /* @__PURE__ */ new Set(["W_EMPTY_TEXT"]), O_ = 60, k_ = 400, A_ = 500, j_ = (e) => e.filter((e) => e.width >= k_ && e.height >= A_).sort((e, t) => e.width * e.height - t.width * t.height)[0] ?? e[0] ?? {
	size_id: 0,
	name: "450mm x 600mm",
	width: 450,
	height: 600,
	symbol_position: "left"
}, M_ = 1500, N_ = 700;
function P_() {
	let e = /* @__PURE__ */ Pt({
		status: "loading",
		error: "",
		symbolBusy: "",
		symbolError: "",
		translating: !1,
		translateError: "",
		suggesting: !1,
		suggestError: "",
		choosing: !1,
		chosen: -1,
		saving: !1,
		saveError: "",
		reviewStatus: Ll?.review?.status ?? "",
		savedAt: ""
	}), t = Ll?.open ?? null, n = Ll?.review ?? null, r = u_(), i = d_(), a = /* @__PURE__ */ Kt(null), o = /* @__PURE__ */ Kt(null), s = /* @__PURE__ */ L(f_()), c = /* @__PURE__ */ Kt([]), l = !1, u = a_(), d = /* @__PURE__ */ Kt([]), f, p = 0, m = 0, h = null, g = null, _ = null, v = /* @__PURE__ */ Kt(null), y = /* @__PURE__ */ Kt(null), b = /* @__PURE__ */ Kt(""), x = /* @__PURE__ */ Kt(null), S = /* @__PURE__ */ Kt([]), C = /* @__PURE__ */ Kt(null), w = /* @__PURE__ */ L(0), T = /* @__PURE__ */ L(new URLSearchParams(location.search).get("mode") === "advanced" ? "advanced" : "basic"), E = /* @__PURE__ */ Pt({
		section: 0,
		panel: 0
	}), D = /* @__PURE__ */ L(null), O = [], ee = [], te = /* @__PURE__ */ Pt({
		canUndo: !1,
		canRedo: !1
	}), ne = "", re = 0, ie = [];
	function k() {
		if (!y.value || !_ || !g) return;
		let e = Fc(y.value, {
			shaper: _,
			ruleset: g
		}, {
			guides: !1,
			text: "live",
			dimensions: !0,
			unprinted: $e.value
		});
		b.value = e.svg ?? "", x.value = e.report, S.value = e.findings.filter((e) => !D_.has(e.code)), C.value = E_(y.value), w.value++;
		for (let e of ie) e();
	}
	function ae() {
		let e = y.value?.root.sections ?? [];
		E.section = Math.max(0, Math.min(E.section, e.length - 1));
		let t = e[E.section]?.text_frame.panels.length ?? 1;
		E.panel = Math.max(0, Math.min(E.panel, t - 1));
	}
	function oe() {
		te.canUndo = O.length > 0, te.canRedo = ee.length > 0;
	}
	function A(e, t = "") {
		if (!y.value || !g) return;
		let n = Date.now();
		(!t || t !== ne || n - re > M_) && (O.push(JSON.stringify(y.value)), O.length > O_ && O.shift(), ee.length = 0), ne = t, re = n, e(y.value, g), v.value?.fireaction && (zg(y.value), Mg(y.value)), Qg(), bp(y.value), ae(), oe(), k(), se();
	}
	function se(e = N_, t = !1) {
		clearTimeout(f), y.value && up(y.value) && (f = setTimeout(() => void ce(t), e));
	}
	async function ce(t) {
		let n = y.value;
		if (!n) return;
		let r = lp(n)?.target.lang, i = Sp(n, t);
		if (!r || !i.length) {
			k();
			return;
		}
		if (!u) {
			e.translateError = "Automatic translation isn’t available here. Please type the translation.", k();
			return;
		}
		let a = ++m;
		p++, e.translating = !0, d.value = i.map((e) => e.id), e.translateError = "";
		try {
			let e = await u.translate(i.map((e) => e.text), r);
			if (y.value !== n || lp(n)?.target.lang !== r) return;
			wp(n, i.map((t, n) => ({
				id: t.id,
				from: t.text,
				text: e[n]
			}))), bp(n), k();
		} catch (t) {
			a === m && (e.translateError = t instanceof Error ? t.message : String(t));
		} finally {
			e.translating = --p > 0, a === m && (d.value = []);
		}
	}
	function j(e, t) {
		let n = e.pop();
		n && y.value && (t.push(JSON.stringify(y.value)), y.value = JSON.parse(n), ne = "", T.value === "basic" && (Rd(y.value) ? zd(y.value) : T.value = "advanced"), ae(), oe(), k(), se());
	}
	async function le() {
		try {
			let i = Fp(location.search);
			({data: h, ruleset: g, shaper: _} = await jf(i === "fireaction" || i === "board" ? i : void 0)), Pf().catch(() => void 0), v.value = Ip(location.search, g.categories, h.symbols);
			let a = Bf() === null ? null : zf(Bf());
			if (a) {
				v.value = {
					...v.value,
					heading: `Customise: ${a.name}`,
					bilingual: !1
				}, y.value = await Vf(a, async (e) => {
					let t = ue(e);
					return t ? Ch(t) : null;
				}), Rd(y.value) || (T.value = "advanced"), e.status = "ready", k();
				return;
			}
			if (t) {
				let i = await de(t), a = v.value.bilingual && lp(i) === null, o = a ? Je(i.root) : null;
				if (o && _p(i, v.value.language, o.split), v.value = {
					...v.value,
					heading: t.productName,
					board: mu(i) === "board",
					bilingual: a || lp(i) !== null
				}, y.value = i, o?.size) {
					let e = tg(o.size, Qe.value?.material_id ?? 0);
					Ye(o.size.size_id, e?.material_id ?? 0, !0);
				}
				n ? T.value = "advanced" : Rd(y.value) || (T.value = "advanced"), e.status = "ready", k(), a && se(0);
				let s = f_();
				s && r && !n && M(s);
				return;
			}
			if (v.value.roadsign) {
				T.value = "advanced", y.value = yg(ag[0], ng[0], "Site traffic only", g), e.status = "ready", k();
				return;
			}
			if (v.value.fireaction) {
				T.value = "advanced";
				let t = hf[0], n = h.sizes.find((e) => e.width === t.size[0] && e.height === t.size[1]) ?? h.sizes.find((e) => e.height > e.width) ?? h.sizes[0], r = await Oe(vf());
				y.value = Rg(n, t.id, r, g), e.status = "ready", k();
				return;
			}
			if (v.value.board) {
				T.value = "advanced";
				let t = j_(h.sizes), n = await Oe(uf("header-site-safety")?.section.symbols ?? []);
				y.value = Gh(t, n, g), e.status = "ready", k();
				return;
			}
			let o = h.symbols.find((e) => e.code === v.value.defaultSymbol) ?? h.symbols[0], c = (v.value.bilingual ? h.sizes.find((e) => e.width === 300 && e.height === 200) ?? h.sizes.find((e) => e.width > e.height) : void 0) ?? h.sizes.find((e) => e.symbol_position === "above") ?? h.sizes[0];
			if (!o || !c) throw Error("No symbols or sizes available");
			let l = await Ch(o);
			y.value = Rp(c, {
				code: o.code,
				category: o.category,
				source: l
			}, "Your text here", "", g), v.value.bilingual && _p(y.value, v.value.language, "side"), e.status = "ready", k(), se(0);
			let u = w_(), d = f_();
			u ? (s.value = u.description, await _e(u, u.description).catch((t) => {
				e.suggestError = t instanceof Error ? t.message : String(t);
			}), O.length = 0, oe()) : d && r && M(d);
		} catch (t) {
			e.status = "error", e.error = t instanceof Error ? t.message : String(t);
		}
	}
	let ue = (e) => h?.symbols.find((t) => t.code === e) ?? null;
	async function de(e) {
		if (!h || !g) throw Error("Not ready");
		if (e.design) try {
			let t = Tc(e.design);
			if (!Nc(Pc(t, g))) return t;
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
		}, r = rf(e.recipe), i = (r ? of(r) : [v.value?.defaultSymbol ?? h.symbols[0].code]).map((e) => ue(e)).filter((e) => e !== null), a = new Map(await Promise.all(i.map(async (e) => [e.code, {
			code: e.code,
			category: e.category,
			source: await Ch(e)
		}]))), o = r ? cf(r, n, a, g) : Rp(n, [...a.values()][0], "Your text here", "", g);
		return r && v.value?.fireaction && Jg(o, r.sections.map((e) => ({
			step: e.step,
			write_on: e.write_on
		}))), t.size_id === null && delete o.catalogue_size_id, o;
	}
	async function fe(t) {
		if (!n || !y.value || e.saving) return !1;
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
					design: y.value,
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
		e.symbolError = "", D.value = t;
	}
	async function me(t) {
		let n = D.value;
		if (n) {
			e.symbolBusy = t.code, e.symbolError = "";
			try {
				let e = await Ch(t), r = {
					code: t.code,
					category: t.category,
					source: e
				}, i = n.index === "new";
				if (T.value === "basic") A((e) => Hp(e, r));
				else if (n.index === "new") {
					let e = 0;
					A((t) => {
						e = zu(t, n.sectionId, r);
					}), D.value = {
						...n,
						index: e
					};
				} else {
					let e = n.index;
					A((t) => Bu(t, n.sectionId, e, r));
				}
				v.value?.roadsign && A((e) => {
					i && bu(e, "below"), pg(e, fg(e), g);
				});
			} catch (t) {
				e.symbolError = t instanceof Error ? t.message : String(t);
			} finally {
				e.symbolBusy = "";
			}
		}
	}
	let he = J(() => {
		w.value;
		let e = D.value;
		return !e || !y.value || e.index === "new" ? null : y.value.root.sections.find((t) => t.id === e.sectionId)?.symbol_frame?.symbols[e.index]?.symbol_code ?? null;
	}), ge = () => Ze.value.map((e) => e.size_id);
	async function _e(e, t) {
		if (!h) return;
		let n = e.symbols.map((e) => ue(e)).filter((e) => e !== null);
		if (e.symbols.length && !n.length) throw Error("None of the suggested symbols are available here. Please choose one yourself.");
		let r = await Promise.all(n.map(async (e) => ({
			code: e.code,
			category: e.category,
			source: await Ch(e)
		}))), i = y.value;
		if (!i || !g) return;
		let o = Ze.value, s = o.length ? o.find((t) => t.size_id === e.size_id) ?? o.find((e) => e.size_id === Qe.value?.size_id) ?? o[0] : null, c = T_(i, e, r, s ? qe(s) : h.sizes.find((t) => t.size_id === e.size_id) ?? h.sizes.find((e) => e.size_id === i.catalogue_size_id) ?? h.sizes[0], g);
		if (A((e) => {
			e.root = c.doc.root, c.doc.catalogue_size_id === void 0 ? delete e.catalogue_size_id : e.catalogue_size_id = c.doc.catalogue_size_id;
		}), s && s.size_id !== Qe.value?.size_id) {
			let e = tg(s, Qe.value?.material_id ?? 0);
			Qe.value = {
				size_id: s.size_id,
				material_id: e?.material_id ?? 0
			};
			for (let e of et) e(s.size_id, Qe.value.material_id);
		}
		E.section = 0, E.panel = 0, D.value = null, c.basic || (T.value = "advanced"), a.value = {
			...e,
			description: t,
			alternatives: e.alternatives.filter((e) => ue(e))
		};
	}
	async function M(t, n = 3) {
		let i = t.trim().slice(0, 300);
		if (r && i && h && g && _ && !e.suggesting) {
			e.suggesting = !0, e.choosing = !0, e.suggestError = "", c.value = [];
			try {
				let e = await S_(r, i, n, ge()), t = [];
				for (let n of e) {
					let e = await ve(n);
					e && t.push({
						suggestion: n,
						svg: e
					});
				}
				if (!t.length) throw Error("None of the suggested symbols are available here.");
				c.value = t, t.length === 1 && await N(0);
			} catch (t) {
				e.suggestError = t instanceof Error ? t.message : String(t), e.choosing = !1;
			} finally {
				e.suggesting = !1;
			}
		}
	}
	async function ve(e) {
		if (!h || !g || !_ || !y.value) return null;
		let t = e.symbols.map((e) => ue(e)).filter((e) => e !== null);
		if (e.symbols.length && !t.length) return null;
		let n = await Promise.all(t.map(async (e) => ({
			code: e.code,
			category: e.category,
			source: await Ch(e)
		}))), r = Ze.value, i = r.length ? r.find((t) => t.size_id === e.size_id) ?? r[0] : null, a = i ? qe(i) : h.sizes.find((t) => t.size_id === e.size_id) ?? h.sizes[0];
		try {
			let t = Fc(T_(y.value, e, n, a, g).doc, {
				shaper: _,
				ruleset: g
			}, {
				guides: !1,
				text: "live",
				unprinted: $e.value
			}).svg;
			return t ? Hl(t) : null;
		} catch {
			return null;
		}
	}
	async function N(t) {
		let n = c.value[t];
		if (n) {
			try {
				await _e(n.suggestion, s.value.trim()), l || (l = !0, O.length = 0), oe(), e.chosen = t;
			} catch (t) {
				e.suggestError = t instanceof Error ? t.message : String(t);
			}
			e.choosing = !1;
		}
	}
	function ye() {
		c.value.length && (e.choosing = !0);
	}
	function be() {
		c.value = [], e.chosen = -1, e.choosing = !1;
	}
	async function P(t) {
		let n = t.trim().slice(0, 300);
		if (r && n && h && !e.suggesting) {
			e.suggesting = !0, e.suggestError = "";
			try {
				await _e(await y_(r, n, ge()), n);
			} catch (t) {
				e.suggestError = t instanceof Error ? t.message : String(t);
			} finally {
				e.suggesting = !1;
			}
		}
	}
	async function xe(t) {
		if (i && !e.suggesting) {
			e.suggesting = !0, e.suggestError = "";
			try {
				let e = await Gf(t);
				await _e(await x_(i, e.dataUrl, ge()), s.value.trim());
			} catch (t) {
				e.suggestError = t instanceof Error ? t.message : String(t);
			} finally {
				e.suggesting = !1;
			}
		}
	}
	async function Se(e) {
		let t = ue(e), n = y.value;
		if (!t || !n) return;
		let r = {
			sectionId: Ld(n).id,
			index: 0
		}, i = D.value;
		D.value = r;
		try {
			await me(t);
		} finally {
			D.value = i;
		}
	}
	function Ce() {
		if (!y.value || !g || !_) return;
		let e = ip(y.value, {
			shaper: _,
			ruleset: g
		}, h?.sizes ?? []);
		o.value = e.outcome, e.outcome.changed && A((t) => {
			t.root = e.doc.root;
		});
	}
	function we(e) {
		if (e === T.value || !y.value) return !0;
		if (D.value = null, e === "basic") {
			if (!Rd(y.value)) return !1;
			A((e) => zd(e));
		}
		return T.value = e, !0;
	}
	async function Te() {
		let e = y.value;
		if (!e || !g || !h) return;
		let t = lp(e)?.source ?? e.root.sections[0], n = [t, ...e.root.sections].flatMap((e) => e.symbol_frame?.symbols ?? []), r = t.text_frame.panels.flatMap((e) => e.blocks.map((e) => e.text)).filter((e) => e.trim()), i;
		if (n[0]) i = {
			code: n[0].symbol_code,
			category: n[0].category,
			source: n[0].source
		};
		else {
			let e = ue(v.value?.defaultSymbol ?? void 0) ?? h.symbols[0];
			i = {
				code: e.code,
				category: e.category,
				source: await Ch(e)
			};
		}
		let a = Rp(h.sizes.find((t) => t.size_id === e.catalogue_size_id) ?? {
			size_id: e.catalogue_size_id ?? 0,
			name: "",
			width: e.root.width,
			height: e.root.height,
			symbol_position: e.root.width > e.root.height ? "left" : "above"
		}, i, r[0] ?? "", r[1] ?? "", g), o = lp(e);
		o && (_p(a, o.target.lang ?? v.value?.language ?? "pl", pp(e)), jp(a, Ap(e))), A((e) => {
			e.root = a.root, a.catalogue_size_id === void 0 ? delete e.catalogue_size_id : e.catalogue_size_id = a.catalogue_size_id;
		}), E.section = 0, E.panel = 0, D.value = null, T.value = "basic";
	}
	let F = (e) => {
		for (let t of x.value?.sections ?? []) {
			let n = t.blocks.find((t) => t.id === e);
			if (n) return n;
		}
	}, Ee = (e, t) => {
		let n = F(e), r = n?.recommended ?? 0, i = n?.letter_height ?? 0;
		return {
			step: t,
			label: Cd(t, i < r - .05),
			mm: i,
			lines: n?.lines ?? 1
		};
	}, De = (e) => J(() => {
		w.value;
		let t = {
			text: "",
			align: "centre",
			caps: !1,
			step: 0,
			label: "Auto",
			mm: 0,
			lines: 1
		};
		if (!y.value || !Rd(y.value)) return t;
		let n = Bp(y.value, e);
		return n ? {
			text: n.text,
			align: n.align,
			caps: ld(n),
			...Ee(n.id, qp(y.value, e))
		} : t;
	});
	async function Oe(e) {
		let t = e.map((e) => ue(e)).filter((e) => e !== null);
		return new Map(await Promise.all(t.map(async (e) => [e.code, {
			code: e.code,
			category: e.category,
			source: await Ch(e)
		}])));
	}
	async function ke(t, n) {
		if (y.value && g) {
			if (e.symbolError = "", v.value?.fireaction && !t) {
				let e = null;
				A((t) => {
					e = qg(t, n, g);
				});
				let t = e === null ? null : Dh(y.value)[e];
				t && (E.section = t.start), E.panel = 0;
				return;
			}
			try {
				let e = await Oe(t?.section.symbols ?? []), r = null;
				A((i) => {
					r = Fh(i, n, t, e, g);
				});
				let i = r === null ? null : Dh(y.value)[r];
				i && (E.section = i.start), E.panel = 0;
			} catch (t) {
				e.symbolError = t instanceof Error ? t.message : String(t);
			}
		}
	}
	async function Ae(t) {
		if (y.value && g) {
			e.symbolError = "";
			try {
				let e = await Oe(t.section.symbols), n = E.section;
				A((r) => Wh(r, n, t, e, g)), E.panel = 0;
			} catch (t) {
				e.symbolError = t instanceof Error ? t.message : String(t);
			}
		}
	}
	async function je(t) {
		if (y.value && g && h && hf.find((e) => e.id === t)) {
			e.symbolError = "";
			try {
				let e = await Oe(vf()), { width: n, height: r } = y.value.root, i = {
					size_id: y.value.catalogue_size_id ?? 0,
					name: "",
					width: n,
					height: r,
					symbol_position: "left"
				};
				A((n) => {
					let r = Rg(i, t, e, g);
					n.root.layout = r.root.layout, n.root.sections = r.root.sections;
				}), E.section = 0, E.panel = 0;
			} catch (t) {
				e.symbolError = t instanceof Error ? t.message : String(t);
			}
		}
	}
	async function Me(t) {
		if (!y.value || !g || !h) return;
		let n = ff.find((e) => e.id === t);
		if (n) {
			e.symbolError = "";
			try {
				let e = await Oe(n.rows.flatMap((e) => Array.isArray(e) ? e : [e]).flatMap((e) => uf(e)?.section.symbols ?? [])), { width: r, height: i } = y.value.root, a = r >= k_ && i >= A_, o = h.sizes.filter((e) => e.width >= k_ && e.height >= A_).sort((e, t) => e.width * e.height - t.width * t.height)[0], s = a || !o ? {
					size_id: y.value.catalogue_size_id ?? 0,
					name: "",
					width: r,
					height: i,
					symbol_position: "left"
				} : o;
				A((n) => {
					let r = qh(s, t, e, g);
					n.root.width = r.root.width, n.root.height = r.root.height, r.catalogue_size_id && (n.catalogue_size_id = r.catalogue_size_id), n.root.layout = r.root.layout, n.root.sections = r.root.sections;
				}), E.section = 0, E.panel = 0;
			} catch (t) {
				e.symbolError = t instanceof Error ? t.message : String(t);
			}
		}
	}
	function Ne(e) {
		y.value?.root.sections[e]?.placeholder ? Fe("replace", e) : Pe.value?.mode === "replace" && (Pe.value = null);
	}
	let Pe = /* @__PURE__ */ L(null);
	function Fe(t, n) {
		e.symbolError = "", Pe.value = {
			mode: t,
			at: n
		};
	}
	async function Ie(e) {
		let t = Pe.value;
		if (t) {
			if (v.value?.fireaction) {
				if (!y.value || !g) return;
				let n = await Oe(e.section.symbols);
				t.mode === "replace" ? (A((r) => Kg(r, t.at, e, n, g)), E.section = t.at) : (A((r) => Yg(r, e, n, g, t.at + 1)), E.section = Math.min(t.at + 1, y.value.root.sections.length - 1)), E.panel = 0;
			} else t.mode === "replace" ? await Ae(e) : await ke(e, t.at);
			Pe.value = null;
		}
	}
	let Le = J(() => v.value?.fireaction ? _f().map((e) => ({
		group: e.group,
		presets: e.presets
	})) : df().map((e) => ({
		group: e.group,
		presets: e.presets
	}))), Re = /* @__PURE__ */ Kt(/* @__PURE__ */ new Map()), ze = "";
	async function Be() {
		let e = t_(Le.value.flatMap((e) => e.presets)), t = e.join(",");
		t !== ze && (ze = t, Re.value = await Oe(e), Qg(), w.value++);
	}
	let Ve = () => {
		let e = y.value;
		if (!e) return {
			width: 300,
			height: 60
		};
		let t = e.root.layout.type === "board" ? Math.max(1, e.root.layout.rows.length) : 1;
		return {
			width: e.root.width,
			height: e.root.height / t
		};
	}, He = () => {
		v.value?.fireaction && y.value && (zg(y.value), Mg(y.value));
	}, Ue = {
		rows: J(() => (w.value, y.value ? Dh(y.value) : [])),
		selectedRow: J(() => (w.value, y.value ? Oh(y.value, E.section) : -1)),
		add: ke,
		templates: J(() => v.value?.fireaction ? hf.map((e) => ({
			id: e.id,
			label: e.label,
			hint: e.hint
		})) : ff.map((e) => ({
			id: e.id,
			label: e.label,
			hint: e.hint
		}))),
		useTemplate: (e) => v.value?.fireaction ? je(e) : Me(e),
		usePreset: Ae,
		remove: (e) => A((t) => {
			Ih(t, e), He();
		}),
		duplicate: (e) => A((t) => {
			Lh(t, e), He();
		}),
		move: (e, t) => {
			A((n) => {
				Rh(n, e, t), He();
			});
			let n = Dh(y.value)[t];
			n && (E.section = n.start);
		},
		setCells: (e, t) => A((n) => zh(n, e, t)),
		setRowCount: (e) => A((t) => {
			Vh(t, e, g), He();
		}),
		setColumns: (e) => A((t) => Hh(t, e, g)),
		columns: J(() => (w.value, y.value ? Uh(y.value) : 1)),
		empty: J(() => (w.value, y.value ? jh(y.value) : 0)),
		setWeight: (e, t) => A((n) => Bh(n, e, t)),
		select: (e) => {
			let t = Dh(y.value)[e];
			t && (E.section = t.start, E.panel = 0, Ne(t.start));
		},
		steps: J(() => (w.value, v.value?.fireaction && y.value ? Ng(y.value) : [])),
		toggleStep: (e) => A((t) => Pg(t, e)),
		corner: J(() => (w.value, y.value ? {
			mm: Vg(y.value),
			max: Bg(y.value)
		} : {
			mm: 0,
			max: 0
		})),
		setCorner: (e) => A((t) => Hg(t, e), "corner"),
		picker: Pe,
		presets: Le,
		thumb: (e) => (w.value, !g || !_ || !Re.value.size ? "" : $g(e, Ve(), v.value?.fireaction ?? !1, {
			ruleset: g,
			shaper: _,
			symbols: Re.value
		})),
		loadThumbs: Be,
		openPicker: Fe,
		closePicker: () => {
			Pe.value = null;
		},
		takePreset: Ie
	}, We = {
		schemes: ng,
		sizes: ag,
		scheme: J(() => (w.value, y.value ? fg(y.value) : ng[0])),
		size: J(() => {
			w.value;
			let e = y.value;
			return e ? ag.find((t) => t.width === e.root.width && t.height === e.root.height) ?? null : null;
		}),
		setScheme: (e) => A((t) => pg(t, ig(e), g)),
		setSize: (e) => A((t) => gg(t, e, g))
	}, Ge = J(() => ({
		doc: C.value,
		report: x.value
	}));
	async function Ke(e) {
		if (!y.value || !g) return "";
		let t = await Pf();
		return Fc(y.value, {
			shaper: t,
			ruleset: g
		}, {
			guides: !1,
			text: "outline",
			unprinted: $e.value,
			...e ? { substrate: !1 } : {}
		}).svg ?? "";
	}
	let qe = (e) => ({
		size_id: e.size_id,
		name: e.name,
		width: e.width,
		height: e.height,
		symbol_position: e.symbol_position
	});
	function Je(e) {
		let t = Ze.value, n = [{
			split: "side",
			width: e.width * 2,
			height: e.height
		}, {
			split: "stacked",
			width: e.width,
			height: e.height * 2
		}].map((e) => {
			let n = (t) => Math.abs(t.width - e.width) + Math.abs(t.height - e.height), r = t.filter((t) => t.width * t.height >= e.width * e.height), i = r.length ? r.reduce((e, t) => n(t) < n(e) ? t : e) : null;
			return {
				split: e.split,
				size: i,
				miss: i ? n(i) : Infinity
			};
		}).reduce((e, t) => t.miss < e.miss ? t : e);
		if (n.size) return {
			split: n.split,
			size: n.size
		};
		let r = t.length ? t.reduce((e, t) => t.width * t.height > e.width * e.height ? t : e) : null;
		return {
			split: e.width >= e.height ? "side" : "stacked",
			size: r
		};
	}
	function Ye(e, t, n) {
		let r = Ze.value.find((t) => t.size_id === e);
		if (!r) return;
		let i = tg(r, t);
		Qe.value = {
			size_id: r.size_id,
			material_id: i?.material_id ?? t
		};
		let a = qe(r);
		if ($e.value = i?.unprinted_hex ?? void 0, A((e) => {
			v.value?.roadsign ? gg(e, a, g) : T.value === "basic" ? Vp(e, a) : Du(e, a);
			let t = i?.face_hex ?? null;
			t ? (e.root.substrate = { hex: t }, delete e.root.background) : delete e.root.substrate;
		}), n) for (let e of et) e(Qe.value.size_id, Qe.value.material_id);
	}
	let Xe = /* @__PURE__ */ L(null), Ze = J(() => eg(Xe.value)), Qe = /* @__PURE__ */ L(null), $e = /* @__PURE__ */ L(/^#[0-9a-f]{6}$/i.test(Ll?.unprinted ?? "") ? Ll.unprinted : void 0), et = [];
	return {
		state: e,
		product: v,
		svg: b,
		findings: S,
		mode: T,
		selection: E,
		picker: D,
		history: te,
		view: Ge,
		rev: w,
		sizes: J(() => e.status === "ready" && h ? h.sizes : []),
		symbols: J(() => e.status === "ready" && h ? h.symbols : []),
		dataSource: J(() => e.status === "ready" && h ? h.source : ""),
		categories: J(() => e.status === "ready" && g ? g.categories : []),
		roundedByDefault: () => g?.ratios.CORNERS_ROUNDED ?? !0,
		shareRange: () => ({
			min: g?.ratios.MIN_SYMBOL_SHARE ?? .25,
			max: g?.ratios.MAX_SYMBOL_SHARE ?? .75
		}),
		currentSize: J(() => (w.value, y.value?.catalogue_size_id ?? null)),
		currentSymbol: J(() => (w.value, ue(y.value ? Up(y.value) : void 0))),
		pickerCurrent: he,
		symbolEntry: ue,
		board: Ue,
		roadSign: We,
		offerPreset: Ne,
		title: De("title"),
		subtitle: De("subtitle"),
		lineInfo: (e) => (w.value, y.value ? Ee(e, xd(du(y.value, e).block)) : {
			step: 0,
			label: "Auto",
			mm: 0,
			lines: 1
		}),
		document: y,
		designJson: () => JSON.stringify(y.value, null, 2),
		previewSvg: () => Ke(!1),
		printSvg: () => Ke(!0),
		init: le,
		commit: A,
		undo: () => j(O, ee),
		redo: () => j(ee, O),
		setMode: we,
		resetToBasic: Te,
		openPicker: pe,
		closePicker: () => {
			D.value = null;
		},
		pickSymbol: me,
		review: n,
		saveReview: fe,
		tidied: o,
		tidyUp: Ce,
		canSuggest: r !== null,
		canPhoto: i !== null,
		suggestFromPhoto: xe,
		suggestion: a,
		describeText: s,
		options: c,
		chooseOption: N,
		reopenOptions: ye,
		dismissOptions: be,
		suggest: P,
		useAlternative: Se,
		translatorName: u?.name ?? null,
		translatingIds: d,
		prepareTranslation: (t) => {
			e.translateError = "", u?.prepare?.(t).then(() => se(0)).catch(() => {});
		},
		translateAgain: () => {
			let e = y.value && lp(y.value)?.target.lang;
			e && u?.prepare?.(e).catch(() => {}), se(0, !0);
		},
		pickSizeById: (e, t, n, r) => {
			let i = h?.sizes.find((t) => t.size_id === e), a = t && n ? {
				size_id: e,
				name: i?.name ?? `${t}mm x ${n}mm`,
				width: t,
				height: n,
				symbol_position: r ?? i?.symbol_position ?? (t > n ? "left" : "above")
			} : i;
			a && A((e) => v.value?.roadsign ? gg(e, a, g) : T.value === "basic" ? Vp(e, a) : Du(e, a));
		},
		setMaterialFace: (e) => {
			$e.value = e ?? void 0, A((t) => {
				e ? (t.root.substrate = { hex: e }, delete t.root.background) : delete t.root.substrate;
			});
		},
		cartReady: () => {
			w.value;
			let e = y.value;
			return !e || !g || jh(e) > 0 ? !1 : !Pc(e, g).some((e) => e.severity === "error");
		},
		variantSizes: Ze,
		variantChoice: Qe,
		setHostVariants: (e, t) => {
			Xe.value = e;
			let n = Ze.value;
			if (!n.length) return;
			let r = y.value?.root, i = n.find((e) => e.size_id === Number(t?.size_id)) ?? (r && n.find((e) => e.width === r.width && e.height === r.height)) ?? n[0], a = tg(i, Number(t?.material_id));
			Ye(i.size_id, a?.material_id ?? 0, !1);
		},
		chooseVariant: (e, t) => Ye(e, t, !0),
		onVariant: (e) => {
			et.push(e);
		},
		onChange: (e) => {
			ie.push(e);
		},
		setCustomSize: (e, t) => A((n) => Mu(n, e, t, h?.sizes ?? [])),
		currentDimensions: J(() => ({
			width: Ge.value.doc?.root.width ?? 0,
			height: Ge.value.doc?.root.height ?? 0
		})),
		pickSize: (e) => A((t) => T.value === "basic" ? Vp(t, e) : Du(t, e)),
		setText: (e, t) => A((n) => Wp(n, e, t), `text:${e}`),
		setAlign: (e, t) => A((n) => Gp(n, e, t)),
		setCaps: (e, t) => A((n) => Kp(n, e, t)),
		bumpSize: (e, t) => A((n) => Jp(n, e, qp(n, e) + t))
	};
}
var F_ = Symbol("editor");
function I_() {
	let e = Nn(F_);
	if (!e) throw Error("Editor not provided");
	return e;
}
//#endregion
//#region editor/src/components/ReviewPanel.vue?vue&type=script&setup=true&lang.ts
var L_ = {
	class: "card review-panel",
	"aria-label": "Review"
}, R_ = { class: "row-controls" }, z_ = { class: "grow" }, B_ = {
	key: 0,
	class: "small muted"
}, V_ = { class: "row-controls wrap" }, H_ = ["disabled"], U_ = ["disabled"], W_ = {
	key: 0,
	class: "small",
	style: {
		margin: "0",
		color: "var(--danger)"
	},
	role: "alert"
}, G_ = /* @__PURE__ */ z({
	__name: "ReviewPanel",
	setup(e) {
		let t = I_(), n = J(() => t.state.reviewStatus), r = {
			pending: "Not recreated yet",
			review: "To review",
			needs_symbol: "Needs a symbol",
			unsuitable: "Not suitable",
			approved: "Approved",
			failed: "Failed"
		};
		return (e, i) => (H(), U("section", L_, [
			W("div", R_, [W("strong", z_, "Status: " + P(r[n.value] ?? n.value), 1), R(t).state.savedAt ? (H(), U("span", B_, "Saved " + P(R(t).state.savedAt), 1)) : q("", !0)]),
			W("div", V_, [W("button", {
				class: "btn",
				disabled: R(t).state.saving,
				onClick: i[0] ||= (e) => R(t).saveReview("review")
			}, "Save", 8, H_), W("button", {
				class: "btn go grow",
				disabled: R(t).state.saving,
				onClick: i[1] ||= (e) => R(t).saveReview("approved")
			}, P(R(t).state.saving ? "Saving…" : "Save & approve"), 9, U_)]),
			R(t).state.saveError ? (H(), U("p", W_, P(R(t).state.saveError), 1)) : q("", !0),
			i[2] ||= W("p", {
				class: "small muted",
				style: { margin: "0" }
			}, "Approved designs are what “Customise me” will start from.", -1)
		]));
	}
}), K_ = {
	class: "card tidy",
	"aria-labelledby": "tidy-heading"
}, q_ = { class: "row-controls" }, J_ = {
	key: 0,
	class: "small muted",
	style: { margin: "0" },
	role: "status"
}, Y_ = {
	key: 1,
	class: "small",
	style: { margin: "0" },
	role: "status"
}, X_ = {
	key: 2,
	class: "row-controls wrap"
}, Z_ = { class: "small grow" }, Q_ = /* @__PURE__ */ z({
	__name: "TidyButton",
	setup(e) {
		let t = I_(), n = t.tidied, r = (e) => `${Math.round(e * 100)}%`;
		return (e, i) => (H(), U("section", K_, [
			W("div", q_, [i[2] ||= W("div", { class: "grow" }, [W("strong", { id: "tidy-heading" }, "Tidy up the layout"), W("p", {
				class: "small muted",
				style: { margin: "0" }
			}, "Makes your wording as large as it can be on this sign.")], -1), W("button", {
				class: "btn strong",
				onClick: i[0] ||= (e) => R(t).tidyUp()
			}, "Tidy up")]),
			R(n) && !R(n).changed ? (H(), U("p", J_, " Already as good as it gets on this size. ")) : R(n) ? (H(), U("p", Y_, [
				R(n).notes.length ? (H(), U(V, { key: 0 }, [K(P(R(n).notes.join(", ")) + ".", 1)], 64)) : q("", !0),
				R(n).after > R(n).before ? (H(), U(V, { key: 1 }, [K(" Text now fits at " + P(r(R(n).after)) + " of the recommended size (was " + P(r(R(n).before)) + "). ", 1)], 64)) : q("", !0),
				i[3] ||= K(" You can undo this. ", -1)
			])) : q("", !0),
			R(n)?.suggestion ? (H(), U("div", X_, [W("span", Z_, " Your wording is tight here. A " + P(R(n).suggestion.size.width) + "×" + P(R(n).suggestion.size.height) + " mm sign suits it better: letters " + P(R(n).suggestion.gain) + " mm bigger for much the same sign. ", 1), W("button", {
				class: "btn small-btn",
				onClick: i[1] ||= (e) => {
					R(t).pickSize(R(n).suggestion.size), R(t).tidyUp();
				}
			}, " Use " + P(R(n).suggestion.size.width) + "×" + P(R(n).suggestion.size.height), 1)])) : q("", !0)
		]));
	}
}), $_ = ["maxlength", "disabled"], ev = ["disabled"], tv = {
	key: 0,
	class: "spinner dark",
	"aria-hidden": "true"
}, nv = ["disabled"], rv = { class: "small describe-hint photo-drop-hint" }, iv = {
	key: 1,
	class: "small describe-error",
	role: "alert"
}, av = {
	key: 2,
	class: "small describe-hint",
	role: "status"
}, ov = {
	key: 3,
	class: "describe-result",
	role: "status"
}, sv = {
	key: 0,
	class: "small",
	style: { margin: "0" }
}, cv = { class: "alt-tiles" }, lv = [
	"title",
	"aria-label",
	"aria-busy",
	"onClick"
], uv = ["src"], dv = {
	key: 4,
	class: "small describe-hint"
}, fv = /* @__PURE__ */ z({
	__name: "DescribeCard",
	setup(e) {
		let t = I_(), n = /* @__PURE__ */ L(null), r = /* @__PURE__ */ L(!1), i = (e) => {
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
		return (e, i) => (H(), U("section", {
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
			}, [An(W("input", {
				id: "describe",
				"onUpdate:modelValue": i[0] ||= (e) => /* @__PURE__ */ Gt(l) ? l.value = e : null,
				class: "field",
				style: { border: "0" },
				maxlength: R(300),
				placeholder: "e.g. DANGER 450 volts, keep out",
				autocomplete: "off",
				disabled: R(t).state.suggesting
			}, null, 8, $_), [[lo, R(l)]]), W("button", {
				class: "btn accent",
				type: "submit",
				disabled: R(t).state.suggesting || !R(l).trim()
			}, [R(t).state.suggesting ? (H(), U("span", tv)) : q("", !0), K(" " + P(R(t).state.suggesting ? "Designing…" : "Suggest"), 1)], 8, ev)], 32),
			R(t).canPhoto ? (H(), U("div", {
				key: 0,
				class: pe(["photo-row", { dragging: r.value }]),
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
					disabled: R(t).state.suggesting,
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
				})], -1), K(" Upload a photo ", -1)]], 8, nv),
				W("span", rv, P(r.value ? "Drop the photo here" : "or drag one here, or paste it"), 1)
			], 34)) : q("", !0),
			R(t).state.suggestError ? (H(), U("p", iv, P(R(t).state.suggestError), 1)) : R(t).state.suggesting ? (H(), U("p", av, "Reading your sign: symbols, wording and a size…")) : u.value ? (H(), U("div", ov, [
				u.value.note ? (H(), U("p", sv, P(u.value.note), 1)) : q("", !0),
				u.value.alternatives.length ? (H(), U(V, { key: 1 }, [i[6] ||= W("span", { class: "small describe-hint" }, "Other symbols that could fit:", -1), W("div", cv, [(H(!0), U(V, null, B(u.value.alternatives, (e) => (H(), U("button", {
					key: e,
					class: "alt-tile",
					title: R(t).symbolEntry(e)?.name ?? e,
					"aria-label": `Use ${R(t).symbolEntry(e)?.name ?? e} (${e})`,
					"aria-busy": R(t).state.symbolBusy === e,
					onClick: (n) => R(t).useAlternative(e)
				}, [W("img", {
					src: R(t).symbolEntry(e)?.url,
					alt: ""
				}, null, 8, uv), W("span", null, P(e), 1)], 8, lv))), 128))])], 64)) : q("", !0),
				i[7] ||= W("span", { class: "small describe-hint" }, "Change anything below. Undo takes you back.", -1)
			])) : (H(), U("p", dv, [
				i[8] ||= K(" Tell us what the sign is for", -1),
				R(t).canPhoto ? (H(), U(V, { key: 0 }, [K(", or send a photo of one you already have")], 64)) : q("", !0),
				i[9] ||= K("; we’ll suggest symbols, wording and a size. ", -1)
			]))
		], 32));
	}
}), pv = { class: "options-stage" }, mv = { class: "options-head" }, hv = {
	key: 0,
	class: "small muted",
	role: "status"
}, gv = {
	key: 1,
	class: "notice",
	role: "alert"
}, _v = {
	key: 2,
	class: "options-grid"
}, vv = ["aria-pressed", "onClick"], yv = ["innerHTML"], bv = { class: "option-note small" }, xv = { class: "option-use" }, Sv = {
	key: 3,
	class: "small muted"
}, Cv = /*#__PURE__*/ ((e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
})(/* @__PURE__ */ z({
	__name: "SuggestOptions",
	setup(e) {
		let t = I_();
		return (e, n) => (H(), U("div", pv, [
			W("p", mv, [R(t).state.suggesting ? (H(), U(V, { key: 0 }, [K("Designing your sign…")], 64)) : R(t).options.value.length ? (H(), U(V, { key: 1 }, [K("Which of these is closest?")], 64)) : (H(), U(V, { key: 2 }, [K("We couldn’t design that one")], 64))]),
			R(t).state.suggesting ? (H(), U("p", hv, " Choosing symbols, wording and a size for “" + P(R(t).describeText.value) + "”… ", 1)) : R(t).state.suggestError ? (H(), U("p", gv, P(R(t).state.suggestError), 1)) : q("", !0),
			R(t).options.value.length ? (H(), U("div", _v, [(H(!0), U(V, null, B(R(t).options.value, (e, n) => (H(), U("button", {
				key: n,
				class: pe(["option-card", { current: R(t).state.chosen === n }]),
				type: "button",
				"aria-pressed": R(t).state.chosen === n,
				onClick: (e) => R(t).chooseOption(n)
			}, [
				W("span", {
					class: "option-art",
					innerHTML: e.svg
				}, null, 8, yv),
				W("span", bv, P(e.suggestion.note || e.suggestion.title), 1),
				W("span", xv, P(R(t).state.chosen === n ? "Chosen" : "Use this one"), 1)
			], 10, vv))), 128))])) : q("", !0),
			R(t).state.suggesting ? q("", !0) : (H(), U("p", Sv, [
				n[1] ||= K(" Pick one and change anything you like, or ", -1),
				W("button", {
					class: "link-btn",
					type: "button",
					onClick: n[0] ||= (e) => R(t).dismissOptions()
				}, "start from scratch"),
				n[2] ||= K(". ", -1)
			]))
		]));
	}
}), [["__scopeId", "data-v-a328c2ad"]]), wv = ["innerHTML"], Tv = "http://www.w3.org/2000/svg", Ev = /* @__PURE__ */ z({
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
		let n = e, r = t, i = /* @__PURE__ */ L(null), a = /* @__PURE__ */ L(null), o = /* @__PURE__ */ L(null), s = /* @__PURE__ */ L(!1), c = null, l = () => a.value?.querySelector("svg") ?? null;
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
			let i = f(), a = r * i, o = document.createElementNS(Tv, "rect");
			o.setAttribute("x", String(t.x - a)), o.setAttribute("y", String(t.y - a)), o.setAttribute("width", String(t.width + 2 * a)), o.setAttribute("height", String(t.height + 2 * a)), o.setAttribute("rx", String(4 * i)), o.setAttribute("class", n), o.setAttribute("stroke-width", String((n === "ov-selected" ? 3 : 2) * i)), n !== "ov-selected" && o.setAttribute("stroke-dasharray", `${6 * i} ${4 * i}`), e.appendChild(o);
		}
		function m(e) {
			let t = l();
			if (!t) return null;
			t.querySelector(`#${e}`)?.remove();
			let n = document.createElementNS(Tv, "g");
			return n.setAttribute("id", e), n.setAttribute("pointer-events", "none"), t.appendChild(n), n;
		}
		function h(e, t, n) {
			let r = f(), i = document.createElementNS(Tv, "rect");
			if (i.setAttribute("x", String(t.x)), i.setAttribute("y", String(t.y)), i.setAttribute("width", String(t.width)), i.setAttribute("height", String(t.height)), i.setAttribute("class", "ov-busy"), e.appendChild(i), !n) return;
			let a = 14 * r, o = Math.min(t.width - 8 * r, (n.length * .56 + 3.4) * a), s = a * 2.2, c = t.x + (t.width - o) / 2, l = t.y + (t.height - s) / 2, u = document.createElementNS(Tv, "rect");
			for (let [e, t] of Object.entries({
				x: c,
				y: l,
				width: o,
				height: s,
				rx: s / 2
			})) u.setAttribute(e, String(t));
			u.setAttribute("class", "ov-pill");
			let d = document.createElementNS(Tv, "circle");
			for (let [e, t] of Object.entries({
				cx: c + s / 2 + 2 * r,
				cy: l + s / 2,
				r: a * .45
			})) d.setAttribute(e, String(t));
			d.setAttribute("class", "ov-spin"), d.setAttribute("stroke-width", String(2 * r)), d.setAttribute("pathLength", "100");
			let p = document.createElementNS(Tv, "text");
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
					C(null), m("ui-drop")?.remove(), t.item && t.target && r("drop", t.item.key, t.target.key), _n(_);
					return;
				}
				r("pick", t.source, S(e.clientX, e.clientY));
			}
		}
		function D() {
			b = null, C(null), m("ui-drop")?.remove(), _();
		}
		return In(() => n.svg, () => _n(() => {
			u(), _();
		})), In(() => [n.highlights, n.interactive], () => _n(() => {
			g(), _();
		}), { deep: !0 }), or(() => {
			c = new ResizeObserver(u), i.value && c.observe(i.value), u();
		}), lr(() => c?.disconnect()), (e, t) => (H(), U("div", {
			ref_key: "stage",
			ref: i,
			class: pe(["stage", { interactive: n.interactive }]),
			style: { overflow: "hidden" }
		}, [W("div", {
			ref_key: "holder",
			ref: a,
			innerHTML: n.svg,
			class: pe({ grabbable: o.value !== null }),
			onPointerdown: w,
			onPointermove: T,
			onPointerup: E,
			onPointercancel: D,
			onPointerenter: v,
			onPointerleave: y
		}, null, 42, wv)], 2));
	}
}), Dv = { class: "scale-panel" }, Ov = { class: "step-head" }, kv = {
	key: 0,
	class: "notice",
	role: "alert"
}, Av = {
	key: 1,
	class: "small muted"
}, jv = ["viewBox"], Mv = [
	"y1",
	"x2",
	"y2"
], Nv = [
	"y",
	"width",
	"height"
], Pv = [
	"y",
	"width",
	"height"
], Fv = ["cx", "cy"], Iv = ["innerHTML"], Lv = {
	key: 3,
	class: "small muted",
	style: { margin: "0" }
}, Rv = 1500, zv = 180, Bv = /* @__PURE__ */ z({
	__name: "ScalePreview",
	emits: ["close"],
	setup(e, { emit: t }) {
		let n = I_(), r = t, i = {
			w: 762,
			h: 1981
		}, a = /* @__PURE__ */ L(""), o = /* @__PURE__ */ L(!1);
		or(async () => {
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
			let e = s.value, t = c.value ? i.w : i.w + zv + e.w, n = i.h + 90, r = c.value ? (i.w - e.w) / 2 : i.w + zv, a = n - Rv - e.h / 2, o = (e, t) => `${e / t * 100}%`;
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
		return (e, t) => (H(), U("div", {
			class: "scale-backdrop",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Your sign at true scale",
			onClick: t[1] ||= po((e) => r("close"), ["self"])
		}, [W("div", Dv, [
			W("div", Ov, [t[2] ||= W("h2", { class: "grow" }, "Your sign, actual size", -1), W("button", {
				class: "icon-btn",
				"aria-label": "Close",
				onClick: t[0] ||= (e) => r("close")
			}, "×")]),
			o.value ? (H(), U("p", kv, "The artwork could not be prepared. Please try again.")) : a.value ? q("", !0) : (H(), U("p", Av, "Preparing the artwork…")),
			a.value ? (H(), U("div", {
				key: 2,
				class: "scale-stage",
				style: j({ aspectRatio: `${l.value.width} / ${l.value.height}` })
			}, [(H(), U("svg", {
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
				}, null, 8, Mv),
				W("rect", {
					x: 0,
					y: l.value.height - i.h,
					width: i.w,
					height: i.h,
					class: "frame"
				}, null, 8, Nv),
				W("rect", {
					x: 28,
					y: l.value.height - i.h + 28,
					width: i.w - 56,
					height: i.h - 56,
					class: "leaf"
				}, null, 8, Pv),
				W("circle", {
					cx: i.w - 90,
					cy: l.value.height - 1050,
					r: "26",
					class: "knob"
				}, null, 8, Fv)
			], 8, jv)), W("div", {
				class: "scale-sign",
				style: j(l.value.box),
				innerHTML: a.value
			}, null, 12, Iv)], 4)) : q("", !0),
			a.value ? (H(), U("p", Lv, [
				K(P(s.value.w) + " × " + P(s.value.h) + " mm, shown against a standard door (" + P(i.w) + " × " + P(i.h) + " mm) ", 1),
				c.value ? (H(), U(V, { key: 0 }, [K(" at the usual height")], 64)) : q("", !0),
				t[3] ||= K(". ", -1)
			])) : q("", !0)
		])]));
	}
}), Vv = {
	class: "card",
	"aria-labelledby": "size-heading"
}, Hv = { class: "step-head" }, Uv = { class: "step-no" }, Wv = {
	class: "chips",
	role: "group",
	"aria-label": "Sign size in millimetres"
}, Gv = [
	"aria-pressed",
	"title",
	"onClick"
], Kv = {
	key: 0,
	class: "custom-size"
}, qv = {
	class: "label",
	id: "custom-label"
}, Jv = {
	class: "row-controls",
	role: "group",
	"aria-labelledby": "custom-label"
}, Yv = ["min", "max"], Xv = ["min", "max"], Zv = [
	"aria-pressed",
	"aria-label",
	"title"
], Qv = {
	viewBox: "0 0 20 20",
	width: "18",
	height: "18",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"aria-hidden": "true"
}, $v = {
	key: 0,
	d: "M7 9V6.5a3 3 0 0 1 6 0V9"
}, ey = {
	key: 1,
	d: "M7 9V6.5a3 3 0 0 1 5.8-1.1"
}, ty = {
	class: "small muted",
	style: { margin: "0" }
}, ny = /* @__PURE__ */ z({
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
		let n = e, r = t, i = /* @__PURE__ */ L(n.dimensions.width), a = /* @__PURE__ */ L(n.dimensions.height), o = /* @__PURE__ */ L(!0);
		In(() => n.dimensions, (e) => {
			i.value = e.width, a.value = e.height;
		});
		function s(e) {
			let t = n.dimensions, s = ju(e === "width" ? i.value : a.value, e, t, o.value);
			i.value = s.width, a.value = s.height, (s.width !== t.width || s.height !== t.height) && r("custom", s.width, s.height);
		}
		return (t, n) => (H(), U("section", Vv, [
			W("div", Hv, [W("span", Uv, P(e.step), 1), n[9] ||= W("h2", { id: "size-heading" }, "Size & material", -1)]),
			W("div", Wv, [(H(!0), U(V, null, B(e.sizes, (t) => (H(), U("button", {
				key: t.size_id,
				class: "chip",
				"aria-pressed": t.size_id === e.current,
				title: t.name,
				onClick: (e) => r("pick", t)
			}, P(t.width) + "×" + P(t.height), 9, Gv))), 128))]),
			e.custom ? (H(), U("div", Kv, [
				W("span", qv, [n[12] ||= K(" Custom size (mm)", -1), e.current === null ? (H(), U(V, { key: 0 }, [n[10] ||= K(" · ", -1), n[11] ||= W("strong", null, "in use", -1)], 64)) : q("", !0)]),
				W("div", Jv, [
					n[14] ||= W("label", {
						class: "sr-only",
						for: "custom-w"
					}, "Width in millimetres", -1),
					An(W("input", {
						id: "custom-w",
						"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
						class: "field compact size-input",
						type: "number",
						inputmode: "numeric",
						min: R(50),
						max: R(ku),
						onChange: n[1] ||= (e) => s("width"),
						onFocus: n[2] ||= (e) => e.target.select(),
						onKeydown: n[3] ||= ho(po((e) => e.target.blur(), ["prevent"]), ["enter"])
					}, null, 40, Yv), [[
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
					An(W("input", {
						id: "custom-h",
						"onUpdate:modelValue": n[4] ||= (e) => a.value = e,
						class: "field compact size-input",
						type: "number",
						inputmode: "numeric",
						min: R(50),
						max: R(ku),
						onChange: n[5] ||= (e) => s("height"),
						onFocus: n[6] ||= (e) => e.target.select(),
						onKeydown: n[7] ||= ho(po((e) => e.target.blur(), ["prevent"]), ["enter"])
					}, null, 40, Xv), [[
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
					}, [(H(), U("svg", Qv, [n[13] ||= W("rect", {
						x: "4",
						y: "9",
						width: "12",
						height: "8",
						rx: "1.5"
					}, null, -1), o.value ? (H(), U("path", $v)) : (H(), U("path", ey))]))], 8, Zv)
				]),
				W("p", ty, "Short side " + P(R(50)) + "–" + P(R(Ou)) + " mm, long side up to " + P(R(ku)) + " mm. Press Enter to apply.", 1)
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
}), ry = {
	class: "card",
	"aria-labelledby": "variant-heading"
}, iy = { class: "step-head" }, ay = { class: "step-no" }, oy = {
	class: "chips",
	role: "group",
	"aria-label": "Sign size"
}, sy = [
	"aria-pressed",
	"title",
	"onClick"
], cy = {
	class: "chips wide",
	role: "group",
	"aria-labelledby": "material-label"
}, ly = ["aria-pressed", "onClick"], uy = /* @__PURE__ */ z({
	__name: "VariantStep",
	props: { step: { default: 1 } },
	setup(e) {
		let t = e, n = I_(), r = n.variantSizes, i = n.variantChoice, a = J(() => r.value.find((e) => e.size_id === i.value?.size_id) ?? r.value[0]), o = J(() => a.value?.materials ?? []), s = (e) => n.chooseVariant(e, i.value?.material_id ?? 0), c = (e) => n.chooseVariant(a.value?.size_id ?? 0, e);
		return (e, n) => (H(), U("section", ry, [
			W("div", iy, [W("span", ay, P(t.step), 1), n[0] ||= W("h2", { id: "variant-heading" }, "Size & material", -1)]),
			W("div", oy, [(H(!0), U(V, null, B(R(r), (e) => (H(), U("button", {
				key: e.size_id,
				class: "chip",
				"aria-pressed": e.size_id === a.value?.size_id,
				title: e.name,
				onClick: (t) => s(e.size_id)
			}, P(e.width) + "×" + P(e.height), 9, sy))), 128))]),
			n[1] ||= W("span", {
				class: "label",
				id: "material-label"
			}, "Material", -1),
			W("div", cy, [(H(!0), U(V, null, B(o.value, (e) => (H(), U("button", {
				key: e.material_id,
				class: "chip",
				"aria-pressed": e.material_id === R(i)?.material_id,
				onClick: (t) => c(e.material_id)
			}, P(e.name), 9, ly))), 128))])
		]));
	}
}), dy = {
	class: "card outlined",
	"aria-labelledby": "picker-heading"
}, fy = { class: "step-head" }, py = {
	id: "picker-heading",
	class: "grow"
}, my = {
	class: "label",
	for: "symbol-search"
}, hy = {
	key: 0,
	class: "tabs",
	role: "group",
	"aria-label": "Symbol categories"
}, gy = ["aria-pressed", "onClick"], _y = {
	class: "small muted",
	"aria-live": "polite"
}, vy = {
	key: 1,
	class: "notice",
	style: { margin: "0" }
}, yy = { class: "tiles" }, by = [
	"aria-pressed",
	"aria-busy",
	"onClick"
], xy = ["src"], Sy = { class: "name" }, Cy = { class: "small muted" }, wy = {
	key: 2,
	class: "muted",
	style: { margin: "0" }
}, Ty = /* @__PURE__ */ z({
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
		let n = e, r = J(() => n.noun ?? "symbol"), i = J(() => `${r.value}s`), a = J(() => /^[aeiou]/i.test(r.value) ? "an" : "a"), o = t, s = /* @__PURE__ */ L(""), c = /* @__PURE__ */ L(n.preferred ?? "all"), l = /* @__PURE__ */ L(null);
		or(() => l.value?.focus());
		let u = J(() => {
			let e = n.categories.filter((e) => n.symbols.some((t) => t.category === e.key));
			return [{
				key: "all",
				title: "All"
			}, ...(n.preferred ? [...e.filter((e) => e.key === n.preferred), ...e.filter((e) => e.key !== n.preferred)] : e).map((e) => ({
				key: e.key,
				title: e.title
			}))];
		}), d = J(() => s.value.trim() ? n.symbols.filter((e) => wh(e, s.value)) : n.symbols.filter((e) => c.value === "all" || e.category === c.value));
		return (t, n) => (H(), U("section", dy, [
			W("div", fy, [W("h2", py, "Choose " + P(a.value) + " " + P(r.value), 1), W("button", {
				class: "btn go",
				style: {
					height: "40px",
					"font-size": "15px"
				},
				onClick: n[0] ||= (e) => o("done")
			}, "Done")]),
			W("label", my, "Search " + P(i.value) + " by what the sign is for", 1),
			An(W("input", {
				id: "symbol-search",
				ref_key: "search",
				ref: l,
				"onUpdate:modelValue": n[1] ||= (e) => s.value = e,
				class: "field",
				style: { border: "2px solid var(--ink)" },
				placeholder: "e.g. smoking, forklift, ear protection",
				autocomplete: "off"
			}, null, 512), [[lo, s.value]]),
			s.value.trim() ? q("", !0) : (H(), U("div", hy, [(H(!0), U(V, null, B(u.value, (e) => (H(), U("button", {
				key: e.key,
				class: "tab",
				"aria-pressed": c.value === e.key,
				onClick: (t) => c.value = e.key
			}, P(e.title), 9, gy))), 128))])),
			W("div", _y, P(s.value.trim() ? `${d.value.length} match${d.value.length === 1 ? "" : "es"}` : `${d.value.length} ${i.value}`), 1),
			e.error ? (H(), U("p", vy, P(e.error), 1)) : q("", !0),
			W("div", yy, [(H(!0), U(V, null, B(d.value, (t) => (H(), U("button", {
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
				}, null, 8, xy),
				W("span", Sy, P(t.name), 1),
				W("span", Cy, P(t.code), 1)
			], 8, by))), 128))]),
			d.value.length ? q("", !0) : (H(), U("p", wy, "No " + P(i.value) + " match “" + P(s.value) + "”.", 1)),
			W("button", {
				class: "btn go picker-done",
				onClick: n[2] ||= (e) => o("done")
			}, "Done")
		]));
	}
}), Ey = {
	class: "card",
	"aria-labelledby": "symbol-heading"
}, Dy = { class: "step-head" }, Oy = {
	key: 0,
	class: "current-symbol"
}, ky = ["src"], Ay = { style: { "font-weight": "600" } }, jy = { class: "small muted" }, My = /* @__PURE__ */ z({
	__name: "SymbolStep",
	props: { current: {} },
	emits: ["change"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (H(), U("section", Ey, [W("div", Dy, [
			r[1] ||= W("span", { class: "step-no" }, "2", -1),
			r[2] ||= W("h2", {
				id: "symbol-heading",
				class: "grow"
			}, "Symbol", -1),
			W("button", {
				class: "btn strong",
				onClick: r[0] ||= (e) => n("change")
			}, "Change symbol")
		]), e.current ? (H(), U("div", Oy, [W("img", {
			src: e.current.url,
			alt: ""
		}, null, 8, ky), W("div", null, [W("div", Ay, P(e.current.name), 1), W("div", jy, P(e.current.code) + " · ISO 7010", 1)])])) : q("", !0)]));
	}
}), Ny = ["aria-label"], Py = [
	"aria-pressed",
	"aria-label",
	"onClick"
], Fy = {
	viewBox: "0 0 20 22",
	width: "18",
	height: "18",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"aria-hidden": "true"
}, Iy = ["d"], Ly = /* @__PURE__ */ z({
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
		return (e, t) => (H(), U("div", {
			class: "aligns",
			role: "group",
			"aria-label": `${n.label} alignment`
		}, [(H(), U(V, null, B(i, (e) => W("button", {
			key: e.key,
			"aria-pressed": n.align === e.key,
			"aria-label": `Align ${e.label}`,
			onClick: (t) => r("align", e.key)
		}, [(H(), U("svg", Fy, [W("path", { d: e.path }, null, 8, Iy)]))], 8, Py)), 64))], 8, Ny));
	}
}), Ry = { style: {
	display: "flex",
	"flex-direction": "column",
	gap: "8px"
} }, zy = ["for"], By = [
	"id",
	"value",
	"placeholder"
], Vy = { class: "line-controls" }, Hy = ["aria-label"], Uy = ["title"], Wy = { key: 0 }, Gy = ["aria-label"], Ky = ["aria-pressed", "aria-label"], qy = /* @__PURE__ */ z({
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
		return (e, t) => (H(), U("div", Ry, [
			W("label", {
				class: "label",
				for: n.id
			}, P(n.label), 9, zy),
			W("input", {
				id: n.id,
				class: pe(["field", { caps: n.caps }]),
				value: n.text,
				placeholder: n.placeholder,
				autocomplete: "off",
				onInput: t[0] ||= (e) => r("text", e.target.value)
			}, null, 42, By),
			W("div", Vy, [
				W("button", {
					class: "stepper",
					"aria-label": `${n.label} smaller`,
					onClick: t[1] ||= (e) => r("bump", -1)
				}, "A−", 8, Hy),
				W("span", {
					class: "step-label",
					title: n.mm ? `Letters ${n.mm} mm tall` : ""
				}, [K(P(n.sizeLabel), 1), n.mm ? (H(), U("small", Wy, P(n.mm) + " mm", 1)) : q("", !0)], 8, Uy),
				W("button", {
					class: "stepper",
					style: { "font-size": "17px" },
					"aria-label": `${n.label} larger`,
					onClick: t[2] ||= (e) => r("bump", 1)
				}, "A+", 8, Gy),
				W("button", {
					class: "stepper caps-toggle",
					"aria-pressed": n.caps,
					"aria-label": `${n.label} in capitals`,
					title: "CAPITALS",
					onClick: t[3] ||= (e) => r("caps", !n.caps)
				}, "AA", 8, Ky),
				G(Ly, {
					align: n.align,
					label: n.label,
					onAlign: t[4] ||= (e) => r("align", e)
				}, null, 8, ["align", "label"])
			])
		]));
	}
}), Jy = {
	class: "card",
	"aria-labelledby": "layout-heading"
}, Yy = [
	"aria-pressed",
	"title",
	"onClick"
], Xy = {
	key: 0,
	viewBox: "0 0 30 40",
	width: "30",
	height: "40",
	"aria-hidden": "true"
}, Zy = {
	key: 1,
	viewBox: "0 0 30 40",
	width: "30",
	height: "40",
	"aria-hidden": "true"
}, Qy = {
	key: 2,
	viewBox: "0 0 40 30",
	width: "40",
	height: "30",
	"aria-hidden": "true"
}, $y = {
	key: 3,
	viewBox: "0 0 40 30",
	width: "40",
	height: "30",
	"aria-hidden": "true"
}, eb = /* @__PURE__ */ z({
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
		return (t, a) => (H(), U("section", Jy, [a[4] ||= W("div", { class: "step-head" }, [W("span", { class: "step-no" }, "1"), W("h2", { id: "layout-heading" }, "Layout")], -1), W("div", {
			class: pe(["layouts", { two: n.only?.length === 2 }]),
			role: "group",
			"aria-label": "Sign layout"
		}, [(H(!0), U(V, null, B(i.filter((e) => !n.only || n.only.includes(e.kind)), (t) => (H(), U("button", {
			key: t.kind,
			class: "layout-card",
			"aria-pressed": e.current === t.kind,
			title: t.hint,
			onClick: (e) => r("pick", t.kind)
		}, [t.kind === "single" ? (H(), U("svg", Xy, [...a[0] ||= [
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
		]])) : t.kind === "multi" ? (H(), U("svg", Zy, [...a[1] ||= [
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
		]])) : t.kind === "stacked" ? (H(), U("svg", Qy, [...a[2] ||= [Ki("<rect x=\"0.5\" y=\"0.5\" width=\"39\" height=\"29\" fill=\"#fff\" stroke=\"currentColor\"></rect><path d=\"M7 3 L12 12 L2 12 Z\" fill=\"#FFD200\" stroke=\"#1C1F23\"></path><rect x=\"15\" y=\"3\" width=\"22\" height=\"10\" fill=\"#FFD200\"></rect><circle cx=\"7\" cy=\"21\" r=\"5\" fill=\"none\" stroke=\"#ED1C24\" stroke-width=\"2\"></circle><rect x=\"15\" y=\"16\" width=\"22\" height=\"11\" fill=\"#ED1C24\"></rect>", 5)]])) : (H(), U("svg", $y, [...a[3] ||= [Ki("<rect x=\"0.5\" y=\"0.5\" width=\"39\" height=\"29\" fill=\"#fff\" stroke=\"currentColor\"></rect><rect x=\"3\" y=\"3\" width=\"10\" height=\"11\" fill=\"#ED1C24\"></rect><rect x=\"15\" y=\"3\" width=\"10\" height=\"11\" fill=\"#056BB3\"></rect><rect x=\"27\" y=\"3\" width=\"10\" height=\"11\" fill=\"#FFD200\"></rect><rect x=\"3\" y=\"16\" width=\"10\" height=\"11\" fill=\"#ED1C24\"></rect><rect x=\"15\" y=\"16\" width=\"10\" height=\"11\" fill=\"#ED1C24\"></rect><rect x=\"27\" y=\"16\" width=\"10\" height=\"11\" fill=\"#099146\"></rect>", 7)]])), W("span", null, P(t.label), 1)], 8, Yy))), 128))], 2)]));
	}
}), tb = {
	key: 0,
	class: "card hint-card",
	"aria-labelledby": "move-hint-heading"
}, nb = {
	class: "hint-picture",
	viewBox: "0 0 96 64",
	width: "96",
	height: "64",
	role: "img",
	"aria-label": "A cell outlined with a dashed box moving to another place on the sign"
}, rb = { key: 0 }, ib = { key: 1 }, ab = {
	class: "grow",
	style: { "min-width": "0" }
}, ob = {
	id: "move-hint-heading",
	class: "hint-title"
}, sb = {
	class: "small",
	style: { margin: "2px 0 0" }
}, cb = "signs.moveHint.dismissed", lb = /* @__PURE__ */ z({
	__name: "MoveHint",
	props: { kind: {} },
	setup(e) {
		let t = e, n = /* @__PURE__ */ L((() => {
			try {
				return localStorage.getItem(cb) === "1";
			} catch {
				return !1;
			}
		})());
		function r() {
			n.value = !0;
			try {
				localStorage.setItem(cb, "1");
			} catch {}
		}
		return (e, i) => n.value ? q("", !0) : (H(), U("section", tb, [(H(), U("svg", nb, [i[2] ||= W("rect", {
			x: "1",
			y: "1",
			width: "94",
			height: "62",
			rx: "5",
			fill: "#fff",
			stroke: "#d9d7d0"
		}, null, -1), t.kind === "symbols" ? (H(), U("g", rb, [...i[0] ||= [Ki("<circle cx=\"22\" cy=\"22\" r=\"11\" fill=\"none\" stroke=\"#ED1C24\" stroke-width=\"3.4\"></circle><path d=\"M14 30 30 14\" stroke=\"#ED1C24\" stroke-width=\"3.4\" stroke-linecap=\"round\"></path><rect x=\"42\" y=\"8\" width=\"30\" height=\"28\" rx=\"4\" fill=\"#fff\" stroke=\"var(--focus)\" stroke-width=\"1.6\" stroke-dasharray=\"4 3\"></rect><path d=\"M57 13 69 33H45Z\" fill=\"#FFD200\" stroke=\"#1C1F23\" stroke-width=\"2\" stroke-linejoin=\"round\"></path><rect x=\"8\" y=\"42\" width=\"80\" height=\"14\" rx=\"3\" fill=\"#ED1C24\"></rect>", 5)]])) : (H(), U("g", ib, [...i[1] ||= [
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
		]]))])), W("div", ab, [
			W("h2", ob, P(t.kind === "symbols" ? "Reorder symbols" : "Move things around"), 1),
			W("p", sb, [t.kind === "symbols" ? (H(), U(V, { key: 0 }, [K(" Drag a symbol along the row to reorder it. The dashed box shows where it will land. ")], 64)) : (H(), U(V, { key: 1 }, [K(" Rest the pointer on the sign to see what can be moved, then drag one onto another to swap them. The dashed box shows where it will land. ")], 64))]),
			W("button", {
				class: "link",
				onClick: r
			}, "Got it")
		])]));
	}
}), ub = ["aria-label"], db = ["aria-pressed"], fb = ["aria-pressed", "onClick"], pb = /* @__PURE__ */ z({
	__name: "ColourChoice",
	props: {
		categories: {},
		current: {},
		label: {},
		allowMatch: { type: Boolean }
	},
	emits: ["pick"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = J(() => Qu(n.categories)), a = /* @__PURE__ */ L(!1), o = J(() => a.value || i.value.more.some((e) => e.key === n.current));
		return (t, n) => (H(), U("div", {
			class: "swatches",
			role: "group",
			"aria-label": e.label
		}, [
			e.allowMatch ? (H(), U("button", {
				key: 0,
				class: "swatch",
				"aria-pressed": e.current === null,
				onClick: n[0] ||= (e) => r("pick", null)
			}, [...n[2] ||= [W("span", {
				class: "dot match",
				"aria-hidden": "true"
			}, null, -1), K("Match symbol ", -1)]], 8, db)) : q("", !0),
			(H(!0), U(V, null, B(o.value ? [...i.value.main, ...i.value.more] : i.value.main, (t) => (H(), U("button", {
				key: t.key,
				class: "swatch",
				"aria-pressed": e.current === t.key,
				onClick: (e) => r("pick", t.key)
			}, [W("span", {
				class: "dot",
				style: j({ background: t.panel.hex }),
				"aria-hidden": "true"
			}, null, 4), K(P(t.title), 1)], 8, fb))), 128)),
			i.value.more.length && !o.value ? (H(), U("button", {
				key: 1,
				class: "link",
				onClick: n[1] ||= (e) => a.value = !0
			}, "More colours")) : q("", !0)
		], 8, ub));
	}
}), mb = { class: "line-editor" }, hb = { class: "row-controls" }, gb = ["for"], _b = ["for"], vb = ["id", "value"], yb = ["value"], bb = [
	"id",
	"rows",
	"value"
], xb = { class: "line-controls" }, Sb = ["aria-label"], Cb = ["title"], wb = { key: 0 }, Tb = ["aria-label"], Eb = ["aria-pressed", "aria-label"], Db = ["aria-pressed", "aria-label"], Ob = { class: "row-controls" }, kb = ["for"], Ab = [
	"id",
	"min",
	"max",
	"step",
	"value",
	"disabled"
], jb = ["disabled"], Mb = { class: "row-controls" }, Nb = ["for"], Pb = [
	"id",
	"min",
	"max",
	"value"
], Fb = ["disabled"], Ib = {
	key: 0,
	class: "small muted",
	style: { margin: "0" }
}, Lb = { class: "check small-check" }, Rb = ["checked"], zb = { class: "row-controls" }, Bb = ["disabled", "aria-label"], Vb = ["disabled", "aria-label"], Hb = /* @__PURE__ */ z({
	__name: "LineEditor",
	props: {
		block: {},
		index: {},
		count: {},
		nudgeRange: {}
	},
	setup(e) {
		let t = e, n = I_(), r = J(() => t.block.id), i = J(() => n.lineInfo(r.value)), a = J(() => `Line ${t.index + 1}`), o = J(() => Math.min(3, Math.max(1, t.block.text.split("\n").length))), s = [
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
		return (t, l) => (H(), U("div", mb, [
			W("div", hb, [
				W("label", {
					class: "label grow",
					for: `text-${r.value}`
				}, P(a.value), 9, gb),
				W("label", {
					class: "sr-only",
					for: `role-${r.value}`
				}, P(a.value) + " style", 9, _b),
				W("select", {
					id: `role-${r.value}`,
					class: "field compact",
					value: pd(e.block),
					onChange: l[0] ||= (e) => R(n).commit((t) => fd(t, r.value, e.target.value))
				}, [(H(), U(V, null, B(s, (e) => W("option", {
					key: e.key,
					value: e.key
				}, P(e.label), 9, yb)), 64))], 40, vb)
			]),
			W("textarea", {
				id: `text-${r.value}`,
				class: pe(["field area", { caps: ld(e.block) }]),
				rows: o.value,
				value: e.block.text,
				placeholder: "Type your text",
				onInput: l[1] ||= (e) => R(n).commit((t) => ad(t, r.value, e.target.value), `text:${r.value}`)
			}, null, 42, bb),
			W("div", xb, [
				W("button", {
					class: "stepper",
					"aria-label": `${a.value} smaller`,
					onClick: l[2] ||= (e) => R(n).commit((e) => Sd(du(e, r.value).block, i.value.step - 1))
				}, "A−", 8, Sb),
				W("span", {
					class: "step-label",
					title: i.value.mm ? `Letters ${i.value.mm} mm tall` : ""
				}, [K(P(i.value.label), 1), i.value.mm ? (H(), U("small", wb, P(i.value.mm) + " mm", 1)) : q("", !0)], 8, Cb),
				W("button", {
					class: "stepper",
					style: { "font-size": "17px" },
					"aria-label": `${a.value} larger`,
					onClick: l[3] ||= (e) => R(n).commit((e) => Sd(du(e, r.value).block, i.value.step + 1))
				}, "A+", 8, Tb),
				W("button", {
					class: "stepper bold-toggle",
					"aria-pressed": cd(e.block),
					"aria-label": `${a.value} bold`,
					onClick: l[4] ||= (t) => R(n).commit((t) => sd(t, r.value, !cd(e.block)))
				}, "B", 8, Eb),
				W("button", {
					class: "stepper caps-toggle",
					"aria-pressed": ld(e.block),
					"aria-label": `${a.value} in capitals`,
					title: "CAPITALS",
					onClick: l[5] ||= (t) => R(n).commit((t) => dd(t, r.value, !ld(e.block)))
				}, "AA", 8, Db),
				G(Ly, {
					align: e.block.align,
					label: a.value,
					onAlign: l[6] ||= (e) => R(n).commit((t) => od(t, r.value, e))
				}, null, 8, ["align", "label"])
			]),
			W("div", Ob, [
				W("label", {
					class: "label",
					for: `spacing-${r.value}`,
					style: { "white-space": "nowrap" }
				}, "Line spacing", 8, kb),
				W("input", {
					id: `spacing-${r.value}`,
					class: "grow",
					type: "range",
					min: hd.min,
					max: hd.max,
					step: hd.step,
					value: e.block.line_spacing,
					disabled: i.value.lines < 2,
					onInput: l[7] ||= (e) => R(n).commit((t) => gd(t, r.value, Number(e.target.value)), `spacing:${r.value}`)
				}, null, 40, Ab),
				W("button", {
					class: "link",
					disabled: e.block.line_spacing === hd.default,
					onClick: l[8] ||= (e) => R(n).commit((e) => gd(e, r.value, hd.default))
				}, "Reset", 8, jb)
			]),
			W("div", Mb, [
				W("label", {
					class: "label",
					for: `nudge-${r.value}`,
					style: { "white-space": "nowrap" }
				}, "Move up/down", 8, Nb),
				W("input", {
					id: `nudge-${r.value}`,
					class: "grow",
					type: "range",
					min: -e.nudgeRange,
					max: e.nudgeRange,
					step: "0.5",
					value: e.block.y_offset,
					onInput: l[9] ||= (e) => R(n).commit((t) => yd(t, r.value, Number(e.target.value)), `nudge:${r.value}`)
				}, null, 40, Pb),
				W("button", {
					class: "link",
					disabled: !e.block.y_offset,
					onClick: l[10] ||= (e) => R(n).commit((e) => yd(e, r.value, 0))
				}, "Reset", 8, Fb)
			]),
			c.value.requested === c.value.applied ? q("", !0) : (H(), U("p", Ib, " Moved as far as it fits (" + P(c.value.applied) + " mm). ", 1)),
			W("label", Lb, [W("input", {
				type: "checkbox",
				checked: _d(e.block),
				onChange: l[11] ||= (e) => R(n).commit((t) => vd(t, r.value, e.target.checked))
			}, null, 40, Rb), l[15] ||= K(" Pin to the bottom of the panel ", -1)]),
			W("div", zb, [
				W("button", {
					class: "link",
					disabled: e.index === 0,
					"aria-label": `Move ${a.value.toLowerCase()} up`,
					onClick: l[12] ||= (e) => R(n).commit((e) => id(e, r.value, -1))
				}, "↑ Up", 8, Bb),
				W("button", {
					class: "link",
					disabled: e.index === e.count - 1,
					"aria-label": `Move ${a.value.toLowerCase()} down`,
					onClick: l[13] ||= (e) => R(n).commit((e) => id(e, r.value, 1))
				}, "↓ Down", 8, Vb),
				l[16] ||= W("span", { class: "grow" }, null, -1),
				W("button", {
					class: "link danger",
					onClick: l[14] ||= (e) => R(n).commit((e) => rd(e, r.value))
				}, "Remove line")
			])
		]));
	}
}), Ub = { class: "row-controls" }, Wb = ["aria-expanded"], Gb = { class: "panel-name" }, Kb = {
	key: 0,
	class: "small muted panel-summary"
}, qb = ["disabled"], Jb = ["disabled"], Yb = { class: "row-controls" }, Xb = ["title"], Zb = /* @__PURE__ */ z({
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
		let t = e, n = I_(), r = J(() => nd(t.panel)), i = J(() => r.value || t.panel.blocks.length < 4);
		function a() {
			n.commit((e) => r.value ? td(e, o.value) : ed(e, o.value));
		}
		let o = J(() => t.panel.id), s = J(() => n.product.value?.roadsign ?? !1), c = J(() => t.panel.blocks.map((e) => e.text.trim()).filter(Boolean).join(" · ") || "No text yet");
		function l() {
			n.selection.section = t.sectionIndex, n.selection.panel = t.index;
		}
		return (t, u) => (H(), U("div", { class: pe(["panel-editor", { expanded: e.expanded }]) }, [W("div", Ub, [W("button", {
			class: "panel-title grow",
			"aria-expanded": e.expanded,
			onClick: l
		}, [W("span", Gb, [K("Panel " + P(e.index + 1), 1), e.count > 1 ? (H(), U(V, { key: 0 }, [K(" of " + P(e.count), 1)], 64)) : q("", !0)]), e.expanded ? q("", !0) : (H(), U("span", Kb, P(c.value), 1))], 8, Wb), e.count > 1 ? (H(), U(V, { key: 0 }, [
			W("button", {
				class: "link",
				disabled: e.index === 0,
				"aria-label": "Move panel up",
				onClick: u[0] ||= (t) => {
					R(n).commit((e) => Yu(e, o.value, -1)), R(n).selection.panel = e.index - 1;
				}
			}, "↑", 8, qb),
			W("button", {
				class: "link",
				disabled: e.index === e.count - 1,
				"aria-label": "Move panel down",
				onClick: u[1] ||= (t) => {
					R(n).commit((e) => Yu(e, o.value, 1)), R(n).selection.panel = e.index + 1;
				}
			}, "↓", 8, Jb),
			W("button", {
				class: "link danger",
				onClick: u[2] ||= (e) => R(n).commit((e) => Ju(e, o.value))
			}, "Remove")
		], 64)) : q("", !0)]), e.expanded ? (H(), U(V, { key: 0 }, [
			s.value ? q("", !0) : (H(), U(V, { key: 0 }, [u[5] ||= W("span", { class: "label" }, "Panel colour", -1), G(pb, {
				categories: R(n).categories.value,
				current: e.panel.category ?? null,
				label: `Panel ${e.index + 1} colour`,
				"allow-match": "",
				onPick: u[3] ||= (e) => R(n).commit((t) => Xu(t, o.value, e))
			}, null, 8, [
				"categories",
				"current",
				"label"
			])], 64)),
			(H(!0), U(V, null, B(e.panel.blocks, (t, n) => (H(), Ri(Hb, {
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
			W("div", Yb, [e.panel.blocks.length < 4 ? (H(), U("button", {
				key: 0,
				class: "btn dashed",
				onClick: u[4] ||= (e) => R(n).commit((e) => $u(e, o.value))
			}, "+ Add text line")) : q("", !0), i.value ? (H(), U("button", {
				key: 1,
				class: "btn dashed",
				title: r.value ? "Take the white box away" : "A white box to write in with a pen — type in it and it prints instead",
				onClick: a
			}, P(r.value ? "− Remove the write-on box" : "+ Add a box to write in"), 9, Xb)) : q("", !0)])
		], 64)) : q("", !0)], 2));
	}
}), Qb = {
	id: "part-editor",
	class: "card selected-card",
	"aria-labelledby": "part-heading"
}, $b = { class: "step-head" }, ex = ["aria-label"], tx = {
	key: 1,
	class: "step-no"
}, nx = ["aria-label"], rx = {
	key: 0,
	class: "row-controls wrap"
}, ix = ["aria-pressed"], ax = ["disabled"], ox = ["disabled"], sx = ["disabled"], cx = ["disabled"], lx = { class: "sub-head" }, ux = ["src"], dx = {
	class: "grow",
	style: { "min-width": "0" }
}, fx = { class: "symbol-name" }, px = { class: "small muted" }, mx = ["disabled", "onClick"], hx = ["disabled", "onClick"], gx = ["onClick"], _x = ["aria-label", "onClick"], vx = {
	key: 3,
	class: "row-controls"
}, yx = ["for"], bx = [
	"id",
	"min",
	"max",
	"value"
], xx = {
	key: 4,
	class: "small muted",
	style: { margin: "-6px 0 0" }
}, Sx = /* @__PURE__ */ z({
	__name: "PartEditor",
	setup(e) {
		let t = I_(), n = t.selection, r = () => t.view.value.doc, i = J(() => mu(r())), a = J(() => r().root.sections), o = J(() => t.product.value?.roadsign ?? !1), s = J(() => t.product.value?.fireaction ?? !1), c = J(() => s.value ? 1 : 4), l = J(() => t.board.steps.value[p.value] ?? null), u = J(() => o.value ? "arrow" : "symbol"), d = (e) => e[0].toUpperCase() + e.slice(1), f = J(() => lp(r())), p = J(() => f.value ? a.value.indexOf(f.value.source) : Math.min(n.section, a.value.length - 1)), m = J(() => a.value[p.value]), h = J(() => m.value.symbol_frame?.symbols ?? []), g = J(() => !f.value && (i.value === "grid" || i.value === "stacked" || i.value === "board")), _ = J(() => i.value === "stacked" ? "section" : "cell"), v = J(() => i.value === "board" ? Dh(r())[Oh(r(), p.value)] ?? null : null), y = J(() => {
			let e = v.value;
			return !e || e.cells < 2 ? null : p.value === e.start ? e.start + 1 : e.start;
		}), b = J(() => {
			let e = v.value;
			return e ? e.cells > 1 ? `Row ${e.index + 1}: ${p.value === e.start ? "left" : "right"} cell` : `Row ${e.index + 1}` : g.value ? `Editing ${_.value} ${p.value + 1} of ${a.value.length}` : f.value ? "Symbols & English text" : "Symbols & text";
		}), x = J(() => Kd(r())), S = J(() => {
			let e = r().root.layout;
			return e.type === "grid" ? e : null;
		}), C = J(() => t.shareRange()), w = (e) => {
			n.section = (p.value + e + a.value.length) % a.value.length, n.panel = 0;
		};
		function T(e) {
			let r = p.value + e;
			if (r < 0 || r >= a.value.length) return;
			let i = p.value;
			t.commit((e) => S.value ? Iu(e, i, r) : Fu(e, i, r)), n.section = r;
		}
		function E() {
			let e = 0;
			t.commit((t) => {
				e = Nu(t, p.value);
			}), n.section = e, n.panel = 0;
		}
		function D() {
			let e = m.value.text_frame.panels.length;
			t.commit((e) => qu(e, m.value.id)), n.panel = e;
		}
		let O = () => m.value.id;
		return (e, i) => (H(), U("section", Qb, [
			W("div", $b, [
				g.value ? (H(), U("button", {
					key: 0,
					class: "icon-btn",
					"aria-label": `Previous ${_.value}`,
					onClick: i[0] ||= (e) => w(-1)
				}, "‹", 8, ex)) : (H(), U("span", tx, P(R(t).product.value?.bilingual ? 5 : 4), 1)),
				W("h2", {
					id: "part-heading",
					class: "grow",
					style: j(g.value ? "text-align: center;" : "")
				}, P(b.value), 5),
				g.value ? (H(), U("button", {
					key: 2,
					class: "icon-btn",
					"aria-label": `Next ${_.value}`,
					onClick: i[1] ||= (e) => w(1)
				}, "›", 8, nx)) : q("", !0)
			]),
			g.value ? (H(), U("div", rx, [v.value ? (H(), U(V, { key: 0 }, [
				y.value === null ? q("", !0) : (H(), U("button", {
					key: 0,
					class: "btn small-btn",
					onClick: i[2] ||= (e) => {
						R(t).commit((e) => Kh(e, p.value, y.value)), R(n).section = y.value;
					}
				}, "⇄ Swap sides")),
				W("button", {
					class: "btn small-btn",
					onClick: i[3] ||= (e) => R(t).commit((e) => Ru(e, p.value))
				}, "Clear text"),
				s.value ? (H(), U("button", {
					key: 1,
					class: "btn small-btn",
					"aria-pressed": l.value !== null,
					onClick: i[4] ||= (e) => R(t).board.toggleStep(p.value)
				}, P(l.value === null ? "Number this step" : `Step ${l.value} — take the number away`), 9, ix)) : q("", !0),
				i[13] ||= W("span", { class: "small muted" }, "Rows are added and moved in the Rows card above.", -1)
			], 64)) : (H(), U(V, { key: 1 }, [
				W("button", {
					class: "btn small-btn",
					disabled: p.value === 0,
					onClick: i[5] ||= (e) => T(-1)
				}, P(S.value ? "← Swap back" : "↑ Move up"), 9, ax),
				W("button", {
					class: "btn small-btn",
					disabled: p.value === a.value.length - 1,
					onClick: i[6] ||= (e) => T(1)
				}, P(S.value ? "Swap forward →" : "↓ Move down"), 9, ox),
				S.value ? (H(), U(V, { key: 0 }, [W("button", {
					class: "btn small-btn",
					onClick: i[7] ||= (e) => R(t).commit((e) => Lu(e, p.value))
				}, "Copy to all cells"), W("button", {
					class: "btn small-btn",
					onClick: i[8] ||= (e) => R(t).commit((e) => Ru(e, p.value))
				}, "Clear text")], 64)) : (H(), U(V, { key: 1 }, [W("button", {
					class: "btn small-btn",
					disabled: a.value.length >= 4,
					onClick: E
				}, "+ Add section", 8, sx), W("button", {
					class: "btn small-btn danger",
					disabled: a.value.length <= 1,
					onClick: i[9] ||= (e) => R(t).commit((e) => Pu(e, p.value))
				}, "Remove section", 8, cx)], 64))
			], 64))])) : q("", !0),
			W("div", lx, P(d(h.value.length === 1 ? u.value : `${u.value}s`)), 1),
			(H(!0), U(V, null, B(h.value, (e, n) => (H(), U("div", {
				key: e.id,
				class: "symbol-row"
			}, [
				R(t).symbolEntry(e.symbol_code) ? (H(), U("img", {
					key: 0,
					src: R(t).symbolEntry(e.symbol_code).url,
					alt: ""
				}, null, 8, ux)) : q("", !0),
				W("div", dx, [W("div", fx, P(R(t).symbolEntry(e.symbol_code)?.name ?? e.symbol_code), 1), W("div", px, P(e.symbol_code), 1)]),
				h.value.length > 1 ? (H(), U(V, { key: 1 }, [W("button", {
					class: "icon-btn",
					disabled: n === 0,
					"aria-label": "Move symbol earlier",
					onClick: (e) => R(t).commit((e) => Hu(e, O(), n, n - 1))
				}, "‹", 8, mx), W("button", {
					class: "icon-btn",
					disabled: n === h.value.length - 1,
					"aria-label": "Move symbol later",
					onClick: (e) => R(t).commit((e) => Hu(e, O(), n, n + 1))
				}, "›", 8, hx)], 64)) : q("", !0),
				W("button", {
					class: "btn small-btn strong",
					onClick: (e) => R(t).openPicker({
						sectionId: O(),
						index: n
					})
				}, "Change", 8, gx),
				W("button", {
					class: "icon-btn danger",
					"aria-label": `Remove ${e.symbol_code}`,
					onClick: (e) => R(t).commit((e) => Vu(e, O(), n))
				}, "×", 8, _x)
			]))), 128)),
			!h.value.length && !o.value ? (H(), U(V, { key: 1 }, [i[14] ||= W("p", {
				class: "small muted",
				style: { margin: "0" }
			}, "Text only. Colour:", -1), G(pb, {
				categories: R(t).categories.value,
				current: m.value.category ?? null,
				label: "Section colour",
				onPick: i[10] ||= (e) => e && R(t).commit((t) => Ku(t, O(), e))
			}, null, 8, ["categories", "current"])], 64)) : q("", !0),
			h.value.length < c.value ? (H(), U("button", {
				key: 2,
				class: "btn dashed",
				onClick: i[11] ||= (e) => R(t).openPicker({
					sectionId: O(),
					index: "new"
				})
			}, "+ Add " + P(u.value), 1)) : q("", !0),
			h.value.length ? (H(), U("div", vx, [W("label", {
				class: "label",
				for: `share-${m.value.id}`,
				style: { "white-space": "nowrap" }
			}, P(d(u.value)) + " size", 9, yx), W("input", {
				id: `share-${m.value.id}`,
				class: "grow",
				type: "range",
				min: C.value.min,
				max: C.value.max,
				step: "0.005",
				value: m.value.symbol_share,
				onInput: i[12] ||= (e) => R(t).commit((t) => Gu(t, O(), Number(e.target.value)), `share:${O()}`)
			}, null, 40, bx)])) : q("", !0),
			h.value.length && g.value && Uu(r()) ? (H(), U("p", xx, P(d(u.value)) + " size applies to every " + P(_.value) + " while they are lined up. ", 1)) : q("", !0),
			i[15] ||= W("div", { class: "sub-head" }, "Text", -1),
			(H(!0), U(V, null, B(m.value.text_frame.panels, (e, t) => (H(), Ri(Zb, {
				key: e.id,
				panel: e,
				index: t,
				count: m.value.text_frame.panels.length,
				"section-index": p.value,
				expanded: t === R(n).panel,
				"nudge-range": x.value
			}, null, 8, [
				"panel",
				"index",
				"count",
				"section-index",
				"expanded",
				"nudge-range"
			]))), 128)),
			m.value.text_frame.panels.length < 4 && !o.value && !s.value ? (H(), U("button", {
				key: 5,
				class: "btn dashed",
				onClick: D
			}, "+ Add panel")) : q("", !0)
		]));
	}
}), Cx = {
	class: "card",
	"aria-labelledby": "sign-heading"
}, wx = {
	key: 0,
	class: "row-controls"
}, Tx = ["value"], Ex = ["value"], Dx = ["value"], Ox = ["value"], kx = {
	key: 1,
	class: "row-controls"
}, Ax = {
	class: "label",
	id: "position-label"
}, jx = {
	class: "segmented",
	role: "group",
	"aria-labelledby": "position-label"
}, Mx = ["aria-pressed", "onClick"], Nx = {
	key: 2,
	class: "check"
}, Px = ["checked"], Fx = {
	key: 3,
	class: "check"
}, Ix = ["checked"], Lx = {
	key: 4,
	class: "check"
}, Rx = ["checked"], zx = { class: "row-controls" }, Bx = {
	class: "segmented",
	role: "group",
	"aria-labelledby": "background-label"
}, Vx = ["aria-pressed"], Hx = ["aria-pressed"], Ux = {
	key: 5,
	class: "check small-check"
}, Wx = ["checked"], Gx = { class: "check" }, Kx = ["checked"], qx = /* @__PURE__ */ z({
	__name: "SignOptions",
	setup(e) {
		let t = I_(), n = () => t.view.value.doc, r = J(() => mu(n())), i = J(() => up(n())), a = J(() => {
			let e = n().root.layout;
			return e.type === "grid" && !i.value ? e : null;
		}), o = Array.from({ length: 4 }, (e, t) => t + 1), s = J(() => n().root.sections.some((e) => e.symbol_frame)), c = J(() => yu(n())), l = [
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
		return (e, i) => (H(), U("section", Cx, [
			i[17] ||= W("div", { class: "step-head" }, [W("span", { class: "step-no" }, "3"), W("h2", { id: "sign-heading" }, "Whole sign")], -1),
			a.value ? (H(), U("div", wx, [
				i[9] ||= W("label", {
					class: "label",
					for: "grid-rows"
				}, "Rows", -1),
				W("select", {
					id: "grid-rows",
					class: "field compact",
					value: a.value.rows,
					onChange: i[0] ||= (e) => R(t).commit((t) => Eu(t, Number(e.target.value), a.value.cols))
				}, [(H(!0), U(V, null, B(R(o), (e) => (H(), U("option", {
					key: e,
					value: e
				}, P(e), 9, Ex))), 128))], 40, Tx),
				i[10] ||= W("label", {
					class: "label",
					for: "grid-cols"
				}, "Columns", -1),
				W("select", {
					id: "grid-cols",
					class: "field compact",
					value: a.value.cols,
					onChange: i[1] ||= (e) => R(t).commit((t) => Eu(t, a.value.rows, Number(e.target.value)))
				}, [(H(!0), U(V, null, B(R(o), (e) => (H(), U("option", {
					key: e,
					value: e
				}, P(e), 9, Ox))), 128))], 40, Dx)
			])) : q("", !0),
			s.value ? (H(), U("div", kx, [W("span", Ax, "Symbol" + P(r.value === "single" ? "" : "s"), 1), W("div", jx, [(H(), U(V, null, B(l, (e) => W("button", {
				key: e.key,
				"aria-pressed": c.value === e.key,
				onClick: (n) => R(t).commit((t) => bu(t, e.key))
			}, P(e.label), 9, Mx)), 64))])])) : q("", !0),
			a.value ? (H(), U("label", Nx, [W("input", {
				type: "checkbox",
				checked: a.value.sync_text,
				onChange: i[2] ||= (e) => R(t).commit((t) => Pd(t, e.target.checked))
			}, null, 40, Px), i[11] ||= K(" Same text size in every cell ", -1)])) : q("", !0),
			r.value === "grid" || r.value === "stacked" ? (H(), U("label", Fx, [W("input", {
				type: "checkbox",
				checked: Uu(n()),
				onChange: i[3] ||= (e) => R(t).commit((t) => Wu(t, e.target.checked))
			}, null, 40, Ix), i[12] ||= K(" Line up symbols and panels ", -1)])) : q("", !0),
			n().root.layout.type === "grid" ? (H(), U("label", Lx, [W("input", {
				type: "checkbox",
				checked: Fd(n()),
				onChange: i[4] ||= (e) => R(t).commit((t) => Id(t, e.target.checked))
			}, null, 40, Rx), i[13] ||= K(" Outline round each cell ", -1)])) : q("", !0),
			W("div", zx, [i[14] ||= W("span", {
				class: "label",
				id: "background-label"
			}, "Background", -1), W("div", Bx, [W("button", {
				"aria-pressed": wd(n()) === "white",
				onClick: i[5] ||= (e) => R(t).commit((e) => jd(e, "white", R(t).categories.value))
			}, "White", 8, Vx), W("button", {
				"aria-pressed": wd(n()) === "colour",
				onClick: i[6] ||= (e) => R(t).commit((e) => jd(e, "colour", R(t).categories.value))
			}, "All colour", 8, Hx)])]),
			wd(n()) === "colour" && s.value ? (H(), U("label", Ux, [W("input", {
				type: "checkbox",
				checked: Od(n().root.sections[0]),
				onChange: i[7] ||= (e) => R(t).commit((t) => kd(t, e.target.checked))
			}, null, 40, Wx), i[15] ||= K(" White panel behind the symbol ", -1)])) : q("", !0),
			W("label", Gx, [W("input", {
				type: "checkbox",
				checked: Md(n(), R(t).roundedByDefault()),
				onChange: i[8] ||= (e) => R(t).commit((t) => Nd(t, e.target.checked))
			}, null, 40, Kx), i[16] ||= K(" Rounded panel corners ", -1)])
		]));
	}
}), Jx = {
	id: "translation-card",
	class: "card",
	"aria-labelledby": "translation-heading"
}, Yx = { class: "step-head" }, Xx = { class: "step-no" }, Zx = ["value"], Qx = ["value"], $x = {
	class: "segmented",
	role: "group",
	"aria-label": "Arrangement"
}, eS = ["aria-pressed"], tS = ["aria-pressed"], nS = {
	class: "label",
	id: "tr-order"
}, rS = {
	class: "segmented",
	role: "group",
	"aria-labelledby": "tr-order"
}, iS = ["aria-pressed"], aS = ["aria-pressed"], oS = ["for"], sS = { class: "tr-source" }, cS = [
	"id",
	"lang",
	"rows",
	"value",
	"disabled",
	"placeholder",
	"aria-busy",
	"onInput"
], lS = {
	key: 0,
	class: "row-controls wrap small"
}, uS = ["onClick"], dS = ["onClick"], fS = {
	key: 1,
	class: "small muted"
}, pS = {
	key: 0,
	class: "spinner",
	"aria-hidden": "true"
}, mS = { class: "row-controls wrap" }, hS = { class: "check-box" }, gS = { style: { margin: "0" } }, _S = {
	class: "check",
	style: { "font-weight": "600" }
}, vS = ["checked"], yS = /* @__PURE__ */ z({
	__name: "TranslationCard",
	props: { step: {} },
	setup(e) {
		let t = I_(), n = () => t.view.value.doc, r = J(() => lp(n())), i = J(() => xp(n())), a = J(() => r.value?.target.lang ?? ""), o = J(() => pp(n())), s = J(() => Ap(n())), c = J(() => o.value === "side" ? "on the left" : "on top");
		function l(e) {
			t.commit((t) => yp(t, e)), t.prepareTranslation(e);
		}
		let u = J(() => t.state.translating ? `Translating into ${op(a.value)}…` : t.state.translateError);
		return (n, d) => (H(), U("section", Jx, [W("div", Yx, [W("span", Xx, P(e.step), 1), d[7] ||= W("h2", { id: "translation-heading" }, "Second language", -1)]), r.value ? (H(), U(V, { key: 0 }, [
			d[11] ||= W("label", {
				class: "sr-only",
				for: "tr-lang"
			}, "Second language", -1),
			W("select", {
				id: "tr-lang",
				class: "field",
				value: a.value,
				onChange: d[0] ||= (e) => l(e.target.value)
			}, [(H(!0), U(V, null, B(ap, (e) => (H(), U("option", {
				key: e.code,
				value: e.code
			}, P(e.name) + " · " + P(e.native), 9, Qx))), 128))], 40, Zx),
			W("div", $x, [W("button", {
				class: "grow",
				"aria-pressed": o.value === "side",
				onClick: d[1] ||= (e) => R(t).commit((e) => vp(e, "side"))
			}, "Side by side", 8, eS), W("button", {
				class: "grow",
				"aria-pressed": o.value === "stacked",
				onClick: d[2] ||= (e) => R(t).commit((e) => vp(e, "stacked"))
			}, "One above the other", 8, tS)]),
			W("span", nS, "Which language comes first (" + P(c.value) + ")?", 1),
			W("div", rS, [W("button", {
				class: "grow",
				"aria-pressed": !s.value,
				onClick: d[3] ||= (e) => R(t).commit((e) => jp(e, !1))
			}, "English first", 8, iS), W("button", {
				class: "grow",
				"aria-pressed": s.value,
				onClick: d[4] ||= (e) => R(t).commit((e) => jp(e, !0))
			}, P(op(a.value)) + " first", 9, aS)]),
			d[12] ||= W("div", { class: "sub-head" }, "Translated wording", -1),
			d[13] ||= W("p", {
				class: "small muted",
				style: { margin: "0" }
			}, "Write the English in the text step; the translation follows. You can also type over any line here.", -1),
			(H(!0), U(V, null, B(i.value, (e, n) => (H(), U("div", {
				key: e.id,
				class: "tr-line"
			}, [
				W("label", {
					class: "label",
					for: `tr-${e.id}`
				}, [K(" Line " + P(n + 1) + ": ", 1), W("span", sS, P(e.source.trim() || "(blank)"), 1)], 8, oS),
				W("textarea", {
					id: `tr-${e.id}`,
					class: pe(["field area", { "is-busy": R(t).translatingIds.value.includes(e.id) }]),
					lang: a.value,
					rows: Math.min(3, Math.max(1, e.text.split("\n").length)),
					value: e.text,
					disabled: !e.source.trim(),
					placeholder: e.source.trim() ? R(t).translatingIds.value.includes(e.id) ? "Translating…" : "Translation" : "",
					"aria-busy": R(t).translatingIds.value.includes(e.id),
					onInput: (n) => R(t).commit((t) => Tp(t, e.id, n.target.value), `tr:${e.id}`)
				}, null, 42, cS),
				e.manual && e.stale && e.source.trim() ? (H(), U("div", lS, [
					d[8] ||= W("span", {
						class: "grow",
						style: { color: "var(--danger)" }
					}, "The English changed since you typed this.", -1),
					W("button", {
						class: "link",
						onClick: (n) => R(t).commit((t) => Ep(t, e.id))
					}, "Keep mine", 8, uS),
					R(t).translatorName ? (H(), U("button", {
						key: 0,
						class: "link",
						onClick: (n) => R(t).commit((t) => kp(t, e.id))
					}, "Translate again", 8, dS)) : q("", !0)
				])) : e.manual ? (H(), U("span", fS, "Typed by you")) : q("", !0)
			]))), 128)),
			u.value ? (H(), U("p", {
				key: 0,
				class: pe(["small tr-status", { busy: R(t).state.translating }]),
				role: "status"
			}, [R(t).state.translating ? (H(), U("span", pS)) : q("", !0), K(P(u.value), 1)], 2)) : q("", !0),
			W("div", mS, [R(t).translatorName ? (H(), U("button", {
				key: 0,
				class: "btn small-btn",
				onClick: d[5] ||= (e) => R(t).translateAgain()
			}, "Translate all again")) : q("", !0)]),
			W("div", hS, [
				d[10] ||= W("strong", null, "Please check this translation", -1),
				W("p", gS, P(r.value.meta.machine ? "Translations are made automatically. Safety signs must be understood exactly, so ask a native speaker to check the wording before you order." : "Safety signs must be understood exactly, so ask a native speaker to check the wording before you order."), 1),
				W("label", _S, [W("input", {
					type: "checkbox",
					checked: r.value.meta.checked,
					onChange: d[6] ||= (e) => R(t).commit((t) => Dp(t, e.target.checked))
				}, null, 40, vS), d[9] ||= K(" I have checked the translation ", -1)])
			])
		], 64)) : q("", !0)]));
	}
}), bS = /* @__PURE__ */ z({
	__name: "AdvancedPanel",
	setup(e) {
		let t = I_(), n = J(() => t.variantSizes.value.length > 0), r = J(() => mu(t.view.value.doc)), i = J(() => t.product.value?.bilingual ?? !1);
		function a(e) {
			let n = null;
			t.commit((t) => {
				n = xu(t, e);
			}), t.selection.section = 0, t.selection.panel = 0;
			let r = n, i = t.view.value.doc;
			r && i && t.openPicker({
				sectionId: i.root.sections[r.section].id,
				index: r.symbol
			});
		}
		return (e, o) => (H(), U(V, null, [
			G(eb, {
				current: r.value,
				only: i.value ? ["single", "multi"] : void 0,
				onPick: a
			}, null, 8, ["current", "only"]),
			n.value ? (H(), Ri(uy, {
				key: 0,
				step: 2
			})) : (H(), Ri(ny, {
				key: 1,
				sizes: R(t).sizes.value,
				current: R(t).currentSize.value,
				step: 2,
				custom: "",
				dimensions: R(t).currentDimensions.value,
				onPick: R(t).pickSize,
				onCustom: R(t).setCustomSize
			}, null, 8, [
				"sizes",
				"current",
				"dimensions",
				"onPick",
				"onCustom"
			])),
			r.value === "grid" || r.value === "stacked" ? (H(), Ri(lb, {
				key: 2,
				kind: "cells"
			})) : r.value === "multi" ? (H(), Ri(lb, {
				key: 3,
				kind: "symbols"
			})) : q("", !0),
			G(Q_),
			G(qx),
			i.value ? (H(), Ri(yS, {
				key: 4,
				step: 4
			})) : q("", !0),
			G(Sx)
		], 64));
	}
}), xS = {
	class: "card",
	"aria-labelledby": "board-heading"
}, SS = { class: "step-head" }, CS = { class: "small muted" }, wS = {
	key: 0,
	class: "templates"
}, TS = {
	class: "small muted",
	style: { margin: "0" }
}, ES = { class: "row-controls wrap" }, DS = [
	"disabled",
	"title",
	"onClick"
], OS = { class: "row-controls wrap board-size" }, kS = ["value"], AS = ["value"], jS = {
	class: "segmented",
	role: "group",
	"aria-label": "Columns below the header"
}, MS = ["aria-pressed", "onClick"], NS = {
	class: "rows",
	role: "list"
}, PS = [
	"onDragstart",
	"onDragover",
	"onDragleave",
	"onDrop"
], FS = [
	"aria-pressed",
	"aria-label",
	"title",
	"onClick"
], IS = ["aria-pressed", "onClick"], LS = { class: "row-words" }, RS = {
	key: 0,
	class: "small muted"
}, zS = { class: "row-buttons" }, BS = ["disabled", "onClick"], VS = ["disabled", "onClick"], HS = [
	"aria-label",
	"title",
	"onClick"
], US = ["disabled", "onClick"], WS = ["disabled", "onClick"], GS = { class: "row-height" }, KS = ["value", "onChange"], qS = ["value"], JS = { class: "row-controls wrap" }, YS = ["disabled"], XS = ["disabled"], ZS = ["disabled"], QS = {
	key: 1,
	class: "row-controls wrap"
}, $S = ["max", "value"], eC = { class: "small muted" }, tC = {
	key: 2,
	class: "small muted",
	style: { margin: "0" }
}, nC = {
	key: 3,
	class: "small muted",
	style: { margin: "0" }
}, rC = {
	key: 4,
	class: "small muted",
	style: { margin: "0" }
}, iC = /* @__PURE__ */ z({
	__name: "BoardStep",
	setup(e) {
		let t = I_(), n = J(() => !(t.product.value?.fireaction ?? !1)), r = J(() => t.product.value?.fireaction ?? !1), i = () => t.view.value.doc, a = t.board.rows, o = t.board.selectedRow, s = /* @__PURE__ */ L(!1), c = /* @__PURE__ */ L(null), l = /* @__PURE__ */ L(null), u = J(() => a.value.length >= 8), d = J(() => r.value || a.value.length <= 1);
		async function f(e) {
			s.value = !0;
			try {
				await t.board.useTemplate(e);
			} finally {
				s.value = !1;
			}
		}
		function p(e) {
			let t = i().root.sections.slice(e.start, e.start + e.cells).map((e) => e.placeholder ? kh : e.text_frame.panels.flatMap((e) => e.blocks.map((e) => e.text)).filter(Boolean).join(" ").trim()).filter(Boolean).join("  |  ");
			if (t) return t;
			let n = i().root.sections.slice(e.start, e.start + e.cells).flatMap((e) => e.symbol_frame?.symbols.map((e) => e.symbol_code) ?? []);
			return n.length ? `${n.join(", ")} on its own` : "Empty row";
		}
		let m = J(() => {
			let e = a.value[o.value];
			return !!e && h(e);
		}), h = (e) => i().root.sections.slice(e.start, e.start + e.cells).every((e) => e.placeholder), g = (e) => Th.reduce((t, n) => Math.abs(n.weight - e) < Math.abs(t - e) ? n.weight : t, 1);
		function _(e) {
			let n = i().root.sections[e.start], r = n?.text_frame.panels[0]?.category ?? n?.category, a = t.categories.value.find((e) => e.key === r);
			return n?.text_frame.panels[0]?.fill ? "#ffffff" : a?.panel.hex ?? "#ffffff";
		}
		let v = (e) => t.board.steps.value[e.start] ?? null;
		function y(e) {
			let n = c.value;
			c.value = null, l.value = null, n !== null && n !== e && t.board.move(n, e);
		}
		return (e, i) => (H(), U("section", xS, [
			W("div", SS, [
				i[6] ||= W("span", { class: "step-no" }, "1", -1),
				i[7] ||= W("h2", {
					id: "board-heading",
					class: "grow"
				}, "Rows", -1),
				W("span", CS, P(R(a).length) + " of " + P(R(8)), 1)
			]),
			d.value ? (H(), U("div", wS, [W("p", TS, " Start from a ready-made " + P(r.value ? "notice" : "board") + ", then change what you like: ", 1), W("div", ES, [(H(!0), U(V, null, B(R(t).board.templates.value, (e) => (H(), U("button", {
				key: e.id,
				class: "btn small-btn strong",
				disabled: s.value,
				title: e.hint,
				onClick: (t) => f(e.id)
			}, P(e.label), 9, DS))), 128))])])) : q("", !0),
			W("div", OS, [
				i[10] ||= W("label", {
					class: "label",
					for: "board-rows"
				}, "Rows", -1),
				W("select", {
					id: "board-rows",
					class: "field compact",
					value: R(a).length,
					onChange: i[0] ||= (e) => R(t).board.setRowCount(Number(e.target.value))
				}, [(H(!0), U(V, null, B(R(8), (e) => (H(), U("option", {
					key: e,
					value: e
				}, P(e), 9, AS))), 128))], 40, kS),
				n.value ? (H(), U(V, { key: 0 }, [
					i[8] ||= W("span", { class: "label" }, "Columns", -1),
					W("div", jS, [(H(!0), U(V, null, B(R(2), (e) => (H(), U("button", {
						key: e,
						"aria-pressed": R(t).board.columns.value === e,
						onClick: (n) => R(t).board.setColumns(e)
					}, P(e), 9, MS))), 128))]),
					i[9] ||= W("span", { class: "small muted" }, "below the header", -1)
				], 64)) : q("", !0)
			]),
			W("ul", NS, [(H(!0), U(V, null, B(R(a), (e) => (H(), U("li", {
				key: e.index,
				class: pe(["board-row", {
					on: e.index === R(o),
					over: l.value === e.index,
					empty: h(e)
				}]),
				draggable: "true",
				onDragstart: (t) => c.value = e.index,
				onDragend: i[1] ||= (e) => {
					c.value = null, l.value = null;
				},
				onDragover: po((t) => l.value = e.index, ["prevent"]),
				onDragleave: (t) => l.value === e.index && (l.value = null),
				onDrop: po((t) => y(e.index), ["prevent"])
			}, [
				i[12] ||= W("span", {
					class: "grip",
					"aria-hidden": "true"
				}, "⠿", -1),
				W("span", {
					class: "row-colour",
					style: j({ background: _(e) }),
					"aria-hidden": "true"
				}, null, 4),
				r.value ? (H(), U("button", {
					key: 0,
					class: "step-toggle",
					"aria-pressed": v(e) !== null,
					"aria-label": v(e) === null ? "Give this row a number" : `Take away this row\u2019s number, ${v(e)}`,
					title: v(e) === null ? "This row has no number. Click to number it." : "Click to take the number away.",
					onClick: (n) => R(t).board.toggleStep(e.start)
				}, P(v(e) ?? "–"), 9, FS)) : q("", !0),
				W("button", {
					class: "row-text grow",
					"aria-pressed": e.index === R(o),
					onClick: (n) => R(t).board.select(e.index)
				}, [W("span", LS, P(p(e)), 1), n.value ? (H(), U("span", RS, P(e.cells === 2 ? "Two cells" : "Full width"), 1)) : q("", !0)], 8, IS),
				W("div", zS, [
					W("button", {
						class: "icon-btn",
						disabled: e.index === 0,
						"aria-label": "Move row up",
						onClick: (n) => R(t).board.move(e.index, e.index - 1)
					}, "↑", 8, BS),
					W("button", {
						class: "icon-btn",
						disabled: e.index === R(a).length - 1,
						"aria-label": "Move row down",
						onClick: (n) => R(t).board.move(e.index, e.index + 1)
					}, "↓", 8, VS),
					n.value ? (H(), U("button", {
						key: 0,
						class: "icon-btn",
						"aria-label": e.cells === 2 ? "Make this row full width" : "Split this row into two",
						title: e.cells === 2 ? "Make full width" : "Split into two",
						onClick: (n) => R(t).board.setCells(e.index, e.cells === 2 ? 1 : 2)
					}, P(e.cells === 2 ? "▭" : "▥"), 9, HS)) : q("", !0),
					W("button", {
						class: "icon-btn",
						"aria-label": "Duplicate row",
						title: "Duplicate",
						disabled: u.value,
						onClick: (n) => R(t).board.duplicate(e.index)
					}, "⧉", 8, US),
					W("button", {
						class: "icon-btn danger",
						"aria-label": "Remove row",
						disabled: R(a).length <= 1,
						onClick: (n) => R(t).board.remove(e.index)
					}, "×", 8, WS)
				]),
				W("label", GS, [i[11] ||= W("span", { class: "visually-hidden" }, "Row height", -1), W("select", {
					class: "field small-field",
					value: g(e.weight),
					onChange: (n) => R(t).board.setWeight(e.index, Number(n.target.value))
				}, [(H(!0), U(V, null, B(R(Th), (e) => (H(), U("option", {
					key: e.label,
					value: e.weight
				}, P(e.label), 9, qS))), 128))], 40, KS)])
			], 42, PS))), 128))]),
			W("div", JS, [
				W("button", {
					class: "btn strong",
					disabled: u.value || s.value,
					onClick: i[2] ||= (e) => R(t).board.openPicker("add", R(o))
				}, "+ Add a standard row", 8, YS),
				W("button", {
					class: "btn",
					disabled: u.value || s.value,
					onClick: i[3] ||= (e) => R(t).board.add(null, R(o))
				}, "+ Blank row", 8, XS),
				W("button", {
					class: "btn small-btn",
					disabled: s.value || R(o) < 0,
					onClick: i[4] ||= (e) => R(t).board.openPicker("replace", R(a)[R(o)]?.start ?? 0)
				}, P(m.value ? "Choose a message for this row" : "Replace this row"), 9, ZS)
			]),
			r.value ? (H(), U("div", QS, [
				i[13] ||= W("label", {
					class: "label",
					for: "notice-corner"
				}, "Corner rounding", -1),
				W("input", {
					id: "notice-corner",
					type: "range",
					min: "0",
					max: R(t).board.corner.value.max,
					step: "any",
					value: R(t).board.corner.value.mm,
					onInput: i[5] ||= (e) => R(t).board.setCorner(Number(e.target.value))
				}, null, 40, $S),
				W("span", eC, P(R(t).board.corner.value.mm.toFixed(1)) + " mm" + P(R(t).board.corner.value.mm ? "" : " — square"), 1)
			])) : q("", !0),
			r.value ? (H(), U("p", tC, " The number on the left of a row turns its number on and off — the rest renumber themselves. ")) : q("", !0),
			u.value ? (H(), U("p", nC, "That is as many rows as one board takes.")) : (H(), U("p", rC, "Drag a row by its handle to move it, or use the arrows."))
		]));
	}
}), aC = /* @__PURE__ */ z({
	__name: "BoardPanel",
	setup(e) {
		let t = I_(), n = J(() => t.variantSizes.value.length > 0);
		return (e, r) => (H(), U(V, null, [
			R(t).board.rows.value.length > 1 ? (H(), Ri(lb, {
				key: 0,
				kind: "cells"
			})) : q("", !0),
			G(iC),
			n.value ? (H(), Ri(uy, {
				key: 1,
				step: 2
			})) : (H(), Ri(ny, {
				key: 2,
				sizes: R(t).sizes.value,
				current: R(t).currentSize.value,
				step: 2,
				custom: "",
				dimensions: R(t).currentDimensions.value,
				onPick: R(t).pickSize,
				onCustom: R(t).setCustomSize
			}, null, 8, [
				"sizes",
				"current",
				"dimensions",
				"onPick",
				"onCustom"
			])),
			G(Sx)
		], 64));
	}
}), oC = {
	class: "card",
	"aria-labelledby": "scheme-heading"
}, sC = {
	class: "swatches",
	role: "group",
	"aria-label": "Sign colour"
}, cC = ["aria-pressed", "onClick"], lC = {
	class: "small muted",
	style: { margin: "0" }
}, uC = {
	key: 0,
	class: "card",
	"aria-labelledby": "road-size-heading"
}, dC = {
	class: "chips",
	style: { "grid-template-columns": "repeat(2, minmax(0, 1fr))" },
	role: "group",
	"aria-label": "Sign size"
}, fC = ["aria-pressed", "onClick"], pC = {
	key: 1,
	class: "card",
	"aria-labelledby": "arrow-place-heading"
}, mC = { class: "row-controls" }, hC = {
	class: "segmented",
	role: "group",
	"aria-labelledby": "arrow-place-label"
}, gC = ["aria-pressed", "onClick"], _C = /* @__PURE__ */ z({
	__name: "RoadSignPanel",
	props: { sizes: {
		type: Boolean,
		default: !0
	} },
	setup(e) {
		let t = e, n = I_(), r = n.roadSign, i = () => n.view.value.doc, a = J(() => (n.rev.value, !!i().root.sections[0]?.symbol_frame)), o = J(() => (n.rev.value, yu(i()))), s = [
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
		return (e, i) => (H(), U(V, null, [
			W("section", oC, [
				i[0] ||= W("div", { class: "step-head" }, [W("span", { class: "step-no" }, "1"), W("h2", { id: "scheme-heading" }, "Colour")], -1),
				W("div", sC, [(H(!0), U(V, null, B(R(r).schemes, (e) => (H(), U("button", {
					key: e.key,
					class: "swatch",
					"aria-pressed": R(r).scheme.value.key === e.key,
					onClick: (t) => R(r).setScheme(e.key)
				}, [W("span", {
					class: "dot",
					style: j({
						background: e.face.hex,
						borderColor: e.ink.hex
					})
				}, null, 4), K(" " + P(e.label), 1)], 8, cC))), 128))]),
				W("p", lC, " Printed onto " + P(R(r).scheme.value.label.toLowerCase()) + " reflective material, so the " + P(R(r).scheme.value.label.toLowerCase()) + " itself is not printed — only the border, wording and arrow. ", 1)
			]),
			t.sizes ? (H(), U("section", uC, [
				i[1] ||= W("div", { class: "step-head" }, [W("span", { class: "step-no" }, "2"), W("h2", { id: "road-size-heading" }, "Size")], -1),
				W("div", dC, [(H(!0), U(V, null, B(R(r).sizes, (e) => (H(), U("button", {
					key: e.name,
					class: "chip",
					"aria-pressed": R(r).size.value?.name === e.name,
					onClick: (t) => R(r).setSize(e)
				}, P(e.width) + "×" + P(e.height), 9, fC))), 128))]),
				i[2] ||= W("p", {
					class: "small muted",
					style: { margin: "0" }
				}, "These fit our standard frames, so there is no custom size.", -1)
			])) : q("", !0),
			a.value ? (H(), U("section", pC, [i[4] ||= W("div", { class: "step-head" }, [W("span", { class: "step-no" }, "3"), W("h2", { id: "arrow-place-heading" }, "Arrow")], -1), W("div", mC, [i[3] ||= W("span", {
				class: "label",
				id: "arrow-place-label"
			}, "Goes", -1), W("div", hC, [(H(), U(V, null, B(s, (e) => W("button", {
				key: e.key,
				"aria-pressed": o.value === e.key,
				onClick: (t) => R(n).commit((t) => bu(t, e.key))
			}, P(e.label), 9, gC)), 64))])])])) : q("", !0),
			G(Sx)
		], 64));
	}
}), vC = {
	class: "card outlined",
	"aria-labelledby": "rows-heading"
}, yC = { class: "step-head" }, bC = {
	id: "rows-heading",
	class: "grow"
}, xC = {
	key: 0,
	class: "tabs",
	role: "tablist",
	"aria-label": "Kinds of row"
}, SC = ["aria-selected", "onClick"], CC = {
	key: 1,
	class: "notice",
	role: "alert"
}, wC = {
	key: 2,
	class: "small muted",
	style: { margin: "0" }
}, TC = { class: "sub-head" }, EC = [
	"disabled",
	"title",
	"onClick"
], DC = ["innerHTML"], OC = { class: "preset-label" }, kC = { class: "small muted preset-words" }, AC = /* @__PURE__ */ z({
	__name: "RowPicker",
	setup(e) {
		let t = I_(), n = /* @__PURE__ */ L(""), r = /* @__PURE__ */ L("all"), i = /* @__PURE__ */ L(null), a = /* @__PURE__ */ L("");
		or(() => {
			i.value?.focus(), t.board.loadThumbs();
		});
		let o = J(() => t.board.picker.value?.mode === "replace"), s = J(() => t.board.presets.value), c = J(() => {
			let e = n.value.trim().toLowerCase();
			return s.value.filter((t) => e || r.value === "all" || t.group === r.value).map((t) => ({
				...t,
				presets: e ? t.presets.filter((t) => `${t.label} ${u(t)}`.toLowerCase().includes(e)) : t.presets
			})).filter((e) => e.presets.length);
		}), l = J(() => ["all", ...s.value.map((e) => e.group)]);
		function u(e) {
			return e.section.panels[0]?.lines.map((e) => e.text).join(" — ") ?? "";
		}
		async function d(e) {
			a.value = e.id;
			try {
				await t.board.takePreset(e);
			} finally {
				a.value = "";
			}
		}
		return (e, s) => (H(), U("section", vC, [
			W("div", yC, [W("h2", bC, P(o.value ? "Choose a message for this row" : "Add a row"), 1), W("button", {
				class: "btn go",
				style: {
					height: "40px",
					"font-size": "15px"
				},
				onClick: s[0] ||= (e) => R(t).board.closePicker()
			}, "Done")]),
			s[2] ||= W("label", {
				class: "label",
				for: "row-search"
			}, "Search the standard rows", -1),
			An(W("input", {
				id: "row-search",
				ref_key: "search",
				ref: i,
				"onUpdate:modelValue": s[1] ||= (e) => n.value = e,
				class: "field",
				type: "search",
				placeholder: "e.g. helmet, children, smoking"
			}, null, 512), [[lo, n.value]]),
			n.value.trim() ? q("", !0) : (H(), U("div", xC, [(H(!0), U(V, null, B(l.value, (e) => (H(), U("button", {
				key: e,
				role: "tab",
				"aria-selected": r.value === e,
				onClick: (t) => r.value = e
			}, P(e === "all" ? "All" : e), 9, SC))), 128))])),
			R(t).state.symbolError ? (H(), U("p", CC, P(R(t).state.symbolError), 1)) : q("", !0),
			c.value.length ? q("", !0) : (H(), U("p", wC, " No standard row matches that. Close this and use “Blank row” to write your own wording. ")),
			(H(!0), U(V, null, B(c.value, (e) => (H(), U("div", {
				key: e.group,
				class: "preset-group"
			}, [W("div", TC, P(e.group), 1), (H(!0), U(V, null, B(e.presets, (e) => (H(), U("button", {
				key: e.id,
				class: pe(["preset", [`cat-${e.section.colour ?? "plain"}`, {
					busy: a.value === e.id,
					drawn: !!R(t).board.thumb(e)
				}]]),
				disabled: !!a.value,
				title: u(e),
				onClick: (t) => d(e)
			}, [R(t).board.thumb(e) ? (H(), U("span", {
				key: 0,
				class: "preset-art",
				innerHTML: R(t).board.thumb(e)
			}, null, 8, DC)) : (H(), U(V, { key: 1 }, [W("span", OC, P(e.label), 1), W("span", kC, P(u(e)), 1)], 64))], 10, EC))), 128))]))), 128))
		]));
	}
}), jC = {
	key: 0,
	class: "topbar"
}, MC = {
	key: 0,
	class: "loading"
}, NC = {
	key: 1,
	class: "notice",
	role: "alert"
}, PC = {
	key: 0,
	class: "crumbs",
	"aria-label": "Breadcrumb"
}, FC = { class: "layout" }, IC = { class: "preview-col" }, LC = { class: "preview-head" }, RC = {
	key: 0,
	class: "heading display"
}, zC = {
	class: "history",
	role: "group",
	"aria-label": "History"
}, BC = ["disabled"], VC = ["disabled"], HC = {
	key: 2,
	class: "row-controls"
}, UC = {
	key: 3,
	class: "small muted hint"
}, WC = {
	key: 4,
	class: "promises"
}, GC = { class: "panel" }, KC = {
	key: 0,
	class: "mode",
	role: "group",
	"aria-label": "Editor mode"
}, qC = ["aria-pressed"], JC = ["aria-pressed"], YC = {
	key: 1,
	class: "card outlined",
	role: "alertdialog",
	"aria-labelledby": "basic-q"
}, XC = { class: "row-controls" }, ZC = {
	class: "card",
	"aria-labelledby": "text-heading"
}, QC = {
	key: 1,
	class: "footer"
}, $C = /* @__PURE__ */ z({
	__name: "App",
	setup(e) {
		let t = P_();
		Mn(F_, t);
		let { state: n, product: r, svg: i, findings: a, title: o, subtitle: s, mode: c, picker: l, selection: u, history: d, view: f } = t, p = /* @__PURE__ */ L(!1), m = !!Ll, h = /* @__PURE__ */ L(!1), g = Ll?.pageOwnsSize === !0, _ = Ll?.noBasket === !0, v = J(() => t.variantSizes.value.length > 0);
		or(() => {
			t.init(), Ll && Ul(t), window.addEventListener("keydown", y);
		}), lr(() => window.removeEventListener("keydown", y));
		function y(e) {
			if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") return;
			let n = e.target;
			(!n || n.tagName !== "INPUT" && n.tagName !== "TEXTAREA" && !n.isContentEditable) && (e.preventDefault(), e.shiftKey ? t.redo() : t.undo());
		}
		function b(e) {
			p.value = !1, t.setMode(e) || (p.value = !0);
		}
		let x = J(() => f.value.doc ? mu(f.value.doc) : "single"), S = J(() => f.value.doc ? lp(f.value.doc) : null), C = J(() => !S.value && (x.value === "grid" || x.value === "stacked" || x.value === "board")), w = J(() => r.value?.board ?? !1), T = J(() => r.value?.fireaction ?? !1), E = J(() => w.value || T.value), D = J(() => r.value?.roadsign ?? !1), O = J(() => D.value ? t.symbols.value.filter((e) => e.category === rg) : t.symbols.value), ee = J(() => {
			let e = f.value.doc, n = E.value ? t.board.empty.value : 0;
			return n ? `Fill in ${n === 1 ? "the empty slot" : `the ${n} empty slots`} first — pick a message for each one.` : !e || !S.value || Op(e) ? "" : xp(e).some((e) => e.source.trim() && (!e.text.trim() || e.stale)) ? "Some lines still need translating." : "Please tick “I have checked the translation” first.";
		}), te = J(() => a.value.filter((e) => e.severity === "error").map((e) => {
			let t = Gd(e.path), n = t === null ? void 0 : f.value.doc?.root.sections[t], r = S.value && n ? `${n === S.value.target ? op(n.lang) : "English"}: ` : t !== null && C.value ? `${x.value === "stacked" ? "Section" : "Cell"} ${t + 1}: ` : "";
			return e.code === "E_TEXT_OVERFLOW" ? `${r}The text doesn’t fit at the smallest size. Try shorter wording, a smaller text setting, or a bigger sign.` : e.code === "E_SECTION_TOO_SMALL" ? `${r}There isn’t room for this much. Try fewer symbols or panels, or a bigger sign.` : `${r}${e.message}`;
		}).filter((e, t, n) => n.indexOf(e) === t)), ne = J(() => `bespoke-${r.value?.type ?? "sign"}`), re = J(() => {
			let e = f.value.doc;
			if (!e) return "Sign preview";
			let n = e.root.sections.flatMap((e) => e.text_frame.panels.flatMap((e) => e.blocks.map((e) => e.text))).filter(Boolean);
			return `Sign preview: ${e.root.sections.flatMap((e) => e.symbol_frame?.symbols.map((e) => t.symbolEntry(e.symbol_code)?.name ?? e.symbol_code) ?? []).join(", ") || "no symbol"}${n.length ? `, “${n.join(", ")}”` : ""}`;
		}), ie = J(() => {
			let e = f.value.doc, r = [];
			if (e && n.suggesting) return r.push({
				ids: e.root.sections.flatMap(Bd),
				kind: "busy",
				label: "Designing your sign…"
			}), r;
			if (e && n.translating && S.value && t.translatingIds.value.length && r.push({
				ids: Bd(S.value.target),
				kind: "busy",
				label: `Translating into ${op(S.value.target.lang)}…`
			}), c.value !== "advanced" || !e) return r;
			let i = e.root.sections[u.section];
			if (!i) return r;
			C.value && r.push({
				ids: Bd(i),
				kind: "selected"
			});
			let a = i.text_frame.panels[u.panel];
			return a && i.text_frame.panels.length > 1 && r.push({
				ids: [a.id],
				kind: "panel"
			}), r;
		});
		function k(e) {
			let t = f.value.doc, n = t && e ? su(t, e) : null;
			if (!t || !n) return null;
			let r = t.root.sections[n.section], i = r.symbol_frame?.symbols ?? [];
			return n.symbol !== null && i.length > 1 ? {
				key: `symbol:${n.section}:${n.symbol}`,
				group: `symbols:${n.section}`,
				ids: [i[n.symbol].id]
			} : C.value ? {
				key: `section:${n.section}`,
				group: "sections",
				ids: Bd(r)
			} : null;
		}
		function ae() {
			let e = f.value.doc;
			if (!e || c.value !== "advanced") return [];
			if (C.value) return e.root.sections.map((e, t) => ({
				key: `section:${t}`,
				group: "sections",
				ids: Bd(e)
			}));
			let t = e.root.sections[0]?.symbol_frame?.symbols ?? [];
			return t.length > 1 ? t.map((e, t) => ({
				key: `symbol:0:${t}`,
				group: "symbols:0",
				ids: [e.id]
			})) : [];
		}
		function oe(e, n) {
			let r = f.value.doc;
			if (c.value !== "advanced" || !r) return;
			let i = e ? su(r, e) : null, a = i?.section ?? Wd(r, n.x, n.y);
			if (a == null) return;
			let o = S.value;
			if (o && r.root.sections[a] === o.target) {
				if (_n(() => document.getElementById("translation-card")?.scrollIntoView({
					behavior: "smooth",
					block: "nearest"
				})), i?.block !== null && i?.block !== void 0) {
					let e = o.target.text_frame.panels[i.panel ?? 0]?.blocks[i.block]?.id;
					e && _n(() => document.getElementById(`tr-${e}`)?.focus({ preventScroll: !0 }));
				}
				return;
			}
			o && (a = r.root.sections.indexOf(o.source)), a !== u.section && (u.panel = 0), u.section = a, i?.panel !== null && i?.panel !== void 0 && (u.panel = i.panel), E.value && t.offerPreset(u.section), window.matchMedia("(max-width: 960px)").matches && _n(() => document.getElementById("part-editor")?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			}));
		}
		function A(e, n) {
			let [r, i, a] = e.split(":"), [, o, s] = n.split(":"), c = f.value.doc;
			if (c) {
				if (r === "symbol") {
					let e = c.root.sections[Number(i)].id;
					t.commit((t) => Hu(t, e, Number(a), Number(s)));
				} else {
					let [e, n] = [Number(i), Number(o)];
					t.commit((t) => x.value === "grid" || x.value === "board" ? Iu(t, e, n) : Fu(t, e, n)), u.section = n, u.panel = 0;
				}
			}
		}
		let se = J(() => T.value ? "Click a step to edit its wording. Add, remove or reorder steps below — they renumber themselves." : w.value ? "Click a row to edit it, or drag one cell onto another to swap them." : S.value ? "Click the English to edit it, or the translation to jump to its wording." : x.value === "board" ? "Click a row to edit it. Drag one cell onto another to swap them." : x.value === "grid" ? "Click a cell to edit it. Drag one cell onto another to swap them." : x.value === "stacked" ? "Click a section to edit it. Drag a section to move it." : x.value === "multi" ? "Drag a symbol along the row to reorder it." : "Click a panel to edit it."), ce = () => {
			let e = f.value.doc?.root.sections[0]?.id;
			e && t.openPicker({
				sectionId: e,
				index: 0
			});
		};
		return (e, a) => (H(), U(V, null, [
			m ? q("", !0) : (H(), U("header", jC, [...a[18] ||= [W("span", { class: "brand display" }, "Safety Signs & Notices", -1), W("span", { class: "tag" }, "Bespoke signs · test site", -1)]])),
			W("main", { class: pe(["page", { embedded: m }]) }, [R(n).status === "loading" ? (H(), U("div", MC, "Loading the sign designer…")) : R(n).status === "error" ? (H(), U("div", NC, " The designer couldn’t start: " + P(R(n).error), 1)) : (H(), U(V, { key: 2 }, [
				m ? q("", !0) : (H(), U("nav", PC, [
					a[19] ||= W("span", null, "Safety Signs", -1),
					a[20] ||= W("span", { "aria-hidden": "true" }, "/", -1),
					a[21] ||= W("span", null, "Bespoke", -1),
					a[22] ||= W("span", { "aria-hidden": "true" }, "/", -1),
					W("strong", null, P(R(r)?.heading), 1)
				])),
				W("div", FC, [W("div", IC, [
					W("div", LC, [g ? q("", !0) : (H(), U("h1", RC, P(R(r)?.heading), 1)), W("div", zC, [
						R(t).options.value.length && !R(t).state.choosing ? (H(), U("button", {
							key: 0,
							class: "btn small-btn accent",
							title: "Look at the other designs we suggested",
							onClick: a[0] ||= (e) => R(t).reopenOptions()
						}, "✦ See the other ideas")) : q("", !0),
						W("button", {
							class: "btn small-btn",
							disabled: !R(d).canUndo,
							title: "Undo (Ctrl/⌘+Z)",
							onClick: a[1] ||= (e) => R(t).undo()
						}, "↶ Undo", 8, BC),
						W("button", {
							class: "btn small-btn",
							disabled: !R(d).canRedo,
							title: "Redo (Ctrl/⌘+Shift+Z)",
							onClick: a[2] ||= (e) => R(t).redo()
						}, "↷ Redo", 8, VC)
					])]),
					R(t).state.choosing ? (H(), Ri(Cv, { key: 0 })) : (H(), Ri(Ev, {
						key: 1,
						svg: R(i),
						label: re.value,
						interactive: R(c) === "advanced",
						highlights: ie.value,
						"drag-item": k,
						movables: ae,
						onPick: oe,
						onDrop: A
					}, null, 8, [
						"svg",
						"label",
						"interactive",
						"highlights"
					])),
					R(t).state.choosing ? q("", !0) : (H(), U("div", HC, [W("button", {
						class: "btn",
						onClick: a[3] ||= (e) => h.value = !0
					}, "Preview this sign"), a[23] ||= W("span", { class: "small muted" }, "See it at actual size, against a door.", -1)])),
					R(c) === "advanced" ? (H(), U("p", UC, P(se.value), 1)) : q("", !0),
					(H(!0), U(V, null, B(te.value, (e) => (H(), U("div", {
						key: e,
						class: "notice",
						role: "status"
					}, P(e), 1))), 128)),
					R(t).review ? q("", !0) : (H(), U("div", WC, [...a[24] ||= [
						W("span", null, "Printed exactly to size", -1),
						W("span", { "aria-hidden": "true" }, "·", -1),
						W("span", null, "Official ISO 7010 symbols", -1)
					]]))
				]), W("div", GC, [
					!E.value && !D.value ? (H(), U("div", KC, [W("button", {
						"aria-pressed": R(c) === "basic",
						onClick: a[4] ||= (e) => b("basic")
					}, "Basic", 8, qC), W("button", {
						"aria-pressed": R(c) === "advanced",
						onClick: a[5] ||= (e) => b("advanced")
					}, "Advanced", 8, JC)])) : q("", !0),
					p.value ? (H(), U("section", YC, [
						a[25] ||= W("h2", {
							id: "basic-q",
							style: {
								margin: "0",
								"font-size": "18px"
							}
						}, "Switch to Basic?", -1),
						a[26] ||= W("p", { style: { margin: "0" } }, "Basic shows one symbol with a title and one more line. Switching keeps the first symbol and the first two lines of text; the rest is removed (you can undo).", -1),
						W("div", XC, [W("button", {
							class: "btn strong",
							onClick: a[6] ||= (e) => {
								p.value = !1, R(t).resetToBasic();
							}
						}, "Switch to Basic"), W("button", {
							class: "btn",
							onClick: a[7] ||= (e) => p.value = !1
						}, "Stay in Advanced")])
					])) : q("", !0),
					R(l) ? (H(), Ri(Ty, {
						key: 2,
						symbols: O.value,
						categories: R(t).categories.value,
						preferred: R(r)?.category ?? null,
						current: R(c) === "basic" ? R(t).currentSymbol.value?.code ?? null : R(t).pickerCurrent.value,
						busy: R(n).symbolBusy,
						error: R(n).symbolError,
						noun: D.value ? "arrow" : "symbol",
						onPick: R(t).pickSymbol,
						onDone: a[8] ||= (e) => R(t).closePicker()
					}, null, 8, [
						"symbols",
						"categories",
						"preferred",
						"current",
						"busy",
						"error",
						"noun",
						"onPick"
					])) : D.value ? (H(), Ri(_C, {
						key: 3,
						sizes: !g
					}, null, 8, ["sizes"])) : R(t).board.picker.value ? (H(), Ri(AC, { key: 4 })) : E.value ? (H(), Ri(aC, { key: 5 })) : R(c) === "basic" ? (H(), U(V, { key: 6 }, [
						R(t).canSuggest ? (H(), Ri(fv, { key: 0 })) : q("", !0),
						v.value ? (H(), Ri(uy, { key: 1 })) : g ? q("", !0) : (H(), Ri(ny, {
							key: 2,
							sizes: R(t).sizes.value,
							current: R(t).currentSize.value,
							onPick: R(t).pickSize
						}, null, 8, [
							"sizes",
							"current",
							"onPick"
						])),
						G(My, {
							current: R(t).currentSymbol.value,
							onChange: ce
						}, null, 8, ["current"]),
						W("section", ZC, [
							a[27] ||= W("div", { class: "step-head" }, [W("span", { class: "step-no" }, "3"), W("h2", { id: "text-heading" }, "Text")], -1),
							G(qy, {
								id: "title",
								label: "Title",
								text: R(o).text,
								align: R(o).align,
								caps: R(o).caps,
								"size-label": R(o).label,
								mm: R(o).mm,
								onText: a[9] ||= (e) => R(t).setText("title", e),
								onBump: a[10] ||= (e) => R(t).bumpSize("title", e),
								onAlign: a[11] ||= (e) => R(t).setAlign("title", e),
								onCaps: a[12] ||= (e) => R(t).setCaps("title", e)
							}, null, 8, [
								"text",
								"align",
								"caps",
								"size-label",
								"mm"
							]),
							G(qy, {
								id: "subtitle",
								label: "Additional text (optional)",
								placeholder: "e.g. on these premises",
								text: R(s).text,
								align: R(s).align,
								caps: R(s).caps,
								"size-label": R(s).label,
								mm: R(s).mm,
								onText: a[13] ||= (e) => R(t).setText("subtitle", e),
								onBump: a[14] ||= (e) => R(t).bumpSize("subtitle", e),
								onAlign: a[15] ||= (e) => R(t).setAlign("subtitle", e),
								onCaps: a[16] ||= (e) => R(t).setCaps("subtitle", e)
							}, null, 8, [
								"text",
								"align",
								"caps",
								"size-label",
								"mm"
							]),
							a[28] ||= W("p", {
								class: "small muted",
								style: { margin: "0" }
							}, "Text still shrinks to fit if it gets too long. Need more? Try Advanced.", -1)
						]),
						G(Q_),
						R(r)?.bilingual ? (H(), Ri(yS, {
							key: 3,
							step: 4
						})) : q("", !0)
					], 64)) : (H(), U(V, { key: 7 }, [R(t).canSuggest ? (H(), Ri(fv, { key: 0 })) : q("", !0), G(bS)], 64)),
					R(t).review && !R(l) && !R(t).board.picker.value ? (H(), Ri(G_, { key: 8 })) : !R(l) && !R(t).board.picker.value && !g && !_ ? (H(), Ri(ko, {
						key: 9,
						"design-json": R(t).designJson,
						"preview-svg": R(t).printSvg,
						"file-stem": ne.value,
						blocked: ee.value
					}, null, 8, [
						"design-json",
						"preview-svg",
						"file-stem",
						"blocked"
					])) : q("", !0)
				])]),
				m ? q("", !0) : (H(), U("p", QC, "Data: " + P(R(t).dataSource.value) + " · Symbols: " + P(R(t).symbols.value.length), 1))
			], 64))], 2),
			h.value ? (H(), Ri(Bv, {
				key: 1,
				onClose: a[17] ||= (e) => h.value = !1
			})) : q("", !0)
		], 64));
	}
});
//#endregion
//#region editor/src/main.ts
Ll || document.documentElement.classList.add("sign-designer-site");
var ew = document.querySelector(Ll?.mount ?? "#app");
ew?.classList.add("sign-designer-root"), yo($C).mount(ew ?? Ll?.mount ?? "#app");
//#endregion
