import { Schema } from './avro-types'
import { Project } from './types'

const schema: Schema = {
  namespace: 'com.edibles.meta',
  doc: 'The origin place of the veggie',
  fields: [{ name: 'street', doc: 'The street name', type: 'string' }],
  type: 'record',
  name: 'Origin',
}

export const project: Project = {
  meta: {
    name: 'FruitsAndVeggies Service',
    projectBannerImageUrl:
      'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1260&q=80',
    maintainer: {
      name: 'Team Farmers',
      url: 'https://edibles.com/farmers',
    },
    externalLinks: [
      { name: 'Wiki', url: 'https://wikipedia.org/wiki/Apache_Avro' },
      { name: 'Repo', url: 'https://github.com/wtho/avro-explorer' },
    ],
    projectDescription: `The FruitsAndVeggies Service is the authority of data belonging to farmers.

Therefore it controls all fruit-related data.`,
  },
  topics: [
    {
      topic: 'fruits-avro-topic',
      schema: {
        type: 'record',
        namespace: 'com.edibles.farmers.fruit-veggies',
        name: 'Fruit',
        doc: 'A fruit represents something edible and is definitely delicious!',
        fields: [
          { name: 'id', type: 'int' },
          { name: 'name', doc: 'The name of the fruit', type: 'string' },
          {
            name: 'origin',
            type: {
              name: 'Origin',
              type: 'record',
              namespace: 'com.edibles.meta',
              doc: 'The origin place of the fruit',
              fields: [
                { name: 'street', doc: 'The street name', type: 'string' },
              ],
            },
          },
          {
            name: 'fruitType',
            type: {
              name: 'FruitType',
              symbols: ['poisenous', 'edible'],
              type: 'enum',
            },
          },
          { name: 'colors', type: { type: 'array', items: 'string' } },
          {
            name: 'fruitsPerYear',
            type: { values: 'int', type: 'map' },
          },
        ],
      },
    },
    {
      topic: 'veggies-avro-topic',
      schema: {
        type: 'record',
        namespace: 'com.edibles.farmers.fruit-veggies',
        name: 'Veggie',
        doc: 'A veggie represents something edible and is definitely healthy!',
        fields: [
          { name: 'id', type: 'int' },
          { name: 'name', doc: 'The name of the veggie', type: 'string' },
          {
            name: 'origin',
            type: {
              name: 'Origin',
              namespace: 'com.edibles.meta',
              doc: 'The origin place of the veggie',
              fields: [
                { name: 'street', doc: 'The street name', type: 'string' },
              ],
              type: 'record',
            },
          },
          {
            name: 'Hardness',
            type: {
              name: 'Hardness',
              type: 'enum',
              symbols: ['hard', 'soft'],
            },
          },
          {
            name: 'colors',
            type: {
              items: 'string',
              type: 'array',
            },
          },
        ],
      },
    },
    {
      topic: 'number-of-fruits',
      schema: 'int',
    },
    {
      topic: 'just-a-fixed-schema',
      schema: {
        type: 'fixed',
        name: 'SomeFixedSchema',
        size: 16,
      },
    },
  ],
}
