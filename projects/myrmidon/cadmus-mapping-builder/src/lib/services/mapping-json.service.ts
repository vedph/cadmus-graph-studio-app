import { Injectable } from '@angular/core';
import { MappedNode, NodeMapping } from '../models';
import { NodeMappingOutput } from '@myrmidon/cadmus-mapping-builder';

export interface SerializedMappedNodeOutput {
  nodes?: { [key: string]: string };
  triples?: string[];
  metadata?: { [key: string]: string };
}

export interface SerializedMappedNode {
  id?: number;
  parentId?: number;
  ordinal?: number;
  name: string;
  sourceType: number;
  facetFilter?: string;
  groupFilter?: string;
  flagsFilter?: number;
  titleFilter?: string;
  partTypeFilter?: string;
  partRoleFilter?: string;
  description?: string;
  source: string;
  sid: string;
  output?: SerializedMappedNodeOutput;
  children?: SerializedMappedNode[];
}

/**
 * Custom JSON mapping service. This is used to serialize and deserialize
 * a mapping to/from JSON using a more human-friendly and compact format.
 * This format differs from the NodeMapping model in those aspects:
 * - the ID and parent ID are optionally excluded;
 * - output.nodes becomes an object where each node is a property with
 * key=its key and value="uid label [tag]";
 * - output.triples becomes an array of strings with format "s p o" or
 * "s p "ol"".
 */
@Injectable({
  providedIn: 'root',
})
export class MappingJsonService {
  private adaptNodes(nodes?: {
    [key: string]: MappedNode;
  }): { [key: string]: string } | undefined {
    if (!nodes) {
      return undefined;
    }
    const result: { [key: string]: string } = {};
    for (let key in nodes) {
      let node = nodes[key];
      result[key] = node.tag
        ? `${node.uid} ${node.label} [${node.tag}]`
        : `${node.uid} ${node.label}`;
    }
    return result;
  }

  private adaptMappingOutput(
    output: NodeMappingOutput | undefined | null
  ): SerializedMappedNodeOutput | undefined {
    return {
      // nodes = { key: "uid label [tag]" }
      nodes: this.adaptNodes(output?.nodes),
      // triples = [ "s p o", "s p "ol"" ]
      triples: output?.triples?.map((t) => {
        return t.o ? `${t.s} ${t.p} ${t.o}` : `${t.s} ${t.p} "${t.ol}"`;
      }),
      // metadata = { key: "value" }
      metadata: output?.metadata,
    };
  }

  private adaptMapping(
    node: NodeMapping,
    dropId = false
  ): SerializedMappedNode {
    return {
      id: dropId ? undefined : node.id,
      parentId: dropId ? undefined : node.parentId,
      ordinal: node.ordinal,
      name: node.name,
      sourceType: node.sourceType,
      facetFilter: node.facetFilter,
      groupFilter: node.groupFilter,
      flagsFilter: node.flagsFilter,
      titleFilter: node.titleFilter,
      partTypeFilter: node.partTypeFilter,
      partRoleFilter: node.partRoleFilter,
      description: node.description,
      source: node.source,
      sid: node.sid,
      output: this.adaptMappingOutput(node.output),
      children: node.children?.map((c) => this.adaptMapping(c, dropId)),
    };
  }

  /**
   * Serialize the specified mapping to JSON.
   *
   * @param mapping The mapping to serialize.
   * @param dropId True to drop ID and parent ID.
   * @returns JSON string.
   */
  public serialize(mapping: NodeMapping, dropId = false): string {
    return JSON.stringify(this.adaptMapping(mapping, dropId));
  }

  private adaptSerializedNode(nodes?: {
    [key: string]: string;
  }): { [key: string]: MappedNode } | undefined {
    if (!nodes) {
      return undefined;
    }
    const result: { [key: string]: MappedNode } = {};
    for (let key in nodes) {
      const parts = nodes[key].split(' ');
      result[key] = {
        uid: parts[0],
        label: parts[1],
        tag:
          parts.length > 2
            ? parts[2].substring(1, parts[2].length - 1)
            : undefined,
      };
    }
    return result;
  }

  /**
   * Deserialize the specified JSON code to a mapping.
   *
   * @param json The JSON code to deserialize.
   * @param hydrate True to hydrate the mapping with IDs and parent references.
   * @param startId The start ID to use when hydrating.
   * @returns Mapping.
   */
  public deserialize(json: string, hydrate = true, startId = 1): NodeMapping {
    const obj = JSON.parse(json) as SerializedMappedNode;
    const mapping: NodeMapping = {
      id: obj.id || 0,
      parentId: obj.parentId,
      ordinal: obj.ordinal,
      name: obj.name,
      sourceType: obj.sourceType,
      facetFilter: obj.facetFilter,
      groupFilter: obj.groupFilter,
      flagsFilter: obj.flagsFilter,
      titleFilter: obj.titleFilter,
      partTypeFilter: obj.partTypeFilter,
      partRoleFilter: obj.partRoleFilter,
      description: obj.description,
      source: obj.source,
      sid: obj.sid,
      output: {
        nodes: this.adaptSerializedNode(obj.output?.nodes),
        triples: obj.output?.triples?.map((t) => {
          const parts = t.split(' ');
          return parts[2].startsWith('"')
            ? {
                s: parts[0],
                p: parts[1],
                ol: parts[2].substring(1, parts[2].length - 1),
              }
            : { s: parts[0], p: parts[1], o: parts[2] };
        }),
        metadata: obj.output?.metadata,
      },
      children: obj.children?.map((c) => this.deserialize(JSON.stringify(c))),
    };

    if (hydrate) {
      // assign IDs and parent IDs
      let id = startId;
      const assignIds = (node: NodeMapping) => {
        node.id = id++;
        node.parentId = node.parentId || 0;
        if (node.parentId) {
          const parent = mapping.children?.find((c) => c.id === node.parentId);
          if (parent) {
            node.parent = parent;
          }
        }
        node.children?.forEach((c) => assignIds(c));
      };
      assignIds(mapping);
    }

    return mapping;
  }
}
