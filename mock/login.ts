import type { Request, Response } from '@ice/app';
import bodyParser from 'body-parser'

export default {
    'POST /api/login': (request: Request, response: Response) => {
        bodyParser.json()(request, response, async () => {
            let result: any = {}
            const { username, password } = request.body;
            if (username === 'woocoo.com' && password === '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92') {
                result = {
                    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDAwOTI0OTA4MzM2NjQiLCJleHAiOjE2Nzk5ODU1ODksImlhdCI6MTY3OTk4MTk4OSwianRpIjoidG9rZW46MjAwMDkyNDkwODMzNjY0OjQ4MTIyMzViLTg4YmMtNDY2NS1hMWU5LTcwZDljMDQ0YTViZSJ9.Uu7u-lAi641zdVyLevfEjwbO0og--0G3Ekz0m1HEAlw",
                    "expiresIn": 3600,
                    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDAwOTI0OTA4MzM2NjQiLCJleHAiOjE2Nzk5ODE5ODksImlhdCI6MTY3OTk4MTk4OSwianRpIjoidG9rZW46MjAwMDkyNDkwODMzNjY0OjBiZDkyN2UyLTczN2YtNDBjNy1iZDU0LTg3YzQ1MzEyMmFjMCJ9.ovbpjnG6k9zVsmERZa6LX9VT9wJaXLmm7-yVgwx6C5w",
                    "user": {
                        "displayName": "admin",
                        "domainId": 198555049289472,
                        "domainName": "wooocoo",
                        "id": 200092490833664
                    }
                };
            } else {
                result = {
                    "errors": [
                        {
                            "code": 400,
                            "message": "password not match"
                        }
                    ]
                }
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