import { Schema } from "./avro-types";

/* eslint-disable @typescript-eslint/ban-types */
export interface Project {
  meta: ProjectMetadata
  topics: SchemaForTopic[]
}

export interface ProjectMetadata {
  name: string
  projectBannerImageUrl?: string
  maintainer?: Maintainer
  externalLinks: {
    url: string
    name?: string
  }[]
  projectDescription?: string
}

export interface Maintainer {
  name: string
  url?: string
}

export interface SchemaForTopic {
  topic: string
  schema: Schema
  // schema: {
  //   name: string
  //   namespace?: string
  //   doc?: string
  //   type: string
  //   fields: unknown[]
  // }
}

export interface Navigation {
  topics: {
    name: string
    schemaNames: string[]
  }[]
}
