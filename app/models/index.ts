export type Wishlist = {
	created_at: Date;
	description: string | null;
	id: string;
	title: string;
	user_id: string;
};

export type Event = {
	created_at: Date;
	name: string;
	id: string;
	date: Date;
	user_id: string;
};

export type Item = {
	created_at: Date;
	name: string;
	id: number;
	received: boolean;
	wishlist_id: string;
};
