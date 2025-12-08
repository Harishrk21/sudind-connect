import React, { useState } from 'react';
import { Search, Send, User, Clock } from 'lucide-react';
import { useDataStore } from '@/contexts/DataStore';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const AdminMessages: React.FC = () => {
  const { user } = useAuth();
  const { messages, users, addMessage, markMessageRead } = useDataStore();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique conversations for admin
  const getConversations = () => {
    if (!user) return [];
    
    const userMessages = messages.filter(m => m.senderId === user.id || m.receiverId === user.id);
    const conversationUserIds = new Set<number>();
    
    userMessages.forEach(m => {
      if (m.senderId !== user.id) conversationUserIds.add(m.senderId);
      if (m.receiverId !== user.id) conversationUserIds.add(m.receiverId);
    });
    
    return Array.from(conversationUserIds).map(id => {
      const conversationUser = users.find(u => u.id === id);
      const lastMessage = userMessages
        .filter(m => m.senderId === id || m.receiverId === id)
        .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0];
      const unread = userMessages.filter(m => m.senderId === id && !m.read && m.receiverId === user.id).length;
      
      return {
        user: conversationUser,
        lastMessage,
        unread,
      };
    }).filter(c => c.user);
  };

  const conversations = getConversations().filter(c =>
    c.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversation = selectedUserId
    ? messages
        .filter(m =>
          (m.senderId === user?.id && m.receiverId === selectedUserId) ||
          (m.receiverId === user?.id && m.senderId === selectedUserId)
        )
        .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
    : [];

  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;

  const handleSend = () => {
    if (!newMessage.trim() || !selectedUserId || !user) return;
    
    addMessage({
      senderId: user.id,
      receiverId: selectedUserId,
      text: newMessage,
    });
    
    setNewMessage('');
    
    // Mark messages as read when sending
    if (selectedUserId) {
      messages
        .filter(m => m.senderId === selectedUserId && m.receiverId === user.id && !m.read)
        .forEach(m => markMessageRead(m.msgId));
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] bg-card rounded-xl border border-border overflow-hidden flex">
      {/* Conversation list */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 text-sm"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.user?.id}
                onClick={() => setSelectedUserId(conv.user?.id || null)}
                className={cn(
                  'w-full p-4 flex items-start gap-3 border-b border-border hover:bg-muted/50 transition-colors text-left',
                  selectedUserId === conv.user?.id && 'bg-muted/50'
                )}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium flex-shrink-0">
                  {conv.user?.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground truncate">{conv.user?.name}</p>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage?.text}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {conv.lastMessage && new Date(conv.lastMessage.sentAt).toLocaleString()}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedUser.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{selectedUser.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.map((msg) => (
                <div
                  key={msg.msgId}
                  className={cn(
                    'flex',
                    msg.senderId === user?.id ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[70%] rounded-2xl px-4 py-2.5',
                      msg.senderId === user?.id
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-muted text-foreground rounded-tl-sm'
                    )}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={cn(
                      'text-xs mt-1',
                      msg.senderId === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="input-field flex-1"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="btn-primary px-4"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
