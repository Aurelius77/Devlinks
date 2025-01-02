'use client'
import Image from "next/image";
import login from '../../../public/login.svg'
import google from '../../../public/google.svg'
import github from '../../../public/github.svg'
import Link from "next/link";
import { useState } from "react";


export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmEmail, setConfirmedPassword] = useState('')

  return (
    <div className="flex min-h-screen w-full bg-white">
 
      <div className="w-full p-8 shadow-lg mx-auto sm:w-1/2 lg:mx-0 lg:w-1/2">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Register</h1>


        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
            required
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
            required
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirm password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
            required
              type="password"
              id="confirm password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>


        <div className="mt-6 flex flex-col space-y-3">
          <button
            type="button"
            className="w-full flex items-center justify-center bg-gray-100 text-gray-800 py-2 px-4 rounded-md border hover:bg-gray-200"
          >
            <Image src={google} alt="Google" className="w-5 h-5 mr-2" />
            Signup with Google
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center bg-gray-100 text-gray-800 py-2 px-4 rounded-md border hover:bg-gray-200"
          >
            <Image src={github} alt="GitHub" className="w-5 h-5 mr-2" />
            Signup with GitHub
          </button>
        </div>


        <div className="mt-6 text-sm text-gray-600 flex items-center">
          
          <Link href="/login" className="hover:underline"><p className="text-center">Already have an account? Sign in</p></Link>
        </div>
      </div>


      <div className="hidden lg:block lg:w-1/2 bg-blue-50">
        <Image
          src={login}
          alt=""
          className=""
        />
      </div>
    </div>
  );
}
