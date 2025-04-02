import { useState } from 'react';
import styles from './SearchBar.module.css';

// eslint-disable-next-line react/prop-types
const SearchBar = ({ onSearch, loading }) => {


  // handle state management
  const [searchTerm, setSearchTerm] = useState('');


  // handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setSearchTerm('');
  };
  

  return (
    // searchForm
    <form onSubmit={handleSubmit} className={`${styles.searchForm} `}>

      {/* searchContainer */}
      <div className={styles.searchContainer}>

        <input type="text"
          className={styles.searchInput}
          placeholder="Enter city name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />

        <button
          type="submit"
          className={styles.searchButton}
          disabled={loading || !searchTerm.trim()}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>

      </div>

    </form>
  );
};

export default SearchBar;