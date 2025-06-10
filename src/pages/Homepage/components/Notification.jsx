// Request permission and subscribe to push
import {useEffect} from "react";
import {Public_VAPIDKey} from "../../../Constants/constant.jsx";

export function Notification() {
    useEffect(() => {
        subscribeUser();
    }, []);

    return(<div>Hi</div>);
}

async function subscribeUser() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;

        const permission = await window.Notification.requestPermission();
        if (permission !== 'granted') return;

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: Public_VAPIDKey,
        });

        // Send subscription to backend
        await fetch("http://localhost:8080/api/subscribe", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('authToken') || ''}`,
                "Content-Type": "application/json"
            },

            body: JSON.stringify(subscription),
        });
    }
}
