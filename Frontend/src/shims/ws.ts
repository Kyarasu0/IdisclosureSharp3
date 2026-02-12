/**
 * WebSocket shim for browser environment
 * Provides a ws-like API using the native WebSocket
 */

class WebSocketShim {
  private ws: WebSocket;

  constructor(url: string, protocols?: string | string[]) {
    this.ws = new WebSocket(url, protocols);
  }

  get readyState(): number {
    return this.ws.readyState;
  }

  get CONNECTING(): number {
    return WebSocket.CONNECTING;
  }

  get OPEN(): number {
    return WebSocket.OPEN;
  }

  get CLOSING(): number {
    return WebSocket.CLOSING;
  }

  get CLOSED(): number {
    return WebSocket.CLOSED;
  }

  get onopen(): ((this: WebSocket, ev: Event) => any) | null {
    return this.ws.onopen;
  }

  set onopen(handler: ((this: WebSocket, ev: Event) => any) | null) {
    this.ws.onopen = handler;
  }

  get onclose(): ((this: WebSocket, ev: CloseEvent) => any) | null {
    return this.ws.onclose;
  }

  set onclose(handler: ((this: WebSocket, ev: CloseEvent) => any) | null) {
    this.ws.onclose = handler;
  }

  get onerror(): ((this: WebSocket, ev: Event) => any) | null {
    return this.ws.onerror;
  }

  set onerror(handler: ((this: WebSocket, ev: Event) => any) | null) {
    this.ws.onerror = handler;
  }

  get onmessage(): ((this: WebSocket, ev: MessageEvent) => any) | null {
    return this.ws.onmessage;
  }

  set onmessage(handler: ((this: WebSocket, ev: MessageEvent) => any) | null) {
    this.ws.onmessage = handler;
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    this.ws.send(data);
  }

  close(code?: number, reason?: string): void {
    this.ws.close(code, reason);
  }

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    this.ws.addEventListener(type, listener, options);
  }

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void {
    this.ws.removeEventListener(type, listener, options);
  }

  dispatchEvent(event: Event): boolean {
    return this.ws.dispatchEvent(event);
  }
}

// Export as both default and named export for compatibility
export default WebSocketShim;
export { WebSocketShim };
