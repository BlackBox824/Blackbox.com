export type Wishlist = {
	created_at: Date;
	description: string | null;
	id: string;
	title: string;
	user_id: string;
	disabled?: boolean;
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

export type Profile = {
	created_at: Date;
	id: string;
	phone: string;
	address: string;
	dob: Date;
	name: string;
	email: string;
};
