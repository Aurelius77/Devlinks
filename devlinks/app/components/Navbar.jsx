'use client'
import Link from "next/link"
import {usePathname, useRouter} from 'next/navigation'
import Image from "next/image"
import eye from '../../public/assets/eye.svg'
import link from '../../public/assets/link.svg'
import profile from '../../public/assets/profile.svg'


export default function Navbar(){
   const currrentPath = usePathname()
   const router = useRouter()


    const routes = [
        {
            name : "Links",
            link : "/links",
            
        },
        {
            name : 'Profile',
            link : "/profile",
            
        }
    ]

    return(
        <nav className="flex items-center justify-between">
        <h1 className='text-xl p-3'>DevLinks</h1>
        <ul className="items-center p-3 hidden md:flex">
            {routes.map((route, key)=>{
                return <Link href={route.link} key={key}><li className={currrentPath === route.link ? 'bg-purple-400 p-2 text-xl' : 'p-3 text-xl'}>{route.name}</li></Link>
            })}
        </ul>

        <ul className="flex items-center p-3 md:hidden">
            <Link href='/links'><Image src={link} height='30' weight='30' className="m-2" alt='links'/></Link>
            <Link href='/profile'><Image src={profile} height='30' weight='30' className="m-2" alt='profile'/></Link>
        </ul>

        <button className="text-xl mr-3 p-2 border border-black hover:bg-black hover:text-white hidden md:block" onClick={()=> router.push('/preview')}>Preview</button>
        <Image src={eye} height='30' weight='30' className="mr-3 block md:hidden" alt='preview' onClick={()=> router.push('/preview')}/>
        </nav>
    )
}