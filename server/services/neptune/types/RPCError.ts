export class RPCError extends Error {
  code: number;
  data?: unknown;
  isRPCError: boolean;

  constructor(code: number, message: string, data?: unknown) {
    if (data !== undefined) {
      super(`${message}: ${data}`);
    } else {
      super(message);
    }

    this.code = code;
    this.data = data;
    this.isRPCError = true;
  }
}
