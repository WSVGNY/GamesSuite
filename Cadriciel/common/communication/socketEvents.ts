export enum SocketEvents {
    Connection = "connection",
    Disconnection = "disconnect",
    DisconnectionAlert = "disconnect-alert",
    RoomCreate = "room-create",
    RoomCreated = "room-created",
    RoomsListQuery = "room-list-query",
    RoomConnect = "room-connect",
    StartGame = "start-game",
    RoomsListsQueryResponse = "room-list-query-response",
    GridQuery = "grid-query",
    PlayerUpdate = "player-update",
    RestartGameWithSameConfig = "restart-game-with-same-config"
}
