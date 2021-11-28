/* 
Interfaces
***************
We’ve already learned that we can add type definitions for objects directly to the variable when we’re assigning it, like so:

const car: { wheels: number; color: string; electric: boolean } = {
  wheels: 4,
  color: "white",
  electric: true,
};

This defines the shape of the object, and tells us that our object has a number of wheels and a color. This works well for one-off objects, but what if we have many objects that all have the same shape? We’ll end up having lots of duplication.


Fortunately, we can construct a special type definition for our object using Interfaces. Interfaces let us create a named definition of the shape of an object that we can reuse. Once we’ve defined our interface type, we can use it as a type annotation.


interface Vehicle {
  wheels: number;
  color: string;
  electric: boolean;
}

const car: Vehicle = { wheels: 4, color: "white", electric: true };
const motorcycle: Vehicle = { wheels: 2, color: "red", electric: false };
const tractorTrailer: Vehicle = { wheels: 18, color: "blue", electric: false };


This also helps us tell the difference between two different objects that have a similar shape.

interface Nutrient {
  name: string;
  value: number;
}

interface Fruit {
  name: string;
  color: string;
  calories: number;
  nutrients: Nutrient[];
}

interface Vegetable {
  name: string;
  color: string;
  calories: number;
  nutrients: Nutrient[];
}


let apple: Fruit;
let squash: Vegetable;


 based on the types, we can see that an apple is a Fruit and a squash is a Vegetable. Also, notice that we can use interfaces as the base type for arrays as is the case with our Nutrient[] type.

We should recognize though, that because Fruit and Vegetable have the same shape, they are essentially equivalent. We could assign a Fruit variable to a Vegetable variable, and TypeScript wouldn’t complain. This is because Interfaces don’t create new types; they just assign names to a particular shape of types. This also means that a literal object with the same shape as a Fruit or Vegetable is also compatible.

let fruitBasket: Fruit[] = [];
const tomato = { name: "Tomato", color: "red", calories: 10, nutrients: [] }

fruitBasket.push(tomato); // It works.

We’ll talk about how to get around this behavior using Discriminating Unions in a future section.



Extending Interfaces
--------------------
We can see that our Fruit and Vegetable Interfaces are very similar - we might as well just have one Interface and use it for both of them. But what if there were properties that were unique to either Fruit or Vegetable? To handle this, we could extend our interface. This copies the property definitions of one interface to another, which lets you reuse type definitions even more. Lets look at how we could improve our previous example.


interface EdibleThing {
  name: string;
  color: string;
}

interface Fruit extends EdibleThing {
  sweetness: number;
}

const apple: Fruit = { name: "apple", color: "red", sweetness: 80 };

Declaration Merging
------------------
Interfaces can be declared multiple times with different properties each time. When TypeScript compiles your code, it will combine the two interfaces together, allowing you to use properties from both of them.

interface Fruit {
  name: string;
}

interface Fruit {
  color: string;
  sweetness: number;
}

const apple: Fruit = { name: "apple", color: "red", sweetness: 80 };

Object Literal Assignment
-------------------------
When TypeScript is checking to see if a value can be assigned to an Interface, it is going to look at each of the properties to see if the types of those properties match up. When assigning one variable to another, it only checks the properties which are defined on the Interface, not all of the properties on the variable. That makes it possible to put more properties on a variable than are defined by the interface. We won’t be able to access those properties without getting a type error, but they are still there.


interface Fruit {
  name: string;
  color: string;
  sweetness: number;
}

let fruitBasket: Fruit[] = [];

const tomato: {
  name: string;
  color: string;
  sweetness: number;
  hasSeeds: boolean;
} = { name: "Tomato", color: "red", sweetness: 10, hasSeeds: true };

fruitBasket.push(tomato);


fruitBasket[0].hasSeeds; // Property 'hasSeeds' does not exist on type 'Fruit'.
console.log(fruitBasket[0]); // { name: "Tomato", color: "red", sweetness: 10, hasSeeds: true }


TypeScript has a special rule for object literals, however. If you try to assign an object literal to a specific type, TypeScript will warn you about any extra properties.


fruitBasket.push({
  name: "Banana",
  color: "yellow",
  sweetness: 70,
  hasSeeds: false,
});

// Argument of type '{ name: string; color: string; sweetness: number; hasSeeds: boolean; }' is not assignable to parameter of type 'Fruit'.
//    Object literal may only specify known properties, and 'hasSeeds' does not exist in type 'Fruit'.

TypeScript is telling us that we can’t push our object literal onto an array of Fruit s because we have an extra property which isn’t defined on the Fruit interface. Again, this is a special behavior for object literals that doesn’t apply when assigning one variable to another.



Optional Properties
--------------------
metimes properties on an interface are entirely optional. Or we will assign them a value later, but don’t have that value right now. We can specify properties of interfaces as optional using a question mark.

interface EdibleThing {
  name: string;
  color: string;
}

interface Fruit extends EdibleThing {
  calories?: number;
}

let totalCalories = 0;
let apple: Fruit = { name: "Apple", color: "red" };


totalCalories += apple.calories; // Object is possibly 'undefined'.


if (apple.calories) {
  // "apple.calories" is now recognized as a number
  totalCalories += apple.calories; // This works
}

Incidentally, optional properties can be applied to regular object definitions too

let pear: { name: string; calories?: number };

Indexable Types
--------------
If we know the property exists on the interface, we can just access it directly using dot ( . ) notation, as in Math.random or Array.isArray . But what if we are using a value in a variable to access a property dynamically? In JavaScript, we use square brackets to do that.

const propertyName = "random";
Math[propertyName](); // 0.2524323113

That’s where Indexable Types come in. Using an index signature , we can provide types for anything that is accessed dynamically using a variable as the property name. When we define our index signature, we need to provide the type of the index itself (only string and number is allowed), an identifier for the index (we use “key” in this next example), and the type of the property’s value. We can mix index signatures with regular property signatures, so long as the key and value types match.


interface Fruit {
  [key: string]: string;
  name: string;
}

let apple: Fruit = {
  name: "Apple",
  ripeness: "overripe",
};

If we were to use an index of the wrong type, or if we were to use the wrong value, TypeScript would throw a type error.

let apple: Fruit = {
  name: "Apple",
  isRipe: true, // Type 'boolean' is not assignable to type 'string'.
  //     The expected type comes from the index signature.
};


Notice that the type error tells us both that we can’t use boolean s in place of string s and that the restriction is because of the index signature.

We can use number s for our index signatures to represent array-like objects

interface FavoriteFruitList {
  [fruitOrder: number]: string;
}

const favoriteFruit: FavoriteFruitList = [];
favoriteFriends[1] = "Apple";

const thirdPlace = 3;
favoriteFriends[thirdPlace] = "Strawberry";


Notice that we can use any identifier we want for our index. In this case, we used “fruitOrder”. This doesn’t affect how the code works at all. This is really helpful for documenting what the index type actually represents.


Enum and Tuple Types
********************
TypeScript gives us two types which expand on object and arrays : Enums and Tuples. The purpose of both of these types is to add even more structure to our types. Lets take a look at some situations when these might be helpful.


Enums
-----
One common programming tip is to avoid using magic values in our code. These are values which change how our program behaves, but the values themselves aren’t named. Take this function for example:

function seasonsGreetings(season: string) {
  if (season === "winter") return "⛄️";
  if (season === "spring") return "🐰";
  if (season === "summer") return "🏖";
  if (season === "autumn") return "🍂";
}


In this case, the string values winter , spring , summer , and autumn are magic strings. Having them in just one function is fine, but it we were to reuse them over and over in our codebase, there’s a chance we might have a typo or miss one of the options. Also, it might not be clear what the magic value represents. That’s why it’s common to put our magic values into named constants.

const SEASONS = {
  winter: "winter",
  spring: "spring",
  summer: "summer",
  autumn: "autumn",
};

function seasonsGreetings(season: string) {
  if (season === SEASONS.winter) return "⛄️";
  // ...
}


This puts our magic strings in one place, gives them a name, and makes us less likely to misspell them, since TypeScript will warn us if we use the wrong property name for SEASONS . This doesn’t solve all of the problems, though. We can still pass any string into our seasonsGreetings function, and our object definition is a little verbose. We can use an Enum to create a type safe definition of named constants which we can reference elsewhere in our code.


Here is our same function, but implemented with an Enum instead of an object.

enum Seasons {
  winter,
  spring,
  summer,
  autumn,
}

function seasonsGreetings(season: Seasons) {
  if ((season = Seasons.winter)) return "⛄️";
  // ...
}

const greeting = seasonsGreetings(Seasons.winter);

Notice that we are able to use Seasons as both a type and a value. We tell TypeScript that the season parameter of our seasonsGreetings function is a Seasons type, which means it has to be one of the constant properties we defined in our Enum. Then, when we call our function, instead of passing a string , we pass one of the properties of Seasons into the function.

Our Enum acts like an object, where the string s we include are the property names and their values are incrementing number s, starting at 0. Notice that when we assign the Enum as a type for a variable, we can use any of the properties of the Enum as values for that variable.

Most types are removed when TypeScript compiles code to JavaScript. Enums, on the other hand, are translated into JavaScript snippets which represent their shape and behavior. That makes Enums both a type and a value. If I were to run the Seasons enum through the TypeScript compiler, this is what it would output:

var Seasons;
(function (Seasons) {
  Seasons[(Seasons["winter"] = 0)] = "winter";
  Seasons[(Seasons["spring"] = 1)] = "spring";
  Seasons[(Seasons["summer"] = 2)] = "summer";
  Seasons[(Seasons["autumn"] = 3)] = "autumn";
})(Seasons || (Seasons = {}));

console.log(Seasons);
// {
//   '0': 'winter',
//   '1': 'spring',
//   '2': 'summer',
//   '3': 'autumn',
//   winter: 0,
//   spring: 1,
//   summer: 2,
//   autumn: 3
// }


There are a few things to learn from this. First, TypeScript implements enums as an object very similar to the object we used before. However, it uses number s to represent the constants instead of string s. Also, we can see that Enums allow us to both access the number s using the property names, but also access the property names with the appropriate number index.

If we wanted to start our enum with a different number , we just put it in front of the first item and the rest will auto-increment.

enum Seasons {
  winter = 12,
  spring,
  summer,
  autumn,
}
console.log(SEASONS.summer); // 14


Or we could assign each Enum property its own number .

enum Seasons {
  winter = 15,
  spring = 200,
  summer = 12,
  autumn = 59,
}

We can even assign Enum properties string values. Remember that if you do this, you have to assign string s to all of the properties.

enum Seasons {
  winter = "snowy",
  spring = "rainy",
  summer = "sunny",
  autumn = "windy",
}

const mySeason = Seasons.winter; // const mySeason: Seasons
console.log(mySeason); // "snowy"

One thing to remember is that Enums are their own types with a unique behavior. You can actually assign number s to Enum variables so long as the Enum doesn’t use string values. However, you cannot assign a string property to an Enum variable, even if the Enum uses string values. We have to use the properties of the Enum instead.

enum Colors {
    red,
    green,
    blue
}

let myEnum = Colors.red;
let myNumber: number = myEnum; // This works
myEnum = 2 // This also works


enum Seasons {
    spring = "spring"
    summer = "summer"
    autumn = "fall"
    winter = "winter"
}

let myStringEnum = Seasons.spring
myStringEnum = "winter" // Type 'string' is not assignable to type 'Seasons'.
myStringEnum = Seasons.winter // This works

Enums are often used to represent the names of different finite states. For example, we could use an Enum to model the different states of a Promise

enum PromiseStates {
  pending,
  fulfilled,
  rejected,
}

const FakePromise = {
  state: PromiseStates.pending,
  resolve: function () {
    this.state = PromiseStates.fulfilled;
  },
  reject: function () {
    this.state = PromiseStates.rejected;
  },
};

Tuple
*******

Most of the time when we use arrays, we intend for it to be variable length, which means we can add and remove items from the array. We also expect all of the elements to be the same type. The type string[] means an array of any size that can only be strings. What if we had an array where different items were different types?

For example, the useState hook in React returns an array of two things: The state value, and a function to update the state. Here’s a very simplified, naïve implementation of useState .

let simpleState: string;
function simpleUseState(initialState: string) {
  if (!simpleState) {
    simpleState = initialState;
  }
  function updateState(newState: string) {
    simpleState = initialState;
  }
  return [simpleState, updateState];
}

const [username, setUsername] = simpleUseState("alexanderson");
// const username: string | ((newState: string) => void)
// const setUsername: string | ((newState: string) => void)

We can see that our naïve solution didn’t hold up well. Instead of giving us an array where the first item is a string and the second item is a function, simpleUseState returned an array where each item is either a string or a function. These are called Union types, and they are annotated with the vertical bar ( | ) between the different types. We’ll learn more about them later on in the course.

For right now, all that we need to know is that TypeScript won’t let us use username or setUsername as a string or function without us checking to see which it is first. We can do this with type narrowing.

setUsername("Alex");
// Type Error: Not all constituents of type 'string | ((newState: string) => void)' are callable.
//     Type 'string' has no call signatures.

if (typeof setUsername === "function") {
  setUsername("Alex");
}

This would be much nicer if we could tell TypeScript that the first item in our array is a string and the second is a function. We can do that using Tuples.

Tuples are fixed-length arrays. We can tell TypeScript how many items are in the array, and what the type of each item is.

We write Tuples by wrapping our list of types in square brackets.

function simpleUseState(
  initialState: string
): [string, (newState: string) => void] {
  // The rest of the implementation goes here.
}

ypeScript will never infer an array of items to be a tuple, even if the items are of different types. Like we saw with our naïve example, TypeScript guessed we wanted an array of mixed types, not specific types for each index in the array. That means that when you create tuples, you always have to add a type annotation.

Destructuring our Tuple will yield the appropriate types on our values without us having to annotate them.


const [username, setUsername] = simpleUseState("alexanderson");
// const username: string
// const setUsername: (newState:string) => void
setUsername("Alex"); // No error
*/
