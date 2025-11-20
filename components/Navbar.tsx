'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { FlagIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const router = useRouter();
  const { currentUser, logout: authLogout } = useAuth();

  function handleLogout() {
    authLogout();
    router.push('/');
  }

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Challenge App
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/profiles">Profiles</Link>
          </li>
          <li>
            <Link href="/challenges">Challenges</Link>
          </li>
        </ul>
        
        {currentUser ? (
          <>
            <Link href="/challenges/new" className="btn btn-primary btn-sm mr-2">
              Create Challenge
            </Link>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img 
                    src={currentUser.photo || `https://ui-avatars.com/api/?name=${currentUser.name}`} 
                    alt={currentUser.name} 
                  />
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li className="menu-title">
                  <span>{currentUser.name}</span>
                </li>
                <li className="disabled">
                  <a className="text-xs opacity-70">{currentUser.role}</a>
                </li>
                <li className="disabled">
                  <a className="text-xs opacity-70 flex items-center gap-1">
                    <FlagIcon className="w-3 h-3" />
                    {currentUser.country}
                  </a>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <Link href={`/profiles/${currentUser.id}`}>View Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error">Logout</button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link href="/profiles" className="btn btn-ghost btn-sm">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
