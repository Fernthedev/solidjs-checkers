export function onWebSocketConnect(ws: WebSocket) {
    ws.addEventListener("message", listener)
}