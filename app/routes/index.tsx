import { Navbar } from '~/components';
import supabase from '~/utils/supabase';

export default function Index() {
	const handleSignIn = async () => {
		supabase.auth.signIn({
			provider: 'google',
		});
	};

	return (
		<>
			<Navbar />
			<main className='flex flex-col items-center justify-center h-[90vh] max-w-4xl px-2 mx-auto sm:px-6 lg:px-8'>
				<h1 className='text-6xl font-black'>Black Box</h1>
				<p className='mt-2 text-center'>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Non,
					assumenda est cupiditate praesentium unde quasi exercitationem
					recusandae.
				</p>
				<button
					className='inline-flex justify-center px-8 py-3 mt-4 text-lg font-bold text-white bg-indigo-600 border border-transparent shadow-sm rounded-xl hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
					onClick={handleSignIn}
				>
					Create wishlist
				</button>
			</main>
		</>
	);
}
