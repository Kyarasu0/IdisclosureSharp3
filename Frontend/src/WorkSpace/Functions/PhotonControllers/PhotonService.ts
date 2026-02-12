// グローバルスコープから Photon を取得
const Photon = (window as any).Photon;

const APP_ID = import.meta.env.VITE_PHOTON_APP_ID as string;
const APP_VERSION = "1.0";

export type Participant = {
  name: string;
  isMaster: boolean;
  isMe: boolean;
  actorNr: number;
};

/**
 * PhotonService Class
 * Photon公式ブログの方式に基づいて実装
 * https://tech.kentem.jp/entry/2026/01/30/090000
 */
export class PhotonService extends Photon.LoadBalancing.LoadBalancingClient {
  constructor() {
    // 親クラスのコンストラクタ呼び出し (WSSプロトコル, APP_ID, APP_VERSION)
    super(Photon.ConnectionProtocol.Wss, APP_ID, APP_VERSION);
    
    // Photon SDKはスクリプトタグで直接ロードされているため、
    // ブラウザのネイティブWebSocketが自動的に使用されます
  }

  /**
   * Photon Cloudへ接続 (Region: JP)
   */
  public connect(): void {
    console.log("Connecting to Photon...");
    
    this.onStateChange = (state: number) => {
      // 状態コード
      const PhotonState = {
        Uninitialized: 0,
        ConnectingToNameServer: 1,
        ConnectedToNameServer: 2,
        ConnectingToMasterserver: 3,
        ConnectedToMaster: 4,
        JoinedLobby: 5,
        ConnectingToGameserver: 6,
        ConnectedToGameserver: 7,
        Joined: 8,
        Disconnected: 10,
      };
      
      switch (state) {
        case PhotonState.ConnectingToNameServer:
          console.log("ネームサーバー接続中...");
          break;
        case PhotonState.ConnectedToNameServer:
          console.log("ネームサーバー接続完了");
          break;
        case PhotonState.ConnectingToMasterserver:
          console.log("マスターサーバー接続中...");
          break;
        case PhotonState.ConnectedToMaster:
          console.log("マスターサーバー接続完了");
          break;
        case PhotonState.JoinedLobby:
          console.log("ロビー接続完了");
          break;
        case PhotonState.ConnectingToGameserver:
          console.log("ゲームサーバー接続中...");
          break;
        case PhotonState.ConnectedToGameserver:
          console.log("ゲームサーバー接続完了");
          break;
        case PhotonState.Joined:
          console.log("ルーム入室完了");
          break;
        case PhotonState.Disconnected:
          console.log("切断");
          break;
      }
    };

    this.onError = (errorCode: number, errorMsg: string) => {
      console.error(`Photon Error [${errorCode}]: ${errorMsg}`);
    };

    // 日本リージョンへ接続開始
    this.connectToRegionMaster("jp");
  }

  /**
   * ルーム作成
   */
  public createRoom(roomName: string, options?: any): void {
    super.createRoom(roomName, {
      maxPlayers: options?.maxPlayers || 4,
      ...options,
    });
  }

  /**
   * ルーム参加
   */
  public joinRoomByName(roomName: string): void {
    this.joinRoom(roomName);
  }

  /**
   * 現在の参加者リストを取得
   */
  public getParticipants(): Participant[] {
    const room = this.myRoom();
    if (!room || !room.actors) return [];

    const actors = room.actors;
    const localActor = this.myActor();

    return Object.values(actors).map((actor: any) => ({
      name: actor.name || `User ${actor.actorNr}`,
      isMaster: actor.isMasterClient,
      isMe: actor.actorNr === localActor.actorNr,
      actorNr: actor.actorNr
    }));
  }

  /**
   * 切断処理
   */
  public disconnectClient(): void {
    if (this.isConnected()) {
      this.disconnect();
    }
  }
}

// シングルトンとしてエクスポート
export const photonService = new PhotonService();