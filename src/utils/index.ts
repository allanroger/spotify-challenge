export function msToMin(ms: number): string {
	const m = Math.floor(ms / 60000);
	const s = Math.floor((ms % 60000) / 1000);
	return `${m}:${s.toString().padStart(2, "0")}`;
}

export function shallowEqual<T extends object>(a: T, b: T): boolean {
	const ak = Object.keys(a) as (keyof T)[];
	const bk = Object.keys(b) as (keyof T)[];
	if (ak.length !== bk.length) return false;
	for (const k of ak) if (a[k] !== b[k]) return false;
	return true;
}

export function clip(str: string, max = 20): string {
	if (!str) return "";
	return str.length > max ? str.slice(0, max - 3) + "..." : str;
}
