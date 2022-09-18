import type { LoaderFunction } from '@remix-run/node';

import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import withAuth from '~/utils/withAuth';
import { Navbar } from '~/components';

export const loader: LoaderFunction = withAuth(
	async ({ supabaseClient, user }) => {
		const { data: wishlist } = await supabaseClient
			.from('wishlist')
			.select('*');
		const { data: events } = await supabaseClient.from('event').select('*');

		return json({ wishlist, events, user });
	}
);

export default function Home() {
	const { wishlist, events, user } = useLoaderData();

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
					<p>You have not created any wishlists yet!</p>
					<button
						className='inline-flex justify-center px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
						onClick={() => {
							console.log('Hi!');
						}}
					>
						+ Add wishlist
					</button>
				</div>
				<h3 className='mt-8 text-lg font-semibold leading-7 text-gray-800 sm:truncate sm:text-xl sm:tracking-tight'>
					My Events
				</h3>
				<div className='mt-2 p-4 bg-slate-100 flex flex-col items-center justify-center min-h-[150px] text-center rounded'>
					<p>You have not created any events yet!</p>
					<button className='inline-flex justify-center px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'>
						+ Add event
					</button>
				</div>
			</main>
		</>
	);
}
