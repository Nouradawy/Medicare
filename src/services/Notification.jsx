// Request permission and subscribe to push
import {useEffect} from "react";
import {Public_VAPIDKey} from "../Constants/constant.jsx";
import APICalls from "./APICalls.js";

//
// export function Notification() {
//     useEffect(() => {
//         subscribeUser();
//     }, []);
//
// }

export async function subscribeUser() {
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
    await APICalls.GetCurrentUser();
}

export async function unsubscribeUser() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;

        // Get existing subscription instead of creating a new one
        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            return; // nothing to unsubscribe
        }

        // Unsubscribe from push on the client
        const isUnsubscribed = await subscription.unsubscribe();
        if (!isUnsubscribed) {
            return;
        }

        // Send subscription to backend
        await fetch("http://localhost:8080/api/unsubscribe", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('authToken') || ''}`,
                "Content-Type": "application/json"
            },

            body: JSON.stringify(subscription),
        });
    }
    await APICalls.GetCurrentUser();
}
