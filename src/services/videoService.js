import { pool } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

function mapVideo(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    videoUrl: row.video_url,
    thumbnailUrl: row.thumbnail_url,
    creatorHandle: row.creator_handle,
    location: row.location,
    durationSecs: row.duration_secs,
    isVerified: Boolean(row.is_verified),
    likeCount: Number(row.like_count),
    shareCount: Number(row.share_count),
    liked: Boolean(row.liked),
    createdAt: row.created_at
  };
}

export async function listVideos(clientId) {
  const [rows] = await pool.query(
    `SELECT v.*, (vl.id IS NOT NULL) AS liked
       FROM videos v
       LEFT JOIN video_likes vl
         ON vl.video_id = v.id AND vl.client_id = :clientId
      ORDER BY v.position ASC, v.id ASC`,
    { clientId }
  );
  return rows.map(mapVideo);
}

export async function getVideoById(videoId, clientId) {
  const [rows] = await pool.query(
    `SELECT v.*, (vl.id IS NOT NULL) AS liked
       FROM videos v
       LEFT JOIN video_likes vl
         ON vl.video_id = v.id AND vl.client_id = :clientId
      WHERE v.id = :videoId
      LIMIT 1`,
    { videoId, clientId }
  );
  if (rows.length === 0) {
    throw new ApiError(404, "Video not found");
  }
  return mapVideo(rows[0]);
}

export async function toggleLike(videoId, clientId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [videoRows] = await connection.query(
      "SELECT id FROM videos WHERE id = :videoId FOR UPDATE",
      { videoId }
    );
    if (videoRows.length === 0) {
      throw new ApiError(404, "Video not found");
    }

    const [existing] = await connection.query(
      "SELECT id FROM video_likes WHERE video_id = :videoId AND client_id = :clientId LIMIT 1",
      { videoId, clientId }
    );

    let liked;
    if (existing.length > 0) {
      await connection.query("DELETE FROM video_likes WHERE id = :id", { id: existing[0].id });
      liked = false;
    } else {
      await connection.query(
        "INSERT INTO video_likes (video_id, client_id) VALUES (:videoId, :clientId)",
        { videoId, clientId }
      );
      liked = true;
    }

    await connection.query(
      `UPDATE videos
          SET like_count = (SELECT COUNT(*) FROM video_likes WHERE video_id = :videoId)
        WHERE id = :videoId`,
      { videoId }
    );

    const [countRows] = await connection.query(
      "SELECT like_count FROM videos WHERE id = :videoId",
      { videoId }
    );

    await connection.commit();
    return { liked, likeCount: Number(countRows[0].like_count) };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function recordShare(videoId, clientId, platform) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [videoRows] = await connection.query(
      "SELECT id FROM videos WHERE id = :videoId FOR UPDATE",
      { videoId }
    );
    if (videoRows.length === 0) {
      throw new ApiError(404, "Video not found");
    }

    await connection.query(
      "INSERT INTO video_shares (video_id, client_id, platform) VALUES (:videoId, :clientId, :platform)",
      { videoId, clientId, platform }
    );

    await connection.query(
      `UPDATE videos
          SET share_count = (SELECT COUNT(*) FROM video_shares WHERE video_id = :videoId)
        WHERE id = :videoId`,
      { videoId }
    );

    const [countRows] = await connection.query(
      "SELECT share_count FROM videos WHERE id = :videoId",
      { videoId }
    );

    await connection.commit();
    return { shareCount: Number(countRows[0].share_count) };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
