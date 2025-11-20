import { Challenge } from '@/types';
import { useRouter } from 'next/navigation';

interface ChallengeHeaderProps {
  challenge: Challenge;
  isCreator: boolean;
  onComplete: () => void;
}

export function ChallengeHeader({ challenge, isCreator, onComplete }: ChallengeHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div className="flex-1">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
          {challenge.title}
        </h1>
        <div className="flex flex-wrap gap-2">
          <span className={`badge badge-lg gap-2 ${challenge.type === 'public' ? 'badge-success' : 'badge-warning'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {challenge.type === 'public' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              )}
            </svg>
            {challenge.type === 'public' ? 'Public' : 'Private'}
          </span>
          <span className={`badge badge-lg gap-2 ${challenge.status === 'completed' ? 'badge-success' : 'badge-info'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {challenge.status === 'completed' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            {challenge.status === 'completed' ? 'Completed' : 'Ongoing'}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        {challenge.status === 'ongoing' && isCreator && (
          <button 
            onClick={onComplete} 
            className="btn btn-success btn-lg gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Complete Challenge
          </button>
        )}
        <button onClick={() => router.back()} className="btn btn-ghost btn-lg">
          ← Back
        </button>
      </div>
    </div>
  );
}
