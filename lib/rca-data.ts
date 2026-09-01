export type AgentStatus = 'idle' | 'running' | 'complete' | 'error';

export interface AgentDef {
  id: string;
  name: string;
  role: string;
  icon: string;
  reads: string[];
  produces: string;
  color: string;
}

export interface AgentResult {
  agentId: string;
  summary: string;
  findings: { label: string; value: string; severity?: 'info' | 'warning' | 'critical' }[];
  details: string;
}

export const agents: AgentDef[] = [
  {
    id: 'incident',
    name: 'Incident Agent',
    role: 'Parses the ticket and structures the problem',
    icon: 'FileText',
    reads: ['Jira ticket', 'Bug report', 'Incident description'],
    produces: 'Structured problem summary',
    color: 'chart-1',
  },
  {
    id: 'log',
    name: 'Log Analysis Agent',
    role: 'Scans train & test logs for anomalies',
    icon: 'ScrollText',
    reads: ['Train logs', 'Simulation logs', 'Test execution logs'],
    produces: 'Anomalies, error patterns, timestamps',
    color: 'chart-4',
  },
  {
    id: 'doc',
    name: 'Document Intelligence Agent',
    role: 'Hybrid RAG over requirements & architecture',
    icon: 'BookOpen',
    reads: ['Requirements PDF', 'Architecture docs', 'Specifications'],
    produces: 'Relevant requirement & architecture excerpts',
    color: 'chart-2',
  },
  {
    id: 'trace',
    name: 'Traceability Agent',
    role: 'Links requirements to components, tests, defects',
    icon: 'Link2',
    reads: ['Requirements', 'Work items (EWM)', 'Test cases', 'Source code refs'],
    produces: 'Requirement -> Component -> Test -> Defect chain',
    color: 'chart-5',
  },
  {
    id: 'history',
    name: 'Historical Case Agent',
    role: 'Finds similar past incidents and fixes',
    icon: 'History',
    reads: ['Previous incidents', 'Historical defects', 'Past fixes'],
    produces: 'Top-5 similar issues with similarity scores',
    color: 'chart-3',
  },
  {
    id: 'rootcause',
    name: 'Root Cause Agent',
    role: 'Fuses all evidence into a ranked root cause',
    icon: 'Target',
    reads: ['All agent outputs'],
    produces: 'Ranked root causes with confidence & evidence',
    color: 'primary',
  },
  {
    id: 'validation',
    name: 'Validation Agent',
    role: 'Checks for missing evidence & contradictions',
    icon: 'ShieldCheck',
    reads: ['Root cause proposal', 'All agent outputs'],
    produces: 'Gaps, contradictions, unsupported claims',
    color: 'success',
  },
];

export interface IncidentData {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  system: string;
  subsystem: string;
  reportedBy: string;
  reportedAt: string;
  status: string;
  description: string;
  environment: string;
  trainId: string;
  route: string;
}

export const incident: IncidentData = {
  id: 'INC-2026-0417',
  title: 'ATB braking command not issued during approach to red signal',
  severity: 'Critical',
  system: 'Automatic Train Protection (ATP)',
  subsystem: 'Automatic Brake Activation (ATB)',
  reportedBy: 'T. Moreau — Test Engineer',
  reportedAt: '2026-08-29T14:32:00Z',
  status: 'Under Investigation',
  description:
    'During regression test scenario S-ATP-014 (approach to red signal at 48 km/h), the ATB subsystem failed to issue the automatic braking command. The train overshot the balise target point by 32 meters before the driver applied emergency brakes manually. No rollback of the braking profile was observed. Issue appeared after the v4.2.1 firmware update package was deployed to the test train.',
  environment: 'Test Bench 3 — Lyon Saint-Exupéry',
  trainId: 'TGV-A-245',
  route: 'Lyon Part-Dieu → Saint-Exupéry (test loop)',
};

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  component: string;
  message: string;
  anomaly?: boolean;
}

export const logEntries: LogEntry[] = [
  { timestamp: '14:31:58.112', level: 'INFO', component: 'ATP_CORE', message: 'Scenario S-ATP-014 started — approach to red signal R-204' },
  { timestamp: '14:31:58.340', level: 'INFO', component: 'BALISE_READER', message: 'Balise BG-1124 detected, telegram group 3 parsed' },
  { timestamp: '14:31:58.520', level: 'INFO', component: 'SPEED_SENSOR', message: 'Current speed: 48.2 km/h, target: 0 km/h, distance: 412m' },
  { timestamp: '14:31:59.104', level: 'DEBUG', component: 'BRAKE_PROFILER', message: 'Computing braking curve — mode: SERVICE_BRAKE' },
  { timestamp: '14:31:59.210', level: 'WARN', component: 'BRAKE_PROFILER', message: 'Braking profile config v4.2.1: timeout threshold changed 3000ms -> 5000ms', anomaly: true },
  { timestamp: '14:31:59.530', level: 'DEBUG', component: 'ATB_CTRL', message: 'Awaiting braking command from profiler...' },
  { timestamp: '14:32:00.090', level: 'ERROR', component: 'ATB_CTRL', message: 'Braking command not received within expected window (3000ms elapsed)', anomaly: true },
  { timestamp: '14:32:01.420', level: 'ERROR', component: 'ATB_CTRL', message: 'Overspeed detected: 38.1 km/h at balise target point, expected 0 km/h', anomaly: true },
  { timestamp: '14:32:02.880', level: 'WARN', component: 'DRIVER_IF', message: 'Driver manually triggered emergency brake (EB-01)' },
  { timestamp: '14:32:03.150', level: 'INFO', component: 'BRAKE_PROFILER', message: 'Braking command issued (late) — mode: EMERGENCY_BRAKE' },
  { timestamp: '14:32:04.700', level: 'INFO', component: 'ATP_CORE', message: 'Train stopped — overshoot distance: 32.4m from target' },
  { timestamp: '14:32:05.210', level: 'ERROR', component: 'ATP_CORE', message: 'Scenario S-ATP-014 FAILED — safety violation detected', anomaly: true },
];

export interface AgentOutput {
  incident: AgentResult;
  log: AgentResult;
  doc: AgentResult;
  trace: AgentResult;
  history: AgentResult;
  rootcause: AgentResult;
  validation: AgentResult;
}

export const agentOutputs: AgentOutput = {
  incident: {
    agentId: 'incident',
    summary:
      'Safety-critical failure: ATB did not issue braking command during a red-signal approach. Overshoot of 32.4m. Regression introduced after firmware v4.2.1.',
    findings: [
      { label: 'Failure type', value: 'Missing braking command' },
      { label: 'Safety impact', value: 'Signal passed at danger (SPAD) risk', severity: 'critical' },
      { label: 'Test scenario', value: 'S-ATP-014' },
      { label: 'Introduced by', value: 'Firmware v4.2.1', severity: 'warning' },
    ],
    details:
      'The incident report describes a deterministic, reproducible failure: in scenario S-ATP-014 the ATB controller never sent the braking command within the required 3000ms window, causing a 32.4m overshoot. The issue is reproducible across 3 consecutive test runs and only appeared after the v4.2.1 firmware update.',
  },
  log: {
    agentId: 'log',
    summary:
      '3 anomalies detected. The braking profiler configuration was silently changed in v4.2.1, raising the command timeout from 3000ms to 5000ms. This exceeds the safety-mandated 3000ms ceiling.',
    findings: [
      { label: 'Anomaly 1', value: 'Timeout threshold changed 3000ms → 5000ms', severity: 'critical' },
      { label: 'Anomaly 2', value: 'Braking command issued 1150ms after deadline', severity: 'critical' },
      { label: 'Anomaly 3', value: 'No braking profile rollback observed', severity: 'warning' },
      { label: 'Error count', value: '4 ERROR, 2 WARN in 7 seconds' },
    ],
    details:
      'Log analysis isolated the failure window to 14:31:59–14:32:05. The BRAKE_PROFILER component logged a config change at 14:31:59.210 raising the timeout from 3000ms to 5000ms. The ATB_CTRL component then waited 3000ms (the old safe ceiling) before flagging the missing command, but the profiler did not respond until 4150ms — well past the point where the train overshot the target.',
  },
  doc: {
    agentId: 'doc',
    summary:
      'Requirement REQ-ATP-237 mandates a maximum braking command latency of 3000ms from balise detection. Architecture doc A-ATB-002 specifies the brake profiler as the sole owner of the timeout parameter.',
    findings: [
      { label: 'Relevant requirement', value: 'REQ-ATP-237 (max latency 3000ms)', severity: 'critical' },
      { label: 'Architecture owner', value: 'A-ATB-002 — Brake Profiler owns timeout' },
      { label: 'Safety standard', value: 'EN 50128 SIL 4' },
      { label: 'Config change process', value: 'Requires safety case + change board approval' },
    ],
    details:
      'The Document Intelligence agent retrieved REQ-ATP-237 from the requirements PDF and architecture section A-ATB-002. The requirement explicitly states: "The braking command shall be issued within 3000ms of balise target detection." Any change to the timeout parameter requires a formal safety case and change board approval per the configuration management plan.',
  },
  trace: {
    agentId: 'trace',
    summary:
      'Full traceability chain built: REQ-ATP-237 → BrakeProfiler.cpp → TC-ATP-094 → DEF-2026-0312. The failing component is owned by firmware commit a8f3c21.',
    findings: [
      { label: 'Requirement', value: 'REQ-ATP-237' },
      { label: 'Component', value: 'BrakeProfiler.cpp (timeout_config)' },
      { label: 'Test case', value: 'TC-ATP-094 (S-ATP-014)' },
      { label: 'Defect', value: 'DEF-2026-0312 (linked)' },
      { label: 'Work item', value: 'WI-4821 — v4.2.1 firmware update' },
      { label: 'Commit', value: 'a8f3c21 — "tune brake latency"' },
    ],
    details:
      'The traceability agent linked the requirement to the source file BrakeProfiler.cpp (function timeout_config), which is verified by test case TC-ATP-094 (the failing scenario). The change was introduced by work item WI-4821 under commit a8f3c21, which modified the default timeout from 3000 to 5000ms without an associated safety case reference.',
  },
  history: {
    agentId: 'history',
    summary:
      '4 similar historical incidents found. The closest match (87% similarity) is DEF-2025-0089, where a timeout parameter drift caused a late braking command on a different subsystem.',
    findings: [
      { label: 'Match 1', value: 'DEF-2025-0089 — 87% — timeout drift, late brake cmd' },
      { label: 'Match 2', value: 'DEF-2024-0331 — 79% — config change without safety case' },
      { label: 'Match 3', value: 'DEF-2025-0202 — 74% — profiler latency regression' },
      { label: 'Match 4', value: 'DEF-2024-0118 — 68% — SPAD near-miss, firmware rollout' },
    ],
    details:
      'The historical case agent retrieved the top similar incidents from the defect database. DEF-2025-0089 was resolved by reverting the timeout parameter and adding a runtime guard that rejects any timeout value above 3000ms. This fix pattern is directly applicable to the current incident.',
  },
  rootcause: {
    agentId: 'rootcause',
    summary:
      'Root cause: Firmware v4.2.1 (commit a8f3c21) silently increased the ATB braking command timeout from 3000ms to 5000ms, violating REQ-ATP-237 and exceeding the safety-mandated latency ceiling.',
    findings: [
      { label: 'Root cause', value: 'Timeout parameter raised to 5000ms in v4.2.1' },
      { label: 'Confidence', value: '86%' },
      { label: 'Violated requirement', value: 'REQ-ATP-237 (3000ms max)' },
      { label: 'Contributing factor', value: 'No safety case for config change' },
    ],
    details:
      'The root cause agent fused evidence from all five upstream agents. The log anomaly (timeout 3000→5000ms), the requirement (REQ-ATP-237 mandates 3000ms), the traceability chain (commit a8f3c21 changed BrakeProfiler.cpp), and the historical match (DEF-2025-0089, same failure mode, 87% similarity) all converge on a single root cause. Confidence is 86%, slightly reduced by one minor contradiction flagged by the validation agent.',
  },
  validation: {
    agentId: 'validation',
    summary:
      'Root cause hypothesis is well-supported. 1 minor contradiction and 2 evidence gaps identified. Human safety review required before any production fix.',
    findings: [
      { label: 'Contradiction', value: 'Commit message says "tune latency" — no safety intent documented', severity: 'warning' },
      { label: 'Gap 1', value: 'No test evidence that TC-ATP-094 was re-run before v4.2.1 release' },
      { label: 'Gap 2', value: 'Change board approval for WI-4821 not found in EWM' },
      { label: 'Verdict', value: 'Supported with conditions — human review required' },
    ],
    details:
      'The validation agent confirms the root cause is supported by convergent evidence across 4 independent agents. However, it flags that the commit message does not mention a safety-relevant change, and there is no evidence that the safety test case TC-ATP-094 was re-run as part of the v4.2.1 release gate. A human safety engineer must review and approve any fix before deployment.',
  },
};

export interface GraphNode {
  id: string;
  label: string;
  type: 'requirement' | 'component' | 'testcase' | 'defect' | 'workitem' | 'log' | 'rootcause';
  sublabel?: string;
  status?: 'pass' | 'fail' | 'neutral';
}

export interface GraphEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
}

export const graphNodes: GraphNode[] = [
  { id: 'req', label: 'REQ-ATP-237', type: 'requirement', sublabel: 'Max brake latency 3000ms', status: 'neutral' },
  { id: 'comp', label: 'BrakeProfiler.cpp', type: 'component', sublabel: 'timeout_config()', status: 'fail' },
  { id: 'tc', label: 'TC-ATP-094', type: 'testcase', sublabel: 'S-ATP-014', status: 'fail' },
  { id: 'defect', label: 'DEF-2026-0312', type: 'defect', sublabel: 'Late braking command', status: 'fail' },
  { id: 'wi', label: 'WI-4821', type: 'workitem', sublabel: 'v4.2.1 firmware update', status: 'neutral' },
  { id: 'log', label: 'LOG-ANOMALY', type: 'log', sublabel: 'Timeout 3000→5000ms', status: 'fail' },
  { id: 'rc', label: 'Root Cause', type: 'rootcause', sublabel: 'Timeout violation', status: 'fail' },
  { id: 'hist', label: 'DEF-2025-0089', type: 'defect', sublabel: 'Historical match (87%)', status: 'neutral' },
];

export const graphEdges: GraphEdge[] = [
  { from: 'req', to: 'comp', label: 'verified by' },
  { from: 'comp', to: 'tc', label: 'tested by' },
  { from: 'tc', to: 'defect', label: 'produced' },
  { from: 'wi', to: 'comp', label: 'modified (a8f3c21)' },
  { from: 'log', to: 'comp', label: 'anomaly in' },
  { from: 'comp', to: 'rc', label: 'evidence' },
  { from: 'defect', to: 'rc', label: 'evidence' },
  { from: 'req', to: 'rc', label: 'violated', dashed: true },
  { from: 'hist', to: 'rc', label: 'similar (87%)', dashed: true },
];

export interface SimHistoricalCase {
  id: string;
  title: string;
  similarity: number;
  subsystem: string;
  date: string;
  resolution: string;
}

export const similarCases: SimHistoricalCase[] = [
  { id: 'DEF-2025-0089', title: 'Timeout drift in door control — late open command', similarity: 87, subsystem: 'Door Control', date: '2025-11-03', resolution: 'Reverted timeout, added runtime guard' },
  { id: 'DEF-2024-0331', title: 'Config change without safety case — traction limiter', similarity: 79, subsystem: 'Traction', date: '2024-09-17', resolution: 'Enforced safety-case gate in CI' },
  { id: 'DEF-2025-0202', title: 'Profiler latency regression after tuning commit', similarity: 74, subsystem: 'Brake Profiler', date: '2025-06-22', resolution: 'Added latency regression test suite' },
  { id: 'DEF-2024-0118', title: 'SPAD near-miss after firmware rollout — ATB delay', similarity: 68, subsystem: 'ATB', date: '2024-04-08', resolution: 'Phased rollout + canary testing' },
];

export interface RecommendedFix {
  priority: number;
  action: string;
  rationale: string;
  owner: string;
  effort: string;
}

export const recommendedFixes: RecommendedFix[] = [
  {
    priority: 1,
    action: 'Revert the timeout parameter in BrakeProfiler.cpp from 5000ms back to 3000ms in an emergency hotfix (v4.2.2).',
    rationale: 'Immediate restoration of the safety-mandated 3000ms ceiling per REQ-ATP-237. Matches the proven resolution from DEF-2025-0089.',
    owner: 'Firmware Team',
    effort: '2 hours',
  },
  {
    priority: 2,
    action: 'Add a runtime assertion in ATB_CTRL that rejects any timeout value above 3000ms, logging a critical error if exceeded.',
    rationale: 'Defensive guard prevents future regressions of the same class. Prevents silent config drift from reaching the safety path.',
    owner: 'Safety Software Team',
    effort: '1 day',
  },
  {
    priority: 3,
    action: 'Add TC-ATP-094 to the mandatory pre-release regression gate for all firmware updates affecting the brake subsystem.',
    rationale: 'Closes the evidence gap identified by the validation agent — the test that would have caught this was not re-run before v4.2.1 shipped.',
    owner: 'Test Engineering',
    effort: '1 day',
  },
  {
    priority: 4,
    action: 'Enforce a change-board approval check in the EWM workflow for any work item tagged with safety-relevant components.',
    rationale: 'WI-4821 had no recorded safety case or change board approval. Process gate prevents unreviewed safety-relevant changes.',
    owner: 'Configuration Management',
    effort: '3 days',
  },
];

export const runTimeline: { agent: string; start: number; end: number }[] = [
  { agent: 'incident', start: 0, end: 1200 },
  { agent: 'log', start: 800, end: 2600 },
  { agent: 'doc', start: 1000, end: 3400 },
  { agent: 'trace', start: 2200, end: 4200 },
  { agent: 'history', start: 1800, end: 3600 },
  { agent: 'rootcause', start: 4200, end: 5400 },
  { agent: 'validation', start: 5400, end: 6200 },
];
