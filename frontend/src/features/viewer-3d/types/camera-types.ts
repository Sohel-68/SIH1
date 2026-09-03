export interface CameraBookmark {
  id: string;
  name: string;
  description?: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  isOrtho: boolean;
  thumbnailColor?: string;
}

export interface CameraHistoryState {
  past: Array<{ position: [number, number, number]; target: [number, number, number] }>;
  future: Array<{ position: [number, number, number]; target: [number, number, number] }>;
}
