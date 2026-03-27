const header = document.querySelector('.site-header');
const toggle = document.querySelector('[data-nav-toggle]');

if (header && toggle) {
  toggle.addEventListener('click', () => {
    const open = header.getAttribute('data-nav-open') === 'true';
    header.setAttribute('data-nav-open', String(!open));
    toggle.setAttribute('aria-expanded', String(!open));
  });
}
