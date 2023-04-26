import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  //ts getter
  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }
    return this._client;
  }

  // while accessing we just need to do natsWrapper.client

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    //so that we can await the connection'
    return new Promise<void>((resolve, reject) => {
      //this.client refers to the getter
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });

      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
