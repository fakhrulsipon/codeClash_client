// miskaran's contributions start    

import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import Swal from "sweetalert2";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface ChatHistory {
  _id: string;
  name?: string;
  query: string;
  response: string;
  createdAt: string;
}

const AIAgent = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  // rename modal states
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameId, setRenameId] = useState<string | null>(null);

  // ✅ Fetch chat history
  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/ai-agent/history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ✅ Handle new query
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newUserMessage: Message = { sender: "user", text: query };
    setMessages((prev) => [...prev, newUserMessage]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/ai-agent/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      const aiMessage: Message = {
        sender: "ai",
        text: data.answer || "No response found",
      };

      setMessages((prev) => [...prev, aiMessage]);
      await fetchHistory();
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: " Error fetching data." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Select chat
  const handleSelectChat = (chat: ChatHistory) => {
    setSelectedChat(chat._id);
    setMessages([
      { sender: "user", text: chat.query },
      { sender: "ai", text: chat.response },
    ]);
  };

  // ✅ Rename chat with SweetAlert2
  const handleRename = async () => {
    if (!renameId || !renameValue.trim()) return;
    try {
      await fetch(`http://localhost:3000/api/ai-agent/chats/${renameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameValue }),
      });
      await fetchHistory();
      setShowRenameModal(false);
      setRenameValue("");
      setRenameId(null);
      Swal.fire("Success!", "Chat renamed successfully.", "success");
    } catch (err) {
      console.error("Rename failed:", err);
      Swal.fire("Error!", "Failed to rename chat.", "error");
    }
  };

  // ✅ Delete chat with SweetAlert2
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await fetch(`http://localhost:3000/api/ai-agent/chats/${id}`, {
          method: "DELETE",
        });
        await fetchHistory();
        if (selectedChat === id) {
          setSelectedChat(null);
          setMessages([]);
        }
        Swal.fire("Deleted!", "Chat has been deleted.", "success");
      } catch (err) {
        console.error("Delete failed:", err);
        Swal.fire("Error!", "Failed to delete chat.", "error");
      }
    }
  };

  return (
    <div className="flex h-[90vh]">
      {/* Sidebar */}
      <div className="w-72 bg-gray-100 border-r p-4 flex flex-col">
        <h2 className="font-semibold text-lg mb-3 text-center">💬 Chat History</h2>

        {/* New Chat Button */}
        <button
          onClick={() => {
            setSelectedChat(null);
            setMessages([]);
          }}
          className="mb-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          + New Chat
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {history.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">No chats yet</p>
          ) : (
            history.map((chat) => (
              <div
                key={chat._id}
                className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-blue-100 ${
                  selectedChat === chat._id ? "bg-blue-200" : ""
                }`}
              >
                <button
                  onClick={() => handleSelectChat(chat)}
                  className="flex-1 text-left text-sm truncate"
                >
                  {chat.name || chat.query}
                </button>

                {/* 3-dot menu */}
                <div className="relative group">
                  <MoreVertical className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                  <div className="absolute right-0 top-5 hidden group-hover:block bg-white border rounded shadow-md z-10">
                    <button
                      onClick={() => {
                        setShowRenameModal(true);
                        setRenameValue(chat.name || chat.query);
                        setRenameId(chat._id);
                      }}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => handleDelete(chat._id)}
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex flex-col flex-1 border border-gray-300 rounded-lg shadow-sm bg-white">
        <div className="p-4 border-b bg-gray-100 text-center text-lg font-semibold">
          AI Programming Assistant 🤖
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-center text-gray-500 animate-pulse">
              Thinking...
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSearch}
          className="p-4 border-t bg-white flex gap-2 items-center"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about programming..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>

      {/*  Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-3">Rename Chat</h3>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgent;
// miskaran's contribution's end
