import { DataPage } from '@myrmidon/ng-tools';
import { Observable } from 'rxjs';

export interface MappedNode {
  uid: string;
  label: string;
  tag?: string;
}

export interface MappedTriple {
  s: string;
  p: string;
  o?: string;
  ol?: string;
}

export interface NodeMappingOutput {
  nodes?: { [key: string]: MappedNode };
  triples?: MappedTriple[];
  metadata?: { [key: string]: string };
}

export interface NodeMapping {
  id: number;
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
  output?: NodeMappingOutput;
  children?: NodeMapping[];
  // added for viewmodel
  parent?: NodeMapping;
}

export interface NodeMappingFilter {
  parentId?: number;
  sourceType?: number;
  name?: string;
  facet?: string;
  group?: string;
  flags?: number;
  title?: string;
  partType?: string;
  partRole?: string;
}

export interface NodeMappingService {
  getMappings(
    filter: NodeMappingFilter,
    pageNumber: number,
    pageSize: number
  ): Observable<DataPage<NodeMapping>>;

  getMapping(id: number): Observable<NodeMapping | null>;

  addMapping(mapping: NodeMapping): Observable<NodeMapping>;

  deleteMapping(id: number): Observable<any>;

  exportMappings(): Observable<string>;

  importMappings(json: string): Observable<any>;
}

/**
 * The injection token for the node mapping service.
 */
export const NODE_MAPPING_SERVICE = 'NodeMappingService';
