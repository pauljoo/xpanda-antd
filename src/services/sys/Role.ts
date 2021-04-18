import request from '@/utils/request';
import type { RoleItem, RoleParam } from '@/models/sys/Role';

export async function createRole(params?: RoleParam) {
    return request('/api/sys/role', {
        params,
    });
}

export async function readRole(params?: RoleParam) {
    return request('/api/sys/role', {
        params,
    });
}

export async function updateRole(params?: RoleParam) {
    return request('/api/sys/role', {
        params,
    });
}

export async function deleteRole(params?: RoleParam) {
    return request('/api/sys/role', {
        params,
    });
}