import * as vscode from 'vscode';

class Logger {
  private channel = vscode.window.createOutputChannel('AI Code Feedback');

  info(message: string): void {
    this.channel.appendLine(`[info] ${message}`);
  }

  error(message: string, err?: unknown): void {
    this.channel.appendLine(`[error] ${message}`);
    if (err instanceof Error) {
      this.channel.appendLine(err.stack ?? err.message);
    } else if (err !== undefined) {
      this.channel.appendLine(String(err));
    }
  }

  dispose(): void {
    this.channel.dispose();
  }
}

export const logger = new Logger();
