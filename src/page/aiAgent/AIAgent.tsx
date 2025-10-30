import { useEffect, useState, useRef, use } from "react";
import {
  MoreVertical,
  Bot,
  User,
  Trash2,
  Edit3,
  Plus,
  Send,
  Code,
  Cpu,
  Menu,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../provider/AuthProvider";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatSession {
  _id: string;
  name: string;
  messageCount: number;
  updatedAt: string;
}

class AIAgentService {
  private baseURL = "http://localhost:3000/api/ai-agent";

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }
    return response.json();
  }

  async getHistory(userEmail: string) {
    const res = await fetch(
      `${this.baseURL}/history?userEmail=${encodeURIComponent(userEmail)}`
    );
    return this.handleResponse(res);
  }

  async sendQuery(query: string, userEmail: string, chatId?: string) {
    const res = await fetch(this.baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, userEmail, chatId }),
    });
    return this.handleResponse(res);
  }

  async getChat(chatId: string, userEmail: string) {
    const res = await fetch(
      `${this.baseURL}/chats/${chatId}?userEmail=${encodeURIComponent(
        userEmail
      )}`
    );
    return this.handleResponse(res);
  }

  async renameChat(chatId: string, name: string, userEmail: string) {
    const res = await fetch(`${this.baseURL}/chats/${chatId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, userEmail }),
    });
    return this.handleResponse(res);
  }

  async deleteChat(chatId: string, userEmail: string) {
    const res = await fetch(
      `${this.baseURL}/chats/${chatId}?userEmail=${encodeURIComponent(
        userEmail
      )}`,
      {
        method: "DELETE",
      }
    );
    return this.handleResponse(res);
  }
}

const aiAgentService = new AIAgentService();
const MAX_MESSAGES_PER_CHAT = 50;

const AIAgent = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameId, setRenameId] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    chatId: string;
  } | null>(null);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);

  const { user } = use(AuthContext)!;
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const dropdownContentRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Calculate dropdown position
  useEffect(() => {
    if (activeDropdown && dropdownRefs.current[activeDropdown]) {
      const rect =
        dropdownRefs.current[activeDropdown]!.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.right - 120,
        chatId: activeDropdown,
      });
    } else {
      setDropdownPosition(null);
    }
  }, [activeDropdown]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recent";

      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "Today";
      if (diffDays === 2) return "Yesterday";
      if (diffDays <= 7) return `${diffDays - 1} days ago`;

      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return "Recent";
    }
  };

  // Fixed formatTime function with proper error handling
  const formatTime = (timestamp: Date | string) => {
    try {
      // Handle both Date objects and string timestamps
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "Just now";
      }

      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Just now";
    }
  };

  const simulateStreaming = async (
    text: string,
    onChunk: (chunk: string) => void
  ) => {
    const paragraphs = text.split("\n\n");
    let currentText = "";
    for (let i = 0; i < paragraphs.length; i++) {
      const delay = Math.random() * 10 + 5;
      await new Promise((resolve) => setTimeout(resolve, delay));
      currentText += (i === 0 ? "" : "\n\n") + paragraphs[i];
      onChunk(currentText);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close dropdown when clicking outside or when mouse leaves both trigger and dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        const dropdownElement = dropdownRefs.current[activeDropdown];
        const dropdownContentElement = dropdownContentRef.current;

        if (
          dropdownElement &&
          !dropdownElement.contains(event.target as Node) &&
          dropdownContentElement &&
          !dropdownContentElement.contains(event.target as Node)
        ) {
          setActiveDropdown(null);
          setIsDropdownHovered(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  // Close dropdown when mouse leaves both trigger and dropdown
  useEffect(() => {
    const handleMouseLeave = () => {
      if (activeDropdown && !isDropdownHovered) {
        // Add a small delay to make it more user-friendly
        setTimeout(() => {
          if (activeDropdown && !isDropdownHovered) {
            setActiveDropdown(null);
          }
        }, 300);
      }
    };

    if (activeDropdown) {
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [activeDropdown, isDropdownHovered]);

  const fetchChatSessions = async () => {
    const email = user?.email || user?.providerData[0]?.email
    if (!email) return setChatSessions([]);
    try {
      const data = await aiAgentService.getHistory(email);
      setChatSessions(data);
    } catch (err) {
      console.error("Error loading sessions:", err);
    }
  };

  useEffect(() => {
    const email = user?.email || user?.providerData[0]?.email
    if (!email) fetchChatSessions();
    else {
      setChatSessions([]);
      setMessages([]);
      setCurrentChatId(null);
    }
  }, [user]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = user?.email || user?.providerData[0]?.email
    if (!email) return showAuthError("Please log in first");
    if (!query.trim()) return;
    if (currentChatId && messages.length >= MAX_MESSAGES_PER_CHAT) {
      setShowLimitWarning(true);
      setTimeout(() => setShowLimitWarning(false), 3000);
      return;
    }

    const newMsg: Message = {
      sender: "user",
      text: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setQuery("");
    setLoading(true);

    // Add initial streaming message
    const streamingMessage: Message = {
      sender: "ai",
      text: "",
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, streamingMessage]);

    try {
      const data = await aiAgentService.sendQuery(
        query,
        email,
        currentChatId
      );
      const answer = data.answer || "No response found";

      // Simulate fast streaming effect
      await simulateStreaming(answer, (chunk) => {
        setMessages((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1
              ? { ...msg, text: chunk, isStreaming: true }
              : msg
          )
        );
      });

      // Finalize the message
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1
            ? { ...msg, text: answer, isStreaming: false }
            : msg
        )
      );

      if (data.isNewChat && data.chatId) setCurrentChatId(data.chatId);
      await fetchChatSessions();
      if (isMobile) setIsSidebarOpen(false);
    } catch (error) {
      // Remove the streaming message on error
      setMessages((prev) => prev.slice(0, -1));
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      if (errorMessage.includes("limit reached")) {
        setShowLimitWarning(true);
        setTimeout(() => setShowLimitWarning(false), 3000);
      } else {
        showError("Error", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    const email = user?.email || user?.providerData[0]?.email
    if (!renameId || !renameValue.trim() || !email) return;
    try {
      await aiAgentService.renameChat(renameId, renameValue, email);
      await fetchChatSessions();
      setShowRenameModal(false);
      setRenameValue("");
      setRenameId(null);
      setActiveDropdown(null);
      setIsDropdownHovered(false);
      showSuccess("Chat renamed successfully");
    } catch (err) {
      showError(
        "Rename failed",
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.email) return showAuthError("Please log in first");
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This chat will be deleted permanently!",
      icon: "warning",
      background: "#1e293b",
      color: "white",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      
      try {
        await aiAgentService.deleteChat(id, user.email);
        await fetchChatSessions();
        if (currentChatId === id) {
          setCurrentChatId(null);
          setMessages([]);
        }
        setActiveDropdown(null);
        setIsDropdownHovered(false);
        showSuccess("Chat deleted successfully");
      } catch (err) {
        showError(
          "Delete failed",
          err instanceof Error ? err.message : "Unknown error"
        );
      }
    }
  };

  const handleSelectChat = async (chat: ChatSession) => {
    const email = user?.email || user?.providerData[0]?.email
    if (!email) return;
    try {
      const fullChat = await aiAgentService.getChat(chat._id, email);

      // Fix: Ensure all timestamps are properly converted to Date objects
      const fixedMessages = (fullChat.messages || []).map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));

      setCurrentChatId(chat._id);
      setMessages(fixedMessages);
      if (isMobile) setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error loading chat:", error);
      showError("Error", "Failed to load chat");
    }
  };

  const handleNewChat = () => {
    const email = user?.email || user?.providerData[0]?.email
    if (!email) return showAuthError("Please log in to start a chat");
    setCurrentChatId(null);
    setMessages([]);
    setQuery("");
    setShowLimitWarning(false);
    if (isMobile) setIsSidebarOpen(false);
  };

  const showAuthError = (text: string) =>
    Swal.fire({
      title: "Authentication Required",
      text,
      icon: "warning",
      background: "#1e293b",
      color: "white",
      confirmButtonColor: "#3b82f6",
    });

  const showError = (title: string, text: string) =>
    Swal.fire({
      title,
      text,
      icon: "error",
      background: "#1e293b",
      color: "white",
      confirmButtonColor: "#ef4444",
    });

  const showSuccess = (text: string) =>
    Swal.fire({
      title: "Success",
      text,
      icon: "success",
      background: "#1e293b",
      color: "white",
      confirmButtonColor: "#3b82f6",
    });

  const isLimitReached =
    currentChatId && messages.length >= MAX_MESSAGES_PER_CHAT;
const email = user?.email || user?.providerData[0]?.email
  if (!email)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center p-8 bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 max-w-md">
          <Bot className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-300 mb-6">
            Please log in to access the AI Assistant and view your personal chat
            history.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className={`bg-slate-800/95 backdrop-blur-xl border-r border-white/10 flex flex-col z-50 h-full ${
              isMobile
                ? "fixed inset-y-0 left-0 w-80 max-w-[85vw] shadow-2xl"
                : "w-80 relative"
            }`}
          >
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  Chat Sessions
                </h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-cyan-400 mt-1">
                Welcome, {user.displayName || user.email}
              </p>
            </div>

            {/* New Chat Button */}
            <div className="flex-shrink-0 p-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNewChat}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </motion.button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {chatSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Cpu className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No chats yet</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Start a conversation with AI
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {chatSessions.map((chat) => (
                    <motion.div
                      key={chat._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer backdrop-blur-sm border transition-all duration-300 group relative ${
                        currentChatId === chat._id
                          ? "bg-cyan-500/20 border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <button
                        onClick={() => handleSelectChat(chat)}
                        className="flex-1 text-left min-w-0"
                      >
                        <div className="text-sm text-white font-medium truncate">
                          {chat.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(chat.updatedAt)}
                        </div>
                      </button>

                      {/* Dropdown Trigger */}
                      <div
                        ref={(el) => (dropdownRefs.current[chat._id] = el)}
                        className="relative"
                        onMouseEnter={() => setActiveDropdown(chat._id)}
                        onMouseLeave={() => {
                          // Only close if not hovering over dropdown content
                          setTimeout(() => {
                            if (!isDropdownHovered) {
                              setActiveDropdown(null);
                            }
                          }, 100);
                        }}
                      >
                        <button className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-white/10 bg-gradient-to-r from-slate-800/50 to-purple-800/30 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 truncate">
                  <Bot className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                  AI Programming Assistant
                </h1>
                <p className="text-gray-400 text-xs md:text-sm truncate">
                  {currentChatId
                    ? "Continue your conversation"
                    : "Start a new conversation"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-cyan-400">
                Welcome, {user.displayName || user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-gradient-to-b from-slate-900/50 to-purple-900/30">
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <Cpu className="w-12 h-12 md:w-16 md:h-16 text-cyan-400 mb-4" />
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                  {currentChatId ? "Continue Chat" : "Welcome to AI Assistant!"}
                </h3>
                <p className="text-gray-400 text-sm md:text-base max-w-md">
                  {currentChatId
                    ? "Continue your conversation or start a new one"
                    : "Ask me anything about programming, algorithms, data structures, or get help with your code."}
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md w-full">
                  {[
                    "Explain binary search",
                    "React performance tips",
                    "Python list examples",
                    "What is time complexity?",
                  ].map((suggestion, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setQuery(suggestion)}
                      className="p-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 text-xs md:text-sm text-left"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-2 md:gap-3 max-w-[90%] md:max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.sender === "ai"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                            : "bg-gradient-to-r from-yellow-400 to-orange-500"
                        }`}
                      >
                        {msg.sender === "ai" ? (
                          <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        ) : (
                          <User className="w-3 h-3 md:w-4 md/h-4 text-white" />
                        )}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <div
                          className={`px-3 py-2 md:px-4 md:py-3 rounded-2xl text-sm md:text-base backdrop-blur-sm break-words ${
                            msg.sender === "user"
                              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none"
                              : "bg-slate-800/80 border border-white/10 text-gray-100 rounded-bl-none"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">
                            {msg.text}
                            {msg.isStreaming && (
                              <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse" />
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 px-1">
                          {/* Fixed: using the improved formatTime function */}
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            )}

            {/* REMOVED: Separate loading indicator since we're using streaming message */}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 border-t border-white/10 bg-slate-800/30 backdrop-blur-xl">
          {/* Limit reached message */}
          {showLimitWarning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-3 text-center"
            >
              <p className="text-xs text-red-400 bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20">
                ⚠️ Chat limit reached ({MAX_MESSAGES_PER_CHAT} messages) - start
                a new chat to continue
              </p>
            </motion.div>
          )}

          {isLimitReached && !showLimitWarning && (
            <div className="mb-3 text-center">
              <p className="text-xs text-red-400 bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20">
                ⚠️ Chat limit reached - start a new chat to continue
              </p>
            </div>
          )}

          <form
            onSubmit={handleSearch}
            className="flex gap-2 md:gap-3 items-center"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isLimitReached
                    ? "Chat limit reached - start a new chat"
                    : currentChatId
                      ? "Continue your conversation..."
                      : "Ask about programming..."
                }
                disabled={isLimitReached || loading}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading || !query.trim() || isLimitReached}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          </form>
        </div>
      </div>

      {/* Global Dropdown Portal */}
      <AnimatePresence>
        {dropdownPosition && (
          <motion.div
            ref={dropdownContentRef}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="fixed min-w-32 bg-slate-700/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl z-[9999] overflow-hidden"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            }}
            onMouseEnter={() => setIsDropdownHovered(true)}
            onMouseLeave={() => {
              setIsDropdownHovered(false);
              setActiveDropdown(null);
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowRenameModal(true);
                const chat = chatSessions.find(
                  (c) => c._id === dropdownPosition.chatId
                );
                if (chat) {
                  setRenameValue(chat.name);
                  setRenameId(chat._id);
                }
                setActiveDropdown(null);
                setIsDropdownHovered(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 w-full text-left transition-all duration-200"
            >
              <Edit3 className="w-3 h-3" />
              Rename
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(dropdownPosition.chatId);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full text-left transition-all duration-200 border-t border-white/10"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rename Modal */}
      <AnimatePresence>
        {showRenameModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-lg font-semibold text-white mb-3">
                Rename Chat
              </h3>
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm md:text-base"
                placeholder="Enter new chat name..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") setShowRenameModal(false);
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowRenameModal(false)}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRename}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-sm md:text-base"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAgent;
