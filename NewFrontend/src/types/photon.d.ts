declare module "photon-realtime" {
  export const ConnectionProtocol: any;
  export class Client {
    constructor(
      protocol: any,
      address: string,
      appId: string,
      appVersion: string
    );

    onStateChange: (state: number) => void;
    onCreateRoom: () => void;
    onCreateRoomFailed: (error: any) => void;
    onJoinRoom: () => void;
    onJoinRoomFailed: (error: any) => void;

    connectToRegionMaster(region: string): void;
    createRoom(name: string): void;
    joinRoom(name: string): void;
    disconnect(): void;
  }
}
declare module "photon-realtime" {
  export const ConnectionProtocol: any;
  export class Client {
    constructor(
      protocol: any,
      address: string,
      appId: string,
      appVersion: string
    );

    onStateChange: (state: number) => void;
    onCreateRoom: () => void;
    onCreateRoomFailed: (error: any) => void;
    onJoinRoom: () => void;
    onJoinRoomFailed: (error: any) => void;

    connectToRegionMaster(region: string): void;
    createRoom(name: string): void;
    joinRoom(name: string): void;
    disconnect(): void;
  }
}
