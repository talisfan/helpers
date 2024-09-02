import { google } from 'googleapis';
import GoogleDrive from "./GoogleDrive";

class GoogleSheets extends GoogleDrive {
    /**
    * 
    * @returns {{ 'sheet_name': csvRaw }}
    */

    getSpreadsheet(fileId, sheet = [], delimiter = '|'): Promise<any> {
        return new Promise((resolve, reject) => {
            this.callGDriveApi(async (auth) => {

                const googleSheets = google.sheets({ version: 'v4', auth });
                const file = await googleSheets.spreadsheets.get({
                    spreadsheetId: fileId,
                    ranges: sheet || [],
                    includeGridData: false
                });

                const sheetsData = file.data.sheets;
                const sheetsObj = {};

                for (const sheet of sheetsData) {
                    const sheetTilte = sheet.properties.title;
                    
                    const response = await googleSheets.spreadsheets.values.get({
                        spreadsheetId: fileId,
                        range: `'${sheet.properties.title}'`,
                        valueRenderOption: 'FORMATTED_VALUE',
                        dateTimeRenderOption: 'FORMATTED_STRING',
                        majorDimension: 'ROWS'
                    });
                    
                    let csvData = '';
                    const sheetData = response.data.values;

                    if (sheetData && sheetData.length > 0) {
                        const headers = sheetData[0];
                        csvData += headers.join(delimiter) + '\n';

                        for(let rawIndex = 1;  rawIndex < sheetData.length; rawIndex++){
                            for(let headerIndex in headers){
                                if(sheetData[rawIndex][headerIndex]){
                                    csvData += sheetData[rawIndex][headerIndex];
                                }
                                
                                if(Number(headerIndex) !== headers.length-1)
                                    csvData += delimiter;
                            }
                            csvData += '\n';
                        }
                    }
                    sheetsObj[sheetTilte] = csvData;
                }

                return resolve(sheetsObj);
            })
        })
    }

    updateSheet(spreadsheetId, sheetTabName, data) {
        return new Promise((resolve, reject) => {
            this.callGDriveApi(async (auth) => {
                try {
                    const googleSheets = google.sheets({ version: 'v4', auth });

                    // Obter o intervalo de células para a aba específica
                    const range = `'${sheetTabName}'!A1:Z${data.length+1}`;

                    // Converter os dados em uma matriz de valores
                    const values = [ 
                        Object.keys(data[0]), 
                        ...data.map(row => Object.values(row))
                    ]
                     
                    // Criar a solicitação de atualização das células
                    const request = {
                        spreadsheetId,
                        range,
                        valueInputOption: 'USER_ENTERED',
                        resource: { values },
                    };

                    // Enviar a solicitação para atualizar as células da planilha
                    const response = await googleSheets.spreadsheets.values.update(request);

                    console.log('Planilha atualizada com sucesso:', response.data);
                    return resolve(response.data);
                } catch (error) {
                    console.error('Erro ao atualizar a planilha:', error);
                    return reject(error);
                }
            })
        })
    }


    updateSpreadsheetWithMultipleSheets(spreadsheetId, sheets = { 'aba_1': [] }) {
        return new Promise((resolve, reject) => {
            this.callGDriveApi(async (auth) => {
                try {
                    const googleSheets = google.sheets({ version: 'v4', auth });
                    // Cria as abas (páginas) na planilha e define o conteúdo para cada aba
                    const sheetNames = Object.keys(sheets);

                    // Obtém os IDs das abas existentes
                    const { data } = await googleSheets.spreadsheets.get({
                        spreadsheetId,
                    });

                    const sheetIds = data.sheets.reduce((ids, sheet) => {
                        const sheetName = sheet.properties.title;
                        if (sheetNames.includes(sheetName)) {
                            ids[sheetName] = sheet.properties.sheetId;
                        }
                        return ids;
                    }, {});

                    let requests = [];

                    Object.entries(sheets).forEach(([sheetName, sheetContent]) => {
                        const sheetId = sheetIds[sheetName];

                        // Adiciona solicitação para criar a aba se não existir
                        if (!sheetId && sheetId !== 0) {
                            requests.push({
                                addSheet: {
                                    properties: {
                                        title: sheetName,
                                    },
                                },
                            });
                        }

                        // Adicionar linha de cabeçalhos
                        const headerRow = Object.keys(sheetContent[0]).reduce((row, header) => {
                            row.push({
                                userEnteredValue: { stringValue: header },
                            });
                            return row;
                        }, []);

                        // Adiciona solicitação para atualizar as células da aba com o conteúdo
                        const rows = [];

                        rows.push({
                            values: headerRow,
                        });

                        // Adicionar linhas de conteúdo
                        sheetContent.forEach((row) => {
                            const values = Object.values(row).map((value) => ({
                                userEnteredValue: { stringValue: value.toString() || 'false' },
                            }));

                            rows.push({
                                values,
                            });
                        });

                        requests.push({
                            updateCells: {
                                range: {
                                    sheetId: sheetId || 0, // ID da aba (ou 0 se não existir)
                                },
                                rows,
                                fields: 'userEnteredValue',

                            },
                        });
                    });

                    // Cria as abas e insere o conteúdo na planilha
                    const sheetsRequest = {
                        spreadsheetId,
                        resource: {
                            requests
                        }
                    };

                    await googleSheets.spreadsheets.batchUpdate(sheetsRequest);

                    console.log('Planilha atualizada com sucesso. ID da planilha:', spreadsheetId);
                    return resolve(spreadsheetId);
                } catch (error) {
                    console.error('Erro ao atualizar a planilha:', error);
                    return reject(error);
                }
            });
        })
    };

    uploadSimpleCsv(fileName, data, mimeType = "text/csv") {
        return new Promise((resolve, reject) => {
            this.callGDriveApi((auth) => {
                const fileMetadata = {
                    name: fileName,
                    mimeType
                };

                const media = {
                    mimeType,
                    body: data
                }

                const drive = google.drive({ version: 'v3', auth });
                drive.files.create({
                    requestBody: fileMetadata,
                    media,
                    fields: 'id'
                }, function (err, file) {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(file.data.id);
                    }
                });
            });
        })
    }
}

export default new GoogleSheets();