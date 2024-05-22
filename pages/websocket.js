import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const IndexPage = () => {
    useEffect(() => {
        // SockJS를 통해 STOMP 클라이언트를 생성합니다.
        const socket = new SockJS('http://localhost:80/ws/v1/offline-store-pad');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                console.log('Connected to WebSocket');
                stompClient.subscribe('/ws/v1/topic/call-store/carrangcarrang', (message) => {
                    console.log('Received message:', message.body);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, []);

    return (
        <div>
            <h1>WebSocket STOMP Client</h1>
            <p>Check the console for WebSocket messages.</p>
        </div>
    );
};

export default IndexPage;
