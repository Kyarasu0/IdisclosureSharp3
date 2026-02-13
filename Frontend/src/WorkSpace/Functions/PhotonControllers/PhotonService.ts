// PhotonService.ts
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
 * 実際のログ（Numeric: X）に基づいた状態定数
 */
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
  public isReady = false;
  private retryTimeout: any = null;
  private isProcessingRoom = false;

  constructor() {
    super(Photon.ConnectionProtocol.Wss, APP_ID, APP_VERSION);

    this.onError = (errorCode: number, errorMsg: string) => {
      console.error("❌ Photon Error:", errorCode, errorMsg);
      this.isReady = false;

      // 🔴 修正ポイント: 名前を localStorage から取得して設定する
      this.applyLocalIdentity();

      // 2004 (Timeout) や 2003 (Server Closed) の場合、再起動が必要
      if (errorCode === 2004 || errorCode === 2003) {
        console.warn("⚠️ サーバーから切断されました。再接続を試みます。");
      }
      this.scheduleReconnect();
    };

   this.onStateChange = (state: number) => {
      console.log("📡 State Change (Numeric):", state);
      
      if (state === State.Joined) {
        this.isReady = true;

        // 🔴 生存確認と名前の設定を確実に行う
        const stored = localStorage.getItem("registrationData");
        if (stored) {
          const userData = JSON.parse(stored);
          console.log("👤 Identity Applied:", userData.userId);
          this.myActor().setName(userData.userId); // 🔴 ここで Kyarasu が設定される
          this.myActor().setCustomProperties({ score: userData.score });
        }
        
        console.log("✅ Joined room and identity applied.");
      } else if (state <= 0) {
        this.isReady = false;
      }
    };
  }

  /**
   * 現在の状態を数値で取得する安全なヘルパー
   * (this.state が関数の場合とプロパティの場合の両方に対応)
   */
  private get currentState(): number {
    const s = (this as any).state;
    return typeof s === 'function' ? (this as any).state() : s;
  }

  /**
   * MasterServer または Lobby に接続されているか確認
   */
  public isConnectedToMaster(): boolean {
    const s = this.currentState;
    // 4: ConnectedToMaster, 5: JoinedLobby, 8: Joined
    return s === State.ConnectedToMaster || s === State.JoinedLobby || s === State.Joined || this.isInLobby();
  }

  /**
   * Region に接続
   */
  public connectToRegion(region: string = "jp"): Promise<void> {
    return new Promise((resolve, reject) => {
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

      const checkInterval = setInterval(() => {
        if (this.isConnectedToMaster() || this.currentState >= State.ConnectingToGameserver) {
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
          resolve();
        }
      }, 200);

      const timeoutId = setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error(`MasterServer connection timeout (Current State: ${this.currentState})`));
      }, 20000);
    });
  }

  /**
   * ルーム作成
   */
  public async createRoom(roomName: string, options?: any) {
    await this.connectToRegion();

    return new Promise<void>((resolve, reject) => {
      try {
        console.log(`🛠 Creating room: ${roomName}`);
        super.createRoom(roomName, {
          maxPlayers: options?.maxPlayers || 8,
          isVisible: true,
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

  /**
   * ルーム参加
   */
  public async joinRoom(roomName: string) {
    await this.connectToRegion();

    return new Promise<void>((resolve, reject) => {
      try {
        console.log(`🚪 Joining room: ${roomName}`);
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

  /**
   * 再接続
   */
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

  /**
   * 参加者リスト取得
   */
  // getParticipants も少し修正（名前が同期されるまでのフォールバック）
  /**
   * 修正: getParticipants
   * room.actors が空の場合でも、自分自身 (myActor) は必ず含めて返すようにします。
   */
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

  /**
   * 接続から入室までを一括で行う（ロック付き）
   */
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

  /**
   * ゲッター名を room に変更（内部変数 currentRoom との衝突を回避）
   */
  public get room() {
    return this.myRoom();
  }

  /**
   * 🔴 追加: 自分の identity (名前) をサーバーに反映させる
   */
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