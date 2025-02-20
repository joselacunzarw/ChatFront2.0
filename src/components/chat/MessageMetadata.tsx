import React from 'react';
import { formatDateTime } from '../../utils/dateTime';

interface MessageMetadataProps {
  timestamp: number;
  user?: {
    name?: string;
    email?: string;
  };
  isUser: boolean;
}

export function MessageMetadata({ timestamp, user, isUser }: MessageMetadataProps) {
  return (
    <div className="flex items-center justify-between text-xs mt-2 opacity-70">
      <span className="mr-2">
        {isUser ? (user?.name || user?.email || 'Usuario') : 'Asistente UDC'}
      </span>
      <span>{formatDateTime(timestamp)}</span>
    </div>
  );
}