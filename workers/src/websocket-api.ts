import { getCurrentUserFromCookie } from './auth';

export async function handleSocket(request, env) {
  const user = await getCurrentUserFromCookie(request, env);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  let url = new URL(request.url);
  let params = new URLSearchParams(url.search);
  const gameId = params.get('gameId');
  if (!gameId) {
    return new Response('Missing gameId.', { status: 400 });
  }

  const id = env.GAME_DO.idFromName(gameId);
  const obj = env.GAME_DO.get(id);

  return await obj.fetch(request);
}
