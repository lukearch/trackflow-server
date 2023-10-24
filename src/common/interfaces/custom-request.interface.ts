export interface IRequest extends Request {
  contextStorage: Map<string, unknown>;
  setContext: (key: string, value: unknown) => void;
  getContext: <T>(key: string) => T;
  headers: Headers & {
    authorization: string | null;
  };
}
