import type { LoaderFunction } from '@remix-run/node';
import type { User } from '@supabase/supabase-js';
import type { Wishlist, Event } from '~/models';

import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Navbar } from '~/components';
import { requireUser } from '~/utils/auth';

export const loader: LoaderFunction = async ({ request }) => {
	const { supabaseClient, user } = await requireUser(request);
	const { data: wishlist } = await supabaseClient.from('wishlist').select('*');
	const { data: events } = await supabaseClient.from('event').select('*');

	return json({ wishlist, events, user });
};

type LoaderData = {
	wishlist: Wishlist[];
	events: Event[];
	user: User;
};

export default function Home() {
	const { wishlist, user } = useLoaderData<LoaderData>();
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
				<div className='mt-2 p-4 bg-slate-100 flex flex-col items-center justify-center min-h-[150px] text-center rounded'>
					{wishlist.length > 0 ? (
						<ol className='grid items-center justify-around grid-cols-3 gap-4'>
							{wishlist.map(list => (
								<li
									key={list.id}
									className='self-start p-4 py-6 bg-white border rounded-md shadow'
								>
									<h4 className='font-medium text-gray-700'>{list.title}</h4>
									<p className='max-w-xs mt-1 text-sm font-light text-gray-500'>
										{list.description}
									</p>
									<Link
										className='inline-flex justify-center px-3 py-1 mt-6 text-sm font-medium text-indigo-700 border border-indigo-700 rounded hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
										to={`/wishlist/${list.id}`}
									>
										View
									</Link>
								</li>
							))}
						</ol>
					) : (
						<p>You have not created any wishlists yet!</p>
					)}
					<Link
						className='inline-flex justify-center px-4 py-2 mt-6 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
						to='/wishlist/add'
					>
						+ Add wishlist
					</Link>
				</div>
				<h3 className='mt-8 text-lg font-semibold leading-7 text-gray-800 sm:truncate sm:text-xl sm:tracking-tight'>
					My Events
				</h3>
				<div className='mt-2 p-4 bg-slate-100 flex flex-col items-center justify-center min-h-[150px] text-center rounded'>
					<p>You have not created any events yet!</p>
					<Link
						className='inline-flex justify-center px-4 py-2 mt-6 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
						to='/add-event'
					>
						+ Add event
					</Link>
				</div>
			</main>
		</>
	);
}
