export const CATEGORIES = ["ALL", "MV", "3D", "PHOTO", "自主制作"];

const ROLE_MAPPING = {
  "Music Video 制作": "Movie",
  動画制作: "Movie",
  動画作者: "Movie",
  Movie: "Movie",
  Video: "Movie",
  映像: "Movie",
  動画: "Movie",
  制作: "Movie",
  ジャケットイラスト: "Illust",
  Illust: "Illust",
  Illustration: "Illust",
  イラスト: "Illust",
  Art: "Illust",
  Ilust: "Illust",
  Illstration: "Illust",
  Vocal: "Vocal",
  ボーカル: "Vocal",
  歌: "Vocal",
  Cast: "Cast",
  出演: "Cast",
  Mix: "Mix",
  Mixing: "Mix",
  ミックス: "Mix",
  MIX: "Mix",
  Music: "Music",
  作曲: "Music",
  "Music & Lyric": "Music/Lyrics",
  作詞作曲: "Music/Lyrics",
  Lyrics: "Lyrics",
  Lyric: "Lyrics",
  作詞: "Lyrics",
  Arrangement: "Arrange",
  Arranged: "Arrange",
  編曲: "Arrange",
  Model: "Model",
  モデル: "Model",
  Motion: "Motion",
  Original: "Original",
  本家: "Original",
  Mastering: "Mastering",
  マスタリング: "Mastering",
  "Inst arrange": "Arrange",
  Instrument: "Inst",
  Recording: "Rec",
  CV: "CV",
  レコーディング: "Rec",
  "3DCG / Composite / Motion Graphics": "3D/Composite",
  Participant: "Participant",
};

const CREDIT_REGEX =
  /^(Music Video 制作|ジャケットイラスト|作詞作曲|Music & Lyric|動画制作|動画作者|編集ソフト|使用ソフト|ナレーション|BGM作曲|Inst arrange|Music|Vocal|Mix|Mixing|MIX|Illust|Ilust|Illstration|Illustration|Live2D|Movie|Video|Cast|Director|Model|Motion|Camera|Lyrics|Lyric|Arrangement|Tuning|Mastering|Instrument|作詞|作曲|編曲|歌|ボーカル|ミックス|イラスト|動画|映像|制作|出演|モデル|Original|Credit|Bass|Guitar|Drums|Piano|Inst|Recording|レコーディング|CV|3DCG \/ Composite \/ Motion Graphics|Participant)(?:\s*(?:&|\/|\+)\s*[a-zA-Z0-9\u3000-\u30Fe\u4e00-\u9fa0]+)*\s*[：:\-]\s*(.*)/i;

export const processWorksData = (data) => {
  return data
    .map((item) => {
      // Parse credits from description
      const credits = {};

      if (item.description_raw) {
        const lines = item.description_raw.split("\n");
        lines.forEach((line) => {
          // Remove common list markers and trim
          const cleanLine = line
            .replace(/^[✦·・■⚡️\-\*\[\]【】]\s*/, "")
            .trim();

          const match = cleanLine.match(CREDIT_REGEX);

          if (match) {
            let rawKey = match[1].trim();
            // Normalize key using mapping, default to capitalized raw key
            let key =
              ROLE_MAPPING[rawKey] ||
              ROLE_MAPPING[
                Object.keys(ROLE_MAPPING).find(
                  (k) => k.toLowerCase() === rawKey.toLowerCase(),
                )
              ] ||
              rawKey.charAt(0).toUpperCase() + rawKey.slice(1);

            // Clean value: remove URLs, twitter handles, and extra symbols
            let value = match[2].trim();
            value = value
              .replace(/https?:\/\/\S+/g, "") // Remove URLs
              .replace(/@[a-zA-Z0-9_]+/g, "") // Remove Twitter handles
              .replace(/\(.*\)/g, "") // Remove parentheses content
              .trim();

            // Further clean if value ends with symbols
            value = value.replace(/[,/|]+$/, "").trim();

            if (value && value.length > 0) {
              credits[key] = value;
            }
          }
        });

        if (Object.keys(credits).length === 0 && item.channel) {
          credits["Channel"] = item.channel;
        }
      } else {
        credits["Channel"] = item.channel;
      }

      return {
        title: item.title,
        category: item.category || "MV",
        img: item.thumbnail,
        href: item.url,
        description: "",
        credits: credits,
        publishDate: item.publishDate ? item.publishDate : null,
      };
    })
    .sort((a, b) => {
      if (!a.publishDate || !b.publishDate) return 0;
      return b.publishDate.localeCompare(a.publishDate);
    });
};

export const groupWorksByYear = (works) => {
  return works.reduce((acc, work) => {
    const year = work.publishDate ? work.publishDate.slice(0, 4) : "Unknown";
    if (!acc[year]) acc[year] = [];
    acc[year].push(work);
    return acc;
  }, {});
};
