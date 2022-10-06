import type { LoaderFunction } from '@remix-run/node';

import { useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect } from 'react';
import { requireUser } from '~/utils/auth';

export const loader: LoaderFunction = async ({ request }) => {
	const { user } = await requireUser(request);
	return { user };
};

export default function Skeleton() {
	const navigate = useNavigate();
	const { user } = useLoaderData();

	useEffect(() => {
		if (user) {
			navigate('/home');
		}
	}, [navigate, user]);
	return (
		<p className='p-4 pt-40 text-lg font-bold text-gray-800 text-center'>Please be Patient...Your wishes are coming true!</p>
	);
}
