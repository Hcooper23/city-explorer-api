function handleNotFoundError(req, res) {
  res.status(404).send('Invalid URL');
}

function handleServerError(error, req, res) {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    res.status(error.response.status).send(error.response.data);
  } else if (error.request) {
    console.log(error.request);
    res.status(500).send('Server did not respond');
  } else {
    console.log('Error', error.message);
    res.status(500).send('Error: ' + error.message);
  }
}

module.exports = {
  handleNotFoundError,
  handleServerError,
};
