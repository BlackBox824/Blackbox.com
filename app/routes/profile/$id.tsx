import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '~/models';

import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { Navbar } from '~/components';
import { requireUser } from '~/utils/auth';

export const loader: LoaderFunction = async ({ request }) => {
	const { user, supabaseClient } = await requireUser(request);
	const { data: profile } = await supabaseClient
		.from('user_profile')
		.select('*')
		.match({ id: user.id })
		.single();

	return json({ user, profile });
};

export const action: ActionFunction = async ({ request }) => {
	const { supabaseClient } = await requireUser(request);
	const formData = Object.fromEntries(await request.formData());

	await supabaseClient.from('user_profile').upsert(formData);
	return redirect(`/home`);
};

type LoaderData = {
	user: User;
	profile: Profile;
};

export default function UpdateProfile() {
	const { user, profile } = useLoaderData<LoaderData>();

	return (
		<>
			<Navbar user={user} />
			<main className='max-w-4xl px-2 py-4 mx-auto sm:px-6 lg:px-8'>
				<h3 className='mt-4 text-lg font-semibold leading-7 text-gray-800 sm:truncate sm:text-xl sm:tracking-tight'>
					Help us set up your profile...
				</h3>
				<div className='flex flex-col items-center justify-center p-4 mt-2 rounded md:px-8 bg-slate-100'>
					<Form method='post' className='flex flex-col w-full'>
						<div>
							<input
								name='created_at'
								type='text'
								defaultValue={profile?.created_at}
								className='hidden'
							/>
							<input
								name='id'
								type='text'
								defaultValue={profile?.id}
								className='hidden'
							/>
							<label
								htmlFor='name'
								className='block text-sm font-medium text-gray-700'
							>
								Your full name*
							</label>
							<div className='flex mt-1 rounded-md shadow-sm'>
								<input
									type='text'
									name='name'
									id='name'
									required
									defaultValue={profile.name ?? user.user_metadata.full_name}
									className='flex-1 block w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									placeholder='Peter Parker'
								/>
							</div>
						</div>
						<div className='mt-4'>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700'
							>
								Email id
							</label>
							<div className='flex mt-1 rounded-md shadow-sm'>
								<input
									type='email'
									name='email'
									id='email'
									disabled
									defaultValue={profile.email}
									className='flex-1 block w-full border-gray-300 rounded-md cursor-not-allowed focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								/>
							</div>
						</div>
						<div className='mt-4'>
							<label
								htmlFor='phone'
								className='block text-sm font-medium text-gray-700'
							>
								Your phone number*
							</label>
							<div className='flex mt-1 rounded-md shadow-sm'>
								<input
									type='tel'
									name='phone'
									id='phone'
									required
									pattern='[6-9]{1}[0-9]{9}'
									defaultValue={profile.phone}
									className='flex-1 block w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									placeholder='e.g; 9921210012'
								/>
							</div>
						</div>
						<div className='mt-4'>
							<label
								htmlFor='dob'
								className='block text-sm font-medium text-gray-700'
							>
								Date of birth*
							</label>
							<div className='flex mt-1 rounded-md shadow-sm'>
								<input
									type='date'
									name='dob'
									id='dob'
									required
									defaultValue={profile.dob}
									className='flex-1 block w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								/>
							</div>
						</div>
						<div className='mt-4'>
							<label
								htmlFor='address'
								className='block text-sm font-medium text-gray-700'
							>
								Address
							</label>
							<div className='flex mt-1 rounded-md shadow-sm'>
								<input
									type='text'
									name='address'
									id='address'
									defaultValue={profile.address}
									className='flex-1 block w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									placeholder='Khao Gali, Chandini Chowk, Delhi (455690)'
								/>
							</div>
						</div>
						<div className='mt-4'>
							<label
								htmlFor='referred_by'
								className='block text-sm font-medium text-gray-700'
							>
								Referred by
							</label>
							<div className='flex mt-1 rounded-md shadow-sm'>
								<input
									type='text'
									name='referred_by'
									id='referred_by'
									defaultValue={profile.referred_by}
									className='flex-1 block w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									placeholder='John Doe'
								/>
							</div>
						</div>
						<button
							type='submit'
							className='inline-flex items-center justify-center px-6 py-2 mt-6 text-sm font-semibold text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
						>
							Update
						</button>
					</Form>
				</div>
			</main>
		</>
	);
}
