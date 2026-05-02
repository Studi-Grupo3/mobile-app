import os
from datetime import datetime

import mysql.connector
import mysql.connector.errors
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq

load_dotenv()

app = FastAPI(title="Studi Insights Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------

def _get_connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "localhost"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        database=os.getenv("MYSQL_DATABASE", "db_studi"),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD", ""),
        charset="utf8mb4",
        connection_timeout=10,
    )


def _fetch_data() -> dict:
    conn = _get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # KPIs gerais
        cursor.execute(
            "SELECT metric_name, metric_value, metric_unit FROM dashboard_kpis"
        )
        kpis = cursor.fetchall()

        # Resumo agregado por matéria (para decisões de contratação)
        cursor.execute("""
            SELECT
                subject_name,
                COUNT(*)                              AS segments_count,
                ROUND(AVG(average_score), 2)          AS overall_avg,
                ROUND(AVG(low_performance_share_pct), 1) AS avg_low_perf_pct,
                SUM(schools_covered)                  AS total_schools
            FROM performance_by_subject_grade
            GROUP BY subject_name
            ORDER BY overall_avg ASC
        """)
        subject_summary = cursor.fetchall()

        # Resumo por ciclo escolar
        cursor.execute("""
            SELECT
                school_cycle,
                COUNT(*)                              AS segments,
                ROUND(AVG(average_score), 2)          AS avg_score,
                ROUND(AVG(low_performance_share_pct), 1) AS avg_low_perf
            FROM performance_by_subject_grade
            GROUP BY school_cycle
            ORDER BY avg_score ASC
        """)
        cycle_summary = cursor.fetchall()

        # Top 10 combinações matéria/série com pior desempenho
        cursor.execute("""
            SELECT
                subject_name, grade_label, school_cycle,
                ROUND(average_score, 2)              AS average_score,
                ROUND(low_performance_share_pct, 1)  AS low_perf_pct,
                schools_covered
            FROM performance_by_subject_grade
            ORDER BY average_score ASC
            LIMIT 10
        """)
        worst_segments = cursor.fetchall()

        # Top 15 escolas com maior índice de prioridade
        cursor.execute("""
            SELECT
                school_name, regional_office_label,
                ROUND(general_average_score, 2) AS avg_score,
                ROUND(priority_index, 1)         AS priority_index,
                priority_band, critical_segments_count,
                primary_attention_segment
            FROM school_opportunity_index
            ORDER BY priority_index DESC
            LIMIT 15
        """)
        top_schools = cursor.fetchall()

        return {
            "kpis": kpis,
            "subject_summary": subject_summary,
            "cycle_summary": cycle_summary,
            "worst_segments": worst_segments,
            "top_schools": top_schools,
        }
    finally:
        cursor.close()
        conn.close()


# ---------------------------------------------------------------------------
# Context builder
# ---------------------------------------------------------------------------

def _build_context(data: dict) -> str:
    now = datetime.now()
    lines = [
        f"Data: {now.strftime('%d/%m/%Y')} — Mês de referência: {now.strftime('%B de %Y')}",
        "",
        "=== INDICADORES GERAIS ===",
    ]

    for kpi in data["kpis"]:
        unit = kpi.get("metric_unit") or ""
        lines.append(f"• {kpi['metric_name']}: {kpi['metric_value']} {unit}".rstrip())

    lines += ["", "=== RESUMO POR MATÉRIA ==="]
    for row in data["subject_summary"]:
        lines.append(
            f"• {row['subject_name']}: média={row['overall_avg']}, "
            f"baixo desempenho={row['avg_low_perf_pct']}%, "
            f"escolas={row['total_schools']}"
        )

    lines += ["", "=== RESUMO POR CICLO ESCOLAR ==="]
    for row in data["cycle_summary"]:
        lines.append(
            f"• {row['school_cycle']}: média={row['avg_score']}, "
            f"baixo desempenho={row['avg_low_perf']}%, segmentos={row['segments']}"
        )

    lines += ["", "=== TOP 10 SEGMENTOS COM PIOR DESEMPENHO ==="]
    for row in data["worst_segments"]:
        lines.append(
            f"• {row['subject_name']} — {row['grade_label']} ({row['school_cycle']}): "
            f"média={row['average_score']}, "
            f"baixo desempenho={row['low_perf_pct']}%, "
            f"escolas={row['schools_covered']}"
        )

    lines += ["", "=== TOP 10 ESCOLAS COM MAIOR PRIORIDADE ==="]
    for row in data["top_schools"][:10]:
        lines.append(
            f"• {row['school_name']} ({row['regional_office_label']}): "
            f"prioridade={row['priority_index']}, banda={row['priority_band']}, "
            f"segmentos críticos={row['critical_segments_count']}, "
            f"foco={row['primary_attention_segment']}"
        )

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health")
def health():
    return {"status": "ok", "service": "studi-insights"}


@app.post("/insights")
async def generate_insights():
    # 1. Busca dados do banco
    try:
        data = _fetch_data()
    except mysql.connector.errors.DatabaseError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Erro ao conectar ao banco de dados: {exc}",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Erro ao buscar dados: {exc}",
        )

    # 2. Monta contexto
    context = _build_context(data)

    # 3. Chama Groq
    groq_key = os.getenv("GROQ_API_KEY")
    if not groq_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY não configurada no .env")

    client = Groq(api_key=groq_key)
    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Você é um consultor especialista em gestão de uma escola de reforço escolar no Brasil. "
                        "Com base em dados de proficiência de escolas públicas da rede, você identifica "
                        "oportunidades de negócio e orienta sobre contratação de professores e estratégia mensal. "
                        "Seja direto, prático e use formatação clara com seções e marcadores em português."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        "Com base nos dados de proficiência escolar abaixo, gere insights estratégicos "
                        "para o mês atual. Responda em português do Brasil com exatamente estas seções:\n\n"
                        "1. 📊 Visão Geral do Cenário\n"
                        "2. 👩‍🏫 Professores a Contratar (total estimado e quantidade por matéria)\n"
                        "3. 📚 Matérias e Séries Prioritárias\n"
                        "4. 🏫 Regiões com Maior Demanda\n"
                        "5. 🎯 Recomendações Estratégicas para o Mês\n\n"
                        f"DADOS:\n{context}"
                    ),
                },
            ],
            temperature=0.65,
            max_tokens=2000,
        )
        insights_text = completion.choices[0].message.content
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Erro ao chamar a API Groq: {exc}")

    return {
        "insights": insights_text,
        "generated_at": datetime.now().isoformat(),
    }


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    port = int(os.getenv("INSIGHTS_PORT", "5001"))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)
