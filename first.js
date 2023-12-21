const http = require('http');
const url = require('url');
const querystring = require('querystring'); // Required for parsing form data

const hostname = '127.0.0.1';
const port = 3002;

let previousMessage = ''; // Variable to store the submitted message

const server = http.createServer((req, res) => {
    const path = url.parse(req.url).pathname;
    const method = req.method;

    if (path === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html>');
        res.write('<head><title>My form</title></head>');
        res.write('<body>');

        // Display previous message (if any)
        if (previousMessage) {
            res.write(`<div>Previous Message: ${previousMessage}</div>`);
        }

        res.write('<form action="/message" method="POST">');
        res.write('<input type="text" name="message">');
        res.write('<button type="submit">Submit</button>');
        res.write('</form>');
        res.write('</body></html>');
        return res.end();
    }

    if (path === '/message' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // Collect the incoming data
        });
        req.on('end', () => {
            const parsedData = querystring.parse(body); // Parse the form data
            const message = parsedData.message; // Extract the 'message' field
            console.log(message); // Log the message to the console
            previousMessage = message; // Store the message for display

            // Redirect to the root after form submission
            res.writeHead(302, { 'Location': '/' });
            return res.end();
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('<html><body><h1>404 - Not Found</h1></body></html>');
        res.end();
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
