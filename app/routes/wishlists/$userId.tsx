import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import type { User } from '@supabase/supabase-js';
import type { Profile, Wishlist } from '~/models';

import { json, redirect } from '@remix-run/node';
import { Form, Link, useLoaderData, useMatches } from '@remix-run/react';
import { Navbar } from '~/components';
import { requireUser } from '~/utils/auth';

export const loader: LoaderFunction = async ({ request, params }) => {
	const { supabaseClient, user } = await requireUser(request);
	const { data: wishlist } = await supabaseClient
		.from('wishlist')
		.select('*')
		.match({ user_id: params.userId });
	const { data: profile } = await supabaseClient
		.from('user_profile')
		.select('name')
		.match({ id: params.userId });

	return json({ wishlist, user, profile });
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
	user: User;
	profile: Profile[];
};

export default function Wishlists() {
	const matches = useMatches();
	const { wishlist, user, profile } = useLoaderData<LoaderData>();

	const isCurrentUser =
		matches.findIndex(match => match.pathname.includes(user.id)) > -1;

	const sortedWishlist = wishlist.sort((a, b) =>
		a.created_at > b.created_at ? -1 : 1
	);
	return (
		<>
			<Navbar user={user} />
			<main className='max-w-4xl px-2 py-4 mx-auto sm:px-6 lg:px-8'>
				<h2 className='mt-4 text-lg font-semibold leading-7 text-gray-800 sm:truncate sm:text-xl sm:tracking-tight'>
					{isCurrentUser ? 'My' : `${profile[0].name}'s`} Wishlists (
					{sortedWishlist.filter(list => !list.disabled).length})
				</h2>
				<div className='p-4 mt-2 rounded bg-slate-100'>
					{sortedWishlist.filter(list => !list.disabled).length > 0 ? (
						<ol>
							{sortedWishlist
								.filter(list => !list.disabled)
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
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
											</Link>
											{isCurrentUser ? (
												<button className='inline-flex justify-center px-2 py-1 text-sm font-medium text-red-700 border border-red-700 rounded hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2'>
													<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
												</button>
											) : null}
										</Form>
									</li>
								))}
						</ol>
					) : (
						<p>You have not created any wishlists yet!</p>
					)}
				</div>
			</main>
		</>
	);
}
