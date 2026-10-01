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
}, O = /-\w/g, k = D((e) => e.replace(O, (e) => e.slice(1).toUpperCase())), ee = /\B([A-Z])/g, te = D((e) => e.replace(ee, "-$1").toLowerCase()), ne = D((e) => e.charAt(0).toUpperCase() + e.slice(1)), re = D((e) => e ? `on${ne(e)}` : ""), A = (e, t) => !Object.is(e, t), ie = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, ae = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, j = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, oe, se = () => oe ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function M(e) {
	if (f(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = _(r) ? de(r) : M(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (_(e) || y(e)) return e;
}
var ce = /;(?![^(]*\))/g, le = /:([^]+)/, ue = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function de(e) {
	let t = {};
	return e.replace(ue, (e) => e.startsWith("/*") ? "" : e).split(ce).forEach((e) => {
		if (e) {
			let n = e.split(le);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function fe(e) {
	let t = "";
	if (_(e)) t = e;
	else if (f(e)) for (let n = 0; n < e.length; n++) {
		let r = fe(e[n]);
		r && (t += r + " ");
	}
	else if (y(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var pe = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", me = /* @__PURE__ */ t(pe);
pe + "";
function he(e) {
	return !!e || e === "";
}
function ge(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = ve(e[i], t[i], n);
	return r;
}
function N(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && ve(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function _e(e, t, n) {
	let r = p(e), i = p(t);
	if (r || i || (r = m(e), i = m(t), r || i)) return r && i ? N(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !ve(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function P(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function ve(e, t, n) {
	if (e === t) return !0;
	let r = h(e), i = h(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = v(e), i = v(t), r || i ? e === t : (r = f(e), i = f(t), r || i ? r && i ? P(e, t, n, ge) : !1 : (r = y(e), i = y(t), r || i ? !r || !i ? !1 : P(e, t, n, _e) : String(e) === String(t))));
}
var ye = (e) => !!(e && e.__v_isRef === !0), F = (e) => _(e) ? e : e == null ? "" : f(e) || y(e) && (e.toString === x || !g(e.toString)) ? ye(e) ? F(e.value) : JSON.stringify(e, be, 2) : String(e), be = (e, t) => ye(t) ? be(e, t.value) : p(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[xe(t, r) + " =>"] = n, e), {}) } : m(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => xe(e)) } : v(t) ? xe(t) : y(t) && !f(t) && !w(t) ? String(t) : t, xe = (e, t = "") => v(e) ? `Symbol(${e.description ?? t})` : e, Se, Ce = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Se && (Se.active ? (this.parent = Se, this.index = (Se.scopes || (Se.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = Se;
			try {
				return Se = this, e();
			} finally {
				Se = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Se, Se = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Se === this) Se = this.prevScope;
			else {
				let e = Se;
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
function we() {
	return Se;
}
var I, Te = /* @__PURE__ */ new WeakSet(), Ee = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Se && (Se.active ? Se.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Te.has(this) && (Te.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ae(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ue(this), Ne(this);
		let e = I, t = ze;
		I = this, ze = !0;
		try {
			return this.fn();
		} finally {
			Pe(this), I = e, ze = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Le(e);
			this.deps = this.depsTail = void 0, Ue(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Te.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Fe(this) && this.run();
	}
	get dirty() {
		return Fe(this);
	}
}, De = 0, Oe, ke;
function Ae(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = ke, ke = e;
		return;
	}
	e.next = Oe, Oe = e;
}
function je() {
	De++;
}
function Me() {
	if (--De > 0) return;
	if (ke) {
		let e = ke;
		for (ke = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Oe;) {
		let t = Oe;
		for (Oe = void 0; t;) {
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
function Ne(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Pe(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Le(r), Re(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Fe(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ie(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ie(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === We) || (e.globalVersion = We, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Fe(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = I, r = ze;
	I = e, ze = !0;
	try {
		Ne(e);
		let n = e.fn(e._value);
		(t.version === 0 || A(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		I = n, ze = r, Pe(e), e.flags &= -3;
	}
}
function Le(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Le(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Re(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var ze = !0, Be = [];
function Ve() {
	Be.push(ze), ze = !1;
}
function He() {
	let e = Be.pop();
	ze = e === void 0 || e;
}
function Ue(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = I;
		I = void 0;
		try {
			t();
		} finally {
			I = e;
		}
	}
}
var We = 0, Ge = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ke = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!I || !ze || I === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== I) t = this.activeLink = new Ge(I, this), I.deps ? (t.prevDep = I.depsTail, I.depsTail.nextDep = t, I.depsTail = t) : I.deps = I.depsTail = t, qe(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = I.depsTail, t.nextDep = void 0, I.depsTail.nextDep = t, I.depsTail = t, I.deps === t && (I.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, We++, this.notify(e);
	}
	notify(e) {
		je();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Me();
		}
	}
};
function qe(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) qe(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Je = /* @__PURE__ */ new WeakMap(), Ye = /* @__PURE__ */ Symbol(""), Xe = /* @__PURE__ */ Symbol(""), Ze = /* @__PURE__ */ Symbol("");
function Qe(e, t, n) {
	if (ze && I) {
		let t = Je.get(e);
		t || Je.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Ke()), r.map = t, r.key = n), r.track();
	}
}
function $e(e, t, n, r, i, a) {
	let o = Je.get(e);
	if (!o) {
		We++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (je(), t === "clear") o.forEach(s);
	else {
		let i = f(e), a = i && T(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ze || !v(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ze)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Ye)), p(e) && s(o.get(Xe)));
				break;
			case "delete":
				i || (s(o.get(Ye)), p(e) && s(o.get(Xe)));
				break;
			case "set": p(e) && s(o.get(Ye));
		}
	}
	Me();
}
function et(e) {
	let t = /* @__PURE__ */ L(e);
	return t === e || (Qe(t, "iterate", Ze), /* @__PURE__ */ zt(e)) ? t : /* @__PURE__ */ Rt(e) ? /* @__PURE__ */ Lt(e) ? t.map((e) => Ut(Ht(e))) : t.map(Ut) : t.map(Ht);
}
function tt(e) {
	return Qe(e = /* @__PURE__ */ L(e), "iterate", Ze), e;
}
function nt(e, t) {
	return /* @__PURE__ */ Rt(e) ? Ut(/* @__PURE__ */ Lt(e) ? Ht(t) : t) : Ht(t);
}
var rt = {
	__proto__: null,
	[Symbol.iterator]() {
		return it(this, Symbol.iterator, (e) => nt(this, e));
	},
	concat(...e) {
		return et(this).concat(...e.map((e) => f(e) ? et(e) : e));
	},
	entries() {
		return it(this, "entries", (e) => (e[1] = nt(this, e[1]), e));
	},
	every(e, t) {
		return ot(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return ot(this, "filter", e, t, (e) => e.map((e) => nt(this, e)), arguments);
	},
	find(e, t) {
		return ot(this, "find", e, t, (e) => nt(this, e), arguments);
	},
	findIndex(e, t) {
		return ot(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return ot(this, "findLast", e, t, (e) => nt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return ot(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return ot(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ct(this, "includes", e);
	},
	indexOf(...e) {
		return ct(this, "indexOf", e);
	},
	join(e) {
		return et(this).join(e);
	},
	lastIndexOf(...e) {
		return ct(this, "lastIndexOf", e);
	},
	map(e, t) {
		return ot(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return lt(this, "pop");
	},
	push(...e) {
		return lt(this, "push", e);
	},
	reduce(e, ...t) {
		return st(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return st(this, "reduceRight", e, t);
	},
	shift() {
		return lt(this, "shift");
	},
	some(e, t) {
		return ot(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return lt(this, "splice", e);
	},
	toReversed() {
		return et(this).toReversed();
	},
	toSorted(e) {
		return et(this).toSorted(e);
	},
	toSpliced(...e) {
		return et(this).toSpliced(...e);
	},
	unshift(...e) {
		return lt(this, "unshift", e);
	},
	values() {
		return it(this, "values", (e) => nt(this, e));
	}
};
function it(e, t, n) {
	let r = tt(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ zt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var at = Array.prototype;
function ot(e, t, n, r, i, a) {
	let o = tt(e), s = o !== e && !/* @__PURE__ */ zt(e), c = o[t];
	if (c !== at[t]) {
		let t = c.apply(e, a);
		return s ? Ht(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, nt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function st(e, t, n, r) {
	let i = tt(e), a = i !== e && !/* @__PURE__ */ zt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = nt(e, t)), n.call(this, t, nt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? nt(e, c) : c;
}
function ct(e, t, n) {
	let r = /* @__PURE__ */ L(e);
	Qe(r, "iterate", Ze);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Bt(n[0]) ? (n[0] = /* @__PURE__ */ L(n[0]), r[t](...n)) : i;
}
function lt(e, t, n = []) {
	Ve(), je();
	let r = (/* @__PURE__ */ L(e))[t].apply(e, n);
	return Me(), He(), r;
}
var ut = /* @__PURE__ */ t("__proto__,__v_isRef,__isVue"), dt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(v));
function ft(e) {
	v(e) || (e = String(e));
	let t = /* @__PURE__ */ L(this);
	return Qe(t, "has", e), t.hasOwnProperty(e);
}
var pt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? jt : At : i ? kt : Ot).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = f(e);
		if (!r) {
			let e;
			if (a && (e = rt[t])) return e;
			if (t === "hasOwnProperty") return ft;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ Wt(e) ? e : n);
		if ((v(t) ? dt.has(t) : ut(t)) || (r || Qe(e, "get", t), i)) return o;
		if (/* @__PURE__ */ Wt(o)) {
			let e = a && T(t) ? o : o.value;
			return r && y(e) ? /* @__PURE__ */ Ft(e) : e;
		}
		return y(o) ? r ? /* @__PURE__ */ Ft(o) : /* @__PURE__ */ Nt(o) : o;
	}
}, mt = class extends pt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = f(e) && T(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Rt(i);
			if (!/* @__PURE__ */ zt(n) && !/* @__PURE__ */ Rt(n) && (i = /* @__PURE__ */ L(i), n = /* @__PURE__ */ L(n)), !a && /* @__PURE__ */ Wt(i) && !/* @__PURE__ */ Wt(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : d(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ Wt(e) ? e : r);
		return e === /* @__PURE__ */ L(r) && s && (o ? A(n, i) && $e(e, "set", t, n, i) : $e(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = d(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && $e(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!v(t) || !dt.has(t)) && Qe(e, "has", t), n;
	}
	ownKeys(e) {
		return Qe(e, "iterate", f(e) ? "length" : Ye), Reflect.ownKeys(e);
	}
}, ht = class extends pt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, gt = /* @__PURE__ */ new mt(), _t = /* @__PURE__ */ new ht(), vt = /* @__PURE__ */ new mt(!0), yt = (e) => e, bt = (e) => Reflect.getPrototypeOf(e);
function xt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ L(i), o = p(a), s = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? yt : t ? Ut : Ht;
		return !t && Qe(a, "iterate", l ? Xe : Ye), c(Object.create(u), { next() {
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
function St(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Ct(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ L(r), a = /* @__PURE__ */ L(n);
			e || (A(n, a) && Qe(i, "get", n), Qe(i, "get", a));
			let { has: o } = bt(i), s = t ? yt : e ? Ut : Ht;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && Qe(/* @__PURE__ */ L(t), "iterate", Ye), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ L(n), i = /* @__PURE__ */ L(t);
			return e || (A(t, i) && Qe(r, "has", t), Qe(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ L(a), s = t ? yt : e ? Ut : Ht;
			return !e && Qe(o, "iterate", Ye), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return c(n, e ? {
		add: St("add"),
		set: St("set"),
		delete: St("delete"),
		clear: St("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ L(this), r = bt(n), i = /* @__PURE__ */ L(e), a = !t && !/* @__PURE__ */ zt(e) && !/* @__PURE__ */ Rt(e) ? i : e;
			return r.has.call(n, a) || A(e, a) && r.has.call(n, e) || A(i, a) && r.has.call(n, i) || (n.add(a), $e(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ zt(n) && !/* @__PURE__ */ Rt(n) && (n = /* @__PURE__ */ L(n));
			let r = /* @__PURE__ */ L(this), { has: i, get: a } = bt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ L(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? A(n, s) && $e(r, "set", e, n, s) : $e(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ L(this), { has: n, get: r } = bt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ L(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && $e(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ L(this), t = e.size !== 0, n = e.clear();
			return t && $e(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = xt(r, e, t);
	}), n;
}
function wt(e, t) {
	let n = Ct(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(d(n, r) && r in t ? n : t, r, i);
}
var Tt = { get: /* @__PURE__ */ wt(!1, !1) }, Et = { get: /* @__PURE__ */ wt(!1, !0) }, Dt = { get: /* @__PURE__ */ wt(!0, !1) }, Ot = /* @__PURE__ */ new WeakMap(), kt = /* @__PURE__ */ new WeakMap(), At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap();
function Mt(e) {
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
function Nt(e) {
	return /* @__PURE__ */ Rt(e) ? e : It(e, !1, gt, Tt, Ot);
}
// @__NO_SIDE_EFFECTS__
function Pt(e) {
	return It(e, !1, vt, Et, kt);
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return It(e, !0, _t, Dt, At);
}
function It(e, t, n, r, i) {
	if (!y(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Mt(C(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return /* @__PURE__ */ Rt(e) ? /* @__PURE__ */ Lt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function L(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ L(t) : e;
}
function Vt(e) {
	return !d(e, "__v_skip") && Object.isExtensible(e) && ae(e, "__v_skip", !0), e;
}
var Ht = (e) => y(e) ? /* @__PURE__ */ Nt(e) : e, Ut = (e) => y(e) ? /* @__PURE__ */ Ft(e) : e;
// @__NO_SIDE_EFFECTS__
function Wt(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function R(e) {
	return Kt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Gt(e) {
	return Kt(e, !0);
}
function Kt(e, t) {
	return /* @__PURE__ */ Wt(e) ? e : new qt(e, t);
}
var qt = class {
	constructor(e, t) {
		this.dep = new Ke(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ L(e), this._value = t ? e : Ht(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ zt(e) || /* @__PURE__ */ Rt(e);
		e = n ? e : /* @__PURE__ */ L(e), A(e, t) && (this._rawValue = e, this._value = n ? e : Ht(e), this.dep.trigger());
	}
};
function z(e) {
	return /* @__PURE__ */ Wt(e) ? e.value : e;
}
var Jt = {
	get: (e, t, n) => t === "__v_raw" ? e : z(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ Wt(i) && !/* @__PURE__ */ Wt(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Yt(e) {
	return /* @__PURE__ */ Lt(e) ? e : new Proxy(e, Jt);
}
var Xt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ke(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = We - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && I !== this) return Ae(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Ie(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Zt(e, t, n = !1) {
	let r, i;
	return g(e) ? r = e : (r = e.get, i = e.set), new Xt(r, i, n);
}
var Qt = {}, $t = /* @__PURE__ */ new WeakMap(), en = void 0;
function tn(e, t = !1, n = en) {
	if (n) {
		let t = $t.get(n);
		t || $t.set(n, t = []), t.push(e);
	}
}
function nn(e, t, r = n) {
	let { immediate: a, deep: o, once: s, scheduler: c, augmentJob: u, call: d } = r, p = (e) => o ? e : /* @__PURE__ */ zt(e) || o === !1 || o === 0 ? rn(e, 1) : rn(e), m, h, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ Wt(e) ? (h = () => e.value, y = /* @__PURE__ */ zt(e)) : /* @__PURE__ */ Lt(e) ? (h = () => p(e), y = !0) : f(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Lt(e) || /* @__PURE__ */ zt(e)), h = () => e.map((e) => {
		if (/* @__PURE__ */ Wt(e)) return e.value;
		if (/* @__PURE__ */ Lt(e)) return p(e);
		if (g(e)) return d ? d(e, 2) : e();
	})) : h = g(e) ? t ? d ? () => d(e, 2) : e : () => {
		if (_) {
			Ve();
			try {
				_();
			} finally {
				He();
			}
		}
		let t = en;
		en = m;
		try {
			return d ? d(e, 3, [v]) : e(v);
		} finally {
			en = t;
		}
	} : i, t && o) {
		let e = h, t = o === !0 ? Infinity : o;
		h = () => rn(e(), t);
	}
	let x = we(), S = () => {
		m.stop(), x && x.active && l(x.effects, m);
	};
	if (s && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(Qt) : Qt, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (t) {
				let n = m.run();
				if (e || o || y || (b ? n.some((e, t) => A(e, C[t])) : A(n, C))) {
					_ && _();
					let e = en;
					en = m;
					try {
						let e = [
							n,
							C === Qt ? void 0 : b && C[0] === Qt ? [] : C,
							v
						];
						C = n, d ? d(t, 3, e) : t(...e);
					} finally {
						en = e;
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new Ee(h), m.scheduler = c ? () => c(w, !1) : w, v = (e) => tn(e, !1, m), _ = m.onStop = () => {
		let e = $t.get(m);
		if (e) {
			if (d) d(e, 4);
			else for (let t of e) t();
			$t.delete(m);
		}
	}, t ? a ? w(!0) : C = m.run() : c ? c(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function rn(e, t = Infinity, n) {
	if (t <= 0 || !y(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ Wt(e)) rn(e.value, t, n);
	else if (f(e)) for (let r = 0; r < e.length; r++) rn(e[r], t, n);
	else if (m(e) || p(e)) e.forEach((e) => {
		rn(e, t, n);
	});
	else if (w(e)) {
		for (let r in e) rn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && rn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function an(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		sn(e, t, n);
	}
}
function on(e, t, n, r) {
	if (g(e)) {
		let i = an(e, t, n, r);
		return i && b(i) && i.catch((e) => {
			sn(e, t, n);
		}), i;
	}
	if (f(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(on(e[a], t, n, r));
		return i;
	}
}
function sn(e, t, r, i = !0) {
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
			Ve(), an(o, null, 10, [
				e,
				i,
				a
			]), He();
			return;
		}
	}
	cn(e, r, a, i, s);
}
function cn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var ln = [], un = -1, dn = [], fn = null, pn = 0, mn = /* @__PURE__ */ Promise.resolve(), hn = null;
function gn(e) {
	let t = hn || mn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function _n(e) {
	let t = un + 1, n = ln.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = ln[r], a = Cn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function vn(e) {
	if (!(e.flags & 1)) {
		let t = Cn(e), n = ln[ln.length - 1];
		!n || !(e.flags & 2) && t >= Cn(n) ? ln.push(e) : ln.splice(_n(t), 0, e), e.flags |= 1, yn();
	}
}
function yn() {
	hn ||= mn.then(wn);
}
function bn(e) {
	if (!f(e)) fn && e.id === -1 ? fn.splice(pn + 1, 0, e) : e.flags & 1 || (dn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) dn.push(e[t]);
	yn();
}
function xn(e, t, n = un + 1) {
	for (; n < ln.length; n++) {
		let t = ln[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			ln.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function Sn(e) {
	if (dn.length) {
		let e = [...new Set(dn)].sort((e, t) => Cn(e) - Cn(t));
		if (dn.length = 0, fn) {
			for (let t = 0; t < e.length; t++) fn.push(e[t]);
			return;
		}
		for (fn = e, pn = 0; pn < fn.length; pn++) {
			let e = fn[pn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		fn = null, pn = 0;
	}
}
var Cn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function wn(e) {
	try {
		for (un = 0; un < ln.length; un++) {
			let e = ln[un];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), an(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; un < ln.length; un++) {
			let e = ln[un];
			e && (e.flags &= -2);
		}
		un = -1, ln.length = 0, Sn(e), hn = null, (ln.length || dn.length) && wn(e);
	}
}
var Tn = null, En = null;
function Dn(e) {
	let t = Tn;
	return Tn = e, En = e && e.type.__scopeId || null, t;
}
function On(e, t = Tn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Fi(-1);
		let i = Dn(t), a = ji.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = ji.length; e > a; e--) Ni();
			Dn(i), r._d && Fi(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function kn(e, t) {
	if (Tn === null) return e;
	let r = ma(Tn), i = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [a, o, s, c = n] = t[e];
		a && (g(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && rn(o), i.push({
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
function An(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ve(), on(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), He());
	}
}
function jn(e, t) {
	if (ea) {
		let n = ea.provides, r = ea.parent && ea.parent.provides;
		r === n && (n = ea.provides = Object.create(r)), n[e] = t;
	}
}
function Mn(e, t, n = !1) {
	let r = ta();
	if (r || Rr) {
		let i = Rr ? Rr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && g(t) ? t.call(r && r.proxy) : t;
	}
}
var Nn = /* @__PURE__ */ Symbol.for("v-scx"), Pn = () => Mn(Nn);
function Fn(e, t, n) {
	return In(e, t, n);
}
function In(e, t, r = n) {
	let { immediate: a, deep: o, flush: s, once: l } = r, u = c({}, r), d = t && a || !t && s !== "post", f;
	if (sa) {
		if (s === "sync") {
			let e = Pn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = i, e.resume = i, e.pause = i, e;
		}
	}
	let p = ea;
	u.call = (e, t, n) => on(e, p, t, n);
	let m = !1;
	s === "post" ? u.scheduler = (e) => {
		hi(e, p && p.suspense);
	} : s !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : vn(e);
	}), u.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = nn(e, t, u);
	return sa && (f ? f.push(h) : d && h()), h;
}
function Ln(e, t, n) {
	let r = this.proxy, i = _(e) ? e.includes(".") ? Rn(r, e) : () => r[e] : e.bind(r, r), a;
	g(t) ? a = t : (a = t.handler, n = t);
	let o = ia(this), s = In(i, a.bind(r), n);
	return o(), s;
}
function Rn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var zn = /* @__PURE__ */ Symbol("_vte"), Bn = (e) => e.__isTeleport, Vn = /* @__PURE__ */ Symbol("_leaveCb");
function Hn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== ki) {
			t = n;
			break;
		}
	}
	return t;
}
function Un(e) {
	if (!Zn(e)) return Bn(e.type) && e.children ? Hn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && g(n.default)) return n.default();
	}
}
function Wn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Wn(Bn(n.type) && Un(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function B(e, t) {
	return g(e) ? /* @__PURE__ */ c({ name: e.name }, t, { setup: e }) : e;
}
function Gn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Kn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var qn = /* @__PURE__ */ new WeakMap();
function Jn(e, t, r, i, o = !1) {
	if (f(e)) {
		e.forEach((e, n) => Jn(e, t && (f(t) ? t[n] : t), r, i, o));
		return;
	}
	if (Xn(i) && !o) {
		i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && Jn(e, t, r, i.component.subTree);
		return;
	}
	let s = i.shapeFlag & 4 ? ma(i.component) : i.el, c = o ? null : s, { i: u, r: p } = e, m = t && t.r, h = u.refs === n ? u.refs = {} : u.refs, v = u.setupState, y = /* @__PURE__ */ L(v), b = v === n ? a : (e) => !Kn(h, e) && d(y, e), x = (e, t) => !(t && Kn(h, t));
	if (m != null && m !== p) {
		if (Yn(t), _(m)) h[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ Wt(m)) {
			let e = t;
			x(m, e.k) && (m.value = null), e.k && (h[e.k] = null);
		}
	}
	if (g(p)) an(p, u, 12, [c, h]);
	else {
		let t = _(p), n = /* @__PURE__ */ Wt(p);
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
					i(), qn.delete(e);
				};
				t.id = -1, qn.set(e, t), hi(t, r);
			} else Yn(e), i();
		}
	}
}
function Yn(e) {
	let t = qn.get(e);
	t && (t.flags |= 8, qn.delete(e));
}
se().requestIdleCallback, se().cancelIdleCallback;
var Xn = (e) => !!e.type.__asyncLoader, Zn = (e) => e.type.__isKeepAlive;
function Qn(e, t) {
	er(e, "a", t);
}
function $n(e, t) {
	er(e, "da", t);
}
function er(e, t, n = ea) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (nr(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Zn(e.parent.vnode) && tr(r, t, n, e), e = e.parent;
	}
}
function tr(e, t, n, r) {
	let i = nr(t, e, r, !0);
	lr(() => {
		l(r[t], i);
	}, n);
}
function nr(e, t, n = ea, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ve();
			let i = ia(n), a = on(t, n, e, r);
			return i(), He(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var rr = (e) => (t, n = ea) => {
	(!sa || e === "sp") && nr(e, (...e) => t(...e), n);
}, ir = rr("bm"), ar = rr("m"), or = rr("bu"), sr = rr("u"), cr = rr("bum"), lr = rr("um"), ur = rr("sp"), dr = rr("rtg"), fr = rr("rtc");
function pr(e, t = ea) {
	nr("ec", e, t);
}
var mr = /* @__PURE__ */ Symbol.for("v-ndc");
function V(e, t, n, r) {
	let i, a = n && n[r], o = f(e);
	if (o || _(e)) {
		let n = o && /* @__PURE__ */ Lt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ zt(e), s = /* @__PURE__ */ Rt(e), e = tt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Ut(Ht(e[n])) : Ht(e[n]) : e[n], n, void 0, a && a[n]);
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
var hr = (e) => e ? oa(e) ? ma(e) : hr(e.parent) : null, gr = /* @__PURE__ */ c(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => hr(e.parent),
	$root: (e) => hr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Tr(e),
	$forceUpdate: (e) => e.f ||= () => {
		vn(e.update);
	},
	$nextTick: (e) => e.n ||= gn.bind(e.proxy),
	$watch: (e) => Ln.bind(e)
}), _r = (e, t) => e !== n && !e.__isScriptSetup && d(e, t), vr = {
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
			else if (_r(i, t)) return s[t] = 1, i[t];
			else if (a !== n && d(a, t)) return s[t] = 2, a[t];
			else if (d(o, t)) return s[t] = 3, o[t];
			else if (r !== n && d(r, t)) return s[t] = 4, r[t];
			else br && (s[t] = 0);
		}
		let u = gr[t], f, p;
		if (u) return t === "$attrs" && Qe(e.attrs, "get", ""), u(e);
		if ((f = c.__cssModules) && (f = f[t])) return f;
		if (r !== n && d(r, t)) return s[t] = 4, r[t];
		if (p = l.config.globalProperties, d(p, t)) return p[t];
	},
	set({ _: e }, t, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return _r(a, t) ? (a[t] = r, !0) : i !== n && d(i, t) ? (i[t] = r, !0) : d(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (o[t] = r, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== n && c[0] !== "$" && d(e, c) || _r(t, c) || d(o, c) || d(i, c) || d(gr, c) || d(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? d(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function yr(e) {
	return f(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var br = !0;
function xr(e) {
	let t = Tr(e), n = e.proxy, r = e.ctx;
	br = !1, t.beforeCreate && Cr(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: d, beforeMount: p, mounted: m, beforeUpdate: h, updated: _, activated: v, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: D, errorCaptured: O, serverPrefetch: k, expose: ee, inheritAttrs: te, components: ne, directives: re, filters: A } = t;
	if (u && Sr(u, r, null), s) for (let e in s) {
		let t = s[e];
		g(t) && (r[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		y(t) && (e.data = /* @__PURE__ */ Nt(t));
	}
	if (br = !0, o) for (let e in o) {
		let t = o[e], a = Y({
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
	if (c) for (let e in c) wr(c[e], r, n, e);
	if (l) {
		let e = g(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			jn(t, e[t]);
		});
	}
	d && Cr(d, e, "c");
	function ie(e, t) {
		f(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (ie(ir, p), ie(ar, m), ie(or, h), ie(sr, _), ie(Qn, v), ie($n, b), ie(pr, O), ie(fr, E), ie(dr, D), ie(cr, S), ie(lr, w), ie(ur, k), f(ee)) {
		if (ee.length) {
			let t = e.exposed ||= {};
			ee.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	T && e.render === i && (e.render = T), te != null && (e.inheritAttrs = te), ne && (e.components = ne), re && (e.directives = re), k && Gn(e);
}
function Sr(e, t, n = i) {
	f(e) && (e = Ar(e));
	for (let n in e) {
		let r = e[n], i;
		i = y(r) ? "default" in r ? Mn(r.from || n, r.default, !0) : Mn(r.from || n) : Mn(r), /* @__PURE__ */ Wt(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Cr(e, t, n) {
	on(f(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function wr(e, t, n, r) {
	let i = r.includes(".") ? Rn(n, r) : () => n[r];
	if (_(e)) {
		let n = t[e];
		g(n) && Fn(i, n);
	} else if (g(e)) Fn(i, e.bind(n));
	else if (y(e)) {
		if (f(e)) e.forEach((e) => wr(e, t, n, r));
		else {
			let r = g(e.handler) ? e.handler.bind(n) : t[e.handler];
			g(r) && Fn(i, r, e);
		}
	}
}
function Tr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Er(c, e, o, !0)), Er(c, t, o)), y(t) && a.set(t, c), c;
}
function Er(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Er(e, a, n, !0), i && i.forEach((t) => Er(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Dr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Dr = {
	data: Or,
	props: Nr,
	emits: Nr,
	methods: Mr,
	computed: Mr,
	beforeCreate: jr,
	created: jr,
	beforeMount: jr,
	mounted: jr,
	beforeUpdate: jr,
	updated: jr,
	beforeDestroy: jr,
	beforeUnmount: jr,
	destroyed: jr,
	unmounted: jr,
	activated: jr,
	deactivated: jr,
	errorCaptured: jr,
	serverPrefetch: jr,
	components: Mr,
	directives: Mr,
	watch: Pr,
	provide: Or,
	inject: kr
};
function Or(e, t) {
	return t ? e ? function() {
		return c(g(e) ? e.call(this, this) : e, g(t) ? t.call(this, this) : t);
	} : t : e;
}
function kr(e, t) {
	return Mr(Ar(e), Ar(t));
}
function Ar(e) {
	if (f(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function jr(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Mr(e, t) {
	return e ? c(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Nr(e, t) {
	return e ? f(e) && f(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : c(/* @__PURE__ */ Object.create(null), yr(e), yr(t ?? {})) : t;
}
function Pr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = c(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = jr(e[r], t[r]);
	return n;
}
function Fr() {
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
var Ir = 0;
function Lr(e, t) {
	return function(n, r = null) {
		g(n) || (n = c({}, n)), r != null && !y(r) && (r = null);
		let i = Fr(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, l = i.app = {
			_uid: Ir++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: ga,
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
					let u = l._ceVNode || Vi(n, r);
					return u.appContext = i, c === !0 ? c = "svg" : c === !1 && (c = void 0), o && t ? t(u, a) : e(u, a, c), s = !0, l._container = a, a.__vue_app__ = l, ma(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (on(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = Rr;
				Rr = l;
				try {
					return e();
				} finally {
					Rr = t;
				}
			}
		};
		return l;
	};
}
var Rr = null, zr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${k(t)}Modifiers`] || e[`${te(t)}Modifiers`];
function Br(e, t, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || n, a = r, o = t.startsWith("update:"), s = o && zr(i, t.slice(7));
	s && (s.trim && (a = r.map((e) => _(e) ? e.trim() : e)), s.number && (a = a.map(j)));
	let c, l = i[c = re(t)] || i[c = re(k(t))];
	!l && o && (l = i[c = re(te(t))]), l && on(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, on(u, e, 6, a);
	}
}
var Vr = /* @__PURE__ */ new WeakMap();
function Hr(e, t, n = !1) {
	let r = n ? Vr : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!g(e)) {
		let r = (e) => {
			let n = Hr(e, t, !0);
			n && (s = !0, c(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (y(e) && r.set(e, null), null) : (f(a) ? a.forEach((e) => o[e] = null) : c(o, a), y(e) && r.set(e, o), o);
}
function Ur(e, t) {
	return !e || !o(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), d(e, t[0].toLowerCase() + t.slice(1)) || d(e, te(t)) || d(e, t));
}
function Wr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Dn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Ki(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = Ki(e.length > 1 ? e(f, {
				attrs: c,
				slots: o,
				emit: l
			}) : e(f, null)), y = t.props ? c : Gr(c);
		}
	} catch (t) {
		ji.length = 0, sn(t, e, 1), v = Vi(ki);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(s) && (y = Kr(y, a)), b = Wi(b, y, !1, !0));
	}
	return n.dirs && (b = Wi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Wn(Bn(b.type) && Un(b) || b, n.transition), v = b, Dn(_), v;
}
var Gr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || o(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Kr = (e, t) => {
	let n = {};
	for (let r in e) (!s(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function qr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Jr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Yr(o, r, n) && !Ur(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Jr(r, o, l) : !!o;
	return !1;
}
function Jr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Yr(t, e, a) && !Ur(n, a)) return !0;
	}
	return !1;
}
function Yr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && y(r) && y(i) ? !ve(r, i) : r !== i;
}
function Xr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Zr = {}, Qr = () => Object.create(Zr), $r = (e) => Object.getPrototypeOf(e) === Zr;
function ei(e, t, n, r = !1) {
	let i = {}, a = Qr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), ni(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Pt(i) : e.type.props ? i : a, e.attrs = a;
}
function ti(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ L(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Ur(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (d(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = k(o);
						i[t] = ri(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		ni(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !d(t, a) && ((r = te(a)) === a || !d(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = ri(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !d(t, e)) && (delete a[e], l = !0);
	}
	l && $e(e.attrs, "set", "");
}
function ni(e, t, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let n in t) {
		if (E(n)) continue;
		let l = t[n], u;
		a && d(a, u = k(n)) ? !o || !o.includes(u) ? r[u] = l : (c ||= {})[u] = l : Ur(e.emitsOptions, n) || (!(n in i) || l !== i[n]) && (i[n] = l, s = !0);
	}
	if (o) {
		let t = /* @__PURE__ */ L(r), i = c || n;
		for (let n = 0; n < o.length; n++) {
			let s = o[n];
			r[s] = ri(a, t, s, i[s], e, !d(i, s));
		}
	}
	return s;
}
function ri(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = d(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && g(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = ia(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === te(n)) && (r = !0));
	}
	return r;
}
var ii = /* @__PURE__ */ new WeakMap();
function ai(e, t, i = !1) {
	let a = i ? ii : t.propsCache, o = a.get(e);
	if (o) return o;
	let s = e.props, l = {}, u = [], p = !1;
	if (!g(e)) {
		let n = (e) => {
			p = !0;
			let [n, r] = ai(e, t, !0);
			c(l, n), r && u.push(...r);
		};
		!i && t.mixins.length && t.mixins.forEach(n), e.extends && n(e.extends), e.mixins && e.mixins.forEach(n);
	}
	if (!s && !p) return y(e) && a.set(e, r), r;
	if (f(s)) for (let e = 0; e < s.length; e++) {
		let t = k(s[e]);
		oi(t) && (l[t] = n);
	}
	else if (s) for (let e in s) {
		let t = k(e);
		if (oi(t)) {
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
function oi(e) {
	return e[0] !== "$" && !E(e);
}
var si = (e) => e === "_" || e === "_ctx" || e === "$stable", ci = (e) => f(e) ? e.map(Ki) : [Ki(e)], li = (e, t, n) => {
	if (t._n) return t;
	let r = On((...e) => ci(t(...e)), n);
	return r._c = !1, r;
}, ui = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (si(n)) continue;
		let i = e[n];
		if (g(i)) t[n] = li(n, i, r);
		else if (i != null) {
			let e = ci(i);
			t[n] = () => e;
		}
	}
}, di = (e, t) => {
	let n = ci(t);
	e.slots.default = () => n;
}, fi = (e, t, n) => {
	for (let r in t) (n || !si(r)) && (e[r] = t[r]);
}, pi = (e, t, n) => {
	let r = e.slots = Qr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (fi(r, t, n), n && ae(r, "_", e, !0)) : ui(t, r);
	} else t && di(e, t);
}, mi = (e, t, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = n;
	if (i.shapeFlag & 32) {
		let e = t._;
		e ? r && e === 1 ? o = !1 : fi(a, t, r) : (o = !t.$stable, ui(t, a)), s = t;
	} else t && (di(e, t), s = { default: 1 });
	if (o) for (let e in a) !si(e) && s[e] == null && delete a[e];
}, hi = Di;
function gi(e) {
	return _i(e);
}
function _i(e, t) {
	let a = se();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = i, insertStaticContent: _ } = e, v = (e, t, n, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ri(e, t) && (i = ge(e), de(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === r && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case Oi:
				y(e, t, n, i);
				break;
			case ki:
				b(e, t, n, i);
				break;
			case Ai:
				e ?? x(t, n, i, s);
				break;
			case H:
				ne(e, t, n, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, n, i, a, o, s, c, l) : f & 6 ? re(e, t, n, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, n, i, a, o, s, c, l, P);
		}
		d != null && a ? Jn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Jn(e.ref, null, o, e, !0);
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
				n && n._beginPatch(), k(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && O(e.children, d, null, r, i, vi(e, a), s, u), _ && An(e, null, r, "created"), D(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !E(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Xi(f, r, e);
		}
		_ && An(e, null, r, "beforeMount");
		let v = bi(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && hi(() => {
			try {
				f && Xi(f, r, e), v && g.enter(d), _ && An(e, null, r, "mounted");
			} finally {}
		}, i);
	}, D = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Ei(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				D(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, O = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? qi(e[l]) : Ki(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, k = (e, t, r, i, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || n, h = t.props || n, g;
		if (r && yi(r, !1), (g = h.onVnodeBeforeUpdate) && Xi(g, r, t, e), f && An(t, e, r, "beforeUpdate"), r && yi(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? ee(e.dynamicChildren, d, l, r, i, vi(t, a), o) : s || M(e, t, l, null, r, i, vi(t, a), o, !1), u > 0) {
			if (u & 16) te(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== t.children && p(l, t.children);
		} else !s && d == null && te(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && hi(() => {
			g && Xi(g, r, t, e), f && An(t, e, r, "updated");
		}, i);
	}, ee = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === H || !Ri(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, te = (e, t, r, i, a) => {
		if (t !== r) {
			if (t !== n) for (let n in t) !E(n) && !(n in r) && c(e, n, t[n], null, a, i);
			for (let n in r) {
				if (E(n)) continue;
				let o = r[n], s = t[n];
				o !== s && n !== "value" && c(e, n, s, o, a, i);
			}
			"value" in r && c(e, "value", t.value, r.value, a);
		}
	}, ne = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), O(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (ee(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && xi(e, t, !0)) : M(e, t, n, f, i, a, s, c, l);
	}, re = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : A(t, n, r, i, a, o, c) : ae(e, t, c);
	}, A = (e, t, n, r, i, a, o) => {
		let s = e.component = $i(e, r, i);
		if (Zn(e) && (s.ctx.renderer = P), ca(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, j, o), !e.el) {
				let r = s.subTree = Vi(ki);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else j(s, e, t, n, i, a, o);
	}, ae = (e, t, n) => {
		let r = t.component = e.component;
		if (qr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, oe(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, j = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Ci(e);
					if (n) {
						t && (t.el = c.el, oe(e, t, o)), n.asyncDep.then(() => {
							hi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				yi(e, !1), t ? (t.el = c.el, oe(e, t, o)) : t = c, n && ie(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Xi(d, s, t, c), yi(e, !0);
				let f = Wr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ge(p), e, i, a), t.el = f.el, u === null && Xr(e, f.el), r && hi(r, i), (d = t.props && t.props.onVnodeUpdated) && hi(() => Xi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Xn(t);
				if (yi(e, !1), l && ie(l), !m && (o = c && c.onVnodeBeforeMount) && Xi(o, d, t), yi(e, !0), s && ye) {
					let t = () => {
						e.subTree = Wr(e), ye(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Wr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && hi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					hi(() => Xi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Xn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && hi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ee(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => vn(u), yi(e, !0), l();
	}, oe = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, ti(e, t.props, r, n), mi(e, t.children, n), Ve(), xn(e), He();
	}, M = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				le(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				ce(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && he(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? le(l, d, n, r, i, a, o, s, c) : he(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && O(d, n, r, i, a, o, s, c));
	}, ce = (e, t, n, i, a, o, s, c, l) => {
		e ||= r, t ||= r;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? qi(t[p]) : Ki(t[p]);
			v(e[p], r, n, null, a, o, s, c, l);
		}
		u > d ? he(e, a, o, !0, !1, f) : O(t, n, i, a, o, s, c, l, f);
	}, le = (e, t, n, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let r = e[u], i = t[u] = l ? qi(t[u]) : Ki(t[u]);
			if (Ri(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let r = e[f], i = t[p] = l ? qi(t[p]) : Ki(t[p]);
			if (Ri(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, r = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? qi(t[u]) : Ki(t[u]), n, r, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) de(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? qi(t[u]) : Ki(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let r = e[u];
				if (y >= b) {
					de(r, a, o, !0);
					continue;
				}
				let i;
				if (r.key != null) i = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Ri(r, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? de(r, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(r, t[i], n, null, a, o, s, c, l), y++);
			}
			let w = x ? Si(C) : r;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, r = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Ti(f) : i;
				C[u] === 0 ? v(null, r, n, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? ue(r, n, p, 2) : _--);
			}
		}
	}, ue = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			ue(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, P);
			return;
		}
		if (c === H) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) ue(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Ai) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Vn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), hi(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Vn];
					a._isLeaving && a[Vn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, de = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ve(), Jn(s, null, n, e, !0), He()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Xn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Xi(_, t, e), u & 6) me(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && An(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, P, r) : l && !l.hasOnce && (a !== H || d > 0 && d & 64) ? he(l, t, n, !1, !0) : (a === H && d & 384 || !i && u & 16) && he(c, t, n), r && fe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && hi(() => {
			_ && Xi(_, t, e), h && An(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, fe = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === H) {
			pe(n, r);
			return;
		}
		if (t === Ai) {
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
	}, pe = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, me = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		wi(c), wi(l), r && ie(r), i.stop(), a ? (a.flags |= 8, de(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, de(o, e, t, n)), s && hi(s, t), hi(() => {
			e.isUnmounted = !0;
		}, t);
	}, he = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) de(e[o], t, n, r, i);
	}, ge = (e) => {
		if (e.shapeFlag & 6) return ge(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[zn];
		return n ? h(n) : t;
	}, N = !1, _e = (e, t, n) => {
		let r;
		e == null ? t._vnode && (de(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, N ||= (N = !0, xn(r), Sn(), !1);
	}, P = {
		p: v,
		um: de,
		m: ue,
		r: fe,
		mt: A,
		mc: O,
		pc: M,
		pbc: ee,
		n: ge,
		o: e
	}, ve, ye;
	return t && ([ve, ye] = t(P)), {
		render: _e,
		hydrate: ve,
		createApp: Lr(_e, ve)
	};
}
function vi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function yi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function bi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function xi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (f(r) && f(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = qi(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && xi(t, a)), a.type === Oi && (a.patchFlag === -1 && (a = i[e] = qi(a)), a.el = t.el), a.type === ki && !a.el && (a.el = t.el);
	}
}
function Si(e) {
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
function Ci(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Ci(t);
}
function wi(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ti(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Ti(t.subTree) : null;
}
var Ei = (e) => e.__isSuspense;
function Di(e, t) {
	t && t.pendingBranch ? f(e) ? t.effects.push(...e) : t.effects.push(e) : bn(e);
}
var H = /* @__PURE__ */ Symbol.for("v-fgt"), Oi = /* @__PURE__ */ Symbol.for("v-txt"), ki = /* @__PURE__ */ Symbol.for("v-cmt"), Ai = /* @__PURE__ */ Symbol.for("v-stc"), ji = [], Mi = null;
function U(e = !1) {
	ji.push(Mi = e ? null : []);
}
function Ni() {
	ji.pop(), Mi = ji[ji.length - 1] || null;
}
var Pi = 1;
function Fi(e, t = !1) {
	Pi += e, e < 0 && Mi && t && (Mi.hasOnce = !0);
}
function Ii(e) {
	return e.dynamicChildren = Pi > 0 ? Mi || r : null, Ni(), Pi > 0 && Mi && Mi.push(e), e;
}
function W(e, t, n, r, i, a) {
	return Ii(K(e, t, n, r, i, a, !0));
}
function G(e, t, n, r, i) {
	return Ii(Vi(e, t, n, r, i, !0));
}
function Li(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Ri(e, t) {
	return e.type === t.type && e.key === t.key;
}
var zi = ({ key: e }) => e ?? null, Bi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : _(e) || /* @__PURE__ */ Wt(e) || g(e) ? {
	i: Tn,
	r: e,
	k: t,
	f: !!n
} : e);
function K(e, t = null, n = null, r = 0, i = null, a = e === H ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && zi(t),
		ref: t && Bi(t),
		scopeId: En,
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
		ctx: Tn
	};
	return s ? (Ji(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= _(n) ? 8 : 16), Pi > 0 && !o && Mi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Mi.push(c), c;
}
var Vi = Hi;
function Hi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === mr) && (e = ki), Li(e)) {
		let r = Wi(e, t, !0);
		return n && Ji(r, n), Pi > 0 && !a && Mi && (r.shapeFlag & 6 ? Mi[Mi.indexOf(e)] = r : Mi.push(r)), r.patchFlag = -2, r;
	}
	if (ha(e) && (e = e.__vccOpts), t) {
		t = Ui(t);
		let { class: e, style: n } = t;
		e && !_(e) && (t.class = fe(e)), y(n) && (/* @__PURE__ */ Bt(n) && !f(n) && (n = c({}, n)), t.style = M(n));
	}
	let o = _(e) ? 1 : Ei(e) ? 128 : Bn(e) ? 64 : y(e) ? 4 : g(e) ? 2 : 0;
	return K(e, t, n, r, i, o, a, !0);
}
function Ui(e) {
	return e ? /* @__PURE__ */ Bt(e) || $r(e) ? c({}, e) : e : null;
}
function Wi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Yi(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && zi(l),
		ref: t && t.ref ? n && a ? f(a) ? a.concat(Bi(t)) : [a, Bi(t)] : Bi(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== H ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Wi(e.ssContent),
		ssFallback: e.ssFallback && Wi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Wn(u, c.clone(u)), u;
}
function q(e = " ", t = 0) {
	return Vi(Oi, null, e, t);
}
function Gi(e, t) {
	let n = Vi(Ai, null, e);
	return n.staticCount = t, n;
}
function J(e = "", t = !1) {
	return t ? (U(), G(ki, null, e)) : Vi(ki, null, e);
}
function Ki(e) {
	return e == null || typeof e == "boolean" ? Vi(ki) : f(e) ? Vi(H, null, e.slice()) : Li(e) ? qi(e) : Vi(Oi, null, String(e));
}
function qi(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Wi(e);
}
function Ji(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (f(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Ji(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !$r(t) ? t._ctx = Tn : r === 3 && Tn && (Tn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (g(t)) {
		if (r & 65) {
			Ji(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Tn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [q(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Yi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = fe([t.class, r.class]));
		else if (e === "style") t.style = M([t.style, r.style]);
		else if (o(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(f(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !s(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Xi(e, t, n, r = null) {
	on(e, t, 7, [n, r]);
}
var Zi = Fr(), Qi = 0;
function $i(e, t, r) {
	let i = e.type, a = (t ? t.appContext : e.appContext) || Zi, o = {
		uid: Qi++,
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
		scope: new Ce(!0),
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
		propsOptions: ai(i, a),
		emitsOptions: Hr(i, a),
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
	return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = Br.bind(null, o), e.ce && e.ce(o), o;
}
var ea = null, ta = () => ea || Tn, na, ra;
{
	let e = se(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	na = t("__VUE_INSTANCE_SETTERS__", (e) => ea = e), ra = t("__VUE_SSR_SETTERS__", (e) => sa = e);
}
var ia = (e) => {
	let t = ea;
	return na(e), e.scope.on(), () => {
		e.scope.off(), na(t);
	};
}, aa = () => {
	ea && ea.scope.off(), na(null);
};
function oa(e) {
	return e.vnode.shapeFlag & 4;
}
var sa = !1;
function ca(e, t = !1, n = !1) {
	t && ra(t);
	let { props: r, children: i } = e.vnode, a = oa(e);
	ei(e, r, a, t), pi(e, i, n || t);
	let o = a ? la(e, t) : void 0;
	return t && ra(!1), o;
}
function la(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, vr);
	let { setup: r } = n;
	if (r) {
		Ve();
		let n = e.setupContext = r.length > 1 ? pa(e) : null, i = ia(e), a = an(r, e, 0, [e.props, n]), o = b(a);
		if (He(), i(), (o || e.sp) && !Xn(e) && Gn(e), o) {
			if (a.then(aa, aa), t) return a.then((n) => {
				ra(!0);
				try {
					ua(e, n, t);
				} finally {
					ra(!1);
				}
			}).catch((t) => {
				sn(t, e, 0);
			});
			e.asyncDep = a;
		} else ua(e, a, t);
	} else da(e, t);
}
function ua(e, t, n) {
	g(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : y(t) && (e.setupState = Yt(t)), da(e, n);
}
function da(e, t, n) {
	let r = e.type;
	e.render ||= r.render || i;
	{
		let t = ia(e);
		Ve();
		try {
			xr(e);
		} finally {
			He(), t();
		}
	}
}
var fa = { get(e, t) {
	return Qe(e, "get", ""), e[t];
} };
function pa(e) {
	return {
		attrs: new Proxy(e.attrs, fa),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function ma(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Yt(Vt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in gr) return gr[n](e);
		},
		has(e, t) {
			return t in e || t in gr;
		}
	}) : e.proxy;
}
function ha(e) {
	return g(e) && "__vccOpts" in e;
}
var Y = (e, t) => /* @__PURE__ */ Zt(e, t, sa), ga = "3.5.43", _a = void 0, va = typeof window < "u" && window.trustedTypes;
if (va) try {
	_a = /* @__PURE__ */ va.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var ya = _a ? (e) => _a.createHTML(e) : (e) => e, ba = "http://www.w3.org/2000/svg", xa = "http://www.w3.org/1998/Math/MathML", Sa = typeof document < "u" ? document : null, Ca = Sa && /* @__PURE__ */ Sa.createElement("template"), wa = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Sa.createElementNS(ba, e) : t === "mathml" ? Sa.createElementNS(xa, e) : n ? Sa.createElement(e, { is: n }) : Sa.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Sa.createTextNode(e),
	createComment: (e) => Sa.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Sa.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Ca.innerHTML = ya(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ca.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ta = /* @__PURE__ */ Symbol("_vtc");
function Ea(e, t, n) {
	let r = e[Ta];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Da = /* @__PURE__ */ Symbol("_vod"), Oa = /* @__PURE__ */ Symbol("_vsh"), ka = /* @__PURE__ */ Symbol(""), Aa = /(?:^|;)\s*display\s*:/;
function ja(e, t, n) {
	let r = e.style, i = _(n), a = !1;
	if (n && !i) {
		if (t) {
			if (_(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Na(r, t, "");
			}
			else for (let e in t) n[e] ?? Na(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Na(r, i, "") : La(e, i, !_(t) && t ? t[i] : void 0, o) || Na(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[ka];
			e && (n += ";" + e), r.cssText = n, a = Aa.test(n);
		}
	} else t && e.removeAttribute("style");
	Da in e && (e[Da] = a ? r.display : "", e[Oa] && (r.display = "none"));
}
var Ma = /\s*!important$/;
function Na(e, t, n) {
	if (f(n)) n.forEach((n) => Na(e, t, n));
	else if (n ??= "", t.startsWith("--")) Ma.test(n) ? e.setProperty(t, n.replace(Ma, ""), "important") : e.setProperty(t, n);
	else {
		let r = Ia(e, t);
		Ma.test(n) ? e.setProperty(te(r), n.replace(Ma, ""), "important") : e[r] = n;
	}
}
var Pa = [
	"Webkit",
	"Moz",
	"ms"
], Fa = {};
function Ia(e, t) {
	let n = Fa[t];
	if (n) return n;
	let r = k(t);
	if (r !== "filter" && r in e) return Fa[t] = r;
	r = ne(r);
	for (let n = 0; n < Pa.length; n++) {
		let i = Pa[n] + r;
		if (i in e) return Fa[t] = i;
	}
	return t;
}
function La(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && _(r) && n === r;
}
var Ra = "http://www.w3.org/1999/xlink";
function za(e, t, n, r, i, a = me(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Ra, t.slice(6, t.length)) : e.setAttributeNS(Ra, t, n) : n == null || a && !he(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : v(n) ? String(n) : n);
}
function Ba(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? ya(n) : n);
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
		r === "boolean" ? n = he(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Va(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Ha(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Ua = /* @__PURE__ */ Symbol("_vei");
function Wa(e, t, n, r, i = null) {
	let a = e[Ua] || (e[Ua] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = qa(t);
		r ? Va(e, n, a[t] = Za(r, i), s) : o && (Ha(e, n, o, s), a[t] = void 0);
	}
}
var Ga = /(Once|Passive|Capture)$/, Ka = /^on:?(?:Once|Passive|Capture)$/;
function qa(e) {
	let t, n;
	for (; (n = e.match(Ga)) && !Ka.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : te(e.slice(2)), t];
}
var Ja = 0, Ya = /* @__PURE__ */ Promise.resolve(), Xa = () => Ja ||= (Ya.then(() => Ja = 0), Date.now());
function Za(e, t) {
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
				e && on(e, t, 5, a);
			}
		} else on(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Xa(), n;
}
var Qa = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, $a = (e, t, n, r, i, a) => {
	let c = i === "svg";
	t === "class" ? Ea(e, r, c) : t === "style" ? ja(e, n, r) : o(t) ? s(t) || Wa(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : eo(e, t, r, c)) ? (Ba(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && za(e, t, r, c, a, t !== "value")) : e._isVueCE && (to(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !_(r))) ? Ba(e, k(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), za(e, t, r, c));
};
function eo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Qa(t) && g(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Qa(t) && _(n) ? !1 : t in e;
}
function to(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = k(t);
	return Array.isArray(n) ? n.some((e) => k(e) === r) : Object.keys(n).some((e) => k(e) === r);
}
var no = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return f(t) ? (e) => ie(t, e) : t;
};
function ro(e) {
	e.target.composing = !0;
}
function io(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var ao = /* @__PURE__ */ Symbol("_assign"), oo = /* @__PURE__ */ Symbol("_initialValue");
function so(e, t, n) {
	return t && (e = e.trim()), n && (e = j(e)), e;
}
var co = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[oo] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[oo] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[ao] = no(i);
		let a = r || i.props && i.props.type === "number";
		Va(e, t ? "change" : "input", (t) => {
			t.target.composing || e[ao](so(e.value, n, a));
		}), (n || a) && Va(e, "change", () => {
			e.value = so(e.value, n, a);
		}), t || (Va(e, "compositionstart", ro), Va(e, "compositionend", io), Va(e, "change", io));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[oo];
		delete e[oo], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[ao](so(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[ao] = no(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? j(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, lo = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], uo = {
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
	exact: (e, t) => lo.some((n) => e[`${n}Key`] && !t.includes(n))
}, fo = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = uo[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, po = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, mo = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = te(n.key);
		if (t.some((e) => e === r || po[e] === r)) return e(n);
	}));
}, ho = /* @__PURE__ */ c({ patchProp: $a }, wa), go;
function _o() {
	return go ||= gi(ho);
}
var vo = ((...e) => {
	let t = _o().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = bo(e);
		if (!r) return;
		let i = t._component;
		!g(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, yo(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function yo(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function bo(e) {
	return _(e) ? document.querySelector(e) : e;
}
//#endregion
//#region editor/src/components/BuyPanel.vue?vue&type=script&setup=true&lang.ts
var xo = {
	class: "card",
	"aria-label": "Price and basket"
}, So = { class: "buy-row" }, Co = {
	class: "label",
	for: "qty",
	style: {
		display: "flex",
		"align-items": "center",
		gap: "8px",
		color: "var(--ink)"
	}
}, wo = ["disabled", "aria-describedby"], To = {
	key: 0,
	id: "buy-blocked",
	class: "small",
	style: {
		margin: "0",
		color: "var(--danger)"
	}
}, Eo = { style: { margin: "0 0 16px" } }, Do = { style: {
	display: "flex",
	"flex-direction": "column",
	gap: "8px"
} }, Oo = /* @__PURE__ */ B({
	__name: "BuyPanel",
	props: {
		designJson: { type: Function },
		previewSvg: { type: Function },
		fileStem: {},
		blocked: {}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ R(1), r = /* @__PURE__ */ R(null);
		function i(e, t, n) {
			let r = URL.createObjectURL(new Blob([t], { type: n })), i = document.createElement("a");
			i.href = r, i.download = e, i.click(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
		}
		return (e, a) => (U(), W(H, null, [K("section", xo, [
			a[6] ||= K("div", { class: "price" }, [K("span", { class: "amount display" }, "[PRICE]"), K("span", { class: "small muted" }, "ex VAT · prices come from the shop")], -1),
			K("div", So, [K("label", Co, [a[5] ||= q(" Qty ", -1), kn(K("input", {
				id: "qty",
				"onUpdate:modelValue": a[0] ||= (e) => n.value = e,
				class: "qty",
				type: "number",
				min: "1"
			}, null, 512), [[
				co,
				n.value,
				void 0,
				{ number: !0 }
			]])]), K("button", {
				class: "btn go grow",
				style: { height: "48px" },
				disabled: !!t.blocked,
				"aria-describedby": t.blocked ? "buy-blocked" : void 0,
				onClick: a[1] ||= (e) => r.value?.showModal()
			}, "Add to basket", 8, wo)]),
			t.blocked ? (U(), W("p", To, F(t.blocked), 1)) : J("", !0)
		]), K("dialog", {
			ref_key: "dialog",
			ref: r,
			"aria-labelledby": "saved-heading"
		}, [
			a[7] ||= K("h2", {
				id: "saved-heading",
				class: "display",
				style: {
					margin: "0 0 8px",
					"font-size": "26px"
				}
			}, "Design captured", -1),
			K("p", Eo, "This is the test site, so nothing was added to a basket. On the shop, this design would be saved with the order (" + F(n.value) + " × this sign).", 1),
			K("div", Do, [
				K("button", {
					class: "btn",
					onClick: a[2] ||= (e) => i(`${t.fileStem}.json`, t.designJson(), "application/json")
				}, "Download design (JSON)"),
				K("button", {
					class: "btn",
					onClick: a[3] ||= (e) => t.previewSvg().then((e) => i(`${t.fileStem}.svg`, e, "image/svg+xml"))
				}, "Download artwork (SVG)"),
				K("button", {
					class: "btn accent",
					onClick: a[4] ||= (e) => r.value?.close()
				}, "Back to the design")
			])
		], 512)], 64));
	}
}), ko = {
	key: "__unknown__",
	title: "Unknown category",
	background: { hex: "#FFFFFF" },
	panel: { hex: "#808080" },
	panel_text: { hex: "#000000" },
	border: { hex: "#000000" }
}, Ao = (e) => e.symbol_frame?.symbols[0]?.category ?? e.category;
function jo(e, t) {
	switch (e) {
		case "background": return t.background;
		case "panel": return t.panel;
		case "panel_text": return t.panel_text;
		case "symbol_background": return t.symbol_background;
		case "border": return t.border ?? { hex: "#000000" };
	}
}
function Mo(e, t, n) {
	return e ? "token" in e ? jo(e.token, n) : e : jo(t, n);
}
//#endregion
//#region src/engine/context.ts
var No = (e) => ({
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
function Po(e, t) {
	e.unitRef = t, e.gap = e.ratios.UNIFORM_GAP === null ? null : e.ratios.UNIFORM_GAP * t;
}
function Fo(e, t, n) {
	let r = {
		unitRef: e.unitRef,
		gap: e.gap
	};
	Po(e, t);
	try {
		return n();
	} finally {
		e.unitRef = r.unitRef, e.gap = r.gap;
	}
}
function Io(e) {
	return e.corners.rounded ? e.corners.radius === null ? e.ratios.CORNER_RADIUS === null ? e.gap ?? e.ratios.MARGIN * e.unitRef : e.ratios.CORNER_RADIUS * e.unitRef : e.corners.radius : 0;
}
var Lo = (e) => ({
	...e,
	nodes: [],
	findings: []
});
function Ro(e, t) {
	e.findings.some((e) => e.code === t.code && e.path === t.path) || e.findings.push(t);
}
function zo(e, t, n) {
	let r = Ao(e);
	return (r === void 0 ? void 0 : t.ruleset.theme(r)) || (Ro(t, {
		severity: "error",
		code: "E_UNKNOWN_CATEGORY",
		path: n,
		message: r === void 0 ? "Section has no category (text-only sections need `category`)" : `Category "${r}" is not defined in ruleset "${t.ruleset.id}"`
	}), ko);
}
//#endregion
//#region src/engine/report.ts
function Bo(e, t, n) {
	return {
		sections: e,
		findings: [...t.findings, ...t.ruleset.check(n, {
			sections: e,
			findings: t.findings
		})]
	};
}
//#endregion
//#region src/schema/colour.ts
var Vo = (e) => {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
};
function Ho(e) {
	let t = /^#?([0-9a-f]{6})$/i.exec(e.trim());
	if (!t) return 0;
	let n = parseInt(t[1], 16);
	return .2126 * Vo(n >> 16 & 255) + .7152 * Vo(n >> 8 & 255) + .0722 * Vo(n & 255);
}
//#endregion
//#region src/engine/geometry.ts
var Uo = 1e-6, Wo = (e, t, n) => Math.min(Math.max(e, t), n), X = (e, t = 3) => {
	let n = 10 ** t, r = Math.round(e * n) / n;
	return Object.is(r, -0) ? 0 : r;
}, Go = (e) => Math.floor(e * 10 + 1e-9) / 10, Ko = (e, t) => Math.min(e, t);
function qo(e, [t, n, r, i]) {
	return {
		x: e.x + i,
		y: e.y + t,
		w: Math.max(0, e.w - i - n),
		h: Math.max(0, e.h - t - r)
	};
}
var Jo = (e) => [
	e,
	e,
	e,
	e
], Yo = (e, t) => t === "vertical" ? e.h : e.w, Xo = (e, t) => t === "vertical" ? e.w : e.h, Zo = (e, t) => t === "vertical" ? e.y : e.x;
function Qo(e, t, n, r) {
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
var $o = { hex: "#FF00FF" }, es = .25, ts = {
	hex: "#000000",
	cmyk: [
		0,
		0,
		0,
		100
	]
}, ns = {
	hex: "#FFFFFF",
	cmyk: [
		0,
		0,
		0,
		0
	]
}, rs = (e, t) => t.border ?? (e && Ho(e.hex) < .5 ? ns : ts), is = (e, t = 0) => {
	let n = Math.max(0, Math.min(t, e.w / 2, e.h / 2));
	if (n <= 0) return `M${X(e.x)} ${X(e.y)}H${X(e.x + e.w)}V${X(e.y + e.h)}H${X(e.x)}Z`;
	let [r, i, a, o, s] = [
		e.x,
		e.y,
		e.w,
		e.h,
		n
	];
	return `M${X(r + s)} ${X(i)}H${X(r + a - s)}A${X(s)} ${X(s)} 0 0 1 ${X(r + a)} ${X(i + s)}V${X(i + o - s)}A${X(s)} ${X(s)} 0 0 1 ${X(r + a - s)} ${X(i + o)}H${X(r + s)}A${X(s)} ${X(s)} 0 0 1 ${X(r)} ${X(i + o - s)}V${X(i + s)}A${X(s)} ${X(s)} 0 0 1 ${X(r + s)} ${X(i)}Z`;
};
function as(e, t, n) {
	let r = Ko(e.width, e.height);
	Po(n, r);
	let i = e.corner_radius ?? 0, a = {
		x: 0,
		y: 0,
		w: e.width,
		h: e.height
	}, o = e.substrate ? Mo(e.substrate, "background", t) : void 0;
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
	let s = o && e.background === void 0 ? void 0 : Mo(e.background, "background", t);
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
	let c = e.margin === void 0 || e.margin === "auto" ? n.gap ?? n.ratios.MARGIN * r : e.margin, l = qo(a, Jo(c));
	if (e.border) {
		let a = e.border.width === "auto" ? n.ratios.BORDER * r : e.border.width, u = e.border.colour ? Mo(e.border.colour, "border", t) : rs(s ?? o, t), d = qo(l, Jo(a));
		if (a > 0 && u) {
			let t = n.corners.radius, r = c > 0 ? n.corners.rounded ? (t ?? a) + a : 0 : i, o = n.corners.rounded ? t === null ? r > 0 ? Math.max(0, r - a) : Io(n) : t : 0;
			n.nodes.push({
				type: "path",
				id: `${e.id}--border`,
				source_id: e.id,
				layer: "artwork",
				d: `${is(l, r)}${is(d, o)}`,
				fill: u,
				fill_rule: "evenodd"
			});
		}
		l = d;
	}
	if (e.padding !== void 0) {
		let t = e.padding === "auto" ? n.gap ?? n.ratios.MARGIN * r : e.padding;
		l = qo(l, Jo(Math.max(0, t)));
	}
	return l;
}
function os(e, t) {
	let n = e.corner_radius ?? 0, r = es / 2;
	t.nodes.push({
		type: "rect",
		id: `${e.id}--cut`,
		source_id: e.id,
		layer: "guide",
		x: r,
		y: r,
		width: e.width - es,
		height: e.height - es,
		radius: [
			n,
			n,
			n,
			n
		],
		stroke: {
			colour: $o,
			width: es
		}
	});
}
//#endregion
//#region src/engine/cells.ts
var ss = (e, t, n) => e ? e.width === "auto" ? t.ratios.CELL_OUTLINE * n : e.width : 0, cs = (e, t) => e?.layer === "artwork" ? t : 0;
function ls(e, t, n, r) {
	let i = r.ratios, a = Ko(e.w, e.h);
	return {
		outer: e,
		inner: qo(e, Jo(t === void 0 || t === "auto" ? (i.UNIFORM_GAP ?? i.CELL_PADDING) * a + n : t))
	};
}
function us(e, t, n, r, i, a) {
	if (!t) return;
	let o = Mo(t.colour, "border", a);
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
function ds(e, t, n, r) {
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
var fs = (e) => typeof e == "number" && Number.isFinite(e) && e > 0 ? e : 1;
function ps(e, t, n, r, i) {
	let a = Ko(e.width, e.height), o = t.gutter === "auto" ? r.ratios.GRID_GUTTER * a : t.gutter, s = t.rows.length ? t.rows : [{ cells: 1 }], c = ds(s.map((e) => ({
		basis: 0,
		min: 0,
		max: Infinity,
		grow: fs(e.weight),
		shrink: 0
	})), n.h, o, "start"), l = ss(t.cell_outline, r, a), u = cs(t.cell_outline, l), d = [];
	return s.forEach((e, i) => {
		let a = Math.max(1, Math.floor(e.cells)), s = Math.max(0, (n.w - o * (a - 1)) / a);
		for (let e = 0; e < a; e++) {
			let a = ls({
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
	}), us(d, t.cell_outline, l, e, r, i), d;
}
//#endregion
//#region src/engine/resolveGrid.ts
function ms(e, t, n, r, i) {
	let a = r.ratios, o = Ko(e.width, e.height), s = Math.max(1, Math.floor(t.rows)), c = Math.max(1, Math.floor(t.cols)), l = t.gutter === "auto" ? a.GRID_GUTTER * o : t.gutter, u = Math.max(0, (n.w - l * (c - 1)) / c), d = Math.max(0, (n.h - l * (s - 1)) / s), f = ss(t.cell_outline, r, o), p = cs(t.cell_outline, f), m = [];
	for (let e = 0; e < s; e++) for (let i = 0; i < c; i++) m.push(ls({
		x: n.x + i * (u + l),
		y: n.y + e * (d + l),
		w: u,
		h: d
	}, t.cell_padding, p, r));
	if (us(m, t.cell_outline, f, e, r, i), t.dividers && t.dividers.width > 0) {
		let a = Mo(t.dividers.colour, "border", i), o = t.dividers.width, f = [];
		for (let e = 1; e < c; e++) {
			let t = n.x + e * (u + l) - l / 2;
			f.push(`M${X(t)} ${X(n.y)}V${X(n.y + n.h)}`);
		}
		for (let e = 1; e < s; e++) {
			let t = n.y + e * (d + l) - l / 2;
			f.push(`M${X(n.x)} ${X(t)}H${X(n.x + n.w)}`);
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
var hs = (e) => e[2] / e[3], gs = (e, t) => t === "start" ? 0 : t === "end" ? e : e / 2, _s = (e, t, n) => e.spacing === "auto" ? t.ratios.SYMBOL_SPACING * n : e.spacing, vs = (e, t) => {
	let n = e.ratios.SYMBOL_PADDING * t;
	return {
		main: e.gap === null ? n : 0,
		cross: n
	};
}, ys = (e, t, n) => qo(e, t === "vertical" ? [
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
function bs(e, t, n, r, i) {
	let a = e.symbols.length;
	if (a === 0) return 0;
	let o = _s(e, r, i), s = vs(r, i), c = Math.max(0, t - 2 * s.cross - o * (a - 1)), l = e.symbols.map((e) => hs(e.source.view_box));
	return (n === "vertical" ? c / l.reduce((e, t) => e + t, 0) : c / l.reduce((e, t) => e + 1 / t, 0)) + 2 * s.main;
}
function xs(e, t, n, r, i, a) {
	let o = t.background ? Mo(t.background, "symbol_background", i) : void 0, s = t.symbols.length;
	if (t.tile && s > 0) {
		let e = t.tile, a = e.fill === "none" ? void 0 : Mo(e.fill, "symbol_background", i), o = a ? Math.min(Io(r), n.w / 2, n.h / 2) : 0;
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
	let c = vs(r, a), l = ys(n, e.orientation, c), u = _s(t, r, a), d = t.symbols.map((e) => hs(e.source.view_box)), f = [], p = (e, t, n, r, i) => {
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
		let e = Math.max(0, l.w - u * (s - 1)) / d.reduce((e, t) => e + t, 0), n = Math.max(0, Math.min(l.h, e)), r = d.reduce((e, t) => e + t * n, 0) + u * (s - 1), i = l.x + gs(l.w - r, t.align), a = l.y + gs(l.h - n, t.align);
		t.symbols.forEach((e, t) => {
			let r = d[t] * n;
			p(e, i, a, r, n), i += r + u;
		}), m();
	} else {
		let e = Math.max(0, l.h - u * (s - 1)) / d.reduce((e, t) => e + 1 / t, 0), n = Math.max(0, Math.min(l.w, e)), r = d.reduce((e, t) => e + n / t, 0) + u * (s - 1), i = l.y + gs(l.h - r, t.align), a = l.x + gs(l.w - n, t.align);
		t.symbols.forEach((e, t) => {
			let r = n / d[t];
			p(e, a, i, n, r), i += r + u;
		}), m();
	}
}
//#endregion
//#region src/engine/fit.ts
var Ss = (e, t) => Math.max(t.min, Math.min(t.recommended, Go(e * t.recommended))), Cs = 18;
function ws(e, t = 1) {
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
	for (let t = 0; t < Cs; t++) {
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
function Ts(e, t, n, r, i) {
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
	let p = ds(f.map((e) => ({
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
		let { it: t, i } = f[e], c = e === 0 ? s : g + r, u = f.slice(e).reduce((e, t) => e + t.it.height, 0) + r * (f.length - e - 1), d = l - u + h, m = Math.max(p[e], c), _ = d < c ? c : Wo(m + t.y_offset, c, d);
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
var Es = "gjpqy";
function Ds(e) {
	return e.trim() === "" ? [] : e.split("\n").map((e) => e.split(/\s+/).filter(Boolean));
}
function Os(e, t, n) {
	if (e.length === 0) return [""];
	let r = [], i = "";
	for (let a of e) {
		let e = i ? `${i} ${a}` : a;
		!i || n(e) <= t + 1e-6 ? i = e : (r.push(i), i = a);
	}
	return r.push(i), r;
}
function ks(e, t, n) {
	let r = Os(e, t, n);
	if (r.length <= 1) return r;
	let i = r.length, a = Math.min(t, Math.max(...r.map(n))), o = Math.max(...e.map(n));
	if (o >= a) return r;
	for (let t = 0; t < 16; t++) {
		let t = (o + a) / 2;
		Os(e, t, n).length <= i ? a = t : o = t;
	}
	return Os(e, a, n);
}
function As(e, t, n, r) {
	let i = n === "balanced" ? ks : Os;
	return Ds(e).flatMap((e) => i(e, t, r));
}
var js = (e, t, n) => {
	let r = e.metrics(t);
	return n * r.unitsPerEm / r.capHeight;
};
function Ms(e, t, n, r) {
	let i = js(r, e.variant, t), a = i * e.line_spacing, o = (t) => r.advance(t, e.variant, i), s = As(e.text, n, e.wrap, o).map((e) => ({
		text: e,
		width: o(e)
	}));
	return {
		letterHeight: t,
		em: i,
		pitch: a,
		lines: s,
		textHeight: s.length === 0 ? 0 : t + (s.length - 1) * a + r.descent(Es, e.variant, i),
		fits: s.every((e) => e.width <= n + Uo)
	};
}
var Ns = (e) => e.padding ?? [
	0,
	0,
	0,
	0
], Ps = "1.0.0", Fs = {
	MIN_LETTER_HEIGHT: 2,
	MAX_LETTER_HEIGHT: 500,
	MAX_SIGN_SIZE: 5e3,
	MIN_LINE_SPACING: .7,
	MIN_TEXT_SCALE: .1,
	MAX_TEXT_SCALE: 4
}, Is = (e) => Wo(e, Fs.MIN_LETTER_HEIGHT, Fs.MAX_LETTER_HEIGHT);
function Ls(e, t, n) {
	let r = Is(Go(e.recommended === "auto" ? n.LETTER_HEIGHT[e.role] * t * (e.scale ?? 1) : e.recommended));
	return {
		recommended: r,
		min: Is(e.min === "auto" ? Math.min(n.MIN_LETTER_HEIGHT_MM[e.role], r) : Math.min(e.min, r))
	};
}
//#endregion
//#region src/engine/resolveTextFrame.ts
function Rs(e, t) {
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
function zs(e, t, n) {
	let r = t.ratios, i = e.panels.map((e) => ({
		panel: e,
		padding: e.padding === "auto" ? Jo(r.PANEL_PADDING * n.sectionRef) : e.padding,
		spacing: e.spacing === "auto" ? r.BLOCK_SPACING * n.sectionRef : e.spacing,
		blocks: e.blocks.map((e) => ({
			block: Rs(e, n.lang),
			auto: e.size.mode === "auto" ? Ls(e.size, n.textRefHeight, r) : null,
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
var Bs = (e, t) => e.auto ? Ss(t, e.auto) : e.fixed, Vs = (e, t, n) => {
	let [r, , i] = Ws(e, n), a = e.fill && e.box_lines !== void 0 ? r + n * e.box_lines + i : 0;
	return t.lines.length ? Math.max(r + t.textHeight + i, a) : e.fill ? Math.max(r + n * Hs + i, a) : 0;
}, Hs = 1.3, Us = .22, Ws = (e, t) => {
	if (e.padding) return e.padding;
	if (!e.fill) return [
		0,
		0,
		0,
		0
	];
	let n = t * Us;
	return [
		n,
		n,
		n,
		n
	];
}, Gs = (e, t, n) => {
	let r = e.blocks.map((e) => e.block.stretch === !0);
	if (!r.some(Boolean)) return t;
	let i = t.filter((t, n) => t > 0 || e.blocks[n].block.fill).length, a = n - (t.reduce((e, t) => e + t, 0) + e.spacing * Math.max(0, i - 1));
	if (a <= 0) return t;
	let o = a / r.filter(Boolean).length;
	return t.map((e, t) => r[t] ? e + o : e);
}, Ks = (e) => {
	let t = qs(e) ? .5 : 1;
	return Math.min(t, Math.max(0, e.lead?.share ?? 0)) + Math.min(t, Math.max(0, e.trail?.share ?? 0));
}, qs = (e) => e.blocks.some((e) => e.text.trim() !== ""), Js = (e, t, n, r) => {
	let [, i, , a] = Ws(n.block, r);
	return Math.max(0, e * (1 - Ks(t.panel)) - t.padding[1] - t.padding[3] - i - a);
};
function Ys(e, t, n, r) {
	let i = !0, a = [], o = [];
	for (let s of e.panels) {
		let e = s.blocks.map((e) => {
			let a = Bs(e, n), o = Ms(e.block, a, Js(t, s, e, a), r.shaper);
			return o.fits || (i = !1), o;
		}), c = e.filter((e, t) => e.lines.length > 0 || s.blocks[t].block.fill), l = e.reduce((e, t, r) => e + Vs(s.blocks[r].block, t, Bs(s.blocks[r], n)), 0);
		o.push(s.padding[0] + l + s.spacing * Math.max(0, c.length - 1) + s.padding[2]), a.push(e);
	}
	return {
		blocks: a,
		panelHeights: o,
		frameHeight: o.reduce((e, t) => e + t, 0) + e.spacing * Math.max(0, o.length - 1),
		fits: i
	};
}
function Xs(e, t) {
	let n = 0;
	for (let r of e.panels) for (let e of r.blocks) {
		let i = Bs(e, 0), a = js(t.shaper, e.block.variant, i), [, o, , s] = Ns(e.block);
		for (let i of Ds(e.block.text).flat()) {
			let c = t.shaper.advance(i, e.block.variant, a) + o + s + r.padding[1] + r.padding[3];
			c > n && (n = c);
		}
	}
	return n;
}
function Zs(e, t, n, r = 1) {
	return ws((r) => {
		let i = Ys(e, t.w, r, n);
		return i.fits && i.frameHeight <= t.h + 1e-6;
	}, r);
}
function Qs(e, t, n, r) {
	return e.category ? n.ruleset.theme(e.category) || (Ro(n, {
		severity: "error",
		code: "E_UNKNOWN_CATEGORY",
		path: `${r}.category`,
		message: `Panel category "${e.category}" is not defined in ruleset "${n.ruleset.id}"`
	}), t) : t;
}
function $s(e, t, n, r, i, a, o = 1) {
	let s = Zs(e, t, n, o), c = s.k, l = Ys(e, t.w, c, n);
	s.overflow && Ro(n, {
		severity: "error",
		code: "E_TEXT_OVERFLOW",
		path: i,
		message: l.fits ? "The text does not fit the section even at the minimum size" : "A word is too wide for the panel even at the minimum size"
	});
	let u = ds(e.panels.map((e, t) => ({
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
		}, m = a.top && c === 0, h = a.bottom && c === e.panels.length - 1, g = Math.min(Io(n), p.w / 2, p.h / 2), _ = (e, t) => e && t ? g : 0, v = [
			_(m, a.left),
			_(m, a.right),
			_(h, a.right),
			_(h, a.left)
		], y = Qs(o.panel, r, n, `${i}.panels[${c}]`), b = o.panel.fill === "none" ? void 0 : Mo(o.panel.fill, "panel", y);
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
		let x = qs(o.panel) ? .5 : 1, S = p.w * Math.min(x, Math.max(0, o.panel.lead?.share ?? 0)), C = p.w * Math.min(x, Math.max(0, o.panel.trail?.share ?? 0)), w = (e, t, r) => {
			let i = o.panel[e];
			if (!i || r <= 0) return;
			let a = qs(o.panel) ? Math.min(o.padding[0], o.padding[2]) : 0, s = {
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
				let e = u.fill === "none" ? void 0 : Mo(u.fill, "symbol_background", y) ?? { hex: "#FFFFFF" };
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
		w("lead", p.x, S), w("trail", p.x + p.w - C, C);
		let T = qo({
			x: p.x + S,
			y: p.y,
			w: Math.max(0, p.w - S - C),
			h: p.h
		}, o.padding), E = l.blocks[c], D = E.map((e, t) => Vs(o.blocks[t].block, e, Bs(o.blocks[t], s.k))), O = Gs(o, D, T.h), k = Ts(T.y, T.y + T.h, o.blocks.map((e, t) => {
			let r = E[t], i = r.lines.length ? r.textHeight - r.letterHeight - (r.lines.length - 1) * r.pitch : 0, a = r.lines[r.lines.length - 1]?.text ?? "", o = a ? Math.min(i, n.shaper.descent(a, e.block.variant, r.em)) : 0;
			return {
				height: O[t],
				placement: e.block.placement,
				y_offset: e.block.y_offset,
				trail: i,
				ink: o
			};
		}), o.spacing, o.panel.justify);
		o.blocks.forEach((e, t) => {
			let r = E[t], a = e.block, [o, u, , f] = Ws(a, r.letterHeight), p = k.y[t], m = p + (O[t] - D[t]) / 2, h = T.x + f, g = Math.max(0, T.w - f - u), _ = s.overflow && l.fits ? !0 : !r.fits;
			!r.fits && !s.overflow && Ro(n, {
				severity: "error",
				code: "E_TEXT_OVERFLOW",
				path: `${i}.panels[${c}].blocks[${t}]`,
				message: "A word is too wide for the panel at this fixed size"
			});
			let v = Mo(a.colour, "panel_text", y) ?? { hex: "#000000" }, b = a.fill ? Mo(a.fill, "panel", y) : void 0;
			b && n.nodes.push({
				type: "rect",
				id: `${a.id}--fill`,
				source_id: a.id,
				layer: "artwork",
				x: X(h),
				y: X(p),
				width: X(g),
				height: X(O[t]),
				radius: [
					0,
					0,
					0,
					0
				],
				fill: b
			});
			let x = r.lines.map((e, t) => {
				let i = X(a.align === "left" ? h : a.align === "right" ? h + g - e.width : h + (g - e.width) / 2), s = X(m + o + r.letterHeight + t * r.pitch), c = n.shaper.outline && e.text ? n.shaper.outline(e.text, a.variant, r.em, i, s) : void 0;
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
				x: T.x,
				y: p,
				width: T.w,
				height: O[t],
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
					applied: k.applied[t]
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
var ec = (e, t, n) => e.spacing === "auto" ? n.gap ?? n.ratios.SYMBOL_TEXT_SPACING * Ko(t.w, t.h) : e.spacing;
function tc(e, t, n, r) {
	let i = nc(e, t, n, r);
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
function nc(e, t, n, r) {
	let i = e.symbol_frame;
	if (!i || i.symbols.length === 0) return null;
	let a = n.ratios, o = e.orientation, s = Ko(t.w, t.h), c = e.text_frame.panels.length === 0, l = Yo(t, o) - (c ? 0 : ec(e, t, n));
	if (l <= 1e-6) return {
		L: l,
		min: 0,
		max: 0,
		wanted: 0,
		tooSmall: !0
	};
	let u = zs(e.text_frame, n, {
		textRefHeight: r.textRefHeight,
		sectionRef: s,
		lang: e.lang
	}), d = o === "vertical" ? Ys(u, t.w, 0, n).frameHeight : Xs(u, n), f = c ? 1 : 1 - Math.max(d, a.MIN_TEXT_SHARE * l) / l, p = bs(i, Xo(t, o), o, n, s) / l, m = Math.min(a.MIN_SYMBOL_SHARE, p), h = c ? Math.min(1, p) : Math.min(a.MAX_SYMBOL_SHARE, f, p), g = e.symbol_share;
	return {
		L: l,
		min: m,
		max: h,
		wanted: Number.isFinite(g) ? g : a.DEFAULT_SYMBOL_SHARE,
		tooSmall: !1
	};
}
function rc(e, t, n, r) {
	let i = e.symbol_share, a = nc(e, t, n, r);
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
	let o = e.orientation, s = e.text_frame.panels.length === 0 ? 0 : ec(e, t, n), c = a.L;
	if (a.tooSmall) return Ro(n, {
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
	u < l - 1e-6 && (Ro(n, {
		severity: "error",
		code: "E_SECTION_TOO_SMALL",
		path: r.path,
		message: "The text needs more room than this section can give it with the smallest symbol"
	}), u = l);
	let d = Wo(a.wanted, l, u);
	r.symbolLength && (d = Wo(r.symbolLength.length / c, l, u), l = r.symbolLength.min / c, u = r.symbolLength.max / c);
	let f = Zo(t, o), p = Yo(t, o), m = d * c, h = e.symbol_side === "end";
	return {
		symbolBox: Qo(t, o, h ? f + p - m : f, m),
		textBox: Qo(t, o, h ? f : f + m + s, p - m - s),
		share: {
			requested: i,
			applied: d,
			min: l,
			max: u
		}
	};
}
function ic(e, t, n, r) {
	let i = rc(e, t, n, r), a = zs(e.text_frame, n, {
		textRefHeight: r.textRefHeight,
		sectionRef: Ko(t.w, t.h),
		lang: e.lang
	});
	return a.hasAuto ? Zs(a, i.textBox, n).k : null;
}
function ac(e, t, n, r) {
	let i = zo(e, n, r.path), a = Ko(t.w, t.h), o = rc(e, t, n, r);
	o.symbolBox && e.symbol_frame && xs(e, e.symbol_frame, o.symbolBox, n, i, a);
	let s = zs(e.text_frame, n, {
		textRefHeight: r.textRefHeight,
		sectionRef: a,
		lang: e.lang
	}), c = o.symbolBox !== null, l = e.orientation === "vertical", u = e.symbol_side === "end", d = {
		top: !(c && l && !u),
		right: !(c && !l && u),
		bottom: !(c && l && u),
		left: !(c && !l && !u)
	}, f = $s(s, o.textBox, n, i, `${r.path}.text_frame`, d, r.kCap ?? 1);
	return {
		id: e.id,
		symbol_share: o.share,
		k: f.k,
		blocks: f.blocks
	};
}
//#endregion
//#region src/engine/resolveSections.ts
function oc(e, t) {
	let n = Lo(t), r = e.map((e) => {
		let t = () => tc(e.section, e.box, n, e.opts);
		return {
			it: e,
			b: e.unitRef === null ? t() : Fo(n, e.unitRef, t)
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
function sc(e, t, n, r) {
	let i = e.layout, a = (e) => `root.sections[${e}]`;
	if (i.type === "stack") {
		let r = e.sections.length, o = i.direction, s = i.spacing === "auto" ? n.gap ?? n.ratios.SECTION_SPACING * Ko(e.width, e.height) : i.spacing, c = ds(e.sections.map(() => ({
			basis: 0,
			min: 0,
			max: Infinity,
			grow: 1,
			shrink: 0
		})), Yo(t, o), s, "start"), l = e.sections.map((n, i) => {
			let s = Qo(t, o, Zo(t, o) + c[i].offset, c[i].size);
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
		return (i.align_symbols ?? !0) && oc(l, n), l.map((e) => ac(e.section, e.box, n, e.opts));
	}
	let o = i.type === "board", s = o ? ps(e, i, t, n, r) : ms(e, i, t, n, r);
	s.length !== e.sections.length && Ro(n, {
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
		unitRef: Ko(t.outer.w, t.outer.h),
		opts: {
			path: a(n),
			textRefHeight: t.outer.h
		}
	}));
	if ((i.align_symbols ?? !0) && oc(c, n), o ? i.sync_rows ?? !0 : i.sync_text) {
		let e = Lo(n), t = /* @__PURE__ */ new Map();
		c.forEach((e, n) => {
			let r = o ? s[n].group ?? 0 : 0;
			t.set(r, [...t.get(r) ?? [], e]);
		});
		for (let n of t.values()) {
			let t = 1;
			for (let r of n) {
				let n = Fo(e, r.unitRef, () => ic(r.section, r.box, e, r.opts));
				n !== null && (t = Math.min(t, n));
			}
			for (let e of n) e.opts.kCap = t;
		}
	}
	return c.map((e) => Fo(n, e.unitRef, () => ac(e.section, e.box, n, e.opts)));
}
//#endregion
//#region src/engine/index.ts
function cc(e, t) {
	let n = No(t), r = e.root, i = () => ({
		width: r.width,
		height: r.height,
		shaper_id: t.shaper.id,
		ruleset_id: t.ruleset.id,
		nodes: n.nodes
	});
	try {
		let e = r.sections[0], t = e ? zo(e, n, "root.sections[0]") : ko, a = sc(r, as(r, t, n), n, t);
		os(r, n);
		let o = i();
		return {
			scene: o,
			report: Bo(a, n, o)
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
function lc(e) {
	if (!Number.isFinite(e)) return "0";
	let t = Math.round(e * 1e3) / 1e3;
	return Object.is(t, -0) || t === 0 ? "0" : String(t);
}
var uc = (e) => e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"), Z = (e, t) => ` ${e}="${typeof t == "number" ? lc(t) : uc(t)}"`, dc = class extends Error {
	name = "OutlineUnavailable";
}, fc = /__SYM__/g, pc = (e, t) => !!e && !!t && e.hex.trim().toLowerCase() === t.hex.trim().toLowerCase(), mc = (e, t) => t && pc(e, t.from) ? t.to : e, hc = (e, t) => {
	let n = t.from.hex.trim().toLowerCase(), r = n.length === 7 && n[1] === n[2] && n[3] === n[4] && n[5] === n[6] ? `#${n[1]}${n[3]}${n[5]}` : n, i = (e) => {
		let t = e.trim().toLowerCase();
		return t === n || t === r;
	}, a = t.to?.hex;
	return e.replace(/fill\s*:\s*(#[0-9a-f]{3,6})/gi, (e, t) => i(t) ? `fill: ${a ?? "none"}` : e).replace(/fill="(#[0-9a-f]{3,6})"/gi, (e, t) => i(t) ? `fill="${a ?? "none"}"` : e);
}, gc = (e) => {
	if (!e) return Z("fill", "none");
	let t = Z("fill", e.hex);
	return e.cmyk && (t += Z("data-cmyk", e.cmyk.map(lc).join(","))), e.spot && (t += Z("data-spot", e.spot)), t;
}, _c = (e) => e ? Z("stroke", e.colour.hex) + Z("stroke-width", e.width) : "";
function vc(e) {
	let [t, n, r, i] = e.radius, { x: a, y: o, width: s, height: c } = e, l = (e, t, n) => e > 0 ? `A${lc(e)} ${lc(e)} 0 0 1 ${lc(t)} ${lc(n)}` : `L${lc(t)} ${lc(n)}`;
	return [
		`M${lc(a + t)} ${lc(o)}`,
		`H${lc(a + s - n)}`,
		l(n, a + s, o + n),
		`V${lc(o + c - r)}`,
		l(r, a + s - r, o + c),
		`H${lc(a + i)}`,
		l(i, a, o + c - i),
		`V${lc(o + t)}`,
		l(t, a + t, o),
		"Z"
	].join("");
}
function yc(e, t) {
	let n = gc(mc(e.fill, t)) + _c(e.stroke), [r, i, a, o] = e.radius;
	if (r === i && i === a && a === o) {
		let t = r > 0 ? Z("rx", r) : "";
		return `<rect${Z("x", e.x)}${Z("y", e.y)}${Z("width", e.width)}${Z("height", e.height)}${t}${n}/>`;
	}
	return `<path${Z("d", vc(e))}${n}/>`;
}
var bc = (e, t) => `<path${Z("d", e.d)}${gc(mc(e.fill, t))}${e.fill_rule ? Z("fill-rule", e.fill_rule) : ""}${_c(e.stroke)}/>`;
function xc(e, t) {
	let [n, r] = e.view_box, i = `translate(${lc(e.x)} ${lc(e.y)}) scale(${Sc(e.scale)}) translate(${lc(-n)} ${lc(-r)})`, a = (t ? hc(e.body, t) : e.body).replace(fc, `${e.id}--`);
	return `<g${Z("transform", i)}>${a}</g>`;
}
var Sc = (e) => {
	let t = Math.round(e * 1e6) / 1e6;
	return Object.is(t, -0) ? "0" : String(t);
};
function Cc(e, t, n) {
	let r = mc(e.colour, n);
	if (t === "outline") {
		let t = e.lines.map((t) => {
			if (t.text === "") return "";
			if (t.d === void 0) throw new dc(`Text node ${e.id} has no outlines — render with an outlining shaper`);
			return `<path${Z("d", t.d)}/>`;
		}).join("");
		return `<g${Z("aria-label", e.text)}${gc(r)}>${t}</g>`;
	}
	let i = `${e.font_family}, Arimo, 'Liberation Sans', Arial, sans-serif`, a = e.variant.includes("bold") ? "bold" : "normal", o = e.variant.includes("italic") ? "italic" : "normal", s = e.lines.filter((e) => e.text !== "").map((t) => `<text${Z("x", t.x)}${Z("y", t.baseline)}${Z("font-family", i)}${Z("font-size", e.em)}${Z("font-weight", a)}${Z("font-style", o)}${Z("text-anchor", "start")}${Z("style", "font-kerning:normal;font-variant-ligatures:none")}${gc(r)}>${uc(t.text)}</text>`).join("");
	return `<g${Z("aria-label", e.text)}>${s}</g>`;
}
function wc(e, t, n) {
	let r;
	switch (e.type) {
		case "rect":
			r = yc(e, n);
			break;
		case "path":
			r = bc(e, n);
			break;
		case "symbol":
			r = xc(e, n);
			break;
		case "text": r = Cc(e, t.text, n);
	}
	return `<g${Z("id", e.id)}${Z("data-source", e.source_id)}>${r}</g>`;
}
var Tc = (e) => Math.max(e.width, e.height) / 100;
function Ec(e) {
	let t = Tc(e), { width: n, height: r } = e, i = 4 * t, a = 1.5 * t, o = "#333333", s = (e, t, n, r) => `<line${Z("x1", e)}${Z("y1", t)}${Z("x2", n)}${Z("y2", r)}/>`, c = (e, t, n, r) => `<text${Z("x", t)}${Z("y", n)}${Z("text-anchor", "middle")}${r ? Z("transform", `rotate(-90 ${lc(t)} ${lc(n)})`) : ""}>${uc(e)}</text>`, l = r + i, u = n + i;
	return `<g id="dimensions"${Z("stroke", o)}${Z("stroke-width", .12 * t)}${Z("fill", o)}${Z("font-family", "Arial, Arimo, sans-serif")}${Z("font-size", 2.6 * t)}>` + s(0, r + t, 0, l + a) + s(n, r + t, n, l + a) + s(0, l, n, l) + s(n + t, 0, u + a, 0) + s(n + t, r, u + a, r) + s(u, 0, u, r) + `<g${Z("stroke", "none")}>` + c(`${lc(n)}mm`, n / 2, l + 3.4 * t, !1) + c(`${lc(r)}mm`, u + 3.4 * t, r / 2, !0) + "</g></g>";
}
var Dc = {
	hex: "#FFFFFF",
	cmyk: [
		0,
		0,
		0,
		0
	]
};
function Oc(e, t) {
	let n = e.nodes.find((e) => e.layer === "substrate"), r = t.substrate !== !1, i = r && n ? `<g id="substrate">${wc(n, t)}</g>` : "", a = n?.type === "rect" ? n.fill : void 0, o = t.unprinted ? { hex: t.unprinted } : a, s = o ? r ? a && !pc(o, a) ? {
		from: o,
		to: a
	} : void 0 : pc(o, Dc) ? void 0 : {
		from: o,
		to: Dc
	} : void 0, c = e.nodes.filter((e) => e.layer === "artwork").map((e) => wc(e, t, s)).join(""), l = t.guides ? `<g id="guides">${e.nodes.filter((e) => e.layer === "guide").map((e) => wc(e, t)).join("")}</g>` : "", u = t.dimensions ? 9 * Tc(e) : 0, d = e.width + u, f = e.height + u;
	return `<svg xmlns="http://www.w3.org/2000/svg"${Z("width", `${lc(d)}mm`)}${Z("height", `${lc(f)}mm`)}${Z("viewBox", `0 0 ${lc(d)} ${lc(f)}`)}>${i}<g id="artwork">${c}</g>${l}${t.dimensions ? Ec(e) : ""}</svg>`;
}
//#endregion
//#region src/renderer/index.ts
function kc(e, t) {
	return Oc(e, t);
}
//#endregion
//#region src/migration/migrations.ts
var Ac = [], jc = class extends Error {
	name = "UnknownSchemaVersion";
};
function Mc(e, t = Ac, n = Ps) {
	if (typeof e?.schema_version != "string") throw new jc("Document has no schema_version");
	let r = structuredClone(e), i = /* @__PURE__ */ new Set();
	for (; r.schema_version !== n;) {
		if (i.has(r.schema_version)) throw new jc(`Migration loop at ${r.schema_version}`);
		i.add(r.schema_version);
		let e = t.find((e) => e.from === r.schema_version);
		if (!e) throw new jc(`No migration path from schema ${r.schema_version} to ${n}`);
		r = {
			...e.up(r),
			schema_version: e.to
		};
	}
	return r;
}
//#endregion
//#region src/symbols/guard.ts
var Nc = [
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
function Pc(e) {
	return Nc.filter(([t]) => t.test(e)).map(([, e]) => e);
}
//#endregion
//#region src/validation/index.ts
var Fc = (e) => typeof e == "object" && !!e && !Array.isArray(e), Ic = (e) => typeof e == "number" && Number.isFinite(e), Lc = /^#[0-9a-fA-F]{6}$/, Rc = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/, zc = [
	"background",
	"panel",
	"panel_text",
	"symbol_background",
	"border"
], Bc = (e) => e.some((e) => e.severity === "error");
function Vc(e, t) {
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
		e !== "auto" && !(Ic(e) && e >= 0) && r(t, `${n} must be 'auto' or a non-negative number`);
	}, l = (e, t) => {
		if (e !== void 0) {
			if (Fc(e) && typeof e.token == "string") return s(e.token, zc, t, "Colour token");
			(!Fc(e) || typeof e.hex != "string" || !Lc.test(e.hex)) && r(t, "Colour must be { hex: \"#RRGGBB\" } or { token }");
		}
	}, u = (e, n) => {
		(typeof e != "string" || !t.theme(e)) && r(n, `Category "${String(e)}" is not defined in ruleset "${t.id}"`, "E_UNKNOWN_CATEGORY");
	}, d = (e, t, n, i = !1) => !Array.isArray(e) || e.length === 0 && !i ? (r(t, `${n} must be a non-empty array`), []) : e;
	if (!Fc(e)) return r("", "Document must be an object"), n;
	e.schema_version !== "1.0.0" && r("schema_version", `Unknown schema version "${String(e.schema_version)}"`, "E_SCHEMA_VERSION"), typeof e.id != "string" && r("id", "Missing document id"), typeof e.ruleset_id == "string" ? e.ruleset_id !== t.id && i("ruleset_id", `Document expects ruleset "${e.ruleset_id}" but "${t.id}" was supplied`, "W_RULESET_MISMATCH") : r("ruleset_id", "Missing ruleset_id");
	let f = e.root;
	if (!Fc(f) || f.role !== "sign") return r("root", "root must be a sign node"), n;
	o(f, "root");
	for (let e of ["width", "height"]) {
		let t = f[e];
		(!Ic(t) || t <= 0 || t > Fs.MAX_SIGN_SIZE) && r(`root.${e}`, `${e} must be between 0 and ${Fs.MAX_SIGN_SIZE} mm`);
	}
	f.margin !== void 0 && c(f.margin, "root.margin", "margin"), l(f.background, "root.background"), f.corners !== void 0 && (!Fc(f.corners) || typeof f.corners.rounded != "boolean" ? r("root.corners", "corners must be { rounded: true|false, radius }") : c(f.corners.radius, "root.corners.radius", "corner radius")), l(f.substrate, "root.substrate"), f.padding !== void 0 && c(f.padding, "root.padding", "padding"), f.border !== void 0 && (Fc(f.border) ? (c(f.border.width, "root.border.width", "border width"), l(f.border.colour, "root.border.colour")) : r("root.border", "border must be an object"));
	let p = d(f.sections, "root.sections", "sections"), m = f.layout;
	if (!Fc(m)) r("root.layout", "layout is required");
	else if (m.type === "stack") s(m.direction, ["vertical", "horizontal"], "root.layout.direction", "direction"), m.align_symbols !== void 0 && typeof m.align_symbols != "boolean" && r("root.layout.align_symbols", "align_symbols must be true or false"), c(m.spacing, "root.layout.spacing", "spacing");
	else if (m.type === "grid") {
		let { rows: e, cols: t } = m;
		(!Number.isInteger(e) || e < 1) && r("root.layout.rows", "rows must be an integer ≥ 1"), (!Number.isInteger(t) || t < 1) && r("root.layout.cols", "cols must be an integer ≥ 1"), Number.isInteger(e) && Number.isInteger(t) && e * t !== p.length && r("root.layout", `Grid has ${e * t} cells but ${p.length} sections`, "E_GRID_CELL_COUNT"), c(m.gutter, "root.layout.gutter", "gutter"), typeof m.sync_text != "boolean" && r("root.layout.sync_text", "sync_text must be true or false"), m.align_symbols !== void 0 && typeof m.align_symbols != "boolean" && r("root.layout.align_symbols", "align_symbols must be true or false"), Fc(m.cell_outline) && (c(m.cell_outline.width, "root.layout.cell_outline.width", "outline width"), s(m.cell_outline.layer, ["artwork", "guide"], "root.layout.cell_outline.layer", "layer"), l(m.cell_outline.colour, "root.layout.cell_outline.colour"));
	} else if (m.type === "board") {
		let e = d(m.rows, "root.layout.rows", "rows");
		e.length || r("root.layout.rows", "A board needs at least one row");
		let t = 0;
		e.forEach((e, n) => {
			let i = `root.layout.rows[${n}]`;
			if (!Fc(e)) return r(i, "Expected a row");
			!Number.isInteger(e.cells) || e.cells < 1 ? r(`${i}.cells`, "cells must be an integer ≥ 1") : t += e.cells, e.weight !== void 0 && (typeof e.weight != "number" || !Number.isFinite(e.weight) || e.weight <= 0) && r(`${i}.weight`, "weight must be a number greater than 0");
		}), t !== p.length && r("root.layout", `Board has ${t} cells but ${p.length} sections`, "E_GRID_CELL_COUNT"), c(m.gutter, "root.layout.gutter", "gutter"), m.sync_rows !== void 0 && typeof m.sync_rows != "boolean" && r("root.layout.sync_rows", "sync_rows must be true or false"), m.align_symbols !== void 0 && typeof m.align_symbols != "boolean" && r("root.layout.align_symbols", "align_symbols must be true or false"), Fc(m.cell_outline) && (c(m.cell_outline.width, "root.layout.cell_outline.width", "outline width"), s(m.cell_outline.layer, ["artwork", "guide"], "root.layout.cell_outline.layer", "layer"), l(m.cell_outline.colour, "root.layout.cell_outline.colour"));
	} else r("root.layout.type", "layout.type must be 'stack', 'grid' or 'board'");
	return p.forEach((e, t) => {
		let n = `root.sections[${t}]`;
		if (!Fc(e) || e.role !== "section") return r(n, "Expected a section node");
		o(e, n), s(e.orientation, ["vertical", "horizontal"], `${n}.orientation`, "orientation"), e.symbol_side !== void 0 && s(e.symbol_side, ["start", "end"], `${n}.symbol_side`, "symbol_side"), c(e.spacing, `${n}.spacing`, "spacing"), Ic(e.symbol_share) ? (e.symbol_share < 0 || e.symbol_share > 1) && i(`${n}.symbol_share`, "symbol_share is outside 0..1 and will be clamped", "W_SHARE_RANGE") : r(`${n}.symbol_share`, "symbol_share must be a number"), e.placeholder !== void 0 && typeof e.placeholder != "boolean" && r(`${n}.placeholder`, "placeholder must be true or false"), e.lang !== void 0 && !(typeof e.lang == "string" && Rc.test(e.lang)) && r(`${n}.lang`, "lang must be a language tag such as \"pl\" or \"pt-BR\"");
		let a = e.translation;
		if (a !== void 0) {
			let t = `${n}.translation`;
			Fc(a) ? ((typeof a.of != "string" || !p.some((t) => Fc(t) && t.id === a.of && t !== e)) && r(`${t}.of`, "translation.of must be the id of another section"), typeof a.checked != "boolean" && r(`${t}.checked`, "checked must be true or false"), typeof a.machine != "boolean" && r(`${t}.machine`, "machine must be true or false"), (!Fc(a.lines) || !Object.values(a.lines).every((e) => Fc(e) && typeof e.from == "string" && typeof e.manual == "boolean")) && r(`${t}.lines`, "lines must map block ids to { from, manual }")) : r(t, "translation must be an object");
		}
		let f = e.symbol_frame;
		if (f === null) u(e.category, `${n}.category`);
		else if (!Fc(f) || f.role !== "symbol_frame") r(`${n}.symbol_frame`, "symbol_frame must be a symbol_frame node or null");
		else {
			let e = `${n}.symbol_frame`;
			o(f, e), c(f.spacing, `${e}.spacing`, "spacing"), s(f.align, [
				"start",
				"centre",
				"end"
			], `${e}.align`, "align"), l(f.background, `${e}.background`), d(f.symbols, `${e}.symbols`, "symbols").forEach((t, n) => {
				let i = `${e}.symbols[${n}]`;
				if (!Fc(t) || t.role !== "symbol") return r(i, "Expected a symbol node");
				o(t, i), u(t.category, `${i}.category`);
				let a = t.source;
				if (!Fc(a)) return r(`${i}.source`, "Symbol has no prepared source");
				let s = a.view_box;
				if ((!Array.isArray(s) || s.length !== 4 || !s.every(Ic) || s[2] <= 0 || s[3] <= 0) && r(`${i}.source.view_box`, "view_box must be [x, y, w, h] with positive size"), typeof a.body != "string" || a.body === "") r(`${i}.source.body`, "Symbol body is empty");
				else {
					let e = Pc(a.body);
					e.length && r(`${i}.source.body`, `Unsafe symbol markup: ${e.join(", ")}`, "E_UNSAFE_SYMBOL");
				}
			});
		}
		let m = e.text_frame, h = `${n}.text_frame`;
		if (!Fc(m) || m.role !== "text_frame") return r(h, "text_frame is required");
		o(m, h), c(m.spacing, `${h}.spacing`, "spacing");
		let g = Fc(e.symbol_frame) && Array.isArray(e.symbol_frame.symbols) && e.symbol_frame.symbols.length > 0;
		d(m.panels, `${h}.panels`, "panels", g).forEach((e, t) => {
			let n = `${h}.panels[${t}]`;
			if (!Fc(e) || e.role !== "text_panel") return r(n, "Expected a text_panel node");
			o(e, n), e.padding !== "auto" && !(Array.isArray(e.padding) && e.padding.length === 4 && e.padding.every((e) => Ic(e) && e >= 0)) && r(`${n}.padding`, "padding must be 'auto' or four non-negative numbers"), c(e.spacing, `${n}.spacing`, "spacing"), s(e.justify, [
				"start",
				"centre",
				"end",
				"space-between",
				"space-evenly"
			], `${n}.justify`, "justify"), (!Ic(e.grow) || e.grow < 0) && r(`${n}.grow`, "grow must be ≥ 0"), e.fill !== "none" && l(e.fill, `${n}.fill`), e.category !== void 0 && u(e.category, `${n}.category`);
			let a = Fc(e.lead) || Fc(e.trail);
			d(e.blocks, `${n}.blocks`, "blocks", a).forEach((e, t) => {
				let a = `${n}.blocks[${t}]`;
				if (!Fc(e) || e.role !== "text_block") return r(a, "Expected a text_block node");
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
				], `${a}.placement`, "placement"), (!Ic(e.line_spacing) || e.line_spacing < Fs.MIN_LINE_SPACING || e.line_spacing > 3) && r(`${a}.line_spacing`, `line_spacing must be ${Fs.MIN_LINE_SPACING}–3`), Ic(e.y_offset) || r(`${a}.y_offset`, "y_offset must be a number"), e.text_transform !== void 0 && s(e.text_transform, ["uppercase"], `${a}.text_transform`, "text_transform"), e.padding !== void 0 && !(Array.isArray(e.padding) && e.padding.length === 4 && e.padding.every((e) => Ic(e) && e >= 0)) && r(`${a}.padding`, "padding must be four non-negative numbers"), l(e.colour, `${a}.colour`), e.stretch !== void 0 && typeof e.stretch != "boolean" && r(`${a}.stretch`, "stretch must be true or false"), e.box_lines !== void 0 && (!Ic(e.box_lines) || e.box_lines <= 0 || e.box_lines > 20) && r(`${a}.box_lines`, "box_lines must be 0–20 lines");
				let c = e.size, u = Fs.MIN_LETTER_HEIGHT, d = Fs.MAX_LETTER_HEIGHT, f = (e) => Ic(e) && e >= u && e <= d;
				if (!Fc(c)) return r(`${a}.size`, "size is required");
				if (c.mode === "auto") {
					s(c.role, [
						"title",
						"body",
						"footer"
					], `${a}.size.role`, "role");
					for (let e of ["recommended", "min"]) c[e] !== "auto" && !f(c[e]) && r(`${a}.size.${e}`, `${e} must be 'auto' or ${u}–${d} mm`);
					c.scale !== void 0 && !(Ic(c.scale) && c.scale >= Fs.MIN_TEXT_SCALE && c.scale <= Fs.MAX_TEXT_SCALE) && r(`${a}.size.scale`, `scale must be ${Fs.MIN_TEXT_SCALE}–${Fs.MAX_TEXT_SCALE}`), Ic(c.min) && Ic(c.recommended) && c.min > c.recommended && r(`${a}.size`, "min must not exceed recommended");
				} else c.mode === "fixed" ? f(c.letter_height) || r(`${a}.size.letter_height`, `letter_height must be ${u}–${d} mm`) : r(`${a}.size.mode`, "size.mode must be 'auto' or 'fixed'");
			});
		});
	}), n;
}
//#endregion
//#region src/pipeline.ts
function Hc(e, t, n) {
	if (!t?.shaper || !t?.ruleset) throw Error("renderSign needs { shaper, ruleset }");
	let r;
	try {
		r = Mc(e);
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
	let i = Vc(r, t.ruleset);
	if (Bc(i)) return {
		svg: null,
		scene: null,
		report: null,
		doc: r,
		findings: i
	};
	let { scene: a, report: o } = cc(r, t);
	return {
		svg: kc(a, n),
		scene: a,
		report: o,
		doc: r,
		findings: [...i, ...o.findings]
	};
}
//#endregion
//#region src/template/index.ts
var Uc = () => {
	let e = /* @__PURE__ */ new Map();
	return (t) => {
		let n = (e.get(t) ?? 0) + 1;
		return e.set(t, n), `${t}-${n}`;
	};
}, Wc = (e, t, n) => ({
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
function Gc(e, t, n, r) {
	let i = [Wc(e, t.title, "title")];
	return t.body && i.push(Wc(e, t.body, "body")), {
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
var Kc = (e, t, n) => {
	let r = (/* @__PURE__ */ new Date()).toISOString();
	return {
		schema_version: Ps,
		id: `sign-${r}`,
		created_at: r,
		updated_at: r,
		...t.catalogue_size_id === void 0 ? {} : { catalogue_size_id: t.catalogue_size_id },
		ruleset_id: e.id,
		root: n
	};
};
function qc(e) {
	let t = Uc(), { width: n, height: r } = e.size, i = e.orientation ?? (r >= n ? "vertical" : "horizontal");
	return Kc(e.ruleset, e.size, {
		id: t("sign"),
		role: "sign",
		width: n,
		height: r,
		layout: {
			type: "stack",
			direction: "vertical",
			spacing: "auto"
		},
		sections: [Gc(t, e, i, e.ruleset)]
	});
}
//#endregion
//#region src/symbols/sha256.ts
var Jc = new Uint32Array([
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
function Yc(e) {
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
			let i = f + (s(l, 6) ^ s(l, 11) ^ s(l, 25)) + (l & u ^ ~l & d) + Jc[e] + o[e] | 0, a = (s(t, 2) ^ s(t, 13) ^ s(t, 22)) + (t & n ^ t & r ^ n & r) | 0;
			f = d, d = u, u = l, l = c + i | 0, c = r, r = n, n = t, t = i + a | 0;
		}
		a[0] += t, a[1] += n, a[2] += r, a[3] += c, a[4] += l, a[5] += u, a[6] += d, a[7] += f;
	}
	return Array.from(a, (e) => e.toString(16).padStart(8, "0")).join("");
}
var Xc = "__SYM__", Zc = class extends Error {
	name = "InvalidSymbol";
}, Qc = /* @__PURE__ */ new Set([
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
]), $c = /* @__PURE__ */ new Set(/* @__PURE__ */ "id.d.points.x.y.x1.y1.x2.y2.cx.cy.r.rx.ry.fx.fy.width.height.transform.viewBox.preserveAspectRatio.href.offset.gradientUnits.gradientTransform.spreadMethod.clipPathUnits.maskUnits.maskContentUnits.fill.fill-opacity.fill-rule.stroke.stroke-width.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-dasharray.stroke-dashoffset.stroke-opacity.opacity.clip-path.clip-rule.mask.stop-color.stop-opacity.display.visibility.style".split(".")), el = /* @__PURE__ */ new Set([
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
]), tl = [
	"fill",
	"fill-rule",
	"stroke",
	"stroke-width",
	"opacity",
	"style"
], nl = (e) => /javascript\s*:|expression\s*\(|@import|\\/i.test(e) || /url\(\s*['"]?(?!#)/i.test(e);
function rl(e) {
	return e.split(";").flatMap((e) => {
		let t = e.indexOf(":");
		if (t < 0) return [];
		let n = e.slice(0, t).trim().toLowerCase(), r = e.slice(t + 1).trim();
		return n && r ? [[n, r]] : [];
	});
}
function il(e) {
	let t = e.replace(/\/\*[\s\S]*?\*\//g, ""), n = [];
	for (let e of t.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) n.push({
		selectors: e[1].split(",").map((e) => e.trim()),
		decls: rl(e[2])
	});
	return n;
}
function al(e, t) {
	let n = /^([a-zA-Z]*)((?:\.[\w-]+)*)$/.exec(e);
	if (!n) return !1;
	let [, r, i] = n;
	if (r && r !== t.localName) return !1;
	let a = (t.getAttribute("class") ?? "").split(/\s+/);
	return i.split(".").filter(Boolean).every((e) => a.includes(e));
}
var ol = (e) => e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function sl(e) {
	let t = e.getAttribute("viewBox"), n;
	if (n = t ? t.trim().split(/[\s,]+/).map(Number) : [
		0,
		0,
		parseFloat(e.getAttribute("width") ?? ""),
		parseFloat(e.getAttribute("height") ?? "")
	], n.length !== 4 || n.some((e) => !Number.isFinite(e)) || n[2] <= 0 || n[3] <= 0) throw new Zc("Symbol SVG has no usable viewBox or width/height");
	return n;
}
function cl(e, t = {}) {
	let n = t.DOMParser ?? globalThis.DOMParser;
	if (!n) throw new Zc("No DOMParser available");
	let r = t.purify ? t.purify(e) : e, i = new n().parseFromString(r, "image/svg+xml"), a = i.documentElement;
	if (!a || a.localName !== "svg" || i.getElementsByTagName("parsererror").length > 0) throw new Zc("Not an SVG document");
	let o = sl(a), s = [];
	for (let e of Array.from(a.getElementsByTagName("style"))) s.push(...il(e.textContent ?? ""));
	let c = /* @__PURE__ */ new Set(), l = (e) => {
		let t = e.getAttribute("id");
		t && c.add(t);
		for (let t of Array.from(e.children)) l(t);
	};
	l(a);
	let u = (e) => e.replace(/url\(\s*(['"]?)#([^)'"]+)\1\s*\)/g, (e, t, n) => c.has(n) ? `url(#${Xc}${n})` : e), d = (e) => e.filter(([e, t]) => el.has(e) && !nl(t)).map(([e, t]) => `${e}:${u(t)}`).join(";"), f = (e) => {
		let t = [], n = s.filter((t) => t.selectors.some((t) => al(t, e))).flatMap((e) => e.decls), r = rl(e.getAttribute("style") ?? "");
		for (let n of Array.from(e.attributes)) {
			let e = n.name, r = n.value;
			if (e === "xlink:href" && (e = "href"), e !== "style" && $c.has(e) && !/^on/i.test(e)) {
				if (e === "href") {
					if (!r.startsWith("#")) continue;
					let e = r.slice(1);
					r = c.has(e) ? `#${Xc}${e}` : r;
				} else if (e === "id") r = `${Xc}${r}`;
				else {
					if (nl(r)) continue;
					r = u(r);
				}
				t.push(`${e}="${ol(r)}"`);
			}
		}
		let i = d([...n, ...r]);
		return i && t.push(`style="${ol(i)}"`), t.length ? ` ${t.join(" ")}` : "";
	}, p = (e) => {
		let t = e.localName === "a" ? "g" : e.localName;
		if (!Qc.has(t)) return "";
		let n = Array.from(e.children).map(p).join(""), r = f(e);
		return n ? `<${t}${r}>${n}</${t}>` : `<${t}${r}/>`;
	}, m = Array.from(a.children).map(p).join(""), h = tl.map((e) => [e, a.getAttribute(e)]).filter((e) => !!e[1] && !nl(e[1]));
	if (h.length && (m = `<g ${h.map(([e, t]) => e === "style" ? `style="${ol(d(rl(t)))}"` : `${e}="${ol(t)}"`).join(" ")}>${m}</g>`), !m) throw new Zc("Symbol has no drawable content");
	return {
		view_box: o,
		body: m,
		hash: Yc(m),
		prepared_with: "1"
	};
}
//#endregion
//#region src/text/canvasShaper.ts
var ll = 100, ul = 1e3, dl = {
	regular: "/arimo/Arimo-Regular.ttf",
	bold: "/arimo/Arimo-Bold.ttf",
	italic: "/arimo/Arimo-Italic.ttf",
	"bold-italic": "/arimo/Arimo-BoldItalic.ttf"
};
function fl() {
	if (typeof OffscreenCanvas < "u") {
		let e = new OffscreenCanvas(8, 8).getContext("2d");
		if (e) return e;
	}
	let e = document.createElement("canvas").getContext("2d");
	if (!e) throw Error("Canvas 2D is not available");
	return e;
}
var pl = (e, t, n = ll) => `${e === "italic" || e === "bold-italic" ? "italic" : "normal"} ${e === "bold" || e === "bold-italic" ? "bold" : "normal"} ${n}px "${t}"`;
function ml(e, t = fl()) {
	let n = (e) => (t.font = e, t.measureText("mmmmmmmmmmlliWWQ@#0123").width);
	return ["monospace", "serif"].every((t) => n(`100px "${e}", ${t}`) !== n(`100px ${t}`));
}
async function hl(e, t) {
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
async function gl(t) {
	let n = fl();
	n.fontKerning = "normal";
	let r = t.family;
	if (!ml(r, n)) {
		let e = {
			...dl,
			...t.fallbackUrls
		};
		r = await hl(t.fallback, e) ? t.fallback : "sans-serif";
	}
	let i = (e, t) => (n.font = r === "sans-serif" ? pl(t, r).replace(/"/g, "") : pl(t, r), n.measureText(e)), a = {};
	for (let e of [
		"regular",
		"bold",
		"italic",
		"bold-italic"
	]) {
		let t = i("H", e);
		a[e] = {
			unitsPerEm: ul,
			capHeight: t.actualBoundingBoxAscent / ll * ul,
			ascender: t.fontBoundingBoxAscent / ll * ul,
			descender: -(t.fontBoundingBoxDescent / ll) * ul
		};
	}
	let o = new e(2e3);
	return {
		id: `canvas:${r}`,
		family: r,
		metrics: (e) => a[e],
		advance: (e, t, n) => o.get(`a|${t}|${e}`, () => i(e, t).width / ll) * n,
		descent: (e, t, n) => Math.max(0, o.get(`d|${t}|${e}`, () => i(e, t).actualBoundingBoxDescent / ll)) * n
	};
}
//#endregion
//#region src/rulesets/checks.ts
function _l(e, t) {
	let [n, r] = [Ho(e.hex), Ho(t.hex)].sort((e, t) => t - e);
	return (n + .05) / (r + .05);
}
function vl(e, t, n) {
	let r = t.x + t.width / 2, i = t.y + t.height / 2;
	for (let t = n - 1; t >= 0; t--) {
		let n = e.nodes[t];
		if (n.type !== "rect" || n.layer !== "artwork" || !n.fill) continue;
		let a = n;
		if (r >= a.x && r <= a.x + a.width && i >= a.y && i <= a.y + a.height) return a.fill;
	}
}
function yl(e, t) {
	let n = [], r = e.limits?.min_letter_height;
	return t.nodes.forEach((e, i) => {
		if (e.type !== "text" || e.lines.length === 0) return;
		r !== void 0 && e.letter_height < r && n.push({
			severity: "warning",
			code: "W_LETTER_HEIGHT_BELOW_MIN",
			path: e.source_id,
			message: `Letter height ${e.letter_height} mm is below the ${r} mm minimum for this standard`
		});
		let a = vl(t, e, i);
		a && _l(a, e.colour) < 3 && n.push({
			severity: "warning",
			code: "W_LOW_CONTRAST",
			path: e.source_id,
			message: `Text colour ${e.colour.hex} has low contrast against ${a.hex}`
		});
	}), n;
}
//#endregion
//#region src/rulesets/createRuleset.ts
function bl(e) {
	let t = new Map(e.categories.map((e) => [e.key, e]));
	return {
		...e,
		theme: (e) => t.get(e),
		check: (t) => yl(e, t)
	};
}
var xl = {
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
}, Sl = [
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
], Cl = class extends Error {
	name = "SignRulesError";
}, wl = [
	"title",
	"body",
	"footer"
];
function Tl(e) {
	let t = [], n = e, r = (e, n, r = 100) => {
		typeof n != "number" || !Number.isFinite(n) ? t.push(`${e} must be a number`) : (n < 0 || n > r) && t.push(`${e} must be between 0 and ${r} (got ${n})`);
	}, i = (t) => t.split(".").reduce((e, t) => e && typeof e == "object" ? e[t] : void 0, e);
	for (let e of wl) r(`text_size.start_percent_of_height.${e}`, i(`text_size.start_percent_of_height.${e}`)), r(`text_size.minimum_mm.${e}`, i(`text_size.minimum_mm.${e}`), 500);
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
	if (t.length) throw new Cl(`config/sign-rules.json has problems:\n- ${t.join("\n- ")}`);
	return n;
}
var El = (e) => e / 100;
function Dl(e) {
	let t = Tl(e), n = t.text_size.start_percent_of_height;
	return {
		MARGIN: El(t.sign.margin_percent),
		BORDER: El(t.sign.border_percent),
		SECTION_SPACING: El(t.sign.section_gap_percent),
		SYMBOL_TEXT_SPACING: El(t.symbol.gap_to_text_percent),
		SYMBOL_SPACING: El(t.symbol.gap_between_symbols_percent),
		SYMBOL_PADDING: El(t.symbol.clear_space_percent),
		PANEL_PADDING: El(t.text_panel.padding_percent),
		PANEL_SPACING: El(t.text_panel.gap_between_panels_percent),
		BLOCK_SPACING: El(t.text_panel.gap_between_blocks_percent),
		MIN_SYMBOL_SHARE: El(t.symbol.min_share_percent),
		MAX_SYMBOL_SHARE: El(t.symbol.max_share_percent),
		MIN_TEXT_SHARE: El(t.text_panel.min_share_percent),
		DEFAULT_SYMBOL_SHARE: El(t.symbol.default_share_percent),
		GRID_GUTTER: El(t.grid.gutter_percent),
		CELL_PADDING: El(t.grid.cell_padding_percent),
		CELL_OUTLINE: El(t.grid.cell_outline_percent),
		UNIFORM_GAP: t.spacing?.same_gap_everywhere ? El(t.spacing.gap_percent) : null,
		CORNERS_ROUNDED: t.corners?.rounded_by_default ?? !1,
		CORNER_RADIUS: !t.corners || t.corners.radius_same_as_gap ? null : El(t.corners.radius_percent),
		LETTER_HEIGHT: {
			title: El(n.title),
			body: El(n.body),
			footer: El(n.footer)
		},
		MIN_LETTER_HEIGHT_MM: { ...t.text_size.minimum_mm }
	};
}
function Ol(e) {
	let t = Tl(e).limits?.warn_below_letter_height_mm;
	return typeof t == "number" ? { min_letter_height: t } : {};
}
//#endregion
//#region src/rulesets/fromDb.ts
var kl = {
	hex: "#FFFFFF",
	cmyk: [
		0,
		0,
		0,
		0
	]
}, Al = {
	hex: "#000000",
	cmyk: [
		0,
		0,
		0,
		100
	]
}, jl = /^#[0-9a-fA-F]{6}$/, Ml = (e) => e.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
function Nl(e) {
	if (!e) return;
	let t = e.replace(/^cmyk\(|\)$/gi, "").split(",").map(Number);
	return t.length === 4 && t.every((e) => Number.isFinite(e) && e >= 0 && e <= 100) ? t : void 0;
}
var Pl = {
	key: "plain",
	title: "White",
	background: kl,
	panel: kl,
	panel_text: Al
}, Fl = /* @__PURE__ */ new Set(["fire_emergency", "fire"]);
function Il(e) {
	let t = [Pl], n = [];
	for (let r of e) {
		let e = r.default_colour_HEX?.trim().toUpperCase(), i = r.default_text_HEX?.trim().toUpperCase();
		if (!e || !jl.test(e) || !i || !jl.test(i)) {
			n.push({
				id: r.id,
				title: r.title,
				reason: "no default_colour_HEX / default_text_HEX"
			});
			continue;
		}
		let a = Nl(r.default_colour), o = Ml(r.title), s = a ? {
			hex: e,
			cmyk: a
		} : { hex: e };
		t.push({
			key: o,
			db_id: r.id,
			title: r.description?.trim() || r.title,
			background: kl,
			panel: s,
			panel_text: i === "#000000" ? Al : i === "#FFFFFF" ? kl : { hex: i },
			...Fl.has(o) ? { symbol_background: s } : {}
		});
	}
	return {
		categories: t,
		skipped: n
	};
}
//#endregion
//#region src/rulesets/iso7010.ts
var Ll = Il(Sl), Rl = Ll.categories;
Ll.skipped;
var zl = xl;
Dl(zl);
function Bl(e = zl, t = Rl) {
	return bl({
		id: "iso7010",
		ratios: Dl(e),
		categories: t,
		limits: Ol(e)
	});
}
Bl();
//#endregion
//#region editor/src/config.ts
function Vl() {
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
var Hl = Vl(), Ul = () => Hl ? "same-origin" : "omit", Wl = {
	mm: 1,
	mmm: 1,
	cm: 10,
	m: 1e3,
	in: 25.4,
	inch: 25.4,
	ft: 304.8,
	feet: 304.8
}, Gl = (e) => (e.view.value.doc?.root.sections ?? []).flatMap((e) => e.text_frame.panels.flatMap((e) => e.blocks.map((e) => e.text.trim()))).filter(Boolean), Kl = (e) => [...new Set((e.view.value.doc?.root.sections ?? []).flatMap((e) => e.symbol_frame?.symbols.map((e) => e.symbol_code) ?? []))];
function ql(e) {
	let t = (t) => {
		let n = RegExp(`^<svg[^>]*\\s${t}="([\\d.]+)mm"`).exec(e);
		return n ? Number(n[1]) : null;
	}, n = t("width"), r = t("height");
	if (!n || !r) return e;
	let i = Math.max(n, r) / 300, a = i / 2, o = `<rect x="${a.toFixed(2)}" y="${a.toFixed(2)}" width="${(n - i).toFixed(2)}" height="${(r - i).toFixed(2)}" fill="none" stroke="#b4b1aa" stroke-width="${i.toFixed(2)}" vector-effect="non-scaling-stroke"/>`;
	return e.replace(/<\/svg>\s*$/, `${o}</svg>`);
}
function Jl(e) {
	let t = [];
	function n(t) {
		if (typeof t == "number") return e.pickSizeById(t);
		let n = Wl[(t.size_units ?? "mm").toLowerCase()] ?? 0, r = Number(t.size_width) * n, i = Number(t.size_height) * n;
		e.pickSizeById(Number(t.size_id), r > 0 ? r : void 0, i > 0 ? i : void 0, Number(t.symbol_default_location) === 1 ? "left" : "above");
		let a = (t.face_hex ?? "").trim();
		e.setMaterialFace(/^#[0-9a-f]{6}$/i.test(a) ? a : null);
	}
	let r = null;
	Fn(() => e.view.value.doc, (e) => {
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
			svg_raw: ql(await e.previewSvg()),
			svg_export: await e.printSvg(),
			svg_json: e.designJson(),
			svg_bespoke_texts: JSON.stringify(Gl(e)),
			svg_bespoke_images: JSON.stringify(Kl(e))
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
var Yl = Hl?.assetBase ?? "./", Xl = {
	regular: `${Yl}nimbus/NimbusSanL-Reg.otf`,
	bold: `${Yl}nimbus/NimbusSanL-Bol.otf`,
	italic: `${Yl}nimbus/NimbusSanL-RegIta.otf`,
	"bold-italic": `${Yl}nimbus/NimbusSanL-BolIta.otf`
}, Zl = {
	regular: `${Yl}arimo/Arimo-Regular.ttf`,
	bold: `${Yl}arimo/Arimo-Bold.ttf`,
	italic: `${Yl}arimo/Arimo-Italic.ttf`,
	"bold-italic": `${Yl}arimo/Arimo-BoldItalic.ttf`
}, Ql = (e, t) => (e ?? "").split(";")[0].replace(/\s+-\s*test$/i, "").trim() || t;
function $l(e, t) {
	return e.filter((e) => e.usable && e.category).flatMap((e) => {
		let n = t(e);
		return n ? [{
			code: e.code,
			name: Ql(e.referent, e.code),
			category: e.category,
			url: n
		}] : [];
	});
}
function eu(e, t, n = tu()) {
	return e.includes("{name}") ? new URL(e.replace("{name}", t), n) : new URL(`${t}.json`, new URL(e.endsWith("/") ? e : `${e}/`, n));
}
var tu = () => typeof location > "u" ? void 0 : location.href;
async function nu(e) {
	let t = async (t) => {
		let n = await fetch(eu(e, t), { credentials: Ul() });
		if (!n.ok) throw Error(`${t}: HTTP ${n.status}`);
		return n.json();
	}, [n, r, i] = await Promise.all([
		t("categories"),
		t("symbols"),
		t("sizes")
	]), a = eu(e, "symbols").href;
	return {
		source: new URL(a).origin,
		categories: n,
		symbols: $l(r, (e) => e.url ? new URL(e.url, a).href : void 0),
		sizes: i
	};
}
function ru(e = location.search) {
	let t = Hl?.dataUrl ?? new URLSearchParams(e).get("data") ?? "https://www.safetysignsandnotices.co.uk/index.php?route=bespoke/api/{name}";
	return t && t !== "bundled" ? t : null;
}
async function iu(e = location.search) {
	let t = ru(e);
	if (t) return nu(t);
	let { loadBundledData: n } = await import("./bundledData.embed-DiqJWvnl.js");
	return n();
}
var au = 0, ou = Date.now().toString(36), su = (e) => `${e}-${ou}${(++au).toString(36)}`;
function cu(e) {
	let t = structuredClone(e), n = (e) => {
		if (Array.isArray(e)) e.forEach(n);
		else if (e && typeof e == "object") {
			let t = e;
			typeof t.id == "string" && typeof t.role == "string" && (t.id = su(t.role)), Object.values(t).forEach(n);
		}
	};
	return n(t), t;
}
var lu = (e, t) => ({
	id: su("text_block"),
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
}), uu = (e = "Your text here") => ({
	id: su("text_panel"),
	role: "text_panel",
	padding: "auto",
	spacing: "auto",
	justify: "centre",
	grow: 1,
	blocks: [lu(e, "title")]
}), du = (e) => ({
	id: su("symbol"),
	role: "symbol",
	symbol_code: e.code,
	category: e.category,
	source: e.source
});
function fu(e, t) {
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
function pu(e) {
	if (e.placeholder) {
		delete e.placeholder;
		for (let t of e.text_frame.panels) {
			delete t.fill;
			for (let e of t.blocks) delete e.colour, e.variant = "bold";
		}
	}
}
function mu(e, t) {
	let n = e.root.sections.find((e) => e.id === t);
	if (!n) throw Error(`No section ${t}`);
	return n;
}
function hu(e, t) {
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
function gu(e, t) {
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
var _u = (e, t, n) => {
	if (t === n || t < 0 || n < 0 || t >= e.length || n >= e.length) return;
	let [r] = e.splice(t, 1);
	e.splice(n, 0, r);
};
function vu(e) {
	let t = e.root.sections.find((e) => e.translation);
	return (t && e.root.sections.find((e) => e.id === t.translation.of)) ?? null;
}
function yu(e) {
	let t = vu(e);
	return t ? (t.symbol_frame?.symbols.length ?? 0) > 1 ? "multi" : "single" : e.root.layout.type === "board" ? "board" : e.root.layout.type === "grid" ? "grid" : e.root.sections.length > 1 ? "stacked" : (e.root.sections[0]?.symbol_frame?.symbols.length ?? 0) > 1 ? "multi" : "single";
}
var bu = (e, t) => e > t ? "left" : "above", xu = (e) => e === "left" || e === "right" ? "horizontal" : "vertical";
function Su(e) {
	let { root: t } = e;
	if (t.layout.type === "board") return Cu(e, t.layout);
	if (t.layout.type !== "grid" && t.sections.length > 1) return;
	let [n, r] = t.layout.type === "grid" ? [t.width / t.layout.cols, t.height / t.layout.rows] : [t.width, t.height], i = t.sections[0]?.symbol_side === "end";
	for (let e of t.sections) e.orientation = xu(bu(n, r)), i || delete e.symbol_side;
}
function Cu(e, t) {
	let { root: n } = e, r = Cf(t), i = wf(t), a = r.reduce((e, t) => e + t, 0) || 1, o = 0;
	t.rows.forEach((e, t) => {
		let s = n.width / i[t], c = r[t] / a * n.height;
		for (let e = 0; e < i[t]; e++) {
			let t = n.sections[o + e];
			if (!t || !t.text_frame.panels.length) continue;
			let r = t.symbol_side === "end";
			t.orientation = xu(bu(s, c)), r || delete t.symbol_side;
		}
		o += i[t];
	});
}
function wu(e) {
	let t = e.root.sections[0], n = t?.symbol_side === "end";
	return t?.orientation === "horizontal" ? n ? "right" : "left" : n ? "below" : "above";
}
function Tu(e, t) {
	let n = t === "below" || t === "right";
	for (let r of e.root.sections) r.orientation = xu(t), n ? r.symbol_side = "end" : delete r.symbol_side;
}
function Eu(e, t) {
	let { root: n } = e, r = yu(e);
	if (t === r) return null;
	let i = null, a = vu(e);
	if (a) {
		let e = a.symbol_frame;
		return !e || t !== "single" && t !== "multi" ? null : (t === "single" ? e.symbols.length = 1 : e.symbols.length < 2 && (e.symbols.push(cu(e.symbols[0])), i = {
			section: n.sections.indexOf(a),
			symbol: e.symbols.length - 1
		}), i);
	}
	let o = n.sections[0], s = Ju(e);
	if (t === "single" || t === "multi") {
		let r = t === "multi" && n.sections.length > 1 ? ku(n.sections) : o;
		n.sections = [r], n.layout = {
			type: "stack",
			direction: "vertical",
			spacing: "auto",
			align_symbols: s
		};
		let a = r.symbol_frame;
		if (t === "single" && a && a.symbols.length > 1 && (a.symbols.length = 1), t === "multi") {
			if (!a) return null;
			a.symbols.length < 2 && (a.symbols.push(cu(a.symbols[0])), i = {
				section: 0,
				symbol: a.symbols.length - 1
			});
		}
		Su(e);
	} else if (t === "stacked") {
		let t = r === "multi" ? Ou(o) : n.sections.slice(0, 4);
		t.length < 2 && t.push(cu(o)), n.sections = t, n.layout = {
			type: "stack",
			direction: "vertical",
			spacing: "auto",
			align_symbols: s
		}, Tu(e, "left");
	} else if (t === "board") {
		let t = (r === "multi" ? Ou(o) : n.sections).slice(0, 8);
		n.sections = t.length ? t : [o], n.layout = {
			type: "board",
			rows: n.sections.map(() => ({ cells: 1 })),
			gutter: "auto",
			sync_rows: !0,
			align_symbols: !1
		}, Su(e);
	} else {
		let t = r === "multi" ? Ou(o).slice(0, 4) : null, i = t?.length ?? 2, [a, c] = n.width >= n.height ? [1, i] : [i, 1];
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
		}, Au(e), Su(e);
	}
	return i;
}
function Du(e) {
	let t = [];
	for (let n of e) {
		let e = t[t.length - 1];
		e && (e[0].category === n.category || t.length >= 4) ? e.push(n) : t.push([n]);
	}
	return t;
}
function Ou(e) {
	let t = Du(e.symbol_frame?.symbols ?? []);
	if (t.length < 2) return [e];
	let n = t.length, r = e.text_frame.panels, i = t.map(() => []);
	if (r.length >= n) r.forEach((e, t) => i[Math.min(t, n - 1)].push(e));
	else {
		let e = r.flatMap((e) => e.blocks), t = Math.max(1, e.length - (n - 1)), a = r[0], o = (e, t) => ({
			...a,
			id: t ? a.id : su("text_panel"),
			blocks: e
		});
		i[0].push(o(e.slice(0, t), !0));
		for (let r = 1; r < n; r++) {
			let n = e[t + r - 1];
			i[r].push(n ? o([kd(n, "title")], !1) : uu());
		}
	}
	return t.map((t, n) => {
		let r = n === 0 ? e : cu({
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
				id: n === 0 ? e.symbol_frame.id : su("symbol_frame"),
				symbols: t
			},
			text_frame: {
				...r.text_frame,
				panels: i[n]
			}
		};
	});
}
function ku(e) {
	let t = e[0], n = e.flatMap((e) => e.symbol_frame?.symbols ?? []).slice(0, 4), r = e.flatMap((e) => e.text_frame.panels), i = e.every((e) => e.text_frame.panels.length === 1) && r.every((e) => e.category === void 0), a = (e) => e.symbol_frame?.symbols[0]?.category ?? e.category, o = i ? [{
		...r[0],
		blocks: r.flatMap((e, t) => e.blocks.map((e) => t > 0 && Od(e) === "title" ? kd(e, "body") : e))
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
function Au(e) {
	let { root: t } = e;
	if (t.layout.type !== "grid") return;
	let n = t.layout.rows * t.layout.cols;
	for (; t.sections.length < n;) t.sections.push(cu(t.sections[t.sections.length - 1]));
	t.sections.length = n;
}
function ju(e, t, n) {
	let r = e.root.layout;
	r.type === "grid" && (r.rows = Math.max(1, Math.min(4, Math.round(t))), r.cols = Math.max(1, Math.min(4, Math.round(n))), Au(e), Su(e));
}
function Mu(e, t) {
	e.root.width = t.width, e.root.height = t.height, e.catalogue_size_id = t.size_id, Su(e);
}
var Nu = 1200, Pu = 2400, Fu = (e) => Math.round(Math.min(Pu, Math.max(50, Number.isFinite(e) ? e : 50)));
function Iu(e, t, n, r) {
	let i = Fu(e);
	if (r && n.width > 0 && n.height > 0) {
		let e = n.width / n.height, r = t === "width" ? i : i * e, a = t === "width" ? i / e : i, o = Math.min(1, Nu / Math.min(r, a), Pu / Math.max(r, a));
		return r *= o, a *= o, {
			width: Fu(r),
			height: Fu(a)
		};
	}
	let a = t === "width" ? i : Fu(n.width), o = t === "height" ? i : Fu(n.height);
	return Math.min(a, o) > 1200 && (t === "width" ? a = Nu : o = Nu), {
		width: a,
		height: o
	};
}
function Lu(e, t, n, r) {
	let i = Fu(t), a = Fu(n);
	Math.min(i, a) > 1200 && (i <= a ? i = Nu : a = Nu);
	let o = r.find((e) => e.width === i && e.height === a);
	if (o) return Mu(e, o);
	e.root.width = i, e.root.height = a, delete e.catalogue_size_id, Su(e);
}
function Ru(e, t) {
	let n = e.root.sections;
	return e.root.layout.type !== "stack" || n.length >= 4 ? t : (n.splice(t + 1, 0, cu(n[t])), t + 1);
}
function zu(e, t) {
	let n = e.root.sections;
	e.root.layout.type !== "stack" || n.length <= 1 || (n.splice(t, 1), n.length === 1 && Su(e));
}
var Bu = (e, t, n) => _u(e.root.sections, t, n);
function Vu(e, t, n) {
	let r = e.root.sections;
	t !== n && r[t] && r[n] && ([r[t], r[n]] = [r[n], r[t]]);
}
function Hu(e, t) {
	let n = e.root.sections[t];
	n && (e.root.sections = e.root.sections.map((e, r) => r === t ? e : cu(n)));
}
function Uu(e, t) {
	for (let n of e.root.sections[t]?.text_frame.panels ?? []) for (let e of n.blocks) e.text = "";
}
function Wu(e, t, n) {
	let r = mu(e, t);
	pu(r), r.symbol_frame || (r.symbol_frame = {
		id: su("symbol_frame"),
		role: "symbol_frame",
		spacing: "auto",
		align: "centre",
		symbols: []
	}, delete r.category);
	let i = r.symbol_frame.symbols;
	return i.length >= 4 || i.push(du(n)), i.length - 1;
}
function Gu(e, t, n, r) {
	pu(mu(e, t));
	let i = mu(e, t).symbol_frame?.symbols, a = i?.[n];
	i && a && (i[n] = {
		...a,
		symbol_code: r.code,
		category: r.category,
		source: r.source
	});
}
function Ku(e, t, n) {
	let r = mu(e, t), i = r.symbol_frame, a = i?.symbols[n];
	i && a && (i.symbols.splice(n, 1), i.symbols.length === 0 && (r.symbol_frame = null, r.category = a.category));
}
var qu = (e, t, n, r) => {
	let i = mu(e, t).symbol_frame?.symbols;
	i && _u(i, n, r);
}, Ju = (e) => e.root.layout.align_symbols ?? !0;
function Yu(e, t) {
	e.root.layout.align_symbols = t;
}
function Xu(e, t, n) {
	let r = Ju(e) ? e.root.sections : [mu(e, t)];
	for (let e of r) e.symbol_share = n;
}
function Zu(e, t, n) {
	let r = mu(e, t);
	pu(r), r.category = n;
}
function Qu(e, t) {
	let n = mu(e, t).text_frame.panels;
	if (n.length >= 4) return null;
	let r = uu("More text");
	return r.blocks[0].size = {
		...r.blocks[0].size,
		role: "body"
	}, n.push(r), r.id;
}
function $u(e, t, n) {
	let r = mu(e, t).text_frame.panels;
	if (r.length >= 4) return null;
	let i = uu("");
	return i.blocks = [], i.lead = {
		symbol: du(n),
		share: 1
	}, r.push(i), i.id;
}
var ed = (e) => !!e.lead && e.blocks.length === 0;
function td(e, t, n) {
	let { panel: r } = hu(e, t);
	r.lead &&= {
		...r.lead,
		symbol: du(n)
	};
}
function nd(e, t, n) {
	let { panel: r } = hu(e, t);
	r.grow = Math.max(rd, Math.min(3, n));
}
var rd = .25;
function id(e, t) {
	let { section: n, index: r } = hu(e, t);
	n.text_frame.panels.length > 1 && n.text_frame.panels.splice(r, 1);
}
function ad(e, t, n) {
	let { section: r, index: i } = hu(e, t);
	_u(r.text_frame.panels, i, i + n);
}
function od(e, t, n) {
	pu(hu(e, t).section);
	let { panel: r } = hu(e, t);
	n ? r.category = n : delete r.category;
}
var sd = [
	"prohibition",
	"warning",
	"mandatory",
	"fire_emergency",
	"fire"
];
function cd(e) {
	let t = [
		...sd,
		"plain",
		lf.key
	].flatMap((t) => e.filter((e) => e.key === t)), n = new Set(t.map((e) => `${e.panel.hex}/${e.panel_text.hex}`));
	return {
		main: t,
		more: e.filter((e) => {
			let t = `${e.panel.hex}/${e.panel_text.hex}`;
			return sd.includes(e.key) || n.has(t) ? !1 : (n.add(t), !0);
		})
	};
}
function ld(e, t) {
	let { panel: n } = hu(e, t);
	if (n.blocks.length >= 4) return null;
	let r = lu("More text", "body");
	return n.blocks.push(r), r.id;
}
function ud(e, t) {
	let { panel: n } = hu(e, t);
	if (n.blocks.length >= 4) return null;
	let r = lu("", "body");
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
var dd = 1.3;
function fd(e, t, n) {
	let r = hd(e, t);
	r && (r.box_lines = Math.max(dd, Math.min(8, n)), delete r.stretch);
}
function pd(e, t) {
	let n = hd(e, t);
	n && (delete n.box_lines, n.stretch = !0);
}
var md = (e) => e.blocks.find((e) => e.fill !== void 0)?.box_lines ?? null, hd = (e, t) => hu(e, t).panel.blocks.find((e) => e.fill !== void 0);
function gd(e, t) {
	let { panel: n } = hu(e, t), r = n.blocks.findIndex((e) => e.fill !== void 0);
	r >= 0 && n.blocks.splice(r, 1);
}
var _d = (e) => e.blocks.some((e) => e.fill !== void 0);
function vd(e, t) {
	let { section: n, panel: r, index: i } = gu(e, t);
	r.blocks.length > 1 ? r.blocks.splice(i, 1) : n.text_frame.panels.length > 1 ? id(e, r.id) : r.blocks[0].text = "";
}
function yd(e, t, n) {
	let { panel: r, index: i } = gu(e, t);
	_u(r.blocks, i, i + n);
}
var bd = (e, t, n) => {
	let { section: r, block: i } = gu(e, t);
	pu(r), i.text = n;
}, xd = (e, t, n) => {
	gu(e, t).block.align = n;
};
function Sd(e, t, n) {
	gu(e, t).block.variant = n ? "bold" : "regular";
}
var Cd = (e) => e.variant === "bold" || e.variant === "bold-italic", wd = (e) => e.text_transform === "uppercase";
function Td(e, t) {
	t ? e.text_transform = "uppercase" : delete e.text_transform;
}
var Ed = (e, t, n) => Td(gu(e, t).block, n);
function Dd(e, t, n) {
	let { block: r } = gu(e, t);
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
var Od = (e) => e.size.mode === "auto" ? e.size.role : "title", kd = (e, t) => ({
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
}), Ad = {
	min: .8,
	max: 1.6,
	step: .05,
	default: 1.15
};
function jd(e, t, n) {
	let r = Number.isFinite(n) ? n : Ad.default;
	gu(e, t).block.line_spacing = Math.round(Math.min(Ad.max, Math.max(Ad.min, r)) * 100) / 100;
}
var Md = (e) => e.placement === "pin-bottom";
function Nd(e, t, n) {
	gu(e, t).block.placement = n ? "pin-bottom" : "flow";
}
function Pd(e, t, n) {
	gu(e, t).block.y_offset = Math.round(n * 10) / 10;
}
var Fd = 1.18;
function Id(e) {
	if (e.size.mode !== "auto" || e.size.recommended !== "auto") return 0;
	let t = Math.round(Math.log(e.size.scale ?? 1) / Math.log(Fd));
	return Math.max(-12, Math.min(8, t));
}
function Ld(e, t) {
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
	}, i = Math.min(Fs.MAX_TEXT_SCALE, Math.max(Fs.MIN_TEXT_SCALE, Fd ** n));
	e.size = n === 0 ? r : {
		...r,
		scale: Math.round(i * 1e3) / 1e3
	};
}
function Rd(e, t) {
	return e > 0 && t ? "Max fit" : e === 0 ? "Auto" : e > 0 ? `+${e}` : `${e}`;
}
var zd = (e) => e.root.background && "token" in e.root.background && e.root.background.token === "panel" ? "colour" : "white";
function Bd(e) {
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
var Vd = (e, t, n) => Math.hypot(e[0] - t[0], e[1] - t[1], e[2] - t[2]) <= n;
function Hd(e, t) {
	if (e.category !== "prohibition") return !1;
	let n = t.replace("#", "");
	if (n.length !== 6) return !1;
	let r = [
		0,
		2,
		4
	].map((e) => parseInt(n.slice(e, e + 2), 16));
	return Bd(e.source?.body ?? "").some((e) => Vd(e, r, 40));
}
function Ud(e, t) {
	for (let n of e.root.sections) for (let e of n.text_frame.panels) {
		let r = e.category ?? n.category ?? Wd(n), i = t.find((e) => e.key === r), a = !i || r === Kd || e.fill === "none" ? Gd : i.panel_text.hex;
		for (let t of [e.lead, e.trail]) t && t.symbol.category === "directional" && (t.symbol.source = Jd(t.symbol.source, a));
	}
	for (let n of e.root.sections) {
		let e = n.symbol_frame, r = e?.symbols ?? [];
		if (!e || !r.length || !r.every((e) => e.category === "directional")) continue;
		let i = n.text_frame.panels[0]?.category ?? n.category ?? Wd(n), a = t.find((e) => e.key === i);
		if (!a || i === Kd) {
			delete e.background;
			for (let e of r) e.source = Jd(e.source, Gd);
			continue;
		}
		e.background = { ...a.panel };
		for (let e of r) e.source = Jd(e.source, a.panel_text.hex);
	}
}
var Wd = (e) => e.symbol_frame?.symbols.find((e) => e.category !== qd)?.category, Gd = "#231F20", Kd = "plain", qd = "directional";
function Jd(e, t) {
	let n = e.body.replace(/fill\s*:\s*#[0-9a-fA-F]{3,8}/g, `fill: ${t}`).replace(/fill="#[0-9a-fA-F]{3,8}"/g, `fill="${t}"`).replace(/stroke\s*:\s*#[0-9a-fA-F]{3,8}/g, `stroke: ${t}`).replace(/stroke="#[0-9a-fA-F]{3,8}"/g, `stroke="${t}"`);
	return n === e.body ? e : {
		...e,
		body: n,
		hash: `${e.hash}-${t.slice(1)}`
	};
}
var Yd = (e) => !!e.symbol_frame?.background;
function Xd(e, t) {
	for (let n of e.root.sections) {
		let e = n.symbol_frame;
		e && (t ? e.background = { token: "background" } : delete e.background);
	}
}
function Zd(e, t) {
	return e.root.sections.some((e) => {
		let n = e.category ?? e.symbol_frame?.symbols[0]?.category, r = t.find((e) => e.key === n)?.panel.hex;
		return !!r && (e.symbol_frame?.symbols ?? []).some((e) => Hd(e, r));
	});
}
function Qd(e, t, n = []) {
	if (t !== "colour") {
		delete e.root.background, Xd(e, !1);
		return;
	}
	e.root.background = { token: "panel" }, Zd(e, n) && Xd(e, !0);
}
var $d = (e) => !!e.root.border;
function ef(e, t) {
	if (!t) {
		delete e.root.border, delete e.root.margin, delete e.root.padding;
		return;
	}
	e.root.border = { width: tf(e) }, e.root.margin = 0, e.root.padding = "auto";
}
var tf = (e) => af * Math.min(e.root.width, e.root.height), nf = (e) => of * Math.min(e.root.width, e.root.height), rf = (e) => sf * Math.min(e.root.width, e.root.height), af = .03333, of = af * 3, sf = .004, cf = (e) => {
	let t = e.root.border?.width;
	return typeof t == "number" ? t : tf(e);
}, lf = {
	key: "ink",
	title: "Black",
	background: { hex: "#FFFFFF" },
	panel: {
		hex: "#000000",
		cmyk: [
			0,
			0,
			0,
			100
		]
	},
	panel_text: { hex: "#FFFFFF" }
}, uf = (e) => [lf, ...e];
function df(e, t) {
	let n = e.root.border?.colour;
	if (!n || "token" in n) return null;
	let r = n.hex.toUpperCase();
	return uf(t).find((e) => e.panel.hex.toUpperCase() === r)?.key ?? null;
}
function ff(e, t, n) {
	if (!e.root.border) return;
	let { width: r } = e.root.border, i = t ? uf(n).find((e) => e.key === t) : void 0;
	e.root.border = i ? {
		width: r,
		colour: { ...i.panel }
	} : { width: r };
}
function pf(e, t) {
	if (!e.root.border) return;
	let [n, r] = [rf(e), nf(e)];
	e.root.border = {
		...e.root.border,
		width: Math.min(r, Math.max(n, t))
	};
}
var mf = (e, t) => e.root.corners?.rounded ?? t;
function hf(e, t) {
	e.root.corners = {
		rounded: t,
		radius: e.root.corners?.radius ?? "auto"
	};
}
function gf(e, t) {
	e.root.layout.type === "grid" && (e.root.layout.sync_text = t);
}
var _f = (e) => e.root.layout.type === "grid" && e.root.layout.cell_outline !== void 0;
function vf(e, t) {
	let n = e.root.layout;
	n.type === "grid" && (t ? n.cell_outline = {
		width: "auto",
		layer: "artwork"
	} : delete n.cell_outline);
}
var yf = (e) => vu(e) ?? e.root.sections[0];
function bf(e) {
	if (!vu(e) && (e.root.layout.type !== "stack" || e.root.sections.length !== 1)) return !1;
	let t = yf(e);
	return t.symbol_frame?.symbols.length === 1 && t.text_frame.panels.length === 1 && t.text_frame.panels[0].blocks.length <= 2 && t.text_frame.panels[0].category === void 0;
}
function xf(e) {
	let t = yf(e).text_frame.panels[0].blocks;
	t.length < 2 && t.push(lu("", "body"));
}
function Sf(e) {
	return [
		e.id,
		...e.symbol_frame ? [e.symbol_frame.id, ...e.symbol_frame.symbols.map((e) => e.id)] : [],
		e.text_frame.id,
		...e.text_frame.panels.flatMap((e) => [e.id, ...e.blocks.map((e) => e.id)])
	];
}
var Cf = (e) => e.rows.map((e) => typeof e.weight == "number" && Number.isFinite(e.weight) && e.weight > 0 ? e.weight : 1), wf = (e) => e.rows.map((e) => Math.max(1, Math.min(2, Math.floor(e.cells))));
function Tf(e, t, n, r, i) {
	if (r < 0 || i < 0 || r > t || i > n || !e.rows.length) return null;
	let a = Cf(e), o = wf(e), s = a.reduce((e, t) => e + t, 0) || 1, c = 0, l = 0;
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
function Ef(e, t, n) {
	let { root: r } = e;
	if (r.layout.type === "board") return Tf(r.layout, r.width, r.height, t, n);
	if (r.layout.type !== "grid") return null;
	let { rows: i, cols: a } = r.layout, o = Math.floor(t / r.width * a), s = Math.floor(n / r.height * i);
	return o < 0 || s < 0 || o >= a || s >= i ? null : s * a + o;
}
function Df(e) {
	let t = /^root\.sections\[(\d+)\]/.exec(e);
	return t ? Number(t[1]) : null;
}
function Of(e) {
	let { root: t } = e, { layout: n } = t, r = n.type === "grid" ? t.height / n.rows : n.type === "board" ? t.height / Math.max(1, n.rows.length) : t.height / Math.max(1, n.direction === "vertical" ? t.sections.length : 1);
	return Math.max(5, Math.round(r / 4));
}
//#endregion
//#region editor/src/model/recipe.ts
var kf = "plain", Af = {
	hex: "#000000",
	cmyk: [
		0,
		0,
		0,
		100
	]
}, jf = 14, Mf = 4, Nf = 8, Pf = [
	"title",
	"body",
	"footer"
], Ff = [
	"above",
	"below",
	"left",
	"right"
], If = (e, t) => typeof e == "string" ? e.slice(0, t) : "", Lf = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, Rf = (e) => Array.isArray(e) ? e : [];
function zf(e) {
	let t = Lf(e);
	if (!t) return null;
	let n = Rf(t.sections).slice(0, jf).map((e) => {
		let t = Lf(e) ?? {};
		return {
			symbols: Rf(t.symbols).filter((e) => typeof e == "string").slice(0, 4).map((e) => e.trim().toUpperCase()),
			colour: typeof t.colour == "string" ? t.colour : null,
			...t.step === !0 ? { step: !0 } : {},
			...t.write_on === !0 ? { write_on: !0 } : {},
			panels: Rf(t.panels).slice(0, Mf).map((e) => {
				let t = Lf(e) ?? {};
				return {
					colour: typeof t.colour == "string" ? t.colour : null,
					lines: Rf(t.lines).slice(0, Nf).map((e) => {
						let t = Lf(e) ?? {}, n = typeof t.min == "number" && Number.isFinite(t.min) ? Math.min(20, Math.max(Fs.MIN_LETTER_HEIGHT, t.min)) : void 0, r = t.align === "left" || t.align === "right" || t.align === "centre" ? t.align : void 0;
						return {
							text: If(t.text, 200),
							style: Pf.includes(t.style) ? t.style : "body",
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
	let r = Vf(t.rows_spec, n.length), i = Bf(t.border), a = t.layout === "board" && r ? "board" : t.layout === "stacked" || t.layout === "grid" ? t.layout : "single", o = (e) => typeof e == "number" && Number.isInteger(e) && e > 0 && e <= 6 ? e : void 0, s = o(t.rows), c = o(t.cols);
	return {
		version: 1,
		layout: a === "single" && n.length > 1 ? "stacked" : a,
		...r ? { rows_spec: r } : {},
		...t.background === "colour" ? { background: "colour" } : {},
		...i ? { border: i } : {},
		...s === void 0 ? {} : { rows: s },
		...c === void 0 ? {} : { cols: c },
		symbol_position: Ff.includes(t.symbol_position) ? t.symbol_position : null,
		sections: n
	};
}
function Bf(e) {
	if (e === !0) return {};
	let t = Lf(e);
	if (!t) return null;
	let n = typeof t.scale == "number" && t.scale > 0 ? Math.min(3, Math.max(.1, t.scale)) : void 0, r = typeof t.colour == "string" && t.colour.trim() ? t.colour.trim().slice(0, 40) : void 0;
	return {
		...n === void 0 ? {} : { scale: n },
		...r ? { colour: r } : {}
	};
}
function Vf(e, t) {
	let n = Rf(e).slice(0, 8).map((e) => {
		let t = Lf(e) ?? {}, n = typeof t.cells == "number" ? Math.round(t.cells) : 1, r = typeof t.weight == "number" && t.weight > 0 ? Math.min(3, Math.max(.4, t.weight)) : void 0;
		return {
			cells: Math.max(1, Math.min(2, n)),
			...r === void 0 ? {} : { weight: r }
		};
	});
	return !n.length || n.reduce((e, t) => e + t.cells, 0) !== t ? null : n;
}
var Hf = (e) => [...new Set(e.sections.flatMap((e) => e.symbols))];
function Uf(e, t, n) {
	let r = new Set(n.categories.map((e) => e.key)), i = (e) => e && r.has(e) ? e : void 0, a = n.categories[0]?.key ?? "prohibition", o = e.symbols.map((e) => t.get(e)).filter((e) => !!e), s = e.colour === kf, c = (e.panels.length ? e.panels : [{ lines: [{ text: "" }] }]).map((e) => {
		let t = uu(), n = e.colour === "plain" || s && !e.colour, r = i(e.colour);
		return r && (t.category = r), n && (t.fill = { token: "background" }), t.blocks = e.lines.map((e) => {
			let t = lu(e.text, e.style ?? "body");
			return e.bold === !1 && (t.variant = "regular"), e.align !== void 0 && (t.align = e.align), e.min !== void 0 && t.size.mode === "auto" && (t.size.min = e.min), n && (t.colour = {
				...Af,
				cmyk: [...Af.cmyk]
			}), Td(t, e.caps === !0), t;
		}), t;
	}), l = {
		id: su("section"),
		role: "section",
		orientation: "vertical",
		spacing: "auto",
		symbol_share: n.ratios.DEFAULT_SYMBOL_SHARE,
		symbol_frame: o.length ? {
			id: su("symbol_frame"),
			role: "symbol_frame",
			spacing: "auto",
			align: "centre",
			symbols: o.map((e) => ({
				id: su("symbol"),
				role: "symbol",
				symbol_code: e.code,
				category: e.category,
				source: e.source
			}))
		} : null,
		text_frame: {
			id: su("text_frame"),
			role: "text_frame",
			spacing: "auto",
			panels: c
		}
	};
	return o.length || (l.category = i(e.colour) ?? i(e.panels[0]?.colour) ?? a), l;
}
function Wf(e, t, n, r) {
	let i = qc({
		symbols: [],
		title: "",
		size: {
			width: t.width,
			height: t.height,
			catalogue_size_id: t.size_id
		},
		ruleset: r
	}), a = e.sections.map((e) => Uf(e, n, r));
	i.root.sections = a;
	let o = a.length;
	if (e.layout === "board" && e.rows_spec?.length) {
		let t = e.rows_spec, n = t.reduce((e, t) => e + t.cells, 0);
		for (; i.root.sections.length < n;) i.root.sections.push(cu(i.root.sections[i.root.sections.length - 1]));
		i.root.sections.length = n, i.root.layout = {
			type: "board",
			rows: t,
			gutter: "auto",
			sync_rows: !0,
			align_symbols: !1
		}, Su(i);
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
		}, Su(i);
	} else i.root.layout = {
		type: "stack",
		direction: "vertical",
		spacing: "auto",
		align_symbols: !0
	}, o > 1 ? Tu(i, "left") : Su(i);
	return e.symbol_position && Tu(i, e.symbol_position), e.background === "colour" && Qd(i, "colour", r.categories), e.border && (ef(i, !0), e.border.scale !== void 0 && pf(i, tf(i) * e.border.scale), e.border.colour && ff(i, e.border.colour, r.categories)), i;
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
}), Gf = [
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
		colour: kf,
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
		colour: kf,
		lines: ["Site manager: 00000 000000"],
		cells: 1,
		weight: .7
	}),
	Q("text-blank", "Wording only", "Blank row (your own wording)", {
		colour: kf,
		lines: ["Your text here"]
	})
], Kf = (e) => Gf.find((t) => t.id === e), qf = () => {
	let e = [
		"Headers",
		"Site rules",
		"PPE",
		"Warnings",
		"Prohibitions",
		"Wording only"
	], t = [...e, ...Gf.map((e) => e.group).filter((t) => !e.includes(t))];
	return [...new Set(t)].map((e) => ({
		group: e,
		presets: Gf.filter((t) => t.group === e)
	})).filter((e) => e.presets.length);
}, Jf = [
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
], Yf = (e, t, n, r) => ({
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
}), Xf = [
	Yf("fa-header", "Header", "Fire action header", {
		symbols: ["M001"],
		colour: "mandatory",
		title: "Fire action",
		lines: ["If you discover or suspect a fire"],
		weight: 1.15
	}),
	Yf("fa-header-plain", "Header", "Fire action (no strapline)", {
		symbols: ["M001"],
		colour: "mandatory",
		title: "Fire action",
		lines: [],
		weight: 1
	}),
	Yf("fa-title", "Header", "Fire action (title only)", {
		colour: "mandatory",
		title: "Fire action",
		lines: [],
		weight: 1.5
	}),
	Yf("fa-symbol", "Header", "Symbol on its own", {
		symbols: ["M001"],
		colour: null,
		lines: [],
		weight: 1.4
	}),
	Yf("fa-alarm", "Raise the alarm", "Raise the alarm", {
		align: "left",
		symbols: ["F001"],
		colour: "fire",
		lines: ["Raise the alarm"],
		step: !0,
		weight: .9
	}),
	Yf("fa-alarm-callpoint", "Raise the alarm", "Sound the alarm at the call point", {
		align: "left",
		symbols: ["F005"],
		colour: "fire",
		lines: ["Sound the alarm by operating the nearest fire alarm call point"],
		step: !0
	}),
	Yf("fa-dial", "Raise the alarm", "Dial … to call the fire brigade", {
		align: "left",
		symbols: ["F006"],
		colour: "fire",
		lines: ["Call the fire brigade on"],
		writeOn: !0,
		step: !0
	}),
	Yf("fa-leave", "Leave", "Leave by the nearest exit", {
		align: "left",
		symbols: ["E001"],
		colour: "fire_emergency",
		lines: ["Leave the building by the nearest available exit"],
		step: !0
	}),
	Yf("fa-leave-short", "Leave", "Leave the building", {
		align: "left",
		symbols: ["E001"],
		colour: "fire_emergency",
		lines: ["Leave the building by the nearest exit"],
		step: !0,
		weight: .9
	}),
	Yf("fa-assembly", "Assemble", "Report to the assembly point", {
		align: "left",
		symbols: ["E007"],
		colour: "fire_emergency",
		lines: ["Report to person in charge of Assembly Point at:"],
		writeOn: !0,
		step: !0,
		weight: 1.25
	}),
	Yf("fa-assembly-short", "Assemble", "Report to assembly point", {
		align: "left",
		symbols: ["E007"],
		colour: "fire_emergency",
		lines: ["Report to assembly point"],
		writeOn: !0,
		step: !0
	}),
	Yf("fa-no-belongings", "Do not", "Do not stop for belongings", {
		align: "left",
		symbols: ["P001"],
		colour: "prohibition",
		lines: ["Do not stop to collect personal belongings", "Do not take risks"],
		step: !0
	}),
	Yf("fa-no-return", "Do not", "Do not return to the building", {
		align: "left",
		symbols: ["P004"],
		colour: "prohibition",
		lines: ["Do not return to the building until authorised to do so"]
	}),
	Yf("fa-no-lifts", "Do not", "Do not use the lifts", {
		align: "left",
		symbols: ["P020"],
		colour: "prohibition",
		lines: ["Do not use the lifts"],
		weight: .9
	}),
	Yf("fa-no-risks", "Do not", "Do not take any risks", {
		align: "left",
		symbols: ["P001"],
		colour: "prohibition",
		lines: ["Do not take any risks"],
		weight: .9
	})
], Zf = [
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
], Qf = (e) => Xf.find((t) => t.id === e), $f = () => {
	let e = [
		"Header",
		"Raise the alarm",
		"Leave",
		"Assemble",
		"Do not"
	], t = (e) => e.group, n = [...e, ...Xf.map(t).filter((t) => !e.includes(t))];
	return [...new Set(n)].map((e) => ({
		group: e,
		presets: Xf.filter((n) => t(n) === e)
	})).filter((e) => e.presets.length);
}, ep = () => [...new Set(Xf.flatMap((e) => e.section.symbols))], tp = 4e3;
function np(e, t, n) {
	let r = typeof n == "string" ? n : typeof location > "u" ? void 0 : location.href;
	if (e.includes("{name}")) {
		let n = new URL(e.replace("{name}", "rows"), r);
		return n.searchParams.set("kind", t), n;
	}
	return new URL(`rows-${t}.json`, new URL(e.endsWith("/") ? e : `${e}/`, r));
}
var rp = (e) => !!e && typeof e == "object" && !Array.isArray(e), ip = (e) => typeof e == "string" ? e : "", ap = (e, t) => typeof e == "number" && Number.isFinite(e) ? e : t;
function op(e, t) {
	if (!rp(e)) return null;
	let n = ip(e.id), r = ip(e.label), i = ip(e.group), a = rp(e.section) ? e.section : null;
	if (!n || !r || !i || !a) return null;
	let o = Array.isArray(a.symbols) ? a.symbols.filter((e) => typeof e == "string" && e !== "") : [], s = typeof a.colour == "string" && a.colour ? a.colour : null, c = (Array.isArray(a.panels) ? a.panels : []).map((e) => {
		let t = rp(e) ? e : {}, n = (Array.isArray(t.lines) ? t.lines : []).map((e) => {
			let t = rp(e) ? e : {}, n = ip(t.text);
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
		weight: ap(e.weight, 1),
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
		let t = rp(e.fireAction) ? e.fireAction : {};
		l.fireAction = {
			step: t.step === !0,
			writeOn: t.writeOn === !0
		};
	}
	return l;
}
function sp(e, t) {
	if (!rp(e)) return null;
	let n = ip(e.id), r = ip(e.label);
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
		hint: ip(e.hint),
		rows: i
	} : null;
}
function cp(e, t) {
	if (!rp(e)) return null;
	let n = ip(e.id), r = ip(e.label);
	if (!n || !r || !Array.isArray(e.rows)) return null;
	let i = e.rows.filter((e) => typeof e == "string" && t.has(e));
	if (!i.length) return null;
	let a = Array.isArray(e.size) ? e.size : [], o = ap(a[0], 0), s = ap(a[1], 0);
	return o <= 0 || s <= 0 ? null : {
		id: n,
		label: r,
		hint: ip(e.hint),
		size: [o, s],
		rows: i,
		...e.numbered === !1 ? { numbered: !1 } : {}
	};
}
var lp = (e, t) => {
	e.splice(0, e.length, ...t);
};
function up(e, t) {
	if (!rp(e)) return null;
	let n = e, r = Array.isArray(n.groups) ? n.groups : [], i = [];
	for (let e of r) if (rp(e) && Array.isArray(e.presets)) for (let n of e.presets) {
		let e = op(n, t);
		e && i.push(e);
	}
	if (!i.length) return null;
	let a = new Set(i.map((e) => e.id)), o = Array.isArray(n.templates) ? n.templates : [];
	if (t === "fireaction") {
		let e = o.map((e) => cp(e, a)).filter((e) => e !== null);
		return e.length ? (lp(Xf, i), lp(Zf, e), {
			rows: i.length,
			templates: e.length
		}) : null;
	}
	let s = o.map((e) => sp(e, a)).filter((e) => e !== null);
	return lp(Gf, i), s.length && lp(Jf, s), {
		rows: i.length,
		templates: s.length
	};
}
async function dp(e, t, n) {
	try {
		let r = new AbortController(), i = setTimeout(() => r.abort(), tp);
		try {
			let i = await fetch(np(e, t), {
				signal: r.signal,
				...n ? { credentials: n } : {}
			});
			return i.ok ? up(await i.json(), t) : null;
		} finally {
			clearTimeout(i);
		}
	} catch {
		return null;
	}
}
//#endregion
//#region editor/src/engineSetup.ts
async function fp() {
	let e = await gl({
		family: "Nimbus Sans",
		fallback: "Nimbus Sans",
		fallbackUrls: Xl
	});
	return e.family === "sans-serif" ? gl({
		family: "Arimo",
		fallback: "Arimo",
		fallbackUrls: Zl
	}) : e;
}
async function pp(e) {
	let t = ru(), [n] = await Promise.all([iu(), e && t ? dp(t, e, Ul()) : Promise.resolve(null)]), r = Il(n.categories).categories;
	return {
		data: n,
		ruleset: Bl(zl, r),
		shaper: await fp()
	};
}
//#endregion
//#region editor/src/printShaper.ts
async function mp(e) {
	let t = await Promise.all(Object.entries(e).map(async ([e, t]) => {
		let n = await fetch(t);
		if (!n.ok) throw Error(`${t}: HTTP ${n.status}`);
		return [e, await n.arrayBuffer()];
	}));
	return Object.fromEntries(t);
}
var hp = null;
function gp() {
	return hp || (hp = (async () => {
		let { createOpenTypeShaper: e } = await import("./opentypeShaper-RM5NMCu7.js");
		try {
			return await e(await mp(Xl));
		} catch {
			return e(await mp(Zl));
		}
	})(), hp.catch(() => {
		hp = null;
	})), hp;
}
//#endregion
//#region data/approved.json
var _p = [
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
], vp = (e) => [...new Set(e.root.sections.flatMap((e) => e.symbol_frame?.symbols.map((e) => e.symbol_code) ?? []))];
function yp(e, t) {
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
var bp = _p, xp = (e) => bp.find((t) => t.product_id === e) ?? null;
function Sp(e = location.search) {
	let t = Number(new URLSearchParams(e).get("approved"));
	return Number.isInteger(t) && t > 0 ? t : null;
}
async function Cp(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of vp(e.design)) {
		let e = await t(r);
		e && n.set(r, e);
	}
	return Mc(yp(e.design, n));
}
//#endregion
//#region editor/src/model/photo.ts
var wp = 1500, Tp = .85, Ep = (e) => /* @__PURE__ */ Error(/\.hei[cf]$/i.test(e) ? "iPhone HEIC photos can’t be read here. In Settings → Camera → Formats choose “Most Compatible”, or save the photo as JPEG first." : "That file couldn’t be read as a photo. JPEG or PNG works best.");
async function Dp(e) {
	if (e.size > 26214400) throw Error("That photo is very large. Please use one under 25 MB.");
	if (e.type && !e.type.startsWith("image/")) throw Ep(e.name);
	let t;
	try {
		t = await createImageBitmap(e, { imageOrientation: "from-image" });
	} catch {
		throw Ep(e.name);
	}
	let n = Math.min(1, wp / Math.max(t.width, t.height)), r = Math.max(1, Math.round(t.width * n)), i = Math.max(1, Math.round(t.height * n)), a = document.createElement("canvas");
	a.width = r, a.height = i;
	let o = a.getContext("2d");
	if (!o) throw Ep(e.name);
	o.fillStyle = "#ffffff", o.fillRect(0, 0, r, i), o.drawImage(t, 0, 0, r, i), t.close();
	let s = a.toDataURL("image/jpeg", Tp);
	if (!s.startsWith("data:image/jpeg")) throw Ep(e.name);
	return {
		dataUrl: s,
		width: r,
		height: i,
		bytes: Math.round((s.length - 23) * .75)
	};
}
//#endregion
//#region editor/src/model/tidy.ts
var Op = .05, kp = .9, Ap = 1.2, jp = 1.15;
function Mp(e, t) {
	let { report: n } = cc(e, t), r = n.sections.map((e) => e.k ?? 1), i = n.sections.flatMap((e) => e.blocks.map((e) => e.letter_height));
	return {
		ok: !n.findings.some((e) => e.severity === "error"),
		k: r.length ? Math.min(...r) : 1,
		mm: i.length ? Math.max(...i) : 0,
		share: e.root.sections[0]?.symbol_share ?? 0,
		lines: n.sections.reduce((e, t) => e + t.blocks.reduce((e, t) => e + t.lines, 0), 0)
	};
}
var Np = (e, t) => e.ok === t.ok ? Math.abs(e.k - t.k) > .001 ? e.k > t.k : e.lines === t.lines ? e.share > t.share : e.lines < t.lines : e.ok;
function Pp(e) {
	let t = [];
	for (let n of e.root.sections) for (let e of n.text_frame.panels) {
		let n = e.blocks.filter((e) => e.text.trim() !== "");
		n.length && n.length !== e.blocks.length && (e.blocks = n, t.push("empty lines removed"));
		for (let n of e.blocks) n.y_offset !== 0 && (n.y_offset = 0, t.push("nudges reset")), n.line_spacing !== Ad.default && (n.line_spacing = Ad.default, t.push("line spacing reset"));
	}
	return [...new Set(t)];
}
var Fp = (e) => e.root.sections.some((e) => (e.symbol_frame?.symbols.length ?? 0) > 0);
function Ip(e, t) {
	if (!Fp(e)) return [e];
	let { MIN_SYMBOL_SHARE: n, MAX_SYMBOL_SHARE: r } = t.ratios, i = [];
	for (let t of ["vertical", "horizontal"]) for (let a = n; a <= r + .001; a += Op) {
		let n = structuredClone(e);
		for (let e of n.root.sections) e.orientation = t, e.symbol_share = Math.round(a * 100) / 100;
		i.push(n);
	}
	return i;
}
var Lp = (e, t) => e.map((e) => ({
	doc: e,
	score: Mp(e, t)
})).reduce((e, t) => Np(t.score, e.score) ? t : e), Rp = (e) => "root" in e ? e.root.width * e.root.height : e.width * e.height;
function zp(e, t, n, r) {
	if (r.k >= kp) return null;
	let i = null;
	for (let a of t) {
		if (a.width === e.root.width && a.height === e.root.height) continue;
		let t = structuredClone(e);
		if (t.root.width = a.width, t.root.height = a.height, t.catalogue_size_id = a.size_id, Rp(a) > Rp(e) * Ap) continue;
		let o = Lp(Ip(t, n.ruleset), n).score;
		if (!o.ok || o.mm < r.mm * jp) continue;
		let s = Math.round((o.mm - r.mm) * 10) / 10;
		(!i || s > i.gain) && (i = {
			size: a,
			gain: s
		});
	}
	return i;
}
function Bp(e, t, n = []) {
	let r = Mp(e, t), i = structuredClone(e), a = Pp(i), o = Lp(Ip(i, t.ruleset), t), s = e.root.sections[0]?.orientation === "horizontal", c = o.doc.root.sections[0]?.orientation === "horizontal";
	Fp(e) && s !== c && a.unshift(c ? "symbol moved beside the text" : "symbol moved above the text");
	let l = o.doc.root.sections[0]?.symbol_share ?? 0;
	return Fp(e) && Math.abs(l - (e.root.sections[0]?.symbol_share ?? 0)) > .001 && a.push(`symbol size ${Math.round(l * 100)}%`), {
		doc: o.doc,
		outcome: {
			changed: a.length > 0 || JSON.stringify(o.doc.root) !== JSON.stringify(e.root),
			notes: a,
			before: Math.round(r.k * 100) / 100,
			after: Math.round(o.score.k * 100) / 100,
			suggestion: zp(o.doc, n, t, o.score)
		}
	};
}
//#endregion
//#region editor/src/model/translation.ts
var Vp = [
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
], Hp = (e) => Vp.find((t) => t.code === e)?.name ?? e ?? "", Up = "~t", Wp = (e) => `${e}${Up}`;
function Gp(e) {
	let t = e.root.sections.find((e) => e.translation), n = t && e.root.sections.find((e) => e.id === t.translation.of);
	return t && n ? {
		source: n,
		target: t,
		meta: t.translation
	} : null;
}
var Kp = (e) => Gp(e) !== null, qp = (e) => e.root.sections.length === 1 && !Kp(e), Jp = (e) => e.text_frame.panels.flatMap((e) => e.blocks);
function Yp(e) {
	let t = e.root.layout;
	return t.type === "grid" && t.rows > 1 ? "stacked" : "side";
}
var Xp = (e) => e.root.width >= e.root.height ? "side" : "stacked";
function Zp(e, t) {
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
	}, Su(e);
}
function Qp(e, t, n, r) {
	let i = new Map(t ? Jp(t).map((e) => [e.id, e.text]) : []), { translation: a, lang: o, ...s } = e, c = structuredClone(s), l = (e) => {
		if (Array.isArray(e)) e.forEach(l);
		else if (e && typeof e == "object") {
			let t = e;
			typeof t.id == "string" && typeof t.role == "string" && (t.id = Wp(t.id));
			for (let [e, n] of Object.entries(t)) e !== "source" && l(n);
		}
	};
	l(c);
	let u = /* @__PURE__ */ new Set();
	for (let e of Jp(c)) e.text = i.get(e.id) ?? "", u.add(e.id);
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
function $p(e, t, n = Xp(e)) {
	if (!qp(e)) return;
	let r = e.root.sections[0], i = {
		of: r.id,
		checked: !1,
		machine: !1,
		lines: {}
	};
	e.root.sections.push(Qp(r, null, i, t)), Zp(e, n);
}
function em(e, t) {
	Kp(e) && Zp(e, t);
}
function tm(e, t) {
	let n = Gp(e);
	if (n && n.target.lang !== t) {
		n.target.lang = t, n.meta.lines = {}, n.meta.checked = !1, n.meta.machine = !1;
		for (let e of Jp(n.target)) e.text = "";
	}
}
function nm(e) {
	let t = e.root.sections, n = t.findIndex((e) => e.translation);
	if (n < 0) return;
	let r = t[n], i = t.find((e) => e.id === r.translation.of);
	if (!i) {
		delete r.translation;
		return;
	}
	t[n] = Qp(i, r, r.translation, r.lang ?? "en");
}
function rm(e) {
	let t = Gp(e);
	if (!t) return [];
	let n = new Map(Jp(t.target).map((e) => [e.id, e]));
	return Jp(t.source).map((e) => {
		let r = Wp(e.id), i = t.meta.lines[r];
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
function im(e, t = !1) {
	let n = Gp(e);
	if (!n) return [];
	let r = [];
	for (let i of rm(e)) if (t || i.stale && !i.manual) {
		if (!i.source.trim()) {
			am(n, i.id, "", "", !1);
			continue;
		}
		r.push({
			id: i.id,
			text: i.source
		});
	}
	return r;
}
function am(e, t, n, r, i) {
	let a = Jp(e.target).find((e) => e.id === t);
	a && (a.text !== n && (e.meta.checked = !1), a.text = n, e.meta.lines[t] = {
		from: r,
		manual: i
	});
}
function om(e, t) {
	let n = Gp(e);
	if (!n) return;
	let r = new Map(rm(e).map((e) => [e.id, e]));
	for (let e of t) r.get(e.id)?.source === e.from && (am(n, e.id, e.text, e.from, !1), n.meta.machine = !0);
}
function sm(e, t, n) {
	let r = Gp(e), i = rm(e).find((e) => e.id === t);
	r && i && am(r, t, n, i.source, !0);
}
function cm(e, t) {
	let n = Gp(e), r = rm(e).find((e) => e.id === t);
	n && r && (n.meta.lines[t] = {
		from: r.source,
		manual: !0
	});
}
function lm(e, t) {
	let n = Gp(e);
	n && (n.meta.checked = t);
}
function um(e) {
	let t = Gp(e);
	if (!t) return !0;
	let n = rm(e);
	return t.meta.checked && n.every((e) => !e.stale && (e.text.trim() !== "" || e.source.trim() === ""));
}
function dm(e, t) {
	let n = Gp(e);
	n && (n.meta.lines[t] = {
		from: "",
		manual: !1
	});
}
function fm(e) {
	let t = Gp(e);
	if (!t) return !1;
	let n = e.root.sections;
	return n.indexOf(t.target) < n.indexOf(t.source);
}
function pm(e, t) {
	let n = Gp(e);
	n && (e.root.sections = t ? [n.target, n.source] : [n.source, n.target]);
}
//#endregion
//#region editor/src/model/product.ts
var mm = "", hm = {
	directional: ["ARL-L"],
	prohibition: ["P002"],
	warning: ["W001"],
	mandatory: ["M001"],
	fire_emergency: ["E001"],
	fire: ["F001"]
}, gm = (e) => e.replace(/\b([a-z])/g, (e) => e.toUpperCase());
function _m(e = location.search) {
	let t = Hl?.product;
	return t?.kind === "standard" ? "" : t?.kind || mm || new URLSearchParams(e).get("product") || "";
}
function vm(e, t, n) {
	let r = new URLSearchParams(e), i = Hl?.product, a = _m(e), o = r.get("type") ?? "prohibition", s = a === "board", c = a === "roadsign", l = a === "fireaction", u = a === "bilingual", d = r.get("lang"), f = i?.category ?? (c ? "directional" : o), p = t.find((e) => e.key === f), m = p ? p.key : null, h = n.filter((e) => !m || e.category === m), g = (hm[m ?? "prohibition"] ?? []).find((e) => h.some((t) => t.code === e)), _ = u ? "Two-Language " : "";
	return {
		type: l ? "fireaction" : c ? "roadsign" : s ? "board" : p ? p.key : "combination",
		heading: i?.heading ? i.heading : l ? "Fire Action Notice" : c ? "Temporary Site Sign" : s ? "Site Safety Board" : p ? `Custom ${_}${gm(p.title)} Sign` : u ? "Custom Two-Language Sign" : "Custom Combination Sign",
		category: m,
		defaultSymbol: i?.symbol ?? g ?? h[0]?.code ?? n[0]?.code ?? null,
		bilingual: u,
		language: Vp.find((e) => e.code === (i?.language ?? d))?.code ?? Vp[0].code,
		board: s,
		roadsign: c,
		fireaction: l
	};
}
//#endregion
//#region editor/src/model/signModel.ts
var ym = (e) => e.symbol_position === "left" ? "horizontal" : "vertical";
function bm(e, t, n, r, i) {
	let a = qc({
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
		orientation: ym(e),
		ruleset: i
	});
	return r || (Sm(a, "subtitle").text = ""), a;
}
var xm = yf;
function Sm(e, t) {
	let n = xm(e).text_frame.panels[0].blocks;
	return t === "title" ? n[0] : n[1];
}
function Cm(e, t) {
	if (e.root.width = t.width, e.root.height = t.height, e.catalogue_size_id = t.size_id, vu(e)) Su(e);
	else for (let n of e.root.sections) n.orientation = ym(t);
}
function wm(e, t) {
	let n = xm(e).symbol_frame;
	if (!n) return;
	let r = n.symbols[0];
	n.symbols[0] = {
		...r,
		symbol_code: t.code,
		category: t.category,
		source: t.source
	};
}
var Tm = (e) => xm(e).symbol_frame?.symbols[0]?.symbol_code;
function Em(e, t, n) {
	Sm(e, t).text = n;
}
function Dm(e, t, n) {
	Sm(e, t).align = n;
}
var Om = (e, t, n) => Td(Sm(e, t), n), km = (e, t) => Id(Sm(e, t)), Am = (e, t, n) => Ld(Sm(e, t), n);
//#endregion
//#region node_modules/dompurify/dist/purify.es.mjs
function jm(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function Mm(e) {
	if (Array.isArray(e)) return e;
}
function Nm(e, t) {
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
function Pm() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function Fm(e, t) {
	return Mm(e) || Nm(e, t) || Im(e, t) || Pm();
}
function Im(e, t) {
	if (e) {
		if (typeof e == "string") return jm(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? jm(e, t) : void 0;
	}
}
var Lm = Object.entries, Rm = Object.setPrototypeOf, zm = Object.isFrozen, Bm = Object.getPrototypeOf, Vm = Object.getOwnPropertyDescriptor, Hm = Object.freeze, Um = Object.seal, Wm = Object.create, Gm = typeof Reflect < "u" && Reflect, Km = Gm.apply, qm = Gm.construct;
Hm ||= function(e) {
	return e;
}, Um ||= function(e) {
	return e;
}, Km ||= function(e, t) {
	var n = [...arguments].slice(2);
	return e.apply(t, n);
}, qm ||= function(e) {
	return new e(...[...arguments].slice(1));
};
var Jm = mh(Array.prototype.forEach), Ym = mh(Array.prototype.lastIndexOf), Xm = mh(Array.prototype.pop), Zm = mh(Array.prototype.push), Qm = mh(Array.prototype.splice), $m = Array.isArray, eh = mh(String.prototype.toLowerCase), th = mh(String.prototype.toString), nh = mh(String.prototype.match), rh = mh(String.prototype.replace), ih = mh(String.prototype.indexOf), ah = mh(String.prototype.trim), oh = mh(Number.prototype.toString), sh = mh(Boolean.prototype.toString), ch = typeof BigInt > "u" ? null : mh(BigInt.prototype.toString), lh = typeof Symbol > "u" ? null : mh(Symbol.prototype.toString), uh = mh(Object.prototype.hasOwnProperty), dh = mh(Object.prototype.toString), fh = mh(RegExp.prototype.test), ph = hh(TypeError);
function mh(e) {
	return function(t) {
		t instanceof RegExp && (t.lastIndex = 0);
		var n = [...arguments].slice(1);
		return Km(e, t, n);
	};
}
function hh(e) {
	return function() {
		return qm(e, [...arguments]);
	};
}
function $(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : eh;
	if (Rm && Rm(e, null), !$m(t)) return e;
	let r = t.length;
	for (; r--;) {
		let i = t[r];
		if (typeof i == "string") {
			let e = n(i);
			e !== i && (zm(t) || (t[r] = e), i = e);
		}
		e[i] = !0;
	}
	return e;
}
function gh(e) {
	for (let t = 0; t < e.length; t++) uh(e, t) || (e[t] = null);
	return e;
}
function _h(e) {
	let t = Wm(null);
	for (let r of Lm(e)) {
		var n = Fm(r, 2);
		let i = n[0], a = n[1];
		uh(e, i) && (t[i] = $m(a) ? gh(a) : a && typeof a == "object" && a.constructor === Object ? _h(a) : a);
	}
	return t;
}
function vh(e) {
	switch (typeof e) {
		case "string": return e;
		case "number": return oh(e);
		case "boolean": return sh(e);
		case "bigint": return ch ? ch(e) : "0";
		case "symbol": return lh ? lh(e) : "Symbol()";
		case "undefined": return dh(e);
		case "function":
		case "object": {
			if (e === null) return dh(e);
			let t = e, n = yh(t, "toString");
			if (typeof n == "function") {
				let e = n(t);
				return typeof e == "string" ? e : dh(e);
			}
			return dh(e);
		}
		default: return dh(e);
	}
}
function yh(e, t) {
	for (; e !== null;) {
		let n = Vm(e, t);
		if (n) {
			if (n.get) return mh(n.get);
			if (typeof n.value == "function") return mh(n.value);
		}
		e = Bm(e);
	}
	function n() {
		return null;
	}
	return n;
}
function bh(e) {
	try {
		return fh(e, ""), !0;
	} catch {
		return !1;
	}
}
var xh = Hm(/* @__PURE__ */ "a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr".split(".")), Sh = Hm(/* @__PURE__ */ "svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern".split(".")), Ch = Hm([
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
]), wh = Hm([
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
]), Th = Hm(/* @__PURE__ */ "math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts".split(".")), Eh = Hm([
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
]), Dh = Hm(["#text"]), Oh = Hm(/* @__PURE__ */ "accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns".split(".")), kh = Hm(/* @__PURE__ */ "accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.pointer-events.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.vector-effect.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan".split(".")), Ah = Hm(/* @__PURE__ */ "accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns".split(".")), jh = Hm([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]), Mh = Um(/{{[\w\W]*|^[\w\W]*}}/g), Nh = Um(/<%[\w\W]*|^[\w\W]*%>/g), Ph = Um(/\${[\w\W]*/g), Fh = Um(/^data-[\-\w.\u00B7-\uFFFF]+$/), Ih = Um(/^aria-[\-\w]+$/), Lh = Um(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), Rh = Um(/^(?:\w+script|data):/i), zh = Um(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), Bh = Um(/^html$/i), Vh = Um(/^[a-z][.\w]*(-[.\w]+)+$/i), Hh = Um(/<[/\w!]/g), Uh = Um(/<[/\w]/g), Wh = Um(/<\/no(script|embed|frames)/i), Gh = Um(/\/>/i), Kh = {
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
}, qh = [
	"style",
	"script",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext",
	"noscript"
], Jh = Hm($({}, qh)), Yh = function() {
	let e = {};
	return Jm(qh, (t) => {
		e[t] = Um(RegExp("</" + t + "(?=[\\t\\n\\f\\r />])", "i"));
	}), Hm(e);
}(), Xh = function() {
	return typeof window > "u" ? null : window;
}, Zh = function(e, t) {
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
}, Qh = function() {
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
}, $h = function(e, t, n, r) {
	return uh(e, t) && $m(e[t]) ? $(r.base ? _h(r.base) : {}, e[t], r.transform) : n;
}, eg = function(e, t, n) {
	let r = uh(e, t) ? e[t] : void 0;
	return r && typeof r == "object" ? _h(r) : n();
};
function tg() {
	let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Xh(), t = (e) => tg(e);
	if (t.version = "3.4.15", t.removed = [], !e || !e.document || e.document.nodeType !== Kh.document || !e.Element) return t.isSupported = !1, t;
	let n = e.document, r = n, i = r.currentScript;
	e.DocumentFragment;
	let a = e.HTMLTemplateElement, o = e.Node, s = e.Element, c = e.NodeFilter;
	e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
	let l = e.DOMParser, u = e.trustedTypes, d = s.prototype, f = yh(d, "cloneNode"), p = yh(d, "remove"), m = yh(d, "removeAttributeNode"), h = yh(d, "nextSibling"), g = yh(d, "childNodes"), _ = yh(d, "parentNode"), v = yh(d, "shadowRoot"), y = yh(d, "attributes"), b = o && o.prototype ? yh(o.prototype, "nodeType") : null, x = o && o.prototype ? yh(o.prototype, "nodeName") : null, S = o && o.prototype ? yh(o.prototype, "ownerDocument") : null, C = function(e) {
		return b ? b(e) : e.nodeType;
	}, w = function(e) {
		return x ? x(e) : e.nodeName;
	};
	if (typeof a == "function") {
		let e = n.createElement("template");
		e.content && e.content.ownerDocument && (n = e.content.ownerDocument);
	}
	let T, E = "", D, O = !1, k = 0, ee = function() {
		if (k > 0) throw ph("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
	}, te = function(e) {
		ee(), k++;
		try {
			return T.createHTML(e);
		} finally {
			k--;
		}
	}, ne = function(e) {
		ee(), k++;
		try {
			return T.createScriptURL(e);
		} finally {
			k--;
		}
	}, re = function() {
		return O ||= (D = Zh(u, i), !0), D;
	}, A = n, ie = A.implementation, ae = A.createNodeIterator, j = A.createDocumentFragment, oe = A.getElementsByTagName, se = r.importNode, M = Qh();
	t.isSupported = typeof Lm == "function" && typeof _ == "function" && ie && ie.createHTMLDocument !== void 0;
	let ce = Mh, le = Nh, ue = Ph, de = Fh, fe = Ih, pe = Rh, me = zh, he = Vh, ge = Lh, N = null, _e = $({}, [
		...xh,
		...Sh,
		...Ch,
		...Th,
		...Dh
	]), P = null, ve = $({}, [
		...Oh,
		...kh,
		...Ah,
		...jh
	]), ye = Object.seal(Wm(null, {
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
	})), F = null, be = null, xe = Object.seal(Wm(null, {
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
	})), Se = !0, Ce = !0, we = !1, I = !0, Te = !1, Ee = !0, De = !1, Oe = !1, ke = null, Ae = null, je = !1, Me = !1, Ne = !1, Pe = !1, Fe = !0, Ie = !1, Le = "user-content-", Re = !0, ze = !1, Be = {}, Ve = null, He = $({}, /* @__PURE__ */ "annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp".split(".")), Ue = null, We = $({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]), Ge = null, Ke = $({}, [
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
	]), qe = "http://www.w3.org/1998/Math/MathML", Je = "http://www.w3.org/2000/svg", Ye = "http://www.w3.org/1999/xhtml", Xe = Ye, Ze = !1, Qe = null, $e = $({}, [
		qe,
		Je,
		Ye
	], th), et = Hm([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]), tt = $({}, et), nt = Hm(["annotation-xml"]), rt = $({}, nt), it = $({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]), at = null, ot = ["application/xhtml+xml", "text/html"], st = null, ct = null, lt = n.createElement("form"), ut = function(e) {
		return e instanceof RegExp || e instanceof Function;
	}, dt = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (ct && ct === e) return;
		(!e || typeof e != "object") && (e = {}), e = _h(e), at = ot.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? "text/html" : e.PARSER_MEDIA_TYPE, st = at === "application/xhtml+xml" ? th : eh, N = $h(e, "ALLOWED_TAGS", _e, { transform: st }), P = $h(e, "ALLOWED_ATTR", ve, { transform: st }), Qe = $h(e, "ALLOWED_NAMESPACES", $e, { transform: th }), Ge = $h(e, "ADD_URI_SAFE_ATTR", Ke, {
			transform: st,
			base: Ke
		}), Ue = $h(e, "ADD_DATA_URI_TAGS", We, {
			transform: st,
			base: We
		}), Ve = $h(e, "FORBID_CONTENTS", He, { transform: st }), F = $h(e, "FORBID_TAGS", _h({}), { transform: st }), be = $h(e, "FORBID_ATTR", _h({}), { transform: st }), Be = uh(e, "USE_PROFILES") ? e.USE_PROFILES && typeof e.USE_PROFILES == "object" ? _h(e.USE_PROFILES) : e.USE_PROFILES : !1, Se = e.ALLOW_ARIA_ATTR !== !1, Ce = e.ALLOW_DATA_ATTR !== !1, we = e.ALLOW_UNKNOWN_PROTOCOLS || !1, I = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Te = e.SAFE_FOR_TEMPLATES || !1, Ee = e.SAFE_FOR_XML !== !1, De = e.WHOLE_DOCUMENT || !1, Me = e.RETURN_DOM || !1, Ne = e.RETURN_DOM_FRAGMENT || !1, Pe = e.RETURN_TRUSTED_TYPE || !1, je = e.FORCE_BODY || !1, Fe = e.SANITIZE_DOM !== !1, Ie = e.SANITIZE_NAMED_PROPS || !1, Re = e.KEEP_CONTENT !== !1, ze = e.IN_PLACE || !1, ge = bh(e.ALLOWED_URI_REGEXP) ? e.ALLOWED_URI_REGEXP : Lh, Xe = typeof e.NAMESPACE == "string" ? e.NAMESPACE : Ye, tt = eg(e, "MATHML_TEXT_INTEGRATION_POINTS", () => $({}, et)), rt = eg(e, "HTML_INTEGRATION_POINTS", () => $({}, nt));
		let t = eg(e, "CUSTOM_ELEMENT_HANDLING", () => Wm(null));
		if (ye = Wm(null), uh(t, "tagNameCheck") && ut(t.tagNameCheck) && (ye.tagNameCheck = t.tagNameCheck), uh(t, "attributeNameCheck") && ut(t.attributeNameCheck) && (ye.attributeNameCheck = t.attributeNameCheck), uh(t, "allowCustomizedBuiltInElements") && typeof t.allowCustomizedBuiltInElements == "boolean" && (ye.allowCustomizedBuiltInElements = t.allowCustomizedBuiltInElements), Um(ye), Te && (Ce = !1), Ne && (Me = !0), Be && (N = $({}, Dh), P = Wm(null), Be.html === !0 && ($(N, xh), $(P, Oh)), Be.svg === !0 && ($(N, Sh), $(P, kh), $(P, jh)), Be.svgFilters === !0 && ($(N, Ch), $(P, kh), $(P, jh)), Be.mathMl === !0 && ($(N, Th), $(P, Ah), $(P, jh))), xe.tagCheck = null, xe.attributeCheck = null, uh(e, "ADD_TAGS") && (typeof e.ADD_TAGS == "function" ? xe.tagCheck = e.ADD_TAGS : $m(e.ADD_TAGS) && (N === _e && (N = _h(N)), $(N, e.ADD_TAGS, st))), uh(e, "ADD_ATTR") && (typeof e.ADD_ATTR == "function" ? xe.attributeCheck = e.ADD_ATTR : $m(e.ADD_ATTR) && (P === ve && (P = _h(P)), $(P, e.ADD_ATTR, st))), uh(e, "ADD_FORBID_CONTENTS") && $m(e.ADD_FORBID_CONTENTS) && (Ve === He && (Ve = _h(Ve)), $(Ve, e.ADD_FORBID_CONTENTS, st)), Re && (N["#text"] = !0), De && $(N, [
			"html",
			"head",
			"body"
		]), N.table && ($(N, ["tbody"]), delete F.tbody), e.TRUSTED_TYPES_POLICY) {
			if (typeof e.TRUSTED_TYPES_POLICY.createHTML != "function") throw ph("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw ph("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			let t = T;
			T = e.TRUSTED_TYPES_POLICY;
			try {
				E = te("");
			} catch (e) {
				throw T = t, e;
			}
		} else e.TRUSTED_TYPES_POLICY === null ? (T = void 0, E = "") : (T === void 0 && (T = re()), T && typeof E == "string" && (E = te("")));
		Hm && Hm(e), ct = e;
	}, ft = $({}, [
		...Sh,
		...Ch,
		...wh
	]), pt = $({}, [...Th, ...Eh]), mt = function(e, t, n) {
		return t.namespaceURI === Ye ? e === "svg" : t.namespaceURI === qe ? e === "svg" && (n === "annotation-xml" || tt[n]) : !!ft[e];
	}, ht = function(e, t, n) {
		return t.namespaceURI === Ye ? e === "math" : t.namespaceURI === Je ? e === "math" && rt[n] : !!pt[e];
	}, gt = function(e, t, n) {
		return t.namespaceURI === Je && !rt[n] || t.namespaceURI === qe && !tt[n] ? !1 : !pt[e] && (it[e] || !ft[e]);
	}, _t = function(e) {
		let t = _(e);
		(!t || !t.tagName) && (t = {
			namespaceURI: Xe,
			tagName: "template"
		});
		let n = eh(e.tagName), r = eh(t.tagName);
		return Qe[e.namespaceURI] ? e.namespaceURI === Je ? mt(n, t, r) : e.namespaceURI === qe ? ht(n, t, r) : e.namespaceURI === Ye ? gt(n, t, r) : !!(at === "application/xhtml+xml" && Qe[e.namespaceURI]) : !1;
	}, vt = function(e) {
		Zm(t.removed, { element: e });
		try {
			_(e).removeChild(e);
		} catch {
			if (p(e), !_(e)) throw ph("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	}, yt = function(e, t, n) {
		try {
			m(e, t);
		} catch {
			try {
				e.removeAttribute(n);
			} catch {}
		}
	}, bt = function(e) {
		Ct(e);
		let t = g(e);
		if (t) {
			let e = [];
			Jm(t, (t) => {
				Zm(e, t);
			}), Jm(e, (e) => {
				try {
					p(e);
				} catch {}
			});
		}
		let n = y(e);
		if (n) for (let t = n.length - 1; t >= 0; --t) {
			let r = n[t], i = r && r.name;
			typeof i == "string" && yt(e, r, i);
		}
	}, xt = function(e, n, r) {
		if (!r) try {
			r = n.getAttributeNode(e);
		} catch {
			r = null;
		}
		Zm(t.removed, {
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
			if (Me || Ne) try {
				vt(n);
			} catch {}
			else try {
				n.setAttribute(e, "");
			} catch {}
		}
	}, St = function(e) {
		let t = y(e);
		if (t) for (let n = t.length - 1; n >= 0; --n) {
			let r = t[n], i = r && r.name;
			typeof i != "string" || P[st(i)] || yt(e, r, i);
		}
	}, Ct = function(e) {
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop();
			C(e) === Kh.element && St(e);
			let n = g(e);
			if (n) for (let e = n.length - 1; e >= 0; --e) t.push(n[e]);
		}
	}, wt = function(e, t) {
		return Ee ? e === "patchsrc" || e === "for" && t !== "label" && t !== "output" : !1;
	}, Tt = function(e) {
		if (!Ee) return;
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop(), n = C(e);
			if (n === Kh.processingInstruction || n === Kh.comment && fh(Uh, e.data)) {
				try {
					p(e);
				} catch {}
				continue;
			}
			if (n === Kh.element) {
				let t = e, n = st(w(e));
				try {
					t.hasAttribute && t.hasAttribute("patchsrc") && t.removeAttribute("patchsrc"), t.hasAttribute && t.hasAttribute("for") && wt("for", n) && t.removeAttribute("for");
				} catch {}
			}
			let r = g(e);
			if (r) for (let e = r.length - 1; e >= 0; --e) t.push(r[e]);
		}
	}, Et = function(e) {
		let t = null, r = null;
		if (je) e = "<remove></remove>" + e;
		else {
			let t = nh(e, /^[\r\n\t ]+/);
			r = t && t[0];
		}
		at === "application/xhtml+xml" && Xe === Ye && (e = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + e + "</body></html>");
		let i = T ? te(e) : e;
		if (Xe === Ye) try {
			t = new l().parseFromString(i, at);
		} catch {}
		if (!t || !t.documentElement) {
			t = ie.createDocument(Xe, "template", null);
			try {
				t.documentElement.innerHTML = Ze ? E : i;
			} catch {}
		}
		let a = t.body || t.documentElement;
		return e && r && a.insertBefore(n.createTextNode(r), a.childNodes[0] || null), Xe === Ye ? oe.call(t, De ? "html" : "body")[0] : De ? t.documentElement : a;
	}, Dt = function(e) {
		let t = S ? S(e) : e.ownerDocument;
		return ae.call(t || e, e, c.SHOW_ELEMENT | c.SHOW_COMMENT | c.SHOW_TEXT | c.SHOW_PROCESSING_INSTRUCTION | c.SHOW_CDATA_SECTION, null);
	}, Ot = function(e) {
		return e = rh(e, ce, " "), e = rh(e, le, " "), e = rh(e, ue, " "), e;
	}, kt = function(e) {
		e.normalize();
		let t = S ? S(e) : e.ownerDocument, n = ae.call(t || e, e, c.SHOW_TEXT | c.SHOW_COMMENT | c.SHOW_CDATA_SECTION | c.SHOW_PROCESSING_INSTRUCTION, null), r = n.nextNode();
		for (; r;) r.data = Ot(r.data), r = n.nextNode();
		let i = e.querySelectorAll?.call(e, "template");
		i && Jm(i, (e) => {
			jt(e.content) && kt(e.content);
		});
	}, At = function(e) {
		let t = x ? x(e) : null;
		return typeof t != "string" || st(t) !== "form" ? !1 : typeof e.nodeName != "string" || typeof e.textContent != "string" || typeof e.removeChild != "function" || e.attributes !== y(e) || typeof e.removeAttribute != "function" || typeof e.removeAttributeNode != "function" || typeof e.getAttributeNode != "function" || typeof e.setAttribute != "function" || typeof e.namespaceURI != "string" || typeof e.insertBefore != "function" || typeof e.hasChildNodes != "function" || e.nodeType !== b(e) || e.childNodes !== g(e);
	}, jt = function(e) {
		if (!b || typeof e != "object" || !e) return !1;
		try {
			return b(e) === Kh.documentFragment;
		} catch {
			return !1;
		}
	}, Mt = function(e) {
		if (!b || typeof e != "object" || !e) return !1;
		try {
			return typeof b(e) == "number";
		} catch {
			return !1;
		}
	};
	function Nt(e, n, r) {
		e.length !== 0 && Jm(e, (e) => {
			e.call(t, n, r, ct);
		});
	}
	let Pt = function(e, t) {
		return !!(Ee && e.hasChildNodes() && !Mt(e.firstElementChild) && fh(Hh, e.textContent) && fh(Hh, e.innerHTML) || Ee && e.namespaceURI === Ye && Jh[t] && (Mt(e.firstElementChild) || typeof e.textContent == "string" && fh(Yh[t], e.textContent)) || e.nodeType === Kh.processingInstruction || Ee && e.nodeType === Kh.comment && fh(Uh, e.data));
	}, Ft = function(e, t) {
		return e instanceof RegExp ? fh(e, t) : e instanceof Function && !!e(t, ...[...arguments].slice(2));
	}, It = function(e, t, n) {
		if (!F[t] && Vt(t) && Ft(ye.tagNameCheck, t)) return !1;
		if (Re && !Ve[t]) {
			let t = _(e), r = g(e);
			if (r && t) {
				let i = r.length;
				for (let a = i - 1; a >= 0; --a) {
					let i = e === n ? f(r[a], !0) : r[a];
					t.insertBefore(i, h(e));
				}
			}
		}
		return vt(e), !0;
	}, Lt = function(e, t, n, r) {
		return e.length === 0 ? t : t === n || t === r ? _h(t) : t;
	}, Rt = function(e, t) {
		return e === t || _(e) !== null ? !1 : (ze && Ct(e), !0);
	}, zt = function(e, n) {
		if (Nt(M.beforeSanitizeElements, e, null), Rt(e, n)) return !0;
		if (At(e)) return vt(e), !0;
		let r = st(w(e));
		if (N = Lt(M.uponSanitizeElement, N, _e, ke), Nt(M.uponSanitizeElement, e, {
			tagName: r,
			allowedTags: N
		}), Rt(e, n)) return !0;
		if (Pt(e, r)) return vt(e), !0;
		if (F[r] || !(xe.tagCheck instanceof Function && xe.tagCheck(r)) && !N[r]) {
			let t = It(e, r, n);
			return t === !1 && Nt(M.afterSanitizeElements, e, null), t;
		}
		if (C(e) === Kh.element && !_t(e) || (r === "noscript" || r === "noembed" || r === "noframes") && fh(Wh, e.innerHTML)) return vt(e), !0;
		if (Te && e.nodeType === Kh.text) {
			let n = Ot(e.textContent);
			e.textContent !== n && (Zm(t.removed, { element: e.cloneNode() }), e.textContent = n);
		}
		return Nt(M.afterSanitizeElements, e, null), !1;
	}, Bt = function(e, t, r) {
		if (be[t] || wt(t, e) || Fe && (t === "id" || t === "name") && (r in n || r in lt)) return !1;
		let i = P[t] || xe.attributeCheck instanceof Function && xe.attributeCheck(t, e);
		return Ce && fh(de, t) || Se && fh(fe, t) ? !0 : i ? Ge[t] || fh(ge, rh(r, me, "")) || (t === "src" || t === "xlink:href" || t === "href") && e !== "script" && ih(r, "data:") === 0 && Ue[e] || we && !fh(pe, rh(r, me, "")) ? !0 : !r : Vt(e) && Ft(ye.tagNameCheck, e) && Ft(ye.attributeNameCheck, t, e) || t === "is" && ye.allowCustomizedBuiltInElements && Ft(ye.tagNameCheck, r);
	}, L = $({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]), Vt = function(e) {
		return !L[eh(e)] && fh(he, e);
	}, Ht = function(e, t, n, r) {
		if (T && typeof u == "object" && typeof u.getAttributeType == "function" && !n) switch (u.getAttributeType(e, t)) {
			case "TrustedHTML": return te(r);
			case "TrustedScriptURL": return ne(r);
		}
		return r;
	}, Ut = function(e, t, n, r) {
		try {
			return n ? e.setAttributeNS(n, t, r) : e.setAttribute(t, r), !At(e) || (vt(e), !1);
		} catch {
			return xt(t, e), !1;
		}
	}, Wt = function(e) {
		Nt(M.beforeSanitizeAttributes, e, null);
		let n = e.attributes;
		if (!n || At(e)) return;
		P = Lt(M.uponSanitizeAttribute, P, ve, Ae);
		let r = {
			attrName: "",
			attrValue: "",
			keepAttr: !0,
			allowedAttributes: P,
			forceKeepAttr: void 0
		}, i = n.length, a = st(e.nodeName);
		for (; i--;) {
			let o = n[i], s = o.name, c = o.namespaceURI, l = o.value, u = st(s), d = l, f = s === "value" ? d : ah(d), p = !1;
			if (r.attrName = u, r.attrValue = f, r.keepAttr = !0, r.forceKeepAttr = void 0, Nt(M.uponSanitizeAttribute, e, r), f = r.attrValue, Ie && (u === "id" || u === "name") && ih(f, Le) !== 0 && (xt(s, e, o), f = Le + f, p = !0), Ee && fh(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, f)) {
				xt(s, e, o);
				continue;
			}
			if (u === "attributename" && nh(f, "href")) {
				xt(s, e, o);
				continue;
			}
			if (!r.forceKeepAttr) {
				if (!r.keepAttr) {
					xt(s, e, o);
					continue;
				}
				if (!I && fh(Gh, f)) {
					xt(s, e, o);
					continue;
				}
				if (Te && (f = Ot(f)), !Bt(a, u, f)) {
					xt(s, e, o);
					continue;
				}
				f = Ht(a, u, c, f), f !== d && Ut(e, s, c, f) && p && Xm(t.removed);
			}
		}
		Nt(M.afterSanitizeAttributes, e, null);
	}, R = function(e) {
		let t = null, n = Dt(e);
		for (Nt(M.beforeSanitizeShadowDOM, e, null); t = n.nextNode();) if (Nt(M.uponSanitizeShadowNode, t, null), zt(t, e), Wt(t), jt(t.content) && R(t.content), C(t) === Kh.element) {
			let e = v(t);
			jt(e) && (Gt(e), R(e));
		}
		Nt(M.afterSanitizeShadowDOM, e, null);
	}, Gt = function(e) {
		let t = [{
			node: e,
			shadow: null
		}];
		for (; t.length > 0;) {
			let e = t.pop();
			if (e.shadow) {
				R(e.shadow);
				continue;
			}
			let n = e.node, r = C(n) === Kh.element, i = g(n);
			if (i) for (let e = i.length - 1; e >= 0; --e) t.push({
				node: i[e],
				shadow: null
			});
			if (r) {
				let e = x ? x(n) : null;
				if (typeof e == "string" && st(e) === "template") {
					let e = n.content;
					jt(e) && t.push({
						node: e,
						shadow: null
					});
				}
			}
			if (r) {
				let e = v(n);
				jt(e) && t.push({
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
		if (Ze = !e, Ze && (e = "<!-->"), typeof e != "string" && !Mt(e) && (e = vh(e), typeof e != "string")) throw ph("dirty is not a string, aborting");
		if (!t.isSupported) return e;
		Oe ? (N = ke, P = Ae) : dt(n), (M.uponSanitizeElement.length > 0 || M.uponSanitizeAttribute.length > 0) && (N = _h(N)), M.uponSanitizeAttribute.length > 0 && (P = _h(P)), t.removed = [];
		let c = ze && typeof e != "string" && Mt(e);
		if (c) {
			Tt(e);
			let t = w(e);
			if (typeof t == "string") {
				let n = st(t);
				if (!N[n] || F[n]) throw bt(e), ph("root node is forbidden and cannot be sanitized in-place");
			}
			if (At(e)) throw bt(e), ph("root node is clobbered and cannot be sanitized in-place");
			try {
				Gt(e);
			} catch (t) {
				throw bt(e), t;
			}
		} else if (Mt(e)) i = Et("<!---->"), a = i.ownerDocument.importNode(e, !0), a.nodeType === Kh.element && a.nodeName === "BODY" || a.nodeName === "HTML" ? i = a : i.appendChild(a), Gt(i);
		else {
			if (!Me && !Te && !De && e.indexOf("<") === -1) return T && Pe ? te(e) : e;
			if (i = Et(e), !i) return Me ? null : Pe ? E : "";
		}
		i && je && vt(i.firstChild);
		let l = c ? e : i;
		try {
			let e = Dt(l);
			for (; o = e.nextNode();) zt(o, l), Wt(o), jt(o.content) && R(o.content);
		} catch (n) {
			throw c && (bt(e), Jm(t.removed, (e) => {
				e.element && Ct(e.element);
			})), n;
		}
		if (c) return Jm(t.removed, (e) => {
			e.element && Ct(e.element);
		}), Te && kt(e), e;
		if (Me) {
			if (Te && kt(i), Ne) for (s = j.call(i.ownerDocument); i.firstChild;) s.appendChild(i.firstChild);
			else s = i;
			return (P.shadowroot || P.shadowrootmode) && (s = se.call(r, s, !0)), s;
		}
		let u = De ? i.outerHTML : i.innerHTML;
		return De && N["!doctype"] && i.ownerDocument && i.ownerDocument.doctype && i.ownerDocument.doctype.name && fh(Bh, i.ownerDocument.doctype.name) && (u = "<!DOCTYPE " + i.ownerDocument.doctype.name + ">\n" + u), Te && (u = Ot(u)), T && Pe ? te(u) : u;
	}, t.setConfig = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		dt(e), Oe = !0, ke = N, Ae = P;
	}, t.clearConfig = function() {
		ct = null, Oe = !1, ke = null, Ae = null, T = D, E = "";
	}, t.isValidAttribute = function(e, t, n) {
		ct || dt({});
		let r = st(e), i = st(t);
		return Bt(r, i, n);
	}, t.addHook = function(e, t) {
		typeof t == "function" && uh(M, e) && Zm(M[e], t);
	}, t.removeHook = function(e, t) {
		if (uh(M, e)) {
			if (t !== void 0) {
				let n = Ym(M[e], t);
				return n === -1 ? void 0 : Qm(M[e], n, 1)[0];
			}
			return Xm(M[e]);
		}
	}, t.removeHooks = function(e) {
		uh(M, e) && (M[e] = []);
	}, t.removeAllHooks = function() {
		M = Qh();
	}, t;
}
var ng = tg(), rg = (e) => ng.sanitize(e, {
	USE_PROFILES: {
		svg: !0,
		svgFilters: !0
	},
	ADD_TAGS: ["style"]
}), ig = /* @__PURE__ */ new Map();
function ag(e) {
	let t = ig.get(e.url);
	return t || (t = fetch(e.url, { credentials: Ul() }).then((t) => {
		if (!t.ok) throw Error(`Symbol ${e.code}: HTTP ${t.status}`);
		return t.text();
	}).then((e) => cl(e, { purify: rg })), t.catch(() => ig.delete(e.url)), ig.set(e.url, t)), t;
}
function og(e, t) {
	let n = t.trim().toLowerCase();
	return !n || e.name.toLowerCase().includes(n) || e.code.toLowerCase().includes(n);
}
//#endregion
//#region editor/src/model/board.ts
var sg = [
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
], cg = (e) => e.root.layout.type === "board" ? e.root.layout : null;
function lg(e) {
	let t = cg(e);
	if (!t) return [];
	let n = wf(t), r = Cf(t), i = 0;
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
function ug(e, t) {
	for (let n of lg(e)) if (t >= n.start && t < n.start + n.cells) return n.index;
	return -1;
}
var dg = "Choose a message";
function fg(e) {
	let t = Uf({
		symbols: [],
		colour: kf,
		panels: [{
			colour: kf,
			lines: [{
				text: dg,
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
var pg = (e) => e.root.sections.filter((e) => e.placeholder).length, mg = (e, t) => e.root.sections.splice(t.start, t.cells);
function hg(e, t) {
	t.rows = t.rows.slice(0, 8).map((e) => ({
		...e,
		cells: Math.max(1, Math.min(2, Math.floor(e.cells)))
	})), Su(e);
}
function gg(e, t, n, r) {
	let i = Uf(e.section, t, n);
	return [i, ...Array.from({ length: Math.max(0, r - 1) }, () => cu(i))];
}
function _g(e, t, n, r, i) {
	let a = cg(e);
	if (!a || a.rows.length >= 8) return null;
	let o = lg(e), s = Math.max(0, Math.min(o.length, t + 1)), c = n?.cells ?? 2, l = n ? gg(n, r, i, c) : Array.from({ length: c }, () => fg(i)), u = s < o.length ? o[s].start : e.root.sections.length;
	return e.root.sections.splice(u, 0, ...l), a.rows.splice(s, 0, {
		cells: c,
		...n?.weight === void 0 ? {} : { weight: n.weight }
	}), hg(e, a), s;
}
function vg(e, t) {
	let n = cg(e), r = lg(e)[t];
	!n || !r || n.rows.length <= 1 || (mg(e, r), n.rows.splice(t, 1), hg(e, n));
}
function yg(e, t) {
	let n = cg(e), r = lg(e)[t];
	if (!n || !r || n.rows.length >= 8) return null;
	let i = e.root.sections.slice(r.start, r.start + r.cells).map((e) => cu(e));
	return e.root.sections.splice(r.start + r.cells, 0, ...i), n.rows.splice(t + 1, 0, { ...n.rows[t] }), hg(e, n), t + 1;
}
function bg(e, t, n) {
	let r = cg(e), i = lg(e);
	if (!r || t === n || !i[t] || n < 0 || n >= i.length) return;
	let a = mg(e, i[t]), [o] = r.rows.splice(t, 1);
	r.rows.splice(n, 0, o);
	let s = lg(e)[n].start;
	e.root.sections.splice(s, 0, ...a), hg(e, r);
}
function xg(e, t, n) {
	let r = cg(e), i = lg(e)[t];
	if (!r || !i) return;
	let a = Math.max(1, Math.min(2, Math.floor(n)));
	if (a !== i.cells) {
		if (a > i.cells) {
			let t = e.root.sections[i.start], n = Array.from({ length: a - i.cells }, () => cu(t));
			e.root.sections.splice(i.start + i.cells, 0, ...n);
		} else e.root.sections.splice(i.start + a, i.cells - a);
		r.rows[t] = {
			...r.rows[t],
			cells: a
		}, hg(e, r);
	}
}
function Sg(e, t, n) {
	let r = cg(e);
	if (!r || !r.rows[t]) return;
	let i = Math.max(.4, Math.min(3, n));
	r.rows[t] = {
		...r.rows[t],
		...i === 1 ? {} : { weight: i }
	}, i === 1 && delete r.rows[t].weight, Su(e);
}
function Cg(e, t, n) {
	let r = cg(e);
	if (!r) return;
	let i = Math.max(1, Math.min(8, Math.round(t)));
	for (; r.rows.length > i;) vg(e, r.rows.length - 1);
	for (; r.rows.length < i;) {
		let t = r.rows[r.rows.length - 1]?.cells ?? 1;
		e.root.sections.push(...Array.from({ length: t }, () => fg(n))), r.rows.push({ cells: t });
	}
	hg(e, r);
}
function wg(e, t, n) {
	let r = cg(e);
	if (!r) return;
	let i = Math.max(1, Math.min(2, Math.round(t)));
	for (let t = r.rows.length - 1; t >= 1; t--) {
		let a = lg(e)[t];
		a.cells !== i && (i > a.cells ? e.root.sections.splice(a.start + a.cells, 0, ...Array.from({ length: i - a.cells }, () => fg(n))) : e.root.sections.splice(a.start + i, a.cells - i), r.rows[t] = {
			...r.rows[t],
			cells: i
		});
	}
	hg(e, r);
}
function Tg(e) {
	let t = lg(e).slice(1);
	return t.length && t.every((e) => e.cells === 2) ? 2 : 1;
}
function Eg(e, t, n, r, i) {
	cg(e) && e.root.sections[t] && (e.root.sections[t] = gg(n, r, i, 1)[0], Su(e));
}
function Dg(e, t, n, r = 5, i = 1) {
	let a = Kf("header-site-safety"), o = qc({
		symbols: [],
		title: "",
		size: {
			width: e.width,
			height: e.height,
			catalogue_size_id: e.size_id
		},
		ruleset: n
	}), s = a ? gg(a, t, n, 1) : [fg(n)], c = [{
		cells: 1,
		...a?.weight === void 0 ? {} : { weight: a.weight }
	}];
	return o.root.sections = s, o.root.layout = {
		type: "board",
		rows: c,
		gutter: "auto",
		sync_rows: !0,
		align_symbols: !1
	}, e.size_id || delete o.catalogue_size_id, Cg(o, r, n), i > 1 && wg(o, i, n), o;
}
function Og(e, t, n) {
	let r = e.root.sections;
	t !== n && r[t] && r[n] && ([r[t], r[n]] = [r[n], r[t]]);
}
function kg(e, t, n, r) {
	let i = ((Jf.find((e) => e.id === t) ?? null)?.rows ?? ["header-site-safety", "ppe-helmet"]).slice(0, 8), a = [], o = [];
	for (let e of i) {
		let t = (Array.isArray(e) ? e : [e]).map((e) => Kf(e)).filter((e) => !!e);
		if (!t.length) continue;
		for (let e of t) a.push(...gg(e, n, r, 1));
		let i = t[0].weight;
		o.push({
			cells: t.length,
			...i === void 0 ? {} : { weight: i }
		});
	}
	let s = qc({
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
	}, e.size_id || delete s.catalogue_size_id, Su(s), s;
}
//#endregion
//#region editor/src/model/variants.ts
var Ag = {
	mm: 1,
	mmm: 1,
	cm: 10,
	m: 1e3,
	in: 25.4,
	inch: 25.4,
	ft: 304.8,
	feet: 304.8
}, jg = /^#[0-9a-f]{6}$/i, Mg = (e) => {
	let t = (e ?? "").trim();
	return jg.test(t) ? t : null;
}, Ng = (e) => Mg(e.face_hex), Pg = (e) => Mg(e.unprinted_hex) ?? Ng(e);
function Fg(e) {
	let t = Ag[(e.size_units ?? "mm").toLowerCase()] ?? 0, n = Number(e.size_width) * t, r = Number(e.size_height) * t;
	return n > 0 && r > 0 ? {
		width: n,
		height: r
	} : null;
}
function Ig(e) {
	if (!e) return [];
	let t = [];
	for (let [n, r] of Object.entries(e)) {
		let e = Object.entries(r ?? {});
		if (!e.length) continue;
		let i = e[0][1], a = Fg(i);
		a && t.push({
			size_id: Number(i.size_id ?? n),
			name: i.size_name?.trim() || `${a.width}mm x ${a.height}mm`,
			width: a.width,
			height: a.height,
			symbol_position: Number(i.symbol_default_location) === 1 ? "left" : "above",
			materials: e.map(([e, t]) => ({
				material_id: Number(t.material_id ?? e),
				name: t.material_name?.trim() || `Material ${t.material_id ?? e}`,
				face_hex: Ng(t),
				unprinted_hex: Pg(t),
				row: t
			}))
		});
	}
	return t;
}
var Lg = (e, t) => e?.materials.find((e) => e.material_id === t) ?? e?.materials[0], Rg = [
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
], zg = (e) => Rg.find((t) => t.key === e) ?? Rg[0], Bg = [
	[600, 450],
	[1050, 750],
	[600, 600],
	[750, 750]
];
function Vg(e) {
	let t = Bg.map(([t, n]) => e.find((e) => e.width === t && e.height === n)).filter((e) => e !== void 0).map((e) => ({
		...e,
		symbol_position: "left"
	}));
	return t.length ? t : e.slice(0, 4);
}
var Hg = .04, Ug = 1.5, Wg = .84, Gg = .42, Kg = (e, t) => Math.max(6, Math.round(Math.min(e, t) * Hg)), qg = (e, t) => Math.round(Kg(e, t) * Ug), Jg = (e) => {
	let t = e.root.substrate ?? e.root.background, n = t && "hex" in t ? t.hex : "";
	return Rg.find((e) => e.face.hex === n) ?? Rg[0];
};
function Yg(e, t, n) {
	let { root: r } = e;
	t.material ? (r.substrate = { ...t.face }, delete r.background) : (delete r.substrate, r.background = { ...t.face });
	let i = Kg(r.width, r.height);
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
		for (let n of e.symbol_frame?.symbols ?? []) Xg(n, t);
	}
}
var Xg = (e, t) => {
	e.source = Jd(e.source, t.ink.hex);
};
function Zg(e, t, n) {
	e.root.width = t.width, e.root.height = t.height, t.size_id > 0 ? e.catalogue_size_id = t.size_id : delete e.catalogue_size_id, Yg(e, Jg(e), n), Qg(e, n);
}
function Qg(e, t) {
	let n = qg(e.root.width, e.root.height);
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
function $g(e) {
	let t = lu(e, "title");
	return t.size.mode === "auto" && (t.size.scale = Wg), t;
}
function e_(e, t, n, r) {
	let i = qc({
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
	a.symbol_frame = null, a.orientation = "horizontal", a.symbol_share = Gg;
	let o = a.text_frame.panels[0];
	return o.blocks = [$g(n)], Yg(i, t, r), Qg(i, r), i;
}
//#endregion
//#region editor/src/model/numerals.ts
var t_ = 718, n_ = {
	1: [556, "M238 489V0H378V709H285C263 625 190 582 68 582V489Z"],
	2: [556, "M512 125H211C230 163 252 184 356 259C479 349 515 402 515 499C515 636 420 724 272 724C125 724 39 637 39 487V462H174V485C174 564 211 610 275 610C337 610 375 567 375 496C375 417 351 388 193 276C73 194 36 132 30 0H512Z"],
	3: [556, "M217 317C271 317 274 317 299 310C346 297 376 256 376 204C376 141 332 97 271 97C205 97 169 135 165 208H29C30 66 122 -23 268 -23C419 -23 516 66 516 204C516 287 480 341 400 380C465 421 493 466 493 531C493 649 405 724 268 724C165 724 86 679 55 602C42 568 38 545 38 486H168C169 524 172 543 179 561C192 592 224 611 265 611C321 611 353 577 353 518C353 446 312 411 229 411H217Z"],
	4: [556, "M522 273H448V709H283L24 275V157H308V0H448V157H522ZM308 273H123L308 576Z"],
	5: [556, "M489 709H110L47 314H173C188 349 220 368 263 368C334 368 377 317 377 231C377 148 334 97 263 97C202 97 168 128 165 185H27C29 61 123 -23 261 -23C413 -23 517 81 517 234C517 380 427 479 296 479C249 479 214 467 173 436L196 584H489Z"],
	6: [556, "M507 548C500 594 491 617 473 643C436 694 371 724 294 724C206 724 134 685 91 614C49 545 32 466 32 337C32 215 47 139 83 82C124 16 198 -23 282 -23C423 -23 519 82 519 237C519 373 435 467 313 467C255 467 216 450 172 404L173 419C175 485 178 506 188 533C207 585 241 611 290 611C335 611 359 593 377 548ZM278 356C344 356 386 306 386 227C386 152 340 97 278 97C214 97 170 149 170 225C170 302 214 356 278 356Z"],
	7: [556, "M528 709H29V584H382C339 538 254 409 226 347C177 244 152 151 133 0H274C287 224 360 396 528 599Z"],
	8: [556, "M409 386C433 399 444 406 455 416C484 443 501 486 501 532C501 643 405 724 274 724C142 724 46 643 46 531C46 463 74 420 138 386C56 341 22 288 22 204C22 70 125 -23 274 -23C422 -23 525 70 525 204C525 288 491 341 409 386ZM275 611C337 611 380 573 380 518C380 464 336 425 275 425C212 425 169 463 169 519C169 573 212 611 275 611ZM273 330C342 330 385 284 385 210C385 142 341 97 273 97C205 97 162 142 162 212C162 284 205 330 273 330Z"],
	9: [556, "M38 165C41 56 133 -24 255 -24C346 -24 415 14 457 86C494 149 516 256 516 370C516 474 500 554 467 608C422 684 352 724 267 724C125 724 28 622 28 474C28 328 114 228 240 228C276 228 310 238 332 254C345 263 353 272 376 298C376 161 338 96 259 96C209 96 176 123 173 165ZM263 610C331 610 373 558 373 474C373 396 330 344 265 344C201 344 161 394 161 476C161 558 200 610 263 610Z"]
}, r_ = /* @__PURE__ */ new Map();
function i_(e) {
	let t = n_[e];
	if (!t) return null;
	let n = r_.get(e);
	if (!n) {
		let [r, i] = t;
		n = cl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r} ${t_}" width="${r}" height="${t_}"><g transform="translate(0 ${t_}) scale(1 -1)"><path d="${i}" fill="#FFFFFF"/></g></svg>`), r_.set(e, n);
	}
	return n;
}
var a_ = 0;
function o_(e) {
	let t = i_(e);
	return t ? {
		id: `step-${e}-${++a_}`,
		role: "symbol",
		symbol_code: `STEP${e}`,
		category: "plain",
		source: t
	} : null;
}
//#endregion
//#region editor/src/model/fireAction.ts
var s_ = {
	hex: "#FFFFFF",
	cmyk: [
		0,
		0,
		0,
		0
	]
}, c_ = {
	hex: "#000000",
	cmyk: [
		0,
		0,
		0,
		100
	]
}, l_ = .13, u_ = .2, d_ = .83, f_ = .35;
function p_(e) {
	let t = 0;
	for (let n of e.root.sections) {
		let e = n.text_frame.panels[0];
		if (!e) continue;
		if (n.step !== !0) {
			delete e.lead;
			continue;
		}
		t += 1;
		let r = o_(String(t));
		if (!r) {
			delete e.lead;
			continue;
		}
		e.lead = {
			symbol: r,
			share: l_
		};
	}
}
function m_(e) {
	let t = 0;
	return e.root.sections.map((e) => e.step === !0 ? ++t : null);
}
function h_(e, t) {
	let n = e.root.sections[t];
	n && (n.step = n.step !== !0, p_(e));
}
function g_(e, t, n) {
	let [r] = gg(e, t, n, 1), i = r;
	if (i.step = e.fireAction?.step ?? !1, !__(e)) return i.text_frame.panels = [], i.symbol_share = 1, i.orientation = "vertical", i.symbol_frame && delete i.symbol_frame.tile, {
		section: i,
		spec: {
			cells: 1,
			weight: v_(e)
		}
	};
	if (i.symbol_frame && (i.symbol_frame.tile = { inset: 0 }), i.symbol_share = u_, i.orientation = "horizontal", e.fireAction?.writeOn) {
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
			fill: s_,
			colour: c_,
			stretch: !0
		});
	}
	return {
		section: i,
		spec: {
			cells: 1,
			weight: v_(e)
		}
	};
}
var __ = (e) => e.section.panels.some((e) => e.lines.some((e) => e.text.trim() !== "")), v_ = (e) => e.section.symbols.length && __(e) ? 1 : e.weight ?? 1;
function y_(e, t, n, r) {
	let i = Zf.find((e) => e.id === t) ?? Zf[0] ?? null, a = i?.rows ?? [
		"fa-header",
		"fa-alarm",
		"fa-leave",
		"fa-assembly",
		"fa-no-belongings"
	], o = [], s = [];
	for (let e of a) {
		let t = Qf(e);
		if (!t) continue;
		let { section: i, spec: a } = g_(t, n, r);
		o.push(i), s.push(a);
	}
	let c = qc({
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
	return b_(c), p_(c), c;
}
function b_(e) {
	let t = .03333 * Math.min(e.root.width, e.root.height), [n, r] = [t * d_, t * f_];
	for (let i of e.root.sections) {
		i.spacing = t;
		for (let e of i.text_frame.panels) e.padding = [
			r,
			n,
			r,
			n
		];
	}
	let i = e.root.corners?.radius, a = typeof i == "number" ? Math.min(i, x_(e)) : t;
	e.root.corners = {
		rounded: e.root.corners?.rounded ?? !0,
		radius: a
	};
}
var x_ = (e) => .03333 * Math.min(e.root.width, e.root.height), S_ = (e) => {
	let t = e.root.corners?.radius;
	return typeof t == "number" ? t : x_(e);
};
function C_(e, t) {
	let n = Math.max(0, Math.min(x_(e), t));
	e.root.corners = {
		rounded: n > 0,
		radius: n
	};
}
var w_ = (e) => e.fill !== void 0, T_ = (e) => e.blocks.some(w_);
function E_(e) {
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
		fill: s_,
		colour: c_,
		stretch: !0
	});
}
function D_(e, t, n, r, i) {
	let a = e.root.layout;
	if (a.type !== "board" || !e.root.sections[t]) return;
	let o = ug(e, t), { section: s, spec: c } = g_(n, r, i);
	e.root.sections[t] = s, o >= 0 && a.rows[o] && (a.rows[o] = c), b_(e), p_(e);
}
function O_(e, t, n) {
	let r = e.root.layout;
	if (r.type !== "board" || r.rows.length >= 8) return null;
	let i = lg(e), a = Math.max(0, Math.min(i.length, t + 1)), o = a < i.length ? i[a].start : e.root.sections.length;
	return e.root.sections.splice(o, 0, fg(n)), r.rows.splice(a, 0, {
		cells: 1,
		weight: 1
	}), b_(e), p_(e), a;
}
function k_(e, t) {
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
		e.step = r?.step === !0, e.symbol_frame && !i ? (e.text_frame.panels = [], e.symbol_share = 1, e.orientation = "vertical", delete e.symbol_frame.tile) : e.symbol_frame && (e.symbol_frame.tile = { inset: 0 }, e.symbol_share = u_, e.orientation = "horizontal");
		let a = e.text_frame.panels[0];
		r?.write_on && a && !T_(a) && E_(a);
	}), b_(e), p_(e);
}
function A_(e, t, n, r, i = null) {
	let a = e.root.layout;
	if (a.type !== "board") return;
	let { section: o, spec: s } = g_(t, n, r), c = i === null ? e.root.sections.length : Math.max(0, Math.min(i, e.root.sections.length));
	e.root.sections.splice(c, 0, o), a.rows.splice(c, 0, s), b_(e), p_(e);
}
//#endregion
//#region editor/src/model/rowThumb.ts
var j_ = (e, t, n) => `${e.id}|${t.width.toFixed(1)}x${t.height.toFixed(1)}|${n ? "n" : "b"}`, M_ = /* @__PURE__ */ new Map(), N_ = () => {
	M_.clear();
};
function P_(e, t, n, r) {
	let i = j_(e, t, n), a = M_.get(i);
	if (a !== void 0) return a;
	let o = "";
	try {
		o = F_(e, t, n, r);
	} catch {
		o = "";
	}
	return M_.set(i, o), o;
}
function F_(e, t, n, r) {
	let { ruleset: i, shaper: a, symbols: o } = r, s = e.section, c = qc({
		symbols: [],
		title: "",
		size: {
			width: t.width,
			height: t.height
		},
		ruleset: i
	}), l = Uf(s, o, i);
	if (n) {
		l.step = e.fireAction?.step ?? !1, l.symbol_frame && (l.symbol_frame.tile = { inset: 0 }), l.symbol_share = u_, l.orientation = "horizontal", s.panels.some((e) => e.lines.length) || (l.text_frame.panels = [], l.symbol_share = 1, l.orientation = "vertical", l.symbol_frame && delete l.symbol_frame.tile);
		let t = l.text_frame.panels[0];
		e.fireAction?.writeOn && t && E_(t);
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
	}, n ? (b_(c), p_(c)) : Su(c), Hc(c, {
		shaper: a,
		ruleset: i
	}, {
		guides: !1,
		text: "live"
	}).svg ?? "";
}
var I_ = (e) => [...new Set(e.flatMap((e) => e.section.symbols))];
//#endregion
//#region editor/src/model/translator.ts
function L_(e) {
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
var R_ = (e, t, n) => Promise.race([e, new Promise((e, r) => setTimeout(() => r(Error(n)), t))]);
function z_() {
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
			let i = n(r), a = await R_(i, 2e4, "Your browser is still getting this language ready. Press “Translate all again” to carry on, or type the translation.").catch((e) => {
				throw t.get(r) === i && t.delete(r), e instanceof DOMException && e.name === "NotAllowedError" ? Error("Press “Translate all again” to download this language in your browser, or type the translation.") : e instanceof DOMException && e.name === "NotSupportedError" ? Error("This browser can’t translate to that language. Please type the translation.") : e;
			});
			return Promise.all(e.map((e) => Promise.all(e.split("\n").map((e) => e.trim() ? a.translate(e) : Promise.resolve(e))).then((e) => e.join("\n"))));
		}
	};
}
function B_(e = location.search) {
	if (Hl) return Hl.translateUrl ? L_(Hl.translateUrl) : null;
	let t = new URLSearchParams(e).get("translate") ?? "https://www.safetysignsandnotices.co.uk/index.php?route=bespoke/api/translate";
	return t && t !== "off" ? L_(t) : t === "off" ? null : z_();
}
//#endregion
//#region editor/src/model/wizard.ts
var V_ = [
	"above",
	"below",
	"left",
	"right"
], H_ = "[,:;.!\\u2013\\u2014-]", U_ = RegExp(`^(?:(danger|warning|caution)\\s*${H_}*\\s+|(notice|important)\\s*${H_}+\\s*)(.+)$`, "i");
function W_(e) {
	let t = U_.exec(e.title.trim());
	if (!t) return e;
	let n = t[1] ?? t[2], r = t[3].trim(), i = r === r.toUpperCase() ? r : r.charAt(0).toUpperCase() + r.slice(1);
	return {
		...e,
		title: n,
		lines: [i, ...e.lines]
	};
}
function G_(e = location.search) {
	if (Hl) return Hl.suggestUrl ?? null;
	let t = new URLSearchParams(e).get("suggest") ?? "https://www.safetysignsandnotices.co.uk/index.php?route=bespoke/api/suggest";
	return t && t !== "off" ? t : null;
}
function K_(e = location.search) {
	if (Hl) return Hl.photoUrl ?? null;
	let t = new URLSearchParams(e).get("photo") ?? "https://www.safetysignsandnotices.co.uk/index.php?route=bespoke/api/photo";
	return t && t !== "off" ? t : null;
}
var q_ = (e = location.search) => (new URLSearchParams(e).get("describe") ?? "").trim().slice(0, 300), J_ = 4, Y_ = (e) => Array.isArray(e) && e.every((e) => typeof e == "string");
function X_(e) {
	let t = e;
	return !t || typeof t != "object" || !Y_(t.symbols) || typeof t.title != "string" || !Y_(t.lines) || !t.symbols.length && !t.title.trim() ? null : {
		symbols: t.symbols.slice(0, 4),
		colour: typeof t.colour == "string" ? t.colour : null,
		background: t.background === "colour" ? "colour" : "white",
		symbol_position: V_.includes(t.symbol_position) ? t.symbol_position : null,
		title: t.title.slice(0, 120),
		lines: t.lines.slice(0, 4).map((e) => e.slice(0, 160)),
		size_id: typeof t.size_id == "number" ? t.size_id : null,
		alternatives: Y_(t.alternatives) ? t.alternatives.slice(0, 6) : [],
		note: typeof t.note == "string" ? t.note.slice(0, 300) : "",
		sections: Z_(e.sections)
	};
}
function Z_(e) {
	if (!Array.isArray(e)) return [];
	let t = e.slice(0, J_).map((e) => {
		let t = e;
		if (!t || typeof t != "object") return null;
		let n = Y_(t.symbols) ? t.symbols.slice(0, 2) : [], r = typeof t.title == "string" ? t.title.slice(0, 120) : "", i = Y_(t.lines) ? t.lines.slice(0, 3).map((e) => e.slice(0, 160)) : [];
		return !n.length && !r.trim() && !i.length ? null : {
			symbols: n,
			colour: typeof t.colour == "string" ? t.colour : null,
			title: r,
			lines: i
		};
	}).filter((e) => e !== null);
	return t.length > 1 ? t : [];
}
async function Q_(e, t) {
	let n = await fetch(e, {
		method: "POST",
		credentials: "omit",
		headers: { "Content-Type": "text/plain" },
		body: JSON.stringify(t)
	}), r = await n.json().catch(() => null);
	if (!n.ok) throw Error(r?.error ?? `Suggestion failed (HTTP ${n.status})`);
	return r;
}
var $_ = () => /* @__PURE__ */ Error("The suggestion service returned something unexpected");
async function ev(e, t, n) {
	let r = X_(await Q_(e, {
		description: t,
		...tv(n)
	}));
	if (!r) throw $_();
	return r;
}
var tv = (e) => e?.length ? { size_ids: e } : {};
async function nv(e, t, n) {
	let r = X_(await Q_(e, {
		image: t,
		...tv(n)
	}));
	if (!r) throw $_();
	return r;
}
async function rv(e, t, n, r) {
	let i = await Q_(e, {
		description: t,
		count: n,
		...tv(r)
	}), a = (Array.isArray(i?.designs) ? i.designs : [i]).map(X_).filter((e) => e !== null);
	if (!a.length) throw $_();
	return a;
}
var iv = (e) => {
	let t = atob(e.replace(/-/g, "+").replace(/_/g, "/"));
	return new TextDecoder().decode(Uint8Array.from(t, (e) => e.charCodeAt(0)));
};
function av(e = location.search) {
	let t = new URLSearchParams(e).get("design");
	if (!t || t.length > 4e3) return null;
	try {
		let e = JSON.parse(iv(t)), n = X_(e);
		return n ? {
			...n,
			description: typeof e.description == "string" ? e.description.slice(0, 300) : ""
		} : null;
	} catch {
		return null;
	}
}
function ov(e, t, n, r, i) {
	if (t = W_(t), t.sections.length > 1) {
		let e = new Map(n.map((e) => [e.code, e]));
		return {
			doc: Wf({
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
		let e = Wf({
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
			basic: bf(e)
		};
	}
	let s = bm(r, a, t.title, t.lines[0] ?? "", i), c = yf(s);
	for (let e of o) Wu(s, c.id, e);
	let l = c.text_frame.panels[0];
	for (let e of t.lines.slice(1)) l.blocks.push(lu(e, "body"));
	t.symbol_position && Tu(s, t.symbol_position), t.background === "colour" && Qd(s, "colour", i.categories);
	let u = Gp(e);
	return u && ($p(s, u.target.lang ?? "pl", Yp(e)), pm(s, fm(e))), {
		doc: s,
		basic: bf(s)
	};
}
//#endregion
//#region editor/src/useEditor.ts
function sv(e) {
	if (Array.isArray(e)) return e.map(sv);
	if (e && typeof e == "object") {
		let t = {};
		for (let [n, r] of Object.entries(e)) t[n] = n === "source" ? r : sv(r);
		return t;
	}
	return e;
}
var cv = /* @__PURE__ */ new Set(["W_EMPTY_TEXT"]), lv = 60, uv = 400, dv = 500, fv = (e) => e.filter((e) => e.width >= uv && e.height >= dv).sort((e, t) => e.width * e.height - t.width * t.height)[0] ?? e[0] ?? {
	size_id: 0,
	name: "450mm x 600mm",
	width: 450,
	height: 600,
	symbol_position: "left"
}, pv = 1500, mv = 700;
function hv() {
	let e = /* @__PURE__ */ Nt({
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
		reviewStatus: Hl?.review?.status ?? "",
		savedAt: ""
	}), t = Hl?.open ?? null, n = Hl?.review ?? null, r = G_(), i = K_(), a = /* @__PURE__ */ Gt(null), o = /* @__PURE__ */ Gt(null), s = /* @__PURE__ */ R(q_()), c = /* @__PURE__ */ Gt([]), l = !1, u = B_(), d = /* @__PURE__ */ Gt([]), f, p = 0, m = 0, h = null, g = null, _ = null, v = /* @__PURE__ */ Gt(null), y = /* @__PURE__ */ Gt(null), b = /* @__PURE__ */ Gt(""), x = /* @__PURE__ */ Gt(null), S = /* @__PURE__ */ Gt([]), C = /* @__PURE__ */ Gt(null), w = /* @__PURE__ */ R(0), T = /* @__PURE__ */ R(new URLSearchParams(location.search).get("mode") === "advanced" ? "advanced" : "basic"), E = /* @__PURE__ */ Nt({
		section: 0,
		panel: 0
	}), D = /* @__PURE__ */ R(null), O = [], k = [], ee = /* @__PURE__ */ Nt({
		canUndo: !1,
		canRedo: !1
	}), te = "", ne = 0, re = [];
	function A() {
		if (!y.value || !_ || !g) return;
		let e = Hc(y.value, {
			shaper: _,
			ruleset: g
		}, {
			guides: !1,
			text: "live",
			dimensions: !0,
			unprinted: Qe.value
		});
		b.value = e.svg ?? "", x.value = e.report, S.value = e.findings.filter((e) => !cv.has(e.code)), C.value = sv(y.value), w.value++;
		for (let e of re) e();
	}
	function ie() {
		let e = y.value?.root.sections ?? [];
		E.section = Math.max(0, Math.min(E.section, e.length - 1));
		let t = e[E.section]?.text_frame.panels.length ?? 1;
		E.panel = Math.max(0, Math.min(E.panel, t - 1));
	}
	function ae() {
		ee.canUndo = O.length > 0, ee.canRedo = k.length > 0;
	}
	function j(e, t = "") {
		if (!y.value || !g) return;
		let n = Date.now();
		(!t || t !== te || n - ne > pv) && (O.push(JSON.stringify(y.value)), O.length > lv && O.shift(), k.length = 0), te = t, ne = n, e(y.value, g), v.value?.fireaction && (b_(y.value), p_(y.value)), v.value?.roadsign || Ud(y.value, g.categories), N_(), nm(y.value), ie(), ae(), A(), oe();
	}
	function oe(e = mv, t = !1) {
		clearTimeout(f), y.value && Kp(y.value) && (f = setTimeout(() => void se(t), e));
	}
	async function se(t) {
		let n = y.value;
		if (!n) return;
		let r = Gp(n)?.target.lang, i = im(n, t);
		if (!r || !i.length) {
			A();
			return;
		}
		if (!u) {
			e.translateError = "Automatic translation isn’t available here. Please type the translation.", A();
			return;
		}
		let a = ++m;
		p++, e.translating = !0, d.value = i.map((e) => e.id), e.translateError = "";
		try {
			let e = await u.translate(i.map((e) => e.text), r);
			if (y.value !== n || Gp(n)?.target.lang !== r) return;
			om(n, i.map((t, n) => ({
				id: t.id,
				from: t.text,
				text: e[n]
			}))), nm(n), A();
		} catch (t) {
			a === m && (e.translateError = t instanceof Error ? t.message : String(t));
		} finally {
			e.translating = --p > 0, a === m && (d.value = []);
		}
	}
	function M(e, t) {
		let n = e.pop();
		n && y.value && (t.push(JSON.stringify(y.value)), y.value = JSON.parse(n), te = "", T.value === "basic" && (bf(y.value) ? xf(y.value) : T.value = "advanced"), ie(), ae(), A(), oe());
	}
	async function ce() {
		try {
			let i = _m(location.search);
			({data: h, ruleset: g, shaper: _} = await pp(i === "fireaction" || i === "board" ? i : void 0)), gp().catch(() => void 0), v.value = vm(location.search, g.categories, h.symbols);
			let a = Sp() === null ? null : xp(Sp());
			if (a) {
				v.value = {
					...v.value,
					heading: `Customise: ${a.name}`,
					bilingual: !1
				}, y.value = await Cp(a, async (e) => {
					let t = le(e);
					return t ? ag(t) : null;
				}), bf(y.value) || (T.value = "advanced"), e.status = "ready", A();
				return;
			}
			if (t) {
				let i = await ue(t), a = v.value.bilingual && Gp(i) === null, o = a ? qe(i.root) : null;
				if (o && $p(i, v.value.language, o.split), v.value = {
					...v.value,
					heading: t.productName,
					board: yu(i) === "board",
					bilingual: a || Gp(i) !== null
				}, y.value = i, o?.size) {
					let e = Lg(o.size, Ze.value?.material_id ?? 0);
					Je(o.size.size_id, e?.material_id ?? 0, !0);
				}
				n ? T.value = "advanced" : bf(y.value) || (T.value = "advanced"), e.status = "ready", A(), a && oe(0);
				let s = q_();
				s && r && !n && N(s);
				return;
			}
			if (v.value.roadsign) {
				T.value = "advanced";
				let t = Vg(h.sizes)[0] ?? h.sizes[0];
				y.value = e_(t, Rg[0], "Site traffic only", g), e.status = "ready", A();
				return;
			}
			if (v.value.fireaction) {
				T.value = "advanced";
				let t = Zf[0], n = h.sizes.find((e) => e.width === t.size[0] && e.height === t.size[1]) ?? h.sizes.find((e) => e.height > e.width) ?? h.sizes[0], r = await De(ep());
				y.value = y_(n, t.id, r, g), e.status = "ready", A();
				return;
			}
			if (v.value.board) {
				T.value = "advanced";
				let t = fv(h.sizes), n = await De(Kf("header-site-safety")?.section.symbols ?? []);
				y.value = Dg(t, n, g), e.status = "ready", A();
				return;
			}
			let o = h.symbols.find((e) => e.code === v.value.defaultSymbol) ?? h.symbols[0], c = (v.value.bilingual ? h.sizes.find((e) => e.width === 300 && e.height === 200) ?? h.sizes.find((e) => e.width > e.height) : void 0) ?? h.sizes.find((e) => e.symbol_position === "above") ?? h.sizes[0];
			if (!o || !c) throw Error("No symbols or sizes available");
			let l = await ag(o);
			y.value = bm(c, {
				code: o.code,
				category: o.category,
				source: l
			}, "Your text here", "", g), v.value.bilingual && $p(y.value, v.value.language, "side"), e.status = "ready", A(), oe(0);
			let u = av(), d = q_();
			u ? (s.value = u.description, await ge(u, u.description).catch((t) => {
				e.suggestError = t instanceof Error ? t.message : String(t);
			}), O.length = 0, ae()) : d && r && N(d);
		} catch (t) {
			e.status = "error", e.error = t instanceof Error ? t.message : String(t);
		}
	}
	let le = (e) => h?.symbols.find((t) => t.code === e) ?? null;
	async function ue(e) {
		if (!h || !g) throw Error("Not ready");
		if (e.design) try {
			let t = Mc(e.design);
			if (!Bc(Vc(t, g))) return t;
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
		}, r = zf(e.recipe), i = (r ? Hf(r) : [v.value?.defaultSymbol ?? h.symbols[0].code]).map((e) => le(e)).filter((e) => e !== null), a = new Map(await Promise.all(i.map(async (e) => [e.code, {
			code: e.code,
			category: e.category,
			source: await ag(e)
		}]))), o = r ? Wf(r, n, a, g) : bm(n, [...a.values()][0], "Your text here", "", g);
		return r && v.value?.fireaction && k_(o, r.sections.map((e) => ({
			step: e.step,
			write_on: e.write_on
		}))), t.size_id === null && delete o.catalogue_size_id, o;
	}
	async function de(t) {
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
	function fe(t) {
		e.symbolError = "", D.value = t;
	}
	async function pe(t) {
		let n = D.value;
		if (n) {
			e.symbolBusy = t.code, e.symbolError = "";
			try {
				let e = await ag(t), r = {
					code: t.code,
					category: t.category,
					source: e
				}, i = n.index === "new";
				if (typeof n.index == "object") {
					let { panelId: e } = n.index;
					j((t) => {
						t.root.sections.flatMap((e) => e.text_frame.panels).find((t) => t.id === e)?.lead ? td(t, e, r) : $u(t, n.sectionId, r);
					});
				} else if (T.value === "basic") j((e) => wm(e, r));
				else if (n.index === "new") {
					let e = 0;
					j((t) => {
						e = Wu(t, n.sectionId, r);
					}), D.value = {
						...n,
						index: e
					};
				} else {
					let e = n.index;
					j((t) => Gu(t, n.sectionId, e, r));
				}
				v.value?.roadsign && j((e) => {
					i && Tu(e, "below"), Yg(e, Jg(e), g);
				});
			} catch (t) {
				e.symbolError = t instanceof Error ? t.message : String(t);
			} finally {
				e.symbolBusy = "";
			}
		}
	}
	let me = Y(() => {
		w.value;
		let e = D.value;
		if (!e || !y.value || e.index === "new") return null;
		if (typeof e.index == "object") {
			let t = e.index.panelId;
			return y.value.root.sections.flatMap((e) => e.text_frame.panels).find((e) => e.id === t)?.lead?.symbol.symbol_code ?? null;
		}
		return y.value.root.sections.find((t) => t.id === e.sectionId)?.symbol_frame?.symbols[e.index]?.symbol_code ?? null;
	}), he = () => Xe.value.map((e) => e.size_id);
	async function ge(e, t) {
		if (!h) return;
		let n = e.symbols.map((e) => le(e)).filter((e) => e !== null);
		if (e.symbols.length && !n.length) throw Error("None of the suggested symbols are available here. Please choose one yourself.");
		let r = await Promise.all(n.map(async (e) => ({
			code: e.code,
			category: e.category,
			source: await ag(e)
		}))), i = y.value;
		if (!i || !g) return;
		let o = Xe.value, s = o.length ? o.find((t) => t.size_id === e.size_id) ?? o.find((e) => e.size_id === Ze.value?.size_id) ?? o[0] : null, c = ov(i, e, r, s ? Ke(s) : h.sizes.find((t) => t.size_id === e.size_id) ?? h.sizes.find((e) => e.size_id === i.catalogue_size_id) ?? h.sizes[0], g);
		if (j((e) => {
			e.root = c.doc.root, c.doc.catalogue_size_id === void 0 ? delete e.catalogue_size_id : e.catalogue_size_id = c.doc.catalogue_size_id;
		}), s && s.size_id !== Ze.value?.size_id) {
			let e = Lg(s, Ze.value?.material_id ?? 0);
			Ze.value = {
				size_id: s.size_id,
				material_id: e?.material_id ?? 0
			};
			for (let e of $e) e(s.size_id, Ze.value.material_id);
		}
		E.section = 0, E.panel = 0, D.value = null, c.basic || (T.value = "advanced"), a.value = {
			...e,
			description: t,
			alternatives: e.alternatives.filter((e) => le(e))
		};
	}
	async function N(t, n = 3) {
		let i = t.trim().slice(0, 300);
		if (r && i && h && g && _ && !e.suggesting) {
			e.suggesting = !0, e.choosing = !0, e.suggestError = "", c.value = [];
			try {
				let e = await rv(r, i, n, he()), t = [];
				for (let n of e) {
					let e = await _e(n);
					e && t.push({
						suggestion: n,
						svg: e
					});
				}
				if (!t.length) throw Error("None of the suggested symbols are available here.");
				c.value = t, t.length === 1 && await P(0);
			} catch (t) {
				e.suggestError = t instanceof Error ? t.message : String(t), e.choosing = !1;
			} finally {
				e.suggesting = !1;
			}
		}
	}
	async function _e(e) {
		if (!h || !g || !_ || !y.value) return null;
		let t = e.symbols.map((e) => le(e)).filter((e) => e !== null);
		if (e.symbols.length && !t.length) return null;
		let n = await Promise.all(t.map(async (e) => ({
			code: e.code,
			category: e.category,
			source: await ag(e)
		}))), r = Xe.value, i = r.length ? r.find((t) => t.size_id === e.size_id) ?? r[0] : null, a = i ? Ke(i) : h.sizes.find((t) => t.size_id === e.size_id) ?? h.sizes[0];
		try {
			let t = Hc(ov(y.value, e, n, a, g).doc, {
				shaper: _,
				ruleset: g
			}, {
				guides: !1,
				text: "live",
				unprinted: Qe.value
			}).svg;
			return t ? ql(t) : null;
		} catch {
			return null;
		}
	}
	async function P(t) {
		let n = c.value[t];
		if (n) {
			try {
				await ge(n.suggestion, s.value.trim()), l || (l = !0, O.length = 0), ae(), e.chosen = t;
			} catch (t) {
				e.suggestError = t instanceof Error ? t.message : String(t);
			}
			e.choosing = !1;
		}
	}
	function ve() {
		c.value.length && (e.choosing = !0);
	}
	function ye() {
		c.value = [], e.chosen = -1, e.choosing = !1;
	}
	async function F(t) {
		let n = t.trim().slice(0, 300);
		if (r && n && h && !e.suggesting) {
			e.suggesting = !0, e.suggestError = "";
			try {
				await ge(await ev(r, n, he()), n);
			} catch (t) {
				e.suggestError = t instanceof Error ? t.message : String(t);
			} finally {
				e.suggesting = !1;
			}
		}
	}
	async function be(t) {
		if (i && !e.suggesting) {
			e.suggesting = !0, e.suggestError = "";
			try {
				let e = await Dp(t);
				await ge(await nv(i, e.dataUrl, he()), s.value.trim());
			} catch (t) {
				e.suggestError = t instanceof Error ? t.message : String(t);
			} finally {
				e.suggesting = !1;
			}
		}
	}
	async function xe(e) {
		let t = le(e), n = y.value;
		if (!t || !n) return;
		let r = {
			sectionId: yf(n).id,
			index: 0
		}, i = D.value;
		D.value = r;
		try {
			await pe(t);
		} finally {
			D.value = i;
		}
	}
	function Se() {
		if (!y.value || !g || !_) return;
		let e = Bp(y.value, {
			shaper: _,
			ruleset: g
		}, h?.sizes ?? []);
		o.value = e.outcome, e.outcome.changed && j((t) => {
			t.root = e.doc.root;
		});
	}
	function Ce(e) {
		if (e === T.value || !y.value) return !0;
		if (D.value = null, e === "basic") {
			if (!bf(y.value)) return !1;
			j((e) => xf(e));
		}
		return T.value = e, !0;
	}
	async function we() {
		let e = y.value;
		if (!e || !g || !h) return;
		let t = Gp(e)?.source ?? e.root.sections[0], n = [t, ...e.root.sections].flatMap((e) => e.symbol_frame?.symbols ?? []), r = t.text_frame.panels.flatMap((e) => e.blocks.map((e) => e.text)).filter((e) => e.trim()), i;
		if (n[0]) i = {
			code: n[0].symbol_code,
			category: n[0].category,
			source: n[0].source
		};
		else {
			let e = le(v.value?.defaultSymbol ?? void 0) ?? h.symbols[0];
			i = {
				code: e.code,
				category: e.category,
				source: await ag(e)
			};
		}
		let a = bm(h.sizes.find((t) => t.size_id === e.catalogue_size_id) ?? {
			size_id: e.catalogue_size_id ?? 0,
			name: "",
			width: e.root.width,
			height: e.root.height,
			symbol_position: e.root.width > e.root.height ? "left" : "above"
		}, i, r[0] ?? "", r[1] ?? "", g), o = Gp(e);
		o && ($p(a, o.target.lang ?? v.value?.language ?? "pl", Yp(e)), pm(a, fm(e))), j((e) => {
			e.root = a.root, a.catalogue_size_id === void 0 ? delete e.catalogue_size_id : e.catalogue_size_id = a.catalogue_size_id;
		}), E.section = 0, E.panel = 0, D.value = null, T.value = "basic";
	}
	let I = (e) => {
		for (let t of x.value?.sections ?? []) {
			let n = t.blocks.find((t) => t.id === e);
			if (n) return n;
		}
	}, Te = (e, t) => {
		let n = I(e), r = n?.recommended ?? 0, i = n?.letter_height ?? 0;
		return {
			step: t,
			label: Rd(t, i < r - .05),
			mm: i,
			lines: n?.lines ?? 1
		};
	}, Ee = (e) => Y(() => {
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
		if (!y.value || !bf(y.value)) return t;
		let n = Sm(y.value, e);
		return n ? {
			text: n.text,
			align: n.align,
			caps: wd(n),
			...Te(n.id, km(y.value, e))
		} : t;
	});
	async function De(e) {
		let t = e.map((e) => le(e)).filter((e) => e !== null);
		return new Map(await Promise.all(t.map(async (e) => [e.code, {
			code: e.code,
			category: e.category,
			source: await ag(e)
		}])));
	}
	async function Oe(t, n) {
		if (y.value && g) {
			if (e.symbolError = "", v.value?.fireaction && !t) {
				let e = null;
				j((t) => {
					e = O_(t, n, g);
				});
				let t = e === null ? null : lg(y.value)[e];
				t && (E.section = t.start), E.panel = 0;
				return;
			}
			try {
				let e = await De(t?.section.symbols ?? []), r = null;
				j((i) => {
					r = _g(i, n, t, e, g);
				});
				let i = r === null ? null : lg(y.value)[r];
				i && (E.section = i.start), E.panel = 0;
			} catch (t) {
				e.symbolError = t instanceof Error ? t.message : String(t);
			}
		}
	}
	async function ke(t) {
		if (y.value && g) {
			e.symbolError = "";
			try {
				let e = await De(t.section.symbols), n = E.section;
				j((r) => Eg(r, n, t, e, g)), E.panel = 0;
			} catch (t) {
				e.symbolError = t instanceof Error ? t.message : String(t);
			}
		}
	}
	async function Ae(t) {
		if (y.value && g && h && Zf.find((e) => e.id === t)) {
			e.symbolError = "";
			try {
				let e = await De(ep()), { width: n, height: r } = y.value.root, i = {
					size_id: y.value.catalogue_size_id ?? 0,
					name: "",
					width: n,
					height: r,
					symbol_position: "left"
				};
				j((n) => {
					let r = y_(i, t, e, g);
					n.root.layout = r.root.layout, n.root.sections = r.root.sections;
				}), E.section = 0, E.panel = 0;
			} catch (t) {
				e.symbolError = t instanceof Error ? t.message : String(t);
			}
		}
	}
	async function je(t) {
		if (!y.value || !g || !h) return;
		let n = Jf.find((e) => e.id === t);
		if (n) {
			e.symbolError = "";
			try {
				let e = await De(n.rows.flatMap((e) => Array.isArray(e) ? e : [e]).flatMap((e) => Kf(e)?.section.symbols ?? [])), { width: r, height: i } = y.value.root, a = r >= uv && i >= dv, o = h.sizes.filter((e) => e.width >= uv && e.height >= dv).sort((e, t) => e.width * e.height - t.width * t.height)[0], s = a || !o ? {
					size_id: y.value.catalogue_size_id ?? 0,
					name: "",
					width: r,
					height: i,
					symbol_position: "left"
				} : o;
				j((n) => {
					let r = kg(s, t, e, g);
					n.root.width = r.root.width, n.root.height = r.root.height, r.catalogue_size_id && (n.catalogue_size_id = r.catalogue_size_id), n.root.layout = r.root.layout, n.root.sections = r.root.sections;
				}), E.section = 0, E.panel = 0;
			} catch (t) {
				e.symbolError = t instanceof Error ? t.message : String(t);
			}
		}
	}
	function Me(e) {
		y.value?.root.sections[e]?.placeholder ? Pe("replace", e) : Ne.value?.mode === "replace" && (Ne.value = null);
	}
	let Ne = /* @__PURE__ */ R(null);
	function Pe(t, n) {
		e.symbolError = "", Ne.value = {
			mode: t,
			at: n
		};
	}
	async function Fe(e) {
		let t = Ne.value;
		if (t) {
			if (v.value?.fireaction) {
				if (!y.value || !g) return;
				let n = await De(e.section.symbols);
				t.mode === "replace" ? (j((r) => D_(r, t.at, e, n, g)), E.section = t.at) : (j((r) => A_(r, e, n, g, t.at + 1)), E.section = Math.min(t.at + 1, y.value.root.sections.length - 1)), E.panel = 0;
			} else t.mode === "replace" ? await ke(e) : await Oe(e, t.at);
			Ne.value = null;
		}
	}
	let Ie = Y(() => v.value?.fireaction ? $f().map((e) => ({
		group: e.group,
		presets: e.presets
	})) : qf().map((e) => ({
		group: e.group,
		presets: e.presets
	}))), Le = /* @__PURE__ */ Gt(/* @__PURE__ */ new Map()), Re = "";
	async function ze() {
		let e = I_(Ie.value.flatMap((e) => e.presets)), t = e.join(",");
		t !== Re && (Re = t, Le.value = await De(e), N_(), w.value++);
	}
	let Be = () => {
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
	}, Ve = () => {
		v.value?.fireaction && y.value && (b_(y.value), p_(y.value));
	}, He = {
		rows: Y(() => (w.value, y.value ? lg(y.value) : [])),
		selectedRow: Y(() => (w.value, y.value ? ug(y.value, E.section) : -1)),
		add: Oe,
		templates: Y(() => v.value?.fireaction ? Zf.map((e) => ({
			id: e.id,
			label: e.label,
			hint: e.hint
		})) : Jf.map((e) => ({
			id: e.id,
			label: e.label,
			hint: e.hint
		}))),
		useTemplate: (e) => v.value?.fireaction ? Ae(e) : je(e),
		usePreset: ke,
		remove: (e) => j((t) => {
			vg(t, e), Ve();
		}),
		duplicate: (e) => j((t) => {
			yg(t, e), Ve();
		}),
		move: (e, t) => {
			j((n) => {
				bg(n, e, t), Ve();
			});
			let n = lg(y.value)[t];
			n && (E.section = n.start);
		},
		setCells: (e, t) => j((n) => xg(n, e, t)),
		setRowCount: (e) => j((t) => {
			Cg(t, e, g), Ve();
		}),
		setColumns: (e) => j((t) => wg(t, e, g)),
		columns: Y(() => (w.value, y.value ? Tg(y.value) : 1)),
		empty: Y(() => (w.value, y.value ? pg(y.value) : 0)),
		setWeight: (e, t) => j((n) => Sg(n, e, t)),
		select: (e) => {
			let t = lg(y.value)[e];
			t && (E.section = t.start, E.panel = 0, Me(t.start));
		},
		steps: Y(() => (w.value, v.value?.fireaction && y.value ? m_(y.value) : [])),
		toggleStep: (e) => j((t) => h_(t, e)),
		corner: Y(() => (w.value, y.value ? {
			mm: S_(y.value),
			max: x_(y.value)
		} : {
			mm: 0,
			max: 0
		})),
		setCorner: (e) => j((t) => C_(t, e), "corner"),
		picker: Ne,
		presets: Ie,
		thumb: (e) => (w.value, !g || !_ || !Le.value.size ? "" : P_(e, Be(), v.value?.fireaction ?? !1, {
			ruleset: g,
			shaper: _,
			symbols: Le.value
		})),
		loadThumbs: ze,
		openPicker: Pe,
		closePicker: () => {
			Ne.value = null;
		},
		takePreset: Fe
	}, Ue = {
		schemes: Rg,
		sizes: Y(() => h ? Vg(h.sizes) : []),
		scheme: Y(() => (w.value, y.value ? Jg(y.value) : Rg[0])),
		size: Y(() => {
			w.value;
			let e = y.value;
			return e && h ? Vg(h.sizes).find((t) => t.width === e.root.width && t.height === e.root.height) ?? null : null;
		}),
		setScheme: (e) => j((t) => Yg(t, zg(e), g)),
		setSize: (e) => j((t) => Zg(t, e, g))
	}, We = Y(() => ({
		doc: C.value,
		report: x.value
	}));
	async function Ge(e) {
		if (!y.value || !g) return "";
		let t = await gp();
		return Hc(y.value, {
			shaper: t,
			ruleset: g
		}, {
			guides: !1,
			text: "outline",
			unprinted: Qe.value,
			...e ? { substrate: !1 } : {}
		}).svg ?? "";
	}
	let Ke = (e) => ({
		size_id: e.size_id,
		name: e.name,
		width: e.width,
		height: e.height,
		symbol_position: e.symbol_position
	});
	function qe(e) {
		let t = Xe.value, n = [{
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
	function Je(e, t, n) {
		let r = Xe.value.find((t) => t.size_id === e);
		if (!r) return;
		let i = Lg(r, t);
		Ze.value = {
			size_id: r.size_id,
			material_id: i?.material_id ?? t
		};
		let a = Ke(r);
		if (Qe.value = i?.unprinted_hex ?? void 0, j((e) => {
			if (v.value?.roadsign) {
				Zg(e, a, g);
				return;
			}
			T.value === "basic" ? Cm(e, a) : Mu(e, a);
			let t = i?.face_hex ?? null;
			t ? (e.root.substrate = { hex: t }, delete e.root.background) : delete e.root.substrate;
		}), n) for (let e of $e) e(Ze.value.size_id, Ze.value.material_id);
	}
	let Ye = /* @__PURE__ */ R(null), Xe = Y(() => Ig(Ye.value)), Ze = /* @__PURE__ */ R(null), Qe = /* @__PURE__ */ R(/^#[0-9a-f]{6}$/i.test(Hl?.unprinted ?? "") ? Hl.unprinted : void 0), $e = [];
	return {
		state: e,
		product: v,
		svg: b,
		findings: S,
		mode: T,
		selection: E,
		picker: D,
		history: ee,
		view: We,
		rev: w,
		sizes: Y(() => e.status === "ready" && h ? h.sizes : []),
		symbols: Y(() => e.status === "ready" && h ? h.symbols : []),
		dataSource: Y(() => e.status === "ready" && h ? h.source : ""),
		categories: Y(() => e.status === "ready" && g ? g.categories : []),
		roundedByDefault: () => g?.ratios.CORNERS_ROUNDED ?? !0,
		shareRange: () => ({
			min: g?.ratios.MIN_SYMBOL_SHARE ?? .25,
			max: g?.ratios.MAX_SYMBOL_SHARE ?? .75
		}),
		currentSize: Y(() => (w.value, y.value?.catalogue_size_id ?? null)),
		currentSymbol: Y(() => (w.value, le(y.value ? Tm(y.value) : void 0))),
		pickerCurrent: me,
		symbolEntry: le,
		board: He,
		roadSign: Ue,
		offerPreset: Me,
		title: Ee("title"),
		subtitle: Ee("subtitle"),
		lineInfo: (e) => (w.value, y.value ? Te(e, Id(gu(y.value, e).block)) : {
			step: 0,
			label: "Auto",
			mm: 0,
			lines: 1
		}),
		document: y,
		designJson: () => JSON.stringify(y.value, null, 2),
		previewSvg: () => Ge(!1),
		printSvg: () => Ge(!0),
		init: ce,
		commit: j,
		undo: () => M(O, k),
		redo: () => M(k, O),
		setMode: Ce,
		resetToBasic: we,
		openPicker: fe,
		openPanelSymbol: (e) => {
			let t = y.value?.root.sections.find((t) => t.text_frame.panels.some((t) => t.id === e));
			t && fe({
				sectionId: t.id,
				index: { panelId: e }
			});
		},
		openNewPanelSymbol: (e) => fe({
			sectionId: e,
			index: { panelId: "" }
		}),
		closePicker: () => {
			D.value = null;
		},
		pickSymbol: pe,
		review: n,
		saveReview: de,
		tidied: o,
		tidyUp: Se,
		canSuggest: r !== null,
		canPhoto: i !== null,
		suggestFromPhoto: be,
		suggestion: a,
		describeText: s,
		options: c,
		chooseOption: P,
		reopenOptions: ve,
		dismissOptions: ye,
		suggest: F,
		useAlternative: xe,
		translatorName: u?.name ?? null,
		translatingIds: d,
		prepareTranslation: (t) => {
			e.translateError = "", u?.prepare?.(t).then(() => oe(0)).catch(() => {});
		},
		translateAgain: () => {
			let e = y.value && Gp(y.value)?.target.lang;
			e && u?.prepare?.(e).catch(() => {}), oe(0, !0);
		},
		pickSizeById: (e, t, n, r) => {
			let i = h?.sizes.find((t) => t.size_id === e), a = t && n ? {
				size_id: e,
				name: i?.name ?? `${t}mm x ${n}mm`,
				width: t,
				height: n,
				symbol_position: r ?? i?.symbol_position ?? (t > n ? "left" : "above")
			} : i;
			a && j((e) => v.value?.roadsign ? Zg(e, a, g) : T.value === "basic" ? Cm(e, a) : Mu(e, a));
		},
		setMaterialFace: (e) => {
			Qe.value = e ?? void 0, j((t) => {
				e ? (t.root.substrate = { hex: e }, delete t.root.background) : delete t.root.substrate;
			});
		},
		cartReady: () => {
			w.value;
			let e = y.value;
			return !e || !g || pg(e) > 0 ? !1 : !Vc(e, g).some((e) => e.severity === "error");
		},
		variantSizes: Xe,
		variantChoice: Ze,
		setHostVariants: (e, t) => {
			Ye.value = e;
			let n = Xe.value;
			if (!n.length) return;
			let r = y.value?.root, i = n.find((e) => e.size_id === Number(t?.size_id)) ?? (r && n.find((e) => e.width === r.width && e.height === r.height)) ?? n[0], a = Lg(i, Number(t?.material_id));
			Je(i.size_id, a?.material_id ?? 0, !1);
		},
		chooseVariant: (e, t) => Je(e, t, !0),
		onVariant: (e) => {
			$e.push(e);
		},
		onChange: (e) => {
			re.push(e);
		},
		setCustomSize: (e, t) => j((n) => Lu(n, e, t, h?.sizes ?? [])),
		currentDimensions: Y(() => ({
			width: We.value.doc?.root.width ?? 0,
			height: We.value.doc?.root.height ?? 0
		})),
		pickSize: (e) => j((t) => T.value === "basic" ? Cm(t, e) : Mu(t, e)),
		setText: (e, t) => j((n) => Em(n, e, t), `text:${e}`),
		setAlign: (e, t) => j((n) => Dm(n, e, t)),
		setCaps: (e, t) => j((n) => Om(n, e, t)),
		bumpSize: (e, t) => j((n) => Am(n, e, km(n, e) + t))
	};
}
var gv = Symbol("editor");
function _v() {
	let e = Mn(gv);
	if (!e) throw Error("Editor not provided");
	return e;
}
//#endregion
//#region editor/src/components/ReviewPanel.vue?vue&type=script&setup=true&lang.ts
var vv = {
	class: "card review-panel",
	"aria-label": "Review"
}, yv = { class: "row-controls" }, bv = { class: "grow" }, xv = {
	key: 0,
	class: "small muted"
}, Sv = { class: "row-controls wrap" }, Cv = ["disabled"], wv = ["disabled"], Tv = {
	key: 0,
	class: "small",
	style: {
		margin: "0",
		color: "var(--danger)"
	},
	role: "alert"
}, Ev = /* @__PURE__ */ B({
	__name: "ReviewPanel",
	setup(e) {
		let t = _v(), n = Y(() => t.state.reviewStatus), r = {
			pending: "Not recreated yet",
			review: "To review",
			needs_symbol: "Needs a symbol",
			unsuitable: "Not suitable",
			approved: "Approved",
			failed: "Failed"
		};
		return (e, i) => (U(), W("section", vv, [
			K("div", yv, [K("strong", bv, "Status: " + F(r[n.value] ?? n.value), 1), z(t).state.savedAt ? (U(), W("span", xv, "Saved " + F(z(t).state.savedAt), 1)) : J("", !0)]),
			K("div", Sv, [K("button", {
				class: "btn",
				disabled: z(t).state.saving,
				onClick: i[0] ||= (e) => z(t).saveReview("review")
			}, "Save", 8, Cv), K("button", {
				class: "btn go grow",
				disabled: z(t).state.saving,
				onClick: i[1] ||= (e) => z(t).saveReview("approved")
			}, F(z(t).state.saving ? "Saving…" : "Save & approve"), 9, wv)]),
			z(t).state.saveError ? (U(), W("p", Tv, F(z(t).state.saveError), 1)) : J("", !0),
			i[2] ||= K("p", {
				class: "small muted",
				style: { margin: "0" }
			}, "Approved designs are what “Customise me” will start from.", -1)
		]));
	}
}), Dv = {
	class: "card tidy",
	"aria-labelledby": "tidy-heading"
}, Ov = { class: "row-controls" }, kv = {
	key: 0,
	class: "small muted",
	style: { margin: "0" },
	role: "status"
}, Av = {
	key: 1,
	class: "small",
	style: { margin: "0" },
	role: "status"
}, jv = {
	key: 2,
	class: "row-controls wrap"
}, Mv = { class: "small grow" }, Nv = /* @__PURE__ */ B({
	__name: "TidyButton",
	setup(e) {
		let t = _v(), n = t.tidied, r = (e) => `${Math.round(e * 100)}%`;
		return (e, i) => (U(), W("section", Dv, [
			K("div", Ov, [i[2] ||= K("div", { class: "grow" }, [K("strong", { id: "tidy-heading" }, "Tidy up the layout"), K("p", {
				class: "small muted",
				style: { margin: "0" }
			}, "Makes your wording as large as it can be on this sign.")], -1), K("button", {
				class: "btn strong",
				onClick: i[0] ||= (e) => z(t).tidyUp()
			}, "Tidy up")]),
			z(n) && !z(n).changed ? (U(), W("p", kv, " Already as good as it gets on this size. ")) : z(n) ? (U(), W("p", Av, [
				z(n).notes.length ? (U(), W(H, { key: 0 }, [q(F(z(n).notes.join(", ")) + ".", 1)], 64)) : J("", !0),
				z(n).after > z(n).before ? (U(), W(H, { key: 1 }, [q(" Text now fits at " + F(r(z(n).after)) + " of the recommended size (was " + F(r(z(n).before)) + "). ", 1)], 64)) : J("", !0),
				i[3] ||= q(" You can undo this. ", -1)
			])) : J("", !0),
			z(n)?.suggestion ? (U(), W("div", jv, [K("span", Mv, " Your wording is tight here. A " + F(z(n).suggestion.size.width) + "×" + F(z(n).suggestion.size.height) + " mm sign suits it better: letters " + F(z(n).suggestion.gain) + " mm bigger for much the same sign. ", 1), K("button", {
				class: "btn small-btn",
				onClick: i[1] ||= (e) => {
					z(t).pickSize(z(n).suggestion.size), z(t).tidyUp();
				}
			}, " Use " + F(z(n).suggestion.size.width) + "×" + F(z(n).suggestion.size.height), 1)])) : J("", !0)
		]));
	}
}), Pv = ["maxlength", "disabled"], Fv = ["disabled"], Iv = {
	key: 0,
	class: "spinner dark",
	"aria-hidden": "true"
}, Lv = ["disabled"], Rv = { class: "small describe-hint photo-drop-hint" }, zv = {
	key: 1,
	class: "small describe-error",
	role: "alert"
}, Bv = {
	key: 2,
	class: "small describe-hint",
	role: "status"
}, Vv = {
	key: 3,
	class: "describe-result",
	role: "status"
}, Hv = {
	key: 0,
	class: "small",
	style: { margin: "0" }
}, Uv = { class: "alt-tiles" }, Wv = [
	"title",
	"aria-label",
	"aria-busy",
	"onClick"
], Gv = ["src"], Kv = {
	key: 4,
	class: "small describe-hint"
}, qv = /* @__PURE__ */ B({
	__name: "DescribeCard",
	setup(e) {
		let t = _v(), n = /* @__PURE__ */ R(null), r = /* @__PURE__ */ R(!1), i = (e) => {
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
		let l = t.describeText, u = Y(() => {
			let e = t.suggestion.value;
			return e && e.description === l.value.trim() ? e : null;
		});
		function d() {
			l.value.trim() && t.suggest(l.value);
		}
		return (e, i) => (U(), W("section", {
			class: "card dark describe",
			"aria-labelledby": "describe-label",
			onPaste: c
		}, [
			i[10] ||= K("label", {
				id: "describe-label",
				for: "describe",
				style: { "font-weight": "600" }
			}, "Describe your sign", -1),
			K("form", {
				class: "row-controls",
				onSubmit: fo(d, ["prevent"])
			}, [kn(K("input", {
				id: "describe",
				"onUpdate:modelValue": i[0] ||= (e) => /* @__PURE__ */ Wt(l) ? l.value = e : null,
				class: "field",
				style: { border: "0" },
				maxlength: z(300),
				placeholder: "e.g. DANGER 450 volts, keep out",
				autocomplete: "off",
				disabled: z(t).state.suggesting
			}, null, 8, Pv), [[co, z(l)]]), K("button", {
				class: "btn accent",
				type: "submit",
				disabled: z(t).state.suggesting || !z(l).trim()
			}, [z(t).state.suggesting ? (U(), W("span", Iv)) : J("", !0), q(" " + F(z(t).state.suggesting ? "Designing…" : "Suggest"), 1)], 8, Fv)], 32),
			z(t).canPhoto ? (U(), W("div", {
				key: 0,
				class: fe(["photo-row", { dragging: r.value }]),
				onDragover: i[2] ||= fo((e) => r.value = !0, ["prevent"]),
				onDragenter: i[3] ||= fo((e) => r.value = !0, ["prevent"]),
				onDragleave: i[4] ||= (e) => r.value = !1,
				onDrop: fo(s, ["prevent"])
			}, [
				K("input", {
					ref_key: "photoInput",
					ref: n,
					class: "sr-only",
					type: "file",
					accept: "image/jpeg,image/png,image/webp,image/gif",
					onChange: a
				}, null, 544),
				K("button", {
					class: "btn small-btn",
					disabled: z(t).state.suggesting,
					onClick: i[1] ||= (e) => n.value?.click()
				}, [...i[5] ||= [K("svg", {
					viewBox: "0 0 24 24",
					width: "16",
					height: "16",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "2",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"aria-hidden": "true"
				}, [K("path", { d: "M3 8h3l2-2h8l2 2h3v12H3z" }), K("circle", {
					cx: "12",
					cy: "13",
					r: "3.5"
				})], -1), q(" Upload a photo ", -1)]], 8, Lv),
				K("span", Rv, F(r.value ? "Drop the photo here" : "or drag one here, or paste it"), 1)
			], 34)) : J("", !0),
			z(t).state.suggestError ? (U(), W("p", zv, F(z(t).state.suggestError), 1)) : z(t).state.suggesting ? (U(), W("p", Bv, "Reading your sign: symbols, wording and a size…")) : u.value ? (U(), W("div", Vv, [
				u.value.note ? (U(), W("p", Hv, F(u.value.note), 1)) : J("", !0),
				u.value.alternatives.length ? (U(), W(H, { key: 1 }, [i[6] ||= K("span", { class: "small describe-hint" }, "Other symbols that could fit:", -1), K("div", Uv, [(U(!0), W(H, null, V(u.value.alternatives, (e) => (U(), W("button", {
					key: e,
					class: "alt-tile",
					title: z(t).symbolEntry(e)?.name ?? e,
					"aria-label": `Use ${z(t).symbolEntry(e)?.name ?? e} (${e})`,
					"aria-busy": z(t).state.symbolBusy === e,
					onClick: (n) => z(t).useAlternative(e)
				}, [K("img", {
					src: z(t).symbolEntry(e)?.url,
					alt: ""
				}, null, 8, Gv), K("span", null, F(e), 1)], 8, Wv))), 128))])], 64)) : J("", !0),
				i[7] ||= K("span", { class: "small describe-hint" }, "Change anything below. Undo takes you back.", -1)
			])) : (U(), W("p", Kv, [
				i[8] ||= q(" Tell us what the sign is for", -1),
				z(t).canPhoto ? (U(), W(H, { key: 0 }, [q(", or send a photo of one you already have")], 64)) : J("", !0),
				i[9] ||= q("; we’ll suggest symbols, wording and a size. ", -1)
			]))
		], 32));
	}
}), Jv = { class: "options-stage" }, Yv = { class: "options-head" }, Xv = {
	key: 0,
	class: "small muted",
	role: "status"
}, Zv = {
	key: 1,
	class: "notice",
	role: "alert"
}, Qv = {
	key: 2,
	class: "options-grid"
}, $v = ["aria-pressed", "onClick"], ey = ["innerHTML"], ty = { class: "option-note small" }, ny = { class: "option-use" }, ry = {
	key: 3,
	class: "small muted"
}, iy = /*#__PURE__*/ ((e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
})(/* @__PURE__ */ B({
	__name: "SuggestOptions",
	setup(e) {
		let t = _v();
		return (e, n) => (U(), W("div", Jv, [
			K("p", Yv, [z(t).state.suggesting ? (U(), W(H, { key: 0 }, [q("Designing your sign…")], 64)) : z(t).options.value.length ? (U(), W(H, { key: 1 }, [q("Which of these is closest?")], 64)) : (U(), W(H, { key: 2 }, [q("We couldn’t design that one")], 64))]),
			z(t).state.suggesting ? (U(), W("p", Xv, " Choosing symbols, wording and a size for “" + F(z(t).describeText.value) + "”… ", 1)) : z(t).state.suggestError ? (U(), W("p", Zv, F(z(t).state.suggestError), 1)) : J("", !0),
			z(t).options.value.length ? (U(), W("div", Qv, [(U(!0), W(H, null, V(z(t).options.value, (e, n) => (U(), W("button", {
				key: n,
				class: fe(["option-card", { current: z(t).state.chosen === n }]),
				type: "button",
				"aria-pressed": z(t).state.chosen === n,
				onClick: (e) => z(t).chooseOption(n)
			}, [
				K("span", {
					class: "option-art",
					innerHTML: e.svg
				}, null, 8, ey),
				K("span", ty, F(e.suggestion.note || e.suggestion.title), 1),
				K("span", ny, F(z(t).state.chosen === n ? "Chosen" : "Use this one"), 1)
			], 10, $v))), 128))])) : J("", !0),
			z(t).state.suggesting ? J("", !0) : (U(), W("p", ry, [
				n[1] ||= q(" Pick one and change anything you like, or ", -1),
				K("button", {
					class: "link-btn",
					type: "button",
					onClick: n[0] ||= (e) => z(t).dismissOptions()
				}, "start from scratch"),
				n[2] ||= q(". ", -1)
			]))
		]));
	}
}), [["__scopeId", "data-v-a328c2ad"]]), ay = ["innerHTML"], oy = "http://www.w3.org/2000/svg", sy = /* @__PURE__ */ B({
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
		let n = e, r = t, i = /* @__PURE__ */ R(null), a = /* @__PURE__ */ R(null), o = /* @__PURE__ */ R(null), s = /* @__PURE__ */ R(!1), c = null, l = () => a.value?.querySelector("svg") ?? null;
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
			let i = f(), a = r * i, o = document.createElementNS(oy, "rect");
			o.setAttribute("x", String(t.x - a)), o.setAttribute("y", String(t.y - a)), o.setAttribute("width", String(t.width + 2 * a)), o.setAttribute("height", String(t.height + 2 * a)), o.setAttribute("rx", String(4 * i)), o.setAttribute("class", n), o.setAttribute("stroke-width", String((n === "ov-selected" ? 3 : 2) * i)), n !== "ov-selected" && o.setAttribute("stroke-dasharray", `${6 * i} ${4 * i}`), e.appendChild(o);
		}
		function m(e) {
			let t = l();
			if (!t) return null;
			t.querySelector(`#${e}`)?.remove();
			let n = document.createElementNS(oy, "g");
			return n.setAttribute("id", e), n.setAttribute("pointer-events", "none"), t.appendChild(n), n;
		}
		function h(e, t, n) {
			let r = f(), i = document.createElementNS(oy, "rect");
			if (i.setAttribute("x", String(t.x)), i.setAttribute("y", String(t.y)), i.setAttribute("width", String(t.width)), i.setAttribute("height", String(t.height)), i.setAttribute("class", "ov-busy"), e.appendChild(i), !n) return;
			let a = 14 * r, o = Math.min(t.width - 8 * r, (n.length * .56 + 3.4) * a), s = a * 2.2, c = t.x + (t.width - o) / 2, l = t.y + (t.height - s) / 2, u = document.createElementNS(oy, "rect");
			for (let [e, t] of Object.entries({
				x: c,
				y: l,
				width: o,
				height: s,
				rx: s / 2
			})) u.setAttribute(e, String(t));
			u.setAttribute("class", "ov-pill");
			let d = document.createElementNS(oy, "circle");
			for (let [e, t] of Object.entries({
				cx: c + s / 2 + 2 * r,
				cy: l + s / 2,
				r: a * .45
			})) d.setAttribute(e, String(t));
			d.setAttribute("class", "ov-spin"), d.setAttribute("stroke-width", String(2 * r)), d.setAttribute("pathLength", "100");
			let p = document.createElementNS(oy, "text");
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
					C(null), m("ui-drop")?.remove(), t.item && t.target && r("drop", t.item.key, t.target.key), gn(_);
					return;
				}
				r("pick", t.source, S(e.clientX, e.clientY));
			}
		}
		function D() {
			b = null, C(null), m("ui-drop")?.remove(), _();
		}
		return Fn(() => n.svg, () => gn(() => {
			u(), _();
		})), Fn(() => [n.highlights, n.interactive], () => gn(() => {
			g(), _();
		}), { deep: !0 }), ar(() => {
			c = new ResizeObserver(u), i.value && c.observe(i.value), u();
		}), cr(() => c?.disconnect()), (e, t) => (U(), W("div", {
			ref_key: "stage",
			ref: i,
			class: fe(["stage", { interactive: n.interactive }]),
			style: { overflow: "hidden" }
		}, [K("div", {
			ref_key: "holder",
			ref: a,
			innerHTML: n.svg,
			class: fe({ grabbable: o.value !== null }),
			onPointerdown: w,
			onPointermove: T,
			onPointerup: E,
			onPointercancel: D,
			onPointerenter: v,
			onPointerleave: y
		}, null, 42, ay)], 2));
	}
}), cy = { class: "scale-panel" }, ly = { class: "step-head" }, uy = {
	key: 0,
	class: "notice",
	role: "alert"
}, dy = {
	key: 1,
	class: "small muted"
}, fy = ["viewBox"], py = [
	"y1",
	"x2",
	"y2"
], my = [
	"y",
	"width",
	"height"
], hy = [
	"y",
	"width",
	"height"
], gy = ["cx", "cy"], _y = ["innerHTML"], vy = {
	key: 3,
	class: "small muted",
	style: { margin: "0" }
}, yy = 1500, by = 180, xy = /* @__PURE__ */ B({
	__name: "ScalePreview",
	emits: ["close"],
	setup(e, { emit: t }) {
		let n = _v(), r = t, i = {
			w: 762,
			h: 1981
		}, a = /* @__PURE__ */ R(""), o = /* @__PURE__ */ R(!1);
		ar(async () => {
			try {
				a.value = await n.previewSvg();
			} catch {
				o.value = !0;
			}
		});
		let s = Y(() => {
			let e = n.view.value.doc?.root;
			return {
				w: e?.width ?? 0,
				h: e?.height ?? 0
			};
		}), c = Y(() => s.value.w <= i.w - 120 && s.value.h <= 1200), l = Y(() => {
			let e = s.value, t = c.value ? i.w : i.w + by + e.w, n = i.h + 90, r = c.value ? (i.w - e.w) / 2 : i.w + by, a = n - yy - e.h / 2, o = (e, t) => `${e / t * 100}%`;
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
		return (e, t) => (U(), W("div", {
			class: "scale-backdrop",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Your sign at true scale",
			onClick: t[1] ||= fo((e) => r("close"), ["self"])
		}, [K("div", cy, [
			K("div", ly, [t[2] ||= K("h2", { class: "grow" }, "Your sign, actual size", -1), K("button", {
				class: "icon-btn",
				"aria-label": "Close",
				onClick: t[0] ||= (e) => r("close")
			}, "×")]),
			o.value ? (U(), W("p", uy, "The artwork could not be prepared. Please try again.")) : a.value ? J("", !0) : (U(), W("p", dy, "Preparing the artwork…")),
			a.value ? (U(), W("div", {
				key: 2,
				class: "scale-stage",
				style: M({ aspectRatio: `${l.value.width} / ${l.value.height}` })
			}, [(U(), W("svg", {
				class: "scale-door",
				viewBox: `0 0 ${l.value.width} ${l.value.height}`,
				"aria-hidden": "true"
			}, [
				K("line", {
					x1: 0,
					y1: l.value.height,
					x2: l.value.width,
					y2: l.value.height,
					class: "floor"
				}, null, 8, py),
				K("rect", {
					x: 0,
					y: l.value.height - i.h,
					width: i.w,
					height: i.h,
					class: "frame"
				}, null, 8, my),
				K("rect", {
					x: 28,
					y: l.value.height - i.h + 28,
					width: i.w - 56,
					height: i.h - 56,
					class: "leaf"
				}, null, 8, hy),
				K("circle", {
					cx: i.w - 90,
					cy: l.value.height - 1050,
					r: "26",
					class: "knob"
				}, null, 8, gy)
			], 8, fy)), K("div", {
				class: "scale-sign",
				style: M(l.value.box),
				innerHTML: a.value
			}, null, 12, _y)], 4)) : J("", !0),
			a.value ? (U(), W("p", vy, [
				q(F(s.value.w) + " × " + F(s.value.h) + " mm, shown against a standard door (" + F(i.w) + " × " + F(i.h) + " mm) ", 1),
				c.value ? (U(), W(H, { key: 0 }, [q(" at the usual height")], 64)) : J("", !0),
				t[3] ||= q(". ", -1)
			])) : J("", !0)
		])]));
	}
}), Sy = {
	box: {
		x: 11,
		y: -1,
		width: 1503,
		height: 1208
	},
	path: "M948,-0.5 929,1.5 63,25.5 41.5,46 37.5,51 39.5,63 145.5,406 129.5,431 129.5,437 133.5,446 133.5,457 15.5,1023 11.5,1043 11.5,1051 14,1053.5 32,1060.5 53,1055.5 56.5,1042 67.5,1035 109.5,835 127,831.5 246,819.5 251.5,830 363.5,1198 392,1206.5 430,1203.5 433.5,1202 431.5,1190 329.5,863 330,855.5 1104,784.5 1105.5,789 1087.5,915 1098,919.5 1104,919.5 1121,914.5 1130,919.5 1137,920.5 1149.5,915 1170,779.5 1329,763.5 1341,763.5 1343.5,767 1441.5,1037 1444.5,1044 1449,1046.5 1451.5,1043 1349.5,767 1351,761.5 1359.5,763 1463.5,1055 1468,1057.5 1484,1057.5 1513.5,1050 1513.5,1045 1408.5,759 1410,754.5 1439.5,731 1439.5,726 1178,-0.5 1171.5,1 1431.5,722 1430,726.5 315.5,825 67.5,38 69,31.5 75.5,33 79.5,44 319.5,810 325,819.5 1377,725.5 1396,725.5 1399,723.5 1414,723.5 1422.5,721 1421.5,713 1175.5,29 1165,5.5 150,37.5 132,39.5 86,40.5 83.5,39 81.5,33 83,31.5 133,29.5 1135,1.5 1154,-0.5ZM1149.5,12 1154.5,13 1144,23.5 1126,25.5 551,41.5 137,55.5 90,55.5 87.5,52 87.5,47 90,45.5ZM1161.5,16 1163.5,16 1175.5,48 1411.5,704 1414.5,714 1412,717.5 1397,717.5 1393.5,711 1149.5,32 1149.5,27ZM1128.5,31 1142,30.5 1147.5,42 1389.5,716 1388,719.5 350,811.5 327.5,812 93.5,71 91.5,64 93,61.5ZM59.5,37 61.5,37 65.5,49 309.5,826 309.5,830 291,848.5 287.5,845 45.5,60 44.5,53ZM147.5,415 149.5,416 168.5,478 165.5,487 157,498.5 153.5,493 135.5,434ZM137.5,466 139.5,466 149.5,498 149.5,513 37.5,1042 34.5,1053 31,1053.5 19,1048.5 17.5,1045ZM169.5,491 172.5,492 177.5,506 389.5,1193 389,1198.5 370,1193.5 365.5,1183 167.5,539 163.5,519 159.5,513 159.5,507ZM153.5,520 156.5,522 155.5,532 47.5,1035 49.5,1047 42,1051.5ZM159.5,539 161.5,539 164.5,548 161.5,566 113.5,790 110.5,800 106,801.5 104.5,800 105.5,792ZM167.5,564 169.5,564 173.5,576 236.5,785 119,798.5 117.5,796ZM1414.5,734 1425,733.5 1425.5,735 1403,751.5 297.5,852 316,831.5ZM1392.5,758 1401,757.5 1403.5,762 1505.5,1042 1505.5,1045 1503,1046.5 1481,1051.5 1477.5,1046 1375.5,763 1376,759.5ZM1366.5,761 1369.5,762 1472,1050.5 1467.5,1048 1365.5,764ZM1158.5,780 1162.5,780 1161.5,794 1145.5,900 1143.5,911 1140,912.5 1139.5,903ZM1146.5,781 1150,780.5 1151.5,786 1133.5,908 1132,911.5 1128,911.5 1123.5,909 1123.5,903 1141.5,782ZM1131.5,782 1134,781.5 1135.5,786 1117.5,907 1106,911.5 1105.5,903 1121.5,793 1123.5,784ZM1112.5,784 1117.5,785 1099.5,908 1098,911.5 1095,911.5 1095.5,897ZM236.5,792 239.5,793 240,797.5 227,799.5 102.5,811 104,807.5 112,807.5 124,803.5ZM237.5,811 244,810.5 245.5,813 236,815.5 118,827.5 100,828.5 98.5,827 107,823.5ZM100.5,835 103.5,837 63.5,1024 61.5,1032 56,1035.5 55.5,1028 95.5,839ZM319.5,857 322.5,859 327.5,874 425.5,1192 425,1197.5 398,1199.5 395.5,1195 293.5,864 294,859.5Z",
	board: [
		[93, 62],
		[1142, 31],
		[1388, 719],
		[328, 812]
	],
	fits: {
		width: 600,
		height: 450
	}
};
function Cy(e) {
	let [[t, n], [r, i], [a, o], [s, c]] = e, [l, u, d] = [
		r - a,
		s - a,
		t - r + a - s
	], [f, p, m] = [
		i - o,
		c - o,
		n - i + o - c
	];
	if (d === 0 && m === 0) return [
		r - t,
		s - t,
		t,
		i - n,
		c - n,
		n,
		0,
		0,
		1
	];
	let h = l * p - u * f, g = (d * p - u * m) / h, _ = (l * m - d * f) / h;
	return [
		r - t + g * r,
		s - t + _ * s,
		t,
		i - n + g * i,
		c - n + _ * c,
		n,
		g,
		_,
		1
	];
}
var wy = (e, t, n) => {
	let r = e[6] * t + e[7] * n + e[8];
	return [(e[0] * t + e[1] * n + e[2]) / r, (e[3] * t + e[4] * n + e[5]) / r];
};
function Ty(e, t) {
	let n = Cy(Sy.board), { width: r, height: i } = Sy.fits, [a, o] = [Math.min(1, e * i / (t * r)), Math.min(1, t * r / (e * i))], [s, c] = [(1 - a) / 2, (1 - o) / 2], l = (e, t) => wy(n, e, t);
	return [
		l(s, c),
		l(s + a, c),
		l(s + a, c + o),
		l(s, c + o)
	];
}
function Ey(e, t, n) {
	let r = Cy(n), i = [
		r[0] / e,
		r[1] / t,
		r[2],
		r[3] / e,
		r[4] / t,
		r[5],
		r[6] / e,
		r[7] / t,
		r[8]
	];
	return `matrix3d(${[
		i[0],
		i[3],
		0,
		i[6],
		i[1],
		i[4],
		0,
		i[7],
		0,
		0,
		1,
		0,
		i[2],
		i[5],
		0,
		i[8]
	].map((e) => Number(e.toPrecision(10))).join(",")})`;
}
//#endregion
//#region editor/src/components/StanchionPreview.vue?vue&type=script&setup=true&lang.ts
var Dy = { class: "scale-panel" }, Oy = { class: "step-head" }, ky = {
	key: 0,
	class: "notice",
	role: "alert"
}, Ay = {
	key: 1,
	class: "small muted"
}, jy = ["viewBox"], My = ["d"], Ny = ["innerHTML"], Py = {
	key: 3,
	class: "small muted",
	style: { margin: "0" }
}, Fy = 1200, Iy = /* @__PURE__ */ B({
	__name: "StanchionPreview",
	emits: ["close"],
	setup(e, { emit: t }) {
		let n = _v(), r = t, i = /* @__PURE__ */ R(""), a = /* @__PURE__ */ R(!1), o = /* @__PURE__ */ R(null), s = /* @__PURE__ */ R(0), c = null;
		ar(async () => {
			c = new ResizeObserver(() => {
				o.value && (s.value = o.value.clientWidth / Sy.box.width);
			});
			try {
				i.value = await n.previewSvg();
			} catch {
				a.value = !0;
				return;
			}
			await gn(), o.value && c.observe(o.value);
		}), cr(() => c?.disconnect());
		let l = Y(() => {
			let e = n.view.value.doc?.root;
			return {
				width: e?.width ?? Sy.fits.width,
				height: e?.height ?? Sy.fits.height
			};
		}), u = Y(() => {
			let { width: e, height: t } = l.value, n = Math.max(e, t), r = {
				width: Fy * e / n,
				height: Fy * t / n
			};
			return {
				plate: r,
				transform: Ey(r.width, r.height, Ty(e, t))
			};
		}), d = Y(() => ({
			width: `${Sy.box.width}px`,
			height: `${Sy.box.height}px`,
			transform: `scale(${s.value || .001})`
		})), f = Y(() => ({
			left: `${-Sy.box.x}px`,
			top: `${-Sy.box.y}px`,
			width: `${u.value.plate.width}px`,
			height: `${u.value.plate.height}px`,
			transform: u.value.transform
		}));
		return (e, t) => (U(), W("div", {
			class: "scale-backdrop",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Your sign on a stanchion",
			onClick: t[1] ||= fo((e) => r("close"), ["self"])
		}, [K("div", Dy, [
			K("div", Oy, [t[2] ||= K("h2", { class: "grow" }, "Your sign, on a stanchion", -1), K("button", {
				class: "icon-btn",
				"aria-label": "Close",
				onClick: t[0] ||= (e) => r("close")
			}, "×")]),
			a.value ? (U(), W("p", ky, "The artwork could not be prepared. Please try again.")) : i.value ? J("", !0) : (U(), W("p", Ay, "Preparing the artwork…")),
			i.value ? (U(), W("div", {
				key: 2,
				ref_key: "stage",
				ref: o,
				class: "scale-stage stanchion-stage",
				style: M({ aspectRatio: `${z(Sy).box.width} / ${z(Sy).box.height}` })
			}, [K("div", {
				class: "stanchion-layer",
				style: M(d.value)
			}, [(U(), W("svg", {
				class: "stanchion-frame",
				viewBox: `${z(Sy).box.x} ${z(Sy).box.y} ${z(Sy).box.width} ${z(Sy).box.height}`,
				"aria-hidden": "true"
			}, [K("path", {
				d: z(Sy).path,
				"fill-rule": "evenodd"
			}, null, 8, My)], 8, jy)), K("div", {
				class: "stanchion-sign",
				style: M(f.value),
				innerHTML: i.value
			}, null, 12, Ny)], 4)], 4)) : J("", !0),
			i.value ? (U(), W("p", Py, F(l.value.width) + " × " + F(l.value.height) + " mm, in an A-frame stanchion. ", 1)) : J("", !0)
		])]));
	}
}), Ly = {
	class: "card",
	"aria-labelledby": "size-heading"
}, Ry = { class: "step-head" }, zy = { class: "step-no" }, By = {
	class: "chips",
	role: "group",
	"aria-label": "Sign size in millimetres"
}, Vy = [
	"aria-pressed",
	"title",
	"onClick"
], Hy = {
	key: 0,
	class: "custom-size"
}, Uy = {
	class: "label",
	id: "custom-label"
}, Wy = {
	class: "row-controls",
	role: "group",
	"aria-labelledby": "custom-label"
}, Gy = ["min", "max"], Ky = ["min", "max"], qy = [
	"aria-pressed",
	"aria-label",
	"title"
], Jy = {
	viewBox: "0 0 20 20",
	width: "18",
	height: "18",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"aria-hidden": "true"
}, Yy = {
	key: 0,
	d: "M7 9V6.5a3 3 0 0 1 6 0V9"
}, Xy = {
	key: 1,
	d: "M7 9V6.5a3 3 0 0 1 5.8-1.1"
}, Zy = {
	class: "small muted",
	style: { margin: "0" }
}, Qy = /* @__PURE__ */ B({
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
		let n = e, r = t, i = /* @__PURE__ */ R(n.dimensions.width), a = /* @__PURE__ */ R(n.dimensions.height), o = /* @__PURE__ */ R(!0);
		Fn(() => n.dimensions, (e) => {
			i.value = e.width, a.value = e.height;
		});
		function s(e) {
			let t = n.dimensions, s = Iu(e === "width" ? i.value : a.value, e, t, o.value);
			i.value = s.width, a.value = s.height, (s.width !== t.width || s.height !== t.height) && r("custom", s.width, s.height);
		}
		return (t, n) => (U(), W("section", Ly, [
			K("div", Ry, [K("span", zy, F(e.step), 1), n[9] ||= K("h2", { id: "size-heading" }, "Size & material", -1)]),
			K("div", By, [(U(!0), W(H, null, V(e.sizes, (t) => (U(), W("button", {
				key: t.size_id,
				class: "chip",
				"aria-pressed": t.size_id === e.current,
				title: t.name,
				onClick: (e) => r("pick", t)
			}, F(t.width) + "×" + F(t.height), 9, Vy))), 128))]),
			e.custom ? (U(), W("div", Hy, [
				K("span", Uy, [n[12] ||= q(" Custom size (mm)", -1), e.current === null ? (U(), W(H, { key: 0 }, [n[10] ||= q(" · ", -1), n[11] ||= K("strong", null, "in use", -1)], 64)) : J("", !0)]),
				K("div", Wy, [
					n[14] ||= K("label", {
						class: "sr-only",
						for: "custom-w"
					}, "Width in millimetres", -1),
					kn(K("input", {
						id: "custom-w",
						"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
						class: "field compact size-input",
						type: "number",
						inputmode: "numeric",
						min: z(50),
						max: z(Pu),
						onChange: n[1] ||= (e) => s("width"),
						onFocus: n[2] ||= (e) => e.target.select(),
						onKeydown: n[3] ||= mo(fo((e) => e.target.blur(), ["prevent"]), ["enter"])
					}, null, 40, Gy), [[
						co,
						i.value,
						void 0,
						{ number: !0 }
					]]),
					n[15] ||= K("span", { "aria-hidden": "true" }, "×", -1),
					n[16] ||= K("label", {
						class: "sr-only",
						for: "custom-h"
					}, "Height in millimetres", -1),
					kn(K("input", {
						id: "custom-h",
						"onUpdate:modelValue": n[4] ||= (e) => a.value = e,
						class: "field compact size-input",
						type: "number",
						inputmode: "numeric",
						min: z(50),
						max: z(Pu),
						onChange: n[5] ||= (e) => s("height"),
						onFocus: n[6] ||= (e) => e.target.select(),
						onKeydown: n[7] ||= mo(fo((e) => e.target.blur(), ["prevent"]), ["enter"])
					}, null, 40, Ky), [[
						co,
						a.value,
						void 0,
						{ number: !0 }
					]]),
					K("button", {
						class: "icon-btn lock",
						"aria-pressed": o.value,
						"aria-label": o.value ? "Aspect ratio locked" : "Aspect ratio unlocked",
						title: o.value ? "Keeping the shape: click to unlock" : "Click to keep the shape",
						onClick: n[8] ||= (e) => o.value = !o.value
					}, [(U(), W("svg", Jy, [n[13] ||= K("rect", {
						x: "4",
						y: "9",
						width: "12",
						height: "8",
						rx: "1.5"
					}, null, -1), o.value ? (U(), W("path", Yy)) : (U(), W("path", Xy))]))], 8, qy)
				]),
				K("p", Zy, "Short side " + F(z(50)) + "–" + F(z(Nu)) + " mm, long side up to " + F(z(Pu)) + " mm. Press Enter to apply.", 1)
			])) : J("", !0),
			n[17] ||= K("label", {
				class: "label",
				for: "material"
			}, "Material", -1),
			n[18] ||= K("select", {
				id: "material",
				class: "field"
			}, [K("option", null, "Self Adhesive Vinyl Sticker"), K("option", null, "Heavy Duty Double Sided")], -1),
			n[19] ||= K("p", {
				class: "small muted",
				style: { margin: "0" }
			}, "Test site: materials and prices will come from the shop.", -1)
		]));
	}
}), $y = {
	class: "card",
	"aria-labelledby": "variant-heading"
}, eb = { class: "step-head" }, tb = { class: "step-no" }, nb = {
	class: "chips",
	role: "group",
	"aria-label": "Sign size"
}, rb = [
	"aria-pressed",
	"title",
	"onClick"
], ib = {
	class: "chips wide",
	role: "group",
	"aria-labelledby": "material-label"
}, ab = ["aria-pressed", "onClick"], ob = /* @__PURE__ */ B({
	__name: "VariantStep",
	props: { step: { default: 1 } },
	setup(e) {
		let t = e, n = _v(), r = n.variantSizes, i = n.variantChoice, a = Y(() => r.value.find((e) => e.size_id === i.value?.size_id) ?? r.value[0]), o = Y(() => a.value?.materials ?? []), s = (e) => n.chooseVariant(e, i.value?.material_id ?? 0), c = (e) => n.chooseVariant(a.value?.size_id ?? 0, e);
		return (e, n) => (U(), W("section", $y, [
			K("div", eb, [K("span", tb, F(t.step), 1), n[0] ||= K("h2", { id: "variant-heading" }, "Size & material", -1)]),
			K("div", nb, [(U(!0), W(H, null, V(z(r), (e) => (U(), W("button", {
				key: e.size_id,
				class: "chip",
				"aria-pressed": e.size_id === a.value?.size_id,
				title: e.name,
				onClick: (t) => s(e.size_id)
			}, F(e.width) + "×" + F(e.height), 9, rb))), 128))]),
			n[1] ||= K("span", {
				class: "label",
				id: "material-label"
			}, "Material", -1),
			K("div", ib, [(U(!0), W(H, null, V(o.value, (e) => (U(), W("button", {
				key: e.material_id,
				class: "chip",
				"aria-pressed": e.material_id === z(i)?.material_id,
				onClick: (t) => c(e.material_id)
			}, F(e.name), 9, ab))), 128))])
		]));
	}
}), sb = {
	class: "card outlined",
	"aria-labelledby": "picker-heading"
}, cb = { class: "step-head" }, lb = {
	id: "picker-heading",
	class: "grow"
}, ub = {
	class: "label",
	for: "symbol-search"
}, db = {
	key: 0,
	class: "tabs",
	role: "group",
	"aria-label": "Symbol categories"
}, fb = ["aria-pressed", "onClick"], pb = {
	class: "small muted",
	"aria-live": "polite"
}, mb = {
	key: 1,
	class: "notice",
	style: { margin: "0" }
}, hb = { class: "tiles" }, gb = [
	"aria-pressed",
	"aria-busy",
	"onClick"
], _b = ["src"], vb = { class: "name" }, yb = { class: "small muted" }, bb = {
	key: 2,
	class: "muted",
	style: { margin: "0" }
}, xb = /* @__PURE__ */ B({
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
		let n = e, r = Y(() => n.noun ?? "symbol"), i = Y(() => `${r.value}s`), a = Y(() => /^[aeiou]/i.test(r.value) ? "an" : "a"), o = t, s = /* @__PURE__ */ R(""), c = /* @__PURE__ */ R(n.preferred ?? "all"), l = /* @__PURE__ */ R(null);
		ar(() => l.value?.focus());
		let u = Y(() => {
			let e = n.categories.filter((e) => n.symbols.some((t) => t.category === e.key));
			return [{
				key: "all",
				title: "All"
			}, ...(n.preferred ? [...e.filter((e) => e.key === n.preferred), ...e.filter((e) => e.key !== n.preferred)] : e).map((e) => ({
				key: e.key,
				title: e.title
			}))];
		}), d = Y(() => s.value.trim() ? n.symbols.filter((e) => og(e, s.value)) : n.symbols.filter((e) => c.value === "all" || e.category === c.value));
		return (t, n) => (U(), W("section", sb, [
			K("div", cb, [K("h2", lb, "Choose " + F(a.value) + " " + F(r.value), 1), K("button", {
				class: "btn go",
				style: {
					height: "40px",
					"font-size": "15px"
				},
				onClick: n[0] ||= (e) => o("done")
			}, "Done")]),
			K("label", ub, "Search " + F(i.value) + " by what the sign is for", 1),
			kn(K("input", {
				id: "symbol-search",
				ref_key: "search",
				ref: l,
				"onUpdate:modelValue": n[1] ||= (e) => s.value = e,
				class: "field",
				style: { border: "2px solid var(--ink)" },
				placeholder: "e.g. smoking, forklift, ear protection",
				autocomplete: "off"
			}, null, 512), [[co, s.value]]),
			s.value.trim() ? J("", !0) : (U(), W("div", db, [(U(!0), W(H, null, V(u.value, (e) => (U(), W("button", {
				key: e.key,
				class: "tab",
				"aria-pressed": c.value === e.key,
				onClick: (t) => c.value = e.key
			}, F(e.title), 9, fb))), 128))])),
			K("div", pb, F(s.value.trim() ? `${d.value.length} match${d.value.length === 1 ? "" : "es"}` : `${d.value.length} ${i.value}`), 1),
			e.error ? (U(), W("p", mb, F(e.error), 1)) : J("", !0),
			K("div", hb, [(U(!0), W(H, null, V(d.value, (t) => (U(), W("button", {
				key: t.code,
				class: "tile",
				"aria-pressed": t.code === e.current,
				"aria-busy": e.busy === t.code,
				onClick: (e) => o("pick", t)
			}, [
				K("img", {
					src: t.url,
					alt: "",
					loading: "lazy"
				}, null, 8, _b),
				K("span", vb, F(t.name), 1),
				K("span", yb, F(t.code), 1)
			], 8, gb))), 128))]),
			d.value.length ? J("", !0) : (U(), W("p", bb, "No " + F(i.value) + " match “" + F(s.value) + "”.", 1)),
			K("button", {
				class: "btn go picker-done",
				onClick: n[2] ||= (e) => o("done")
			}, "Done")
		]));
	}
}), Sb = {
	class: "card",
	"aria-labelledby": "symbol-heading"
}, Cb = { class: "step-head" }, wb = {
	key: 0,
	class: "current-symbol"
}, Tb = ["src"], Eb = { style: { "font-weight": "600" } }, Db = { class: "small muted" }, Ob = /* @__PURE__ */ B({
	__name: "SymbolStep",
	props: { current: {} },
	emits: ["change"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (U(), W("section", Sb, [K("div", Cb, [
			r[1] ||= K("span", { class: "step-no" }, "2", -1),
			r[2] ||= K("h2", {
				id: "symbol-heading",
				class: "grow"
			}, "Symbol", -1),
			K("button", {
				class: "btn strong",
				onClick: r[0] ||= (e) => n("change")
			}, "Change symbol")
		]), e.current ? (U(), W("div", wb, [K("img", {
			src: e.current.url,
			alt: ""
		}, null, 8, Tb), K("div", null, [K("div", Eb, F(e.current.name), 1), K("div", Db, F(e.current.code) + " · ISO 7010", 1)])])) : J("", !0)]));
	}
}), kb = ["aria-label"], Ab = [
	"aria-pressed",
	"aria-label",
	"onClick"
], jb = {
	viewBox: "0 0 20 22",
	width: "18",
	height: "18",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"aria-hidden": "true"
}, Mb = ["d"], Nb = /* @__PURE__ */ B({
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
		return (e, t) => (U(), W("div", {
			class: "aligns",
			role: "group",
			"aria-label": `${n.label} alignment`
		}, [(U(), W(H, null, V(i, (e) => K("button", {
			key: e.key,
			"aria-pressed": n.align === e.key,
			"aria-label": `Align ${e.label}`,
			onClick: (t) => r("align", e.key)
		}, [(U(), W("svg", jb, [K("path", { d: e.path }, null, 8, Mb)]))], 8, Ab)), 64))], 8, kb));
	}
}), Pb = { style: {
	display: "flex",
	"flex-direction": "column",
	gap: "8px"
} }, Fb = ["for"], Ib = [
	"id",
	"value",
	"placeholder"
], Lb = { class: "line-controls" }, Rb = ["aria-label"], zb = ["title"], Bb = { key: 0 }, Vb = ["aria-label"], Hb = ["aria-pressed", "aria-label"], Ub = /* @__PURE__ */ B({
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
		return (e, t) => (U(), W("div", Pb, [
			K("label", {
				class: "label",
				for: n.id
			}, F(n.label), 9, Fb),
			K("input", {
				id: n.id,
				class: fe(["field", { caps: n.caps }]),
				value: n.text,
				placeholder: n.placeholder,
				autocomplete: "off",
				onInput: t[0] ||= (e) => r("text", e.target.value)
			}, null, 42, Ib),
			K("div", Lb, [
				K("button", {
					class: "stepper",
					"aria-label": `${n.label} smaller`,
					onClick: t[1] ||= (e) => r("bump", -1)
				}, "A−", 8, Rb),
				K("span", {
					class: "step-label",
					title: n.mm ? `Letters ${n.mm} mm tall` : ""
				}, [q(F(n.sizeLabel), 1), n.mm ? (U(), W("small", Bb, F(n.mm) + " mm", 1)) : J("", !0)], 8, zb),
				K("button", {
					class: "stepper",
					style: { "font-size": "17px" },
					"aria-label": `${n.label} larger`,
					onClick: t[2] ||= (e) => r("bump", 1)
				}, "A+", 8, Vb),
				K("button", {
					class: "stepper caps-toggle",
					"aria-pressed": n.caps,
					"aria-label": `${n.label} in capitals`,
					title: "CAPITALS",
					onClick: t[3] ||= (e) => r("caps", !n.caps)
				}, "AA", 8, Hb),
				Vi(Nb, {
					align: n.align,
					label: n.label,
					onAlign: t[4] ||= (e) => r("align", e)
				}, null, 8, ["align", "label"])
			])
		]));
	}
}), Wb = {
	class: "card",
	"aria-labelledby": "layout-heading"
}, Gb = [
	"aria-pressed",
	"title",
	"onClick"
], Kb = {
	key: 0,
	viewBox: "0 0 30 40",
	width: "30",
	height: "40",
	"aria-hidden": "true"
}, qb = {
	key: 1,
	viewBox: "0 0 30 40",
	width: "30",
	height: "40",
	"aria-hidden": "true"
}, Jb = {
	key: 2,
	viewBox: "0 0 40 30",
	width: "40",
	height: "30",
	"aria-hidden": "true"
}, Yb = {
	key: 3,
	viewBox: "0 0 40 30",
	width: "40",
	height: "30",
	"aria-hidden": "true"
}, Xb = /* @__PURE__ */ B({
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
		return (t, a) => (U(), W("section", Wb, [a[4] ||= K("div", { class: "step-head" }, [K("span", { class: "step-no" }, "1"), K("h2", { id: "layout-heading" }, "Layout")], -1), K("div", {
			class: fe(["layouts", { two: n.only?.length === 2 }]),
			role: "group",
			"aria-label": "Sign layout"
		}, [(U(!0), W(H, null, V(i.filter((e) => !n.only || n.only.includes(e.kind)), (t) => (U(), W("button", {
			key: t.kind,
			class: "layout-card",
			"aria-pressed": e.current === t.kind,
			title: t.hint,
			onClick: (e) => r("pick", t.kind)
		}, [t.kind === "single" ? (U(), W("svg", Kb, [...a[0] ||= [
			K("rect", {
				x: "0.5",
				y: "0.5",
				width: "29",
				height: "39",
				fill: "#fff",
				stroke: "currentColor"
			}, null, -1),
			K("circle", {
				cx: "15",
				cy: "10",
				r: "6",
				fill: "none",
				stroke: "#ED1C24",
				"stroke-width": "2"
			}, null, -1),
			K("rect", {
				x: "3",
				y: "19",
				width: "24",
				height: "18",
				fill: "#ED1C24"
			}, null, -1)
		]])) : t.kind === "multi" ? (U(), W("svg", qb, [...a[1] ||= [
			K("rect", {
				x: "0.5",
				y: "0.5",
				width: "29",
				height: "39",
				fill: "#fff",
				stroke: "currentColor"
			}, null, -1),
			K("circle", {
				cx: "9",
				cy: "10",
				r: "5",
				fill: "none",
				stroke: "#ED1C24",
				"stroke-width": "2"
			}, null, -1),
			K("path", {
				d: "M21 5 L26 15 L16 15 Z",
				fill: "#FFD200",
				stroke: "#1C1F23"
			}, null, -1),
			K("rect", {
				x: "3",
				y: "19",
				width: "24",
				height: "18",
				fill: "#ED1C24"
			}, null, -1)
		]])) : t.kind === "stacked" ? (U(), W("svg", Jb, [...a[2] ||= [Gi("<rect x=\"0.5\" y=\"0.5\" width=\"39\" height=\"29\" fill=\"#fff\" stroke=\"currentColor\"></rect><path d=\"M7 3 L12 12 L2 12 Z\" fill=\"#FFD200\" stroke=\"#1C1F23\"></path><rect x=\"15\" y=\"3\" width=\"22\" height=\"10\" fill=\"#FFD200\"></rect><circle cx=\"7\" cy=\"21\" r=\"5\" fill=\"none\" stroke=\"#ED1C24\" stroke-width=\"2\"></circle><rect x=\"15\" y=\"16\" width=\"22\" height=\"11\" fill=\"#ED1C24\"></rect>", 5)]])) : (U(), W("svg", Yb, [...a[3] ||= [Gi("<rect x=\"0.5\" y=\"0.5\" width=\"39\" height=\"29\" fill=\"#fff\" stroke=\"currentColor\"></rect><rect x=\"3\" y=\"3\" width=\"10\" height=\"11\" fill=\"#ED1C24\"></rect><rect x=\"15\" y=\"3\" width=\"10\" height=\"11\" fill=\"#056BB3\"></rect><rect x=\"27\" y=\"3\" width=\"10\" height=\"11\" fill=\"#FFD200\"></rect><rect x=\"3\" y=\"16\" width=\"10\" height=\"11\" fill=\"#ED1C24\"></rect><rect x=\"15\" y=\"16\" width=\"10\" height=\"11\" fill=\"#ED1C24\"></rect><rect x=\"27\" y=\"16\" width=\"10\" height=\"11\" fill=\"#099146\"></rect>", 7)]])), K("span", null, F(t.label), 1)], 8, Gb))), 128))], 2)]));
	}
}), Zb = {
	key: 0,
	class: "card hint-card",
	"aria-labelledby": "move-hint-heading"
}, Qb = {
	class: "hint-picture",
	viewBox: "0 0 96 64",
	width: "96",
	height: "64",
	role: "img",
	"aria-label": "A cell outlined with a dashed box moving to another place on the sign"
}, $b = { key: 0 }, ex = { key: 1 }, tx = {
	class: "grow",
	style: { "min-width": "0" }
}, nx = {
	id: "move-hint-heading",
	class: "hint-title"
}, rx = {
	class: "small",
	style: { margin: "2px 0 0" }
}, ix = "signs.moveHint.dismissed", ax = /* @__PURE__ */ B({
	__name: "MoveHint",
	props: { kind: {} },
	setup(e) {
		let t = e, n = /* @__PURE__ */ R((() => {
			try {
				return localStorage.getItem(ix) === "1";
			} catch {
				return !1;
			}
		})());
		function r() {
			n.value = !0;
			try {
				localStorage.setItem(ix, "1");
			} catch {}
		}
		return (e, i) => n.value ? J("", !0) : (U(), W("section", Zb, [(U(), W("svg", Qb, [i[2] ||= K("rect", {
			x: "1",
			y: "1",
			width: "94",
			height: "62",
			rx: "5",
			fill: "#fff",
			stroke: "#d9d7d0"
		}, null, -1), t.kind === "symbols" ? (U(), W("g", $b, [...i[0] ||= [Gi("<circle cx=\"22\" cy=\"22\" r=\"11\" fill=\"none\" stroke=\"#ED1C24\" stroke-width=\"3.4\"></circle><path d=\"M14 30 30 14\" stroke=\"#ED1C24\" stroke-width=\"3.4\" stroke-linecap=\"round\"></path><rect x=\"42\" y=\"8\" width=\"30\" height=\"28\" rx=\"4\" fill=\"#fff\" stroke=\"var(--focus)\" stroke-width=\"1.6\" stroke-dasharray=\"4 3\"></rect><path d=\"M57 13 69 33H45Z\" fill=\"#FFD200\" stroke=\"#1C1F23\" stroke-width=\"2\" stroke-linejoin=\"round\"></path><rect x=\"8\" y=\"42\" width=\"80\" height=\"14\" rx=\"3\" fill=\"#ED1C24\"></rect>", 5)]])) : (U(), W("g", ex, [...i[1] ||= [
			K("rect", {
				x: "8",
				y: "7",
				width: "80",
				height: "15",
				rx: "3",
				fill: "#099146"
			}, null, -1),
			K("rect", {
				x: "8",
				y: "26",
				width: "80",
				height: "14",
				rx: "3",
				fill: "#056BB3"
			}, null, -1),
			K("rect", {
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
			K("path", {
				d: "M48 52v-9m0 0-4 4m4-4 4 4",
				stroke: "var(--focus)",
				"stroke-width": "2",
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				fill: "none"
			}, null, -1)
		]]))])), K("div", tx, [
			K("h2", nx, F(t.kind === "symbols" ? "Reorder symbols" : "Move things around"), 1),
			K("p", rx, [t.kind === "symbols" ? (U(), W(H, { key: 0 }, [q(" Drag a symbol along the row to reorder it. The dashed box shows where it will land. ")], 64)) : (U(), W(H, { key: 1 }, [q(" Rest the pointer on the sign to see what can be moved, then drag one onto another to swap them. The dashed box shows where it will land. ")], 64))]),
			K("button", {
				class: "link",
				onClick: r
			}, "Got it")
		])]));
	}
}), ox = ["aria-label"], sx = ["aria-pressed"], cx = ["aria-pressed", "onClick"], lx = /* @__PURE__ */ B({
	__name: "ColourChoice",
	props: {
		categories: {},
		current: {},
		label: {},
		allowMatch: { type: Boolean },
		matchLabel: {}
	},
	emits: ["pick"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = Y(() => cd(n.categories)), a = /* @__PURE__ */ R(!1), o = Y(() => a.value || i.value.more.some((e) => e.key === n.current));
		return (t, n) => (U(), W("div", {
			class: "swatches",
			role: "group",
			"aria-label": e.label
		}, [
			e.allowMatch ? (U(), W("button", {
				key: 0,
				class: "swatch",
				"aria-pressed": e.current === null,
				onClick: n[0] ||= (e) => r("pick", null)
			}, [n[2] ||= K("span", {
				class: "dot match",
				"aria-hidden": "true"
			}, null, -1), q(F(e.matchLabel ?? "Match symbol"), 1)], 8, sx)) : J("", !0),
			(U(!0), W(H, null, V(o.value ? [...i.value.main, ...i.value.more] : i.value.main, (t) => (U(), W("button", {
				key: t.key,
				class: "swatch",
				"aria-pressed": e.current === t.key,
				onClick: (e) => r("pick", t.key)
			}, [K("span", {
				class: "dot",
				style: M({ background: t.panel.hex }),
				"aria-hidden": "true"
			}, null, 4), q(F(t.title), 1)], 8, cx))), 128)),
			i.value.more.length && !o.value ? (U(), W("button", {
				key: 1,
				class: "link",
				onClick: n[1] ||= (e) => a.value = !0
			}, "More colours")) : J("", !0)
		], 8, ox));
	}
}), ux = { class: "line-editor" }, dx = { class: "row-controls" }, fx = ["for"], px = ["for"], mx = ["id", "value"], hx = ["value"], gx = [
	"id",
	"rows",
	"value"
], _x = { class: "line-controls" }, vx = ["aria-label"], yx = ["title"], bx = { key: 0 }, xx = ["aria-label"], Sx = ["aria-pressed", "aria-label"], Cx = ["aria-pressed", "aria-label"], wx = { class: "row-controls" }, Tx = ["for"], Ex = [
	"id",
	"min",
	"max",
	"step",
	"value",
	"disabled"
], Dx = ["disabled"], Ox = { class: "row-controls" }, kx = ["for"], Ax = [
	"id",
	"min",
	"max",
	"value"
], jx = ["disabled"], Mx = {
	key: 0,
	class: "small muted",
	style: { margin: "0" }
}, Nx = { class: "check small-check" }, Px = ["checked"], Fx = { class: "row-controls" }, Ix = ["disabled", "aria-label"], Lx = ["disabled", "aria-label"], Rx = /* @__PURE__ */ B({
	__name: "LineEditor",
	props: {
		block: {},
		index: {},
		count: {},
		nudgeRange: {}
	},
	setup(e) {
		let t = e, n = _v(), r = Y(() => t.block.id), i = Y(() => n.lineInfo(r.value)), a = Y(() => `Line ${t.index + 1}`), o = Y(() => Math.min(3, Math.max(1, t.block.text.split("\n").length))), s = [
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
		], c = Y(() => {
			for (let e of n.view.value.report?.sections ?? []) {
				let t = e.blocks.find((e) => e.id === r.value);
				if (t) return t.y_offset;
			}
			return {
				requested: 0,
				applied: 0
			};
		});
		return (t, l) => (U(), W("div", ux, [
			K("div", dx, [
				K("label", {
					class: "label grow",
					for: `text-${r.value}`
				}, F(a.value), 9, fx),
				K("label", {
					class: "sr-only",
					for: `role-${r.value}`
				}, F(a.value) + " style", 9, px),
				K("select", {
					id: `role-${r.value}`,
					class: "field compact",
					value: Od(e.block),
					onChange: l[0] ||= (e) => z(n).commit((t) => Dd(t, r.value, e.target.value))
				}, [(U(), W(H, null, V(s, (e) => K("option", {
					key: e.key,
					value: e.key
				}, F(e.label), 9, hx)), 64))], 40, mx)
			]),
			K("textarea", {
				id: `text-${r.value}`,
				class: fe(["field area", { caps: wd(e.block) }]),
				rows: o.value,
				value: e.block.text,
				placeholder: "Type your text",
				onInput: l[1] ||= (e) => z(n).commit((t) => bd(t, r.value, e.target.value), `text:${r.value}`)
			}, null, 42, gx),
			K("div", _x, [
				K("button", {
					class: "stepper",
					"aria-label": `${a.value} smaller`,
					onClick: l[2] ||= (e) => z(n).commit((e) => Ld(gu(e, r.value).block, i.value.step - 1))
				}, "A−", 8, vx),
				K("span", {
					class: "step-label",
					title: i.value.mm ? `Letters ${i.value.mm} mm tall` : ""
				}, [q(F(i.value.label), 1), i.value.mm ? (U(), W("small", bx, F(i.value.mm) + " mm", 1)) : J("", !0)], 8, yx),
				K("button", {
					class: "stepper",
					style: { "font-size": "17px" },
					"aria-label": `${a.value} larger`,
					onClick: l[3] ||= (e) => z(n).commit((e) => Ld(gu(e, r.value).block, i.value.step + 1))
				}, "A+", 8, xx),
				K("button", {
					class: "stepper bold-toggle",
					"aria-pressed": Cd(e.block),
					"aria-label": `${a.value} bold`,
					onClick: l[4] ||= (t) => z(n).commit((t) => Sd(t, r.value, !Cd(e.block)))
				}, "B", 8, Sx),
				K("button", {
					class: "stepper caps-toggle",
					"aria-pressed": wd(e.block),
					"aria-label": `${a.value} in capitals`,
					title: "CAPITALS",
					onClick: l[5] ||= (t) => z(n).commit((t) => Ed(t, r.value, !wd(e.block)))
				}, "AA", 8, Cx),
				Vi(Nb, {
					align: e.block.align,
					label: a.value,
					onAlign: l[6] ||= (e) => z(n).commit((t) => xd(t, r.value, e))
				}, null, 8, ["align", "label"])
			]),
			K("div", wx, [
				K("label", {
					class: "label",
					for: `spacing-${r.value}`,
					style: { "white-space": "nowrap" }
				}, "Line spacing", 8, Tx),
				K("input", {
					id: `spacing-${r.value}`,
					class: "grow",
					type: "range",
					min: Ad.min,
					max: Ad.max,
					step: Ad.step,
					value: e.block.line_spacing,
					disabled: i.value.lines < 2,
					onInput: l[7] ||= (e) => z(n).commit((t) => jd(t, r.value, Number(e.target.value)), `spacing:${r.value}`)
				}, null, 40, Ex),
				K("button", {
					class: "link",
					disabled: e.block.line_spacing === Ad.default,
					onClick: l[8] ||= (e) => z(n).commit((e) => jd(e, r.value, Ad.default))
				}, "Reset", 8, Dx)
			]),
			K("div", Ox, [
				K("label", {
					class: "label",
					for: `nudge-${r.value}`,
					style: { "white-space": "nowrap" }
				}, "Move up/down", 8, kx),
				K("input", {
					id: `nudge-${r.value}`,
					class: "grow",
					type: "range",
					min: -e.nudgeRange,
					max: e.nudgeRange,
					step: "0.5",
					value: e.block.y_offset,
					onInput: l[9] ||= (e) => z(n).commit((t) => Pd(t, r.value, Number(e.target.value)), `nudge:${r.value}`)
				}, null, 40, Ax),
				K("button", {
					class: "link",
					disabled: !e.block.y_offset,
					onClick: l[10] ||= (e) => z(n).commit((e) => Pd(e, r.value, 0))
				}, "Reset", 8, jx)
			]),
			c.value.requested === c.value.applied ? J("", !0) : (U(), W("p", Mx, " Moved as far as it fits (" + F(c.value.applied) + " mm). ", 1)),
			K("label", Nx, [K("input", {
				type: "checkbox",
				checked: Md(e.block),
				onChange: l[11] ||= (e) => z(n).commit((t) => Nd(t, r.value, e.target.checked))
			}, null, 40, Px), l[15] ||= q(" Pin to the bottom of the panel ", -1)]),
			K("div", Fx, [
				K("button", {
					class: "link",
					disabled: e.index === 0,
					"aria-label": `Move ${a.value.toLowerCase()} up`,
					onClick: l[12] ||= (e) => z(n).commit((e) => yd(e, r.value, -1))
				}, "↑ Up", 8, Ix),
				K("button", {
					class: "link",
					disabled: e.index === e.count - 1,
					"aria-label": `Move ${a.value.toLowerCase()} down`,
					onClick: l[13] ||= (e) => z(n).commit((e) => yd(e, r.value, 1))
				}, "↓ Down", 8, Lx),
				l[16] ||= K("span", { class: "grow" }, null, -1),
				K("button", {
					class: "link danger",
					onClick: l[14] ||= (e) => z(n).commit((e) => vd(e, r.value))
				}, "Remove line")
			])
		]));
	}
}), zx = { class: "row-controls" }, Bx = ["aria-expanded"], Vx = { class: "panel-name" }, Hx = {
	key: 0,
	class: "small muted panel-summary"
}, Ux = ["disabled"], Wx = ["disabled"], Gx = { class: "row-controls" }, Kx = ["title"], qx = {
	key: 0,
	class: "row-controls wrap"
}, Jx = ["for"], Yx = [
	"id",
	"min",
	"max",
	"value"
], Xx = {
	key: 1,
	class: "symbol-row"
}, Zx = ["src"], Qx = {
	class: "grow",
	style: { "min-width": "0" }
}, $x = { class: "symbol-name" }, eS = { class: "small muted" }, tS = { class: "row-controls wrap" }, nS = ["for"], rS = [
	"id",
	"min",
	"max",
	"value"
], iS = /* @__PURE__ */ B({
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
		let t = e, n = _v(), r = Y(() => ed(t.panel)), i = Y(() => t.panel.lead?.symbol.symbol_code ?? ""), a = Y(() => md(t.panel)), o = Y(() => _d(t.panel)), s = Y(() => o.value || t.panel.blocks.length < 4);
		function c() {
			n.commit((e) => o.value ? gd(e, l.value) : ud(e, l.value));
		}
		let l = Y(() => t.panel.id), u = Y(() => n.product.value?.roadsign ?? !1), d = Y(() => t.panel.blocks.map((e) => e.text.trim()).filter(Boolean).join(" · ") || "No text yet");
		function f() {
			n.selection.section = t.sectionIndex, n.selection.panel = t.index;
		}
		return (t, p) => (U(), W("div", { class: fe(["panel-editor", { expanded: e.expanded }]) }, [
			K("div", zx, [K("button", {
				class: "panel-title grow",
				"aria-expanded": e.expanded,
				onClick: f
			}, [K("span", Vx, [q("Panel " + F(e.index + 1), 1), e.count > 1 ? (U(), W(H, { key: 0 }, [q(" of " + F(e.count), 1)], 64)) : J("", !0)]), e.expanded ? J("", !0) : (U(), W("span", Hx, F(d.value), 1))], 8, Bx), e.count > 1 ? (U(), W(H, { key: 0 }, [
				K("button", {
					class: "link",
					disabled: e.index === 0,
					"aria-label": "Move panel up",
					onClick: p[0] ||= (t) => {
						z(n).commit((e) => ad(e, l.value, -1)), z(n).selection.panel = e.index - 1;
					}
				}, "↑", 8, Ux),
				K("button", {
					class: "link",
					disabled: e.index === e.count - 1,
					"aria-label": "Move panel down",
					onClick: p[1] ||= (t) => {
						z(n).commit((e) => ad(e, l.value, 1)), z(n).selection.panel = e.index + 1;
					}
				}, "↓", 8, Wx),
				K("button", {
					class: "link danger",
					onClick: p[2] ||= (e) => z(n).commit((e) => id(e, l.value))
				}, "Remove")
			], 64)) : J("", !0)]),
			e.expanded ? (U(), W(H, { key: 0 }, [
				u.value ? J("", !0) : (U(), W(H, { key: 0 }, [p[10] ||= K("span", { class: "label" }, "Panel colour", -1), Vi(lx, {
					categories: z(n).categories.value,
					current: e.panel.category ?? null,
					label: `Panel ${e.index + 1} colour`,
					"allow-match": "",
					onPick: p[3] ||= (e) => z(n).commit((t) => od(t, l.value, e))
				}, null, 8, [
					"categories",
					"current",
					"label"
				])], 64)),
				(U(!0), W(H, null, V(e.panel.blocks, (t, n) => (U(), G(Rx, {
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
				K("div", Gx, [e.panel.blocks.length < 4 ? (U(), W("button", {
					key: 0,
					class: "btn dashed",
					onClick: p[4] ||= (e) => z(n).commit((e) => ld(e, l.value))
				}, "+ Add text line")) : J("", !0), s.value && !r.value ? (U(), W("button", {
					key: 1,
					class: "btn dashed",
					title: o.value ? "Take the white box away" : "A white box to write in with a pen — type in it and it prints instead",
					onClick: c
				}, F(o.value ? "− Remove the write-on box" : "+ Add a box to write in"), 9, Kx)) : J("", !0)])
			], 64)) : J("", !0),
			e.expanded ? (U(), W(H, { key: 1 }, [
				o.value ? (U(), W("div", qx, [
					K("label", {
						class: "label",
						for: `box-${l.value}`,
						style: { "white-space": "nowrap" }
					}, "Box height", 8, Jx),
					K("input", {
						id: `box-${l.value}`,
						type: "range",
						min: dd,
						max: 8,
						step: "0.1",
						value: a.value ?? 1.3,
						onInput: p[5] ||= (e) => z(n).commit((t) => fd(t, l.value, Number(e.target.value)), `box:${l.value}`)
					}, null, 40, Yx),
					K("button", {
						class: "link",
						onClick: p[6] ||= (e) => z(n).commit((e) => pd(e, l.value))
					}, "Fill the space")
				])) : J("", !0),
				r.value && i.value ? (U(), W("div", Xx, [
					z(n).symbolEntry(i.value) ? (U(), W("img", {
						key: 0,
						src: z(n).symbolEntry(i.value).url,
						alt: ""
					}, null, 8, Zx)) : J("", !0),
					K("div", Qx, [K("div", $x, F(z(n).symbolEntry(i.value)?.name ?? i.value), 1), K("div", eS, F(i.value) + " · in this panel", 1)]),
					K("button", {
						class: "btn small-btn strong",
						onClick: p[7] ||= (e) => z(n).openPanelSymbol(l.value)
					}, "Change")
				])) : J("", !0),
				K("div", tS, [
					K("label", {
						class: "label",
						for: `grow-${l.value}`,
						style: { "white-space": "nowrap" }
					}, "Panel height", 8, nS),
					K("input", {
						id: `grow-${l.value}`,
						type: "range",
						min: rd,
						max: 3,
						step: "0.05",
						value: e.panel.grow,
						onInput: p[8] ||= (e) => z(n).commit((t) => nd(t, l.value, Number(e.target.value)), `grow:${l.value}`)
					}, null, 40, rS),
					K("button", {
						class: "link",
						onClick: p[9] ||= (e) => z(n).commit((e) => nd(e, l.value, 1))
					}, "Reset")
				])
			], 64)) : J("", !0)
		], 2));
	}
}), aS = {
	id: "part-editor",
	class: "card selected-card",
	"aria-labelledby": "part-heading"
}, oS = { class: "step-head" }, sS = ["aria-label"], cS = {
	key: 1,
	class: "step-no"
}, lS = ["aria-label"], uS = {
	key: 0,
	class: "row-controls wrap"
}, dS = ["aria-pressed"], fS = ["disabled"], pS = ["disabled"], mS = ["disabled"], hS = ["disabled"], gS = { class: "sub-head" }, _S = ["src"], vS = {
	class: "grow",
	style: { "min-width": "0" }
}, yS = { class: "symbol-name" }, bS = { class: "small muted" }, xS = ["disabled", "onClick"], SS = ["disabled", "onClick"], CS = ["onClick"], wS = ["aria-label", "onClick"], TS = {
	key: 3,
	class: "row-controls"
}, ES = ["for"], DS = [
	"id",
	"min",
	"max",
	"value"
], OS = {
	key: 4,
	class: "small muted",
	style: { margin: "-6px 0 0" }
}, kS = {
	key: 5,
	class: "row-controls wrap"
}, AS = /* @__PURE__ */ B({
	__name: "PartEditor",
	setup(e) {
		let t = _v(), n = t.selection, r = () => t.view.value.doc, i = Y(() => yu(r())), a = Y(() => r().root.sections), o = Y(() => t.product.value?.roadsign ?? !1), s = Y(() => t.product.value?.fireaction ?? !1), c = Y(() => s.value ? 1 : 4), l = Y(() => t.board.steps.value[p.value] ?? null), u = Y(() => o.value ? "arrow" : "symbol"), d = (e) => e[0].toUpperCase() + e.slice(1), f = Y(() => Gp(r())), p = Y(() => f.value ? a.value.indexOf(f.value.source) : Math.min(n.section, a.value.length - 1)), m = Y(() => a.value[p.value]), h = Y(() => m.value.symbol_frame?.symbols ?? []), g = Y(() => !f.value && (i.value === "grid" || i.value === "stacked" || i.value === "board")), _ = Y(() => i.value === "stacked" ? "section" : "cell"), v = Y(() => i.value === "board" ? lg(r())[ug(r(), p.value)] ?? null : null), y = Y(() => {
			let e = v.value;
			return !e || e.cells < 2 ? null : p.value === e.start ? e.start + 1 : e.start;
		}), b = Y(() => {
			let e = v.value;
			return e ? e.cells > 1 ? `Row ${e.index + 1}: ${p.value === e.start ? "left" : "right"} cell` : `Row ${e.index + 1}` : g.value ? `Editing ${_.value} ${p.value + 1} of ${a.value.length}` : f.value ? "Symbols & English text" : "Symbols & text";
		}), x = Y(() => Of(r())), S = Y(() => {
			let e = r().root.layout;
			return e.type === "grid" ? e : null;
		}), C = Y(() => t.shareRange()), w = (e) => {
			n.section = (p.value + e + a.value.length) % a.value.length, n.panel = 0;
		};
		function T(e) {
			let r = p.value + e;
			if (r < 0 || r >= a.value.length) return;
			let i = p.value;
			t.commit((e) => S.value ? Vu(e, i, r) : Bu(e, i, r)), n.section = r;
		}
		function E() {
			let e = 0;
			t.commit((t) => {
				e = Ru(t, p.value);
			}), n.section = e, n.panel = 0;
		}
		function D() {
			let e = m.value.text_frame.panels.length;
			t.commit((e) => Qu(e, m.value.id)), n.panel = e;
		}
		let O = () => m.value.id;
		return (e, i) => (U(), W("section", aS, [
			K("div", oS, [
				g.value ? (U(), W("button", {
					key: 0,
					class: "icon-btn",
					"aria-label": `Previous ${_.value}`,
					onClick: i[0] ||= (e) => w(-1)
				}, "‹", 8, sS)) : (U(), W("span", cS, F(z(t).product.value?.bilingual ? 5 : 4), 1)),
				K("h2", {
					id: "part-heading",
					class: "grow",
					style: M(g.value ? "text-align: center;" : "")
				}, F(b.value), 5),
				g.value ? (U(), W("button", {
					key: 2,
					class: "icon-btn",
					"aria-label": `Next ${_.value}`,
					onClick: i[1] ||= (e) => w(1)
				}, "›", 8, lS)) : J("", !0)
			]),
			g.value ? (U(), W("div", uS, [v.value ? (U(), W(H, { key: 0 }, [
				y.value === null ? J("", !0) : (U(), W("button", {
					key: 0,
					class: "btn small-btn",
					onClick: i[2] ||= (e) => {
						z(t).commit((e) => Og(e, p.value, y.value)), z(n).section = y.value;
					}
				}, "⇄ Swap sides")),
				K("button", {
					class: "btn small-btn",
					onClick: i[3] ||= (e) => z(t).commit((e) => Uu(e, p.value))
				}, "Clear text"),
				s.value ? (U(), W("button", {
					key: 1,
					class: "btn small-btn",
					"aria-pressed": l.value !== null,
					onClick: i[4] ||= (e) => z(t).board.toggleStep(p.value)
				}, F(l.value === null ? "Number this step" : `Step ${l.value} — take the number away`), 9, dS)) : J("", !0),
				i[14] ||= K("span", { class: "small muted" }, "Rows are added and moved in the Rows card above.", -1)
			], 64)) : (U(), W(H, { key: 1 }, [
				K("button", {
					class: "btn small-btn",
					disabled: p.value === 0,
					onClick: i[5] ||= (e) => T(-1)
				}, F(S.value ? "← Swap back" : "↑ Move up"), 9, fS),
				K("button", {
					class: "btn small-btn",
					disabled: p.value === a.value.length - 1,
					onClick: i[6] ||= (e) => T(1)
				}, F(S.value ? "Swap forward →" : "↓ Move down"), 9, pS),
				S.value ? (U(), W(H, { key: 0 }, [K("button", {
					class: "btn small-btn",
					onClick: i[7] ||= (e) => z(t).commit((e) => Hu(e, p.value))
				}, "Copy to all cells"), K("button", {
					class: "btn small-btn",
					onClick: i[8] ||= (e) => z(t).commit((e) => Uu(e, p.value))
				}, "Clear text")], 64)) : (U(), W(H, { key: 1 }, [K("button", {
					class: "btn small-btn",
					disabled: a.value.length >= 4,
					onClick: E
				}, "+ Add section", 8, mS), K("button", {
					class: "btn small-btn danger",
					disabled: a.value.length <= 1,
					onClick: i[9] ||= (e) => z(t).commit((e) => zu(e, p.value))
				}, "Remove section", 8, hS)], 64))
			], 64))])) : J("", !0),
			K("div", gS, F(d(h.value.length === 1 ? u.value : `${u.value}s`)), 1),
			(U(!0), W(H, null, V(h.value, (e, n) => (U(), W("div", {
				key: e.id,
				class: "symbol-row"
			}, [
				z(t).symbolEntry(e.symbol_code) ? (U(), W("img", {
					key: 0,
					src: z(t).symbolEntry(e.symbol_code).url,
					alt: ""
				}, null, 8, _S)) : J("", !0),
				K("div", vS, [K("div", yS, F(z(t).symbolEntry(e.symbol_code)?.name ?? e.symbol_code), 1), K("div", bS, F(e.symbol_code), 1)]),
				h.value.length > 1 ? (U(), W(H, { key: 1 }, [K("button", {
					class: "icon-btn",
					disabled: n === 0,
					"aria-label": "Move symbol earlier",
					onClick: (e) => z(t).commit((e) => qu(e, O(), n, n - 1))
				}, "‹", 8, xS), K("button", {
					class: "icon-btn",
					disabled: n === h.value.length - 1,
					"aria-label": "Move symbol later",
					onClick: (e) => z(t).commit((e) => qu(e, O(), n, n + 1))
				}, "›", 8, SS)], 64)) : J("", !0),
				K("button", {
					class: "btn small-btn strong",
					onClick: (e) => z(t).openPicker({
						sectionId: O(),
						index: n
					})
				}, "Change", 8, CS),
				K("button", {
					class: "icon-btn danger",
					"aria-label": `Remove ${e.symbol_code}`,
					onClick: (e) => z(t).commit((e) => Ku(e, O(), n))
				}, "×", 8, wS)
			]))), 128)),
			!h.value.length && !o.value ? (U(), W(H, { key: 1 }, [i[15] ||= K("p", {
				class: "small muted",
				style: { margin: "0" }
			}, "Text only. Colour:", -1), Vi(lx, {
				categories: z(t).categories.value,
				current: m.value.category ?? null,
				label: "Section colour",
				onPick: i[10] ||= (e) => e && z(t).commit((t) => Zu(t, O(), e))
			}, null, 8, ["categories", "current"])], 64)) : J("", !0),
			h.value.length < c.value ? (U(), W("button", {
				key: 2,
				class: "btn dashed",
				onClick: i[11] ||= (e) => z(t).openPicker({
					sectionId: O(),
					index: "new"
				})
			}, "+ Add " + F(u.value), 1)) : J("", !0),
			h.value.length ? (U(), W("div", TS, [K("label", {
				class: "label",
				for: `share-${m.value.id}`,
				style: { "white-space": "nowrap" }
			}, F(d(u.value)) + " size", 9, ES), K("input", {
				id: `share-${m.value.id}`,
				class: "grow",
				type: "range",
				min: C.value.min,
				max: C.value.max,
				step: "0.005",
				value: m.value.symbol_share,
				onInput: i[12] ||= (e) => z(t).commit((t) => Xu(t, O(), Number(e.target.value)), `share:${O()}`)
			}, null, 40, DS)])) : J("", !0),
			h.value.length && g.value && Ju(r()) ? (U(), W("p", OS, F(d(u.value)) + " size applies to every " + F(_.value) + " while they are lined up. ", 1)) : J("", !0),
			i[16] ||= K("div", { class: "sub-head" }, "Text", -1),
			(U(!0), W(H, null, V(m.value.text_frame.panels, (e, t) => (U(), G(iS, {
				key: e.id,
				panel: e,
				index: t,
				count: m.value.text_frame.panels.length,
				"section-index": p.value,
				expanded: t === z(n).panel,
				"nudge-range": x.value
			}, null, 8, [
				"panel",
				"index",
				"count",
				"section-index",
				"expanded",
				"nudge-range"
			]))), 128)),
			m.value.text_frame.panels.length < 4 && !o.value && !s.value ? (U(), W("div", kS, [K("button", {
				class: "btn dashed",
				onClick: D
			}, "+ Add panel"), K("button", {
				class: "btn dashed",
				title: "A band with a symbol in it rather than wording — an arrow under the message, say",
				onClick: i[13] ||= (e) => z(t).openNewPanelSymbol(m.value.id)
			}, "+ Add symbol panel")])) : J("", !0)
		]));
	}
}), jS = {
	class: "card",
	"aria-labelledby": "sign-heading"
}, MS = {
	key: 0,
	class: "row-controls"
}, NS = ["value"], PS = ["value"], FS = ["value"], IS = ["value"], LS = {
	key: 1,
	class: "row-controls"
}, RS = {
	class: "label",
	id: "position-label"
}, zS = {
	class: "segmented",
	role: "group",
	"aria-labelledby": "position-label"
}, BS = ["aria-pressed", "onClick"], VS = {
	key: 2,
	class: "check"
}, HS = ["checked"], US = {
	key: 3,
	class: "check"
}, WS = ["checked"], GS = {
	key: 4,
	class: "check"
}, KS = ["checked"], qS = { class: "row-controls" }, JS = {
	class: "segmented",
	role: "group",
	"aria-labelledby": "background-label"
}, YS = ["aria-pressed"], XS = ["aria-pressed"], ZS = {
	key: 5,
	class: "check small-check"
}, QS = ["checked"], $S = { class: "check" }, eC = ["checked"], tC = { class: "check" }, nC = ["checked"], rC = {
	key: 6,
	class: "row-controls wrap"
}, iC = [
	"min",
	"max",
	"value"
], aC = { class: "small muted" }, oC = /* @__PURE__ */ B({
	__name: "SignOptions",
	setup(e) {
		let t = _v(), n = () => t.view.value.doc, r = Y(() => yu(n())), i = Y(() => Kp(n())), a = Y(() => {
			let e = n().root.layout;
			return e.type === "grid" && !i.value ? e : null;
		}), o = Array.from({ length: 4 }, (e, t) => t + 1), s = Y(() => n().root.sections.some((e) => e.symbol_frame)), c = Y(() => ({
			mm: cf(n()),
			min: rf(n()),
			max: nf(n())
		})), l = Y(() => wu(n())), u = [
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
		return (e, i) => (U(), W("section", jS, [
			i[22] ||= K("div", { class: "step-head" }, [K("span", { class: "step-no" }, "3"), K("h2", { id: "sign-heading" }, "Whole sign")], -1),
			a.value ? (U(), W("div", MS, [
				i[12] ||= K("label", {
					class: "label",
					for: "grid-rows"
				}, "Rows", -1),
				K("select", {
					id: "grid-rows",
					class: "field compact",
					value: a.value.rows,
					onChange: i[0] ||= (e) => z(t).commit((t) => ju(t, Number(e.target.value), a.value.cols))
				}, [(U(!0), W(H, null, V(z(o), (e) => (U(), W("option", {
					key: e,
					value: e
				}, F(e), 9, PS))), 128))], 40, NS),
				i[13] ||= K("label", {
					class: "label",
					for: "grid-cols"
				}, "Columns", -1),
				K("select", {
					id: "grid-cols",
					class: "field compact",
					value: a.value.cols,
					onChange: i[1] ||= (e) => z(t).commit((t) => ju(t, a.value.rows, Number(e.target.value)))
				}, [(U(!0), W(H, null, V(z(o), (e) => (U(), W("option", {
					key: e,
					value: e
				}, F(e), 9, IS))), 128))], 40, FS)
			])) : J("", !0),
			s.value ? (U(), W("div", LS, [K("span", RS, "Symbol" + F(r.value === "single" ? "" : "s"), 1), K("div", zS, [(U(), W(H, null, V(u, (e) => K("button", {
				key: e.key,
				"aria-pressed": l.value === e.key,
				onClick: (n) => z(t).commit((t) => Tu(t, e.key))
			}, F(e.label), 9, BS)), 64))])])) : J("", !0),
			a.value ? (U(), W("label", VS, [K("input", {
				type: "checkbox",
				checked: a.value.sync_text,
				onChange: i[2] ||= (e) => z(t).commit((t) => gf(t, e.target.checked))
			}, null, 40, HS), i[14] ||= q(" Same text size in every cell ", -1)])) : J("", !0),
			r.value === "grid" || r.value === "stacked" ? (U(), W("label", US, [K("input", {
				type: "checkbox",
				checked: Ju(n()),
				onChange: i[3] ||= (e) => z(t).commit((t) => Yu(t, e.target.checked))
			}, null, 40, WS), i[15] ||= q(" Line up symbols and panels ", -1)])) : J("", !0),
			n().root.layout.type === "grid" ? (U(), W("label", GS, [K("input", {
				type: "checkbox",
				checked: _f(n()),
				onChange: i[4] ||= (e) => z(t).commit((t) => vf(t, e.target.checked))
			}, null, 40, KS), i[16] ||= q(" Outline round each cell ", -1)])) : J("", !0),
			K("div", qS, [i[17] ||= K("span", {
				class: "label",
				id: "background-label"
			}, "Background", -1), K("div", JS, [K("button", {
				"aria-pressed": zd(n()) === "white",
				onClick: i[5] ||= (e) => z(t).commit((e) => Qd(e, "white", z(t).categories.value))
			}, "White", 8, YS), K("button", {
				"aria-pressed": zd(n()) === "colour",
				onClick: i[6] ||= (e) => z(t).commit((e) => Qd(e, "colour", z(t).categories.value))
			}, "All colour", 8, XS)])]),
			zd(n()) === "colour" && s.value ? (U(), W("label", ZS, [K("input", {
				type: "checkbox",
				checked: Yd(n().root.sections[0]),
				onChange: i[7] ||= (e) => z(t).commit((t) => Xd(t, e.target.checked))
			}, null, 40, QS), i[18] ||= q(" White panel behind the symbol ", -1)])) : J("", !0),
			K("label", $S, [K("input", {
				type: "checkbox",
				checked: mf(n(), z(t).roundedByDefault()),
				onChange: i[8] ||= (e) => z(t).commit((t) => hf(t, e.target.checked))
			}, null, 40, eC), i[19] ||= q(" Rounded panel corners ", -1)]),
			K("label", tC, [K("input", {
				type: "checkbox",
				checked: $d(n()),
				onChange: i[9] ||= (e) => z(t).commit((t) => ef(t, e.target.checked))
			}, null, 40, nC), i[20] ||= q(" Border round the sign ", -1)]),
			$d(n()) ? (U(), W("div", rC, [
				i[21] ||= K("label", {
					class: "label",
					for: "sign-border"
				}, "Border width", -1),
				K("input", {
					id: "sign-border",
					type: "range",
					min: c.value.min,
					max: c.value.max,
					step: "any",
					value: c.value.mm,
					onInput: i[10] ||= (e) => z(t).commit((t) => pf(t, Number(e.target.value)), "border")
				}, null, 40, iC),
				K("span", aC, F(c.value.mm.toFixed(1)) + " mm", 1)
			])) : J("", !0),
			$d(n()) ? (U(), G(lx, {
				key: 7,
				categories: uf(z(t).categories.value),
				current: df(n(), z(t).categories.value),
				label: "Border colour",
				"allow-match": "",
				"match-label": "Automatic",
				onPick: i[11] ||= (e) => z(t).commit((n) => ff(n, e, z(t).categories.value))
			}, null, 8, ["categories", "current"])) : J("", !0)
		]));
	}
}), sC = {
	id: "translation-card",
	class: "card",
	"aria-labelledby": "translation-heading"
}, cC = { class: "step-head" }, lC = { class: "step-no" }, uC = ["value"], dC = ["value"], fC = {
	class: "segmented",
	role: "group",
	"aria-label": "Arrangement"
}, pC = ["aria-pressed"], mC = ["aria-pressed"], hC = {
	class: "label",
	id: "tr-order"
}, gC = {
	class: "segmented",
	role: "group",
	"aria-labelledby": "tr-order"
}, _C = ["aria-pressed"], vC = ["aria-pressed"], yC = ["for"], bC = { class: "tr-source" }, xC = [
	"id",
	"lang",
	"rows",
	"value",
	"disabled",
	"placeholder",
	"aria-busy",
	"onInput"
], SC = {
	key: 0,
	class: "row-controls wrap small"
}, CC = ["onClick"], wC = ["onClick"], TC = {
	key: 1,
	class: "small muted"
}, EC = {
	key: 0,
	class: "spinner",
	"aria-hidden": "true"
}, DC = { class: "row-controls wrap" }, OC = { class: "check-box" }, kC = { style: { margin: "0" } }, AC = {
	class: "check",
	style: { "font-weight": "600" }
}, jC = ["checked"], MC = /* @__PURE__ */ B({
	__name: "TranslationCard",
	props: { step: {} },
	setup(e) {
		let t = _v(), n = () => t.view.value.doc, r = Y(() => Gp(n())), i = Y(() => rm(n())), a = Y(() => r.value?.target.lang ?? ""), o = Y(() => Yp(n())), s = Y(() => fm(n())), c = Y(() => o.value === "side" ? "on the left" : "on top");
		function l(e) {
			t.commit((t) => tm(t, e)), t.prepareTranslation(e);
		}
		let u = Y(() => t.state.translating ? `Translating into ${Hp(a.value)}…` : t.state.translateError);
		return (n, d) => (U(), W("section", sC, [K("div", cC, [K("span", lC, F(e.step), 1), d[7] ||= K("h2", { id: "translation-heading" }, "Second language", -1)]), r.value ? (U(), W(H, { key: 0 }, [
			d[11] ||= K("label", {
				class: "sr-only",
				for: "tr-lang"
			}, "Second language", -1),
			K("select", {
				id: "tr-lang",
				class: "field",
				value: a.value,
				onChange: d[0] ||= (e) => l(e.target.value)
			}, [(U(!0), W(H, null, V(Vp, (e) => (U(), W("option", {
				key: e.code,
				value: e.code
			}, F(e.name) + " · " + F(e.native), 9, dC))), 128))], 40, uC),
			K("div", fC, [K("button", {
				class: "grow",
				"aria-pressed": o.value === "side",
				onClick: d[1] ||= (e) => z(t).commit((e) => em(e, "side"))
			}, "Side by side", 8, pC), K("button", {
				class: "grow",
				"aria-pressed": o.value === "stacked",
				onClick: d[2] ||= (e) => z(t).commit((e) => em(e, "stacked"))
			}, "One above the other", 8, mC)]),
			K("span", hC, "Which language comes first (" + F(c.value) + ")?", 1),
			K("div", gC, [K("button", {
				class: "grow",
				"aria-pressed": !s.value,
				onClick: d[3] ||= (e) => z(t).commit((e) => pm(e, !1))
			}, "English first", 8, _C), K("button", {
				class: "grow",
				"aria-pressed": s.value,
				onClick: d[4] ||= (e) => z(t).commit((e) => pm(e, !0))
			}, F(Hp(a.value)) + " first", 9, vC)]),
			d[12] ||= K("div", { class: "sub-head" }, "Translated wording", -1),
			d[13] ||= K("p", {
				class: "small muted",
				style: { margin: "0" }
			}, "Write the English in the text step; the translation follows. You can also type over any line here.", -1),
			(U(!0), W(H, null, V(i.value, (e, n) => (U(), W("div", {
				key: e.id,
				class: "tr-line"
			}, [
				K("label", {
					class: "label",
					for: `tr-${e.id}`
				}, [q(" Line " + F(n + 1) + ": ", 1), K("span", bC, F(e.source.trim() || "(blank)"), 1)], 8, yC),
				K("textarea", {
					id: `tr-${e.id}`,
					class: fe(["field area", { "is-busy": z(t).translatingIds.value.includes(e.id) }]),
					lang: a.value,
					rows: Math.min(3, Math.max(1, e.text.split("\n").length)),
					value: e.text,
					disabled: !e.source.trim(),
					placeholder: e.source.trim() ? z(t).translatingIds.value.includes(e.id) ? "Translating…" : "Translation" : "",
					"aria-busy": z(t).translatingIds.value.includes(e.id),
					onInput: (n) => z(t).commit((t) => sm(t, e.id, n.target.value), `tr:${e.id}`)
				}, null, 42, xC),
				e.manual && e.stale && e.source.trim() ? (U(), W("div", SC, [
					d[8] ||= K("span", {
						class: "grow",
						style: { color: "var(--danger)" }
					}, "The English changed since you typed this.", -1),
					K("button", {
						class: "link",
						onClick: (n) => z(t).commit((t) => cm(t, e.id))
					}, "Keep mine", 8, CC),
					z(t).translatorName ? (U(), W("button", {
						key: 0,
						class: "link",
						onClick: (n) => z(t).commit((t) => dm(t, e.id))
					}, "Translate again", 8, wC)) : J("", !0)
				])) : e.manual ? (U(), W("span", TC, "Typed by you")) : J("", !0)
			]))), 128)),
			u.value ? (U(), W("p", {
				key: 0,
				class: fe(["small tr-status", { busy: z(t).state.translating }]),
				role: "status"
			}, [z(t).state.translating ? (U(), W("span", EC)) : J("", !0), q(F(u.value), 1)], 2)) : J("", !0),
			K("div", DC, [z(t).translatorName ? (U(), W("button", {
				key: 0,
				class: "btn small-btn",
				onClick: d[5] ||= (e) => z(t).translateAgain()
			}, "Translate all again")) : J("", !0)]),
			K("div", OC, [
				d[10] ||= K("strong", null, "Please check this translation", -1),
				K("p", kC, F(r.value.meta.machine ? "Translations are made automatically. Safety signs must be understood exactly, so ask a native speaker to check the wording before you order." : "Safety signs must be understood exactly, so ask a native speaker to check the wording before you order."), 1),
				K("label", AC, [K("input", {
					type: "checkbox",
					checked: r.value.meta.checked,
					onChange: d[6] ||= (e) => z(t).commit((t) => lm(t, e.target.checked))
				}, null, 40, jC), d[9] ||= q(" I have checked the translation ", -1)])
			])
		], 64)) : J("", !0)]));
	}
}), NC = /* @__PURE__ */ B({
	__name: "AdvancedPanel",
	setup(e) {
		let t = _v(), n = Y(() => t.variantSizes.value.length > 0), r = Y(() => yu(t.view.value.doc)), i = Y(() => t.product.value?.bilingual ?? !1);
		function a(e) {
			let n = null;
			t.commit((t) => {
				n = Eu(t, e);
			}), t.selection.section = 0, t.selection.panel = 0;
			let r = n, i = t.view.value.doc;
			r && i && t.openPicker({
				sectionId: i.root.sections[r.section].id,
				index: r.symbol
			});
		}
		return (e, o) => (U(), W(H, null, [
			Vi(Xb, {
				current: r.value,
				only: i.value ? ["single", "multi"] : void 0,
				onPick: a
			}, null, 8, ["current", "only"]),
			n.value ? (U(), G(ob, {
				key: 0,
				step: 2
			})) : (U(), G(Qy, {
				key: 1,
				sizes: z(t).sizes.value,
				current: z(t).currentSize.value,
				step: 2,
				custom: "",
				dimensions: z(t).currentDimensions.value,
				onPick: z(t).pickSize,
				onCustom: z(t).setCustomSize
			}, null, 8, [
				"sizes",
				"current",
				"dimensions",
				"onPick",
				"onCustom"
			])),
			r.value === "grid" || r.value === "stacked" ? (U(), G(ax, {
				key: 2,
				kind: "cells"
			})) : r.value === "multi" ? (U(), G(ax, {
				key: 3,
				kind: "symbols"
			})) : J("", !0),
			Vi(Nv),
			Vi(oC),
			i.value ? (U(), G(MC, {
				key: 4,
				step: 4
			})) : J("", !0),
			Vi(AS)
		], 64));
	}
}), PC = {
	class: "card",
	"aria-labelledby": "board-heading"
}, FC = { class: "step-head" }, IC = { class: "small muted" }, LC = {
	key: 0,
	class: "templates"
}, RC = {
	class: "small muted",
	style: { margin: "0" }
}, zC = { class: "row-controls wrap" }, BC = [
	"disabled",
	"title",
	"onClick"
], VC = { class: "row-controls wrap board-size" }, HC = ["value"], UC = ["value"], WC = {
	class: "segmented",
	role: "group",
	"aria-label": "Columns below the header"
}, GC = ["aria-pressed", "onClick"], KC = {
	class: "rows",
	role: "list"
}, qC = [
	"onDragstart",
	"onDragover",
	"onDragleave",
	"onDrop"
], JC = [
	"aria-pressed",
	"aria-label",
	"title",
	"onClick"
], YC = ["aria-pressed", "onClick"], XC = { class: "row-words" }, ZC = {
	key: 0,
	class: "small muted"
}, QC = { class: "row-buttons" }, $C = ["disabled", "onClick"], ew = ["disabled", "onClick"], tw = [
	"aria-label",
	"title",
	"onClick"
], nw = ["disabled", "onClick"], rw = ["disabled", "onClick"], iw = { class: "row-height" }, aw = ["value", "onChange"], ow = ["value"], sw = { class: "row-controls wrap" }, cw = ["disabled"], lw = ["disabled"], uw = ["disabled"], dw = {
	key: 1,
	class: "row-controls wrap"
}, fw = ["max", "value"], pw = { class: "small muted" }, mw = {
	key: 2,
	class: "small muted",
	style: { margin: "0" }
}, hw = {
	key: 3,
	class: "small muted",
	style: { margin: "0" }
}, gw = {
	key: 4,
	class: "small muted",
	style: { margin: "0" }
}, _w = /* @__PURE__ */ B({
	__name: "BoardStep",
	setup(e) {
		let t = _v(), n = Y(() => !(t.product.value?.fireaction ?? !1)), r = Y(() => t.product.value?.fireaction ?? !1), i = () => t.view.value.doc, a = t.board.rows, o = t.board.selectedRow, s = /* @__PURE__ */ R(!1), c = /* @__PURE__ */ R(null), l = /* @__PURE__ */ R(null), u = Y(() => a.value.length >= 8), d = Y(() => r.value || a.value.length <= 1);
		async function f(e) {
			s.value = !0;
			try {
				await t.board.useTemplate(e);
			} finally {
				s.value = !1;
			}
		}
		function p(e) {
			let t = i().root.sections.slice(e.start, e.start + e.cells).map((e) => e.placeholder ? dg : e.text_frame.panels.flatMap((e) => e.blocks.map((e) => e.text)).filter(Boolean).join(" ").trim()).filter(Boolean).join("  |  ");
			if (t) return t;
			let n = i().root.sections.slice(e.start, e.start + e.cells).flatMap((e) => e.symbol_frame?.symbols.map((e) => e.symbol_code) ?? []);
			return n.length ? `${n.join(", ")} on its own` : "Empty row";
		}
		let m = Y(() => {
			let e = a.value[o.value];
			return !!e && h(e);
		}), h = (e) => i().root.sections.slice(e.start, e.start + e.cells).every((e) => e.placeholder), g = (e) => sg.reduce((t, n) => Math.abs(n.weight - e) < Math.abs(t - e) ? n.weight : t, 1);
		function _(e) {
			let n = i().root.sections[e.start], r = n?.text_frame.panels[0]?.category ?? n?.category, a = t.categories.value.find((e) => e.key === r);
			return n?.text_frame.panels[0]?.fill ? "#ffffff" : a?.panel.hex ?? "#ffffff";
		}
		let v = (e) => t.board.steps.value[e.start] ?? null;
		function y(e) {
			let n = c.value;
			c.value = null, l.value = null, n !== null && n !== e && t.board.move(n, e);
		}
		return (e, i) => (U(), W("section", PC, [
			K("div", FC, [
				i[6] ||= K("span", { class: "step-no" }, "1", -1),
				i[7] ||= K("h2", {
					id: "board-heading",
					class: "grow"
				}, "Rows", -1),
				K("span", IC, F(z(a).length) + " of " + F(z(8)), 1)
			]),
			d.value ? (U(), W("div", LC, [K("p", RC, " Start from a ready-made " + F(r.value ? "notice" : "board") + ", then change what you like: ", 1), K("div", zC, [(U(!0), W(H, null, V(z(t).board.templates.value, (e) => (U(), W("button", {
				key: e.id,
				class: "btn small-btn strong",
				disabled: s.value,
				title: e.hint,
				onClick: (t) => f(e.id)
			}, F(e.label), 9, BC))), 128))])])) : J("", !0),
			K("div", VC, [
				i[10] ||= K("label", {
					class: "label",
					for: "board-rows"
				}, "Rows", -1),
				K("select", {
					id: "board-rows",
					class: "field compact",
					value: z(a).length,
					onChange: i[0] ||= (e) => z(t).board.setRowCount(Number(e.target.value))
				}, [(U(!0), W(H, null, V(z(8), (e) => (U(), W("option", {
					key: e,
					value: e
				}, F(e), 9, UC))), 128))], 40, HC),
				n.value ? (U(), W(H, { key: 0 }, [
					i[8] ||= K("span", { class: "label" }, "Columns", -1),
					K("div", WC, [(U(!0), W(H, null, V(z(2), (e) => (U(), W("button", {
						key: e,
						"aria-pressed": z(t).board.columns.value === e,
						onClick: (n) => z(t).board.setColumns(e)
					}, F(e), 9, GC))), 128))]),
					i[9] ||= K("span", { class: "small muted" }, "below the header", -1)
				], 64)) : J("", !0)
			]),
			K("ul", KC, [(U(!0), W(H, null, V(z(a), (e) => (U(), W("li", {
				key: e.index,
				class: fe(["board-row", {
					on: e.index === z(o),
					over: l.value === e.index,
					empty: h(e)
				}]),
				draggable: "true",
				onDragstart: (t) => c.value = e.index,
				onDragend: i[1] ||= (e) => {
					c.value = null, l.value = null;
				},
				onDragover: fo((t) => l.value = e.index, ["prevent"]),
				onDragleave: (t) => l.value === e.index && (l.value = null),
				onDrop: fo((t) => y(e.index), ["prevent"])
			}, [
				i[12] ||= K("span", {
					class: "grip",
					"aria-hidden": "true"
				}, "⠿", -1),
				K("span", {
					class: "row-colour",
					style: M({ background: _(e) }),
					"aria-hidden": "true"
				}, null, 4),
				r.value ? (U(), W("button", {
					key: 0,
					class: "step-toggle",
					"aria-pressed": v(e) !== null,
					"aria-label": v(e) === null ? "Give this row a number" : `Take away this row\u2019s number, ${v(e)}`,
					title: v(e) === null ? "This row has no number. Click to number it." : "Click to take the number away.",
					onClick: (n) => z(t).board.toggleStep(e.start)
				}, F(v(e) ?? "–"), 9, JC)) : J("", !0),
				K("button", {
					class: "row-text grow",
					"aria-pressed": e.index === z(o),
					onClick: (n) => z(t).board.select(e.index)
				}, [K("span", XC, F(p(e)), 1), n.value ? (U(), W("span", ZC, F(e.cells === 2 ? "Two cells" : "Full width"), 1)) : J("", !0)], 8, YC),
				K("div", QC, [
					K("button", {
						class: "icon-btn",
						disabled: e.index === 0,
						"aria-label": "Move row up",
						onClick: (n) => z(t).board.move(e.index, e.index - 1)
					}, "↑", 8, $C),
					K("button", {
						class: "icon-btn",
						disabled: e.index === z(a).length - 1,
						"aria-label": "Move row down",
						onClick: (n) => z(t).board.move(e.index, e.index + 1)
					}, "↓", 8, ew),
					n.value ? (U(), W("button", {
						key: 0,
						class: "icon-btn",
						"aria-label": e.cells === 2 ? "Make this row full width" : "Split this row into two",
						title: e.cells === 2 ? "Make full width" : "Split into two",
						onClick: (n) => z(t).board.setCells(e.index, e.cells === 2 ? 1 : 2)
					}, F(e.cells === 2 ? "▭" : "▥"), 9, tw)) : J("", !0),
					K("button", {
						class: "icon-btn",
						"aria-label": "Duplicate row",
						title: "Duplicate",
						disabled: u.value,
						onClick: (n) => z(t).board.duplicate(e.index)
					}, "⧉", 8, nw),
					K("button", {
						class: "icon-btn danger",
						"aria-label": "Remove row",
						disabled: z(a).length <= 1,
						onClick: (n) => z(t).board.remove(e.index)
					}, "×", 8, rw)
				]),
				K("label", iw, [i[11] ||= K("span", { class: "visually-hidden" }, "Row height", -1), K("select", {
					class: "field small-field",
					value: g(e.weight),
					onChange: (n) => z(t).board.setWeight(e.index, Number(n.target.value))
				}, [(U(!0), W(H, null, V(z(sg), (e) => (U(), W("option", {
					key: e.label,
					value: e.weight
				}, F(e.label), 9, ow))), 128))], 40, aw)])
			], 42, qC))), 128))]),
			K("div", sw, [
				K("button", {
					class: "btn strong",
					disabled: u.value || s.value,
					onClick: i[2] ||= (e) => z(t).board.openPicker("add", z(o))
				}, "+ Add a standard row", 8, cw),
				K("button", {
					class: "btn",
					disabled: u.value || s.value,
					onClick: i[3] ||= (e) => z(t).board.add(null, z(o))
				}, "+ Blank row", 8, lw),
				K("button", {
					class: "btn small-btn",
					disabled: s.value || z(o) < 0,
					onClick: i[4] ||= (e) => z(t).board.openPicker("replace", z(a)[z(o)]?.start ?? 0)
				}, F(m.value ? "Choose a message for this row" : "Replace this row"), 9, uw)
			]),
			r.value ? (U(), W("div", dw, [
				i[13] ||= K("label", {
					class: "label",
					for: "notice-corner"
				}, "Corner rounding", -1),
				K("input", {
					id: "notice-corner",
					type: "range",
					min: "0",
					max: z(t).board.corner.value.max,
					step: "any",
					value: z(t).board.corner.value.mm,
					onInput: i[5] ||= (e) => z(t).board.setCorner(Number(e.target.value))
				}, null, 40, fw),
				K("span", pw, F(z(t).board.corner.value.mm.toFixed(1)) + " mm" + F(z(t).board.corner.value.mm ? "" : " — square"), 1)
			])) : J("", !0),
			r.value ? (U(), W("p", mw, " The number on the left of a row turns its number on and off — the rest renumber themselves. ")) : J("", !0),
			u.value ? (U(), W("p", hw, "That is as many rows as one board takes.")) : (U(), W("p", gw, "Drag a row by its handle to move it, or use the arrows."))
		]));
	}
}), vw = /* @__PURE__ */ B({
	__name: "BoardPanel",
	setup(e) {
		let t = _v(), n = Y(() => t.variantSizes.value.length > 0);
		return (e, r) => (U(), W(H, null, [
			z(t).board.rows.value.length > 1 ? (U(), G(ax, {
				key: 0,
				kind: "cells"
			})) : J("", !0),
			Vi(_w),
			n.value ? (U(), G(ob, {
				key: 1,
				step: 2
			})) : (U(), G(Qy, {
				key: 2,
				sizes: z(t).sizes.value,
				current: z(t).currentSize.value,
				step: 2,
				custom: "",
				dimensions: z(t).currentDimensions.value,
				onPick: z(t).pickSize,
				onCustom: z(t).setCustomSize
			}, null, 8, [
				"sizes",
				"current",
				"dimensions",
				"onPick",
				"onCustom"
			])),
			Vi(AS)
		], 64));
	}
}), yw = {
	class: "card",
	"aria-labelledby": "scheme-heading"
}, bw = {
	class: "swatches",
	role: "group",
	"aria-label": "Sign colour"
}, xw = ["aria-pressed", "onClick"], Sw = {
	key: 1,
	class: "card",
	"aria-labelledby": "road-size-heading"
}, Cw = {
	class: "chips",
	style: { "grid-template-columns": "repeat(2, minmax(0, 1fr))" },
	role: "group",
	"aria-label": "Sign size"
}, ww = ["aria-pressed", "onClick"], Tw = {
	key: 2,
	class: "card",
	"aria-labelledby": "arrow-place-heading"
}, Ew = { class: "row-controls" }, Dw = {
	class: "segmented",
	role: "group",
	"aria-labelledby": "arrow-place-label"
}, Ow = ["aria-pressed", "onClick"], kw = /* @__PURE__ */ B({
	__name: "RoadSignPanel",
	props: { sizes: {
		type: Boolean,
		default: !0
	} },
	setup(e) {
		let t = e, n = Y(() => r.variantSizes.value.length > 0), r = _v(), i = r.roadSign, a = () => r.view.value.doc, o = Y(() => (r.rev.value, !!a().root.sections[0]?.symbol_frame)), s = Y(() => (r.rev.value, wu(a()))), c = [
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
		return (e, a) => (U(), W(H, null, [
			K("section", yw, [a[0] ||= K("div", { class: "step-head" }, [K("span", { class: "step-no" }, "1"), K("h2", { id: "scheme-heading" }, "Colour")], -1), K("div", bw, [(U(!0), W(H, null, V(z(i).schemes, (e) => (U(), W("button", {
				key: e.key,
				class: "swatch",
				"aria-pressed": z(i).scheme.value.key === e.key,
				onClick: (t) => z(i).setScheme(e.key)
			}, [K("span", {
				class: "dot",
				style: M({
					background: e.face.hex,
					borderColor: e.ink.hex
				})
			}, null, 4), q(" " + F(e.label), 1)], 8, xw))), 128))])]),
			n.value ? (U(), G(ob, { key: 0 })) : t.sizes ? (U(), W("section", Sw, [
				a[1] ||= K("div", { class: "step-head" }, [K("span", { class: "step-no" }, "2"), K("h2", { id: "road-size-heading" }, "Size")], -1),
				K("div", Cw, [(U(!0), W(H, null, V(z(i).sizes.value, (e) => (U(), W("button", {
					key: e.name,
					class: "chip",
					"aria-pressed": z(i).size.value?.name === e.name,
					onClick: (t) => z(i).setSize(e)
				}, F(e.width) + "×" + F(e.height), 9, ww))), 128))]),
				a[2] ||= K("p", {
					class: "small muted",
					style: { margin: "0" }
				}, "These fit our standard frames, so there is no custom size.", -1)
			])) : J("", !0),
			o.value ? (U(), W("section", Tw, [a[4] ||= K("div", { class: "step-head" }, [K("span", { class: "step-no" }, "3"), K("h2", { id: "arrow-place-heading" }, "Arrow")], -1), K("div", Ew, [a[3] ||= K("span", {
				class: "label",
				id: "arrow-place-label"
			}, "Goes", -1), K("div", Dw, [(U(), W(H, null, V(c, (e) => K("button", {
				key: e.key,
				"aria-pressed": s.value === e.key,
				onClick: (t) => z(r).commit((t) => Tu(t, e.key))
			}, F(e.label), 9, Ow)), 64))])])])) : J("", !0),
			Vi(AS)
		], 64));
	}
}), Aw = {
	class: "card outlined",
	"aria-labelledby": "rows-heading"
}, jw = { class: "step-head" }, Mw = {
	id: "rows-heading",
	class: "grow"
}, Nw = {
	key: 0,
	class: "tabs",
	role: "tablist",
	"aria-label": "Kinds of row"
}, Pw = ["aria-selected", "onClick"], Fw = {
	key: 1,
	class: "notice",
	role: "alert"
}, Iw = {
	key: 2,
	class: "small muted",
	style: { margin: "0" }
}, Lw = { class: "sub-head" }, Rw = [
	"disabled",
	"title",
	"onClick"
], zw = ["innerHTML"], Bw = { class: "preset-label" }, Vw = { class: "small muted preset-words" }, Hw = /* @__PURE__ */ B({
	__name: "RowPicker",
	setup(e) {
		let t = _v(), n = /* @__PURE__ */ R(""), r = /* @__PURE__ */ R("all"), i = /* @__PURE__ */ R(null), a = /* @__PURE__ */ R("");
		ar(() => {
			i.value?.focus(), t.board.loadThumbs();
		});
		let o = Y(() => t.board.picker.value?.mode === "replace"), s = Y(() => t.board.presets.value), c = Y(() => {
			let e = n.value.trim().toLowerCase();
			return s.value.filter((t) => e || r.value === "all" || t.group === r.value).map((t) => ({
				...t,
				presets: e ? t.presets.filter((t) => `${t.label} ${u(t)}`.toLowerCase().includes(e)) : t.presets
			})).filter((e) => e.presets.length);
		}), l = Y(() => ["all", ...s.value.map((e) => e.group)]);
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
		return (e, s) => (U(), W("section", Aw, [
			K("div", jw, [K("h2", Mw, F(o.value ? "Choose a message for this row" : "Add a row"), 1), K("button", {
				class: "btn go",
				style: {
					height: "40px",
					"font-size": "15px"
				},
				onClick: s[0] ||= (e) => z(t).board.closePicker()
			}, "Done")]),
			s[2] ||= K("label", {
				class: "label",
				for: "row-search"
			}, "Search the standard rows", -1),
			kn(K("input", {
				id: "row-search",
				ref_key: "search",
				ref: i,
				"onUpdate:modelValue": s[1] ||= (e) => n.value = e,
				class: "field",
				type: "search",
				placeholder: "e.g. helmet, children, smoking"
			}, null, 512), [[co, n.value]]),
			n.value.trim() ? J("", !0) : (U(), W("div", Nw, [(U(!0), W(H, null, V(l.value, (e) => (U(), W("button", {
				key: e,
				role: "tab",
				"aria-selected": r.value === e,
				onClick: (t) => r.value = e
			}, F(e === "all" ? "All" : e), 9, Pw))), 128))])),
			z(t).state.symbolError ? (U(), W("p", Fw, F(z(t).state.symbolError), 1)) : J("", !0),
			c.value.length ? J("", !0) : (U(), W("p", Iw, " No standard row matches that. Close this and use “Blank row” to write your own wording. ")),
			(U(!0), W(H, null, V(c.value, (e) => (U(), W("div", {
				key: e.group,
				class: "preset-group"
			}, [K("div", Lw, F(e.group), 1), (U(!0), W(H, null, V(e.presets, (e) => (U(), W("button", {
				key: e.id,
				class: fe(["preset", [`cat-${e.section.colour ?? "plain"}`, {
					busy: a.value === e.id,
					drawn: !!z(t).board.thumb(e)
				}]]),
				disabled: !!a.value,
				title: u(e),
				onClick: (t) => d(e)
			}, [z(t).board.thumb(e) ? (U(), W("span", {
				key: 0,
				class: "preset-art",
				innerHTML: z(t).board.thumb(e)
			}, null, 8, zw)) : (U(), W(H, { key: 1 }, [K("span", Bw, F(e.label), 1), K("span", Vw, F(u(e)), 1)], 64))], 10, Rw))), 128))]))), 128))
		]));
	}
}), Uw = {
	key: 0,
	class: "topbar"
}, Ww = {
	key: 0,
	class: "loading"
}, Gw = {
	key: 1,
	class: "notice",
	role: "alert"
}, Kw = {
	key: 0,
	class: "crumbs",
	"aria-label": "Breadcrumb"
}, qw = { class: "layout" }, Jw = { class: "preview-col" }, Yw = { class: "preview-head" }, Xw = {
	key: 0,
	class: "heading display"
}, Zw = {
	class: "history",
	role: "group",
	"aria-label": "History"
}, Qw = ["disabled"], $w = ["disabled"], eT = {
	key: 2,
	class: "row-controls"
}, tT = { class: "small muted" }, nT = {
	key: 3,
	class: "small muted hint"
}, rT = {
	key: 4,
	class: "promises"
}, iT = { class: "panel" }, aT = {
	key: 0,
	class: "mode",
	role: "group",
	"aria-label": "Editor mode"
}, oT = ["aria-pressed"], sT = ["aria-pressed"], cT = {
	key: 1,
	class: "card outlined",
	role: "alertdialog",
	"aria-labelledby": "basic-q"
}, lT = { class: "row-controls" }, uT = {
	class: "card",
	"aria-labelledby": "text-heading"
}, dT = {
	key: 1,
	class: "footer"
}, fT = /* @__PURE__ */ B({
	__name: "App",
	setup(e) {
		let t = hv();
		jn(gv, t);
		let { state: n, product: r, svg: i, findings: a, title: o, subtitle: s, mode: c, picker: l, selection: u, history: d, view: f } = t, p = /* @__PURE__ */ R(!1), m = !!Hl, h = /* @__PURE__ */ R(!1), g = Y(() => !!r.value?.roadsign), _ = Hl?.pageOwnsSize === !0, v = Hl?.noBasket === !0, y = Y(() => t.variantSizes.value.length > 0);
		ar(() => {
			t.init(), Hl && Jl(t), window.addEventListener("keydown", b);
		}), cr(() => window.removeEventListener("keydown", b));
		function b(e) {
			if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") return;
			let n = e.target;
			(!n || n.tagName !== "INPUT" && n.tagName !== "TEXTAREA" && !n.isContentEditable) && (e.preventDefault(), e.shiftKey ? t.redo() : t.undo());
		}
		function x(e) {
			p.value = !1, t.setMode(e) || (p.value = !0);
		}
		let S = Y(() => f.value.doc ? yu(f.value.doc) : "single"), C = Y(() => f.value.doc ? Gp(f.value.doc) : null), w = Y(() => !C.value && (S.value === "grid" || S.value === "stacked" || S.value === "board")), T = Y(() => r.value?.board ?? !1), E = Y(() => r.value?.fireaction ?? !1), D = Y(() => T.value || E.value), O = Y(() => r.value?.roadsign ?? !1), k = Y(() => O.value ? t.symbols.value.filter((e) => e.category === qd) : t.symbols.value), ee = Y(() => {
			let e = f.value.doc, n = D.value ? t.board.empty.value : 0;
			return n ? `Fill in ${n === 1 ? "the empty slot" : `the ${n} empty slots`} first — pick a message for each one.` : !e || !C.value || um(e) ? "" : rm(e).some((e) => e.source.trim() && (!e.text.trim() || e.stale)) ? "Some lines still need translating." : "Please tick “I have checked the translation” first.";
		}), te = Y(() => a.value.filter((e) => e.severity === "error").map((e) => {
			let t = Df(e.path), n = t === null ? void 0 : f.value.doc?.root.sections[t], r = C.value && n ? `${n === C.value.target ? Hp(n.lang) : "English"}: ` : t !== null && w.value ? `${S.value === "stacked" ? "Section" : "Cell"} ${t + 1}: ` : "";
			return e.code === "E_TEXT_OVERFLOW" ? `${r}The text doesn’t fit at the smallest size. Try shorter wording, a smaller text setting, or a bigger sign.` : e.code === "E_SECTION_TOO_SMALL" ? `${r}There isn’t room for this much. Try fewer symbols or panels, or a bigger sign.` : `${r}${e.message}`;
		}).filter((e, t, n) => n.indexOf(e) === t)), ne = Y(() => `bespoke-${r.value?.type ?? "sign"}`), re = Y(() => {
			let e = f.value.doc;
			if (!e) return "Sign preview";
			let n = e.root.sections.flatMap((e) => e.text_frame.panels.flatMap((e) => e.blocks.map((e) => e.text))).filter(Boolean);
			return `Sign preview: ${e.root.sections.flatMap((e) => e.symbol_frame?.symbols.map((e) => t.symbolEntry(e.symbol_code)?.name ?? e.symbol_code) ?? []).join(", ") || "no symbol"}${n.length ? `, “${n.join(", ")}”` : ""}`;
		}), A = Y(() => {
			let e = f.value.doc, r = [];
			if (e && n.suggesting) return r.push({
				ids: e.root.sections.flatMap(Sf),
				kind: "busy",
				label: "Designing your sign…"
			}), r;
			if (e && n.translating && C.value && t.translatingIds.value.length && r.push({
				ids: Sf(C.value.target),
				kind: "busy",
				label: `Translating into ${Hp(C.value.target.lang)}…`
			}), c.value !== "advanced" || !e) return r;
			let i = e.root.sections[u.section];
			if (!i) return r;
			w.value && r.push({
				ids: Sf(i),
				kind: "selected"
			});
			let a = i.text_frame.panels[u.panel];
			return a && i.text_frame.panels.length > 1 && r.push({
				ids: [a.id],
				kind: "panel"
			}), r;
		});
		function ie(e) {
			let t = f.value.doc, n = t && e ? fu(t, e) : null;
			if (!t || !n) return null;
			let r = t.root.sections[n.section], i = r.symbol_frame?.symbols ?? [];
			return n.symbol !== null && i.length > 1 ? {
				key: `symbol:${n.section}:${n.symbol}`,
				group: `symbols:${n.section}`,
				ids: [i[n.symbol].id]
			} : w.value ? {
				key: `section:${n.section}`,
				group: "sections",
				ids: Sf(r)
			} : null;
		}
		function ae() {
			let e = f.value.doc;
			if (!e || c.value !== "advanced") return [];
			if (w.value) return e.root.sections.map((e, t) => ({
				key: `section:${t}`,
				group: "sections",
				ids: Sf(e)
			}));
			let t = e.root.sections[0]?.symbol_frame?.symbols ?? [];
			return t.length > 1 ? t.map((e, t) => ({
				key: `symbol:0:${t}`,
				group: "symbols:0",
				ids: [e.id]
			})) : [];
		}
		function j(e, n) {
			let r = f.value.doc;
			if (c.value !== "advanced" || !r) return;
			let i = e ? fu(r, e) : null, a = i?.section ?? Ef(r, n.x, n.y);
			if (a == null) return;
			let o = C.value;
			if (o && r.root.sections[a] === o.target) {
				if (gn(() => document.getElementById("translation-card")?.scrollIntoView({
					behavior: "smooth",
					block: "nearest"
				})), i?.block !== null && i?.block !== void 0) {
					let e = o.target.text_frame.panels[i.panel ?? 0]?.blocks[i.block]?.id;
					e && gn(() => document.getElementById(`tr-${e}`)?.focus({ preventScroll: !0 }));
				}
				return;
			}
			o && (a = r.root.sections.indexOf(o.source)), a !== u.section && (u.panel = 0), u.section = a, i?.panel !== null && i?.panel !== void 0 && (u.panel = i.panel), D.value && t.offerPreset(u.section), window.matchMedia("(max-width: 960px)").matches && gn(() => document.getElementById("part-editor")?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			}));
		}
		function oe(e, n) {
			let [r, i, a] = e.split(":"), [, o, s] = n.split(":"), c = f.value.doc;
			if (c) {
				if (r === "symbol") {
					let e = c.root.sections[Number(i)].id;
					t.commit((t) => qu(t, e, Number(a), Number(s)));
				} else {
					let [e, n] = [Number(i), Number(o)];
					t.commit((t) => S.value === "grid" || S.value === "board" ? Vu(t, e, n) : Bu(t, e, n)), u.section = n, u.panel = 0;
				}
			}
		}
		let se = Y(() => E.value ? "Click a step to edit its wording. Add, remove or reorder steps below — they renumber themselves." : T.value ? "Click a row to edit it, or drag one cell onto another to swap them." : C.value ? "Click the English to edit it, or the translation to jump to its wording." : S.value === "board" ? "Click a row to edit it. Drag one cell onto another to swap them." : S.value === "grid" ? "Click a cell to edit it. Drag one cell onto another to swap them." : S.value === "stacked" ? "Click a section to edit it. Drag a section to move it." : S.value === "multi" ? "Drag a symbol along the row to reorder it." : "Click a panel to edit it."), M = () => {
			let e = f.value.doc?.root.sections[0]?.id;
			e && t.openPicker({
				sectionId: e,
				index: 0
			});
		};
		return (e, a) => (U(), W(H, null, [
			m ? J("", !0) : (U(), W("header", Uw, [...a[19] ||= [K("span", { class: "brand display" }, "Safety Signs & Notices", -1), K("span", { class: "tag" }, "Bespoke signs · test site", -1)]])),
			K("main", { class: fe(["page", { embedded: m }]) }, [z(n).status === "loading" ? (U(), W("div", Ww, "Loading the sign designer…")) : z(n).status === "error" ? (U(), W("div", Gw, " The designer couldn’t start: " + F(z(n).error), 1)) : (U(), W(H, { key: 2 }, [
				m ? J("", !0) : (U(), W("nav", Kw, [
					a[20] ||= K("span", null, "Safety Signs", -1),
					a[21] ||= K("span", { "aria-hidden": "true" }, "/", -1),
					a[22] ||= K("span", null, "Bespoke", -1),
					a[23] ||= K("span", { "aria-hidden": "true" }, "/", -1),
					K("strong", null, F(z(r)?.heading), 1)
				])),
				K("div", qw, [K("div", Jw, [
					K("div", Yw, [_ ? J("", !0) : (U(), W("h1", Xw, F(z(r)?.heading), 1)), K("div", Zw, [
						z(t).options.value.length && !z(t).state.choosing ? (U(), W("button", {
							key: 0,
							class: "btn small-btn accent",
							title: "Look at the other designs we suggested",
							onClick: a[0] ||= (e) => z(t).reopenOptions()
						}, "✦ See the other ideas")) : J("", !0),
						K("button", {
							class: "btn small-btn",
							disabled: !z(d).canUndo,
							title: "Undo (Ctrl/⌘+Z)",
							onClick: a[1] ||= (e) => z(t).undo()
						}, "↶ Undo", 8, Qw),
						K("button", {
							class: "btn small-btn",
							disabled: !z(d).canRedo,
							title: "Redo (Ctrl/⌘+Shift+Z)",
							onClick: a[2] ||= (e) => z(t).redo()
						}, "↷ Redo", 8, $w)
					])]),
					z(t).state.choosing ? (U(), G(iy, { key: 0 })) : (U(), G(sy, {
						key: 1,
						svg: z(i),
						label: re.value,
						interactive: z(c) === "advanced",
						highlights: A.value,
						"drag-item": ie,
						movables: ae,
						onPick: j,
						onDrop: oe
					}, null, 8, [
						"svg",
						"label",
						"interactive",
						"highlights"
					])),
					z(t).state.choosing ? J("", !0) : (U(), W("div", eT, [K("button", {
						class: "btn",
						onClick: a[3] ||= (e) => h.value = !0
					}, "Preview this sign"), K("span", tT, F(g.value ? "See it in a stanchion." : "See it at actual size, against a door."), 1)])),
					z(c) === "advanced" ? (U(), W("p", nT, F(se.value), 1)) : J("", !0),
					(U(!0), W(H, null, V(te.value, (e) => (U(), W("div", {
						key: e,
						class: "notice",
						role: "status"
					}, F(e), 1))), 128)),
					z(t).review ? J("", !0) : (U(), W("div", rT, [...a[24] ||= [
						K("span", null, "Printed exactly to size", -1),
						K("span", { "aria-hidden": "true" }, "·", -1),
						K("span", null, "Official ISO 7010 symbols", -1)
					]]))
				]), K("div", iT, [
					!D.value && !O.value ? (U(), W("div", aT, [K("button", {
						"aria-pressed": z(c) === "basic",
						onClick: a[4] ||= (e) => x("basic")
					}, "Basic", 8, oT), K("button", {
						"aria-pressed": z(c) === "advanced",
						onClick: a[5] ||= (e) => x("advanced")
					}, "Advanced", 8, sT)])) : J("", !0),
					p.value ? (U(), W("section", cT, [
						a[25] ||= K("h2", {
							id: "basic-q",
							style: {
								margin: "0",
								"font-size": "18px"
							}
						}, "Switch to Basic?", -1),
						a[26] ||= K("p", { style: { margin: "0" } }, "Basic shows one symbol with a title and one more line. Switching keeps the first symbol and the first two lines of text; the rest is removed (you can undo).", -1),
						K("div", lT, [K("button", {
							class: "btn strong",
							onClick: a[6] ||= (e) => {
								p.value = !1, z(t).resetToBasic();
							}
						}, "Switch to Basic"), K("button", {
							class: "btn",
							onClick: a[7] ||= (e) => p.value = !1
						}, "Stay in Advanced")])
					])) : J("", !0),
					z(l) ? (U(), G(xb, {
						key: 2,
						symbols: k.value,
						categories: z(t).categories.value,
						preferred: z(r)?.category ?? null,
						current: z(c) === "basic" ? z(t).currentSymbol.value?.code ?? null : z(t).pickerCurrent.value,
						busy: z(n).symbolBusy,
						error: z(n).symbolError,
						noun: O.value ? "arrow" : "symbol",
						onPick: z(t).pickSymbol,
						onDone: a[8] ||= (e) => z(t).closePicker()
					}, null, 8, [
						"symbols",
						"categories",
						"preferred",
						"current",
						"busy",
						"error",
						"noun",
						"onPick"
					])) : O.value ? (U(), G(kw, {
						key: 3,
						sizes: !_
					}, null, 8, ["sizes"])) : z(t).board.picker.value ? (U(), G(Hw, { key: 4 })) : D.value ? (U(), G(vw, { key: 5 })) : z(c) === "basic" ? (U(), W(H, { key: 6 }, [
						z(t).canSuggest ? (U(), G(qv, { key: 0 })) : J("", !0),
						y.value ? (U(), G(ob, { key: 1 })) : _ ? J("", !0) : (U(), G(Qy, {
							key: 2,
							sizes: z(t).sizes.value,
							current: z(t).currentSize.value,
							onPick: z(t).pickSize
						}, null, 8, [
							"sizes",
							"current",
							"onPick"
						])),
						Vi(Ob, {
							current: z(t).currentSymbol.value,
							onChange: M
						}, null, 8, ["current"]),
						K("section", uT, [
							a[27] ||= K("div", { class: "step-head" }, [K("span", { class: "step-no" }, "3"), K("h2", { id: "text-heading" }, "Text")], -1),
							Vi(Ub, {
								id: "title",
								label: "Title",
								text: z(o).text,
								align: z(o).align,
								caps: z(o).caps,
								"size-label": z(o).label,
								mm: z(o).mm,
								onText: a[9] ||= (e) => z(t).setText("title", e),
								onBump: a[10] ||= (e) => z(t).bumpSize("title", e),
								onAlign: a[11] ||= (e) => z(t).setAlign("title", e),
								onCaps: a[12] ||= (e) => z(t).setCaps("title", e)
							}, null, 8, [
								"text",
								"align",
								"caps",
								"size-label",
								"mm"
							]),
							Vi(Ub, {
								id: "subtitle",
								label: "Additional text (optional)",
								placeholder: "e.g. on these premises",
								text: z(s).text,
								align: z(s).align,
								caps: z(s).caps,
								"size-label": z(s).label,
								mm: z(s).mm,
								onText: a[13] ||= (e) => z(t).setText("subtitle", e),
								onBump: a[14] ||= (e) => z(t).bumpSize("subtitle", e),
								onAlign: a[15] ||= (e) => z(t).setAlign("subtitle", e),
								onCaps: a[16] ||= (e) => z(t).setCaps("subtitle", e)
							}, null, 8, [
								"text",
								"align",
								"caps",
								"size-label",
								"mm"
							]),
							a[28] ||= K("p", {
								class: "small muted",
								style: { margin: "0" }
							}, "Text still shrinks to fit if it gets too long. Need more? Try Advanced.", -1)
						]),
						Vi(Nv),
						z(r)?.bilingual ? (U(), G(MC, {
							key: 3,
							step: 4
						})) : J("", !0)
					], 64)) : (U(), W(H, { key: 7 }, [z(t).canSuggest ? (U(), G(qv, { key: 0 })) : J("", !0), Vi(NC)], 64)),
					z(t).review && !z(l) && !z(t).board.picker.value ? (U(), G(Ev, { key: 8 })) : !z(l) && !z(t).board.picker.value && !_ && !v ? (U(), G(Oo, {
						key: 9,
						"design-json": z(t).designJson,
						"preview-svg": z(t).printSvg,
						"file-stem": ne.value,
						blocked: ee.value
					}, null, 8, [
						"design-json",
						"preview-svg",
						"file-stem",
						"blocked"
					])) : J("", !0)
				])]),
				m ? J("", !0) : (U(), W("p", dT, "Data: " + F(z(t).dataSource.value) + " · Symbols: " + F(z(t).symbols.value.length), 1))
			], 64))], 2),
			h.value && g.value ? (U(), G(Iy, {
				key: 1,
				onClose: a[17] ||= (e) => h.value = !1
			})) : h.value ? (U(), G(xy, {
				key: 2,
				onClose: a[18] ||= (e) => h.value = !1
			})) : J("", !0)
		], 64));
	}
});
//#endregion
//#region editor/src/main.ts
Hl || document.documentElement.classList.add("sign-designer-site");
var pT = document.querySelector(Hl?.mount ?? "#app");
pT?.classList.add("sign-designer-root"), vo(fT).mount(pT ?? Hl?.mount ?? "#app");
//#endregion
