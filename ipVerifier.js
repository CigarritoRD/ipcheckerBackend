import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.VIRUSTOTAL_API_KEY;
const BASE_URL = 'https://www.virustotal.com/api/v3/ip_addresses/';

export async function verificarIP(ip) {
    
    if (!ip) {
        console.error('IP no válida:', ip);
        return 'Error';
    }
    console.error(`Verificando la IP: ${BASE_URL}${ip}`);
    try {
       
        const response = await axios.get(`${BASE_URL}${ip}`, {
            
            headers: { 'x-apikey': API_KEY },
        });
        const data = response.data.data.attributes;
        return data.last_analysis_stats.malicious > 0 ? 'Maliciosa' : 'Buena';
    } catch (error) {
        console.error(`Error al verificar la IP ${ip}:`, error.message);
        return 'Error';
    }
}
