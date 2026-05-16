export interface WATemplate {
  id: string;
  name: string;
  body: string;
  variables: string[];
}

// Variables available: nombre, comuna, tipoPropiedad, cuentaMensual,
//   ahorroEstimado, score, kitSugerido, valorProyecto, region
// Placeholders use {{variable}} syntax — filled at runtime by fillTemplate()

/* eslint-disable quotes */
const t1 = "Hola {{nombre}} 👋, soy de Solergy.\n\nVi tu interés en evaluar una solución solar para tu {{tipoPropiedad}} en {{comuna}}.\n\nMe gustaría contarte cómo podemos reducir tu cuenta de luz de forma real y sin sorpresas.\n\n¿Tienes unos minutos para conversar?";

const t2 = "Hola {{nombre}}, para hacer una evaluación más precisa de tu potencial de ahorro solar, ¿me podrías enviar una foto o PDF de tu última boleta eléctrica?\n\nCon eso podemos dimensionar mejor el sistema ideal para tu {{tipoPropiedad}} en {{comuna}}.\n\nGracias 🙏";

const t3 = "Hola {{nombre}}, te comparto un resumen preliminar de tu evaluación Solergy ☀️\n\n📍 {{tipoPropiedad}} — {{comuna}}\n💰 Ahorro estimado mensual: {{ahorroEstimado}}\n⚙️ Sistema sugerido: {{kitSugerido}}\n📊 Score comercial: {{score}}/100\n\nEstos valores son referenciales. ¿Te interesa avanzar con una evaluación técnica?";

const t4 = "Hola {{nombre}}, te envié una propuesta preliminar con los escenarios de ahorro para tu {{tipoPropiedad}} en {{comuna}}.\n\nEl valor estimado del proyecto es {{valorProyecto}} con un retorno esperado de 4 a 6 años.\n\nQuedo a tu disposición para cualquier consulta. 😊";

const t5 = "Hola {{nombre}}, entiendo que el anticipo puede generar dudas.\n\nEn Solergy, el anticipo cubre la reserva y compra de equipos (paneles, inversor, batería) y la planificación técnica de tu instalación.\n\nNo se cobra nada hasta que confirmamos juntos la instalación y el presupuesto final. ¿Te gustaría conversar sobre esto?";

const t6 = "Hola {{nombre}}, para avanzar con tu evaluación en {{comuna}}, podemos coordinar una visita técnica sin costo.\n\nEn la visita revisamos:\n✅ Orientación del techo\n✅ Espacio disponible\n✅ Consumo real\n✅ Factibilidad eléctrica\n\n¿Cuándo te acomodaría? 📅";

const t7 = "Hola {{nombre}}, si te parece bien, podemos avanzar con una evaluación técnica detallada para tu {{tipoPropiedad}} en {{comuna}}.\n\nSin compromiso, sin letra chica. Solo queremos que tomes la mejor decisión para tu energía. ☀️\n\n¿Te parece si coordinamos el siguiente paso?";
/* eslint-enable quotes */

export const WA_TEMPLATES: WATemplate[] = [
  {
    id: "primer-contacto",
    name: "Primer contacto",
    body: t1,
    variables: ["nombre", "tipoPropiedad", "comuna"],
  },
  {
    id: "solicitud-boleta",
    name: "Solicitar boleta eléctrica",
    body: t2,
    variables: ["nombre", "tipoPropiedad", "comuna"],
  },
  {
    id: "seguimiento-post-simulacion",
    name: "Seguimiento post simulación",
    body: t3,
    variables: ["nombre", "tipoPropiedad", "comuna", "ahorroEstimado", "kitSugerido", "score"],
  },
  {
    id: "propuesta-enviada",
    name: "Propuesta enviada",
    body: t4,
    variables: ["nombre", "tipoPropiedad", "comuna", "valorProyecto"],
  },
  {
    id: "explicacion-anticipo",
    name: "Explicación del anticipo",
    body: t5,
    variables: ["nombre"],
  },
  {
    id: "coordinacion-visita",
    name: "Coordinación visita técnica",
    body: t6,
    variables: ["nombre", "comuna"],
  },
  {
    id: "cierre-suave",
    name: "Cierre suave",
    body: t7,
    variables: ["nombre", "tipoPropiedad", "comuna"],
  },
];

export function fillTemplate(template: WATemplate, vars: Record<string, string>): string {
  return template.body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `[${key}]`);
}

export function normalizeChileanPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("56") && digits.length === 11) return digits;
  if (digits.startsWith("9") && digits.length === 9) return `56${digits}`;
  if (digits.length === 8) return `569${digits}`;
  return digits;
}
