# Images API documentation
## in
### /upload/:folder - POST
```
headers: {
    'Content-Type': 'application/octet-stream',
    'X-Filename': 'fileName',
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

## out
### /image/:folder/:name - GET

#### 200
image

#### 404
backup image