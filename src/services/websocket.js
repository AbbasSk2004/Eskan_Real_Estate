import config from '../config';
import authStorage from '../utils/authStorage';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000; // 3 seconds
    this.listeners = new Map();
    this.pendingMessages = [];
  }

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN)) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    try {
      const token = authStorage.getToken('access_token');
      const wsUrl = `${config.WS_URL}?token=${token || ''}`;
      
      console.log('Connecting to WebSocket server:', config.WS_URL);
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.attemptReconnect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
      console.log('WebSocket disconnected');
    }
  }

  handleOpen() {
    console.log('WebSocket connected');
    this.isConnected = true;
    this.reconnectAttempts = 0;
    
    // Send any pending messages
    if (this.pendingMessages.length > 0) {
      console.log(`Sending ${this.pendingMessages.length} pending messages`);
      this.pendingMessages.forEach(msg => this.send(msg.event, msg.data));
      this.pendingMessages = [];
    }
    
    // Notify connection listeners
    this.notifyListeners('connection', { connected: true });
  }

  handleMessage(event) {
    try {
      const message = JSON.parse(event.data);
      const { type, data } = message;
      
      if (type) {
        this.notifyListeners(type, data);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  handleClose(event) {
    this.isConnected = false;
    console.log(`WebSocket closed: ${event.code} - ${event.reason}`);
    this.notifyListeners('connection', { connected: false });
    
    // Attempt to reconnect unless it was a normal closure
    if (event.code !== 1000) {
      this.attemptReconnect();
    }
  }

  handleError(error) {
    console.error('WebSocket error:', error);
    this.notifyListeners('error', { error });
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval * this.reconnectAttempts);
  }

  send(event, data) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.log('WebSocket not connected, queueing message');
      this.pendingMessages.push({ event, data });
      this.connect(); // Try to connect
      return false;
    }

    try {
      const message = JSON.stringify({ type: event, data });
      this.socket.send(message);
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event).push(callback);
    return () => this.unsubscribe(event, callback);
  }

  unsubscribe(event, callback) {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
    
    if (callbacks.length === 0) {
      this.listeners.delete(event);
    }
  }

  notifyListeners(event, data) {
    if (!this.listeners.has(event)) return;
    
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in WebSocket ${event} listener:`, error);
      }
    });
  }
}

const websocketService = new WebSocketService();
export default websocketService; 