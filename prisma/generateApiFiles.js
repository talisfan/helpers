const path = require('path');
const fs = require('fs');

const models = [
    'groups',
    'roles',
    'companies',
    'users'
];

function capitalizeFirstLetter(input, upperCase = true) {
    return (upperCase)
        ? input.charAt(0).toUpperCase() + input.slice(1)
        : input.charAt(0).toLowerCase() + input.slice(1)
    ;
}

const dirPath = path.resolve('src');
for(const model of models){
    const modelFilePath = path.join(dirPath, 'models', capitalizeFirstLetter(model) + '.ts');
    const controllerFilePath = path.join(dirPath, 'controllers', capitalizeFirstLetter(model) + 'Controller.ts');

    // MODELS
    if(!fs.existsSync(modelFilePath)){
        const data = `import { ${model} } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { buildSqlToPrismaClosures, prisma } from "../modules/prisma";

class ${capitalizeFirstLetter(model)} {
    async get(id: string) {
        const res = await prisma.${model}.findFirst({ where: { id } });
        return res;
    }

    async create(data: any) {
        const res = await prisma.${model}.create({ data });
        return res;
    }
    
    async update(id: string, data: ${model}) {
        const res = await prisma.${model}.update({
            where: { id },
            data
        });

        return res;
    }

    async delete(id: string) {
        const res = await prisma.${model}.delete({
            where: { id }
        });

        return res;
    }

    async search<T extends Prisma.${model}FindManyArgs>(
        whereClosure?: string | Prisma.SelectSubset<T, Prisma.${model}FindManyArgs>['where'], 
        orderByClosure?: string | Prisma.SelectSubset<T, Prisma.${model}FindManyArgs>['orderBy']
    ) {
        const { where, orderBy } = buildSqlToPrismaClosures(whereClosure, orderByClosure);
        const res: ${model}[] | [] = await prisma.${model}.findMany({
            where,
            orderBy
        });
        return res;
    }
}

export default new ${capitalizeFirstLetter(model)}();`
        ;

        fs.writeFileSync(modelFilePath, data);
        console.log(modelFilePath + ` created`)
    }

    // CONTROLLERS
    if(!fs.existsSync(controllerFilePath)){
        const data = `import { Request, Response, NextFunction } from "express";
import ${capitalizeFirstLetter(model)} from "../models/${capitalizeFirstLetter(model)}";
import { UserData } from "../models/types";

class ${capitalizeFirstLetter(model)}Controller {
    async create(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        try {
            const ${model} = await ${capitalizeFirstLetter(model)}.create(data);
            return res.status(201).json(${model});
        } catch (error) {
            return next(error);
        }
    }

    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const userData: UserData = req.cookies.userData;
            const id = req.params?.id || userData.${model}Id;
            const ${model} = await ${capitalizeFirstLetter(model)}.get(id);
            return res.status(200).json(${model});
        } catch (error) {
            return next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            let { id } = req.params;
            if(!id){
                const userData: UserData = req.cookies.userData;
                id = userData.${model}Id;
            }

            const response = await ${capitalizeFirstLetter(model)}.update(id, req.body);
            return res.status(204).json(response);
        } catch (error) {
            return next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction){
        try {
            let { id } = req.params;
            const response = await ${capitalizeFirstLetter(model)}.delete(id);
            return res.status(204).json(response);
        } catch (error) {
            return next(error);
        }
    }

    async search(req: Request, res: Response, next: NextFunction){
        try {
            const { where, orderBy, ...propsWhere } = <any> req.query;
            const response = await ${capitalizeFirstLetter(model)}.search(where || propsWhere, orderBy);
            return res.status(200).json(response);
        } catch (error) {
            return next(error);
        }
    }
}
export default new ${capitalizeFirstLetter(model)}Controller();`
        ;

        fs.writeFileSync(controllerFilePath, data);
        console.log(controllerFilePath + ` created`)
    }
}