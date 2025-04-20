const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../lib/exp'); // This imports the same app instance

describe('POST /upload/:folder', () => {
    const folder = 'test-folder';
    const filename = 'test-image.jpg';
    const testData = Buffer.from('fake image data from string.');
    const testPath = path.join(__dirname, '..', 'images', folder, filename);

    before(() => { if (fs.existsSync(testPath)) fs.unlinkSync(testPath); });
    after(() => { if (fs.existsSync(testPath)) fs.unlinkSync(testPath); });

    it('should upload a file successfully', done => {
        request(app)
            .post(`/upload/${folder}`)
            .set('x-filename', filename)
            .set('Content-Type', 'application/octet-stream')
            .send(testData)
            .expect(200)
            .expect(res => {
                if (res.body.name !== filename) throw new Error('filename mismatch in response.')
            })
            .end(done);
    });

    it('should download the same file with matching contents', done => {
        request(app)
            .get(`/image/${folder}/${filename}`)
            .expect(200)
            .expect('Content-Type', /octet-stream|binary|application\/octet-stream|image/)
            .buffer()
            .parse((res, callback) => {
                let data = [];
                res.on('data', chunk => data.push(chunk));
                res.on('end', () => callback(null, Buffer.concat(data)));
            })
            .expect(res => {
                if (!res.body.equals(testData)) throw new Error('downloaded file does not match uploaded data.');
            })
            .end(done);
    });
});