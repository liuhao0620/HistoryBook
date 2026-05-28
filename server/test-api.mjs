import http from 'http';

const data = JSON.stringify({ scenarioId: 'chibi' });
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/game/new',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    const parsed = JSON.parse(body);
    console.log('Status:', res.statusCode);
    console.log('Body:', JSON.stringify(parsed, null, 2).slice(0, 500));
    if (parsed.ok) {
      console.log('SUCCESS: Game started!');
    } else {
      console.log('FAILED:', parsed.error);
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
