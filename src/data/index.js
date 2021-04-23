const { promises: fs } = require('fs')
const { join } = require('path')

const store = (folder, file) => {
    const source = join(__dirname, folder, file)
    const getAll = async() => {
        return JSON.parse(await fs.readFile(source, 'utf8')).data
    }

    const add = async(data) => {
        const result = JSON.parse(await fs.readFile(source, 'utf8'))
        result.id = result.id + 1
        const model = {...data, id: result.id }
        result.data.push(model)
        fs.writeFile(source, JSON.stringify(result), 'utf8')
        return model
    }

    const update = async(id, data) => {
        console.log(id, data);
        const result = JSON.parse(await fs.readFile(source, 'utf8'))
        const index = result.data.findIndex(e => e.id == id)
        const objectSave = {
            ...result.data[index],
            ...data,
            id: result.data[index].id,
        }
        result.data[index] = objectSave
        await fs.writeFile(source, JSON.stringify(result), 'utf8')
        return result.data[index]
    }

    const remove = async(id, data) => {
        const result = JSON.parse(await fs.readFile(source, 'utf8'))
        const newData = result.data.filter(e => e.id != id)
        result.data = newData
        await fs.writeFile(source, JSON.stringify(result), 'utf8')
        return true
    }

    const get = async(id) => {
        const result = JSON.parse(await fs.readFile(source, 'utf8'))
        return result.data.find(e => e.id == id)
    }

    return {
        get,
        getAll,
        add,
        update,
        remove,
    }
}
module.exports = store