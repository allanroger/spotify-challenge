export type Image = { url: string; height: number; width: number };
export type Artist = {
	id: string;
	name: string;
	popularity: number;
	images: Image[];
};
export type Track = {
	id: string;
	name: string;
	preview_url: string | null;
	duration_ms: number;
	disc_number: number;
	track_number: number;
};
export type Album = {
	id: string;
	name: string;
	images: Image[];
	release_date: string;
	total_tracks: number;
	artists?: Pick<Artist, "id" | "name">[];
};
export type Paginated<T> = {
	items: T[];
	total: number;
	limit: number;
	offset: number;
};
export type RecentItem = {
	played_at: string;
	track: {
		id: string;
		name: string;
		preview_url: string | null;
		duration_ms?: number;
		artists: { id: string; name: string }[];
		album: {
			id: string;
			name: string;
			images: { url: string; width: number; height: number }[];
		};
	};
};
export type LocationState = { from?: { pathname: string } };
export type PaginationProps = {
	page: number;
	totalPages: number;
	onChange: (page: number) => void;
	onPrev?: () => void;
	onNext?: () => void;
	className?: string;
};

export type PageBtnProps = {
	n: number;
	current: number;
	onClick: (page: number) => void;
};
