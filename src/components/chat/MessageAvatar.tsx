import React from 'react';
import { Bot, UserCircle2 } from 'lucide-react';

interface MessageAvatarProps {
  isUser: boolean;
  userAvatar?: string;
  userName?: string;
}

export function MessageAvatar({ isUser, userAvatar, userName }: MessageAvatarProps) {
  return (
    <div className="flex-shrink-0">
      {isUser ? (
        <div className="relative w-10 h-10">
          {userAvatar ? (
            <img 
              src={userAvatar} 
              alt={userName || 'Usuario'} 
              className="rounded-full w-10 h-10 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`${userAvatar ? 'hidden' : ''} absolute inset-0 rounded-full bg-primary text-white flex items-center justify-center`}>
            <UserCircle2 className="h-6 w-6" />
          </div>
        </div>
      ) : (
        <div className="rounded-full p-2 bg-primary/10">
          <Bot className="h-6 w-6 text-primary" />
        </div>
      )}
    </div>
  );
}