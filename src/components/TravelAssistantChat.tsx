import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  X,
  CornerDownLeft,
  ChevronDown,
} from 'lucide-react';
import { ChatMessage, TravelAnalysisResult } from '../types';
import { playPronunciation, stopPronunciation } from '../lib/speech';

interface TravelAssistantChatProps {
  currentScan: TravelAnalysisResult | null;
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
  locationName: string;
}

export const TravelAssistantChat: React.FC<TravelAssistantChatProps> = ({
  currentScan,
  isOpen,
  onClose,
  initialQuestion,
  locationName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: currentScan
        ? `Ayubowan / Vanakkam! I am your WayFarer AI travel guide. I see you are inspecting "${currentScan.identification}" near ${currentScan.location.name}. Feel free to ask me anything about ingredients, local customs, spice adjustments, or how to get around!`
        : `Ayubowan / Vanakkam! Welcome to WayFarer AI. Ask me anything about cultural landmarks, local food ingredients, native Sinhala and Tamil translations, or travel tips around ${locationName}!`,
      timestamp: Date.now(),
      suggestedQuestions: currentScan
        ? currentScan.category === 'Food'
          ? [
              'Is this dish too spicy for children?',
              'How do I order this in Sinhala / Tamil?',
              'What should I drink with this?',
            ]
          : [
              'What is the dress code to enter?',
              'What is the best time of day to avoid crowds?',
              'How much should a tuk-tuk ride cost from here?',
            ]
        : [
            'What are common vegetarian options here?',
            'How do I say "Thank you" and "Please" in Sinhala?',
            'What are top must-see heritage sites?',
          ],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Trigger initial question if provided
  useEffect(() => {
    if (initialQuestion && isOpen) {
      handleSendMessage(initialQuestion);
    }
  }, [initialQuestion, isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
          scanContext: currentScan,
          location: currentScan?.location || { name: locationName },
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const assistantMessage: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: Date.now(),
          suggestedQuestions: data.suggestedQuestions || [],
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'No response from assistant');
      }
    } catch (err: any) {
      console.warn('Chat request fallback:', err);
      const fallbackMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: `Regarding your query about ${currentScan?.identification || locationName}: Most local establishments are very accommodating to travelers. Don't hesitate to ask locals "Sara aduwen" (less spicy) or smile and say "Bohoma Sthuthi" (thank you very much)!`,
        timestamp: Date.now(),
        suggestedQuestions: [
          'How do I say "How much is this?" in Sinhala?',
          'What are safe transport options at night?',
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleSpeak = async (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      stopPronunciation();
      setSpeakingMsgId(null);
      return;
    }

    setSpeakingMsgId(msgId);
    await playPronunciation(text);
    setSpeakingMsgId(null);
  };

  if (!isOpen) return null;

  return (
    <div
      id="travel-assistant-drawer"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
    >
      {/* Drawer Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
            <Bot className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              WayFarer Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
              {currentScan ? `Context: ${currentScan.identification}` : `Location: ${locationName}`}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          title="Close Assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar bg-slate-900/50">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          const isSpeaking = speakingMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isAssistant
                    ? 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-tl-sm'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {isAssistant && (
                  <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-[10px] text-slate-500">Gemini Cultural Model</span>
                    <button
                      onClick={() => handleToggleSpeak(msg.id, msg.text)}
                      className={`flex items-center gap-1 hover:text-amber-400 transition-colors ${
                        isSpeaking ? 'text-amber-400 font-bold' : ''
                      }`}
                      title="Read aloud"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3 h-3" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          <span>Read</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Suggested Follow-up Questions */}
              {isAssistant && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                  {msg.suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-500/20 transition-all text-left shadow-xs hover:border-amber-500/40"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 max-w-[200px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Consulting guide...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="input-assistant-query"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask about ${currentScan ? currentScan.identification : 'local customs, dishes, signs'}...`}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80"
          />

          <button
            id="btn-send-assistant"
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
