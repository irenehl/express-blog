export class BaseRepository<TEntity> {
    exclude<KExclude extends keyof TEntity>(
        entity: TEntity,
        keys: KExclude[]
    ): Omit<TEntity, KExclude> {
        for (const key of keys) {
            delete entity[key]
        }

        return entity
    }
}
