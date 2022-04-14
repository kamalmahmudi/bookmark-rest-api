const hasEqualStructure = (obj1: any, obj2: any): boolean => {
  return Object.keys(obj1).every((key) => {
    const v = obj1[key]
    if (typeof v === 'object' && v !== null) {
      return hasEqualStructure(v, obj2[key])
    }
    return obj2.hasOwnProperty(key)
  })
}

export const toMatchStructure = (actual: any, expected: any) => {
  const pass = hasEqualStructure(actual, expected)
  return {
    message: () => `expected ${expected} to match structure ${actual}`,
    pass
  }
}

module.exports = () => {
  console.log('extending expect')
  expect.extend({ toMatchStructure })
}
