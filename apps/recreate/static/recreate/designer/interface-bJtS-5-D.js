//#region src/text/interface.ts
var e = [
	"regular",
	"bold",
	"italic",
	"bold-italic"
], t = class {
	limit;
	map = /* @__PURE__ */ new Map();
	constructor(e) {
		this.limit = e;
	}
	get(e, t) {
		let n = this.map.get(e);
		if (n !== void 0) return this.map.delete(e), this.map.set(e, n), n;
		let r = t();
		if (this.map.set(e, r), this.map.size > this.limit) {
			let e = this.map.keys().next().value;
			e !== void 0 && this.map.delete(e);
		}
		return r;
	}
};
//#endregion
export { t as n, e as t };
