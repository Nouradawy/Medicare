self.addEventListener("push", function (event) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/public/vite.svg",
        data: { url: data.url },
    });
});

/* global clients */
self.addEventListener("notificationclick", function(event) {
    event.notification.close();
    const url = event.notification.data && event.notification.data.url;
    if (url) {
        event.waitUntil(
            clients.matchAll({ type: "window" }).then(windowClients => {
                for (let client of windowClients) {
                    if (client.url === url && "focus" in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
        );
    }
});

