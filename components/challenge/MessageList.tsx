/**
 * Message List Component
 * Displays and manages challenge collaboration messages
 */

import { useState } from 'react';
import { Message, Profile } from '@/types';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/solid';

interface MessageListProps {
  /** List of messages */
  messages: Message[];
  /** All profiles (for sender lookup) */
  profiles: Profile[];
  /** Current user */
  currentUser: Profile | null;
  /** Callback when sending a message */
  onSendMessage: (content: string, senderId: string) => void;
  /** Whether the challenge is completed */
  isCompleted?: boolean;
}

/**
 * Collaboration room message list
 * Shows all messages and allows sending new ones
 */
export function MessageList({
  messages,
  profiles,
  currentUser,
  onSendMessage,
  isCompleted = false
}: MessageListProps) {
  const [newMessage, setNewMessage] = useState('');
  const [selectedSender, setSelectedSender] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const senderId = currentUser?.id || selectedSender;
    if (!senderId) return;

    onSendMessage(newMessage, senderId);
    setNewMessage('');
  };

  const getSenderProfile = (senderId: string) => {
    return profiles.find(p => p.id === senderId);
  };

  return (
    <div className="card bg-base-100 shadow-2xl">
      <div className="card-body">
        <h2 className="card-title text-lg flex items-center gap-2">
          <ChatBubbleLeftIcon className="w-5 h-5" />
          Collaboration Room ({messages.length})
        </h2>
        <div className="divider my-1"></div>

        {/* Messages List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8 opacity-50">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map(message => {
              const sender = getSenderProfile(message.sender_profile_id);
              return (
                <div key={message.id} className="chat chat-start">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      {sender?.photo ? (
                        <img src={sender.photo} alt={sender.name} />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                          {sender?.name.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="chat-header">
                    {sender?.name || 'Unknown'}
                    <time className="text-xs opacity-50 ml-2">
                      {new Date(message.created_at).toLocaleString()}
                    </time>
                  </div>
                  <div className="chat-bubble">{message.content}</div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input */}
        {isCompleted ? (
          <div className="alert alert-success mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Challenge completed - Messages are read-only</span>
          </div>
        ) : (
          <div className="mt-4">
            {!currentUser && (
              <div className="form-control mb-2">
                <label className="label">
                  <span className="label-text text-xs">Send as:</span>
                </label>
                <select
                  className="select select-bordered select-sm"
                  value={selectedSender}
                  onChange={e => setSelectedSender(e.target.value)}
                >
                  <option value="">Select a profile</option>
                  {profiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="input input-bordered flex-1"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
              />
              <button
                className="btn btn-primary"
                onClick={handleSend}
                disabled={!newMessage.trim() || (!currentUser && !selectedSender)}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
