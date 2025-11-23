import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { StorageService } from '../services/storageService';
import { GeminiService } from '../services/geminiService';
import { Button } from './Button';

interface ChatInterfaceProps {
  user: User;
  spaceId: string;
  onLogout: () => void;
}

// 常用 Emoji 列表
const EMOJIS = [
  "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🥰", "😍", "🤩", "😘", 
  "😗", "☺️", "😊", "😇", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤔", "🤫", 
  "🤭", "🤗", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥",
  "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵",
  "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "😎", "🤓", "🧐", "😕", "😟", "🙁",
  "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭",
  "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬",
  "😈", "👿", "💀", "☠️", "💩", "🤡", "👻", "👽", "👾", "🤖", "😺", "😸",
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕",
  "💞", "💓", "💗", "💖", "💘", "💝", "💟", "👍", "👎", "👊", "✊", "🤛",
  "🤜", "🤞", "✌️", "🤟", "🤘", "👌", "🤏", "👈", "👉", "👆", "👇", "☝️",
  "✋", "🤚", "🖐", "🖖", "👋", "🤙", "💪", "🙏", "💋", "👄", "🦷", "👅",
  "🎉", "🎊", "🎈", "🎂", "🎀", "🎁", "🕯", "🧸", "🌹", "🌺", "🌸", "🌼",
  "🌻", "☀️", "🌙", "⭐", "🌟", "✨", "⚡", "🔥", "❄️", "💧", "☔", "🌈"
];

const STICKERS = [
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Love&backgroundColor=f4d2e4',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cuddle&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Wink&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Shy&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Excited&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Surprise&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cry&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Angry&backgroundColor=f4d2e4',
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, spaceId, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [spaceName, setSpaceName] = useState('');
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  
  // 表情面板状态
  const [showPicker, setShowPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState<'emoji' | 'sticker'>('emoji');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initial load
    loadData();
    // Poll for changes (simulating realtime for this demo)
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaceId]);

  const loadData = () => {
    const spaceData = StorageService.getSpace(spaceId);
    if (spaceData) {
      setMessages(spaceData.messages);
      setSpaceName(spaceData.name);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if ((!inputText.trim() && !selectedImage)) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.nickname,
      senderAvatar: user.avatar,
      content: inputText,
      imageUrl: selectedImage || undefined,
      timestamp: Date.now(),
      type: selectedImage ? 'image_text' : 'text'
    };

    const updatedMessages = StorageService.addMessage(spaceId, newMessage);
    setMessages(updatedMessages);
    setInputText('');
    setSelectedImage(null);
    setShowPicker(false);
  };

  const handleSendSticker = (stickerUrl: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.nickname,
      senderAvatar: user.avatar,
      content: 'Sticker',
      imageUrl: stickerUrl,
      timestamp: Date.now(),
      type: 'sticker'
    };
    const updatedMessages = StorageService.addMessage(spaceId, newMessage);
    setMessages(updatedMessages);
    setShowPicker(false);
  };

  const handleAddEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
    // 表情面板保持打开，方便连续输入
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAI = async (action: 'vibe' | 'topic') => {
    setIsAiLoading(true);
    setAiResponse(null);
    try {
      if (action === 'vibe') {
        const result = await GeminiService.analyzeVibe(messages);
        setAiResponse(result);
      } else {
        const result = await GeminiService.suggestTopic();
        setInputText(result);
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const copySpaceId = () => {
    navigator.clipboard.writeText(spaceId);
    alert('空间 ID 已复制到剪贴板！快去分享给你的另一半吧。');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 w-full max-w-4xl mx-auto shadow-2xl overflow-hidden relative">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-md flex-shrink-0">
            {spaceName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-gray-800 leading-tight text-sm sm:text-base truncate">{spaceName}</h2>
            <div 
              onClick={copySpaceId}
              className="text-[10px] sm:text-xs text-gray-400 cursor-pointer hover:text-primary flex items-center gap-1 truncate"
            >
              <span className="hidden sm:inline">空间号: </span>
              <span className="truncate">{spaceId}</span> <i className="fas fa-copy flex-shrink-0"></i>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
           <Button variant="ghost" onClick={onLogout} title="退出" className="p-2 sm:px-4 sm:py-2">
            <i className="fas fa-sign-out-alt text-sm sm:text-base"></i>
          </Button>
        </div>
      </div>

      {/* AI Assistant Toolbar */}
      <div className="bg-purple-50 px-2 sm:px-4 py-2 flex items-center justify-between border-b border-purple-100 flex-wrap gap-2">
        <span className="text-[10px] sm:text-xs font-semibold text-purple-600 uppercase tracking-wider flex items-center gap-1 sm:gap-2">
          <i className="fas fa-sparkles text-xs sm:text-sm"></i> <span className="hidden sm:inline">AI 情感助手</span><span className="sm:hidden">AI</span>
        </span>
        <div className="flex gap-1 sm:gap-2">
           <button 
             onClick={() => triggerAI('topic')}
             disabled={isAiLoading}
             className="text-[10px] sm:text-xs bg-white text-purple-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-purple-200 hover:bg-purple-100 transition shadow-sm whitespace-nowrap"
           >
             话题建议
           </button>
           <button 
             onClick={() => triggerAI('vibe')}
             disabled={isAiLoading}
             className="text-[10px] sm:text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:opacity-90 transition shadow-sm whitespace-nowrap"
           >
             氛围分析
           </button>
        </div>
      </div>

      {/* AI Response Bubble */}
      {aiResponse && (
        <div className="p-2 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-pink-100 flex items-start gap-2 sm:gap-3 relative animate-fadeIn">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-purple-500 mt-1 flex-shrink-0">
             <i className="fas fa-robot text-xs sm:text-sm"></i>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-gray-700 italic break-words">{aiResponse}</p>
          </div>
          <button onClick={() => setAiResponse(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1">
            <i className="fas fa-times text-xs sm:text-sm"></i>
          </button>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 sm:space-y-6 scrollbar-hide bg-cover bg-center" style={{ backgroundImage: 'radial-gradient(#f3e8ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        {messages.map((msg) => {
          const isMe = msg.senderId === user.id;
          const isSystem = msg.type === 'system';
          const isSticker = msg.type === 'sticker';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <span className="bg-gray-200 text-gray-600 text-xs py-1 px-3 rounded-full opacity-75">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group items-end gap-2`}>
              
              {/* Avatar for others */}
              {!isMe && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white border border-gray-100 flex-shrink-0 shadow-sm mb-1">
                  {msg.senderAvatar ? (
                    <img src={msg.senderAvatar} alt={msg.senderName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] sm:text-xs font-bold bg-gray-200">
                      {msg.senderName[0]}
                    </div>
                  )}
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && !msg.senderAvatar && <span className="text-[10px] sm:text-xs text-gray-500 ml-1 mb-1">{msg.senderName}</span>}
                
                {isSticker ? (
                   <div className="transition-transform hover:scale-105 duration-200">
                      <img src={msg.imageUrl} alt="Sticker" className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-sm" />
                   </div>
                ) : (
                  <div 
                    className={`
                      p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-sm relative overflow-hidden
                      ${isMe 
                        ? 'bg-gradient-to-br from-primary to-pink-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}
                    `}
                  >
                    {msg.imageUrl && (
                      <div className="mb-2 rounded-lg overflow-hidden max-h-48 sm:max-h-64">
                         <img src={msg.imageUrl} alt="shared" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed break-words">{msg.content}</p>
                  </div>
                )}
                <span className="text-[9px] sm:text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Avatar for me */}
              {isMe && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-pink-50 border border-pink-100 flex-shrink-0 shadow-sm mb-1">
                  {(msg.senderAvatar || user.avatar) ? (
                    <img src={msg.senderAvatar || user.avatar} alt="Me" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary text-[10px] sm:text-xs font-bold bg-pink-100">
                      {user.nickname[0]}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-2 sm:p-3 border-t border-gray-100 relative">
        
        {/* 多功能表情面板 */}
        {showPicker && (
          <div className="absolute bottom-full left-0 mb-2 ml-0 sm:ml-2 bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 w-[calc(100vw-1rem)] sm:w-72 max-w-[calc(100vw-1rem)] sm:max-w-72 z-30 animate-fadeIn flex flex-col overflow-hidden">
            {/* 标签切换栏 */}
            <div className="flex border-b border-gray-100">
              <button 
                className={`flex-1 py-2 text-sm font-medium transition-colors ${pickerTab === 'emoji' ? 'text-primary bg-pink-50' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setPickerTab('emoji')}
              >
                Emoji
              </button>
              <button 
                className={`flex-1 py-2 text-sm font-medium transition-colors ${pickerTab === 'sticker' ? 'text-primary bg-pink-50' : 'text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setPickerTab('sticker')}
              >
                贴图
              </button>
            </div>

            {/* 面板内容 */}
            <div className="h-48 sm:h-64 overflow-y-auto p-2 sm:p-3 scrollbar-hide bg-white/50">
              {pickerTab === 'emoji' ? (
                <div className="grid grid-cols-6 sm:grid-cols-6 gap-1 sm:gap-2">
                  {EMOJIS.map((emoji, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleAddEmoji(emoji)}
                      className="text-xl sm:text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                  {STICKERS.map((url, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleSendSticker(url)}
                      className="hover:bg-gray-50 p-1 rounded-lg transition-colors hover:scale-105 duration-200"
                    >
                      <img src={url} alt="Sticker" className="w-full h-auto" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedImage && (
          <div className="mb-2 relative inline-block">
             <img src={selectedImage} alt="Preview" className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg border border-gray-200" />
             <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs shadow-md"
             >
               <i className="fas fa-times"></i>
             </button>
          </div>
        )}
        
        <div className="flex items-end gap-1 sm:gap-2 bg-gray-50 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-gray-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-pink-100 transition-all">
          <button 
            onClick={() => setShowPicker(!showPicker)}
            className={`p-1.5 sm:p-2 transition-colors rounded-full hover:bg-white flex-shrink-0 ${showPicker ? 'text-primary' : 'text-gray-400'}`}
            title="发送表情"
          >
            <i className="far fa-smile text-base sm:text-lg"></i>
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-white flex-shrink-0"
            title="发送图片"
          >
            <i className="fas fa-image text-base sm:text-lg"></i>
          </button>

          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
            accept="image/*"
          />
          
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onClick={() => setShowPicker(false)}
            placeholder="说点什么..."
            className="flex-1 bg-transparent border-none outline-none resize-none py-1.5 sm:py-2 max-h-24 sm:max-h-32 text-xs sm:text-sm"
            rows={1}
            style={{ minHeight: '36px' }}
          />
          <Button 
            onClick={handleSend} 
            disabled={!inputText.trim() && !selectedImage}
            className="rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 flex-shrink-0"
          >
            <i className="fas fa-paper-plane text-sm sm:text-base"></i>
          </Button>
        </div>
      </div>
    </div>
  );
};