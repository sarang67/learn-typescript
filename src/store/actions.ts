// action constants
export const ADD_TODO = "[TODO] ADD TODO";
export const REMOVE_TODO = "[TODO] REMOVE TODO";

// action creators

export class AddTodo {
  readonly type = ADD_TODO;
  constructor(private payload: any) {}
}

export class RemoveTodo {
  readonly type = REMOVE_TODO;
  constructor(private payload: any) {}
}
