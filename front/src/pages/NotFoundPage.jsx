import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="hero">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p className="description">The page you requested does not exist.</p>
      <div className="actions">
        <Link className="link-button" to="/">
          Go home
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
