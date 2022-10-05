import type { User } from '@supabase/supabase-js';

import { useState } from 'react';
import { Link } from '@remix-run/react';
import supabase from '~/utils/supabase';

export function Navbar({ user }: { user?: User | null }) {
	const handleSignIn = async () => {
		supabase.auth.signIn({
			provider: 'google',
		});
	};

	return (
		<nav className='bg-gray-800'>
			<div className='max-w-6xl px-2 mx-auto sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					<Link prefetch='intent' to='/home'>
						<h1 className='font-Montserrat font-bold text-white md:text-lg'>MakeyourWish</h1>
					</Link>
					{user ? (
						<UserMenu
							name={user.user_metadata.full_name as string}
							imgUrl={user.user_metadata.avatar_url as string}
						/>
					) : (
						<button
							type='submit'
							className='inline-flex justify-center px-3 py-2 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
							onClick={handleSignIn}
						>
							<span>Sign in with Google</span>
						</button>
					)}
				</div>
			</div>
		</nav>
	);
}

function UserMenu({ name, imgUrl }: { name: string; imgUrl: string }) {
	const [isOpen, setIsOpen] = useState(false);

	const handleSignOut = () => {
		supabase.auth.signOut();
	};

	return (
		<div className='relative ml-3'>
			<div>
				<button
					type='button'
					className='flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
					id='user-menu-button'
					aria-expanded='false'
					aria-haspopup='true'
					onClick={() => {
						setIsOpen(!isOpen);
					}}
				>
					<span className='sr-only'>Open user menu</span>
					<img
						className='w-8 h-8 rounded-full'
						src={imgUrl}
						alt={`${name} profile`}
						referrerPolicy='no-referrer'
					/>
				</button>
			</div>
			<div
				className={`absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition transform ${
					isOpen
						? 'block ease-in duration-75 opacity-100 scale-100'
						: 'hidden ease-out duration-100 opacity-0 scale-95'
				}`}
				role='menu'
				aria-orientation='vertical'
				aria-labelledby='user-menu-button'
				tabIndex={-1}
			>
				<Link
					to='/profile/edit'
					className='block px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-slate-200'
					role='menuitem'
					tabIndex={-1}
					id='user-menu-item-1'
				>
					Update Profile
				</Link>
				<Link
					to='/event/add'
					className='block px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-slate-200'
					role='menuitem'
					tabIndex={-1}
					id='user-menu-item-0'
				>
					Add Events
				</Link>
				<button
					className='w-full px-4 py-2 text-sm text-left text-gray-700 hover:text-gray-900 hover:bg-slate-200'
					role='menuitem'
					tabIndex={-1}
					id='user-menu-item-2'
					onClick={handleSignOut}
				>
					Sign out
				</button>
			</div>
		</div>
	);
}
