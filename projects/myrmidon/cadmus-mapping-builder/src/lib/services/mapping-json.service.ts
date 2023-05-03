import { Injectable } from '@angular/core';

import { deepCopy } from '@myrmidon/ng-tools';

import { MappedNode, NodeMapping, NodeMappingOutput } from '../models';

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

export interface NodeMappingDocument {
  namedMappings?: { [key: string]: SerializedMappedNode };
  documentMappings: SerializedMappedNode[];
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
  private _nextId = 1;

  /**
   * Visit all the mappings in the specified mapping's hierarchy, calling
   * the specified visitor function for each visited mapping, and setting
   * the parent of each mapping if requested.
   *
   * @param mapping The mapping to visit.
   * @param hydration True to set falsy IDs and parent of each visited mapping.
   * @param visitor The function to call for each visited mapping, if any;
   * if this returns false, the visit is interrupted.
   */
  public visitMappings(
    mapping: NodeMapping | null,
    hydration = true,
    visitor?: (m: NodeMapping) => boolean
  ): void {
    // handle the received mapping
    if (!mapping) {
      return;
    }
    if (hydration && !mapping.id) {
      mapping.id = this._nextId++;
    }
    if (visitor && !visitor(mapping)) {
      return;
    }

    // handle its children
    if (mapping.children?.length) {
      for (let child of mapping.children) {
        if (hydration) {
          child.parentId = mapping.id;
          child.parent = mapping;
        }
        if (visitor && !visitor(child)) {
          return;
        }
        this.visitMappings(child, hydration, visitor);
      }
    }
  }

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

  private getSerializedMappedNode(
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
      children: node.children?.map((c) =>
        this.getSerializedMappedNode(c, dropId)
      ),
    };
  }

  /**
   * Serialize the specified mapping to JSON.
   *
   * @param mapping The mapping to serialize.
   * @param dropId True to drop ID and parent ID.
   * @returns JSON string.
   */
  public serializeMapping(mapping: NodeMapping, dropId = false): string {
    return JSON.stringify(this.getSerializedMappedNode(mapping, dropId));
  }

  private getMappedNodes(nodes?: {
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

  private getMapping(node: SerializedMappedNode): NodeMapping {
    const mapping: NodeMapping = {
      id: node.id || 0,
      parentId: node.parentId,
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
      output: {
        nodes: this.getMappedNodes(node.output?.nodes),
        triples: node.output?.triples?.map((t) => {
          const parts = t.split(' ');
          return parts[2].startsWith('"')
            ? {
                s: parts[0],
                p: parts[1],
                ol: parts[2].substring(1, parts[2].length - 1),
              }
            : { s: parts[0], p: parts[1], o: parts[2] };
        }),
        metadata: node.output?.metadata,
      },
      children: node.children?.map((c) =>
        this.deserializeMapping(JSON.stringify(c))
      ),
    };

    // if (hydrate) {
    //   // assign IDs and parent IDs
    //   this.visitMapping(mapping, true, (m) => {
    //     if (!m.id) {
    //       m.id = this._nextId++;
    //     }
    //     if (m.children?.length) {
    //       m.children.forEach((c) => {
    //         c.parent = m;
    //       });
    //     }
    //     return true;
    //   });
    // }

    return mapping;
  }

  /**
   * Deserialize the specified JSON code to a mapping.
   *
   * @param json The JSON code to deserialize.
   * @returns Mapping.
   */
  private deserializeMapping(json: string): NodeMapping {
    return this.getMapping(JSON.parse(json) as SerializedMappedNode);
  }

  /**
   * Read the specified mappings document.
   *
   * @param json The JSON representing a mappings document.
   * @returns Mappings.
   */
  public readMappingsDocument(json: string, resetId = true): NodeMapping[] {
    if (resetId) {
      this._nextId = 1;
    }
    const doc = JSON.parse(json) as NodeMappingDocument;

    // read named mappings
    let named: { [key: string]: NodeMapping } = {};
    if (doc.namedMappings) {
      Object.keys(doc.namedMappings).forEach((key) => {
        named[key] = this.getMapping(doc.namedMappings![key]);
      });
    }

    // read document mappings
    const mappings = doc.documentMappings.map((m) =>
      this.deserializeMapping(JSON.stringify(m))
    );

    // hydrate mappings and expand named mappings references
    for (let i = 0; i < mappings.length; i++) {
      // assign IDs and parents
      this.visitMappings(mappings[i], true);

      // expand named mappings
      this.visitMappings(mappings[i], false, (m) => {
        if (named[m.name]) {
          // copy named mapping when expanding
          const mc = deepCopy(named[m.name]);
          mc.id = m.id;
          mc.parentId = m.parentId;
          mc.parent = m.parent;

          if (m.parent) {
            const idx = m.parent.children!.findIndex(c => c.id === m.id);
            m.parent.children![idx] = mc;
          } else {
            mappings[i] = mc;
          }
        }
        return true;
      });
    }

    return mappings;
  }
}
