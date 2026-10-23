import { CreateReportDto } from '../dtos/create-report.dto';

export function generateReportTemplate(
  dto: CreateReportDto,
  photoUrl: string,
): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Nuevo reporte de fuga de agua</title>
      </head>

      <body style="
        margin: 0;
        padding: 20px;
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
      ">

        <div style="
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 25px;
          border-radius: 8px;
        ">

          <h2 style="color: #1e5f9c; margin-top: 0;">
            Nuevo reporte de fuga de agua
          </h2>

          <p>
            Se ha registrado un nuevo reporte de fuga de agua en la vía pública.
          </p>

          <table style="
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          ">

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
                width: 35%;
              ">
                Dirección
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${dto.address}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Descripción
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${dto.description}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Severidad
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${dto.severity}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Teléfono de contacto
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${dto.reporterPhone}
              </td>
            </tr>

          </table>

          <div style="
            margin-top: 25px;
            text-align: center;
          ">
            <h3 style="color: #333; margin-bottom: 12px; font-size: 16px;">
              Foto de la fuga reportada
            </h3>
            <img
              src="${photoUrl}"
              alt="Foto de la fuga"
              style="
                max-width: 100%;
                max-height: 400px;
                height: auto;
                border-radius: 8px;
                border: 1px solid #ddd;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              "
            />
          </div>

          <p style="
            margin-top: 25px;
            color: #666;
            font-size: 13px;
          ">
            Este mensaje fue generado automáticamente por AguaFix.
          </p>

        </div>

      </body>
    </html>
  `;
}