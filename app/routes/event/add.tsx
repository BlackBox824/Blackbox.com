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

	const newEvent = {
		user_id: user.id,
		name: formData.get('name'),
		date: formData.get('date'),
		description: formData.get('description'),
	};

	await supabaseClient.from('event').insert([newEvent]).single();

	return redirect(`/home`);
};

type LoaderData = {
	user: User;
};

export default function AddEvent() {
	const { user } = useLoaderData<LoaderData>();

	return (
		<>
			<Navbar user={user} />
			<main className='max-w-4xl px-2 py-4 mx-auto sm:px-6 lg:px-8'>
				<h3 className='mt-4 text-lg font-semibold leading-7 text-gray-800 sm:truncate sm:text-xl sm:tracking-tight'>
					Create a New Event!
				</h3>
				<p className='text-sm text-gray-500'>
					We'll let your closed ones know!
				</p>
				<div className='flex flex-col items-center justify-center p-4 mt-4 rounded md:px-8 bg-slate-100'>
					<Form method='post' className='flex flex-col w-full'>
						<div>
							<label
								htmlFor='name'
								className='block text-sm font-medium text-gray-700'
							>
								Name of your Event*
							</label>
							<div className='flex mt-1 rounded-md shadow-sm'>
								<input
									type='text'
									name='name'
									id='name'
									required
									className='flex-1 block w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									placeholder='Love Anniversary / Career Milestone'
								/>
							</div>
						</div>
						<div className='mt-4'>
							<label
								htmlFor='date'
								className='block text-sm font-medium text-gray-700'
							>
								Date of the event
							</label>
							<div className='flex mt-1 rounded-md shadow-sm'>
								<input
									type='date'
									name='date'
									id='date'
									required
									className='flex-1 block w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								/>
							</div>
						</div>
						<div className='mt-4'>
							<label
								htmlFor='description'
								className='block text-sm font-medium text-gray-700'
							>
								Brief description for the event
							</label>
							<div className='mt-1'>
								<textarea
									id='description'
									name='description'
									rows={3}
									className='block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									placeholder='Tell your closed ones why it is important to you'
								/>
							</div>
						</div>
						<button
							type='submit'
							className='inline-flex items-center justify-center px-6 py-2 mt-4 text-sm font-semibold text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
						>
							+ Create Event
						</button>
					</Form>
				</div>
			</main>
		</>
	);
}
