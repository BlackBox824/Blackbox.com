import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import type { User } from '@supabase/supabase-js';

import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { Navbar } from '~/components';
import { requireUser } from '~/utils/auth';

export const loader: LoaderFunction = async ({ request }) => {
	const { user } = await requireUser(request);

	return json({ user });
};

export const action: ActionFunction = async ({ request }) => {
	const { supabaseClient, user } = await requireUser(request);
	const formData = await request.formData();

	const newWishlist = {
		user_id: user.id,
		title: formData.get('title'),
		description: formData.get('description'),
	};

	const { data } = await supabaseClient
		.from('wishlist')
		.insert([newWishlist])
		.single();

	return redirect(`/wishlist/${data?.id}`);
};

type LoaderData = {
	user: User;
};

export default function AddWishlist() {
	const { user } = useLoaderData<LoaderData>();

	return (
		<>
			<Navbar user={user} />
			<main className='max-w-4xl px-2 py-4 mx-auto sm:px-6 lg:px-8'>
				<h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'></h2>
				<h3 className='mt-4 text-lg font-semibold leading-7 text-gray-800 sm:truncate sm:text-xl sm:tracking-tight'>
					Create a new wishlist
				</h3>
				<div className='mt-2 p-4 md:px-8 bg-slate-100 flex flex-col items-center justify-center min-h-[150px] rounded'>
					<Form method='post' className='flex flex-col w-full'>
						<div>
							<label
								htmlFor='title'
								className='block text-sm font-medium text-gray-700'
							>
								Name of your wishlist*
							</label>
							<div className='flex mt-1 rounded-md shadow-sm'>
								<input
									type='text'
									name='title'
									id='title'
									required
									className='flex-1 block w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									placeholder='My dream gifts'
								/>
							</div>
						</div>
						<div className='mt-4'>
							<label
								htmlFor='description'
								className='block text-sm font-medium text-gray-700'
							>
								Brief description for your wishlist
							</label>
							<div className='mt-1'>
								<textarea
									id='description'
									name='description'
									rows={3}
									className='block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									placeholder='I wish my secret santa could gift me all these goodies'
								/>
							</div>
						</div>
						<div className='flex items-baseline justify-between mt-6'>
							<button
								type='submit'
								className='inline-flex items-center justify-center px-6 py-2 mt-4 text-sm font-semibold text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
							>
								<span className='mr-1'>Create Wishlist</span>
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
										d='M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3'
									/>
								</svg>
							</button>
							<p className='text-sm text-gray-500'>Step 1/2</p>
						</div>
					</Form>
				</div>
			</main>
		</>
	);
}
