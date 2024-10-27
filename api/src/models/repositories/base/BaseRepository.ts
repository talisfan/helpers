import { PrismaClient, Prisma } from "@prisma/client";
import { IRepository } from "./iRepository";

export class BaseRepository<ModelName extends Prisma.ModelName, TypeItem> implements IRepository<TypeItem> {
    private prisma: PrismaClient;
    private model: PrismaClient[ModelName];

    constructor(modelName: ModelName) {
        this.prisma = new PrismaClient();
        this.model = this.prisma[modelName];
    }

    async create(data: Parameters<typeof this.model.create>[0]["data"]) {
        return await (this.model as any).create({ data });
    }

    async get(key: Parameters<(typeof this.model.findFirst)>[0]["where"]) {
        return await (this.model as any).findFirst({
            where: key
        });
    }

    async update(
        where: Parameters<(typeof this.model.update)>[0]["where"],
        data: Parameters<(typeof this.model.update)>[0]["data"]
    ) {
        return await (this.model as any).update({
            where,
            data,
        });
    }

    async deleteItem(where: Parameters<(typeof this.model.delete)>[0]['where']) {
        return await (this.model as any).delete({
            where,
        });
    }

    async search(
        whereProps?: Parameters<typeof this.model.findMany>[0]['where'], 
        orderBy?: Parameters<typeof this.model.findMany>[0]['orderBy'],
        limit: number = 10, 
        skip: number = 0, 
        select?: Parameters<typeof this.model.findMany>[0]['select'] 
    ) {
        return await (this.model as any).findMany({
            where: whereProps,
            orderBy: orderBy || { createdAt: 'desc' },
            select,
            take: Number(limit || 10),
            skip: Number(skip || 0)
        });
    }
}
