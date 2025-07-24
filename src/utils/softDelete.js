/**
 * Utility functions for soft delete operations
 */

const notDeletedCondition = () => "deleted_at IS NULL";

const softDeleteQuery = (tableName, idColumn = "id") => `
  UPDATE ${tableName} 
  SET deleted_at = NOW() 
  WHERE ${idColumn} = $1 AND deleted_at IS NULL
`;

const addNotDeletedToQuery = (query, alias = "") => {
  const condition = alias
    ? `${alias}.deleted_at IS NULL`
    : "deleted_at IS NULL";

  if (query.toLowerCase().includes("where")) {
    return `${query} AND ${condition}`;
  }
  return `${query} WHERE ${condition}`;
};

const buildSelectQuery = (
  tableName,
  columns = "*",
  whereCondition = "",
  alias = ""
) => {
  const tableRef = alias ? `${tableName} ${alias}` : tableName;
  const selectColumns = columns === "*" ? "*" : columns;

  let query = `SELECT ${selectColumns} FROM ${tableRef}`;

  if (whereCondition) {
    query += ` WHERE ${whereCondition}`;
    query = addNotDeletedToQuery(query, alias);
  } else {
    query += ` WHERE ${alias ? `${alias}.` : ""}deleted_at IS NULL`;
  }

  return query;
};

module.exports = {
  notDeletedCondition,
  softDeleteQuery,
  addNotDeletedToQuery,
  buildSelectQuery,
};
