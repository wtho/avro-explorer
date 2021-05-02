import {
  Schema,
  ComplexSchemaType,
  UnionSchemaType,
  RecordSchemaType,
  EnumSchemaType,
  PrimitiveAvroType,
  PrimitiveSchemaType,
  FixedSchemaType,
  MapSchemaType,
  ArraySchemaType,
} from './avro-types'

function isString(val?: Schema): val is string {
  if (!val) {
    return false
  }
  return typeof val === 'string'
}

export function isComplexSchema(schema: Schema): schema is ComplexSchemaType {
  if (!schema || isString(schema)) {
    return false
  }
  return true
}

export function isComplexNamedSchema(
  schema: Schema
): schema is RecordSchemaType | EnumSchemaType | FixedSchemaType {
  if (!isComplexSchema) {
    return false
  }
  if (
    !isRecordSchema(schema) &&
    !isEnumSchema(schema) &&
    !isFixedSchema(schema)
  ) {
    return false
  }
  return true
}

export function isUnionSchema(schema?: Schema): schema is UnionSchemaType {
  if (!schema) {
    return false
  }
  return typeof schema === 'object' && Array.isArray(schema)
}

export function hasNamespace(
  schema: Schema
): schema is RecordSchemaType | EnumSchemaType {
  if (!isComplexNamedSchema(schema)) {
    return false
  }
  return !!schema.namespace
}

export function getSchemaStringName(schema?: Schema): string {
  if (!schema) {
    return '<none>'
  }
  if (typeof schema === 'string') {
    return schema
  }
  if (isComplexNamedSchema(schema)) {
    return schema.name
  }
  if (isUnionSchema(schema)) {
    return schema.map((s) => getSchemaStringName(s)).join(' | ')
  }
  return schema.type
}

export function getSchemaTypeName(schema?: Schema): string {
  if (!schema) {
    return '<none>'
  }
  if (typeof schema === 'string') {
    return schema
  }
  if (isUnionSchema(schema)) {
    return schema.map((s) => getSchemaTypeName(s)).join(' | ')
  }
  return schema.type
}

export function isPrimitiveType(
  schema?: Schema
): schema is PrimitiveAvroType | PrimitiveSchemaType {
  const primitiveTypeList: PrimitiveAvroType[] = [
    'bytes',
    'boolean',
    'double',
    'float',
    'int',
    'long',
    'null',
    'string',
  ]
  if (!schema) {
    return false
  }
  if (typeof schema !== 'string' && !Array.isArray(schema)) {
    return primitiveTypeList.includes(schema.type as PrimitiveAvroType)
  }
  return primitiveTypeList.includes(schema as PrimitiveAvroType)
}

export function getPrimitiveTypeDoc(
  schema: PrimitiveAvroType | PrimitiveSchemaType
): string {
  const primitiveTypeDocs: { [P in PrimitiveAvroType]: string } = {
    null: 'A primitive avro type: No value.',
    boolean: 'A primitive avro type: A binary value.',
    int: 'A primitive avro type: A 32-bit signed integer.',
    long: 'A primitive avro type: A 64-bit signed integer.',
    float:
      'A primitive avro type: A single precision (32 bit) IEEE 754 floating-point number.',
    double:
      'A primitive avro type: A double precision (64-bit) IEEE 754 floating-point number.',
    bytes: 'A primitive avro type: A sequence of 8-bit unsigned bytes.',
    string: 'A primitive avro type: A Unicode character sequence.',
  }
  if (typeof schema === 'string') {
    return primitiveTypeDocs[schema]
  }
  return primitiveTypeDocs[schema.type]
}

export function getUnionTypeDoc(schema: UnionSchemaType): string {
  return schema.map((innerSchema) => getSchemaDoc(innerSchema)).join(' | ')
}

export function isFixedSchema(schema?: Schema): schema is FixedSchemaType {
  if (
    !schema ||
    isString(schema) ||
    isPrimitiveType(schema) ||
    isUnionSchema(schema)
  ) {
    return false
  }
  return schema.type === 'fixed'
}

export function getFixedSchemaDoc(schema: FixedSchemaType): string {
  return `A fixed-sized data type for binary data, of byte size ${schema.size}`
}

export function isMapSchema(schema?: Schema): schema is MapSchemaType {
  if (
    !schema ||
    isString(schema) ||
    isPrimitiveType(schema) ||
    isUnionSchema(schema)
  ) {
    return false
  }
  return schema.type === 'map'
}

export function getMapSchemaDoc(schema: MapSchemaType): string {
  return `An associative array or dictionary where the key is a string and the value of type ${getSchemaStringName(
    schema.values
  )}`
}

export function isArraySchema(schema?: Schema): schema is ArraySchemaType {
  if (
    !schema ||
    isString(schema) ||
    isPrimitiveType(schema) ||
    isUnionSchema(schema)
  ) {
    return false
  }
  return schema.type === 'array'
}

export function getArraySchemaDoc(schema: ArraySchemaType): string {
  return `An array with items of type ${getSchemaStringName(schema.items)}`
}

export function isEnumSchema(schema?: Schema): schema is EnumSchemaType {
  if (
    !schema ||
    isString(schema) ||
    isPrimitiveType(schema) ||
    isUnionSchema(schema)
  ) {
    return false
  }
  return schema.type === 'enum'
}

export function isRecordSchema(schema?: Schema): schema is RecordSchemaType {
  if (
    !schema ||
    isString(schema) ||
    isPrimitiveType(schema) ||
    isUnionSchema(schema)
  ) {
    return false
  }
  return schema.type === 'record'
}

export function getEnumSchemaDoc(schema?: EnumSchemaType): string | null {
  return schema?.doc ?? null
}

export function getRecordSchemaDoc(schema?: RecordSchemaType): string | null {
  return schema?.doc ?? null
}

export function getSchemaDoc(schema?: Schema): string | null {
  if (!schema) {
    return null
  }
  if (isPrimitiveType(schema)) {
    return getPrimitiveTypeDoc(schema)
  }
  if (isUnionSchema(schema)) {
    return getUnionTypeDoc(schema)
  }
  if (isMapSchema(schema)) {
    return getMapSchemaDoc(schema)
  }
  if (isArraySchema(schema)) {
    return getArraySchemaDoc(schema)
  }
  if (isFixedSchema(schema)) {
    return getFixedSchemaDoc(schema)
  }
  if (isEnumSchema(schema)) {
    return getEnumSchemaDoc(schema)
  }
  if (isRecordSchema(schema)) {
    return getRecordSchemaDoc(schema)
  }
  return null
}

export function containsInnerRecordsEnumsFixed(schema?: Schema): boolean {
  if (!isRecordSchema(schema)) {
    return false
  }
  return schema.fields.some(
    (field) => isComplexSchema(field.type) && isComplexNamedSchema(field.type)
  )
}
