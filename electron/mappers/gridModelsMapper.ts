import { PipelineStage } from 'mongoose';
import { GridFilterModel, GridSortModel } from '../grid-models';

export function mapGridFilterModelToFilterQuery(
  gridFilterModel?: GridFilterModel
) {
  const matchQuery = {};
  const aggregateQuery = { $match: matchQuery };
  if (!gridFilterModel?.items?.length || !gridFilterModel?.items[0]?.value) {
    return aggregateQuery;
  }
  gridFilterModel.items.forEach(({ field, operator, value }) => {
    switch (operator) {
      case 'contains':
        matchQuery[field] = { $regex: value, $options: 'i' }; // Case-insensitive
        break;

      case 'equals':
        matchQuery[field] = value;
        break;

      case 'startsWith':
        matchQuery[field] = { $regex: `^${value}`, $options: 'i' }; // Starts with
        break;

      case 'endsWith':
        matchQuery[field] = { $regex: `${value}$`, $options: 'i' }; // Ends with
        break;

      case 'at':
        matchQuery[field] = new Date(value); // Exact match for date
        break;

      case 'not':
        matchQuery[field] = { $ne: new Date(value) }; // Not equal to
        break;

      case 'after':
        matchQuery[field] = { $gt: new Date(value) }; // After date
        break;

      case 'onOrAfter':
        matchQuery[field] = { $gte: new Date(value) }; // On or after date
        break;

      case 'before':
        matchQuery[field] = { $lt: new Date(value) }; // Before date
        break;

      case 'onOrBefore':
        matchQuery[field] = { $lte: new Date(value) }; // On or before date
        break;

      case 'is':
        matchQuery[field] = value === 'true'; // Boolean (convert string to boolean)
        break;

      default:
        break;
    }
  });
  return aggregateQuery;
}

export function mapSortGridToSortQuery(
  gridSortModel?: GridSortModel
): PipelineStage[] {
  const sortStage = {};

  // Iterate over each sorting field
  gridSortModel.forEach((sort) => {
    const field = sort.field;
    const order = sort.sort === 'asc' ? 1 : -1; // Ascending = 1, Descending = -1

    // Here you can map the field names if needed (e.g., if 'name' should map to 'fullName')
    // For now, assuming fields are the same
    sortStage[field] = order;
  });

  return Object.keys(sortStage).length ? [{ $sort: sortStage }] : [];
}
