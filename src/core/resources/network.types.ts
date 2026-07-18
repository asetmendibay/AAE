export type ProxyProtocol = 'http' | 'https' | 'socks5';

export interface ProxyCredentials {
  readonly username: string;
  readonly password: string;
}

export interface NetworkResource {
  readonly proxy?: {
    readonly protocol: ProxyProtocol;
    readonly host: string;
    readonly port: number;
    readonly credentials?: ProxyCredentials;
  };
}
