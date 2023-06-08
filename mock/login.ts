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
        domains: Array<Domain>
    },
    errors?: {
        code: number
        message: string
    }[]
}
interface Domain {
    domainName: string
    id: string | number
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzIwMTM1ODExLCJpYXQiOjE2ODQxMzU4MTEsImp0aSI6InRva2VuOjE6YTU0YjdiNzMtYjFlNS00YmE0LWFlZDktMjMwMmVhMDgwOTUwIn0.Roi6QokXVLSOUGziglXPP8rBFwhkfEhf7mRSXEL-Wu0",
    refreshToken = "",
    user = {
        displayName: "admin",
        domainId: 1,
        domains: [{
            domainName: "wooocoo",
            id: 1
        }]
    };

export default {
    'POST /api/login/auth': (request: Request, response: Response) => {
        bodyParser.json()(request, response, async () => {
            const result: LoginResponse = {}
            const { username, password, captcha } = request.body;
            const cookies = request.headers.cookie?.split('; ')
            if (username === 'admin' && password === '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92' && cookies?.includes(`captcha=${captcha}`)) {
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
            // response.send(result);
            response.status(500)
            response.send({a:1})
        })
    },
    //
    'POST /api/login/verify-factor': (request: Request, response: Response) => {
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
            size: 1,
            ignoreChars: "0o1i",
            background: "rgba(0, 0, 0, 0.02)"
        })
        response.cookie('captcha', captcha.text.toLowerCase())
        response.send({
            captchaId:captcha.text.toLowerCase(),
            captchaImage:"data:image/svg+xml;utf8,"+encodeURIComponent(captcha.data)
        });
    },
}
