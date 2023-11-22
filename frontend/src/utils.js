function navigateTo(path) {
	history.pushState({}, "", path);
}

function checkScreenWidth() {
	isMobile = (window.innerWidth < 768 || window.innerHeight < 524);
}

checkScreenWidth();
window.addEventListener('resize', checkScreenWidth);
