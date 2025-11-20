/**
 * Rating Modal Component
 * Modal for rating participants when completing a challenge
 */

import { Profile } from '@/types';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

interface RatingModalProps {
  /** Show/hide modal */
  isOpen: boolean;
  /** Participants to rate */
  participants: Profile[];
  /** Current ratings state */
  ratings: Record<string, number>;
  /** Callback when rating changes */
  onRatingChange: (profileId: string, rating: number) => void;
  /** Callback when submitting ratings */
  onSubmit: () => void;
  /** Callback when closing modal */
  onClose: () => void;
}

/**
 * Modal for rating challenge participants
 * Allows rating each participant 1-5 stars before completing challenge
 */
export function RatingModal({
  isOpen,
  participants,
  ratings,
  onRatingChange,
  onSubmit,
  onClose
}: RatingModalProps) {
  if (!isOpen) return null;

  const allRated = participants.every(p => ratings[p.id] > 0);

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-4">Rate Participants</h3>
        <p className="text-sm opacity-70 mb-6">
          Please rate each participant's contribution to this challenge (1-5 stars)
        </p>

        <div className="space-y-4">
          {participants.map(participant => (
            <div key={participant.id} className="card bg-base-200">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {participant.photo && (
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img src={participant.photo} alt={participant.name} />
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{participant.name}</div>
                      <div className="text-sm opacity-70">{participant.role}</div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className="btn btn-ghost btn-sm p-0"
                        onClick={() => onRatingChange(participant.id, star)}
                      >
                        {star <= (ratings[participant.id] || 0) ? (
                          <StarIcon className="w-6 h-6 text-warning" />
                        ) : (
                          <StarIconOutline className="w-6 h-6 text-warning" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={onSubmit}
            disabled={!allRated}
          >
            {allRated ? 'Complete Challenge' : 'Please rate all participants'}
          </button>
        </div>
      </div>
    </dialog>
  );
}
