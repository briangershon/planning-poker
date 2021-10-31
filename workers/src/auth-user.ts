// env is a Cloudflare Worker environment that has KV methods

interface User {
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
    return this.env.USER.get(id, {
      type: 'json'
    });
  }

  async saveUser(id: string, user: User) {
    let { name, avatarUrl, token, login } = user;
    if (!name) {
      name = login;
    }
    await this.env.USER.put(id, JSON.stringify({ name, avatarUrl, token }));
  }
}
