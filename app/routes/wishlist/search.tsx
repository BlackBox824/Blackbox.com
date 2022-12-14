import type { LoaderFunction } from "@remix-run/node";
import type { User } from "@supabase/supabase-js";
import type { Wishlist } from "~/models";

import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Navbar } from "~/components";
import { requireUser } from "~/utils/auth";

export const loader: LoaderFunction = async ({ request }) => {
  const { supabaseClient, user } = await requireUser(request);

  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("term");

  const { data: wishlist } = await supabaseClient.from("wishlist").select(`
		id,
		title,
		description,
		disabled,
		user: user_id ( id, name, phone, email, dob, address )
	`);

  const filteredWishlist = wishlist?.filter(
    (item) =>
      (!item.disabled &&
        item.user.name &&
        item.user.name
          .toLowerCase()
          .includes(searchTerm?.trim().toLowerCase())) ||
      (item.user.phone && item.user.phone === searchTerm)
  );

  return json({ wishlist: filteredWishlist, user });
};

type LoaderData = {
  wishlist: Wishlist[];
  user: User;
};

export default function Explore() {
  const { wishlist, user } = useLoaderData<LoaderData>();

  const userList = wishlist?.reduce((curr, acc) => {
    curr[acc?.user?.id] = curr[acc?.user?.id] || [];
    curr[acc?.user?.id].push(acc);
    return curr;
  }, Object.create(null));

  const resultedUsers = userList ? Object.keys(userList) : [];

  return (
    <>
      <Navbar user={user} />
      <main className="max-w-4xl px-2 py-4 mx-auto sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Explore Wishlists
        </h2>
        <div className="p-4 mt-2 text-center rounded bg-slate-100">
          <Form className="relative" method="get">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <input
              type="text"
              name="term"
              id="term"
              placeholder="Enter Name / Phone number"
              autoComplete="off"
              className="w-full py-2 pl-12 pr-4 placeholder-gray-400 border border-gray-300 rounded-md"
            />
          </Form>
          {resultedUsers?.length > 0 ? (
            <ol className="flex flex-col gap-2 mt-4">
              {resultedUsers.map((userId) => (
                <li
                  key={userId}
                  className="flex items-center justify-between gap-4 p-4 py-6 bg-white border rounded-md shadow"
                >
                  <div>
                    <h4 className="font-medium text-left text-gray-700">
                      {userList[userId][0].user.name} ({userList[userId].length}
                      )
                    </h4>
                    <p className="mt-1 text-sm font-light text-left text-gray-500">
                      Phone: {userList[userId][0].user?.phone ?? "NA"}
                    </p>
                    <p className="mt-1 text-sm font-light text-left text-gray-500">
                      DOB: {userList[userId][0].user?.dob ?? "NA"}
                    </p>
                    <p className="mt-1 text-sm font-light text-left text-gray-500">
                      Address: {userList[userId][0].user?.address ?? "NA"}
                    </p>
                  </div>
                  <Link
                    className="inline-flex justify-center px-3 py-1 text-sm font-medium text-indigo-700 border border-indigo-700 rounded hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                    to={`/wishlists/${userId}`}
                  >
                    View
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-1 text-sm font-light text-left text-gray-500 text-center">
              No results found...
            </p>
          )}
        </div>
      </main>
    </>
  );
}
