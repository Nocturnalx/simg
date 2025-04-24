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

```
{
    error: 'Invalid file name',
    code: 'INVNAME'
}
```

attempt to upload to folder not included in FOLDERS environment variable

```
{
    error: 'Invalid folder name',
    code: 'INVFLDR'
}
```

#### 403
missing/incorrect api-key

```
{
    error: 'Invalid api key',
    code: 'INVKEY'
}
```

#### 500
server error

```{error: 'Internal server error'}```

----

### /remove/:folder/:name - DELETE

#### 200

#### 400
no x-filename header

```
{
    error: 'Invalid file name',
    code: 'INVNAME'
}
```

attempt to delete from folder not included in FOLDERS environment variable

```
{
    error: 'Invalid folder name',
    code: 'INVFLDR'
}
```

#### 403
missing/incorrect api-key

```
{
    error: 'Invalid api key',
    code: 'INVKEY'
}
```

#### 404
Could not find image to delete it

```
{
    error: 'File not found',
    code: 'FNF'
}
```

#### 500
server error

```{error: 'Internal server error'}```

----

### /image/:folder/:name - GET

#### 200

image

#### 404

fallback image

#### 500

```{error: 'Server error'}```
