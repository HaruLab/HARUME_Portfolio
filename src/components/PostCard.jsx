;

/**
 * Blog post preview card component
 * @param {object} props
 * @param {string} props.id - Post ID (slug)
 * @param {string} props.title - Post title
 * @param {string} props.date - Publication date
 * @param {string} [props.image] - Featured image URL (optional)
 * @param {string} props.excerpt - Short summary
 */
const PostCard = ({ id, title, date, image, excerpt }) => {
  return (
    <li className="border border-[var(--border-color)] rounded-lg overflow-hidden bg-[var(--background)]">
      <a href={`/blog/${id}`} className="block">
        {image && (
          <img
            src={image}
            alt={title}
            // width={800}
            // height={450}
            className="w-full object-cover"
          />
        )}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          <small className="text-[var(--foreground)]/60 block mb-4">
            {date}
          </small>
          <p className="text-[var(--foreground)]/80">{excerpt}</p>
        </div>
      </a>
    </li>
  );
};

export default PostCard;
