// (() => {
// const Person = function(name, age) {
//     this.name = name;
//     this.age = age;
// };

// Es6
class Person {
    #
    name = "Super Admin";
    constructor(obj) {

        this._age = obj.age;
    }

    get name() {
        return this.#name;
    }

    set name(value) {
        if (typeof value === "string") {
            this.#name = value;
            console.log(this.#name);
        } else throw new Error("Name must be a string");
    }

    # sayName() {
        return this.#name;
    }
    greet(msg) {

        return msg + " " + this.#sayName();
    }

}

const obj = {
    sayName: function () {}
}

const remi = new Person({
    name: "Promise",
    age: 27
}); // {name: "Promise", age: 27}
// const promise = new Person("Promise", 27);

// remi.name = "Promise";
// })();


class Animal {
    #
    name = undefined;
    constructor(name, type) {
        this.#name = name;
        this.type = type;
    }

    get name() {
        return this.#name;
    }

    set name(value) {
        if (typeof value === "string") {
            this.#name = value;

        } else throw new Error("Name must be a string");
    }

    sayName(msg = "Hello dear, my name is") {
        return msg + " " + this.#name;
    }
}

//  inheritance  classes 
class Dog extends Animal {
    constructor(name, type) {
        super(...arguments);
    }

    sayName(msg = "Hello dear, my name is") {
        return msg + " " + this.name + " and I am a " + this.type;
    }
}

const jake = new Dog("Jake", "German Shepherd");

console.log(jake.sayName());