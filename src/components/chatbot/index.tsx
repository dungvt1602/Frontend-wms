"use client";

import { createPortal } from "react-dom";
import { useChat } from "./hooks/useChat";
import ChatWindow from "./ChatWindow";
import FABButton from "./FABButton";

export default function ChatBot() {
  const {
    mounted, open, toggleOpen, closeChat,
    messages, input, setInput,
    loading, unread,
    send, handleKey, reset,
    bottomRef, inputRef,
  } = useChat();

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[9998] flex flex-col items-end gap-3">
      {open && (
        <ChatWindow
          messages={messages}
          input={input}
          loading={loading}
          inputRef={inputRef}
          bottomRef={bottomRef}
          onInput={setInput}
          onSend={send}
          onKeyDown={handleKey}
          onReset={reset}
          onClose={closeChat}
        />
      )}

      <FABButton open={open} unread={unread} onClick={toggleOpen} />

      <style>{`
        @keyframes chatIn {
          from { opacity: 0; transform: scale(.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1)  translateY(0);     }
        }
      `}</style>
    </div>,
    document.body
  );
}
