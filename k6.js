/* eslint-disable-next-line import/no-unresolved */
import http from 'k6/http';

export default () => {
    const payload = JSON.stringify({ html: 'hello world' });
    const headers = { 'Content-Type': 'application/json' };
    http.post('http://localhost:3000', payload, { headers });
};
