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

export class PhotonService extends Photon.LoadBalancing.LoadBalancingClient {
  // ================================
  // コンストラクタ
  // ================================
  constructor() {
    // 親クラスのコンストラクタ呼び出し
    super(Photon.ConnectionProtocol.Wss, APP_ID, APP_VERSION);
    // エラー処理
    this.onError = (code: number, msg: string) => {
      console.error("Photon Error:", code, msg);
      alert("Error");
    };
  }

  // ================================
  // NameServerとMasterServerに接続
  // ================================
  public connect(region = "jp"): Promise<void> {
    return new Promise((resolve, reject) => {
      const State = Photon.LoadBalancing.LoadBalancingClient.State;
      const s = typeof this.state === "function" ? this.state() : this.state;

      this.onStateChange = (state: number) => {

        if (state === State.ConnectedToMaster) {
          resolve();  // 接続成功
        } else if (state === State.Disconnected) {
          reject(new Error("MasterServer への接続失敗"));
        }
      };

      if (s === State.ConnectedToMaster) {
          resolve(); // すでに接続済みなら何もしない
      } else if (s === State.Uninitialized) {
          this.connectToRegionMaster(region); // 未接続なら接続
      } else {
          // それ以外の状態は接続中なので待つ
          console.log("接続中の状態:", s);
      }
    });
  }


  // =======================================
  // MasterServerにつながっているかを確認する
  // =======================================
  public isConnectedToMaster(): boolean {
    const s = typeof this.state === "function" ? this.state() : this.state;
    return s === Photon.LoadBalancing.LoadBalancingClient.State.ConnectedToMaster;
  }

  // =======================================
  // 接続状況を確認する
  // =======================================
  public getCurrentStatus(): string {
    const s = typeof this.state === "function" ? this.state() : this.state;
    const State = Photon.LoadBalancing.LoadBalancingClient.State;

    switch (s) {
      case State.Uninitialized: return "未初期化";
      case State.ConnectingToNameServer: return "ネームサーバー接続中";
      case State.ConnectedToNameServer: return "ネームサーバー接続完了";
      case State.ConnectingToMasterserver: return "マスターサーバー接続中";
      case State.ConnectedToMaster: return "マスターサーバー接続完了";
      case State.JoinedLobby: return "ロビー接続完了";
      case State.ConnectingToGameserver: return "ゲームサーバー接続中";
      case State.ConnectedToGameserver: return "ゲームサーバー接続完了";
      case State.Joined: return "ルーム入室完了";
      case State.Disconnected: return "切断";
      default: return "不明";
    }
  }

  // =======================================
  // ルーム作成
  // =======================================
  public createRoom(roomName: string, options?: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.onJoinRoom = () => resolve();
      this.onJoinRoomFailed = (code: number) => {
        if (code === 32765) reject(new Error("すでに同じ名前のルームが存在します"));
        else reject(new Error(`ルーム作成失敗: ${code}`));
      };
      super.createRoom(roomName, {
        maxPlayers: options?.maxPlayers || 8,
        isVisible: false,
        isOpen: true,
        ...options
      });
    });
  }

  // =======================================
  // ルーム参加
  // =======================================
  public joinRoom(roomName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.onJoinRoom = () => resolve();
      this.onJoinRoomFailed = (code: number) => {
        if (code === 32758) reject(new Error("ルームが存在しません"));
        else reject(new Error(`ルーム参加失敗: ${code}`));
      };
      super.joinRoom(roomName);
    });
  }

  // =======================================
  // 参加者一覧取得
  // =======================================
  public getParticipants() {
    // ルーム情報を取得
    const room = this.myRoom();
    // ルーム名がなければ終了
    if (!room) return [];
    // ルーム名があれば返す
    return Object.values(room.actors || {}).map((actor: any) => ({
      name: actor.name,
      isMaster: actor.isMasterClient,
      isMe: actor.actorNr === this.myActor().actorNr,
      actorNr: actor.actorNr,
    }));
  }

  // =======================================
  // ルーム名取得
  // =======================================
 public getRoomName(): string | null {
    const room = this.myRoom();
    return room ? room.name : null;
  }
}
