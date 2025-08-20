SELECT id, username, email, full_name, hashed_password, "role", is_active, created_at, updated_at
FROM public.users;

SELECT username, role FROM users WHERE username='admin';

SELECT
  column_name,
  ordinal_position,
  column_default,
  is_nullable,
  data_type,
  character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'   -- adjust if your table lives in another schema
  AND table_name   = 'users'
ORDER BY ordinal_position;

SELECT
  a.attnum AS ord,
  a.attname AS column_name,
  pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
  NOT a.attnotnull      AS is_nullable,
  coalesce(pg_get_expr(d.adbin, d.adrelid), '') AS column_default
FROM pg_catalog.pg_attribute a
LEFT JOIN pg_catalog.pg_attrdef d
  ON a.attrelid = d.adrelid
 AND a.attnum   = d.adnum
WHERE a.attrelid = 'users'::regclass
  AND a.attnum > 0
  AND NOT a.attisdropped
ORDER BY a.attnum;

SELECT indexname, indexdef
FROM pg_catalog.pg_indexes
WHERE schemaname = 'public'
  AND tablename  = 'users';

-- Primary Key
SELECT
  tc.constraint_name,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name   = 'users'
  AND tc.constraint_type = 'PRIMARY KEY';

-- Foreign Keys
SELECT
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name   AS foreign_table,
  ccu.column_name  AS foreign_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name   = 'users'
  AND tc.constraint_type = 'FOREIGN KEY';



SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('users', 'user_sessions')
ORDER BY tablename, indexname;
