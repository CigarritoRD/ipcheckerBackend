import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { verificarIP } from './ipVerifier.js';
import { leerIPsDeExcel, crearArchivoExcel, eliminarArchivo } from './excelHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

// Configuración de CORS para permitir todas las IPs
app.use(cors());

// Función para identificar IPs públicas
function esIpPublica(ip) {
    const privadas = [
        /^(10\.)/,
        /^(192\.168\.)/,
        /^(172\.(1[6-9]|2[0-9]|3[0-1])\.)/
    ];
    return !privadas.some((regex) => regex.test(ip));
}

// Endpoint para procesar el archivo Excel
app.post('/verificar-ips', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    console.error(`Archivo subido: ${filePath}`);

    // Leer archivo Excel y extraer IPs
    const ips = leerIPsDeExcel(filePath);

    // Verificar cada IP y guardar resultados
    const resultados = [];
    for (const ip of ips) {
        console.error(`Verificando la IP: ${ip}`);
        if (esIpPublica(ip)) {
            const estado = await verificarIP(ip);
            resultados.push({ IP: ip, Estado: estado });
        } else {
            resultados.push({ IP: ip, Estado: 'IP privada' });
        }
    }

    // Crear un nuevo archivo Excel con los resultados
    const outputFileName = `resultados_${Date.now()}.xlsx`;
    const outputPath = crearArchivoExcel(resultados, outputFileName);

    // Eliminar archivo temporal de subida
    eliminarArchivo(filePath);

    // Enviar el archivo de resultados para descarga
    res.download(outputPath, outputFileName, () => {
        // Eliminar el archivo de resultados después de la descarga
        eliminarArchivo(outputPath);
    });
});

// Iniciar el servidor
app.listen(port, () => console.log(`'Servidor corriendo en el puerto ${port}'`));
