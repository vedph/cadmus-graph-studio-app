import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MappedNode, NodeMappingOutput } from '../../models';
import { MappedTriple } from '../../models';

@Component({
  selector: 'cadmus-mapping-output-editor',
  templateUrl: './mapping-output-editor.component.html',
  styleUrls: ['./mapping-output-editor.component.css'],
})
export class MappingOutputEditorComponent {
  private _output?: NodeMappingOutput;

  @Input()
  public get output(): NodeMappingOutput | undefined | null {
    return this._output;
  }
  public set output(value: NodeMappingOutput | undefined | null) {
    this._output = value || undefined;
    this.updateForm(this._output);
  }

  public nodes: FormControl<string | null>;
  public triples: FormControl<string | null>;
  public metadata: FormControl<string | null>;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.nodes = formBuilder.control(null, Validators.maxLength(5000));
    this.triples = formBuilder.control(null, Validators.maxLength(5000));
    this.metadata = formBuilder.control(null, Validators.maxLength(5000));
    this.form = formBuilder.group({
      nodes: this.nodes,
      triples: this.triples,
      metadata: this.metadata,
    });
  }

  //#region helpers
  private parseNode(text: string | null | undefined): MappedNode | null {
    if (!text) {
      return null;
    }
    // parse node from "uid label [tag]"
    const m = text.match(/^(\S+)\s+(.+?)(?:\s+\[(.+?)\])?$/);
    if (!m) {
      return null;
    }
    return {
      uid: m[1],
      label: m[2],
      tag: m[3],
    };
  }

  private nodeToString(node: MappedNode | null): string | null {
    return node
      ? `${node.uid} ${node.label}${node.tag ? ` [${node.tag}]` : ''}`
      : null;
  }

  private parseTriple(text: string | null | undefined): MappedTriple | null {
    // parse triple from "s p o" or "s p "ol""
    if (!text) {
      return null;
    }
    const m = text.match(/^(\S+)\s+(.+?)\s+(.+)$/);
    if (!m) {
      return null;
    }
    return m[3].startsWith('"')
      ? {
          s: m[1],
          p: m[2],
          ol: m[3].substring(1, m[3].length - 1),
        }
      : {
          s: m[1],
          p: m[2],
          o: m[3],
        };
  }

  private tripleToString(triple: MappedTriple | null): string | null {
    return triple
      ? triple.ol
        ? `${triple.s} ${triple.p} "${triple.ol}"`
        : `${triple.s} ${triple.p} ${triple.o}`
      : null;
  }

  private parseMetadata(
    text: string | null | undefined
  ): { [key: string]: string } | null {
    if (!text) {
      return null;
    }
    const i = text.indexOf('=');
    if (i === -1) {
      return null;
    }
    return {
      [text.substring(0, i).trim()]: text.substring(i + 1).trim(),
    };
  }

  private metadataToString(
    metadata: { [key: string]: string } | null | undefined
  ): string | null {
    return metadata
      ? Object.keys(metadata)
          .map((k) => `${k}=${metadata[k]}`)
          .join('\n')
      : null;
  }
  //#endregion

  private updateForm(output: NodeMappingOutput | undefined): void {
    if (!output) {
      this.form.reset();
      return;
    }
    // nodes
    this.nodes.setValue(
      output.nodes
        ? Object.keys(output.nodes)
            .map((k) => this.nodeToString(output.nodes![k]))
            .join('\n')
        : null
    );
    // triples
    this.triples.setValue(
      output.triples
        ? output.triples.map((t) => this.tripleToString(t)).join('\n')
        : null
    );
    // metadata
    this.metadata.setValue(this.metadataToString(output.metadata));
  }
}
