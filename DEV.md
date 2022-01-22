# Developer documentation

## publish to npm @latest

- checkout ```master``` branch
- optional: set version in ```projects/ngx-ccu-jack-client/package.json```
  
  ```bash
	cd projects/ngx-ccu-jack-client
	npm version X.Y.Z
  ```

- push
- set tag ```vX.Y.Z```
- push
- wait for publish and release creation
- optional: edit content of created release

## publish to npm @next

- checkout ```master``` branch
- set version in ```projects/ngx-ccu-jack-client/package.json```
  
  ```bash
	cd projects/ngx-ccu-jack-client
	npm version X.Y.Z
  ```

- push
- start workflow ```manual_publish``` manually
