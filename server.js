const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const { url } = req;

  if (url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>About Us</h1>');
  } else if (url === '/home') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Home Page</h1>');
  } else {
    // Task 2: Log the request to errors.log
    fs.open('errors.log', 'a', (err, fd) => {
      if (err) throw err;
      const logEntry = `${url} - ${new Date().toISOString()}\n`;
      fs.write(fd, logEntry, (err) => {
        if (err) throw err;
        fs.close(fd, (err) => {
          if (err) throw err;
          // Task 3: Limit the number of lines in the file to 5
          fs.readFile('errors.log', 'utf8', (err, data) => {
            if (err) throw err;
            const lines = data.split('\n').slice(0, 5);
            fs.writeFile('errors.log', lines.join('\n'), (err) => {
              if (err) throw err;
            });
          });
        });
      });
    });

    // Task 1: Handle all other requests
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  }
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});