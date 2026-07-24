import { RelationModel } from '../../models/relation.model.js';
import { EntityModel } from '../../models/entity.model.js';
import type { GraphDataDTO } from '@tupynambalucas-cortex-memory/core';

export class GraphRepository {
  async getGraphData(): Promise<GraphDataDTO> {
    const entities = await EntityModel.find().limit(50).exec();
    const relations = await RelationModel.find().limit(100).exec();

    const nodes = entities.map((e) => ({
      id: e._id.toString(),
      label: e.name,
      type: e.type,
      workspace: e.metadata.workspace,
    }));

    const edges = relations.map((r) => ({
      id: r._id.toString(),
      source: r.fromId,
      target: r.toId,
      label: r.relationType,
    }));

    return { nodes, edges };
  }
}
