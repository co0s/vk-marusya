import React, { useState, useRef, useEffect } from "react";
import { searchMovies } from "../../store/slices/moviesSlice";
import { useDebounce } from "../../hooks/useDebounce/useDebounce";
import SearchResultsDropdown from "../SearchResultsDropdown/SearchResultsDropdown";
import styles from "./SearchBar.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";

interface SearchBarProps {
  className?: string;
  collapseOnBlur?: boolean;
  onCollapse?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  collapseOnBlur = false,
  onCollapse,
}) => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { searchResults, searchStatus } = useAppSelector(
    (state) => state.movies
  );

  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setIsDropdownVisible(false);
      return;
    }

    dispatch(searchMovies(debouncedSearchQuery));
    setIsDropdownVisible(true);
  }, [debouncedSearchQuery, dispatch]);

  useEffect(() => {
    if (!collapseOnBlur) {
      return;
    }

    inputRef.current?.focus();
  }, [collapseOnBlur]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
        if (collapseOnBlur) {
          setSearchQuery("");
          onCollapse?.();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [collapseOnBlur, onCollapse]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    setIsDropdownVisible(!!value.trim());
  };

  const handleResultSelect = () => {
    setIsDropdownVisible(false);
    setSearchQuery("");
    if (collapseOnBlur) {
      onCollapse?.();
    }
  };

  const handleInputFocus = () => {
    if (searchQuery.trim() && searchResults.length > 0) {
      setIsDropdownVisible(true);
    }
  };

  const handleInputBlur = () => {
    window.setTimeout(() => {
      const activeElement = document.activeElement;
      if (activeElement && containerRef.current?.contains(activeElement)) {
        return;
      }

      setIsDropdownVisible(false);
      if (collapseOnBlur) {
        setSearchQuery("");
        onCollapse?.();
      }
    }, 0);
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative" }}
    >
      <input
        ref={inputRef}
        className={styles.search__bar}
        type="search"
        placeholder="Поиск фильмов..."
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
      <svg
        className={styles.search__icon}
        style={{
          position: "absolute",
          left: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "16px",
          height: "16px",
          pointerEvents: "none",
          color: "#888",
        }}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
        <line
          x1="21"
          y1="21"
          x2="16.65"
          y2="16.65"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>

      {isDropdownVisible && searchQuery.trim() && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        >
          {searchStatus === "loading" ? (
            <div className={styles.loading}>Поиск...</div>
          ) : searchResults.length > 0 ? (
            <SearchResultsDropdown
              results={searchResults}
              onSelect={handleResultSelect}
            />
          ) : (
            <div className={styles.no__results}>Фильмы не найдены</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
