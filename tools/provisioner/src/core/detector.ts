export interface SystemEnvironmentStatus {
  platform: NodeJS.Platform;
  virtualizationSupported: boolean;
  podmanInstalled: boolean;
}

export class EnvironmentDetector {
  public static checkStatus(): Promise<SystemEnvironmentStatus> {
    return Promise.resolve({
      platform: process.platform,
      virtualizationSupported: true,
      podmanInstalled: false,
    });
  }
}

export default EnvironmentDetector;
