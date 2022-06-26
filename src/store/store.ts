export class Store {
  private subscibers: Function[];
  private reducers: { [key: string]: Function };
  private state: { [key: string]: any };

  constructor(reducer = {}, initialstate = {}) {
    this.state = initialstate;
  }

  get value() {
    return this.state;
  }
}
