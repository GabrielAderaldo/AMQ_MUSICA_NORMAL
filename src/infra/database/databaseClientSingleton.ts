export class DatabaseClientSingleton<T> {
    private static instance: any = null; // Armazena a instância de qualquer tipo

    private constructor() {}

    public static getInstance<T>(): T {
        if (!DatabaseClientSingleton.instance) {
            throw new Error("A instância do Singleton ainda não foi definida. Use setInstance primeiro.");
        }
        return DatabaseClientSingleton.instance as T;
    }

    public static setInstance<T>(instance: T): void {
        if (!instance) {
            throw new Error("A instância fornecida é inválida.");
        }
        DatabaseClientSingleton.instance = instance;
    }
}