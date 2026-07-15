import { pool, closePool } from "../config/db.js";
import { buildSeedVideos } from "./seedData.js";

async function seed() {
  const videos = buildSeedVideos(30);
  const connection = await pool.getConnection();

  try {
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    await connection.query("TRUNCATE TABLE video_shares");
    await connection.query("TRUNCATE TABLE video_likes");
    await connection.query("TRUNCATE TABLE videos");
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    const values = videos.map((v) => [
      v.title,
      v.description,
      v.video_url,
      v.thumbnail_url,
      v.creator_handle,
      v.location,
      v.duration_secs,
      v.is_verified,
      v.position
    ]);

    await connection.query(
      `INSERT INTO videos
        (title, description, video_url, thumbnail_url, creator_handle, location, duration_secs, is_verified, position)
       VALUES ?`,
      [values]
    );

    console.log(`Seeded ${videos.length} videos`);
  } finally {
    connection.release();
    await closePool();
  }
}

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
