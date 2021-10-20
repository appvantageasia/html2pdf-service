/* eslint-disable-next-line import/no-unresolved */
import http from 'k6/http';

export default function () {
    const payload = JSON.stringify({
        html: 'hello world',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    http.post('http://localhost:3000/', payload, params);
}
