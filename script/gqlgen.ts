import { CodegenConfig } from "@graphql-codegen/cli";
import * as process from "process";

let dotenv = require('dotenv')
dotenv.config()
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, override: true })
dotenv.config({ path: '.env.local', override: true })

const schemaField = process.env.GQLGEN_SCHEMA || 'http://localhost:8080/graphql'
const token = process.env.GQLGEN_TOKEN
const tid = process.env.GQLGEN_TENANT_ID

const config: CodegenConfig = {
  // schema: [
  //   {
  //     [schemaField]: {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "X-Tenant-ID": `${tid}`,
  //       }
  //     }
  //   }
  // ],
  schema: ["mock/allinone.graphql"],
  documents: 'src/services/**/*.ts',
  generates: {
    'src/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      }
    }
  },
  ignoreNoDocuments: true,
}

export default config
