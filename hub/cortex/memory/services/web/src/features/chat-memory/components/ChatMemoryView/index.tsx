import React, { useState } from 'react';
import { useMemoryStore } from '../../../../domains/memory/memory.store.js';
import { Send, Bot, User, Cpu } from 'lucide-react';
import styles from './styles.module.css';

export const ChatMemoryView: React.FC = () => {
  const [input, setInput] = useState('');
  const { chatMessages, isSendingChat, sendChatMessage } = useMemoryStore();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSendingChat) return;
    const msg = input;
    setInput('');
    void sendChatMessage(msg);
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.headerTitle}>Episodic Chat Memory Assistant</h3>
      <p className={styles.headerSubtitle}>
        Interactive memory chat integrated with MongoDB vector RAG retrieval
      </p>

      <div className={styles.chatBox}>
        <div className={styles.messagesList}>
          {chatMessages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const msgKey = msg.id ?? `${msg.timestamp ?? 'ts'}-${idx}`;
            return (
              <div key={msgKey} className={`${styles.msgRow} ${isUser ? styles.msgRowUser : ''}`}>
                <div className={isUser ? styles.avatarUser : styles.avatarBot}>
                  {isUser ? (
                    <User className={styles.iconAvatar} />
                  ) : (
                    <Bot className={styles.iconAvatar} />
                  )}
                </div>

                <div className={`${styles.msgBubble} ${isUser ? styles.msgBubbleUser : ''}`}>
                  {msg.content}
                </div>
              </div>
            );
          })}

          {isSendingChat && (
            <div className={styles.sendingBanner}>
              <Cpu className={styles.spinningCpuIcon} />
              <span>Querying MongoDB vector index & generating response...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className={styles.inputBar}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about project docs or architecture..."
            className={styles.chatInput}
          />
          <button
            type="submit"
            disabled={isSendingChat || !input.trim()}
            className={styles.sendBtn}
          >
            <Send className={styles.sendBtnIcon} />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatMemoryView;
