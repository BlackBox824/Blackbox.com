import type { LoaderFunction } from '@remix-run/node';

import { redirect } from '@remix-run/node';
import { requireUser } from '~/utils/auth';

export const loader: LoaderFunction = async ({ request }) => {
	const { supabaseClient } = await requireUser(request);
	const { data: wishlist } = await supabaseClient.from('wishlist').select('*');

	if (wishlist?.length === 0) {
		throw redirect('/profile/edit');
	} else {
		throw redirect('/home');
	}
};

export default function Skeleton() {
	return <p className='text-lg font-light text-gray-800'>Just a moment...</p>;
}
