export interface GridFilterItem {
  /**
   * Must be unique.
   * Only useful when the model contains several items.
   */
  id?: number | string;
  /**
   * The column from which we want to filter the rows.
   */
  field: string;
  /**
   * The filtering value.
   * The operator filtering function will decide for each row if the row values is correct compared to this value.
   */
  value?: any;
  /**
   * The name of the operator we want to apply.
   */
  operator: string;
}
declare enum GridLogicOperator {
  And = 'and',
  Or = 'or',
}

export interface GridFilterModel {
  /**
   * @default []
   */
  items: GridFilterItem[];
  /**
   * - `GridLogicOperator.And`: the row must pass all the filter items.
   * - `GridLogicOperator.Or`: the row must pass at least on filter item.
   * @default `GridLogicOperator.Or`
   */
  logicOperator?: GridLogicOperator;
  /**
   * values used to quick filter rows
   * @default `[]`
   */
  quickFilterValues?: any[];
  /**
   * - `GridLogicOperator.And`: the row must pass all the values.
   * - `GridLogicOperator.Or`: the row must pass at least one value.
   * @default `GridLogicOperator.And`
   */
  quickFilterLogicOperator?: GridLogicOperator;
  /**
   * If `true`, the quick filter will skip cell values from hidden columns.
   * @default false
   */
  quickFilterExcludeHiddenColumns?: boolean;
}
export interface GridSortItem {
  /**
   * The column field identifier.
   */
  field: string;
  /**
   * The direction of the column that the grid should sort.
   */
  sort: GridSortDirection;
}

export type GridSortModel = GridSortItem[];
