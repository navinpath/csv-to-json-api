function flattenObject(obj, parent = '', res = {}) {
    for (let key in obj) {
        const propName = parent ? parent + '.' + key : key;
        if (typeof obj[key] == 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            flattenObject(obj[key], proName, res);
        } else {
            res[propName] = obj[key];
        }
    }
    return res;
}

function margeName(obj) {
    if(obj.name && obj.name.firstName && obj.name.lastName) {
        obj.name = `${obj.name.firstName} ${obj.name.lastName}`;
    }
    return obj;
}
module.exports = { flattenObject, mergeName };
