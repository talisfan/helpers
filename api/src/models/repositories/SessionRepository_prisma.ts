import { Session } from "@prisma/client";
import { buildSqlToPrismaClosures, prisma } from "../modules/prisma";

const ALL_RELATIONSHIPS = {
    user: true,
    exemplo2: true
}
export default class SessionRepository{

    async get(id: string): Promise<string>{
        const value = await prisma.sessions.findFirst({ 
            where: { id },
            include: ALL_RELATIONSHIPS
        });

        return value;
    }

    async create(data: Session): Promise<any>{
        return await prisma.sessions.create({ data });
    }

    async search(whereSql?: string | any, orderByStr?: string | any) {
        const { where, orderBy } = buildSqlToPrismaClosures(whereSql, orderByStr);
        return await prisma.role.findMany({ where, orderBy });
    }

    async delete(id: string){
        return await prisma.sessions.delete({ where: { id } });
    }

    async update(id: string, data: Session) {
        
        const relations = Object.entries(data)
        .reduce((prev: any, [key, value])=>{
            if(ALL_RELATIONSHIPS[key]){
                const id = value['id'] || undefined;
                delete value['id'];

                prev[key] = {
                    upsert: {
                      where: { id },
                      update: value,
                      create: value
                    }
                }
            }
            return prev;
        }, {});

        return await prisma.architecturalProjects.update({ 
            data: { ...data, ...relations }, 
            where: { projectID: id },
            include: ALL_RELATIONSHIPS
        });
    }
}