/*
Basic TypeScript Configuration
===============================
To use TypeScript, we’ll need to install it globally with NPM.

npm install -g typescript
tsc --init will create tsconfig.json

Once that’s done, we can use the tsc command to run the TypeScript compiler.

If we’ve installed TypeScript locally in our project, we can also run that version using npx


TSConfig.json
===============
The first command we’ll run will initialize our tsconfig.json file. We can use this file to tell TypeScript how we want it to run its compiler. We could also use a long list of command line flags, but that seems tedious and repetitive. To initialize the file, run


Implicit Type Checking
**********************
TypeScript’s type checker is designed to be easy to pick up and use. In fact, it will automatically infer, or guess, the types of many of the values in your program without you having to explicitly assign them a type. Take this for example. When we assign a string literal to a variable, TypeScript infers that the type of that variable is string .


let fruitName = "Banana"; // let name: string

Conceptually, we often refer to variables as being buckets that hold values. If that is the case, TypeScript lets us say what type of thing a bucket can hold and warns us if we ever try to put something in the wrong bucket. Here, we have a string bucket called “name”. TypeScript knows it’s a string because we’re immediately putting a string inside it.

If we were to try to reassign one of these variables to an incorrect type, TypeScript would throw a type error.

let fruitName = "Banana";

fruitName = 1193; // Type Error: Type 'number' is not assignable to type 'string'.



let fruit = {
  name: "Banana",
  color: "yellow",
  sweetness: 80,
  isRipe: true,
};

If we pull properties of the object into their own variables, those variables will still have the correct type


let { name, sweetness } = fruit;

name; // const name: string
sweetness; // const sweetness: number


let fruitNames = ["Apple", "Banana"]; // let fruitNames: string[]


Contextual Type Inference
========================
let fruitNames = ["Apple", "Banana"];

// This function makes every other item in our list uppercase.
const alternatedFruitNames = fruitNames.map((name, index) => {
  // (parameter) name: string
  // (parameter) index: number
  if (index % 2 === 0) {
    return name.toUpperCase();
  }
  return name;
});

alternatedFruitNames; // const alternatedFruitNames: string[]

TypeScript already knows that when we run .map on an array, the first parameter’s type will be the type of an array item and the second parameter will be a number representing the current index of the loop. In this case, we didn’t have to tell TypeScript anything about our types; it already knew.

We could even transform our array from one type to another and TypeScript will recognize the transformation, like with this function that changes the array of strings into an array of numbers.


let fruitNames = ["Apple", "Banana"];

const nameLength = fruitNames.map((name) => {
  return name.length;
});

nameLength; // const nameLength: number[]

If we were to create a function and pass that to our array’s map function, TypeScript can’t infer the parameter types anymore. This is because the function is no longer directly associated with the .map function, so TypeScript can’t directly know how our transformName function will be used.


function alternateUppercase(name, index) {
  // (parameter) name: any
  // (parameter) index: any
  if (index % 2 === 0) {
    return name.toUpperCase();
  }
  return name;
}

fruitNames.map(alternatedFruitNames);

TypeScript’s type inference will always fall back on the special any type. This type represents any other type and behaves as if we were using JavaScript. This can be handy when it’s difficult to give something the appropriate type, but we lose the guarantees which TypeScript’s type checker gives us. We want to avoid implicitly any s, so in our config we turned on the noImplicitAny flag. With our configuration, we would get a type error:

function alternateUppercase(name, index) {
  // (parameter) name: any - Type Error: Parameter 'name' implicitly has an 'any' type.
  // (parameter) index: any - Type Error: Parameter 'index' implicitly has an 'any' type.
}


Adding Type Annotations
***********************
One of the best things about TypeScript, as compared to many other typed languages, is it supports implicit type checking. TypeScript automatically reads our code and determines the types of values for us so we don’t have to annotate all of our types.

However, there are times that TypeScript isn’t able to infer our types. This is often because we are defining a variable before assigning a value to it. If TypeScript isn’t able to infer our types properly, it will set the type to any , which means less type safety for us. In the example below, verbalFruitCount has an any type because TypeScript can’t tell what type it is supposed to be based on the way we use it.

let favoriteDessert: string;
favoriteDessert = 6; // Type Error: Type 'number' is not assignable to type 'string'.
favoriteDessert = "Cheesecake";

let numberOfGuests: number;
let menuPlanned: boolean;

Notice that we haven’t assigned any value to these variables. In JavaScript, these variables have the value of undefined . In TypeScript, adding a type definition tells TypeScript that our variable must be that type. If we try using it before that variable is assigned a value, TypeScript will assume this is undesired behavior and give us an erro

let floralArrangement: string;
console.log(floralArrangement); // Variable 'floralArrangement' is used before being assigned.


If we actually do intend to use the value whether it is undefined or not, we can use a non-null assertion to tell TypeScript that we don’t care if our variable is used before being assigned. It looks like an exclamation point before the colon:


let floralArrangement!: string;
console.log(floralArrangement); // undefined

Array types are defined using the square bracket ( [] ) syntax we saw earlier. There is another syntax for defining arrays with angle brackets, but it’s use is discouraged.

let ingredients: string[]; // use this syntax
let recipes: Array<string>; // don't use this syntax


Object types can also be defined by placing a colon after the property names.

let menu: {
  courses: number;
  veganOption: boolean;
  drinkChoices: string[];
};

Make sure you don’t mistake these types for using object destructuring to assign properties to new variable names. They may look similar, but in one case we’re creating a variable and in the other case we’re adding type annotations.


// These are renamed variables, not types.
let { courses: orderedFood, veganOption: hasVegan } = menu;


We can also add annotations to a value that already has an any type. This restores TypeScript’s type checking to that value. One place this might be necessary is when performing network requests.

async function getFruitList() {
  const response = await fetch("https://example.com/fruitList");
  const fruitList = await response.json(); // const fruitList: any;
  const typeFruitList: string[] = fruitList; // const typeFruitList: string[];
  return typeFruitList;
}


Typing Function Declarations
****************************
Typing parameters
----------------
Adding type annotations to function parameters is very similar to adding types to variables. Let’s return to our array map example.

let fruitNames = ["Apple", "Banana"];

function alternateUppercase(name, index) {
  // (parameter) name: any
  // (parameter) index: any
  if (index % 2 === 0) {
    return name.toUpperCase();
  }
  return name;
}

const alternatedFruitNames = fruitNames.map(alternateUppercase);

Since TypeScript can’t infer the types of our function’s parameters, we have to add the types manually. This looks very similar to adding types to variables - we use a colon ( : ) after the parameter name, followed by the type.

function alternateUppercase(name: string, index: number) {
  if (index % 2 === 0) {
    return name.toUpperCase();
  }
  return name;
}

Now TypeScript knows that our function takes a string and a number as parameters. What would happen if we accidentally used a function with the wrong types?

function doubleNumber(num: number) {
  return num * 2;
}

const alternatedFruitNames = fruitNames.map(doubleNumber);
// Types of parameters 'num' and 'value' are incompatible.
//     Type 'string' is not assignable to type 'number'.


TypeScript threw a type error. It knows that the values of the array are string s, so when we try to use a function that accepts numbers s instead of string s, it will warn us that something is not right.


Return Values
-------------
We can also add types for the value that a function returns.

function headsOrTails(): boolean {
  return Math.random() > 0.5;
}

This function most definitely returns a boolean value. Most of the time TypeScript will infer the return type by what is returned, but adding an explicit return type makes it so we can’t accidentally return a value of the wrong type.

Async Functions
--------------
By definition, an async function is a function which returns a JavaScript Promise. Just like arrays, there is a special syntax for defining the type of the value which is wrapped in a promise. We place the wrapped type in angle brackets and put Promise in front of it.

async function getFruitList(): Promise<string[]> {
  const response = await fetch("https://example.com/fruit");
  const fruitList: string[] = await response.json();
  return fruitList;
}

If we were to try annotating this function with just string[] , TypeScript would warn us that we need to use the Promise type wrapper.


Function Type Expressions
-------------------------
hat do we do when we have a function that takes another function (often called a callback) as a parameter? For example, if I were to create a type definition for an array map function, I would have to pass a callback function as one of the parameters.

function mapNumberToNumber(list: number[], callback) {
  // (parameter) callback: any
  // Implementation goes here
}

Our callback parameter has an any type, which means we could call it as a function if we wanted to. However, we want to avoid any , since using it leads to less type safety.
We can create a function type annotation using a special syntax. It might look like an arrow function, but it’s defining a type.

function mapNumberToNumber(list: number[], callback: (item: number) => number) {
  // (parameter) callback: any
  // Implementation goes here
}

Then, when we call the function, TypeScript can check the callback that we pass in to make sure it matches the type signature we used.


const doubledNumbers = mapNumberToNumber([1, 2, 3], (num) => num * 2);

In this case, num is inferred to be a number because TypeScript is able to determine the type from the type annotation we added to the callback parameter.


Optional and Default Parameters
--------------------------------
ypeScript expects that every parameter of a function will be passed to it when the function is called, even if its value is undefined . This can be a problem when we don’t want to require the user to pass in every single parameter every time.

function logOutput(message: string, yell: boolean) {
  if (yell) {
    console.log(message.toUpperCase());
    return;
  }
  console.log(message);
}

logOutput("Hey! Listen!");
// TypeError: Expected 2 arguments, but got 1.
//  An argument for 'yell' was not provided.

We can tell TypeScript that a parameter is optional by adding a ? right before the type annotation.

function logOutput(message: string, yell?: boolean) {
  if (yell) {
    console.log(message.toUpperCase());
    return;
  }
  console.log(message);
}

logOutput("Hey! Listen!"); // "Hey! Listen!"

We didn’t need to include the second yell parameter because we marked it as optional.

We can also mark parameters as optional by giving them a default value. TypeScript will infer the type of the parameter from the default value.


function logOutput(message: string, yell = true) {
  if (yell) {
    console.log(message.toUpperCase());
    return;
  }
  console.log(message.toUpperCase());
}

logOutput("Hey! Listen!"); // "HEY! LISTEN!"


Spread Parameters
-----------------
When we aren’t sure how many parameters will be passed to a function, we can use the new spread syntax, which gives all of the parameters in a list. If all of the extra parameters are the same type, we can easily add an annotation to the spread parameters.

function logManyOutput(...messages: string[]) {
  messages.forEach((message) => {
    logOutput(message);
  });
}

*/
