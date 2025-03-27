import dotenv from "dotenv";
import { cleanEnv, str } from "envalid";
import fs from "fs";
import path from "path";
import type { ApiName } from "./@types/index.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export const env = cleanEnv(process.env, {
    SALESFORCE_BASE_URI: str(),
    SALESFORCE_USERNAME: str(),
    SALESFORCE_PASSWORD: str(),
    SALESFORCE_CLIENT_ID: str(),
    SALESFORCE_CLIENT_SECRET: str(),
    SALESFORCE_API_VERSION: str({ default: "v60.0" }),
    TRAVELAGENT_BASE_URI: str(),
    TRAVELAGENT_API_USERNAME: str(),
    TRAVELAGENT_API_PASSWORD: str(),
    LOG_LEVEL: str({
        default: "info",
        devDefault: "debug",
        choices: ["debug", "info", "warning", "error", "critical"],
    }),
    API_AUTO_RETRY: str({
        default: "true"
    }),
});

export function getTokenFile(type: "salesforce" | "travelAgent"): string {
    return type === "salesforce"
        ? "salesforce-token.txt"
        : "travelagent-token.txt";
}

export function readTokenFromFile(apiName: ApiName): string | null {
    const filepath = path.resolve(__dirname, `./files/${apiName}.token.txt`);
    try {
        if (fs.existsSync(filepath)) {
            const fileContent = fs.readFileSync(filepath, "utf8").trim();
            return fileContent || null;
        }else{
            const dirPath = path.resolve(__dirname, './files');

            if(!fs.existsSync(dirPath)){
                fs.mkdirSync(dirPath); 
            }

            fs.writeFileSync(filepath, "", "utf8");
        }
    } catch (error) {
        console.error(`[${apiName}] Erro ao ler o token no arquivo ${filepath}:`, logErrorHandler(error));
    }
    return null;
}

export function saveTokenToFile(apiName: ApiName, token: string): void {
    const filepath = path.resolve(__dirname, `./files/${apiName}.token.txt`);
    try {
        fs.writeFileSync(filepath, token, "utf8");
        console.log(`[${apiName}] Token salvo no arquivo ${filepath}.`);
    } catch (error) {
        console.error(`[${apiName}] Erro ao salvar o token no arquivo ${filepath}:`, logErrorHandler(error));
    }
}

export function logErrorHandler(error: any){
    console.error(error)
    return  (error?.response)
        ? `Status: ${error?.response.status} - Data: ${JSON.stringify(error?.response?.data, null, 2) || error?.response?.data}`
        : error?.stack || error?.message || error
    ;
        
}