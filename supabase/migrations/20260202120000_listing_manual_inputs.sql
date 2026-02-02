create table if not exists listing_manual_inputs (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid not null references l1_listings (id) on delete cascade,

    hausgeld_monthly_eur numeric,
    expected_rent_cold_monthly_eur numeric,
    expected_rent_warm_monthly_eur numeric,
    maintenance_reserve_monthly_eur numeric,
    vacancy_rate numeric check (vacancy_rate >= 0 and vacancy_rate <= 1),
    capex_budget_eur numeric,

    is_estimated boolean not null default true,
    notes text,

    updated_at timestamptz not null default now(),
    user_id uuid
);

create index if not exists listing_manual_inputs_listing_id
    on listing_manual_inputs (listing_id);

create index if not exists listing_manual_inputs_updated_at
    on listing_manual_inputs (updated_at desc);

create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists trg_listing_manual_inputs_updated_at on listing_manual_inputs;

create trigger trg_listing_manual_inputs_updated_at
before update on listing_manual_inputs
for each row
execute function set_updated_at();
