import { Session } from "@prisma/client";
import { buildSqlToPrismaClosures, prisma } from "../modules/prisma";

export default class SessionRepository{

    async get(sessionId: string): Promise<string>{
        const value = await prisma.sessions.findFirst({ 
            where: { sessionId },
            include: { user: true }
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
}