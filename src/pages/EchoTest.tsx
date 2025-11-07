import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

const EchoTest = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // 1. STOMP 클라이언트 생성
    const client = new Client({
      brokerURL: 'wss://ws.zony.kro.kr/chat',  // WebSocket 엔드포인트
      reconnectDelay: 5000, // 연결 끊기면 자동 재연결
      debug: (str) => console.log(str),
      connectHeaders: {
        // 필요하면 user_token 추가
        // Authorization: `Bearer ${user_token}`
      },
    });

    // 2. 연결 성공 시 구독
    client.onConnect = () => {
      console.log('STOMP Connected');

      // Subscribe to echo topic
      client.subscribe('/sub/echo', (message) => {
        console.log('Echo received:', message.body);
        setMessages((prev) => [...prev, message.body]);
      });

      // Publish a test message
      client.publish({
        destination: '/app/echo',
        body: JSON.stringify({ testMessage: 'Hello Zonie!' }),
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
    };

    client.activate(); // 연결 시도

    // Clean up
    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <div>
      <h1>Echo Test</h1>
      {messages.map((msg, i) => (
        <div key={i}>{msg}</div>
      ))}
    </div>
  );
};

export default EchoTest;
