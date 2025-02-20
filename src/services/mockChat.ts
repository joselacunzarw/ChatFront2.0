import type { ChatResponse } from '../types/chat';

const mockResponse = `# Resumen del Régimen de Licencias

Los trabajadores tienen derecho a diferentes tipos de licencias especiales, cada una con su duración específica. A continuación se detallan algunas de estas licencias:

1. **Licencias Especiales:**
   - **Nacimiento u adopción:** 20 días corridos (varón)
   - **Matrimonio:** 10 días hábiles
   - **Matrimonio de un hijo:** 2 días hábiles
   - **Fallecimiento del cónyuge o pariente en 1° grado:** 10 días hábiles (15 días si hay hijos menores)
   - **Fallecimiento de pariente en 2° grado:** 5 días hábiles
   - **Fallecimiento de pariente político en 1° y 2° grado:** 1 día (día del deceso o sepelio)
   - **Donación de sangre:** 1 día (día de extracción)
   - **Exámenes (enseñanza media):** 20 días hábiles por año (máximo 4 días por examen)
   - **Exámenes (enseñanza superior):** 24 días hábiles por año (máximo 5 días por examen)

2. **Licencia Anual Ordinaria:**
   - Varía según la antigüedad del trabajador en la institución
   - Ejemplo:
     - Hasta 5 años: 20 días corridos
     - De 5 a 10 años: 25 días corridos
     - De 10 a 15 años: 30 días corridos
     - De 15 a 20 años: 35 días corridos
     - 20 años o más: 40 días corridos

3. **Permisos Particulares:**
   - Hasta 6 permisos al año con goce de haberes, de 1 día cada uno, para trámites personales

### Tabla de Licencias y Días

| Tipo de Licencia | Días de Licencia |
|------------------|------------------|
| Nacimiento u adopción | 20 días corridos |
| Matrimonio | 10 días hábiles |
| Matrimonio de un hijo | 2 días hábiles |
| Fallecimiento cónyuge/1° grado | 10 días hábiles (15 con hijos menores) |
| Fallecimiento 2° grado | 5 días hábiles |
| Fallecimiento pariente político | 1 día |
| Donación de sangre | 1 día |
| Exámenes (enseñanza media) | 20 días hábiles (máx. 4 por examen) |
| Exámenes (enseñanza superior) | 24 días hábiles (máx. 5 por examen) |
| Licencia Anual (hasta 5 años) | 20 días corridos |
| Licencia Anual (5-10 años) | 25 días corridos |
| Licencia Anual (10-15 años) | 30 días corridos |
| Licencia Anual (15-20 años) | 35 días corridos |
| Licencia Anual (20+ años) | 40 días corridos |
| Permisos Particulares | 6 días al año (1 día cada uno) |`;

export async function mockChatMessage(): Promise<ChatResponse> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return { reply: mockResponse };
}