import { RelationModel } from '../../models/relation.model.js';
import { EntityModel } from '../../models/entity.model.js';
import type { GraphDataDTO } from '@tupynambalucas-cortex-memory/core';

export class GraphRepository {
  async getGraphData(): Promise<GraphDataDTO> {
    const entities = await EntityModel.find().limit(300).exec();
    const nodeIds = new Set(entities.map((e) => e._id.toString()));

    const relations = await RelationModel.find({
      fromId: { $in: Array.from(nodeIds) },
      toId: { $in: Array.from(nodeIds) },
    })
      .limit(500)
      .exec();

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
