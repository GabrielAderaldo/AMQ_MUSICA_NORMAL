export interface ICacheDatabaseClient {
    initializeRoomState(roomId: string, initialState: Record<string, string>): Promise<void>
    updateRoomState(roomId: string, updatedState: Record<string, string>): Promise<void>
    getRoomState(roomId: string): Promise<Record<string, string>>
    deleteRoomState(roomId: string): Promise<void>
}