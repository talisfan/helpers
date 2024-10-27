import { Session } from "@prisma/client";
import { BaseRepository } from "./base/BaseRepository";

class Administradoras extends BaseRepository<'Session', Session>{}

export default new Administradoras('Session');