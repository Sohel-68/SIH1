export type RealtimeEventType =
  | "GNSS_TELEMETRY"
  | "NEW_NOTIFICATION"
  | "COLLABORATION_CURSOR"
  | "SLA_BREACH_ALERT";

export interface GNSSTelemetryPayload {
  roverId: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  satellites: number;
  hdop: number;
  fixStatus: "RTK_FIX" | "DGPS" | "AUTONOMOUS";
}

type EventCallback = (payload: unknown) => void;

class RealtimeEventBus {
  private subscribers: Map<RealtimeEventType, Set<EventCallback>> = new Map();

  /**
   * Subscribe to a real-time event channel
   */
  subscribe(event: RealtimeEventType, callback: EventCallback): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event)!.add(callback);

    // Return unsubscription function
    return () => {
      this.subscribers.get(event)?.delete(callback);
    };
  }

  /**
   * Publish payload to all active subscribers
   */
  publish(event: RealtimeEventType, payload: unknown): void {
    const channelSubscribers = this.subscribers.get(event);
    if (channelSubscribers) {
      channelSubscribers.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in realtime subscriber callback for ${event}:`, err);
        }
      });
    }
  }
}

export const realtimeBus = new RealtimeEventBus();
