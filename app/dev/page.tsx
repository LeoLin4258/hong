'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

export default function Home() {

  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const prevChatMessagesRef = useRef<any[]>([]);

  const getCurrentIframeUrl = () => {
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    const iframeSrc = iframe.contentWindow?.location.href;
    console.log(iframeSrc);
  }

  const getIframeChat = () => {
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    const newChatMessages: any[] = [];

    const mainContent = iframe.contentDocument?.getElementsByTagName("main")
    if (mainContent && mainContent.length > 0) {
      for (let i = 2; i < mainContent[0].childNodes.length - 2; i++) {
        const node = mainContent[0].childNodes[i];
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          const isAgent = element.classList.contains('bg-gray-100');
          const chatMessage = {
            role: isAgent ? 'Agent' : 'User',
            content: element.textContent || ''
          };
          newChatMessages.push(chatMessage);
        }
      }
    }

    setChatMessages(newChatMessages);
    console.log("get chat msgs:", newChatMessages);
  }

  const handlePostMsg = useCallback(
    debounce(async (messages: any[]) => {
      // try {
      //   const response = await fetch('/api/chat', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ chatMessages: messages }),
      //   });
      //   if (!response.ok) {
      //     throw new Error('Failed to post chat messages');
      //   }
      //   console.log('Chat messages posted successfully');
      // } catch (error) {
      //   console.error('Error posting chat messages:', error);
      // }
      console.log(9999999999999, messages);
    }, 5000),
    []
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      getIframeChat();
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (chatMessages.length > 0 && !isEqual(chatMessages, prevChatMessagesRef.current)) {
      handlePostMsg(chatMessages);
      prevChatMessagesRef.current = chatMessages;
    }
  }, [chatMessages, handlePostMsg]);

  return (
    <div id='xxx' className="w-full h-screen flex items-center justify-start gap-2 bg-zinc-700">
      <iframe id="myIframe" className="w-full h-full rounded-xl overflow-hidden" src={"/"} />

      <div className="w-80 h-full flex flex-col gap-2 p-4 bg-zinc-900 rounded-xl overflow-hidden">
        <button onClick={getCurrentIframeUrl} className='border border-zinc-600 rounded-md p-2'>Get Iframe URL</button>
        <button onClick={getIframeChat} className='border border-zinc-600 rounded-md p-2'>Get Iframe DOM</button>
        <div className="flex flex-col gap-2">
          {chatMessages.map((message, index) => (
            <div key={index} className="flex flex-col gap-2">
              <span className="text-zinc-400">{message.role}</span>
              <span className="text-zinc-100">{message.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}