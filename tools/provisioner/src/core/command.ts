export interface Command {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  execute(): Promise<boolean>;
}
