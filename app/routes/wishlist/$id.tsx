import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import type { User } from '@supabase/supabase-js';
import type { Wishlist, Item } from '~/models';

import { json } from '@remix-run/node';
import { Form, Link, useLoaderData, useTransition } from '@remix-run/react';
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

		const { data: item } = await supabaseClient
			.from<Item>('item')
			.update({ received: true })
			.match({ id: itemId });
		return { item };
	}

	const newItem = {
		name: formData.get('name'),
		wishlist_id: wishlistId,
	};

	const { data: item } = await supabaseClient
		.from('item')
		.insert([newItem])
		.single();

	return { item };
};

type LoaderData = {
	wishlist: Wishlist;
	user: User;
	item: Item[];
};

export default function WishlistItem() {
	const { wishlist, user, item } = useLoaderData<LoaderData>();

	const transition = useTransition();
	const isDeleting = transition.submission?.formData.get('intent') === 'delete';
	const isUpdating = transition.submission?.formData.get('intent') === 'update';

	return (
		<>
			<Navbar user={user} />
			<main className='max-w-4xl px-2 py-4 mx-auto sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between mt-4'>
					<h3 className='text-lg font-semibold leading-7 text-gray-800 sm:truncate sm:text-xl sm:tracking-tight'>
						{wishlist.title} by {user.user_metadata.full_name}
					</h3>
					<Link to='/home' className='text-blue-500 underline'>
						Go home
					</Link>
				</div>
				<div className='mt-2 p-4 bg-slate-100 flex flex-col items-center justify-center min-h-[150px] text-center rounded'>
					{item.length > 0 ? (
						<ol className='flex flex-col w-full gap-4 md:w-3/4'>
							{item.map(({ id, name, received }) => (
								<li key={id} className='p-4 bg-white border rounded-md shadow'>
									<Form method='post' className='flex items-center'>
										<label htmlFor='id'>
											<input name='id' className='hidden' defaultValue={id} />
										</label>
										<h4
											className={`font-medium ${
												received
													? 'text-gray-500 line-through'
													: 'text-gray-700'
											}`}
										>
											{name}
										</h4>
										<div className='flex-1' />
										<div className='flex items-center gap-4'>
											{received ? null : (
												<button
													type='submit'
													name='intent'
													value='update'
													disabled={isUpdating}
													className='inline-flex justify-center px-3 py-1 pt-1.5 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2'
												>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														viewBox='0 0 20 20'
														fill='currentColor'
														className='w-5 h-5'
													>
														<path
															fillRule='evenodd'
															d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z'
															clipRule='evenodd'
														/>
													</svg>
												</button>
											)}
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
										</div>
									</Form>
								</li>
							))}
						</ol>
					) : (
						<p>There are no items in your wishlist...</p>
					)}
					<Form
						method='post'
						className='flex justify-between w-full mt-6 md:w-3/4 item-center'
					>
						<div className='flex-1'>
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
									id='name'
									required
									className='flex-1 block w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									placeholder='Add item'
								/>
							</div>
						</div>
						<button
							type='submit'
							className='inline-flex justify-center px-3 py-1 pt-1.5 ml-2 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='w-6 h-6'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M12 4.5v15m7.5-7.5h-15'
								/>
							</svg>
						</button>
					</Form>
				</div>
			</main>
		</>
	);
}
