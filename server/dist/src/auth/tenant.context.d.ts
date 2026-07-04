import { AsyncLocalStorage } from 'async_hooks';
export interface TenantContext {
    collegeId: string | null;
    role: string | null;
}
export declare const tenantStorage: AsyncLocalStorage<TenantContext>;
