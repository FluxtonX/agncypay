declare module "intuit-oauth" {
  interface OAuthClientConfig {
    clientId: string;
    clientSecret: string;
    environment: "sandbox" | "production";
    redirectUri: string;
  }

  interface TokenJson {
    access_token?: string;
    refresh_token?: string;
    realmId?: string;
    expires_in?: number;
    x_refresh_token_expires_in?: number;
    createdAt?: number;
    token_type?: string;
    id_token?: string;
    latency?: number;
    state?: string;
  }

  interface AuthResponse {
    getJson(): TokenJson;
    text(): string;
    status: number;
    headers: any;
  }

  class OAuthClient {
    static scopes: {
      Accounting: string;
      OpenId: string;
      Profile: string;
      Email: string;
      [key: string]: string;
    };

    constructor(config: OAuthClientConfig);

    authorizeUri(params: { scope: string | string[]; state?: string }): string;
    createToken(uri: string): Promise<AuthResponse>;
    setToken(token: TokenJson): void;
    isAccessTokenValid(): boolean;
    refresh(): Promise<AuthResponse>;
    revoke(params?: { token_type_hint?: "access_token" | "refresh_token" }): Promise<AuthResponse>;
    makeApiCall(params: {
      url: string;
      method: string;
      headers?: Record<string, string>;
      body?: any;
    }): Promise<AuthResponse>;
  }

  export default OAuthClient;
}
