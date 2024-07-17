const collection = require('./collection.json');
const fs = require('fs');

const template = {
    "name": "Get",
    "request": {
        "auth": {
            "type": "bearer",
            "bearer": [
                {
                    "key": "token",
                    "value": "{{accessToken}}",
                    "type": "string"
                }
            ]
        },
        "method": "POST",
        "header": [],
        "body": {
            "mode": "raw",
            "raw": "{}",
            "options": {
                "raw": {
                    "language": "json"
                }
            }
        },
        "url": {
            "raw": "{{baseUrl}}/",
            "host": [
                "{{baseUrl}}"
            ],
            "path": []
        }
    },
    "response": []
}

const routes = [
    'clientes',
    'administradoras'
]


for(let i = 0; i < collection.item.length; i++){
    const route = routes[i];
    let dir = collection.item[i];
    
    if(!dir){
        dir = {
            name: route,
            item: [],
            description: ""
        } 
        collection.item.push(dir)
    }
    
    template.name = "Get by ID";
    template.request.method = "GET";
    template.request.url.raw = `{{baseUrl}}/${route}/:id`;
    template.request.url.path = [ route, ':id' ];

    dir.item.push(JSON.parse(JSON.stringify(template)));

    template.name = "List All";
    template.request.method = "GET";
    template.request.url.raw = `{{baseUrl}}/${route}/search`;
    template.request.url.path = [ route, 'search' ];

    dir.item.push(JSON.parse(JSON.stringify(template)));

    template.name = "Create";
    template.request.method = "POST";
    template.request.url.raw = `{{baseUrl}}/${route}`;
    template.request.url.path = [ route ];

    dir.item.push(JSON.parse(JSON.stringify(template)));

    template.name = "Update by ID";
    template.request.method = "PATCH";
    template.request.url.raw = `{{baseUrl}}/${route}/:id`;
    template.request.url.path = [ route, ':id' ];

    dir.item.push(JSON.parse(JSON.stringify(template)));

    template.name = "Delete by ID";
    template.request.method = "DELETE";
    template.request.url.raw = `{{baseUrl}}/${route}/:id`;
    template.request.url.path = [ route, ':id' ];

    dir.item.push(JSON.parse(JSON.stringify(template)));

    collection.item[i] = dir;
    iRoutes++;
}

fs.writeFileSync('new_collection.json', JSON.stringify(collection));