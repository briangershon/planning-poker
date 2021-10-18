// env is a Cloudflare Worker environment that has KV methods

interface User {
  name: string;
  avatarUrl: string;
  token: string;
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

  async getGithubUser(id: string): Promise<User | null> {
    const userKey = `GITHUB:${id}`;
    return this.env.USER.get(userKey, {
      type: 'json'
    });
  }

  async saveGithubUser(id: string, user: User) {
    const { name, avatarUrl, token } = user;
    const userKey = `GITHUB:${id}`;
    await this.env.USER.put(
      userKey,
      JSON.stringify({ name, avatarUrl, token })
    );
  }
}
