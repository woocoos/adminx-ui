import type { Request, Response } from '@ice/app';
import bodyParser from 'body-parser'
import knockoutServer from "./graphql/knockout/server";

/**
 * 文档
 * https://the-guild.dev/graphql/tools/docs/api/modules/mock_src
 */
export default {
  'POST /api/graphql/query': (request: Request, response: Response) => {
    bodyParser.json()(request, response, async () => {
      const { query, variables } = request.body;
      const result = await knockoutServer.query(query as string, variables as any)
      response.send(result);
    })
  },
}
