export type ModelFramework =
  | "ONNX"
  | "TENSORFLOW_SERVING"
  | "PYTORCH_TORCHSCRIPT"
  | "REST_MICROSERVICE";

export type ModelTaskType =
  | "OBJECT_DETECTION"
  | "INSTANCE_SEGMENTATION"
  | "OCR_RECOGNITION"
  | "CHANGE_DETECTION"
  | "POINT_CLOUD_SEGMENTATION";

export interface ModelRegistryEntry {
  modelId: string;
  name: string;
  task: ModelTaskType;
  framework: ModelFramework;
  version: string;
  inputResolution: string; // e.g. "1024x1024x3"
  latencyMs: number;
  memoryMb: number;
  accuracyMetric: string; // e.g. "mAP@50: 92.4%"
  status: "ONLINE" | "STANDBY" | "RETRAINING";
  lastTrainedDate: string;
}

export interface IModelRuntimeAdapter {
  framework: ModelFramework;
  loadModel: (modelUri: string) => Promise<boolean>;
  runInference: (tensorPayload: unknown) => Promise<unknown>;
}
