// Typing of a database record
export type Item = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };

  export type Contraint = {
    field: string;

    constraint: any;

    operator?: string;
  };
