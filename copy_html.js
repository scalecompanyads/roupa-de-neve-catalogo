const fs = require('fs');
const f = fs.readdirSync('.').find(x => x.toLowerCase().endsWith('.html'));
if (!f) { console.log('nao encontrado'); process.exit(1); }
fs.copyFileSync(f, 'catalogo_temp.html');
console.log('copiado: ' + f);
