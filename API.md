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
```
{
    name: "String"
}
```
#### 40x

#### 50x

----

### /image/:folder/:name - GET

#### 200
image

#### 404
backup image