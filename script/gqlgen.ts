import { CodegenConfig } from "@graphql-codegen/cli";
import * as process from "process";

const dotenv = require('dotenv')
dotenv.config()
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, override: true })
dotenv.config({ path: '.env.local', override: true })


/**
 * 生成.graphql的配置
 */
const schemaAstConfig: CodegenConfig = {
  generates: {}
}


/**
 * 开发使用的生成配置
 */
const config: CodegenConfig = {
  generates: {},
  ignoreNoDocuments: true,
}


// knockout项目
if (process.env.GQLGEN_SCHEMA_KNOCKOUT) {
  const moduleName = 'knockout',
    srcOutputDir = `src/__generated__/${moduleName}/`,
    graphqlFileOutput = `script/__generated__/${moduleName}.graphql`,
    documents = `src/services/${moduleName}/**/*.ts`;

  config.generates[srcOutputDir] = {
    preset: 'client',
    presetConfig: {
      gqlTagName: 'gql',
    },
    schema: graphqlFileOutput,
    documents,
  }

  if (process.env.GQLGEN_TOKEN && process.env.GQLGEN_TENANT_ID) {
    schemaAstConfig.generates[graphqlFileOutput] = {
      plugins: ['schema-ast'],
      schema: {
        [process.env.GQLGEN_SCHEMA_KNOCKOUT]: {
          headers: {
            "Authorization": `Bearer ${process.env.GQLGEN_TOKEN}`,
            "X-Tenant-ID": `${process.env.GQLGEN_TENANT_ID}`,
          }
        },
      }
    }
  }
}



export default process.argv.includes('--schema-ast') ? schemaAstConfig : config
