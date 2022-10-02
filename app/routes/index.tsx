import { Navbar } from '~/components';
import supabase from '~/utils/supabase';

export default function Landing() {
	const handleSignIn = async () => {
		supabase.auth.signIn({
			provider: 'google',
		});
	};

	return (
		<>
			<Navbar />
			<main className='flex flex-col items-center justify-center max-w-4xl px-2 mx-auto my-32 sm:px-6 lg:px-8'>
				<h1 className='text-2xl font-black md:text-4xl'>MYW - MakeyourWish</h1>
				<p className='mt-1 text-xl text-center'>We Make it Happen</p>
				<button
					className='inline-flex justify-center px-8 py-3 mt-4 text-lg font-bold text-white bg-indigo-600 border border-transparent shadow-sm rounded-xl hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
					onClick={handleSignIn}
				>
					Get started
				</button>
			</main>
			<img
				src='/images/banner.png'
				alt='banner'
				className='max-w-6xl mx-auto'
			/>
		</>
	);
}
