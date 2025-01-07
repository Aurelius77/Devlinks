'use client'
import Image from "next/image";
import login from '../../../public/login.svg'
import google from '../../../public/google.svg'
import github from '../../../public/github.svg'
import Link from "next/link";
import { useState } from "react";
import { Register } from "../../backend/server";
import { useRouter } from "next/navigation";
import { SocialLogin } from "../../backend/server";


export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const [confirm, setConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)


  function handleConfirmation(e) {
  const value = e.target.value;
  setConfirmedPassword(value);
  setConfirmation(value === password);
}

  async function handleSubmission(e){
     e.preventDefault()
     if (!confirm) {
    alert("Passwords do not match!");
    return;
  }
     setLoading(true)
     const result = await Register(email, password)
     setLoading(false)
     router.push('/login')
     console.log(result)

  }


  return (
    <div className="flex min-h-screen w-full bg-white">
 
      <div className="w-full p-8 shadow-lg mx-auto sm:w-1/2 lg:mx-0 lg:w-1/2">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Register</h1>


        <form className="space-y-4" onSubmit ={handleSubmission}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
            required
              type="email"
              id="email"
              value ={email}
              onChange = {(e)=>setEmail(e.target.value)}
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
              value = {password}
              onChange = {(e)=>setPassword(e.target.value)}
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
              value = {confirmedPassword}
              onChange = {(e)=>handleConfirmation(e)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
            {!confirm && confirmedPassword && (
    <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
  )}
          </div>
          <button
            type="submit"
             className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 ${loading ? `cursor-not-allowed bg-gray-100`: ''}`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>


        <div className="mt-6 flex flex-col space-y-3">
          <button
            type="submit"
            onClick={()=>SocialLogin()}
            name = 'action'
            value = 'google'
            className="w-full flex items-center justify-center bg-gray-100 text-gray-800 py-2 px-4 rounded-md border hover:bg-gray-200"
          >
            <Image src={google} alt="Google" className="w-5 h-5 mr-2" />
            Signup with Google
          </button>
          <button
            type="submit"
            onClick={()=>SocialLogin()}
            name = 'action'
            value = 'github'
            className='w-full flex items-center justify-center bg-gray-100 text-gray-800 py-2 px-4 rounded-md border hover:bg-gray-200 '
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
