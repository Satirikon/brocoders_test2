(() => {
  const header = document.querySelector('.header');

  if (!header) {
    return console.error('Header is not found in DOM.');
  }

  const menuButton = header.querySelector('.menu');
  const menu = header.querySelector('.submenu');

  if (!menuButton || !menu) {
    return console.error('Menu button or menu element is not found in DOM.');
  }

  let isMenuShown = false;

  const handleMenuClick = () => {
    isMenuShown = !isMenuShown;
    if (isMenuShown) {
      return menu.style.display = 'flex';
    }
    if (!isMenuShown) {
      return menu.style.display = 'none';
    }
  };

  const handleScroll = () => {
    const scrolledClass = 'header-scrolled';
    if (window.pageYOffset !== 0 && !header.classList.contains(scrolledClass)) {
      return header.classList.add(scrolledClass);
    }
    if (window.pageYOffset === 0 && header.classList.contains(scrolledClass)) {
      return header.classList.remove(scrolledClass);
    }
  };

  menuButton.addEventListener('click', handleMenuClick);
  window.addEventListener('scroll', handleScroll);
  window.onscroll = handleScroll;
})();
