import { DataPage } from '@myrmidon/ngx-tools';
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
  scalarPattern?: string;
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

export interface UriNode {
  id: number;
  isClass?: boolean;
  tag?: string;
  label?: string;
  sourceType: number;
  sid?: string;
  uri?: string;
}

export interface UriTriple {
  id: number;
  subjectId: number;
  predicateId: number;
  objectId: number;
  objectLiteral?: string;
  objectLiteralIx?: string;
  literalType?: string;
  literalLanguage?: string;
  literalNumber?: number;
  sid?: string;
  tag?: string;
  subjectUri?: string;
  predicateUri?: string;
  objectUri?: string;
  uri?: string;
}

export interface GraphSet {
  nodes: UriNode[];
  triples: UriTriple[];
}

export interface ErrorWrapper<T> {
  value?: T;
  error?: string;
}

/**
 * Node mapping service.
 */
export interface NodeMappingService {
  /**
   * Get the specified page of mappings.
   * @param filter The mappings filter.
   * @param pageNumber The page number.
   * @param pageSize The page size.
   */
  getMappings(
    filter: NodeMappingFilter,
    pageNumber: number,
    pageSize: number
  ): Observable<DataPage<NodeMapping>>;

  /**
   * Get the mapping with the specified ID.
   * @param id The ID of the mapping to get.
   */
  getMapping(id: number): Observable<NodeMapping | null>;

  /**
   * Add or update the specified mapping.
   * @param mapping The mapping to add or update.
   */
  addMapping(mapping: NodeMapping): Observable<NodeMapping>;

  /**
   * Delete the mapping with the specified ID.
   * @param id The ID of the mapping to delete.
   */
  deleteMapping(id: number): Observable<any>;

  /**
   * Clear all the mappings.
   */
  clear(): Observable<any>;

  /**
   * Export all the mappings into JSON code.
   */
  exportMappings(): Observable<string>;

  /**
   * Load mappings from JSON code.
   * @param json The JSON code.
   */
  importMappings(json: string): Observable<NodeMapping[]>;
}

/**
 * The injection token for the node mapping service.
 */
export const NODE_MAPPING_SERVICE = 'NodeMappingService';
