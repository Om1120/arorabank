import React from 'react';
import { useSelector } from 'react-redux';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Target,
  Zap,
  Award,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { netWorthGrowthData, spendingCategoryData } from '../services/initialData';
import { formatCurrency } from '../services/transactionService';

const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '0.8rem',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>{label}</div>
        <div className="font-mono text-emerald fw-bold">
          Net Worth: {formatCurrency(payload[0].value)}
        </div>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '0.8rem',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>{label}</div>
        <div className="font-mono text-warning fw-bold mb-1">
          Actual Spent: {formatCurrency(payload[0]?.value || 0)}
        </div>
        <div className="font-mono text-white-50 small">
          Monthly Cap: {formatCurrency(payload[1]?.value || 0)}
        </div>
      </div>
    );
  }
  return null;
};

export const Analytics = () => {
  const accounts = useSelector(state => state.accounts.accounts);
  const totalNetWorth = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  // Budget data combining category spend and limit
  const categoryBudgetData = spendingCategoryData.map(cat => {
    let budgetCap = 20000;
    if (cat.name === 'Personal Transfers') budgetCap = 30000;
    if (cat.name === 'Travel & Commute') budgetCap = 30000;
    if (cat.name === 'Groceries') budgetCap = 18000;
    if (cat.name === 'Dining & Gourmet') budgetCap = 15000;
    if (cat.name === 'Utilities') budgetCap = 10000;

    return {
      category: cat.name.split(' ')[0],
      fullName: cat.name,
      spent: cat.value,
      budget: budgetCap
    };
  });

  return (
    <div className="analytics-content py-4 px-lg-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: 'var(--aurora-navy)', letterSpacing: '-0.02em' }}>
          Wealth Intelligence & Analytics
        </h2>
        <p className="text-secondary small mb-0">
          Algorithmic balance projections, compound yield diagnostics, and liquidity allocation.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="aurora-card p-3">
            <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem' }}>
              Consolidated Net Worth
            </span>
            <div className="font-mono fw-bold fs-4 text-dark my-1">
              {formatCurrency(totalNetWorth)}
            </div>
            <span className="badge-aurora-emerald py-0 px-2" style={{ fontSize: '0.68rem' }}>
              +35.1% 6-Month Trajectory
            </span>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="aurora-card p-3">
            <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem' }}>
              Savings Retention Rate
            </span>
            <div className="font-mono fw-bold fs-4 text-success my-1">
              58.2%
            </div>
            <div className="text-muted small">Target ceiling: 45.0%</div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="aurora-card p-3">
            <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem' }}>
              Annualized Yield Inflow
            </span>
            <div className="font-mono fw-bold fs-4 text-primary my-1">
              ₹55,856 / yr
            </div>
            <div className="text-muted small">High-Yield & Vault returns</div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="aurora-card p-3">
            <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem' }}>
              Financial Health Score
            </span>
            <div className="font-mono fw-bold fs-4 text-emerald my-1">
              96 / 100
            </div>
            <span className="badge-aurora-emerald py-0 px-2" style={{ fontSize: '0.68rem' }}>
              Tier 1 Prime Custody
            </span>
          </div>
        </div>
      </div>

      {/* 6-Month Wealth Growth Area Chart */}
      <div className="aurora-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1" style={{ color: 'var(--aurora-navy)' }}>
              Historical Net Worth & Growth Trend
            </h5>
            <p className="text-muted small mb-0">6-Month historical balance valuation (May - Oct 2026)</p>
          </div>
          <span className="badge-aurora-emerald">
            <TrendingUp size={13} className="me-1" />
            +₹3,93,920 Growth
          </span>
        </div>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={netWorthGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
              />
              <Tooltip content={<CustomAreaTooltip />} />
              <Area
                type="monotone"
                dataKey="netWorth"
                stroke="#059669"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorNetWorth)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Spending vs. Budget BarChart & AI Recommendations */}
      <div className="row g-4 mb-4">
        {/* Interactive BarChart */}
        <div className="col-lg-7">
          <div className="aurora-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: 'var(--aurora-navy)' }}>
                  Category Spending vs. Monthly Budget
                </h5>
                <p className="text-muted small mb-0">Comparative evaluation of actual outflows against set ceilings</p>
              </div>
              <span className="badge bg-light text-dark border">
                Current Cycle
              </span>
            </div>

            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBudgetData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '8px' }} />
                  <Bar dataKey="spent" name="Actual Spent" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="budget" name="Budget Limit" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Advisor Recommendations */}
        <div className="col-lg-5">
          <div className="aurora-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-3 bg-success-subtle text-success">
                <Sparkles size={20} />
              </div>
              <h5 className="fw-bold mb-0" style={{ color: 'var(--aurora-navy)' }}>
                Intelligent Allocation Insights
              </h5>
            </div>

            <div className="d-flex flex-column gap-3">
              <div className="p-3 rounded-3 bg-light border">
                <div className="d-flex justify-content-between mb-1">
                  <strong className="text-dark" style={{ fontSize: '0.875rem' }}>Excess Liquid Checking Balance</strong>
                  <span className="badge-aurora-gold py-0 px-2" style={{ fontSize: '0.65rem' }}>Opportunity</span>
                </div>
                <p className="text-muted small mb-2" style={{ lineHeight: 1.5 }}>
                  You hold ₹2,48,500 in Checking (0.0% yield). Transferring ₹1,00,000 into your High-Yield Reserve will generate an extra <strong>₹6,850/year</strong> in compound interest.
                </p>
                <Link to="/transfers" className="btn btn-sm btn-outline-success py-1 px-3 d-inline-flex align-items-center gap-1" style={{ fontSize: '0.785rem' }}>
                  <span>Rebalance Funds Now</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="p-3 rounded-3 bg-light border">
                <div className="d-flex justify-content-between mb-1">
                  <strong className="text-dark" style={{ fontSize: '0.875rem' }}>Fixed Deposit Vault Lock</strong>
                  <span className="badge-aurora-emerald py-0 px-2" style={{ fontSize: '0.65rem' }}>Accruing</span>
                </div>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.5 }}>
                  Term Vault (AUR-1102) is locked at guaranteed 7.40% interest until Nov 2027. Next interest credit scheduled for 28 Nov 2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wealth Milestones & Target Goals Tracker */}
      <div className="aurora-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-3 bg-primary-subtle text-primary">
              <Target size={20} />
            </div>
            <div>
              <h5 className="fw-bold mb-0" style={{ color: 'var(--aurora-navy)' }}>
                Financial Milestones & Capital Goals
              </h5>
              <p className="text-muted small mb-0">Track liquidity reserves and compound interest thresholds</p>
            </div>
          </div>
          <span className="badge-aurora-emerald">
            <Award size={13} className="me-1" />
            2 of 3 Milestones On Track
          </span>
        </div>

        <div className="row g-3">
          {/* Milestone 1 */}
          <div className="col-lg-4">
            <div className="p-3 rounded-3 border bg-light h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-circle bg-success text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <strong className="text-dark d-block" style={{ fontSize: '0.875rem' }}>Liquid Emergency Runway</strong>
                    <span className="text-muted small">6 Months Living Expenses</span>
                  </div>
                </div>
                <span className="badge bg-success py-1 px-2" style={{ fontSize: '0.68rem' }}>106%</span>
              </div>
              <div className="progress mb-2" style={{ height: '7px' }}>
                <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
              </div>
              <div className="d-flex justify-content-between small text-muted font-mono" style={{ fontSize: '0.75rem' }}>
                <span>Achieved: ₹10,63,920</span>
                <span>Target: ₹10,00,000</span>
              </div>
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="col-lg-4">
            <div className="p-3 rounded-3 border bg-light h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-circle bg-primary text-white">
                    <Zap size={16} />
                  </div>
                  <div>
                    <strong className="text-dark d-block" style={{ fontSize: '0.875rem' }}>Term Vault Accumulation</strong>
                    <span className="text-muted small">Fixed Interest Reserves</span>
                  </div>
                </div>
                <span className="badge bg-primary py-1 px-2" style={{ fontSize: '0.68rem' }}>84%</span>
              </div>
              <div className="progress mb-2" style={{ height: '7px' }}>
                <div className="progress-bar bg-primary" style={{ width: '84%' }}></div>
              </div>
              <div className="d-flex justify-content-between small text-muted font-mono" style={{ fontSize: '0.75rem' }}>
                <span>Achieved: ₹12,65,420</span>
                <span>Target: ₹15,00,000</span>
              </div>
            </div>
          </div>

          {/* Milestone 3 */}
          <div className="col-lg-4">
            <div className="p-3 rounded-3 border bg-light h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-circle bg-warning text-dark">
                    <ArrowUpRight size={16} />
                  </div>
                  <div>
                    <strong className="text-dark d-block" style={{ fontSize: '0.875rem' }}>Passive Yield Inflow Target</strong>
                    <span className="text-muted small">Annual Compounded Returns</span>
                  </div>
                </div>
                <span className="badge bg-warning text-dark py-1 px-2" style={{ fontSize: '0.68rem' }}>56%</span>
              </div>
              <div className="progress mb-2" style={{ height: '7px' }}>
                <div className="progress-bar bg-warning" style={{ width: '56%' }}></div>
              </div>
              <div className="d-flex justify-content-between small text-muted font-mono" style={{ fontSize: '0.75rem' }}>
                <span>Achieved: ₹55,856/yr</span>
                <span>Target: ₹1,00,000/yr</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
