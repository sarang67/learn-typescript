import * as fromAction from "./actions";

export const initialState = {
  loaded: false,
  loading: false,
  data: [{ label: "Eat Pizza", complete: false }],
};

export function reducer(
  state = initialState,
  action: { type: string; payload: { label: string; complete: boolean } }
) {
  switch (action.type) {
    case fromAction.ADD_TODO: {
      const todo = action.payload;
      const data = [...state.data, todo];
      return {
        ...state,
        data,
      };
    }

    case fromAction.REMOVE_TODO: {
      const data = state.data.filter(
        (todo) => todo.label !== action.payload.label
      );

      return {
        ...state,
        data,
      };
    }
  }

  return state;
}
