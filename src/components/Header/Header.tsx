
import { NavLink } from "react-router-dom";
import { useState } from 'react';

import styles from "./Header.module.css";
import logo from "../../assets/logo.png";
import logo__mobile from "../../assets/logo__mobile.png";
import SearchBar from "../SearchBar/SearchBar";
import LoginButton from "../LoginButton/LoginButton";

const Header = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleOpenSearch = () => {
    if (isSearchVisible) {
      setIsSearchVisible(false);
    } else {
      setIsSearchVisible(true);
    }
  };

  const handleCloseSearch = () => {
    setIsSearchVisible(false);
  };

  return (
    <>
      {isSearchVisible && (
        <SearchBar
          className={styles.mobile__search}
          collapseOnBlur
          onCollapse={handleCloseSearch}
        />
      )}
      <div className={styles.header__container}>
        <NavLink to="/" className={styles.header__logo}>
          <img className={styles.logo__img} src={logo} alt="" />
        </NavLink>
        <NavLink to="/" className={`${styles.header__logo} ${styles.logo__small}`}>
          <img className={styles.logo__img} src={logo__mobile} alt="" />
        </NavLink>

        <nav className={styles.nav__bar}>
          <NavLink 
            to="/" 
            className={({ isActive }) => `${styles.nav__links} ${isActive ? styles.active : ''}`}
          >
            Главная
          </NavLink>

          <NavLink 
            to="/genres" 
            className={({ isActive }) => `${styles.nav__links} ${isActive ? styles.active : ''}`}
          >
            Жанры
          </NavLink>

          <SearchBar className={styles.search__1400} />

          <NavLink to="/genres" className={`${styles.nav__icons} ${styles.genre__icon}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 11.5C4.51472 11.5 2.5 9.48528 2.5 7C2.5 4.51472 4.51472 2.5 7 2.5C9.48528 2.5 11.5 4.51472 11.5 7C11.5 9.48528 9.48528 11.5 7 11.5ZM7 21.5C4.51472 21.5 2.5 19.4853 2.5 17C2.5 14.5147 4.51472 12.5 7 12.5C9.48528 12.5 11.5 14.5147 11.5 17C11.5 19.4853 9.48528 21.5 7 21.5ZM17 11.5C14.5147 11.5 12.5 9.48528 12.5 7C12.5 4.51472 14.5147 2.5 17 2.5C19.4853 2.5 21.5 4.51472 21.5 7C21.5 9.48528 19.4853 11.5 17 11.5ZM17 21.5C14.5147 21.5 12.5 19.4853 12.5 17C12.5 14.5147 14.5147 12.5 17 12.5C19.4853 12.5 21.5 14.5147 21.5 17C21.5 19.4853 19.4853 21.5 17 21.5ZM7 9.5C8.38071 9.5 9.5 8.38071 9.5 7C9.5 5.61929 8.38071 4.5 7 4.5C5.61929 4.5 4.5 5.61929 4.5 7C4.5 8.38071 5.61929 9.5 7 9.5ZM7 19.5C8.38071 19.5 9.5 18.3807 9.5 17C9.5 15.6193 8.38071 14.5 7 14.5C5.61929 14.5 4.5 15.6193 4.5 17C4.5 18.3807 5.61929 19.5 7 19.5ZM17 9.5C18.3807 9.5 19.5 8.38071 19.5 7C19.5 5.61929 18.3807 4.5 17 4.5C15.6193 4.5 14.5 5.61929 14.5 7C14.5 8.38071 15.6193 9.5 17 9.5ZM17 19.5C18.3807 19.5 19.5 18.3807 19.5 17C19.5 15.6193 18.3807 14.5 17 14.5C15.6193 14.5 14.5 15.6193 14.5 17C14.5 18.3807 15.6193 19.5 17 19.5Z" fill="white" />
            </svg>
          </NavLink>

          <SearchBar className={styles.search__container} />

          <div className={styles.nav__icons}>
            <button 
              className={`${styles.icon__button} ${styles.search__icon}`} 
              onClick={handleOpenSearch}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" fill="white" />
              </svg>
            </button>
          </div>

          <div className={styles.content__1400}>
            <LoginButton />
          </div>

          <LoginButton />
          
        </nav>
      </div>
    </>
  );
};

export default Header;
