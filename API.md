# Images API documentation

### /upload/:folder - POST

```
headers: {
    'Content-Type': 'application/octet-stream',
    'x-filename': 'fileName',
    'x-api-key': 'key'
}
```

#### 200

```{ name: "<filename.ext>" }```

#### 400

no x-filename header

```{error: 'Missing filename}```

attempt to upload to folder not included in FOLDERS environment variable

```{error: 'Invalid upload folder'}```

#### 403

missing/incorrect api-key

```{error: 'Unauthorised upload attempt'}```

#### 500

server error

```{error: 'Server error: failed to save image'}```

----

### /image/:folder/:name - GET

#### 200

image

#### 404

fallback image

#### 500

```{error: 'Server error'}```
