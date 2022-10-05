import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import type { User } from '@supabase/supabase-js';
import type { Wishlist, Item } from '~/models';

import { useEffect, useRef, useState } from 'react';
import { json, redirect } from '@remix-run/node';
import {
	Form,
	useFetcher,
	useLoaderData,
	useTransition,
} from '@remix-run/react';

import { Navbar } from '~/components';
import { requireUser } from '~/utils/auth';

export const loader: LoaderFunction = async ({ request, params }) => {
	const { id: wishlistId } = params;
	const { supabaseClient, user } = await requireUser(request);
	const { data: wishlist } = await supabaseClient
		.from<Wishlist>('wishlist')
		.select('*')
		.match({ id: wishlistId })
		.single();
	const { data: item } = await supabaseClient
		.from<Item>('item')
		.select('*')
		.match({ wishlist_id: wishlistId });

	return json({ wishlist, item, user });
};

export const action: ActionFunction = async ({ request, params }) => {
	const { id: wishlistId } = params;
	const { supabaseClient } = await requireUser(request);

	const formData = await request.formData();
	const intent = formData.get('intent');

	if (intent === 'delete') {
		const itemId = formData.get('id');

		const { data: item } = await supabaseClient
			.from<Item>('item')
			.delete()
			.match({ id: itemId });
		return { item };
	}

	if (intent === 'update') {
		const itemId = formData.get('id');
		const isReceived = formData.get('received') === 'yes';

		const { data: item } = await supabaseClient
			.from<Item>('item')
			.update({ received: !isReceived })
			.match({ id: itemId });
		return { item };
	}

	const newItems = [];
	const allItems = formData.getAll('name');
	for (const item of allItems) {
		if (item) {
			const i = {
				name: item,
				wishlist_id: wishlistId,
			};
			newItems.push(i);
		}
	}

	const { data } = await supabaseClient.from('item').insert(newItems);

	if (data?.length) {
		throw redirect(`/home?itemsAdded=${data?.length}`);
	}

	return { data };
};

type LoaderData = {
	wishlist: Wishlist;
	user: User;
	item: Item[];
};

const itemSuggestions = [
	{ id: 1, placeholder: '1) Wardrobe Needs - Shoes (Size - 8)' },
	{ id: 2, placeholder: '2) Upcoming Vacation - Sunglasses' },
	{ id: 3, placeholder: '3) Gadget Guru - Airpods' },
	{ id: 4, placeholder: '4) Dream Purchase - PS5 / Euro trip' },
	{ id: 5, placeholder: '5) Up your game - Swim gear / Racquet' },
	{ id: 6, placeholder: '6) WFH Essentials - Keyboard' },
	{ id: 7, placeholder: '7) Creative You - Ukelele / Instax' },
	{ id: 8, placeholder: '8) Glam & Glow - Lipstick / Trimmer' }
];

type ItemProps = Item & {
	isCurrentUser: boolean;
};

function ListItem({ id, received, name, isCurrentUser }: ItemProps) {
	const fetcher = useFetcher();
	const isDeleting =
		fetcher.submission?.formData.get('id') === id.toString() &&
		fetcher.submission?.formData.get('intent') === 'delete';
	const isUpdating = fetcher.submission?.formData.get('id') === id.toString();
	const isReceived =
		received || fetcher.submission?.formData.get('received') === 'yes';

	return (
		<li
			key={id}
			className='p-4 bg-white border rounded-md shadow'
			hidden={isDeleting}
		>
			<fetcher.Form replace method='post' className='flex items-center'>
				<label htmlFor='id'>
					<input name='id' className='hidden' defaultValue={id} />
				</label>
				<label htmlFor='received'>
					<input
						name='received'
						className='hidden'
						defaultValue={isReceived ? 'yes' : 'no'}
					/>
				</label>
				<button
					type='submit'
					name='intent'
					value='update'
					disabled={isUpdating}
					className={`mr-2 inline-flex justify-center p-0.5 text-sm ${
						isReceived
							? 'bg-green-500 border border-transparent hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2'
							: 'border border-gray-500'
					} rounded text-white`}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'
						fill='currentColor'
						className='w-4 h-4'
					>
						<path
							fillRule='evenodd'
							d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z'
							clipRule='evenodd'
						/>
					</svg>
				</button>
				<h4
					className={`font-medium ${
						isReceived ? 'text-gray-500 line-through' : 'text-gray-700'
					}`}
				>
					{name}
				</h4>
				<div className='flex-1' />
				{isCurrentUser ? (
					<button
						type='submit'
						name='intent'
						value='delete'
						disabled={isDeleting}
						className='inline-flex justify-center px-3 py-1 pt-1.5 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='w-5 h-5'
						>
							<path
								fillRule='evenodd'
								d='M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z'
								clipRule='evenodd'
							/>
						</svg>
					</button>
				) : null}
			</fetcher.Form>
		</li>
	);
}

export default function WishlistItem() {
	const formRef = useRef<HTMLFormElement>(null);
	const [suggestedItems, setSuggestedItems] = useState(itemSuggestions);
	const { wishlist, user, item } = useLoaderData<LoaderData>();

	const transition = useTransition();
	const isAdding = transition.submission?.formData.get('intent') === 'add';

	const isCurrentUser = wishlist.user_id === user.id;

	const handleAddItem = () => {
		setSuggestedItems(prev => [
			...prev,
			{ id: prev.length + 1, placeholder: 'Add item' },
		]);
	};

	const copy = () => {
		const el = document.createElement('input');
		el.value = window.location.href;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
		window.alert('Link Copied!');
	};

	useEffect(() => {
		if (!isAdding) {
			formRef.current?.reset();
			setSuggestedItems(item.length > 0 ? [] : itemSuggestions);
		}
	}, [isAdding, item.length]);

	return (
		<>
			<Navbar user={user} />
			<main className='max-w-4xl px-2 py-4 mx-auto sm:px-6 lg:px-8'>
				<h3 className='text-lg font-semibold leading-7 text-gray-800 sm:truncate sm:text-xl sm:tracking-tight'>
					{wishlist.title}
				</h3>
				<div className='flex flex-col items-center justify-center p-4 mt-2 text-center rounded bg-slate-100'>
					{item.length > 0 ? (
						<ol className='flex flex-col w-full gap-4 md:w-3/4'>
							{item.map(i => (
								<ListItem key={i.id} {...i} isCurrentUser={isCurrentUser} />
							))}
						</ol>
					) : (
						<p>
							<b>Let's help you create your Perfect Wishlist!</b>
						</p>
					)}
					{isCurrentUser ? (
						<Form
							ref={formRef}
							method='post'
							className='flex flex-col w-full gap-2 mt-6 md:w-3/4 item-center'
						>
							{suggestedItems.map(({ id, placeholder }) => (
								<div className='flex-1' key={id}>
									<label
										htmlFor='name'
										className='block text-sm font-medium text-left text-gray-700 sr-only'
									>
										Item Name
									</label>
									<div className='flex rounded-md shadow-sm'>
										<input
											type='text'
											name='name'
											id={`name-${id}`}
											className='flex-1 block w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
											placeholder={placeholder}
										/>
									</div>
								</div>
							))}
							<button
								className='justify-center px-4 py-2 mt-4 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md shadow-sm hover:border-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
								type='button'
								onClick={handleAddItem}
							>
								+ Add Item
							</button>
							<div className='flex items-center justify-between gap-2 mt-8'>
								<button
									type='submit'
									name='intent'
									value='add'
									disabled={isAdding}
									className='inline-flex justify-center flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
								>
									{isAdding ? 'Saving...' : 'Save'}
								</button>
								<button
									className='inline-flex justify-center flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
									onClick={copy}
								>
									Copy Link
								</button>
							</div>
						</Form>
					) : null}
				</div>
			</main>
		</>
	);
}
