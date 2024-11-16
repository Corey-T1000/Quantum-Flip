import React, { useState, useEffect, useRef } from 'react';
import { getLevelInfo } from '../utils/gameLogic';
import { useAINarrator } from '../hooks/useAINarrator';
import { StoryProgress } from '../types';
import { RotateCcw, Zap, ChevronRight, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  type: 'story' | 'system' | 'mystery' | 'gameplay';
  timestamp: string;
  status: string;
}

interface TerminalDisplayProps {
  level: number;
  moveCount: number;
  gameWon: boolean;
  colorPalette: any;
  onReset: () => void;
  onHint: () => void;
  onNextLevel: () => void;
  isHintCooldown: boolean;
  isProcessingHint: boolean;
  progress: any;
  celebrationType: 'impressive' | 'meh' | 'sarcastic' | null;
  isT9Mode: boolean;
  currentMessage: { text: string; type: string; choices?: string[] } | null;
  onChoice: (choice: any) => void;
  awaitingResponse: boolean;
  hasShownInitialMessage: boolean;
  onColorChange: (index: number) => void;
  colorPalettes: any[];
  selectedPalette: number;
}

const MESSAGE_DELAY = 1000;
const TYPING_SPEED = 18;
const ELLIPSIS_DELAY = 600;

export default function TerminalDisplay({
  level,
  moveCount,
  gameWon,
  colorPalette,
  onReset,
  onHint,
  onNextLevel,
  isHintCooldown,
  isProcessingHint,
  progress,
  celebrationType,
  isT9Mode,
  awaitingResponse,
  hasShownInitialMessage,
  onColorChange,
  colorPalettes,
  selectedPalette,
  currentMessage,
  onChoice
}: TerminalDisplayProps) {
  const { size } = getLevelInfo(level);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isDelaying, setIsDelaying] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const addMessage = (text: string, type: Message['type'] = 'system') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    const status = `SEQUENCE ${level + 1} :: MATRIX ${size}x${size} :: DISRUPTIONS ${moveCount}`;
    
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      type,
      timestamp,
      status
    };
    setMessages(prev => [...prev, newMessage]);
    requestAnimationFrame(() => {
      messagesContainerRef.current?.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    });
  };

  useEffect(() => {
    if (currentMessage) {
      addMessage(currentMessage.text, currentMessage.type as Message['type']);
    }
  }, [currentMessage]);

  useEffect(() => {
    if (gameWon) {
      const message = getVictoryMessage(celebrationType);
      if (message) addMessage(message, 'system');
    }
  }, [gameWon, celebrationType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getProgressBar = () => {
    if (gameWon) return '▓'.repeat(10);
    const filled = moveCount % 10;
    return '▓'.repeat(filled) + '░'.repeat(10 - filled);
  };

  const getActionButton = () => {
    if (isT9Mode) {
      return (
        <button
          className="terminal-button flex items-center space-x-1 px-2 py-1"
          onClick={() => {/* Handle send message */}}
          title="Send Message"
        >
          <Send size={14} className="terminal-text" />
          <span className="terminal-text text-sm hidden sm:inline">TRANSMIT</span>
        </button>
      );
    }

    if (gameWon) {
      return (
        <button
          className="terminal-button flex items-center space-x-1 px-2 py-1 transition-opacity duration-300"
          onClick={onNextLevel}
          title="Next Matrix"
        >
          <ChevronRight size={14} className="terminal-text" />
          <span className="terminal-text text-sm hidden sm:inline">ADVANCE</span>
        </button>
      );
    }

    return (
      <button
        className={`terminal-button flex items-center space-x-1 px-2 py-1 transition-opacity duration-300 ${(isHintCooldown || isProcessingHint) ? 'opacity-50' : ''}`}
        onClick={onHint}
        disabled={isHintCooldown || isProcessingHint}
        title={isHintCooldown ? "Oracle Recharging..." : isProcessingHint ? "Computing Solution..." : "Consult Oracle"}
      >
        <Zap size={14} className={`terminal-text ${isHintCooldown || isProcessingHint ? 'animate-pulse' : ''}`} />
        <span className="terminal-text text-sm hidden sm:inline">ORACLE</span>
      </button>
    );
  };

  const getMessageStyle = (type: Message['type']) => {
    switch (type) {
      case 'mystery':
        return 'text-[#FFD700]';
      case 'system':
        return 'text-[#00FF00]';
      default:
        return '';
    }
  };

  const getMessagePrefix = (type: Message['type']) => {
    switch (type) {
      case 'mystery':
        return '[QUANTUM-ANOMALY]';
      case 'system':
        return '[SYS-PROTOCOL]';
      default:
        return '';
    }
  };

  const getVictoryMessage = (type: 'impressive' | 'meh' | 'sarcastic' | null) => {
    if (!type) return null;
    switch (type) {
      case 'impressive':
        return 'EXCEPTIONAL PERFORMANCE DETECTED. QUANTUM EFFICIENCY: OPTIMAL';
      case 'meh':
        return 'ACCEPTABLE PERFORMANCE PARAMETERS. CONTINUE OPTIMIZATION';
      case 'sarcastic':
        return 'QUANTUM ALIGNMENT ACHIEVED... EVENTUALLY';
      default:
        return null;
    }
  };

  return (
    <div className="vintage-terminal p-4 rounded-lg mb-4 relative terminal-flicker flex flex-col" style={{ height: '300px' }}>
      <div className="terminal-scanline"></div>
      
      <div className="terminal-header flex justify-between items-center flex-none pt-1">
        <span className="terminal-text text-sm opacity-80">QUANTUM-MATRIX-v2.3.7</span>
        <div className="flex items-center gap-3">
          <div className="relative" ref={colorPickerRef}>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-2 terminal-text text-sm opacity-80 hover:opacity-100 transition-opacity"
            >
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ 
                  backgroundColor: colorPalette.light,
                  boxShadow: `0 0 10px ${colorPalette.light}66, 0 0 20px ${colorPalette.light}33, inset 0 0 5px ${colorPalette.light}99`,
                  border: `1px solid ${colorPalette.lightHC}`
                }}
              />
              ACTIVE
            </button>
            {showColorPicker && (
              <div className="absolute right-0 top-6 bg-[#1A1410] border border-[var(--amber-primary)] rounded-lg p-2 z-50 shadow-lg">
                <div className="flex gap-2 p-2">
                  {colorPalettes.map((palette, index) => (
                    <button
                      key={index}
                      className={`w-6 h-6 rounded-full transition-all duration-300 ${
                        selectedPalette === index ? 'scale-110' : ''
                      }`}
                      style={{
                        background: palette.light,
                        boxShadow: `0 0 10px ${palette.light}66, 0 0 20px ${palette.light}33, inset 0 0 5px ${palette.light}99`,
                        border: selectedPalette === index ? `2px solid ${palette.lightHC}` : `1px solid ${palette.light}66`
                      }}
                      onClick={() => {
                        onColorChange(index);
                        setShowColorPicker(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-900 scrollbar-track-transparent pr-2"
          style={{ minHeight: '160px', color: colorPalette.text }}
        >
          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className="terminal-text text-xs opacity-70">
                [{message.timestamp}] {message.status}
              </div>
              <div className={`terminal-text text-lg opacity-95 min-h-[28px] ${getMessageStyle(message.type)}`}>
                &gt; {getMessagePrefix(message.type)} {message.text}
              </div>
            </div>
          ))}
          {currentMessage && currentMessage.choices && currentMessage.choices.length > 0 && (
            <div className="mt-2 space-y-2">
              {currentMessage.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => onChoice({ type: 'CHOICE', value: choice })}
                  className="block w-full text-left px-2 py-1 hover:bg-[var(--amber-dim)] hover:text-[var(--amber-bright)] transition-colors"
                  disabled={awaitingResponse}
                >
                  {`> ${choice}`}
                </button>
              ))}
            </div>
          )}
          <div ref={messageEndRef} className="h-2" />
        </div>

        <div className="flex-none mt-4 pt-4 pb-6 border-t border-amber-900/30">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center min-w-0">
              <span className="terminal-text opacity-90 whitespace-nowrap text-sm">
                [{getProgressBar()}]
              </span>
              <span className="terminal-text ml-2 opacity-90 hidden sm:inline">
                {gameWon ? 'ALIGNED' : isT9Mode ? 'AWAITING INPUT' : isDelaying ? 'INITIALIZING' : 'PROCESSING'}
              </span>
            </div>
            <div className="flex gap-2 sm:gap-4">
              <button
                className="terminal-button flex items-center space-x-1 px-2 py-1"
                onClick={onReset}
                title="Reset Matrix"
              >
                <RotateCcw size={14} className="terminal-text" />
                <span className="terminal-text text-sm hidden sm:inline">RESET</span>
              </button>
              <div className="flex justify-center">
                {getActionButton()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}