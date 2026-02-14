// PhotonService.ts
const Photon = (window as any).Photon;

const APP_ID = import.meta.env.VITE_PHOTON_APP_ID as string;
const APP_VERSION = "1.0";

// 構造体のような型定義
export type Participant = {
  name: string;
  isMaster: boolean;
  isMe: boolean;
  actorNr: number;
};

// ログの番号の定義
const State = {
  Error: -1,
  Uninitialized: 0,
  ConnectingToNameServer: 1,
  ConnectedToNameServer: 2,
  ConnectingToMasterserver: 3,
  ConnectedToMaster: 4,
  JoinedLobby: 5,
  ConnectingToGameserver: 6,
  ConnectedToGameserver: 7,
  Joined: 8,
};

export class PhotonService extends Photon.LoadBalancing.LoadBalancingClient {
  // Photonの構造: 
  // 1. NameServer: リージョン設定やAppIDからそのMasterServerへ行けばいいかを教えるDNS的なサーバー
  // 2. MasterServer: ルーム作成やルーム参加などのルーム操作ができるサーバー
  // 3. Lobby: ルーム一覧が見れるMasterServer上の空間
  // 4. GameServer: 実際に通信するサーバー
  // 5. Room: GameServer内で実際にルームに入る: 

  // GameServer内のルームへの接続完了フラグ
  public isReady = false;
  // 再接続を待っていることを表すタイマーを格納しあるかないかを見る
  private retryTimeout: any = null;
  // ルーム操作中フラグ
  private isProcessingRoom = false;

  // =============================
  // コンストラクター
  // =============================
  constructor() {
    // 親クラスのコンストラクタを呼び出し、Photonに接続する準備を整える
    super(Photon.ConnectionProtocol.Wss, APP_ID, APP_VERSION);

    // 接続エラーが発生した場合
    this.onError = (errorCode: number, errorMsg: string) => {
      console.error("❌ Photon Error:", errorCode, errorMsg);
      // GameServerへの接続失敗
      this.isReady = false;

      // 名前を localStorage から取得して設定する
      this.applyLocalIdentity();

      // 2004 (Timeout) や 2003 (Server Closed) の場合、再起動が必要
      if (errorCode === 2004 || errorCode === 2003) {
        console.warn("⚠️ サーバーから切断されました。再接続を試みます。");
      }

      // 再接続処理
      this.scheduleReconnect();
    };

    // 状態変化で呼ばれる関数
    this.onStateChange = (state: number) => {
      // 状態表示
      console.log("📡 State Change (Numeric):", state);
      
      // GameServer内のルームへの接続を完了した場合
      if (state === State.Joined) {
        // GameServer内のルームへの接続完了フラグ
        this.isReady = true;

        // 個人情報の設定
        const stored = localStorage.getItem("registrationData");
        if (stored) {
          const userData = JSON.parse(stored);
          console.log("👤 Identity Applied:", userData.userId);
          // 設定処理
          this.myActor().setName(userData.userId);
          this.myActor().setCustomProperties({ score: userData.score });
        }
        
        console.log("✅ Joined room and identity applied.");
      } else if (state <= 0) {
        // GameServer内のルームへの接続完了フラグを取り下げ
        this.isReady = false;
      }
    };
  }

  // ========================================
  // stateを取れるプロパティのように扱える関数
  // ========================================
  private get currentState(): number {
    // sにthis.stateを取る
    const s = (this as any).state;
    // sが関数なら実行して返し、そうでないならそのまま返す
    return typeof s === 'function' ? (this as any).state() : s;
  }

  // ========================================
  // MasterServerに接続済みかを検査する関数
  // ========================================
  public isConnectedToMaster(): boolean {
    const s = this.currentState;
    // 4: ConnectedToMaster, 5: JoinedLobby, 8: Joined
    return s === State.ConnectedToMaster || s === State.JoinedLobby || s === State.Joined || this.isInLobby();
  }

  // ========================================
  // Regionに接続する関数
  // ========================================
  public connectToRegion(region: string = "jp"): Promise<void> {
    return new Promise((resolve, reject) => {
      // 現在の状態を確認する
      const s = this.currentState;

      // すでに接続済み、または接続の後半プロセス（GameServer移行中など）なら成功とみなす
      if (this.isConnectedToMaster() || s >= State.ConnectingToGameserver) {
        return resolve();
      }

      // 接続プロセスが開始されていない場合のみ実行
      if (s === State.Uninitialized || s === State.Error) {
        console.log(`🌐 Connecting to ${region}...`);
        this.connectToRegionMaster(region);
      } else {
        console.log(`⏳ Connection already in progress... Current State: ${s}`);
      }

      // 200ms秒ごとに監視
      const checkInterval = setInterval(() => {
        // 接続完了した場合
        if (this.isConnectedToMaster() || this.currentState >= State.ConnectingToGameserver) {
          // 監視を終了
          clearInterval(checkInterval);
          // 接続待ちタイマーを除去
          clearTimeout(timeoutId);
          resolve();
        }
      }, 200);

      // 20秒待ったら監視を削除してrejectを出す
      const timeoutId = setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error(`MasterServer connection timeout (Current State: ${this.currentState})`));
      }, 20000);
    });
  }

  // ========================================
  // ルームを作成
  // ========================================
  public async createRoom(roomName: string, options?: any) {
    await this.connectToRegion();

    return new Promise<void>((resolve, reject) => {
      try {
        console.log(`🛠 Creating room: ${roomName}`);
        // 実際にルームを作る
        super.createRoom(roomName, {
          maxPlayers: options?.maxPlayers || 8,
          isVisible: false,
          isOpen: true,
          ...options
        });

        const checkInterval = setInterval(() => {
          // 状態 8 (Joined) になるのを待つ
          if (this.currentState === State.Joined) {
            console.log("✅ Room creation confirmed.");
            clearInterval(checkInterval);
            clearTimeout(timeoutId);
            resolve();
          }
        }, 200);

        const timeoutId = setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error(`Room creation timeout (Current State: ${this.currentState})`));
        }, 20000);
      } catch (err) {
        reject(err);
      }
    });
  }

  // ========================================
  // ルームに参加
  // ========================================
  public async joinRoom(roomName: string) {
    await this.connectToRegion();

    return new Promise<void>((resolve, reject) => {
      try {
        console.log(`🚪 Joining room: ${roomName}`);
        // 実際にルームに参加
        super.joinRoom(roomName);

        const checkInterval = setInterval(() => {
          if (this.currentState === State.Joined) {
            console.log("✅ Room join confirmed.");
            clearInterval(checkInterval);
            clearTimeout(timeoutId);
            resolve();
          }
        }, 200);

        const timeoutId = setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error(`Room join timeout (Current State: ${this.currentState})`));
        }, 20000);
      } catch (err) {
        reject(err);
      }
    });
  }

  // ========================================
  // 再接続
  // ========================================
  private scheduleReconnect(delay: number = 3000) {
    if (this.retryTimeout) return;
    this.retryTimeout = setTimeout(() => {
      this.retryTimeout = null;
      const s = this.currentState;
      if (s === State.Error || s === State.Uninitialized) {
        console.log("🔄 Reconnecting...");
        this.connectToRegion();
      }
    }, delay);
  }

  // ========================================
  // 参加者リストの作成
  // ========================================
  public getParticipants(): Participant[] {
    const room = this.myRoom();
    // ルームに入っていない場合は空
    if (!room) return [];

    // Photonの内部 actors オブジェクトを配列に変換
    // 稀に actors が空になる瞬間があるため、myActor() をフォールバックに使用
    const actors = room.actors || {};
    const actorValues = Object.values(actors);

    // もし actors が空なら自分だけを配列にする
    const actorsList = actorValues.length > 0 ? actorValues : [this.myActor()];

    return actorsList.map((actor: any) => ({
      // actor.name が空の場合は localStorage から再取得を試みる
      name: actor.name || (actor.actorNr === this.myActor().actorNr ? this.getLocalName() : "Connecting..."),
      isMaster: actor.isMasterClient || actor.actorNr === 1, // 1番目の人は通常マスター
      isMe: actor.actorNr === this.myActor().actorNr,
      actorNr: actor.actorNr,
    }));
  }

  public waitForMasterConnection(): Promise<void> {
    return this.connectToRegion();
  }

  // ========================================
  // 接続から入室までを行う関数
  // ========================================
  public async connectAndJoinRoom(roomName: string, maxPlayers: number = 8) {
    // すでに処理中なら、その処理が終わるまで待つか、無視する
    if (this.isProcessingRoom) {
      console.log("⏳ 別のルーム操作が進行中のため、待機します...");
      return;
    }

    try {
      this.isProcessingRoom = true; // 🔴 ロック開始

      // 1. 接続を待機
      await this.connectToRegion("jp");

      // 2. すでにその部屋にいる場合は終了
      if (this.currentState === State.Joined && this.myRoom()?.name === roomName) {
        console.log("✅ Already in the target room.");
        return;
      }

      // 3. 入室を試みる
      console.log(`🚪 Attempting to join room: ${roomName}`);
      try {
        await this.joinRoom(roomName);
      } catch (err: any) {
        // 部屋がない(32758)場合のみ作成へ
        if (err.message.includes("32758") || err.code === 32758) {
          console.log("部屋が存在しないため、新規作成します...");
          await this.createRoom(roomName, { maxPlayers });
        } else {
          throw err;
        }
      }
    } finally {
      this.isProcessingRoom = false; // 🔴 成功しても失敗してもロック解除
    }
  }

  // ========================================
  // room情報の取得
  // ========================================
  public get room() {
    return this.myRoom();
  }

  // ============================================
  // 自分の identity (名前) をサーバーに反映させる
  // ============================================
  private applyLocalIdentity() {
    const stored = localStorage.getItem("registrationData");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.userId) {
          console.log("👤 Setting name from storage:", data.userId);
          this.myActor().setName(data.userId);
          // ついでにスコアもカスタムプロパティに入れておくと同期できます
          this.myActor().setCustomProperties({ score: data.score });
          return;
        }
      } catch (e) {
        console.error("Storage parse error", e);
      }
    }
    // バックアップ用（万が一ストレージが空の場合）
    this.myActor().setName("Unknown_Node");
  }

  // localStorage から名前を取るヘルパー
  private getLocalName(): string {
    const stored = localStorage.getItem("registrationData");
    if (stored) {
      return JSON.parse(stored).userId || "Unknown";
    }
    return "Unknown";
  }
}

export const photonService = new PhotonService();