const fs = require('fs');
const path = require('path');

const baseDir = 'public';
const folders = ['fruits', 'vegetables', 'valluvam'];
const categories = {
    'fruits': 'Fruits',
    'vegetables': 'Vegetables',
    'valluvam': 'Valluvam Products'
};

const defaultPrices = {
    'Fruits': 120.00,
    'Vegetables': 40.00,
    'Valluvam Products': 250.00
};

const defaultUnits = {
    'Fruits': 'kg',
    'Vegetables': 'kg',
    'Valluvam Products': '1L'
};

const products = [];
let idCounter = 1;

folders.forEach(folder => {
    const dirPath = path.join(baseDir, folder);
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        if (!file.match(/\.(jpg|jpeg|png|webp|jfif|avif)$/i)) return;

        const name = file.replace(/\.[^/.]+$/, "")
                        .replace(/[-_]/g, ' ')
                        .replace(/\b\w/g, l => l.toUpperCase());
        
        const category = categories[folder];
        const id = `${folder[0]}-${idCounter++}`;
        
        products.push({
            id,
            name,
            category,
            price: defaultPrices[category] || 50.00,
            image_url: `/${folder}/${file}`,
            description: `Premium quality fresh ${name.toLowerCase()} directly from our organic farms.`,
            unit: defaultUnits[category] || 'kg',
            pairsWith: [],
            tags: ['fresh', folder]
        });
    });
});

console.log(JSON.stringify(products, null, 2));
