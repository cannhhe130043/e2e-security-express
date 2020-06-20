### Installation
```bash
    git clone git@bitbucket.org:missingcorner/e2e_security.git
```

### Start your project
```bash
    cd your-project
```

### To start server request:
```bash
    cd server/server-request 
    tsnd src/server.ts 
```

### To start server response:
```bash
    cd server/server-response
    tsnd src/server.ts
```

### To start fake server response:
```bash
    cd server/server-fake-res
    tsnd src/server.ts
```

### - Note: Fake server response and server response run on the same port

### To run test ping:
```bash
    cd server/server-request 
    tsnd test/test.ping.ts
```
