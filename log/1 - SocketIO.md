https://socket.io/docs/v4/#what-socketio-is

https://socket.io/docs/v4/#what-socketio-is-not

Socket.IO is NOT a WebSocket implementation.

SocketIO는 websocket의 부가기능이나 확장이 아니다

websocket이 동작하지 않는 브라우저 환경에서도 SocketIO는 작동을 한다

방화벽이나 프록시에 의한 제한이 걸려있어도 작동한다

websocket을 사용하긴 하지만 지원하지 않으면 HTTP long polling을 사용한다

wifi를 사용하는 브라우저 환경에서의 연결이 잠시동안 끊겨도 SocketIO는 재연결을 시도한다