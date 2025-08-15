import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import search from '../assets/search.svg'

const GlobalSearchProduct = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;

    // Переход на страницу результатов
    navigate(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form className="global__search" onSubmit={handleSearch}>
      <button type="submit" className="global__search-btn">
        <img src={search} alt="search icon" />
      </button>
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};

export default GlobalSearchProduct;

