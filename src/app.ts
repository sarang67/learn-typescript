const div = document.createElement("div");

div.innerHTML = ` 
<div id="app">
  <p>You have <span></span> todos.</p>
  <input type="text">
  <button type="button">Add todo</button>
  <ul class="todos"></ul>
 <button type="button" class="unsubscribe">Unsubscribe</button>
</div>`;

const body = document.querySelector("body");
body?.prepend(div);

console.log("start");

/* HTML part ends here */

import { renderTodos } from "./utils";
import * as fromStore from "./store";

const input = document.querySelector("input") as HTMLInputElement;
const button = document.querySelector("button") as HTMLButtonElement;
const destroy = document.querySelector(".unsubscribe") as HTMLButtonElement;
const todoList = document.querySelector(".todos") as HTMLLIElement;

const reducers = {
  todos: fromStore.reducer,
};

const store = new fromStore.Store(reducers);

button.addEventListener(
  "click",
  () => {
    if (!input.value.trim()) return;

    const payload = { label: input.value, complete: false };

    store.dispatch({
      type: "ADD_TODO",
      payload,
    });

    console.log(payload);
    console.log(store.value);

    input.value = "";
  },
  false
);

todoList.addEventListener("click", function (event) {
  const target = event.target as HTMLButtonElement;
  if (target.nodeName.toLowerCase() === "button") {
    console.log(target);
  }
});
