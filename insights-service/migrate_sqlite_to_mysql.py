"""
Importa os dados processados do dashboard.db (SQLite) para o MySQL.
Execute uma vez para popular o banco antes de usar o serviço de insights.

Uso:
    python migrate_sqlite_to_mysql.py
"""

import os
import sqlite3
from pathlib import Path

import mysql.connector
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

SQLITE_PATH = Path(__file__).parent.parent / "mobile" / "etl-temp" / "etl-dados-estudantes" / "output" / "sqlite" / "dashboard.db"
SCHEMA_SQL  = Path(__file__).parent.parent / "mobile" / "etl-temp" / "etl-dados-estudantes" / "sql" / "create_tables_mysql.sql"

MYSQL_CONFIG = dict(
    host=os.getenv("MYSQL_HOST", "localhost"),
    port=int(os.getenv("MYSQL_PORT", "3306")),
    user=os.getenv("MYSQL_USER", "root"),
    password=os.getenv("MYSQL_PASSWORD", ""),
)
DB_NAME = os.getenv("MYSQL_DATABASE", "db_studi")

TABLES_TO_MIGRATE = [
    "dashboard_kpis",
    "performance_by_subject_grade",
    "school_opportunity_index",
    "fact_school_proficiency_clean",
    "dim_school",
    "performance_by_period",
    "network_region_benchmarks",
    "school_rankings_general",
]


def _split_statements(sql: str) -> list[str]:
    stmts, buf = [], []
    for line in sql.splitlines():
        s = line.strip()
        if not s or s.startswith("--"):
            continue
        buf.append(line)
        if s.endswith(";"):
            stmt = "\n".join(buf).strip().rstrip(";")
            if stmt and not stmt.upper().startswith(("CREATE DATABASE", "USE ")):
                stmts.append(stmt)
            buf = []
    return stmts


def ensure_schema(conn: mysql.connector.MySQLConnection) -> None:
    cursor = conn.cursor()
    for stmt in _split_statements(SCHEMA_SQL.read_text(encoding="utf-8")):
        cursor.execute(stmt)
    conn.commit()
    cursor.close()


def migrate_table(sqlite_conn: sqlite3.Connection, mysql_conn: mysql.connector.MySQLConnection, table: str) -> int:
    df = pd.read_sql_query(f'SELECT * FROM "{table}"', sqlite_conn)
    if df.empty:
        print(f"  {table}: vazia, pulando.")
        return 0

    cursor = mysql_conn.cursor()
    cols = ", ".join(f"`{c}`" for c in df.columns)
    placeholders = ", ".join(["%s"] * len(df.columns))
    cursor.execute(f"DELETE FROM `{table}`")

    rows = [
        tuple(None if (isinstance(v, float) and v != v) else v for v in row)
        for row in df.itertuples(index=False, name=None)
    ]
    cursor.executemany(f"INSERT INTO `{table}` ({cols}) VALUES ({placeholders})", rows)
    mysql_conn.commit()
    cursor.close()
    return len(rows)


def main() -> None:
    if not SQLITE_PATH.exists():
        raise SystemExit(f"SQLite nao encontrado: {SQLITE_PATH}")

    # Cria banco se necessário
    base_conn = mysql.connector.connect(**MYSQL_CONFIG)
    base_conn.cursor().execute(
        f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    )
    base_conn.commit()
    base_conn.close()

    mysql_conn = mysql.connector.connect(**MYSQL_CONFIG, database=DB_NAME)
    print("Criando schema MySQL...")
    ensure_schema(mysql_conn)

    sqlite_conn = sqlite3.connect(SQLITE_PATH)
    existing = {r[0] for r in sqlite_conn.execute("SELECT name FROM sqlite_master WHERE type='table'")}

    print(f"\nMigrando tabelas de: {SQLITE_PATH.name}")
    for table in TABLES_TO_MIGRATE:
        if table not in existing:
            print(f"  {table}: nao encontrada no SQLite, pulando.")
            continue
        count = migrate_table(sqlite_conn, mysql_conn, table)
        print(f"  {table}: {count} linhas inseridas.")

    sqlite_conn.close()
    mysql_conn.close()
    print("\nMigracao concluida!")


if __name__ == "__main__":
    main()
