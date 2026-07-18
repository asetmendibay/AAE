import type { NetworkResource } from '../resources/network.types.js';

export interface BrowserOptions {
  readonly headless: boolean;
  readonly timeoutMs: number;
  readonly network?: NetworkResource;
}

export interface BrowserPage {
  goto(url: string): Promise<void>;
  title(): Promise<string>;
  close(): Promise<void>;
}

export interface BrowserSession {
  openPage(): Promise<BrowserPage>;
  close(): Promise<void>;
}

export interface BrowserPort {
  openSession(options: BrowserOptions): Promise<BrowserSession>;
}
