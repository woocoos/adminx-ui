import type { Request, Response } from '@ice/app';
import bodyParser from 'body-parser'
import svgCaptcha from 'svg-captcha'

interface LoginResponse {
    accessToken?: string
    expiresIn?: number
    refreshToken?: string
    stateToken?: string
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

const token = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjgwNDkxMDkwLCJpc3MiOiJPbmxpbmUgWUF1dGggQnVpbGRlciIsImV4cCI6MTY4MDQ5ODU5MH0.JRwXrpQR1FFmPtb62dg5DOMl78tR8-H-BRuRCLzBDRkBV7la4JQy9yUctT0ZDielqhIyySebtlDrgG6DCXRCOVeF8joEKstOP_mAtvxtxPX5BAzMZRUYXoehvTZeZuBYNXVGY1TbzGkW-r90u5igIXUpl7eoWL-kVfKMU4jqzYgL1SakdfI6HP78y10xKAmHg3cIk4yd7gNDp9161htxDna36BVbo0NO46zo8M1PjFkwsJD4_HzlQpSRB-lLyNxGvmzA4mgWEgqs9TbMBF1VELr0PH0sgXuQ8q9u4Qbf-Yl8SnA3XcKNEmIVo213hVmrd54tGIIUBlcsqyKQoVPJxg",
    refreshToken = "",
    user = {
        displayName: "admin",
        domainId: 1,
        domainName: "wooocoo",
        id: 1
    };

export default {
    'POST /api/login/auth': (request: Request, response: Response) => {
        bodyParser.json()(request, response, async () => {
            const result: LoginResponse = {}
            const { username, password, captcha } = request.body;
            const cookies = request.headers.cookie?.split('; ')
            if (username === 'woocoo.com' && password === '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92' && cookies?.includes(`captcha=${captcha}`)) {
                result.accessToken = token
                result.stateToken = token
                result.expiresIn = 3600
                result.refreshToken = refreshToken
                result.user = user
            } else {
                result.errors = [
                    {
                        "code": 401,
                        "message": "password not match"
                    }
                ]
            }
            // response.status(500);
            response.send(result);
        })
    },
    // 
    'POST /api/login/verify-facto': (request: Request, response: Response) => {
        bodyParser.json()(request, response, async () => {
            const result: LoginResponse = {}
            const { deviceId, stateToken, otpToken } = request.body;
            if (stateToken === '1234' && otpToken === '1234' && deviceId) {
                result.accessToken = token
                result.stateToken = token
                result.expiresIn = 3600
                result.refreshToken = refreshToken
                result.user = user

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
                result.accessToken = token
                result.stateToken = token
                result.expiresIn = 3600
                result.refreshToken = refreshToken
                result.user = user
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
            fontSize: 48,
            width: 150,
            height: 50,
            size: 4,
            ignoreChars: "0o1i",
            background: "rgba(0, 0, 0, 0.02)"
        })
        response.cookie('captcha', captcha.text.toLowerCase())
        response.type('svg');
        response.send(captcha.data);
    },
}