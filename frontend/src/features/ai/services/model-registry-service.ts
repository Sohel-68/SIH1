import type { ModelRegistryEntry } from "../types/model-types";

export const REGISTERED_AI_MODELS: ModelRegistryEntry[] = [
  {
    modelId: "mod-encroach-01",
    name: "GeoStrata Encroachment-YOLOv8x",
    task: "INSTANCE_SEGMENTATION",
    framework: "ONNX",
    version: "v3.2.0-IN",
    inputResolution: "1024x1024x3",
    latencyMs: 28,
    memoryMb: 480,
    accuracyMetric: "mAP@50: 92.8%",
    status: "ONLINE",
    lastTrainedDate: "15-Aug-2026",
  },
  {
    modelId: "mod-change-02",
    name: "Satellite-ChangeFormer-BiTemporal",
    task: "CHANGE_DETECTION",
    framework: "PYTORCH_TORCHSCRIPT",
    version: "v2.1.4",
    inputResolution: "2048x2048x6",
    latencyMs: 64,
    memoryMb: 850,
    accuracyMetric: "F1 Score: 94.1%",
    status: "ONLINE",
    lastTrainedDate: "18-Aug-2026",
  },
  {
    modelId: "mod-ocr-03",
    name: "Bharat-Deed-OCR-Multilingual",
    task: "OCR_RECOGNITION",
    framework: "TENSORFLOW_SERVING",
    version: "v4.0.1",
    inputResolution: "1024x1024x1",
    latencyMs: 18,
    memoryMb: 320,
    accuracyMetric: "Character Acc: 98.4%",
    status: "ONLINE",
    lastTrainedDate: "22-Aug-2026",
  },
  {
    modelId: "mod-3d-damage-04",
    name: "Strata-3D-Structural-PointNet++",
    task: "POINT_CLOUD_SEGMENTATION",
    framework: "ONNX",
    version: "v1.8.0",
    inputResolution: "65536 Points",
    latencyMs: 42,
    memoryMb: 620,
    accuracyMetric: "IoU: 89.6%",
    status: "ONLINE",
    lastTrainedDate: "25-Aug-2026",
  },
];

export const modelRegistryService = {
  getModels(): ModelRegistryEntry[] {
    return REGISTERED_AI_MODELS;
  },

  getModelStatus(modelId: string): ModelRegistryEntry | undefined {
    return REGISTERED_AI_MODELS.find((m) => m.modelId === modelId);
  },
};
