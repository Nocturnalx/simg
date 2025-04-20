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
```{ name: "String" }```
#### 400
no x-filename header
```{error: 'missing filename}```
#### 403
missing/incorrect api-key
```{error: 'unauthorised upload attempt'}```
#### 500
```{error: 'failed to save image'}```
----
### /image/:folder/:name - GET

#### 200
image

#### 404
fallback image

#### 500
```{error: 'server error'}```