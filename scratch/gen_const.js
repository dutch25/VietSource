const fs = require('fs');

const dbSuper = JSON.parse(fs.readFileSync('db_super.json'));
const db = JSON.parse(fs.readFileSync('db.json'));

function toChapters(items) {
    return items.map((item, index) => {
        const id = item.id.split('?')[0]; // remove ?m=0
        return `    { id: '${id}', num: ${index + 1}, name: '${item.title.replace(/'/g, "\\'")}' }`;
    }).join(',\n');
}

let out = `const DRAGON_BALL_SUPER_CHAPTERS = [\n${toChapters(dbSuper)}\n];\n\n`;
out += `const DRAGON_BALL_CHAPTERS = [\n${toChapters(db)}\n];\n`;

fs.writeFileSync('db_constants.ts', out);
console.log('Done');
