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
			<main className='flex flex-col items-center justify-center max-w-6xl px-2 mx-auto sm:px-6 lg:px-8'>
				<h1 className='mt-16 text-2xl font-black md:text-4xl'>MakeyourWish</h1>
				<p className='mt-1 mb-16 text-lg text-center md:text-xl'>
					We Make it Happen
				</p>
				<img src='/images/banner1.jpeg' alt='banner' />
				<button
					className='inline-flex justify-center px-8 py-3 mt-12 text-lg font-bold text-white bg-indigo-600 border border-transparent shadow-sm rounded-xl hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
					onClick={handleSignIn}
				>
					Get started
				</button>
			</main>
		</>
	);
}
