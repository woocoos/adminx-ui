import type { Request, Response } from '@ice/app';
import bodyParser from 'body-parser'
import svgCaptcha from 'svg-captcha'

interface LoginResponse {
    accessToken?: string
    expiresIn?: number
    refreshToken?: string
    user?: {
        displayName: string
        domainId: string | number
        domainName: string
        id: string | number
    },
    errors?: {
        code: number
        message: string
    }[]
}

export default {
    'POST /api/login/auth': (request: Request, response: Response) => {
        bodyParser.json()(request, response, async () => {
            const result: LoginResponse = {}
            const { username, password, captcha } = request.body;
            const cookies = request.headers.cookie?.split('; ')
            if (username === 'woocoo.com' && password === '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92' && cookies?.includes(`captcha=${captcha}`)) {
                result.accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDAwOTI0OTA4MzM2NjQiLCJleHAiOjE2Nzk5ODU1ODksImlhdCI6MTY3OTk4MTk4OSwianRpIjoidG9rZW46MjAwMDkyNDkwODMzNjY0OjQ4MTIyMzViLTg4YmMtNDY2NS1hMWU5LTcwZDljMDQ0YTViZSJ9.Uu7u-lAi641zdVyLevfEjwbO0og--0G3Ekz0m1HEAlw"
                result.expiresIn = 3600
                result.refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDAwOTI0OTA4MzM2NjQiLCJleHAiOjE2Nzk5ODE5ODksImlhdCI6MTY3OTk4MTk4OSwianRpIjoidG9rZW46MjAwMDkyNDkwODMzNjY0OjBiZDkyN2UyLTczN2YtNDBjNy1iZDU0LTg3YzQ1MzEyMmFjMCJ9.ovbpjnG6k9zVsmERZa6LX9VT9wJaXLmm7-yVgwx6C5w"
                result.user = {
                    displayName: "admin",
                    domainId: 198555049289472,
                    domainName: "wooocoo",
                    id: 200092490833664
                }
            } else {
                result.errors = [
                    {
                        "code": 401,
                        "message": "password not match"
                    }
                ]
            }
            response.status(500);
            response.send(result);
        })
    },
    // 
    'POST /api/login/verify-facto': (request: Request, response: Response) => {
        bodyParser.json()(request, response, async () => {
            const result: LoginResponse = {}
            const { deviceId, stateToken, otpToken } = request.body;
            if (stateToken === '1234' && otpToken === '1234' && deviceId) {
                result.accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDAwOTI0OTA4MzM2NjQiLCJleHAiOjE2Nzk5ODU1ODksImlhdCI6MTY3OTk4MTk4OSwianRpIjoidG9rZW46MjAwMDkyNDkwODMzNjY0OjQ4MTIyMzViLTg4YmMtNDY2NS1hMWU5LTcwZDljMDQ0YTViZSJ9.Uu7u-lAi641zdVyLevfEjwbO0og--0G3Ekz0m1HEAlw"
                result.expiresIn = 3600
                result.refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDAwOTI0OTA4MzM2NjQiLCJleHAiOjE2Nzk5ODE5ODksImlhdCI6MTY3OTk4MTk4OSwianRpIjoidG9rZW46MjAwMDkyNDkwODMzNjY0OjBiZDkyN2UyLTczN2YtNDBjNy1iZDU0LTg3YzQ1MzEyMmFjMCJ9.ovbpjnG6k9zVsmERZa6LX9VT9wJaXLmm7-yVgwx6C5w"
                result.user = {
                    displayName: "admin",
                    domainId: 198555049289472,
                    domainName: "wooocoo",
                    id: 200092490833664
                }
            } else {
                result.errors = [
                    {
                        "code": 401,
                        "message": "verify error"
                    }
                ]
            }
            response.send(result);
        })
    },
    'POST /api/login/reset-password': (request: Request, response: Response) => {
        bodyParser.json()(request, response, async () => {
            const result: LoginResponse = {}
            const { stateToken, newPassword } = request.body;
            if (stateToken && newPassword) {
                result.accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDAwOTI0OTA4MzM2NjQiLCJleHAiOjE2Nzk5ODU1ODksImlhdCI6MTY3OTk4MTk4OSwianRpIjoidG9rZW46MjAwMDkyNDkwODMzNjY0OjQ4MTIyMzViLTg4YmMtNDY2NS1hMWU5LTcwZDljMDQ0YTViZSJ9.Uu7u-lAi641zdVyLevfEjwbO0og--0G3Ekz0m1HEAlw"
                result.expiresIn = 3600
                result.refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDAwOTI0OTA4MzM2NjQiLCJleHAiOjE2Nzk5ODE5ODksImlhdCI6MTY3OTk4MTk4OSwianRpIjoidG9rZW46MjAwMDkyNDkwODMzNjY0OjBiZDkyN2UyLTczN2YtNDBjNy1iZDU0LTg3YzQ1MzEyMmFjMCJ9.ovbpjnG6k9zVsmERZa6LX9VT9wJaXLmm7-yVgwx6C5w"
                result.user = {
                    displayName: "admin",
                    domainId: 198555049289472,
                    domainName: "wooocoo",
                    id: 200092490833664
                }
            } else {
                result.errors = [
                    {
                        "code": 401,
                        "message": "verify error"
                    }
                ]
            }
            response.send(result);
        })
    },

    'POST /api/logout': (request: Request, response: Response) => {
        response.send({
            success: true,
        });
    },

    'GET /api/captcha': (request: Request, response: Response) => {
        const captcha = svgCaptcha.create({
            inverse: false,
            fontSize: 48,
            noise: 2,
            width: 150,
            height: 50,
            size: 4,
            ignoreChars: "0o1i",
            color: true,
            background: "#cc9966"
        })
        response.cookie('captcha', captcha.text.toLowerCase())
        response.type('svg');
        response.send(captcha.data);
    },
}