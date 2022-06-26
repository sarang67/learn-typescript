export class Store {
  private subscibers: Function[];
  private reducers: { [key: string]: Function };
  private state: { [key: string]: any };

  constructor(reducer = {}, initialstate = {}) {
    this.reducers = reducer;
    this.state = this.reduce(initialstate, {});
  }

  get value() {
    return this.state;
  }

  dispatch(action) {
    this.state = this.reduce(this.state, action);
  }

  reduce(state, action) {
    const newState = {};
    for (const prop in this.reducers) {
      //newState.todos = this.reducers.todos(state.todos , action)
      newState[prop] = this.reducers[prop](state[prop], action);
    }

    return newState;
  }
}





/*
1) store state
-----------------
state =  {
    todos: todos_reducer_state
  }


2) reducer state
------------------
todos_reducer_state = {
  loaded: false,
  loading: false,
  data: [{ label: "Eat Pizza", complete: false }],
};

3) reducesr
---------------
const reducers = {
  todos: reducer(){},
  luggage:reducer(){}
};




 
*/

/*




};
*/
