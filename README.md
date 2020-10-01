# Calling Context

Make cleaner, less verbose function signatures while minimizing the usage of global state by providing your functions with some context.

It's as simple as
```js
let context = require('@thescottyjam/calling-context')

// 1. Create a context
let configCtx = context.create()

// 2. Provide some useful values to your context
let dummyConfig = {verbose: true}
context.provide(configCtx, dummyConfig, () => {
  // Anything inside this callback has access to your context, including addThings()
  addThings(2, 3)
})

// 3. Use the provided context
function addThings(x, y) {
  let config = configCtx.get()
  if (config.verbose) {
    console.log('Adding', x, 'and', y)
  }
  return x + y
}
```

The common solution to providing configuration to your app, like the verbosity level, is to use global state (which is bad for testing), or to pass the config around your entire code base (which is just ugly).

Calling-Contexts serve the same purpose as React Contexts but in the non-UI world, and exist to help you implicitly pass parameters to nested functions without having to explicitly put them in every function signature.

## Use Cases

* Provide configuration to your whole app without having to rely on global state.
* Provide request-related parameters (like req, res, a log object, etc) so these don't need to be part of every function signature anymore.
* It is common for a single function to have a number of dedicated helper functions. In larger scenarios it can be convenient to use a calling context to pass the original parameters and other useful data to the helper functions.
* Configuring your library to run differently when provided with different contexts (as apposed to a global configuration).
* Whatever use cases you find

<br/>
<br/>
<br/>

# API Reference

## callingContext.create() -> ContextHandle

Creates and returns a ContextHandle.

## callingContext.provide(contextHandle, value, callback)

Calls the callback. While the callback is executing, the value will be provided to the contextHandle, and can be retrieved anywhere inside the callback.

If the provided contextHandle already has a value provided to it, it will be overwritten for the duration of the callback, then returned to normal.

Whatever is returned from the callback will be returned by provide().

**NOTE:** async callbacks are not supported.

## callingContext.provide(contextHandleToValues, callback)

An alternative signature to `provide()` that lets you provide values to multiple context handles at once.

For example, if ctx1 and ctx2 are context handles returned by create(), then this will provide values for both:
```js
provide({[ctx1]: value1, [ctx2]: value2}, () => { ... })
// NOTE: {[ctx]: value} is valid syntax.
// It makes the string representation of ctx into the key.
```

## contextHandle.get() -> provided value

Retrieves the value currently being provided to this context handle. If no value is being provided, an error is thrown.

## contextHandle.provided() -> boolean

Returns true if a value is currently being provided to this context handle.

<br/>
<br/>
<br/>

# Project Source

This project's github repository can be found [here](https://github.com/theScottyJam/calling-context). Issues and feature requests are welcome, and can be submitted on github.