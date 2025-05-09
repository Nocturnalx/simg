const request = require('supertest');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const app = require('../app');
require('dotenv').config();

//make sure test folder exists
require('../lib/folders').checkFolders(['test-folder']);

const {baseDir} = require('../config/config');

const API_KEY = process.env.API_KEY;


describe('Full flow: (POST /upload/:folder -> GET /image/:folder/:name -> POST /remove/:folder/:name)', () => {
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
            .set('x-api-key', API_KEY)
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
    
    it('should delete the uploaded file successfully', done => {
        request(app)
            .delete(`/remove/${folder}/${filename}`)
            .set('x-api-key', API_KEY)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(res => {
                if (!res.body.message.includes('successfully deleted')) {
                    throw new Error('File was not deleted successfully.');
                }
            })
            .end(err => {
                if (err) return done(err);
                if (fs.existsSync(testPath)) {
                    return done(new Error('File still exists after delete.'));
                }
                done();
            });
    });
});

describe('POST /upload/:folder', () => {
	const validFolder = 'test-folder';
	const invalidFolder = 'notallowed';
	const filename = 'test-image.jpg';
	const testData = Buffer.from('fake image data from string.');
	const testPath = path.join(baseDir, validFolder, filename);
	const invalidTestPath = path.join(baseDir, invalidFolder, filename);

	after(() => {
		if (fs.existsSync(testPath)) fs.unlinkSync(testPath);
		if (fs.existsSync(invalidTestPath)) fs.unlinkSync(invalidTestPath);
	});

	it('should reject upload to an invalid folder (400)', done => {
		request(app)
			.post(`/upload/${invalidFolder}`)
			.set('x-filename', filename)
			.set('x-api-key', API_KEY)
			.set('Content-Type', 'application/octet-stream')
			.send(testData)
			.expect(400)
			.expect(res => {
				if (res.body.code !== 'INVFLDR') throw new Error('Expected INVFLDR error code');
			})
			.end(done);
	});

	it('should reject upload without x-filename header (400)', done => {
		request(app)
			.post(`/upload/${validFolder}`)
			.set('x-api-key', API_KEY)
			.set('Content-Type', 'application/octet-stream')
			.send(testData)
			.expect(400)
			.expect(res => {
				if (res.body.code !== 'INVNAME') throw new Error('Expected INVNAME error code');
			})
			.end(done);
	});

	it('should reject upload with NO x-api-key header (403)', done => {
		request(app)
			.post(`/upload/${validFolder}`)
			.set('x-filename', filename)
			.set('Content-Type', 'application/octet-stream')
			.send(testData)
			.expect(403)
			.expect(res => {
				if (res.body.code !== 'INVKEY') throw new Error('Expected INVKEY error code');
			})
			.end(done);
	});

	it('should reject upload with INVALID x-api-key header (403)', done => {
		request(app)
			.post(`/upload/${validFolder}`)
			.set('x-filename', filename)
			.set('x-api-key', 'invalid_API_key')
			.set('Content-Type', 'application/octet-stream')
			.send(testData)
			.expect(403)
			.expect(res => {
				if (res.body.code !== 'INVKEY') throw new Error('Expected INVKEY error code');
			})
			.end(done);
	});
});


describe('DELETE /remove/:folder/:name', () => {
	const validFolder = 'test-folder';
	const invalidFolder = 'notallowed';
	const filename = 'test-image.jpg';
	const testData = Buffer.from('fake image data from string.');
	const testPath = path.join(baseDir, validFolder, filename);
	const invalidTestPath = path.join(baseDir, invalidFolder, filename);

	before(done => {
		request(app)
			.post(`/upload/${validFolder}`)
			.set('x-filename', filename)
			.set('x-api-key', API_KEY)
			.set('Content-Type', 'application/octet-stream')
			.send(testData)
			.expect(200)
			.end(done);
	});

	after(() => {
		if (fs.existsSync(testPath)) fs.unlinkSync(testPath);
		if (fs.existsSync(invalidTestPath)) fs.unlinkSync(invalidTestPath);
	});

	it('should reject delete when no file (404)', done => {
		request(app)
			.delete(`/remove/${validFolder}/invalidFilename`)
			.set('x-api-key', API_KEY)
			.send()
			.expect(404)
			.expect(res => {
				if (res.body.code !== 'FNF') throw new Error('Expected FNF error code');
			})
			.end(done);
	});

	it('should reject delete from an invalid folder (400)', done => {
		request(app)
			.delete(`/remove/${invalidFolder}/${filename}`)
			.set('x-api-key', API_KEY)
			.send()
			.expect(400)
			.expect(res => {
				if (res.body.code !== 'INVFLDR') throw new Error('Expected INVFLDR error code');
			})
			.end(done);
	});

	it('should reject delete with NO x-api-key header (403)', done => {
		request(app)
			.delete(`/remove/${validFolder}/${filename}`)
			.send()
			.expect(403)
			.expect(res => {
				if (res.body.code !== 'INVKEY') throw new Error('Expected INVKEY error code');
			})
			.end(done);
	});

	it('should reject delete with INVALID x-api-key header (403)', done => {
		request(app)
			.delete(`/remove/${validFolder}/${filename}`)
			.set('x-api-key', 'invalid_API_key')
			.send()
			.expect(403)
			.expect(res => {
				if (res.body.code !== 'INVKEY') throw new Error('Expected INVKEY error code');
			})
			.end(done);
	});
});


describe('GET /image/:folder/:name', () => {

    it('sholud serve the fallback image when *folder and file* dont exist (404)', done => {
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

    it('sholud serve the fallback image when *file* doesnt exist but folder (test-folder) does (404)', done => {
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