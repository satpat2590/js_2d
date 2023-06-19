const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World!");
});
  
// Catch Ctrl+C and exit with message
process.on('SIGINT', () => {
    console.log('\nProcess %d is being terminated.', process.pid);
    console.log('Stopping Server...\n');
    process.exit(0);
});
  
// Listen on this port and print message
let server = app.listen(3000, () => {
    console.log('Starting Server... (PID %d)', process.pid);
    console.log('Listening on http://127.0.0.1:%d', server.address().port);
});