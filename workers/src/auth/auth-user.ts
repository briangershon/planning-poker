// env is a Cloudflare Worker environment that has KV methods

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  token: string;
  login: string;
}

interface Env {
  USER: {
    get(key: string, type: object): Promise<User>;
    put(key: string, value: string): Promise<void>;
  };
}

export class AuthUser {
  env: Env;

  constructor(env) {
    this.env = env;
  }

  async getUser(id: string): Promise<User | null> {
    const userData = await this.env.USER.get(id, {
      type: 'json'
    });
    return { ...userData, id };
  }

  async saveUser(user: User) {
    let { name, avatarUrl, token, login } = user;
    if (!name) {
      name = login;
    }
    await this.env.USER.put(
      user.id,
      JSON.stringify({ name, avatarUrl, token, login })
    );
  }
}
