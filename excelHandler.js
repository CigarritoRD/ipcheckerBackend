import xlsx from 'xlsx';
import fs from 'node:fs';
import path from 'node:path';

export function leerIPsDeExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet).map(row => row.IP);
}

export function crearArchivoExcel(resultados, outputFileName) {
    const resultadosOrdenados = resultados.sort((a, b) => a.Estado.localeCompare(b.Estado));
    const worksheet = xlsx.utils.json_to_sheet(resultadosOrdenados);
    const workbookNuevo = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbookNuevo, worksheet, 'Resultados');
    
    const outputPath = path.join('uploads', outputFileName);
    xlsx.writeFile(workbookNuevo, outputPath);
    return outputPath;
}

export function eliminarArchivo(filePath) {
    fs.unlinkSync(filePath);
}
