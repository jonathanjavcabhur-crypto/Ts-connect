import React, { useState, useEffect, useRef, useMemo } from "react";
import { MockUser, Message } from "../types";
import { THEMES } from "../constants/themes";
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  Search, 
  MessageSquare, 
  MapPin, 
  Zap, 
  Smile, 
  CheckCheck,
  Flame
} from "lucide-react";

interface ChatWindowProps {
  user: MockUser | null;
  users: MockUser[];
  onBack: () => void;
  themeId: string;
  onSelectUser: (userId: string) => void;
  unreadChats: Record<string, number>;
}

// Preset Quick Replies based on profile interests to make it extremely fun to play with!
const QUICK_REPLIES: Record<string, string[]> = {
  "user-julian": [
    "Hey Julian! What kind of design work do you do?",
    "I'd love to see you dance! Do you perform locally?",
    "Hey! Let's connect. What's your favorite local spot?"
  ],
  "user-1": [
    "Hey Maya! I love your painting! What do you like to paint?",
    "Hey! Let's get that coffee. Are you free this week?",
    "What kind of music are you into lately?"
  ],
  "user-2": [
    "Hi Kaelen! I'd love to go for a sunset hike. What's your favorite trail?",
    "Hey! What's the rarest plant in your greenhouse?",
    "Would love to check out some local record stores together."
  ],
  "user-3": [
    "Hey Leo! What kind of synthesizers do you use?",
    "Down for that midnight diner run! What's your go-to order?",
    "I'd love to hear some of your electronic ambient tracks."
  ],
  default: [
    "Hey! I really love your profile. What are you up to today?",
    "Hey! Tell me more about your interests.",
    "Let's grab a drink or coffee sometime soon!"
  ]
};

// Simulated dynamic replies matching their specific bio/personality
const getSimulatedReply = (user: MockUser, userText: string): string => {
  const text = userText.toLowerCase();

  if (user.id === "user-julian") {
    if (text.includes("design") || text.includes("work") || text.includes("layout")) {
      return "I specialize in clean, minimal interface design and digital brand systems. I love combining typography and fluid motion. Are you in a creative field too?";
    }
    if (text.includes("dance") || text.includes("perform") || text.includes("choreography")) {
      return "Yes! I perform with a contemporary dance collective here in the city. Expressive movement is my ultimate outlet. I would love to show you some clips sometime!";
    }
    if (text.includes("connect") || text.includes("spot") || text.includes("meet")) {
      return "Let's definitely grab some boba or check out a scenic overlook! I am always down for creative sparks. What's your neighborhood vibe like?";
    }
  }

  if (user.id === "user-1") {
    if (text.includes("paint") || text.includes("art")) {
      return "Aww thank you! I've been experimenting with abstract watercolors lately. I actually have a small canvas setup in my living room. Have you ever tried painting?";
    }
    if (text.includes("coffee") || text.includes("free") || text.includes("date")) {
      return "I would love that! I'm actually free on Thursday afternoon or Saturday morning. Do you have a favorite local cafe in the city, or should we pick a new spot?";
    }
    if (text.includes("music") || text.includes("show")) {
      return "Oh, I'm super into indie rock and synth-pop! I've been listening to a lot of Beach House and Alvvays. What about you? Any live shows on your radar?";
    }
  }

  if (user.id === "user-2") {
    if (text.includes("trail") || text.includes("hike") || text.includes("sunset")) {
      return "Oh, the redwood trail in Berkeley Hills is magical around sunset! It's super quiet and the light filters through the trees beautifully. Are you a frequent hiker?";
    }
    if (text.includes("plant") || text.includes("greenhouse")) {
      return "Ah, right now I have a rare Variegated Monstera deliciosa that is finally growing a new leaf! It is my absolute pride and joy. Do you have any plants at home?";
    }
    if (text.includes("vinyl") || text.includes("record")) {
      return "Yes! I can spend hours flipping through records. I love finding old folk or 80s synth records. We should definitely go together sometime!";
    }
  }

  if (user.id === "user-3") {
    if (text.includes("synthesizer") || text.includes("synth") || text.includes("producer")) {
      return "Man, I'm obsessed with my Moog Grandmother synth! It has such a warm, beefy sound. I'm currently patching a new ambient drone track. Do you play any instruments?";
    }
    if (text.includes("diner") || text.includes("order") || text.includes("spontaneous")) {
      return "Haha yes! My go-to is always sourdough French toast with extra syrup and black coffee. There is nothing like a diner booth at 1 AM. What's your late-night food craving?";
    }
    if (text.includes("ambient") || text.includes("music") || text.includes("track")) {
      return "I can send you a private link to my SoundCloud if you want! It's a lot of modular synth sequences mixed with field recordings of rain in Oakland.";
    }
  }

  // General fallbacks
  if (text.includes("coffee") || text.includes("drink") || text.includes("meet")) {
    return `That sounds wonderful! I'd love to grab a coffee and talk more. I'm based around ${user.locationName}. When are you usually free?`;
  }
  if (text.includes("doing") || text.includes("up to")) {
    return `Just relaxing and listening to some music right now. It's been a busy week! How is your day going?`;
  }

  // Default custom profile response
  return `Hey! Thanks for messaging. I really appreciate you reaching out! ${user.tagline} Tell me, what got your attention about my profile?`;
};

export default function ChatWindow({ 
  user, 
  users, 
  onBack, 
  themeId, 
  onSelectUser, 
  unreadChats 
}: ChatWindowProps) {
  const theme = THEMES[themeId];
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount or when active user changes
  useEffect(() => {
    if (!user) return;

    const storageKey = `ts_connect_chat_${user.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      // Seed with initial greeting
      const initial: Message[] = [
        {
          id: "msg-init",
          sender: "profile",
          text: `Hey! I'm ${user.name}. ${user.tagline}`,
          timestamp: "Today at " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(initial);
      localStorage.setItem(storageKey, JSON.stringify(initial));
    }
  }, [user]);

  // Scroll to bottom on new messages in conversation view
  useEffect(() => {
    if (user) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, user]);

  // Find recent message previews for the Inbox
  const recentChats = useMemo(() => {
    return users.map((u) => {
      const storageKey = `ts_connect_chat_${u.id}`;
      const saved = localStorage.getItem(storageKey);
      let lastMessageText = "";
      let lastMessageTime = "";
      let hasHistory = false;

      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Message[];
          if (parsed.length > 0) {
            const lastMsg = parsed[parsed.length - 1];
            lastMessageText = lastMsg.sender === "user" ? `You: ${lastMsg.text}` : lastMsg.text;
            lastMessageTime = lastMsg.timestamp;
            hasHistory = true;
          }
        } catch (e) {
          // ignore parsing errors
        }
      }

      return {
        user: u,
        lastMessageText,
        lastMessageTime,
        hasHistory
      };
    });
  }, [users, user, messages]); // Refresh when messages change

  // Filter lists based on search
  const filteredRecentChats = useMemo(() => {
    return recentChats
      .filter((c) => {
        const matchesQuery = c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          c.user.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesQuery;
      })
      .sort((a, b) => {
        // Active conversations at the top
        if (a.hasHistory && !b.hasHistory) return -1;
        if (!a.hasHistory && b.hasHistory) return 1;
        // Then sort by online status
        if (a.user.online && !b.user.online) return -1;
        if (!a.user.online && b.user.online) return 1;
        // Then by match percentage
        return b.user.matchPct - a.user.matchPct;
      });
  }, [recentChats, searchQuery]);

  const handleSendMessage = (textToSend: string) => {
    if (!user || !textToSend.trim()) return;

    const storageKey = `ts_connect_chat_${user.id}`;
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // 1. Add user message
    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: timestampStr
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setInputText("");

    // 2. Trigger typing simulator
    setIsTyping(true);

    setTimeout(() => {
      const replyText = getSimulatedReply(user, textToSend);
      const replyMsg: Message = {
        id: `msg-reply-${Date.now()}`,
        sender: "profile",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...updated, replyMsg];
      setMessages(finalMessages);
      localStorage.setItem(storageKey, JSON.stringify(finalMessages));
      setIsTyping(false);
    }, 1200 + Math.random() * 800); // realistic typing delay
  };

  const quickReplies = user ? (QUICK_REPLIES[user.id] || QUICK_REPLIES.default) : [];

  // ==================== INBOX VIEW ====================
  if (!user) {
    return (
      <div className="w-full flex flex-col min-h-full bg-transparent">
        {/* Inbox Header: Liquid Glass */}
        <div 
          className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b bg-black/40 backdrop-blur-xl border-white/10"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10" style={{ color: theme.primary }}>
              <MessageSquare size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black text-zinc-100 leading-tight">My Inbox</h2>
              <span className="text-[10px] text-zinc-400 font-bold block mt-0.5">
                {users.filter(u => u.online).length} online neighbors nearby
              </span>
            </div>
          </div>
          <button 
            onClick={onBack}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-white/5 bg-black/10">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-3 text-zinc-500 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search chat histories or interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white/5 border border-white/10 focus:outline-hidden focus:border-white/20 transition-all text-white placeholder-zinc-500 font-medium"
            />
          </div>
        </div>

        {/* Chats & Active Users List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none pb-24">
          
          {/* Quick Online Neighbors carousel */}
          {searchQuery === "" && (
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400 flex items-center">
                <Flame size={10} className="mr-1 text-red-400" />
                Active Now
              </span>
              <div className="flex space-x-3 overflow-x-auto py-1 scrollbar-none">
                {users.filter(u => u.online).map((u) => {
                  const count = unreadChats[u.id] || 0;
                  return (
                    <button
                      key={u.id}
                      onClick={() => onSelectUser(u.id)}
                      className="flex flex-col items-center space-y-1 group shrink-0 active:scale-95 transition-all cursor-pointer"
                    >
                      <div className="relative">
                        <img 
                          src={u.photo} 
                          alt={u.name} 
                          className="w-12 h-12 rounded-xl object-cover border-2 border-white/5 group-hover:scale-105 transition-transform"
                          style={{ borderColor: count > 0 ? theme.primary : "rgba(255,255,255,0.1)" }}
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-zinc-950 flex items-center justify-center bg-zinc-900/90" >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.onlineDotColor }} />
                        </span>
                        {count > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-red-500 text-[8px] font-black flex items-center justify-center text-white px-0.5 border border-zinc-950 shadow-md">
                            {count}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-zinc-300 truncate max-w-[60px]">{u.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* List Section */}
          <div className="space-y-2 pt-2">
            <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400 block">
              {searchQuery ? "Search Results" : "Conversations"}
            </span>

            <div className="space-y-2">
              {filteredRecentChats.length === 0 ? (
                <div className="p-8 text-center bg-white/3 border border-white/5 rounded-2xl">
                  <span className="text-zinc-500 text-xs font-bold block">No neighbors found</span>
                  <span className="text-zinc-600 text-[10px] mt-1 block">Try adjusting your search criteria.</span>
                </div>
              ) : (
                filteredRecentChats.map(({ user: u, lastMessageText, lastMessageTime, hasHistory }) => {
                  const count = unreadChats[u.id] || 0;
                  return (
                    <div 
                      key={u.id}
                      onClick={() => onSelectUser(u.id)}
                      className="p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer hover:bg-white/5 active:scale-[0.99]"
                      style={{ 
                        backgroundColor: count > 0 ? `${theme.primary}10` : "rgba(255, 255, 255, 0.02)",
                        borderColor: count > 0 ? `${theme.primary}30` : "rgba(255, 255, 255, 0.05)"
                      }}
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <img 
                            src={u.photo} 
                            alt={u.name} 
                            className="w-11 h-11 rounded-xl object-cover border border-white/10"
                            referrerPolicy="no-referrer"
                          />
                          {u.online && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-zinc-950 flex items-center justify-center bg-zinc-900/90" >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.onlineDotColor }} />
                            </span>
                          )}
                        </div>

                        {/* Text Previews */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-extrabold text-xs text-zinc-100 truncate">{u.name}</span>
                            <span className="text-[8px] font-black text-zinc-400 opacity-85 px-1 py-0.5 rounded bg-white/5 shrink-0">
                              {u.pronouns}
                            </span>
                          </div>

                          <p className="text-[10px] font-medium text-zinc-400 mt-1 truncate">
                            {hasHistory ? lastMessageText : u.tagline}
                          </p>

                          {/* Detail Pill */}
                          <div className="flex items-center space-x-2 mt-1.5">
                            <span className="text-[9px] font-black text-magenta-400/95" style={{ color: theme.primary }}>
                              {u.matchPct}% Match
                            </span>
                            <span className="text-[8px] font-bold text-zinc-500 flex items-center">
                              <MapPin size={8} className="mr-0.5 opacity-65" />
                              {u.distance < 1 ? `${Math.round(u.distance * 1000)}m` : `${u.distance.toFixed(1)}km`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right indicator area */}
                      <div className="flex flex-col items-end space-y-1.5 shrink-0 ml-2">
                        <span className="text-[8px] font-bold text-zinc-500">
                          {hasHistory ? lastMessageTime : ""}
                        </span>
                        {count > 0 ? (
                          <span className="w-5 h-5 rounded-full bg-red-500 text-[10px] font-black flex items-center justify-center text-white px-0.5 shadow-lg border border-red-400/20">
                            {count}
                          </span>
                        ) : (
                          hasHistory && <CheckCheck size={12} className="text-zinc-500 opacity-60" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==================== CONVERSATION VIEW ====================
  return (
    <div className="w-full flex flex-col min-h-full bg-transparent">
      {/* Chat Header: Liquid Glass */}
      <div 
        className="sticky top-0 z-10 flex items-center px-4 py-3 border-b transition-colors bg-black/40 backdrop-blur-xl border-white/10"
      >
        <button 
          onClick={onBack}
          className="p-2 mr-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition-all flex items-center justify-center cursor-pointer active:scale-90"
          style={{ color: theme.textPrimary }}
        >
          <ArrowLeft size={18} />
        </button>

        {/* Profile Info block */}
        <div className="flex items-center flex-1 min-w-0">
          <div className="relative">
            <img 
              src={user.photo} 
              alt={user.name} 
              className="w-10 h-10 rounded-xl object-cover border"
              style={{ 
                borderColor: theme.primary,
                boxShadow: `0 0 10px ${theme.primary}40`
              }}
              referrerPolicy="no-referrer"
            />
            {user.online && (
              <span 
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-zinc-950 flex items-center justify-center bg-zinc-900/90" 
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.onlineDotColor }} />
              </span>
            )}
          </div>
          <div className="ml-3 min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm text-zinc-100 block leading-none truncate">{user.name}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/10 font-black text-zinc-300" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                {user.pronouns}
              </span>
            </div>
            <span className="text-[10px] mt-1 block truncate font-bold text-zinc-400">
              {user.online ? "online now" : "away"} • {user.matchPct}% Match
            </span>
          </div>
        </div>
      </div>

      {/* Message List Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div 
              key={msg.id} 
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                <div 
                  className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-lg border"
                  style={{ 
                    backgroundColor: isUser ? theme.primary : "rgba(255, 255, 255, 0.05)",
                    color: "#ffffff",
                    borderColor: isUser ? "transparent" : "rgba(255, 255, 255, 0.08)",
                    borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                    boxShadow: isUser ? `0 4px 15px ${theme.primary}25` : `inset 0 0 10px rgba(255,255,255,0.01)`
                  }}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] mt-1 px-1.5 text-zinc-500 font-bold" style={{ color: theme.textMuted }}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing bubble indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <img 
                src={user.photo} 
                alt={user.name} 
                className="w-6 h-6 rounded-lg object-cover border border-white/5"
                referrerPolicy="no-referrer"
              />
              <div 
                className="px-4 py-3 rounded-2xl flex items-center space-x-1.5 border shadow-md bg-white/5 border-white/10"
                style={{ 
                  borderRadius: "18px 18px 18px 4px"
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: theme.primary, animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: theme.primary, animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: theme.primary, animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Quick replies panel: Frosted Card overlay */}
      {messages.length < 5 && !isTyping && (
        <div className="px-4 py-3.5 flex flex-col space-y-2 border-t border-white/5 bg-black/20 backdrop-blur-md">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center text-zinc-300">
            <Sparkles size={11} className="mr-1.5 animate-pulse" style={{ color: theme.primary }} />
            Suggested Icebreakers
          </span>
          <div className="flex flex-col space-y-1.5">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(reply)}
                className="text-left text-xs py-2 px-3.5 rounded-xl border transition-all duration-200 hover:bg-white/10 active:scale-99 cursor-pointer bg-white/5 border-white/10 text-zinc-100 font-medium"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Text bar: Liquid Glass */}
      <div 
        className="p-4 border-t flex items-center space-x-2 bg-black/40 backdrop-blur-xl border-white/10"
      >
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(inputText);
            }
          }}
          placeholder={`Message ${user.name}...`}
          className="flex-1 py-2.5 px-4 rounded-xl text-sm focus:outline-hidden focus:border-white/20 transition-all font-sans bg-white/5 border border-white/10 text-white placeholder-zinc-500"
        />
        <button
          onClick={() => handleSendMessage(inputText)}
          className="p-3 rounded-xl text-white transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center cursor-pointer shadow-md"
          style={{ 
            backgroundColor: theme.primary,
            boxShadow: `0 4px 15px ${theme.primary}40`
          }}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
