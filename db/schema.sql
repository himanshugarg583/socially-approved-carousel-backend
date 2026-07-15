CREATE TABLE IF NOT EXISTS videos (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title          VARCHAR(180) NOT NULL,
  description    VARCHAR(500) NOT NULL DEFAULT '',
  video_url      VARCHAR(500) NOT NULL,
  thumbnail_url  VARCHAR(500) NOT NULL DEFAULT '',
  creator_handle VARCHAR(80)  NOT NULL DEFAULT '',
  location       VARCHAR(120) NOT NULL DEFAULT '',
  duration_secs  INT UNSIGNED NOT NULL DEFAULT 0,
  is_verified    TINYINT(1)   NOT NULL DEFAULT 0,
  like_count     INT UNSIGNED NOT NULL DEFAULT 0,
  share_count    INT UNSIGNED NOT NULL DEFAULT 0,
  position       INT UNSIGNED NOT NULL DEFAULT 0,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_videos_position (position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS video_likes (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  video_id   INT UNSIGNED NOT NULL,
  client_id  CHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_like_client (video_id, client_id),
  KEY idx_like_video (video_id),
  CONSTRAINT fk_like_video FOREIGN KEY (video_id) REFERENCES videos (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS video_shares (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  video_id   INT UNSIGNED NOT NULL,
  platform   VARCHAR(40) NOT NULL DEFAULT 'link',
  client_id  CHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_share_video (video_id),
  CONSTRAINT fk_share_video FOREIGN KEY (video_id) REFERENCES videos (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
