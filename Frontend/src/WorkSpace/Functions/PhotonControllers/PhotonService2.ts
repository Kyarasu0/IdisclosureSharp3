import * as Photon from "photon-realtime";

// Photon の型定義が壊れているか不完全なため、any にキャストしてアクセス可能にする
const P = Photon as any;

const APP_ID = import.meta.env.VITE_PHOTON_APP_ID as string;

class PhotonService {
  private client: any;
  private currentRoom: any;

  constructor() {
    // 修正: Photon.LoadBalancing.LoadBalancingClient を使用
    // コンストラクタ引数は (プロトコル, AppID, バージョン)
    this.client = new P.LoadBalancing.LoadBalancingClient(
      P.ConnectionProtocol.Wss,
      APP_ID,
      "1.0"
    );
  }

  connect() {
    return new Promise<void>((resolve) => {
      this.client.onStateChange = (state: number) => {
        // 状態: JoinedLobby (通常は 21 ですが、定数で比較するのが安全)
        if (state === P.LoadBalancing.LoadBalancingClient.State.JoinedLobby) {
          console.log("Joined Lobby");
          resolve();
        }
      };

      // サーバーへの接続開始
      this.client.connectToRegionMaster("jp");
    });
  }

  createRoom(roomName: string) {
    return new Promise<void>((resolve, reject) => {
      this.client.onCreateRoom = () => resolve();
      // エラーハンドリング（簡易版）
      this.client.onOperationResponse = (errorCode: number, errorMsg: string) => {
        if (errorCode !== 0) {
          console.error("Error:", errorMsg);
          reject(errorMsg);
        }
      };
      this.client.createRoom(roomName);
    });
  }

  joinRoom(roomName: string) {
    return new Promise<void>((resolve) => {
      this.client.onJoinRoom = () => resolve();
      this.client.joinRoom(roomName);
    });
  }

  getParticipants() {
    if (!this.currentRoom) return [];
    return Object.values(this.currentRoom.players).map((p: any) => ({
      name: p.name || `Player${p.actorNumber}`,
      isMaster: p.isMasterClient,
      isMe: p.isLocal,
    }));
  }

  disconnect() {
    if (this.client.isInLobby()) {
      this.client.disconnect();
    }
  }
}

export const photonService = new PhotonService();