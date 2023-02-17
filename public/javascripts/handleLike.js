// This file handles liking a post or comment

// Changes the dom accordingly (if liking, make the heart turn red, if unliking, turn the heart back to white)
function handleDom(target, sibling) {
  let likeNumber;
  if (target.classList.contains('liked')) {
    likeNumber = Number(sibling.textContent) - 1;
  } else {
    likeNumber = Number(sibling.textContent) + 1;
  }
  // eslint-disable-next-line no-param-reassign
  sibling.textContent = likeNumber;
  target.classList.toggle('liked');
}

// Sends request to server
async function sendRequestToServer(target, parent, sibling, url) {
  try {
    await fetch(url, { method: 'POST' });
    handleDom(target, sibling);
  } catch (error) {
    throw new Error(error);
  }
}

// event delegation
document.addEventListener('click', (e) => {
  const target = e.target.closest('svg');
  if (!target) return;
  if (!target.classList.contains('feather-heart')) return;

  const parent = target.parentElement;
  const url = `${window.location.protocol}//${window.location.host}${parent.dataset.action}`;

  sendRequestToServer(target, parent, parent.querySelector('span'), url);
});
