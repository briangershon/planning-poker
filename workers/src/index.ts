import { router } from './http-api';
import { handleSocket } from './websocket-api';
export { GameDO } from './game-durable-object';

export default {
  async fetch(request: Request, env) {
    try {
      const url = new URL(request.url);
      switch (url.pathname) {
        case '/api/ws/':
          return await handleSocket(request, env);
        default:
          return await router.handle(request, env);
      }
    } catch (err) {
      return new Response(err.toString());
    }
  }
};
