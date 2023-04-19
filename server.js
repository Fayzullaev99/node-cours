const http = require('http')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises
const logEvents = require('./logEvents')
const EventEmitter = require('events')

class MyEmitter extends EventEmitter { }

const myEmitter = new MyEmitter()
myEmitter.on('log',(msg,fileName)=> logEvents(msg,fileName))

const PORT = process.env.PORT || 3500
const serveFile = async(filePath,contentType, response)=>{
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : ''
            )
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData 
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            {'Content-Type':contentType})
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        )
    } catch (error) {
        console.log(error);
        myEmitter.emit('log',`${error.name}\t${error.message}`,'errLog.txt')
        response.statusCode = 500
        response.end()
    }
}

const server = http.createServer((req, res) => {
    console.log("req.url ==>", req.url.slice(-1));
    console.log("req.method ==>", req.method);
    myEmitter.emit('log',`${req.url}\t${req.method}`,'reqLog.txt')
    const extention = path.extname(req.url)

    console.log("extention ==>", extention);

    let contentType

    switch (extention) {
        case '.css':
            contentType = 'text/css'
            break;
        case '.js':
            contentType = 'text/javascript'
            break;
        case '.json':
            contentType = 'application/json'
            break;
        case '.jpeg':
            contentType = 'image/jpeg'
            break;
        case '.jpg':
            contentType = 'image/jpg'
            break;
        case '.png':
            contentType = 'image/png'
            break;
        case '.txt':
            contentType = 'text/plain'
            break;

        default:
            contentType = 'text/html'
            break;
    }

    let filePath = contentType === 'text/html' && req.url === '/'
        ? path.join(__dirname, 'views', 'index.html')
        : contentType === 'text/html' && req.url.slice(-1) === '/'
            ? path.join(__dirname, 'views', req.url, 'index.html')
            : contentType === 'text/html'
                ? path.join(__dirname, 'views', req.url)
                : path.join(__dirname, req.url)

    console.log("filePath1 ==>", filePath);

    if (!extention && req.url.slice(-1) !== '/') filePath += '.html'

    console.log("filePath2 ==>", filePath);

    const fileExists = fs.existsSync(filePath)
    console.log("fileExists ==>", fileExists);
    if (fileExists) {
        serveFile(filePath,contentType,res)
    } else {
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/new-page.html' })
                res.end()
                break;
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' })
                res.end()
                break;
            default:
                serveFile(path.join(__dirname,'views','404.html'),'text/html',res)
                break;
        }
    }



    // let path

    // with if state

    // if (req.url === '/' || req.url === 'index.html') {
    //     res.statusCode = 200
    //     res.setHeader('Content-Type','text/html')
    //     path = path.join(__dirname, 'views','index.html')
    //     fs.readFile(path,'utf8',(err,data)=>{
    //         res.end(data)
    //     })
    // }

    // with switch state
    // switch (req.url) {
    //     case '/':
    //         res.statusCode = 200
    //         path = path.join(__dirname, 'views', 'index.html')
    //         fs.readFile(path, 'utf8', (err, data) => {
    //             res.end(data)
    //         })
    //         break;
    // }

})
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
