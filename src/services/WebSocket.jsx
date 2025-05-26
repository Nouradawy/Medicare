import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketComponent = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: "Bearer " + localStorage.getItem("authToken"),
            },
            onConnect: () => {
                stompClient.subscribe("/topic/updates", (message) => {
                    setMessages((prev) => [...prev, message.body]);
                });
            },
        });

        stompClient.activate();

        return () => stompClient.deactivate();
    }, []);

    return (
        <div>
            <h1>Live Updates</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default WebSocketComponent;