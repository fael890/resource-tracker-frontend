import { Client, StompSubscription } from "@stomp/stompjs";
import { subscribe } from "diagnostics_channel";
import { disconnect } from "process";

const url = "ws://localhost:8080/connection";
const topic = "/topic/monitor";

let subscription: StompSubscription | null = null;
let stompClient: Client | null = null;

export const WebSocketService = {
    connect: (onMessage: (data: any) => void) => {
        if(stompClient && stompClient.active) {
            console.warn("WebSocket already connected.");
            return;
        }

        stompClient = new Client({
            brokerURL: url,
            onConnect: () => {
                console.log("Connected to WebSocket");
                subscription = stompClient?.subscribe(topic, (message) => {
                    const monitorJSON = JSON.parse(message.body);
                    onMessage(monitorJSON);
                }) as any;
                console.log(subscription?.id);
            },
            onWebSocketError: (error) => console.error("Web Socket Connect Error: " + error),
            onStompError: (frame) => console.error("STOMP Error:", frame.body),
        });
        stompClient.activate();
    },

    disconnect: () => {
        if(stompClient && stompClient.active) {
            subscription?.unsubscribe();
            stompClient.deactivate();
            stompClient = null;
            console.log("Disconnected from WebSocket");
        } else {
            console.warn("WebSocket is not connected.");
        }
    },
}

// export const WebSocketService = {
//     connect: (onMessage: (data: any) => void) => {
//         if (stompClient && stompClient.active) {
//             console.warn("WebSocket already connected.");
//             return;
//         }
        
//         stompClient = new Client({
//             brokerURL: url,
//             onConnect: () => {
//                 console.log("Connected to WebSocket");
//                 subscription = stompClient?.subscribe(topic, (message) => {
//                     const monitorJSON = JSON.parse(message.body);
//                     onMessage(monitorJSON);
//                 });
//             },
//             onWebSocketError: (error) => console.error("WebSocket Error:", error),
//             onStompError: (frame) => console.error("STOMP Error:", frame.body),
//         });
        
//         stompClient.activate();
//     },
    
//     disconnect: () => {
//         if (stompClient && stompClient.active) {
//             subscription?.unsubscribe();
//             stompClient.deactivate();
//             stompClient = null;
//             console.log("Disconnected from WebSocket");
//         } else {
//             console.warn("WebSocket is not connected.");
//         }
//     },
// };

// stompClient.onConnect = (frame) => {
//     console.log('You have been connected: ' + frame);
//     subscription = stompClient.subscribe(topic, getMonitor);
// }

// export const getMonitor = function (message) {
//     let monitorJSON = JSON.parse(message.body);
//     return monitorJSON;
// }

// export function connect() {
//     if (!stompClient.activate()) {
//         stompClient.activate();
//     } else {
//         console.log("You already connected");
//     }
// }

// export function disconnect() {
//     if(subscription){
//         subscription.unsubscribe();
//         stompClient.deactivate();
//     } else {
//         console.log("You aren't connected to disconnect");
//     }
// }

// stompClient.onWebSocketError = (error) => {
//     console.log("Web Socket Connect Error: " + error);
// }

// stompClient.onStompError = (frame) => {
//     console.log('Broker reported error: ' + frame.headers['message']);
//     console.log('Additional details: ' + frame.body);
// };