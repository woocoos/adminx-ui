import { CodegenConfig } from "@graphql-codegen/cli";
import * as process from "process";

const dotenv = require('dotenv')
dotenv.config()
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, override: true })
dotenv.config({ path: '.env.local', override: true })

const knockoutSchema = process.env.GQLGEN_SCHEMA_KNOCKOUT

if (!knockoutSchema) {
  throw Error('The env.GQLGEN_SCHEMA_KNOCKOUT is undefined')
}

/**
 * 生成.graphql的配置
 */
const schemaAstConfig: CodegenConfig = {
  generates: {
    // knockout 项目
    'script/__generated__/knockout.graphql': {
      plugins: ['schema-ast'],
      schema: {
        [knockoutSchema]: {
          headers: {
            "Authorization": `Bearer ${process.env.GQLGEN_TOKEN}`,
            "X-Tenant-ID": `${process.env.GQLGEN_TENANT_ID}`,
          }
        },
      }
    }
  }
}


/**
 * 开发使用的生成配置
 */
const config: CodegenConfig = {
  generates: {
    // knockout 项目
    "src/__generated__/knockout/": {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
      schema: "script/__generated__/knockout.graphql",
      documents: "src/services/knockout/**/*.ts",
    }
  },
  ignoreNoDocuments: true,
}


export default process.argv.includes('--schema-ast') ? schemaAstConfig : config
