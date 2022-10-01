import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import type { User } from '@supabase/supabase-js';
import type { Wishlist, Event } from '~/models';

import { json, redirect } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { Navbar } from '~/components';
import { requireUser } from '~/utils/auth';

export const loader: LoaderFunction = async ({ request }) => {
	const { supabaseClient, user } = await requireUser(request);
	const { data: wishlist } = await supabaseClient
		.from('wishlist')
		.select('*')
		.match({ user_id: user.id });
	const { data: events } = await supabaseClient
		.from('event')
		.select('*')
		.match({ user_id: user.id });

	if (wishlist?.length === 0) {
		throw redirect('/profile/edit');
	}

	return json({ wishlist, events, user });
};

export const action: ActionFunction = async ({ request }) => {
	const { supabaseClient } = await requireUser(request);
	const formData = await request.formData();

	await supabaseClient
		.from('wishlist')
		.update({ disabled: true })
		.match({ id: formData.get('id') });

	return redirect(`/home`);
};

type LoaderData = {
	wishlist: Wishlist[];
	events: Event[];
	user: User;
};

export default function Home() {
	const { wishlist, events, user } = useLoaderData<LoaderData>();
	return (
		<>
			<Navbar user={user} />
			<main className='max-w-4xl px-2 py-4 mx-auto sm:px-6 lg:px-8'>
				<h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
					Welcome {user?.user_metadata.full_name}!
				</h2>
				<h3 className='mt-4 text-lg font-semibold leading-7 text-gray-800 sm:truncate sm:text-xl sm:tracking-tight'>
					My Wishlists
				</h3>
				<div className='p-4 mt-2 rounded bg-slate-100'>
					{wishlist.filter(list => !list.disabled).length > 0 ? (
						<ol className='max-h-[350px] overflow-y-scroll'>
							{wishlist
								.filter(list => !list.disabled)
								.slice(0, 3)
								.map(list => (
									<li
										key={list.id}
										className='self-start p-4 mt-2 bg-white border rounded-md shadow md:px-6'
									>
										<Form
											method='post'
											className='flex items-center justify-between w-full'
										>
											<input
												type='text'
												name='id'
												defaultValue={list.id}
												className='hidden'
											/>
											<div className='flex-1'>
												<h4 className='font-medium text-gray-700'>
													{list.title}
												</h4>
												<p className='text-sm font-light text-gray-500'>
													{list.description}
												</p>
											</div>
											<Link
												className='inline-flex justify-center px-2 py-1 mr-2 text-sm font-medium text-indigo-700 border border-indigo-700 rounded hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
												to={`/wishlist/${list.id}`}
											>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													viewBox='0 0 20 20'
													fill='currentColor'
													className='w-5 h-5'
												>
													<path d='M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z' />
													<path
														fillRule='evenodd'
														d='M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
														clipRule='evenodd'
													/>
												</svg>
											</Link>
											<button className='inline-flex justify-center px-2 py-1 text-sm font-medium text-red-700 border border-red-700 rounded hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2'>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													viewBox='0 0 20 20'
													fill='currentColor'
													className='w-5 h-5'
												>
													<path
														fillRule='evenodd'
														d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
														clipRule='evenodd'
													/>
												</svg>
											</button>
										</Form>
									</li>
								))}
						</ol>
					) : (
						<p>You have not created any wishlists yet!</p>
					)}
					<div className='flex items-center justify-between'>
						<Link
							className='inline-flex justify-center px-4 py-2 mt-6 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
							to='/wishlist/add'
						>
							+ Add wishlist
						</Link>
						<Link
							className='inline-flex justify-center px-4 py-2 mt-6 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
							to={`/wishlists/${user.id}`}
						>
							View all
						</Link>
					</div>
				</div>
				<div className='flex justify-center my-8'>
					<Link
						className='inline-flex justify-center px-4 py-2 mt-6 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
						to='/wishlist/search'
					>
						Explore wishlists
					</Link>
				</div>
				<h3 className='mt-8 text-lg font-semibold leading-7 text-gray-800 sm:truncate sm:text-xl sm:tracking-tight'>
					My Events
				</h3>
				<div className='p-4 mt-2 text-center rounded bg-slate-100'>
					{events.length > 0 ? (
						<ol className='grid items-center justify-around gap-4 md:grid-cols-3 max-h-[250px] overflow-y-scroll'>
							{events.map(e => (
								<li
									key={e.id}
									className='self-start p-4 py-6 bg-white border rounded-md shadow'
								>
									<h4 className='font-medium text-gray-700'>{e.name}</h4>
									<p className='max-w-xs mt-1 text-sm font-light text-gray-500'>
										{e.date}
									</p>
								</li>
							))}
						</ol>
					) : (
						<p>You have not created any events yet!</p>
					)}
					<Link
						className='inline-flex justify-center px-4 py-2 mt-6 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
						to='/event/add'
					>
						+ Add event
					</Link>
				</div>
			</main>
		</>
	);
}
