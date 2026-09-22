import * as vscode from 'vscode';
import { SECRET_SESSION_KEY } from '../constants';

export interface StoredSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id: string;
  username: string;
}

export class SecretStore {
  private readonly onDidChangeEmitter = new vscode.EventEmitter<void>();
  readonly onDidChange = this.onDidChangeEmitter.event;
  private readonly listener: vscode.Disposable;

  constructor(private readonly secrets: vscode.SecretStorage) {
    this.listener = secrets.onDidChange((e) => {
      if (e.key === SECRET_SESSION_KEY) {
        this.onDidChangeEmitter.fire();
      }
    });
  }

  async getSession(): Promise<StoredSession | undefined> {
    const raw = await this.secrets.get(SECRET_SESSION_KEY);
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as StoredSession;
    } catch {
      return undefined;
    }
  }

  async setSession(session: StoredSession): Promise<void> {
    await this.secrets.store(SECRET_SESSION_KEY, JSON.stringify(session));
  }

  async clearSession(): Promise<void> {
    await this.secrets.delete(SECRET_SESSION_KEY);
  }

  dispose(): void {
    this.listener.dispose();
    this.onDidChangeEmitter.dispose();
  }
}
