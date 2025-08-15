import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import noPhoto from "../assets/no-photo.png";

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/search?query=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Ошибка при поиске:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  if (loading) return <div>Загрузка...</div>;
  if (results.length === 0) return <div>Товары не найдены по запросу: <strong>{query}</strong></div>;

  return (
    <div>
      <h2>Результаты по запросу: <strong>{query}</strong></h2>
      <ul>
        {results.map((product) => (
          <li key={product.id}>
            <Link to={`/product/${product.id}`}>
              <h3>{product.nameProd}</h3>
              <img
                src={product.image ? `${process.env.REACT_APP_API_URL}${product.image}` : noPhoto}
                alt={product.nameProd}
                width="200"
              />
              <p>Цена: {product.price} $</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultsPage;
