import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./MessagesPage.module.css";

const MessagesPage = () => {
    const { user, token } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.get("https://healthcare-backend-a66n.onrender.com/api/messages/conversations", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setConversations(response.data);
            } catch (err) {
                setError("Failed to fetch conversations");
            }
        };

        fetchConversations();
    }, [token]);

    const fetchMessages = async (conversationId) => {
        setSelectedConversation(conversationId);
        try {
            const response = await axios.get(`https://healthcare-backend-a66n.onrender.com/api/messages/${conversationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data);
        } catch (err) {
            setError("Failed to fetch messages");
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post("https://healthcare-backend-a66n.onrender.com/api/messages/send", {
                conversationId: selectedConversation,
                senderId: user._id,
                text: newMessage,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessages([...messages, response.data]);
            setNewMessage("");
        } catch (err) {
            setError("Failed to send message");
        }
    };

    return (
        <div className={styles.messagesPage}>
            <Sidebar />
            <div className={styles.content}>
                <h2>Messages</h2>
                <div className={styles.chatContainer}>
                    <div className={styles.conversationList}>
                        <h3>Conversations</h3>
                        {conversations.map(conv => (
                            <div key={conv._id} className={styles.conversation} onClick={() => fetchMessages(conv._id)}>
                                {conv.participants.filter(p => p._id !== user._id).map(p => p.name).join(", ")}
                            </div>
                        ))}
                    </div>
                    <div className={styles.chatBox}>
                        {selectedConversation ? (
                            <>
                                <div className={styles.messagesList}>
                                    {messages.map((msg, index) => (
                                        <div key={index} className={msg.senderId === user._id ? styles.sent : styles.received}>
                                            {msg.text}
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleSendMessage} className={styles.messageForm}>
                                    <input 
                                        type="text" 
                                        placeholder="Type a message..." 
                                        value={newMessage} 
                                        onChange={(e) => setNewMessage(e.target.value)} 
                                    />
                                    <button type="submit">Send</button>
                                </form>
                            </>
                        ) : (
                            <p>Select a conversation to start messaging</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
