# Cadmus Mapping Builder

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.0.

## Components

- ⚙️ **MappingList**: paged list of mappings, using `MappingListRepository` for its state.
  - ⚙️ **MappingFilter**: filter for mappings list, using `MappingListRepository` for its state.

- ⚙️ **MappingTreeEditor**: the topmost mapping editor. This includes a `MappingTreeComponent` for the mapping and its descendants, and a `MappingEditorComponent` for the currently edited mapping. Editing is persisted in the RAM store when save is clicked.
  - ▶️ input:
    - `mapping`: the mapping being edited.
  - ◀️ output:
    - `mappingChange`.
    - `editorClose`.
  - ⚙️ **MappingTreeComponent**:
    - ▶️ input:
      - `mapping`: the root mapping being edited.
      - `selected`: the currently selected mapping in the tree.
    - ◀️ output:
      - `selectedChange`.
      - `mappingAdd`.
      - `mappingDelete`.
  - ⚙️ **MappingEditorComponent**:
    - ▶️ input:
      - `mapping`: the mapping being edited.
    - ◀️ output:
      - `mappingChange`.
      - `editorClose`.
    - ⚙️ **JmesComponent**: JMES expression editor with tester:
      - ▶️ input:
        - `expression`: the mapping being edited.
      - ◀️ output:
        - `expressionChange`.
      - ⚙️ **CachedTextPickerComponent**
        - ▶️ input:
          - `cacheKey`
          - `text`
        - ◀️ output:
          - `textPick`
    - ⚙️ **MappingRunnerComponent**: run mapping against test data.
      - ▶️ input:
        - `mapping`: the mapping to run.
      - ⚙️ **CachedTextPickerComponent**

## Services

- `GraphStudioApiService`: client for API backend (for JMES and mapping run).
- `MappingJsonService`: mappings document JSON serialization service.
- `RamCacheService`: RAM-based cache service, used to persist presets during edit.
- `RamMappingService`: RAM-based mappings backend. This is the mappings store.
