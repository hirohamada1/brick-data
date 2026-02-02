create table if not exists user_investment_goals (
    id uuid primary key default gen_random_uuid(),

    target_cashflow_monthly_eur numeric,
    target_net_yield numeric,
    objective text not null check (objective in ('cashflow', 'yield', 'balanced')),
    down_payment_rate numeric,
    interest_rate numeric,
    amortization_rate numeric,
    buying_cost_rate numeric,
    tax_rate numeric,

    created_at timestamptz not null default now()
);
