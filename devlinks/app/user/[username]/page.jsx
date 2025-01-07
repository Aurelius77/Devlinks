'use client';

import { useEffect, useState } from "react";
import { getUser } from "@/app/backend/server"; // Ensure this path is correct
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function User({ params }) {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!params?.username) {
      console.error("Username parameter is missing.");
      return;
    }

    const id = decodeURIComponent(params.username);

    async function getData() {
      try {
        const userData = await getUser(id);
        setData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    getData();
  }, [params?.username]);

  function redirectToLink(url) {
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    window.location.href = formattedUrl;
  }

  return (
    <>
      {data ? (
        <>
          <div className="bg-purple-600 w-full rounded-b-md box-border p-12">
            <nav className="bg-white p-2 m-3 rounded-md flex justify-between items-center">
              <p
                className="text-purple-600 border border-purple-600 p-2 m-1 cursor-pointer"
                onClick={() => router.push('/profile')}
              >
                Get yours
              </p>
              <p
                className="bg-purple-600 text-white rounded-md p-2 m-1 cursor-pointer"
                onClick={() => router.push('/login')}
              >
                Edit
              </p>
            </nav>
          </div>

          <div className="container w-full flex justify-center items-center mt-2">
            <div className="card p-5 bg-white flex flex-col items-center shadow-md rounded-md">
              <Image
                src={data.image || '/default-profile.png'} // Provide a default fallback image
                className="rounded-full"
                alt="Profile Picture"
                width={200}
                height={200}
              />
              <h1 className="p-2 m-2 text-xl font-bold">
                {`${data.name || ''} ${data.lastname || ''}`}
              </h1>
              <p className="p-2 m-2">{data.email || 'No email available'}</p>
              <div className="links w-full">
                {data.links && data.links.length > 0 ? (
                  data.links.map((link, index) => (
                    <div
                      className="w-full bg-red-500 rounded-md m-2 p-2 cursor-pointer text-white text-center"
                      key={index}
                      onClick={() => redirectToLink(link.link)}
                    >
                      {link.name || 'Unnamed Link'}
                    </div>
                  ))
                ) : (
                  <p>No links available</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center mt-10">Loading user data...</p>
      )}
    </>
  );
}
