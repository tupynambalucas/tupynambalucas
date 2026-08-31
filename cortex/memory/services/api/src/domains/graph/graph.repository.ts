import { RelationModel } from '../../models/relation.model.js';
import { EntityModel } from '../../models/entity.model.js';
import type { GraphDataDTO } from '@tupynambalucas-cortex/memory-core';

export class GraphRepository {
  async getGraphData(entityId?: string, maxDepth = 2): Promise<GraphDataDTO> {
    if (entityId) {
      return this.getEntityGraph(entityId, maxDepth);
    }

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

  async getEntityGraph(entityId: string, maxDepth: number): Promise<GraphDataDTO> {
    // We can use $graphLookup to fetch connected relations
    // But since RelationModel has fromId and toId as strings, we can query them directly
    // Let's do a simple recursive traversal up to maxDepth (since we want both directions)

    const nodeIds = new Set<string>([entityId]);
    const edges = [];

    let currentLevelNodes = [entityId];
    for (let depth = 0; depth < maxDepth; depth++) {
      if (currentLevelNodes.length === 0) break;

      const rels = await RelationModel.find({
        $or: [{ fromId: { $in: currentLevelNodes } }, { toId: { $in: currentLevelNodes } }],
      }).exec();

      const nextLevelNodes = new Set<string>();

      for (const r of rels) {
        edges.push(r);
        if (!nodeIds.has(r.fromId)) {
          nodeIds.add(r.fromId);
          nextLevelNodes.add(r.fromId);
        }
        if (!nodeIds.has(r.toId)) {
          nodeIds.add(r.toId);
          nextLevelNodes.add(r.toId);
        }
      }

      currentLevelNodes = Array.from(nextLevelNodes);
    }

    const entities = await EntityModel.find({ _id: { $in: Array.from(nodeIds) } }).exec();

    const nodes = entities.map((e) => ({
      id: e._id.toString(),
      label: e.name,
      type: e.type,
      workspace: e.metadata.workspace,
      // For detailed resolution, we can include content snippet
      content: e.content.slice(0, 500),
    }));

    // Deduplicate edges
    const uniqueEdgesMap = new Map();
    for (const r of edges) {
      uniqueEdgesMap.set(r._id.toString(), {
        id: r._id.toString(),
        source: r.fromId,
        target: r.toId,
        label: r.relationType,
      });
    }

    return { nodes, edges: Array.from(uniqueEdgesMap.values()) };
  }
}
