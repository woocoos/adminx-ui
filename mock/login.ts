import type { Request, Response } from '@ice/app';
import bodyParser from 'body-parser'

export default {
    'POST /api/login': (request: Request, response: Response) => {
        bodyParser.json()(request, response, async () => {
            let result: any = {
                success: false,
                userType: 'guest',
                data: {}
            }
            const { username, password } = request.body;
            if (username === 'admin' && password === 'ice') {
                result = {
                    success: true,
                    userType: 'admin',
                    data: {
                        name: 'Admin',
                        avatar: 'https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png',
                        userid: '00000001',
                        userType: 'admin',
                    }
                };
            }
            if (username === 'user' && password === 'ice') {
                result = {
                    success: true,
                    userType: 'user',
                    data: {
                        name: 'User',
                        avatar: 'https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png',
                        userid: '00000002',
                        userType: 'user',
                    }
                };
            }
            response.send(result);
        })
    },
    'POST /api/logout': (request: Request, response: Response) => {
        response.send({
            success: true,
        });
    },
}