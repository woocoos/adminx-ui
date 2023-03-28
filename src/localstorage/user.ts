import localStorage from '@/pkg/localStorage'
import { LoginRes } from '@/services/user'

function setLoginRes(val: LoginRes): Promise<LoginRes> {
    return localStorage.setItem('loginRes', val)
}

function getLoginRes<LoginRes>(): Promise<LoginRes | null> {
    return localStorage.getItem('loginRes')
}

export { setLoginRes, getLoginRes }