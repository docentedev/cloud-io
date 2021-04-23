import express, { static as staticExpress } from 'express';
import { promises as fs } from 'fs';
import path from 'path'
import { join } from 'path';
import fileUpload from 'express-fileupload';
// import { extension } from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import { add, getAll, get, remove } from './data/files';
// import { name } from 'file-loader';

const staticFolder = join(process.cwd(), 'static')
const staticUrl = 'static'

const uploadFolder = join(process.cwd(), 'upload')
const uploadUrl = 'upload'
const app = express()

const port = 3000

const whitelist = ['*']
app.use(cors(whitelist))
app.use(`/${uploadUrl}`, staticExpress(uploadFolder))
app.use(`/${staticUrl}`, staticExpress(staticFolder))
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}))

app.get('/', function(req, res) {
    res.sendFile(path.join(process.cwd(), 'static', 'indexProd.html'));
});

app.get('/api/files', async(req, res) => {
    const data = await getAll()
    var fullUrl = req.protocol + '://localhost:' + port;
    const dataWithHost = data.map(e => ({
        ...e,
        url: `${fullUrl}/${uploadUrl}/${e.url}`,
        name: decodeURI(e.name),
    }))
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(dataWithHost))
})

app.delete('/api/files/:id', async(req, res) => {
    try {
        const data = await get(req.params.id)
        if (data && data.hash) {
            await fs.unlink(join(uploadFolder, data.hash))
            await remove(data.id)
            res.send(JSON.stringify(data))
        } else {
            throw new Error('NOT_FOUND')
        }
    } catch (error) {
        res.status(404).send(JSON.stringify({ message: error.message }))
    }
})

app.post('/api/files/action/upload', async(req, res) => {
    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files]
    for (const file of files) {
        const fileExtension = file.name.split('.').reverse()[0]
        const hashName = `${uuidv4(file.name)}.${fileExtension}`
        await add({
            url: `${hashName}`,
            create_at: new Date().getTime(),
            ext: fileExtension,
            hash: hashName,
            name: encodeURI(file.name),
        })
        await fs.writeFile(join(uploadFolder, hashName), file.data)
    }

    res.send({ message: 'ok' })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})