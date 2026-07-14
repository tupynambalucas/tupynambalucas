export interface PipelineTarget {
  name: string;
  templatePath: string; // path to template file (relative to workspaceRoot)
  outputPath: string; // path to write the generated file locally (relative to workspaceRoot)
  ciPath: string; // repository target path in CI/CD environment
  ciBranches: string[]; // branches to publish to in CI/CD
}

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  targets: PipelineTarget[];
}
