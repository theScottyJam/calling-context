let contextValues = {}

exports.create = function() {
  let id = `CALLING-CONTEXT-${Math.random().toString().slice(2)}`
  return {
    toString: () => id, // Allows it to be used as a map key
    get() {
      if (!contextValues[id]) throw ctxNotProvided()
      return contextValues[id].value
    }
  }
}

// Call as either provide(ctx, value, callback)
// or as provide(ctxToValueMap, callback)
exports.provide = function provide(...args) {
  let [map, callback] = (
    args.length === 2
      ? args
      : [{[args[0]]: args[1]}, args[2]]
  )

  setContextValues(map)
  try {
    return callback()
  } finally {
    unsetContextValues(map)
  }
}

function setContextValues(map) {
  for (let [ctx, value] of Object.entries(map)) {
    let prvNode = contextValues[ctx]
    contextValues[ctx] = {value, prvNode}
  }
}

function unsetContextValues(map) {
  for (let ctx of Object.keys(map)) {
    contextValues[ctx] = contextValues[ctx].prvNode
    if (!contextValues[ctx])
      delete contextValues[ctx]
  }
}

const ctxNotProvided = () => new Error(
  'CTX_NOT_PROVIDED: Attempted to get the value of a context that was not being provided. Make sure you provide the context value with context.provide(...)'
)