const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../lib/exp'); // This imports the same app instance

const {baseDir} = require('../lib/config');

describe('POST /upload/:folder -> GET /image/:folder/:name', () => {
    const folder = 'test-folder';
    const filename = 'test-image.jpg';
    const testData = Buffer.from('fake image data from string.');
    const testPath = path.join(baseDir, folder, filename);

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

describe('GET /image/:folder/:name with an invalid name', () => {
    it('sholud return 404 and serve the fallback image when *folder and file* dont exist.', done => {
        request(app)
            .get('/image/adwoiahd/awdawd')
            .expect(404)
            .expect('Content-Type', /image\/png/)
            .end((err, res) => {
                if (err) return done(err);

				const fallbackPath = path.join(baseDir, 'fallback', 'fb.png');
				const fallbackBuffer = fs.readFileSync(fallbackPath);
				if (!res.body.equals(fallbackBuffer)) {
					return done(new Error('Response does not match fallback image'));
				}

				done();
            });
    });

    it('sholud return 404 and serve the fallback image when *file* doesnt exist but folder (test-folder) does.', done => {
        request(app)
            .get('/image/test-folder/awdawd')
            .expect(404)
            .expect('Content-Type', /image\/png/)
            .end((err, res) => {
                if (err) return done(err);

				const fallbackPath = path.join(baseDir, 'fallback', 'fb.png');
				const fallbackBuffer = fs.readFileSync(fallbackPath);
				if (!res.body.equals(fallbackBuffer)) {
					return done(new Error('Response does not match fallback image'));
				}

				done();
            });
    });
});