async function test1(input) {
    setTimeout(() => {
        console.log(input)
    }, 3000);
    return input;
}

async function test2() {
    const foo = await test1("foo");
    console.log("bar");
}

test2();