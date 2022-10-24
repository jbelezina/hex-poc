import { mutation } from "./_generated/server";

export default mutation(
  async (
    { db },
    action: "increment" | "decrement",
    hexId: string,
    colorHex: string
  ) => {
    const hex = await db
      .query("board_table")
      .filter((q) => q.eq(q.field("hexId"), hexId))
      .first();
    if (hex === null) {
      await db.insert("board_table", {
        hexId: hexId,
        colorHex: colorHex,
        timeLogged: 0,
      });
    } else {
      if (action === "increment") {
        hex.timeLogged += 1;
      }
      if (action === "decrement" && hex.timeLogged > 0) {
        hex.timeLogged -= 1;
      }

      hex.colorHex = colorHex;
      await db.replace(hex._id, hex);
    }
  }
);
