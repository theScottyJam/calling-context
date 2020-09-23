let context = require('..')

describe('provide()', () => {
  it('accepts three arguments', () => {
    let ctx = context.create()
    context.provide(ctx, 2, () => {
      expect(ctx.get()).toBe(2)
    })
  })

  it('accepts two arguments', () => {
    let ctx1 = context.create()
    let ctx2 = context.create()
    let map = {[ctx1]: 1, [ctx2]: 2}
    context.provide(map, () => {
      expect(ctx1.get()).toBe(1)
      expect(ctx2.get()).toBe(2)
    })
  })

  it('preserves returned value', () => {
    let ctx = context.create()
    let res = context.provide(ctx, 0, () => {
      return 2
    })
    expect(res).toBe(2)
  })

  it('can be nested', () => {
    let ctx1 = context.create()
    let ctx2 = context.create()
    context.provide(ctx1, 1, () => {
      context.provide(ctx2, 2, () => {
        expect(ctx1.get()).toBe(1)
        expect(ctx2.get()).toBe(2)
      })
    })
  })

  it('can override existing context', () => {
    let ctx = context.create()
    context.provide(ctx, 1, () => {
      context.provide(ctx, 2, () => {
        expect(ctx.get()).toBe(2)
      })
    })
  })

  it('can restore overwritten context value', () => {
    let ctx = context.create()
    context.provide(ctx, 1, () => {
      context.provide(ctx, 2, () => {})
      expect(ctx.get()).toBe(1)
    })
  })

  it('can handle errors inside callback', () => {
    let ctx = context.create()
    context.provide(ctx, 1, () => {
      try {
        context.provide(ctx, 2, () => {throw new Error()})
      } catch {}
      expect(ctx.get()).toBe(1)
    })
  })
})

describe('ctx.get()', () => {
  it('does not allow using a non-provided context', () => {
    let ctx = context.create()
    expect(() => ctx.get()).toThrowError(/^CTX_NOT_PROVIDED/)
  })
})

describe('ctx.provided()', () => {
  it('returns true when the context is provided', () => {
    let ctx = context.create()
    context.provide(ctx, 2, () => {
      expect(ctx.provided()).toBeTrue()
    })
  })

  it('returns false when the context is never provided', () => {
    let ctx = context.create()
    expect(ctx.provided()).toBeFalse()
  })

  it('returns false when the context used to be provided', () => {
    let ctx = context.create()
    context.provide(ctx, 2, () => {})
    expect(ctx.provided()).toBeFalse()
  })
})