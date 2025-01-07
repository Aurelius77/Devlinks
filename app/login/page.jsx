'use client'
import Image from "next/image";
import vector from '../../public/login.svg'
import google from '../../public/google.svg'
import github from '../../public/github.svg'
import Link from "next/link";
import { useState } from "react";
import { login } from "../backend/server";
import { useRouter } from 'next/navigation';
import { SocialLogin } from "../backend/server";


export default function Login() {
  const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmission(e){
       e.preventDefault()
       setLoading(true)
       const result = await login(email, password)

       if (result.success) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

         console.log('Login successful');
         router.push('./profile')
    } else {
        console.error(result.message);
    }

       setLoading(false)
       console.log(result) 
    }

  return (
    <div className="flex min-h-screen w-full bg-white">
 
      <div className="w-full p-8 shadow-lg mx-auto sm:w-1/2 lg:mx-0 lg:w-1/2">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Login</h1>


        <form className="space-y-4" onSubmit ={handleSubmission}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
            required
              type="email"
              id="email"
              value = {email}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
              onChange = {(e)=>setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
            required
              type="password"
              id="password"
              value = {password}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              onChange = {(e)=>setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 ${loading ? `cursor-not-allowed bg-gray-100`: ''}`}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>


        <div className="mt-6 flex flex-col space-y-3">
          <button
            type="submit"
            onClick={(e)=>SocialLogin(e)}
            name = 'action'
            value = 'google'
            className="w-full flex items-center justify-center bg-gray-100 text-gray-800 py-2 px-4 rounded-md border hover:bg-gray-200"
          >
            <Image src={google} alt="Google" className="w-5 h-5 mr-2" />
            Login with Google
          </button>
          <button
            type="submit"
            onClick={(e)=>SocialLogin(e)}
            name = 'action'
            value = 'google'
            className="w-full flex items-center justify-center bg-gray-100 text-gray-800 py-2 px-4 rounded-md border hover:bg-gray-200"
          >
            <Image src={github} alt="GitHub" className="w-5 h-5 mr-2" />
            Login with GitHub
          </button>
        </div>


        <div className="mt-6 flex justify-between text-sm text-gray-600">
          <Link href="/forgot-password" className="hover:underline">Forgot Password?</Link>
          <Link href="./login/register" className="hover:underline">Register</Link>
        </div>
      </div>


      <div className="hidden lg:block lg:w-1/2 bg-blue-50">
        <Image
          src={vector}
          alt=""
          className=""
        />
      </div>
    </div>
  );
}
