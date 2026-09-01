# RailRCA Copilot AI Platform

## Overview

RailRCA Copilot is an AI-powered Multi-Agent Root Cause Analysis platform designed for railway engineering and safety-critical systems. The platform assists engineers, investigators, testers, and safety analysts in rapidly identifying the root causes of incidents, analyzing evidence, and generating actionable recommendations.

Traditional root cause analysis in railway systems requires engineers to manually inspect logs, requirements, architecture documents, test reports, and historical incidents. RailRCA Copilot automates much of this process by leveraging multiple specialized AI agents working collaboratively to investigate incidents and provide explainable results.

---

## Problem Statement

Railway incidents often involve multiple interconnected systems such as:

- Automatic Train Protection (ATP)
- Signaling Systems
- Trackside Equipment
- Embedded Controllers
- Communication Networks
- Safety Monitoring Systems

Investigating failures across these systems is time-consuming and requires significant domain expertise. RailRCA Copilot aims to reduce investigation time while improving accuracy and traceability.

---

## Key Features

### Multi-Agent Investigation Pipeline

The platform uses multiple AI agents, each specialized in a specific area:

- Log Analysis Agent
- Requirements Analysis Agent
- Architecture Analysis Agent
- Evidence Correlation Agent
- Historical Case Retrieval Agent
- Root Cause Synthesis Agent
- Recommendation Agent

These agents collaborate to produce a comprehensive investigation report.

### Incident Analysis

Users can upload:

- System logs
- Test reports
- Requirements documents
- Architecture documentation
- Safety specifications
- Incident reports

The platform automatically processes and correlates evidence across multiple sources.

### Knowledge Graph

The Knowledge Graph module enables:

- Relationship discovery
- Requirement traceability
- Dependency visualization
- Safety impact analysis
- Cause-effect mapping

### Historical Case Analysis

The system retrieves similar historical incidents and provides:

- Similarity scoring
- Previous resolutions
- Lessons learned
- Reusable mitigation strategies

### AI Recommendations

RailRCA generates:

- Root cause hypotheses
- Corrective actions
- Preventive measures
- Risk assessments
- Validation recommendations

---

## Example Incident

### Incident ID

INC-2026-0417

### Description

ATB braking command not issued during approach to a red signal.

### Investigation Findings

- Firmware update introduced timing regression.
- Safety command violated the 3000ms braking requirement.
- Communication delay caused missed braking trigger.
- Safety monitoring subsystem failed to raise alerts.

### Result

The platform identified the firmware timing issue as the primary root cause and recommended rollback, regression testing, and additional safety validation procedures.

---

## System Architecture

```text
Evidence Upload
       │
       ▼
Multi-Agent Pipeline
       │
 ┌─────┼─────┐
 │     │     │
 ▼     ▼     ▼
Logs Requirements Architecture
Agent   Agent      Agent

       ▼
Knowledge Graph

       ▼
Root Cause Synthesis

       ▼
Recommendations
```

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### AI Components

- Multi-Agent Architecture
- LangGraph Workflows
- Knowledge Graph Reasoning
- Retrieval-Augmented Analysis

### Development Tools

- Node.js
- GitHub
- Bolt.new

---

## Benefits

### Faster Investigations

Reduce root cause analysis time from hours to minutes.

### Improved Accuracy

Correlate evidence across multiple data sources and subsystems.

### Better Traceability

Track relationships between requirements, incidents, architecture components, and corrective actions.

### Knowledge Reuse

Leverage historical cases and organizational knowledge to improve future investigations.

---

## Future Enhancements

Planned improvements include:

- Real-time telemetry ingestion
- Predictive safety analytics
- Digital twin integration
- Advanced railway safety compliance checking
- Automated report generation
- Risk prediction models
- Large-scale incident knowledge bases

---

## Research Contribution

RailRCA serves as a practical demonstration of how Multi-Agent AI systems can support safety-critical engineering processes. The project combines concepts from:

- Software Engineering
- Artificial Intelligence
- Explainable AI
- Knowledge Graphs
- Railway Engineering
- Safety-Critical Systems

---

## Author

**Sri Charan Varanasi**

Master's Student in Software Engineering  
Blekinge Institute of Technology (BTH), Sweden

---

## License

This project is intended for research, educational, and demonstration purposes.
