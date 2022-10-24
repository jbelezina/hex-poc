import { query } from "./_generated/server";

export default query(async ({ db }): Promise<any[]> => {
  const board = await db.query("board_table").collect();

  return board;
});
