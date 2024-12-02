function getTopic() {
  return window.location.pathname.split("/")[1];
}

export { getTopic };