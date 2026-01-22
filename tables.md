profiles table schema (public)
Schema: public
Table: profiles
RLS: enabled
Rows: 3
Columns:

id — uuid (primary key)
email — text, nullable, unique
role — text, nullable, updatable, default 'teacher', check constraint: role ∈ {'teacher','admin'}
full_name — text, nullable
Foreign keys:

profiles.id → auth.users.id (profiles_id_fkey)
public.lesson_plans.user_id → public.profiles.id (fk_user_profile)

RLS policies on public.profiles

1- Policy name: "Enable insert for own profile"

Roles: authenticated
For: INSERT
USING (definition): null
WITH CHECK: ((SELECT auth.uid() AS uid) = id)
Notes: Allows authenticated users to insert a profile only when the inserted row's id matches their auth.uid().

2- Policy name: "Anon select combined"

Roles: authenticated
For: SELECT
USING (definition): (((SELECT (auth.jwt() ->> 'role')) = 'admin') OR (id = (SELECT auth.uid())))
Notes: Allows SELECT if the requester is an admin (via JWT role claim) or when the row id equals the current user's uid.

3- Policy name: "Authenticated update"

Roles: authenticated
For: UPDATE
USING (definition): (is_admin() OR (id = (SELECT auth.uid())))
WITH CHECK: (is_admin() OR (id = (SELECT auth.uid())))
Notes: Allows updates if the requester is admin (via is_admin() DB helper) or updating their own profile.
Additionally:

There's a foreign-key-backed admin check used by other policies (e.g., lesson_plans policies reference profiles.role = 'admin'), and the function is_admin() is used in update checks — so that function influences authorization.

----------------------------------------------------------------------------------------------

lesson_plans table schema (public)
Schema: public
Table: lesson_plans
RLS: enabled
Rows: 2
Columns:

id — uuid, updatable, default: extensions.uuid_generate_v4()
user_id — uuid, updatable (FK → public.profiles.id)
title — text, updatable
subject — text, nullable, updatable
grade_level — text, nullable, updatable
content — jsonb, nullable, updatable
created_at — timestamp with time zone, updatable, default now()
Primary key:

id
Foreign keys:

lesson_plans.user_id → public.profiles.id (fk_user_profile)


Here are the policies that apply to public.lesson_plans:

1- Policy name: "anon_delete_lesson_plans_consolidated"

Roles: public
For: DELETE
USING (definition): (((SELECT auth.uid() AS uid) = user_id) OR is_admin())
Notes: Allows deletes when the current user owns the lesson_plan (user_id = auth.uid()) or when is_admin() returns true.

2- Policy name: "Owner can insert lesson_plans"

Roles: authenticated
For: INSERT
USING (definition): null
WITH CHECK: ((SELECT auth.uid() AS uid) = user_id)
Notes: Authenticated users may insert lesson_plans only when the inserted row's user_id matches their auth.uid().

3- Policy name: "Owner or admin can update lesson_plans"

Roles: authenticated
For: UPDATE
USING (definition): (((SELECT auth.uid() AS uid) = user_id) OR (EXISTS (SELECT 1 FROM profiles WHERE ((profiles.id = (SELECT auth.uid() AS uid)) AND (profiles.role = 'admin')))))
WITH CHECK: same as USING
Notes: Allows updates by owner or by any user whose profile.role = 'admin'.

4- Policy name: "Owner or admin can view lesson_plans"

Roles: authenticated
For: SELECT
USING (definition): (((SELECT auth.uid() AS uid) = user_id) OR (EXISTS (SELECT 1 FROM profiles WHERE ((profiles.id = (SELECT auth.uid() AS uid)) AND (profiles.role = 'admin')))))
Notes: Allows reads by owner or admins.