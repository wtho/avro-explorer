import { isComplexSchema } from './avro-helper'

describe('avro-helper', () => {
  test('isComplexSchema should return false for string', () => {
    const schema = 'some-string'

    const isComplex = isComplexSchema(schema)

    expect(isComplex).toBe(false)
  })
})
