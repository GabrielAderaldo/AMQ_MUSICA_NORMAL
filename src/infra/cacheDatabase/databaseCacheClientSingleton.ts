export class DatabaseCacheClientSingleton<T> {
    private static instance: any = null; // Armazena a instância de qualquer tipo

    private constructor() {}

    public static getInstance<T>(): T {
        if (!DatabaseCacheClientSingleton.instance) {
            throw new Error("A instância do Singleton ainda não foi definida. Use setInstance primeiro.");
        }
        return DatabaseCacheClientSingleton.instance as T;
    }

    public static setInstance<T>(instance: T): void {
        if (!instance) {
            throw new Error("A instância fornecida é inválida.");
        }
        DatabaseCacheClientSingleton.instance = instance;
    }
}