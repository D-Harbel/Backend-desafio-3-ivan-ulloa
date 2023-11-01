const fs = require('fs')

class ProductManager {
    constructor(path) {
        this.path = path
    }

    getProducts() {
        if (fs.existsSync(this.path)) {
            return JSON.parse(fs.readFileSync(this.path, "utf-8"))
        } else {
            return []
        }
    }


    addProduct(title, description, price, thumbnail, code, stock) {
        let products = this.getProducts();

        let id = 1
        if (products.length > 0) {
            id = products[products.length - 1].id + 1
        }


        let objetos = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        if (Object.values(objetos).includes(undefined)) {
            console.log("faltan campos por ingresar")
        }

        products.push(objetos);
        fs.writeFileSync(this.path, JSON.stringify(products, null, 5))


    }

    updateProduct(id, updatedProduct) {
        let products = this.getProducts();

        let index = products.findIndex(p => p.id === id)
        if (index === -1) {
            console.log(`Not found ${id}`);
            return;
        }

        const checkObject = (check) => {
            return check === Object(check)
        }

        const checkedObject = checkObject(updatedProduct)
        if (!checkedObject) {
            console.log("lo que intento agregar no es un objeto")
            return
        }

        //validar que no hayan campos vacios

        const EmptyProducts = Object.values(updatedProduct).some(value => value === '');
        if (EmptyProducts) {
            console.log("No se permiten campos vacíos")
            return;
        }


        //validar que no se agregue nada nuevo a objetos
        const existingProduct = products[index]
        const updateKeys = Object.keys(updatedProduct)

        updateKeys.forEach((key) => {
            if (existingProduct.hasOwnProperty(key)) {
                existingProduct[key] = updatedProduct[key];
            } else {
                console.log(`el parametro de objeto ${key} no corresponde al ser distinto a los designados`)
            }
        })


        fs.writeFileSync(this.path, JSON.stringify(products, null, 5))
        
    }


    getProductById(id) {
        let products = this.getProducts();

        let index = products.findIndex(producto => producto.id === id)
        if (index === -1) {
            console.log(`Not found ${id}`)
            return
        }

        return products[index]
    }

    deleteProduct(id) {
        let products = this.getProducts();

        let index = products.findIndex((product) => {
            return product.id === id;
        });
        if (index === -1) {
            console.log(`Not found ${id}`)
            return
        }

        products.splice(index, 1)
        fs.writeFileSync(this.path, JSON.stringify(products, null, 5));
        console.log("producto eliminado")
    }
}

const pm = new ProductManager("./productos.json")

//pm.addProduct('pan','masa', 5, 'sin imagen', 'pan123', 50)
//pm.addProduct('zanahoria','verdura', 2, 'sin imagen', 'zana123', 60)
//pm.addProduct('manzana','fruta', 2, 'sin imagen', 'manzana123', 70)
//pm.addProduct('coca-cola','bebida', 10, 'sin imagen', 'coca123', 30)
//pm.addProduct('papas fritas','snack', 10, 'sin imagen', 'papasfritas123', 40)
//pm.addProduct('torta','pasteleria', 15, 'sin imagen', 'torta123', 10)
//pm.addProduct('leche','lacteo', 7, 'sin imagen', 'leche123', 35)
//pm.addProduct('helado','postre', 11, 'sin imagen', 'helado123', 50)
//pm.addProduct('salmon','pescaderia', 20, 'sin imagen', 'salmon123', 15)
//pm.addProduct('spaghetti','pastas', 3, 'sin imagen', 'spag123', 42)
//pm.addProduct('nueces','fruto seco', 4, 'sin imagen', 'nuez123', 65)

module.exports = ProductManager